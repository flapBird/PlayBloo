// Independently authored progression, checked against the 1.0 game-data export.
// Source commit, game builds and verification scope: docs/enshrouded-build.md.
export const ENSHROUDED_BUILD_VERSION = "1.0";
export const MAX_SKILL_POINTS = 212;
export const STARTER_BUILD_POINTS = 35;

export interface StarterStep {
  nodeId: string;
  name: string;
  rank: number;
  cost: number;
  after?: string;
  reason: string;
}

// Each entry buys one rank. `after` names the already-owned adjacent node;
// entries without it start directly from a free Spark.
export const starterSteps: StarterStep[] = [
  { nodeId: "12", name: "Double Jump", rank: 1, cost: 2, reason: "A second jump for exploration; keep stamina available to use it." },
  { nodeId: "2", name: "Power Parry", rank: 1, cost: 1, reason: "Start the parry-and-stun loop with your shield." },
  { nodeId: "3", name: "Merciless Attack", rank: 1, cost: 2, reason: "Use the contextual melee finisher when an enemy is overpowered." },
  { nodeId: "35", name: "Constitution · Warrior entrance", rank: 1, cost: 1, reason: "Take the starting Constitution beside Warrior’s Path." },
  { nodeId: "36", name: "Warrior’s Path", rank: 1, cost: 1, after: "35", reason: "Supports one-handed swords, clubs and axes without a named weapon." },
  { nodeId: "38", name: "Strength · after Warrior’s Path", rank: 1, cost: 1, after: "36", reason: "Follow the Strength connection toward the inner melee loop." },
  { nodeId: "46", name: "Constitution · inner melee loop", rank: 1, cost: 1, after: "38", reason: "Take the Constitution connected to that Strength, bypassing Slasher." },
  { nodeId: "44", name: "Strength · before Battle Heal", rank: 1, cost: 1, after: "46", reason: "This second Strength connects to Battle Heal and Swift Blades." },
  { nodeId: "40", name: "Battle Heal", rank: 1, cost: 2, after: "44", reason: "Melee critical hits give a little healing. Keep carrying healing supplies." },
  { nodeId: "19", name: "One-Handed Specialization", rank: 1, cost: 3, after: "40", reason: "Unlock your one-handed weapon’s special ability; build Focus through attacks." },
  { nodeId: "36", name: "Warrior’s Path", rank: 2, cost: 1, reason: "Improve the weapon family you already use." },
  { nodeId: "36", name: "Warrior’s Path", rank: 3, cost: 1, reason: "Finish the general one-handed damage ranks before specializing by damage type." },
  { nodeId: "17", name: "Constitution · Heavy Plates entrance", rank: 1, cost: 1, reason: "Start the separate Constitution branch beside Heavy Plates." },
  { nodeId: "18", name: "Heavy Plates", rank: 1, cost: 1, after: "17", reason: "Increase physical armor from equipped items; equip armor first." },
  { nodeId: "18", name: "Heavy Plates", rank: 2, cost: 1, reason: "Keep improving physical protection while upgrading your armor." },
  { nodeId: "18", name: "Heavy Plates", rank: 3, cost: 1, reason: "Finish this armor investment. It does not replace magic protection." },
  { nodeId: "42", name: "Veteran", rank: 1, cost: 2, after: "36", reason: "Add melee critical chance, supporting the Battle Heal trigger." },
  { nodeId: "42", name: "Veteran", rank: 2, cost: 2, reason: "Continue the critical-chance investment." },
  { nodeId: "42", name: "Veteran", rank: 3, cost: 2, reason: "Complete Veteran before increasing healing per critical hit." },
  { nodeId: "40", name: "Battle Heal", rank: 2, cost: 2, reason: "Increase recovery per melee critical hit; recovery is still conditional." },
  { nodeId: "40", name: "Battle Heal", rank: 3, cost: 2, reason: "Finish the healing ranks after investing in critical chance." },
  { nodeId: "45", name: "Swift Blades", rank: 1, cost: 4, after: "44", reason: "Reach 35 spent points with faster one-handed melee attacks." },
];

export function clampPoints(value: number, max = MAX_SKILL_POINTS, min = 0): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.trunc(value))) : min;
}

export function estimateSkillBudget(level: number, explorationPoints: number): number {
  return (clampPoints(level, 50, 1) - 1) * 2 + clampPoints(explorationPoints, 114);
}

export function getStarterPlan(budget: number) {
  const available = clampPoints(budget);
  let spent = 0;
  const rows = starterSteps.map((step) => {
    spent += step.cost;
    return { ...step, total: spent, affordable: spent <= available };
  });
  const allocated = rows.filter((step) => step.affordable).at(-1)?.total ?? 0;
  return { budget: available, rows, allocated, remaining: available - allocated, next: rows.find((step) => !step.affordable) };
}
