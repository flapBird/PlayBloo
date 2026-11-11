import type { GuideTopic } from "./types";

const publicationDate = "2026-11-11T10:00:00.000Z";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };

const steamStore = "https://store.steampowered.com/app/5335510/Moon_Sweepers";
const steamApi = "https://store.steampowered.com/api/appdetails?appids=5335510&l=english";

export const moonSweepers: GuideTopic = {
  slug: "moon-sweepers",
  name: "Moon Sweepers",
  officialName: "Moon Sweepers – Sweep THE MOON",
  title: "Moon Sweepers Guide: Co-Op, Tools, Price",
  description:
    "Moon Sweepers – Sweep THE MOON is out on Steam: 16-player co-op moon cleaning with tool upgrades, depots and dust deliveries — plus co-op setup tips.",
  status: "published",
  platforms: ["PC (Steam)"],
  releaseDate: "2026-10-23",
  releaseStatus: "released",
  publisher: "DragDrop Games",
  cover: {
    src: "/images/guides/moon-sweepers.webp",
    alt: "A Moon Sweepers astronaut sweeping the lunar surface with a broom while Earth hangs in the black sky",
    credit: "Official Moon Sweepers screenshot © 2026 DragDrop Games",
    sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5335510/6985c316ef6f0988ea33b17954c097268134e3d1/ss_6985c316ef6f0988ea33b17954c097268134e3d1.1920x1080.jpg",
    width: 1600,
    height: 900,
  },
  ...dates,
  verifiedAt: "2026-11-11",
  sources: [
    { id: "steam", label: "Steam — Moon Sweepers store page (release date, price, co-op flags, gameplay description, system requirements; checked November 11, 2026)", url: steamStore },
    { id: "steam-api", label: "Steam appdetails API — released state, €8.99 price, 33 achievements, online co-op category and official screenshots (checked November 11, 2026)", url: steamApi },
  ],
  sections: [
    {
      id: "what-it-is",
      title: "An entire Moon to clean, one toothbrush to start",
      paragraphs: [
        "Moon Sweepers is a co-op cleaning and automation game by DragDrop Games, released on Steam on October 23, 2026. The fiction: the Lunar Surface Department — a fictional agency the store page politely disclaims — sent you and your crew to sweep the dust off the Moon, and the budget only covered a toothbrush.",
        "The viral hook that spread on TikTok and Instagram is exactly that image: a astronaut sweeping an entire celestial body one painfully small brushstroke at a time. The Steam description keeps the joke going — 'Turn a ridiculous job into a thriving operation, if your friends actually help.'",
      ],
      sourceIds: ["steam"],
    },
    {
      id: "release-date",
      title: "Release date, price and platforms",
      releaseFacts: true,
      paragraphs: [
        "Moon Sweepers released on October 23, 2026 for PC on Steam, priced at €8.99 on the store page at our November 11 check with no launch discount running (regional currencies apply). Bundles with Totally Safe Moon Project and Brick by Brick: Tidy Up the Small Town! are offered alongside the base game.",
        "Early reception on Steam reads Mostly Positive for English reviews — 78% of 4,341 reviews at our November 11 check, three weeks after launch.",
      ],
      sourceIds: ["steam", "steam-api"],
    },
    {
      id: "gameplay",
      title: "The loop: sweep, store, ship, upgrade",
      paragraphs: [
        "The job runs in a delivery loop: collect lunar dust into your storage, deliver it to a depot, and launch shipments to get paid. Earnings buy new cleaning tools and increased carrying capacity, so each delivery funds bigger jobs between the next ones. Dusty terrain turns visibly clean with every pass, and the game tracks your progress across the lunar surface.",
        "As the operation grows, you place depots near your work and put cleaning vehicles to use — the store shows pickup-style sweepers and a lunar camper van among the equipment. Steam tags the game under Automation, Incremental, Base Building and Simulation alongside the co-op flags.",
      ],
      sourceIds: ["steam"],
    },
    {
      id: "co-op-summary",
      title: "Up to 16 players in online co-op",
      paragraphs: [
        "The co-op headline is real: online lobbies of up to 16 players. The store's framing leaves the sociology up to you — spread out to cover more ground or tackle the same area together, and 'whether everyone actually works is another matter.' Solo play is fully supported with the same upgrade path.",
        "Our co-op guide covers how the lobby options fit a group, what the store does and does not document about hosting, and what solo players keep doing without a crew.",
      ],
      link: { label: "Read the co-op guide", href: "/guides/moon-sweepers/co-op" },
      sourceIds: ["steam", "steam-api"],
    },
    {
      id: "pc-specs",
      title: "PC requirements: light by 2026 standards",
      paragraphs: [
        "The spec sheet is modest: a 2 GB install and a GTX 1650 / RX 570-class GPU clear the minimum bar. Steam's listing targets Windows 10 at minimum and Windows 11 on the recommended tier, with a broadband connection required for the online co-op modes.",
        "One disclosure worth knowing: the developers state generative AI was used to assist with translating in-game text into supported languages — the game ships with 19 interface languages including Simplified Chinese.",
      ],
      sourceIds: ["steam"],
    },
    {
      id: "about-this-coverage",
      title: "About this coverage",
      paragraphs: [
        "PlayBloo has not played Moon Sweepers and does not sell it. Facts come from the official Steam store page and appdetails API as checked on November 11, 2026. Moon Sweepers is not a browser game, and no playable version is offered on this site.",
      ],
      sourceIds: ["steam", "steam-api"],
    },
  ],
  articles: [
    {
      slug: "getting-started",
      title: "Moon Sweepers Tips: Dust, Tools, Depots",
      shortTitle: "Getting started: the dust economy",
      description:
        "Moon Sweepers getting started: the sweep-store-ship loop explained, which upgrades matter first, depots and vehicles, and honest beginner priorities.",
      category: "Getting started",
      status: "published",
      cover: {
        src: "/images/guides/moon-sweepers-sweeper.webp",
        alt: "A Moon Sweepers astronaut pushing a wheeled floor-sweeper machine across the lunar dust",
        credit: "Official Moon Sweepers screenshot © 2026 DragDrop Games",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5335510/e6a6a9f0cbc3e69d7e29091bc7dae19ba4727076/ss_e6a6a9f0cbc3e69d7e29091bc7dae19ba4727076.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["co-op"],
      sections: [
        {
          id: "loop",
          title: "The dust economy in one paragraph",
          paragraphs: [
            "Everything in Moon Sweepers flows through one loop, straight from the store page: fill your storage with lunar dust, deliver it to a depot, launch shipments, get paid, spend the money on better tools and bigger carrying capacity. Every pass over dusty terrain turns it visibly clean, and the game tracks your progress across the surface — the whole Moon is the progress bar.",
            "The toothbrush is the joke, not the strategy: the intended arc is 'one painfully small brushstroke at a time' until tools and vehicles make the same ground profitable. PlayBloo has not played the retail build, so what follows is the store-documented loop with editorial priorities clearly labeled.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "upgrades",
          title: "What to buy first (editorial priorities)",
          paragraphs: [
            "The store names two upgrade axes: new cleaning tools and increased carrying capacity. Editorial take, not a playtested tier list: carrying capacity compounds hardest early, because every trip to the depot is dead time — a bigger tank turns the same sweep into more credits per delivery. Tool upgrades then speed the fill rate for that tank.",
            "Cleaning vehicles are the store's own milestone marker ('put cleaning vehicles to use as your operation grows'), and the official screenshots show a ride-on floor sweeper and a lunar camper van. Treat vehicle purchases as mid-game goals that change how much ground one player covers between deliveries.",
          ],
          image: {
            src: "/images/guides/moon-sweepers-depot.webp",
            alt: "A Moon Sweepers depot with conveyor lines and storage modules on the lunar surface",
            width: 1600,
            height: 900,
            caption: "Official screenshot: depots anchor the delivery loop — the closer they are to your work, the less dead time.",
          },
          sourceIds: ["steam"],
        },
        {
          id: "depots",
          title: "Place depots near your work",
          paragraphs: [
            "The store describes depot placement as a core tool: 'place depots near your work and put cleaning vehicles to use as your operation grows.' The depot is where storage turns into a shipment, so its position decides how much sweeping fits between deliveries.",
            "Practical read: as your territory expands, don't haul dust across half the Moon — push a new depot toward the frontier and keep the shipments short. The screenshots show conveyor-fed depot complexes that suggest the late game is about logistics rather than manual sweeps.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "beginner-checklist",
          title: "Beginner checklist",
          bullets: [
            "Learn the loop before the map: storage → depot → shipment → pay → upgrade.",
            "Favor carrying-capacity upgrades first (editorial priority — every delivery run is overhead).",
            "Move depots toward your work area as the cleaned frontier expands.",
            "Vehicles change coverage per trip; the store frames them as a growth milestone, not a starter purchase.",
            "Solo is fully supported — the upgrade path does not require a 16-player lobby.",
          ],
          sourceIds: ["steam"],
        },
      ],
    },
    {
      slug: "co-op",
      title: "Moon Sweepers Co-Op: 16-Player Lobbies",
      shortTitle: "Co-op: 16-player lobbies",
      description:
        "How Moon Sweepers co-op works: 16-player online lobbies, spreading out versus working together, solo support, and what the store does not document.",
      category: "Co-op guide",
      status: "published",
      cover: {
        src: "/images/guides/moon-sweepers-crew.webp",
        alt: "Three Moon Sweepers astronauts standing beside a sweeping vehicle on the lunar surface with Earth in the sky",
        credit: "Official Moon Sweepers screenshot © 2026 DragDrop Games",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5335510/20a903f07aa2753cc99f11e26f08784f52ce5560/ss_20a903f07aa2753cc99f11e26f08784f52ce5560.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["getting-started"],
      sections: [
        {
          id: "lobby-size",
          title: "Up to 16 players, online only",
          paragraphs: [
            "The store description sets the ceiling: 'Team up in online co-op lobbies of up to 16 players.' Steam's category flags list Online Co-op and Multi-player with no local split-screen option, so every co-op session runs over the internet — a broadband connection appears in the system requirements for a reason.",
            "Solo play is a first-class mode, not a fallback: single-player is flagged alongside co-op, and the store's joke ('if your friends actually help') implies the game is balanced around idle crew members too.",
          ],
          sourceIds: ["steam", "steam-api"],
        },
        {
          id: "spread-or-group",
          title: "Spread out or tackle one area together",
          paragraphs: [
            "The store gives two official play patterns: 'Spread out to cover more ground or tackle the same area together. There's enough dust to keep everyone busy.' Both work with the depot economy — a spread-out crew feeds separate depots, while a grouped crew opens ground faster and shares the delivery runs.",
            "Editorial suggestion for groups: assign the depot logistics to one player while sweepers push the frontier. The screenshots of conveyor-fed bases hint that the late game is a logistics operation, and someone has to run it.",
          ],
          image: {
            src: "/images/guides/moon-sweepers-base.webp",
            alt: "A large Moon Sweepers base with conveyor pipelines spreading across cleaned lunar terrain at night",
            width: 1600,
            height: 900,
            caption: "Official screenshot: the end-state operation is a shared logistics network — a reason to keep the crew organized.",
          },
          sourceIds: ["steam"],
        },
        {
          id: "what-is-undocumented",
          title: "What the store does not document",
          paragraphs: [
            "Hosting details, invite mechanics, cross-save and whether progress persists per lobby are not covered in the store text we checked on November 11, 2026. Steam flags Family Sharing and Steam Cloud, but co-op session specifics belong to the in-game UI — start a lobby before promising a 16-player schedule to your group.",
            "PlayBloo has not played the game, so we do not fill those gaps with guesses. If DragDrop Games publishes a co-op FAQ, this page is where the details will be summarized.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "coop-checklist",
          title: "Co-op checklist before moon night",
          bullets: [
            "Online only — no local split-screen is flagged on Steam, so everyone needs their own copy and connection.",
            "Lobbies go up to 16; the store says solo works fine if fewer people show up.",
            "Agree on the play pattern first: spread out for coverage or group up for speed.",
            "Put one player on depot and shipment logistics as the base grows.",
            "Check the current Steam review sentiment (78% Mostly Positive for English reviews at our November 11 check) for live session-health reports.",
          ],
          sourceIds: ["steam", "steam-api"],
        },
      ],
    },
  ],
};
