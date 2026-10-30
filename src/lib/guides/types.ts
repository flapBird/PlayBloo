export interface GuideSource {
  id: string;
  label: string;
  url: string;
}

/** Compact, client-safe entry for the site-wide search suggestions. */
export interface GuideSearchEntry {
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
  cover?: string;
  kind: "topic" | "article";
}

export interface GuideCover {
  src: string;
  alt: string;
  credit: string;
  sourceUrl: string;
  width?: number;
  height?: number;
  fit?: "contain" | "cover";
  position?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  sourceIds?: string[];
  trailer?: boolean;
  starterPlanner?: boolean;
  releaseFacts?: boolean;
  link?: { label: string; href: string };
  image?: { src: string; alt: string; width: number; height: number; caption: string };
  puzzle?: {
    image: { src: string; alt: string; width: number; height: number; caption: string };
    hint: string;
    furtherHint: string;
    solution: string[];
  };
}

export interface GuideArticle {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  cover?: GuideCover;
  category: string;
  status: "published" | "preview" | "draft";
  publishedAt: string;
  updatedAt: string;
  sections: GuideSection[];
  relatedSlugs: string[];
}

export interface GuideTopic {
  slug: string;
  name: string;
  officialName: string;
  title: string;
  description: string;
  status: "published" | "draft";
  kind?: "collection";
  heroFact?: string;
  platforms: string[];
  releaseDate: string;
  releaseKind?: "demo";
  releaseStatus: "upcoming" | "released";
  publisher: string;
  cover: GuideCover;
  trailer?: { youtubeId: string; title: string; publishedAt: string };
  publishedAt: string;
  updatedAt: string;
  verifiedAt: string;
  sources: GuideSource[];
  sections: GuideSection[];
  articles: GuideArticle[];
}
