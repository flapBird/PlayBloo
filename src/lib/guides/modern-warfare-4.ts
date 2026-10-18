import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-10-18T17:53:50+08:00", updatedAt: "2026-10-18T17:53:50+08:00" };

export const modernWarfare4: GuideTopic = {
  slug: "modern-warfare-4",
  name: "Call of Duty: Modern Warfare 4",
  officialName: "Call of Duty: Modern Warfare 4",
  title: "MW4 Guide: Release Date, Campaign & Gameplay",
  description: "Modern Warfare 4 launches October 23, 2026. Find MW4 release details, campaign early access eligibility, the mission count and an overview of gameplay.",
  status: "published",
  platforms: ["PlayStation 5", "Xbox Series X|S", "PC", "Nintendo Switch 2"],
  releaseDate: "2026-10-23",
  releaseStatus: "upcoming",
  publisher: "Activision",
  cover: {
    src: "/images/guides/modern-warfare-4.webp",
    alt: "Three soldiers beside the Call of Duty: Modern Warfare 4 logo in official reveal artwork",
    credit: "Official promotional artwork © Activision Publishing, Inc.",
    sourceUrl: "https://imgs.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/body/mw4/reveal/MW4-REVEAL-TOUT.jpg",
    width: 1600,
    height: 901,
    fit: "contain",
  },
  ...dates,
  verifiedAt: "2026-10-18",
  sources: [
    { id: "reveal", label: "Call of Duty — May 28 announcement and platforms", url: "https://www.callofduty.com/blog/2026/05/call-of-duty-modern-warfare-4-announcement.html" },
    { id: "campaign-announcement", label: "Call of Duty — June 12 campaign early access announcement", url: "https://www.callofduty.com/blog/2026/06/call-of-duty-modern-warfare-4-campaign-early-access" },
    { id: "campaign-live", label: "Call of Duty — October 16 campaign availability and sixteen missions", url: "https://www.callofduty.com/blog/2026/10/call-of-duty-modern-warfare-4-campaign-early-access-live-now" },
    { id: "campaign-trailer", label: "Call of Duty — September 17 campaign story overview", url: "https://www.callofduty.com/blog/2026/09/call-of-duty-modern-warfare-4-tokyo-games-show-campaign-trailer" },
    { id: "multiplayer", label: "Call of Duty — Multiplayer movement, gunplay, modes and maps", url: "https://www.callofduty.com/blog/2026/08/call-of-duty-modern-warfare-4-next-highlights-multiplayer-gameplay-systems" },
    { id: "pc", label: "Call of Duty — PC preload, launch timing and requirements", url: "https://www.callofduty.com/blog/2026/09/call-of-duty-modern-warfare-4-pc-trailer-tech-specs-features" },
    { id: "dmz", label: "Call of Duty — DMZ early access and Forward Operating Base", url: "https://www.callofduty.com/au/en/blog/2026/10/call-of-duty-modern-warfare-4-dmz-how-to-play-forward-operating-base-guide" },
    { id: "game-pass", label: "Call of Duty — October 15 standalone release and Game Pass announcement", url: "https://www.callofduty.com/blog/2026/10/call-of-duty-intel-modern-warfare-4-launch-xbox-game-pass" },
    { id: "editions", label: "Call of Duty — Current digital edition comparison", url: "https://www.callofduty.com/en/store/games/modernwarfare4" },
  ],
  sections: [
    {
      id: "overview", title: "What is Call of Duty: Modern Warfare 4?",
      paragraphs: ["MW4 is Infinity Ward’s 2026 Call of Duty, published by Activision. Its three main experiences are Campaign, Multiplayer and DMZ. This guide covers the new Modern Warfare 4; it is a different game from Call of Duty 4: Modern Warfare (2007)."],
      sourceIds: ["reveal", "editions"],
    },
    {
      id: "release-date", title: "When does MW4 come out?", releaseFacts: true,
      paragraphs: ["The full release is Friday, October 23, 2026. Campaign early access started October 16 for eligible digital preorders; DMZ early access is scheduled for October 20. As checked on October 18, the campaign is available early, while the full release is still upcoming. There is no PS4 or Xbox One version."],
      sourceIds: ["reveal", "campaign-live", "dmz"],
    },
    {
      id: "campaign", title: "MW4 campaign: story and mission count",
      paragraphs: ["The campaign contains 16 missions. Its story follows Private Park Hyun Jun during an invasion of South Korea and Captain Price operating outside his former chain of command. The campaign guide explains access eligibility and what the published mission count tells you, without revealing the ending."],
      sourceIds: ["campaign-live", "campaign-trailer"],
    },
    {
      id: "gameplay", title: "MW4 gameplay: what changes?",
      bullets: [
        "Campaign combines large battles with covert operations across Korea and overseas locations.",
        "Multiplayer emphasizes grounded movement. Mantling, climbing and hanging expand ways to navigate cover and vertical spaces.",
        "Ballistic Authority changes weapon handling and shot placement. Gunny suggests starting loadouts; Apex Attachments add weapon-specific options as you progress.",
        "Kill Block changes the combat layout between rounds. The launch lineup includes 12 Core 6v6 maps, alongside other map types.",
        "DMZ is an extraction mode: enter a conflict zone, complete objectives, collect equipment and decide when to leave. A Forward Operating Base supports preparation and persistent progression.",
      ],
      paragraphs: ["These are announced systems, rather than a PlayBloo performance test or review. We have not played MW4, so this page does not prescribe a best loadout or graphics preset."],
      sourceIds: ["reveal", "multiplayer", "dmz"],
    },
    {
      id: "editions", title: "Do you need the Vault Edition or Game Pass?",
      paragraphs: ["Both Standard Digital and Vault digital preorders include campaign early access. Vault adds premium content; it is not required just to play the story early. Check the edition listing for the platform and region you use before buying.", "Activision’s October 15 announcement says MW4 requires a separate purchase at launch and will not join Game Pass until Holiday 2027. A Game Pass subscription alone does not provide MW4 launch access."],
      sourceIds: ["editions", "game-pass"],
    },
  ],
  articles: [
    {
      slug: "release-date", shortTitle: "Release date, platforms & launch schedule", category: "Release information",
      title: "MW4 Release Date: When Does Modern Warfare 4 Come Out?",
      description: "MW4 releases October 23, 2026. Compare the full launch with campaign and DMZ early access, PC preload details, supported platforms and Game Pass availability.",
      status: "published", ...dates, relatedSlugs: ["campaign-early-access"],
      sections: [
        {
          id: "release-date", title: "Modern Warfare 4 release date", releaseFacts: true,
          paragraphs: ["Call of Duty: Modern Warfare 4 comes out on Friday, October 23, 2026. That is the full-game date. The October 16 campaign opening and October 20 DMZ opening are earlier access windows for qualifying digital preorders."],
          sourceIds: ["reveal", "dmz"],
        },
        {
          id: "schedule", title: "MW4 launch schedule",
          table: { headers: ["Date in the announcement", "What opens", "Who it applies to"], rows: [
            ["October 15, 2026 · 9 AM PT", "PC preload", "Digital PC prepurchases; downloading is separate from unlocking play"],
            ["October 16, 2026", "Campaign early access", "Eligible Standard Digital and Vault Edition preorders"],
            ["October 20, 2026", "DMZ early access", "Eligible Standard Digital and Vault Edition preorders"],
            ["October 23, 2026", "Full game launch", "Players who purchase MW4; includes Multiplayer"],
          ] },
          sourceIds: ["pc", "dmz", "game-pass"],
        },
        {
          id: "release-time", title: "What time does MW4 unlock?",
          paragraphs: ["The September 29 PC announcement lists the full release at midnight local time on October 23. It does not provide a complete, store-by-store regional unlock table. Check the countdown for your purchased version rather than treating that wording as a universal simultaneous unlock.", "The PC preload time is October 15 at 9 AM Pacific Time. A preload prepares the files; it does not grant access to a mode before its opening. The early access announcements note that availability can vary with time zones, platform changes and outages."],
          sourceIds: ["pc", "dmz"],
        },
        {
          id: "platforms", title: "Which platforms get Modern Warfare 4?",
          paragraphs: ["MW4 is announced for PS5, Xbox Series X|S, PC and Nintendo Switch 2. PC stores include Steam, Battle.net and Xbox on PC. PS4 and Xbox One are excluded from the announced release."],
          sourceIds: ["reveal"],
        },
        {
          id: "game-pass", title: "Is MW4 on Game Pass at launch?",
          paragraphs: ["No. The October 15 announcement states that Modern Warfare 4 is a standalone purchase at launch and is scheduled to enter Game Pass in Holiday 2027. Access to older Call of Duty games through a subscription does not establish access to this release.", "If you are deciding how to play on October 23, use the MW4 purchase listing for your platform. If your priority is the story before launch, the campaign early access guide explains the qualifying editions."],
          sourceIds: ["game-pass"],
        },
      ],
    },
    {
      slug: "campaign-early-access", shortTitle: "Campaign early access & 16 missions", category: "Campaign",
      title: "MW4 Campaign Early Access: How to Play & How Many Missions",
      description: "MW4 campaign early access began October 16. Learn which digital editions qualify, whether you need Vault, and how many missions Modern Warfare 4 contains.",
      status: "published", ...dates, relatedSlugs: ["release-date"],
      sections: [
        {
          id: "early-access", title: "Can you play the MW4 campaign now?",
          paragraphs: ["Yes. As of October 18, 2026, campaign early access is live. It began October 16 and continues up to the October 23 full launch. Eligible players can play the complete campaign, rather than a timed sample."],
          sourceIds: ["campaign-live"],
        },
        {
          id: "eligibility", title: "How to get MW4 campaign early access",
          paragraphs: ["Digitally preorder or prepurchase the Standard Digital Edition or Vault Edition for your platform. The announced benefit covers PS5, Xbox Series X|S, Xbox on PC, Battle.net, Steam and Nintendo Switch 2. You do not need the Vault Edition for this benefit.", "The eligibility wording specifies digital purchases. Do not assume a physical preorder or an old beta download grants the same entitlement. Check your order’s edition and account if you are unsure what you own."],
          sourceIds: ["campaign-announcement", "campaign-live"],
        },
        {
          id: "mission-count", title: "How many missions are in MW4?",
          paragraphs: ["Modern Warfare 4 has 16 campaign missions, according to the October 16 launch announcement. That number refers to the story campaign, not DMZ objectives or Multiplayer matches.", "This is a spoiler-light access guide. We have not verified the full ordered mission-name list or measured a completion time. A mission count alone cannot tell you how many hours your difficulty choice, retries and exploration will take."],
          sourceIds: ["campaign-live"],
        },
        {
          id: "story", title: "What is the campaign about?",
          paragraphs: ["Two threads drive the story: Park and his squad respond to the invasion of South Korea, while Price works outside official channels. The September trailer overview also establishes conflict between Price and former allies, and a dangerous figure called the Archer.", "Expect a mix of front-line warfare and covert operations. This overview stops at the announced premise; it does not explain late-game events or the ending."],
          sourceIds: ["campaign-trailer", "campaign-announcement"],
        },
        {
          id: "before-playing", title: "Before starting the campaign",
          bullets: [
            "Confirm the store account you are using owns a qualifying digital edition, then finish the required installation and updates.",
            "On PC, the published requirements specify an SSD with 115 GB of storage, TPM 2.0 and Secure Boot. Updates may need additional space; check your actual installation.",
            "If an access prompt remains, compare the purchased platform, edition and account before buying an upgrade. These are suggested checks, not a tested fix for a specific error code.",
          ],
          sourceIds: ["campaign-announcement", "pc"],
        },
        {
          id: "rewards-and-modes", title: "Rewards, DMZ and Multiplayer access",
          paragraphs: ["Campaign progress awards Operators, cosmetic items and XP tokens. The October 16 announcement says these campaign rewards become usable in Multiplayer and DMZ at the full launch.", "DMZ early access has its own October 20 start date for qualifying digital preorders. Campaign availability does not mean Multiplayer has launched; the full-game date is October 23."],
          sourceIds: ["campaign-live", "dmz"],
        },
      ],
    },
  ],
};
