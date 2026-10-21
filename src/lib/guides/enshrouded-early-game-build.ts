import type { GuideArticle } from "./types";

export const enshroudedBuildUpdatedAt = "2026-10-21T04:54:14.000Z";

export const enshroudedEarlyGameBuild: GuideArticle = {
  slug: "early-game-build",
  title: "Enshrouded Early Game Build: 35-Point Solo Progression Guide",
  shortTitle: "Early game build: a 35-point solo route",
  description: "Plan a 35-point Enshrouded 1.0 solo melee build with ordinary gear, an adjustable skill-point budget, connecting nodes and a step-by-step purchase order.",
  category: "Builds & progression",
  status: "published",
  publishedAt: enshroudedBuildUpdatedAt,
  updatedAt: enshroudedBuildUpdatedAt,
  cover: {
    src: "/images/guides/enshrouded-early-game-build.webp",
    width: 1600,
    height: 900,
    alt: "Enshrouded adventurers using a grappling hook in green ruins and gliding across a mountain valley",
    credit: "Official Enshrouded 1.0 exploration artwork © Keen Games",
    sourceUrl: "https://download.enshrouded.com/Press%20Kit/Screenshots/1.0%20Release/Enshrouded_50_Game_Launch01.jpg",
    fit: "contain",
  },
  relatedSlugs: ["beginners-guide", "skill-tree"],
  sections: [
    {
      id: "the-build",
      title: "A solo starting point with the gear you have",
      paragraphs: [
        "Use a one-handed sword, club or axe with a shield, then invest in mobility, health, weapon abilities and physical protection. This route avoids a required legendary item or a particular damage type. Keep a ranged option for enemies you cannot safely reach.",
        "The 35-point plan below includes every connecting node it buys. Costs, ranks and connections were checked against a community export of the 1.0 game files on October 21, 2026. The purchase order is PlayBloo’s editorial suggestion, not a damage ranking or an in-game-tested build. Check your current tooltips if a later patch changes the tree.",
      ],
      sourceIds: ["starter-skill-data", "general-tips"],
    },
    {
      id: "point-budget",
      title: "Set your points and see what to buy next",
      paragraphs: ["35 points is an example budget: level 10 contributes 18 points and the Springlands exploration rewards in the checked data add up to 17. You may have fewer if you skipped a root or well. Enter your actual total rather than assuming that reaching level 10 completes this allocation."],
      starterPlanner: true,
      sourceIds: ["starter-progression", "starter-skill-data"],
    },
    {
      id: "route-explained",
      title: "Why this order works as a starting plan",
      table: {
        headers: ["Total spent", "What the route adds", "How to use it"],
        rows: [
          ["2–5", "Double Jump, Power Parry and Merciless Attack", "Keep stamina for movement. Practise timed blocks against one familiar enemy, then use the finisher when its stun bar fills."],
          ["6–10", "Warrior’s Path and its connected health/strength route", "Follow Constitution → Warrior’s Path → Strength → Constitution → Strength. This reaches Battle Heal without paying for a cutting-only damage branch."],
          ["12–17", "Battle Heal, One-Handed Specialization and Warrior’s Path ranks", "Learn the special ability on the weapon you own. Battle Heal triggers on melee critical hits; it is not dependable emergency healing."],
          ["18–21", "A separate Constitution entry and Heavy Plates", "Wear and upgrade armor: this passive scales the physical armor on equipped items."],
          ["23–31", "Veteran and remaining Battle Heal ranks", "Improve melee critical chance before spending more on healing per critical hit. Keep bandages and other healing supplies."],
          ["35", "Swift Blades", "Save four points after 31. Follow its connection from the Strength before Battle Heal for faster one-handed attacks."],
        ],
      },
      paragraphs: ["Buying every rank of a skill is not required before following a connection. The listed attribute positions matter: there are several different Constitution and Strength nodes. Start a separate free Spark when the order calls for another entrance; you do not need to buy a path across the whole tree."],
      sourceIds: ["starter-skill-data"],
    },
    {
      id: "ordinary-equipment",
      title: "Equipment choices without a legendary shopping list",
      table: {
        headers: ["Slot or supply", "Start with", "If it is not available"],
        rows: [
          ["Main weapon", "A usable one-handed sword, club or axe", "Use the strongest serviceable one you already own. These share Warrior’s Path; the route does not require Slasher or a specific sword."],
          ["Defense", "A shield and current armor", "Visit the Blacksmith for warrior equipment options. Compare protection and perks before spending upgrade materials; do not leave slots empty while waiting for a named set."],
          ["Ranged backup", "A bow with arrows or a staff with a usable spell charge", "Carry whichever you can supply. This melee allocation does not turn that backup into a fully developed ranged build."],
          ["Food", "Available food that helps health, recovery or melee needs", "Use current recipes rather than a late-region meal list. Refresh bonuses before the trip."],
          ["Recovery", "Healing supplies and a retreat path", "Bandages heal gradually. Make space before using them and do not rely on Battle Heal to rescue you from a dangerous hit."],
        ],
      },
      sourceIds: ["general-tips", "staff-and-bow", "forging-the-path", "starter-skill-data"],
    },
    {
      id: "solo-combat",
      title: "A simple loop for solo expeditions",
      bullets: [
        "Repair, eat and check your skill allocation before leaving the base. Bring your ranged backup and enough supplies for the return trip.",
        "Begin with one enemy in a familiar area. Leave space behind you to dodge or retreat; a shield does not make surrounding enemies harmless.",
        "Use timed blocks when you recognise the attack. Follow an overpowered enemy with Merciless Attack; use your weapon’s special ability when Focus allows it.",
        "Watch your health after melee critical hits, but use healing supplies before the fight becomes desperate. Physical armor investment does not solve every damage type.",
        "In the Shroud, leave time to get out. A difficult root can wait until your equipment or confidence improves; 35 points is a target, not a requirement to continue exploring.",
      ],
      sourceIds: ["starter-skill-data", "general-tips"],
    },
    {
      id: "after-35",
      title: "After 35 points: fix the problem you notice",
      paragraphs: ["The calculator stops allocating at 35 even if your budget is larger. It leaves extra points unspent instead of inventing a full level-50 build. Choose the next investment after trying this setup with your actual equipment."],
      table: {
        headers: ["What ends your trips?", "Next decision"],
        rows: [
          ["You run out of stamina", "Check food, your attack rhythm and current stamina options before adding more damage. Keep enough stamina to escape."],
          ["Ordinary hits take too much health", "Compare armor upgrades and health options. Avoid relying on conditional critical-hit healing for survival."],
          ["Your weapon feels weak", "Check its level, upgrades and damage type. Only then consider a damage-specific branch such as Slasher for cutting damage."],
          ["Melee does not suit you", "Use the respec guide before switching to a bow, wand or staff. Warrior’s Path does not support those weapon families."],
        ],
      },
      link: { label: "Skill-tree changes and respec advice", href: "/guides/enshrouded/skill-tree" },
      sourceIds: ["starter-skill-data", "forging-the-path"],
    },
    {
      id: "budget-questions",
      title: "Skill-point questions",
      table: {
        headers: ["Question", "Answer"],
        rows: [
          ["Does level 10 always mean 35 points?", "No. Levels give 18 at level 10; the other 17 in this example come from exploration. Use only rewards your character has earned."],
          ["Why can I have unspent points below 35?", "The next purchase may cost more than you have left. At 34 points this route allocates 31, keeps 3 unspent and waits for one more to buy Swift Blades."],
          ["Is 212 a starting budget?", "No. The checked 1.0 progression data gives 98 from reaching level 50 and 114 from exploration. It is the full-data maximum, not points granted just for reaching the cap."],
          ["Do armor-granted skill ranks count as spent points?", "Keep equipment bonuses separate. This route budgets ranks bought with skill points and makes no equipment-granted rank assumptions."],
          ["Can I import my existing build?", "This tool shows a purchase sequence for one starter route. It does not import saves or account for points spent on other branches. Include those points in your total only if you intend to reallocate them."],
        ],
      },
      sourceIds: ["starter-progression", "starter-skill-data", "forging-the-path"],
    },
  ],
};
