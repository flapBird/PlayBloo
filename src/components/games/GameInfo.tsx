import { CalendarDays, Coins, Gamepad2, Monitor, Radio, Shapes, UserRoundCog, Wrench } from "lucide-react";
import type { Game, GamePlayMode } from "@/lib/types";

function humanize(value: string) { return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
export function GameInfo({ game, playMode }: { game: Game; playMode: GamePlayMode }) {
  const rows: { icon: typeof Monitor; label: string; value?: string | null }[] = [
    { icon: UserRoundCog, label: "Developer", value: game.developer }, { icon: UserRoundCog, label: "Publisher", value: game.publisher },
    { icon: CalendarDays, label: "Released", value: game.release_date ? new Date(game.release_date).toLocaleDateString("en") : null },
    { icon: CalendarDays, label: "Last updated", value: game.last_updated_at ? new Date(game.last_updated_at).toLocaleDateString("en") : null },
    { icon: Monitor, label: "Platforms", value: game.platforms?.join(", ") }, { icon: Gamepad2, label: "Play mode", value: playMode === "embedded" ? "Playable here" : playMode === "external" ? "External" : "Unavailable" },
    { icon: Coins, label: "Monetization", value: game.monetization ? humanize(game.monetization) : null }, { icon: Radio, label: "Status", value: game.development_status ? humanize(game.development_status) : null },
    { icon: Shapes, label: "Graphics", value: game.graphics }, { icon: Gamepad2, label: "Multiplayer", value: game.multiplayer }, { icon: Wrench, label: "Engine", value: game.engine },
  ].filter((row) => row.value);
  if (!rows.length) return null;
  return <section className="rounded-2xl border bg-card p-4"><h2 className="mb-3 font-bold">Game Info</h2><dl className="grid gap-x-5 gap-y-3 sm:grid-cols-2">{rows.map(({ icon: Icon, label, value }) => <div key={label} className="flex min-w-0 items-start gap-2"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div className="min-w-0"><dt className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="break-words text-sm font-semibold">{value}</dd></div></div>)}</dl></section>;
}
