import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatGuideDate, getGuideArticles, GUIDE_AUTHOR, guidePath } from "@/lib/guides";
import type { GuideArticle, GuideSection, GuideTopic } from "@/lib/guides/types";
import { GuideTrailer } from "./GuideTrailer";
import styles from "./guides.module.css";

export function GuideBreadcrumbs({ topic, article }: { topic?: GuideTopic; article?: GuideArticle }) {
  const items = [
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    ...(topic ? [{ name: topic.name, url: guidePath(topic) }] : []),
    ...(topic && article ? [{ name: article.shortTitle, url: guidePath(topic, article) }] : []),
  ];
  return (
    <>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <ol>{items.map((item, index) => <li key={item.url}>
          {index > 0 && <ChevronRight size={12} aria-hidden="true" />}
          {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.url}>{item.name}</Link>}
        </li>)}</ol>
      </nav>
      <BreadcrumbJsonLd items={items.map((item) => ({ ...item, url: `${SITE_URL}${item.url}` }))} />
    </>
  );
}

export function GuideSchema({ topic, article }: { topic: GuideTopic; article?: GuideArticle }) {
  const content = article || topic;
  const url = `${SITE_URL}${guidePath(topic, article)}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: content.title,
    description: content.description,
    image: `${SITE_URL}${topic.cover.src}`,
    datePublished: content.publishedAt,
    dateModified: content.updatedAt,
    inLanguage: "en",
    author: { "@type": "Organization", ...GUIDE_AUTHOR },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "CollectionPage", "@id": `${SITE_URL}/guides` },
    about: { "@type": "VideoGame", "@id": `${SITE_URL}${guidePath(topic)}#game`, name: topic.officialName, gamePlatform: topic.platforms, publisher: { "@type": "Organization", name: topic.publisher } },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}

export function GuideByline({ updatedAt, publishedAt }: { updatedAt: string; publishedAt: string }) {
  return <div className={styles.byline}>
    <Link href="/about">{GUIDE_AUTHOR.name}</Link><span aria-hidden="true">·</span>
    <span>Published <time dateTime={publishedAt}>{formatGuideDate(publishedAt)}</time></span>
    <span>Updated <time dateTime={updatedAt}>{formatGuideDate(updatedAt)}</time></span>
  </div>;
}

export function GuideHero({ topic, listing = false }: { topic: GuideTopic; listing?: boolean }) {
  const content = <>
    <div className={styles.heroCopy}>
      {listing ? <h2>{topic.name}</h2> : <h1>{topic.title}</h1>}
      <p>{topic.description}</p>
      <div className={styles.heroMeta}>
        <div className={styles.chips}><span>{topic.platforms.join(" · ")}</span><span><CalendarDays size={13} />{formatGuideDate(topic.releaseDate)}</span></div>
        {listing ? <ArrowUpRight className={styles.topicArrow} size={19} aria-hidden="true" /> : getGuideArticles(topic).length > 0 ? <Link href="#guide-library" className={styles.heroGuideLink}>Find your guide<ArrowRight size={16} /></Link> : null}
      </div>
    </div>
    <div className={styles.heroImage}><Image src={topic.cover.src} style={topic.cover.fit ? { objectFit: topic.cover.fit, objectPosition: "center" } : undefined} alt={listing ? "" : topic.cover.alt} fill preload={!listing} sizes={listing ? "(max-width: 767px) 120px, 280px" : "(max-width: 767px) 100vw, 380px"} /></div>
  </>;
  return listing
    ? <Link href={guidePath(topic)} aria-label={`Explore ${topic.name} guides`} className={`${styles.hero} ${styles.topicCard}`}>{content}</Link>
    : <div className={`${styles.hero} ${styles.detailHero}`}>{content}</div>;
}

export function GuideCard({ topic, article }: { topic: GuideTopic; article: GuideArticle }) {
  return <Link href={guidePath(topic, article)} className={styles.guideCard}>
    <div className={styles.cardImage}><Image src={topic.cover.src} style={topic.cover.fit ? { objectFit: topic.cover.fit, objectPosition: "center" } : undefined} alt="" fill sizes="(max-width: 767px) 88px, 120px" /></div>
    <div className={styles.cardCopy}>
      <div className={styles.cardTop}><span className={styles.gameName}>{topic.name}</span><ArrowUpRight size={16} /></div>
      <h3>{article.shortTitle}</h3>
      <p>{article.description}</p>
    </div>
  </Link>;
}

export function GuideLibrary({ topic }: { topic: GuideTopic }) {
  if (!getGuideArticles(topic).length) return null;
  const preview = topic.articles.find((article) => article.status === "preview" && article.slug === "walkthrough");
  return <section id="guide-library" className={styles.library} aria-labelledby="library-heading">
    <div className={styles.sectionHeading}><div><h2 id="library-heading">Choose your next read</h2></div><span className={styles.count}>{getGuideArticles(topic).length} {getGuideArticles(topic).length === 1 ? "guide" : "guides"}</span></div>
    <div className={styles.cardGrid}>{getGuideArticles(topic).map((article) => <GuideCard key={article.slug} topic={topic} article={article} />)}</div>
    {preview && <div className={styles.previewNote}><BookOpen size={19} /><div><strong>Looking for a walkthrough?</strong><p>Switch 2 routes are in preparation and have not been tested yet.</p></div><Link href={guidePath(topic, preview)}>Coverage status <ArrowRight size={14} /></Link></div>}
  </section>;
}

export function GuideFacts({ topic }: { topic: GuideTopic }) {
  return <dl className={styles.facts}>
    <div><dt>Release date</dt><dd><time dateTime={topic.releaseDate}>{formatGuideDate(topic.releaseDate)}</time></dd></div>
    <div><dt>Platform</dt><dd>{topic.platforms.join(", ")}</dd></div>
    <div><dt>Publisher</dt><dd>{topic.publisher}</dd></div>
    <div><dt>Status at last check</dt><dd>{topic.releaseStatus === "upcoming" ? "Upcoming" : "Released"}</dd></div>
  </dl>;
}

export function GuideSections({ topic, sections }: { topic: GuideTopic; sections: GuideSection[] }) {
  return <div className={styles.prose}>
    {sections.map((section) => <section key={section.id} id={section.id}>
      <h2>{section.title}</h2>
      {section.puzzle && <>
        <figure className={styles.puzzleImage}>
          <Image src={section.puzzle.image.src} alt={section.puzzle.image.alt} width={section.puzzle.image.width} height={section.puzzle.image.height} sizes="(max-width: 1023px) 100vw, 800px" />
          <figcaption>{section.puzzle.image.caption}</figcaption>
        </figure>
        <p><strong>Gentle hint:</strong> {section.puzzle.hint}</p>
        <details className={styles.puzzleHint}><summary>Show a stronger hint</summary><p>{section.puzzle.furtherHint}</p></details>
        <details className={styles.puzzleHint}><summary>Reveal the full solution (spoilers)</summary><ol>{section.puzzle.solution.map((step) => <li key={step}>{step}</li>)}</ol></details>
      </>}
      {section.releaseFacts && <GuideFacts topic={topic} />}
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {section.table && <div className={styles.tableScroll} role="region" aria-label={`${section.title} comparison table`} tabIndex={0}><table>
        <thead><tr>{section.table.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>{section.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={index}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table></div>}
      {section.trailer && topic.trailer && <GuideTrailer trailer={topic.trailer} cover={topic.cover} />}
    </section>)}
  </div>;
}

export function GuideSidebar({ topic, sections, article }: { topic: GuideTopic; sections: GuideSection[]; article?: GuideArticle }) {
  return <aside className={styles.sidebar}>
    <nav aria-label="On this page"><span className={styles.eyebrow}>On this page</span><ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>

    {article && <Link className={styles.backToHub} href={guidePath(topic)}><BookOpen size={20} /><span>Explore all {topic.name} guides</span><ArrowRight size={15} /></Link>}
  </aside>;
}

export function RelatedGuides({ topic, article }: { topic: GuideTopic; article: GuideArticle }) {
  const related = article.relatedSlugs.flatMap((slug) => {
    const item = getGuideArticles(topic).find((candidate) => candidate.slug === slug);
    return item ? [item] : [];
  });
  if (!related.length) return null;
  return <section className={styles.related}><div className={styles.sectionHeading}><h2>Keep exploring</h2><Link href={guidePath(topic)}>All guides <ArrowRight size={14} /></Link></div><div className={styles.cardGrid}>{related.map((item) => <GuideCard key={item.slug} topic={topic} article={item} />)}</div></section>;
}
