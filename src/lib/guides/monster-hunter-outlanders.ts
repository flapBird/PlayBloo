import type { GuideTopic } from "./types";

const dates = {
  publishedAt: "2026-10-29T18:00:00+08:00",
  updatedAt: "2026-10-29T18:00:00+08:00",
};

export const monsterHunterOutlanders: GuideTopic = {
  slug: "monster-hunter-outlanders",
  name: "Monster Hunter Outlanders",
  officialName: "Monster Hunter Outlanders",
  title: "Monster Hunter Outlanders Guide: Launch, Beginner Tips & Weapons",
  description: "Start hunting in Monster Hunter Outlanders with the October 29 launch details, a practical beginner checklist and all seven weapon types explained.",
  status: "published",
  platforms: ["iOS", "Android"],
  releaseDate: "2026-10-29",
  releaseStatus: "released",
  publisher: "Level Infinite / Garena",
  cover: {
    src: "/images/guides/monster-hunter-outlanders.webp",
    alt: "Monster Hunter Outlanders hunters confronting a towering golden-winged dragon beneath stormy skies",
    credit: "Official promotional artwork © Proxima Beta / CAPCOM",
    sourceUrl: "https://monsterhunteroutlanders.com/images/share.jpg",
    width: 1600,
    height: 900,
  },
  ...dates,
  verifiedAt: "2026-10-29",
  sources: [
    { id: "official", label: "Monster Hunter Outlanders — official game site", url: "https://monsterhunteroutlanders.com/en/index.html" },
    { id: "google-play", label: "Google Play — Monster Hunter Outlanders store listing", url: "https://play.google.com/store/apps/details?id=com.garena.game.mho&hl=en_US" },
    { id: "launch-report", label: "4Gamer — TiMi launch announcement and two control modes, September 29, 2026 (Japanese)", url: "https://www.4gamer.net/games/667/G066758/20260929006" },
  ],
  sections: [
    {
      id: "overview",
      title: "Monster Hunter on mobile, built around a new island",
      paragraphs: [
        "Monster Hunter Outlanders is a free-to-play survival hunting action game for iOS and Android. TiMi Studio Group developed it under license from CAPCOM, with a new story, playable Adventurers, Buddies and title-exclusive monsters alongside the series' familiar hunt-and-craft loop.",
        "This is a native mobile game, not a browser edition or a mobile port of Monster Hunter Wilds. PlayBloo does not host the game. Our launch coverage uses official listings and published reports; it is not a retail-build playtest.",
      ],
      sourceIds: ["official", "google-play"],
    },
    {
      id: "launch",
      title: "Out now on iOS and Android",
      releaseFacts: true,
      paragraphs: [
        "The international mobile release began on October 29, 2026. Availability, publisher and store listing can vary by region, so start with the official site and follow its App Store or Google Play route for your country.",
        "Free to download does not mean every optional item is free. Check the store's in-app-purchase disclosure and the price shown in your own account before buying anything.",
      ],
      link: { label: "Launch date, downloads and regional checks", href: "/guides/monster-hunter-outlanders/release-date" },
      sourceIds: ["official", "google-play", "launch-report"],
    },
    {
      id: "beginners",
      title: "Choose a control style before your first hunt",
      paragraphs: [
        "Outlanders offers two control modes aimed at series veterans and first-time mobile players. Learn movement, camera control and evasion in a low-pressure hunt before committing to a long fight, then use the map and crafting tools to make the next expedition easier.",
      ],
      link: { label: "Read the beginner checklist", href: "/guides/monster-hunter-outlanders/beginners-guide" },
      sourceIds: ["official", "launch-report"],
    },
    {
      id: "weapons",
      title: "Seven weapon types at launch",
      paragraphs: [
        "The launch roster is Great Sword, Long Sword, Dual Blades, Hammer, Lance, Heavy Bowgun and Bow. Each weapon can be paired with an Adventurer to unlock a distinct follow-up technique, so weapon choice is only one part of a build.",
      ],
      link: { label: "Compare all seven weapons", href: "/guides/monster-hunter-outlanders/weapons" },
      sourceIds: ["google-play"],
    },
    {
      id: "co-op",
      title: "Explore alone or hunt with up to four players",
      paragraphs: [
        "You can explore the island alone or call friends into a four-person hunting party. Buddies also accompany you: the official listing names a Palico, Trillan and Rutaco. Treat multiplayer as a reason to coordinate roles and positioning, not as a requirement for every early activity.",
      ],
      sourceIds: ["official", "google-play"],
    },
  ],
  articles: [
    {
      slug: "release-date",
      title: "Monster Hunter Outlanders Release Date, Platforms & Download",
      shortTitle: "Release date & download",
      description: "Monster Hunter Outlanders launched October 29, 2026 on iOS and Android. Check free-to-play access, regional store listings and launch-day download advice.",
      category: "Release information",
      cover: {
        src: "/images/guides/monster-hunter-outlanders-release-date.webp",
        alt: "Monster Hunter Outlanders hunters battling a large fire-breathing monster in Hunt and Explore promotional artwork",
        credit: "Official Google Play artwork © Proxima Beta / CAPCOM",
        sourceUrl: "https://play-lh.googleusercontent.com/NWs8mmK3087z6eivFiPa4p1erxxRfVYSXTBRjrWfKoxKrFMtx-HCmQZFviWUDE2G7Yus33m1WwvWzJIMSJy2Bg=w1052-h592-rw",
        width: 1600,
        height: 900,
      },
      status: "published",
      ...dates,
      relatedSlugs: ["beginners-guide", "weapons"],
      sections: [
        {
          id: "release",
          title: "When did Monster Hunter Outlanders launch?",
          releaseFacts: true,
          paragraphs: [
            "The international release date was October 29, 2026. The game is available as a free-to-play mobile title rather than a paid console or PC release.",
            "A release date is not a universal unlock-time promise. If your store still shows pre-registration or the servers are not responding, check the official channels for your region instead of assuming a midnight launch.",
          ],
          sourceIds: ["official", "launch-report"],
        },
        {
          id: "platforms",
          title: "Which platforms and stores have it?",
          table: {
            headers: ["Platform", "Where to look", "Before installing"],
            rows: [
              ["iPhone / iPad", "The App Store listing reached through the official site", "Check device and OS compatibility, storage and regional availability"],
              ["Android", "The Google Play listing for your region", "Check device compatibility, storage and the in-app-purchase label"],
              ["Browser / console / PC", "No international launch version is listed in these sources", "Do not confuse Outlanders with Wilds or another Monster Hunter title"],
            ],
          },
          sourceIds: ["official", "google-play"],
        },
        {
          id: "regions",
          title: "Regional availability is not one global store listing",
          paragraphs: [
            "Level Infinite and Garena are associated with different regional releases. The Google Play package linked here is the Garena listing; your local store may show a different publisher or may not offer the game yet.",
            "Mainland China has a separate release timeline reported for 2027 or later. That does not establish a date for any other region. Avoid downloading an unfamiliar APK or giving your store credentials to a third-party download site.",
          ],
          sourceIds: ["official", "google-play", "launch-report"],
        },
        {
          id: "free-to-play",
          title: "Is Monster Hunter Outlanders really free?",
          paragraphs: [
            "The official description calls it free-to-play, so the base download does not require an upfront purchase. Optional in-app purchases are a separate question; review their contents and prices in the store and in-game shop.",
            "There is no free browser-play version on PlayBloo. Our pages provide information and link out to official sources rather than hosting the mobile client.",
          ],
          sourceIds: ["official", "google-play"],
        },
        {
          id: "launch-day",
          title: "Launch-day download checklist",
          bullets: [
            "Use the App Store or Google Play route linked by the official site.",
            "Leave enough free storage for the app and any additional resource download shown after installation.",
            "Use a stable connection and keep the device charged during first-time setup.",
            "Check the official server or maintenance notices if login fails; repeated reinstalls do not fix a server outage.",
            "Read the account, region and in-app-purchase terms before making a purchase.",
          ],
          paragraphs: ["We have not measured the installed size, server capacity or performance on every device, so this page deliberately does not invent those figures."],
        },
      ],
    },
    {
      slug: "beginners-guide",
      title: "Monster Hunter Outlanders Beginner’s Guide: First Hunts, Controls & Co-op",
      shortTitle: "Beginner’s guide",
      description: "A practical Monster Hunter Outlanders beginner checklist covering control modes, safe first hunts, exploration, crafting, Buddies and four-player co-op.",
      category: "Getting started",
      cover: {
        src: "/images/guides/monster-hunter-outlanders-beginners-guide.webp",
        alt: "Monster Hunter Outlanders mobile combat interface showing a hunter facing a winged monster with touch controls",
        credit: "Official Google Play screenshot © Proxima Beta / CAPCOM",
        sourceUrl: "https://play-lh.googleusercontent.com/oL1mAYOLmwxTkjP6ak_tSnmBNJW7uF3r8gn7d7gnt0HYLa3Uk7uPCx9N9EIaVoRRfBTt3vvNvbmOo_fo8n3aXQM=w1052-h592-rw",
        width: 1600,
        height: 900,
      },
      status: "published",
      ...dates,
      relatedSlugs: ["weapons", "release-date"],
      sections: [
        {
          id: "controls",
          title: "1. Pick the control mode that matches your experience",
          paragraphs: [
            "The launch announcement describes two control modes: one for players familiar with Monster Hunter and another designed to make the game approachable for newcomers. Try the newcomer option if touch controls are your biggest concern; you can judge the classic option after learning the camera and attack layout.",
            "Before a difficult hunt, practise drawing your weapon, moving the camera, evading and returning your view to the monster. Exact gestures and button placement can change with settings, so use the labels in your own control menu rather than a beta screenshot.",
          ],
          sourceIds: ["launch-report"],
        },
        {
          id: "first-hunt",
          title: "2. Make your first hunt a lesson, not a speed run",
          bullets: [
            "Watch a complete attack before moving into range; learning the warning is more useful than guessing a combo.",
            "Leave room to disengage instead of spending the whole fight directly beneath the monster.",
            "Use a few attacks, then reposition. Do not treat a long opening as permission to ignore the next telegraph.",
            "Learn where healing and other supplies sit in the interface before you urgently need them.",
            "After the hunt, inspect the materials you earned and the equipment they unlock before starting another run.",
          ],
          paragraphs: ["This is general Monster Hunter decision-making adapted to the published Outlanders systems, not a claim that we have tested a particular monster's damage or timing in the retail build."],
        },
        {
          id: "exploration",
          title: "3. Use exploration tools to prepare the next fight",
          paragraphs: [
            "Outlanders combines hunting with open-field exploration and crafting. Its official materials show traversal and field facilities alongside gathering, so treat the journey between monsters as part of your preparation rather than empty travel time.",
            "When you reach a new area, identify a safe route back, check what can be gathered and note any traversal or defensive facility. A second trip should be more informed than the first.",
          ],
          sourceIds: ["official", "launch-report"],
        },
        {
          id: "buddies",
          title: "4. Bring your Buddies into the learning process",
          paragraphs: [
            "The official store description names three companions: Palico, Trillan and Rutaco. Watch how your companion behaves during an easy hunt before relying on it in a harder one.",
            "A Buddy can create space or contribute to a fight, but it does not replace learning an attack pattern. Stay aware of your own position when the monster changes targets.",
          ],
          sourceIds: ["google-play"],
        },
        {
          id: "co-op",
          title: "5. Add other players after you understand the basics",
          paragraphs: [
            "Up to four players can hunt together. For a smoother group, agree on the target, check that everyone is ready and avoid clustering where one sweeping attack can hit the whole party.",
            "Solo exploration remains an official option. Use it to learn a route or a weapon at your own pace, then bring that knowledge into multiplayer rather than treating co-op as a substitute for preparation.",
          ],
          sourceIds: ["official", "google-play"],
        },
      ],
    },
    {
      slug: "weapons",
      title: "Monster Hunter Outlanders Weapons: All 7 Types & Which to Choose",
      shortTitle: "All 7 weapons",
      description: "Compare Great Sword, Long Sword, Dual Blades, Hammer, Lance, Heavy Bowgun and Bow in Monster Hunter Outlanders, with beginner-friendly selection advice.",
      category: "Weapons",
      cover: {
        src: "/images/guides/monster-hunter-outlanders-weapons.webp",
        alt: "Monster Hunter Outlanders adventurers wielding classic weapons while fighting a red monster in mobile gameplay artwork",
        credit: "Official Google Play screenshot © Proxima Beta / CAPCOM",
        sourceUrl: "https://play-lh.googleusercontent.com/yqzRVY764LunUGM23IkXJL8eK06jmEu2vo8u3m5AqrJoMWN4ZW6CDaN3U7YXtP7YEwhwR0M2VslUYg-2hHU8ZQ=w1052-h592-rw",
        width: 1600,
        height: 900,
      },
      status: "published",
      ...dates,
      relatedSlugs: ["beginners-guide", "release-date"],
      sections: [
        {
          id: "all-weapons",
          title: "Every weapon type in the launch roster",
          table: {
            headers: ["Weapon", "Core choice", "Try it if you prefer"],
            rows: [
              ["Great Sword", "Commit to slower, heavier attacks", "Deliberate positioning and rewarding single openings"],
              ["Long Sword", "Build momentum through flowing melee sequences", "Mobile close-range combat and learning attack rhythm"],
              ["Dual Blades", "Stay close with rapid attacks", "Fast pressure and frequent small decisions"],
              ["Hammer", "Use weighty blunt-force attacks", "A direct melee style with impactful hits"],
              ["Lance", "Balance reach and a guarded approach", "Measured advances and holding your ground"],
              ["Heavy Bowgun", "Deal damage from ranged positions", "Heavier ranged play and careful positioning"],
              ["Bow", "Maintain mobile ranged pressure", "Distance, aiming and adjusting your angle"],
            ],
          },
          paragraphs: ["These seven names are confirmed by the official Google Play description. The play-style column is a starting-point summary of each weapon family, not a damage ranking or a retail-build combo guide."],
          sourceIds: ["google-play"],
        },
        {
          id: "adventurer-pairing",
          title: "Your Adventurer matters too",
          paragraphs: [
            "The official listing says that each weapon can form a unique combination with an Adventurer and unlock a new follow-up technique. That means two players using the same weapon family may not have identical combat options.",
            "When comparing setups, record both the weapon and the Adventurer. Do not assume that a beta build, another character or another weapon has the same follow-up input or unlock condition.",
          ],
          sourceIds: ["google-play"],
        },
        {
          id: "which-weapon",
          title: "Which weapon should a beginner choose?",
          paragraphs: [
            "Start with the weapon whose basic rhythm you can repeat without fighting the camera. Bow is a useful experiment if you want to observe from farther away; Lance suits a measured approach; Great Sword teaches patience around openings. None is automatically the best choice for every Adventurer or monster.",
            "Try one melee and one ranged option in an easy hunt. Keep the one that lets you read the monster, evade reliably and recover your position—not simply the one that produces the largest first hit.",
          ],
        },
        {
          id: "what-we-do-not-rank",
          title: "Why there is no damage tier list here yet",
          paragraphs: [
            "A useful tier list needs retail-build damage testing, Adventurer combinations, upgrade states and monster matchups. Store descriptions establish the roster, not the strongest setup.",
            "We will not label a weapon S-tier or publish exact combos from an old beta as launch facts. Check your own move list and upgrade screen while this guide remains focused on choosing a style.",
          ],
        },
      ],
    },
  ],
};
