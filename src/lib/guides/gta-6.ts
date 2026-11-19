import type { GuideTopic } from "./types";

const launchDate = "2026-11-19";
const originalPublication = "2026-11-08T13:00:00.000Z";
const launchUpdate = "2026-11-19T11:48:00.000Z";
const launchArticleDates = { publishedAt: launchUpdate, updatedAt: launchUpdate };
const standardPrice = "$79.99";
const ultimatePrice = "$99.99";
const launchMetascore = "99/100";

const guide = "/guides/gta-6";
const psStore = "https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-GTAVISTANDARD001";
const xboxStore = "https://www.xbox.com/en-US/games/store/grand-theft-auto-vi/9p3h4968grsm";
const rockstarStore = "https://store.rockstargames.com/game/buy-gta-vi";
const rockstarMedia = "https://www.rockstargames.com/VI";
const playstationSupport = "https://www.playstation.com/en-us/support/games/gta-vi-support/";
const consoleSharing = "https://www.playstation.com/en-us/support/account/ps5-console-sharing-offline-play/";
const xboxCloud = "https://news.xbox.com/en-us/2026/11/10/grand-theft-auto-6-comes-to-xbox-cloud-gaming-november-19/";
const xboxRemotePlay = "https://www.xbox.com/en-US/consoles/remote-play";
const metacritic = "https://www.metacritic.com/game/grand-theft-auto-vi/critic-reviews/";
const ignReview = "https://www.ign.com/articles/grand-theft-auto-vi-review";
const gameSpotReview = "https://www.gamespot.com/reviews/grand-theft-auto-6-review/";
const gameInformerReview = "https://gameinformer.com/review/grand-theft-auto-vi/outrageous-fortune";
const xboxReview = "https://www.windowscentral.com/gaming/xbox/grand-theft-auto-6-xbox-review";
const noisyPixelReview = "https://noisypixel.net/grand-theft-auto-vi-review/";
const officialGameplay = "https://www.rockstargames.com/VI/an-extended-look";
const twitch = "https://www.twitch.tv/directory/category/grand-theft-auto-vi";
const investorRelease = "https://ir.take2games.com/node/32676";

export const gta6: GuideTopic = {
  slug: "gta-6",
  name: "GTA 6",
  officialName: "Grand Theft Auto VI",
  title: "GTA 6 Release Date, Price and Platforms",
  description:
    "Grand Theft Auto VI is out on PS5 and Xbox Series X|S. Check unlock times, PC and Steam status, US prices and spoiler-free reviews.",
  status: "published",
  platforms: ["PlayStation 5", "Xbox Series X|S"],
  releaseDate: launchDate,
  releaseStatus: "released",
  publisher: "Rockstar Games",
  cover: {
    src: "/images/guides/gta-6-pre-order.webp",
    alt: "Grand Theft Auto VI key art with Jason, Lucia, a yellow supercar, a speedboat and Vice City scenes around the GTA VI logo",
    credit: "Official Grand Theft Auto VI key art © Rockstar Games",
    sourceUrl: "https://www.rockstargames.com/VI/_next/static/media/meta.0t8ty~nlmxq2s.jpg",
    width: 1600,
    height: 900,
  },
  trailer: {
    youtubeId: "VQRLujxTm3c",
    title: "Grand Theft Auto VI Trailer 2",
    publishedAt: "2025-05-06",
  },
  publishedAt: originalPublication,
  updatedAt: launchUpdate,
  verifiedAt: launchDate,
  quickAnswers: [
    { label: "Release date", answer: "Out since Nov 19", href: `${guide}/release-time` },
    { label: "US price", answer: `From ${standardPrice}`, href: `${guide}/pre-order` },
    { label: "PC and Steam", answer: "Unannounced", href: `${guide}/platforms` },
    { label: "Metacritic", answer: `${launchMetascore} at launch`, href: `${guide}/reviews` },
  ],
  sources: [
    { id: "rockstar", label: "Rockstar Games — Grand Theft Auto VI official site", url: rockstarMedia },
    { id: "editions", label: "Rockstar Support — Platforms, Editions, and Versions, updated November 18, 2026", url: "https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions" },
    { id: "timing", label: "Rockstar Support — Regional pre-load and release times", url: "https://support.rockstargames.com/articles/29jV3Cv2cCgvwM1XgtMO5o/grand-theft-auto-vi-regional-pre-load-and-release-times-on-playstation-5-and-xbox-series-x-or-s" },
    { id: "storage", label: "Rockstar Support — Grand Theft Auto VI installation requirements", url: "https://support.rockstargames.com/articles/M6h7B5fJZMwG1dnzQkt4Z/grand-theft-auto-vi-installation-requirements" },
    { id: "ps-store", label: "US PlayStation Store — prices, single-player listing and release timestamp", url: psStore },
    { id: "ps-game", label: "PlayStation — Grand Theft Auto VI platform, PS5 storage and GTA+ offer", url: "https://www.playstation.com/en-us/games/grand-theft-auto-vi/" },
    { id: "ps-support", label: "PlayStation Support — Installing and sharing GTA VI", url: playstationSupport },
    { id: "ps-sharing", label: "PlayStation Support — PS5 Console Sharing and Offline Play", url: consoleSharing },
    { id: "ps-region", label: "PlayStation Support — Account country and region", url: "https://www.playstation.com/en-us/support/account/check-account-country-region/" },
    { id: "xbox-store", label: "US Xbox Store — prices, launch platforms and release timestamp", url: xboxStore },
    { id: "xbox-cloud", label: "Xbox Wire — GTA VI cloud streaming for Xbox One and Series X|S", url: xboxCloud },
    { id: "xbox-remote", label: "Xbox — Remote Play", url: xboxRemotePlay },
    { id: "store", label: "Rockstar Store — GTA VI edition comparison and boxed copy", url: rockstarStore },
    { id: "esrb", label: "ESRB — Grand Theft Auto VI age rating", url: "https://www.esrb.org/ratings/41627/grand-theft-auto-vi/" },
    { id: "metacritic", label: "Metacritic — PS5 and Xbox Series X critic scores, checked November 19, 2026", url: metacritic },
    { id: "ocarina-score", label: "Metacritic — The Legend of Zelda: Ocarina of Time", url: "https://www.metacritic.com/game/the-legend-of-zelda-ocarina-of-time/" },
    { id: "ign", label: "IGN — Luke Reilly’s GTA 6 review", url: ignReview },
    { id: "gamespot", label: "GameSpot — Tamoor Hussain’s GTA 6 review", url: gameSpotReview },
    { id: "review-snapshot", label: "EndgameTools — Launch record of IGN, GameSpot and other review scores", url: "https://endgametools.com/en/gta-6/news/gta-6-reviews" },
    { id: "game-informer", label: "Game Informer — Matt Miller’s GTA VI PS5 review", url: gameInformerReview },
    { id: "xbox-review", label: "Windows Central — Jez Corden’s GTA VI Xbox Series X review", url: xboxReview },
    { id: "noisy-pixel", label: "Noisy Pixel — Orpheus Joshua’s GTA VI review", url: noisyPixelReview },
    { id: "techradar", label: "TechRadar — Rob Dwiar’s GTA VI PS5 Pro review", url: "https://www.techradar.com/gaming/gta-6-review" },
    { id: "cast", label: "The Game Awards — Best Performance nominees", url: "https://thegameawards.com/categories/best-performance" },
    { id: "cast-role", label: "GamesRadar+ — Manni L. Perez confirmed as Lucia", url: "https://www.gamesradar.com/games/grand-theft-auto/gta-6-lucia-actor-revealed-thanks-to-the-game-awards-best-performance-nomination-and-yes-its-exactly-who-everyone-expected/" },
    { id: "leonida", label: "Rockstar Games — Only in Leonida character and location profiles", url: "https://www.rockstargames.com/VI/only-in-leonida" },
    { id: "gameplay", label: "Rockstar Games — Grand Theft Auto VI: An Extended Look", url: officialGameplay },
    { id: "trailer", label: "Rockstar Games — Grand Theft Auto VI Trailer 2", url: "https://www.youtube.com/watch?v=VQRLujxTm3c" },
    { id: "gerstmann", label: "Jeff Gerstmann — GTA VI review and playtime", url: "https://jeff.zone/posts/review-grand-vi-175664808" },
    { id: "powerpyx", label: "PowerPyx — GTA 6 story completion time", url: "https://www.powerpyx.com/gta-6-game-length-how-long-is-the-story/" },
    { id: "kotaku", label: "Kotaku — GTA VI main story length reported by its reviewer", url: "https://kotaku.com/how-long-is-gta-6-2000758029" },
    { id: "twitch", label: "Twitch — Grand Theft Auto VI live category", url: twitch },
    { id: "take-two", label: "Take-Two — Fiscal Q2 2027 results, November 9, 2026", url: investorRelease },
    { id: "take-two-release", label: "Take-Two — Rockstar launch date, pricing and single-player announcement", url: "https://ir.take2games.com/node/32311" },
  ],
  sections: [
    {
      id: "release-date",
      title: "Is GTA 6 out now?",
      releaseFacts: true,
      paragraphs: [
        "Yes. GTA 6 came out on November 19, 2026, on PS5 and Xbox Series X|S. Rockstar scheduled digital access around midnight by store region. In the continental US, the PlayStation and Xbox listings pointed to midnight Eastern, the same moment as 11 p.m. Central and 9 p.m. in California on November 18.",
      ],
      link: { label: "Check regional unlock times and download space", href: `${guide}/release-time` },
      sourceIds: ["rockstar", "timing", "ps-store", "xbox-store"],
    },
    {
      id: "platforms",
      title: "Can I play GTA 6 on PC, PS4 or Xbox One?",
      paragraphs: [
        "Rockstar has yet to announce a native PC version, a PC release date or a Steam listing. The PlayStation version requires a PS5. Xbox One owners can stream the game through Xbox Cloud Gaming on eligible consoles and in supported markets after buying the Xbox copy.",
      ],
      link: { label: "Check Xbox One cloud play, Remote Play and sharing", href: `${guide}/platforms` },
      sourceIds: ["rockstar", "take-two", "ps-game", "xbox-cloud"],
    },
    {
      id: "editions",
      title: "How much is GTA 6 on PS5 and Xbox?",
      paragraphs: [
        `In the US, the Standard Edition is ${standardPrice} and the Ultimate Edition is ${ultimatePrice} on both platform stores. Standard includes the full story. Ultimate adds vehicles, weapons, outfits and other extras.`,
      ],
      link: { label: "Compare editions and open the official stores", href: `${guide}/pre-order` },
      sourceIds: ["ps-store", "xbox-store", "editions"],
    },
    {
      id: "code-in-box",
      title: "Does the physical edition have a disc?",
      paragraphs: [
        "The boxed Standard Edition is code-in-box. Redeem its single-use code on the matching platform account to download the game. Check the code's region before buying or gifting a box.",
      ],
      sourceIds: ["editions", "ps-support"],
    },
    {
      id: "reviews",
      title: "What is GTA 6's Metacritic score?",
      paragraphs: [
        `Metacritic listed GTA 6 at ${launchMetascore} for PS5 and Xbox Series X when checked on November 19. Reviewers singled out the detail of Vice City and the partnership between the two leads. The critic scores are a launch snapshot and can change as reviews are added.`,
      ],
      link: { label: "Read the spoiler-free review roundup and age rating", href: `${guide}/reviews` },
      sourceIds: ["metacritic", "game-informer", "xbox-review"],
    },
    {
      id: "trailer-section",
      title: "GTA 6 gameplay, story and characters",
      paragraphs: [
        "Grand Theft Auto VI follows Lucia Caminos and Jason Duval after a robbery draws them into a conspiracy across Leonida. Vice City is the main urban setting, with highways leading to the Keys, wetlands and towns elsewhere in the state.",
      ],
      link: { label: "Meet Lucia and Jason and see how long the story takes", href: `${guide}/story` },
      trailer: true,
      sourceIds: ["rockstar", "leonida", "trailer"],
    },
    {
      id: "online",
      title: "When does GTA 6 Online come out?",
      paragraphs: [
        "The November 19 release is the single-player campaign. As of launch day, Rockstar has yet to announce a release date for a GTA VI multiplayer mode. The GTA Online currently promoted with GTA+ is the existing game associated with Grand Theft Auto V.",
      ],
      sourceIds: ["ps-store", "xbox-store", "rockstar", "take-two-release"],
    },
    {
      id: "sales",
      title: "GTA 6 sales, player counts and Take-Two",
      paragraphs: [
        "As of November 19, Take-Two and Rockstar had yet to publish GTA VI launch sales, title-specific revenue, a development budget or a worldwide concurrent-player count. Twitch tracks people watching streams. Use the publisher's earnings releases for reported figures on copies sold or revenue.",
        "Rockstar Games is a publishing label of Take-Two Interactive. The publicly listed company trades on Nasdaq as TTWO.",
      ],
      link: { label: "Read Take-Two's November 9 earnings release", href: investorRelease },
      sourceIds: ["take-two", "take-two-release", "twitch"],
    },
  ],
  articles: [
    {
      slug: "release-time",
      title: "GTA 6 Release Time by Region and Download Size",
      shortTitle: "Release time and download",
      description: "When GTA 6 unlocked in New Zealand and the US, when Xbox Cloud Gaming opened, and how much storage and download time to plan for.",
      category: "Launch guide",
      status: "published",
      cover: {
        src: "/images/guides/gta-6-release-time.webp",
        alt: "Police lights flash by a Vice City canal at dusk",
        credit: "Official Grand Theft Auto VI screenshot © Rockstar Games",
        sourceUrl: "https://www.rockstargames.com/VI/_next/static/media/Vice_City_17.0er79m2u3nygs.jpg",
        width: 1600,
        height: 900,
      },
      ...launchArticleDates,
      relatedSlugs: ["platforms", "pre-order"],
      sections: [
        {
          id: "release-date",
          title: "When did GTA 6 become playable?",
          releaseFacts: true,
          paragraphs: [
            "Rockstar's regional schedule put the digital console launch at midnight on November 19. Unlock times follow the store region. The US storefronts used a single timestamp of 05:00 UTC, even in US time zones where the calendar still read November 18.",
          ],
          sourceIds: ["timing", "ps-store", "xbox-store"],
        },
        {
          id: "unlock-times",
          title: "New Zealand, Central time and California",
          paragraphs: [
            "The first four rows are for the installed console game. Microsoft gave Xbox Cloud Gaming a separate start of 1 a.m. Eastern on November 19.",
          ],
          table: {
            headers: ["Region", "Local unlock", "Same time in UTC"],
            rows: [
              ["New Zealand (NZDT, UTC+13)", "12 a.m., Nov 19", "11:00, Nov 18"],
              ["US Eastern (EST)", "12 a.m., Nov 19", "05:00, Nov 19"],
              ["US Central (CST)", "11 p.m., Nov 18", "05:00, Nov 19"],
              ["California (PST)", "9 p.m., Nov 18", "05:00, Nov 19"],
              ["Xbox Cloud Gaming (US Eastern)", "1 a.m., Nov 19", "06:00, Nov 19"],
            ],
          },
          sourceIds: ["timing", "ps-store", "xbox-store", "xbox-cloud"],
        },
        {
          id: "early-access",
          title: "Why were people playing GTA 6 early?",
          paragraphs: [
            "New Zealand reached its normal release time 18 hours before the US console stores. Reviewers also had copies ahead of retail. Both retail editions followed the same launch schedule. The November 10 preload let digital buyers download their files ahead of the unlock.",
            "The 'New Zealand trick' refers to attempts to use an earlier store region. PlayStation account countries are fixed after account creation. For Xbox and PlayStation, use the store region where you own the game and its official unlock time.",
          ],
          sourceIds: ["timing", "editions", "ps-region", "game-informer"],
        },
        {
          id: "download",
          title: "How long does GTA 6 take to download?",
          paragraphs: [
            "Rockstar says to allow up to 212 GB of free space, depending on the console. PlayStation recommends clearing 212 GB on PS5. Free space is the room the installer needs. Use the transfer size shown in your console's queue to estimate download time.",
            "The times below assume a 200 GB transfer at a steady speed. Installation, updates and slower speeds can add time.",
          ],
          table: {
            headers: ["Download speed", "Time for 200 GB"],
            rows: [
              ["50 Mbps", "About 8 hr 53 min"],
              ["100 Mbps", "About 4 hr 27 min"],
              ["300 Mbps", "About 1 hr 29 min"],
              ["500 Mbps", "About 53 min"],
            ],
          },
          sourceIds: ["storage", "ps-game"],
        },
        {
          id: "install",
          title: "Where to install your copy",
          paragraphs: [
            "On PS5, sign into the account that bought or redeemed the game, open Game Library, choose Your Collection and select the PS5 download. On Xbox Series X or Series S, sign in with the owning account and open My games & apps or the game's Microsoft Store page to install it.",
            "If the game looks locked after release, check that you have the right account and that the download and latest update have finished. Xbox One players can use the cloud option where eligible.",
          ],
          link: { label: "Check platform compatibility and cloud options", href: `${guide}/platforms` },
          sourceIds: ["ps-support", "xbox-store", "xbox-cloud"],
        },
      ],
    },
    {
      slug: "pre-order",
      title: "GTA 6 Price, Editions and Where to Buy",
      shortTitle: "Price, editions and where to buy",
      description: "GTA 6 US prices for PS5 and Xbox, what the Ultimate Edition adds, and how the boxed code and Vintage Vice City Pack work.",
      category: "Buying guide",
      status: "published",
      cover: {
        src: "/images/guides/gta-6-pre-order-guide.webp",
        alt: "A pink and orange GTA VI logo against a dark, rain-speckled background",
        credit: "Official Grand Theft Auto VI original score artwork © Rockstar Games",
        sourceUrl: "https://www.rockstargames.com/VI/_next/static/media/39ak8a12395591.0ybs2pkm~3732.jpg",
        width: 1600,
        height: 900,
      },
      publishedAt: originalPublication,
      updatedAt: launchUpdate,
      relatedSlugs: ["platforms", "reviews"],
      sections: [
        {
          id: "editions-table",
          title: "GTA 6 prices on PS5 and Xbox",
          paragraphs: [
            "These are the US console store prices at launch. Check your own store's price and currency before checkout. You can buy the Ultimate upgrade later for a Standard copy on PlayStation Store or the Microsoft Store.",
          ],
          table: {
            headers: ["Edition", "US price", "What you get"],
            rows: [
              ["Standard Edition", standardPrice, "The full single-player game. Available digitally or as a boxed download code."],
              ["Ultimate Edition", ultimatePrice, "The full game and a digital bundle of vehicles, weapons, outfits and properties."],
            ],
          },
          sourceIds: ["ps-store", "xbox-store", "editions"],
        },
        {
          id: "where-to-preorder",
          title: "Buy GTA 6 on PS5",
          paragraphs: [
            "Open PlayStation Store and choose Standard or Ultimate for PS5. A standard PS5, PS5 Slim or PS5 Pro can play the same purchase.",
          ],
          link: { label: "Open PlayStation Store", href: psStore },
          sourceIds: ["ps-store", "ps-game"],
        },
        {
          id: "xbox-store",
          title: "Buy GTA 6 on Xbox",
          paragraphs: [
            "The Microsoft Store versions install on Xbox Series X and Series S. If you own an Xbox One, check cloud eligibility before paying for the game.",
          ],
          link: { label: "Open the Xbox Store", href: xboxStore },
          sourceIds: ["xbox-store", "xbox-cloud"],
        },
        {
          id: "ultimate-edition",
          title: "What does the Ultimate Edition add?",
          paragraphs: [
            "Examples include the '95 Grotti Cheetah, the '67 Vapid Dominator Buggy, the Hawk and Little Morgan revolvers, the Rideout Customs Mod Shop and Vice City outfits. Rockstar says the extras become available across the story's chapters. Pick Standard if you only want the campaign.",
          ],
          sourceIds: ["editions", "store"],
        },
        {
          id: "preorder-bonus",
          title: "Vintage Vice City Pack and GTA+",
          paragraphs: [
            "Rockstar listed the Vintage Vice City Pack for eligible purchases before November 20, 2026. It includes a '55 Vapid Stanier Sedan and garage, outfits and hairstyles, and a weapon pattern. Check your store's listing for the bonus and its cutoff.",
            "Eligible digital purchases also advertised a month of GTA+. The platform store sets the claim window and renewal terms. GTA+ is a subscription offer and the Ultimate Edition upgrade is a separate add-on.",
          ],
          sourceIds: ["editions", "ps-game", "ps-store", "xbox-store"],
        },
        {
          id: "code-in-box-detail",
          title: "How the boxed download code works",
          paragraphs: [
            "The physical Standard edition contains a single-use download code. A disc will not be included. Redeem the code on the correct PlayStation or Xbox account and region, then download the game. When buying a second-hand box, check that the code is still unused.",
          ],
          link: { label: "View the boxed edition at Rockstar Store", href: rockstarStore },
          sourceIds: ["editions", "store", "ps-support"],
        },
        {
          id: "preload-and-launch",
          title: "Storage space for a new purchase",
          paragraphs: [
            "A new purchase can be downloaded now. Set aside up to 212 GB of free space for the installation and check your console's queue for its actual transfer size.",
          ],
          link: { label: "Estimate your download time", href: `${guide}/release-time#download` },
          sourceIds: ["storage", "ps-game"],
        },
      ],
    },
    {
      slug: "platforms",
      title: "GTA 6 PC Release Date, Steam and Console Support",
      shortTitle: "PC, Steam and console compatibility",
      description: "Is GTA 6 on PC or Steam? Check the confirmed platforms, how Xbox One cloud streaming works, and what PS5 game sharing covers.",
      category: "Platform guide",
      status: "published",
      cover: {
        src: "/images/guides/gta-6-platforms.webp",
        alt: "A person leans on a pink car beside a palm-lined Vice City waterfront",
        credit: "Official Grand Theft Auto VI screenshot © Rockstar Games",
        sourceUrl: "https://www.rockstargames.com/VI/_next/static/media/Vice_City_24.0r9tor5-x.p75.jpg",
        width: 1600,
        height: 900,
      },
      ...launchArticleDates,
      relatedSlugs: ["release-time", "pre-order"],
      sections: [
        {
          id: "pc-release",
          title: "When is GTA 6 coming to PC and Steam?",
          paragraphs: [
            "The GTA 6 PC release date is still unannounced. Rockstar's launch lineup is PS5 and Xbox Series X|S, and the publisher has yet to confirm a Steam release or PC system requirements. Use Rockstar's game page to check for a PC announcement before buying a key.",
          ],
          link: { label: "Check Rockstar's GTA VI page", href: rockstarMedia },
          sourceIds: ["rockstar", "take-two", "editions"],
        },
        {
          id: "console-support",
          title: "Which consoles can play GTA 6?",
          table: {
            headers: ["Console", "Launch access"],
            rows: [
              ["PlayStation 5, Slim and Pro", "Install the PS5 edition."],
              ["PlayStation 4", "Unavailable on PS4."],
              ["Xbox Series X and Series S", "Install the Xbox Series X|S edition. Eligible consoles can also stream it."],
              ["Xbox One", "Xbox Cloud Gaming only, subject to availability and account eligibility."],
            ],
          },
          sourceIds: ["ps-game", "ps-store", "xbox-store", "xbox-cloud"],
        },
        {
          id: "xbox-one",
          title: "How to play GTA 6 on Xbox One",
          paragraphs: [
            "Xbox One can stream the Xbox edition through Xbox Cloud Gaming. Buy the game on the Microsoft account you use on your console, then open the Cloud Gaming library or the game's store page and choose cloud play when the option appears.",
            "Microsoft announced GTA VI cloud play for eligible Xbox One and Xbox Series X|S consoles in supported markets. You need a separate game purchase and cloud access. In supported markets, Microsoft also offers paid cloud playtime without a Game Pass subscription.",
          ],
          link: { label: "See Xbox's GTA 6 cloud launch and eligibility notes", href: xboxCloud },
          sourceIds: ["xbox-cloud"],
        },
        {
          id: "remote-play",
          title: "Can I use Xbox Remote Play on PC?",
          paragraphs: [
            "Xbox Remote Play streams games installed on your own Xbox to supported devices, including a PC. To use a local GTA 6 installation this way, you need an Xbox Series X or Series S with the game installed and Remote Play set up. The PC receives the console stream.",
          ],
          link: { label: "Set up Xbox Remote Play", href: xboxRemotePlay },
          sourceIds: ["xbox-remote", "xbox-store"],
        },
        {
          id: "game-sharing",
          title: "Can you game share GTA 6 on PS5?",
          paragraphs: [
            "Yes. Sony's GTA VI support page says other accounts on a PS5 can play the game through Console Sharing and Offline Play. From the purchasing account, open Settings, then Users and Accounts, Other, and Console Sharing and Offline Play. Choose Enable and download the game on that console.",
            "Sony allows one PS5 with that setting enabled per account at a time.",
          ],
          link: { label: "Open PlayStation's sharing settings guide", href: consoleSharing },
          sourceIds: ["ps-support", "ps-sharing"],
        },
      ],
    },
    {
      slug: "reviews",
      title: "GTA 6 Reviews, Metacritic Scores and Age Rating",
      shortTitle: "Metacritic and reviews",
      description: "GTA 6's launch Metascores on PS5 and Xbox Series X, what critics praise, where opinions differ, and what the ESRB rating means.",
      category: "Review roundup",
      status: "published",
      cover: {
        src: "/images/guides/gta-6-reviews.webp",
        alt: "Boats in a marina with the Vice City skyline behind them",
        credit: "Official Grand Theft Auto VI screenshot © Rockstar Games",
        sourceUrl: "https://www.rockstargames.com/VI/_next/static/media/Vice_City_15.11tb0mz68edqo.jpg",
        width: 1600,
        height: 900,
      },
      ...launchArticleDates,
      relatedSlugs: ["story", "pre-order"],
      sections: [
        {
          id: "metacritic",
          title: "GTA 6 Metacritic score at launch",
          paragraphs: [
            "Reviews started appearing on November 18. These are Metacritic's platform-specific critic scores as checked on November 19, 2026. The two platforms had different numbers of reviews. User ratings are shown separately, and both types of score can change over time.",
            "The displayed PS5 score matched the 99 for the original Nintendo 64 release of The Legend of Zelda: Ocarina of Time at the time of the check.",
          ],
          table: {
            headers: ["Platform", "Critic Metascore", "Critic reviews listed"],
            rows: [
              ["PlayStation 5", launchMetascore, "156"],
              ["Xbox Series X", launchMetascore, "14"],
            ],
          },
          link: { label: "Open the current Metacritic scores", href: metacritic },
          sourceIds: ["metacritic", "ocarina-score", "review-snapshot"],
        },
        {
          id: "critics",
          title: "Is GTA 6 good? What critics liked",
          paragraphs: [
            "Game Informer scored the PS5 version 10/10. Matt Miller highlighted the way ordinary activities, chance encounters and the soundtrack make Leonida feel coherent. Windows Central's Xbox Series X review also praised how often a detour turned up something unexpected, alongside the changing tone of Jason and Lucia's story.",
          ],
          link: { label: "Read Game Informer's PS5 review", href: gameInformerReview },
          sourceIds: ["game-informer", "xbox-review"],
        },
        {
          id: "ign",
          title: "GTA 6 at IGN and GameSpot",
          paragraphs: [
            "EndgameTools' launch roundup recorded 10/10 for both IGN's Luke Reilly and GameSpot's Tamoor Hussain. IGN also published a video review of the PS5 version.",
          ],
          link: { label: "Watch IGN's GTA 6 video review", href: "https://www.youtube.com/watch?v=agBEh5aZ_Go" },
          sourceIds: ["ign", "gamespot", "review-snapshot"],
        },
        {
          id: "trade-offs",
          title: "Pacing and frame rate",
          paragraphs: [
            "Noisy Pixel praised the two leads while finding parts of the campaign slow and some supporting characters thinly drawn. TechRadar's PS5 Pro reviewer describes playing at 30 frames per second. Both observations are worth checking if you prefer a shorter campaign or are sensitive to frame rate.",
          ],
          sourceIds: ["noisy-pixel", "techradar"],
        },
        {
          id: "rating",
          title: "What is GTA 6 rated?",
          paragraphs: [
            "The ESRB rates GTA 6 M for Mature 17+ in North America. Its descriptors include intense violence, strong language, sexual content, and drug and alcohol use. The page also lists in-game purchases. This is the age rating shown on the US stores.",
          ],
          link: { label: "Read the ESRB rating summary", href: "https://www.esrb.org/ratings/41627/grand-theft-auto-vi/" },
          sourceIds: ["esrb", "ps-store", "xbox-store"],
        },
      ],
    },
    {
      slug: "story",
      title: "GTA 6 Story, Characters and Gameplay",
      shortTitle: "Story, cast and gameplay",
      description: "A spoiler-free guide to Lucia, Jason and modern Vice City, with GTA 6 story-length estimates and where to watch gameplay.",
      category: "Story guide",
      status: "published",
      cover: {
        src: "/images/guides/gta-6-story.webp",
        alt: "Jason and Lucia on a neon-lit dance floor in Vice City",
        credit: "Official Grand Theft Auto VI screenshot © Rockstar Games",
        sourceUrl: "https://www.rockstargames.com/VI/_next/static/media/Jason_and_Lucia_14.10e7v.06pcm_t.jpg",
        width: 1600,
        height: 900,
        position: "50% 34%",
      },
      ...launchArticleDates,
      relatedSlugs: ["reviews", "release-time"],
      sections: [
        {
          id: "story",
          title: "What is the GTA 6 story about?",
          paragraphs: [
            "A robbery goes wrong and leaves Jason Duval and Lucia Caminos caught in a criminal conspiracy that reaches across Leonida. Lucia is out of prison and looking for a better life. Jason has a military background and connections in the Leonida Keys. The story follows what happens when their plans depend on each other.",
            "You can start with GTA VI. It introduces its own leads and a modern version of Vice City, the city used in the 2002 game. GTA V follows a separate group in Los Santos.",
          ],
          sourceIds: ["rockstar", "leonida", "game-informer"],
        },
        {
          id: "cast",
          title: "Who plays Lucia and Jason?",
          paragraphs: [
            "GamesRadar+ identifies Manni L. Perez as Lucia Caminos. The Game Awards lists Perez as a Best Performance nominee for GTA VI. As of November 19, the public Rockstar character materials describe Jason Duval without identifying his performer.",
          ],
          sourceIds: ["cast", "cast-role", "leonida"],
        },
        {
          id: "story-length",
          title: "How long is the GTA 6 story?",
          paragraphs: [
            "Jeff Gerstmann reported about 45 hours on his in-game timer. PowerPyx took 70 hours with optional quests and cutscenes, and Kotaku's reviewer reached the credits at about 90 hours after substantial exploration. How often you explore between missions makes a big difference to your time.",
          ],
          sourceIds: ["gerstmann", "powerpyx", "kotaku"],
        },
        {
          id: "gameplay",
          title: "Where to watch GTA 6 gameplay",
          paragraphs: [
            "Rockstar's An Extended Look runs about 27 minutes using footage captured on PS5. It shows how the two leads move through missions and the open world, with a look at Leonida away from Vice City's skyline.",
          ],
          link: { label: "Watch Rockstar's extended gameplay video", href: officialGameplay },
          sourceIds: ["gameplay", "ps-game"],
        },
        {
          id: "twitch",
          title: "Watch GTA 6 live on Twitch",
          paragraphs: [
            "Open Twitch's Grand Theft Auto VI category for live streams. If you're avoiding story spoilers, look for streams marked free roam or first impressions and check the stream title before opening it.",
          ],
          link: { label: "Browse GTA 6 live streams", href: twitch },
          sourceIds: ["twitch"],
        },
      ],
    },
  ],
};
