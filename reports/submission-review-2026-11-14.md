# 用户投稿审核报告 — 2026-11-14

- 输入：14 条待审投稿（当日快照 `pending_review` 共 14 条）
- 结果：**通过 13**，拒绝 1（Cartoon Crime，下载版），重复 0，待处理 0，失败 0
- 审核方式：人工编辑审核（渲染抓取 + 真实浏览器会话逐站验证，13 款全部实际试玩/交互；无管理员会话，服务角色在本次授权审核范围内直接写库，`reviewed_by` 留 null，实际方式记录于各投稿 `extracted_data._editorial_review`）

## 去重与判定依据

写库前以当日快照（73 条投稿、1262 款游戏，含未发布草稿）按 `bludle/seequence/glyph/guesshue/trak/colormatch/drinktheocean/pinidi/footbillion/fairway/chinamaxxing/hanzi gacha/snakestakes/skyvac/cartoon crime/buba/brainilab/whichsauce/cashflow` 等身份关键词扫描：Bludle 域已收录 7 款（本批 5 款均为该站新游戏，非重复）；其余 9 条来源域在目录中 0 命中；全部候选 slug 唯一。

## 逐条结果

### 1. Seequence — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `0ff0c377-886f-41a4-b567-e03f54fe0bab` |
| inputUrl | https://bludle.com/seequence/ （official） |
| resolvedUrl | 同输入（canonical `https://bludle.com/seequence`） |
| identity | Bludle 站点新游戏（COLOUR MEMORY 系列）；目录已有该站 7 款但无本款 |
| decision | approved |
| reason | 免费浏览器颜色记忆游戏（序列播放 + 四选一精确复现），无下载无账号；渲染页 + 浏览器实测（序列播放、答题 UI）2026-11-14 核实 |
| gameId / slug | `3ac328f0-65f8-4715-83dc-935875185fce` / `seequence` |
| publishedAt | 2026-11-14T13:30:19.401Z |
| game 字段要点 | 五栏齐全；platforms `["browser"]`；monetization `free-with-ads`（页面有 Advertisement 槽与第三方广告，实测）；levels 至 8 色序列、3 lives 写入 features |
| categories / tags | puzzle, casual / single-player |
| researchSources | bludle.com/seequence 渲染页（How to play 弹窗、HUD、答题界面）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 开发者姓名（站点不署名）、engine、release_date |
| media | 封面 = 2026-11-14 桌面浏览器答题界面实拍（1280×1600 视口截取游戏卡区域 → 640×549 WebP），镜像 `covers/submissions-2026-11-14/seequence.webp`，公开 URL 200/image/webp/字节一致 |
| outcome | 写回、发布、回读验证通过 |

### 2. Glyph — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `12270622-7c68-4f54-9233-c68d311b543c` |
| inputUrl | https://bludle.com/glyph/ （official） |
| identity | Bludle 站点每日视觉字谜（剪影猜词） |
| decision | approved |
| reason | 免费每日字谜：五词剪影、类别线索、3 次机会、扣分线索；渲染页 + 浏览器实测（今日 WEATHER 类 7 字母剪影盘）2026-11-14 核实 |
| gameId / slug | `7aaf272f-5c16-490b-8846-9fe1ebf0b481` / `glyph` |
| publishedAt | 2026-11-14T13:30:23.008Z |
| game 字段要点 | 五栏齐全；monetization `free-with-ads`；每日重置、本地 streak 写入 features |
| categories / tags | puzzle, casual / single-player |
| researchSources | bludle.com/glyph 渲染页（HOW TO PLAY 三步、线索扣分 -40）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 开发者姓名、engine、release_date |
| media | 封面 = 剪影谜题实拍（640×490 WebP），镜像路径与验证同上 |
| outcome | 写回、发布、回读验证通过 |

### 3. Guess Hue — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `14ba5e5c-106c-41a7-985b-9c4752dbf963` |
| inputUrl | https://bludle.com/guesshue/ （official） |
| identity | Bludle 站点色彩感知冲刺（九宫格找异色） |
| decision | approved |
| reason | 免费浏览器游戏：4 秒限时九宫格找异色 hue，streak 4/8/12/18 收窄 gap；渲染页 + 浏览器实测（ROUND 1 中盘截图，Hue gap 18°）2026-11-14 核实 |
| gameId / slug | `bd2a9aa7-7cd2-4b51-bdeb-218c247f7e5b` / `guess-hue` |
| publishedAt | 2026-11-14T13:30:25.201Z |
| game 字段要点 | 五栏齐全；monetization `free-with-ads` |
| categories / tags | puzzle, casual / single-player |
| researchSources | bludle.com/guesshue 渲染页 + 浏览器实拍 2026-11-14 |
| missingDetailFields | 开发者姓名、engine、release_date |
| media | 封面 = 中盘九宫格实拍（568×640 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 4. Trak — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `c381954a-e8eb-49e8-9edd-515dfbfdc652` |
| inputUrl | https://bludle.com/trak/ （official） |
| identity | Bludle Focus Lab 视觉追踪游戏（信号消失后凭节奏停止） |
| decision | approved |
| reason | 免费浏览器游戏：信号沿轨道移动后隐没，SPACE/tap 在目标圈内停止，3 lives 每次命中提速；渲染页 + 浏览器实测（SIGNAL HIDDEN 状态）2026-11-14 核实 |
| gameId / slug | `29c09573-160a-46be-bcec-ea0c48ef86e9` / `trak` |
| publishedAt | 2026-11-14T13:30:26.952Z |
| game 字段要点 | 五栏齐全；monetization `free-with-ads`；COST "Free, with no download required" 页面原文 |
| categories / tags | puzzle, casual / single-player |
| researchSources | bludle.com/trak 渲染页（HOW TO PLAY、规则表）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 开发者姓名、engine、release_date |
| media | 封面 = SIGNAL HIDDEN 实拍（640×539 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 5. Colour Match — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `dda2f06f-952d-4a85-8edf-b07d2ee70a49` |
| inputUrl | https://bludle.com/colormatch/ （official） |
| identity | Bludle 每日 RGB 调色挑战（复现今日色，一次提交） |
| decision | approved |
| reason | 免费每日游戏：RGB 三通道混色匹配目标色，按通道差值计分；渲染页 + 浏览器实测（Red=76 实时混色）2026-11-14 核实 |
| gameId / slug | `db7b4765-9404-4315-b89a-9122f923f4b5` / `colour-match` |
| publishedAt | 2026-11-14T13:30:28.536Z |
| game 字段要点 | 五栏齐全；monetization `free-with-ads`；One attempt / Lower difference wins 页面原文 |
| categories / tags | puzzle, casual / single-player |
| researchSources | bludle.com/colormatch 渲染页 + 浏览器实拍 2026-11-14 |
| missingDetailFields | 开发者姓名、engine、release_date |
| media | 封面 = Target vs Your mix 实拍（553×640 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 6. Footbillion — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `22ea3fd0-f524-4094-8c4d-199a4fcc4e80` |
| inputUrl | https://footbillion.com/ （official） |
| identity | 独立球迷每日足球问答（footbillion.com 自称 independent fan game，非 FIFA/Krillion 关联）；目录无同款 |
| decision | approved |
| reason | 免费、无注册的浏览器每日问答：7 prompts、3 tries + 45s shot clock、答案按稀有度定价 £10m–£150m、£1bn 目标；浏览器实测答题（Barcelona → GOAL! £10m，deep cuts 名单出现）2026-11-14 核实。数据源 Fjelstul WC Database (CC BY-SA 4.0) + OpenFootball (CC0) |
| gameId / slug | `5eb25123-59c4-4037-bf24-c1ea14b9a264` / `footbillion` |
| publishedAt | 2026-11-14T13:30:30.109Z |
| game 字段要点 | 五栏齐全；monetization `free`；development_status `released`（#9 期进行中，00:00 UTC 重置）；投稿 notes 的规则描述与页面/实测一致 |
| categories / tags | trivia, sports / single-player |
| researchSources | footbillion.com 渲染首页（mixer 规则、scoring 表、FAQ）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 开发者姓名（独立匿名作品）、engine |
| media | 封面 = 答题 GOAL! 实拍（572×640 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 7. Fairway Daily Game — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `2fe33c15-8522-4864-9d89-19619f6b6bd5` |
| inputUrl | https://fairwaydailygame.com/ （official） |
| identity | 独立原创每日高尔夫字谜（站点声明 prompts/answer tables/artwork 原创，© 2026）；目录无同款 |
| decision | approved |
| reason | 免费、无注册的浏览器每日游戏：5 洞 × 字谜提示，答案稀有度决定飞行距离（Common 40–60yds → Deep cut 271–300），水障/沙坑/30 秒球钟；浏览器实测一杆（Car → est. 31% · 40 yds · Fairway · 305 yds left）2026-11-14 核实 |
| gameId / slug | `1d200022-b176-4fed-8331-000fca62ae57` / `fairway-daily-game` |
| publishedAt | 2026-11-14T13:30:31.716Z |
| game 字段要点 | 五栏齐全；monetization `free`；development_status `released`（00:00 UTC 每日球场，152 prompts / 11,530 答案库） |
| categories / tags | puzzle, casual / single-player |
| researchSources | fairwaydailygame.com 渲染页（rules/hazards 表）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 运营者姓名、engine |
| media | 封面 = 击球结果实拍（640×360 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 8. BrainiLab Daily — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `bc05b42a-e9bc-4716-81f9-df3e7039ba1d` |
| inputUrl | https://brainilabgames.com/daily-quiz/ （official） |
| identity | BrainiLab（页脚 "Free quiz games, daily challenges and knowledge content from BrainiLab"）；目录无同款 |
| decision | approved |
| reason | 免费每日挑战：同一主游戏全员一致（今日 Daily #78 = Number Route）+ 可选加赛 1,000 分，00:00 UTC 重置，匿名可玩（账号可选）；浏览器实测进入 Number Route 并完成一步运算（8×7=56），÷ 按整除规则禁用 2026-11-14 核实。投稿 notes 各项与实测一致 |
| gameId / slug | `3a8e8016-8e61-4448-930d-6580dff61d27` / `brainilab-daily` |
| publishedAt | 2026-11-14T13:30:33.292Z |
| game 字段要点 | 五栏齐全；monetization `free`；development_status `released`；developer `BrainiLab`（页脚署名） |
| categories / tags | trivia, casual / single-player |
| researchSources | brainilabgames.com/daily-quiz 渲染页 + Number Route 游戏页实测 2026-11-14 |
| missingDetailFields | engine；站点有 Google Analytics/Meta 测量 cookies（可选同意），未列为广告 |
| media | 封面 = Number Route 实拍（640×237 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 9. Which Sauce Are You? — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `c4abef97-282f-4fef-9f0f-41634914d710` |
| inputUrl | https://whichsauceareyou.com/ （official） |
| identity | 独立原创 fan-made 测验（站点自称 independent, original fan-made quiz）；目录无同款 |
| decision | approved |
| reason | 免费、无注册的浏览器测验：21 题（20 + 1 隐藏奖励题）、5 维风味评分、16 + 1 secret sauce，纯前端运行不上传；浏览器实测答题自动推进（1/21 → 2/21）2026-11-14 核实。投稿称 20 题，实测 21 题（20 main + bonus），按页面事实收录 |
| gameId / slug | `f6cccbc9-b34c-4650-a3f0-e5caeb25411c` / `which-sauce-are-you` |
| publishedAt | 2026-11-14T13:30:34.913Z |
| game 字段要点 | 五栏齐全；monetization `free`；development_status `released`；明确 for entertainment only、answers never uploaded |
| categories / tags | trivia, casual / single-player |
| researchSources | whichsauceareyou.com 渲染页（five dimensions、hidden follow-up、FAQ）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 运营者姓名、engine |
| media | 封面 = Question 1 界面实拍（640×600 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 10. Cash Flow Lifestyle — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `d5b02d30-728e-456a-a444-2b40834acbaf` |
| inputUrl | https://cashflow.lifestyle/play/ （official） |
| identity | 独立教育项目（站点声明 inspired by classic financial literacy board games, not affiliated with any trademarked brand）；目录无同款 |
| decision | approved |
| reason | 免费、无注册的浏览器财务棋盘游戏：职业选择、Rat Race→Fast Track、1–4 人本地轮流、掷骰+卡片；浏览器实测开局（Engineer）并掷骰一步（Rolled 3 → Small Deal 卡，财务报表完整）2026-11-14 核实。投稿描述与实测一致 |
| gameId / slug | `ea7bffad-254b-4810-bb84-e57a67a21759` / `cash-flow-lifestyle` |
| publishedAt | 2026-11-14T13:30:36.504Z |
| game 字段要点 | 五栏齐全；monetization `free`；development_status `released`；developer `Cash Flow Lifestyle`（站点署名 + © 声明）；资金为虚构游戏币 |
| categories / tags | board-game, educational / single-player |
| researchSources | cashflow.lifestyle/play 渲染页（rules、profession 卡、win 条件）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 个人开发者姓名（项目署名）、engine |
| media | 封面 = 棋盘 + 卡片实拍（640×345 WebP，裁去底部 cookie 弹窗），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 11. Hanzi Gacha（汉字扭蛋） — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `521f1685-c949-4439-8640-9f840322f7e2` |
| inputUrl | https://chinamaxxing.site/ （official） |
| identity | chinamaxxing.site 的汉字扭蛋（站点 og:title「汉字扭蛋｜免费汉字抽卡小游戏」，52 字演示池）；目录无同款 |
| decision | approved |
| reason | 免费、无账号的浏览器中文 gacha demo：十连抽、C→LR 七档稀有度、墨兑换图鉴、连庄、今日一字、每日任务；浏览器实测十连（抽出 10 张、R×2 UC×4 C×4、图鉴 9/52、积分 36）2026-11-14 核实。站点禁用 iframe，按投稿要求外链收录 |
| gameId / slug | `1c07b4b9-639b-4de6-b727-a492a804b76c` / `hanzi-gacha` |
| publishedAt | 2026-11-14T13:30:38.816Z |
| game 字段要点 | 五栏齐全（英文撰写并注明界面为中文）；monetization `free`；development_status `demo`（站点自述 52 字演示版、概率为示例） |
| categories / tags | card, casual / single-player |
| researchSources | chinamaxxing.site 页面 HTML（玩法说明稀有度表）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 运营者姓名、engine、正式版计划 |
| media | 封面 = 十连抽卡面实拍（540×490 WebP，不放大），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 12. SnakeStakes — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `7676e770-793b-43bc-8b19-2f63eb36e9c9` |
| inputUrl | https://snakestakes.com/#world-section （normalized: https://snakestakes.com） |
| resolvedUrl | https://snakestakes.com/ （去掉锚点的规范化入口） |
| identity | 独立浏览器多人贪吃蛇（挪威语/英语双语站点，free private beta）；投稿 developer_name "SkyVac Norge AS" 未在页面出现，developer 字段留 null 并在报告/notes 说明 |
| decision | approved |
| reason | 免费访客世界无需账号即可玩（无下注、不存记录）；浏览器实测进入 guest world 并操控蛇移动 2026-11-14 核实。下注用非货币 chips（页面明确 "chips are never sold / no withdrawals or cash prizes"），非真钱赌博；付费会员计划尚未启用 |
| gameId / slug | `3d82d821-dc1d-4d55-8821-b698681f4728` / `snakestakes` |
| publishedAt | 2026-11-14T13:30:40.793Z |
| game 字段要点 | 五栏齐全；platforms `["browser"]`；monetization `free`（当前无任何支付；planned pricing 79kr/mo 写入 features 而非 monetization）；development_status `early-access`（页面明示 beta in development）；multiplayer `multiplayer`（在线共享棋盘） |
| categories / tags | arcade, multiplayer /（不加 single-player） |
| researchSources | snakestakes.com 渲染页（英文界面 guest world、membership FAQ、beta 声明）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | 开发者公司名核实（页面未显示 SkyVac Norge AS）、engine、上线日期 |
| media | 封面 = guest world 棋盘实拍（640×395 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 13. Drink the Ocean — 通过并发布

| 项 | 值 |
|---|---|
| submissionId | `1daab21a-2033-48da-9d44-3e5809f2271f` |
| inputUrl | https://drinktheoceangame.com/ （official） |
| resolvedUrl | https://playgama.com/game/drink-the-ocean （实际托管的游玩入口；Pinidi Studio 在 Playgama 有公开开发者档案 /developer/8395） |
| identity | Pinidi Studio 的第一人称增量游戏（Playgama 档案列有 Don't Make a Sound、Arrow Nexus 等 5 款）。投稿页 drinktheoceangame.com 是第三方 play page：自述 "we did not create the game"，credits Pinidi Studio 并嵌入 Playgama player，但无授权声明，故不作为收录入口，原输入保留在 `original_game_url` |
| decision | approved |
| reason | 免费浏览器游戏（托管渠道 Playgama 实测：前置 interstitial 广告后进入游戏，OCEAN DRUNK 0.48%、belly 2/10L、CLICK TO DRINK! 核心循环可见）2026-11-14 核实；Release date November 2026 |
| gameId / slug | `8be9428c-1f5b-4157-9e1d-3b25e55a9ff2` / `drink-the-ocean` |
| publishedAt | 2026-11-14T13:30:42.406Z |
| game 字段要点 | 五栏齐全；monetization `free-with-ads`（托管渠道实测前置广告 + banner）；development_status `released`；developer `Pinidi Studio`（Playgama 档案）；source_type `official` 指向 Playgama 档案页 |
| categories / tags | simulation, idle / single-player |
| researchSources | drinktheoceangame.com 渲染页（机制/控制/FAQ 文案）+ playgama.com/game/drink-the-ocean 档案页（开发者、release date、platforms）+ 浏览器实拍 2026-11-14 |
| missingDetailFields | Pinidi Studio 官网（未公布）、engine |
| media | 封面 = 游戏主界面实拍（640×303 WebP），同上验证 |
| outcome | 写回、发布、回读验证通过 |

### 14. Cartoon Crime — 拒绝

| 项 | 值 |
|---|---|
| submissionId | `7cdb3e67-13f0-4f39-8703-08796a96f27c` |
| inputUrl | https://store.steampowered.com/app/5057090/Cartoon_Crime/ （steam，App ID 5057090） |
| identity | BuBa Games（伊斯坦布尔二人团队）的开放世界犯罪沙盒，Steam 版 ¥13，2026-08-26 EA、2026-11-03 正式发售 |
| decision | rejected |
| reason | 仅 Windows 下载版：Steam 商店页只列 Windows 系统需求，无浏览器版本、无网页 demo；网络检索（2026-11-14）无 itch.io/HTML5/WebGL 版本。按既定规则"仅收录有可验证浏览器版本的单款游戏，下载版投稿拒绝" |
| 写库 | 条件更新 `eq(id).eq(status,pending_review).eq(updated_at,读取值)` 返回 1 行；`extracted_data` 原 Steam 数据键全保留 + `_editorial_review`（reason 含核实来源）；notes 原文 + 拒绝附录；`reviewed_at=2026-11-14T13:31:53.000Z`、`reviewed_by=null` |
| outcome | 写回、回读验证通过 |

## 写库与验证汇总

1. 13 款均为：草稿插入（is_published=false）→ 分类/标签关联 → 全字段回读（五栏、封面、monetization、platforms）→ 匿名客户端确认草稿隐藏 → 条件发布（记录真实上线时刻为 `updated_at`）→ 投稿条件更新（`eq(status,pending_review).eq(updated_at,读取值)`）为 approved 并绑定 `approved_game_id`。
2. **过程说明（如实记录）**：首次写库脚本对 PostgREST update 的 `count` 返回值误判（未传 count 参数时返回 null），误触发了 13 款游戏的收回发布回滚；回读确认 13 条投稿实际已全部更新成功（approved + 绑定正确）后，按同一批 ID 将 13 款游戏重新条件发布（`is_published false→true`，`updated_at` 记录 2026-11-14T13:30:19–13:30:42 的真实恢复上线时刻），并补齐 notes 审核附录。无重复创建、无老数据覆盖；投稿终态回读逐一验证。
3. 回读核对：13 条投稿 `status=approved`、`approved_game_id` 绑定正确、`reviewed_at` 写入、`reviewed_by=null`（无管理员会话，已在 `_editorial_review` 说明）；notes 原文保留 + 附录；`extracted_data` 原键 + `_editorial_review`；Cartoon Crime `rejected`。
4. **老数据零改动**：与当日基线全量比对（1262 款），老游戏 title/slug/发布状态/时间戳/五栏/来源/封面等全部字段 0 变更（1275 = 1262 + 13）；仅 2 款出现浏览/游玩计数自然漂移，单独看待；`game_categories` 2640（+26）、`game_tags` 36（+12）、`game_series` 6（不变），与新增关联精确一致。`pending_review` 剩 0。
5. 素材：13 张封面均为 2026-11-14 桌面浏览器实拍（1280 宽截取游戏核心区），sharp 压缩 WebP（5–26KB，最长边 ≤640、不放大），上传 `covers/submissions-2026-11-14/{slug}.webp`，逐一验证公开 URL 200 / image/webp / 字节数一致；页面引用直连 Storage 域，全站 `images.unoptimized: true` 未动，无 `/_next/image` 参与（13 页实测 nextImg=0）。未运行过时的 warm-image-cache 脚本。
6. **公开页面（线上实测 13/13）**：详情页均 HTTP 200 且渲染 About / How to Play / Controls / Tips / Features 五栏；渲染 `<title>` 30–46 字符（≤60）、meta description 150–155 字符（≤160）；外链按钮指向各自核实入口（Drink the Ocean 指向 Playgama 托管页）；封面直连 Storage URL。
7. 首页 `?sort=newest` 已实时收录本轮新游戏（浏览器实测 5 款可见）；/new-games 落地页导语已实时更新（"52 games joined in the last seven days — the newest, Drink the Ocean, landed today"），其卡片区数据仍为发布前缓存（服务角色直写不触发该页缓存失效，等 TTL 自动刷新——记录为缓存限制，未伪造失效路径、未自动部署）。
8. **sitemap**：本仓库 `src/app/sitemap.ts` 自 2026-11-12 起为策划版（view_count≥3 或 Search Console 已收录的 17 款 + 分类页 + guides；源码注释记录了 crawl budget 依据）。本轮 13 款新游戏 view_count 为 0，按现行收录条件暂不列入——与 2026-11-12 的站点决策一致，未改动生成器。线上 XML（72 款游戏页）与本轮基线逐一比对：lastmod 0 偏差、本轮新游戏未混入。本轮未下架/删除游戏，无依赖 URL 清理需求。
9. `public/llms.txt`：线上与本地一致（16602 字节），未改动。
10. 本轮无应用代码改动；`npm run build` 通过（exit 0）。未运行 sitemap 分页回归测试（未改 sitemap 代码）。
