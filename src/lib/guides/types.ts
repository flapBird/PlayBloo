export interface GuideSource {
  id: string;
  label: string;
  url: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  sourceIds?: string[];
  trailer?: boolean;
  releaseFacts?: boolean;
}

export interface GuideArticle {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
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
  platforms: string[];
  releaseDate: string;
  releaseStatus: "upcoming" | "released";
  publisher: string;
  cover: { src: string; alt: string; credit: string; sourceUrl: string };
  trailer?: { youtubeId: string; title: string; publishedAt: string };
  publishedAt: string;
  updatedAt: string;
  verifiedAt: string;
  sources: GuideSource[];
  sections: GuideSection[];
  articles: GuideArticle[];
}
