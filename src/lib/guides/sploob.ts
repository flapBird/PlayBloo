import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-10-02T12:45:32+08:00", updatedAt: "2026-10-02T12:45:32+08:00" };

export const sploob: GuideTopic = {
  slug: "sploob", name: "SPLOOB", officialName: "SPLOOB",
  title: "SPLOOB Game: Play Online, Rules & Getting Started",
  description: "Discover SPLOOB, the squishy physics puzzle game. Find the official browser game, learn its same-color row rule and get help with your first run.",
  status: "published", platforms: ["Browser (HTML5)"], releaseDate: "2026-09-28", releaseStatus: "released", publisher: "Mors & Catonator",
  cover: {
    src: "/images/guides/sploob.webp", width: 794, height: 595, fit: "contain",
    alt: "SPLOOB gameplay with colorful soft cells in a beaker, a next-piece queue and DNA score",
    credit: "Official SPLOOB gameplay screenshot — Mors & Catonator",
    sourceUrl: "https://img.itch.zone/aW1hZ2UvNTA2NzQ4My8zMDM0MTk5NC5wbmc=/794x1000/j%2FV4BV.png",
  },
  ...dates, verifiedAt: "2026-10-02",
  sources: [
    { id: "official", label: "Mors & Catonator — SPLOOB official game page", url: "https://mors-games.itch.io/sploob" },
    { id: "gameplay", label: "Official SPLOOB gameplay screenshot: level 1", url: "https://img.itch.zone/aW1hZ2UvNTA2NzQ4My8zMDM0MTk5NC5wbmc=/794x1000/j%2FV4BV.png" },
    { id: "score", label: "Official SPLOOB gameplay screenshot: level 5", url: "https://img.itch.zone/aW1hZ2UvNTA2NzQ4My8zMDM0MTk5Mi5wbmc=/794x1000/eEz8tR.png" },
  ],
  sections: [
    {
      id: "play-online", title: "Play SPLOOB online",
      paragraphs: ["SPLOOB is a falling-cell puzzle game by Mors and Catonator, made for Falling Block Jam 2026. Its cells squish together inside a beaker rather than occupying a rigid block grid. The official itch.io page hosts the browser version."],
      link: { label: "Play SPLOOB on itch.io", href: "https://mors-games.itch.io/sploob" }, sourceIds: ["official", "gameplay"],
    },
    {
      id: "clear-rule", title: "What makes the cells pop?",
      paragraphs: ["Drop cells into the beaker and connect one color into a complete row across it. A small matching group in the middle is not a complete row; placing matching cells at opposite sides still leaves a connection to finish between them.", "For your first attempt, follow one color across the container and look for the break in its path. Think about completing that path before adding height to the pile."], sourceIds: ["official"],
    },
    {
      id: "release-and-platform", title: "Release date and supported inputs", releaseFacts: true,
      paragraphs: ["The official listing identifies an English-language HTML5 release with keyboard and Xbox controller input. Touch controls are not listed. Phone play has not been tested for this guide; a computer with a keyboard is the starting point for trying it."], sourceIds: ["official"],
    },
    {
      id: "inside-the-beaker", title: "Read the game screen",
      image: {
        src: "/images/guides/sploob-score.webp", width: 794, height: 595,
        alt: "Official SPLOOB level 5 screenshot showing NEXT, LEVEL, TIME, DNA and BEST around the beaker",
        caption: "Official developer screenshot: the next-cell queue is on the left, with level, time, DNA and best score on the right.",
      },
      paragraphs: ["The screenshots show a NEXT queue beside the beaker and DNA and BEST counters on the other side. Use the queue to consider the next placement, and compare the DNA counter with your best score as you learn the game."], sourceIds: ["gameplay", "score"],
    },
  ],
  articles: [{
    slug: "how-to-play", title: "How to Play SPLOOB: Row Clearing & Beginner Tips", shortTitle: "How to play: rows & beginner tips",
    description: "Understand why a matching group may not clear, plan placements across the beaker and check SPLOOB’s input options before your first run.",
    category: "Getting started", status: "published", ...dates, relatedSlugs: [],
    sections: [
      {
        id: "first-run", title: "Start with one clear connection",
        bullets: [
          "Open the official browser game and read its on-screen tutorial before starting a run.",
          "Pick one color in the pile to follow. Look across the beaker for the gap preventing a complete same-color row.",
          "Aim your next matching cell at that gap rather than spreading that color among several isolated groups.",
          "After a placement, reassess where the cells have settled before choosing your next target.",
        ],
        link: { label: "Open the official SPLOOB game", href: "https://mors-games.itch.io/sploob" },
      },
      {
        id: "why-no-clear", title: "Why are my matching cells not clearing?",
        paragraphs: ["Check the entire row, not just the number of matching cells in one cluster. The useful question is whether the same color connects all the way across. If another color or an empty gap interrupts it, work on that missing connection.", "A tall stack at each wall can still leave an unfinished middle. Try to connect the existing groups rather than continuing to make both stacks taller."], sourceIds: ["official"],
      },
      {
        id: "beginner-tips", title: "Placement habits to try",
        paragraphs: ["These are starting strategies based on the row objective, rather than a tested high-score route. Use a few runs to see which placements help you finish connections."],
        bullets: [
          "Keep a target gap in mind: choose a placement that helps an existing path before starting another one.",
          "Use the NEXT queue to plan a follow-up, but check the active falling cell before moving it.",
          "Avoid building a narrow tower when a lower placement could extend a row across the container.",
          "Change one habit at a time and compare your results, so you can tell which adjustment helped.",
        ], sourceIds: ["gameplay"],
      },
      {
        id: "controls", title: "Keyboard, controller and mobile play",
        paragraphs: ["SPLOOB lists keyboard and Xbox controller support. Follow the current game's tutorial or control screen for the exact button bindings; this guide has not verified them in a hands-on session.", "If the keyboard does not respond, click inside the game to give it focus and try again. On a phone, loading an HTML5 page alone does not establish that touch input is supported. Touch play and controller behavior have not been tested here."], sourceIds: ["official"],
      },
    ],
  }],
};
