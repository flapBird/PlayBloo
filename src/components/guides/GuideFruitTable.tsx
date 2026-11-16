"use client";

import { useMemo, useState } from "react";
import styles from "./guide-data.module.css";

export interface GuideFruitEntry {
  name: string;
  rarity: string;
  reportedUse: string;
}

export function GuideFruitTable({ fruits }: { fruits: GuideFruitEntry[] }) {
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState("All");
  const rarities = [...new Set(fruits.map((fruit) => fruit.rarity))];
  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    return fruits.filter((fruit) =>
      (rarity === "All" || fruit.rarity === rarity) &&
      (!search || `${fruit.name} ${fruit.rarity} ${fruit.reportedUse}`.toLowerCase().includes(search)),
    );
  }, [fruits, query, rarity]);

  return <div className={styles.dataModule}>
    <div className={styles.controls}>
      <label>Search fruits<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or reported use" /></label>
      <label>Rarity<select value={rarity} onChange={(event) => setRarity(event.target.value)}><option>All</option>{rarities.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <p className={styles.resultCount} role="status" aria-live="polite">Showing {visible.length} of {fruits.length} fruits</p>
    <div className={styles.tableScroll} role="region" aria-label="Filterable Vox Seas fruit table" tabIndex={0}>
      <table><thead><tr><th scope="col">Fruit</th><th scope="col">Rarity</th><th scope="col">Community-reported use</th></tr></thead>
        <tbody>{visible.map((fruit) => <tr key={fruit.name}><th scope="row">{fruit.name}</th><td><span className={styles.rarity}>{fruit.rarity}</span></td><td>{fruit.reportedUse}</td></tr>)}</tbody>
      </table>
      {!visible.length && <p className={styles.empty}>No fruits match these filters.</p>}
    </div>
  </div>;
}
