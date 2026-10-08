# itch.io 批量导入记录 · 2026-10-08

来源：用户提供的「itch.io 新游戏速递 · 2026-10-08」清单，共 277 条，导出时间 05:42。原清单详情抓取均失败，因此没有直接采用导出中的未核实详情。

本批新增 **259 款公开游戏**、**7 款未发布草稿**；另有 **11 条未导入**。数据库共 334 款，其中 327 款公开。

## 资料与内容处理

- 重新读取每个可访问的 itch.io 官方项目页，核对名称、作者、简介、类型、开发状态、引擎和公开浏览器入口；介绍过少时补读官方游戏入口的说明及公开文本。
- 英文介绍重新撰写，沿用站点现有语言。资料来源不限官方页面：检索玩法攻略、评测、玩家讨论，并与具体作者、版本及公开入口交叉核对；补充能确认的玩法、操作和功能。提示由已核实机制推导，未冒称官方攻略或实际试玩结论。7 款无法确定玩法的项目保留为未发布、未核实草稿。
- 纠正官方名称变化，例如 Torn Apart、Tight Flight；经典游戏 Simulator 系列实际是自动演示及视角交互，未写成传统可操纵重制版。
- 区分试玩版、原型和未来计划；Just Hit Play 标注为 freemium，并在介绍说明额外音乐包付费；Space Odyssey 标注为 freemium，明确免费版仅前两个区域、三艘船，完整版另需付费解锁。价格字段针对当前浏览器版本。
- 以作者加项目路径标识 itch 项目（`creator/project`），避免不同作者的同名 2D Shooter 被错误合并。输入 180 跳转至输入 179 的 SpaceBlaster，仅导入一次。
- 使用官方外链游玩，未嵌入 iframe。`source_type=itch.io`、`platforms=[browser]`；公开条目的 `content_verified=true`，附来源及核实时间。
- `added_at` 仅记录真实入库时间；本批 `release_date`、`last_updated_at` 均留空，没有把上架或入库时间当作游戏发售/更新时间，未新增 `game_updates`。

## 详情补充

- 本批 259 款公开游戏均有 About 和 Features；184 款 About 进一步扩写。补充后 How to Play 为 241 款、Controls 为 198 款、Tips & Tricks 为 226 款。
- 逐款组织具体目标、玩法流程、可用操作、机制相关建议和已存在功能；没有把同类游戏的常见按键、作者未来计划或付费完整版内容误写为当前免费版功能。
- 少数刚发布的项目在网页检索及公开入口中仍缺少具体说明，About 和 Features 相应保持简短；无法核实的玩法、按键或策略仍留空。仅说明支持键盘/手柄、但未说明具体按键的项目如实注明。
- Appendages Akimbo 核实了赛前准备、装备、肢体技能检定和自尊机制；Soulbinder 补入收服、队伍、任务、进化与存档；Beat Rally 补入对战、节奏练习、导入音乐和操作设置。
- 资料较丰富的 About 按具体机制扩写；可追溯的额外研究 URL 写入 JSON 中的 `detailResearchSources`，仍缺少的栏目见 `missingDetailFields`。

## 封面与验证

- 镜像 265 张官方封面到公开 Storage：`game-media/covers/2026-10-08/{slug}.webp`。统一压缩为最大宽度 640px 的 WebP，累计由 136.42 MiB 降至 6.81 MiB，体积减少 95.0%。
- 逐张验证公开 URL、`image/webp` 类型及字节一致性，全部通过。公开游戏有 258 张封面；A recent conversaton 没有官方封面，保留站点默认占位图。
- 先写入未发布记录，再绑定 413 条分类关系；发布前回读逐字段核对，发布后再次验证公开状态、来源和空日期字段。
- 68 款原有游戏的内容及分类关系保持原样；原有更新记录未改动。
- 259 个新增公开详情页逐一请求验证，均返回 200，且包含对应标题、扩写后的 About、所有已填写详情栏目及官方来源链接。
- `npm run build` 通过，生成 380 个静态页面，其中包含全部 327 个公开游戏详情页；构建中的 TypeScript 检查通过。
- 使用匿名凭据验证 RLS：259 款新增公开游戏可读，7 款草稿均不可读。
- 本地生产构建的 sitemap 已收录全部 259 个新增正式 URL，lastmod 日期均为公开上线日 2026-10-08；7 款草稿均未收录。68 款老游戏的时间戳与本轮修改前一致。线上 `/sitemap.xml` 仍返回 106 个 URL 的旧 Vercel 缓存，普通请求、查询参数、Cache-Control 和 Pragma 刷新均未使其更新，尚需通过后台失效或生产部署刷新。
- 检查并同步 `public/llms.txt`：修正大部分游戏内嵌游玩的过时描述，补充外链游玩和免费试玩/可选付费内容说明。此静态文档为本地修改，随后续代码部署发布。
- 首页缓存已刷新，准确匹配到 14 个本批新游戏链接；首页新增封面两种宽度共 28 个图片优化 URL 均返回有效图片，并已预热。
- 导入清单及逐条封面校验数据见 [itch-import-2026-10-08.json](./itch-import-2026-10-08.json)。该文件仅保留整理后的元数据和原创摘要，不包含服务凭据或官方全文。

## 公开游戏

| 输入序号 | 游戏 | 分类 | 官方来源 |
|---|---|---|---|
| 2 | [Shroom Service](https://playbloo.net/game/shroom-service) | platformer | [itch.io](https://bstropas.itch.io/shroom-service) |
| 3 | [Buddy the Unlucky Fox](https://playbloo.net/game/buddy-the-unlucky-fox2) | platformer, arcade | [itch.io](https://jakeyanimations.itch.io/buddy-the-unlucky-fox2) |
| 4 | [Monster Lab — Alpha Test](https://playbloo.net/game/monster-lab-alpha-test) | survival, action | [itch.io](https://mond2204.itch.io/monster-lab-alpha-test) |
| 5 | [ハニカム同時ターンバトル（パワーアップ版・試作）](https://playbloo.net/game/honeycomb-turn-battle-powerup) | strategy | [itch.io](https://pe-kun333.itch.io/honeycomb-turn-battle-powerup) |
| 6 | [Bombitas](https://playbloo.net/game/bombitas) | puzzle, action | [itch.io](https://haegame.itch.io/bombitas) |
| 7 | [Valley Void](https://playbloo.net/game/valley-void) | shooting, arcade | [itch.io](https://fan047.itch.io/valley-void) |
| 8 | [Who is You?](https://playbloo.net/game/who-is-you) | puzzle | [itch.io](https://chuuchuu2.itch.io/who-is-you) |
| 9 | [A City at Worlds End](https://playbloo.net/game/a-city-at-worlds-end) | rpg | [itch.io](https://marcusmckain.itch.io/a-city-at-worlds-end) |
| 10 | [Reinett](https://playbloo.net/game/reinett) | survival, horror | [itch.io](https://mynameisirfan101.itch.io/reinett) |
| 11 | [Graveyard Shift](https://playbloo.net/game/graveyard-shift) | horror, action | [itch.io](https://brimstone-engine.itch.io/graveyard-shift) |
| 12 | [Joe Labyrinth](https://playbloo.net/game/joe-labyrinth) | adventure | [itch.io](https://scrufftuna.itch.io/joe-labyrinth) |
| 13 | [ECOS — Réplica](https://playbloo.net/game/ecos-rplica) | puzzle | [itch.io](https://akrobot.itch.io/ecos-rplica) |
| 14 | [Aura Battle](https://playbloo.net/game/aura-battle) | card, strategy | [itch.io](https://yashyyash.itch.io/aura-battle) |
| 15 | [Cairnmoor](https://playbloo.net/game/cairnmoor) | rpg, multiplayer | [itch.io](https://cairnmoor.itch.io/cairnmoor) |
| 16 | [Supuranki スプランキ(2006)](https://playbloo.net/game/supuranki-2006) | music | [itch.io](https://santyanimations7776.itch.io/supuranki-2006) |
| 17 | [Rooster Battle](https://playbloo.net/game/rooster-battle) | card, simulation | [itch.io](https://cristian3607.itch.io/rooster-battle) |
| 18 | [Undertow](https://playbloo.net/game/undertow) | action, horror | [itch.io](https://lelandrangel.itch.io/undertow) |
| 19 | [Madcap Monarchs](https://playbloo.net/game/madcap-monarchs) | strategy, simulation | [itch.io](https://oddhatgames.itch.io/madcap-monarchs) |
| 20 | [Everland: Save the Town — Early Playtest](https://playbloo.net/game/everland-playtest) | adventure, action | [itch.io](https://bjoc-engineering.itch.io/everland-playtest) |
| 21 | [ฮอร์โมน adventure](https://playbloo.net/game/game3) | educational, platformer | [itch.io](https://ladawancpnru.itch.io/game3) |
| 22 | [Tom Escape - Class dismissed, Skeleton](https://playbloo.net/game/tom-escape-skeleton) | puzzle | [itch.io](https://snowchona.itch.io/tom-escape-skeleton) |
| 23 | [Neon Dodge – Boss Edition](https://playbloo.net/game/neon-dodge-boss-edition) | arcade, action | [itch.io](https://neon-pulse-interactive.itch.io/neon-dodge-boss-edition) |
| 24 | [Lazy Milk River - Cookie Jam 5](https://playbloo.net/game/lazy-milk-river-cookie-jam) | casual | [itch.io](https://smetsqueen.itch.io/lazy-milk-river-cookie-jam) |
| 25 | [2D Shooter](https://playbloo.net/game/2d-shooter) | shooting | [itch.io](https://oscillatingghost.itch.io/2d-shooter) |
| 26 | [Shadow & Stone](https://playbloo.net/game/shadow-stone) | puzzle | [itch.io](https://errravy.itch.io/shadow-stone) |
| 27 | [DDR Any MP3](https://playbloo.net/game/ddr-any-mp3) | music | [itch.io](https://joshcreeper3-software.itch.io/ddr-any-mp3) |
| 28 | [sprout snail](https://playbloo.net/game/sprout-snail) | platformer | [itch.io](https://lynnnguyen3219.itch.io/sprout-snail) |
| 29 | [Hospital Zombies](https://playbloo.net/game/hospital-zombies) | survival, horror | [itch.io](https://kevinkevincrmcom.itch.io/hospital-zombies) |
| 30 | [Stock to Dock](https://playbloo.net/game/stock-to-dock) | platformer | [itch.io](https://patrickly.itch.io/stock-to-dock) |
| 31 | [2D Shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial) | shooting | [itch.io](https://nickmichael6294.itch.io/2d-shooter-tutorial) |
| 32 | [Space Cyclone Warriors](https://playbloo.net/game/space-cyclone-warriors) | shooting, action | [itch.io](https://logan8383.itch.io/space-cyclone-warriors) |
| 34 | [Ancestors' Arena - Arène des Ancêtres](https://playbloo.net/game/ancestors-arena-arne-des-anctres) | strategy | [itch.io](https://marc254.itch.io/ancestors-arena-arne-des-anctres) |
| 35 | [Abyss Glow](https://playbloo.net/game/abyss-glow) | arcade, casual | [itch.io](https://blaints.itch.io/abyss-glow) |
| 36 | [NEO IDLE](https://playbloo.net/game/neo-idle) | idle, rpg | [itch.io](https://basgames.itch.io/neo-idle) |
| 37 | [Ruins of Time](https://playbloo.net/game/ruins-of-time) | simulation | [itch.io](https://thecanaanone.itch.io/ruins-of-time) |
| 38 | [Sprunki 1997 Archive](https://playbloo.net/game/sprunki-1997-archive) | music | [itch.io](https://tugluck.itch.io/sprunki-1997-archive) |
| 39 | [Echoes Below](https://playbloo.net/game/e) | rpg, adventure | [itch.io](https://rexito111.itch.io/e) |
| 40 | [4D Snake with Time travel and Quantum Physics](https://playbloo.net/game/4d-snake-with-time-travel-and-quantum-physics) | puzzle, arcade | [itch.io](https://upgamer.itch.io/4d-snake-with-time-travel-and-quantum-physics) |
| 41 | [Sunken Hollow](https://playbloo.net/game/sunken-hollow) | adventure, rpg | [itch.io](https://monkeypants2013.itch.io/sunken-hollow) |
| 42 | [9 To Life](https://playbloo.net/game/9-to-life) | simulation | [itch.io](https://gokyandbegets.itch.io/9-to-life) |
| 43 | [2D Shooter](https://playbloo.net/game/2d-shooter-ce18) | shooting | [itch.io](https://ce18.itch.io/2d-shooter) |
| 44 | [ハニカム同時ターンバトル（試作版）](https://playbloo.net/game/honeycomb-turn-battle) | strategy | [itch.io](https://pe-kun333.itch.io/honeycomb-turn-battle) |
| 45 | [Reiver: Against the Pale Architect](https://playbloo.net/game/reiver) | rpg, strategy | [itch.io](https://simianspark.itch.io/reiver) |
| 46 | [iDig Pixels](https://playbloo.net/game/idig-pixels) | puzzle, arcade | [itch.io](https://theorian.itch.io/idig-pixels) |
| 47 | [Dark frontier](https://playbloo.net/game/dark-frontier) | strategy, survival | [itch.io](https://dark-frontier.itch.io/dark-frontier) |
| 48 | [Hamster Launch](https://playbloo.net/game/hamster-launch) | arcade, casual | [itch.io](https://gamgtq.itch.io/hamster-launch) |
| 49 | [Dino Diner](https://playbloo.net/game/dino-diner) | simulation | [itch.io](https://gamgtq.itch.io/dino-diner) |
| 50 | [Line Pour](https://playbloo.net/game/line-pour) | puzzle | [itch.io](https://gamgtq.itch.io/line-pour) |
| 51 | [Inner Clock](https://playbloo.net/game/inner-clock) | puzzle, music | [itch.io](https://gamgtq.itch.io/inner-clock) |
| 52 | [Squishy Lab](https://playbloo.net/game/squishy-lab) | simulation, casual | [itch.io](https://gamgtq.itch.io/squishy-lab) |
| 53 | [Turf Rollers](https://playbloo.net/game/turf-rollers) | arcade, strategy | [itch.io](https://gamgtq.itch.io/turf-rollers) |
| 54 | [Shard Crusher](https://playbloo.net/game/shard-crusher) | action | [itch.io](https://gamgtq.itch.io/shard-crusher) |
| 55 | [Dice Charm](https://playbloo.net/game/dice-charm) | strategy | [itch.io](https://gamgtq.itch.io/dice-charm) |
| 56 | [Ten-Minute Doodle Swarm](https://playbloo.net/game/ten-minute-doodle-swarm) | survival, action | [itch.io](https://gamgtq.itch.io/ten-minute-doodle-swarm) |
| 57 | [Fair Slice](https://playbloo.net/game/fair-slice) | arcade | [itch.io](https://gamgtq.itch.io/fair-slice) |
| 58 | [Pagoda Stack](https://playbloo.net/game/pagoda-stack) | arcade | [itch.io](https://gamgtq.itch.io/pagoda-stack) |
| 59 | [Color land (beta)](https://playbloo.net/game/color-land-beta) | music | [itch.io](https://pvzbfdigamer.itch.io/color-land-beta) |
| 60 | [Hook Hopper](https://playbloo.net/game/hook-hopper) | platformer, action | [itch.io](https://gamgtq.itch.io/hook-hopper) |
| 61 | [Life Garden](https://playbloo.net/game/life-garden) | puzzle | [itch.io](https://gamgtq.itch.io/life-garden) |
| 62 | [Emoji Groups](https://playbloo.net/game/emoji-groups) | puzzle | [itch.io](https://gamgtq.itch.io/emoji-groups) |
| 63 | [Dungeon Sweeper](https://playbloo.net/game/dungeon-sweeper) | puzzle, rpg | [itch.io](https://gamgtq.itch.io/dungeon-sweeper) |
| 64 | [Tilt Jar](https://playbloo.net/game/tilt-jar) | puzzle | [itch.io](https://gamgtq.itch.io/tilt-jar) |
| 65 | [Pixel Belt](https://playbloo.net/game/pixel-belt) | puzzle | [itch.io](https://gamgtq.itch.io/pixel-belt) |
| 66 | [Cattleship](https://playbloo.net/game/cattleship) | strategy, board-game | [itch.io](https://mdawg74.itch.io/cattleship) |
| 67 | [Sand Drop](https://playbloo.net/game/sand-drop) | puzzle | [itch.io](https://gamgtq.itch.io/sand-drop) |
| 68 | [how to care for a rejected lamb](https://playbloo.net/game/how-to-care-for-a-rejected-lamb) | casual | [itch.io](https://gir1burd3n.itch.io/how-to-care-for-a-rejected-lamb) |
| 70 | [Tap Drift](https://playbloo.net/game/tap-drift) | racing, arcade | [itch.io](https://gamgtq.itch.io/tap-drift) |
| 71 | [Apocalypse Zero](https://playbloo.net/game/apocalypsezero) | survival, horror | [itch.io](https://macricol.itch.io/apocalypsezero) |
| 72 | [Deadzone City｜都市獵殺](https://playbloo.net/game/deadzone-city) | strategy, survival | [itch.io](https://york20275.itch.io/deadzone-city) |
| 73 | [2D Shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial-brady1907) | shooting | [itch.io](https://brady1907.itch.io/2d-shooter-tutorial) |
| 74 | [PolyTrail](https://playbloo.net/game/polytrail) | survival, simulation | [itch.io](https://cat1415.itch.io/polytrail) |
| 75 | [Polvo & Deudas](https://playbloo.net/game/polvo-deudas) | simulation, idle | [itch.io](https://kinx25.itch.io/polvo-deudas) |
| 76 | [DEAD AIR: Night Frequency](https://playbloo.net/game/dead-air-night-frequency) | horror, casual | [itch.io](https://doomsorrow.itch.io/dead-air-night-frequency) |
| 77 | [ONE MILLION HP](https://playbloo.net/game/one-million-hp) | clicker, multiplayer | [itch.io](https://conrad-randy.itch.io/one-million-hp) |
| 78 | [2D Shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial-jacksondemsse) | shooting, arcade | [itch.io](https://jacksondemsse.itch.io/2d-shooter-tutorial) |
| 79 | [jogocoringa](https://playbloo.net/game/jogocoringa) | adventure | [itch.io](https://biel304.itch.io/jogocoringa) |
| 80 | [2D Shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial-tarroant) | shooting | [itch.io](https://tarroant.itch.io/2d-shooter-tutorial) |
| 81 | [Opus 5.5 Cathedral!](https://playbloo.net/game/opus-55-cathedral) | simulation | [itch.io](https://heromouteut-ai.itch.io/opus-55-cathedral) |
| 82 | [SyndicateIO](https://playbloo.net/game/sndcio) | shooting, rpg, multiplayer | [itch.io](https://neoncuttlefish.itch.io/sndcio) |
| 85 | [Little Test Dummy](https://playbloo.net/game/little-test-dummy) | simulation, casual | [itch.io](https://theodawg.itch.io/little-test-dummy) |
| 86 | [BGOAT Skate Merge](https://playbloo.net/game/bgoat-skate-merge) | puzzle | [itch.io](https://bgoatgames.itch.io/bgoat-skate-merge) |
| 87 | [One Must Imagine Grappling](https://playbloo.net/game/one-must-imagine-grappling) | platformer | [itch.io](https://prismaticdaze.itch.io/one-must-imagine-grappling) |
| 88 | [BanSPLODE!](https://playbloo.net/game/bansplode) | action | [itch.io](https://antonythingz.itch.io/bansplode) |
| 90 | [2D Shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial-sambeginski919) | shooting | [itch.io](https://sambeginski919.itch.io/2d-shooter-tutorial) |
| 91 | [Christmas Time](https://playbloo.net/game/christmas-time) | platformer | [itch.io](https://antonythingz.itch.io/christmas-time) |
| 92 | [Spooky Survivors](https://playbloo.net/game/spooky-survivors) | survival, action | [itch.io](https://antonythingz.itch.io/spooky-survivors) |
| 93 | [The Candy Man](https://playbloo.net/game/thecandyman) | survival, horror | [itch.io](https://santidevgames.itch.io/thecandyman) |
| 94 | [Cubby Roll](https://playbloo.net/game/cubby-roll) | puzzle | [itch.io](https://nvyyy.itch.io/cubby-roll) |
| 95 | [Soulbinder of Hollowmire](https://playbloo.net/game/soulbinder-of-hollowmire) | rpg | [itch.io](https://waldemarcleaver.itch.io/soulbinder-of-hollowmire) |
| 96 | [Mission: Return Home!](https://playbloo.net/game/mission-return-home) | shooting, action | [itch.io](https://chloereednordwall.itch.io/mission-return-home) |
| 97 | [RAW WAR](https://playbloo.net/game/raw-war) | strategy, action | [itch.io](https://rdpgg.itch.io/raw-war) |
| 98 | [Teamfight Draft](https://playbloo.net/game/teamfight-draft) | strategy | [itch.io](https://angeryapple.itch.io/teamfight-draft) |
| 99 | [夜市串燒戰鬥陀螺](https://playbloo.net/game/nightmarket-skewer-battle) | strategy, simulation | [itch.io](https://newzero7086-ops.itch.io/nightmarket-skewer-battle) |
| 100 | [HTML Simulator / HTML 시뮬레이터](https://playbloo.net/game/html-simulator) | simulation, educational | [itch.io](https://minguhongmfg.itch.io/html-simulator) |
| 101 | [A recent conversaton](https://playbloo.net/game/a-recent-conversaton) | casual | [itch.io](https://potepatchi.itch.io/a-recent-conversaton) |
| 102 | [Georges Perec Simulator / 조르주 페렉 시뮬레이터](https://playbloo.net/game/georges-perec-simulator) | puzzle, educational | [itch.io](https://minguhongmfg.itch.io/georges-perec-simulator) |
| 103 | [Bomberman Simulator / 봄버맨 시뮬레이터](https://playbloo.net/game/bomberman-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/bomberman-simulator) |
| 104 | [Laundry](https://playbloo.net/game/laundry) | casual | [itch.io](https://russianbot.itch.io/laundry) |
| 105 | [Snake Shooter](https://playbloo.net/game/snake-shooter) | shooting, survival | [itch.io](https://claravolpato.itch.io/snake-shooter) |
| 106 | [Breakout Simulator / 브레이크아웃 시뮬레이터](https://playbloo.net/game/breakout-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/breakout-simulator) |
| 107 | [IRONROAD](https://playbloo.net/game/ironroad) | fighting, action | [itch.io](https://csaf.itch.io/ironroad) |
| 108 | [dishes?](https://playbloo.net/game/dishes) | casual | [itch.io](https://rreveriee.itch.io/dishes) |
| 109 | [Indridi Indridason](https://playbloo.net/game/indridi-indridason) | adventure, casual | [itch.io](https://rolloroyce.itch.io/indridi-indridason) |
| 110 | [Bubble Bobble Simulator / 버블 보블 시뮬레이터](https://playbloo.net/game/bubble-bobble-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/bubble-bobble-simulator) |
| 111 | [Emails](https://playbloo.net/game/emails) | casual | [itch.io](https://iambrettsoha.itch.io/emails) |
| 112 | [The Skeleton Cave & Other TinyChoice Games](https://playbloo.net/game/trashcastle-tinychoice-games) | adventure, casual | [itch.io](https://trashcastle.itch.io/trashcastle-tinychoice-games) |
| 113 | [Drift Maze](https://playbloo.net/game/drift-maze) | racing | [itch.io](https://plusultra29.itch.io/drift-maze) |
| 114 | [OH, BAKER!](https://playbloo.net/game/oh-baker) | platformer, puzzle | [itch.io](https://taped-shrimp.itch.io/oh-baker) |
| 115 | [Blade of the Ronin](https://playbloo.net/game/blade-of-the-ronin) | fighting, rpg | [itch.io](https://oneboringdad.itch.io/blade-of-the-ronin) |
| 116 | [Asteroid Simulator / 애스터로이드 시뮬레이터](https://playbloo.net/game/asteroid-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/asteroid-simulator) |
| 117 | [FazendaTycoon](https://playbloo.net/game/fazendatycoon) | simulation | [itch.io](https://gabriel786.itch.io/fazendatycoon) |
| 118 | [Pac-Man Simulator / 팩맨 시뮬레이터](https://playbloo.net/game/pac-man-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/pac-man-simulator) |
| 119 | [Here, Again｜又见此间](https://playbloo.net/game/here-again) | puzzle | [itch.io](https://hijackxu.itch.io/here-again) |
| 120 | [Grub Stew](https://playbloo.net/game/grub-stew) | puzzle | [itch.io](https://totallyjosiah.itch.io/grub-stew) |
| 121 | [Space Invaders Simulator / 스페이스 인베이더 시뮬레이터](https://playbloo.net/game/space-invaders-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/space-invaders-simulator) |
| 122 | [Duality](https://playbloo.net/game/duality) | arcade, puzzle | [itch.io](https://danielmiclos.itch.io/duality) |
| 123 | [Super Mario Bros. Simulator / 슈퍼 마리오 브라더스 시뮬레이터](https://playbloo.net/game/super-mario-bros-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/super-mario-bros-simulator) |
| 124 | [Laser Dodge Game](https://playbloo.net/game/laser-dodge-game) | action | [itch.io](https://nafisaislam.itch.io/laser-dodge-game) |
| 125 | [2D Shooter](https://playbloo.net/game/2d-shooter-cupiya) | shooting | [itch.io](https://cupiya.itch.io/2d-shooter) |
| 126 | [The Last Tram](https://playbloo.net/game/the-last-tram) | simulation, horror | [itch.io](https://jurixd.itch.io/the-last-tram) |
| 127 | [Tetris Simulator / 테트리스 시뮬레이터](https://playbloo.net/game/tetris-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/tetris-simulator) |
| 128 | [Corruptbox but Sprunki 3: Infected War (CHAO100'S TAKE) REMASTER](https://playbloo.net/game/corruptbox-but-sprunki-3-infected-war-chao100s-take-remaster) | music | [itch.io](https://chao100.itch.io/corruptbox-but-sprunki-3-infected-war-chao100s-take-remaster) |
| 129 | [Carry The One](https://playbloo.net/game/carry-the-one) | puzzle, strategy | [itch.io](https://cazisaprogrammer.itch.io/carry-the-one) |
| 130 | [Corruptbox but sprunki 2: Redirection](https://playbloo.net/game/corruptboxbutsprunki2redirection) | music | [itch.io](https://chao100.itch.io/corruptboxbutsprunki2redirection) |
| 131 | [OFFBOARDING.](https://playbloo.net/game/offboarding) | survival, action | [itch.io](https://milkmanuk.itch.io/offboarding) |
| 132 | [The God of Bureaucracy](https://playbloo.net/game/the-god-of-bureaucracy) | simulation | [itch.io](https://psihozkakblago.itch.io/the-god-of-bureaucracy) |
| 133 | [Closest Call](https://playbloo.net/game/closest-call) | card, strategy, multiplayer | [itch.io](https://closestcall100.itch.io/closest-call) |
| 134 | [SHAPE-O-CHET ENDLESS](https://playbloo.net/game/shape-o-chet-endless) | platformer, arcade | [itch.io](https://acidicthoughts.itch.io/shape-o-chet-endless) |
| 135 | [Amzon](https://playbloo.net/game/amzon) | action | [itch.io](https://fivendie.itch.io/amzon) |
| 136 | [Torn Apart](https://playbloo.net/game/your-avergage-rouguelike) | platformer, action | [itch.io](https://walrobot39.itch.io/your-avergage-rouguelike) |
| 137 | [Corruptbox but SPRUNKI (CHAO100'S TAKE) REMASTERED](https://playbloo.net/game/corruptboxbutsprunki1remastered) | music | [itch.io](https://chao100.itch.io/corruptboxbutsprunki1remastered) |
| 138 | [Mini Racing Game](https://playbloo.net/game/mini-racing-game) | racing | [itch.io](https://sergiicanada.itch.io/mini-racing-game) |
| 139 | [2D Shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial-rennfrii) | shooting | [itch.io](https://rennfrii.itch.io/2d-shooter-tutorial) |
| 140 | [Joga Boleiro](https://playbloo.net/game/joga-boleiro) | simulation, sports | [itch.io](https://novaiswill.itch.io/joga-boleiro) |
| 141 | [Backrooms Sovereign](https://playbloo.net/game/backrooms-sovereign) | simulation, strategy | [itch.io](https://justidlegames.itch.io/backrooms-sovereign) |
| 142 | [Lanterns of Aldermere](https://playbloo.net/game/lanterns-of-aldermere) | rpg | [itch.io](https://rivetmothgames.itch.io/lanterns-of-aldermere) |
| 143 | [My Sweet Sugar TD](https://playbloo.net/game/my-sweet-sugar-td) | strategy | [itch.io](https://adolfosalinas.itch.io/my-sweet-sugar-td) |
| 144 | [KRYVOLT Signal Routing Playtest](https://playbloo.net/game/kryvolt-signal-routing-playtest) | puzzle | [itch.io](https://yokosan7777.itch.io/kryvolt-signal-routing-playtest) |
| 145 | [knight battles childeren](https://playbloo.net/game/knight-battles-childeren-for-some-reson-i-dont-know) | action | [itch.io](https://cwgeiss.itch.io/knight-battles-childeren-for-some-reson-i-dont-know) |
| 146 | [Ticking Time Bombs!](https://playbloo.net/game/ticking-time-bombs) | arcade, puzzle | [itch.io](https://fruted.itch.io/ticking-time-bombs) |
| 147 | [Vigornu](https://playbloo.net/game/vigornu) | action, survival | [itch.io](https://manfish3am.itch.io/vigornu) |
| 148 | [Un Pacman en el Savoy](https://playbloo.net/game/un-pacman-en-el-savoy) | music, arcade | [itch.io](https://marcosamigorena.itch.io/un-pacman-en-el-savoy) |
| 149 | [Local slime infestation](https://playbloo.net/game/local-slime-infestation) | platformer, adventure | [itch.io](https://sleepymacaroni.itch.io/local-slime-infestation) |
| 150 | [Arqueiro: Em Busca do Arco Dourado](https://playbloo.net/game/arcodourado) | platformer, survival | [itch.io](https://snakextgames.itch.io/arcodourado) |
| 151 | [Rescate Blindado](https://playbloo.net/game/rescate-blindado) | shooting, action | [itch.io](https://clairvoyantsight.itch.io/rescate-blindado) |
| 153 | [GatMao (v.finished)](https://playbloo.net/game/gatmao-ja) | educational, trivia | [itch.io](https://dorority.itch.io/gatmao-ja) |
| 154 | [Slender 1KB](https://playbloo.net/game/slender-1kb) | survival, horror | [itch.io](https://tgm-corps.itch.io/slender-1kb) |
| 155 | [ABISMO NOCTURNO](https://playbloo.net/game/abismo-nocturno) | platformer, action | [itch.io](https://elwerogameplay.itch.io/abismo-nocturno) |
| 156 | [Seek Far](https://playbloo.net/game/seek-far) | adventure | [itch.io](https://woodsmoke.itch.io/seek-far) |
| 157 | [Crazy Conga Line](https://playbloo.net/game/crazy-conga-line) | arcade | [itch.io](https://stanleyfamilygames.itch.io/crazy-conga-line) |
| 158 | [TankBattle](https://playbloo.net/game/tankbattle) | shooting, action | [itch.io](https://inyakix.itch.io/tankbattle) |
| 159 | [Bat Survivors](https://playbloo.net/game/bat-survivors) | survival, action | [itch.io](https://aidtylr.itch.io/bat-survivors) |
| 160 | [2009 Roblox Obby (AI Assisted)](https://playbloo.net/game/2009-roblox-obby) | platformer | [itch.io](https://batdev0869.itch.io/2009-roblox-obby) |
| 161 | [Lunestria](https://playbloo.net/game/lunestria) | action | [itch.io](https://aembear.itch.io/lunestria) |
| 162 | [Retro_Gnome_Destroys](https://playbloo.net/game/retro-gnome-destroys) | action | [itch.io](https://cogote666.itch.io/retro-gnome-destroys) |
| 163 | [Kebab.exe](https://playbloo.net/game/kebab-exe) | simulation | [itch.io](https://flantechnique.itch.io/kebab-exe) |
| 164 | [Beat Rally](https://playbloo.net/game/beat-rally) | music, sports | [itch.io](https://gaiger101.itch.io/beat-rally) |
| 165 | [Crimson Street](https://playbloo.net/game/crimson-street) | adventure | [itch.io](https://17sagara.itch.io/crimson-street) |
| 166 | [Descent](https://playbloo.net/game/descent) | platformer, action | [itch.io](https://arynprk.itch.io/descent) |
| 167 | [Orbit Pets](https://playbloo.net/game/orbit-pets) | arcade, casual | [itch.io](https://pixelfriendly.itch.io/orbit-pets) |
| 168 | [Neon PolyPartyRoyale](https://playbloo.net/game/neon-polypartyroyale) | action | [itch.io](https://khandelwalmeer.itch.io/neon-polypartyroyale) |
| 169 | [Appendages Akimbo](https://playbloo.net/game/appendages-akimbo) | casual, adventure | [itch.io](https://greatcirclegames.itch.io/appendages-akimbo) |
| 170 | [Stackapult](https://playbloo.net/game/stackapult) | strategy, arcade | [itch.io](https://glukaz.itch.io/stackapult) |
| 171 | [The Room That Remembers](https://playbloo.net/game/the-room-that-remembers) | horror, puzzle | [itch.io](https://caprigamesoffical.itch.io/the-room-that-remembers) |
| 172 | [Rocco's lil' adventure](https://playbloo.net/game/roccos-lil-adventure) | action | [itch.io](https://stevey-the-dude.itch.io/roccos-lil-adventure) |
| 173 | [Glorious March GBA](https://playbloo.net/game/glorious-march-gba) | shooting, action | [itch.io](https://enarkz.itch.io/glorious-march-gba) |
| 174 | [MechWar](https://playbloo.net/game/mechwar) | strategy | [itch.io](https://apacheah.itch.io/mechwar) |
| 175 | [Pong](https://playbloo.net/game/pong) | arcade | [itch.io](https://f-pet.itch.io/pong) |
| 176 | [The Last Hot Pocket](https://playbloo.net/game/the-last-hot-pocket) | action, multiplayer | [itch.io](https://sirsoftpretzel.itch.io/the-last-hot-pocket) |
| 177 | [Shape Shooter](https://playbloo.net/game/shape-shooter) | shooting | [itch.io](https://taaane.itch.io/shape-shooter) |
| 178 | [EXU: Cavaleiros do Orixá](https://playbloo.net/game/exu-cavaleiros-do-orixa) | rpg | [itch.io](https://mazokazorb.itch.io/exu-cavaleiros-do-orixa) |
| 179 | [Space Blaster](https://playbloo.net/game/space-blaster) | shooting | [itch.io](https://barwickh.itch.io/space-blaster) |
| 181 | [Space Odyssey](https://playbloo.net/game/space-odyssey) | arcade | [itch.io](https://alptraumhavok.itch.io/space-odyssey) |
| 182 | [Stuck in Space](https://playbloo.net/game/stuck-in-space) | action | [itch.io](https://eddysan72.itch.io/stuck-in-space) |
| 184 | [Crystal Keeper](https://playbloo.net/game/crystal-keeper) | strategy, survival | [itch.io](https://mapopro.itch.io/crystal-keeper) |
| 185 | [One More Pass](https://playbloo.net/game/one-more-pass) | idle, sports | [itch.io](https://lucasmon.itch.io/one-more-pass) |
| 186 | [Realmwright \| The Torvaley Chronicles](https://playbloo.net/game/realmwright) | simulation, strategy | [itch.io](https://bryce0107.itch.io/realmwright) |
| 187 | [Rhythm Center](https://playbloo.net/game/rhythm-center) | music | [itch.io](https://pop40009.itch.io/rhythm-center) |
| 188 | [Somewhere, Eventually](https://playbloo.net/game/somewhere-eventually) | idle, simulation | [itch.io](https://aftershift-arcade.itch.io/somewhere-eventually) |
| 189 | [Māori Vocabulary Match](https://playbloo.net/game/maori-vocabulary-match) | educational | [itch.io](https://idbproductions.itch.io/maori-vocabulary-match) |
| 190 | [Math Match](https://playbloo.net/game/math-match) | educational, puzzle | [itch.io](https://idbproductions.itch.io/math-match) |
| 191 | [GANGSTERS](https://playbloo.net/game/gangsters) | action | [itch.io](https://thefish909.itch.io/gangsters) |
| 192 | [Micro Ballers DX 1v1 BASKETBALL](https://playbloo.net/game/micro-ballers-dx-1v1-basketball) | sports, multiplayer | [itch.io](https://gnocchi2433.itch.io/micro-ballers-dx-1v1-basketball) |
| 193 | [MERIDIAN](https://playbloo.net/game/meridian) | casual, adventure | [itch.io](https://birdylight.itch.io/meridian) |
| 194 | [2d Shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial-beckham-o) | shooting | [itch.io](https://beckham-o.itch.io/2d-shooter-tutorial) |
| 195 | [Arcade Collector](https://playbloo.net/game/arcade-collector) | simulation, arcade | [itch.io](https://t-breadhd.itch.io/arcade-collector) |
| 196 | [Coleta Espacial](https://playbloo.net/game/coleta-espacial) | action, survival | [itch.io](https://luigi-csibinelli.itch.io/coleta-espacial) |
| 197 | [Tight Flight](https://playbloo.net/game/tightflight) | arcade | [itch.io](https://monkeymaster291.itch.io/tightflight) |
| 198 | [Onto the West](https://playbloo.net/game/onto-the-west) | shooting, arcade | [itch.io](https://jeremy-martin.itch.io/onto-the-west) |
| 199 | [Pixel Horde](https://playbloo.net/game/xoberlightpixelhorde) | survival, shooting | [itch.io](https://xoberlight.itch.io/xoberlightpixelhorde) |
| 200 | [Claude Dreaming](https://playbloo.net/game/claude-dreaming) | adventure | [itch.io](https://rusty-production.itch.io/claude-dreaming) |
| 201 | [A Strange Application](https://playbloo.net/game/a-strange-application) | horror, simulation | [itch.io](https://sho-kosu-zuki77.itch.io/a-strange-application) |
| 203 | [Doki Doki 3D FPS OnLine!](https://playbloo.net/game/doki-doki-3d-fps-online) | shooting, action | [itch.io](https://raivovittujavnen.itch.io/doki-doki-3d-fps-online) |
| 204 | [Mai Suya](https://playbloo.net/game/mai-suya) | simulation | [itch.io](https://cavienchien.itch.io/mai-suya) |
| 205 | [The Destiny of a Clumsy Wizard](https://playbloo.net/game/the-destiny-of-a-clumsy-wizard) | survival, action | [itch.io](https://ghoststalker.itch.io/the-destiny-of-a-clumsy-wizard) |
| 206 | [Frogtype](https://playbloo.net/game/frogtype) | educational, arcade | [itch.io](https://jusidroppop.itch.io/frogtype) |
| 207 | [Futbolín](https://playbloo.net/game/futbolin) | sports | [itch.io](https://phillipsmorris.itch.io/futbolin) |
| 208 | [Five (Demo)](https://playbloo.net/game/five-demo) | horror, survival | [itch.io](https://mangle39.itch.io/five-demo) |
| 209 | [Flipper](https://playbloo.net/game/flipper) | arcade, casual | [itch.io](https://cagnolinoballante.itch.io/flipper) |
| 210 | [Incremental garden](https://playbloo.net/game/incremental-garden) | puzzle, simulation | [itch.io](https://drovv.itch.io/incremental-garden) |
| 211 | [infinite euphoria](https://playbloo.net/game/infinite-euphoria) | idle, simulation | [itch.io](https://infinite-euphoria.itch.io/infinite-euphoria) |
| 213 | [SPACEBLOB (Prod121-Group 2c)](https://playbloo.net/game/spaceblob) | platformer, adventure | [itch.io](https://lfo71.itch.io/spaceblob) |
| 214 | [Space Zap remake PT 2(WIP)](https://playbloo.net/game/space-zap-remake-pt-2wip) | shooting | [itch.io](https://aero-d.itch.io/space-zap-remake-pt-2wip) |
| 215 | [Mask Attack 3D](https://playbloo.net/game/mask-attack-3d) | action, arcade | [itch.io](https://berlinrider.itch.io/mask-attack-3d) |
| 216 | [Break the Piñatas](https://playbloo.net/game/break-the-pinatas) | idle, clicker | [itch.io](https://lighttriadgames.itch.io/break-the-pinatas) |
| 217 | [2d Space Game](https://playbloo.net/game/2d-space-game) | shooting | [itch.io](https://studentthelearner.itch.io/2d-space-game) |
| 218 | [Get the dog!](https://playbloo.net/game/get-the-dog) | adventure | [itch.io](https://amathyas.itch.io/get-the-dog) |
| 219 | [SPACETRIPS](https://playbloo.net/game/spacetrips) | shooting, arcade | [itch.io](https://mastoc.itch.io/spacetrips) |
| 220 | [Monster Blaster](https://playbloo.net/game/monster-blaster) | platformer, shooting | [itch.io](https://warheadgaming.itch.io/monster-blaster) |
| 221 | [Mask Attack 2D](https://playbloo.net/game/mask-attack) | action, arcade | [itch.io](https://berlinrider.itch.io/mask-attack) |
| 222 | [Idle Keybearer](https://playbloo.net/game/idle-keybearer) | idle, rpg | [itch.io](https://turkeytime.itch.io/idle-keybearer) |
| 223 | [Cookie Eater](https://playbloo.net/game/cookie-eater) | arcade, survival | [itch.io](https://soulofblight.itch.io/cookie-eater) |
| 225 | [Castle Defense: Halloween edition.](https://playbloo.net/game/castle-defense-halloween-edition) | strategy | [itch.io](https://markfriesen1979.itch.io/castle-defense-halloween-edition) |
| 226 | [Carnage Loop](https://playbloo.net/game/carnage-loop) | driving, survival | [itch.io](https://hydroponicz.itch.io/carnage-loop) |
| 228 | [PRG Tower Approach](https://playbloo.net/game/prg-tower-approach) | simulation | [itch.io](https://77kilobyte.itch.io/prg-tower-approach) |
| 229 | [BasketBreak Arcade](https://playbloo.net/game/basketbreak-arcade) | sports, puzzle | [itch.io](https://eblstudiogames.itch.io/basketbreak-arcade) |
| 230 | [Space Invaders](https://playbloo.net/game/space-invaders) | shooting, arcade | [itch.io](https://palat26.itch.io/space-invaders) |
| 231 | [RISM RONIN](https://playbloo.net/game/rism-ronin) | survival, action | [itch.io](https://showgames-fujii.itch.io/rism-ronin) |
| 233 | [Hollow Ridge](https://playbloo.net/game/hollow-ridge) | survival, strategy | [itch.io](https://x0firebird.itch.io/hollow-ridge) |
| 234 | [Babysitter (Phone)](https://playbloo.net/game/babysitter-mobile) | educational, arcade | [itch.io](https://yjcgame.itch.io/babysitter-mobile) |
| 235 | [Drill Juice Farm](https://playbloo.net/game/drill-juice-farm) | idle, simulation | [itch.io](https://twobitsyt.itch.io/drill-juice-farm) |
| 236 | [Blankie Run 2](https://playbloo.net/game/blankie-run-2) | arcade | [itch.io](https://songmeng0402.itch.io/blankie-run-2) |
| 237 | [Я добавлю сюда то что скажешь ты](https://playbloo.net/game/261) | action, rpg | [itch.io](https://roma26.itch.io/261) |
| 238 | [BONES: Graveyard Roll - Demo](https://playbloo.net/game/bones) | platformer, action | [itch.io](https://insomniakdev.itch.io/bones) |
| 240 | [Dream Team: Fantasy Hero Brawler](https://playbloo.net/game/fantasy-battle-roguelite) | fighting, strategy | [itch.io](https://crud-posting-games.itch.io/fantasy-battle-roguelite) |
| 241 | [Bellum atrox](https://playbloo.net/game/bellum-atrox) | strategy, educational | [itch.io](https://leofassb.itch.io/bellum-atrox) |
| 242 | [Kingfall - Act 1](https://playbloo.net/game/kingfall-demo) | card, strategy | [itch.io](https://kingfall.itch.io/kingfall-demo) |
| 243 | [SUPER RANCID DUDES](https://playbloo.net/game/super-rancid-dudes-class-submission) | platformer | [itch.io](https://raffer1337.itch.io/super-rancid-dudes-class-submission) |
| 244 | [Sword Shield Game](https://playbloo.net/game/sword-shield-game) | card, rpg | [itch.io](https://swordshieldgame.itch.io/sword-shield-game) |
| 245 | [BABOY](https://playbloo.net/game/baboy) | driving, action | [itch.io](https://2d-creator.itch.io/baboy) |
| 246 | [The Deck that Fed the Snake](https://playbloo.net/game/the-deck-that-fed-the-snake) | card, idle | [itch.io](https://twyn.itch.io/the-deck-that-fed-the-snake) |
| 247 | [Desktop Factory](https://playbloo.net/game/desktop-factory) | simulation, strategy | [itch.io](https://gigajam.itch.io/desktop-factory) |
| 248 | [Long Suit](https://playbloo.net/game/long-suit) | card | [itch.io](https://launchwaygames.itch.io/long-suit) |
| 250 | [An Evening At Leon's](https://playbloo.net/game/an-evening-at-leons) | adventure, casual | [itch.io](https://tysongrayy.itch.io/an-evening-at-leons) |
| 251 | [Ares-1: Mars Core](https://playbloo.net/game/ares-1-mars-core) | strategy, survival | [itch.io](https://prokurat.itch.io/ares-1-mars-core) |
| 253 | [BABOY RACING](https://playbloo.net/game/baboy-racing) | racing, multiplayer | [itch.io](https://2d-creator.itch.io/baboy-racing) |
| 254 | [Pong Simulator / 퐁 시뮬레이터](https://playbloo.net/game/pong-simulator) | simulation, casual | [itch.io](https://minguhongmfg.itch.io/pong-simulator) |
| 255 | [El ascenso de Murua](https://playbloo.net/game/el-ascenso-de-murua) | simulation, strategy | [itch.io](https://fernando8700.itch.io/el-ascenso-de-murua) |
| 256 | [Just Hit Play ▶](https://playbloo.net/game/just-hit-play) | music, trivia | [itch.io](https://ohmyjosh1.itch.io/just-hit-play) |
| 258 | [Spiretoon Park (Demo)](https://playbloo.net/game/spiretoon-park) | simulation | [itch.io](https://spirevale.itch.io/spiretoon-park) |
| 259 | [TacticMesh](https://playbloo.net/game/tacticmesh) | sports, simulation | [itch.io](https://noddy703.itch.io/tacticmesh) |
| 260 | [Shh! Cat Nap](https://playbloo.net/game/shh-cat-nap) | puzzle | [itch.io](https://alphaiogames.itch.io/shh-cat-nap) |
| 261 | [Duskward](https://playbloo.net/game/duskward) | survival, action | [itch.io](https://soneul.itch.io/duskward) |
| 262 | [Bad sleep](https://playbloo.net/game/bad-sleep) | platformer | [itch.io](https://so-im-parc.itch.io/bad-sleep) |
| 263 | [Survive 20 years (demo)](https://playbloo.net/game/survive-20-years) | simulation, educational | [itch.io](https://vdpmarkets.itch.io/survive-20-years) |
| 264 | [Draw or Die (Demo)](https://playbloo.net/game/draw-or-die-demo) | card, strategy | [itch.io](https://smilejsu82.itch.io/draw-or-die-demo) |
| 265 | [2D Shooter](https://playbloo.net/game/2d-shooter-tutorial-matherl5) | shooting | [itch.io](https://matherl5.itch.io/2d-shooter-tutorial) |
| 266 | [Favela Blocks](https://playbloo.net/game/favela-blocks) | puzzle, arcade | [itch.io](https://awasx777.itch.io/favela-blocks) |
| 267 | [Oldboy Corridor - 2D Pixel Art Mini Game (Demo)](https://playbloo.net/game/oldboy-corridor-2d-pixel-art-mini-game) | fighting, action | [itch.io](https://kolias-png.itch.io/oldboy-corridor-2d-pixel-art-mini-game) |
| 268 | [Chicane Manager](https://playbloo.net/game/chicane-manager) | simulation, racing | [itch.io](https://alex19-bit.itch.io/chicane-manager) |
| 269 | [Dream War Chronicle — Chapter 1 Demo](https://playbloo.net/game/dream-war-chronicle-demo) | rpg, strategy | [itch.io](https://zwhking.itch.io/dream-war-chronicle-demo) |
| 270 | [ping!](https://playbloo.net/game/ping) | arcade, casual | [itch.io](https://h0yu3.itch.io/ping) |
| 271 | [Maldita contraseña](https://playbloo.net/game/maldita-contrasea) | puzzle | [itch.io](https://jiayilin.itch.io/maldita-contrasea) |
| 272 | [Chiptune Hero](https://playbloo.net/game/chiptune-hero) | music | [itch.io](https://kojohan.itch.io/chiptune-hero) |
| 273 | [Sprigwell](https://playbloo.net/game/sprigwell) | puzzle | [itch.io](https://lholhe.itch.io/sprigwell) |
| 274 | [2D shooter Tutorial](https://playbloo.net/game/2d-shooter-tutorial-tannermpete) | shooting | [itch.io](https://tannermpete.itch.io/2d-shooter-tutorial) |
| 275 | [Phaserman - mobile edition](https://playbloo.net/game/phaserman-mobile-edition) | action, survival | [itch.io](https://capsulestudio.itch.io/phaserman-mobile-edition) |
| 276 | [Zombie Dream: Hide in Dark](https://playbloo.net/game/zombie-dream-hide-in-dark) | horror, casual | [itch.io](https://bai-skull.itch.io/zombie-dream-hide-in-dark) |
| 277 | [SIEGE DLE](https://playbloo.net/game/siegedle) | trivia, strategy | [itch.io](https://matute-developer.itch.io/siegedle) |

## 未发布草稿

官方页与公开入口可访问，但没有足以编写具体玩法的说明。以下记录 `is_published=false`、`content_verified=false`，介绍与操作留空，不出现在公开列表。

| 输入序号 | 游戏 | 官方页面 |
|---|---|---|
| 83 | Warrior of Shadows - Web Test | [itch.io](https://funfungames.itch.io/warrior-of-shadows-web-test) |
| 84 | interactivecollage | [itch.io](https://lunapuff.itch.io/interactivecollage) |
| 89 | Wrong Dungeon Goose! | [itch.io](https://dytek.itch.io/not-a-dungeon-duck) |
| 152 | Willow's World | [itch.io](https://yellowmancan.itch.io/willows-world) |
| 232 | Sprunki Survival Attack | [itch.io](https://therealmrjevinboi.itch.io/sprunki-survival-attack) |
| 239 | Las aventuras de tanedo | [itch.io](https://creadigitalgrupos.itch.io/las-aventuras-de-tanedo) |
| 249 | Flanslop | [itch.io](https://my-pandaemonium.itch.io/flanslop) |

## 未导入

| 输入序号 | 项目 | 原因 |
|---|---|---|
| 1 | [b_coffeMix](https://studiohbi-oficial.itch.io/b-coffemix) | 入口为 Image Targets，无法确认游戏内容 |
| 33 | [Scratch Art Engine (v0.3)](https://blackant77.itch.io/arteng) | 绘画工具 |
| 69 | [Florida One AI — Creative Studio](https://floridaoneai.itch.io/creative-studio) | 需邀请权限的创意工作室 |
| 180 | [2D Shooter](https://barwickh.itch.io/2d-shooter) | 跳转至输入 179 的同一项目，去重 |
| 183 | [S1OS Trailer!](https://soniccrtr.itch.io/s1os-trailer) | 预告片，尚无已确认可玩版本 |
| 202 | [galaxy-2](https://gamedevinthemaking.itch.io/galaxy-2) | 作者明确写明当前不能移动或射击 |
| 212 | [Critter Care](https://rubaakbar.itch.io/critter-care) | 官方页 404 |
| 224 | [sansed memes](https://mohamed-memes.itch.io/sansed-memes) | 作者描述为主题音乐，未确认游戏玩法 |
| 227 | [Amos Pro 3D](https://blackcreepycat.itch.io/amos-pro-3d) | 编程语言及编辑器工具 |
| 252 | [Saigon Go 2556 x 1179](https://muiz-ims.itch.io/saigon-go-2556-x-1179) | 官方页 404 |
| 257 | [Super Rivet World 2D](https://viktorsgames.itch.io/super-rivet-world-2d) | 官方页要求密码 |

## 缓存说明

本轮直接更新站点数据库，259 个新增公开详情页的补充已在线验证。用户要求本轮仅保留本地提交、暂不部署，因此线上 sitemap 缓存刷新与 `llms.txt` 发布留待后续部署。首页与详情页沿用 300 秒 ISR；分类和推荐池沿用 30 分钟缓存，sitemap 沿用 1 小时缓存。新增详情页已通过线上请求生成并验证；详情页已验证更新；线上 sitemap 缓存刷新仍待完成，不能将本地构建结果等同于线上收录结果。
