import type { Metadata, MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ocarinaOfTimeRemake } from "./ocarina-of-time-remake";
import type { GuideArticle, GuideTopic } from "./types";

const topics: GuideTopic[] = [ocarinaOfTimeRemake];
export const GUIDE_AUTHOR = { name: "PlayBloo Editorial", url: `${SITE_URL}/about` };
export const GUIDES_DESCRIPTION = "Release dates, gameplay explainers and version comparisons for the games on your radar. Explore PlayBloo’s game guides and official-source coverage.";

export const getGuideTopics = () => topics.filter((topic) => topic.status === "published");
export const getGuideTopic = (slug: string) => getGuideTopics().find((topic) => topic.slug === slug);
export const getGuideArticles = (topic: GuideTopic) => topic.articles.filter((article) => article.status === "published");
export const getGuideArticle = (topic: GuideTopic, slug: string) => topic.articles.find((article) => article.slug === slug && article.status !== "draft");
export const guidePath = (topic: GuideTopic, article?: GuideArticle) => `/guides/${topic.slug}${article ? `/${article.slug}` : ""}`;
export const formatGuideDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(date));
export const getTopicModified = (topic: GuideTopic) => [topic.updatedAt, ...getGuideArticles(topic).map((article) => article.updatedAt)].sort((a, b) => Date.parse(b) - Date.parse(a))[0];

export function guideMetadata(topic: GuideTopic, article?: GuideArticle): Metadata {
  const content = article || topic;
  const title = `${content.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${guidePath(topic, article)}`;
  const images = [{ url: topic.cover.src, width: 1600, height: 1000, alt: topic.cover.alt }];
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: url },
    robots: { index: article ? article.status === "published" : true, follow: true },
    openGraph: { type: "article", title, description: content.description, url, siteName: SITE_NAME, images, publishedTime: content.publishedAt, modifiedTime: content.updatedAt },
    twitter: { card: "summary_large_image", title, description: content.description, images: [topic.cover.src] },
  };
}

export function getGuidesSitemap(): MetadataRoute.Sitemap {
  const publishedTopics = getGuideTopics();
  if (!publishedTopics.length) return [];
  const latest = publishedTopics.map(getTopicModified).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  return [
    { url: `${SITE_URL}/guides`, lastModified: new Date(latest) },
    ...publishedTopics.flatMap((topic) => [
      { url: `${SITE_URL}${guidePath(topic)}`, lastModified: new Date(getTopicModified(topic)) },
      ...getGuideArticles(topic).map((article) => ({ url: `${SITE_URL}${guidePath(topic, article)}`, lastModified: new Date(article.updatedAt) })),
    ]),
  ];
}
