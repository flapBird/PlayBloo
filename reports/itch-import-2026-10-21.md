# itch.io 批量导入记录 · 2026-10-21

当日导出共 **10 款，全部新增并发布**，重复、跳过和写入失败均为 0。抓取时间为 2026-10-20 16:44，来源仍是 `https://itch.io/games/new-and-popular/free/platform-web.xml`。

生产库由 1,039 条增至 1,049 条（其中已发布 1,032 → 1,042 条），分类关联由 2,171 条增至 2,194 条（+23）。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 发行日 |
|---|---|---|---|---|
| [Get to Work, Gnomes! Christmas Factory](https://playbloo.net/game/get-to-work-gnome) | idle, simulation | demo | Unity | 2026-03-11 |
| [Candy Quest 3: Edge of Sweetness](https://playbloo.net/game/candy-quest-3-edge-of-sweetness) | rpg, casual | released | Twine | 2014-01-24 |
| [Coup of Appliance](https://playbloo.net/game/coup-of-appliance) | rpg, adventure, survival | released | Godot | 2026-10-18 |
| [Blokia Designer](https://playbloo.net/game/blokia-designer) | simulation, strategy | released | Godot | 2026-10-18 |
| [Echoes of Twilight](https://playbloo.net/game/echoes-of-twilight) | puzzle, adventure | released | Godot | 2026-10-12 |
| [Manymancer](https://playbloo.net/game/manymancer) | action, arcade | released | Godot | 2026-10-20 |
| [VVVVVVV](https://playbloo.net/game/vvvvvvv) | platformer, action | released | PICO-8 | 2026-10-17 |
| [Cake Clicker - Recake](https://playbloo.net/game/cake-clicker-recake) | idle, clicker, casual | released | HTML5 | 2019-07-26 |
| [Booster Pack Heroes](https://playbloo.net/game/booster-pack-heroes) | simulation, strategy | early-access | Unity | 2026-04-09 |
| [lurkers.io](https://playbloo.net/game/lurkers) | survival, shooting, multiplayer | released | libGDX | 2018-06-02 |

## 抓取与来源

- 雷达导出的 10 条全部带 403 抓取备注；本机带浏览器 UA 走代理 **9/10** 直接抓到官方页面，逐款解析出 og:image、正文、侧栏作者/引擎/Genre/平台/状态与截图。
- **Echoes of Twilight（misha.itch.io）本机与境外均不可达**：直连、代理（HTTP/SOCKS）、多个 DNS 解析出的 IP、两个境外中转服务全部超时或 522（`misha.itch.io` 解析结果在 88.191/69.63/74.86/31.13 等不同网段间跳变，均无法建立连接），判定为源站当前不可用而非下架。改用 **Internet Archive 2026-10-17 的快照**（`web.archive.org/web/20261017225329/https://misha.itch.io/echoes-of-twilight`）取回完整正文与侧栏：作者 Misha 与 Mewyn、Genre Puzzle、Made with Godot / Adobe Photoshop、Published 2026-10-12 04:40 UTC、Released、HTML5、4 条评分 5.0、标签 deduction / Detective / fake-os / Mystery / Narrative / No AI / Story Rich、平均时长约一小时、语言英语、色盲友好与高对比度。快照里的封面图与当前 RSS 封面是同一张作品（已逐张比对确认），正文与侧栏信息全部来自该官方快照。
- itch 主站搜索页可正常访问，用它交叉核对了该游戏的作者名与 Genre（Puzzle、Play in browser、Free），并确认 itch 上另有一个同名但不同作者（Duuude32、Adventure/Action）的游戏——两者是不同的作品，本批收录的是 misha 那一款。
- **发行日统一取 itch 官方页面的 Published（UTC）**：导出里的「上架时间」是 UTC+8，两者跨日时不一致（如 Coup of Appliance 页面为 10-18，导出显示 10-19）。没有 Published 行的页面（Candy Quest 3、Cake Clicker、Booster Pack Heroes、Gnomes、lurkers.io）取官方 RSS 的 pubDate。

## 内容与素材

- 逐款编写英文介绍、玩法、操作、技巧与特性，素材只取官方页面正文与侧栏信息。官方没给操作说明的 6 款一律写明去原页面看键位，没有编造按键。
- 版本标注按官方自述：Get to Work, Gnomes! 页面写明「This demo version」且状态为 In development，标 demo；Booster Pack Heroes 状态为 In development，标 early-access；其余 8 款官方均为 Released，标 released。
- VVVVVVV 如实写为 **非官方粉丝作品**（页面标签 Fangame，致谢 Terry Cavangh 等），不写成官方游戏；lurkers.io 注明完整版在 lurkers.io；Cake Clicker - Recake 保留页面标签里的「AI Generated」并注明 2D / 等距视角的混合标注，同时保留巴西葡语、英语、西班牙语三种语言与自动存档、导出备份、减少动效等设置。
- 46 个素材对象（10 张封面 + 36 张截图），共 **5,724,256 字节**，全部 WebP、Content-Type `image/webp`，公开读取与 SHA-256 校验通过。

### 动图封面（本次重点）

用户要求保留动图效果，本批 **3 张封面本身是动图**，全部按动画 WebP 转存并保持动画：

| 游戏 | 源图 | 转码 | 结果 |
|---|---|---|---|
| Coup of Appliance | 630×500 GIF，107 帧 | 6fps / 560px / q42 动画 WebP | 1,064,338 字节，64 帧 |
| VVVVVVV | 512×406 GIF，241 帧 | 同上 | 265,530 字节，43 帧 |
| lurkers.io | 504×400 GIF，38 帧 | 同上 | 126,412 字节，10 帧 |

- **sharp 不能处理 GIF**（会把帧拼成一条超高长条），动画转码走 ffmpeg + libwebp。脚本已入库为 `.agents/skills/itch-game-import/scripts/mirror_media.mjs`，后续批次直接复用。
- 另有 9 张官方 GIF 截图（VVVVVVV 3 张、lurkers.io 6 张）同样转成动画 WebP（10fps / 640px / q52），前端详情页目前只渲染封面，截图存库备用。
- 动画有效性是按字节核对的，不是「文件名叫 webp」就算数：线上对象用 libwebp 解码后分别为 10 / 43 / 64 页，抽帧哈希各不相同，确认是真实运动的动画而不是静态图。
- lurkers.io 的页面 og:image 是一张静态游戏截图，而 RSS 实际给出的封面是动图，两者不一致时以官方 RSS 封面为准。

### 封面选择

其余 7 款用官方页面 og:image 的 original 原图（未放大）。Candy Quest 3 的官方页面本身只有一张 1003×5109 的竖图，无封面图，直接用页面原图。

## 发布与验证

- 写入前对 DB 全量按 slug、itch project 与来源 URL 查重，10 条 slug 均无冲突；入库脚本 dry-run 无 PROBLEM 后正式执行。
- games 10 条、game_categories 23 条、game_updates 10 条 "Added to PlayBloo"（published_at 用入库时间 2026-10-20T17:05:37Z，不冒充开发者版本更新）全部写入并回读确认。
- **10/10 线上详情页 HTTP 200**，标题、meta 简介、封面、官方外链以及介绍/玩法/操作/技巧/特性各栏均通过正文级校验（去 script/style 后比对实际文案）。页面 0 次引用 `/_next/image`。
- 原有 1,039 条游戏内容、发布状态与时间戳保持不变：只有本批 10 条的 `updated_at` 为 2026-10-20T17:05:44Z，17:00Z 之后被改写的行恰好是本批 10 条，无一条老游戏被波及。
- `npm run build` 通过。构建产物 sitemap 收录本批 10/10 正式 URL，lastmod 均为 **2026-10-20T17:05:44.653Z**（实际首次上线时间，即入库时刻）；老游戏 URL 0 条被移除。
- 分类页（simulation、casual、puzzle、platformer、idle 等）的 lastmod 按现有动态规则跟随新游戏变动；`/submit-game`、`/series`、关卡索引页用的是构建时间，历次构建都会变。sitemap 生成逻辑无需修改。
- 线上 sitemap 为 1 小时缓存版本，本批暂未出现，实际刷新以线上结果为准，构建产物已验证收录正确。
- 新游戏不在按热度选取的前 500 个预渲染页面中，10 个线上详情页已逐一验证可访问。

## Sitemap 与 llms.txt

- 动态 sitemap 根据已发布游戏数据生成，本轮无需修改生成器。新游戏 lastModified 使用实际首次上线时间，没有批量刷新旧游戏时间。
- 本轮没有游戏下架、删除或新增关卡；分类、标签和系列仍按现有动态规则收录。
- public/llms.txt 已检查，未硬编码游戏数量或本批信息，无需更新。

## 交付

生产库和公开存储已生效。本轮仓库提交本报告、同名 JSON manifest 与新增的素材镜像脚本（`.agents/skills/itch-game-import/scripts/mirror_media.mjs`），保留既有 wrangler.jsonc 修改未动。未修改应用代码、未 push、未部署。

请在 SEO 控制台将 **2026-10-21** 批次标记为「已用于 PlayBloo」。
