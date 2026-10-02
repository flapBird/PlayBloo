import type { GuideTopic } from "./types";

export const biteYourTongue: GuideTopic = {
  slug: "bite-your-tongue", name: "Bite Your Tongue", officialName: "Bite Your Tongue",
  title: "Bite Your Tongue Demo: Story, Features & Ending Plans",
  description: "Discover Bite Your Tongue, a psychological horror romance visual novel. Find its official Demo and separate current content from the full game’s ending plans.",
  status: "published", platforms: ["Browser (HTML5)", "Windows", "macOS", "Linux"],
  releaseDate: "2026-10-01", releaseKind: "demo", releaseStatus: "released",
  publisher: "Frogcake, Rosia, ShiraiiKun, LemonInk, Instrumetal & Valencia’s Creative Endeavors",
  cover: {
    src: "/images/guides/bite-your-tongue.webp", width: 630, height: 500, fit: "contain",
    alt: "Official Bite Your Tongue cover showing two illustrated characters behind the game title",
    credit: "Official Bite Your Tongue promotional artwork — Frogcake and team",
    sourceUrl: "https://img.itch.zone/aW1nLzMwNDI0MDc3LnBuZw==/original/TVIt2p.png",
  },
  publishedAt: "2026-10-02T13:59:51+08:00", updatedAt: "2026-10-02T13:59:51+08:00", verifiedAt: "2026-10-02",
  sources: [
    { id: "official", label: "Frogcake and team — Bite Your Tongue official Demo", url: "https://try-froggery.itch.io/bite-your-tongue" },
    { id: "release", label: "Frogcake — Demo launch and planned endings", url: "https://try-froggery.itch.io/bite-your-tongue/devlog/1684611/demo-out-now" },
  ],
  sections: [
    {
      id: "about", title: "A secret becomes leverage",
      paragraphs: ["Bite Your Tongue is a psychological horror and romance visual novel led by Frogcake’s team. A mysterious blackmailer learns the protagonist’s secret and demands increasingly troubling acts. The story follows how you respond to that pressure."], sourceIds: ["official"],
    },
    {
      id: "play-demo", title: "Play or download the Demo", releaseFacts: true,
      paragraphs: ["The itch.io release offers browser play and desktop downloads, with HTML5, Windows, macOS and Linux listed. The game is in English and has subtitles; downloads use name-your-own-price access."],
      link: { label: "Open Bite Your Tongue on itch.io", href: "https://try-froggery.itch.io/bite-your-tongue" }, sourceIds: ["official"],
    },
    {
      id: "features", title: "Characters and presentation",
      bullets: ["A customizable protagonist name and pronouns.", "Two love interests.", "Animated CG illustrations."], sourceIds: ["official"],
    },
    {
      id: "demo-and-endings", title: "Does the Demo have all 13 endings?",
      paragraphs: ["No. The Demo announcement describes roughly 12,000 words and no complete story endings. The planned full game expands to more than 40,000 words and 13 endings. Those are future targets, not content available in the current Demo.", "The developer suggests a full release after Spooktober, but has not announced an exact date. Reaching the Demo’s stopping point does not mean you have missed a full-game ending."], sourceIds: ["release"],
    },
    {
      id: "content-warnings", title: "Content warnings",
      paragraphs: ["The developer warns about blackmail, stalking, panic attacks, dissociation, murder, blood and death."], sourceIds: ["official"],
    },
    {
      id: "first-read", title: "Follow the mystery without spoilers",
      paragraphs: ["Track what each person actually knows about your secret, and distinguish that from your suspicions. Compare your reasons for complying or resisting before searching for an optimal route. This introduction offers no tested ending sequence; desktop controls and phone performance have not been tested here."],
    },
  ],
  articles: [],
};
