"use client";

import { RotateCcw } from "lucide-react";

export default function CategoryError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-bold">Games couldn’t be loaded</h2>
      <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
      <button type="button" onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
        <RotateCcw className="h-4 w-4" />Try again
      </button>
    </div>
  );
}
