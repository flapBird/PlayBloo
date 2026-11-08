import type { GuideTopic } from "./types";

const publicationDate = "2026-11-08T13:00:00.000Z";
const dates = { publishedAt: publicationDate, updatedAt: publicationDate };
const delayNews = "https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026";
const preorderNews = "https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25";
const rockstarStore = "https://store.rockstargames.com/game/buy-gta-vi";
const pushSquare = "https://www.pushsquare.com/news/2026/06/gta-6-physical-edition-doesnt-come-with-discs-its-a-code-in-the-box";
const trailer2 = "https://www.youtube.com/watch?v=VQRLujxTm3c";

export const gta6: GuideTopic = {
  slug: "gta-6",
  name: "GTA 6",
  officialName: "Grand Theft Auto VI",
  title: "GTA 6 Guide: Pre-Order, Price and Release Date",
  description:
    "Grand Theft Auto VI launches November 19, 2026 on PS5 and Xbox Series X|S: editions, prices, the Vintage Vice City Pack bonus, code-in-box and preload.",
  status: "published",
  platforms: ["PlayStation 5", "Xbox Series X|S"],
  releaseDate: "2026-11-19",
  releaseStatus: "upcoming",
  publisher: "Rockstar Games",
  cover: {
    src: "/images/guides/gta-6-pre-order.webp",
    alt: "Grand Theft Auto VI key art: comic-style panels of Jason and Lucia, a yellow supercar, a speedboat, an alligator and Vice City scenes around the GTA VI logo",
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
  ...dates,
  verifiedAt: "2026-11-08",
  sources: [
    { id: "delay", label: "Rockstar Newswire — Grand Theft Auto VI is now set to launch November 19, 2026", url: delayNews },
    { id: "preorder-news", label: "Rockstar Newswire — Pre-Order Grand Theft Auto VI on June 25", url: preorderNews },
    { id: "store", label: "Rockstar Store — Grand Theft Auto VI buy page (editions, pre-order bonus, code-in-box and preload notes, checked November 8, 2026)", url: rockstarStore },
    { id: "pushsquare", label: "Push Square — GTA 6 Physical Edition Doesn't Come with Discs, It's a Code in the Box (June 24, 2026)", url: pushSquare },
    { id: "trailer", label: "Rockstar Games — Grand Theft Auto VI Trailer 2 (official YouTube upload)", url: trailer2 },
  ],
  sections: [
    {
      id: "release-date",
      title: "Release date and platforms",
      releaseFacts: true,
      paragraphs: [
        "Rockstar moved Grand Theft Auto VI from May 26, 2026 to Thursday, November 19, 2026, in its own launch-date announcement. It is a PlayStation 5 and Xbox Series X|S release; a PC version has not been announced.",
      ],
      sourceIds: ["delay"],
    },
    {
      id: "pre-order-status",
      title: "Pre-orders are open now",
      paragraphs: [
        "Pre-orders opened June 25, 2026 on digital storefronts and the Rockstar Store, with retailers following. Two facts on the Rockstar Store matter for anyone ordering this week: ordering before November 20 adds the Vintage Vice City Pack at no additional cost (while supplies last), and preload begins November 10, 2026.",
        "Our pre-order guide breaks down both editions, what is actually inside the pre-order bonus, and the physical-edition caveat every buyer should read before checkout.",
      ],
      link: { label: "Read the full pre-order guide", href: "/guides/gta-6/pre-order" },
      sourceIds: ["preorder-news", "store"],
    },
    {
      id: "trailer-section",
      title: "Watch the official trailer",
      trailer: true,
      paragraphs: ["Rockstar's second trailer is the current official showcase of Jason, Lucia and the state of Leonida. This coverage is based on Rockstar's published store and newswire information, not early access or a review copy."],
      sourceIds: ["trailer"],
    },
    {
      id: "editions",
      title: "Two editions: Standard and Ultimate",
      paragraphs: [
        "Rockstar sells a Standard Edition and an Ultimate Edition. US pricing reported for the pair is $79.99 and $99.99; the Rockstar Store's own front price for the physical Standard edition displayed €79.99 during our November 8 check, so expect regional currencies to differ and confirm at checkout.",
        "The Ultimate Edition bundle layers extras on the digital standard game — per the store's editions breakdown, that includes vehicles such as the '95 Grotti Cheetah and '67 Vapid Dominator Buggy, the Hawk and Little Morgan Revolvers, personalized weapon variants, Vice City styles, Jason's Safehouse Vehicles, business and mod-shop properties, a Classic Car Collection, clothing stores, and a free month of GTA+ as the digital-store pre-order bonus. The full itemized list belongs in the pre-order guide.",
      ],
      link: { label: "See the edition-by-edition comparison", href: "/guides/gta-6/pre-order" },
      sourceIds: ["store"],
    },
    {
      id: "code-in-box",
      title: "The physical edition is a code in a box",
      paragraphs: [
        "Rockstar's own store page states it plainly: physical versions will only contain a download code inside the box, to support preload on November 10 — no disc is included. Push Square first reported the decision in June 2026, and the store has since confirmed it alongside the boxed version.",
        "For buyers this changes what 'physical' means: gifting, resale and lending all behave like a digital copy, and redeeming the code needs internet access. Our pre-order guide covers what else to check before ordering a boxed copy.",
      ],
      sourceIds: ["store", "pushsquare"],
    },
    {
      id: "about-this-guide",
      title: "About this coverage",
      paragraphs: [
        "PlayBloo does not sell GTA 6, keys or accounts, and has not played the game. Facts here come from Rockstar's Newswire and store page as checked on November 8, 2026, plus Push Square's code-in-box report; prices and availability can change before launch. GTA 6 is not a browser game, and no playable version is offered on this site.",
      ],
      sourceIds: ["delay", "store", "pushsquare"],
    },
  ],
  articles: [
    {
      slug: "pre-order",
      title: "GTA 6 Pre-Order Guide: Editions, Price, Bonuses",
      shortTitle: "Pre-order guide: editions and bonus",
      description:
        "Where to pre-order GTA 6, what Standard and Ultimate cost, the Vintage Vice City Pack contents, the code-in-box catch, and the November 10 preload window.",
      category: "Pre-order guide",
      status: "published",
      cover: {
        src: "/images/guides/gta-6-pre-order-guide.webp",
        alt: "Lucia and Jason in a convertible at night in official Grand Theft Auto VI artwork, city lights streaking across the windshield",
        credit: "Official Grand Theft Auto VI artwork © Rockstar Games",
        sourceUrl: "https://www.rockstargames.com/VI/_next/static/media/39ak8a12395591.0ybs2pkm~3732.jpg",
        width: 1600,
        height: 900,
      },
      ...dates,
      relatedSlugs: [],
      sections: [
        {
          id: "where-to-preorder",
          title: "Where you can pre-order",
          paragraphs: [
            "Rockstar opened pre-orders on June 25, 2026 through the usual channels: PlayStation Store and the Microsoft Store for the digital versions, the Rockstar Store, and participating retailers for the boxed product. The Rockstar Store's buy page carries a platform selector for PlayStation and Xbox; if a listing you are looking at does not offer one of those two platforms, it is not the official GTA 6 SKU.",
            "PlayBloo does not sell the game. Order from the official stores or a retailer you trust, and read the store's own cancellation and refund terms before checkout — Rockstar's FAQ covers pre-order cancellations on its store, and each platform store has its own rules.",
          ],
          sourceIds: ["preorder-news", "store"],
        },
        {
          id: "editions-table",
          title: "Editions and pricing",
          paragraphs: [
            "US pricing comes from Rockstar's store and launch coverage; our own store check displayed €79.99 for the physical Standard edition, so treat exact figures as regional. The Ultimate bundle, itemized in the store's Compare Editions section, includes the extras listed below the table.",
            "One more practical note from the store page: buyers of the standard game can upgrade to the Ultimate Edition on PlayStation Store at any time, so the edition choice is not a one-way door on that platform. Xbox upgrade availability should be confirmed on the Microsoft Store listing before counting on it.",
          ],
          bullets: [
            "Vehicles: the '95 Grotti Cheetah, '67 Vapid Dominator Buggy, Shitzu Squalo and Jason's Safehouse Vehicles",
            "Weapons: Hawk and Little Morgan Revolvers, personalized weapon variants and an exclusive weapon pattern",
            "Properties and shops: Rideout Customs Mod Shop, Sara's Unisex Salon, Electric Fang Tattoo Parlor, One-Eyed Willie's Mod Shop, Stock 305 Clothing Store, Goodtime Gear and the PTT Youngin$ Compound",
            "Style and collection content: Vice City Styles, Ganado Retro Build and a Classic Car Collection",
            "The Vintage Vice City Pack pre-order bonuses and a free month of GTA+ as the digital-store pre-order bonus",
          ],
          table: {
            headers: ["Edition", "Reported US price", "What it adds"],
            rows: [
              ["Standard Edition", "$79.99", "The base game; physical copies are code-in-box"],
              ["Ultimate Edition", "$99.99", "Digital standard game plus the Ultimate bonus bundle above"],
            ],
          },
          sourceIds: ["store"],
        },
        {
          id: "preorder-bonus",
          title: "The Vintage Vice City Pack bonus",
          paragraphs: [
            "Order before November 20 and Rockstar adds the Vintage Vice City Pack at no additional cost, with the store marking it 'while supplies last'. Per the store's editions breakdown, the pack contains a '55 Vapid Stanier Sedan with a garage, outfits and hairstyles, and an exclusive weapon pattern — nostalgic Vice City-flavored extras rather than gameplay advantages.",
            "Because the bonus attaches to pre-orders and purchases before November 20, it applies to both editions, digital or boxed. If a retailer advertises its own extra on top, that is the retailer's promotion, not Rockstar's — verify it is written into the listing before relying on it.",
          ],
          sourceIds: ["store", "preorder-news"],
        },
        {
          id: "code-in-box-detail",
          title: "Physical copies: code-in-box, no disc",
          paragraphs: [
            "This is the most common post-purchase surprise, so it deserves its own section: Rockstar's store states that physical versions will only contain a download code inside the box to support preload on November 10, and that a disc will not be included. Push Square reported the change in June 2026; the store has since confirmed it on the buy page.",
            "What that means in practice: the box does not install without internet, the code redeems to a digital copy tied to your platform account, and second-hand or gifted boxed copies are really second-hand digital codes — exactly the resale and gifting concerns press coverage raised when the decision was announced. If you want a disc in the case, there currently is not one to buy.",
          ],
          sourceIds: ["store", "pushsquare"],
        },
        {
          id: "preload-and-launch",
          title: "Preload and launch timing",
          paragraphs: [
            "Preload begins November 10, 2026 — nine days before launch — per the Rockstar Store, which notes the code-in-box design exists to support that same preload window. The game then launches on Thursday, November 19, 2026, on PS5 and Xbox Series X|S, after the delay from the original May 26 date that Rockstar announced itself.",
            "Exact unlock times by region and platform have not been published in the sources we checked, so do not convert November 19 into a midnight countdown for your store yet. We will update this guide if Rockstar publishes regional unlock hours.",
          ],
          sourceIds: ["store", "delay"],
        },
        {
          id: "buying-checklist",
          title: "Before you order: a short checklist",
          bullets: [
            "Confirm the listing is for PS5 or Xbox Series X|S — no PC version has been announced, so any 'PC key' offer is suspect.",
            "Choose Standard or Ultimate deliberately; on PlayStation you can upgrade to Ultimate later, per the Rockstar Store.",
            "Order before November 20 to include the Vintage Vice City Pack, and treat 'while supplies last' as real.",
            "Accept that a physical order is a download code in a box — no disc, redemption required.",
            "Check the total at checkout: regional currencies differ from the reported $79.99 / $99.99 US figures.",
            "Preload opens November 10; leave storage headroom now, since final download-size figures are not published in our sources.",
          ],
          paragraphs: [
            "GTA 6 carries an adults-only rating (the store displays PEGI 18 with violence, sex, drugs and in-game purchase descriptors), so it is not one for the kids' accounts — worth remembering before it lands in a family library via pre-order.",
          ],
          sourceIds: ["store", "delay"],
        },
      ],
    },
  ],
};
