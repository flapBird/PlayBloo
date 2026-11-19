import type { Metadata } from "next";
import Link from "next/link";
import { DownloadTimeCalculator } from "@/components/tools/DownloadTimeCalculator";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

// Rendered title stays inside the AGENTS.md 60-char limit including the
// " | PlayBloo" suffix; the description stays inside 160 chars.
export const metadata: Metadata = {
  title: "Game Download Time Calculator — Free Estimator",
  description:
    "Estimate how long any game download takes — try the GTA 6 launch preset (200 GB) or any file size and speed. Free, in your browser, nothing uploaded.",
  alternates: { canonical: "/tools/download-time-calculator" },
  openGraph: {
    title: "Game Download Time Calculator — Free Estimator | PlayBloo",
    description:
      "Estimate how long any game download takes — try the GTA 6 launch preset (200 GB) or any file size and speed. Free, in your browser, nothing uploaded.",
    url: "/tools/download-time-calculator",
    type: "website",
    images: [{ url: "/images/guides/gta-6-pc-release-date.webp", width: 1600, height: 900, alt: "Police lights flash by a Vice City canal at dusk" }],
  },
};

// Same sources the GTA 6 guides cite for the launch size facts
// (see src/lib/guides/gta-6.ts, where they live as source entries).
const rockstarStorage = "https://support.rockstargames.com/articles/M6h7B5fJZMwG1dnzQkt4Z/grand-theft-auto-vi-installation-requirements";
const playstationGame = "https://www.playstation.com/en-us/games/grand-theft-auto-vi/";

// The published GTA 6 speed table, generated from the same decimal math the
// calculator uses (200 GB × 8,000 Mb ÷ speed).
const GTA_TABLE = [
  { speed: "50 Mbps", time: "About 8 hr 53 min" },
  { speed: "100 Mbps", time: "About 4 hr 27 min" },
  { speed: "300 Mbps", time: "About 1 hr 29 min" },
  { speed: "500 Mbps", time: "About 53 min" },
];

const FAQ = [
  {
    question: "How long does GTA 6 take to download?",
    answer:
      "Rockstar says to allow up to 212 GB of free space; the exact transfer size shows in your console's download queue. On the 200 GB preset, the estimate is about 4 hr 27 min at 100 Mbps and about 1 hr 29 min at 300 Mbps — enter your own queue size and speed above for a closer number.",
  },
  {
    question: "Why is my actual download slower than the estimate?",
    answer:
      "Launch-week server congestion, background updates on the console, Wi-Fi instead of Ethernet and speed-test differences between regions all move the real number. Treat the estimate as a planning figure, not a promise.",
  },
  {
    question: "Does the estimate include installation?",
    answer:
      "No. Consoles verify and copy files after the transfer finishes, which adds time on top — especially on slower drives. The calculator measures the download itself.",
  },
  {
    question: "What file size should I use for other games?",
    answer:
      "Check the game's store page or your download queue for its transfer size, then enter it above. The presets cover common install sizes, and the GTA 6 preset (200 GB) reflects the launch window's storage guidance.",
  },
];

export default function DownloadTimeCalculatorPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Free tool</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Game Download Time Calculator</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Enter a file size and your connection speed to estimate any game download. The GTA 6 launch preset
          (200 GB) is ready to go — everything runs in your browser, no account, nothing uploaded.
        </p>
      </header>

      <DownloadTimeCalculator showToolLink={false} />

      <section aria-labelledby="how-to-use" className="mt-12 space-y-4 rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 id="how-to-use" className="text-lg font-extrabold tracking-tight">How to use the download time calculator</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Type your download size in GB, or tap a preset — <strong className="text-foreground">GTA 6 · 200 GB</strong> reflects Rockstar&apos;s launch storage guidance as a working transfer estimate.</li>
          <li>Run a speed test, then enter the result in Mbps. Use the speed your console actually gets, not your plan&apos;s advertised top speed.</li>
          <li>Read the estimate: hours and minutes for the transfer at a steady speed. Change either input and it recalculates instantly.</li>
          <li>For the closest match, use the transfer size your console&apos;s download queue shows — store listings quote install space, which includes room the installer needs.</li>
        </ol>
      </section>

      <section aria-labelledby="gta-preset" className="mt-6 space-y-4 rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 id="gta-preset" className="text-lg font-extrabold tracking-tight">The GTA 6 preset: launch size and download times</h2>
        <p className="text-sm text-muted-foreground">
          GTA 6 came out on November 19, 2026 on PS5 and Xbox Series X|S. Rockstar&apos;s installation guidance asks
          for up to 212 GB of free space, and PlayStation recommends clearing 212 GB on PS5 — free space is the room
          the installer needs, so the preset uses 200 GB as a working transfer estimate. The times below come from
          the same math as the calculator:
        </p>
        <div className="overflow-x-auto" role="region" aria-label="GTA 6 download time table" tabIndex={0}>
          <table className="w-full min-w-96 text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-2 pr-4">Download speed</th>
                <th scope="col" className="py-2">Time for 200 GB</th>
              </tr>
            </thead>
            <tbody>
              {GTA_TABLE.map((row) => (
                <tr key={row.speed} className="border-b last:border-0">
                  <th scope="row" className="py-2 pr-4 font-bold">{row.speed}</th>
                  <td className="py-2 tabular-nums">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Size guidance from{" "}
          <a href={rockstarStorage} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">Rockstar&apos;s installation requirements</a> and{" "}
          <a href={playstationGame} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">PlayStation&apos;s GTA VI page</a>.
          Console storage says nothing about a PC version — the PC release remains unannounced.
        </p>
        <p className="text-sm text-muted-foreground">
          Planning a purchase or a reinstall? The{" "}
          <Link href="/guides/gta-6" className="font-bold text-primary hover:underline">GTA 6 launch guide</Link> covers
          the release, platforms and reviews, and the{" "}
          <Link href="/guides/gta-6/pre-order" className="font-bold text-primary hover:underline">buying guide</Link> details
          editions, prices and the boxed download code — with this calculator embedded beside its storage notes.
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
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Game Download Time Calculator", url: `${SITE_URL}/tools/download-time-calculator` },
        ]}
      />
      <JsonLd
        type="Game"
        data={{
          "@type": "WebApplication",
          name: "Game Download Time Calculator",
          url: `${SITE_URL}/tools/download-time-calculator`,
          description: metadata.description ?? undefined,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          image: `${SITE_URL}/images/guides/gta-6-pc-release-date.webp`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
    </div>
  );
}
