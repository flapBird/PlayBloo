# itch.io 批量导入记录 · 2026-10-14

用户提供 10 款游戏；生产库分页查询 940 条记录（含草稿）后，确认全部未收录。本批新增并发布 **10 款**，重复、跳过、失败均为 0。实际首次上线时间：**2026-10-14 01:04:47（UTC+8）**。

来源：用户粘贴的 2026-10-14 新游戏速递；雷达抓取时间为 2026-10-13 16:45，来自 itch.io 免费 Web 新游排行。雷达中的上架时间仅保留为输入信息，不替代 PlayBloo 上线日或未经核实的作品发行日。

## 入库清单

| # | 游戏 | PlayBloo 页面 | 分类 | 状态 |
|---|---|---|---|---|
| 1 | [Himaneji – Idle Factory Clicker](https://scgf.itch.io/himaneji-idle-factory-clicker) | [/game/himaneji-idle-factory-clicker](https://playbloo.net/game/himaneji-idle-factory-clicker) | idle, clicker | early-access |
| 2 | [Sir, We Have a Situation](https://deskgeneral.itch.io/sir-we-have-a-situation) | [/game/sir-we-have-a-situation](https://playbloo.net/game/sir-we-have-a-situation) | strategy, idle | demo |
| 3 | [Idle Dreadnought](https://griffithsgames.itch.io/idle-dreadnought) | [/game/idle-dreadnought](https://playbloo.net/game/idle-dreadnought) | idle, shooting | released |
| 4 | [Idle Island](https://cosmos07.itch.io/idle-island) | [/game/idle-island](https://playbloo.net/game/idle-island) | idle, simulation | early-access |
| 5 | [The Excavation Project](https://basilium.itch.io/the-excavation-project) | [/game/the-excavation-project](https://playbloo.net/game/the-excavation-project) | simulation, idle | released |
| 6 | [Lost Warden](https://arknoid.itch.io/lost-warden) | [/game/lost-warden](https://playbloo.net/game/lost-warden) | shooting, multiplayer | early-access |
| 7 | [The Last Line](https://device25.itch.io/the-last-line) | [/game/the-last-line](https://playbloo.net/game/the-last-line) | strategy, idle | early-access |
| 8 | [Combat Arena Pré-Alfa](https://thiagodv.itch.io/combat-arena) | [/game/combat-arena](https://playbloo.net/game/combat-arena) | shooting, multiplayer | early-access |
| 9 | [ROTETRA](https://sharkwithlasers.itch.io/rotetra) | [/game/rotetra](https://playbloo.net/game/rotetra) | puzzle, arcade | early-access |
| 10 | [Project Chromata](https://gamezeternal.itch.io/project-chromata) | [/game/project-chromata](https://playbloo.net/game/project-chromata) | idle, strategy | early-access |

## 内容与字段

- 逐款读取当前 itch 官方页面、作者、引擎、玩法、操作、状态及浏览器入口；10 个入口 HTML 均可读取。部分入口引用的主要脚本或实际嵌入页面也经过 HTTP 200 检查。仅核实静态交付，不声称完整试玩、通关或验证多人匹配。
- 原代理端口未运行，改用直连；初次抓取中 3 个 HTTP 429 项低速重试后均成功。未把网络错误当成下架。
- 10 款均填写英文短简介、About、How to Play、Controls、Tips、Features；事实基于当前官方页面，技巧为基于已核实机制作出的编辑建议。未知键位没有编造。
- Sir, We Have a Situation 明确是六目标试玩版，标记 demo。Himaneji 的 beta、Idle Island 与 Combat Arena 的 prototype，以及其余开发中作品均说明当前阶段并映射到 early-access。
- Himaneji 保留浏览器存档、备份码以及手机保存失败时的官方站点提示；The Excavation Project 明确没有存档，单次约 15–30 分钟；The Last Line 保留最多八小时离线收益及 WebGPU / Canvas 2D 兼容说明。
- Lost Warden 保留单人 / 本地双人合作，未把规划中的新敌人与 Dread Ark boss 写成已实现功能。页面首个 h1 属于 itch.io 导航，游戏标题采用页面正文与 RSS 一致的 Lost Warden。
- ROTETRA 仅介绍已核实的旋转棋盘和多块机制；未把“正式版将提供”的 8+ 模式列为现有功能。官方页面未明确称当前浏览器版为 demo，使用 early-access。
- Combat Arena 的模式、武器与经济系统依开发者当前描述翻译，并注明 pre-alpha；支持英语和巴西葡萄牙语，未声称多人实测成功。
- `itch_project_slug` 使用 creator/project；来源与外链均指向官方游戏页，`iframe_url` 留空。缺少可靠作品原始发行日，`release_date` 与 `last_updated_at` 保持 null。
- 先插入未发布草稿，绑定 20 条既有分类关联及 10 条 Added to PlayBloo 收录记录，核实字段并验证匿名不可见后，仅按本批 ID 发布。收录记录描述加入目录，不把收录时间填为开发者版本更新时间。
- `added_at`、`updated_at` 与首次发布时间在同一发布操作写入，确保目录日期和新游戏 sitemap lastmod 使用实际 PlayBloo 上线时间。

## Supabase 图片存储

- 沿用公开 bucket game-media：10 张封面位于 covers/2026-10-14/，53 张截图位于 screenshots/2026-10-14/；数据库仅存完整 Supabase Storage 公开 URL。
- 全部素材转为 WebP；封面最长边不超过 640px，不放大，单张约 4.4–57.8 KiB。共 63 张约 0.79 MiB。动画 GIF 选取首帧作为静态图片，封面已做视觉检查。
- 每个对象均通过匿名公开读取、WebP Content-Type、字节一致性和 SHA-256 校验。一次连接中断后先校验已上传同内容对象，再续传；未修改桶权限或覆盖历史素材。
- 保留 images.unoptimized: true；页面没有 /_next/image 请求，未运行旧图片预热脚本。

## 验证

- 匿名访问：10/10 草稿在发布前不可读，发布后可读；文案、来源、身份、分类、状态、上线时间和收录记录回读一致。
- 线上详情页：10/10 通过 HTTP 状态、标题、SEO 描述、全部正文栏目、Supabase 封面、itch 外链、收录记录以及无图片优化器检查。
- 首页 HTTP 200，检查时可见本批游戏 0 款，无图片优化器入口。
- 原有 940 条游戏的内容、发布状态及时间戳与导入前一致；既有分类关联未变。访问 / 游玩 / 点击数及热度自然变化不参与比较。数据库现有 950 款。
- 生产构建：npm run build 通过；本批 10/10 正式 URL 已在构建 sitemap 收录，lastmod 与发布时间一致；933 个老游戏的 sitemap 时间戳与导入前一致。当前构建按热度选取前 500 款，本批 0/10 被预渲染；10 个线上详情页均已完成运行时渲染和正文校验。

## Sitemap 与 llms.txt

- src/app/sitemap.ts 动态读取已发布游戏，以 updated_at 作为 lastModified；新游戏的该字段与发布时间一致，无需修改生成器。
- 本地生产构建 sitemap：10/10 正式 URL 已收录，lastmod 等于实际首次上线时间；933 个老游戏的 lastmod 保持原值，草稿继续排除。
- 线上 /sitemap.xml：检查时本批 0/10 已收录，0/10 的 lastmod 与上线时间一致；相较导入前 XML，老游戏时间戳变更 0 条。
- 线上 sitemap 尚处于发布前缓存，revalidate=3600；新数据已通过实际生成器的生产构建验证，线上结果需等待缓存刷新。本轮没有触发部署或绕过后台鉴权。
- 本批没有下架、删除或新增关卡页面；分类收录按现有动态门槛计算。
- public/llms.txt 已检查：详情路由、外链游玩、目录和 sitemap 描述与实现一致，无需更新。

## 交付

- 同名 JSON manifest 保存各款游戏字段、来源依据、图片公开 URL、校验值、游戏 ID、上线时间和验证结果。
- 数据库与 Storage 内容已在生产环境生效；仓库仅新增本批报告及 manifest，未修改应用代码，不执行 Git push 或部署。
- 请在 SEO 控制台将本批标记为「已用于 PlayBloo」。
