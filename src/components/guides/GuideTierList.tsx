"use client";

import { useMemo, useState } from "react";
import styles from "./guide-data.module.css";

export interface GuideTierEntry {
  tier: string;
  name: string;
  focus: string;
  note: string;
}

export function GuideTierList({ entries }: { entries: GuideTierEntry[] }) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");
  const [focus, setFocus] = useState("All");
  const tiers = [...new Set(entries.map((entry) => entry.tier))];
  const focuses = [...new Set(entries.map((entry) => entry.focus))];
  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    return entries.filter((entry) =>
      (tier === "All" || entry.tier === tier) &&
      (focus === "All" || entry.focus === focus || (focus !== "Starter" && entry.focus === "Mixed")) &&
      (!search || `${entry.name} ${entry.tier} ${entry.focus} ${entry.note}`.toLowerCase().includes(search)),
    );
  }, [entries, query, tier, focus]);

  return <div className={styles.dataModule}>
    <div className={`${styles.controls} ${styles.tierControls}`}>
      <label>Search ranked fruits<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Fruit or ranking reason" /></label>
      <label>Tier<select value={tier} onChange={(event) => setTier(event.target.value)}><option>All</option>{tiers.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Reported focus<select value={focus} onChange={(event) => setFocus(event.target.value)}><option>All</option>{focuses.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <p className={styles.resultCount} role="status" aria-live="polite">Showing {visible.length} of {entries.length} ranked fruits. Mixed entries appear in both PvE and PvP filters.</p>
    <div className={styles.tableScroll} role="region" aria-label="Filterable Vox Seas community tier list" tabIndex={0}>
      <table><thead><tr><th scope="col">Tier</th><th scope="col">Fruit</th><th scope="col">Focus</th><th scope="col">Why Roblofix placed it here</th></tr></thead>
        <tbody>{visible.map((entry) => <tr key={entry.name}><td><span className={styles.tier} data-tier={entry.tier}>{entry.tier}</span></td><th scope="row">{entry.name}</th><td>{entry.focus}</td><td>{entry.note}</td></tr>)}</tbody>
      </table>
      {!visible.length && <p className={styles.empty}>No ranked fruits match these filters.</p>}
    </div>
  </div>;
}
