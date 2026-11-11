import type { GuideTopic } from "./types";

const publicationDate = "2026-11-08T13:00:00.000Z";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };
const epicNews = "https://www.fortnite.com/news/fortnite-treasure-hunters-the-greatest-adventure-of-all-time";
const viceArticle = "https://www.vice.com/en/article/fortnite-pirate-token-drop-rate-confirmed";
const ignArticle = "https://www.ign.com/articles/epic-reveals-drop-rate-for-fortnites-pirate-token-following-pressure-from-fans";

export const fortnitePirateToken: GuideTopic = {
  slug: "fortnite-pirate-token",
  name: "Fortnite Pirate Token",
  officialName: "Fortnite — Treasure Hunters mini-season",
  title: "Fortnite Pirate Token Guide: Odds and How to Get",
  description:
    "What the Fortnite Pirate Token unlocks, the official chest drop odds Epic published, Treasure Hour windows and what 1 in 137,500 means for your match routine.",
  status: "published",
  heroFact: "Treasure Hunters mini-season · live November 1 – December 5, 2026",
  platforms: ["PlayStation", "Xbox", "Nintendo Switch", "PC", "Mobile"],
  releaseDate: "2026-11-01",
  releaseStatus: "released",
  publisher: "Epic Games",
  cover: {
    src: "/images/guides/fortnite-pirate-token.webp",
    alt: "An illustrated Fortnite treasure map on a ship's table, with X marks, a compass rose and a dashed sailing route across torn parchment pieces",
    credit: "Official Fortnite Treasure Tab artwork © Epic Games",
    sourceUrl: "https://cdn-live.prm.ol.epicgames.com/prod/17e5919c76f0462a95a0143af0f6b9d8.jpeg",
    width: 1600,
    height: 900,
  },
  ...dates,
  verifiedAt: "2026-11-08",
  sources: [
    { id: "epic-news", label: "Fortnite — Treasure Hunters: The Greatest Adventure of All Time (official announcement)", url: epicNews },
    { id: "vice", label: "Vice — Fortnite Pirate Token Drop Rate Revealed (November 7, 2026)", url: viceArticle },
    { id: "ign", label: "IGN — Epic Reveals Fortnite Pirate Token Drop Rate Following Pressure From Fans", url: ignArticle },
    { id: "treasure-tab", label: "Epic Games CDN — official Treasure Tab in-game news tile (cover source, checked November 8, 2026)", url: "https://cdn-live.prm.ol.epicgames.com/prod/17e5919c76f0462a95a0143af0f6b9d8.jpeg" },
    { id: "island-tile", label: "Epic Games CDN — official island news tile for the how-to-get article cover", url: "https://cdn-live.prm.ol.epicgames.com/prod/0b3abf5d00144b8fbcd4544c4dbe2c75.jpeg" },
    { id: "devilfruit-tile", label: "Epic Games CDN — official Devil Fruit news tile for the drop-rate article cover", url: "https://cdn-live.prm.ol.epicgames.com/prod/277de79b79934dfbba0a2ef1d66e6f1b.jpeg" },
  ],
  sections: [
    {
      id: "what-is-the-token",
      title: "What the Pirate Token does",
      paragraphs: [
        "The Pirate Token is an ultra-rare reward that Treasure Hunters chests can drop. Redeeming it grants access to the Pirate Shop, where items can be claimed without spending V-Bucks: IGN describes it as making nearly every item there free for 14 days, and Vice's coverage of Epic's own wording says it lets you claim every cosmetic in the Fortnite Item Shop for free for 14 days straight.",
        "It is the second-rarest drop in the chest reward pool, behind only the Weekly Gold Outfit. Everything else in the pool — vehicles, pickaxes, Jam Tracks, loading screens and Gizmo items — appears at odds measured in the hundreds, not the hundred-thousands.",
      ],
      link: { label: "See the full odds table", href: "/guides/fortnite-pirate-token/drop-rate" },
      sourceIds: ["vice", "ign"],
    },
    {
      id: "treasure-hunters",
      title: "Where it drops: the Treasure Hunters mini-season",
      paragraphs: [
        "The token belongs to Treasure Hunters, the One Piece-themed mini-season that opened on November 1, 2026 as part of Fortnite Chapter 7. Its battle royale island, Crossbones Isle, is an 80-player map with One Piece locations such as Arlong Park and Windmill Village, plus Devil Fruit powers like Luffy's Gum-Gum Fruit to find and use in matches.",
        "Treasure chests are scattered across that island, and opening them rolls the special reward table the token sits on top of. Epic's announcement points to the in-game Treasure Tab for weekly hunt progress. Epic also tells players to keep Saturday, December 5 open for a Chapter 7 end event, which currently marks the end of the season.",
      ],
      link: { label: "Open Epic's Treasure Hunters announcement", href: epicNews },
      sourceIds: ["epic-news"],
    },
    {
      id: "odds-at-a-glance",
      title: "The official odds at a glance",
      table: {
        headers: ["Chest reward (normal match)", "Odds per chest"],
        rows: [
          ["Weekly Gold Outfit", "1 in 1,562,500"],
          ["Pirate Shop Access (Pirate Token)", "1 in 137,500"],
          ["Weekly Vehicle and Decal", "1 in 7,813"],
          ["Weekly Pickaxe or Back Bling", "1 in 568"],
          ["Weekly Jam Track", "1 in 391"],
          ["Weekly Loading Screen", "1 in 272"],
          ["Any Gizmo", "1 in 127"],
        ],
      },
      paragraphs: [
        "Epic published these figures on November 7, 2026, and they are per chest opened in a normal match — not per match, per day or per season. Our drop-rate article turns them into expected chest counts and covers the Treasure Hour boosts.",
      ],
      link: { label: "Read the drop-rate breakdown", href: "/guides/fortnite-pirate-token/drop-rate" },
      sourceIds: ["vice", "ign"],
    },
    {
      id: "treasure-hours",
      title: "Treasure Hours: the boosted Saturday windows",
      paragraphs: [
        "Treasure Hours are scheduled windows with multiplied drop odds, running on Saturdays through the season in two sessions: 2–4 PM ET (11 AM–1 PM PT) and 9–11 PM ET (6–8 PM PT). On November 7, the token's odds ran at 1.5× in the first window and 2× in the second, with the Weekly Gold Outfit boosted 7.5× and the Weekly Vehicle and Decal 10×.",
        "Vice's schedule lists November 14, 21, 28 and December 5 for the remaining Treasure Hours, with the token at 1.5× in both windows on those dates. Epic also notes rates may be higher in future windows, so treat the in-game news tab as the authority for any given Saturday. Some players call these windows Power Hours; Epic's official name is Treasure Hours.",
      ],
      link: { label: "How-to-get guide: farming chests during Treasure Hours", href: "/guides/fortnite-pirate-token/how-to-get" },
      sourceIds: ["vice", "ign", "epic-news"],
    },
    {
      id: "odds-reveal",
      title: "Epic published the odds after fan pressure",
      paragraphs: [
        "The token shipped without published odds, and the reaction grew loud enough that some players talked about reporting Epic to the FTC over undisclosed rates while others called for a boycott. On November 7, 2026, Epic's Fortnite Status account posted the full chest reward table, with the Pirate Token at 1 in 137,500 in a normal match.",
        "Two details matter beyond the numbers. First, Epic said the rates had not been silently reduced since the season launched — they were unchanged from day one. Second, players had been guessing odds far better than reality (roughly 1 in 7,000 was a common guess), so the official table is also a reality check on expectations.",
      ],
      sourceIds: ["vice", "ign"],
    },
    {
      id: "track-your-count",
      title: "Track your chest count while you farm",
      paragraphs: [
        "There is no chest counter inside Fortnite itself, so keeping a running tally during the grind means counting by hand. PlayBloo built a free web tool for exactly that: the Fortnite Chest Counter lets you tap a count up as you open chests, saves the total in your browser, and turns your count into a live Pirate Token chance using the official odds published on November 7, 2026.",
        "It works on phones mid-match, supports batch counting when you open a stash of chests at once, and has a Treasure Hour toggle that applies the announced 1.5× boost to the token odds.",
      ],
      link: { label: "Open the Fortnite Chest Counter", href: "/tools/fortnite-chest-counter" },
    },
    {
      id: "about-this-guide",
      title: "About this coverage",
      paragraphs: [
        "PlayBloo has not pulled a Pirate Token, and nothing here is a luck claim — the numbers are Epic's published odds as reported by IGN and Vice on November 7–8, 2026, and the season details come from Epic's own announcement. Schedules, odds and shop behavior can change mid-season; check the in-game Treasure Tab and news screens for the current values.",
        "Fortnite is not a PlayBloo browser game, and this guide does not sell V-Bucks, accounts or tokens. The farming advice in our how-to-get guide is editorial planning based on the published odds, not a tested route to a guaranteed drop.",
      ],
      sourceIds: ["vice", "ign", "epic-news"],
    },
  ],
  articles: [
    {
      slug: "drop-rate",
      title: "Fortnite Pirate Token Drop Rate: Full Odds Table",
      shortTitle: "Drop rate: full odds table",
      description:
        "Every published Fortnite chest reward odd, the Treasure Hour multipliers, and what 1 in 137,500 means in expected chests — with the math spelled out.",
      category: "Drop rates",
      status: "published",
      cover: {
        src: "/images/guides/fortnite-pirate-token-drop-rate.webp",
        alt: "Fortnite Treasure Hunters gameplay art with a player launching across a blossom-lined shore while another glides through the air using stretchy Devil Fruit powers",
        credit: "Official Fortnite Devil Fruit news artwork © Epic Games",
        sourceUrl: "https://cdn-live.prm.ol.epicgames.com/prod/277de79b79934dfbba0a2ef1d66e6f1b.jpeg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["how-to-get"],
      sections: [
        {
          id: "full-odds",
          title: "The full chest odds table (normal match)",
          paragraphs: [
            "Epic Games published the complete reward table on November 7, 2026, after a week of fan pressure over undisclosed odds. Each row below is the chance that one opened treasure chest in a normal match drops that reward tier.",
            "The percentage column is a rounded conversion of Epic's published ratio. Note how the two headline rewards — the Weekly Gold Outfit and the Pirate Token — sit orders of magnitude above everything else in the pool, which is why chest farming feels productive right up until you do the math on those two specifically.",
          ],
          table: {
            headers: ["Reward", "Odds per chest", "Roughly 1 chance in…"],
            rows: [
              ["Weekly Gold Outfit", "1 in 1,562,500", "about 0.000064%"],
              ["Pirate Shop Access (Pirate Token)", "1 in 137,500", "about 0.00073%"],
              ["Weekly Vehicle and Decal", "1 in 7,813", "about 0.013%"],
              ["Weekly Pickaxe or Back Bling", "1 in 568", "about 0.18%"],
              ["Weekly Jam Track", "1 in 391", "about 0.26%"],
              ["Weekly Loading Screen", "1 in 272", "about 0.37%"],
              ["Any Gizmo", "1 in 127", "about 0.79%"],
            ],
          },
          sourceIds: ["vice", "ign"],
        },
        {
          id: "treasure-hour-boosts",
          title: "Treasure Hour multipliers and boosted odds",
          paragraphs: [
            "Treasure Hours run on Saturdays through the mini-season, in two windows: 2–4 PM ET (11 AM–1 PM PT) and 9–11 PM ET (6–8 PM PT). Epic's reveal and Vice's schedule give the multipliers below, which divide the base odds.",
            "The divisions are exact for the token's 2× (137,500 ÷ 2) and 1.5× (137,500 ÷ 1.5 = 91,666.67, rounded to 91,667). Epic's own post showed the 1.5× and 2× token figures in that form, and Vice reported the 10× Gold Outfit evening as 1 in 156,250. Multipliers can vary by window — November 7 used different values in its two sessions — and Epic says rates may be higher in the future, so check the in-game news tab on the day.",
          ],
          table: {
            headers: ["Reward", "Boost", "Boosted odds"],
            rows: [
              ["Pirate Token — November 14, 21, 28, December 5", "1.5×", "1 in 91,667"],
              ["Pirate Token — November 7 second window", "2×", "1 in 68,750"],
              ["Weekly Gold Outfit — 7.5× window", "7.5×", "1 in 208,333"],
              ["Weekly Gold Outfit — 10× window (November 7 evening)", "10×", "1 in 156,250"],
              ["Weekly Vehicle and Decal — 10× window", "10×", "1 in 781"],
            ],
          },
          sourceIds: ["vice", "ign"],
        },
        {
          id: "what-it-means",
          title: "What 1 in 137,500 means in practice",
          paragraphs: [
            "A 1-in-137,500 chance per chest means you would need to open about 137,500 chests on average to see one token — and that average guarantees nothing on any single season. For comparison, opening even 100 chests per day, every day of the 35-day season, only reaches about 3,500 chests, a 2.5% cumulative chance at the base rate.",
            "The Treasure Hour multipliers shrink the mountain, not flatten it: a 2× window averages one token per 68,750 chests, and a 1.5× Saturday runs about one per 91,667. The realistic tiers are the rest of the odds table — a Gizmo roughly every 127 chests, loading screens and Jam Tracks every few hundred — which you will collect naturally while farming. Treat the token as a lottery ticket that farming gives you more draws on, not a goal a session can reach.",
            "One more honesty check on the pool: Epic did not publish whether the odds reset per reward period or how 'weekly' tiers rotate, and we have not tested chest openings ourselves. The table is Epic's own publication; our arithmetic only converts it into expected chest counts.",
          ],
          sourceIds: ["vice", "ign"],
        },
        {
          id: "odds-controversy",
          title: "Why the odds were revealed on November 7",
          paragraphs: [
            "The token launched November 1 with no published odds. Over the following days, frustration built into visible action: some players organized reports to the FTC over undisclosed loot odds, and others called for a boycott of the Pirate Shop mechanic. Reporters' inboxes and Epic's own channels caught the wave.",
            "Epic's response, posted from the Fortnite Status account, was the full table above — with the context that the rates had been the same since launch and that future windows might boost them further. Fan reaction to the transparency was largely positive, though as one player put it in Vice's coverage, 'it should not have taken a week.'",
          ],
          sourceIds: ["vice", "ign"],
        },
      ],
    },
    {
      slug: "how-to-get",
      title: "How to Get the Fortnite Pirate Token",
      shortTitle: "How to get: chests and Treasure Hours",
      description:
        "Where Pirate Token chests spawn on Crossbones Isle, how to use the Saturday Treasure Hours, and what to expect after you redeem one — realistically planned.",
      category: "How to get",
      status: "published",
      cover: {
        src: "/images/guides/fortnite-pirate-token-how-to-get.webp",
        alt: "Three Fortnite Treasure Hunters island scenes side by side: Arlong Park, the $.$. Rocky battleship and the Baratie restaurant on the water",
        credit: "Official Fortnite island news artwork © Epic Games",
        sourceUrl: "https://cdn-live.prm.ol.epicgames.com/prod/0b3abf5d00144b8fbcd4544c4dbe2c75.jpeg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["drop-rate"],
      sections: [
        {
          id: "chest-farming",
          title: "Step 1: open chests where they cluster",
          paragraphs: [
            "The token drops from treasure chests on Crossbones Isle, the Treasure Hunters battle royale island. The official announcement names One Piece landmarks such as Arlong Park and Windmill Village, and in-game news art shows chest-and-loot scenes around POIs like the $.$. Rocky battleship and the Baratie — built-up waterfront areas are the natural place to sweep for spawns.",
            "Efficiency comes from coverage, not speed alone: land at a dense area, open every chest you pass rather than cherry-picking, and keep moving in a loop that clears the POI before rotating. Squadmates widen the sweep; even though each opened chest rolls for the opener, more chests opened per hour is the only lever you control. We have not counted spawn locations ourselves, so treat any precise chest map you see elsewhere as unverified.",
          ],
          sourceIds: ["epic-news"],
        },
        {
          id: "use-treasure-hours",
          title: "Step 2: play the Saturday Treasure Hours",
          paragraphs: [
            "Treasure Hours multiply the odds for the rare tiers. The remaining windows on Vice's schedule are November 14, 21, 28 and December 5, each with a 2–4 PM ET (11 AM–1 PM PT) session and a 9–11 PM ET (6–8 PM PT) session; the token runs at 1.5× in both windows on those dates. November 7's evening window showed the token at 2×, so Epic has varied the multiplier before and says rates may rise further.",
            "Plan the session, not the whole Saturday: two hours of boosted chest opening beats all day at base odds. Your chest count per hour matters more than the exact window you pick, so choose whichever of the two sessions fits your routine and go where you can clear chests fast.",
          ],
          sourceIds: ["vice", "ign"],
        },
        {
          id: "track-weekly",
          title: "Step 3: follow the Treasure Tab and weekly tiers",
          paragraphs: [
            "The in-game Treasure Tab tracks the weekly hunt, and the reward table has weekly tiers — the Weekly Gold Outfit, Vehicle and Decal, Pickaxe or Back Bling, Jam Track and Loading Screen all rotate. That matters for planning: a tier you missed last week is a reason to keep opening chests this week, and the tab is also where Epic advertises the current week's boosts.",
            "Epic's announcement also lists other free-track days around the hunt — Captain's Days (November 8, 12, 15 and 22) and Mastery Mondays with boosted drops and captain's weapons — so a non-Treasure-Hour session can still pay you something while you wait for Saturday.",
          ],
          sourceIds: ["epic-news"],
        },
        {
          id: "redeem",
          title: "Step 4: what happens when a token drops",
          paragraphs: [
            "When the roll finally hits, you redeem the token to unlock the Pirate Shop. IGN describes the result as access to the Pirate Shop with nearly every item there free for 14 days; Vice, quoting Epic's framing, says it lets you claim every cosmetic in the Fortnite Item Shop for free for 14 days straight. The two phrasings differ slightly on scope — 'nearly every item' versus 'every cosmetic' — so check the shop's own labels during your window rather than assuming either extreme.",
            "What the coverage we checked does not spell out is what happens to items claimed during the window after it ends, or whether the access stacks across multiple tokens. If those details matter to you, they belong on Epic's own Pirate Shop pages, not in a guide's guess.",
          ],
          sourceIds: ["vice", "ign"],
        },
        {
          id: "expectations",
          title: "Keep the expectation honest",
          paragraphs: [
            "The published math is blunt: 1 in 137,500 per chest at base, about 1 in 91,667 in a 1.5× Treasure Hour and 1 in 68,750 in a 2× window. Even a strong season of farming is a stack of lottery tickets, not a checklist. Play the hunt for the loot you will actually get — Gizmos, Jam Tracks, loading screens and the weekly tiers — and let the token be the surprise it is designed to be.",
            "And a caution that goes with any hot drop: Epic's odds are published now, but no guide can promise a token, and third-party 'token generator' or account-selling offers around a viral item are the usual scams. The token comes from chests you open in your own matches — nowhere else.",
          ],
          link: { label: "Review the full odds math", href: "/guides/fortnite-pirate-token/drop-rate" },
          sourceIds: ["vice", "ign"],
        },
      ],
    },
  ],
};
