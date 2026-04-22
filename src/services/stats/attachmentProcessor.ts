import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY ?? "";
const CEREBRAS_API_KEY =
  process.env.EXPO_PUBLIC_CEREBRAS_API_KEY ?? process.env.CEREBRAS_API_KEY ?? "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = "qwen-3-235b-a22b-instruct-2507";
const AI_PROVIDER_TIMEOUT_MS = 8000;
const STATS_CACHE_PREFIX = "weapon_stats_v2_";

export type WeaponStats = {
  recoil: number;
  ads: number;
  mobility: number;
  range: number;
};

type CerebrasChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

const STATS_SYSTEM_PROMPT = `
Voce e um analista de loadouts de Call of Duty Warzone.
Estime metricas finais de uma arma com base nos acessorios fornecidos.
Use apenas conhecimento geral de impacto de attachments, sem inventar dados especificos inexistentes.
Responda somente JSON valido no formato:
{"recoil": number, "ads": number, "mobility": number, "range": number}
Cada numero deve ser inteiro de 0 a 100.
`;

const clampStat = (value: unknown) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 50;
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)));
};

const normalizeStats = (stats: Partial<WeaponStats>): WeaponStats => ({
  recoil: clampStat(stats.recoil),
  ads: clampStat(stats.ads),
  mobility: clampStat(stats.mobility),
  range: clampStat(stats.range),
});

const parseStatsJson = (text: string): WeaponStats => {
  const withoutFence = text.replace(/```json|```/gi, "").trim();
  const jsonMatch = withoutFence.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("AI response did not include a JSON object");
  }

  return normalizeStats(JSON.parse(jsonMatch[0]) as Partial<WeaponStats>);
};

/**
 * Heuristic fallback (Pre-Motor) to estimate stats based on keywords.
 */
const estimateStatsHeuristically = (
  weapon: string,
  attachments: string[]
): WeaponStats => {
  let recoil = 50;
  let ads = 50;
  let mobility = 50;
  let range = 50;

  const attString = `${weapon} ${attachments.join(" ")}`.toLowerCase();

  if (
    attString.includes("muzzle") ||
    attString.includes("brake") ||
    attString.includes("compensator")
  ) {
    recoil += 15;
  }

  if (attString.includes("barrel") || attString.includes("long")) {
    range += 20;
    ads -= 10;
  }

  if (attString.includes("laser") || attString.includes("rear grip")) {
    ads += 15;
  }

  if (
    attString.includes("stock") &&
    (attString.includes("no stock") || attString.includes("collapsed"))
  ) {
    mobility += 20;
    recoil -= 15;
  }

  if (attString.includes("suppressor")) {
    range += 5;
    recoil += 5;
  }

  return normalizeStats({
    ads,
    mobility,
    range,
    recoil,
  });
};

const buildStatsPrompt = (weapon: string, attachmentNames: string[]) => `
Weapon: ${weapon}
Attachments: ${attachmentNames.join(", ")}

Estimate the final performance stats for this build on a 0 to 100 scale.
Consider how these attachments usually impact:
- recoil control / stability
- ADS speed
- mobility
- damage range

Return only:
{"recoil": number, "ads": number, "mobility": number, "range": number}
`;

const callCerebras = async (prompt: string): Promise<string> => {
  if (!CEREBRAS_API_KEY) {
    throw new Error("Cerebras API key is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(CEREBRAS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: CEREBRAS_MODEL,
        messages: [
          {
            role: "system",
            content: STATS_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: 600,
        temperature: 0.15,
        top_p: 1,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `Cerebras stats failed with ${response.status}: ${errorBody.slice(0, 180)}`
      );
    }

    const data = (await response.json()) as CerebrasChatCompletionResponse;
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Cerebras returned an empty stats response");
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
};

const callGemini = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  const result = await geminiModel.generateContent(
    `${STATS_SYSTEM_PROMPT}\n${prompt}`
  );
  return result.response.text();
};

const generateStatsWithFallback = async (prompt: string): Promise<WeaponStats> => {
  try {
    const cerebrasText = await callCerebras(prompt);
    return parseStatsJson(cerebrasText);
  } catch (cerebrasError) {
    console.warn("Cerebras Stats fallback:", cerebrasError);
    const geminiText = await callGemini(prompt);
    return parseStatsJson(geminiText);
  }
};

export const getWeaponStats = async (
  weapon: string,
  attachments: { name: string; slot: string }[]
): Promise<WeaponStats> => {
  const attachmentNames = attachments.map((attachment) => attachment.name);
  const cacheKey = `${STATS_CACHE_PREFIX}${weapon}_${[...attachmentNames]
    .sort()
    .join("_")}`;

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return normalizeStats(JSON.parse(cached) as Partial<WeaponStats>);
    }

    const prompt = buildStatsPrompt(weapon, attachmentNames);
    const stats = await generateStatsWithFallback(prompt);

    await AsyncStorage.setItem(cacheKey, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error("AI Stats Error:", error);
    return estimateStatsHeuristically(weapon, attachmentNames);
  }
};
