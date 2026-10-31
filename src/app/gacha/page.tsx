import type { Metadata } from "next";
import { GachaGame } from "@/components/gacha/GachaGame";
import { GACHA_PACKS_PER_DAY } from "@/lib/constants";
import { GACHA_RARITIES, getGachaData } from "@/lib/gacha";

export const revalidate = 900;

// Rendered title stays inside the AGENTS.md 60-char limit including the
// " | PlayBloo" suffix; the description stays inside 160 chars.
export const metadata: Metadata = {
  title: "Game Gacha: Draw Free Browser Games Daily",
  description: "Draw free browser games as collectible cards. Three packs a day, four rarity tiers with published odds, and a collection saved in your browser.",
  alternates: { canonical: "/gacha" },
  openGraph: {
    title: "Game Gacha: Draw Free Browser Games Daily | PlayBloo",
    description: "Draw free browser games as collectible cards. Three packs a day, four rarity tiers with published odds, and a collection saved in your browser.",
    url: "/gacha",
    type: "website",
  },
};

export default async function GachaPage() {
  const { pool, theme, totalGames } = await getGachaData();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Game Gacha</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Every game on PlayBloo is a collectible card. Open {GACHA_PACKS_PER_DAY} free packs a day, keep what you pull, and jump straight from a card into the game.
          {theme ? ` Today's themed pack spotlights ${theme.name} games.` : ""}
        </p>
      </header>

      <GachaGame pool={pool} theme={theme} totalGames={totalGames} />

      <section aria-labelledby="gacha-rules" className="mt-12 space-y-4 rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 id="gacha-rules" className="text-lg font-extrabold tracking-tight">How it works, and the odds</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Three free packs per day, refilled at midnight in your device&apos;s timezone. Each pack holds 3–5 games.</li>
          {theme && (
            <li>
              The day&apos;s final pack is the themed pack and draws entirely from <strong className="text-foreground">{theme.name}</strong>; the featured category rotates daily. Rarity odds apply within it as far as the category pool allows.
            </li>
          )}
          <li>Every standard-pack card rolls its rarity with the published odds below, and a pack never ends without at least one Rare.</li>
          <li>A card&apos;s rarity reflects real interest across PlayBloo: games are ranked by total plays, and the top 3% of the catalogue are Legendary, the next 12% Epic, the next 25% Rare, the rest Common.</li>
          <li>Pulls prefer games you have not collected yet. When a tier runs dry you can pull duplicates, which show the times pulled.</li>
        </ul>
        <div className="overflow-x-auto" role="region" aria-label="Rarity odds table" tabIndex={0}>
          <table className="w-full min-w-80 text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-2 pr-4">Rarity</th>
                <th scope="col" className="py-2 pr-4">Chance per card</th>
                <th scope="col" className="py-2">What it means</th>
              </tr>
            </thead>
            <tbody>
              {GACHA_RARITIES.map((rarity) => (
                <tr key={rarity.id} className="border-b last:border-0">
                  <th scope="row" className="py-2 pr-4 font-bold">{rarity.label}</th>
                  <td className="py-2 pr-4 tabular-nums">{rarity.odds}%</td>
                  <td className="py-2 text-muted-foreground">
                    {rarity.id === "legendary" && "Top 3% most-played games in the catalogue"}
                    {rarity.id === "epic" && "Next 12% of the catalogue by plays"}
                    {rarity.id === "rare" && "Next 25% of the catalogue by plays"}
                    {rarity.id === "common" && "The remaining 60% of the catalogue"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Your collection is saved in this browser only — there is no account, and clearing site data resets it. Rarity bands shift slowly as play counts change, so a card keeps the rarity it had when you pulled it. This is a discovery feature, not gambling: every pack is free, there is nothing to buy, and every card leads to a game you can actually play.
        </p>
      </section>
    </div>
  );
}
