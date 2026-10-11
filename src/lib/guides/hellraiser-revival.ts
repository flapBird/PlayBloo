import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-10-11T22:00:00+08:00", updatedAt: "2026-10-11T22:00:00+08:00" };

export const hellraiserRevival: GuideTopic = {
  slug: "hellraiser-revival", name: "Hellraiser: Revival", officialName: "Clive Barker's Hellraiser: Revival",
  title: "Clive Barker's Hellraiser: Revival Guide: The Box, Combat & Getting Started",
  description: "Saber Interactive's survival horror launched October 8, 2026. Learn how the Genesis Configuration's suffering economy works, where to aim when enemies wear armor, and what to know before you start.",
  status: "published", platforms: ["PC (Steam)", "PlayStation 5", "Xbox Series X|S", "Nintendo Switch 2"], releaseDate: "2026-10-08", releaseStatus: "released", publisher: "Saber Interactive",
  cover: {
    src: "/images/guides/hellraiser-revival.webp", width: 1600, height: 900,
    alt: "First-person view of Aidan holding the glowing Genesis Configuration puzzle box in a dark stone corridor",
    credit: "Official Steam screenshot — Saber Interactive",
    sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551980/ee693688114623ede11637a3aceeb24636b85fae/ss_ee693688114623ede11637a3aceeb24636b85fae.1920x1080.jpg",
  },
  trailer: { youtubeId: "JCeq-T1Q4FM", title: "Clive Barker's Hellraiser: Revival – Launch Trailer (Nintendo of America)", publishedAt: "2026-10-08" },
  ...dates, verifiedAt: "2026-10-11",
  sources: [
    { id: "official", label: "Saber Interactive — Hellraiser: Revival official game site", url: "https://saber.games/hellraiserrevival/" },
    { id: "steam", label: "Steam — Clive Barker's Hellraiser: Revival store page", url: "https://store.steampowered.com/app/1551980/Clive_Barkers_Hellraiser_Revival/" },
    { id: "playstation", label: "PlayStation Store — Clive Barker's Hellraiser: Revival", url: "https://store.playstation.com/concept/10012313" },
    { id: "xbox", label: "Xbox — Clive Barker's Hellraiser: Revival", url: "https://www.xbox.com/games/store/clive-barkers-hellraiser-revival/9nswrgzbq2mc" },
    { id: "nintendo", label: "Nintendo of America — official launch trailer (Switch 2)", url: "https://www.youtube.com/watch?v=JCeq-T1Q4FM" },
    { id: "launch-press", label: "Nintendo Everything — launch trailer coverage, October 8, 2026", url: "https://nintendoeverything.com/clive-barkers-hellraiser-revival-launch-trailer/" },
    { id: "demo", label: "Steam — Clive Barker's Hellraiser: Revival Demo (September 17, 2026)", url: "https://store.steampowered.com/app/5184670/" },
    { id: "deluxe", label: "Steam — Deluxe Content DLC store page", url: "https://store.steampowered.com/app/4664770/" },
    { id: "review", label: "GamingTrend — Clive Barker's Hellraiser: Revival review (October 8, 2026, PC)", url: "https://gamingtrend.com/reviews/clive-barkers-hellraiser-revival-review/" },
    { id: "pinhead-image", label: "Official Steam screenshot: Pinhead in the Labyrinth corridor", url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551980/957f5c82ab19603419738c47e96f4a4c750e8214/ss_957f5c82ab19603419738c47e96f4a4c750e8214.1920x1080.jpg" },
    { id: "combat-image", label: "Official Steam screenshot: melee strike against a masked cultist", url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551980/678f626dbe4c7aee9a9be3adc7d8fe40749b14ce/ss_678f626dbe4c7aee9a9be3adc7d8fe40749b14ce.1920x1080.jpg" },
  ],
  sections: [
    {
      id: "what-kind-of-game", title: "What kind of game is Hellraiser: Revival?",
      paragraphs: ["Hellraiser: Revival is a single-player, first-person action horror survival game by Saber Interactive, set in Clive Barker's Hellraiser universe. You play as Aidan, who must wield a mysterious puzzle box — the Genesis Configuration — to help his girlfriend Sunny escape the otherworldly hellscape of the Labyrinth, surviving a bargain with Pinhead and battling the cult devoted to the Cenobites.", "Doug Bradley, who played Pinhead in the original films, returns to voice the character. The game's official description positions the box as a combat tool in its own right: its hellish abilities combine with an arsenal of earthly weapons against masochistic enemies who take pain as pleasure."], sourceIds: ["official", "steam", "launch-press"],
      image: {
        src: "/images/guides/hellraiser-revival-pinhead.webp", width: 1600, height: 900,
        alt: "Pinhead standing in a rubble-strewn corridor of the Labyrinth",
        caption: "Official screenshot: Doug Bradley returns as the voice of Pinhead.",
      },
    },
    {
      id: "release-and-platforms", title: "Release date, platforms and price", releaseFacts: true,
      paragraphs: ["The game launched on October 8, 2026, on Steam (Windows), PlayStation 5, Xbox Series X|S and Nintendo Switch 2. Saber's official site links each store page. The Steam listing is Windows-only with full controller support including DualSense, and it requires 80 GB of storage with an SSD recommended.", "A playable Steam Demo was published earlier, on September 17, 2026. US pricing on Steam is $39.99 for the standard edition, with a separate Deluxe Content DLC at $14.99."], sourceIds: ["official", "steam", "playstation", "xbox", "nintendo", "demo"],
      link: { label: "Open the official Steam page", href: "https://store.steampowered.com/app/1551980/Clive_Barkers_Hellraiser_Revival/" },
    },
    {
      id: "suffering-economy", title: "The box runs on suffering",
      paragraphs: ["The Genesis Configuration is not a background trinket: its powers draw on a suffering resource you harvest in combat. GamingTrend's launch-week review (PC) describes the loop — raise an enemy to near death, then press the box to their face or chest so its chains tear the soul out. The act pays back health and the suffering that powers the box's abilities.", "That loop inverts the usual action-game habit of finishing enemies off as fast as possible. As the review puts it, \"Hellraiser: Revival rewards you for being cruel, for keeping someone alive just a little longer so that you can take something more from them.\" Expect to plan kills around what the box can take, not around the fastest takedown."], sourceIds: ["review"],
    },
    {
      id: "editions", title: "Editions, DLC and the demo",
      table: {
        headers: ["Edition", "US price (Steam)", "Includes"],
        rows: [
          ["Standard", "$39.99", "The full game"],
          ["Deluxe Content DLC", "$14.99", "\"The Nailer\" melee weapon, \"Cenobite\" shotgun skin, \"Punisher\" baseball bat skin, \"Leviathan\" weapon charm, digital art book, digital soundtrack, digital \"Bleeding Hearts\" novella, '80s horror movie filter"],
        ],
      },
      paragraphs: ["The Deluxe Content DLC is cosmetic-and-extras add-on material, and its items are bonuses rather than progression advantages. If you want a taste before buying, the official Steam Demo (September 17, 2026) covers the story's opening: meeting the main characters, delving into the Labyrinth and facing the Scarlet Church for the first time."], sourceIds: ["steam", "deluxe", "demo"],
    },
    {
      id: "trailer", title: "Watch the launch trailer", trailer: true,
      paragraphs: ["The official launch trailer is embedded above from Nintendo of America's channel, where it was published for the Switch 2 version's October 8 release. Our coverage is based on published information and store listings; PlayBloo has not played the game hands-on."], sourceIds: ["nintendo", "launch-press"],
    },
  ],
  articles: [{
    slug: "getting-started", title: "Hellraiser: Revival Getting Started: Survival Basics & Early Tips", shortTitle: "Getting started: survival basics",
    description: "How the suffering economy feeds your health and powers, why armored enemies punish careless swings, and what to know about the game's launch state before your first run.",
    category: "Getting started", status: "published", ...dates, relatedSlugs: [],
    sections: [
      {
        id: "first-hours", title: "Your first hours: a starting checklist",
        bullets: [
          "Read the in-game tutorials when they appear — they introduce both the earthly weapons and the Genesis Configuration's abilities.",
          "Practice the box's soul-consumption finisher on the first groups of cultists; it is your sustain and your power source at the same time.",
          "Before committing to a fight, look at what the enemy is wearing. Armored plating soaks swings that exposed flesh does not.",
          "Expect the stealth-kill tutorial, but do not build your whole plan around stealth — launch reviews describe it as a minor system.",
          "Learn which enemies to run from. Part of surviving the Labyrinth is recognizing the fights that are not worth taking.",
        ],
        sourceIds: ["review"],
      },
      {
        id: "box-economy", title: "Feed the box, and the box feeds you",
        paragraphs: ["Treat the Genesis Configuration as a resource engine rather than a spell button. Its powers consume suffering, and suffering comes from finishing weakened enemies with the box itself — chains, according to GamingTrend's review, that tear the skull or chest open and consume the soul.", "The practical habit this creates: when an enemy drops to near death, pause before shooting or stabbing them down. Walking up and using the box instead returns health and tops up the resource your abilities need. A fast kill spends a body; a box finisher invests it."], sourceIds: ["review"],
      },
      {
        id: "armor", title: "Aim for exposed flesh, not armor",
        paragraphs: ["Many of the cult's fighters are armored, and melee swings against plating are wasted. GamingTrend's review frames it simply: \"A swing at a metal gimp mask is a wasted swing; a swing at an unprotected arm is a different story.\" Watch where a foe is uncovered — arms, legs, gaps at the joints — and work those targets with weapons before going for the box.", "The enemy design rewards this observation. Some figures in the Labyrinth are dangerous enough that the review recommends avoiding them entirely rather than fighting; learning which is which is described as part of the game's survival education."], sourceIds: ["review"],
        image: {
          src: "/images/guides/hellraiser-revival-combat.webp", width: 1600, height: 900,
          alt: "A melee strike landing on a masked, studded-leather cultist in a crimson-lit chapel",
          caption: "Official screenshot: this cultist's studded mask is exactly the kind of surface swings bounce off.",
        },
      },
      {
        id: "healing", title: "Healing and raising your maximum health",
        paragraphs: ["Health comes back through the box's soul-consumption finisher, so your healing loop and your power loop are the same loop. If you are low on health and out of suffering, the review's advice implies a clear order of operations: weaken something, take it with the box, then decide whether to press on or retreat.", "Maximum health is improved out in the world. The review describes jamming your hand into the mouth of strange creatures to raise your overall health — keep an eye out for those interactions as you explore, since a larger health pool makes the suffering economy more forgiving."], sourceIds: ["review"],
      },
      {
        id: "enemies", title: "Pick your fights",
        paragraphs: ["The official description promises hell's wretches, deviants, cultists and infernal priests, and the launch review adds a tactical layer: enemy variety is about threat recognition. Some enemies are armor puzzles to peel open; others, like The Chatterer, are best avoided altogether.", "A workable rule for early progress: fight groups you can finish with the box (you need the suffering), disengage from anything that out-damages your healing loop, and use the environment to break line of sight when a fight turns bad."], sourceIds: ["official", "review"],
      },
      {
        id: "stealth", title: "Stealth is a tool, not the plan",
        paragraphs: ["There is a stealth-kill system, but GamingTrend notes that outside the tutorial you will find few chances to use it, calling the system underused. Learn it when the game teaches it, and treat later opportunities as bonuses rather than expecting the whole game to open up to stealth routes."], sourceIds: ["review"],
      },
      {
        id: "launch-state", title: "What to know about the launch state",
        paragraphs: ["The launch build has a known rough edge: GamingTrend's reviewer on PC (an RTX 5090 / Intel 285K system) hit frequent crashes to desktop that, in their words, \"plagued\" the final two hours of the game. That is one reviewer's experience on one system, but it is a sensible reason to save regularly rather than pushing long stretches between saves.", "On Steam the game is a Windows-only single-player release with Steam Achievements, Steam Cloud and full controller support including DualSense. The minimum specification asks for a GTX 1660 or RX Vega 64, 8 GB of RAM, a four-core-era CPU and 80 GB of storage with an SSD recommended."], sourceIds: ["review", "steam"],
        link: { label: "Open the official Steam page", href: "https://store.steampowered.com/app/1551980/Clive_Barkers_Hellraiser_Revival/" },
      },
    ],
  }],
};
