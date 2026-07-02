import { Sparkles } from "lucide-react";

export default function HomeLoading() {
  return (
    <div className="pb-12">
      <div className="container mx-auto px-4 pt-6 space-y-10">
        {/* Section 1 */}
        <section>
          <div className="h-7 w-32 bg-muted rounded animate-pulse mb-5" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="h-7 w-24 bg-muted rounded animate-pulse mb-5" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
