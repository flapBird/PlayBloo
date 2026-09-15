import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-09-15T08:00:00+08:00", updatedAt: "2026-09-15T08:00:00+08:00" };
export const marvelsWolverine: GuideTopic = {
  slug: "marvels-wolverine", name: "Marvel’s Wolverine", officialName: "Marvel’s Wolverine",
  title: "Marvel’s Wolverine PS5 Guide: Release Date, Features & First Steps",
  description: "Start here for Marvel’s Wolverine on PS5: September 15 release details, gameplay features, accessibility options and what to check before playing.",
  status: "published", platforms: ["PlayStation 5"], releaseDate: "2026-09-15", releaseStatus: "released", publisher: "Sony Interactive Entertainment",
  cover: { src: "/images/guides/marvels-wolverine.webp", alt: "Wolverine with his claws extended against a yellow background", credit: "Official promotional artwork © Marvel / Sony Interactive Entertainment", sourceUrl: "https://www.playstation.com/en-us/games/marvels-wolverine/" },
  ...dates, verifiedAt: "2026-09-15",
  sources: [
    { id: "product", label: "PlayStation — Wolverine game details and FAQ", url: "https://www.playstation.com/en-us/games/marvels-wolverine/" },
    { id: "features", label: "Insomniac on PlayStation Blog — gameplay and launch features", url: "https://blog.playstation.com/?p=422270" },
  ],
  sections: [
    { id: "overview", title: "What is Marvel’s Wolverine?", paragraphs: ["Insomniac’s Wolverine is a single-player, story-led action adventure for PS5. PlayStation says it is not an open-world game. PlayBloo covers it through guides; there is no playable browser version here."], sourceIds: ["product"] },
    { id: "release-date", title: "Wolverine PS5 release date and release time", releaseFacts: true, paragraphs: ["The official release date is September 15, 2026. For an exact unlock time, check your regional store or purchased game’s countdown; we have not verified a universal release hour."], sourceIds: ["product"] },
    { id: "editions", title: "Platforms and editions", paragraphs: ["PlayStation lists Standard and Digital Deluxe editions, plus a Deluxe upgrade. The game is PS5-only in the verified listing, with PS5 Pro enhancements; no PS4 edition is offered."], sourceIds: ["product"] },
    { id: "combat", title: "Combat and exploration", paragraphs: ["Insomniac describes close-range claw combat, equipable Special Techniques and optional Nightmare Door challenges. Exploration also includes whisky-bottle memories and materials for suits."], sourceIds: ["features"] },
    { id: "launch-questions", title: "File size, performance, length and trophies", table: { headers: ["Search question", "Current coverage"], rows: [["Wolverine PS5 file size", "We have not verified a final install size. Check the console’s download details and allow room for updates."], ["Wolverine PS5 performance mode", "PS5 Pro PSSR support is confirmed. Exact mode names, resolutions and frame-rate targets are not verified here."], ["Wolverine PS5 length and missions", "We have not measured campaign length or verified a complete mission list."], ["Wolverine PS5 trophies", "A complete trophy guide and missable-trophy checklist are not verified here."]] }, paragraphs: ["These questions need evidence from the released game. We will publish separate guides when they can provide tested answers."], sourceIds: ["product"] },
    { id: "faq", title: "Wolverine PS5 FAQ", bullets: ["New Game Plus and Mission Replay are announced launch features.", "Photo Mode is available with the day-one update.", "The linked first-session guide explains settings worth checking before combat."], sourceIds: ["features"] },
  ],
  articles: [{
    slug: "settings-and-accessibility", shortTitle: "First-session settings & accessibility", category: "Getting started",
    title: "Wolverine PS5 Settings & Accessibility: What to Check First",
    description: "Prepare your first Wolverine PS5 session with a practical checklist for visual comfort, game speed, audio, violence settings and the day-one update.",
    status: "published", ...dates, relatedSlugs: [],
    sections: [
      { id: "update", title: "Start with the game update", paragraphs: ["Insomniac identifies Photo Mode as requiring the day-one update. Let installation and updates finish before comparing the options on your console with a launch feature list."], sourceIds: ["features"] },
      { id: "accessibility", title: "Accessibility options to look for", bullets: ["High Contrast visuals", "English Audio Description", "Global Game Speed", "Strong Haptic Signals", "Blood and dismemberment controls", "English adult-language filtering"], paragraphs: ["These options come from Insomniac’s published feature overview. This guide is based on that announcement, not a hands-on settings review."], sourceIds: ["features"] },
      { id: "first-session", title: "A practical first-session checklist", paragraphs: ["Our suggested setup: begin by making subtitles readable at your normal seating distance, then adjust audio so dialogue is clear. If camera motion is uncomfortable, review the motion-related settings before a long session.", "Change one option at a time and try it in a low-pressure encounter. That makes it easier to identify which adjustment helps. Use game-speed and visibility options if they suit your needs; there is no benefit to copying someone else’s settings without checking how they feel to you."] },
      { id: "difficulty", title: "Difficulty and performance: what this guide does not establish", paragraphs: ["We have not verified difficulty names, whether settings affect trophy eligibility, or final performance-mode targets. Check the in-game descriptions before committing to a trophy run. Keep a note of your console model and game version when comparing performance reports.", "This page provides a starting checklist. It does not recommend an untested ‘best’ graphics preset or guarantee a particular frame rate."] },
    ],
  }],
};
