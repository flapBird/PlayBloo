import type { GuideTopic } from "./types";

const dates = {
  publishedAt: "2026-10-18T18:00:00+08:00",
  updatedAt: "2026-10-18T18:00:00+08:00",
};

export const castlevaniaBelmontsCurse: GuideTopic = {
  slug: "castlevania-belmonts-curse",
  name: "Castlevania: Belmont's Curse",
  officialName: "Castlevania: Belmont's Curse",
  title: "Castlevania: Belmont's Curse Guide: Getting Started & Launch Help",
  description: "Start Castlevania: Belmont's Curse with help for The Fallen, Arcana and exploration, plus demo save-transfer requirements and Konami's PC launch workarounds.",
  status: "published",
  platforms: ["PlayStation 5", "Xbox Series X|S", "Nintendo Switch", "PC"],
  releaseDate: "2026-10-15",
  releaseStatus: "released",
  publisher: "Konami",
  cover: {
    src: "/images/guides/castlevania-belmonts-curse.webp",
    alt: "Rose Belmont against a sunset in an official Castlevania: Belmont's Curse promotional still",
    credit: "Official promotional still via PlayStation Blog © Konami Digital Entertainment",
    sourceUrl: "https://blog.playstation.com/tachyon/2026/07/9ca265fd11f6f0c4b7321eb6db7f6c2f1f015cd5.png?crop_strategy=smart&resize=1600%2C900",
    width: 1600,
    height: 900,
  },
  ...dates,
  verifiedAt: "2026-10-18",
  sources: [
    { id: "official", label: "Konami — current game overview, release date and systems", url: "https://www.konami.com/games/castlevania/belmonts_curse/eu/en/" },
    { id: "product", label: "Konami — editions, storage and frame-rate information", url: "https://www.konami.com/games/castlevania/belmonts_curse/us/en-us/product" },
    { id: "steam", label: "Steam — full game, demo and Windows requirements", url: "https://store.steampowered.com/app/4231820/Castlevania_Belmonts_Curse/" },
    { id: "demo", label: "Konami — demo platforms and save-transfer conditions", url: "https://www.konami.com/games/castlevania/belmonts_curse/eu/en/demo" },
    { id: "characters", label: "Konami — Rose Belmont and the announced bosses", url: "https://www.konami.com/games/castlevania/belmonts_curse/eu/en/character" },
    { id: "launch-issues", label: "Konami — October 14 known issues notice", url: "https://www.konami.com/games/castlevania/belmonts_curse/us/en-us/noti_261014" },
    { id: "playstation-preview", label: "PlayStation Blog — July 17 hands-on report and developer interviews", url: "https://blog.playstation.com/2026/07/17/castlevania-belmonts-curse-hands-on-report" },
    { id: "xbox-developers", label: "Xbox Wire — July 24 interview with Konami and Evil Empire", url: "https://news.xbox.com/en-us/2026/07/24/castlevania-belmonts-curse-xbox/" },
    { id: "fallen-walkthrough", label: "KeenGamer — Ali Amir's October 15 walkthrough and The Fallen encounter", url: "https://www.keengamer.com/articles/guides/castlevania-belmonts-curse-complete-walkthrough/" },
  ],
  sections: [
    {
      id: "overview",
      title: "What kind of Castlevania is Belmont's Curse?",
      paragraphs: [
        "Belmont's Curse is a single-player 2D action-exploration game from Konami and Evil Empire, with Motion Twin advising. Rose Belmont explores a monster-infested Paris in 1499, 23 years after Castlevania III: Dracula's Curse. She is Trevor Belmont's daughter and carries Dracula's curse in her right arm.",
        "The whip serves combat and traversal, while defeated bosses become tarot-card Arcana that grant spells and special actions. Exploration supplies weapons and Relics for different fighting styles. The getting-started guide focuses on using those systems and handling the first boss; the launch-help article addresses problems that can stop you reaching the game.",
      ],
      sourceIds: ["official", "characters", "steam", "xbox-developers"],
    },
    {
      id: "release",
      title: "Release date and platforms",
      releaseFacts: true,
      paragraphs: [
        "Konami lists October 15, 2026 as the launch date and now marks the game available. The supported platforms are PlayStation 5, Xbox Series X|S, Nintendo Switch and Windows PC. Steam displays October 14 on its listing; this guide uses the date stated by the publisher rather than treating the store's different date as a separate release.",
      ],
      sourceIds: ["official", "demo", "steam", "xbox-developers"],
    },
    {
      id: "demo",
      title: "Try the opening chapter before buying",
      paragraphs: [
        "A demo is available for PS5, Xbox Series X|S, Nintendo Switch and Steam. It covers the opening chapter and supports transferring progress to the full game. Keep the demo save, use the same platform and account, and update the full version before importing it. A Steam demo save does not establish transfer support to a console version.",
      ],
      sourceIds: ["demo", "steam"],
    },
    {
      id: "editions",
      title: "Standard or Midnight Edition?",
      table: {
        headers: ["Edition", "What you receive"],
        rows: [
          ["Standard", "The full game"],
          ["Midnight", "The full game, Digital Sound & Art Gallery, Trevor and Sypha costumes, and the Family's Grace Relic"],
        ],
      },
      paragraphs: [
        "The Digital Sound & Art Gallery is a separate application. Standard already contains the main adventure; choose Midnight for its listed extras. Check the current store offer before relying on an early-purchase or preorder costume, since a bonus announcement alone does not establish present eligibility.",
      ],
      sourceIds: ["product", "steam"],
    },
    {
      id: "coverage",
      title: "Choose the help you need",
      bullets: [
        "Getting started: The Fallen's attacks, how Arcana affect progress, and how to approach blocked routes.",
        "Launch fixes: the V-Sync startup issue, a language-related title-screen block and the Steam Deck UI notice.",
      ],
      paragraphs: [
        "This coverage is researched from publisher information, developer interviews and the identified walkthrough. PlayBloo has not played the game. We have not independently verified a complete map, every boss route or true-ending requirements, so those are outside this first set of guides.",
      ],
    },
  ],
  articles: [
    {
      slug: "getting-started",
      title: "Belmont's Curse Getting Started: The Fallen, Arcana & Exploration",
      shortTitle: "Getting started: The Fallen & Arcana",
      description: "Prepare for the first boss in Castlevania: Belmont's Curse, put Arcana rewards to work and recognize routes to revisit after gaining new abilities.",
      category: "Getting started",
      cover: {
        src: "/images/guides/castlevania-belmonts-curse-getting-started.webp",
        alt: "Rose Belmont swinging between hanging wooden hazards above floor spikes in an official Castlevania: Belmont's Curse gameplay screenshot",
        credit: "Official gameplay screenshot via PlayStation Blog © Konami Digital Entertainment",
        sourceUrl: "https://blog.playstation.com/tachyon/2028/07/1614565982da741332709d284572d996bf2e98fb.jpg",
        width: 1600,
        height: 900,
      },
      status: "published",
      ...dates,
      relatedSlugs: ["launch-fixes"],
      sections: [
        {
          id: "starting-plan",
          title: "What to learn first",
          paragraphs: [
            "Prioritize a repeatable combat rhythm over rushing from enemy to enemy: recognize an attack, evade it, then use the recovery window. When traversal opens up, practice the whip on safe ground before combining a swing with a landing or attack. Konami and Evil Empire describe the whip as part of both movement and fighting, and the game builds hazards around that overlap.",
            "The advice below draws on published material, including a PlayStation preview build and KeenGamer's launch walkthrough. Controls and ability names should be checked against your own tutorial and platform bindings; PlayBloo has not tested the launch build.",
          ],
          sourceIds: ["official", "xbox-developers", "playstation-preview", "fallen-walkthrough"],
        },
        {
          id: "the-fallen",
          title: "The first boss: The Fallen",
          paragraphs: [
            "The Fallen is the sewer boss and Rose's first major threat. PlayStation's hands-on report identifies a thrown Holy Cross and a whip attack with long reach. Watch the windup instead of standing close and trying to trade hits.",
            "KeenGamer's walkthrough recommends countering the thrown cross with a weapon strike or magic, then attacking during recovery. Its route also identifies a Mirror of Life before the encounter; use it to save, restore health and refill potions before committing to the arena. Treat the cross counter as a timing action to learn, rather than an automatic defense.",
          ],
          bullets: [
            "Keep enough room to see the next attack coming; back away when a close attack begins.",
            "For the cross, choose a deliberate counter attempt or evade it. Avoid attacking blindly through its path.",
            "After the boss falls, complete the prompted absorption interaction to receive its Arcana and Holy Cross spell.",
          ],
          sourceIds: ["characters", "playstation-preview", "fallen-walkthrough"],
        },
        {
          id: "arcana",
          title: "After a boss, inspect the Arcana",
          paragraphs: [
            "Boss rewards can change what you can do outside combat: the Arcana system turns defeated enemies into spells and special actions. After gaining a card, read its effect before choosing where to go next. A route blocked by a mechanic may become accessible after an ability unlock.",
            "The PlayStation preview describes Works of Mercy: card-specific tasks that unlock Blessings, with an assignable Gift offering a further effect. Check the task on your own card and work it into ordinary encounters. This is more useful than assuming a newly acquired spell has already reached its full potential.",
          ],
          sourceIds: ["official", "playstation-preview"],
        },
        {
          id: "blocked-paths",
          title: "What to do when a route seems impossible",
          paragraphs: [
            "A visible ledge or passage can be a return destination. The developer interview on Xbox Wire describes marking areas to revisit after obtaining abilities, and the PlayStation report observes destructible secret walls and inaccessible routes. Check nearby walls and available paths, then return after a meaningful unlock instead of repeating the same jump indefinitely.",
            "A useful note is specific: record the area, the barrier and what appears missing, such as reach or a special interaction. That gives you a short revisit list after the next card or movement upgrade. It also helps separate an unsolved environmental clue from a fight that needs better timing.",
          ],
          sourceIds: ["xbox-developers", "playstation-preview"],
        },
        {
          id: "equipment",
          title: "Build around a weapon you can use consistently",
          paragraphs: [
            "The game offers seven weapon categories and Relics that modify combat. Start by comparing reach, attack commitment and your ability to recover after a missed strike. A weapon that makes it easier to keep distance may suit you better than one whose extra hits require staying close.",
            "The PlayStation preview gives two examples: a longsword rewards an attack after a backdash, while cestus gauntlets favor quick successive hits. Use a weapon's stated effect to shape your approach. These examples explain different playstyles; they are not a tested best-weapon ranking.",
          ],
          sourceIds: ["official", "playstation-preview"],
        },
      ],
    },
    {
      slug: "launch-fixes",
      title: "Belmont's Curse Launch Fixes: PC Startup, Title Screen & Steam Deck",
      shortTitle: "Launch fixes: PC, title screen & Deck",
      description: "Follow Konami's workaround for the V-Sync and Unlimited FPS startup issue, identify the title-screen language bug and check the Steam Deck UI notice.",
      category: "Troubleshooting",
      cover: {
        src: "/images/guides/castlevania-belmonts-curse-launch-fixes.webp",
        alt: "Rose Belmont running along the waterfront in burning Paris in an official Castlevania: Belmont's Curse gameplay screenshot",
        credit: "Official gameplay screenshot via PlayStation Blog © Konami Digital Entertainment",
        sourceUrl: "https://blog.playstation.com/tachyon/2028/07/19b9dc52215e36d496cf3333b8f1c3ee151ba773.jpg",
        width: 1600,
        height: 900,
      },
      status: "published",
      ...dates,
      relatedSlugs: ["getting-started"],
      sections: [
        {
          id: "identify-problem",
          title: "Match the symptom before changing settings",
          paragraphs: [
            "Konami's October 14 notice identifies three separate problems. Match the platform and trigger before applying a workaround. A startup failure, an existing save blocked at the title screen and a partially cropped interface need different responses.",
            "These are publisher workarounds, checked on October 18, 2026. PlayBloo has not reproduced the issues, and the notice does not confirm that a patch has resolved them.",
          ],
          sourceIds: ["launch-issues"],
        },
        {
          id: "pc-startup",
          title: "PC will not launch with V-Sync off and Unlimited FPS",
          paragraphs: [
            "For Steam and Xbox on PC, Konami identifies a startup failure when V-Sync is off and the frame-rate limit is Unlimited. Its workaround is:",
          ],
          bullets: [
            "Temporarily set the monitor's Windows refresh rate below 60 Hz.",
            "Launch the game and open Settings from the title screen.",
            "In Video Settings, enable V-Sync, then close the game.",
            "Restore the monitor's original refresh rate and launch again.",
          ],
          sourceIds: ["launch-issues"],
        },
        {
          id: "title-screen",
          title: "Cannot continue from the title screen after saving",
          paragraphs: [
            "On PS5, Xbox Series X|S, Steam and Xbox on PC, certain system languages, mainly Arabic, can block progress past the title screen after saving and returning there. Konami advises changing the system language to a supported option such as English to continue with the existing save.",
          ],
          sourceIds: ["launch-issues"],
        },
        {
          id: "steam-deck",
          title: "Steam Deck interface is partly off-screen",
          paragraphs: [
            "Konami confirms that some Steam Deck UI elements can appear partly off-screen. The notice says a fix is under investigation and provides no Deck-specific workaround. It does not establish a resolution or scaling preset that fixes the problem.",
          ],
          sourceIds: ["launch-issues"],
        },
        {
          id: "requirements",
          title: "For a different PC problem, check the baseline",
          table: {
            headers: ["Steam requirement", "Minimum", "Recommended"],
            rows: [
              ["Operating system", "64-bit Windows 11", "64-bit Windows 11"],
              ["Processor", "Intel Core i5-8400", "Intel Core i5-10400"],
              ["Graphics", "Nvidia GeForce GTX 1650", "Nvidia GeForce RTX 3060"],
              ["Memory / graphics API", "16 GB RAM / DirectX 11", "16 GB RAM / DirectX 11"],
              ["Storage", "10 GB available", "10 GB available"],
            ],
          },
          paragraphs: [
            "These are Steam's published Windows requirements, not a measured performance target. Meeting them does not prove that a particular crash shares the V-Sync trigger. Check the current installation and update state, then note what happens before the failure: before any window opens, during the title screen, or after loading a save.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "support",
          title: "If the workaround does not resolve it",
          paragraphs: [
            "Prepare a short report with the platform or PC store, game version, exact point of failure, display settings and system language. Record which steps changed the behavior. That makes a support request easier to investigate and avoids treating unrelated symptoms as the same bug.",
          ],
          link: {
            label: "Check Konami's current known-issues notice",
            href: "https://www.konami.com/games/castlevania/belmonts_curse/us/en-us/noti_261014",
          },
        },
      ],
    },
  ],
};
