# itch.io 批量导入记录 · 2026-10-17 / 2026-10-18

两批各 10 款，共 **20 款全部新增并发布**；重复、跳过和失败均为 0。首次上线时间：**2026-10-18T10:29:29+08:00**。生产库由 970 条增至 990 条（含既有草稿）。

## 游戏清单

| 批次 | 游戏 / PlayBloo 页面 | 分类 | 版本 |
|---|---|---|---|
| 2026-10-17 | [Vaquejada Voxel](https://playbloo.net/game/vaquejada-voxel) | sports, simulation | released |
| 2026-10-17 | [링 오브 리더즈 (Ring of Leaders)](https://playbloo.net/game/ring-of-leaders) | rpg, strategy | early-access |
| 2026-10-17 | [TL;DR](https://playbloo.net/game/tldr) | idle, educational | demo |
| 2026-10-17 | [Rooklite](https://playbloo.net/game/rooklite) | board-game, strategy | demo |
| 2026-10-17 | [Star Trek Adventures Captain's Log Zine](https://playbloo.net/game/stclzine) | rpg, casual | released |
| 2026-10-17 | [Fireworks Incremental](https://playbloo.net/game/fireworks-incremental) | idle, strategy | early-access |
| 2026-10-17 | [One More Rock! - Demo](https://playbloo.net/game/omr) | idle, adventure | demo |
| 2026-10-17 | [Cycle of the First Dawn](https://playbloo.net/game/cycle-of-the-first-dawn) | idle, rpg | early-access |
| 2026-10-17 | [Legend of Idle](https://playbloo.net/game/legend-of-idle-playtest-demo) | idle, strategy | demo |
| 2026-10-17 | [Retromine](https://playbloo.net/game/retromine) | card, strategy | released |
| 2026-10-18 | [人狼調査](https://playbloo.net/game/werewolf-screening) | puzzle, casual | released |
| 2026-10-18 | [ねこダマし -Nekodamashi-](https://playbloo.net/game/nekodamashi) | card, casual | early-access |
| 2026-10-18 | [Drag Race Simulator](https://playbloo.net/game/drag-race-simulator) | simulation, casual | released |
| 2026-10-18 | [Average Routine](https://playbloo.net/game/average-routine) | rpg, strategy | released |
| 2026-10-18 | [USB: Plug It In Right](https://playbloo.net/game/usb-plug-it-in-right) | arcade, casual | released |
| 2026-10-18 | [Numberblocks - 30 Times Table](https://playbloo.net/game/30-times-table) | platformer, educational | early-access |
| 2026-10-18 | [Asteroid Incremental](https://playbloo.net/game/asteroid-incremental) | idle, simulation | early-access |
| 2026-10-18 | [Stick Fight Arena Pre-Alpha](https://playbloo.net/game/stick-fight-arena-pre-alpha) | survival, action | early-access |
| 2026-10-18 | [The Rift Machine (Demo)](https://playbloo.net/game/the-rift-machine-demo) | idle, simulation | demo |
| 2026-10-18 | [Imperium Host](https://playbloo.net/game/imperium-host) | idle, rpg | early-access |

## 内容与素材

- 全量分页读取 970 条原有记录并按 slug、来源 URL、creator/project 身份查重，写入前再次核对；没有覆盖原有游戏。
- 20 个官方 itch 页面全部取得；直连及代理曾遇到超时、429 和 SSL 错误，重试后补齐。Numberblocks 和 Asteroid Incremental 另通过网页检索核对官方资料。
- 逐款编写英文介绍、玩法、操作、技巧及特性。无明确键位的游戏保留原页面操作提示，不编造快捷键。技巧是依据已确认玩法提出的编辑建议，没有声称通关或完整试玩。
- TL;DR 仅介绍 Moby-Dick 第一章；Rooklite 仅介绍 Tide 第一世界。One More Rock!、Legend of Idle 和 The Rift Machine 标为 demo。开发中及 pre-alpha 游戏标为 early-access。
- Ring of Leaders、Numberblocks 和 Drag Race Simulator 明确标注非官方同人；Captain's Log Zine 明确为桌游辅助应用。Nekodamashi 保留轻度性暗示幽默提示。
- Vaquejada Voxel 的 itch 页面无正文，玩法和控制仅使用其公开浏览器入口界面可核实的信息，并注明未完整试玩。
- Imperium Host 保留浏览器关闭前备份 save code 的提醒；Asteroid Incremental 保留 0.2 需要新存档的提醒。
- 雷达上架时间仅留在输入元数据，不冒充游戏原始发行日或 PlayBloo 上线日；release_date、last_updated_at 保持 null。
- 20 张封面、78 张截图，共 98 张 WebP，约 1.51 MiB；封面最大边 640px、截图最大边 1280px，不放大。GIF 使用首帧静态展示；封面联系表已视觉核对。
- 素材存于公开 game-media bucket 的 covers/2026-10-18/ 和 screenshots/2026-10-18/，逐张校验公开读取、Content-Type、完整字节及 SHA-256；没有覆盖旧对象。

## 发布与验证

- 先创建未发布草稿和 40 条既有分类关联；回读字段、分类及匿名不可见性，再按本批 ID 统一发布。
- added_at、updated_at 同时记录首次实际上线时间；20 条 Added to PlayBloo 收录记录使用同一发布时间，不冒充开发者游戏版本更新。
- 20 个浏览器入口 HTML 均可下载；这属于入口静态可用性验证，不代表完整游戏运行测试。
- 20/20 线上详情页 HTTP 200，标题、正文栏目、meta 简介、镜像封面及官方外链检查通过，没有 /_next/image。
- 原有 970 条记录的内容、发布状态和时间戳不变；原有分类关联不变。访问计数与热度自然变动不作为内容变化。
- 首页 HTTP 200；检查时可见本批 0/20 款，页面存在 ISR 缓存。
- npm run build 通过；本批 20/20 正式 URL 已在构建 sitemap 收录，lastmod 与发布时间一致；963 个老游戏的 sitemap 时间戳与导入前一致；本批 1/20 被预渲染（当前按热度选取前 500 款）；20 个线上详情页的正文已另行验证

## Sitemap 与 llms.txt

- 动态 sitemap 使用公开游戏 updated_at；本轮构建验证 20/20 正式 URL 收录，lastmod 等于首次上线时间，旧游戏时间戳保留，未发布草稿排除。
- 线上 sitemap HTTP 200，检查时收录本批 0/20，发布时间一致 0/20，旧游戏时间戳变化 0 条。若尚未出现，属于最长一小时 ISR 缓存；没有自动部署。
- 本轮没有游戏下架、删除或新增关卡；分类等收录由现有动态规则决定。没有改 sitemap 生成器，也没有刷新老游戏时间戳。
- public/llms.txt 已检查，现有路由、外链游玩和 sitemap 说明一致，无需更新。

## 交付

生产库和公开存储已生效。本地仅提交本报告与同名 JSON manifest；没有应用代码修改、Git push 或部署。

请在 SEO 控制台将 **2026-10-17 和 2026-10-18** 两批标记为「已用于 PlayBloo」。
