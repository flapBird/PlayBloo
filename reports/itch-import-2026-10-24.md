# itch.io 批量导入记录 · 2026-10-24

本轮入库 2026-10-24 雷达导出 10 款，全部新增并发布，重复、跳过和写入失败均为 0。导出抓取时间 2026-10-24 03:36（UTC+8），来源 `https://itch.io/games/new-and-popular/free/platform-web.xml`。

生产库游戏总量由 1,075 条增至 **1,085 条**（已发布 1,068 → 1,078），分类关联由 2,251 条增至 **2,271 条**（+20）。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 发行日 |
|---|---|---|---|---|
| [MMC5Racing](https://playbloo.net/game/mmc5racing) | racing, arcade | released | HTML5 | 2026-10-23 |
| [Rainbow City](https://playbloo.net/game/rainbow-city) | simulation, idle | released | HTML5 | 2026-10-22 |
| [The Cat Did It](https://playbloo.net/game/the-cat-did-it) | simulation, casual | early-access | Three.js | 2026-10-22 |
| [PROGRAMAR MAL - Pong](https://playbloo.net/game/programar-mal-pong) | arcade, multiplayer | released | Unity | 2026-09-12 |
| [Golem Quest](https://playbloo.net/game/golem-quest) | rpg, adventure | early-access | Godot | 2026-10-21 |
| [Taiwanese oyster-omelette](https://playbloo.net/game/taiwanese-oyster-omelette) | simulation, casual | released | HTML5 | 2026-10-23 |
| [Carbineball](https://playbloo.net/game/carbineball) | action, arcade | released | Godot | 2026-10-19 |
| [Living Scraps](https://playbloo.net/game/living-scraps) | adventure, casual | released | HTML5 | 2026-10-19 |
| [Abattlacus](https://playbloo.net/game/abattlacus) | strategy, rpg | demo | Godot | 2026-10-20 |
| [Legendum](https://playbloo.net/game/legendum) | rpg, idle | demo | Godot | 2026-05-26 |

## 抓取与来源

- 导出 10 条全部带 403 抓取备注（雷达服务器被 itch 拒）；本机带浏览器 UA 走代理 9/10 抓到，**Legendum 首次 HTTP 429**（代理出口 IP 进 itch 冷却），间隔后单发重试成功，最终 **10/10**。
- **Legendum 页面 meta 标签属性顺序相反**（`content` 在前、`property` 在后），parse_and_fetch.py 的 og:image/og:description/截图/作者正则全部落空；已对原始 HTML 手工解析补齐（作者 Vadeum、og:image、7 张截图），并确认该页正文完整。
- 发行日取导出「上架时间（UTC+8）」的日期部分（content-guide 既有规则）。
- **slug 冲突处理**：ericrod 的 Pong 与库内已有 `pong`（f-pet 同名作，2026-10-08 收录）撞 slug，而 import 脚本的查重过滤是静默的（会直接丢行）。为此给 content.json 增加了可选 `slug` 覆盖字段，`import_games.py` 与 `mirror_media.mjs` 已支持（db_slug），本款入库为 `programar-mal-pong`，external_url/itch_url 仍指向真实页面。今后 dry-run 必须核对 `rows to insert` 数量，防静默跳过。

## 内容与素材

- 逐款编写英文介绍、玩法、操作、技巧与特性，素材只取官方页面正文、侧栏与截图可见信息。**原创性三件套（editorial_take / meta_title / meta_description）10/10 全量撰写**，meta_title ≤60 字符、meta_description ≤155 字符，均原创改写不照搬 og:description。
- **版本标注按官方自述**：The Cat Did It（页面 In development、自称 early version）与 Golem Quest（Prototype）标 early-access；Abattlacus（Prototype、Ludum Dare 60 参赛作）按 10-22 批次先例标 demo；Legendum（"This Is a Demo – Wishlist on Steam"，仅 Farmhand 与 Scholar (WIP) 两个起点）标 demo；其余 6 款官方 Released。
- **零简介游戏写薄**：MMC5Racing 页面无任何文字，按封面（CRT 实拍、LAP 4/5 计时 HUD）与标题写 2 段并注明细节见原页；Taiwanese oyster-omelette（煎蚵！夜市蚵仔煎模擬器）无文字简介，按 3 张截图还原七步煎制、火候、翻面与七项评分/结局图鉴，注明繁体中文呈现、竖版布局。PROGRAMAR MAL - Pong 注明西语呈现；Golem Quest 的系统（矿物流、Physique/Finesse/Mind/Influence、Welcome Hills / Mystic Grove）均来自截图可见 HUD，正文明确"截图所示"。
- 41 个素材对象（10 张封面 + 31 张截图）全部转 WebP 镜像至 Supabase Storage `game-media`（`covers/2026-10-24/`、`screenshots/2026-10-24/`），0 错误。**4 个动图素材保留动效**：carbineball 与 living-scraps 封面、abattlacus 两张截图、legendum 一张截图转动画 WebP，独立抽查 carbineball 封面 95 帧、abattlacus-1 50 帧。静态公开 URL 抽查返回 200、`image/webp`、`cache-control: public, max-age=604800`。

## 验证

- 抽查 `/game/programar-mal-pong`、`/game/mmc5racing`、`/game/taiwanese-oyster-omelette`、`/game/legendum` 线上页面均 200：`<title>`（meta_title 覆盖生效 + 站名后缀）、og:description（meta_description）、itch 外链按钮、自家存储封面 src 渲染正常（两个 60s 超时为本地跨境线路波动，内容已开始返回，非源站问题）。
- 10 款的 thumbnail_url 与 screenshots 已全部指向 `game-media/2026-10-24` 路径。
- 每款游戏写入一条 "Added to PlayBloo" Updates 记录（共 10 条；import 脚本 updates 步骤曾因 slug 覆盖后的 KeyError 中断，已修复脚本并按同一格式补写）。
- sitemap：已验证。`/sitemap.xml` 为动态生成（revalidate=3600，stale-while-revalidate），04:44 UTC 后的完整抓取显示 **10 个新游戏 URL 全部收录**，`<lastmod>` 均为 2026-10-24T03:59:12.705Z（= 各行 `updated_at`，即 PlayBloo 实际上线日期），并排在游戏区块头部（updated_at 倒序）。逐条比对新旧两代 sitemap：抽查 island-crusade、fogbound、hyperspin、troll-the-king、pong、trauma-lab 及 /category/puzzle 的 lastmod 与修改前完全一致，老游戏未被触碰（`/series` 条目的时间戳是生成时刻型字段，属预期行为）。注：本机到 Cloudflare 线路不稳，前三次 sitemap 抓取均中途截断/拿到旧缓存，完成验证靠完整重抓。

## 提醒

- 请在 SEO 控制台把本批（2026-10-24）标记为「已用于 PlayBloo」。
