import type { GameSource } from "@/lib/types";

export const GAME_BULK_FORMAT = "playbloo.game.v1" as const;

export const EMPTY_GAME_FORM = {
  title: "", slug: "", thumbnail_url: "", cover_url: "", iframe_url: "", external_url: "",
  description: "", how_to_play: "", controls: "", tips: "", features: "",
  developer: "", publisher: "", source_url: "", source_type: "", original_game_url: "",
  developer_url: "", steam_url: "", itch_url: "", last_verified_at: "", sources_text: "",
  release_date: "", added_at: "", last_updated_at: "", short_description: "", official_website_url: "",
  steam_app_id: "", itch_project_slug: "", platforms_text: "", monetization: "", development_status: "",
  graphics: "", multiplayer: "", engine: "", screenshots_text: "",
  is_published: false, is_featured: false, is_trending: false, content_verified: false,
};

export type GameForm = typeof EMPTY_GAME_FORM;

export type GameBulkReadOnly = {
  id: string;
  view_count: number;
  play_count: number;
  external_click_count: number;
  hot_score: number;
  created_at: string;
  updated_at: string;
};

export type GameBulkDocument = {
  format: typeof GAME_BULK_FORMAT;
  title: string;
  slug: string;
  thumbnail_url: string;
  cover_url: string;
  iframe_url: string;
  external_url: string;
  description: string;
  short_description: string;
  how_to_play: string;
  controls: string;
  tips: string;
  features: string;
  developer: string;
  publisher: string;
  source_type: string;
  source_url: string;
  original_game_url: string;
  developer_url: string;
  steam_url: string;
  itch_url: string;
  official_website_url: string;
  steam_app_id: string;
  itch_project_slug: string;
  release_date: string;
  added_at: string;
  last_updated_at: string;
  last_verified_at: string;
  platforms: string[];
  monetization: string;
  development_status: string;
  graphics: string;
  multiplayer: string;
  engine: string;
  screenshots: string[];
  sources: GameSource[];
  categories: string[];
  tags: string[];
  series: string[];
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  content_verified: boolean;
  read_only: GameBulkReadOnly;
};

export type GameBulkRelations = {
  categories: string[];
  tags: string[];
  series: string[];
};

const STRING_FIELDS = [
  "title", "slug", "thumbnail_url", "cover_url", "iframe_url", "external_url", "description",
  "short_description", "how_to_play", "controls", "tips", "features", "developer", "publisher",
  "source_type", "source_url", "original_game_url", "developer_url", "steam_url", "itch_url",
  "official_website_url", "steam_app_id", "itch_project_slug", "release_date", "added_at",
  "last_updated_at", "last_verified_at", "monetization", "development_status", "graphics", "multiplayer",
  "engine",
] as const;

const STRING_ARRAY_FIELDS = ["platforms", "screenshots", "categories", "tags", "series"] as const;
const BOOLEAN_FIELDS = ["is_published", "is_featured", "is_trending", "content_verified"] as const;
const URL_FIELDS = [
  "thumbnail_url", "cover_url", "iframe_url", "external_url", "source_url", "original_game_url",
  "developer_url", "steam_url", "itch_url", "official_website_url",
] as const;
const TOP_LEVEL_FIELDS = new Set<string>([
  "format", "read_only", "sources", ...STRING_FIELDS, ...STRING_ARRAY_FIELDS, ...BOOLEAN_FIELDS,
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function splitList(value: string, separator: string): string[] {
  return value.split(separator).map((item) => item.trim()).filter(Boolean);
}

function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function createGameBulkDocument(
  form: GameForm,
  relations: GameBulkRelations,
  readOnly: GameBulkReadOnly,
  sources: GameSource[],
): GameBulkDocument {
  return {
    format: GAME_BULK_FORMAT,
    title: form.title,
    slug: form.slug,
    thumbnail_url: form.thumbnail_url,
    cover_url: form.cover_url,
    iframe_url: form.iframe_url,
    external_url: form.external_url,
    description: form.description,
    short_description: form.short_description,
    how_to_play: form.how_to_play,
    controls: form.controls,
    tips: form.tips,
    features: form.features,
    developer: form.developer,
    publisher: form.publisher,
    source_type: form.source_type,
    source_url: form.source_url,
    original_game_url: form.original_game_url,
    developer_url: form.developer_url,
    steam_url: form.steam_url,
    itch_url: form.itch_url,
    official_website_url: form.official_website_url,
    steam_app_id: form.steam_app_id,
    itch_project_slug: form.itch_project_slug,
    release_date: form.release_date,
    added_at: form.added_at,
    last_updated_at: form.last_updated_at,
    last_verified_at: form.last_verified_at,
    platforms: splitList(form.platforms_text, ","),
    monetization: form.monetization,
    development_status: form.development_status,
    graphics: form.graphics,
    multiplayer: form.multiplayer,
    engine: form.engine,
    screenshots: splitList(form.screenshots_text, "\n"),
    sources,
    categories: relations.categories,
    tags: relations.tags,
    series: relations.series,
    is_published: form.is_published,
    is_featured: form.is_featured,
    is_trending: form.is_trending,
    content_verified: form.content_verified,
    read_only: readOnly,
  };
}

export function formatGameBulkDocument(document: GameBulkDocument): string {
  return JSON.stringify(document, null, 2);
}

export function parseGameBulkDocument(text: string): GameBulkDocument {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Invalid JSON";
    throw new Error(`JSON parsing failed: ${detail}`);
  }

  if (!isRecord(value)) throw new Error("The bulk document must be a JSON object.");
  if (value.format !== GAME_BULK_FORMAT) throw new Error(`format must be \"${GAME_BULK_FORMAT}\".`);

  const unknownFields = Object.keys(value).filter((key) => !TOP_LEVEL_FIELDS.has(key));
  if (unknownFields.length) throw new Error(`Unknown fields: ${unknownFields.join(", ")}. Check their spelling.`);

  const missingFields = [...TOP_LEVEL_FIELDS].filter((key) => !(key in value));
  if (missingFields.length) throw new Error(`Missing fields: ${missingFields.join(", ")}. Export the current format again.`);

  for (const field of STRING_FIELDS) {
    if (typeof value[field] !== "string") throw new Error(`${field} must be a string. Use an empty string when unknown.`);
  }
  for (const field of STRING_ARRAY_FIELDS) {
    if (!Array.isArray(value[field]) || !(value[field] as unknown[]).every((item) => typeof item === "string")) {
      throw new Error(`${field} must be an array of strings.`);
    }
    if ((value[field] as string[]).some((item) => !item.trim())) {
      throw new Error(`${field} cannot contain empty values.`);
    }
  }
  for (const field of BOOLEAN_FIELDS) {
    if (typeof value[field] !== "boolean") throw new Error(`${field} must be true or false.`);
  }

  const title = value.title as string;
  const slug = value.slug as string;
  if (!title.trim()) throw new Error("title cannot be empty.");
  if (!slug.trim()) throw new Error("slug cannot be empty.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("slug may only contain lowercase letters, numbers, and single hyphens.");
  }
  for (const field of URL_FIELDS) {
    const url = value[field] as string;
    if (url && !isWebUrl(url)) throw new Error(`${field} must be an http or https URL.`);
  }
  if ((value.screenshots as string[]).some((url) => !isWebUrl(url))) {
    throw new Error("Every screenshots entry must be an http or https URL.");
  }

  const releaseDate = value.release_date as string;
  if (releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    throw new Error("release_date must use YYYY-MM-DD.");
  }
  for (const field of ["added_at", "last_updated_at", "last_verified_at"] as const) {
    const date = value[field] as string;
    if (date && !Number.isFinite(new Date(date).getTime())) throw new Error(`${field} must contain a valid date and time.`);
  }

  const monetization = value.monetization as string;
  if (monetization && !["free", "free-with-ads", "freemium", "paid"].includes(monetization)) {
    throw new Error("monetization must be empty, free, free-with-ads, freemium, or paid.");
  }
  const status = value.development_status as string;
  if (status && !["upcoming", "demo", "early-access", "released", "discontinued"].includes(status)) {
    throw new Error("development_status has an unsupported value.");
  }

  if (!Array.isArray(value.sources)) throw new Error("sources must be an array.");
  const sources = value.sources.map((source, index): GameSource => {
    if (!isRecord(source) || typeof source.type !== "string" || typeof source.url !== "string") {
      throw new Error(`sources[${index}] must contain string type and url fields.`);
    }
    if (!source.type.trim() || !isWebUrl(source.url)) {
      throw new Error(`sources[${index}] must contain a source type and an http or https URL.`);
    }
    if (source.verifiedAt !== null && typeof source.verifiedAt !== "string") {
      throw new Error(`sources[${index}].verifiedAt must be a string or null.`);
    }
    if (typeof source.verifiedAt === "string" && source.verifiedAt && !Number.isFinite(new Date(source.verifiedAt).getTime())) {
      throw new Error(`sources[${index}].verifiedAt must contain a valid date.`);
    }
    return { type: source.type, url: source.url, verifiedAt: source.verifiedAt };
  });

  if (!isRecord(value.read_only)) throw new Error("read_only must remain an object.");
  const readOnly = value.read_only;
  for (const field of ["id", "created_at", "updated_at"] as const) {
    if (typeof readOnly[field] !== "string") throw new Error(`read_only.${field} must be a string.`);
  }
  for (const field of ["view_count", "play_count", "external_click_count", "hot_score"] as const) {
    if (typeof readOnly[field] !== "number" || !Number.isFinite(readOnly[field])) {
      throw new Error(`read_only.${field} must be a number.`);
    }
  }

  return { ...value, sources, read_only: readOnly } as GameBulkDocument;
}

export function gameBulkDocumentToForm(document: GameBulkDocument): GameForm {
  return {
    title: document.title,
    slug: document.slug,
    thumbnail_url: document.thumbnail_url,
    cover_url: document.cover_url,
    iframe_url: document.iframe_url,
    external_url: document.external_url,
    description: document.description,
    short_description: document.short_description,
    how_to_play: document.how_to_play,
    controls: document.controls,
    tips: document.tips,
    features: document.features,
    developer: document.developer,
    publisher: document.publisher,
    source_type: document.source_type,
    source_url: document.source_url,
    original_game_url: document.original_game_url,
    developer_url: document.developer_url,
    steam_url: document.steam_url,
    itch_url: document.itch_url,
    official_website_url: document.official_website_url,
    steam_app_id: document.steam_app_id,
    itch_project_slug: document.itch_project_slug,
    release_date: document.release_date,
    added_at: document.added_at,
    last_updated_at: document.last_updated_at,
    last_verified_at: document.last_verified_at,
    platforms_text: document.platforms.join(", "),
    monetization: document.monetization,
    development_status: document.development_status,
    graphics: document.graphics,
    multiplayer: document.multiplayer,
    engine: document.engine,
    screenshots_text: document.screenshots.join("\n"),
    sources_text: document.sources.map((source) => `${source.type} | ${source.url} | ${source.verifiedAt || ""}`).join("\n"),
    is_published: document.is_published,
    is_featured: document.is_featured,
    is_trending: document.is_trending,
    content_verified: document.content_verified,
  };
}
