import type { Metadata } from "next";
import Link from "next/link";
import { FortniteChestCounter } from "@/components/tools/FortniteChestCounter";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

// Rendered title stays inside the AGENTS.md 60-char limit including the
// " | PlayBloo" suffix; the description stays inside 160 chars.
export const metadata: Metadata = {
  title: "Fortnite Chest Counter — Free Online Tracker",
  description:
    "Count Fortnite Treasure Hunters chests as you open them. Free online chest counter with auto-save, batch taps, milestones and live Pirate Token odds.",
  alternates: { canonical: "/tools/fortnite-chest-counter" },
  openGraph: {
    title: "Fortnite Chest Counter — Free Online Tracker | PlayBloo",
    description:
      "Count Fortnite Treasure Hunters chests as you open them. Free online chest counter with auto-save, batch taps, milestones and live Pirate Token odds.",
    url: "/tools/fortnite-chest-counter",
    type: "website",
    images: [{ url: "/images/guides/fortnite-pirate-token.webp", width: 1600, height: 900, alt: "An illustrated Fortnite treasure map on a ship's table" }],
  },
};

// Same press sources the Fortnite Pirate Token guide cites (see
// src/lib/guides/fortnite-pirate-token.ts, where they live as consts).
const epicNews = "https://www.fortnite.com/news/fortnite-treasure-hunters-the-greatest-adventure-of-all-time";
const viceArticle = "https://www.vice.com/en/article/fortnite-pirate-token-drop-rate-confirmed";
const ignArticle = "https://www.ign.com/articles/epic-reveals-drop-rate-for-fortnites-pirate-token-following-pressure-from-fans";

// Epic's published per-chest odds for a normal match, revealed November 7, 2026.
const CHEST_ODDS = [
  { reward: "Weekly Gold Outfit", odds: "1 in 1,562,500", percent: "about 0.000064%" },
  { reward: "Pirate Shop Access (Pirate Token)", odds: "1 in 137,500", percent: "about 0.00073%" },
  { reward: "Weekly Vehicle and Decal", odds: "1 in 7,813", percent: "about 0.013%" },
  { reward: "Weekly Pickaxe or Back Bling", odds: "1 in 568", percent: "about 0.18%" },
  { reward: "Weekly Jam Track", odds: "1 in 391", percent: "about 0.26%" },
  { reward: "Weekly Loading Screen", odds: "1 in 272", percent: "about 0.37%" },
  { reward: "Any Gizmo", odds: "1 in 127", percent: "about 0.79%" },
];

const FAQ = [
  {
    question: "Does Fortnite have a built-in chest counter?",
    answer:
      "No. The in-game Treasure Tab tracks weekly hunt progress, but there is no running tally of how many chests you have opened — which is exactly why players count by hand during the Treasure Hunters mini-season.",
  },
  {
    question: "How many chests does a Pirate Token take?",
    answer:
      "The published odds are 1 in 137,500 per chest in a normal match — an average, not a guarantee. On the announced Treasure Hour Saturdays the token's odds run 1.5× better, or 1 in 91,667. Our drop-rate guide spells out the full math.",
  },
  {
    question: "Where is my chest count saved?",
    answer:
      "In your browser's local storage, on this device only. There is no account and nothing is uploaded; clearing PlayBloo's site data resets the count.",
  },
  {
    question: "Do Treasure Hour boosts apply automatically?",
    answer:
      "No — tap the Treasure Hour ×1.5 toggle while you play during a boosted window. The remaining windows are the Saturdays November 14, 21, 28 and December 5, 2–4 PM ET and 9–11 PM ET, and Epic treats the in-game news tab as the authority for any given Saturday.",
  },
];

export default function FortniteChestCounterPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Free tool</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Fortnite Chest Counter</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Fortnite has no built-in chest counter, so during the Treasure Hunters mini-season players tally their chests
          by hand. Tap the big button as you loot — the count auto-saves in your browser and your live Pirate Token
          odds update with every chest.
        </p>
      </header>

      <FortniteChestCounter />

      <section aria-labelledby="how-to-use" className="mt-12 space-y-4 rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 id="how-to-use" className="text-lg font-extrabold tracking-tight">How to use the chest counter</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Open a Treasure Hunters chest in a normal Fortnite match, then tap <strong className="text-foreground">Opened a chest</strong> here. Loot in Create island or other modes does not roll the published reward table.</li>
          <li>Opened several chests at once after a match? Use the batch <strong className="text-foreground">+5</strong> and <strong className="text-foreground">+10</strong> buttons. Miscounted? <strong className="text-foreground">Undo</strong> takes the last chest back.</li>
          <li>The count saves itself in this browser — close the tab, come back tomorrow, and your total (and today&apos;s count) are still there.</li>
          <li>Playing during a boosted Treasure Hour window? Switch on the <strong className="text-foreground">Treasure Hour ×1.5</strong> toggle and the odds panel recalculates.</li>
        </ol>
      </section>

      <section aria-labelledby="why-track" className="mt-6 space-y-4 rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 id="why-track" className="text-lg font-extrabold tracking-tight">Why players are counting chests right now</h2>
        <p className="text-sm text-muted-foreground">
          Treasure Hunters is the One Piece-themed mini-season inside Fortnite Chapter 7, running November 1 to
          December 5, 2026. Its treasure chests roll a special reward table topped by two ultra-rares: the Weekly Gold
          Outfit and Pirate Shop Access — the Pirate Token that makes nearly every Item Shop cosmetic free for 14 days.
        </p>
        <p className="text-sm text-muted-foreground">
          Epic kept the odds secret until fan pressure got loud, then published the full table on November 7, 2026 —
          and the 1-in-137,500 token became the reason chest-grinding players suddenly needed a way to keep count.
          Our <Link href="/guides/fortnite-pirate-token" className="font-bold text-primary hover:underline">Fortnite Pirate Token guide</Link> covers
          the season, the <Link href="/guides/fortnite-pirate-token/drop-rate" className="font-bold text-primary hover:underline">full odds breakdown</Link> and{" "}
          <Link href="/guides/fortnite-pirate-token/how-to-get" className="font-bold text-primary hover:underline">how to farm chests during Treasure Hours</Link>.
        </p>
      </section>

      <section aria-labelledby="chest-odds" className="mt-6 space-y-4 rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 id="chest-odds" className="text-lg font-extrabold tracking-tight">Official chest reward odds (normal match)</h2>
        <p className="text-sm text-muted-foreground">
          Published by Epic on November 7, 2026 and reported by{" "}
          <a href={viceArticle} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vice</a> and{" "}
          <a href={ignArticle} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">IGN</a>. Each row is the chance that a
          single opened chest drops that reward tier — per chest, not per match. See Epic&apos;s{" "}
          <a href={epicNews} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Treasure Hunters announcement</a> for
          the season itself.
        </p>
        <div className="overflow-x-auto" role="region" aria-label="Official chest reward odds table" tabIndex={0}>
          <table className="w-full min-w-96 text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-2 pr-4">Chest reward</th>
                <th scope="col" className="py-2 pr-4">Odds per chest</th>
                <th scope="col" className="py-2">Roughly 1 chance in…</th>
              </tr>
            </thead>
            <tbody>
              {CHEST_ODDS.map((row) => (
                <tr key={row.reward} className="border-b last:border-0">
                  <th scope="row" className="py-2 pr-4 font-bold">{row.reward}</th>
                  <td className="py-2 pr-4 tabular-nums">{row.odds}</td>
                  <td className="py-2 tabular-nums text-muted-foreground">{row.percent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Odds can change mid-season and Treasure Hour multipliers vary by window; the in-game Treasure Tab is the
          authority for the current values. This page tracks counts, not luck.
        </p>
      </section>

      <section aria-labelledby="faq" className="mt-6 space-y-4 rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 id="faq" className="text-lg font-extrabold tracking-tight">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <h3 className="text-sm font-bold text-foreground">{item.question}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: SITE_NAME, url: SITE_URL },
          { name: "Fortnite Chest Counter", url: `${SITE_URL}/tools/fortnite-chest-counter` },
        ]}
      />
      <JsonLd
        type="Game"
        data={{
          "@type": "WebApplication",
          name: "Fortnite Chest Counter",
          url: `${SITE_URL}/tools/fortnite-chest-counter`,
          description: metadata.description ?? undefined,
          applicationCategory: "GameApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          image: `${SITE_URL}/images/guides/fortnite-pirate-token.webp`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
    </div>
  );
}
