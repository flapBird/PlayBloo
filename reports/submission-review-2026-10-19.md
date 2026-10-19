# 用户投稿审核 · 2026-10-19

本次处理原有 **38 条待审核投稿**：**29 条通过并发布、9 条拒绝、0 条重复、0 条待处理**。当前全部投稿状态为 approved 30 / rejected 9（其中 1 条 approved 为本轮前已有）。用户明确要求仅收录浏览器游戏，下载版投稿拒绝。

先完整分页读取 990 条现有游戏（含 7 条草稿），按来源、项目身份、来源别名及 slug 去重，写入前再次查库；新增后共 1,019 条游戏，其中公开 1,012 条。原有游戏和原已通过投稿均未更改。

## 已通过并发布

| 游戏 | PlayBloo 页面 | 分类 | 实际首次上线时间（UTC） |
|---|---|---|---|
| Peele | [详情](https://playbloo.net/game/peele) | puzzle, educational | 2026-10-19T03:02:01.209Z |
| F1 Reaction Time Test | [详情](https://playbloo.net/game/f1-reaction-time-test) | arcade, casual | 2026-10-19T03:02:06.365Z |
| Orbital Foundry | [详情](https://playbloo.net/game/orbital-foundry) | strategy, simulation | 2026-10-19T03:02:10.418Z |
| Galaxy Miner (Space Clicker) | [详情](https://playbloo.net/game/galaxy-miner-space-clicker) | idle, clicker | 2026-10-19T03:02:14.425Z |
| After Hours: The Call from Room 214 — Free Chapter | [详情](https://playbloo.net/game/after-hours-the-call-from-room-214-free-chapter) | puzzle, adventure | 2026-10-19T03:02:18.526Z |
| Box Bunny | [详情](https://playbloo.net/game/box-bunny) | puzzle | 2026-10-19T03:02:23.668Z |
| Putt Park | [详情](https://playbloo.net/game/putt-park) | sports | 2026-10-19T03:02:28.054Z |
| Seed Bowl | [详情](https://playbloo.net/game/seed-bowl) | board-game, strategy | 2026-10-19T03:02:32.129Z |
| Pawnstorm | [详情](https://playbloo.net/game/pawnstorm) | board-game, strategy | 2026-10-19T03:02:36.032Z |
| Poly Paint | [详情](https://playbloo.net/game/poly-paint) | puzzle, casual | 2026-10-19T03:02:40.863Z |
| Shop Paws | [详情](https://playbloo.net/game/shop-paws) | simulation, casual | 2026-10-19T03:02:45.108Z |
| Swarm Out | [详情](https://playbloo.net/game/swarm-out) | action, shooting, survival | 2026-10-19T03:02:48.995Z |
| Drift Line | [详情](https://playbloo.net/game/drift-line) | driving, arcade | 2026-10-19T03:02:52.865Z |
| Solitaire Blast | [详情](https://playbloo.net/game/solitaire-blast) | card, casual | 2026-10-19T03:02:56.938Z |
| Trick Room | [详情](https://playbloo.net/game/trick-room) | platformer, arcade | 2026-10-19T03:03:00.874Z |
| Egg Heist | [详情](https://playbloo.net/game/egg-heist) | action, puzzle | 2026-10-19T03:03:04.727Z |
| Werdle | [详情](https://playbloo.net/game/werdle) | puzzle, casual | 2026-10-19T03:03:08.650Z |
| Schätz mal! | [详情](https://playbloo.net/game/schaetz-mal) | trivia, educational, casual | 2026-10-19T03:03:12.542Z |
| Sortier das! | [详情](https://playbloo.net/game/sortier-das) | trivia, puzzle, educational | 2026-10-19T03:03:17.361Z |
| ClueRoll | [详情](https://playbloo.net/game/clueroll) | puzzle | 2026-10-19T03:03:22.123Z |
| Crown Circuit Chess | [详情](https://playbloo.net/game/crown-circuit-chess) | board-game, strategy, multiplayer | 2026-10-19T03:03:26.638Z |
| Cubewords | [详情](https://playbloo.net/game/cubewords) | puzzle | 2026-10-19T03:03:31.229Z |
| Signal Relay | [详情](https://playbloo.net/game/signal-relay) | puzzle, casual | 2026-10-19T03:03:36.043Z |
| Duck Frenzy | [详情](https://playbloo.net/game/duck-frenzy) | arcade, shooting | 2026-10-19T03:03:40.935Z |
| R-Speedo Arcade | [详情](https://playbloo.net/game/r-speedo-arcade) | racing, driving, arcade | 2026-10-19T03:03:45.685Z |
| U1 — The Unbroken One | [详情](https://playbloo.net/game/u1-the-unbroken-one) | action, rpg, adventure | 2026-10-19T03:03:49.581Z |
| QQQ Kingdoms | [详情](https://playbloo.net/game/qqq-kingdoms) | strategy, multiplayer | 2026-10-19T03:03:53.432Z |
| SHITle | [详情](https://playbloo.net/game/shitle) | puzzle, casual | 2026-10-19T03:03:57.358Z |
| Spirestorm | [详情](https://playbloo.net/game/spirestorm) | action, arcade | 2026-10-19T03:04:09.454Z |

## 已拒绝

| 投稿 | 原因 |
|---|---|
| The Raincheck Pin | The submitted official playable page returns HTTP 404 (GitHub Pages File not found) on repeated requests. No currently working official replacement was verified; cannot publish a playable listing. |
| K1 Gaming | The supplied URL is K1 Gaming, an 18+ hub containing 16 casino-style/free-credit games, rather than a specific game. Its official home and Terms confirm slots, roulette, blackjack and other titles using virtual credits. This submission does not identify one browser game suitable for this single-game directory; reject the hub submission rather than inventing a game entry. No claim of real-money deposits or withdrawals is made: the Terms explicitly rule those out. |
| Big Market Simulator | 官方 Steam 为 Windows 下载游戏；提供可下载 demo，未发现可验证的浏览器版本。用户已明确仅收录浏览器游戏，故拒绝此投稿。 |
| Industeria | 官方 Steam 为 Windows 工厂建造/殖民地防守下载游戏；demo 也是下载版，未核实到浏览器版，按用户限定拒绝。 |
| AVALANCHE | 官方发行版是付费 Windows Steam 下载游戏，没有验证到浏览器版本。按用户限定拒绝。 |
| NICO DRAW | 官方 Steam 为 Windows 原生游戏，提供下载 demo；未核实到 HTML5 或浏览器入口，按用户限定拒绝。 |
| Dude, Trust Me | 官方说明为 Windows/macOS Steam 下载游戏，免费 demo 仍需下载；无已验证浏览器版本，按用户限定拒绝。 |
| Cartoon Crime | 官方已明确 Windows PC / Steam Early Access，付费下载，无浏览器可玩版本，按用户限定拒绝。 |
| Blind Opera | Blind Opera 为付费原生 Apple App（iOS/iPadOS/macOS/visionOS），没有已核实浏览器版本。投稿 US App Store 链接实际跳转至 CN iPhone Today；GB 官方页面仍可验证游戏身份。按用户仅收录浏览器游戏要求拒绝。 |

## 内容、字段与素材

- 29 款均已填写英文介绍、简短介绍、玩法、操作、技巧及特性，并关联既有分类。仅采用核实过的信息；作者、收费范围、精确发行/更新日期等未知项保持 null，逐项依据及缺项见 JSON manifest。
- Spirestorm 原投稿为 Steam，但另有开发者官方 HTML5 预览；仅收录浏览器预览，游玩外链指向 itch，不将下载 demo 或付费完整版内容写成预览版现有功能。
- After Hours 只免费提供第一章，正文明确两人独立浏览器会话及付费后续；Cubewords、Duck Frenzy 等保留免费与可选付费范围。Orbital Foundry 明确早期 alpha、账号要求和只读 demo。SHITle 保留标题/目标含粗口说明。
- 保存完善后的 extracted_data、审核时间、关联游戏 ID 与审核理由；通过条目标记 approved，拒绝条目标记 rejected。原始投稿来源及 notes 保留，人工核实方式记录于 _editorial_review。
- 28 张官方封面、5 张截图，合计 33 张 WebP、931,754 字节；封面最长边不超过 640px，截图不超过 1280px，不放大。均已公开访问并核对类型、字节和 SHA-256；封面联系表已目视核对。素材位于 game-media 的 covers/submissions-2026-10-19/ 与 screenshots/submissions-2026-10-19/。
- Galaxy Miner 官方分享图是通用图库照片，未冒充游戏封面，保留站点占位图。U1/QQQ 使用官方品牌或加载画面，不称为实际游玩截图。
- 沿用官方外链游玩，未设置未经验证的 iframe。研究使用官方说明及公开静态文件，不宣称完整试玩；没有创建试玩账号、付费交易、发送邮件或消息。

## 验证

- 逐个先建未发布草稿、写分类、回读字段并验证匿名不可见，再以实际发布动作写入 updated_at。没有创建 Added to PlayBloo 游戏版本更新记录。
- 29/29 匿名公开游戏可读、投稿 approved_game_id 关联正确；29/29 线上详情 HTTP 200，实际五栏、标题、外链、镜像封面均通过，未出现 /_next/image。首页 HTTP 200，可见本批 20 款。
- 原有 990 条游戏的非统计字段、发布状态和时间戳不变，原有分类关联不变；访问/游玩/热度计数的自然变化不视为内容修改。
- npm run build 通过（含 TypeScript 检查）；目标 ESLint 通过；sitemap 分页回归测试 3/3 通过，覆盖超过 1,000 条、草稿排除、后页分类计数、整页边界与数据库失败拒绝返回半份结果。

## Sitemap 与 llms.txt

- 本轮公开目录超过 1,000 条，修复 src/app/sitemap.ts 的单次查询上限：按稳定 id 分页读取所有公开游戏。未更改老游戏更新时间或 sitemap 日期规则。
- 构建 sitemap 包含全部 1,012 个公开游戏；29/29 新游戏 URL 收录，lastmod 等于实际发布时刻；983 个原公开游戏 lastmod 与基线一致，7 条原草稿排除。本轮无下架、删除或新增关卡。
- 线上 sitemap HTTP 200，当前仍返回导入前缓存，本批收录 0/29；已有线上 XML 中老游戏时间戳变化 0 条。分页代码修复仅在本地，尚未部署；本轮没有管理员会话缓存失效或代码部署，不以本地构建通过冒充线上已刷新。
- public/llms.txt 已检查，现有浏览器目录、外链游玩、投稿审核、路由和 sitemap 说明与实现一致，无需修改。

## 交付范围

数据库审核状态、新游戏及公开素材已生效。仓库改动包括本报告、JSON manifest、sitemap 分页修复及回归测试。保留用户原有 wrangler.jsonc 修改，未纳入本轮提交。没有 Git push 或部署。

同名 JSON manifest 保存逐条来源、实际写入字段、缺项、图片哈希、游戏/投稿 ID、发布时间和验证结果；未复制投稿邮箱、请求指纹或下载版评测兑换码。
