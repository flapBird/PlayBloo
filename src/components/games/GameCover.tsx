"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { shouldBypassImageOptimization } from "@/lib/game-utils";

interface GameCoverProps {
  src: string;
  alt?: string;
  eager?: boolean;
  sizes: string;
  className?: string;
}

/**
 * Cover image with a built-in loading skeleton: a shimmer overlay paints the
 * media box while the (lazy) bytes are in flight, then removes itself entirely
 * once the image has decoded — so nothing animates on a settled page.
 */
export function GameCover({ src, alt = "", eager = false, sizes, className = "" }: GameCoverProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can finish before hydration, so onLoad alone is not enough.
  useEffect(() => {
    if (imgRef.current?.complete && (imgRef.current?.naturalWidth ?? 0) > 0) setLoaded(true);
  }, []);

  return (
    <span className={`cover-shimmer ${loaded ? "is-loaded" : ""} ${className}`} aria-hidden="true">
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        unoptimized={shouldBypassImageOptimization(src)}
        className="object-cover"
        sizes={sizes}
      />
    </span>
  );
}
