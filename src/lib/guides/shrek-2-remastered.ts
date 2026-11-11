import type { GuideTopic } from "./types";

const publicationDate = "2026-11-11T09:00:00.000Z";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };

const steamStore = "https://store.steampowered.com/app/2523740/DreamWorks_Shrek_2_Remastered";
const steamApi = "https://store.steampowered.com/api/appdetails?appids=2523740&l=english";
const psStore = "https://store.playstation.com/en-us/product/EP1875-PPSA31341_00-SHREK2REMASTERED";
const eshop = "https://www.nintendo.com/us/store/products/shrek-2-remastered-switch/";
const xboxNews = "https://www.xboxachievements.com/news/shrek-2-remastered-2004-adventure-coming-to-xbox-november";
const gematsu = "https://www.gematsu.com/2026/10/shrek-2-remastered-microsoft-store-page-appears";
const polygon = "https://www.polygon.com/shrek-2-remastered-release-date-trailer-online-co-op";
const bleedingCool = "https://bleedingcool.com/games/shrek-2-remastered-video-game-officially-arrives-on-november-10";
const wikipedia = "https://en.wikipedia.org/wiki/Shrek_2_(video_game)";

export const shrek2Remastered: GuideTopic = {
  slug: "shrek-2-remastered",
  name: "Shrek 2 Remastered",
  officialName: "DreamWorks Shrek 2 Remastered",
  title: "Shrek 2 Remastered Guide: Co-Op, Cheats, Price",
  description:
    "DreamWorks Shrek 2 Remastered is out November 10, 2026 with 4-player co-op, Cheat Mode, Photo Mode and 4K visuals: price, platforms and what changed from 2004.",
  status: "published",
  platforms: ["PC (Steam)", "PlayStation 5", "Xbox Series X|S", "Nintendo Switch", "Nintendo Switch 2"],
  releaseDate: "2026-11-10",
  releaseStatus: "released",
  publisher: "Aspyr Media",
  cover: {
    src: "/images/guides/shrek-2-remastered.webp",
    alt: "Far Far Away from DreamWorks Shrek 2 Remastered: the fairytale kingdom's castle on a wooded hill above the swamp river",
    credit: "Official DreamWorks Shrek 2 Remastered key art © 2026 Aspyr Media / DreamWorks",
    sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2523740/4e349ac74d4b443654bccfebf6b1e2665ccf559f/page_bg_raw.jpg",
    width: 1600,
    height: 900,
  },
  ...dates,
  verifiedAt: "2026-11-11",
  sources: [
    { id: "steam", label: "Steam — DreamWorks Shrek 2 Remastered store page (price, features, system requirements, category flags; checked November 11, 2026)", url: steamStore },
    { id: "steam-api", label: "Steam appdetails API — released state, $29.99 with a 10% discount ending November 17, 45 achievements and official screenshots (checked November 11, 2026)", url: steamApi },
    { id: "psn", label: "PlayStation Store — Shrek 2 Remastered PS5 listing", url: psStore },
    { id: "eshop", label: "Nintendo eShop — Shrek 2 Remastered Switch listing (launch discount end date shown at check)", url: eshop },
    { id: "xbox-news", label: "XboxAchievements — Shrek 2 Remastered officially announced for November; online co-op described as a first for this game", url: xboxNews },
    { id: "gematsu", label: "Gematsu — Shrek 2 Remastered Microsoft Store page appeared ahead of the announcement (October 2026)", url: gematsu },
    { id: "polygon", label: "Polygon — Shrek 2 Remastered release-date and trailer coverage (November 10, 2026)", url: polygon },
    { id: "bleedingcool", label: "Bleeding Cool — Shrek 2 Remastered arrives November 10, 2026, preserving the original's mechanics, characters and music", url: bleedingCool },
    { id: "wikipedia", label: "Wikipedia — Shrek 2 (video game): the 2004 original by Luxoflux and Activision, its 11 levels, four-character teams and Hero Time", url: wikipedia },
  ],
  sections: [
    {
      id: "what-it-is",
      title: "The 2004 couch classic, rebuilt for modern platforms",
      paragraphs: [
        "DreamWorks Shrek 2 Remastered is Aspyr's update of the 2004 Shrek 2 game — the Luxoflux-developed, Activision-published action-adventure that let a four-hero team batter its way through Far Far Away. Aspyr works with Universal on the remaster, and the Steam description brings back 'Shrek, Fiona, Donkey and friends' for the smash, throw and kick route from Shrek's swamp to Fiona's castle.",
        "The original shipped in May 2004 on PS2, Xbox, GameCube and PC, sold more than four million units and scored in the low 70s with console reviewers. Press coverage of the remaster reports that Aspyr preserves the original's mechanics, characters and music while upgrading the presentation, and the official screenshots show the same switchable hero team — including Shrek and Donkey's human and horse forms from the film's finale, Puss in Boots, Gingerbread Man and Big Bad Wolf.",
      ],
      sourceIds: ["steam", "wikipedia", "bleedingcool"],
    },
    {
      id: "release-date",
      title: "Release date and platforms",
      releaseFacts: true,
      paragraphs: [
        "DreamWorks Shrek 2 Remastered released on November 10, 2026 for PC (Steam), PlayStation 5, Xbox Series X|S, Nintendo Switch and Nintendo Switch 2. Aspyr announced the date in October 2026 after the listing leaked through the Microsoft Store ahead of schedule; press coverage placed the announce trailer alongside GTA 6's marketing cycle, with Shrek beating Rockstar to shelves by nine days.",
      ],
      sourceIds: ["steam", "polygon", "gematsu"],
    },
    {
      id: "whats-new",
      title: "What the remaster changes",
      paragraphs: [
        "Aspyr's store copy lists the upgrades concretely: textures, UI and cutscenes rebuilt, 4K resolution, a new Photo Mode for staging snapshots, and a new Cheat Mode where you unlock cheats to smooth out a playthrough. The headline addition for a 2004 couch game is online play — up to 4-player co-op across couch, online, or a mix of both, which press coverage describes as the first online option for this game.",
      ],
      sourceIds: ["steam", "xbox-news"],
    },
    {
      id: "gameplay",
      title: "How it plays: swap heroes, smash everything",
      paragraphs: [
        "This is a level-based co-op action-adventure. You travel film-flavored levels with a team of four, swapping heroes at any time to fight enemies, beat bosses and solve environmental puzzles with each hero's unique ability — the original's examples include Donkey smashing obstacles and Fiona slowing down time. Levels mix travel fights with party mini-games and the original's 'Hero Time' solo segments, where one hero breaks off for a set piece built around their skills, like Shrek tossing thugs into a paddy wagon.",
        "The story follows the film's beats through a storybook-style setup before each level, and the store description promises hidden Easter Eggs across Far Far Away. PlayBloo has not played the remaster, so level-by-level details stay with the sources for now.",
      ],
      sourceIds: ["steam", "wikipedia"],
    },
    {
      id: "co-op-summary",
      title: "Co-op: four heroes, on the couch or online",
      paragraphs: [
        "The co-op setup matches the original's spirit: one to four players controlling the hero team together. You can play solo with instant hero swapping, share one screen with up to three friends, play online, or mix couch players with online friends in the same party. Steam's feature list also flags Remote Play Together and Family Sharing, and online multiplayer runs through an Epic Online Services account that can link to your Steam account.",
      ],
      link: { label: "Read the full co-op guide", href: "/guides/shrek-2-remastered/co-op" },
      sourceIds: ["steam"],
    },
    {
      id: "cheats-summary",
      title: "Cheat Mode: built in, details still thin",
      paragraphs: [
        "Cheat Mode is an official new feature — the Steam description says you 'unlock cheats in Cheat Mode' as you play. What Aspyr has not documented publicly, as of our November 11 check, is which cheats exist and what unlocks them. For the 2004 original, cheats were entered from the pause menu's Scrap Book screen. Our cheats article collects everything confirmed so far and keeps the legacy-code question clearly separated.",
      ],
      link: { label: "See what is confirmed about Cheat Mode", href: "/guides/shrek-2-remastered/cheats" },
      sourceIds: ["steam"],
    },
    {
      id: "buying",
      title: "Price, discount and early review status",
      paragraphs: [
        "It is a single standard edition priced at $29.99 US, with a 10% launch discount bringing Steam's price to $26.99 until November 17, 2026, per the store page and Steam's appdetails data at our check. Early Steam user reviews sat at 'Mixed' — 47% of 325 reviews on November 11, 2026 — so the buyer's guide also covers platform choices and the PC system requirements before you commit.",
      ],
      link: { label: "Read the buyer's guide", href: "/guides/shrek-2-remastered/where-to-buy" },
      sourceIds: ["steam", "steam-api"],
    },
    {
      id: "about-this-coverage",
      title: "About this coverage",
      paragraphs: [
        "PlayBloo does not sell Shrek 2 Remastered and has not played it. Every fact on this topic comes from the official Steam store page and appdetails API, store listings, and press coverage, all checked on November 11, 2026 — one day after launch. Shrek 2 Remastered is not a browser game, and no playable version is offered on this site.",
      ],
      sourceIds: ["steam", "steam-api"],
    },
  ],
  articles: [
    {
      slug: "co-op",
      title: "Shrek 2 Remastered Co-Op: How 4-Player Works",
      shortTitle: "Co-op: 4-player couch, online and mixed",
      description:
        "How Shrek 2 Remastered co-op works: up to 4 players couch, online or mixed, hero swapping any time, Remote Play Together and the Epic Online Services step.",
      category: "Co-op guide",
      status: "published",
      cover: {
        src: "/images/guides/shrek-2-remastered-co-op.webp",
        alt: "DreamWorks Shrek 2 Remastered battle scene with the four-hero switch HUD at the bottom: Human Shrek on Horse Donkey, Gingerbread Man, Puss in Boots and Big Bad Wolf fighting spiders",
        credit: "Official DreamWorks Shrek 2 Remastered screenshot © 2026 Aspyr Media / DreamWorks",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2523740/b731e4625e47d8c441aae2f98f50a2b378107744/ss_b731e4625e47d8c441aae2f98f50a2b378107744.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["cheats", "where-to-buy"],
      sections: [
        {
          id: "modes",
          title: "The three ways to play together",
          paragraphs: [
            "Aspyr's store page defines the multiplayer exactly: the game is playable solo, in up to 4-Player Couch Co-Op, in Online Multiplayer, and in Mixed Online Multiplayer and Couch Co-Op. In practice that means three shapes of a session: everyone shares one screen and one set of controllers; everyone plays from their own device over the internet; or couch players and online friends join the same four-hero party.",
            "The four-hero team is the whole point. The original 2004 game put a four-character squad under player control with instant swapping, and the remaster keeps that structure — official screenshots show the switch HUD with Puss in Boots, Gingerbread Man, Big Bad Wolf, and Shrek and Donkey's human and horse forms. Steam lists Full controller support and marks a gamepad as recommended.",
          ],
          image: {
            src: "/images/guides/shrek-2-remastered-co-op-team.webp",
            alt: "Gingerbread Man and Big Bad Wolf running through a castle town in DreamWorks Shrek 2 Remastered while a fairy flies overhead",
            width: 1600,
            height: 900,
            caption: "Official screenshot: two members of the hero team on the run — any controlled hero can swap at any time.",
          },
          sourceIds: ["steam", "wikipedia"],
        },
        {
          id: "hero-swap",
          title: "Swap heroes at any time",
          paragraphs: [
            "The swap system is the remaster's core combat and puzzle verb: 'swap your hero to battle enemies, conquer bosses, and solve environmental puzzles using their unique abilities,' per the Steam description. In the 2004 original each hero contributed something specific — Donkey could destroy obstacles, Fiona could slow down time — and levels were tuned around switching between them, including solo 'Hero Time' set pieces for one character.",
            "For a co-op group this maps naturally onto players: whoever controls the hero best suited to the current obstacle holds the spotlight, and swapping keeps everyone involved when the puzzle changes. PlayBloo has not played the remaster, so we describe the system from Aspyr's description and the original game's documented design rather than hands-on testing.",
          ],
          sourceIds: ["steam", "wikipedia"],
        },
        {
          id: "online-setup",
          title: "Playing online: the Epic Online Services step",
          paragraphs: [
            "One setup detail matters before you plan a cross-couch online night: Steam's page flags a third-party account requirement — the game 'uses Epic Online Services (EOS) for online multiplayer features' and supports linking to a Steam account, with a separate EOS EULA to accept. Steam itself lists Online Co-op, Shared/Split Screen Co-op and Shared/Split Screen among its feature flags.",
            "Also flagged on the store page: Remote Play Together, so a remote friend can join a couch-style session through Steam's own streaming, and Family Sharing for lending a library. Exact party invites, cross-play between platforms and lobby behavior are not documented in the sources we checked, so treat those as unknowns until Aspyr publishes them.",
          ],
          sourceIds: ["steam"],
        },
        {
          id: "whats-new-online",
          title: "Online is the new part",
          paragraphs: [
            "The 2004 Shrek 2 game was a same-room experience: four players, one console, one screen. Coverage of the remaster — XboxAchievements' announcement report among it — describes online co-op as a first for this game, layered on top of the original couch formula rather than replacing it. That makes the remaster the first way to play this specific adventure with far-away friends.",
            "If your group is nostalgic for the original's dynamics, the couch mode is the faithful one; if half your team is remote, the mixed mode is the one to set up. Either way the hero roster and swapping rules are the same.",
          ],
          sourceIds: ["xbox-news", "wikipedia"],
        },
        {
          id: "co-op-checklist",
          title: "Co-op checklist before game night",
          bullets: [
            "Decide the shape first: couch, online, or mixed — all three support up to four players total.",
            "Online play needs an Epic Online Services account; Steam accounts can link to it, and a third-party EULA applies.",
            "Have gamepads ready for couch play — Steam marks full controller support with a gamepad recommended.",
            "Remote Play Together and Family Sharing are flagged on Steam if your group plays across devices you already own.",
            "Solo players get the same hero-swapping tools, so nobody is locked out of content by missing co-op partners.",
          ],
          sourceIds: ["steam"],
        },
      ],
    },
    {
      slug: "cheats",
      title: "Shrek 2 Remastered Cheat Mode and Secrets",
      shortTitle: "Cheat Mode, secrets and achievements",
      description:
        "Cheat Mode is built into Shrek 2 Remastered: what Aspyr confirmed, what is not documented yet, the 2004 Scrap Book codes context and the new Photo Mode.",
      category: "Cheats and secrets",
      status: "published",
      cover: {
        src: "/images/guides/shrek-2-remastered-cheats.webp",
        alt: "A giant Gingerbread Man tower over a nighttime town in DreamWorks Shrek 2 Remastered while small heroes scatter below",
        credit: "Official DreamWorks Shrek 2 Remastered screenshot © 2026 Aspyr Media / DreamWorks",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2523740/611847cd2878d3ffb2efcffb9f896bfa84fcf595/ss_611847cd2878d3ffb2efcffb9f896bfa84fcf595.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["co-op", "where-to-buy"],
      sections: [
        {
          id: "cheat-mode",
          title: "Cheat Mode is real — and officially vague",
          paragraphs: [
            "Aspyr ships the remaster with a built-in cheat system. The Steam description's feature list says it plainly: 'Create timeless snapshots using the new Photo Mode and unlock cheats in Cheat Mode to make your playthrough a seamless experience.' Cheat Mode also appeared in the store listing that leaked before the announcement, so it has been part of the plan from the start.",
            "What no source we checked on November 11, 2026 documents is the part players actually search for: the cheat list, the unlock conditions and the menus. One day after launch, those specifics are simply not published yet — by Aspyr or by anyone else. We will not invent a code list; when Aspyr or the community documents the cheats, this page is the place they will be collected.",
          ],
          sourceIds: ["steam", "gematsu"],
        },
        {
          id: "original-codes",
          title: "The 2004 game's cheats: the Scrap Book era",
          paragraphs: [
            "For context: the original Shrek 2 game's cheats were entered from a 'Scrap Book' screen in the pause menu, per legacy cheat listings for the PS2, Xbox, GameCube and PC versions (IGN's and GameFAQs' Shrek 2 cheat pages among them). Those codes were simple button sequences that granted coins, health or bonus content on the 2004 build.",
            "Whether any of those legacy button codes still work in the remaster is unconfirmed — Cheat Mode may replace the Scrap Book system entirely, or it may gate remixed versions of the old cheats behind unlocks. Do not treat old sequences as verified for the remaster; nothing in the sources we checked says they carry over.",
          ],
          sourceIds: ["wikipedia"],
        },
        {
          id: "photo-mode",
          title: "Photo Mode: the other new toy",
          paragraphs: [
            "Photo Mode is the remaster's second headline feature, and Aspyr's own screenshot shows what it can do: free camera movement with Move, Rotate, Up and Down controls, a Take Photo button, camera and settings resets, a Hide UI toggle, and per-hero staging — each team member gets Visible, Pose and Expression slots, and there is an Enemies toggle for clean shots. Donkey taking a selfie with the whole team is apparently the intended use.",
            "Combined with the rebuilt cutscenes and 4K textures, Photo Mode is the reason nostalgia players are sharing screenshots already. It requires no unlock in any source we checked; it is listed as a standard new feature.",
          ],
          image: {
            src: "/images/guides/shrek-2-remastered-photo-mode.webp",
            alt: "Donkey takes a selfie with Puss in Boots, Gingerbread Man and Shrek while the Photo Mode interface shows camera, pose, expression and enemy toggles",
            width: 1600,
            height: 900,
            caption: "Official screenshot of Photo Mode: camera controls on the left, per-character Visible, Pose, Expression and Enemies toggles on the right.",
          },
          sourceIds: ["steam"],
        },
        {
          id: "secrets-achievements",
          title: "Easter Eggs and the 45-achievement trail",
          paragraphs: [
            "The store description promises 'iconic moments from the movie featuring beloved characters and hidden Easter Eggs' across the levels, so secret-hunting is designed-in rather than bolted on. Specific egg locations are not documented yet in sources we trust, and PlayBloo has not played the game to verify any ourselves.",
            "What is verifiable today is the achievement set: Steam's appdetails lists 45 achievements, with highlighted names including 'Once upon A Time.. Again', 'I am Puss... in Boots', 'Wrath of Gingy', 'Escaped the Mines', 'The Great Escape', 'Good Gourd' and 'Farm Hams' — a route map of the game's chapters, from the mines to Gingy's rampage. Treating those as your progress checklist is the closest thing to a verified secrets list on day one.",
          ],
          sourceIds: ["steam-api"],
        },
      ],
    },
    {
      slug: "where-to-buy",
      title: "Shrek 2 Remastered Price and Where to Buy",
      shortTitle: "Price, platforms and PC specs",
      description:
        "Where to buy Shrek 2 Remastered: $29.99 with a 10% launch discount until November 17, platform list, PC system requirements and early Steam review status.",
      category: "Buyer's guide",
      status: "published",
      cover: {
        src: "/images/guides/shrek-2-remastered-buy.webp",
        alt: "Shrek and Fiona in their ogre forms standing together in a sunny forest clearing in DreamWorks Shrek 2 Remastered",
        credit: "Official DreamWorks Shrek 2 Remastered screenshot © 2026 Aspyr Media / DreamWorks",
        sourceUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2523740/d0d409245641e953ca7f8759b7c98830f98115ab/ss_d0d409245641e953ca7f8759b7c98830f98115ab.1920x1080.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["co-op", "cheats"],
      sections: [
        {
          id: "price",
          title: "Price and the launch discount",
          paragraphs: [
            "DreamWorks Shrek 2 Remastered sells as one standard edition with no announced deluxe tier. The US price is $29.99, and Steam's store page and appdetails API both showed a 10% launch discount to $26.99 with the offer ending November 17, 2026, when we checked on November 11 — the game's own page says 'Offer ends 17 November'. Nintendo's eShop listing displayed a launch sale of its own; store discounts can differ by platform and region, so check the price in your own account before checkout.",
          ],
          sourceIds: ["steam", "steam-api", "eshop"],
        },
        {
          id: "where",
          title: "Where you can buy it",
          paragraphs: [
            "The release spans five platforms: PC, PlayStation 5, Xbox Series X|S, Nintendo Switch and Nintendo Switch 2. The versions we verified are the Steam page (app 2523740) and the PlayStation Store and Nintendo eShop listings; press coverage of the launch also names the Epic Games Store for PC and the Microsoft Store for Xbox. A physical release was reported around launch, but the sources we checked do not establish a verified retailer list, so treat boxed copies as a check-your-region case.",
            "PlayBloo does not sell the game, keys or accounts — order from the official stores or a retailer you trust, and read the platform's refund terms before buying. The game runs online multiplayer through an Epic Online Services account; the store flags that requirement plus a third-party EULA alongside the purchase.",
          ],
          table: {
            headers: ["Platform", "Store", "Notes at our November 11 check"],
            rows: [
              ["PC (Steam)", "Steam — app 2523740", "$29.99, 10% off to $26.99 until November 17; 45 achievements; Remote Play Together"],
              ["PC (Epic)", "Epic Games Store", "Named in launch coverage; price not independently checked"],
              ["PlayStation 5", "PlayStation Store", "Standard edition listing live at launch"],
              ["Xbox Series X|S", "Microsoft Store", "The store listing that leaked the game in October 2026"],
              ["Switch and Switch 2", "Nintendo eShop", "Launch sale shown with its own end date at check"],
            ],
          },
          sourceIds: ["steam", "psn", "eshop", "polygon", "gematsu"],
        },
        {
          id: "pc-requirements",
          title: "PC system requirements",
          paragraphs: [
            "Steam's listing makes the PC bar easy to clear: a 15 GB install and hardware around the GTX 1060 / RX 570 generation at minimum. One quirk to note — the listed OS is Windows 11 (64-bit) on both tiers, so Windows 10 machines are outside the stated spec. Online multiplayer also needs the Epic Online Services account covered in our co-op guide.",
          ],
          table: {
            headers: ["Spec", "Minimum", "Recommended"],
            rows: [
              ["OS", "Windows 11 (64-bit)", "Windows 11 (64-bit)"],
              ["CPU", "Intel i5-10400 / Ryzen 5 3600", "Intel i5-10400 / Ryzen 5 3600X"],
              ["Memory", "8 GB RAM", "16 GB RAM"],
              ["Graphics", "NVIDIA GTX 1060 / AMD RX 570", "NVIDIA GTX 1070 / AMD RX 5700"],
              ["DirectX / Network", "Version 12", "Version 12; broadband for online"],
              ["Storage", "15 GB available space", "15 GB available space"],
            ],
          },
          sourceIds: ["steam"],
        },
        {
          id: "reviews",
          title: "Early reviews: mixed on Steam, nostalgic elsewhere",
          paragraphs: [
            "Early Steam user reviews were 'Mixed' — 47% of 325 reviews when we checked on November 11, 2026, one day after launch. That is a live figure that will move; read the current score on the store page rather than trusting this snapshot. For context, the 2004 original landed around 70-72 on Metacritic across the console versions, so critical expectations for the underlying game were always 'fun couch romp', not 'flawless'.",
            "The practical read for a buyer: the nostalgia factor is real and the co-op upgrades are the headline, but day-one Steam sentiment was split. If you grew up on the original, the $26.99 launch price is the discount window; if you are unsure, the discount runs to November 17 and nothing here is a limited pre-order bonus.",
          ],
          sourceIds: ["steam-api", "steam", "wikipedia"],
        },
        {
          id: "buy-checklist",
          title: "Before you buy: a short checklist",
          bullets: [
            "Confirm your platform: PC (Steam or Epic), PS5, Xbox Series X|S, Switch or Switch 2 — there is no PS4 or Xbox One version listed in our sources.",
            "The 10% launch discount ends November 17 on Steam; eShop's sale showed its own end date, so check your store.",
            "Plan for online play: an Epic Online Services account (linkable to Steam) is required for online multiplayer features.",
            "Leave 15 GB free on PC, and note the stated OS is Windows 11 (64-bit) on both spec tiers.",
            "Languages include full English audio and subtitle support in 11 more languages, among them Simplified Chinese, Japanese, French, German, Spanish, Polish, Brazilian Portuguese, Russian, Italian, Dutch and Swedish.",
            "Expect a single standard edition — no deluxe tier, season pass or pre-order bonus appears in the sources we checked.",
          ],
          image: {
            src: "/images/guides/shrek-2-remastered-swamp.webp",
            alt: "The hero team walks a dirt path through Shrek's swamp past a pumpkin patch in DreamWorks Shrek 2 Remastered",
            width: 1600,
            height: 900,
            caption: "Official screenshot: Shrek's swamp, the starting point of the Far Far Away route — the world you are buying into.",
          },
          sourceIds: ["steam"],
        },
      ],
    },
  ],
};
