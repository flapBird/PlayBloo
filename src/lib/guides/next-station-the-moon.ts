import type { GuideTopic } from "./types";

export const nextStationTheMoon: GuideTopic = {
  slug: "next-station-the-moon", name: "Next Station: The Moon", officialName: "Next Station: The Moon [DEMO]",
  title: "Next Station: The Moon Demo: Story, Platforms & Release Plans",
  description: "Explore Next Station: The Moon, a dark romance visual novel about a journey to the afterlife. Find the official Demo, its features and full-release plans.",
  status: "published", platforms: ["Browser (HTML5)", "Windows", "macOS", "Linux"],
  releaseDate: "2026-09-30", releaseKind: "demo", releaseStatus: "released", publisher: "Comfort Kuma Studios",
  cover: {
    src: "/images/guides/next-station-the-moon.webp", width: 630, height: 500, fit: "contain",
    alt: "Official Next Station: The Moon cover with a long-haired character and the game title",
    credit: "Official Next Station: The Moon artwork — Comfort Kuma Studios",
    sourceUrl: "https://img.itch.zone/aW1nLzMwMjc5MDQ1LnBuZw==/original/6U775X.png",
  },
  publishedAt: "2026-10-02T13:59:51+08:00", updatedAt: "2026-10-02T13:59:51+08:00", verifiedAt: "2026-10-02",
  sources: [
    { id: "official", label: "Comfort Kuma Studios — Next Station: The Moon Demo", url: "https://comfortkuma.itch.io/next-station-the-moon" },
    { id: "release", label: "Comfort Kuma Studios — Demo announcement and full-release plan", url: "https://comfortkuma.itch.io/next-station-the-moon/devlog/1683971/next-station-the-moon-is-released" },
  ],
  sections: [
    {
      id: "about", title: "A train ride to the afterlife",
      paragraphs: ["Next Station: The Moon is a dark romance visual novel from Comfort Kuma Studios. After death, the protagonist arrives at a strange station, where a guide and a conductor lead a seven-day journey toward the moon. Two gods of death become the story’s love interests."], sourceIds: ["official"],
    },
    {
      id: "play-demo", title: "Where to play the Demo", releaseFacts: true,
      paragraphs: ["The official page offers an HTML5 browser version and downloadable desktop builds, listing Windows, macOS and Linux. Download access is offered on a name-your-own-price basis."],
      link: { label: "Open Next Station: The Moon on itch.io", href: "https://comfortkuma.itch.io/next-station-the-moon" }, sourceIds: ["official"],
    },
    {
      id: "demo-content", title: "What does the Demo include?",
      bullets: ["Approximately 12,000 words and three CG illustrations.", "Two love interests, two Demo routes and one ending.", "A protagonist with selectable she/her, he/him or they/them pronouns."], sourceIds: ["official"],
    },
    {
      id: "full-release", title: "Is the full game out?",
      paragraphs: ["The September 30 release is a Demo. In its launch announcement, the studio targets January 2027 for the complete game, without giving an exact day. Treat this as a development plan, not a guaranteed launch date."], sourceIds: ["release"],
    },
    {
      id: "content-warnings", title: "Content warnings",
      paragraphs: ["The developer lists severe depression, suicidal themes and attempts, grief, drugs and overdose references, cannibalism references, stalking and possessive behavior. It states that the game will not contain sexually explicit content."], sourceIds: ["official"],
    },
    {
      id: "first-read", title: "Before your first journey",
      paragraphs: ["Give the dialogue room to establish each character before looking up route answers. If you want to compare choices later, note the question and your response without assuming which option is best. This page introduces the Demo; it does not claim a tested route walkthrough or verified mobile controls."],
    },
  ],
  articles: [],
};
