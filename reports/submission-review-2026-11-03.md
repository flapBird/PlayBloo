# 用户投稿审核报告 — 2026-11-03

- 输入：2 条待审投稿（当日快照 `pending_review` 共 2 条）
- 结果：通过 0，重复 0，**拒绝 2**，待处理 0，失败 0
- 审核方式：人工编辑审核（服务角色在本次授权审核范围内直接写库；无管理员会话，`reviewed_by` 留 null，实际方式记录于各投稿 `_editorial_review`）

## 背景说明

基线快照与 2026-11-02 批次相比：投稿 +2（即本批两案），游戏 +10（itch 批次与 Farflung 等其他会话在两快照之间入库，**非本轮改动**，本轮未触碰任何游戏行）。本轮拒绝判定与题材无关，仅按"仅收录有可验证浏览器版本的单款游戏"既定规则执行；itch.io 与 Steam 商店页在审核网络下均超时不可达，页面事实以投稿时成功的自动提取、搜索结果与投稿者自述交叉核实——超时本身不作为拒绝依据。

## 逐条结果

### 1. The Meridian Signal (DigiiForge) — 拒绝

| 项 | 值 |
|---|---|
| submissionId | `5cfb013e-531e-4ac4-b136-0b8c4bfbb9e0` |
| inputUrl | https://digiiforge.itch.io/the-meridian-signal （source_type: itch，slug `digiiforge/the-meridian-signal`） |
| identity | itch 创作者 digiiforge；与库内既有 MERIDIAN（Brady Licht，slug `meridian`）同名不同作者，不合并；目录扫描（含 2026-11-03 全量游戏）无同款 |
| decision | rejected |
| reason | 付费 print-and-play 桌面解谜（Letter/A4 PDF 档案 + 独立提示册 + 可选的**离线**桌面浏览器终端，即下载后本地打开的 HTML）；无任何托管在线浏览器版本。投稿 notes 自述 "It is not an embedded free browser game"；免费序章亦为下载素材而非在线浏览器构建。按"仅收录有可验证浏览器版本"规则不符合收录条件 |
| researchSources | 投稿时自动提取（extraction=success，2026-11-01，description/tags 含 "print and play"）；itch 商店页与创作者档案搜索结果；官方产品页 digiiforge.com（搜索摘要）；均于 2026-11-03 核实 |
| 写库 | 条件更新 `eq(id).eq(status,pending_review)` 返回 1 行；`status=rejected`、`reviewed_at=2026-11-03T15:26:17.099Z`；原 notes 保留并追加拒绝说明；`extracted_data` 原 18 个键全保留，新增 `_editorial_review`（method/reviewedAt/status/reason/sourceUrls）；`extraction_status` 保持 success 不动 |
| outcome | 写回并回读验证通过 |

### 2. Cartoon Crime (BuBa Games) — 拒绝

| 项 | 值 |
|---|---|
| submissionId | `d651a5bb-50a6-4ad7-92fc-56c9ed449407` |
| inputUrl | https://store.steampowered.com/app/5057090/Cartoon_Crime/ （source_type: steam，App ID 5057090） |
| identity | 开发/发行 BuBa Games（两位开发者，投稿人 Burhan Doygun）；目录扫描无同款 |
| decision | rejected |
| reason | 付费 Windows 独占 Steam 抢先体验下载版（约 $2.99，2026-08 下旬上架）；搜索确认无浏览器/HTML5/WebGL/itch 版本；投稿 notes 自述 "not a browser game"。原生 Steam 游戏即使含 demo 也不等于浏览器游戏，按规则不符合收录条件 |
| researchSources | 投稿时自动提取（extraction=success，platforms=["Windows"]）；Steam 商店页/SteamDB/多家报道搜索结果（均仅 Windows PC 下载版）；均于 2026-11-03 核实 |
| 写库 | 条件更新返回 1 行；`status=rejected`、`reviewed_at=2026-11-03T15:26:17.099Z`；原 notes 保留并追加拒绝说明；`extracted_data` 原 21 个键全保留，新增 `_editorial_review`；`extraction_status` 保持 success 不动 |
| outcome | 写回并回读验证通过 |

## 写库与验证汇总

1. 两案均为拒绝，实际写回后台（拒绝判定与自动提取状态是不同字段，`extraction_status` 均保持原 success）。
2. 回读核对：`status=rejected`、`reviewed_at` 写入、`reviewed_by=null`（服务角色直写、无管理员会话，已在 `_editorial_review.method` 说明实际方式）、无 `duplicate_game_id`/`approved_game_id`；notes 原文+附录齐全；`extracted_data` 原键无损。
3. 待审队列清零：`pending_review` 剩余 0。
4. 本轮未创建/修改任何游戏行、分类、标签、系列；sitemap 无新增/移除需求，线上与基线一致的游戏集未受影响（老游戏 lastmod 无需变动）。拒绝投稿不影响 sitemap（投稿本就未收录）。
5. `public/llms.txt` 无涉及，未改动。本轮无应用代码改动，未构建。

## 待跟进

无。待审队列已清空。
