import Image from "next/image";
import { notFound } from "next/navigation";
import { GuideBreadcrumbs, GuideByline, GuideSchema, GuideSections, GuideSidebar, GuideSources, RelatedGuides } from "@/components/guides/GuideContent";
import { getGuideArticle, getGuideTopic, getGuideTopics, guideMetadata } from "@/lib/guides";
import styles from "@/components/guides/guides.module.css";

type Props = { params: Promise<{ slug: string; articleSlug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getGuideTopics().flatMap((topic) => topic.articles.filter((article) => article.status !== "draft").map((article) => ({ slug: topic.slug, articleSlug: article.slug })));
}

async function resolveArticle(params: Props["params"]) {
  const { slug, articleSlug } = await params;
  const topic = getGuideTopic(slug);
  if (!topic) notFound();
  const article = getGuideArticle(topic, articleSlug);
  if (!article) notFound();
  return { topic, article };
}

export async function generateMetadata({ params }: Props) {
  const { topic, article } = await resolveArticle(params);
  return guideMetadata(topic, article);
}

export default async function GuideArticlePage({ params }: Props) {
  const { topic, article } = await resolveArticle(params);
  return <div className={styles.page}>
    <GuideBreadcrumbs topic={topic} article={article} />
    <article>
      <header className={styles.articleHeader}>
        <span className={styles.eyebrow}>{article.category} · {topic.platforms.join(" / ")}</span>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <GuideByline publishedAt={article.publishedAt} updatedAt={article.updatedAt} />
      </header>
      {article.status === "preview" && <div className={styles.previewBanner}><strong>Coverage in preparation.</strong> This page is not a tested Switch 2 walkthrough. Published guides below cover confirmed pre-release information.</div>}
      <div className={styles.body}>
        <div>
          <figure className={styles.articleCover}><Image src={topic.cover.src} alt={topic.cover.alt} fill preload sizes="(max-width: 1023px) 100vw, 800px" /><figcaption className={styles.imageCredit}>© Nintendo</figcaption></figure>
          <div className={styles.articleBody}><GuideSections topic={topic} sections={article.sections} /></div>
          <GuideSources topic={topic} sections={article.sections} />
        </div>
        <GuideSidebar topic={topic} sections={article.sections} article={article} />
      </div>
    </article>
    <RelatedGuides topic={topic} article={article} />
    <GuideSchema topic={topic} article={article} />
  </div>;
}
