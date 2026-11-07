import type { GuideTopic } from "./types";

// publishedAt/updatedAt are the PlayBloo publication moment (this run), not the game's launch.
const dates = { publishedAt: "2026-11-07T16:10:00.000Z", updatedAt: "2026-11-07T16:10:00.000Z" };
// Internal only: no official launch date has been announced. The boom was covered from
// November 1-2, 2026 (Tuoi Tre, Thanh Nien) and the game's own terms were published by
// November 2. This approximate date never renders: heroFact replaces the hub date chip
// and this topic has no releaseFacts section, so the "Release date" row is not shown.
const approximateLaunchDate = "2026-10-30";
const screenshotCredit =
  "Screenshot of the official Niệm Phật Online game (niemphat.online), taken November 7, 2026";

export const niemPhatOnline: GuideTopic = {
  slug: "niem-phat-online",
  name: "Niệm Phật Online",
  officialName: "Niệm Phật Online (Đi Chùa Online)",
  title: "Niệm Phật Online: Vietnam's 3D Temple Game",
  description:
    "The free 3D temple game behind Vietnam's đi chùa online trend: servers, practices, merit and etiquette, checked hands-on in November 2026.",
  status: "published",
  heroFact: "Browser · viral in Vietnam since early November 2026",
  platforms: ["Browser", "Android"],
  releaseDate: approximateLaunchDate,
  releaseStatus: "released",
  publisher: "Niệm Phật Online team (independent)",
  cover: {
    src: "/images/guides/niem-phat-online.webp",
    alt: "The golden Buddha altar of Chùa Vô Lượng in Niệm Phật Online, with rows of round monk avatars meditating on cushions across the red-brick hall",
    credit: screenshotCredit,
    sourceUrl: "https://s1.niemphat.online/?sv=1",
    width: 1600,
    height: 844,
  },
  ...dates,
  verifiedAt: "2026-11-07",
  sources: [
    { id: "official", label: "Niệm Phật Online — official site", url: "https://www.niemphat.online/" },
    { id: "terms", label: "Niệm Phật Online — Điều khoản & Chính sách (checked November 7, 2026)", url: "https://www.niemphat.online/chinh-sach.html" },
    { id: "ingame", label: "In-game Cách chơi help pages, temple screens and the pilgrimage map (checked November 7, 2026, server S1)", url: "https://www.niemphat.online/" },
    { id: "play", label: "Google Play — Chùa Online | Niệm Phật Online (com.ChuaOnline.TungKinhNiemPhat)", url: "https://play.google.com/store/apps/details?id=com.ChuaOnline.TungKinhNiemPhat" },
    { id: "facebook", label: "Niệm Phật Online — official Facebook page", url: "https://www.facebook.com/niemphatonline/" },
    { id: "tuoitre", label: "Tuổi Trẻ — Chùa ảo Hàn gây sốt, game đi chùa Việt có gì khác biệt? (November 1, 2026)", url: "https://tuoitre.vn/chua-ao-han-gay-sot-game-di-chua-viet-co-gi-khac-biet-100261101161851074.htm" },
    { id: "24h", label: "24h.com.vn — Từ cơn sốt xứ Hàn, chùa online tại Việt Nam mọc như nấm sau mưa (November 2026)", url: "https://www.24h.com.vn/cong-nghe-thong-tin/tu-con-sot-xu-han-chua-online-tai-viet-nam-moc-nhu-nam-sau-mua-c55a1807691.html" },
  ],
  sections: [
    {
      id: "what-is-niem-phat-online",
      title: "What Niệm Phật Online is",
      paragraphs: [
        "Niệm Phật Online is a free browser game that turns visiting a Buddhist temple into a 3D multiplayer world. You create a round-faced little practitioner with a dharma name (pháp danh), walk into a golden main hall full of real players sitting on cushions, and practise: prostrating before the Buddha, counting a 108-bead rosary, chanting sutras to a wooden mõ, meditating, and offering incense, candles, flowers and floating lanterns.",
        "It is the breakout Vietnamese take on the đi chùa online (online temple visit) trend that followed South Korea's Sansa virtual temple in late October 2026. Vietnamese press reported dozens of copycat sites springing up; Niệm Phật Online became the biggest, going further than the Korean original with servers, levels, quests, currencies, pets and a pilgrimage map of temples across Vietnam. The developers, an independent team assisted by AI tooling, keep a low public profile — the game's own Facebook page is their main channel.",
        "The site says the quiet part out loud, which is part of its charm: a scrolling banner reminds you that the game is only a reminder to practise, a notice caps players under 18 at 60 minutes per day, and the in-game FAQ answers whether tapping a screen can create real merit with an honest no. The game itself states it is not a religious organisation and does not replace visiting a real temple.",
      ],
      link: { label: "Open the official Niệm Phật Online site", href: "https://www.niemphat.online/" },
      sourceIds: ["official", "tuoitre", "24h"],
    },
    {
      id: "play-official",
      title: "Where to play it",
      paragraphs: [
        "Niệm Phật Online runs on the official site only, as an installable web app, with an optional Android app on Google Play. Your character, progress and gems live on the game's own servers — each of its five servers even has its own web address — so there is no download-and-offline version, and copies of the client would be an empty shell without the official backend.",
        "That is also why PlayBloo links to the game instead of hosting it: the multiplayer world, accounts and queues only exist on the official servers, and we will not frame or mirror someone else's live service. Clicking through takes you straight to the real thing — pick the server the game suggests for new players, and expect a short queue during evening peak hours; the loading screen says the surge is real and asks for patience.",
      ],
      link: { label: "Open the official Niệm Phật Online site", href: "https://www.niemphat.online/" },
      sourceIds: ["official", "ingame", "terms"],
    },
    {
      id: "systems-at-a-glance",
      title: "The systems at a glance",
      bullets: [
        "Five core practices in the main hall — bows, the 108-bead rosary, sutra chanting with a wooden mõ, breathing meditation and quiet sitting — each feeding a shared merit score.",
        "Two currencies: Sen from quests and check-ins for offerings and robes, Ngọc for decorations and pets; the game says outright that neither merit nor rank can be bought with money.",
        "A pilgrimage map of Vietnamese temples with six routes, passport stamps and a daily destiny temple that pays a bonus.",
        "Courtyard life: sweeping chores, a Buddha garden that grows Ngọc fruit, a sala-flower catching minigame and bondable spirit pets.",
        "Gentle multiplayer: friend greetings, group retreats (đạo tràng), public wish lamps, a weekly golden board per temple — and a poke game that can turn you into a hungry ghost if you overdo it.",
      ],
      link: { label: "Start with our first-day guide", href: "/guides/niem-phat-online/getting-started" },
      sourceIds: ["ingame"],
    },
    {
      id: "about-this-guide",
      title: "About this guide and our checks",
      paragraphs: [
        "PlayBloo checked the game hands-on on the evening of November 7, 2026: we created a character on the recommended S1 server, joined the hall of Chùa Vô Lượng, tried the practices and screens, and read the in-game help pages, which the practice and currency articles follow closely. Online counts quoted here are a single evening snapshot and change constantly.",
        "PlayBloo is not affiliated with Niệm Phật Online. The game's rules and figures can change at any time — several systems are labelled event or beta content in the game itself.",
      ],
      sourceIds: ["ingame", "terms"],
    },
  ],
  articles: [
    {
      slug: "getting-started",
      title: "How to Start Niệm Phật Online: a First-Day Guide",
      shortTitle: "How to start: servers & first day",
      description:
        "Pick a server, create your dharma name, learn the controls and collect the welcome gift — your first day in the Vietnamese 3D temple, step by step.",
      category: "Getting started",
      status: "published",
      cover: {
        src: "/images/guides/niem-phat-online-getting-started.webp",
        alt: "The character creation screen of Niệm Phật Online with a round monk avatar preview, a dharma-name field and hair, skin and robe options",
        credit: screenshotCredit,
        sourceUrl: "https://www.niemphat.online/",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["practices", "world"],
      sections: [
        {
          id: "servers",
          title: "Step 1: pick a server",
          paragraphs: [
            "The first screen asks you to choose a máy chủ (server). Each server keeps its own characters, progress and Ngọc balance — an account made on S1 does not follow you to Gốc. The game marks one server as the suggested home for newcomers; returning players must remember their old server to log back in.",
            "Counts shift constantly and at peak hours you may wait in a queue with a lotus loading screen, a Dhammapada quote and an apology if the temple fills up. If one server feels crowded, another with a shorter wait is fine; your friends simply need to pick the same one. All five were online when we checked on the evening of November 7, 2026:",
          ],
          table: {
            headers: ["Server", "Role", "Players online at our check"],
            rows: [
              ["Máy chủ Gốc", "The original server, the biggest crowd", "255"],
              ["Máy chủ S1", "Second server — the one suggested to new players", "172"],
              ["Máy chủ S4", "The newest server", "102"],
              ["Máy chủ S2", "Third server", "73"],
              ["Máy chủ S3", "Fourth server", "61"],
            ],
          },
          sourceIds: ["ingame", "official"],
        },
        {
          id: "character",
          title: "Step 2: ask for a dharma name and shape your avatar",
          paragraphs: [
            "Character creation is a two-step card. You pick a server, then receive a randomly granted dharma name (pháp danh) — the button Thỉnh tên asks the Buddha for another one until something feels right. Names are how other practitioners will see you, and the FAQ notes a rename request is free once every seven days if yours ever needs to change.",
            "Choose Nam or Nữ, then open the extra options: four hair styles (bald, short, bun, long), five skin tones, and two starter robes — the blue-grey áo tràng lam or the grey novice robe. You also pick a thiền phái, one of four real Vietnamese Buddhist schools; each gives a permanent bonus to a different practice, and the default Tịnh Độ is a fine first choice. Switching later costs 200 Ngọc and keeps your level, so do not agonise.",
            "Finally, tick that you have read the terms and press Vào chùa. No email, phone number or password is required — the site issues your browser a random login code and stores it locally. You can add an optional username and password afterwards from the prompt that appears in-game; the site says passwords are stored one-way hashed. Your recovery code (Hồ sơ → Tài khoản) is what carries the account to a new device, so save it.",
          ],
          table: {
            headers: ["Sect (thiền phái)", "Known for", "Practice bonus"],
            rows: [
              ["Trúc Lâm", "The Zen school founded by king Trần Nhân Tông", "Meditation ×1.3"],
              ["Tịnh Độ (default)", "Amitābha recitation, Pure Land practice", "Beads and name-chanting ×1.3"],
              ["Lâm Tế", "Zen lineage common in central and southern Vietnam", "Bows ×1.3"],
              ["Tào Động", "Silent-illumination sitting", "Quiet sitting ×1.5, meditation ×1.1"],
            ],
          },
          sourceIds: ["ingame", "terms"],
        },
        {
          id: "first-visit",
          title: "Step 3: your welcome gift and the first bow",
          paragraphs: [
            "Newcomers receive a welcome gift the moment they join: 100 Sen, three sticks of incense, two candles and one floating lantern. An in-game abbot — Chùa Vô Lượng's Thầy Tịnh Quang — greets you and can tell the temple's story, explain the Pure Land method or show you how to worship.",
            "The game then runs a ten-step guided tour: how to walk, how to claim a bồ đoàn cushion, and what each action button does. The suggested first five steps are a good script for day one — walk to a cushion and sit, bow a few times or turn one rosary chain, light one of your gifted incense sticks, open Nhiệm vụ (quests) to collect rewards for what you just did, and come back tomorrow to start a check-in streak.",
            "Do not be surprised if the hall you join is busy: on our first evening the suggested server listed over a hundred people in one temple, real wishes kept arriving on the lantern wall, and a ticker announced level-ups by name. Part of the game's appeal is precisely that the temple feels inhabited.",
          ],
          link: { label: "Open the official Niệm Phật Online site", href: "https://www.niemphat.online/" },
          sourceIds: ["ingame"],
        },
        {
          id: "controls",
          title: "Controls on desktop and touch",
          table: {
            headers: ["Action", "Desktop", "Touch"],
            rows: [
              ["Walk", "W A S D or arrow keys", "Drag on the left half of the screen"],
              ["Turn the camera", "Drag with the mouse", "Swipe the right half"],
              ["Zoom", "Mouse wheel", "Pinch with two fingers"],
              ["Sit / stand", "Click a cushion, or the Ngồi xuống button when close", "Same"],
              ["Bow", "B (toggles)", "Lạy Phật button"],
              ["Rosary", "T (toggles)", "Tràng hạt button"],
              ["Tap a bead while counting", "Space or ↓", "Tap or swipe down"],
              ["Leave the rosary screen", "Esc", "Back pill"],
            ],
          },
          paragraphs: [
            "The game plays in portrait or landscape, and the settings offer a performance mode (Mượt) for older phones. Everything runs in the browser; headphones are recommended because the mõ, bell and group chanting are half the atmosphere.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "install",
          title: "Installing it like an app",
          paragraphs: [
            "Niệm Phật Online is a progressive web app. On Android, use Cài đặt → Toàn màn hình inside the game or your browser's Add to Home screen menu; on iPhone, Safari's Share menu offers Add to Home Screen. The team also ships an official Android app, Chùa Online | Niệm Phật Online, on Google Play — Vietnamese media counted more than 10,000 downloads of it during the first viral week.",
            "One thing to know before installing for a child: the game displays a notice limiting players under 18 to 60 minutes per day per game and 180 minutes per day across games, matching Vietnam's gaming rules for minors.",
          ],
          sourceIds: ["ingame", "play", "official"],
        },
      ],
    },
    {
      slug: "practices",
      title: "Niệm Phật Online Practices: Merit, Sen and Ngọc",
      shortTitle: "Practices: merit & currencies",
      description:
        "How bows, the 108-bead rosary, chanting, meditation and offerings earn merit — plus Sen and Ngọc, daily quests and ranking caps, from the in-game rules.",
      category: "Practices & progression",
      status: "published",
      cover: {
        src: "/images/guides/niem-phat-online-practices.webp",
        alt: "The chanting screen of Niệm Phật Online with five sutra tabs, the current line Nam mô A Di Đà Phật and a wooden mõ drum",
        credit: screenshotCredit,
        sourceUrl: "https://s1.niemphat.online/?sv=1",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["getting-started", "world"],
      sections: [
        {
          id: "five-practices",
          title: "The five practices of the main hall",
          paragraphs: [
            "Everything you do on a cushion feeds one merit score (công đức). The five core buttons are the heart of the game:",
          ],
          bullets: [
            "Lạy Phật (bows) — one press starts a steady bowing rhythm, another stops it after the current bow. Practising together earns a Đồng tâm bonus: +5% per extra person bowing at the same time, up to +50%, with milestones celebrated at 108, 500 and 1,000 bows.",
            "Tràng hạt (the 108-bead rosary) — tap or swipe down to move one bead at a time while the mõ ticks; finishing a full chain of 108 pays a round bonus.",
            "Tụng kinh (chanting) — pick one of five texts and tap the wooden mõ once per line. An AI voice can read along, an auto-mõ toggle exists, and the tempo slider goes from 40 to 110 — but the game is explicit that only hand-tapped lines earn merit, one point per syllable. Finishing a text pays a completion bonus once per text per day, a good reason to rotate.",
            "Thiền (meditation) — choose 5, 10, 20, 30 minutes or free mode and follow the breathing circle. Merit accrues per minute; leaving early keeps the minutes you sat. Starting beads, bows or the mõ interrupts a session, and interrupted minutes do not count.",
            "Ngồi tĩnh (quiet sitting) — the simplest of all: just stay seated on a cushion in the main hall and merit trickles in per minute, with a daily cap.",
            "The five chantable texts are the 108-line Niệm Phật call of Nam mô A Di Đà Phật, the Heart Sutra (Bát Nhã Tâm Kinh), the rebirth mantra Chú Vãng Sanh, the 84-line Great Compassion mantra Chú Đại Bi and the dedication verse Kệ Hồi Hướng.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "offerings",
          title: "Offerings: what each gift does",
          table: {
            headers: ["Offering", "Effect"],
            rows: [
              ["Hương trầm (incense)", "Merit plus +20% to all merit earned for 10 minutes — light it before a session"],
              ["Nến (candle)", "Merit and a brighter altar glow"],
              ["Hoa (flowers)", "Merit; flowers appear on the altar"],
              ["Thỉnh chuông (bell)", "Once per temple per day; everyone in the temple hears it"],
              ["Đèn hoa đăng (floating lantern)", "Sends your written wish drifting skyward for the whole temple to see"],
            ],
          },
          paragraphs: [
            "Offerings consume items from your bag — the welcome gift covers your first incense, candles and lantern — and the shop restocks them for Sen. A bell rings for everyone, and wishes on the lantern wall can be rejoiced at (tùy hỷ) by other players, which sends the lamp's owner a small Sen tip.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "merit-levels",
          title: "Merit, levels and dharma titles",
          paragraphs: [
            "Merit from every practice rolls into your level. There are 100 levels grouped into dharma titles, five ranks each; the first 25 levels follow your sect's own path. A level-1 player is a Hạt sen (lotus seed) — titles climb from there as you practise. From level 25 each level takes visibly longer, and any merit earned beyond 20,000 in one day only counts 10% toward levelling, a deliberate brake against grinding.",
            "Level-ups pay Sen, and a weekly leaderboard of Điểm tinh tấn (diligence points) ranks players by week, month and all time, filterable by sect and temple. The weekly top of each temple is carved onto the Bảng Vàng, the golden board standing in the main hall.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "sen-ngoc",
          title: "Sen and Ngọc, the two currencies",
          table: {
            headers: ["Currency", "Where it comes from", "What it buys"],
            rows: [
              ["Sen", "Quests, check-ins, level-ups, sharing, sala-flower catching, referrals", "Offerings, robes, rosaries, cushions"],
              ["Ngọc", "Check-in streaks, Buddha-garden fruit, events", "Special decorations, some spirit pets, sect changes"],
            ],
          },
          paragraphs: [
            "The game used to sell Ngọc via bank transfer and VietQR; at our November 2026 check top-ups were paused and the help page says existing Ngọc stays usable. What has not changed is the promise printed next to it: merit and leaderboard rank cannot be bought with money — paid content is decorative, and donations are explicitly voluntary.",
          ],
          sourceIds: ["ingame", "terms"],
        },
        {
          id: "dailies",
          title: "The daily loop: quests, streaks, wheel, quẻ and blessings",
          bullets: [
            "Quests — daily, weekly and long-term achievement tasks; a red dot on the Nhiệm vụ button means rewards are waiting.",
            "Check-in streak — visiting daily grows the gift up to day seven (including Ngọc and a lantern); missing a day resets it. Streak-keeper incense earned every seventh day can hold the streak for you, up to three sticks.",
            "Fortune wheel (Vòng quay lộc) — one free spin per day for Sen, offerings or rarities; odds are printed on the wheel, rare prizes need level 5 and daily limits, and a fallback pays 50 Sen.",
            "Gieo quẻ — draw one fortune stick per day with a gift; the game is careful to present quẻ as a practice reminder, not a prophecy.",
            "Lộc chùa — glowing golden lotuses appear around the temple grounds; walk close to claim one, first come first served, with a daily limit.",
          ],
          paragraphs: [
            "Lunar dates matter: the first and fifteenth of the lunar month (Mùng 1, Rằm) multiply all merit by 1.5, and great festivals such as Phật Đản and Vu Lan double it. The pilgrimage map's banner counts the days to the next one.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "ranking-caps",
          title: "Leaderboards have daily caps",
          paragraphs: [
            "Leaderboard counting stops at 30 rosary chains, 1,080 bows and 180 meditation minutes per day — anything beyond still earns merit and personal statistics, just no additional rank. The design brief is mindfulness over grinding, and the help page says speed limits exist to keep practices slow and deliberate.",
          ],
          sourceIds: ["ingame"],
        },
      ],
    },
    {
      slug: "world",
      title: "Niệm Phật Online World: Temples and Pilgrimage",
      shortTitle: "World: temples & community",
      description:
        "Pilgrimage routes, temple chores, Buddha gardens, sala flower catching, spirit pets and community etiquette — the world beyond the main hall.",
      category: "World & community",
      status: "published",
      cover: {
        src: "/images/guides/niem-phat-online-world.webp",
        alt: "The pilgrimage map of Niệm Phật Online showing temples across a stylised map of Vietnam with route filters and the Chùa Vô Lượng card",
        credit: screenshotCredit,
        sourceUrl: "https://s1.niemphat.online/?sv=1",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: ["getting-started", "practices"],
      sections: [
        {
          id: "temple-map",
          title: "A pilgrimage map of Vietnam",
          paragraphs: [
            "The Bản đồ hành hương (pilgrimage map) opens onto a stylised map of Vietnam dotted with temples from the north down to the south — over twenty at our check, from Chùa Vô Lượng in Sơn Tây, Hà Nội onward. Each card counts its live online players, marks whether you have visited, and keeps a lore page: the in-game abbot narrates each temple's story, weaving real places and history into the fictional temples.",
            "Scale is the map's quiet flex: the card for Chùa Vô Lượng listed 37,482 practitioners for a single week in November 2026. A weekly golden board inside each temple commemorates its top practitioners.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "pilgrimage",
          title: "Routes, destiny temples and passport stamps",
          bullets: [
            "Six named pilgrimage routes (tuyến hành hương) chain temples by theme — Thăng Long's monastery cluster, northern landmarks, the ancient capitals, the southern temples, the eastern coast to Thất Sơn, and the highlands — completing a route pays a large reward.",
            "Every day one temple is the chùa duyên (destiny temple); visiting it pays extra Sen and incense.",
            "Each visited day adds a stamp (ấn) to your passport (Hộ chiếu); stamp tiers advance at 7, 21 and 49 days of visited temples.",
          ],
          paragraphs: [
            "Together with the lunar-calendar multipliers, the map turns the game into a slow tour of Vietnamese Buddhism — and the developers keep adding temples; the suggestion box (Góp ý) takes temple proposals.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "courtyard",
          title: "The courtyard: chores, gardens and minigames",
          bullets: [
            "Công quả (temple chores) — sweep the courtyard (three sweeps per temple per day) and plant a tree (one per temple per day); planted trees stay for everyone to admire.",
            "Vườn Phật (Buddha garden) — buy a plant, place it in the yard, and harvest fruit every seven days; each fruit converts to 1 Ngọc. A lotus pot (50 Ngọc) yields 25 fruit across five harvests, a bodhi tree (100 Ngọc) 50, a sala tree (150 Ngọc) 75. Five trees per person, fifty per temple.",
            "Hứng hoa sala — a 45-second tray-catching minigame, three rounds a day, paying 10–40 Sen per round; catching 1,080 flowers in total earns the Áo Hoa Sala robe, with its own weekly leaderboard.",
            "Linh thú (spirit pets) — mythical creatures wander the yard; stand beside one for eight seconds to attempt a bond (kết duyên), five free tries a day. Rare species need level 5, forty successful bonds guarantee the blue lion Sư Tử Xanh, and duplicates pay out Sen instead.",
          ],
          sourceIds: ["ingame"],
        },
        {
          id: "community",
          title: "Friends, retreat groups and wish lamps",
          bullets: [
            "Click a fellow practitioner to send a greeting, gift incense, rejoice at their merit, or become đồng tu — friends can gift items to each other. Player cards show bows, rosary chains, streaks and equipped gear.",
            "Đạo tràng — practice groups you join with a code or from a list; when the group hits its shared weekly merit goal, every member receives 50 Sen and an incense stick.",
            "Đèn nguyện (wish lamps) — a public wall of floating-lantern wishes from every player; rejoicing at one notifies the owner and tips them 2 Sen.",
            "Sharing your achievement card to Facebook or Zalo pays 30 Sen the first time each day; a friend who joins through your link gives you both 100 Sen, and three invitations earn the lotus-dais cushion.",
          ],
          paragraphs: [
            "There is deliberately no open chat channel to the hall — communication is greetings, gifts, wishes and reported names. The game masks names that get reported, and the moderation FAQ promises hidden content and bans for offenders.",
          ],
          sourceIds: ["ingame", "terms"],
        },
        {
          id: "etiquette",
          title: "Chan pokes, hungry ghosts and house rules",
          paragraphs: [
            "The one mischievous system is chan: standing near someone and poking them playfully. Poking costs the poker 10 virtue points (tích đức) — the poked player loses nothing, anyone seated or practising cannot be poked, and each poke needs a cooldown. Run out of virtue and you turn into a ngạ quỷ (hungry ghost), reduced to walking the halls until you stand still and listen to a sutra for 30 minutes to regain 50 points; finishing a full sutra earns 5 virtue a day. A settings toggle opts out of the whole game.",
            "House rules ask for gentle speech and respect for the Three Jewels: no advertising, no politics, no impersonating monastics, no automation tools and no exploiting bugs — violations can mean hidden messages, forced renames or bans. The game also reports bad wishes, messages and names through one-tap report buttons, ten per day.",
            "And the last word belongs to the game itself: its help pages and terms repeat that in-game merit is a score encouraging a habit, real merit comes from how you treat people offline, and when you can, visiting a real temple is still better for learning. The guide second that.",
          ],
          sourceIds: ["ingame", "terms"],
        },
      ],
    },
  ],
};
