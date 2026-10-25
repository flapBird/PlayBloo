/**
 * One-shot (and re-runnable) updater for category SEO copy.
 *
 * For every category below it rewrites the keyword-focused meta_title,
 * meta_description and on-page description, attaches the editorial source
 * the copy was checked against, then flips content_verified so the public
 * category pages actually serve those fields
 * (src/app/category/[slug]/page.tsx only uses them when content_verified).
 *
 * Workflow for a NEW category keyword: insert the row in `categories`
 * (name, slug, sort_order), assign games via game_categories, add entries to
 * CATEGORY_SEO and CATEGORY_SOURCES here, run
 * `node scripts/update-category-seo.mjs`. The
 * sidebar, mobile menu, footer, /category index and sitemap pick the slug up
 * automatically once it holds MIN_INDEXABLE_CATEGORY_GAMES (3) published
 * games.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (env or .env.local).
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = { ...process.env };
for (const file of [".env", ".env.local"]) {
  try {
    for (const line of readFileSync(new URL(`../${file}`, import.meta.url), "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !(match[1] in env)) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // missing file is fine as long as the env vars are already set
  }
}

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (env or .env.local)");
  process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CATEGORY_SEO = {
  action: {
    meta_title: "Action Games – Play Free Online Action Games",
    meta_description:
      "Play the best free action games online. Fast-paced shooting, fighting and platformer action games with no download — new games added weekly.",
    description:
      "Fast, reflex-driven browser games: shooters, fighters and platformers where timing decides everything. Pick a free action game and jump straight in — everything plays instantly in your browser.",
  },
  adventure: {
    meta_title: "Adventure Games – Play Free Online Adventure Games",
    meta_description:
      "Play free adventure games online. Explore mysterious worlds, solve puzzles and go on epic quests right in your browser.",
    description:
      "Explore new worlds, gather treasures and untangle stories in free adventure games. Point-and-click quests, platform adventures and open-world exploration — no download needed.",
  },
  arcade: {
    meta_title: "Arcade Games – Play Free Online Arcade Games",
    meta_description:
      "Play free arcade games online. Classic high-score chases and modern one-button challenges, playable instantly in your browser.",
    description:
      "Simple controls, instant restarts and a score to beat — arcade games are all about mastering the basics. Play free classic and modern arcade games online.",
  },
  "board-game": {
    meta_title: "Board Games – Play Free Online Board Games",
    meta_description:
      "Play classic board games online for free — chess, checkers, dominoes and more, with no downloads or sign-ups needed.",
    description:
      "Classic board games reimagined for the browser: chess, checkers, dominoes and other table classics you can play free against the computer or a friend.",
  },
  card: {
    meta_title: "Card Games – Play Free Online Card Games",
    meta_description:
      "Play free card games online — solitaire, poker, blackjack and deck-builders you can start playing instantly in your browser.",
    description:
      "Shuffle up and deal: solitaire, poker, blackjack and deck-building card games, all free to play in your browser. Learn the rules in minutes and play as long as you like.",
  },
  casual: {
    meta_title: "Casual Games – Play Free Online Casual Games",
    meta_description:
      "Play free casual games online. Easy to pick up, hard to put down — quick sessions for every mood, right in your browser.",
    description:
      "Easy to pick up, hard to put down. Casual games are quick sessions with friendly rules — perfect for a five-minute break or a lazy afternoon, all free in your browser.",
  },
  clicker: {
    meta_title: "Clicker Games – Free Online Clicker & Idle Games",
    meta_description:
      "Play free clicker games online. Click, earn and upgrade in satisfying tapping and idle games that never stop paying out.",
    description:
      "Click, collect, upgrade, repeat — clicker games turn tapping into steady progress. Hire helpers and unlock upgrades that keep the income flowing even when you stop clicking.",
  },
  driving: {
    meta_title: "Driving Games – Play Free Online Driving Games",
    meta_description:
      "Play free driving games online — car simulators, parking challenges and open-road truck driving right in your browser.",
    description:
      "Get behind the wheel: car simulators, parking challenges and long-haul truck driving games. Steady hands and smooth throttle win the day — all free in your browser.",
  },
  educational: {
    meta_title: "Educational Games – Free Online Learning Games",
    meta_description:
      "Play free educational games online. Learn math, words and logic through play — fun learning games for kids and adults.",
    description:
      "Learning that feels like play. Educational games cover math, vocabulary, logic and geography — a fun brain workout for kids and grown-ups alike, free in your browser.",
  },
  fighting: {
    meta_title: "Fighting Games – Play Free Online Fighting Games",
    meta_description:
      "Play free fighting games online. One-on-one combat, martial arts duels and stickman brawls, playable instantly in your browser.",
    description:
      "One-on-one combat, martial arts duels and stickman brawls. Learn the combos, read your opponent and win the rematch — free fighting games with no download.",
  },
  horror: {
    meta_title: "Horror Games – Play Free Online Horror Games",
    meta_description:
      "Play free horror games online. Scary escape rooms, haunted houses and creepy survival horror — play if you dare.",
    description:
      "Lights off, headphones on. Free horror games with haunted houses, creepy escape rooms and things that chase you through the dark. Play if you dare.",
  },
  idle: {
    meta_title: "Idle Games – Free Idle & Incremental Games Online",
    meta_description:
      "Play free idle and incremental games online. Tycoons and idle clickers that keep producing while you are away — progress never stops.",
    description:
      "Idle games — also known as incremental games — keep earning while you are away. Set up production, buy upgrades and watch the numbers explode: the best free idle and incremental games, right in your browser.",
  },
  multiplayer: {
    meta_title: "Multiplayer Games – Free Online Multiplayer Games",
    meta_description:
      "Play free multiplayer games online. Compete or team up with players around the world — no download, just pick a game and join.",
    description:
      "Compete or team up with players around the world. Free multiplayer games — arenas, co-op challenges and party classics — with nothing to download and nobody to install.",
  },
  music: {
    meta_title: "Music Games – Play Free Online Music Games",
    meta_description:
      "Play free music and rhythm games online. Tap to the beat, hit every note and chase perfect combos right in your browser.",
    description:
      "Feel the beat. Free music and rhythm games where timing is everything — tap along, hit every note and chase that perfect combo in your browser.",
  },
  platformer: {
    meta_title: "Platformer Games – Play Free Online Platformer Games",
    meta_description:
      "Play free platformer games online. Run, jump and dash through handcrafted levels and precision challenges in your browser.",
    description:
      "Run, jump and dash through handcrafted levels. From precision rage games to cozy platform adventures, these free platformer games all play instantly in your browser.",
  },
  puzzle: {
    meta_title: "Puzzle Games – Play Free Online Puzzle Games",
    meta_description:
      "Play free puzzle games online — match-3, logic, physics and brain teasers for a quick mental workout in your browser.",
    description:
      "Match-3, logic grids, physics contraptions and brain teasers: free puzzle games for a quick mental workout or an afternoon of head-scratching, all in your browser.",
  },
  racing: {
    meta_title: "Racing Games – Play Free Online Racing Games",
    meta_description:
      "Play free racing games online. Drift, drag and speed to the finish line — instant racing action in your browser.",
    description:
      "Full throttle, no loading screens. Drift through corners, win drag races and outrun the clock in free racing games you can start in seconds.",
  },
  rpg: {
    meta_title: "RPG Games – Play Free Online RPG Games",
    meta_description:
      "Play free RPG games online. Level up heroes, complete quests and dive into role-playing adventures in your browser.",
    description:
      "Level up, loot and quest on. Free RPG games with hero progression, turn-based battles and story-driven adventures — your next campaign starts in the browser.",
  },
  shooting: {
    meta_title: "Shooting Games – Play Free Online Shooting Games",
    meta_description:
      "Play free shooting games online. Aim, blast and survive in fast browser FPS, zombie and target-shooting games.",
    description:
      "Aim true. Free shooting games covering fast FPS arenas, zombie defense and precision target challenges — grab a mouse and start blasting.",
  },
  simulation: {
    meta_title: "Simulation Games – Play Free Online Simulation Games",
    meta_description:
      "Play free simulation games online. Run farms, cities and businesses — build, manage and grow your own world in your browser.",
    description:
      "Build, manage and grow. Simulation games let you run farms, cities, hospitals and businesses of your own — free browser sims with surprisingly deep systems.",
  },
  sports: {
    meta_title: "Sports Games – Play Free Online Sports Games",
    meta_description:
      "Play free sports games online. Soccer, basketball, golf and more — quick matches and arcade sports action in your browser.",
    description:
      "Soccer, basketball, golf and more. Free sports games with quick matches and arcade flair — championship fun without leaving the browser.",
  },
  strategy: {
    meta_title: "Strategy Games – Play Free Online Strategy Games",
    meta_description:
      "Play free strategy games online. Tower defense, tactics and base-building — outsmart every challenge in your browser.",
    description:
      "Think first, click second. Tower defense, turn-based tactics and base-building strategy games that reward planning — free to play in your browser.",
  },
  survival: {
    meta_title: "Survival Games – Play Free Online Survival Games",
    meta_description:
      "Play free survival games online. Gather, craft and fight to stay alive — zombie hordes, islands and wilderness in your browser.",
    description:
      "Gather, craft and hold out one more night. Free survival games against zombie hordes, starving winters and hostile islands — how long can you last?",
  },
  trivia: {
    meta_title: "Trivia Games – Play Free Online Trivia & Quiz Games",
    meta_description:
      "Play free trivia games online. General knowledge, geography and picture quizzes — how many can you get right?",
    description:
      "How much do you actually know? Free trivia and quiz games covering general knowledge, geography and pop culture — perfect for settling arguments.",
  },
};

/**
 * Editorial source per category: the reference article the genre copy was
 * checked against. content_verified can only be true when source_url is set
 * (categories_verified_content_has_source check constraint).
 */
const CATEGORY_SOURCES = {
  action: "https://en.wikipedia.org/wiki/Action_game",
  adventure: "https://en.wikipedia.org/wiki/Adventure_game",
  arcade: "https://en.wikipedia.org/wiki/Arcade_video_game",
  "board-game": "https://en.wikipedia.org/wiki/Board_game",
  card: "https://en.wikipedia.org/wiki/Card_game",
  casual: "https://en.wikipedia.org/wiki/Casual_game",
  clicker: "https://en.wikipedia.org/wiki/Incremental_game",
  driving: "https://en.wikipedia.org/wiki/Vehicle_simulation_game",
  educational: "https://en.wikipedia.org/wiki/Educational_game",
  fighting: "https://en.wikipedia.org/wiki/Fighting_game",
  horror: "https://en.wikipedia.org/wiki/Survival_horror",
  idle: "https://en.wikipedia.org/wiki/Incremental_game",
  multiplayer: "https://en.wikipedia.org/wiki/Multiplayer_video_game",
  music: "https://en.wikipedia.org/wiki/Rhythm_game",
  platformer: "https://en.wikipedia.org/wiki/Platform_game",
  puzzle: "https://en.wikipedia.org/wiki/Puzzle_video_game",
  racing: "https://en.wikipedia.org/wiki/Racing_video_game",
  rpg: "https://en.wikipedia.org/wiki/Role-playing_video_game",
  shooting: "https://en.wikipedia.org/wiki/Shooter_game",
  simulation: "https://en.wikipedia.org/wiki/Simulation_video_game",
  sports: "https://en.wikipedia.org/wiki/Sports_video_game",
  strategy: "https://en.wikipedia.org/wiki/Strategy_video_game",
  survival: "https://en.wikipedia.org/wiki/Survival_game",
  trivia: "https://en.wikipedia.org/wiki/Quiz",
};

const { data: categories, error } = await supabase.from("categories").select("id, name, slug");
if (error) {
  console.error(`Could not load categories: ${error.message}`);
  process.exit(1);
}

let updated = 0;
let skipped = 0;
for (const category of categories || []) {
  const seo = CATEGORY_SEO[category.slug];
  if (!seo) {
    console.log(`skip ${category.slug} (no copy defined)`);
    skipped += 1;
    continue;
  }
  const { error: updateError } = await supabase
    .from("categories")
    .update({ ...seo, source_url: CATEGORY_SOURCES[category.slug], content_verified: true })
    .eq("id", category.id);
  if (updateError) {
    console.error(`FAIL ${category.slug}: ${updateError.message}`);
    process.exitCode = 1;
    continue;
  }
  console.log(`ok   ${category.slug}`);
  updated += 1;
}

console.log(`\n${updated} updated, ${skipped} skipped of ${(categories || []).length} categories`);
