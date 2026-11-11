import type { GuideTopic } from "./types";

const publicationDate = "2026-11-11T10:00:00.000Z";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };

const robloxPage = "https://www.roblox.com/games/139016063432102/Break-Glass-If-Bored";
const robloxApi = "https://games.roblox.com/v1/games?universeIds=10772618968";
const fanWiki = "https://break-glass-if-bored.github.io";

export const breakGlassIfBored: GuideTopic = {
  slug: "break-glass-if-bored",
  name: "Break Glass If Bored",
  officialName: "Break Glass If Bored",
  title: "Break Glass If Bored Guide and Secrets",
  description:
    "Break Glass If Bored on Roblox: how the museum destruction loop works, first weapons, controls, and where the hidden per-wing secret weapons are hiding.",
  status: "published",
  platforms: ["Roblox (PC, mobile)"],
  releaseDate: "2026-10-23",
  releaseStatus: "released",
  publisher: "Nebula",
  cover: {
    src: "/images/guides/break-glass-if-bored.webp",
    alt: "A blue winged statue shattering into physics shards inside a Break Glass If Bored museum gallery",
    credit: "Official Break Glass If Bored game thumbnail © Nebula",
    sourceUrl: "https://tr.rbxcdn.com/180DAY-aefae936d7db39994ba5915381755c03/768/432/Image/Webp/noFilter",
    width: 768,
    height: 432,
  },
  ...dates,
  verifiedAt: "2026-11-11",
  sources: [
    { id: "roblox", label: "Roblox — Break Glass If Bored official game page by Nebula (game loop, weapons, secrets, perks; checked November 11, 2026)", url: robloxPage },
    { id: "roblox-api", label: "Roblox games API — universe 10772618968: creation date, visit count, developer group and description (checked November 11, 2026)", url: robloxApi },
    { id: "fan-wiki", label: "Break Glass If Bored wiki (break-glass-if-bored.github.io) — fan-maintained beginner guide, controls and secrets notes (checked November 11, 2026)", url: fanWiki },
  ],
  sections: [
    {
      id: "what-it-is",
      title: "A museum built to be destroyed",
      paragraphs: [
        "Break Glass If Bored is a physics destruction game on Roblox by the group Nebula, launched on October 23, 2026. The premise fits the name: smash statues, vases, chandeliers, chess sets and organ pipes inside an ever-expanding museum, with real physics so no two breaks look the same.",
        "Everything you break pays. Each destroyed piece earns cash, which you reinvest in an arsenal the official page sizes at over 25 weapons — pistols, shotguns, a sledgehammer, a laser cutter, grenades, a singularity and a nuke among them. The Roblox API reported about 976,000 visits and 52,000 favorites when we checked on November 11, 2026, three weeks after launch.",
      ],
      sourceIds: ["roblox", "roblox-api"],
    },
    {
      id: "release-date",
      title: "Release date and the Infinite Museum",
      releaseFacts: true,
      paragraphs: [
        "The experience was created on Roblox on October 23, 2026 and updated as recently as November 10, 2026. The official page brands the museum 'infinite' — new wings and weapons are being added all the time — so both the map and the arsenal are moving targets.",
        "That update cadence matters for guides: a wing that exists today may gain a secret tomorrow, and community wikis track the changes faster than any static page can. This guide sticks to the systems that hold still.",
      ],
      sourceIds: ["roblox", "roblox-api"],
    },
    {
      id: "gameplay",
      title: "The loop: break, earn, buy, repeat",
      paragraphs: [
        "The economy is direct: earn money for every piece of property you destroy, spend it on weapons, and use the better weapons to destroy more expensive property. The official page frames weapons as both payoffs and tools — from a pistol to a sledgehammer to a singularity — each with a different destruction style.",
        "Leaderboards give the sandbox its competitive spine: break the most glass and spend the most time in the halls to climb the boards. Between the boards and the weapon shop, the game is a destructor's idle loop you can play in short sessions.",
      ],
      sourceIds: ["roblox"],
    },
    {
      id: "secrets-summary",
      title: "Secrets: one hidden weapon per wing",
      paragraphs: [
        "Every museum wing hides a secret weapon, per the official page — findable rather than purchasable, tucked into corners, rooftops and spots behind large objects. Community wikis count the set at 26 secrets as of early November 2026, though the number moves as wings are added.",
        "Two more perks sit outside the museum: joining the Nebula group unlocks a members' reward in Reception, and Roblox Premium members get the Force Push weapon for free.",
      ],
      link: { label: "Read the secrets guide", href: "/guides/break-glass-if-bored/secrets" },
      sourceIds: ["roblox", "fan-wiki"],
    },
    {
      id: "about-this-coverage",
      title: "About this coverage",
      paragraphs: [
        "PlayBloo has not played Break Glass If Bored and is not affiliated with Roblox or Nebula. Facts come from the official Roblox game page and the Roblox games API as checked on November 11, 2026, with tips credited to the fan-maintained wiki. Break Glass If Bored is not a browser game, and no playable version is offered on this site.",
      ],
      sourceIds: ["roblox", "roblox-api"],
    },
  ],
  articles: [
    {
      slug: "getting-started",
      title: "Break Glass If Bored: Getting Started",
      shortTitle: "Getting started: first weapons and loop",
      description:
        "Break Glass If Bored getting started: how to join, the Reception spawn, mouse and WASD controls, the first-weapon buy order and how the cash loop compounds.",
      category: "Getting started",
      status: "published",
      cover: {
        src: "/images/guides/break-glass-if-bored-getting-started.webp",
        alt: "A Break Glass If Bored gallery row where red glass display cases are shattering across a polished floor",
        credit: "Official Break Glass If Bored game thumbnail © Nebula",
        sourceUrl: "https://tr.rbxcdn.com/180DAY-30e21e51fe21dd21489f9dced7164205/768/432/Image/Webp/noFilter",
        width: 768,
        height: 432,
      },
      ...dates,
      relatedSlugs: ["secrets"],
      sections: [
        {
          id: "joining",
          title: "How to join",
          paragraphs: [
            "Search 'Break Glass If Bored' on Roblox or open the official page at roblox.com/games/139016063432102 and press Play. The developer to match is the Nebula group, per the official page we checked on November 11, 2026.",
            "Before spending Robux anywhere in a destruction game like this, check that the developer shown on the page matches Nebula — similarly themed experiences appear in Roblox search, and perks like the Premium weapon are tied to this specific experience.",
          ],
          sourceIds: ["roblox"],
        },
        {
          id: "controls",
          title: "Controls: mouse, WASD, left click",
          paragraphs: [
            "The fan-maintained wiki's beginner guide describes the standard scheme: you spawn in Reception, aim with the mouse, fire with left click, move with WASD and jump with spacebar. Nothing exotic — the game's depth is in what you aim at, not how.",
            "On mobile the same actions map to touch controls. Physics is the star either way: the official description promises 'no two breaks look the same', so part of the fun is simply watching a chandelier come apart.",
          ],
          sourceIds: ["fan-wiki", "roblox"],
        },
        {
          id: "first-weapons",
          title: "What to buy first (community order)",
          paragraphs: [
            "The fan wiki's recommended buy order is pistol → shotgun → sledgehammer, with grenades and the laser cutter deferred until the basics are mastered. The logic holds up against the official description: each step up covers a wider destruction radius, and the sledgehammer is the first tool that feels like property damage rather than target practice.",
            "The wiki's supporting habits: keep a cash reserve instead of spending everything, rotate through the museum rather than camping one wing (objects respawn), and judge weapons by earning speed rather than price. PlayBloo has not played the game — these are community-sourced tips, credited as such.",
          ],
          image: {
            src: "/images/guides/break-glass-if-bored-shards.webp",
            alt: "White glass shards explode across a dark Break Glass If Bored room as a weapon blast lands",
            width: 768,
            height: 432,
            caption: "Official thumbnail: every break is physics-simulated, so repeated hits read differently each time.",
          },
          sourceIds: ["fan-wiki", "roblox"],
        },
        {
          id: "loop-compounding",
          title: "How the loop compounds",
          paragraphs: [
            "The official economy pays per destroyed piece, so weapon upgrades are throughput upgrades: a bigger blast breaks more sellable property per swing, which funds the next tier faster. Leaderboards for glass broken and hall time add a light competitive layer on top.",
            "Two free perks are worth claiming early: join the Nebula group for the members' reward waiting in Reception, and Roblox Premium members get the Force Push weapon at no cost. Neither requires spending in-game currency.",
          ],
          sourceIds: ["roblox"],
        },
      ],
    },
    {
      slug: "secrets",
      title: "Break Glass If Bored Secrets and Badges",
      shortTitle: "Secrets: per-wing hidden weapons",
      description:
        "Break Glass If Bored secrets: one hidden weapon per museum wing, where community guides say to look, the Premium Force Push perk and the group reward.",
      category: "Secrets",
      status: "published",
      cover: {
        src: "/images/guides/break-glass-if-bored-gold.webp",
        alt: "A golden exhibit shatters into amber shards under a spotlight in Break Glass If Bored",
        credit: "Official Break Glass If Bored game thumbnail © Nebula",
        sourceUrl: "https://tr.rbxcdn.com/180DAY-1776bba2a005e353cd6a4dd96742e64a/768/432/Image/Webp/noFilter",
        width: 768,
        height: 432,
      },
      ...dates,
      relatedSlugs: ["getting-started"],
      sections: [
        {
          id: "how-secrets-work",
          title: "One secret weapon per wing",
          paragraphs: [
            "The official page states the rule plainly: 'Every wing hides a secret weapon. Can you find them all?' Secret weapons are findable, not purchasable — they sit outside the shop, and once found they work like normal weapons and can be upgraded, per the fan wiki.",
            "The museum is branded 'infinite' — new wings and weapons arrive continuously, and the experience was updated as recently as November 10, 2026. Any fixed count is a snapshot: community guides counted 26 secrets as of early November 2026, and that number grows with each wing.",
          ],
          sourceIds: ["roblox", "roblox-api", "fan-wiki"],
        },
        {
          id: "where-to-look",
          title: "Where community guides say to look",
          paragraphs: [
            "The fan wiki describes the hiding pattern: corners, rooftops and spots behind large objects — look for loose panels or glowing crevices rather than expecting a sparkle on the main path. In a museum built of glass cases, the secret containers deliberately break the visual language of everything around them.",
            "PlayBloo has not verified individual locations, and we are not reproducing a wing-by-wing cheat sheet secondhand. The wiki's dedicated secrets page and community videos (one popular guide counts all 26) carry the exact spots — use them as leads, and expect new wings to invalidate parts of any fixed list.",
          ],
          image: {
            src: "/images/guides/break-glass-if-bored-yellow.webp",
            alt: "A bright yellow exhibit breaks apart in a white Break Glass If Bored gallery with physics shards flying",
            width: 768,
            height: 432,
            caption: "Official thumbnail: bright exhibits stand out — which is why secret hiding spots tend to avoid them.",
          },
          sourceIds: ["fan-wiki", "roblox"],
        },
        {
          id: "perks",
          title: "The two freebies: group reward and Force Push",
          bullets: [
            "Join the Nebula group and a members' reward waits in Reception — the official page calls it out directly.",
            "Roblox Premium members get the 'Force Push' weapon free, per the official page.",
            "Secret weapons upgrade like normal weapons once found — the wiki confirms no separate upgrade path.",
            "Leaderboards (most glass broken, most time in the halls) are the visible long-term goals.",
          ],
          paragraphs: [
            "Neither freebie requires Robux — one needs a group join, the other a Premium subscription you may already have. The secrets hunt, by contrast, costs only time and a willingness to break everything on the way.",
          ],
          sourceIds: ["roblox"],
        },
        {
          id: "secrets-discipline",
          title: "A note on secret lists this early",
          paragraphs: [
            "The game is three weeks old at publication and its museum is designed to keep growing. Community secret lists will inevitably mix current wings with outdated ones — the wiki we cite was updated on November 8, 2026, three days before our check, and even that can lag a patch.",
            "Our approach: keep the official rule (one secret weapon per wing), the community count (26 as of early November 2026, attributed), and the search pattern, and let the wiki carry the wing-by-wing details. If Nebula publishes an official secrets index, this page will adopt it.",
          ],
          sourceIds: ["roblox", "fan-wiki"],
        },
      ],
    },
  ],
};
