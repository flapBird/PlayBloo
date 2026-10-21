"use client";

import { useState } from "react";
import { clampPoints, estimateSkillBudget, getStarterPlan, MAX_SKILL_POINTS } from "@/lib/guides/enshrouded-build";
import styles from "./enshrouded-planner.module.css";

export function EnshroudedStarterPlanner() {
  const [mode, setMode] = useState("manual");
  const [points, setPoints] = useState("35");
  const [level, setLevel] = useState("10");
  const [exploration, setExploration] = useState("17");
  const budget = mode === "manual" ? clampPoints(Number(points)) : estimateSkillBudget(Number(level), Number(exploration));
  const plan = getStarterPlan(budget);
  const incomplete = mode === "manual" ? points === "" : level === "" || exploration === "";

  return <div className={styles.planner}>
    <div className={styles.intro}><strong>One-handed melee · 35-point route</strong><span>1.0 data · Checked October 21, 2026</span></div>
    <p>Plan your total allocation, including points already spent. This follows one suggested route; it does not read your character or rearrange an existing build.</p>
    <label className={styles.mode}>Set your budget
      <select value={mode} onChange={(event) => setMode(event.target.value)}>
        <option value="manual">Enter my total skill points</option>
        <option value="estimate">Estimate from level + exploration</option>
      </select>
    </label>
    {mode === "manual" ? <div className={styles.controls}>
      <label>Total skill points<input type="number" min={0} max={MAX_SKILL_POINTS} step={1} value={points} onChange={(event) => setPoints(event.target.value)} onBlur={() => setPoints(String(clampPoints(Number(points))))} /></label>
      <div className={styles.presets} aria-label="Example point budgets">{[10, 20, 35].map((value) => <button type="button" key={value} aria-pressed={budget === value} onClick={() => setPoints(String(value))}>{value} points</button>)}</div>
    </div> : <div className={styles.controls}>
      <label>Character level<input type="number" min={1} max={50} step={1} value={level} onChange={(event) => setLevel(event.target.value)} onBlur={() => setLevel(String(clampPoints(Number(level), 50, 1)))} /></label>
      <label>Exploration points earned<input type="number" min={0} max={114} step={1} value={exploration} onChange={(event) => setExploration(event.target.value)} onBlur={() => setExploration(String(clampPoints(Number(exploration), 114)))} /></label>
    </div>}
    <p className={styles.help}>{mode === "estimate" ? "2 × (level − 1) + exploration points. Enter points actually earned from roots and wells, not locations visited. Level 10 + 17 exploration points = 35; level alone does not guarantee that budget." : "Use spent + unspent points shown in your skill tree, excluding equipment-granted ranks. Whole numbers from 0 to 212. Presets are examples, not level milestones."}</p>
    <div className={styles.summary} role="status" aria-live="polite" aria-atomic="true">
      {incomplete ? <p>Enter a value to finish calculating your budget.</p> : <>
        <dl><div><dt>Budget</dt><dd>{plan.budget}</dd></div><div><dt>Allocated</dt><dd>{plan.allocated}</dd></div><div><dt>Unspent</dt><dd>{plan.remaining}</dd></div></dl>
        <p>{plan.next ? <>Next: <strong>{plan.next.name}, rank {plan.next.rank}</strong> · {plan.next.cost} points. Save {plan.next.total - plan.budget} more to reach {plan.next.total} total.</> : <>35-point route complete. {plan.remaining > 0 ? `${plan.remaining} points remain unallocated; use the “After 35 points” advice below.` : "Try the route in a familiar area before choosing your next branch."}</>}</p>
      </>}
    </div>
    <p>Follow the rows in order. Each row buys one rank; repeated attribute names identify different positions. “Within budget” means affordable in this route, not already learned in your game.</p>
    <div className={styles.tableWrap} role="region" aria-label="Skill allocation order" tabIndex={0}>
      <table><caption>Full 35-point allocation, including connecting nodes</caption><thead><tr><th scope="col">Skill / purchase</th><th scope="col">Cost / total</th><th scope="col">Plan</th></tr></thead>
        <tbody>{plan.rows.map((step, index) => <tr key={`${step.nodeId}-${step.rank}`} data-affordable={step.affordable && !incomplete}>
          <th scope="row"><span className={styles.skill}>{index + 1}. {step.name} <small>Rank {step.rank}</small></span><span className={styles.reason}>{step.reason}</span></th>
          <td>{step.cost} / {step.total}</td><td>{incomplete ? "Enter budget" : step.affordable ? "Within budget" : `Need ${step.total - plan.budget} more`}</td>
        </tr>)}</tbody></table>
    </div>
  </div>;
}
