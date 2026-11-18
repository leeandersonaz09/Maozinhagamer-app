import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../utils/firebaseConfig";

export type ApiLoadoutAttachment = {
  name: string;
  slot: string;
};

export type ApiLoadoutItem = {
  slug: string;
  url: string;
  weapon: string;
  category: string;
  weapon_type: string;
  game_mode: string;
  author: string | null;
  updated_at: string | null;
  loadout_code: string | null;
  thumbnail_url: string | null;
  detail_image_url: string | null;
  attachments: ApiLoadoutAttachment[];
  tier?: string;
};

export type ApiLoadoutsResponse = {
  source: string;
  scraped_at: string;
  page_updated: string | null;
  total: number;
  items: ApiLoadoutItem[];
};

export const LOADOUTS_API_BASE_URL = "https://wzhub.gg";

const WZHUB_LOADOUTS_URL = `${LOADOUTS_API_BASE_URL}/pt/loadouts`;
const WZHUB_BO6_LOADOUTS_URL = `${LOADOUTS_API_BASE_URL}/pt/bo6-loadouts`;
const MAOZINHA_LOADOUTS_COLLECTION =
  "widgets/kEBNJTLGhZgkGfpFcrVh/sub_widgets/8WIiU6sFEOXePatrsTM1/loadouts";

const FETCH_TIMEOUT_MS = 10_000;
const FIRESTORE_TIMEOUT_MS = 8_000;

const WZHUB_REQUEST_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

type TierKey = "pure_meta" | "meta" | "acceptable" | "new" | "unrated";

type TierConfig = {
  key: TierKey;
  tier: string;
  category: string;
  priority: number;
};

const WZHUB_TIERS: readonly TierConfig[] = [
  { key: "pure_meta", tier: "absolute_meta", category: "Meta Absoluta", priority: 1 },
  { key: "meta", tier: "meta", category: "Meta", priority: 2 },
  { key: "acceptable", tier: "acceptable", category: "Aceitavel", priority: 3 },
  { key: "new", tier: "new", category: "Novo", priority: 4 },
  { key: "unrated", tier: "unrated", category: "Sem classificacao", priority: 5 },
];

const TIER_BY_RAW_KEY: Record<string, TierConfig> = Object.fromEntries(
  WZHUB_TIERS.map((entry) => [entry.key, entry])
);

const TIER_PRIORITY: Record<string, number> = {
  maozinha: 0,
  absolute_meta: 1,
  meta: 2,
  acceptable: 3,
  new: 4,
  unrated: 5,
};

export type LoadoutQueryParams = {
  search?: string;
  category?: string | null;
  weaponType?: string | null;
  refresh?: boolean;
};

export type FirestoreMaozinhaDoc = {
  id?: string;
  name?: string;
  weaponType?: string;
  img?: string | null;
  accessories?: unknown;
  order?: number;
};

type NuxtAttachment = {
  name?: string | null;
  category_name?: string | null;
};

type NuxtRange = {
  id?: number | string;
  range?: string | null;
  range_name?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  author?: string | null;
  code?: string | null;
  mode_name?: string | null;
  updated_at?: number | null;
  attachments?: NuxtAttachment[] | null;
};

type NuxtGun = {
  slug?: string;
  name?: string;
  type?: string;
  game?: string;
  game_full_name?: string;
  ranges?: NuxtRange[] | null;
};

type NuxtSelectRange = {
  short_name?: string;
  name?: string;
  id?: number[];
};

type NuxtBetaPage = {
  items?: Partial<Record<TierKey, NuxtGun[]>>;
  lastUpdated?: number | null;
  selects?: {
    gunTypes?: string[];
    ranges?: NuxtSelectRange[];
  };
};

type NuxtPayload = {
  data?: {
    betaPage?: NuxtBetaPage;
  }[];
};

export type ParsedWzhubExtraMeta = {
  id: string;
  game: string;
  gameFullName: string | null;
  updatedAtUnix: number | null;
};

export type ParsedWzhubPage = {
  items: ApiLoadoutItem[];
  extraMetaBySlug: Record<string, ParsedWzhubExtraMeta>;
  lastUpdatedUnix: number | null;
  pageUpdated: string | null;
  selects: {
    gunTypes: string[];
    ranges: NuxtSelectRange[];
  };
  usedFallback: boolean;
};

export const buildLoadoutsUrl = (params: LoadoutQueryParams = {}) => {
  const qs = new URLSearchParams();

  if (params.search?.trim()) {
    qs.set("search", params.search.trim());
  }

  if (params.category?.trim()) {
    qs.set("category", params.category.trim());
  }

  if (params.weaponType?.trim()) {
    qs.set("weapon_type", params.weaponType.trim());
  }

  if (params.refresh) {
    qs.set("refresh", "true");
  }

  const queryString = qs.toString();
  return `${WZHUB_LOADOUTS_URL}${queryString ? `?${queryString}` : ""}`;
};

export const getLoadoutsCacheKey = (params: LoadoutQueryParams = {}) =>
  `loadouts_v3:${JSON.stringify({
    search: params.search?.trim() ?? "",
    category: params.category ?? "",
    weaponType: params.weaponType ?? "",
  })}`;

const normalizeComparableText = (value?: string | null) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const stripHtmlTags = (value?: string | null) =>
  String(value ?? "").replace(/<[^>]*>/g, " ");

const decodeHtmlEntities = (value?: string | null) =>
  String(value ?? "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanHtmlText = (value?: string | null) =>
  decodeHtmlEntities(stripHtmlTags(value));

const slugify = (value: string) =>
  normalizeComparableText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatUnixDate = (unixSeconds?: number | null): string | null => {
  if (typeof unixSeconds !== "number" || !Number.isFinite(unixSeconds) || unixSeconds <= 0) {
    return null;
  }

  const date = new Date(unixSeconds * 1000);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const normalizeImageUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `${LOADOUTS_API_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

const inferGameFromSlug = (slug: string, fallback = "wz") => {
  if (slug.startsWith("mw4-")) return "mw4";
  if (slug.startsWith("bo7-")) return "bo7";
  if (slug.startsWith("bo6-")) return "bo6";
  return fallback;
};

const parseFromNuxtPayload = (
  html: string
): Omit<ParsedWzhubPage, "usedFallback"> | null => {
  const nuxtMatch = html.match(
    /window\.__NUXT__\s*=\s*([\s\S]*?);?\s*<\/script>/i
  );
  if (!nuxtMatch?.[1]) {
    return null;
  }

  try {
    const expr = nuxtMatch[1].trim().replace(/;+$/, "");
    const nuxt = new Function(`return ${expr}`)() as NuxtPayload;
    const betaPage = nuxt?.data?.[0]?.betaPage;
    const rawItems = betaPage?.items;

    if (!rawItems || typeof rawItems !== "object") {
      return null;
    }

    const lastUpdatedUnix =
      typeof betaPage?.lastUpdated === "number" ? betaPage.lastUpdated : null;
    const pageUpdated = formatUnixDate(lastUpdatedUnix);

    const items: ApiLoadoutItem[] = [];
    const extraMetaBySlug: Record<string, ParsedWzhubExtraMeta> = {};
    const seenSlugs = new Set<string>();

    for (const tierConfig of WZHUB_TIERS) {
      const guns = rawItems[tierConfig.key];
      if (!Array.isArray(guns)) {
        continue;
      }

      for (const gun of guns) {
        const gunSlug = String(gun?.slug || "").trim();
        const gunName = String(gun?.name || "").trim();
        if (!gunSlug || !gunName) {
          continue;
        }

        const ranges = Array.isArray(gun.ranges) ? gun.ranges : [];
        if (ranges.length === 0) {
          continue;
        }

        ranges.forEach((range, rangeIndex) => {
          const rangeKey = String(range?.range || range?.id || rangeIndex).trim();
          let itemSlug =
            rangeIndex === 0 ? gunSlug : `${gunSlug}-${rangeKey}`;

          if (seenSlugs.has(itemSlug)) {
            const disambiguator = range?.id ? String(range.id) : String(rangeIndex);
            itemSlug = `${gunSlug}-${rangeKey}-${disambiguator}`;
          }
          seenSlugs.add(itemSlug);

          const modeBase = String(
            range?.mode_name || gun.game_full_name || "Warzone"
          ).trim();
          const rangeName = String(range?.range_name || "").trim();
          const gameMode = rangeName ? `${modeBase} • ${rangeName}` : modeBase;

          const updatedUnix =
            typeof range?.updated_at === "number"
              ? range.updated_at
              : lastUpdatedUnix;

          const thumbnailUrl = normalizeImageUrl(
            range?.thumbnail || range?.image
          );
          const detailImageUrl = normalizeImageUrl(
            range?.image || range?.thumbnail
          );

          const attachments: ApiLoadoutAttachment[] = (
            Array.isArray(range?.attachments) ? range.attachments : []
          )
            .map((att) => ({
              slot: String(att?.category_name || "Acessório").trim() || "Acessório",
              name: String(att?.name || "").trim(),
            }))
            .filter((att) => att.name.length > 0);

          items.push({
            slug: itemSlug,
            url: `${WZHUB_LOADOUTS_URL}/${gunSlug}`,
            weapon: gunName,
            category: tierConfig.category,
            tier: tierConfig.tier,
            weapon_type: String(gun.type || "WPN").trim() || "WPN",
            game_mode: gameMode,
            author: range?.author ? String(range.author).trim() : "WZHUB",
            updated_at: formatUnixDate(updatedUnix),
            loadout_code: range?.code ? String(range.code).trim() : null,
            thumbnail_url: thumbnailUrl,
            detail_image_url: detailImageUrl,
            attachments,
          });

          extraMetaBySlug[itemSlug] = {
            id: range?.id ? String(range.id) : itemSlug,
            game: String(gun.game || inferGameFromSlug(gunSlug)),
            gameFullName: gun.game_full_name ? String(gun.game_full_name) : null,
            updatedAtUnix: updatedUnix ?? null,
          };
        });
      }
    }

    if (items.length === 0) {
      return null;
    }

    return {
      items,
      extraMetaBySlug,
      lastUpdatedUnix,
      pageUpdated,
      selects: {
        gunTypes: Array.isArray(betaPage?.selects?.gunTypes)
          ? betaPage.selects.gunTypes
          : [],
        ranges: Array.isArray(betaPage?.selects?.ranges)
          ? betaPage.selects.ranges
          : [],
      },
    };
  } catch {
    return null;
  }
};

const parseFromLo2Tiles = (
  html: string,
  sourceUrl: string
): Omit<ParsedWzhubPage, "usedFallback"> => {
  const tileRegex =
    /<article\b[^>]*class="[^"]*\blo2-tile\b[^"]*"[^>]*>[\s\S]*?<\/article>/gi;
  const items: ApiLoadoutItem[] = [];
  const extraMetaBySlug: Record<string, ParsedWzhubExtraMeta> = {};
  const seenSlugs = new Set<string>();
  const defaultMode = sourceUrl.includes("bo6-loadouts")
    ? "Multiplayer"
    : "Warzone";

  let tileMatch: RegExpExecArray | null;
  let index = 0;

  while ((tileMatch = tileRegex.exec(html)) !== null) {
    const tileHtml = tileMatch[0];

    const keyMatch = tileHtml.match(/data-loadout-key\s*=\s*"([^"]+)"/i);
    const classTierMatch = tileHtml.match(/lo2-category--([a-z_]+)/i);
    const rawTierKey =
      keyMatch?.[1]?.split(":")[0]?.trim() ||
      classTierMatch?.[1]?.trim() ||
      "meta";
    const tierConfig = TIER_BY_RAW_KEY[rawTierKey] ?? TIER_BY_RAW_KEY.meta;

    const typeMatch = tileHtml.match(
      /class="[^"]*\blo2-tile__type\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i
    );
    const weaponType = cleanHtmlText(typeMatch?.[1]) || "WPN";

    const linkMatch = tileHtml.match(
      /<a\b([^>]*\blo2-gun-link\b[^>]*)>([\s\S]*?)<\/a>/i
    );
    const weapon = cleanHtmlText(linkMatch?.[2]);
    if (!weapon) {
      index += 1;
      continue;
    }

    const linkAttrs = linkMatch?.[1] ?? "";
    const hrefMatch = linkAttrs.match(/href\s*=\s*"([^"]+)"/i);
    const href = hrefMatch?.[1]?.trim() ?? "";

    const rawSlug =
      href.split("/").filter(Boolean).pop() || `${slugify(weapon)}-${index}`;
    const slug = seenSlugs.has(rawSlug) ? `${rawSlug}-${index}` : rawSlug;
    seenSlugs.add(slug);

    const url = href
      ? href.startsWith("http")
        ? href
        : `${LOADOUTS_API_BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`
      : `${WZHUB_LOADOUTS_URL}/${slug}`;

    const rangeMatch = tileHtml.match(
      /class="[^"]*\blo2-tile__range\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i
    );
    const rangeName = cleanHtmlText(rangeMatch?.[1]);
    const gameMode = rangeName ? `${defaultMode} • ${rangeName}` : defaultMode;

    const imageMatch = tileHtml.match(
      /<div\b[^>]*class="[^"]*\blo2-tile__image\b[^"]*"[^>]*>[\s\S]*?<img\b[^>]*\b(?:src|data-src)\s*=\s*"([^"]+)"/i
    );
    const imageUrl = normalizeImageUrl(imageMatch?.[1]);

    const dateMatch = tileHtml.match(
      /class="[^"]*\blo2-tile__date\b[^"]*"[^>]*>([\s\S]*?)<\/span>/i
    );
    const updatedAt = cleanHtmlText(dateMatch?.[1]) || null;

    const game = inferGameFromSlug(
      slug,
      sourceUrl.includes("bo6-loadouts") ? "bo6" : "wz"
    );

    items.push({
      slug,
      url,
      weapon,
      category: tierConfig.category,
      tier: tierConfig.tier,
      weapon_type: weaponType,
      game_mode: gameMode,
      author: "WZHUB",
      updated_at: updatedAt,
      loadout_code: null,
      thumbnail_url: imageUrl,
      detail_image_url: imageUrl,
      attachments: [],
    });

    extraMetaBySlug[slug] = {
      id: keyMatch?.[1]?.split(":")[1]?.trim() || slug,
      game,
      gameFullName: null,
      updatedAtUnix: null,
    };

    index += 1;
  }

  return {
    items,
    extraMetaBySlug,
    lastUpdatedUnix: null,
    pageUpdated: null,
    selects: {
      gunTypes: Array.from(new Set(items.map((item) => item.weapon_type))).sort(),
      ranges: [],
    },
  };
};

export const parseWzhubV2Html = (
  html: string,
  sourceUrl = WZHUB_LOADOUTS_URL
): ParsedWzhubPage => {
  const nuxtParsed = parseFromNuxtPayload(html);
  if (nuxtParsed && nuxtParsed.items.length > 0) {
    return {
      ...nuxtParsed,
      usedFallback: false,
    };
  }

  const fallbackParsed = parseFromLo2Tiles(html, sourceUrl);
  return {
    ...fallbackParsed,
    usedFallback: true,
  };
};

export const fetchWzhubHtml = async (url: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: WZHUB_REQUEST_HEADERS,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`SYS_ERR: ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchAndParseWzhubPage = async (url: string): Promise<ParsedWzhubPage> => {
  const html = await fetchWzhubHtml(url);
  const parsed = parseWzhubV2Html(html, url);
  if (parsed.items.length === 0) {
    throw new Error(`Nenhuma build encontrada em ${url}`);
  }
  return parsed;
};

const parseMaozinhaAccessory = (raw: unknown): ApiLoadoutAttachment | null => {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) {
      return { slot: "Acessório", name: trimmed };
    }

    const slot = trimmed.slice(0, colonIndex).trim() || "Acessório";
    const name = trimmed.slice(colonIndex + 1).trim();
    return name ? { slot, name } : null;
  }

  if (raw && typeof raw === "object" && "name" in raw) {
    const obj = raw as { slot?: unknown; name?: unknown };
    const name = String(obj.name ?? "").trim();
    if (!name) return null;
    const slot = String(obj.slot ?? "Acessório").trim() || "Acessório";
    return { slot, name };
  }

  return null;
};

export const mapMaozinhaDocToLoadoutItem = (
  doc: FirestoreMaozinhaDoc,
  index = 0
): ApiLoadoutItem | null => {
  const weapon = String(doc?.name ?? "").trim();
  if (!weapon) {
    return null;
  }

  const docId = String(doc?.id ?? `local-${index}`).trim() || `local-${index}`;
  const imageUrl = normalizeImageUrl(doc?.img);
  const rawAccessories = Array.isArray(doc?.accessories) ? doc.accessories : [];
  const attachments = rawAccessories
    .map(parseMaozinhaAccessory)
    .filter((att): att is ApiLoadoutAttachment => att !== null);

  return {
    slug: `maozinha-${docId}`,
    url: "",
    weapon,
    category: "Exclusivo Mãozinha",
    tier: "maozinha",
    weapon_type: String(doc?.weaponType ?? "WPN").trim() || "WPN",
    game_mode: "Warzone • Exclusivo Mãozinha",
    author: "Mãozinha Gamer",
    updated_at: null,
    loadout_code: null,
    thumbnail_url: imageUrl,
    detail_image_url: imageUrl,
    attachments,
  };
};

const fetchMaozinhaLoadouts = async (): Promise<{
  items: ApiLoadoutItem[];
  error?: string;
}> => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Firestore timeout")), FIRESTORE_TIMEOUT_MS);
    });

    const snapshot = await Promise.race([
      getDocs(collection(FIREBASE_DB, MAOZINHA_LOADOUTS_COLLECTION)),
      timeoutPromise,
    ]);

    const sortedDocs = snapshot.docs
      .map((snap) => ({
        id: snap.id,
        ...(snap.data() as Omit<FirestoreMaozinhaDoc, "id">),
      }))
      .sort((a, b) => {
        const orderA =
          typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB =
          typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });

    const items = sortedDocs
      .map((doc, idx) => mapMaozinhaDocToLoadoutItem(doc, idx))
      .filter((item): item is ApiLoadoutItem => item !== null);

    return { items };
  } catch (error) {
    return {
      items: [],
      error: error instanceof Error ? error.message : "Erro ao buscar Firestore",
    };
  }
};

const sortLoadoutItems = (items: ApiLoadoutItem[]): ApiLoadoutItem[] =>
  items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const priorityA = TIER_PRIORITY[a.item.tier ?? ""] ?? 99;
      const priorityB = TIER_PRIORITY[b.item.tier ?? ""] ?? 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.index - b.index;
    })
    .map((entry) => entry.item);

export const filterLoadoutItems = (
  items: ApiLoadoutItem[],
  params: LoadoutQueryParams = {}
): ApiLoadoutItem[] => {
  const normalizedSearch = normalizeComparableText(params.search);
  const normalizedCategory = normalizeComparableText(params.category);
  const trimmedWeaponType = params.weaponType?.trim() ?? "";

  return items.filter((item) => {
    if (
      normalizedCategory &&
      normalizeComparableText(item.category) !== normalizedCategory
    ) {
      return false;
    }

    if (trimmedWeaponType && item.weapon_type.trim() !== trimmedWeaponType) {
      return false;
    }

    if (normalizedSearch) {
      const attachmentText = (item.attachments ?? [])
        .map((att) => `${att.slot} ${att.name}`)
        .join(" ");
      const searchableText = normalizeComparableText(
        `${item.weapon} ${item.weapon_type} ${item.game_mode} ${attachmentText}`
      );
      if (!searchableText.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });
};

export const fetchLoadoutsFromApi = async (
  params: LoadoutQueryParams = {}
): Promise<ApiLoadoutsResponse> => {
  const [primaryResult, bo6Result, maozinhaResult] = await Promise.allSettled([
    fetchAndParseWzhubPage(WZHUB_LOADOUTS_URL),
    fetchAndParseWzhubPage(WZHUB_BO6_LOADOUTS_URL),
    fetchMaozinhaLoadouts(),
  ]);

  const primaryPage =
    primaryResult.status === "fulfilled" ? primaryResult.value : null;
  const bo6Page = bo6Result.status === "fulfilled" ? bo6Result.value : null;
  const maozinhaData =
    maozinhaResult.status === "fulfilled"
      ? maozinhaResult.value
      : { items: [], error: "Erro ao carregar Exclusivo Mãozinha" };

  const primaryItems = primaryPage?.items ?? [];
  const primaryCategories = new Set(
    primaryItems.map((item) => normalizeComparableText(item.category))
  );

  const shouldEnrichWithBo6 =
    Boolean(bo6Page?.items.length) &&
    (primaryItems.length === 0 || primaryCategories.size < 3);

  const mergedWzhub: ApiLoadoutItem[] = [...primaryItems];
  const seenSlugs = new Set(primaryItems.map((item) => item.slug));

  if (shouldEnrichWithBo6 && bo6Page) {
    for (const item of bo6Page.items) {
      if (!seenSlugs.has(item.slug)) {
        seenSlugs.add(item.slug);
        mergedWzhub.push(item);
      }
    }
  }

  const combinedItems: ApiLoadoutItem[] = [...maozinhaData.items];
  const combinedSlugs = new Set(maozinhaData.items.map((item) => item.slug));

  for (const item of mergedWzhub) {
    if (!combinedSlugs.has(item.slug)) {
      combinedSlugs.add(item.slug);
      combinedItems.push(item);
    }
  }

  if (combinedItems.length === 0) {
    const primaryError =
      primaryResult.status === "rejected"
        ? String(primaryResult.reason)
        : undefined;
    const bo6Error =
      bo6Result.status === "rejected" ? String(bo6Result.reason) : undefined;
    throw new Error(
      primaryError ||
        bo6Error ||
        maozinhaData.error ||
        "Nenhuma build disponível no momento."
    );
  }

  const sortedItems = sortLoadoutItems(combinedItems);
  const filteredItems = filterLoadoutItems(sortedItems, params);

  const sourceParts: string[] = [];
  if (mergedWzhub.length > 0) sourceParts.push("wzhub-v2");
  if (maozinhaData.items.length > 0) sourceParts.push("firestore-maozinha");

  return {
    source: sourceParts.join("+") || "wzhub-v2",
    scraped_at: new Date().toISOString(),
    page_updated: primaryPage?.pageUpdated ?? bo6Page?.pageUpdated ?? null,
    total: filteredItems.length,
    items: filteredItems,
  };
};

export const fetchFeaturedLoadout = async (): Promise<ApiLoadoutItem | null> => {
  const response = await fetchLoadoutsFromApi();
  const items = response.items ?? [];

  if (items.length === 0) return null;

  const isWarzone = (item: ApiLoadoutItem) =>
    item.game_mode.toLowerCase().includes("warzone") &&
    item.tier !== "maozinha";

  // 1. Prioritize Warzone Absolute Meta AR
  const warzoneAbsoluteMetaAr = items.find(
    (item) =>
      item.tier === "absolute_meta" &&
      isWarzone(item) &&
      item.weapon_type.toUpperCase() === "AR"
  );
  if (warzoneAbsoluteMetaAr) return warzoneAbsoluteMetaAr;

  // 2. Fallback to any Warzone Absolute Meta
  const anyWarzoneAbsoluteMeta = items.find(
    (item) => item.tier === "absolute_meta" && isWarzone(item)
  );
  if (anyWarzoneAbsoluteMeta) return anyWarzoneAbsoluteMeta;

  // 3. Fallback to any Absolute Meta
  const anyAbsoluteMeta = items.find((item) => item.tier === "absolute_meta");
  if (anyAbsoluteMeta) return anyAbsoluteMeta;

  // 4. Fallback to Warzone Meta
  const warzoneMeta = items.find(
    (item) => item.tier === "meta" && isWarzone(item)
  );
  if (warzoneMeta) return warzoneMeta;

  // 5. Fallback to any top item
  return items[0];
};
