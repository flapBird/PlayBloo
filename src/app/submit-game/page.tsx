import type { Metadata } from "next";
import { Link2, SearchCheck, ShieldCheck } from "lucide-react";
import { SubmitGameForm } from "./SubmitGameForm";

export const metadata: Metadata = {
  title: "Submit a Game",
  description: "Suggest a browser or indie game for editorial review on PlayBloo.",
  alternates: { canonical: "/submit-game" },
};

export default function SubmitGamePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Help us discover what&apos;s next</p>
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">Submit a game</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">Share one trusted source URL. We&apos;ll collect available facts and an editor will verify them before publishing.</p>
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[[Link2, "One source URL"], [SearchCheck, "Metadata pre-check"], [ShieldCheck, "Human review"]].map(([Icon, label]) => {
          const Component = Icon as typeof Link2;
          return <div key={label as string} className="flex items-center justify-center gap-2 rounded-2xl border bg-muted/30 px-3 py-3 text-sm font-bold"><Component className="h-4 w-4 text-primary" />{label as string}</div>;
        })}
      </div>
      <SubmitGameForm />
    </div>
  );
}
