const CHANNEL_HANDLE = "@maozinhagamer_diih";
const CHANNEL_ID = "UC8P0dc0Zn2gf8L6tJi_k6xg";
const LIVE_PAGE_URL = `https://www.youtube.com/${CHANNEL_HANDLE}/live`;
const LIVE_PAGE_FALLBACK_URL = `https://www.youtube.com/channel/${CHANNEL_ID}/live`;
const LIVE_CHECK_TIMEOUT_MS = 8000;

export type YouTubeLiveStatus = {
  isLive: boolean;
  url: string;
  checkedAt: string;
  title?: string;
  videoId?: string;
  thumbnail?: string;
  startedAt?: string;
};

const decodeJsonText = (value?: string) => {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`) as string;
  } catch {
    return value.replace(/\\u0026/g, "&").replace(/\\"/g, '"').trim();
  }
};

const getFirstMatch = (html: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeJsonText(match[1]);
    }
  }

  return undefined;
};

const fetchLivePage = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LIVE_CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`YouTube live page failed with ${response.status}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
};

const parseLiveStatus = (html: string): YouTubeLiveStatus => {
  const checkedAt = new Date().toISOString();
  const isLive =
    /"liveBroadcastDetails"\s*:\s*\{[^}]*"isLiveNow"\s*:\s*true/i.test(html) ||
    /"isLiveNow"\s*:\s*true/i.test(html);

  if (!isLive) {
    return {
      checkedAt,
      isLive: false,
      url: LIVE_PAGE_URL,
    };
  }

  const videoId = getFirstMatch(html, [
    /"externalVideoId"\s*:\s*"([^"]+)"/i,
    /"videoId"\s*:\s*"([^"]+)"/i,
    /watch\?v=([a-zA-Z0-9_-]{6,})/i,
  ]);
  const title = getFirstMatch(html, [
    /"title"\s*:\s*"([^"]+)"/i,
    /<meta\s+property="og:title"\s+content="([^"]+)"/i,
  ]);
  const startedAt = getFirstMatch(html, [
    /"startTimestamp"\s*:\s*"([^"]+)"/i,
    /"actualStartTime"\s*:\s*"([^"]+)"/i,
  ]);
  const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : LIVE_PAGE_URL;

  return {
    checkedAt,
    isLive: true,
    startedAt,
    thumbnail: videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault_live.jpg`
      : undefined,
    title,
    url,
    videoId,
  };
};

export const getYouTubeLiveStatus = async (): Promise<YouTubeLiveStatus> => {
  try {
    const html = await fetchLivePage(LIVE_PAGE_URL);
    return parseLiveStatus(html);
  } catch (primaryError) {
    console.warn("Primary YouTube live check failed:", primaryError);

    try {
      const fallbackHtml = await fetchLivePage(LIVE_PAGE_FALLBACK_URL);
      return parseLiveStatus(fallbackHtml);
    } catch (fallbackError) {
      console.error("Error checking YouTube live status:", fallbackError);

      return {
        checkedAt: new Date().toISOString(),
        isLive: false,
        url: LIVE_PAGE_URL,
      };
    }
  }
};

/**
 * Compatibility helper for older UI code that only needs online/offline.
 */
export async function checkIsLive(): Promise<boolean> {
  const status = await getYouTubeLiveStatus();
  return status.isLive;
}
