# Enshrouded starter build — verification and maintenance

Checked October 21, 2026. The route is an original editorial allocation, not a
PlayBloo playtest or best-build ranking. It uses ordinary one-handed melee gear
and stops at 35 points. No save import, full-tree editor, automatic respec,
equipment-granted ranks or DPS estimate is implemented.

## Evidence

Source revision: `4dc5df898234c1c2dc09bf8a264df2970a1634de` in the community
[Enshrouded Skill Planner repository](https://github.com/rossicler/enshrouded-skill-tree).

- [Skill facts](https://raw.githubusercontent.com/rossicler/enshrouded-skill-tree/4dc5df898234c1c2dc09bf8a264df2970a1634de/packages/core/src/constants/gameSkillData.json):
  game build `1267041`, release_1.0, exported October 15 at 23:23:31 UTC.
  Costs, rank caps, node identities and connecting edges checked against this export.
- [Progression facts](https://raw.githubusercontent.com/rossicler/enshrouded-skill-tree/4dc5df898234c1c2dc09bf8a264df2970a1634de/packages/core/src/constants/gameProgression.json):
  game build `1269579`, release_1.0, exported October 16 at 19:21:17 UTC.
  Level cap 50; two points for each level after the first. Biome point totals
  are 17 + 20 + 15 + 20 + 15 + 15 + 12 = 114; maximum 98 + 114 = 212.
- The upstream selection model permits one purchased rank to connect adjacent
  nodes, treats edges as undirected and permits independent starting entries.
  This is a community-export check, not independent in-game validation.
- Official announcement and support sources remain in `enshrouded.ts`. General
  food, equipment and retreat advice is editorial, not a timed walkthrough.

Only the facts needed for this small allocation are recorded in our authored
route. Upstream source code, skill descriptions, full dataset and assets are not
vendored. Do not add the upstream packages without reviewing their GPL-3.0 terms.

## Route

`enshrouded-build.ts` is shared by the rendered table and calculation logic.
Each row buys one rank. `nodeId` disambiguates repeated attribute names; `after`
records an already-purchased adjacent node for the first purchase of a non-entry
skill. The route bypasses Slasher through Strength 38 → Constitution 46 →
Strength 44 → Battle Heal 40, then One-Handed Specialization 19. Heavy Plates
starts separately at Constitution 17. Swift Blades 45 connects from Strength 44.

For budgets below 35, buy the affordable prefix, including connecting nodes.
At 34 points, leave three unspent until Swift Blades can be purchased for four.
Above 35, leave all additional points unallocated. Total budget means spent plus
unspent skill points, excluding equipment bonuses. Estimated exploration points
are entered as points actually earned, not a count of locations or visited biomes.

Run `node scripts/verify-enshrouded-build.mjs` for budget edge cases and all budgets
from 0 to 212. To recheck data, download the pinned skill-facts JSON to a temporary
file and pass its path as the first argument. The checker verifies every cost,
rank and edge against that file. Review game changes before switching revisions;
do not silently change old route data to a newer patch.

## Publishing and imagery

The article is `/guides/enshrouded/early-game-build`, registered on the existing
topic and linked from its hub and two sibling articles. The static article and
initial 35-point table render server-side; only the budget form is interactive.
The original topic and sibling publication dates are preserved. The hub's
substantive update and the new article have October 21 dates. No playable game
records are created or changed. Deployment is separate from local publication.

The new cover is inspected official 1.0 press-kit artwork, compressed to a
1600 × 900 WebP. Its exact source URL and credit are in the article. `contain`
preserves the exploration montage and logo in the wide article cover.
