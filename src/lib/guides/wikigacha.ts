import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-10-31T09:00:00.000Z", updatedAt: "2026-10-31T09:00:00.000Z" };
const screenshotCredit =
  "Screenshot of the official WikiGacha game (wikigacha.com), taken October 31, 2026; card content from Wikipedia under CC BY-SA 4.0";

export const wikigacha: GuideTopic = {
  slug: "wikigacha",
  name: "WikiGacha",
  officialName: "Wikipedia Gacha",
  title: "WikiGacha: How to Play the Wikipedia Gacha Card Game",
  description:
    "WikiGacha turns Wikipedia articles into collectible cards. Learn how its packs, rarity, stats and daily missions work, then compare it with other games that play with Wikipedia.",
  status: "published",
  platforms: ["Browser"],
  releaseDate: "2026-02-24",
  releaseStatus: "released",
  publisher: "Harusugi",
  cover: {
    src: "/images/guides/wikigacha.webp",
    alt: "Five WikiGacha cards pulled from one pack, with the Super Special Rare Bakerloo line extension card glowing at the centre",
    credit: screenshotCredit,
    sourceUrl: "https://wikigacha.com/?lang=EN",
    width: 1600,
    height: 900,
    fit: "contain",
  },
  ...dates,
  verifiedAt: "2026-10-31",
  sources: [
    { id: "official", label: "WikiGacha — official site (Wikipedia Gacha)", url: "https://wikigacha.com/" },
    { id: "rulebook", label: "WikiGacha in-game Rule Book, checked October 31, 2026", url: "https://wikigacha.com/?lang=EN" },
    { id: "enwiki", label: "Wikipedia — Wikigacha", url: "https://en.wikipedia.org/wiki/Wikigacha" },
    { id: "destructoid", label: "Destructoid — How to get more packs in Wikigacha (March 6, 2026)", url: "https://www.destructoid.com/how-to-get-more-packs-in-wikigacha/" },
    { id: "gamesradar", label: "GamesRadar+ — Wikipedia's been turned into a Pokemon TCG-like gacha game (March 6, 2026)", url: "https://www.gamesradar.com/games/wikipedias-been-turned-into-a-pokemon-tcg-like-gacha-game-where-you-collect-its-pages-because-the-random-article-button-wasnt-distracting-enough-already" },
    { id: "wikitcg", label: "WikiTCG — official site", url: "https://wikitcg.net/" },
    { id: "wikigame", label: "The Wiki Game — official site", url: "https://www.thewikigame.com/" },
    { id: "wikigame-daily", label: "The Wiki Game Daily — official site", url: "https://www.thewikigamedaily.com/" },
    { id: "wikiracing", label: "Wikiracing.org — official site", url: "https://wikiracing.org/" },
    { id: "wikitrivia", label: "Wikitrivia — official site", url: "https://wikitrivia.tomjwatson.com/" },
  ],
  sections: [
    {
      id: "what-is-wikigacha",
      title: "What is WikiGacha?",
      paragraphs: [
        "WikiGacha — the game's own site title is Wikipedia Gacha — is a free browser game by the Japanese developer Harusugi, released on February 24, 2026. It turns Wikipedia articles into trading cards: any article in the encyclopedia can appear as a collectible card with its own rarity rank, attack and defence values.",
        "Pulls come from virtual booster packs, and every card links back to the article it came from, so one pack works both as a card game and as a random-article rabbit hole. Coverage compared the loop to Wikipedia's “random article” button dressed up as a collectible card game, and the game went viral in Japan within days of launch, briefly causing server issues.",
        "It is a fan project, not a Wikimedia product. The site's own footer states that the service is unofficial and not affiliated with Wikipedia, and the game credits card content to Wikipedia's authors under CC BY-SA 4.0. The interface is available in seven languages, including English, Japanese and Simplified and Traditional Chinese.",
      ],
      link: { label: "Open the official WikiGacha site", href: "https://wikigacha.com/" },
      sourceIds: ["official", "enwiki", "gamesradar"],
    },
    {
      id: "how-the-gacha-works",
      title: "How the gacha loop works",
      paragraphs: [
        "Each pack contains five cards drawn from the Wikipedia edition matching the language you are playing in. Every card carries three values: a rarity rank, an ATK score built from the article's pageviews, and a DEF score built from the article's length. Rarer cards also include flavor text — written by a large language model for the game, not quoted from Wikipedia.",
        "Opening packs is free, and there is no way to buy packs: you can hold up to ten at once and the game refills one pack per minute, so a full stock returns in ten minutes even with the tab closed. After every ten packs you open, the next one becomes a Gold Pack that guarantees at least one Super Rare or better card.",
        "Cards you pull register into your collection automatically, and pull results unlock trophies. The game reports card data from a February 2026 snapshot, so a card reflects the article as it stood then rather than tracking every later edit.",
      ],
      sourceIds: ["rulebook", "enwiki", "destructoid"],
    },
    {
      id: "rarity-at-a-glance",
      title: "Rarity at a glance",
      paragraphs: [
        "WikiGacha has seven rarity ranks, from Common up to Legend Rare. What makes it unusual is that rarity is not a random roll per card: it is derived from each article's quality score on WikiRank, a 0–100 quality rating, so well-sourced, substantial articles become the rare pulls.",
        "Our rarity guide lists every rank with its exact Q-Score threshold, explains the ATK and DEF formulas and their 15,000 caps, and collects the pack guarantees in one table-free read.",
      ],
      link: { label: "See the full WikiGacha rarity guide", href: "/guides/wikigacha/rarity" },
      sourceIds: ["rulebook"],
    },
    {
      id: "wikigacha-facts",
      title: "WikiGacha facts at a glance",
      releaseFacts: true,
      paragraphs: [
        "The facts above come from the game's own site and Rule Book, checked October 31, 2026, with launch and coverage history cross-checked against Wikipedia's article on the game. The service is individually operated by its developer; a Server Sync beta can back up a collection to the developer's server, and the site publishes its own privacy policy and terms.",
      ],
      sourceIds: ["official", "enwiki"],
    },
  ],
  articles: [
    {
      slug: "how-to-play",
      title: "How to Play WikiGacha: Packs, Missions and Battles",
      shortTitle: "How to play: packs, missions, battles",
      description:
        "Open your first WikiGacha pack, learn the pack timer and Gold Pack guarantee, finish the daily missions and try every battle mode.",
      category: "Getting started",
      status: "published",
      cover: {
        src: "/images/guides/wikigacha-how-to-play.webp",
        alt: "The WikiGacha pack screen with the daily pack counter, Gold Pack and Rainbow Pack progress and a Wikipedia booster pack",
        credit: screenshotCredit,
        sourceUrl: "https://wikigacha.com/?lang=EN",
        width: 1600,
        height: 900,
        fit: "contain",
      },
      ...dates,
      relatedSlugs: ["rarity", "alternatives"],
      sections: [
        {
          id: "first-run",
          title: "Your first pack",
          bullets: [
            "Open wikigacha.com and pick your language from the globe menu — the game has seven, including English and both Chinese variants.",
            "Tap the Wikipedia booster pack in the middle of the screen. Five cards appear, each showing a rarity badge, the article title and ATK/DEF values.",
            "Click any card to open the Wikipedia article it came from; the game counts this towards the “Open Wikipedia once” daily mission.",
            "Pulled cards register into your collection automatically, and unusual pulls unlock trophies.",
          ],
          paragraphs: [
            "You can start pulling without an account. The optional Server Sync beta can back up your collection to the developer's server, and the game's own update notes recommend exporting a backup from the collection page before relying on it.",
          ],
          link: { label: "Open the official WikiGacha game", href: "https://wikigacha.com/" },
          sourceIds: ["official", "rulebook"],
        },
        {
          id: "packs-and-refills",
          title: "The pack timer and the Gold Pack guarantee",
          paragraphs: [
            "The pack counter at the top of the screen shows how many packs you hold, up to ten. Below ten, a timer grants one free pack per minute — roughly ten minutes for a full stock — and refills continue while the game is closed. Opening a pack restarts the timer.",
            "The screen also tracks two pity counters: “pulls until Gold Pack” and, during the current campaign, “pulls until Rainbow Pack”. After every ten packs opened, the next one becomes a Gold Pack that guarantees at least one Super Rare (SR) or higher card. The hundred-million-pack campaign running as of October 2026 adds a Rainbow Pack with an SSR+ guarantee as the day's first pull, another Rainbow Pack every hundred pulls and Black Packs with a UR+ guarantee tied to login stamps — event extras like these can change or end.",
          ],
          sourceIds: ["rulebook", "official"],
        },
        {
          id: "daily-missions",
          title: "Daily missions: the fastest way to earn packs",
          paragraphs: [
            "Five daily missions appear on the pack screen, and each completed mission pays two extra packs — ten extra in total for a full sweep. Bonus packs earned this way stack above the ten-pack cap: after completing one mission, the counter read 11/10 in our check.",
          ],
          table: {
            headers: ["Daily mission", "Requirement"],
            rows: [
              ["Open 5 packs", "Pull five packs in one day"],
              ["Pull at least one SR+ card", "Any Super Rare or higher card counts"],
              ["Open Wikipedia once", "Click through to any pulled card's article"],
              ["Share your result", "Use the Share Result button after a pull"],
              ["Watch one ad", "A rewarded ad watched in the game"],
            ],
          },
          sourceIds: ["official", "destructoid"],
        },
        {
          id: "battles",
          title: "Battle modes, from raids to the story expedition",
          paragraphs: [
            "The Battle menu lists four modes with their own rules. Daily Raid Battle challenges one powerful raid boss each day with up to 50 cards, and the boss's HP carries over between attempts until it is cleared. Single Random Battle picks one card from your collection against a random opponent of a similar grade, while Team Battle has you arrange five cards in battle order against another five-card team.",
            "Story Expedition is the newest mode: battles earn insight, which strengthens five chosen cards so you can push into deeper stages. The developer keeps expanding it — the October 30, 2026 update added achievements, difficulty display and damage prediction to boss battles.",
          ],
          sourceIds: ["official", "rulebook"],
        },
        {
          id: "saving-progress",
          title: "Saving, syncing and backing up",
          paragraphs: [
            "Your collection and trophies persist in the browser by default, so clearing site data wipes them. The Server Sync beta, marked on its button, syncs collection data with the developer's server. Before trusting it, the game's own guidance is to export a local backup from the collection page — its update log has repeatedly recommended re-exporting backups after sync changes.",
          ],
          sourceIds: ["official"],
        },
      ],
    },
    {
      slug: "rarity",
      title: "WikiGacha Rarity Guide: All Seven Tiers, Q-Score and Card Stats",
      shortTitle: "Rarity: all seven tiers & stats",
      description:
        "Every WikiGacha rarity rank from Common to Legend Rare with its exact Q-Score threshold, plus the ATK and DEF formulas, pack guarantees and flavor text.",
      category: "Rarity & stats",
      status: "published",
      cover: {
        src: "/images/guides/wikigacha-rarity.webp",
        alt: "WikiGacha's in-game Rule Book listing the seven rarity ranks from Common to Legend Rare with their Q-Score thresholds",
        credit: screenshotCredit,
        sourceUrl: "https://wikigacha.com/?lang=EN",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["how-to-play", "alternatives"],
      sections: [
        {
          id: "q-score",
          title: "Rarity comes from the article, not the roll",
          paragraphs: [
            "Most gacha games randomize rarity per pull. WikiGacha instead grades every Wikipedia article with a Q-Score — a 0–100 quality score taken from WikiRank — and the Q-Score decides the card's rarity rank. A meticulously sourced, substantial article is therefore the “jackpot”, regardless of whether its subject is famous.",
            "Card data uses a February 2026 snapshot, so ranks reflect article quality as of that date rather than tracking later edits.",
          ],
          link: { label: "WikiRank — the quality source WikiGacha uses", href: "https://wikirank.net/" },
          sourceIds: ["rulebook"],
        },
        {
          id: "rarity-table",
          title: "The seven rarity ranks",
          paragraphs: [
            "The in-game Rule Book lists the exact thresholds below. No drop rates are published — rarity follows the article's grade, and because English Wikipedia holds far more low-rated articles than high ones, Commons are by far the most common pulls.",
          ],
          table: {
            headers: ["Rank", "Name", "Q-Score required"],
            rows: [
              ["LR", "Legend Rare", "100 (Peak Quality)"],
              ["UR", "Ultra Rare", "90+"],
              ["SSR", "Super Special Rare", "80+"],
              ["SR", "Super Rare", "60+"],
              ["R", "Rare", "35+"],
              ["UC", "Uncommon", "20+"],
              ["C", "Common", "Below 20"],
            ],
          },
          sourceIds: ["rulebook"],
        },
        {
          id: "atk-and-def",
          title: "ATK and DEF: what the numbers mean",
          table: {
            headers: ["Stat", "Formula", "Cap", "Represents"],
            rows: [
              ["ATK (Popularity)", "Pageviews × Rarity Multiplier", "15,000", "The article's fame"],
              ["DEF (Depth)", "Content Length × Rarity Multiplier", "15,000", "The article's detail"],
            ],
          },
          paragraphs: [
            "Both stats multiply the article's raw numbers by the card's rarity, so a rare article on a popular subject hits much harder than a rare article nobody reads. When you compare two cards of the same rank, the one with higher pageviews wins ATK and the longer article wins DEF.",
          ],
          sourceIds: ["rulebook"],
        },
        {
          id: "pack-guarantees",
          title: "Gold, Rainbow and Black packs",
          paragraphs: [
            "The baseline guarantee applies to everyone: after every ten packs opened, the next pack is a Gold Pack with at least one SR+ card. During the October 2026 hundred-million-pack campaign, the day's first pull is a Rainbow Pack with an SSR+ guarantee, every hundredth pull upgrades to a Rainbow Pack, and every five login stamps upgrade a daily first pull to a Black Pack with a UR+ guarantee. Campaign rules are event content and can change or expire.",
          ],
          sourceIds: ["rulebook", "official"],
        },
        {
          id: "best-cards",
          title: "What makes a “best card”?",
          paragraphs: [
            "The strongest cards combine rank with stats: an SSR or better article that also draws heavy pageviews and covers a long subject can reach the tens of thousands in ATK or DEF. Super Special Rare cards and above add flavor text written for the game by a large language model — it is not Wikipedia content, and the site asks players to report problematic lines via its contact page.",
            "Rarity follows article quality rather than fame, so the rarest pulls are often unglamorous topics maintained to a high standard — that surprise is a large part of the appeal, and players trade their strangest finds on the r/Wikigacha subreddit.",
          ],
          sourceIds: ["rulebook", "enwiki"],
        },
      ],
    },
    {
      slug: "alternatives",
      title: "WikiGacha Alternatives: Four More Games That Play With Wikipedia",
      shortTitle: "Alternatives: more wiki games",
      description:
        "From WikiTCG's holographic card battles to wiki races and timeline trivia, four checked alternatives to WikiGacha and who each one suits.",
      category: "Similar games",
      status: "published",
      cover: {
        src: "/images/guides/wikigacha-alternatives.webp",
        alt: "The Wiki Game's race setup, challenging players to find the fastest route between two Wikipedia pages",
        credit: "Screenshot of thewikigame.com, taken October 31, 2026",
        sourceUrl: "https://www.thewikigame.com/",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["how-to-play", "rarity"],
      sections: [
        {
          id: "another-wikipedia-gacha",
          title: "WikiTCG: the other Wikipedia card game",
          paragraphs: [
            "WikiTCG (wikitcg.net) builds on the same idea — every card is a real Wikipedia article — but wraps it in a more traditional TCG: holographic card effects across seven rarity tiers, eleven themed series such as Lost Empires and Myths & Legends, four-by-four grid battles with card abilities, cooperative raid bosses for two to six players, card fusion and a marketplace for trading. It is free to play in the browser as a progressive web app, and it describes itself as a Wikigacha alternative.",
            "Choose it when you want deck-building and trading on top of collecting; stay with WikiGacha when you want the purer, strangest version of the article-pull loop.",
          ],
          link: { label: "Open WikiTCG", href: "https://wikitcg.net/" },
          sourceIds: ["wikitcg"],
        },
        {
          id: "wiki-racing",
          title: "Wiki racing: The Wiki Game and Wikiracing.org",
          paragraphs: [
            "If the fun is in wandering Wikipedia, racing games are the classic alternative. The Wiki Game challenges you to find the fastest route between two pages — its front page pairs a start article with a target such as “Frank Miller (comics) → Forbes” — and offers group play, an iOS app with five modes and 200 levels, and a daily puzzle site, The Wiki Game Daily.",
            "Wikiracing.org is the multiplayer take: speedrun Wikipedia against friends in real time, with solo runs and daily challenges as well.",
          ],
          link: { label: "Open The Wiki Game", href: "https://www.thewikigame.com/" },
          sourceIds: ["wikigame", "wikigame-daily", "wikiracing"],
        },
        {
          id: "timeline-trivia",
          title: "Wikitrivia: order history instead of collecting it",
          paragraphs: [
            "Wikitrivia takes Wikipedia's historical content in a different direction: you place events and figures onto a timeline in the right order, building a strip of history as far as you can. A daily board and free-play mode make it an easy companion habit, and losing sends you back to actually read the dates.",
          ],
          link: { label: "Open Wikitrivia", href: "https://wikitrivia.tomjwatson.com/" },
          sourceIds: ["wikitrivia"],
        },
        {
          id: "picking-one",
          title: "Which one should you play?",
          bullets: [
            "Collect and laugh at absurd articles: WikiGacha remains the purest take.",
            "Deck-building, trading and raids: WikiTCG.",
            "Competitive link-clicking with friends: The Wiki Game or Wikiracing.org.",
            "A quiet daily history puzzle: Wikitrivia.",
          ],
          paragraphs: [
            "And if the real appeal is discovering games you have never heard of, PlayBloo's own catalog collects hundreds of free browser games across genres — no cards required, though the discovery itch is the same.",
          ],
          link: { label: "Browse PlayBloo's free browser games", href: "https://playbloo.net/search" },
        },
      ],
    },
  ],
};
