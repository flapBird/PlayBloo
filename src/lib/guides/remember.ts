import type { GuideTopic } from "./types";

export const remember: GuideTopic = {
  slug: "remember", name: "Remember", officialName: "Remember",
  title: "Remember (Laucifer): Creepypasta Visual Novel Demo",
  description: "Meet Laucifer’s Remember, a music-led creepypasta visual novel. Find the official Demo, its chapter coverage, download platforms and content warnings.",
  status: "published", platforms: ["Browser (HTML5)", "Windows", "Android"],
  releaseDate: "2026-09-27", releaseKind: "demo", releaseStatus: "released", publisher: "Laucifer",
  cover: {
    src: "/images/guides/remember.webp", width: 1280, height: 720, fit: "contain",
    alt: "Official Remember artwork showing a pinned note with a crossed-circle symbol and the game title",
    credit: "Official Remember artwork — Laucifer; still frame from the animated cover",
    sourceUrl: "https://img.itch.zone/aW1nLzI5NzE2MzMzLmdpZg==/original/CAEZBR.gif",
  },
  publishedAt: "2026-10-02T13:59:51+08:00", updatedAt: "2026-10-02T13:59:51+08:00", verifiedAt: "2026-10-02",
  sources: [{ id: "official", label: "Laucifer — Remember official Demo page", url: "https://xlaucifer.itch.io/remember" }],
  sections: [
    {
      id: "about", title: "What is Remember?",
      paragraphs: ["Remember is Laucifer’s creepypasta horror and romance visual novel. An old playlist draws the protagonist back toward their adolescence, before they find themselves in a forest facing familiar figures. Music and internet nostalgia shape the story."], sourceIds: ["official"],
    },
    {
      id: "play-demo", title: "Play or download the Demo", releaseFacts: true,
      paragraphs: ["The official page offers browser play, a Windows download and an Android APK. It lists English, Spanish and Catalan, with keyboard and mouse input. A native macOS build is not currently offered."],
      link: { label: "Open the Remember Demo on itch.io", href: "https://xlaucifer.itch.io/remember" }, sourceIds: ["official"],
    },
    {
      id: "demo-coverage", title: "Which chapters and routes are available?",
      paragraphs: ["The Demo covers the prologue, Chapter 1 and half of Chapter 2; the planned story has five chapters including the prologue. The project describes romance routes for Jeff the Killer, Eyeless Jack, Masky, Hoodie and Ticci-Toby. Slenderman and Ben Drowned have separate routes. This list does not mean every route is complete in the Demo."], sourceIds: ["official"],
    },
    {
      id: "content-warnings", title: "Content warnings before you start",
      paragraphs: ["The developer warns about flashing lights, tobacco, strong language, blood, self-harm, death and toxic relationships."], sourceIds: ["official"],
    },
    {
      id: "first-read", title: "A spoiler-free first read",
      paragraphs: ["Read once without chasing a particular ending, then note which choices you want to revisit. Keep observations about a character separate from guesses about their intentions. This introduction does not provide tested route choices or secret-ending solutions; browser performance and phone controls have not been tested here."],
    },
  ],
  articles: [],
};
