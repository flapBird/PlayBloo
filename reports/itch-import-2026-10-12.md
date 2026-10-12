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

## 重复批次复核 · 2026-10-12

用户再次提供同一批 10 款游戏，导出抓取时间为 **2026-10-12 15:06（UTC+8）**，来源为 `https://itch.io/games/new-and-popular/free/platform-web.xml`。本次复核于 **2026-10-12 23:15（UTC+8）**完成。

- 生产库去重结果：10/10 已发布，与上方清单及原 itch 页面地址一致；入库脚本 dry-run 为 `rows to insert: 0`，无 PROBLEM。本轮新增 0 款，未重复写入游戏、分类或动态。
- 每款均有完整英文短简介、介绍、玩法、操作、技巧和功能字段；共 20 条分类关联，每款恰有 1 条 `Added to PlayBloo` 动态。Anime Biz Magnate 浏览器版已标注 `demo`。
- 10 张封面均使用 Supabase `game-media/covers/` 镜像，逐张返回 HTTP 200 和有效图片内容。
- 抽查线上 Office Immortal、Anime Biz Magnate、Yes, Comrade. 详情页：HTTP 200，标题、短简介、镜像封面及 itch 外链均正确，未使用 `/_next/image`。
- 原导入后的 sitemap 缓存已刷新：线上 `/sitemap.xml` 已收录全部 10 个正式游戏 URL，`lastmod` 均为 `2026-10-11T16:47:26.422Z`，对应 PlayBloo 首次上线日期 **2026-10-12（UTC+8）**。本轮未新增、下架或删除游戏，无需修改 sitemap 生成器。
- 复核前后生产库全部 930 条游戏记录的 `updated_at` 及发布状态一致，保留了本批和老游戏的已有更新时间。
- 已检查 `public/llms.txt`：现有描述与外链游玩方式、游戏详情路由及 sitemap 一致，无需更新。仅补充本报告，不涉及代码或部署。

本批已完整用于 PlayBloo；请在 SEO 控制台将其标记为「已用于 PlayBloo」。
