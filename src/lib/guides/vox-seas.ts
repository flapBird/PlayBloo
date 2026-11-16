import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-11-16T08:00:00.000Z", updatedAt: "2026-11-16T08:00:00.000Z" };
const robloxPage = "https://www.roblox.com/games/104067066727140/Vox-Seas";
const tierVideo = "https://www.youtube.com/watch?v=lQbperAoW7k";

export const voxSeas: GuideTopic = {
  slug: "vox-seas",
  name: "Vox Seas",
  officialName: "Vox Seas",
  title: "Vox Seas Wiki: Codes, Fruits and Tier List",
  description:
    "Vox Seas Wiki and guides for the official Roblox experience: code redemption status, all 14 fruits, community tier rankings and first steps.",
  status: "published",
  kind: "wiki",
  heroFact: "Action RPG · 20-player servers",
  platforms: ["Roblox"],
  releaseDate: "2025-01-31",
  releaseStatus: "released",
  publisher: "Vox Seas!",
  cover: {
    src: "/images/guides/vox-seas.webp",
    alt: "Official Vox Seas artwork of a pirate facing a giant green sea serpent beside a sailing ship",
    credit: "Official Vox Seas game media © Vox Seas!",
    sourceUrl: "https://tr.rbxcdn.com/180DAY-36861d7d2bd9749b9ad4dffda1b223d6/768/432/Image/Webp/noFilter",
    width: 768,
    height: 432,
  },
  trailer: { youtubeId: "p8tEh7IEqDM", title: "VOX SEAS - RELEASE TRAILER", publishedAt: "2026-11-10" },
  ...dates,
  verifiedAt: "2026-11-16",
  sources: [
    { id: "roblox", label: "Roblox — the official Vox Seas experience by group Vox Seas! (description, server size and game page; checked November 16, 2026)", url: robloxPage },
    { id: "roblox-api", label: "Roblox games API — universe 7174773198 (creation date, cumulative visits, favorites, creator and 20-player server limit; checked November 16, 2026)", url: "https://games.roblox.com/v1/games?universeIds=7174773198" },
    { id: "release-trailer", label: "Vox Seas — official release trailer on the Vox Seas YouTube channel (premiered November 10, 2026)", url: "https://www.youtube.com/watch?v=p8tEh7IEqDM" },
    { id: "codes-video", label: "Roblofix — Vox Seas codes video showing the Settings and Codes interface (published November 15, 2026; no complete verified redemption result)", url: "https://www.youtube.com/watch?v=jo5-kvyBaII" },
    { id: "fruit-guide", label: "Roblofix — How to Get Fruits in Vox Seas + Full Guide (dealer, Ronin gacha, reported stock and cooldown rules; published November 15, 2026)", url: "https://www.youtube.com/watch?v=LNQx9_mkcH8" },
    { id: "tier-video", label: "Roblofix — Vox Seas Fruit Tier List (community-tested S–D ranking and gameplay rationale; published November 15, 2026)", url: tierVideo },
    { id: "fruit-reference", label: "BloxInformer — Vox Seas fruit reference (fruit names and rarity categories; community-maintained, cross-checked against the November 15 roster video)", url: "https://bloxinformer.com/wikis/vox-seas/fruits/" },
  ],
  sections: [
    {
      id: "what-is-vox-seas",
      title: "What is Vox Seas?",
      paragraphs: [
        "Vox Seas is a pirate-themed action RPG on Roblox from the group Vox Seas!. Its official description names sailing, combat, trading and discovery as parts of the adventure. This PlayBloo topic is a lightweight Wiki and guide collection, not a hosted copy of the game.",
        "The current Roblox universe was created on January 31, 2025 and returned to prominence with the November 2026 relaunch. The official release trailer premiered on November 10. Roblox reported about 29.2 million cumulative visits and 631,897 favorites when checked on November 16; those lifetime figures must not be read as one launch week's traffic.",
      ],
      link: { label: "Open the official Vox Seas page on Roblox", href: robloxPage },
      sourceIds: ["roblox", "roblox-api", "release-trailer"],
    },
    {
      id: "wiki-coverage",
      title: "Wiki categories and latest guides",
      paragraphs: [
        "Start with the beginner guide for the official entry and first-fruit decisions, use the fruit table to filter the 14-name roster, or open the community tier list for one creator's November 15 gameplay ranking. The codes page documents the redemption interface and the current verification status without inventing an active-code list.",
        "The four articles below share the same topic navigation, breadcrumbs and related links as every other PlayBloo guide. No separate Wiki service or Roblox embed is used.",
      ],
      sourceIds: ["codes-video", "fruit-guide", "tier-video", "fruit-reference"],
    },
    {
      id: "official-trailer",
      title: "Official release trailer",
      paragraphs: [
        "The trailer is hosted on the official Vox Seas YouTube channel and loads only after you choose to play it. It supplies the official Roblox link used by this guide.",
      ],
      trailer: true,
      sourceIds: ["release-trailer"],
    },
    {
      id: "coverage-limits",
      title: "How this Wiki handles changing data",
      paragraphs: [
        "PlayBloo has not played Vox Seas and is not affiliated with its developer or Roblox. Official facts are anchored to the Roblox page and API; acquisition rules and combat impressions are attributed to the cited community videos. Fruit rarities are cross-checked against BloxInformer's community reference.",
        "No active code, live dealer stock, exact fruit price, Boss statistic or mastery requirement is published without a verifiable source. Community tier placements are opinions, not official balance data. Check the in-game interface for the final word after updates.",
      ],
      sourceIds: ["roblox", "codes-video", "fruit-guide", "tier-video"],
    },
  ],
  articles: [
    {
      slug: "codes",
      title: "Vox Seas Codes: Redemption and Status",
      shortTitle: "Codes: redemption and verification status",
      description:
        "Where to redeem Vox Seas codes on Roblox, how the verification process works and why no unconfirmed active codes are listed.",
      category: "Codes",
      status: "published",
      cover: {
        src: "/images/guides/vox-seas-codes.webp",
        alt: "Vox Seas Settings window showing the Codes text field and yellow Redeem button",
        credit: "Frame from Roblofix's Vox Seas codes video, captured November 16, 2026",
        sourceUrl: "https://www.youtube.com/watch?v=jo5-kvyBaII",
        width: 854,
        height: 480,
      },
      ...dates,
      relatedSlugs: ["beginner-guide", "fruits"],
      sections: [
        {
          id: "current-status",
          title: "Current code status",
          paragraphs: [
            "As of November 16, 2026, PlayBloo has not independently verified an active Vox Seas code. The official Roblox description and official release trailer do not publish one. Community footage confirms that a redemption interface exists, but the inspected clips did not expose a complete code together with a successful redemption and reward.",
            "Accordingly, this page does not label guessed strings such as RELEASE as working, does not manufacture rewards and does not maintain an expired-code table from partial screenshots. That absence is a verification decision, not a claim that the developer will never issue codes.",
          ],
          sourceIds: ["roblox", "release-trailer", "codes-video"],
        },
        {
          id: "how-to-redeem",
          title: "Where the Codes menu is",
          bullets: [
            "Open the official Vox Seas experience by the Vox Seas! group on Roblox.",
            "Open the left-side menu and choose Settings, represented by the gear icon in the community footage.",
            "Find the Codes section, enter a code exactly as published by a trustworthy source and select Redeem.",
            "Read the game's response in the interface; a text field alone is not evidence that a code is active or that a reward was granted.",
          ],
          paragraphs: [
            "The November 15 Roblofix footage shows the Settings window, Codes field and Redeem button. PlayBloo has not redeemed a code in the live game, so these steps are an attributed interface guide rather than a hands-on redemption test.",
          ],
          link: { label: "Open the official Vox Seas experience", href: robloxPage },
          sourceIds: ["roblox", "codes-video"],
        },
        {
          id: "verification-rules",
          title: "What qualifies as a verified code",
          paragraphs: [
            "A future code should have a complete, exact string and a traceable announcement or a visible successful redemption. The official Vox Seas Roblox page, group, YouTube channel and official community announcements are the preferred sources. A cropped input field, an automatic transcript or another game's code list is not enough.",
            "If the game rejects a string, do not assume that changing its capitalization or adding a year will unlock a variant. Check the original announcement and the in-game response instead. Codes can expire or carry conditions, so the check date matters even after a code has been verified once.",
          ],
          sourceIds: ["roblox", "release-trailer", "codes-video"],
        },
      ],
    },
    {
      slug: "fruits",
      title: "Vox Seas Fruits: All 14 Fruits and Rarities",
      shortTitle: "Fruits: all 14 names and rarities",
      description:
        "Filter all 14 Vox Seas fruits by name and rarity, read community-reported uses and learn the reported dealer and Ronin gacha methods.",
      category: "Fruit Wiki",
      status: "published",
      cover: {
        src: "/images/guides/vox-seas-fruits.webp",
        alt: "Roblofix Vox Seas fruit guide thumbnail with three colorful fruit icons and How to Get Fruits lettering",
        credit: "Roblofix Vox Seas fruit guide thumbnail © Roblofix",
        sourceUrl: "https://i.ytimg.com/vi/LNQx9_mkcH8/maxresdefault.jpg",
        width: 1280,
        height: 720,
      },
      ...dates,
      relatedSlugs: ["tier-list", "beginner-guide"],
      sections: [
        {
          id: "fruit-roster",
          title: "The 14-fruit roster",
          paragraphs: [
            "The current roster covered by Roblofix's November 15 ranking contains 14 fruits. Names and rarity categories are cross-checked against BloxInformer's Vox Seas fruit reference: two Common, two Rare, two Epic, six Legendary and two Mythical fruits.",
            "Rarity is a category, not a complete measure of usefulness. The reported-use column summarizes the cited creator's gameplay commentary; it does not turn community impressions into official statistics.",
          ],
          sourceIds: ["tier-video", "fruit-reference"],
        },
        {
          id: "all-fruits",
          title: "Search and filter every fruit",
          paragraphs: [
            "Use the search field for a fruit or reported role, or narrow the table by rarity. The data is a local editorial snapshot checked on November 16, 2026 — not a live stock feed.",
          ],
          fruitTable: true,
          sourceIds: ["tier-video", "fruit-reference"],
        },
        {
          id: "how-to-get-fruits",
          title: "Reported ways to get fruits",
          paragraphs: [
            "Roblofix's November 15 acquisition guide reports two main routes. The Fruit Dealer sells fruits for in-game money, with a Robux purchase option; its limited stock is reported to refresh hourly. This page does not show current stock or prices because neither was independently verified.",
            "The same guide reports that Ronin in Central Town offers a random fruit gacha. It describes a two-hour cooldown and an in-game-currency cost that scales with character level. Treat those rules as attributed, time-stamped reporting and confirm them in the current interface before spending currency.",
          ],
          sourceIds: ["fruit-guide"],
        },
        {
          id: "choosing-a-fruit",
          title: "Choosing without chasing rarity alone",
          paragraphs: [
            "For an early farming choice, consider how a kit handles groups and movement rather than assuming the rarest fruit is automatically easiest. Roblofix rates Boom as serviceable early farming, Blaze and Frozen as stronger PvE options, and Mirror as especially interesting for PvP utility. These are community assessments, not guarantees for every build or update.",
            "Our tier list keeps all 14 placements together, while the beginner guide explains how to approach a first purchase or roll without relying on unavailable live-stock claims.",
          ],
          link: { label: "Compare the community fruit tier list", href: "/guides/vox-seas/tier-list" },
          sourceIds: ["tier-video", "fruit-guide"],
        },
      ],
    },
    {
      slug: "tier-list",
      title: "Vox Seas Fruit Tier List: Community Rankings",
      shortTitle: "Fruit tier list: S through D",
      description:
        "Filter Roblofix's Vox Seas fruit tier list from S to D, with reported PvE and PvP roles and reasons for all 14 placements.",
      category: "Tier List",
      status: "published",
      cover: {
        src: "/images/guides/vox-seas-tier-list.webp",
        alt: "Roblofix Vox Seas fruit tier-list template with S through D rows and fourteen fruit icons",
        credit: "Frame from Roblofix's Vox Seas fruit tier-list video, captured November 16, 2026",
        sourceUrl: tierVideo,
        width: 1280,
        height: 720,
      },
      ...dates,
      relatedSlugs: ["fruits", "beginner-guide"],
      sections: [
        {
          id: "ranking-scope",
          title: "A community ranking, not official balance data",
          paragraphs: [
            "This table reproduces the editorial ranking in Roblofix's November 15, 2026 video, Vox Seas Fruit Tier List (Ranking All Best Fruits). The creator describes the footage as original testing and ranks all 14 fruits from S to D. It is one community member's assessment, not an official developer ranking or a promise that a fruit suits every player.",
            "The Focus column condenses the video's PvE, PvP or mixed-use discussion. Starter marks the two basic options the creator recommends replacing. Mixed fruits appear under both the PvE and PvP filters.",
          ],
          sourceIds: ["tier-video"],
        },
        {
          id: "all-tiers",
          title: "Filter the full S–D ranking",
          tierList: true,
          sourceIds: ["tier-video"],
        },
        {
          id: "pve-pvp",
          title: "Reading the PvE and PvP tradeoffs",
          paragraphs: [
            "For PvE, the video favors broad or persistent area damage: Poison, Orbit and Eclipse lead its overall list, while Vulcanic reaches A on the strength of magma damage despite slower PvP moves. Blaze and Frozen sit in B as accessible farming choices.",
            "For PvP, control and move speed matter in the creator's reasoning. Mirror's stuns and fast area attacks lift it to A, while Eclipse, Orbit and Poison retain S-tier mixed roles. Elastic has some early PvP utility but lands in C. These are attributed gameplay judgments, not measured damage values.",
          ],
          sourceIds: ["tier-video"],
        },
        {
          id: "using-the-list",
          title: "How to use a tier list sensibly",
          paragraphs: [
            "Use the ranking to shortlist a playstyle, then check the fruit's current moves and acquisition cost in game. A high-tier fruit with an unfamiliar kit can be less useful than a lower-ranked option you already understand, and updates can change the order.",
            "Open the fruit reference for rarity and acquisition context. No exact damage number, Boss clear time, mastery unlock level or live price is inferred from this video.",
          ],
          link: { label: "Open the filterable Vox Seas fruit reference", href: "/guides/vox-seas/fruits" },
          sourceIds: ["tier-video", "fruit-guide", "fruit-reference"],
        },
      ],
    },
    {
      slug: "beginner-guide",
      title: "Vox Seas Beginner Guide: First Steps",
      shortTitle: "Beginner guide: start and choose a fruit",
      description:
        "Start Vox Seas through the official Roblox page, understand reported fruit acquisition and choose an early playstyle without unverified routes.",
      category: "Beginner Guide",
      status: "published",
      cover: {
        src: "/images/guides/vox-seas-beginner-guide.webp",
        alt: "Official Vox Seas release-trailer artwork of an armored sword fighter surrounded by blue energy",
        credit: "Official Vox Seas release-trailer thumbnail © Vox Seas!",
        sourceUrl: "https://i.ytimg.com/vi/p8tEh7IEqDM/maxresdefault.jpg",
        width: 1280,
        height: 720,
      },
      ...dates,
      relatedSlugs: ["fruits", "tier-list", "codes"],
      sections: [
        {
          id: "join-official-game",
          title: "Join the official experience",
          paragraphs: [
            "Use the Roblox experience at place ID 104067066727140 and check that its creator is the Vox Seas! group. The official release trailer links to this same page. Roblox lists an action RPG with up to 20 players per server; PlayBloo links out to it rather than embedding or copying the game.",
            "The universe's January 31, 2025 creation date is separate from its November 2026 relaunch. Do not use an older same-name page or an unofficial upload as the source for your account, purchases or codes.",
          ],
          link: { label: "Play Vox Seas on its official Roblox page", href: robloxPage },
          sourceIds: ["roblox", "roblox-api", "release-trailer"],
        },
        {
          id: "first-fruit",
          title: "Understand fruit acquisition first",
          paragraphs: [
            "Fruits are one part of the game's combat progression. Roblofix's November 15 guide reports a Fruit Dealer with limited stock and a Ronin random-fruit gacha in Central Town. The dealer is described as accepting in-game money or Robux, while Ronin's gacha has a level-dependent in-game-currency cost and a two-hour cooldown.",
            "Those acquisition rules are community reporting, not a PlayBloo live-game test. Check the displayed cost and cooldown before confirming a purchase or roll. Our fruit table intentionally omits prices and current stock because they were not verified.",
          ],
          link: { label: "See all 14 fruits and reported acquisition methods", href: "/guides/vox-seas/fruits" },
          sourceIds: ["fruit-guide", "fruit-reference"],
        },
        {
          id: "early-playstyle",
          title: "Pick an early playstyle, not just a rarity",
          paragraphs: [
            "The cited community ranking treats Divide and Kilo as basic starter fruits, Boom as an early farming option, and Blaze or Frozen as stronger PvE choices. Mirror stands out for PvP control, while Poison, Orbit and Eclipse receive its highest mixed-use placements.",
            "Editorial advice: begin by learning how one kit's attacks, area coverage and movement tools fit your preferred activities. Do not spend purely because a fruit has a higher rarity badge or sits at the top of one creator's table. The current game interface and your own comfort with the moves matter more.",
          ],
          link: { label: "Compare all 14 community tier placements", href: "/guides/vox-seas/tier-list" },
          sourceIds: ["tier-video", "fruit-reference"],
        },
        {
          id: "early-habits",
          title: "Useful habits for a new account",
          bullets: [
            "Bookmark the official Roblox page so later codes and updates start from the correct experience.",
            "Read a fruit's current move set and cost in game before buying or rolling; do not rely on an old stock screenshot.",
            "Practice one kit before judging it from its tier, especially if its value comes from control or mobility rather than simple damage.",
            "Keep code redemption separate from fruit purchases: a Codes text field does not prove that a code or reward exists.",
            "Recheck community rankings after balance updates instead of treating a November 15 video as permanent.",
          ],
          sourceIds: ["roblox", "codes-video", "fruit-guide", "tier-video"],
        },
        {
          id: "beginner-coverage",
          title: "What this guide deliberately leaves out",
          paragraphs: [
            "PlayBloo has not completed a Vox Seas playthrough. This guide therefore does not invent a quest order, island unlock table, stat-point build, Boss route or fastest leveling claim. It provides the verified official entry, attributed acquisition methods and clearly labeled community impressions as a safe starting reference.",
          ],
          sourceIds: ["roblox", "fruit-guide", "tier-video"],
        },
      ],
    },
  ],
};
