# itch.io 批量导入记录 · 2026-10-20

当日共两批导出，**12 款全部新增并发布**，重复、跳过和写入失败均为 0。

- 06:34 批：10 款，首次实际上线 **2026-10-20T07:06:15Z**（北京时间 15:06）。
- 08:23 批：2 款，首次实际上线 **2026-10-20T08:28:01Z**（北京时间 16:28）。

生产库由 1,027 条增至 1,039 条（其中已发布 1,032 条、草稿 7 条），分类关联由 2,146 条增至 2,171 条。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 批次 |
|---|---|---|---|---|
| [Pack Ripper](https://playbloo.net/game/pack-ripper) | card, idle, simulation | released | Unity | 06:34 |
| [Chartward](https://playbloo.net/game/chartward-demo) | adventure, idle | demo | — | 06:34 |
| [Harlequinade [Demo]](https://playbloo.net/game/harlequinade) | casual, horror | demo | Ren'Py | 06:34 |
| [Kirby ~ Soft & Wet](https://playbloo.net/game/kirby-soft-and-wet) | casual, simulation | released | — | 06:34 |
| [OnePixel](https://playbloo.net/game/onepixel) | clicker, idle | released | — | 06:34 |
| [Twilight at the Banyan Tree (Beta)](https://playbloo.net/game/twilight-at-the-banyan-tree) | simulation, strategy | early-access | LWJGL | 06:34 |
| [Paragra - Paragliding Adventures](https://playbloo.net/game/paragra) | arcade, sports | demo | — | 06:34 |
| [The Cursed Box](https://playbloo.net/game/the-cursed-box) | adventure, casual | demo | Ren'Py | 06:34 |
| [Marketfield](https://playbloo.net/game/marketfield) | idle, strategy | early-access | Unity | 06:34 |
| [Breadwinner](https://playbloo.net/game/breadwinner) | horror, simulation | early-access | Unity | 06:34 |
| [ONE OF THESE IS YOU](https://playbloo.net/game/one-of-these-is-you) | casual, puzzle | released | HTML5 | 08:23 |
| [Spot Master](https://playbloo.net/game/spotmaster) | board-game, casual | released | Unity | 08:23 |

## 内容与素材

- 雷达导出的 12 条全部带有 403 抓取备注；本机带浏览器 UA 走代理 12/12 抓到官方页面，逐款解析出 og:image、正文、侧栏作者/引擎/Genre/平台/状态与截图，没有把访问失败当成下架。
- 逐款编写英文介绍、玩法、操作、技巧及特性，素材只取官方页面正文与侧栏信息。Chartward 官方未给控制说明，写明去原页面看键位，没有编造操作。
- 版本标注按官方自述：Chartward、Harlequinade、Paragra、The Cursed Box 标 demo（Paragra 官方自述 "Early demo"，The Cursed Box 自述 "Demo version"）；Twilight at the Banyan Tree 为 beta、Marketfield 与 Breadwinner 为开发中，分别标 early-access；ONE OF THESE IS YOU 与 Spot Master 官方均标 Released，标 released。
- 敏感题材保留提示：Harlequinade 保留谋杀、自杀等 content warning 并注明「older teens and up」；The Cursed Box 保留 yandere、操纵、占有欲等提示；Breadwinner 保留疾病、债务、赌博、酗酒、驱逐与校园霸凌提示（并说明画面有少量干血、无 gore）以及虚构声明。
- Kirby ~ Soft & Wet 如实标注为非官方 Kirby 粉丝作品（与任天堂 / HAL Laboratory 无关联），并保留其开源仓库与 Discord 信息。Paragra、OnePixel、The Cursed Box 注明多语言支持。
- ONE OF THESE IS YOU 按官方正文写：20 关、6 种反射（镜像、半秒延迟的回声、半速与双速的孪生、旋转、替身、十二个几乎是你的人群）、单手鼠标操作、死亡后留下半透明回放且终局全部回归；并保留开发者关于「sense of agency」的原话与「声音开启」的提示。页面自称 HTML5 且未列引擎，engine 记 HTML5。
- **Spot Master 的 itch 页面完全没有简介、Genre 与规则**，只有一张棋盘图和元数据（作者 Fidel Soto、Released、HTML5、Made with Unity、No generative AI was used）。文案因此写得很薄：只描述能从图上确证的棋盘（四色分区、每色 12 格编号轨道、中央带王冠的骰子、绿色盾牌与交叉剑棋子），并明确说明规则、回合结构与棋子含义官方未公布，引导去原页面或浏览器版看，不臆造玩法；分类按可见的 Ludo 式赛道归为 board-game + casual。
- Spot Master 的 release_date 取 itch 页面自身的 Published 时间 **2026-10-19**（页面标注 19 October 2026 @ 03:04 UTC），而非雷达导出里的 2025-09-20（那是项目创建时间，与页面 Published 不一致）。
- release_date 取 itch 官方页面的 Published 日期（与目录中 606 条 itch 行的既有惯例一致），仅作为游戏发行日展示字段；sitemap 的 lastModified 不使用该字段。
- 12 张封面、63 张截图，共 **75 个 WebP / 3,003,712 字节**。封面最大边 640px，截图最大边 1280px，不放大。封面与截图已抽样视觉核对（Harlequinade、Paragra、Twilight at the Banyan Tree、Spot Master、ONE OF THESE IS YOU），与官方页面素材一致。
- 4 张官方 GIF 截图首轮用 sharp 转 WebP 时被拼成超高长条（800×25650），已改用 ffmpeg/libwebp 重新编码为 640×360 的**动画** WebP（fps 10、quality 52），重新上传并公开读取校验通过；08:23 批的素材管道已内置该处理方式。
- 素材位于公开 game-media bucket 的 covers/2026-10-20/ 和 screenshots/2026-10-20/。全部公开读取、Content-Type 均为 image/webp、完整字节与 SHA-256 校验通过，页面不请求 /_next/image。

## 发布与验证

- 写入前对 DB 全量按 slug、itch project 与来源 URL 查重，12 条 slug 均无冲突；入库脚本 dry-run 无 PROBLEM 后正式执行。
- games 12 条、game_categories 25 条、game_updates 12 条 "Added to PlayBloo"（published_at 使用入库时间，不冒充开发者版本更新）全部写入并回读确认。
- 12/12 线上详情页 HTTP 200，标题、meta 简介、封面、官方外链以及介绍/玩法/操作/技巧/特性各栏均通过正文级校验（去 script/style 后比对实际文案，非仅标签）。页面 0 次引用 /_next/image。
- 原有 1,027 条游戏内容、发布状态和时间戳保持不变：只有本批 12 条的 updated_at 为 2026-10-20，其余老游戏无一条被改写。分类关联由 2,146 条增至 2,171 条，仅新增本批 25 条。
- npm run build 通过。构建产物 sitemap 收录本批 12/12 正式 URL，lastmod 分别为 2026-10-20T07:06:22.029Z（06:34 批）与 2026-10-20T08:28:07.202Z（08:23 批），均为实际首次上线时间；老游戏时间戳 0 条变化，1,032 个已发布游戏 URL 全部收录，7 个原有草稿继续排除。
- 线上 sitemap 检查时仍为缓存版本（revalidate=3600），本批暂未出现；实际刷新以线上结果为准，构建产物已验证收录正确。
- 新游戏不在按热度选取的前 500 个预渲染页面中，12 个线上详情页已逐一验证可访问。

## Sitemap 与 llms.txt

- 动态 sitemap 根据已发布游戏数据生成，本轮无需修改生成器。新游戏 lastModified 使用实际首次上线时间，没有批量刷新旧游戏时间。
- 本轮没有游戏下架、删除或新增关卡；分类、标签和系列仍按现有动态规则收录。
- public/llms.txt 已检查，未硬编码游戏数量或本批信息，无需更新。

## 交付

生产库和公开存储已生效。本轮仓库只提交本报告与同名 JSON manifest，保留既有 wrangler.jsonc 修改。未修改应用代码、未 push、未部署。

请在 SEO 控制台将 **2026-10-20** 批次标记为「已用于 PlayBloo」。
