import type { GuideTopic } from "./types";

const publicationDate = "2026-11-11T10:00:00.000Z";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };

const robloxPage = "https://www.roblox.com/games/76870565041704/Unstable-SMP-FFA";
const robloxApi = "https://games.roblox.com/v1/games?universeIds=10772281976";
const fandom = "https://unstable-universe-mc.fandom.com/";

export const unstableSmpFfa: GuideTopic = {
  slug: "unstable-smp-ffa",
  name: "Unstable SMP FFA",
  officialName: "Unstable SMP FFA [JAVA PVP!]",
  title: "Unstable SMP FFA Guide: Modes and Tips",
  description:
    "How to play Unstable SMP FFA on Roblox: joining the real experience by Insomnia Studios, FFA, Duels and Simulator modes, 28 characters and beginner PvP tips.",
  status: "published",
  platforms: ["Roblox (PC, mobile, gamepad)"],
  releaseDate: "2026-10-21",
  releaseStatus: "released",
  publisher: "[IS] Insomnia Studios",
  cover: {
    src: "/images/guides/unstable-smp-ffa.webp",
    alt: "Two crowned Minecraft-style kings cross swords in Unstable SMP FFA while diamond-armored armies face off beneath a burning sky",
    credit: "Official Unstable SMP FFA game thumbnail © [IS] Insomnia Studios",
    sourceUrl: "https://tr.rbxcdn.com/180DAY-010bd13f7e20015341b7cda524de5bdb/768/432/Image/Webp/noFilter",
    width: 768,
    height: 432,
  },
  ...dates,
  verifiedAt: "2026-11-11",
  sources: [
    { id: "roblox", label: "Roblox — Unstable SMP FFA [JAVA PVP!] official game page by [IS] Insomnia Studios (game modes, characters, arenas; checked November 11, 2026)", url: robloxPage },
    { id: "roblox-api", label: "Roblox games API — universe 10772281976: creation date, visit count, concurrent players, developer group and description (checked November 11, 2026)", url: robloxApi },
    { id: "fandom", label: "Unstable Universe Wiki (Fandom) — the scripted Minecraft series by ParrotX2, Wemmbu and SpokeIsHere that the game is based on (community-maintained)", url: fandom },
  ],
  sections: [
    {
      id: "what-it-is",
      title: "A Minecraft-series simulator on Roblox",
      paragraphs: [
        "Unstable SMP FFA [JAVA PVP!] is a Roblox battlegrounds experience by the group [IS] Insomnia Studios. It turns the Unstable Universe — a scripted, cinematic Minecraft SMP series whose namesake characters include ParrotX2, Wemmbu and SpokeIsHere — into a playable free-for-all with combat modeled on Java 1.21.11 mechanics: spear lunges, mace smashes, elytra and rockets, wind charges, pearls, tridents and TNT-cart PvP.",
        "The experience carries an explicit disclaimer on its official page: it is not affiliated with or endorsed by Mojang, Microsoft, Minecraft or the Unstable Universe. It is a fan-built simulator, and a viral one — the Roblox API reported about 7.4 million visits and more than 24,000 concurrent players when we checked on November 11, 2026.",
      ],
      sourceIds: ["roblox", "roblox-api", "fandom"],
    },
    {
      id: "release-date",
      title: "Release date and status",
      releaseFacts: true,
      paragraphs: [
        "The experience was created on Roblox on October 21, 2026 and was updated as recently as November 10, 2026 — the day before our check. Roblox experiences launch quietly and grow through updates, and this one scaled fast: 18,000+ favorites alongside the visit count at our check.",
        "Because Roblox experiences patch constantly, treat specific kit stats and arena rotations as subject to change — the numbers below come from the official page description as checked on November 11, 2026.",
      ],
      sourceIds: ["roblox-api"],
    },
    {
      id: "modes",
      title: "FFA, Duels and the Simulator",
      paragraphs: [
        "The free-for-all is the headline: you spawn as a character with their real gear and trims and fight everyone else, Java-style. Alongside it, the official page lists Duels for structured one-on-one fights and a Practice Dummy for warming up.",
        "The Simulator mode flips the framing: take on the armies of the Unstable SMP — from NULL and The Law to Cindercrest and the Kingdom of Unstable — solo or in a party of up to 10, against up to 100 soldiers that fight back and heal. It is a wave-defence read of the series' battles rather than another deathmatch queue.",
      ],
      sourceIds: ["roblox"],
    },
    {
      id: "arenas",
      title: "Three arenas on a 15-minute rotation",
      paragraphs: [
        "FFA maps rotate through three arenas named after the series' set pieces: Northern Council, MinuteTech's End Base and FlameFrags & Wemmbu's 2v1000, swapping every 15 minutes per the official description. The rotation means a bad arena match is a 15-minute problem, not a server choice.",
        "The 2v1000 arena is the series' most famous battle — FlameFrags and Wemmbu holding off an army — and the game scales that fantasy down into a normal PvP sandbox.",
      ],
      sourceIds: ["roblox", "fandom"],
    },
    {
      id: "characters",
      title: "28 characters and The Wraith",
      paragraphs: [
        "You play as actual characters from the series: 28 of them per the official page, including Wemmbu, ParrotX2, SpokeIsHere, FlameFrags and ManePear, each spawning with their real gear and trims. A 29th unlockable — The Wraith — plays invisible.",
        "Kit identity is the whole game: the page's examples span spear lunges, mace smashes, elytra-and-rocket mobility, wind charges, ender pearls, tridents and TNT-cart PvP. Learning one kit's buttons beats re-rolling for a 'better' one.",
      ],
      sourceIds: ["roblox"],
    },
    {
      id: "about-this-coverage",
      title: "About this coverage",
      paragraphs: [
        "PlayBloo has not played Unstable SMP FFA and is not affiliated with Roblox, Mojang or Insomnia Studios. Facts come from the official Roblox game page and the Roblox games API as checked on November 11, 2026, with series context from the community-run Unstable Universe wiki. We do not cover scripts, exploits or account-generation tools of any kind — those violate Roblox's Terms of Use, and pages offering them are the wrong neighborhood.",
      ],
      sourceIds: ["roblox", "roblox-api"],
    },
  ],
  articles: [
    {
      slug: "how-to-play",
      title: "How to Play Unstable SMP FFA on Roblox",
      shortTitle: "How to join and what the modes do",
      description:
        "Joining Unstable SMP FFA the right way: finding the real experience by Insomnia Studios, avoiding copycats, and how FFA, Duels and Simulator actually work.",
      category: "How to play",
      status: "published",
      cover: {
        src: "/images/guides/unstable-smp-ffa-how-to-play.webp",
        alt: "Four Unstable SMP FFA characters holding shields in front of a castle arena at sunset",
        credit: "Official Unstable SMP FFA game thumbnail © [IS] Insomnia Studios",
        sourceUrl: "https://tr.rbxcdn.com/180DAY-66bd60e4732ffef1e891399a9f56deea/768/432/Image/Webp/noFilter",
        width: 768,
        height: 432,
      },
      ...dates,
      relatedSlugs: ["pvp-tips"],
      sections: [
        {
          id: "joining",
          title: "Joining the real experience (and avoiding copycats)",
          paragraphs: [
            "The experience lives at roblox.com/games/76870565041704 — search 'Unstable SMP FFA' in Roblox or open the official page directly and press Play. The developer group to match is [IS] Insomnia Studios, per the official page we checked on November 11, 2026.",
            "Match that name before playing: similarly named copycat experiences exist in the searches around this game, and Roblox search ranking makes near-duplicates look official. If the developer shown is not Insomnia Studios, it is not the experience this guide describes.",
          ],
          sourceIds: ["roblox", "roblox-api"],
        },
        {
          id: "platforms",
          title: "PC, phone and controller",
          paragraphs: [
            "The official page lists PC, phone and controller support with rebindable controls — unusual among Roblox battlegrounds experiences, and the reason console-style players are common in its lobbies. Movement follows the standard Roblox scheme, and each character kit layers its own abilities on top.",
            "Because the combat imitates Java 1.21.11 mechanics, expect kit buttons to map to familiar Minecraft actions: a mace smash, a spear lunge, a wind charge, a pearl throw. The Practice Dummy exists precisely to learn those buttons before a real match.",
          ],
          sourceIds: ["roblox"],
        },
        {
          id: "modes-detail",
          title: "The modes, one by one",
          paragraphs: [
            "Free-for-all is the default loop: everyone against everyone, with the arena rotating every 15 minutes among Northern Council, MinuteTech's End Base and FlameFrags & Wemmbu's 2v1000. Duels give you a structured opponent, and the Practice Dummy lets you test a new kit's combo timing with no pressure.",
            "Simulator is the mode series fans came for: solo or with a party of up to 10, fight up to 100 soldiers from the armies of NULL, The Law, Cindercrest and the Kingdom of Unstable — enemies that fight back and heal, so burst damage and target priority matter more than in FFA.",
          ],
          image: {
            src: "/images/guides/unstable-smp-ffa-characters.webp",
            alt: "A group of Unstable SMP FFA characters with a TNT block, showing the game's character roster in costume",
            width: 768,
            height: 432,
            caption: "Official thumbnail: characters spawn with their real series gear — the roster is the kit list.",
          },
          sourceIds: ["roblox"],
        },
        {
          id: "what-it-is-not",
          title: "What this game is not",
          bullets: [
            "Not an official Minecraft product — the page disclaims Mojang, Microsoft, Minecraft and the Unstable Universe.",
            "Not a server you join by IP — it is a Roblox experience; matchmaking handles servers, and no legitimate 'server address' exists.",
            "Not scriptable in any legitimate way — exploits and script hubs break Roblox's Terms of Use and get accounts banned; we do not link them.",
            "Not static — kits, arenas and rotations patch constantly (last updated November 10, 2026 at our check).",
          ],
          sourceIds: ["roblox", "roblox-api"],
        },
      ],
    },
    {
      slug: "pvp-tips",
      title: "Unstable SMP FFA PvP Tips for Beginners",
      shortTitle: "Beginner PvP tips",
      description:
        "Beginner PvP advice for Unstable SMP FFA: learn one kit, use the Practice Dummy and Duels, respect the 15-minute arena rotation — and skip the scripts.",
      category: "PvP tips",
      status: "published",
      cover: {
        src: "/images/guides/unstable-smp-ffa-pvp.webp",
        alt: "A purple-armored Unstable SMP FFA fighter with a shield in front of an army of diamond-clad soldiers",
        credit: "Official Unstable SMP FFA game thumbnail © [IS] Insomnia Studios",
        sourceUrl: "https://tr.rbxcdn.com/180DAY-f019332d741337a1bb7358fd85424eb7/768/432/Image/Webp/noFilter",
        width: 768,
        height: 432,
      },
      ...dates,
      relatedSlugs: ["how-to-play"],
      sections: [
        {
          id: "first-steps",
          title: "Dummy first, Duels second, FFA third",
          paragraphs: [
            "The game hands you a graded warm-up path, straight from its own feature list: the Practice Dummy for button memory, Duels for a live opponent without the chaos, and only then the free-for-all. Java-style combat rewards combo timing — a mace smash or spear lunge used at the wrong beat is just a long animation.",
            "Editorial advice, not a playtested route: pick one of the 28 characters and stay with it for your first sessions. Kit-swapping multiplies what you have to learn; the official examples (spear lunges, mace smashes, wind charges, pearls) each have distinct movement consequences.",
          ],
          sourceIds: ["roblox"],
        },
        {
          id: "movement",
          title: "Mobility items are survival items",
          paragraphs: [
            "The kit list reads like a mobility catalog: elytra and rockets, wind charges, ender pearls, tridents. In a 12-player-per-server free-for-all (the Roblox API lists max 12 players per server), disengaging matters as much as engaging — a pearl or a wind charge used to escape is worth more than the damage a worse option would deal.",
            "The same applies to Simulator's 100-soldier waves: repositioning before you are surrounded is the difference between a cleared wave and a respawn.",
          ],
          image: {
            src: "/images/guides/unstable-smp-ffa-army.webp",
            alt: "A cyan and red Unstable SMP FFA character leading an army of purple soldiers across a castle courtyard",
            width: 768,
            height: 432,
            caption: "Official thumbnail: Simulator mode pits your party against armies that fight back and heal.",
          },
          sourceIds: ["roblox"],
        },
        {
          id: "rotation-awareness",
          title: "Play the rotation, not the map",
          paragraphs: [
            "Arenas swap every 15 minutes among Northern Council, MinuteTech's End Base and FlameFrags & Wemmbu's 2v1000, per the official page. Treat the timer as part of your loadout decision: commit to a fight you can finish before the swap, and don't build a strategy around camping one location.",
            "If an arena's layout hates your kit, the correct move is patience — the rotation brings a friendlier one in minutes. That patience is also what separates this from server-hopping habits in other battlegrounds games.",
          ],
          sourceIds: ["roblox"],
        },
        {
          id: "scripts-warning",
          title: "About 'scripts' and shortcut searches",
          bullets: [
            "Script hubs and executors violate Roblox's Terms of Use and put your account at risk — the bans are account-level, not experience-level.",
            "No legitimate 'server IP' exists: matchmaking is built into Roblox, and pages promising IPs or private-server access are misleading.",
            "Kit power comes from the official roster; 'unlock everything' pages are not part of the game we verified.",
            "If a video or page offers a shortcut that requires running external software, that is the tell — close the tab.",
          ],
          paragraphs: [
            "The honest shortcut is the boring one: the Practice Dummy, one kit, and the Duels queue. The game's own design gives beginners every tool short of an unfair advantage.",
          ],
          sourceIds: ["roblox"],
        },
      ],
    },
  ],
};
