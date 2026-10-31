/** Branded no-cover tile: first letter on the PlayBloo gradient. */
export function CoverFallback({ title }: { title: string }) {
  const letter = title.trim().charAt(0).toUpperCase() || "?";
  return (
    <span className="cover-fallback" aria-hidden="true">
      <span className="cover-fallback-letter">{letter}</span>
    </span>
  );
}
