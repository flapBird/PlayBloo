# itch.io 批量导入记录 · 2026-10-12

来源：「itch.io 新游戏速递 · 2026-10-12」导出（共 10 款，抓取时间 2026-10-11 16:35，来源 new-and-popular 排行）。
本批入库 **10 款**，全部为免费 HTML5 网页游戏，介绍页指向 itch.io 原页面外链游玩（`external_url`），无 iframe 内嵌。无跳过项。

- 数据来源：导出 Markdown + 逐款抓取 itch.io 详情页（封面、作者、引擎、类型、截图、介绍）；导出里的 403 抓取备注经本机代理补抓后 10/10 详情完整
- 文案：每款英文 description / how_to_play / controls / tips / features，基于官方页面内容撰写；Prototype/In development 标注 `early-access`，明确自称 demo 的（Anime Biz Magnate 浏览器版即 2 小时 demo）标注 `demo`
- 字段惯例与既有 itch 导入一致：`source_type=itch.io`、`platforms=[browser]`、`monetization=free`、`content_verified=true`、`sources=[{url,type,verifiedAt}]`
- 分类：共绑定 20 条 game_categories（rpg+idle / simulation+arcade / puzzle+rpg / simulation+adventure / simulation+strategy / puzzle+board-game / platformer+puzzle / simulation+casual / idle+simulation / action+survival）；标签未使用（与既有惯例一致）
- 封面：10 张 itch 热链封面已全部镜像到 Supabase Storage（`covers/{slug}.{ext}`），`thumbnail_url` 已指向镜像（见 /tmp/itch-import/covers-mirror-2026-10-12.json）

## sitemap 处理

- 本批 10 款为新收录游戏，`games.updated_at` = 入库时刻 2026-10-11T16:47Z（即 PlayBloo 首次上线时间 2026-10-12 00:47 UTC+8），sitemap `lastmod` 直接使用该值，符合「新游戏 lastmod = PlayBloo 实际上线日期」约定
- 未改动任何老游戏数据（无批量刷新 updated_at）
- 验证：插入后立即抓取 `/sitemap.xml` 仍为插入前缓存快照（913 个游戏页、含老游戏、不含本批 10 款）——sitemap `revalidate=3600`，1 小时内自动收录本批；数据层（`is_published=true` + updated_at）已核实正确

## 入库清单（10 款）

| # | 游戏页面 | slug | 分类 | 状态 |
|---|---|---|---|---|
| 1 | [Office Immortal](https://bluezinger.itch.io/office-immortal) | `office-immortal` | rpg, idle | Prototype（early-access） |
| 2 | [Wreckbox](https://itslamba.itch.io/wreckbox) | `wreckbox` | simulation, arcade | In development |
| 3 | [DungeonSweeper](https://cnava.itch.io/dungeonsweeper) | `dungeonsweeper` | puzzle, rpg | Released |
| 4 | [THE OMEGA REACH](https://shiftbacktick.itch.io/the-omega-reach) | `the-omega-reach` | simulation, adventure | In development |
| 5 | [Anime Biz Magnate](https://magnate-games.itch.io/anime-biz-magnate) | `anime-biz-magnate` | simulation, strategy | Released（浏览器版为 2h demo） |
| 6 | [Rulehouse](https://dalichrome.itch.io/house-rules) | `house-rules` | puzzle, board-game | In development |
| 7 | [Alpine](https://oddly-shaped-pixels.itch.io/alpine) | `alpine` | platformer, puzzle | Released |
| 8 | [Yes, Comrade.](https://hugimugi7.itch.io/yes-comrade) | `yes-comrade` | simulation, casual | Released |
| 9 | [The Margot Collapse](https://funday-games.itch.io/the-margot-collapse) | `the-margot-collapse` | idle, simulation | In development |
| 10 | [Time Survivor](https://logos-psychagogia.itch.io/time-survivor) | `time-survivor` | action, survival | In development |

## 验证记录

- dry-run 校验 0 PROBLEM 后正式执行；games + game_categories + game_updates（每款一条 "Added to PlayBloo"）三表写入成功
- 抽查线上 `/game/office-immortal`、`/game/wreckbox`、`/game/yes-comrade`：标题、og:description、正文渲染正常，封面全部走 `game-media/covers/` 镜像（0 处 itch 热链），外链按钮指向 itch 原页面
- 封面镜像 URL 单发复核 HTTP 200
- 相关游戏推荐池有 30 分钟缓存、首页/详情页 ISR 5 分钟，属正常滞后
