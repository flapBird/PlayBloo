import type { GuideTopic } from "./types";

const publicationDate = "2026-09-14T08:00:00+08:00";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };
const us = "https://www.nintendo.com/us/store/products/the-legend-of-zelda-ocarina-of-time-125697/";

export const ocarinaOfTimeRemake: GuideTopic = {
  slug: "ocarina-of-time-remake",
  name: "Ocarina of Time Remake",
  officialName: "The Legend of Zelda: Ocarina of Time",
  title: "Ocarina of Time Remake: Release Date & Guides",
  description: "Your guide to Ocarina of Time on Switch 2: the November 5 release, confirmed changes, official gameplay and how the remake compares with the original.",
  status: "published",
  platforms: ["Nintendo Switch 2"],
  releaseDate: "2026-11-05",
  releaseStatus: "upcoming",
  publisher: "Nintendo",
  cover: {
    src: "/images/guides/ocarina-of-time-remake.webp",
    alt: "Link and Navi on a forest path in Nintendo’s Ocarina of Time Switch 2 artwork",
    credit: "Official promotional artwork © Nintendo",
    sourceUrl: us,
  },
  trailer: {
    youtubeId: "wuFfiTEr2yc",
    title: "The Legend of Zelda: Ocarina of Time — 40th Anniversary Direct",
    publishedAt: "2026-09-08",
  },
  ...dates,
  verifiedAt: "2026-09-14",
  sources: [
    { id: "us", label: "Nintendo US — game details and release date", url: us },
    { id: "uk", label: "Nintendo UK — gameplay, equipment and features", url: "https://www.nintendo.com/en-gb/Games/Nintendo-Switch-2-games/The-Legend-of-Zelda-Ocarina-of-Time-3115664.html" },
    { id: "announcement", label: "Nintendo — Zelda 40th anniversary announcement", url: "https://www.nintendo.com/ph/news/article/3Uvp2H1iPLLLSnR4MJgmq1" },
    { id: "au", label: "Nintendo Australia — regional release listing", url: "https://www.nintendo.com/au/games/nintendo-switch-2/the-legend-of-zelda-ocarina-of-time/" },
    { id: "trailer", label: "Nintendo of America — official September trailer", url: "https://www.youtube.com/watch?v=wuFfiTEr2yc" },
    { id: "history", label: "Nintendo Iwata Asks — Ocarina of Time and its 3DS remake", url: "https://www.nintendo.com/en-gb/Iwata-Asks/Iwata-Asks-Nintendo-3DS/Vol-5-Asking-Mr-Miyamoto-Right-Before-Release/8-I-Wanted-to-Experience-Hyrule-in-3D/8-I-Wanted-to-Experience-Hyrule-in-3D-210570.html" },
    { id: "3ds", label: "Nintendo UK — Ocarina of Time 3D features", url: "https://www.nintendo.com/en-gb/Games/Nintendo-3DS-games/The-Legend-of-Zelda-Ocarina-of-Time-3D-275007.html" },
    { id: "3ds-development", label: "Nintendo Iwata Asks — the 3DS inventory and Water Temple changes", url: "https://iwataasks.nintendo.com/interviews/3ds/zelda-ocarina-of-time/3/2/" },
  ],
  sections: [
    {
      id: "overview", title: "A familiar adventure, rebuilt for Switch 2",
      paragraphs: [
        "Link’s journey to save Hyrule returns in a newly made version of The Legend of Zelda: Ocarina of Time. Nintendo’s official title does not include ‘Remake’; we use that familiar search name to distinguish the Switch 2 game from earlier releases.",
        "Start with the release guide if you are deciding what to buy. Returning players can use our comparison to separate confirmed changes from questions still awaiting answers. For a first look at the adventure, watch Nintendo’s trailer below.",
      ], sourceIds: ["us"],
    },
    { id: "release-date", title: "Release date & platform", releaseFacts: true, sourceIds: ["us", "au"] },
    {
      id: "trailer", title: "Watch the official trailer", trailer: true,
      paragraphs: ["Nintendo’s September presentation is the starting point for this coverage. The video is an official preview; our articles are based on published information, not a review copy or hands-on access."], sourceIds: ["trailer"],
    },
    {
      id: "confirmed-changes", title: "What is changing?",
      bullets: ["Rebuilt visuals and a new orchestral presentation.", "Voiced cinematics with more character dialogue.", "Updated camera and movement controls."],
      paragraphs: ["The features guide expands on Nintendo’s announcements. Our gameplay guide focuses on how the new interaction and navigation options may affect the way you approach the adventure."], sourceIds: ["announcement"],
    },
    {
      id: "versions", title: "Remake or original: which guide do you need?",
      paragraphs: ["Check the platform before following a route or button sequence. Nintendo 64 guides, Ocarina of Time 3D guides and Switch 2 coverage describe different releases. A familiar room name is not enough to establish that a puzzle solution still applies.", "Our version comparison keeps that distinction visible. Exact dungeon routes and collectible locations will require verification in the Switch 2 release."], sourceIds: ["history"],
    },
  ],
  articles: [
    {
      slug: "release-date", shortTitle: "Release date & pre-orders", category: "Release guide",
      title: "Ocarina of Time Remake Release Date, Platform & Pre-orders",
      description: "Ocarina of Time arrives on Nintendo Switch 2 on November 5, 2026. Check the official listings, pre-order details and which version to buy.",
      status: "published", ...dates, relatedSlugs: ["remake-vs-original", "new-features"],
      sections: [
        { id: "release-date", title: "When does Ocarina of Time Remake come out?", releaseFacts: true, sourceIds: ["us", "au"] },
        {
          id: "platform", title: "Which version should you look for?",
          paragraphs: ["Choose the listing marked Nintendo Switch 2. The game’s official name is The Legend of Zelda: Ocarina of Time, so the word ‘Remake’ may not appear on a retailer’s product title.", "When comparing a listing with an older copy, check the platform label and product description together. Similar names do not mean the same release, and this page is not a browser-playable edition."], sourceIds: ["us"],
        },
        {
          id: "pre-orders", title: "Where to check pre-orders",
          paragraphs: ["Nintendo’s official trailer directs viewers to pre-order and says the launch physical version has textured foil packaging while supplies last. Treat that packaging as a limited-availability detail, not a guaranteed feature of every future physical copy.", "Use the official regional listings in the sources below as your starting point. Before ordering from a retailer, check the edition, delivery estimate, currency, cancellation terms and whether any advertised packaging is explicitly included."], sourceIds: ["trailer", "us", "au"],
        },
        {
          id: "launch-time", title: "Release date is not an unlock-time announcement",
          paragraphs: ["A calendar date alone does not tell you the precise digital unlock time in your region or when a physical order will reach your door. We have not verified a game-specific worldwide unlock schedule in the sources used here.", "If you are planning time off or a launch-night session, wait for the regional store or publisher to specify an unlock time. Do not convert an assumed midnight launch into a countdown."],
        },
        {
          id: "buying-checklist", title: "Before you buy",
          bullets: ["Confirm that the listing is for Nintendo Switch 2.", "Choose the format you want and verify the retailer’s delivery terms.", "Check current regional pricing at checkout rather than relying on an old screenshot.", "Read the confirmed changes if you already own an earlier edition.", "Keep hardware, game and accessory release dates separate."],
          paragraphs: ["Our coverage links to sources for checking a purchase; PlayBloo does not sell this game. Prices and availability can change between this article’s update and your order."],
        },
      ],
    },
    {
      slug: "new-features", shortTitle: "Confirmed new features", category: "What’s new",
      title: "Ocarina of Time Remake: Confirmed New Features",
      description: "A sourced overview of Ocarina of Time’s Switch 2 changes, from visuals and voiced scenes to new controls, with unverified details kept separate.",
      status: "published", ...dates, relatedSlugs: ["gameplay", "remake-vs-original"],
      sections: [
        {
          id: "presentation", title: "Visuals, voices and music",
          table: { headers: ["Confirmed change", "What to expect"], rows: [["Visual overhaul", "A rebuilt visual presentation."], ["Voiced cutscenes", "Spoken cinematic scenes with expanded character dialogue."], ["Orchestral music", "A symphonic treatment of the music."]] },
          paragraphs: ["These are the presentation changes Nintendo has announced. Voiced cutscenes should not be read as a promise that every line in every interaction is spoken. Expanded dialogue also does not establish that there are new endings or extra dungeons."], sourceIds: ["announcement"],
        },
        {
          id: "movement", title: "Movement and camera changes",
          paragraphs: ["Nintendo’s US listing confirms jumping and dashing alongside improved camera movement. That is a good reason to revisit old control habits when you begin the new version.", "The practical question for a returning player is how traversal and observation work together: can you inspect a room before crossing it, and how does the new movement affect your approach? Those are useful checks for launch-day play, rather than proof that an old shortcut still works."], sourceIds: ["us"],
        },
        {
          id: "assistance", title: "More ways to find your next step",
          paragraphs: ["Nintendo’s UK page introduces Threads of Time, a story recap and current-objective feature. It also describes motion aiming for ranged tools and microphone input as an alternative way to perform ocarina melodies.", "Our gameplay guide explains how to approach these options without assuming a final button layout. If you prefer a traditional input method, check each feature’s in-game settings before settling on a control setup."], sourceIds: ["uk"],
        },
        {
          id: "extras", title: "Optional extras: amiibo and ZELDA NOTES",
          paragraphs: ["Nintendo lists amiibo support and a ZELDA NOTES companion service. The new Young Link and Young Zelda figures are announced for 2027; their timing is separate from the game’s launch.", "For planning your first playthrough, focus on the game itself. Check the official pages for compatible accessories and companion-app requirements before purchasing anything specifically for an extra."], sourceIds: ["us"],
        },
        {
          id: "unconfirmed", title: "Questions this announcement does not settle",
          bullets: ["Whether every puzzle and collectible stays in its old location.", "Whether Master Quest or additional dungeons are included.", "The complete difficulty, accessibility and control-remapping options.", "Final performance across every scene and display mode."],
          paragraphs: ["These remain unverified in our coverage. A changed camera or a new visual treatment does not, by itself, answer any of them. We will update individual claims when there is specific evidence."],
        },
      ],
    },
    {
      slug: "remake-vs-original", shortTitle: "Remake vs. original", category: "Version comparison",
      title: "Ocarina of Time Remake vs. Original: Which Differences Are Confirmed?",
      description: "Compare the Switch 2 remake with the N64 original and keep Ocarina of Time 3D separate. Understand the known changes and limits of older guides.",
      status: "published", ...dates, relatedSlugs: ["new-features", "gameplay", "release-date"],
      sections: [
        {
          id: "three-versions", title: "First, separate the releases",
          table: { headers: ["Release", "How to identify it"], rows: [["Ocarina of Time — Nintendo 64", "The original adventure, first released in 1998."], ["Ocarina of Time 3D — Nintendo 3DS", "Nintendo’s earlier remake for the 3DS."], ["Ocarina of Time — Nintendo Switch 2", "The newly rebuilt version covered by this guide hub."]] },
          paragraphs: ["‘Original’ on this page means the Nintendo 64 release. A feature remembered from Ocarina of Time 3D should not automatically be credited to the N64 game, or assumed to return on Switch 2."], sourceIds: ["history", "announcement"],
        },
        {
          id: "comparison", title: "What changes in the Switch 2 version?",
          table: { headers: ["Area", "Earlier releases", "Confirmed for Switch 2"], rows: [["Visuals", "N64 original; a separate graphical overhaul and stereoscopic display on 3DS", "Newly rebuilt visual presentation"], ["Movement and camera", "Original analogue movement, retained with the Circle Pad on 3DS", "Revised camera and movement controls"], ["Item selection and aiming", "The 3DS remake introduced a touch inventory and gyro aiming", "Quick equipment switching and motion aiming"], ["Story presentation", "The earlier versions provide the comparison baseline", "Voiced cutscenes and expanded dialogue"]] },
          sourceIds: ["announcement", "3ds", "uk"],
        },
        {
          id: "3ds-differences", title: "What if you remember the 3DS version?",
          paragraphs: ["Some conveniences associated with a ‘new’ Ocarina of Time already existed on 3DS. Nintendo’s 3DS page documents touchscreen inventory management and gyro-assisted first-person aiming. Motion aiming on Switch 2 is therefore not a first for every edition of this game.", "Nintendo’s development interview also discusses using the touchscreen to make putting on and removing the Iron Boots easier in the Water Temple. That is a specific 3DS improvement. It does not confirm how the Switch 2 inventory handles the same equipment, or whether that dungeon’s layout changes again.", "For a useful comparison, separate the feature from its implementation: two editions can both offer quicker item handling while using different screens, menus and buttons."], sourceIds: ["3ds", "3ds-development"],
        },
        {
          id: "old-guides", title: "Can you use an original-game walkthrough?",
          paragraphs: ["An older guide can provide historical context and a vocabulary for discussing places, items and characters. It is not sufficient evidence for a precise Switch 2 puzzle solution.", "Treat every instruction that depends on timing, room layout, an item position or a controller button as something to re-check. If a route fails, check that the guide names your edition before assuming you missed a step."],
          bullets: ["Check the version label and date of the guide.", "Look for screenshots captured from the version you are playing.", "Distinguish general story context from a tested sequence of actions.", "For collectibles, verify the specific location rather than only the total count."],
        },
        {
          id: "choosing", title: "How to decide whether to revisit it",
          paragraphs: ["For returning players, the useful comparison is whether the announced presentation and interaction changes match what you want from another playthrough. Watch the official trailer and list the changes that matter to you; nostalgia alone does not tell you how the new controls will feel.", "For new players, choose an edition first, then follow guides written for it. You do not need to study every historical difference before beginning. This is a pre-release comparison, so it does not assign a review score or declare one version the definitive experience."], sourceIds: ["trailer"],
        },
      ],
    },
    {
      slug: "gameplay", shortTitle: "Gameplay & controls", category: "Gameplay guide",
      title: "Ocarina of Time Remake Gameplay: Controls, Exploration & Trailer",
      description: "Explore Nintendo’s confirmed Switch 2 gameplay details: motion aiming, Threads of Time, ocarina inputs and a practical first-session checklist.",
      status: "published", ...dates, relatedSlugs: ["new-features", "remake-vs-original"],
      sections: [
        { id: "official-footage", title: "Start with Nintendo’s official footage", trailer: true, paragraphs: ["Use this official presentation to get a feel for the new version. The checklist below draws on Nintendo’s published descriptions; it is not a hands-on control guide or a frame-by-frame performance test."], sourceIds: ["trailer"] },
        {
          id: "orientation", title: "Getting your bearings",
          paragraphs: ["Threads of Time provides a recap and your current objectives. Nintendo also describes time passing throughout the game, with encounters that can change after sunset.", "A useful first-session habit will be to consult your objective before wandering, then observe the area again if conditions change. That is our suggested approach to the announced systems, not a verified quest solution."], sourceIds: ["uk"],
        },
        {
          id: "aiming", title: "Aiming and switching equipment",
          paragraphs: ["The UK product page confirms quick equipment swapping and motion aiming for tools such as slingshots and bows.", "When you start playing, try an aiming option in a low-pressure area before using it in a fight. Establish how to select an item and regain your view of the room. We are deliberately not publishing a button chart before checking the actual control menu."], sourceIds: ["uk"],
        },
        {
          id: "ocarina", title: "Playing the ocarina",
          paragraphs: ["Nintendo describes both button input and humming into the Switch 2 microphone for melodies. Its page also suggests trying a real ocarina.", "Use the game’s own instruction for a learned song. Old N64 or 3DS button notation is version-specific, so copying it directly is not a reliable way to learn a Switch 2 input sequence. Microphone recognition, environmental noise and the available settings are details to assess in practice."], sourceIds: ["uk"],
        },
        {
          id: "first-session", title: "Your first-session checklist",
          bullets: ["Read the control menu before bringing over habits from an older version.", "Try movement, camera and aiming in a safe area.", "Find the objective recap and understand how to return to it.", "Follow the on-screen ocarina instructions for your chosen input.", "Check a guide’s version label before following a puzzle or collectible route."],
          paragraphs: ["This preparation is intended to help you learn the new edition on its own terms. Exact opening routes, boss tactics and complete item checklists belong in a verified walkthrough once the release can be tested."],
        },
      ],
    },
    {
      slug: "walkthrough", shortTitle: "Walkthrough preparation", category: "Coverage preview",
      title: "Ocarina of Time Remake Walkthrough: Coverage Status",
      description: "Our Switch 2 walkthrough is in preparation. See the planned coverage and why original-game routes are not yet verified for the remake.",
      status: "preview", ...dates, relatedSlugs: ["gameplay", "remake-vs-original"],
      sections: [
        { id: "status", title: "A Switch 2 walkthrough is not available here yet", paragraphs: ["We have not played the release version. This page records the scope of our planned coverage, and does not contain tested dungeon routes, boss solutions or collectible locations. Use the published gameplay and version guides for information you can check before release."] },
        {
          id: "planned-coverage", title: "Planned coverage after verification",
          bullets: ["Story progression and dungeon routes", "Boss strategies and beginner tips", "Items, equipment and ocarina songs", "Heart Pieces and Gold Skulltulas", "Side quests, minigames and maps"],
          paragraphs: ["These are editorial categories, not confirmation that every older-game activity returns unchanged. Individual guides will identify the version tested and show any relevant differences."],
        },
        { id: "original-reference", title: "Using older guides in the meantime", paragraphs: ["If you are currently playing the N64 original or Ocarina of Time 3D, look for a guide explicitly written for that version. We will not relabel their routes as Switch 2 instructions. A familiar dungeon name does not verify its layout, rewards or solution in the remake."], sourceIds: ["history"] },
      ],
    },
  ],
};
