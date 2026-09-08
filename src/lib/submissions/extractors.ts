import type { ClassifiedSubmissionUrl, ExtractedGameMetadata } from "./types";
import { safeFetchText } from "./url-security";

function stripHtml(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 12_000) : undefined;
}

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}

function uniqueStrings(values: unknown[], limit = 30): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && Boolean(value.trim())).map((value) => value.trim()))].slice(0, limit);
}

function parseDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export async function extractSteamMetadata(info: ClassifiedSubmissionUrl): Promise<ExtractedGameMetadata> {
  if (!info.steamAppId) throw new Error("A valid Steam app URL is required.");
  const endpoint = `https://store.steampowered.com/api/appdetails?appids=${info.steamAppId}&l=english&cc=us`;
  const { text } = await safeFetchText(endpoint, {
    allowedHost: (host) => host === "store.steampowered.com",
    allowedContentTypes: ["application/json", "text/json", "text/plain"],
  });
  const payload = JSON.parse(text);
  const entry = payload?.[info.steamAppId];
  if (!entry?.success || !entry.data) throw new Error("Steam did not return public metadata for this app.");
  const data = entry.data;
  const platforms = uniqueStrings([
    data.platforms?.windows ? "Windows" : "",
    data.platforms?.mac ? "macOS" : "",
    data.platforms?.linux ? "Linux" : "",
  ]);
  const steamUrl = `https://store.steampowered.com/app/${info.steamAppId}`;
  return {
    title: stripHtml(data.name),
    slug: data.name ? slugify(data.name) : undefined,
    short_description: stripHtml(data.short_description),
    description: stripHtml(data.about_the_game || data.detailed_description),
    developer: uniqueStrings(data.developers || [], 5).join(", ") || undefined,
    publisher: uniqueStrings(data.publishers || [], 5).join(", ") || undefined,
    release_date: parseDate(data.release_date?.date),
    thumbnail_url: typeof data.header_image === "string" ? data.header_image : undefined,
    cover_url: typeof data.header_image === "string" ? data.header_image : undefined,
    screenshots: uniqueStrings((data.screenshots || []).map((item: { path_full?: string }) => item?.path_full), 12),
    categories: uniqueStrings((data.genres || []).map((item: { description?: string }) => item?.description), 12),
    tags: uniqueStrings((data.categories || []).map((item: { description?: string }) => item?.description), 20),
    platforms,
    monetization: data.is_free === true ? "free" : data.price_overview ? "paid" : undefined,
    external_url: steamUrl,
    official_website_url: typeof data.website === "string" ? data.website : undefined,
    source_url: steamUrl,
    source_type: "steam",
    steam_url: steamUrl,
    steam_app_id: info.steamAppId,
    last_fetched_at: new Date().toISOString(),
  };
}

function metaContent(html: string, key: string): string | undefined {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
  ];
  return patterns.map((pattern) => html.match(pattern)?.[1]).find(Boolean);
}

function decodeEntities(value?: string): string | undefined {
  return stripHtml(value);
}

function resolveHttpUrl(value: string | undefined, baseUrl: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value.replace(/&amp;/gi, "&"), baseUrl);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function trustedItchIframe(value: string): string | undefined {
  try {
    const url = new URL(value.replace(/&amp;/gi, "&"));
    if (url.protocol !== "https:") return undefined;
    const host = url.hostname.toLowerCase();
    if (host === "html-classic.itch.zone") return url.toString();
    if (host === "itch.io" && url.pathname.startsWith("/embed-upload/")) return url.toString();
  } catch {
    return undefined;
  }
  return undefined;
}

export async function extractItchMetadata(info: ClassifiedSubmissionUrl): Promise<ExtractedGameMetadata> {
  const { text: html, finalUrl } = await safeFetchText(info.url.toString(), {
    allowedHost: (host) => host.endsWith(".itch.io") && host !== "itch.io",
    allowedContentTypes: ["text/html", "application/xhtml+xml"],
  });
  const title = decodeEntities(metaContent(html, "og:title") || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const description = decodeEntities(metaContent(html, "og:description") || metaContent(html, "description"));
  const image = resolveHttpUrl(metaContent(html, "og:image"), finalUrl);
  const screenshotCandidates = [
    ...Array.from(html.matchAll(/class=["'][^"']*screenshot[^"']*["'][^>]+href=["']([^"']+)["']/gi), (match) => match[1]),
    ...Array.from(html.matchAll(/href=["']([^"']+)["'][^>]+class=["'][^"']*screenshot[^"']*["']/gi), (match) => match[1]),
  ];
  const screenshots = uniqueStrings(screenshotCandidates.map((value) => resolveHttpUrl(value, finalUrl)), 12);
  const tags = uniqueStrings(Array.from(html.matchAll(/href=["'][^"']*\/tag-([^"'/?#]+)[^"']*["']/gi), (match) => match[1].replace(/-/g, " ")), 20);
  const platforms = uniqueStrings([
    /platform_windows|icon-windows|fa-windows/i.test(html) ? "Windows" : "",
    /platform_osx|icon-apple|fa-apple/i.test(html) ? "macOS" : "",
    /platform_linux|icon-linux|fa-linux/i.test(html) ? "Linux" : "",
    /platform_android|icon-android|fa-android/i.test(html) ? "Android" : "",
    /HTML5|html_embed|embed_wrapper|Run game/i.test(html) ? "Web" : "",
  ]);
  const iframeUrl = Array.from(html.matchAll(/<iframe[^>]+src=["'](https?:\/\/[^"']+)["']/gi), (match) => match[1])
    .map(trustedItchIframe)
    .find(Boolean);
  const developer = decodeEntities(metaContent(html, "author") || metaContent(html, "twitter:creator"));
  const publishedLabel = html.match(/Published[\s\S]{0,400}?<abbr[^>]+title=["']([^"']+)["']/i)?.[1];
  const updatedLabel = html.match(/Updated[\s\S]{0,400}?<abbr[^>]+title=["']([^"']+)["']/i)?.[1];
  const priceAmount = metaContent(html, "product:price:amount");
  const monetization = priceAmount !== undefined
    ? Number(priceAmount) > 0 ? "paid" as const : "free" as const
    : /class=["'][^"']*buy_btn[^"']*["'][^>]*>\s*(?:Buy|Purchase)/i.test(html) ? "paid" as const
    : /Download Now|Play in browser|Run game/i.test(html) ? "free" as const : undefined;
  return {
    title,
    slug: title ? slugify(title) : undefined,
    short_description: description,
    description,
    developer,
    release_date: parseDate(publishedLabel),
    last_updated_at: parseDate(updatedLabel),
    thumbnail_url: image,
    cover_url: image,
    screenshots,
    tags,
    platforms,
    monetization,
    iframe_url: iframeUrl,
    external_url: finalUrl,
    source_url: finalUrl,
    source_type: "itch",
    itch_url: finalUrl,
    itch_project_slug: info.itchProjectSlug,
    last_fetched_at: new Date().toISOString(),
  };
}

export async function extractSubmissionMetadata(info: ClassifiedSubmissionUrl): Promise<ExtractedGameMetadata> {
  if (info.sourceType === "steam") return extractSteamMetadata(info);
  if (info.sourceType === "itch") return extractItchMetadata(info);
  return {
    external_url: info.normalizedUrl,
    official_website_url: info.normalizedUrl,
    source_url: info.normalizedUrl,
    source_type: "official",
    last_fetched_at: new Date().toISOString(),
  };
}
