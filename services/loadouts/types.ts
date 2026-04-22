export type LoadoutAttachment = {
  name: string;
  slot: string;
};

export type LoadoutItem = {
  id: string;
  slug: string;
  title: string;
  game: string;
  gameLabel?: string | null;
  weaponType: string;
  mode?: string;
  tier: string;
  tierLabel: string;
  updatedAtLabel?: string | null;
  updatedAtUnix?: number | null;
  author?: string | null;
  code?: string | null;
  thumbnailUrl?: string | null;
  gunImageUrl?: string | null;
  detailUrl?: string | null;
  attachments: LoadoutAttachment[];
};

export type LoadoutSection = {
  key: string;
  title: string;
  items: LoadoutItem[];
};

export type LoadoutGame = {
  id: string;
  title: string;
  icon?: string | null;
};

export type LoadoutRange = {
  label: string;
  shortName: string;
  ids: number[];
  value: string;
};

export type LoadoutFilters = {
  gunTypes: string[];
  ranges: LoadoutRange[];
  games?: LoadoutGame[];
};

export type LoadoutsResponse = {
  source: "wzhub-api" | "wzhub-html-fallback";
  fetchedAt: string;
  snapshotVersion: string;
  updatedLabel?: string | null;
  stale: boolean;
  filters: LoadoutFilters;
  sections: LoadoutSection[];
};

export type LoadoutsQueryParams = {
  game?: string;
  gun_name?: string;
  gun_type?: string[];
  range?: string[];
  tier?: string[];
};

export type LoadoutUiSection = {
  key: string;
  title: string;
  data: LoadoutItem[];
};