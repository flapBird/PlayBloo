import type { GuideTopic } from "./types";

const dates = { publishedAt: "2026-09-23T17:16:00+08:00", updatedAt: "2026-09-23T17:16:00+08:00" };

export const shapeWalkthrough: GuideTopic = {
  slug: "shape-walkthrough", name: "SHAPE", officialName: "SHAPE - Web Version",
  title: "SHAPE Walkthrough (Colorbomb): Web Version Hints & Solutions",
  description: "SHAPE walkthrough for Colorbomb’s web Demo, from room 12 to the exit. Follow puzzle screenshots, gentle hints and expandable solutions. Web version only.",
  status: "published", platforms: ["Browser (Demo)"], releaseDate: "2026-09-13", releaseStatus: "released", publisher: "Colorbomb",
  cover: { width: 630, height: 500, fit: "contain", src: "/images/guides/shape.webp", alt: "SHAPE Demo official artwork showing the cloudy cabin and purple SHAPE logo", credit: "Official SHAPE Demo artwork — Colorbomb / STUDIO LOOK", sourceUrl: "https://colorbomb.itch.io/shape-web-version" },
  ...dates, verifiedAt: "2026-09-23",
  sources: [
    { id: "web", label: "Colorbomb — SHAPE Web Version and developer replies", url: "https://colorbomb.itch.io/shape-web-version" },
    { id: "steam", label: "TRACE Definitive Edition — Steam product page", url: "https://store.steampowered.com/app/3448760/TRACE_Definitive_Edition/" },
    { id: "controls", label: "Coolmath Games — SHAPE Demo instructions", url: "https://www.coolmathgames.com/0-shape-demo" },
    { id: "play", label: "Hands-on verification — SHAPE web Demo v17", url: "https://colorbomb.itch.io/shape-web-version" },
    { id: "video", label: "EscapeGamesWalkthrough — SHAPE browser Demo playthrough", url: "https://www.youtube.com/watch?v=FC-H18PKE2w" },
    { id: "drain-note", label: "EscapeGames24 — room 12 drain puzzle comment", url: "https://www.escapegames24.com/2026/09/shape-escape.html" },
  ],
  sections: [
    { id: "version", title: "Before you start: this is the web Demo", paragraphs: ["This SHAPE escape walkthrough covers Colorbomb’s browser Demo (web build v17), not the complete Steam game. SHAPE continues TRACE’s story; its full version is included as a free update for owners of TRACE Definitive Edition. The base Steam game is a separate purchase.", "Use the room and puzzle names in the contents to jump to your current obstacle. Read the gentle hint first, open the stronger hint if you need a direction, and reveal the full answer only when you want the solution."], sourceIds: ["web", "steam"] },
    { id: "shopping-list", title: "Room 12: shopping list and O/X panel", puzzle: {
      image: { src: "/images/guides/shape-shopping-list.webp", alt: "Shopping list posted on the wall in SHAPE Demo room 12", width: 854, height: 478, caption: "The shopping list is on the wall beside the laser-blocked doorway in room 12." },
      hint: "The five items on the list are exactly five letters long, like the rows of the nearby wall panel.",
      furtherHint: "Keep only O and X from each word. Put those two letters in their original column positions, leaving all other squares blank.",
      solution: ["Read the list from top to bottom: OXIDE, BOXES, XENON, EPOXY, XYLOL.", "Fill the five rows of the O/X panel as OX···, ·OX··, X··O·, ··OX·, X··O·. The dots mean leave the square blank.", "The panel releases a blue key beneath it. Pick up the key for the next part of the room."],
    }, sourceIds: ["play", "video"] },
    { id: "yinyang-dials", title: "Room 12: yin-yang note and number wheels", puzzle: {
      image: { src: "/images/guides/shape-yinyang.webp", alt: "Yellow yin-yang note with crossed-out numbers in the SHAPE Demo cabinet", width: 854, height: 478, caption: "Inspect the yellow note inside the glass cabinet, then compare the two circular number devices." },
      hint: "The yellow note is not asking you to enter its crossed-out number directly. Compare it with the light and dark halves of the circular devices.",
      furtherHint: "Each three-wheel device has its own answer. Read the digits across the center line of the wheels, and treat the dark and light devices separately.",
      solution: ["After the O/X panel, collect the blue key and inspect the glass cabinet, including the yellow yin-yang note and the objects on its shelves.", "Set the dark circular device to 347 across its three center digits. Set the light circular device to 458. These are separate combinations; do not type 138 from the crossed-out note.", "Continue checking the devices as the room changes. A later three-wheel stage uses 958; if a device still shows a new lock, it belongs to that later stage."],
    }, sourceIds: ["video", "drain-note"] },
    { id: "color-panel", title: "Room 12: four color pads and symbol strip", puzzle: {
      image: { src: "/images/guides/shape-color-panel.webp", alt: "Four-square color panel on a circular SHAPE Demo device", width: 854, height: 478, caption: "The four color pads are on the round device beside the glass cabinet." },
      hint: "Watch the colored flashes and the four pad positions before clicking rapidly. The square you press matters as much as the color you see.",
      furtherHint: "Work through the color-pad stage until the small slot beneath it opens. The strip inside is a clue for the later shape display, not the floor drain.",
      solution: ["Complete the four-pad color interaction on the round device. It cycles through colored flashes rather than presenting a single permanent four-color picture, so copy the flashes and their positions as they appear in your run.", "Take a photo of the symbol strip that appears in the slot below the pads. You will use its flat diagrams at the six-position display near the end of the Demo.", "When the later light number-wheel stage is available, set its center digits to 958 to continue opening the room."],
    }, sourceIds: ["video"] },
    { id: "drain-code", title: "Room 12: floor drain and four-digit lock", puzzle: {
      image: { src: "/images/guides/shape-floor-drain.webp", alt: "Round floor drain in SHAPE Demo room 12", width: 854, height: 478, caption: "The circular floor drain sits in the center of room 12." },
      hint: "The drain is a clue to the four-digit lock by the clothes, not a mechanism you need to remove.",
      furtherHint: "Study the conversion examples on the device below the glass cabinet. Translate the shapes in the drain grid into digits, then read them in the device’s order.",
      solution: ["Inspect the example device beneath the glass cabinet to learn how its diagrams turn into numbers.", "Apply the same rule to the four sections of the floor drain grid. Read the results in the indicated order: 4, 5, 3, 2.", "Enter 4532 on the four-digit lock behind the clothes."],
    }, sourceIds: ["video", "drain-note"] },
    { id: "dot-grids", title: "Room 12: two nine-dot panels", puzzle: {
      image: { src: "/images/guides/shape-dot-grids.webp", alt: "Two connected three-by-three dot grids in the SHAPE Demo", width: 854, height: 478, caption: "Compare the dot example below the glass cabinet with the larger connected panels." },
      hint: "The two grids show the same nine positions from different sides. A lit dot in one row does not necessarily stay in that row on the other panel.",
      furtherHint: "Exchange the top and bottom rows while keeping the left-to-right order within each row. The middle row stays in place.",
      solution: ["Inspect the smaller demonstration panel and the connected nine-dot device. The rule swaps the top and bottom rows without mirroring the columns.", "On the left input grid, light the top-left dot, the center dot, and all three dots in the bottom row. Leave the other four dark.", "The corresponding right-side display shows all three top dots, its center dot, and the bottom-left dot. Once the input matches, the device opens the route to the dark window puzzle."],
    }, sourceIds: ["video", "drain-note"] },
    { id: "dark-window", title: "Room 12: dark window and moving light", puzzle: {
      image: { src: "/images/guides/shape-orb.webp", alt: "Dark window puzzle with hanging lights and a drag handle", width: 854, height: 478, caption: "The dark window is beside the door revealed after the dot-grid stage." },
      hint: "The short handle at the bottom moves the view; it is not a button to press once.",
      furtherHint: "Click and drag the handle sideways to line up the bright moving object with the star-like target. Watch how the hanging lights shift as you move.",
      solution: ["Open the dark window after the nine-dot device has activated the door.", "Drag the bottom handle horizontally until the bright object reaches the star-like target. Keep adjusting rather than repeatedly clicking the target itself.", "After the window sequence, check the illuminated clue strip on the side table. Its small black-and-white shapes help with the final geometric display."],
    }, sourceIds: ["video"] },
    { id: "solid-display", title: "Room 12: six solid shapes and the exit corridor", puzzle: {
      image: { src: "/images/guides/shape-solids.webp", alt: "Six-position solid-shape display and item drawer in the SHAPE Demo", width: 854, height: 478, caption: "The display has three positions on each side of a center switch." },
      hint: "The line drawings above the display are nets: flat patterns that fold into solid objects.",
      furtherHint: "Inspect the pink solids in your inventory and match each one to a flat net. Read the answer across the six pedestals, left to right.",
      solution: ["Collect the six pink solids around room 12, including the one near the plants and the object released from the closet after entering 4532.", "Place them from left to right as a tall rectangular prism, a cylinder, a short box, a small pyramid, a cone, and a faceted many-sided solid.", "When all six are in place, use the switch in the middle of the display. The corridor leading out of room 12 opens."],
    }, sourceIds: ["video", "drain-note"] },
    { id: "exit", title: "Corridor: key-shaped socket and triangle exit", puzzle: {
      image: { src: "/images/guides/shape-exit.webp", alt: "Triangle exit switch with a key-shaped socket in the SHAPE Demo corridor", width: 854, height: 478, caption: "The final switch is on the wall beyond the room 12 corridor." },
      hint: "The shape of the blue key matches a socket on a small wall device near the last door.",
      furtherHint: "After inserting the key, look for the indicator light beside the large triangle. The triangle is the final control.",
      solution: ["Walk through the corridor unlocked by the six-solid display.", "Use the blue key on the matching wall socket near the last door. Wait for the device's indicator to turn green.", "Press the lit triangle and continue through the exit to finish the browser Demo."],
    }, sourceIds: ["video"] },
    { id: "water-tank", title: "Water tank: a full-game puzzle", paragraphs: ["The red blocks that move underwater are not a solvable puzzle in the web Demo. Colorbomb confirms this in a reply on the official game page. Leave this mechanism alone when working toward the Demo exit; an unfinished tank does not mean you have missed a required Demo solution."], sourceIds: ["web"] },
  ],
  articles: [{
    slug: "controls-and-camera", shortTitle: "Inventory, camera & controls", category: "Getting started",
    title: "SHAPE Demo Controls: Inspect Items, Use the Camera & Keep Clues",
    description: "Learn SHAPE’s inventory drawer, right-click inspection and photo notes so you can compare clues while solving the browser Demo.",
    status: "published", ...dates, relatedSlugs: [],
    sections: [
      { id: "navigation", title: "Look around and inspect the room", paragraphs: ["Click the on-screen arrows to change your view, then click furniture or a mechanism for a closer look. Before trying combinations, make a slow circuit of the room and note which locks ask for numbers, symbols or a pattern."], sourceIds: ["controls"] },
      { id: "inventory", title: "Open the drawer and inspect an item", paragraphs: ["Collected objects go into the inventory drawer at the top. Open it to see what you have. Right-click an item to inspect it; left-click to select it for use on something in the room.", "If an object seems unhelpful, inspect it before abandoning that puzzle. A marking on the object may explain its purpose. After an unsuccessful use, check that the intended item is still selected before trying another target."], sourceIds: ["controls"] },
      { id: "camera", title: "Photograph clues and make notes", paragraphs: ["Open the drawer on the right to reach the camera. The red button above it takes a photo; the pencil icon lets you draw on that photo. Right-click and drag to erase your marks.", "Photograph a clue before leaving its close-up. Keep orientation marks and the complete border in the picture: a cropped pattern can lose the information that tells you how to read it. Compare one clue with one lock at a time, and distinguish observations from guesses in your notes."], sourceIds: ["controls"] },
      { id: "loading", title: "If the Demo is slow", paragraphs: ["Colorbomb warns that SHAPE is more demanding graphically than their earlier web games. If loading or rendering fails on a low-end device, try a more capable computer before treating it as a puzzle issue. This guide does not establish a minimum browser hardware specification."], sourceIds: ["web"] },
    ],
  }],
};
