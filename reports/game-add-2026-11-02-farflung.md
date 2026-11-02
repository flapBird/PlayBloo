# 手工上架：Farflung（2026-11-02/03）

用户指定添加 topgames.gg 的 embed 游戏 `https://topgames.gg/embed/farflung`。核实该 embed 实际内嵌的是官方站 `https://farflunggame.com/`（data-iframe 属性确认），故 `iframe_url` 直连官方站（topgames embed 仅作发现来源记录在 `sources`，不再套一层带广告 preroll 的第三方壳）。iframe 游戏非 itch 外链，流程参照 itch-game-import 的写作与镜像规范手工执行。

## 游戏档案

| 字段 | 值 |
|---|---|
| 游戏 ID | `7bed7f71-d3d1-4b34-a659-8138ad1661bd` |
| 标题 / slug | Farflung / `farflung` |
| 类型 | 每日地理猜谜（clue → 在无标签世界地图上钉国家，越冷门里程越多，满分 500 km） |
| 玩法来源 | farflunggame.com 官网 /how-to-play /game-modes /strategy /developer-notes 实读核实（2026-11-02） |
| 播放方式 | 站内 iframe：`https://farflunggame.com/`（官方站无 X-Frame-Options / CSP frame-ancestors，embeddable 已验证） |
| 开发者 | COPuzzle Media（官方 developer-notes 联系邮箱佐证，页面未显式署名） |
| release_date | 2026-10-19（官方 changelog "The first expedition" 首发日） |
| 分类 | educational、trivia |
| monetization / status | free / released |
| platforms | browser、desktop、tablet、mobile |
| graphics / multiplayer / engine | 2D / single-player / null（官网未披露引擎，不猜） |
| 封面 | `game-media/covers/2026-11-02/farflung.webp`（640×640 WebP，源图为 topgames.gg 的 1254×1254 官方 logo PNG，sharp 压缩 83 KB） |
| sources | official（farflunggame.com）+ topgames.gg（embed 页），verifiedAt 2026-11-02 |
| content_verified | true（五栏内容全部有官网依据） |

## 文案

五栏（description / how_to_play / controls / tips / features）+ 原创性三件套全部撰写；short_description 与 meta_description 为原创改写，未照搬官网句子。长度实测：

- `<title>` 渲染结果 `Play Farflung Online - Daily Geography Trivia | PlayBloo` = **56 字符**（≤60 ✓）
- meta description 渲染 142 字符（≤160 ✓）

## 写入与验证

- 写入三表：games（is_published=true 直接入库，与 itch 批次惯例一致）、game_categories（2 条）、game_updates（"Added to PlayBloo"，source_url 指向官网）。
- 查重：库内无 slug/title 含 farflung 的记录，无同名冲突。
- 线上 `https://playbloo.net/game/farflung` HTTP 200：`<title>`/meta description 逐字核对通过；封面直连自家 Storage（页面 `_next/image` 出现次数 0）；iframe URL 已进入 RSC payload（GameIframe 客户端水合后挂载，与其他 iframe 游戏一致）；封面 URL 单独请求 200 image/webp。
- sitemap：动态生成、1h 刷新，线上 XML 抓取时尚未收录（属预期滞后）；数据侧核验通过——游戏 is_published=true、`updated_at=2026-11-02T16:57:29Z`（即实际上线时刻），本轮仅此一行时间戳变动，老游戏 lastmod 未被改写。
- 本轮无游戏上下架之外的目录变化，未运行任何图片预热脚本。

## 时间戳说明

added_at / updated_at / game_updates.published_at 均为入库时刻 UTC `2026-11-02T16:57`（本地 2026-11-03 00:57）；release_date 用官方首发日 2026-10-19，不充当 sitemap lastmod。
