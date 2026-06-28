export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="h-9 w-64 bg-muted rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}
