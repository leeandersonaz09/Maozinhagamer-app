import {
  fetchWzhubHtml,
  parseWzhubV2Html,
} from "../../src/services/loadouts/api";
import {
  LoadoutItem,
  LoadoutRange,
  LoadoutSection,
  LoadoutsQueryParams,
  LoadoutsResponse,
} from "./types";

const WZHUB_PT_LOADOUTS_URL = "https://wzhub.gg/pt/loadouts";

const SECTION_ORDER: readonly { tier: string; title: string }[] = [
  { tier: "absolute_meta", title: "Meta Absoluta" },
  { tier: "meta", title: "Meta" },
  { tier: "acceptable", title: "Aceitavel" },
  { tier: "new", title: "Novo" },
  { tier: "unrated", title: "Sem classificacao" },
];

function applyFilters(
  response: LoadoutsResponse,
  params?: LoadoutsQueryParams
): LoadoutsResponse {
  if (!params) return response;

  const gunName = params.gun_name?.toLowerCase().trim();
  const gunTypes = new Set((params.gun_type ?? []).map((v) => v.toLowerCase()));
  const tiers = new Set((params.tier ?? []).map((v) => v.toLowerCase()));
  const ranges = new Set((params.range ?? []).map((v) => v.toLowerCase()));
  const game = params.game?.toLowerCase().trim();

  const filteredSections = response.sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const matchesName =
          !gunName || item.title.toLowerCase().includes(gunName);

        const matchesType =
          gunTypes.size === 0 || gunTypes.has(item.weaponType.toLowerCase());

        const matchesTier =
          tiers.size === 0 || tiers.has(item.tier.toLowerCase());

        const matchesGame =
          !game || item.game.toLowerCase() === game;

        const matchesRange =
          ranges.size === 0 ||
          Array.from(ranges).some(
            (r) =>
              (item.mode ?? "").toLowerCase().includes(r) ||
              item.slug.toLowerCase().includes(r)
          );

        return (
          matchesName &&
          matchesType &&
          matchesTier &&
          matchesGame &&
          matchesRange
        );
      }),
    }))
    .filter((section) => section.items.length > 0);

  return {
    ...response,
    sections: filteredSections,
  };
}

export async function fetchLoadouts(
  params?: LoadoutsQueryParams
): Promise<LoadoutsResponse> {
  const html = await fetchWzhubHtml(WZHUB_PT_LOADOUTS_URL);
  const parsed = parseWzhubV2Html(html, WZHUB_PT_LOADOUTS_URL);

  const itemsByTier = new Map<string, LoadoutItem[]>();
  const labelByTier = new Map<string, string>();
  const gameLabelById = new Map<string, string>();

  for (const apiItem of parsed.items) {
    const extra = parsed.extraMetaBySlug[apiItem.slug];
    const tier = apiItem.tier || "meta";
    const game = extra?.game || "wz";

    if (extra?.gameFullName) {
      gameLabelById.set(game, extra.gameFullName);
    }

    const mappedItem: LoadoutItem = {
      id: extra?.id || apiItem.slug,
      slug: apiItem.slug,
      title: apiItem.weapon,
      game,
      gameLabel: extra?.gameFullName ?? null,
      weaponType: apiItem.weapon_type,
      mode: apiItem.game_mode,
      tier,
      tierLabel: apiItem.category,
      updatedAtLabel: apiItem.updated_at,
      updatedAtUnix: extra?.updatedAtUnix ?? null,
      author: apiItem.author,
      code: apiItem.loadout_code,
      thumbnailUrl: apiItem.thumbnail_url,
      gunImageUrl: apiItem.detail_image_url,
      detailUrl: apiItem.url,
      attachments: apiItem.attachments,
    };

    const existing = itemsByTier.get(tier) ?? [];
    existing.push(mappedItem);
    itemsByTier.set(tier, existing);
    labelByTier.set(tier, apiItem.category);
  }

  const sections: LoadoutSection[] = [];
  const addedTiers = new Set<string>();

  for (const entry of SECTION_ORDER) {
    const tierItems = itemsByTier.get(entry.tier);
    if (tierItems && tierItems.length > 0) {
      sections.push({
        key: entry.tier,
        title: labelByTier.get(entry.tier) ?? entry.title,
        items: tierItems,
      });
      addedTiers.add(entry.tier);
    }
  }

  for (const [tier, tierItems] of itemsByTier.entries()) {
    if (!addedTiers.has(tier) && tierItems.length > 0) {
      sections.push({
        key: tier,
        title: labelByTier.get(tier) ?? tier,
        items: tierItems,
      });
    }
  }

  const allItems = sections.flatMap((section) => section.items);

  const gunTypes =
    parsed.selects.gunTypes.length > 0
      ? parsed.selects.gunTypes
      : Array.from(new Set(allItems.map((item) => item.weaponType))).sort();

  const ranges: LoadoutRange[] = parsed.selects.ranges.map((r) => {
    const ids = Array.isArray(r.id) ? r.id : [];
    const label = String(r.name || r.short_name || "").trim();
    return {
      label,
      shortName: String(r.short_name || label),
      ids,
      value: ids.join(","),
    };
  });

  const games = Array.from(new Set(allItems.map((item) => item.game))).map(
    (id) => ({
      id,
      title: gameLabelById.get(id) ?? id.toUpperCase(),
    })
  );

  const nowIso = new Date().toISOString();

  const response: LoadoutsResponse = {
    source: parsed.usedFallback ? "wzhub-html-fallback" : "wzhub-api",
    fetchedAt: nowIso,
    snapshotVersion: nowIso,
    updatedLabel: parsed.pageUpdated,
    stale: false,
    filters: {
      gunTypes,
      ranges,
      games,
    },
    sections,
  };

  return applyFilters(response, params);
}
