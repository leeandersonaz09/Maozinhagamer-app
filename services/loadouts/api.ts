import { LoadoutsQueryParams, LoadoutsResponse, LoadoutItem, LoadoutSection } from "./types";

const BASE_URL = "https://wzhub.gg";

function normalizeTier(raw: string): string {
  const value = raw.trim().toLowerCase();

  if (value.includes("absolute meta")) return "absolute_meta";
  if (value === "meta") return "meta";
  if (value === "new") return "new";
  if (value === "acceptable") return "acceptable";
  if (value === "unrated") return "unrated";

  return "meta";
}

function safeText(value?: string | null) {
  return (value ?? "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractUpdatedLabel(html: string): string | null {
  const match = html.match(
    /<div class="loadouts__updated"[^>]*>[\s\S]*?:\s*([^<]+)</i
  );

  return match ? safeText(match[1]) : null;
}

function extractRanges(html: string) {
  const ranges: { label: string; shortName: string; ids: number[]; value: string }[] = [];

  const regex =
    /<label[^>]*class="range-radio"[\s\S]*?<input[^>]*value="([^"]*)"[\s\S]*?<span class="radio-group__label">([\s\S]*?)<\/span>/gi;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const value = safeText(match[1]);
    const label = safeText(match[2]);
    const ids = value
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !Number.isNaN(v));

    ranges.push({
      label,
      shortName: label,
      ids,
      value,
    });
  }

  return ranges;
}

function extractSections(html: string): LoadoutSection[] {
  const sections: LoadoutSection[] = [];

  const sectionRegex =
    /<div>\s*<h2>([\s\S]*?)<\/h2>\s*<div class="loadouts-list__group">([\s\S]*?)<\/div>\s*<\/div>/gi;

  let sectionMatch: RegExpExecArray | null;

  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const sectionTitle = safeText(sectionMatch[1]);
    const sectionHtml = sectionMatch[2];

    const items: LoadoutItem[] = [];
    const cardRegex =
      /<div class="wrap-card expand-card loadout-card"[\s\S]*?<a href="\/loadouts\/([^"]+)"[\s\S]*?<div class="gun-badge__text">([\s\S]*?)<\/div>[\s\S]*?<div class="expand-card__el loadout-card__type">([\s\S]*?)<div class="loadout-card__separate"><\/div>([\s\S]*?)<\/div>[\s\S]*?<div class="expand-card__el loadout-card__category[^"]*">([\s\S]*?)<\/div>[\s\S]*?<span class="upper">Updated:\s*([\s\S]*?)<\/span>[\s\S]*?<div class="loadout-card__thumbnail">[\s\S]*?<img(?: src="([^"]*)")?[^>]*>[\s\S]*?<div class="loadout-card-code__content">([\s\S]*?)<\/div>/gi;

    let cardMatch: RegExpExecArray | null;

    while ((cardMatch = cardRegex.exec(sectionHtml)) !== null) {
      const slug = safeText(cardMatch[1]);
      const title = safeText(cardMatch[2]);
      const weaponType = safeText(cardMatch[3]);
      const mode = safeText(cardMatch[4]);
      const tierLabel = safeText(cardMatch[5]);
      const updatedAtLabel = safeText(cardMatch[6]);
      const thumbnailUrl = safeText(cardMatch[7]) || null;
      const code = safeText(cardMatch[8]) || null;

      const fullCardHtml = cardMatch[0];

      const attachments: { name: string; slot: string }[] = [];
      const attachmentRegex =
        /<div class="attachment-card-content__name">\s*<div>([\s\S]*?)<\/div>[\s\S]*?<span>([\s\S]*?)<\/span>/gi;

      let attachmentMatch: RegExpExecArray | null;

      while ((attachmentMatch = attachmentRegex.exec(fullCardHtml)) !== null) {
        attachments.push({
          name: safeText(attachmentMatch[1]),
          slot: safeText(attachmentMatch[2]),
        });
      }

      const gunImageMatch = fullCardHtml.match(
        /<div class="loadout-content__gun-image">[\s\S]*?<img[^>]*?(?:data-srcset|src)="([^"]+)"/i
      );

      const gunImageUrl = gunImageMatch ? safeText(gunImageMatch[1]) : null;

      items.push({
        id: slug,
        slug,
        title,
        game: slug.startsWith("bo7-") ? "bo7" : slug.startsWith("bo6-") ? "bo6" : "wz",
        weaponType,
        mode,
        tier: normalizeTier(tierLabel),
        tierLabel,
        updatedAtLabel,
        author: "WZHUB",
        code,
        thumbnailUrl,
        gunImageUrl,
        detailUrl: `${BASE_URL}/loadouts/${slug}`,
        attachments,
      });
    }

    if (items.length) {
      sections.push({
        key: normalizeTier(sectionTitle),
        title: sectionTitle,
        items,
      });
    }
  }

  return sections;
}

function applyFilters(
  response: LoadoutsResponse,
  params?: LoadoutsQueryParams
): LoadoutsResponse {
  if (!params) return response;

  const gunName = params.gun_name?.toLowerCase().trim();
  const gunTypes = new Set((params.gun_type ?? []).map((v) => v.toLowerCase()));
  const tiers = new Set((params.tier ?? []).map((v) => v.toLowerCase()));
  const game = params.game?.toLowerCase();

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

        return matchesName && matchesType && matchesTier && matchesGame;
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
  const response = await fetch(`${BASE_URL}/loadouts`, {
    method: "GET",
    headers: {
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar HTML do WZHUB: ${response.status}`);
  }

  const html = await response.text();

  const ranges = extractRanges(html);
  const sections = extractSections(html);

  const gunTypes = Array.from(
    new Set(
      sections.flatMap((section) => section.items.map((item) => item.weaponType))
    )
  ).sort();

  const games = Array.from(
    new Set(sections.flatMap((section) => section.items.map((item) => item.game)))
  ).map((id) => ({
    id,
    title: id.toUpperCase(),
  }));

  const parsed: LoadoutsResponse = {
    source: "wzhub-html-fallback",
    fetchedAt: new Date().toISOString(),
    snapshotVersion: new Date().toISOString(),
    updatedLabel: extractUpdatedLabel(html),
    stale: false,
    filters: {
      gunTypes,
      ranges,
      games,
    },
    sections,
  };

  return applyFilters(parsed, params);
}