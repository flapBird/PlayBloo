export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 pb-8 pt-6 md:pt-8" aria-label="Loading games" aria-busy="true">
      <div className="mb-6 space-y-3 md:mb-8">
        <div className="h-11 w-60 rounded-xl bg-muted animate-pulse" />
        <div className="h-6 w-full max-w-3xl rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="aspect-[16/10] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}
