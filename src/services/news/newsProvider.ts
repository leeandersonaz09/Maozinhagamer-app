import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const NEWS_CACHE_KEY = "cod_news_cache_v2";
const COD_BLOG_URL = "https://www.callofduty.com/br/pt/blog";
const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = "qwen-3-235b-a22b-instruct-2507";
const AI_PROVIDER_TIMEOUT_MS = 8000;
const FETCH_TIMEOUT_MS = 12000;
const MAX_ARTICLES_FOR_AI = 6;

const CEREBRAS_API_KEY =
  process.env.EXPO_PUBLIC_CEREBRAS_API_KEY ?? process.env.CEREBRAS_API_KEY ?? "";

const FALLBACK_IMAGE =
  "https://imgs.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/body/bo7/BO7-ACCESSIBILITY-TOUT.jpg";

const PT_MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const EN_MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

export type NewsCategory =
  | "BO7"
  | "WARZONE"
  | "CODM"
  | "TEMPORADA"
  | "PATCH"
  | "EVENTO"
  | "SEGURANCA"
  | "BUFF/NERF"
  | "SEASON";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: NewsCategory;
  link: string;
  bullets?: string[];
  impact?: string;
  source?: string;
  sourceUrl?: string;
};

type CodBlogArticle = {
  id: string;
  title: string;
  description: string;
  date: string;
  publishedAt?: string;
  image: string;
  category: NewsCategory;
  sourceUrl: string;
  excerpt: string;
};

type CerebrasChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

const COD_NEWS_AI_CONTEXT = `
Voce e o editor do Radar Maozinha, uma area de noticias de Call of Duty dentro de um app brasileiro.
Use somente as materias oficiais fornecidas do blog callofduty.com/br/pt/blog.
Seu objetivo e economizar tempo do jogador: resumir a novidade dentro do app, sem mandar abrir o site.
Priorize fatos praticos: temporada, patch, anti-cheat, Warzone, BO7, COD Mobile, mapa, evento, arma, modo e impacto no gameplay.
Nao invente informacoes, datas, nomes de armas, nerfs ou recompensas que nao estejam nas fontes.
Responda sempre em portugues do Brasil, com tom gamer direto e limpo.
Retorne apenas JSON valido.
`;

const getMonthPath = (date: Date) =>
  `/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/`;

const getMonthLabel = (date: Date) =>
  `${PT_MONTHS[date.getMonth()].toUpperCase()} ${date.getFullYear()}`;

const toAbsoluteUrl = (url: string) => {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  if (url.startsWith("http")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `https://www.callofduty.com${url}`;
  }

  return url;
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const cleanText = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/\s+/g, " ")
    .replace(/\s([,.!?;:])/g, "$1")
    .trim();

const stripHtmlToText = (html: string) =>
  cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );

const getMetaContent = (html: string, key: string) => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regexes = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapedKey}["'][^>]*>`,
      "i"
    ),
  ];

  for (const regex of regexes) {
    const match = html.match(regex);
    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  return "";
};

const parsePublishedDate = (text: string) => {
  const match = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b/i
  );

  if (!match) {
    return undefined;
  }

  const month = EN_MONTHS[match[1].toLowerCase()];
  const day = Number(match[2]);
  const year = Number(match[3]);

  if (Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year)) {
    return undefined;
  }

  return new Date(Date.UTC(year, month, day, 12));
};

const formatNewsDate = (date?: Date) => {
  if (!date) {
    return "Este mes";
  }

  return `${String(date.getUTCDate()).padStart(2, "0")} ${
    PT_MONTHS[date.getUTCMonth()]
  }`;
};

const hashId = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return `cod-${Math.abs(hash)}`;
};

const inferCategory = (title: string, text: string): NewsCategory => {
  const content = `${title} ${text}`.toLowerCase();

  if (content.includes("ricochet") || content.includes("anti-cheat")) {
    return "SEGURANCA";
  }

  if (
    content.includes("patch") ||
    content.includes("buff") ||
    content.includes("nerf") ||
    content.includes("weapon balancing")
  ) {
    return "PATCH";
  }

  if (content.includes("warzone") || content.includes("verdansk")) {
    return "WARZONE";
  }

  if (content.includes("mobile")) {
    return "CODM";
  }

  if (content.includes("temporada") || content.includes("season")) {
    return "TEMPORADA";
  }

  if (content.includes("black ops 7") || content.includes("bo7")) {
    return "BO7";
  }

  return "EVENTO";
};

const fetchText = async (url: string, timeoutMs = FETCH_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} while fetching ${url}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
};

const extractCurrentMonthArticleUrls = (html: string, currentDate: Date) => {
  const currentMonthPath = getMonthPath(currentDate);
  const matches = html.matchAll(/href=["']([^"']*\/br\/pt\/blog\/[^"']+)["']/gi);
  const urls = Array.from(matches)
    .map((match) => toAbsoluteUrl(match[1]))
    .filter((url) => url.includes(currentMonthPath))
    .filter((url) => /\/br\/pt\/blog\/\d{4}\/\d{2}\//.test(url));

  return Array.from(new Set(urls)).slice(0, 12);
};

const extractArticle = async (sourceUrl: string): Promise<CodBlogArticle | null> => {
  const html = await fetchText(sourceUrl);
  const pageText = stripHtmlToText(html);
  const title =
    getMetaContent(html, "og:title") ||
    cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const description = getMetaContent(html, "og:description");
  const image = toAbsoluteUrl(getMetaContent(html, "og:image") || FALLBACK_IMAGE);
  const publishedDate = parsePublishedDate(pageText);
  const titleIndex = title ? pageText.indexOf(title) : -1;
  const articleText =
    titleIndex >= 0 ? pageText.slice(titleIndex + title.length) : pageText;
  const excerpt = cleanText(articleText).slice(0, 2200);

  if (!title || excerpt.length < 80) {
    return null;
  }

  return {
    id: hashId(sourceUrl),
    title,
    description,
    date: formatNewsDate(publishedDate),
    publishedAt: publishedDate?.toISOString(),
    image,
    category: inferCategory(title, `${description} ${excerpt}`),
    sourceUrl,
    excerpt,
  };
};

const isFromCurrentMonth = (article: CodBlogArticle, currentDate: Date) => {
  if (article.publishedAt) {
    const date = new Date(article.publishedAt);
    return (
      date.getUTCFullYear() === currentDate.getFullYear() &&
      date.getUTCMonth() === currentDate.getMonth()
    );
  }

  return article.sourceUrl.includes(getMonthPath(currentDate));
};

const loadCallOfDutyMonthArticles = async (currentDate: Date) => {
  const blogHtml = await fetchText(COD_BLOG_URL);
  const articleUrls = extractCurrentMonthArticleUrls(blogHtml, currentDate);

  if (articleUrls.length === 0) {
    throw new Error("Nenhuma materia do mes encontrada no blog oficial.");
  }

  const settledArticles = await Promise.all(
    articleUrls.map((url) =>
      extractArticle(url).catch((error) => {
        console.warn(`Failed to parse CoD article ${url}:`, error);
        return null;
      })
    )
  );

  const articles = settledArticles
    .filter((article): article is CodBlogArticle => Boolean(article))
    .filter((article) => isFromCurrentMonth(article, currentDate))
    .slice(0, MAX_ARTICLES_FOR_AI);

  if (articles.length === 0) {
    throw new Error("As materias encontradas nao pertencem ao mes atual.");
  }

  return articles;
};

const parseNewsJson = (text: string): NewsItem[] => {
  const withoutFence = text.replace(/```json|```/gi, "").trim();
  const jsonMatch = withoutFence.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    throw new Error("AI response did not include a JSON array");
  }

  return JSON.parse(jsonMatch[0]) as NewsItem[];
};

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
            content: COD_NEWS_AI_CONTEXT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: 2200,
        temperature: 0.2,
        top_p: 1,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `Cerebras API failed with ${response.status}: ${errorBody.slice(0, 240)}`
      );
    }

    const data = (await response.json()) as CerebrasChatCompletionResponse;
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Cerebras returned an empty response");
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

  const result = await geminiModel.generateContent(`${COD_NEWS_AI_CONTEXT}\n${prompt}`);
  return result.response.text();
};

const generateNewsWithFallback = async (prompt: string): Promise<NewsItem[]> => {
  try {
    const cerebrasText = await callCerebras(prompt);
    return parseNewsJson(cerebrasText);
  } catch (cerebrasError) {
    console.warn("Cerebras News Provider fallback:", cerebrasError);
    const geminiText = await callGemini(prompt);
    return parseNewsJson(geminiText);
  }
};

const buildPrompt = (articles: CodBlogArticle[], currentDate: Date) => `
Mes alvo: ${getMonthLabel(currentDate)}

Crie um resumo para cada materia abaixo.
Regras de saida:
- Retorne exatamente um array JSON valido, sem markdown.
- Preserve id, image, link e sourceUrl de cada fonte.
- O campo "summary" deve ter 2 frases curtas, explicando a novidade e por que importa.
- O campo "bullets" deve ter 2 ou 3 itens curtos.
- O campo "impact" deve ter uma frase pratica para o jogador.
- "category" deve ser uma destas: BO7, WARZONE, CODM, TEMPORADA, PATCH, EVENTO, SEGURANCA.
- Nao direcione o usuario para abrir o site; resuma o conteudo aqui.

Formato:
[
  {
    "id": "cod-123",
    "title": "titulo em portugues",
    "summary": "duas frases curtas",
    "date": "09 abr",
    "image": "https://...",
    "category": "BO7",
    "link": "https://www.callofduty.com/...",
    "sourceUrl": "https://www.callofduty.com/...",
    "source": "Call of Duty Blog",
    "bullets": ["item", "item"],
    "impact": "impacto pratico"
  }
]

Materias oficiais:
${JSON.stringify(
  articles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    date: article.date,
    publishedAt: article.publishedAt,
    image: article.image,
    category: article.category,
    link: article.sourceUrl,
    sourceUrl: article.sourceUrl,
    excerpt: article.excerpt,
  })),
  null,
  2
)}
`;

const sentenceFrom = (text: string) => {
  const cleaned = cleanText(text);
  const sentence = cleaned.match(/(.{40,220}?[.!?])\s/)?.[1] ?? cleaned.slice(0, 180);
  return sentence.trim();
};

const buildLocalFallback = (articles: CodBlogArticle[]): NewsItem[] =>
  articles.map((article) => {
    const firstSentence = sentenceFrom(article.description || article.excerpt);
    const secondSentence = sentenceFrom(article.excerpt.slice(180));

    return {
      id: article.id,
      title: article.title,
      summary: cleanText(`${firstSentence} ${secondSentence}`).slice(0, 360),
      date: article.date,
      image: article.image || FALLBACK_IMAGE,
      category: article.category,
      link: article.sourceUrl,
      sourceUrl: article.sourceUrl,
      source: "Call of Duty Blog",
      bullets: [
        article.description || "Materia oficial do blog Call of Duty.",
        "Resumo gerado a partir do conteudo publicado no site oficial.",
      ].map((bullet) => cleanText(bullet).slice(0, 130)),
      impact:
        "Confira os pontos principais no resumo do app antes de entrar na partida.",
    };
  });

const findSourceArticle = (item: NewsItem, articles: CodBlogArticle[]) =>
  articles.find(
    (article) =>
      article.id === item.id ||
      article.sourceUrl === item.link ||
      article.sourceUrl === item.sourceUrl
  );

const normalizeNews = (news: NewsItem[], articles: CodBlogArticle[]) =>
  news
    .map((item) => {
      const sourceArticle = findSourceArticle(item, articles);

      return {
        ...item,
        id: item.id || sourceArticle?.id || hashId(item.link || item.title),
        title: cleanText(item.title || sourceArticle?.title || "Noticia Call of Duty"),
        summary: cleanText(item.summary || sourceArticle?.description || ""),
        date: item.date || sourceArticle?.date || "Este mes",
        image: toAbsoluteUrl(item.image || sourceArticle?.image || FALLBACK_IMAGE),
        category: item.category || sourceArticle?.category || "EVENTO",
        link: item.link || sourceArticle?.sourceUrl || COD_BLOG_URL,
        sourceUrl: item.sourceUrl || item.link || sourceArticle?.sourceUrl || COD_BLOG_URL,
        source: item.source || "Call of Duty Blog",
        bullets: Array.isArray(item.bullets)
          ? item.bullets.map((bullet) => cleanText(String(bullet))).filter(Boolean).slice(0, 3)
          : undefined,
        impact: item.impact ? cleanText(item.impact) : undefined,
      };
    })
    .filter((item) => item.summary && item.image)
    .filter(
      (item, index, allItems) =>
        allItems.findIndex((candidate) => candidate.id === item.id) === index
    );

/**
 * Busca o blog oficial do Call of Duty, filtra materias do mes atual e usa
 * Cerebras com fallback para Gemini para criar resumos consumiveis dentro do app.
 */
export const fetchLatestCoDNews = async (
  forceRefresh = false
): Promise<NewsItem[]> => {
  try {
    if (!forceRefresh) {
      const cached = await AsyncStorage.getItem(NEWS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as {
          timestamp?: number;
          data?: NewsItem[];
        };

        if (
          parsed.timestamp &&
          parsed.data &&
          Date.now() - parsed.timestamp < 1000 * 60 * 60 * 6
        ) {
          return parsed.data;
        }
      }
    }

    const currentDate = new Date();
    const articles = await loadCallOfDutyMonthArticles(currentDate);
    const prompt = buildPrompt(articles, currentDate);

    let news: NewsItem[];
    try {
      news = await generateNewsWithFallback(prompt);
    } catch (aiError) {
      console.warn("All AI providers failed, using local CoD summary:", aiError);
      news = buildLocalFallback(articles);
    }

    const normalizedNews = normalizeNews(news, articles);

    await AsyncStorage.setItem(
      NEWS_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data: normalizedNews,
      })
    );

    return normalizedNews;
  } catch (error) {
    console.error("News Provider Error:", error);
    return [];
  }
};
