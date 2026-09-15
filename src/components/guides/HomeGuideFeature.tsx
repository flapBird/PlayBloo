import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGuideTopics, guidePath } from "@/lib/guides";
import styles from "./guides.module.css";

export function HomeGuideFeature() {
  const topic = getGuideTopics()[0];
  if (!topic) return null;
  return <Link href={guidePath(topic)} className={styles.homeFeature}>
    <div className={styles.homeFeatureImage}><Image src={topic.cover.src} alt={topic.cover.alt} fill sizes="(max-width: 1023px) 100vw, 290px" /></div>
    <div className={styles.homeFeatureCopy}><h2>{topic.name}</h2><p>Release details, confirmed changes and what to know before you play.</p><span className={styles.cardBottom}>Explore the guide <ArrowRight size={14} /></span></div>
  </Link>;
}
