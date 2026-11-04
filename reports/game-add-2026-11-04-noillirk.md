# 手工上架：Noillirk（2026-11-04）

用户指定添加 noillirk.com 官方 embed `https://noillirk.com/embed/sky-climb`，并明确**游戏名以 Noillirk 为准**（Sky Climb 是它默认的招牌舞台名）。该 embed 即官方站自有路由（同域、无第三方壳），响应头无 X-Frame-Options / CSP frame-ancestors（可嵌入已验证），故 `iframe_url` 直连该 embed。iframe 游戏非 itch 外链，流程参照 itch-game-import 的写作与镜像规范手工执行（同 Farflung 先例）。

初版曾以舞台名 "Sky Climb"（slug `sky-climb`）入库，同日用戶纠正后整体改名 Noillirk / slug `noillirk`：PATCH games 行、素材重传至 `noillirk-*` 路径并删除旧对象、旧 URL 依赖缓存过期自愈（x-opennext-cache 约 45 分钟后 404，数据侧 slug 已不存在）。本报告按改名后的最终状态记录。

## 游戏档案

| 字段 | 值 |
|---|---|
| 游戏 ID | `810e8768-9f7a-4896-a646-346edb0ca808`（改名沿用同一行） |
| 标题 / slug | Noillirk / `noillirk` |
| 类型 | 每日众口词类问答（crowd trivia）：10 题每题 30 秒，答「大多数人会答的答案」得分，分数化作高度；默认舞台 Sky Climb 里热气球磷虾从森林池塘一路升到近地轨道（18 个分区） |
| 玩法来源 | noillirk.com 的 /sky-climb /how-to-play /scoring 实读核实（2026-11-04）；embed 页 og 元数据核对一致 |
| 播放方式 | 站内 iframe：`https://noillirk.com/embed/sky-climb`（官方 embed，页面自带「Play on noillirk.com ↗」外跳章） |
| 开发者 | Noillirk（站点页脚联系邮箱 hello@noillirk.com；注意官网横幅声明正更名 Crowdict，同一游戏同一账号） |
| release_date | 2026-10-15（官方 how-to-play："Daily #1 was October 15, 2026"；线上 embed 显示 DAILY #21 与该日期吻合） |
| 分类 | trivia、casual |
| monetization / status | free / released |
| platforms | browser、desktop、tablet、mobile（站点为 PWA，含 manifest） |
| graphics / multiplayer / engine | 2D / single-player / null（页面未披露引擎，不猜） |
| 封面 | `game-media/covers/2026-11-04/noillirk.webp`（800×500 WebP 55 KB；源图为官方 og.jpg 1200×630，sharp 模糊延展成 16:10 保留完整画面） |
| 截图 | 5 张官方 webp 原样镜像 `screenshots/2026-11-04/noillirk-{start,question,result,storm,orbit}.webp`（499×1080，覆盖开局/答题/揭晓/风暴/极光） |
| sources | official ×3（/sky-climb、/how-to-play、/scoring），verifiedAt 2026-11-04 |
| content_verified | true（五栏内容全部有官网依据） |

## 文案

五栏（description / how_to_play / controls / tips / features）+ 原创性三件套全部撰写；short_description 与 meta_description 为原创改写，未照搬官网句子。描述以 Noillirk 开篇并说明当前 embed 即其 Sky Climb 舞台，如实保留了官网更名声明（"Noillirk is now Crowdict"）。长度实测：

- `<title>` 渲染结果 `Play Noillirk Online - Daily Balloon Trivia | PlayBloo` = **54 字符**（≤60 ✓）
- meta description 渲染 151 字符（≤160 ✓）

## 写入与验证

- 写入三表：games（is_published=true 直接入库）、game_categories（trivia、casual 2 条）、game_updates（"Added to PlayBloo"，source_url 指向官网）。
- 查重：库内无 slug/title 含 noillirk / sky-climb 的记录（最接近的 SKY CLIMBER 3D 为另一款游戏），改名前确认 `noillirk` slug 未被占用。
- 线上 `https://playbloo.net/game/noillirk` HTTP 200：h1=Noillirk，`<title>`/meta description 逐字核对通过；封面直连自家 Storage 新路径（`_next/image` 出现次数 0，页面无旧 `sky-climb.webp` 引用）；点击 Launch 后 iframe 实际挂载 `https://noillirk.com/embed/sky-climb`（1022×600，cross-origin 正常），真实浏览器截图确认游戏画面完整渲染（DAILY #21 倒计时、Play today's 10、官方外跳章均在）。iframe 游戏的 src prop 与 Farflung 一致不在 SSR HTML 内、由客户端水合挂载，属站点现有机制。
- 旧 URL `/game/sky-climb`：改名后仍返回 200 属 OpenNext ISR 缓存（s-maxage≈45 分钟）滞留，数据侧 slug 已删除，缓存过期重新渲染即 404，无需处理。
- sitemap：动态生成（`game.updated_at` 作 lastmod）、1h 刷新，未等待线上 XML 收录；数据侧核验通过——noillirk `updated_at` 为当日实际上线时刻（改名 PATCH 会刷新本行 updated_at，但游戏本来就是 2026-11-04 首次上线，lastmod 仍等于上线日期），本轮未触碰任何老游戏行，farflung 等老游戏 updated_at 逐字未变，动态生成器无需改动。
- 本轮无游戏上下架之外的目录变化，未运行任何图片预热脚本（该脚本已废弃，只会白烧配额）。

## 时间戳说明

added_at / game_updates.published_at 为最初入库时刻 UTC `2026-11-04T10:36`；updated_at 因当日改名 PATCH 刷新为改名时刻，仍为上线日 2026-11-04 当天；release_date 用官方 Daily #1 首发日 2026-10-15，不充当 sitemap lastmod。

## 收尾提醒

- GSC：`https://playbloo.net/game/noillirk` 可到 Google Search Console「网址检查 → 请求编入索引」加速收录（单条手工提交即可）；旧 URL `sky-climb` 从未对外分发、未被收录，无需处理。
