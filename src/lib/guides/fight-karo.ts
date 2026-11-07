import type { GuideTopic } from "./types";

const dates = {
  publishedAt: "2026-11-07T22:00:00+08:00",
  updatedAt: "2026-11-07T22:00:00+08:00",
};

export const fightKaro: GuideTopic = {
  slug: "fight-karo",
  name: "Fight Karo",
  officialName: "Fight Karo / Sansad Showdown",
  title: "Fight Karo Guide: Fighters, Combos and Rooms",
  description:
    "Fight Karo (Sansad Showdown) is a viral Indian political satire browser fighter. Learn the controls, every fighter's super, and how friend rooms work.",
  status: "published",
  platforms: ["Browser"],
  releaseDate: "2026-11-03",
  releaseStatus: "released",
  publisher: "Shivam Builds (indie developer)",
  cover: {
    src: "/images/guides/fight-karo.webp",
    alt: "Sansad Showdown title screen with two cartoon politicians squaring off in front of a parliament-style arena",
    credit: "Screenshot of the official Fight Karo title screen — fightkaro.com",
    sourceUrl: "https://fightkaro.com/",
    width: 1600,
    height: 900,
  },
  ...dates,
  verifiedAt: "2026-11-07",
  sources: [
    { id: "official", label: "Fight Karo — official site and play page", url: "https://fightkaro.com/" },
    { id: "screens", label: "In-game fighter select and friend-room screens (checked 2026-11-07)", url: "https://fightkaro.com/" },
    { id: "deccan", label: "Deccan Herald — Fightkaro, a new political satire game gaining traction", url: "https://www.deccanherald.com/india/literally-fight-as-indian-politicians-fightkaro-a-new-political-satire-game-gaining-traction-on-social-media-4205714" },
  ],
  sections: [
    {
      id: "about",
      title: "What Fight Karo is",
      paragraphs: [
        "Fight Karo, titled Sansad Showdown: The Great Kursi Fight on its own title screen, is a free browser fighting game that plays Indian politics for laughs. You pick one of nine cartoon ‘netas’ and settle seat-of-power rivalries the literal way, with uppercuts, sweeps and over-the-top super moves in front of a cartoon parliament.",
        "It is a 3D browser game built with Three.js, made by indie developer Shivam Builds. The game broke out in early November 2026, with coverage from Deccan Herald and News9, and a Diwali special event is live in-game right now.",
        "The developers open the game with a satire notice: it is political satire and parody, not connected to or endorsed by any political leader, party or government body, and any resemblance to real persons is used in a satirical context. This guide describes the game on its own terms, using the fighter names shown in-game.",
      ],
      sourceIds: ["official", "screens", "deccan"],
    },
    {
      id: "play-official",
      title: "Where to play Fight Karo",
      releaseFacts: true,
      paragraphs: [
        "Fight Karo runs on the official site only. There is no download, no app store version, and no copy hosted elsewhere — the multiplayer friend rooms connect through the official servers, so the official page is also the only complete way to play.",
        "One practical note: the developer serves the game with an embed allowlist that blocks third-party sites from framing it, so game portals (including PlayBloo) link out instead of hosting it. Clicking through takes you straight to the real thing.",
      ],
      link: { label: "Open the official Fight Karo site", href: "https://fightkaro.com/" },
      sourceIds: ["official", "screens"],
    },
    {
      id: "modes",
      title: "Modes at a glance",
      bullets: [
        "Fight vs CPU — pick your neta, an opponent and a stage, then set the CPU to Easy, Normal or Hard.",
        "Play with a friend — host a room or join one with a code; see our friend rooms guide below.",
        "Diwali special — a limited event with Diwali-themed decorations on the Sansad stage, a ‘Diwali card bhejo’ greeting feature, and a locked portal that opens after you beat the boss fighter Mbapu.",
      ],
      sourceIds: ["screens"],
    },
    {
      id: "guide-articles",
      title: "In this guide",
      paragraphs: ["Start with the controls, learn what every fighter’s super does, then grab a friend."],
    },
  ],
  articles: [
    {
      slug: "how-to-play",
      title: "Fight Karo Controls and Combos",
      shortTitle: "Controls",
      description:
        "Full Fight Karo keyboard controls: movement, block, grab, special moves, combos and the super meter, plus CPU difficulty levels and all three stages.",
      category: "How to play",
      status: "published",
      publishedAt: "2026-11-07T22:00:00+08:00",
      updatedAt: "2026-11-07T22:00:00+08:00",
      relatedSlugs: ["fighters", "friend-rooms"],
      sections: [
        {
          id: "controls",
          title: "Keyboard controls",
          paragraphs: ["The fighter select screen lists the full control map. Everything is keyboard-driven on desktop:"],
          table: {
            headers: ["Action", "Keys"],
            rows: [
              ["Move", "A / D or ← / →"],
              ["Jump", "W or ↑"],
              ["Crouch", "S or ↓"],
              ["Block", "Hold back (away from the opponent)"],
              ["Punch", "J"],
              ["Kick", "K"],
              ["Grab", "L"],
              ["Super", "I or Space"],
              ["Fight / confirm", "Enter"],
              ["Pick stage", "T"],
              ["CPU difficulty", "1 / 2 / 3"],
              ["Pause", "Esc"],
              ["Music / mute", "M / N"],
            ],
          },
          sourceIds: ["screens"],
        },
        {
          id: "specials-combos",
          title: "Specials and combos",
          paragraphs: [
            "Specials are directional button inputs, and every fighter renames them to fit their persona — MITRAMAN throws a ‘DEMONETIZATION PALM!’, YATRA BOY kicks off a ‘LAMBI YATRA KICK!’, and DEEDEE’s grab becomes ‘CHAPPAL CHAMATKAR!’. The inputs stay the same for everyone:",
          ],
          table: {
            headers: ["Input", "Move"],
            rows: [
              ["→ + J", "Special 1"],
              ["→ + K", "Special 2"],
              ["↓ + K", "Sweep"],
              ["J, J · J, J, K · J, K, K", "Punch chains"],
              ["K, K · ↓, J · ↓, K", "Kick chains and lows"],
              ["I or Space with a full meter", "Super move"],
            ],
          },
          sourceIds: ["screens"],
        },
        {
          id: "super-meter",
          title: "The super meter",
          paragraphs: [
            "Landing hits fills your meter; when it is full, I or Space triggers your fighter’s super — a cinematic attack that freezes the opponent. Supers are strong but not instant wins: MITRAMAN’s MITRA CHAKRA, for example, deals about 30% damage if it connects. Casting one empties the meter, so the real decision is when to cash it in.",
          ],
          sourceIds: ["screens"],
        },
        {
          id: "cpu-stages",
          title: "CPU difficulty and stages",
          bullets: [
            "CPU difficulty comes in three steps — 1 Easy, 2 Normal, 3 Hard — set before the fight.",
            "SANSAD — the parliament stage, currently dressed up in its Diwali edition with lamps and festoons.",
            "JANTAR MANTAR — the protest-ground stage.",
            "DESI SADAK — the street stage.",
            "Press T on the fighter select screen to cycle stages.",
          ],
          sourceIds: ["screens"],
        },
        {
          id: "first-fight-tips",
          title: "Tips for your first fight",
          bullets: [
            "Block is directional: hold away from the opponent, not a dedicated button — walking backwards is your defense.",
            "The sweep (↓ + K) is your answer to opponents who jump a lot; it catches grounded approaches and starts the ↓, K chain.",
            "Grabs (L) beat blocking. If the CPU is turtling on Normal or Hard, grab instead of hammering punch.",
            "Don’t hold onto a full super for the KO — a 30%-damage super spent mid-round to break pressure is usually worth more than a finisher you never land.",
          ],
        },
      ],
    },
    {
      slug: "fighters",
      title: "Fight Karo Roster: Every Neta and Super",
      shortTitle: "Fighters",
      description:
        "All nine Fight Karo fighters with their super moves, from MITRAMAN's MITRA CHAKRA to boss MBAPU, plus what each super does in the arena.",
      category: "Fighters",
      status: "published",
      publishedAt: "2026-11-07T22:00:00+08:00",
      updatedAt: "2026-11-07T22:00:00+08:00",
      relatedSlugs: ["how-to-play", "friend-rooms"],
      cover: {
        src: "/images/guides/fight-karo-fighters.webp",
        alt: "Fight Karo fighter select screen showing the nine-fighter roster and full keyboard control map",
        credit: "Screenshot of the official Fight Karo fighter select screen — fightkaro.com",
        sourceUrl: "https://fightkaro.com/",
        width: 1600,
        height: 900,
      },
      sections: [
        {
          id: "roster",
          title: "The full roster",
          paragraphs: [
            "Fight Karo launches you into ‘SELECT YOUR NETA’ — nine satirical fighters, each a cartoon caricature with their own outfit, stats and renamed move set. Here is everyone on the select screen, with the super move each one casts:",
          ],
          table: {
            headers: ["Fighter", "Team", "Super", "What it does"],
            rows: [
              ["MITRAMAN", "Team Vaada", "MITRA CHAKRA", "Rises into the sky as a spinning chakra grows from a spark, then hurls it for about 30% damage."],
              ["YATRA BOY", "Team Yatra", "ALOO SE SONA", "Zaps the opponent into an aloo, feeds it to his machine — and out comes pure sona, for 30% damage."],
              ["DEEDEE", "—", "JADU HOBE", "Stirs a bubbling black pot to a ‘humba humba’ chant, then transforms the opponent."],
              ["TARIFF TAAU", "—", "TARIFF TSUNAMI", "A tariff-themed super barrage."],
              ["DOZER DADA", "—", "DOZER KA DHAMAKA", "A bulldozer-flavored blast."],
              ["TOLL MAN", "—", "GADDHA BLAST", "A pit-and-toll themed explosion."],
              ["SUTTI BABU", "—", "TIME IS MONEY", "A clock-themed super."],
              ["RAIL RAJA", "—", "RAIL RAJA EXPRESS", "A train-themed super rush."],
              ["MBAPU (boss)", "—", "MANCH CHHODO", "The boss fighter’s super — beat Mbapu to open the portal on the title screen."],
            ],
          },
          sourceIds: ["screens"],
        },
        {
          id: "naming",
          title: "About the names",
          paragraphs: [
            "The fighters are satirical caricatures, and the game is upfront about it: the opening satire notice states that Sansad Showdown is political satire and parody, not connected to or endorsed by any political leader or party. The fighter names above are the ones the game itself displays, so this guide uses them as-is rather than guessing at real-world equivalents.",
            "The move sets carry most of the jokes: the same skeleton of punches, kicks and sweeps is reskinned per fighter with names like ‘VIKAS UPPERCUT!’, ‘GST SWEEP!’, ‘HUGPLOMACY!’, ‘CHAPPAL SLAP!’ and ‘NON-STOP DHARNA COMBO!’. Pick a fighter for the personality — the inputs are identical.",
          ],
          sourceIds: ["screens"],
        },
        {
          id: "picking",
          title: "Who to pick first",
          bullets: [
            "MITRAMAN and YATRA BOY are the defaults on the select screen and are as good a starting point as any — the roster shares one move skeleton, so switching later is cheap.",
            "RANDOM (the ? slot) rolls a fighter for both sides and is a decent way to see matchups you would not pick yourself.",
            "MBAPU is the boss — the title screen gates a portal behind beating him, so the CPU ladder ends there.",
          ],
          sourceIds: ["screens"],
        },
      ],
    },
    {
      slug: "friend-rooms",
      title: "Fight Karo Friend Rooms: Host and Join",
      shortTitle: "Friend rooms",
      description:
        "How Fight Karo friend rooms work: hosting a room, sharing the code, joining a friend, and why the multiplayer needs the official servers.",
      category: "Multiplayer",
      status: "published",
      publishedAt: "2026-11-07T22:00:00+08:00",
      updatedAt: "2026-11-07T22:00:00+08:00",
      relatedSlugs: ["how-to-play", "fighters"],
      cover: {
        src: "/images/guides/fight-karo-friend-rooms.webp",
        alt: "Fight Karo Play with a Friend screen with Host a Room and a code entry Join button",
        credit: "Screenshot of the official Fight Karo friend-room screen — fightkaro.com",
        sourceUrl: "https://fightkaro.com/",
        width: 1600,
        height: 900,
      },
      sections: [
        {
          id: "how-rooms-work",
          title: "Hosting and joining",
          paragraphs: [
            "From the fighter select screen, ‘PLAY WITH A FRIEND’ opens the room menu. The host picks ‘HOST A ROOM’ and gets a room code to share; the friend types that code into the box and hits ‘JOIN’. After the handshake you land in the same fight flow as a CPU match — same stages, same roster, same supers.",
            "Both players need the site open in a browser; there is nothing to download and no account to create.",
          ],
          sourceIds: ["screens"],
        },
        {
          id: "why-official-only",
          title: "Why friend rooms need the official site",
          paragraphs: [
            "The room system is not cosmetic: fighters sync through a WebRTC peer connection whose setup (room codes, signaling and relay credentials) is handled by the official servers. That is why there is no offline or download version of Fight Karo, and why copies of the game files would lose the multiplayer entirely.",
            "It is also why portals like PlayBloo link to the official site instead of embedding it — the developer’s embed allowlist only permits their own domains, and the multiplayer backend only exists there. Bookmark fightkaro.com; that is the whole platform.",
          ],
          sourceIds: ["screens", "official"],
        },
        {
          id: "room-tips",
          title: "Practical tips",
          bullets: [
            "Share the room code exactly as shown — it is the only thing your friend needs to join.",
            "If a join stalls, both players refreshing the page and re-hosting is faster than troubleshooting the code.",
            "The host sets the stage and fighters before the fight, so agree on the matchup first.",
          ],
        },
      ],
    },
  ],
};
