import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-09-15T08:00:00+08:00", updatedAt: "2026-09-15T08:00:00+08:00" };
const announcement = "https://worldofwarcraft.blizzard.com/en-gb/news/24302093";

export const worldOfWarcraftForever: GuideTopic = {
  slug: "world-of-warcraft-forever",
  name: "World of Warcraft Forever",
  officialName: "World of Warcraft: Forever",
  title: "World of Warcraft Forever – Release Date, Beta, Classes, Races & Everything We Know",
  description: "WoW Forever launches November 4, with beta starting September 17. Check beta access, subscription details, new race and class choices, zones and the level cap.",
  status: "published", platforms: ["PC"], releaseDate: "2026-11-04", releaseStatus: "upcoming", publisher: "Blizzard Entertainment",
  cover: { src: "/images/guides/world-of-warcraft-forever.webp", alt: "World of Warcraft Forever logo over Azeroth artwork", credit: "Official promotional artwork © Blizzard Entertainment", sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/forever" },
  ...dates, verifiedAt: "2026-09-15",
  sources: [
    { id: "announcement", label: "Blizzard — Forever announcement and editions", url: announcement },
    { id: "panel", label: "Blizzard — What’s Next panel recap", url: "https://worldofwarcraft.blizzard.com/en-us/news/24303862/world-of-warcraft-forever-whats-next-panel-recap" },
    { id: "deep-dive", label: "Blizzard — Deep Dive panel recap", url: "https://worldofwarcraft.blizzard.com/en-us/news/24303313" },
    { id: "zones", label: "Blizzard — Found Photos panel recap", url: "https://worldofwarcraft.blizzard.com/en-us/news/24304071" },
  ],
  sections: [
    { id: "overview", title: "What is World of Warcraft Forever?", paragraphs: ["World of Warcraft: Forever is a permanent WoW experience alongside modern WoW and Classic. Searches for ‘WoW Forever’ and ‘Warcraft Forever’ refer to this same game. This hub covers the downloadable MMO; it cannot be played in a PlayBloo browser window."], sourceIds: ["announcement"] },
    { id: "release-date", title: "WoW Forever release date", releaseFacts: true, paragraphs: ["Blizzard dates the global launch to November 4, 2026. Check its regional announcement for your local calendar date."], sourceIds: ["panel"] },
    { id: "beta", title: "WoW Forever beta date and access", paragraphs: ["Beta begins September 17, 2026. The Skyborne Epic Pack and Warcraft Forever Collection include beta access. See the dedicated beta guide above before choosing an edition."], sourceIds: ["announcement"] },
    { id: "classic", title: "WoW Forever vs WoW Classic", paragraphs: ["Forever is a continuing branch of Azeroth with new content and systems, rather than a time-limited season. Blizzard describes Legacy progression, Camping and optional Transmog."], sourceIds: ["panel"] },
    { id: "races", title: "New races: the Skyborne", paragraphs: ["Skyborne can join either faction. Both get Warrior, Hunter, Rogue and Druid; Alliance Skyborne can also be Mages, and Horde Skyborne can be Shamans."], sourceIds: ["panel"] },
    { id: "classes", title: "New classes or new class combinations?", paragraphs: ["Blizzard names six additional pairings: Gnome Priest, Human Hunter, Dwarf Shaman, Orc Mage, Troll Warlock and Undead Paladin. These are new choices for existing classes, not six brand-new classes. Racial abilities are also being revised."], sourceIds: ["deep-dive"] },
    { id: "zones", title: "New zones and places to explore", paragraphs: ["Blizzard’s world-design recap highlights Riverglades, Mount Hyjal and Zephras Isle, alongside changes to starting areas. Treat old Classic routes as background reading until a Forever route has been checked in-game."], sourceIds: ["zones"] },
    { id: "level-cap", title: "WoW Forever level cap", paragraphs: ["The launch journey runs from level 1 to 60. That does not establish the beta’s playable level range."], sourceIds: ["panel"] },
    { id: "price", title: "Subscription and price", paragraphs: ["Launch access is included with WoW Subscription or Game Time. Optional upgrades add benefits: the Heroic Pack includes Skyborne and its starting experience, while beta access is listed for Epic and the Collection. Check current regional prices before purchasing."], sourceIds: ["announcement"] },
    { id: "faq", title: "WoW Forever FAQ", table: { headers: ["Question", "Answer"], rows: [["Is this a browser game?", "No. Use Blizzard’s game client; this page provides editorial guides."], ["Should I follow a Classic build?", "Use it as a reference, then check Forever’s actual talents and balance. We have not tested builds in the beta."], ["When do new raids unlock?", "Blizzard’s roadmap lists December 9, 2026."], ["Where should I start?", "Read the beta guide for access details, then shortlist a race and class to try."]] }, sourceIds: ["panel"] },
  ],
  articles: [{
    slug: "beta", shortTitle: "Beta date & how to join", category: "Beta access",
    title: "WoW Forever Beta: September 17 Start Date & How to Join",
    description: "Find out when the WoW Forever beta starts, which packs include access, and how beta eligibility differs from a regular WoW subscription.",
    status: "published", ...dates, relatedSlugs: [],
    sections: [
      { id: "start-date", title: "When does the WoW Forever beta start?", paragraphs: ["The announced beta start is September 17, 2026. As of this guide’s September 15 check, that date is still ahead. We have not verified a precise opening hour."], sourceIds: ["announcement"] },
      { id: "access", title: "How to join the WoW Forever beta", bullets: ["Visit the Battle.net Shop and find World of Warcraft: Forever.", "Check the Skyborne Epic Pack or Warcraft Forever Collection for explicit beta access and regional terms.", "Confirm the Battle.net account before purchasing. When testing opens, follow Blizzard’s installation instructions for the Forever beta client."], paragraphs: ["This is an eligibility checklist based on the announced packs. We have not tested the beta installation flow and cannot verify a client-menu label yet."], sourceIds: ["announcement"] },
      { id: "subscription", title: "Does a WoW subscription include the beta?", paragraphs: ["The announcement includes subscription access at launch; it separately ties beta access to eligible upgrade packs. Do not assume a regular subscription or the Heroic Pack alone grants beta entry."], sourceIds: ["announcement"] },
      { id: "before-installing", title: "Before you install", bullets: ["Keep beta and launch dates separate when planning a play session.", "Check official launcher messages for availability and maintenance.", "If access is missing, compare the account and edition on your receipt with the account signed into Battle.net.", "Use official support for an entitlement problem; a search result claiming free keys does not establish eligibility."], paragraphs: ["Our practical advice: save your purchase receipt and the edition description so you can explain an access issue clearly."] },
      { id: "faq", title: "Beta FAQ: timing, progress and scope", table: { headers: ["Question", "What we can verify"], rows: [["Is a beta key required?", "The announcement describes pack-based access. We have not verified a separate key-redemption process."], ["Will progress carry over?", "Not verified in the official information reviewed for this guide. Avoid planning launch progress around a test character."], ["Is the beta level cap 60?", "Level 60 describes the launch journey, not a verified beta cap."], ["Where is the full game guide?", "Use the guide hub link for launch information, races, classes and zones."]] } },
    ],
  }],
};
