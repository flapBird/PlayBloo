# itch.io 批量导入记录 · 2026-10-13

用户提供 10 款游戏；生产库分页查询 930 条记录（含草稿）后，确认全部未收录。本批新增并发布 **10 款**，重复、跳过、失败均为 0。实际首次上线时间：**2026-10-13 09:50:19（UTC+8）**。

来源：用户粘贴的 2026-10-13 新游戏速递，雷达抓取时间 01:32（UTC+8），来源为 itch.io 的免费 Web 新游排行。雷达中的发布时间仅保留为输入信息，不作为 PlayBloo 上线日或未经核实的作品发行日。

## 入库清单

| # | 游戏 | PlayBloo 页面 | 分类 | 状态 |
|---|---|---|---|---|
| 1 | [PACKARDOS](https://slambond.itch.io/packardos) | [/game/packardos](https://playbloo.net/game/packardos) | card, idle | early-access |
| 2 | [Azzucca](https://starea.itch.io/azzucca) | [/game/azzucca](https://playbloo.net/game/azzucca) | strategy, idle | early-access |
| 3 | [II II II I I I I II](https://ii-p.itch.io/ii-ii-ii-i-i-i-i-ii) | [/game/ii-ii-ii-i-i-i-i-ii](https://playbloo.net/game/ii-ii-ii-i-i-i-i-ii) | casual, horror | released |
| 4 | [We Need More Undead!](https://cattt999.itch.io/we-need-more-undead) | [/game/we-need-more-undead](https://playbloo.net/game/we-need-more-undead) | idle, strategy | early-access |
| 5 | [One Way Down](https://blindhermit.itch.io/one-way-down) | [/game/one-way-down](https://playbloo.net/game/one-way-down) | clicker, strategy | released |
| 6 | [Fake News Detective (In Space)](https://studio-spagunkel.itch.io/fake-news-detective-in-space) | [/game/fake-news-detective-in-space](https://playbloo.net/game/fake-news-detective-in-space) | educational, puzzle | demo |
| 7 | [KAIJU DISPOSAL](https://csaf.itch.io/kaiju-disposal) | [/game/kaiju-disposal](https://playbloo.net/game/kaiju-disposal) | simulation, strategy | released |
| 8 | [Leaf by Leaf](https://reeecook.itch.io/leaf-by-leaf-jam) | [/game/leaf-by-leaf-jam](https://playbloo.net/game/leaf-by-leaf-jam) | idle, casual | early-access |
| 9 | [Lab accident](https://twgrow.itch.io/lab-accident) | [/game/lab-accident](https://playbloo.net/game/lab-accident) | casual | released |
| 10 | [Dungeon Swap-R](https://potit-bob.itch.io/dungeon-swap-r) | [/game/dungeon-swap-r](https://playbloo.net/game/dungeon-swap-r) | puzzle | released |

## 内容与字段

- 逐款读取当前 itch 官方页面、作者、引擎、玩法、操作、状态及真实浏览器入口；10 个入口 HTML 均返回 HTTP 200。仅进行页面与静态资源核实，不声称实际通关或完整试玩。
- 10 款均填写英文短简介、About、How to Play、Controls、Tips、Features；每条事实以官方材料为依据，技巧是根据已核实机制作出的编辑建议。`missingDetailFields` 均为空。
- PACKARDOS 明确标注非官方、非营利 Pokémon 同人作品，虚拟卡牌无现实货币价值，并保留浏览器存档备份提示。
- II II II I I I I II 保留自伤与心理困扰内容提示；Lab accident 保留身体变化癖好与执念主题提示，说明当前线性剧情的六种变化，未把后续 Act 2 分支写成现有功能。
- Fake News Detective (In Space) 的官方封面明确标注 DEMO，按浏览器试玩版写入 `demo`。
- Dungeon Swap-R 以当前官方页面和开发者公告为准：1.3.0 内置 Bonus levels，旧在线社区服务与编辑器已退役；未沿用搜索缓存中的旧功能介绍。
- `itch_project_slug` 使用 `creator/project`；来源与外链均指向当前核实的官方游戏页，`iframe_url` 留空。
- 作品实际发行日、实际内容更新时间缺乏可靠依据，`release_date`、`last_updated_at` 保持 null。II-P 页面中明显虚构的 1111 年发行日期未采纳。
- 插入前再次查重；先创建未发布草稿，绑定 18 条既有分类关联，回读全部字段并验证匿名不可见，再按本批 ID 发布并同步写入实际 `updated_at`。未生成把收录时间当成版本更新的 `Added to PlayBloo` 动态。

## Supabase 图片存储

- 沿用现有公开 bucket **`game-media`**：10 张封面存于 `covers/2026-10-13/{slug}.webp`，27 张截图存于 `screenshots/2026-10-13/{slug}-{index}.webp`。数据库 `thumbnail_url` / `screenshots` 仅存完整的 Supabase Storage 公开 URL。
- 封面最长边不超过 640px，不放大，单张约 12.8–99.6 KiB；全部 37 张素材合计约 3.06 MiB。
- 每个对象均经过匿名公开读取、HTTP 200、WebP Content-Type、文件字节一致性与 SHA-256 校验。使用作品真实素材，未生成替代图。
- 未变更 bucket 权限，未覆盖历史素材；未调用图片优化器或旧预热脚本。

## 验证

- 匿名访问：发布前草稿不可读；发布后 10/10 可读。文案、身份、来源、分类、公开状态及上线时间回读一致。
- 线上详情页：10/10 通过 HTTP 状态、标题、五个正文栏目、Supabase 封面、itch 外链以及无 `/_next/image` 检查。
- 首页返回 HTTP 200，当前可见本批游戏 0 款；无图片优化器入口。
- 与修改前快照比较：原有 930 条游戏的内容、发布状态和时间戳均未改变（自然变化的访问/游玩计数不参与比较），既有分类关联保持一致。数据库现有 940 款。
- 生产构建：npm run build 通过；本批 10/10 正式 URL 已在构建 sitemap 收录，lastmod 与发布时间一致；923 个老游戏的 sitemap 时间戳与导入前一致；本批 10/10 已预渲染并验证全部正文栏目。

## Sitemap 与 llms.txt

- `src/app/sitemap.ts` 动态读取已发布游戏，以 `updated_at` 作为 `lastModified`；本批发布时间与该字段在同一发布操作写入，无需修改生成器。
- 线上 `/sitemap.xml`：本批 0/10 已收录，0/10 的 `lastmod` 与实际首次上线时间一致；与导入前 XML 对比，老游戏时间戳变更 0 条。
- 线上 sitemap 仍是发布前缓存，`revalidate=3600`。数据层及本地生产构建的结果单独记录；本次未获得已认证后台刷新会话，未绕过鉴权、未触发部署。线上收录需等待缓存刷新。
- 本批没有下架、删除或新增关卡页面；现有分类收录条件由动态生成器计算。
- 已检查 `public/llms.txt`：外链游玩、详情路由、目录和 sitemap 描述与实现一致，无需更新。

## 交付

- 详细字段、来源依据、公开图片 URL、文件校验值、游戏 ID、发布时间和验证结果见同名 JSON manifest。
- 数据库与 Storage 内容已在生产环境生效；本轮仓库仅新增导入报告及 manifest，没有应用代码修改，不执行 Git push 或部署。
- 请在 SEO 控制台将本批标记为「已用于 PlayBloo」。
