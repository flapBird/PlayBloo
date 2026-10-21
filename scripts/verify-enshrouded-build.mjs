import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { estimateSkillBudget, getStarterPlan, starterSteps, MAX_SKILL_POINTS } from "../src/lib/guides/enshrouded-build.ts";

assert.equal(estimateSkillBudget(1, 0), 0);
assert.equal(estimateSkillBudget(10, 0), 18, "Level alone must not grant exploration rewards");
assert.equal(estimateSkillBudget(10, 17), 35);
assert.equal(estimateSkillBudget(50, 114), 212);
assert.equal(estimateSkillBudget(-10, -10), 0);
assert.equal(estimateSkillBudget(500, 500), 212);
assert.equal(estimateSkillBudget(NaN, NaN), 0);
assert.equal(getStarterPlan(35).allocated, 35);
assert.equal(getStarterPlan(34).allocated, 31, "Save for the full four-point Swift Blades purchase");
assert.equal(getStarterPlan(34).next.name, "Swift Blades");
assert.equal(getStarterPlan(34).remaining, 3);
assert.equal(getStarterPlan(212).remaining, 177, "Do not invent an endgame allocation");
assert.equal(getStarterPlan(-1).budget, 0);
assert.equal(getStarterPlan(Infinity).budget, 0);
assert.equal(getStarterPlan(999).budget, 212);
assert.equal(getStarterPlan(12.9).allocated, 12);
for (let budget = 0; budget <= MAX_SKILL_POINTS; budget++) {
  const plan = getStarterPlan(budget);
  assert.ok(plan.allocated <= budget);
  assert.equal(plan.allocated + plan.remaining, budget);
  assert.ok(plan.rows.every((row, i) => !row.affordable || i === 0 || plan.rows[i - 1].affordable), "No skipping unpaid prerequisites");
  if (plan.next) assert.ok(plan.next.cost > plan.remaining, "Next rank must need more points");
}
console.log("PASS every budget from 0–212, input bounds, exploration formula and 34-point saving behavior");

// Optional pinned upstream export. Do not bundle the upstream implementation.
// See docs/enshrouded-build.md for the download URL and game-build provenance.
if (process.argv[2]) {
  const data = JSON.parse(await readFile(process.argv[2], "utf8"));
  assert.ok(data.provenance.gameBuild.startsWith("1267041|"), "Expected checked 1.0 build");
  const selected = new Map();
  for (const step of starterSteps) {
    const node = data.nodes[step.nodeId];
    assert.ok(node, `${step.name}: node exists`);
    const type = data.types[node.type];
    assert.equal(step.cost, type.cost, `${step.name}: current cost per rank`);
    assert.equal(step.rank, (selected.get(step.nodeId) ?? 0) + 1, `${step.name}: no skipped ranks`);
    assert.ok(step.rank <= type.maxLevel, `${step.name}: valid maximum rank`);
    if (step.rank === 1 && !node.base) {
      assert.ok(step.after && selected.has(step.after), `${step.name}: prerequisite was bought`);
      assert.ok(data.edges.some((edge) => edge.includes(step.nodeId) && edge.includes(step.after)), `${step.name}: prerequisite is adjacent`);
    }
    selected.set(step.nodeId, step.rank);
  }
  console.log("PASS every purchased rank, cost, entry node and connecting edge against pinned 1.0 export");
}
