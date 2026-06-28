export default function GameLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-40 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
