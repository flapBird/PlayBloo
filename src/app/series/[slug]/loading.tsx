export default function SeriesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full max-w-lg bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}
