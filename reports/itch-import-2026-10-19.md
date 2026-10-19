# itch.io 批量导入记录 · 2026-10-19

本批 **8 款全部新增并发布**，重复、跳过和写入失败均为 0。首次实际上线时间：**2026-10-19T11:33:14+08:00**。生产库由 1,019 条增至 1,027 条（包含原有草稿）。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 |
|---|---|---|
| [Sheep Per Second](https://playbloo.net/game/sheep-per-second) | idle, simulation | demo |
| [Burst Blackjack](https://playbloo.net/game/burst-blackjack) | card, strategy | released |
| [Hypnosnake Simulator](https://playbloo.net/game/hypnosnake-simulator) | simulation | early-access |
| [Scrap Yard Tycoon](https://playbloo.net/game/scrap-yard-tycoon) | simulation, idle | released |
| [Boristan (playtest)](https://playbloo.net/game/boristan) | simulation, driving, multiplayer | demo |
| [Idle Fantasy Shop](https://playbloo.net/game/idle-fantasy-shop) | idle, simulation | released |
| [ケモショタがエナドリキめてたらかわいいよね](https://playbloo.net/game/te-kun-energy) | puzzle, arcade | released |
| [狐カフェ！Moreru&Moreta](https://playbloo.net/game/morerumoreta) | card, casual | released |

## 内容与素材

- 分页读取全部 1,019 条原有游戏，按 slug、creator/project 身份及来源 URL 查重；写入前再次核对，没有覆盖原有记录。
- 8 个官方 itch 页面全部取得。初次抓取的 429 和后续网络超时已重试补齐，没有把访问失败当成下架。
- 逐款编写英文介绍、玩法、操作、技巧及特性；技巧仅基于已核实玩法提出。未公布的控制细节明确引导查看游戏提示，没有编造键位，也没有声称完整试玩。
- Sheep Per Second 按官方说明标为 demo，保留可关闭进度遥测的提示。Hypnosnake Simulator 标为 early-access；其官方介绍较短，未扩写未证实的玩法。
- Idle Fantasy Shop 采用当前官方 0.12 正文，保留 24 小时离线收益上限、工人和批量制作解锁条件，以及浏览器存档备份提醒；没有沿用过时的“一小时流程”雷达摘要。
- Burst Blackjack 披露体型变化题材；Hypnosnake Simulator 披露催眠及缠绕题材；Moreru&Moreta 披露如厕幽默。两款日语游戏注明语言。
- Boristan 标为限时 demo，在短简介、正文和技巧中明确截止 **2026-10-20 17:00 UTC / 北京时间 2026-10-21 01:00**。官方称此后构建停止工作，届时需复核可用性。浏览器玩家可以加入合作游戏，主持人必须使用下载版；没有宣称浏览器可以主持。
- 雷达上架时间只保留为输入元数据；未将其当作原始发行日或 PlayBloo 上线日。release_date、last_updated_at 保持 null。
- 8 张封面、24 张截图，共 **32 张 WebP / 505,128 字节**。封面最大边 640px，截图最大边 1280px，不放大；素材联系表已视觉核对。
- Hypnosnake Simulator 官方页没有封面，使用公开浏览器包 data.js 内嵌的标题背景；Boristan 使用官方包 index.png 标题图。两款没有官方截图，不伪造游戏画面。
- 素材位于公开 game-media bucket 的 covers/2026-10-19/ 和 screenshots/2026-10-19/。32/32 公开读取、Content-Type、完整字节及 SHA-256 校验通过，没有覆盖旧对象；页面不请求 /_next/image。

## 发布与验证

- 先创建未发布草稿和 16 条分类关联，回读全部内容及分类，确认匿名用户看不到草稿，再按本批 ID 统一发布。
- added_at、updated_at 均为首次实际上线时间；8 条 Added to PlayBloo 收录记录使用同一时间，不冒充开发者版本更新。回读确认记录及来源链接正确。
- 8/8 浏览器入口 HTML 可读取；这只验证入口静态可用性，不代表完整游戏运行测试。
- 8/8 线上详情页 HTTP 200，标题、meta 简介、封面、官方外链及正文各栏目通过检查。额外用 HTML 解析器排除 script/style，确认介绍、玩法、操作、技巧、特性确实在正文中。
- 原有 1,019 条游戏内容、发布状态和时间戳保持不变；原有 2,130 条分类关联保持不变。自然增长的访问、游玩、外链点击计数和热度不作为内容变化。
- npm run build 通过。刷新本地 sitemap 查询缓存后，构建 sitemap 收录本批 8/8 正式 URL，lastmod 与首次上线时间一致；1,012 个老游戏时间戳保留，7 个原有草稿继续排除。
- 新游戏不在按热度选取的前 500 个预渲染页面中；8 个线上详情页已另行验证。首页 HTTP 200，检查时可见本批 0/8 款。

## Sitemap 与 llms.txt

- 动态 sitemap 根据已发布游戏数据生成，本轮无需修改生成器。新游戏 updated_at 使用实际首次上线时间，没有批量刷新旧游戏时间。
- 线上 sitemap HTTP 200；检查时本批收录 0/8，时间匹配 0/8，旧游戏 sitemap 时间戳变化 0 条。检查时仍可能受页面与查询缓存影响（sitemap 的 revalidate=3600），实际刷新时间以线上结果为准；构建结果已验证收录正确。
- 本轮没有游戏下架、删除或新增关卡；分类、标签和系列仍按现有动态规则收录。
- public/llms.txt 已检查，游戏路由、外链游玩、试玩范围和 sitemap 说明与当前实现一致，无需更新。

## 交付

生产库和公开存储已生效。本轮仓库只提交本报告与同名 JSON manifest，保留既有 wrangler.jsonc 修改。未修改应用代码、push 或部署。

请在 SEO 控制台将 **2026-10-19** 批次标记为「已用于 PlayBloo」。
