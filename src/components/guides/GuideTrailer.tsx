"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";
import type { GuideTopic } from "@/lib/guides/types";
import styles from "./guides.module.css";

export function GuideTrailer({ trailer, cover }: Pick<GuideTopic, "trailer" | "cover">) {
  const [playing, setPlaying] = useState(false);
  const { youtubeId, title } = trailer;
  return (
    <div>
      <div className={styles.trailer}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
            <Image src={cover.src} alt="" fill sizes="(max-width: 1024px) 100vw, 800px" />
            <span className={styles.trailerOverlay} />
            <span className={styles.playButton}><Play size={22} fill="currentColor" /></span>
            <span className={styles.trailerLabel}>Nintendo’s official trailer</span>
          </button>
        )}
      </div>
      <a className={styles.videoLink} href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer">
        Watch on YouTube <ExternalLink size={13} />
      </a>
    </div>
  );
}
