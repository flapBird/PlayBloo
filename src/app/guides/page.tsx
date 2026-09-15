import type { Metadata } from "next";
import { GuideBreadcrumbs, GuideCard, GuideHero } from "@/components/guides/GuideContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGuideArticles, getGuideTopics, guidePath, GUIDES_DESCRIPTION } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import styles from "@/components/guides/guides.module.css";

const title = "Game Guides, Release Dates & Comparisons";
const cover = getGuideTopics()[0]?.cover;
export const metadata: Metadata = {
  title,
  description: GUIDES_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: { type: "website", title: `${title} | ${SITE_NAME}`, description: GUIDES_DESCRIPTION, url: `${SITE_URL}/guides`, siteName: SITE_NAME, images: cover ? [{ url: cover.src, width: 1600, height: 1000, alt: cover.alt }] : [] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description: GUIDES_DESCRIPTION, images: cover ? [cover.src] : [] },
};

export default function GuidesPage() {
  const topics = getGuideTopics();
  const latest = topics.flatMap((topic) => getGuideArticles(topic).map((article) => ({ topic, article })))
    .sort((a, b) => Date.parse(b.article.updatedAt) - Date.parse(a.article.updatedAt));
  return <div className={styles.page}>
    <GuideBreadcrumbs />
    <header className={styles.indexHeading}>
      <h1>Game Guides</h1>
      <p>Release dates, beta access, and help getting started with your next game.</p>
    </header>
    <section aria-label="Game guide hubs" className="space-y-5">{topics.map((topic) => <GuideHero key={topic.slug} topic={topic} listing />)}</section>
    <section className={styles.latest} aria-labelledby="latest-guides">
      <div className={styles.sectionHeading}><div><h2 id="latest-guides">Latest Updates</h2></div><span className={styles.count}>{latest.length} articles</span></div>
      <div className={styles.cardGrid}>{latest.map(({ topic, article }) => <GuideCard key={`${topic.slug}/${article.slug}`} topic={topic} article={article} />)}</div>
    </section>
    <JsonLd type="CollectionPage" data={{
      name: title, description: GUIDES_DESCRIPTION, url: `${SITE_URL}/guides`,
      mainEntity: { "@type": "ItemList", itemListElement: topics.map((topic, index) => ({ "@type": "ListItem", position: index + 1, name: topic.name, url: `${SITE_URL}${guidePath(topic)}` })) },
    }} />
  </div>;
}
