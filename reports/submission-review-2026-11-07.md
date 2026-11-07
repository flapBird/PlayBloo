# 用户投稿审核报告 — 2026-11-07

- 输入：2 条待审投稿（当日快照 `pending_review` 共 2 条）
- 结果：**通过 2**，重复 0，拒绝 0，待处理 0，失败 0
- 审核方式：人工编辑审核（渲染抓取 + 真实浏览器会话验证，含一次谜题点击试玩；无管理员会话，服务角色在本次授权审核范围内直接写库，`reviewed_by` 留 null，实际方式记录于各投稿 `extracted_data._editorial_review`）

## 去重与判定依据

写库前以当日快照（58 条投稿、1211 款游戏，含未发布草稿）扫描 `1in8billion`、`1 in 8 billion`、`sumthread`、`honest little`、`hla-games` 等身份关键词：0 命中；slug `1-in-8-billion`、`sumthread-daily-number-puzzle` 唯一。两案均为有可验证浏览器版本的单款游戏，按既定规则收录。

## 逐条结果

### 1. 1 in 8 Billion — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `afca83d8-68a0-43d7-8b66-f6fd63ab3766` |
| inputUrl | https://1in8billion.cc/ （source_type: official） |
| resolvedUrl | https://1in8billion.cc/en/ （页面 canonical；`external_url` 按投稿要求指向站点根） |
| identity | 独立维护的浏览器人生模拟（1in8b），站点未公布运营者姓名（仅联系邮箱）；自称与同名项目无关；目录无同款 |
| decision | approved |
| reason | 免费浏览器人生模拟，无需下载或账号即可开始（Beta v0.9.48）；渲染页 + 玩家指南 + 关于页于 2026-11-07 核实 |
| gameId / slug | `8e786c2b-4968-4c1e-9947-9caea69bce69` / `1-in-8-billion` |
| publishedAt | 2026-11-07T03:20:21.457Z（写入 `updated_at`，sitemap lastmod 同源） |
| game 字段要点 | 五栏齐全；platforms `["browser"]`；monetization `freemium`（核心免费，站点声明可能出现广告 + 可选 US$3 keepsake pass，付款不影响结局——about 页原文核实）；development_status `early-access`（Beta v0.9.48）；developer 留 null（站点无运营者姓名）；19 种界面语言（导航计数核实）； Ages 15+ 与课堂模式写入 features |
| categories | simulation、educational（真实统计数据驱动 + 课堂模式，有依据） |
| tags | single-player |
| researchSources | 1in8billion.cc 渲染首页（hero/设置区/页脚徽章）；/en/guide/（世界预设、节奏、里程碑提问、本地存档与转移码、分享卡）；/en/about/（数据来源、$3 pass、广告声明、课堂模式、API 档位）；浏览器实拍 2026-11-07 |
| missingDetailFields | 开发者姓名、engine、release_date |
| media | 封面 = 游戏开始界面实拍（源站 og-en.png 本身 404，未用失效资源）；截图 1 张 = 世界/节奏设置区实拍；均 2026-11-07 桌面浏览器 1280×800，WebP 压缩（640×400 封面 / 1280×800 截图），镜像至 `covers|screenshots/submissions-2026-11-07/`，公开 URL 逐一验证 200/image/webp/字节数一致 |
| 写库 | 草稿插入 → 关联写入 → 全字段回读 → 匿名查询确认草稿隐藏 → 条件发布（记录真实 `updated_at`）→ 投稿条件更新 `eq(id).eq(status,pending_review).eq(updated_at,读取值)` 返回 1 行；notes 原文保留 + 审核附录；`extracted_data` 原键全保留 + `_editorial_review`；`extraction_status` 保持 partial 未动 |
| outcome | 写回、发布、回读验证通过 |

### 2. Sumthread Daily Number Puzzle — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `bfe125e7-44c5-44d8-bdb2-e5bb8cd05746` |
| inputUrl | https://udrwu9c0tjuedqy2.github.io/hla-games/sumthread/daily-number-puzzle-for-beginners/#pz （source_type: official） |
| resolvedUrl | https://udrwu9c0tjuedqy2.github.io/hla-games/sumthread/daily-number-puzzle-for-beginners/ （去掉 #pz 的规范化入口，谜题即在本页） |
| identity | Honest Little Apps 的 Sumthread 网页伴侣（GitHub Pages）；与免费 iOS 应用（app-id 6829816144）同属一作但**不合并**——收录的游玩入口即浏览器页本身，与投稿描述一致；目录无同款 |
| decision | approved |
| reason | 免费浏览器谜题，直接在投稿页可玩、无下载无账号；2026-11-07 实拍每日盘并点击首格验证交互（Current segment 0/20→5/20、Tiles used 1/9、合法移动虚线出现），机制与页面 FAQ/规则文案一致 |
| gameId / slug | `7ec280d2-c8e3-4d2f-aa25-b5a034d551d1` / `sumthread-daily-number-puzzle` |
| publishedAt | 2026-11-07T03:20:28.014Z |
| game 字段要点 | 五栏齐全；monetization `free`；development_status `released`（网页伴侣已上线）；developer/publisher `Honest Little Apps`（og:site_name + 面包屑核实）；`developer_url` = hla-games 根（面包屑 JSON-LD 核实） |
| categories | puzzle |
| tags | single-player |
| researchSources | 投稿页 HTML + FAQ JSON-LD（规则、Clean Weave、划开看答案、7 个 weekday 练习盘、28 mini-challenges）；浏览器实拍与点击试玩 2026-11-07 |
| missingDetailFields | engine、网页版上线日期（iOS 应用 1.0.0 于 2026-11-02 上架，网页版首发日未公布） |
| media | 封面 = 投稿页官方 og.png（1200×630 → 640×336 WebP）；截图 2 张 = 2026-11-07 每日盘实拍（初始 + 点击后激活态）；镜像路径与验证同上 |
| 写库 | 同上流程；条件更新返回 1 行；notes 原文 + 附录；`extracted_data` 原键 + `_editorial_review`；`extraction_status` 保持 partial |
| outcome | 写回、发布、回读验证通过 |

## 写库与验证汇总

1. 两案均为通过并发布。审核判定与自动提取状态分开处理：`extraction_status` 保持 partial，人工补全记录在 `_editorial_review.method`，不冒充自动提取成功。
2. 回读核对：`status=approved`、`approved_game_id` 绑定正确、`reviewed_at` 写入、`reviewed_by=null`（无管理员会话，已在 `_editorial_review` 说明）、`duplicate_game_id=null`；notes 原文保留并追加审核说明；`extracted_data` 原键无损。
3. 老数据零改动：与当日基线全量比对（1211 款），老游戏 `updated_at`/`is_published` 变更 0 处（仅 1 款出现自然计数漂移，单独看待）；未触碰分类/标签/系列表；投稿终态 45 approved / 13 rejected。
4. 公开页面（浏览器实测）：两个详情页均渲染 About / How to Play / Controls / Tips & Tricks / Features 五栏与 Game Info；渲染 `<title>` 分别 40、55 字符（≤60），meta description 均 156 字符（≤160）；外链按钮指向各自官方入口；封面直连 Supabase 公开 URL，页面内 `/_next/image` 引用为 0（符合全局 `images.unoptimized: true`）；首页已实时收录两案。
5. sitemap：`src/app/sitemap.ts` 未改动。线上 XML 为旧缓存（1204 款游戏 URL 与基线一一对应，0 缺失 0 多余，全部 lastmod 与基线 `updated_at` 逐一致；两案尚未出现）。该路由 `revalidate = 3600` 且数据读取套 `unstable_cache`(1h)，服务角色直写不触发缓存失效——生产端将随下一个重验证周期自动收录，无需也无法在无管理员会话下手动刷新。本地生产构建（exit 0）+ 本地 sitemap 实测：1216 款游戏 URL 与当前库 published 集合精确一致（0 多 0 少 0 时间戳偏差），两案 lastmod 精确等于各自发布时刻（03:20:21.457Z / 03:20:28.014Z）。
6. 并行说明：快照与构建之间有另一会话于 03:30 上线 10 款 itch 游戏（非本轮改动，本轮未触碰其行）；本地 sitemap 对账已把这 10 款一并纳入并一致。
7. `public/llms.txt`：线上与仓库副本 diff 为空，未改动。本轮无应用代码改动，仅按惯例完成一次生产构建验证。

## 待跟进

- 生产 sitemap 将在重验证周期（≤1h）内自动收录两案，无需部署或手动刷新；下次例行核对时可顺带确认。
- 详情页模板当前不渲染 `screenshots` 数组（本轮两案的实拍截图已入库存储，与历史批次行为一致），如未来模板支持即可展示。
