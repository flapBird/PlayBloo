export type SubmissionSourceType = "steam" | "itch" | "official";

export interface ExtractedGameMetadata {
  title?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  developer?: string;
  publisher?: string;
  release_date?: string;
  last_updated_at?: string;
  thumbnail_url?: string;
  cover_url?: string;
  screenshots?: string[];
  categories?: string[];
  tags?: string[];
  platforms?: string[];
  monetization?: "free" | "paid";
  iframe_url?: string;
  external_url?: string;
  official_website_url?: string;
  source_url: string;
  source_type: SubmissionSourceType;
  steam_url?: string;
  steam_app_id?: string;
  itch_url?: string;
  itch_project_slug?: string;
  last_fetched_at: string;
}

export interface ClassifiedSubmissionUrl {
  url: URL;
  normalizedUrl: string;
  sourceType: SubmissionSourceType;
  steamAppId?: string;
  itchProjectSlug?: string;
}
