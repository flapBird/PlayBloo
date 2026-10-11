import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestGuideTopic, guidePath } from "@/lib/guides";
import styles from "./guides.module.css";

export function HomeGuideFeature() {
  const topic = getLatestGuideTopic();
  if (!topic) return null;
  return <Link href={guidePath(topic)} prefetch={false} className={styles.homeFeature}>
    <div className={styles.homeFeatureImage}><Image src={topic.cover.src} alt={topic.cover.alt} fill loading="eager" sizes="(max-width: 1023px) 100vw, 290px" /></div>
    <div className={styles.homeFeatureCopy}><h2>{topic.name}</h2><p>{topic.description}</p><span className={styles.cardBottom}>Explore the guide <ArrowRight size={14} /></span></div>
  </Link>;
}
