# 用户投稿审核 · 2026-10-26

本轮处理当前 **2 条待审核投稿，2 条全部核实为可玩的浏览器版本并补全发布**；重复、拒绝、待处理、失败均为 0。投稿为 Rivet Nova: Idle Online RPG 与 Allworld，均只收录经实时核实的浏览器版本。

使用完整实时基线：1,101 款游戏（含 7 条草稿）、47 条投稿。发布后目录共 1,103 条，其中公开 1,096 条；既有内容与此前已审投稿均未改动（老游戏时间戳与发布状态 0 变化）。

## 审核结果

| 游戏 / 正式页面 | 分类 | 实际首次上线时间（UTC） |
|---|---|---|
| [Rivet Nova: Idle Online RPG](https://playbloo.net/game/rivet-nova) | idle, rpg, multiplayer | 2026-10-26T15:53:29.294Z |
| [Allworld](https://playbloo.net/game/allworld) | simulation, multiplayer, casual | 2026-10-26T15:53:29.294Z |

## 去重与身份

- 快照 + 写库前两次实时查库：按 slug、标题模糊、来源 URL 三重核对（含未发布草稿），均无同款。
- Rivet Nova 身份采用官方 press kit factsheet：标题 "Rivet Nova: Idle Online RPG"，开发者/发行商 Rivet Nova。
- Allworld 身份采用官方站与 GitHub：开发者 kromate（官方站 Join in 区块以 github.com/kromate/joinallworld 为游戏源码，仓库 AGPL-3.0）。

## 可玩性核实（本次均为实时浏览器会话）

- **Rivet Nova**（game.rivetnova.com）：入口页 "AN IDLE MACHINE MMO / ENTER THE FORGE / BUILD 0.23.160"，点击直接进入游戏，无任何登录步骤；进入后为 1 级工作台（100 金币、5 水晶、20 金属/塑料，MAIN/QUESTS/RESEARCH/BATTLES/MARKET/CHAT/GUILD 导航，Build. Battle. Upgrade. 教程）。官方 press kit 确认 Google 账号关联是"跨 Android 与 web 续玩同一 pilot"的可选功能；网页预览版不处理 Google Play 支付，可选内购与激励广告属于 Android 正式版。投稿备注中"网页版需要 Google 登录"的说法已按核实事实更正并记录。
- **Allworld**（joinallworld.com）：加载完成后欢迎框显示 "284 real-world places to explore. Free, in your browser, no download."、"No password, no e-mail to start."，点 Play now 以游客角色（Lucky Chidi）出生在 Freedom Park · Lagos Island，钱包 ₦5,000，六项需求条、场所活动（Chill Under the Trees +4 Energy +10 Fun、Play Ayo +8 Fun +8 Social 等）、31 人在线（1 真人 + 30 个标注 AI 角色）、"Settle in" 安家流程、社区聊天/语音/地图/手机菜单。/about 与 GitHub 仓库确认早期 beta 与 AGPL 开源。按投稿说明与站点行为使用外链游玩（站点不能 iframe 嵌入）。

## 资料与文案

- Rivet Nova 另取官方 press kit 纯文本 factsheet、官网首页 FAQ，并对公开主 bundle 做静态阅读核对机制文案：HP 公式、每次制造尝试提升该部件成功率、首次 +1 升级受保护、7 天 UTC 登录连击、市集 5 级解锁、公会战周四报名 10 水晶/3 次进攻/最后 2 小时关闭、离线收集/研究/制造至多 4 小时、100 机械怪物、5 大部件族（电池/继电器/弹簧/弹丸/护甲）。仅静态核实与实机观察，未声称完整试玩，未创建账号、未发送消息、未付费。
- Allworld 另取官方 /about 与 GitHub README。五栏（短简介、介绍、玩法、操作、技巧、特性）均按已核实事实原创英文撰写；未知字段留 null 并在缺项记录（Rivet Nova：release_date；Allworld：engine、release_date、publisher）。

## 素材与写入

- 7 张图片压缩为 WebP（封面最长边 ≤640px、截图 ≤1280px、不放大），共 363,640 字节，逐张公开读取验证 200、image/webp、SHA-256 与上传一致。对象路径 covers/screenshots/submissions-2026-10-26/。
- Rivet Nova 用 press kit 官方媒体（robot-workshop 封面 + pvp-battle/pve-hunt/guild-map 截图）；press kit 明确允许带署名用于该游戏的编辑报道，图片为真实客户端截图（staged demo state），未冒充实况对局。Allworld 用官方 og 分享主视觉作封面 + 本次实机浏览器截图两张作 screenshot。
- 每款先插入 is_published=false 草稿、写分类关联、回读全部字段与关联，匿名确认公开页 404 且 anon 查询为空，再以真实发布动作显式写 updated_at=2026-10-26T15:53:29.294Z（即北京时间 23:53:29 的实际上线时刻）。
- 两条投稿按精确 ID、pending_review、原 updated_at 条件更新为 approved 并绑定 approved_game_id；reviewed_at=2026-10-26T15:54:07.318Z；服务角色直写，reviewed_by 留 null 不冒用管理员。原 notes 保留并追加审核说明（含对 Google 登录说法的更正），原自动提取字段保留，_editorial_review 记录方法/时间/依据/缺项。
- 没有创建游戏版本更新（game_updates），没有修改既有游戏、分类、标签或系列。

## 验证

- 投稿终态 2/2 approved 且关联正确；字段、分类、sources、verifiedAt 全部回读一致。
- 全量比较基线：1,101 款既有游戏的 updated_at 与发布状态 0 变化；自然访问/游玩计数单独排除。
- sitemap 回归测试 `node --test tests/sitemap/pagination.test.mjs` 5/5 通过。
- 以实时 catalog 直接执行当前 sitemap.ts 生成逻辑（Guides 生成器旁路为 []，未执行完整应用构建）：1124 条目；两条新 URL 收录且 lastmod 精确等于实际发布时刻；1,094 个老游戏 lastmod 与基线 0 差异；基线 7 条草稿 0 泄漏。新增游戏所属 5 个分类页（idle/rpg/multiplayer/simulation/casual）按"分类继承其游戏最近变更"的既有设计继承新 lastmod，非人工改写。

## Sitemap、缓存与 llms.txt

- 服务角色直写数据库不触发 Next.js 缓存失效；本机无管理员会话，不存在可用的认证失效路径。未伪造失效接口、未自动部署、未改老游戏日期强刷。
- 线上 sitemap.xml（HTTP 200）经 ISR/catalog 双层缓存自然过期后收录两条新 URL（共 1159 条目），lastmod 均精确等于发布时刻 2026-10-26T15:53:29.294Z；1,094 个老游戏单段 URL 的 lastmod 与基线 100% 一致，无草稿泄漏。缓存版本（生成于 2026-10-26T15:33:57Z，早于发布动作 12 分钟）先行核对同样 0 差异。
- 游戏详情页同为 ISR revalidate=3600：发布前草稿期验证匿名不可见时缓存的 404 在过期后自然刷新——rivet-nova 于 16:56:44Z、allworld 于 17:03Z 实测 HTTP 200，完整页面（标题、meta 描述、镜像封面、游玩外链、四栏、JSON-LD、分类链接、无 /_next/image）逐一验证通过。从发布到线上全量可见约 75 分钟，全部为缓存自然过期，无部署、无强刷。
- public/llms.txt 本地与线上一致（浏览器目录、外链游玩、投稿路由说明仍适配本批），未修改。

## 交付

数据库、投稿状态与公开页面/sitemap 均已实际生效（缓存自然过期完成）。本地仅提交本报告与 JSON manifest，不部署、不 push。报告与 manifest 不含投稿人邮箱、请求指纹、凭据或快照私人 notes 原文。
