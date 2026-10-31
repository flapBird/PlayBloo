# Eggy Car 入库记录 · 2026-10-28

单款指定入库（非 itch 雷达批次）。用户指定游戏入口 <https://ubg98.github.io/EggyCar/>，已核实为可用的 HTML5 浏览器版本并内嵌游玩。

- 页面：<https://playbloo.net/game/eggy-car>
- 游戏 ID：`d919d1d3-b0d1-4ccc-b1fe-305976d966b3`
- slug：`eggy-car`；状态：`is_published=true`、`content_verified=true`
- 上线时间：2026-10-28T06:40:23Z（= 本地 14:40，实际发布时刻；`created_at`/`updated_at` 均为该时刻）
- 生产库已发布游戏 1113 → **1114**（count=exact）

## 身份与版本

| 项 | 值 |
|---|---|
| 原名 | Eggy Car |
| 开发商 | Beedo Games（Poki 官方页标注） |
| 玩法 | 物理平衡类驾驶：保住车顶鸡蛋，开得越远越好 |
| 引擎 | Construct 2（镜像包为 Construct 2 导出） |
| 平台 | browser / desktop / tablet / mobile |
| 收费 | free-with-ads |
| 嵌入入口 | `https://ubg98.github.io/EggyCar/`（iframe + external_url 同址） |
| 原始来源 | `https://poki.com/en/g/eggy-car` |

已发布游戏目录中不存在任何 egg / eggy 同名或近似记录（按 slug 与标题查库确认），无需去重合并。

## 素材

用真实游戏画面截图，不使用生成图：

- 封面 `covers/2026-10-28/eggy-car.webp`：1280×720 截图 → 640×360 WebP，16,344 B
- 截图 `screenshots/2026-10-28/eggy-car-{1,2,3}.webp`：1280×720 WebP，各约 32–34 KB（开局、鸡蛋摔碎、结算菜单）
- 4 个对象全部上传 `game-media`，公开 URL 200 / `image/webp` / 字节 sha 一致，`cache-control=max-age=604800`

## 内容与 SEO 字段

- 五栏齐全（About / How to Play / Controls / Tips & Tricks / Features）+ `editorial_take` + `short_description`
- `meta_title`：`Eggy Car Unblocked – Play Eggy Car Online Free`
- `meta_description`：`Play Eggy Car unblocked in your browser: balance the egg over hills and jumps, collect coins and unlock cars. No download or install needed.`
- 正文自然覆盖 `eggy car unblocked`、`egg car`、`eggycart`、`eggy car game`；并说明目前未找到官方 Eggy Car 2（Poki 的 `eggy-car-2` 返回 404），不做假的二代页面
- 操作按游戏内提示板核实：D/→ 前进，A/← 后退；移动端屏幕踏板
- 未填 `release_date` / `last_updated_at`（无可信发行/更新依据）；未建 `game_updates`
- 来源：Poki 官方页、Coolmath 说明页、实际嵌入镜像，均记录 `verifiedAt`

分类：Driving、Casual、Arcade（复用现有分类，未新建）。

## Unblocked 标签（关键词聚合）

- 新建标签：name `Unblocked`、slug `unblocked-games`（ID `f1585b54-3e0d-40bc-999e-d85d957c7bd7`），聚合页 `/tag/unblocked-games`
- 关联全部 13 款可内嵌（`iframe_url` 非空）的已发布游戏：Beast Clash、Color Block Jam、Drift Rush、Eggy Car、Escape Road 1/2/3、Escape Road City 1/2、Escape Road Halloween、goodbye doggy、Undead Corridor、Wave Rider
- 未把外链 itch 游戏打上该标签：那些离开本站去 itch 玩，和 "unblocked / 站内直玩" 的意图不符
- 页面验证：`/tag/unblocked-games` 200，`<title>Unblocked Games - Browse Free Online Games Tagged with Unblocked</title>`，canonical 正确，`robots: index, follow`（13 ≥ 3），列出 13 个 `/game/*` 链接
- 游戏页验证：`/game/eggy-car` 渲染 `href="/tag/unblocked-games"` 标签徽章
- sitemap：本地 `/sitemap.xml` 仍有 1177 条、无 tag URL，原因是 `getCachedCatalog` 的 1 小时快照早于本标签创建（快照时 7 个旧标签各只有 1 款游戏，本就不满足 ≥3）。数据侧本标签 13 款已满足 `MIN_INDEXABLE_TAG_GAMES=3`，缓存 TTL 到期或重新部署后会出现 `https://playbloo.net/tag/unblocked-games`，lastmod 取 `tags.updated_at=2026-10-28T06:57:40Z`。未清理本地 1.3G ISR 缓存强行验证。

## 验证

- 本地 `next dev` 渲染 `/game/eggy-car` 200：title、description、canonical、OG image、H1、How to Play/Controls/Tips/Features、VideoGame JSON-LD 均正确
- 本地 sitemap 收录 `https://playbloo.net/game/eggy-car`，`lastmod=2026-10-28T06:40:23Z`
- 老游戏时间戳未变（抽查 death-spiral 2026-06-28、escape-road 2026-07-02、powder-peak-tycoon 2026-10-25、sun-smith 2026-10-27）
- iframe 嵌入实测：游戏在 iframe 内正常渲染到标题页（镜像无 X-Frame-Options/CSP frame-ancestors）
- 本地 dev 的客户端水合/HMR 在当前 workerd 环境下失效（现有 `escape-road` 页面同样点不动「Launch game」），因此「点击 Launch 后 iframe 出现」这一步未在本地走通；游戏本体与嵌入能力已单独验证。线上需人工点一次确认。

## 待办 / 注意事项

- 本轮仅写库 + 对象存储，未改任何代码，无本地 diff；sitemap 动态生成，无需改生成器。
- 服务角色直接写库不会失效 Next 缓存；新 slug 无缓存条目，会按需渲染。线上 sitemap 是否及时刷新取决于此前记录的 DO/tag-cache 故障是否恢复。
- 关键词落地建议见交付说明：不建议为 `eggy-car-2` / `egg-car` / `eggycart` / `eggy-car-unblocked` 各建一个重复游戏页。
- `/tag/unblocked-games` 的 sitemap 收录需等 catalog 快照刷新；生产缓存若仍处于此前记录的 DO 故障状态，需要部署或等故障恢复后才能体现。
