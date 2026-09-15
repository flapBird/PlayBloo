import { notFound } from "next/navigation";
import { GuideBreadcrumbs, GuideByline, GuideHero, GuideLibrary, GuideSchema, GuideSections, GuideSidebar } from "@/components/guides/GuideContent";
import { getGuideTopic, getGuideTopics, guideMetadata } from "@/lib/guides";
import styles from "@/components/guides/guides.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getGuideTopics().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props) {
  const topic = getGuideTopic((await params).slug);
  if (!topic) notFound();
  return guideMetadata(topic);
}

export default async function GuideHubPage({ params }: Props) {
  const topic = getGuideTopic((await params).slug);
  if (!topic) notFound();
  return <div className={styles.page}>
    <GuideBreadcrumbs topic={topic} />
    <GuideHero topic={topic} />
    <GuideByline publishedAt={topic.publishedAt} updatedAt={topic.updatedAt} />
    <GuideLibrary topic={topic} />
    <div className={styles.body}>
      <div><GuideSections topic={topic} sections={topic.sections} /></div>
      <GuideSidebar topic={topic} sections={topic.sections} />
    </div>
    <GuideSchema topic={topic} />
  </div>;
}
