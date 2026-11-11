import type { GuideTopic } from "./types";

const publicationDate = "2026-11-11T10:00:00.000Z";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };

const steamStore = "https://store.steampowered.com/app/5037510/Playrooms";
const steamApi = "https://store.steampowered.com/api/appdetails?appids=5037510&l=english";
const fanSite = "https://playrooms.xyz";

export const playrooms: GuideTopic = {
  slug: "playrooms",
  name: "Playrooms",
  officialName: "Playrooms",
  title: "Playrooms Guide: Demo, Rooms and Tips",
  description:
    "Playrooms by Two Pixels launched November 4, 2026 at $6.99 with a free demo: how the Backrooms ball-pit job works, demo differences and beginner tips.",
  status: "published",
  platforms: ["PC (Steam)"],
  releaseDate: "2026-11-04",
  releaseStatus: "released",
  publisher: "Two Pixels UG",
  cover: {
    src: "/images/guides/playrooms.webp",
    alt: "A colorful ball pit with a red sofa inside a room painted with cartoon clouds, thousands of balls flooding the floor in Playrooms",
    credit: "Official Playrooms screenshot © Two Pixels UG",
    sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5037510/0aaaa7b63b4d87119df9bf81ddafb2f67de710d7/ss_0aaaa7b63b4d87119df9bf81ddafb2f67de710d7.1920x1080.jpg",
    width: 1600,
    height: 900,
  },
  ...dates,
  verifiedAt: "2026-11-11",
  sources: [
    { id: "steam", label: "Steam — Playrooms store page (release date, price, demo availability, features, system requirements; checked November 11, 2026)", url: steamStore },
    { id: "steam-api", label: "Steam appdetails API — released state, $6.99 with a 20% discount, 30 achievements and official screenshots (checked November 11, 2026)", url: steamApi },
    { id: "fan-site", label: "playrooms.xyz — fan-run info site covering the demo, room types and walkthrough (community-maintained, not official)", url: fanSite },
  ],
  sections: [
    {
      id: "what-it-is",
      title: "A cozy horror job: pick up 200,000 balls",
      paragraphs: [
        "Playrooms is a first-person cleaning and organizing game with a horror undertone, developed and published by the German studio Two Pixels UG. The premise is deadpan: thousands of balls — over 200,000 by the store's count — lie scattered across the playrooms, and someone should put them back. There is no one else here. Almost no one.",
        "The setting nods to the Backrooms: liminal rooms with tiled walls, cartoon clouds painted on ceilings, endless corridors, a hallway with more doors than it should have. Players describe the result as a cozy horror incremental — relaxing tidying with an unsettling atmosphere, which matches the game's own mature-content note: jumpscares, sudden loud sounds and near-total darkness, but no blood or violence.",
      ],
      sourceIds: ["steam"],
    },
    {
      id: "release-date",
      title: "Release date and price",
      releaseFacts: true,
      paragraphs: [
        "Playrooms released on November 4, 2026 on Steam for Windows, priced at $6.99 US with a 20% introductory discount ($5.59) at our November 11 check. A free demo is available as a separate download from the same store page, and a supporter DLC plus a Chop Chop Inc. bundle sit alongside the base game.",
        "The launch has landed unusually well: Steam user reviews stood at Overwhelmingly Positive — 97% of 1,002 reviews — when we checked on November 11, 2026, a week after launch.",
      ],
      sourceIds: ["steam", "steam-api"],
    },
    {
      id: "gameplay",
      title: "The job: collect, fill, unlock, move on",
      paragraphs: [
        "The loop is simple and deliberate: collect the balls, bring them back, fill the ball pits. Full ball pits unlock new abilities, and collected balls double as your currency — eventually enough to buy the key to the next area. The work stays the same; only the room changes.",
        "Money buys tools that reshape the job: a scoop, a flashlight, and the rest of the equipment list on the store page. Steam's feature list is single-player only, with full controller support and accessibility flags including camera comfort, custom volume controls and playable without timed input.",
      ],
      sourceIds: ["steam", "steam-api"],
    },
    {
      id: "the-shift",
      title: "The shift mechanic: stay in the light",
      paragraphs: [
        "The horror comes from the work schedule. When your shift is over, the lights start going out one by one — and then only one thing matters: stay in the light. What waits in the darkness is the game's central dread, and the reason a flashlight is a purchase rather than an afterthought.",
        "How dangerous the job gets is up to the player. The store describes 'flexible working arrangements' — a no-fear mode, the way it's meant to be, or no second chances — and the in-game difficulty screen names the three options Crazy, Normal and Hardcore, which our getting-started guide breaks down.",
      ],
      link: { label: "Read the getting-started guide", href: "/guides/playrooms/getting-started" },
      sourceIds: ["steam"],
    },
    {
      id: "demo-summary",
      title: "Try it first: the free demo",
      paragraphs: [
        "You do not have to buy blind. Steam lists a Demo Available download on the store page, and the demo has been out since before the full game — long enough to build its own positive reputation among tidying-game fans. Our demo guide covers what the trial includes and how it differs from the $6.99 full game.",
      ],
      link: { label: "See what the demo includes", href: "/guides/playrooms/demo" },
      sourceIds: ["steam"],
    },
    {
      id: "achievements-summary",
      title: "Achievements and progress",
      paragraphs: [
        "Steam's appdetails lists 30 achievements, with highlighted names like 'First sparrow', 'Free Lexi', 'Model employee' and '10.000 reasons to quit' — a flavor list that leans into the game's deadpan employee fiction. Our achievements article explains what is known without spoiling the rooms.",
      ],
      link: { label: "Browse the achievement notes", href: "/guides/playrooms/achievements" },
      sourceIds: ["steam-api"],
    },
    {
      id: "about-this-coverage",
      title: "About this coverage",
      paragraphs: [
        "PlayBloo has not played Playrooms and does not sell it. Every fact on this topic comes from the official Steam store page and appdetails API as checked on November 11, 2026, with community context attributed to fan-run sources. Playrooms is not a browser game, and no playable version is offered on this site.",
      ],
      sourceIds: ["steam", "steam-api"],
    },
  ],
  articles: [
    {
      slug: "getting-started",
      title: "Playrooms Tips: Balls, Tools, the Shift",
      shortTitle: "Getting started: rooms, tools, the shift",
      description:
        "How Playrooms works: the collect-fill-unlock loop, which tools to buy first, the three difficulty modes and how to survive the end-of-shift darkness.",
      category: "Getting started",
      status: "published",
      cover: {
        src: "/images/guides/playrooms-difficulty.webp",
        alt: "Playrooms difficulty screen showing three named modes: Crazy, Normal and Hardcore, each with its own rule text on a retro monitor",
        credit: "Official Playrooms screenshot © Two Pixels UG",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5037510/04e6b7964f0079d6b58fa3557aaafdf5cfa728bb/ss_04e6b7964f0079d6b58fa3557aaafdf5cfa728bb.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["demo", "achievements"],
      sections: [
        {
          id: "loop",
          title: "The loop: collect, fill, unlock, repeat",
          paragraphs: [
            "Every room in Playrooms runs the same loop, per the official description: collect the balls, bring them back, fill the ball pits. A filled ball pit unlocks new abilities, and the balls themselves are your currency — save enough and you buy the key to the next area. Nothing about the work changes between rooms; only the room does.",
            "That makes pacing the whole game. First-time players tend to over-grab: a carry of balls you drop halfway costs more time than two smaller, completed trips. Build the habit of finishing what you carry before the tools tempt you into bigger loads.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "tools",
          title: "Tools: scoop, flashlight and the rest",
          paragraphs: [
            "The store's tool section names a scoop and a flashlight as the gear examples: 'the more balls you collect, the more equipment you can afford.' Treat the scoop as your throughput upgrade and the flashlight as your insurance policy — the shift mechanic below explains why a light source is not optional in this job.",
            "PlayBloo has not played the retail build, so we do not rank unlisted tools or quote prices. What the store establishes is the principle: equipment is earned from the balls you bring back, so early efficiency compounds.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "difficulty",
          title: "The three difficulty modes",
          paragraphs: [
            "The official screenshots show the in-game difficulty selection screen with three named modes: Crazy, Normal and Hardcore. The store copy describes the same spread as 'flexible working arrangements' — no fear at all, the way it's meant to be, or no second chances.",
            "The practical read: Normal is the authored experience where the end-of-shift darkness escalates as designed; the no-fear mode strips the dread for players who want pure tidying; Hardcore is for people who want the darkness to be a genuine threat. Pick deliberately before your first room — the horror level, not the cleaning, is what changes.",
          ],
          image: {
            src: "/images/guides/playrooms-darkness.webp",
            alt: "A dim Playrooms hallway lined with doors, hundreds of colorful balls scattered across the floor into the darkness",
            width: 1600,
            height: 900,
            caption: "Official screenshot: the corridor rooms are where the shift's light rules matter most.",
          },
          sourceIds: ["steam"],
        },
        {
          id: "shift-survival",
          title: "When the lights go out",
          paragraphs: [
            "The store's most-repeated rule is the shift rule: 'When your shift is over, the lights start to go out one by one. Then there is only one thing that matters: stay in the light!' The rooms are built for this — long sightlines, ceiling fixtures and corners that become dangerous pockets as the darkness spreads.",
            "Beginner advice (editorial, not a playtested route): keep your return path toward a lit fixture rather than optimizing for the nearest ball, and treat the flashlight as a tool you maintain, not a luxury. The store's mature-content note warns about jumpscares and near-total darkness, so headphone volume is its own difficulty setting.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "rooms",
          title: "The room types you will rotate through",
          paragraphs: [
            "The store description sketches the room rotation: tiles, water, endless corridors, and a hallway with more doors than it should have. The official screenshots add the ball-pit lounge, an indoor pool drowned in balls, and office-style rooms with computer terminals. Each room keeps the loop identical while changing how you move through it.",
            "Community walkthrough sites such as playrooms.xyz track room-by-room details, but they are fan-maintained and can drift from patches — treat them as guides to cross-check, not as official documentation.",
          ],
          sourceIds: ["steam", "fan-site"],
        },
        {
          id: "beginner-checklist",
          title: "Beginner checklist",
          bullets: [
            "Choose your difficulty before the first room — Crazy, Normal or Hardcore changes the dread, not the chores.",
            "Bring balls home in loads you can finish; dropped trips cost more than they save.",
            "Buy the scoop early for throughput and keep the flashlight maintained for shift end.",
            "Fill pits completely — the unlock and the key to the next area both come from the pits.",
            "Headphones and volume are part of the horror settings; the game warns about jumpscares up front.",
          ],
          sourceIds: ["steam"],
        },
      ],
    },
    {
      slug: "demo",
      title: "Playrooms Demo: Free Trial and Differences",
      shortTitle: "Free demo: what's in it",
      description:
        "The free Playrooms demo on Steam: how to download it, what it includes, how it differs from the $6.99 full game, and who should just buy the base game.",
      category: "Demo guide",
      status: "published",
      cover: {
        src: "/images/guides/playrooms-pool.webp",
        alt: "An indoor swimming pool filled with thousands of colorful balls beneath three slide tubes in Playrooms",
        credit: "Official Playrooms screenshot © Two Pixels UG",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5037510/760a4878a639a249dec1a695a0e381a5e1627039/ss_760a4878a639a249dec1a695a0e381a5e1627039.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["getting-started", "achievements"],
      sections: [
        {
          id: "how-to-download",
          title: "How to get the free demo",
          paragraphs: [
            "The demo lives on the same Steam page as the game: the store lists 'Demo Available' with a Download Demo button, so no separate purchase or key is involved. It is a Windows download like the full game — the store's system requirements list a GTX 1060-era PC at minimum and 10 GB of storage for the retail build.",
            "Steam does not need a purchase to run a demo, but you do need the Steam client and an account. The demo is separate from the supporter DLC and from the Chop Chop Inc. x Playrooms bundle, which applies to the paid game only.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "demo-content",
          title: "What the demo includes",
          paragraphs: [
            "Community coverage describes the demo as a slice of the real job: the ball-pit sorting area and several early rooms, with players posting about reaching the demo's end state. The demo has earned its own positive user-review reputation on Steam — fan-run trackers reported it standing separately from the full game's score.",
            "PlayBloo has not installed the demo, so we describe its scope the way the sources do: as a representative slice, not the whole museum of rooms. If a specific room is in or out this week, the store page's demo section and community threads are the authority.",
          ],
          image: {
            src: "/images/guides/playrooms-office.webp",
            alt: "An empty Playrooms office room with green carpet, a desk, a wall clock and a single office chair",
            width: 1600,
            height: 900,
            caption: "Official screenshot: the liminal office rooms are part of what the demo's early slice samples.",
          },
          sourceIds: ["steam", "fan-site"],
        },
        {
          id: "differences",
          title: "Demo versus the $6.99 full game",
          paragraphs: [
            "What the store page establishes: the full game carries the complete room rotation (tiles, water, endless corridors, the too-many-doors hallway), the tool economy, the shift mechanic and its three difficulty modes, and 30 achievements. Steam's feature flags for the retail build are single-player with full controller support and accessibility options; community guides report the demo does not carry the achievement list.",
            "The demo also runs without the supporter DLC, which exists purely to support the two-person-scale studio behind it — it does not gate gameplay on the store's description. If the demo's loop hooks you, the $6.99 launch price (20% off $6.99 at our November 11 check) is the discount window; the game has been out since November 4, 2026.",
          ],
          sourceIds: ["steam", "steam-api", "fan-site"],
        },
        {
          id: "demo-verdict",
          title: "Who should try the demo first",
          bullets: [
            "If you have never played a tidying-game — try the demo; the loop is the product.",
            "If horror elements worry you, the demo plus the difficulty screen tells you whether the no-fear mode suits you better.",
            "If you already know you love Backrooms-flavored cleaning games, the launch discount makes waiting unnecessary.",
            "If you chase achievements, note the retail build holds the 30-achievement list and start from the full game.",
          ],
          paragraphs: [
            "The demo and the full game share one rule from the store page worth repeating: the work stays the same, only the room changes. Whether that sentence is a promise or a threat decides your purchase.",
          ],
          sourceIds: ["steam"],
        },
      ],
    },
    {
      slug: "achievements",
      title: "Playrooms Achievements: All 30 Names",
      shortTitle: "Achievements: the 30-achievement list",
      description:
        "Playrooms has 30 Steam achievements: the highlighted names, what they suggest about the game's employee fiction, and what is not yet documented.",
      category: "Achievements",
      status: "published",
      cover: {
        src: "/images/guides/playrooms-yellow-room.webp",
        alt: "A yellow Playrooms room filled with colorful balls, a chair and a microphone stand under fluorescent light",
        credit: "Official Playrooms screenshot © Two Pixels UG",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5037510/3aed5ca1ea62fa041d3ae2d0e935792c6da9e7e5/ss_3aed5ca1ea62fa041d3ae2d0e935792c6da9e7e5.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["getting-started", "demo"],
      sections: [
        {
          id: "count",
          title: "30 achievements on Steam",
          paragraphs: [
            "Steam's appdetails API lists exactly 30 achievements for Playrooms as of our November 11, 2026 check — one week after launch. Steam also flags Steam Cloud, so progress travels with your account; Family Sharing is supported as well.",
            "Ten achievements are highlighted on the store backend, and their names do a lot of world-building: 'First sparrow', 'All the chirps', 'Eagle Eye', 'Mighty Hand', 'Hooray', 'Free Lexi', 'Model employee', 'No re-hires needed', 'Colour is a distraction' and '10.000 reasons to quit'.",
          ],
          sourceIds: ["steam-api"],
        },
        {
          id: "what-names-suggest",
          title: "What the names suggest (without spoilers)",
          paragraphs: [
            "The employee fiction runs through the list: 'Model employee' and 'No re-hires needed' extend the game's deadpan HR language, and '10.000 reasons to quit' implies a counting milestone scaled to the ball economy. 'Colour is a distraction' hints at a mode or rule about how the rooms are sorted, and the sparrow set — 'First sparrow', 'All the chirps', 'Eagle Eye' — reads as a discovery or wildlife thread inside the playrooms.",
            "'Free Lexi' is the most story-shaped name on the list. We are not inventing a quest chain around it: no source we checked documents these achievements' unlock conditions yet, one week after launch. Treat every 'how to unlock' guide you see this week with the same caution.",
          ],
          image: {
            src: "/images/guides/playrooms-mail-computer.webp",
            alt: "A Playrooms retro computer terminal showing an internal mail client with unread reports on screen",
            width: 1600,
            height: 900,
            caption: "Official screenshot: the in-game terminals carry the corporate fiction the achievement names riff on.",
          },
          sourceIds: ["steam-api", "steam"],
        },
        {
          id: "hunting-notes",
          title: "Practical notes for achievement hunters",
          bullets: [
            "The list is retail-only: community guides report the demo does not include achievements, so hunt on the full game.",
            "The ball economy is the backbone — '10.000 reasons to quit' implies counting milestones, so efficiency compounds toward trophies.",
            "Steam Cloud is enabled, so progress follows your account across machines.",
            "No unlock conditions are documented by any source we checked on November 11, 2026; we will not fabricate them.",
          ],
          paragraphs: [
            "For a $6.99 cozy-horror cleaner, a 30-achievement set is a generous checklist rather than a grind wall. The names alone make the case for the game's writing — the trophies behave like punchlines.",
          ],
          sourceIds: ["steam-api", "steam"],
        },
      ],
    },
  ],
};
