# itch.io 批量导入记录 · 2026-10-15

用户提供 10 款游戏；生产库分页查询 950 条记录（含草稿）后，确认全部未收录。本批新增并发布 **10 款**，重复、跳过、最终失败均为 0。实际首次上线时间：**2026-10-15 12:03:44（UTC+8）**。

来源：用户粘贴的 2026-10-15 新游戏速递；雷达抓取时间为 2026-10-15 03:44，来自 itch.io 免费 Web 新游排行。雷达上架时间仅保留为输入信息，不替代 PlayBloo 上线日或未经核实的作品发行日。

## 入库清单

| # | 游戏 | PlayBloo 页面 | 分类 | 状态 |
|---|---|---|---|---|
| 1 | [魔法の数字](https://mongoumery.itch.io/magicnumbers) | [/game/magicnumbers](https://playbloo.net/game/magicnumbers) | card, casual | released |
| 2 | [Erwin Smith Run](https://natsu-madao.itch.io/erwin-smith-run) | [/game/erwin-smith-run](https://playbloo.net/game/erwin-smith-run) | action, arcade | early-access |
| 3 | [Diglings Demo](https://ryanforrester.itch.io/diglings-demo) | [/game/diglings-demo](https://playbloo.net/game/diglings-demo) | idle, simulation | demo |
| 4 | [Morningbelle](https://wednesday888.itch.io/morningbelle) | [/game/morningbelle](https://playbloo.net/game/morningbelle) | casual, horror | released |
| 5 | [Trust the System](https://soliles.itch.io/trust-the-system) | [/game/trust-the-system](https://playbloo.net/game/trust-the-system) | idle, adventure | demo |
| 6 | [Say That You Love Me](https://writer31.itch.io/say-that-you-love-me) | [/game/say-that-you-love-me](https://playbloo.net/game/say-that-you-love-me) | casual, horror | released |
| 7 | [Gyra - Top Fighting](https://lucaju.itch.io/gyra) | [/game/gyra](https://playbloo.net/game/gyra) | fighting, action, multiplayer | released |
| 8 | [Plaguebound](https://ostsergey.itch.io/plaguebound) | [/game/plaguebound](https://playbloo.net/game/plaguebound) | strategy, idle | released |
| 9 | [Physician Simulator (Demo)](https://shishkin-blog.itch.io/therapist-simulator) | [/game/therapist-simulator](https://playbloo.net/game/therapist-simulator) | simulation | demo |
| 10 | [I Can Smell You from Here](https://catproblem9735.itch.io/i-can-smell-you-from-here) | [/game/i-can-smell-you-from-here](https://playbloo.net/game/i-can-smell-you-from-here) | casual, horror | released |

分类分布（共 20 条关联）：casual 4, horror 3, idle 3, action 2, simulation 2, adventure 1, arcade 1, card 1, fighting 1, multiplayer 1, strategy 1。

## 内容与字段

- 逐款读取当前官方 itch 页面、正文、侧栏、作者、引擎、状态和浏览器入口。直连页面超时后，经探测切换到可用的本地代理；Supabase 始终直连。
- 10 款均填写英文短简介、About、How to Play、Controls、Tips、Features；文案经分组撰写与主代理复核，技巧仅基于已确认机制作编辑建议。缺少键位说明时明确引导至原页或游戏内界面。
- 魔法の数字保留日文标题和语言说明，只介绍有依据的左右滑动数字与洞窟设定；未编造胜负条件、分数、解锁内容或内建多人。
- Erwin Smith Run 标注非官方 Attack on Titan 同人、开发中状态；保留跳跃 / 斩击 / 弹反、Boss 检查点和手机横屏要求。未声称其 AI 辅助像素图完全由手工绘制。
- Diglings Demo 是早期原型试玩；Trust the System 当前仅开放第一章，也标为 demo。其作者使用实际显示名 tabouret，而非根据子域猜测。
- Morningbelle 保留死亡、血液、谋杀、煤气灯操控、操纵、身体束缚、非色情接触、执念 / 占有行为和画面震动提示；Say That You Love Me 保留病娇、不健康关系、死亡、绑架与囚禁提示。
- I Can Smell You from Here 保留身体恐怖、暴力、食人、谋杀提及、粗口及性主题提示，使用官方对话 / 选项操作说明；结尾评估按游戏机制描述。
- Gyra 是已发布的 Beyblade-inspired 作品，支持同设备本地双人；未写成在线多人。正文保留浏览器 / 移动版部分功能受限、桌面体验更完整的说明。
- Plaguebound 保留 ostsergey 与 Keedjie 双作者、50 层与自动战斗；当前官方状态为 Released，未依据评论把它误写成另一游戏的 demo。
- Physician Simulator 使用当前正文的五个工作日、最多 40 位患者、十语言和按天继续存档；未沿用导出中的旧版 Day 1 of 10，也未把完整版的六周 / 三年流程写进试玩功能。
- `itch_project_slug` 使用 creator/project；来源和外链均指向官方游戏页，iframe_url 留空。缺少可靠原始发行日和版本更新时间，release_date 与 last_updated_at 保持 null。
- 先创建未发布草稿，绑定 20 条既有分类关联及 10 条 Added to PlayBloo 收录记录。字段、分类、收录记录与匿名不可见验证通过后，仅按本批 ID 发布。
- added_at、updated_at 与首次发布时间在同一发布操作写入，保证目录日期和新游戏 sitemap lastmod 等于实际 PlayBloo 上线时间。收录记录未被用作开发者版本更新时间。

## 图片与入口

- 使用现有公开 bucket game-media：10 张封面存于 covers/2026-10-15/，51 张截图存于 screenshots/2026-10-15/；数据库仅存完整 Supabase Storage 公开 URL。
- 全部图片压缩为 WebP，封面最长边不超过 640px，不放大。单张封面约 14.1–103.1 KiB；共 61 张约 1.01 MiB。动画素材选首帧作为静态图片，封面已做视觉检查。
- 每个对象通过匿名公开读取、WebP Content-Type、文件字节一致性与 SHA-256 校验；使用新批次路径和禁止覆盖的上传方式，未修改桶权限或历史对象。
- 10 个游戏入口 HTML 可读取；能识别出的入口引用资源也做了 HTTP 200 检查。只核实静态交付，不声称完整试玩、通关或多人联机实测。
- 保留 images.unoptimized: true；线上详情页无 /_next/image 请求，未调用旧图片预热脚本。

## 验证

- 10/10 草稿发布前匿名不可读，发布后可读；文案、来源、身份、分类、状态、上线时间和收录记录回读一致。
- 线上详情页：10/10 通过 HTTP 状态、标题、SEO 描述、五个正文栏目、Supabase 封面、itch 外链、收录记录及无图片优化器检查。短简介在数据库单独校验。
- 首页 HTTP 200，首次检查时可见本批游戏 0 款；检查距发布约 89 秒，仍在首页 300 秒 ISR 周期内，不能据此声称首页已刷新。查询代码的 New 列表只筛选已发布游戏，本批符合条件；未发现图片优化器入口。
- 原有 950 条游戏的内容、发布状态及时间戳与导入前一致；既有分类关联未变。访问 / 游玩 / 点击数和热度自然变化不参与比较。数据库现有 960 款。
- 生产构建：npm run build 通过；本批 10/10 正式 URL 已在构建 sitemap 收录，lastmod 与发布时间一致；943 个老游戏的 sitemap 时间戳与导入前一致；本批 0/10 被预渲染（当前按热度选取前 500 款）；10 个线上详情页的正文已另行验证。

## Sitemap 与 llms.txt

- src/app/sitemap.ts 动态读取已发布游戏，使用 updated_at 作为 lastModified；本批值与首次上线时间一致，无需修改生成器。
- 构建 sitemap 收录本批 10/10 正式 URL，lastmod 与上线时间一致；943 个老游戏的更新时间保留，草稿继续排除。
- 线上 sitemap 检查时收录本批 0/10，其中 0/10 的 lastmod 与上线时间一致；相比导入前 XML，老游戏时间戳变更 0 条。
- 线上 sitemap 仍是发布前缓存，revalidate=3600；本批数据已经过实际生产构建生成器验证，线上收录待缓存刷新。本轮没有触发部署或绕过后台鉴权。
- 本批没有下架、删除或新增关卡页面，分类收录仍按动态门槛计算。
- public/llms.txt 已检查：详情路由、外链游玩、目录和 sitemap 描述与当前实现一致，无需更新。

## 交付

- 同名 JSON manifest 保存完整游戏字段、来源依据与编辑说明、图片公开 URL、校验值、游戏 ID、实际上线时间和验证结果。
- 数据库和 Storage 已在生产环境生效；仓库仅新增本批报告及 manifest，没有应用代码修改，不执行 Git push 或部署。
- 请在 SEO 控制台将本批标记为「已用于 PlayBloo」。
