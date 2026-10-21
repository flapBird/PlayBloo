# itch.io 批量导入记录 · 2026-10-22

当日导出共 **10 款，全部新增并发布**，重复、跳过和写入失败均为 0。抓取时间为 2026-10-21 16:03，来源仍是 `https://itch.io/games/new-and-popular/free/platform-web.xml`。

生产库由 1,055 条增至 1,065 条（其中已发布 1,048 → 1,058 条），分类关联由 2,209 条增至 2,230 条（+21）。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 发行日 |
|---|---|---|---|---|
| [yuasama cardgame](https://playbloo.net/game/yuasama-cardgame) | card, strategy | early-access | HTML5 | 2026-07-04 |
| [Trauma lab](https://playbloo.net/game/trauma-lab) | simulation, horror | early-access | HTML5 | 2026-10-20 |
| [Choo Choo Mania](https://playbloo.net/game/choo-choo-mania) | puzzle, casual | released | PICO-8 | 2026-10-21 |
| [Hyperspin Demo](https://playbloo.net/game/hyperspin) | music, casual | demo | 自研引擎 | 2025-12-20 |
| [Project Hail Meowy](https://playbloo.net/game/project-hail-meowy) | strategy, simulation | demo | Godot | 2026-10-19 |
| [Troll the King](https://playbloo.net/game/troll-the-king) | arcade, action | released | LÖVE | 2026-10-20 |
| [Castle: Build&Defend](https://playbloo.net/game/castle-builddefend) | strategy, simulation | early-access | HTML5 | 2026-10-14 |
| [Relicta in Memoriam](https://playbloo.net/game/relicta-in-memoriam) | adventure, puzzle, horror | released | Unity | 2025-10-11 |
| [Von Neumann](https://playbloo.net/game/von-neumann) | simulation, idle | early-access | Godot | 2026-04-03 |
| [Tamaweb: Virtual Pet Game](https://playbloo.net/game/tamaweb) | simulation, casual | early-access | HTML5 | 2024-02-24 |

## 抓取与来源

- 雷达导出的 10 条全部带 403 抓取备注；本机带浏览器 UA 走代理 **10/10** 直接抓到官方页面，逐款解析出 og:image、正文、侧栏作者/引擎/Genre/平台/状态/评分/标签/语言与截图。
- **发行日统一取 itch 官方页面的 Published（UTC）**；页面没有 Published 行的（Hyperspin Demo、Relicta in Memoriam、Von Neumann、Tamaweb、yuasama cardgame）取官方 RSS 的 pubDate。这条规则与 2026-10-21 批次一致，并用该批次入库后的库内值逐条核对过。
- **yuasama cardgame 的 itch 页面本身没有任何内容**：没有简介、没有封面、没有截图、没有评分、没有标签，作者栏之外只剩 Status / Platforms / Author / Genre 四行。侧栏缺口不是抓取失败——页面 HTML 里确实没有 `og:image`、`og:description` 和 `screenshot_list`。
- 该游戏的**官方浏览器包**（`html-classic.itch.zone/html/18790619/BLOOD_OFFERING_TESTPLAY/`）可以正常访问，页面里的 iframe 就指向它，因此正文与机制是从官方包里的 `index.html`、`js/game-data.js`、`js/world1-events.js`、`js/game-system.js`、`js/novel-system.js` 直接读出来的：角色输入界面、三夜流程与无尽模式、校园路线地图（战斗/强敌/ relics/事件/休息/ boss）、血量与残机、贡献血量结算、回合结束的钟声、墓地与血术重建、商店与遗物、对女王的单独牌局与牌组教程。封面与截图也取自同一个官方包。
- 该包的 `data-build-channel="testplay"`，与页面的 In development 状态一致，因此按 early-access 收录。包的美术资产位于 `assets/ai-temp/` 目录下，如实记为 AI 辅助素材。

## 内容与素材

- 逐款编写英文介绍、玩法、操作、技巧与特性，素材只取官方页面正文、侧栏信息和官方浏览器包的公开资源。没有编造按键：Trauma lab、Relicta in Memoriam、Von Neumann、Tamaweb 四款官方未给操作说明，只写明去原页面看；其余按官方原文列出。
- **版本标注按官方自述**：Hyperspin Demo 页面标题与正文都写明是 full game 的 demo，标 demo；Project Hail Meowy 状态为 Prototype、Ludum Dare 60 参赛作，标 demo；Choo Choo Mania、Troll the King、Relicta in Memoriam 官方均为 Released，标 released；其余 5 款状态为 In development，标 early-access。
- **敏感题材如实披露**：Trauma lab 保留官方的「Graphic injury, blood and medical detail. Intended for players 18+」提示；Relicta in Memoriam 保留 mental illness / mature themes / mild violence 的 content warning；yuasama cardgame 写明日文表现、血与拘束等黑暗题材以及暗示性角色美术。
- **AI 披露按页面原文转述**：Trauma lab（Code/Graphics/Sounds）、Project Hail Meowy（Code/Graphics/Text）、Castle: Build&Defend（Code/Graphics/Sounds/Text）、Von Neumann（Code）在官方页面有 AI Disclosure 行，文案与特性里如实注明；Choo Choo Mania、Troll the King、Relicta in Memoriam、Tamaweb 官方标注 No generative AI was used，同样如实保留。
- **Hyperspin Demo 的引擎**按正文「Created in a custom game engine」写为自研引擎，而不是侧栏的 Adobe Photoshop / Adobe Illustrator（那两个只是美术工具）。
- 46 个素材对象（10 张封面 + 36 张截图），共 **8,604,792 字节**，全部 WebP、Content-Type `image/webp`，公开读取与 SHA-256 逐个校验通过（51 个对象，0 处不符）。

### 封面选择

itch 的 `og:image` 与 RSS 的 `imageurl` 指向同一张图但尺寸不同（og 为 original 原图，RSS 为 315×250 缩略）。除 GIF 封面外一律取 **og:image 的 original 原图**，不放大：
- Castle: Build&Defend 的 og:image 是 2318×1303 的完整游戏画面，RSS 缩略图只有 315×250，取原图。
- Choo Choo Mania 的 og:image 是 630×500 的标题画面，RSS 是同图的 315×250 缩略，取原图。
- Trauma lab 的 og:image 630×500，与 RSS 同图，逐像素比对确认是同一张作品后取原图。
- yuasama cardgame 无 itch 封面，用官方浏览器包里的 1536×1024 校园场景原图。

### 动图封面与截图（本次重点）

本批 **2 张封面本身是动图**，全部按动画 WebP 转存并保持动画：

| 游戏 | 源图 | 转码 | 结果 |
|---|---|---|---|
| Hyperspin Demo | original GIF | 6fps / 560px / q42 动画 WebP | 102,692 字节，11 帧 |
| Project Hail Meowy | original GIF | 同上 | 121,670 字节，13 帧 |

另有 **5 张官方 GIF 截图**（Choo Choo Mania 2 张、Project Hail Meowy 3 张）同样转成动画 WebP（10fps / 640px / q52），前端详情页目前只渲染封面，截图存库备用。

动画有效性是按字节核对的，不是「文件名叫 webp」就算数：线上对象用 sharp 逐帧解码后分别为 11 / 13 / 92 / 83 / 39 / 103 / 90 页，抽帧哈希各不相同，确认是真实运动的动画而不是静态图。`ffprobe` 与 ffmpeg 解不出动画 WebP（报 "image data not found"），RIFF 里的 ANMF 块计数与 sharp 的 `pages` 互相印证。

### yuasama cardgame 的截图取舍

官方浏览器包里另有几张暗示性更强的角色美术（含较多裸露的立绘与场景 CG）。这些**没有**用作封面或截图：封面用校园场景，5 张截图选取校园远景、革命演讲 CG、血玫瑰 CG、钟与倒地场景，均为不露点的哥特画面。站点页面不展示该游戏官方包里的其余素材。

## 发布与验证

- 写入前对 DB 全量按 slug、itch project 与来源 URL 查重，10 条 slug 均无冲突；入库脚本 dry-run 无 PROBLEM 后正式执行。
- games 10 条、game_categories 21 条、game_updates 10 条 "Added to PlayBloo"（published_at 用入库时间 2026-10-21T17:46:04Z，不冒充开发者版本更新）全部写入并回读确认。
- **10/10 线上详情页 HTTP 200**，标题、meta 简介、封面、官方外链以及介绍/玩法/操作/技巧/特性各栏均通过正文级校验（去 script/style 后比对实际文案）。页面 0 次引用 `/_next/image`。
- 10 个分类页全部 HTTP 200，并逐个确认本批游戏出现在对应分类上（card 出现 yuasama cardgame，puzzle/casual 出现 Choo Choo Mania 与 Tamaweb，horror 出现 Trauma lab 与 Relicta in Memoriam）。首页 200，本批 10 张封面均出现在首页的四个排序标签中。
- 原有 1,055 条游戏内容、发布状态与时间戳保持不变：只有本批 10 条的 `updated_at` 为 2026-10-21T17:46:07.546Z，10-21 批次入库的老游戏仍为 2026-10-20T17:05:44.653Z，无一条老游戏被波及。
- `npm run build` 通过，构建产物 10 个详情页全部预渲染成功。
- **构建产物 sitemap 收录本批 10/10 正式 URL，lastmod 均为 2026-10-21T17:46:07.546Z**（实际首次上线时间，即入库时刻）；老游戏 URL 0 条被移除，10-21 批次及更早游戏的 lastmod 逐条比对未变。
- 分类页（card、strategy、simulation、music、horror、puzzle、arcade、casual、adventure、idle 等）的 lastmod 按现有动态规则跟随新游戏变动；`/submit-game`、`/series`、关卡索引页用的是构建时间，历次构建都会变。sitemap 生成逻辑无需修改。

### 一处构建期缓存问题

首次 `npm run build` 产出的 sitemap **缺少本批 10 款游戏**（游戏 URL 只有 1051 条，已发布游戏 1058 条）。排查后确认是 Next.js 的 fetch 缓存（`.next/cache/fetch-cache`）里存着导入前的目录查询响应——`/games?is_published=eq.true&limit=1000&offset=0&order=id.asc&select=id,slug,updated_at` 的缓存条目写入时间早于 17:46 的入库时刻，构建时命中了这份陈旧响应。sitemap.ts 的 `revalidate = 3600` 不足以让构建期重新取数。

**清掉 `.next/cache/fetch-cache` 后重新构建，sitemap 立即恢复正确**：游戏 URL 1058 条，本批 10 条全部收录且 lastmod 正确。此后连续两次构建（均未清缓存）结果稳定为 1058 条，本批 10 条始终在列。线上 sitemap 也已确认收录本批（revalidate 1h 已刷新，1058 条游戏 URL）。

本批 10 款游戏的 UUIDv7 分布在目录的两页里（第 1 页 offset 0 有 6 款、第 2 页 offset 1000 有 4 款），所以任何一页的陈旧响应都会让对应几款从 sitemap 里消失——这正是本次只少了这 10 款、而不是整页缺失的原因。生成器代码本身没有问题，无需修改。

## Sitemap 与 llms.txt

- 动态 sitemap 根据已发布游戏数据生成，本轮无需修改生成器。新游戏 lastModified 使用实际首次上线时间，没有批量刷新旧游戏时间。
- 本轮没有游戏下架、删除或新增关卡；分类、标签和系列仍按现有动态规则收录。
- public/llms.txt 已检查，未硬编码游戏数量或本批信息，无需更新。

## 交付

生产库和公开存储已生效。本轮仓库提交本报告与同名 JSON manifest，保留既有 wrangler.jsonc 修改未动。未修改应用代码、未 push、未部署。

请在 SEO 控制台将 **2026-10-22** 批次标记为「已用于 PlayBloo」。
