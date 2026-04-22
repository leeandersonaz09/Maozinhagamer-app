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

export const LOADOUTS_API_BASE_URL =
  "https://restless-darkness-5a5e.leeandersonaz09.workers.dev";

export type LoadoutQueryParams = {
  search?: string;
  category?: string | null;
  weaponType?: string | null;
  refresh?: boolean;
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
  return `${LOADOUTS_API_BASE_URL}/api/loadouts${
    queryString ? `?${queryString}` : ""
  }`;
};

export const getLoadoutsCacheKey = (params: LoadoutQueryParams = {}) =>
  `loadouts:${JSON.stringify({
    search: params.search?.trim() ?? "",
    category: params.category ?? "",
    weaponType: params.weaponType ?? "",
  })}`;

export const fetchLoadoutsFromApi = async (
  params: LoadoutQueryParams = {}
): Promise<ApiLoadoutsResponse> => {
  const response = await fetch(buildLoadoutsUrl(params), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`SYS_ERR: ${response.status}`);
  }

  return (await response.json()) as ApiLoadoutsResponse;
};

export const fetchFeaturedLoadout = async (): Promise<ApiLoadoutItem | null> => {
  const response = await fetchLoadoutsFromApi();
  const items = response.items ?? [];
  
  if (items.length === 0) return null;

  // 1. Prioritize Absolute Meta AR
  const absoluteMetaAr = items.find(
    (item) => item.tier === "absolute_meta" && item.category === "Assault Rifle"
  );
  if (absoluteMetaAr) return absoluteMetaAr;

  // 2. Fallback to any Absolute Meta
  const anyAbsoluteMeta = items.find((item) => item.tier === "absolute_meta");
  if (anyAbsoluteMeta) return anyAbsoluteMeta;

  // 3. Fallback to any top item
  return items[0];
};
