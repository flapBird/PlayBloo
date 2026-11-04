# 手工上架：Odio el chocolate（2026-11-04）

用户指定添加自建游戏，资源在自家 CDN：`https://cdn.playbloo.net/games/odio-el-chocolate/index.html`。该页即 Unity WebGL 完整游戏（productVersion "1-web-test"，无 X-Frame-Options，自有 CDN 直嵌已实测），故 `iframe_url` 直连该地址、`external_url` 留空（同 Farflung/Noillirk 的 iframe 直嵌先例）。iframe 游戏非 itch 外链，流程参照 itch-game-import 的写作与镜像规范手工执行。

标题命名说明：用户消息写作 "Odio el Chocolate"，但官方口径（Unity 元数据 productName、官网 `<title>`/og:site_name、itch H1）一致为句首大写式 **Odio el chocolate**（西语标题惯例，仅首词大写），故按官方写法入库；如需改成用户写法只需 PATCH games.title 一行。

## 游戏档案

| 字段 | 值 |
|---|---|
| 游戏 ID | `7858a2b3-9a8c-4198-9dd1-0ae3cb57f375` |
| 标题 / slug | Odio el chocolate / `odio-el-chocolate` |
| 类型 | Baldi 系第一人称校园恐怖 mod（粉丝自制）：在学校里收集巧克力、管理体力、记住路线找出口；追击 + jumpscare + 网络梗式荒诞幽默 |
| 玩法来源 | odioelchocolate.org 首页全节实读（游戏/玩法/按键/模式/建议/FAQ，2026-11-04）；开发者署名出自官网 /about/（"un juego creado por el fan Wantho"） |
| 播放方式 | 站内 iframe：`https://cdn.playbloo.net/games/odio-el-chocolate/index.html`（自家 CDN，浏览器实测警告屏→主菜单可交互、站内 Launch 后完整加载进警告屏） |
| 开发者 | Wantho（itch 作者页 wantho.itch.io；官网为独立运营粉丝站，声明与开发者互不隶属） |
| release_date | 2026-10-15（itch 页 Published: 15 October 2026 @ 15:52 UTC；开发者自述在生日当天发布） |
| 分类 | horror、survival |
| monetization / status | free / released（itch Status: Released；WebGL 构建带 "Development Build" 水印、版本 1-web-test，游戏本体状态以 itch Released 为准） |
| platforms | browser、desktop（必须键鼠、官网明示无触屏控制，故不含 tablet/mobile） |
| graphics / multiplayer / engine | 3D（第一人称 3D 校园 + 精灵角色，截图核验）/ single-player / Unity（web.loader.js 构建产物 + itch 标签） |
| 封面 | `game-media/covers/2026-11-04/odio-el-chocolate.webp`（640×360 WebP 16 KB；源图为官方 cover.webp 1280×720，与 itch og:image 同图，sharp 缩至管线规格） |
| 截图 | 6 张官方 webp 原图重压 `screenshots/2026-11-04/odio-el-chocolate-{menu,modes,modes-extra,classroom,hallway,classroom-detail}.webp`（1280×720，22-126 KB，按官网"Una mirada por dentro"区块顺序） |
| sources | official ×2（odioelchocolate.org 首页 + /about/）+ itch.io ×1（wantho.itch.io/odio-el-chocolate），verifiedAt 2026-11-04 |
| content_verified | true（五栏内容全部有官网/itch 依据） |

## 文案

五栏（description / how_to_play / controls / tips / features）+ 原创性三件套全部撰写；按键表逐字来自官网 controls 区块，四模式（Main Mode 13 块 / Low Cortisol 新手 3 块 / Baltazar / Triple Trouble）与恐怖内容警示（手电、jumpscare、巨响、闪烁画面、面向成人）如实保留；feature 含"No generative AI assets"（itch 页声明）。short_description 与 meta_description 为原创改写，未照搬官网 og:description。长度实测：

- `<title>` 渲染结果 `Play Odio el chocolate Online - Baldi Horror Mod | PlayBloo` = **59 字符**（≤60 ✓）
- meta description 渲染 151 字符（≤160 ✓）

## 写入与验证

- 写入三表：games（is_published=true 直接入库）、game_categories（horror、survival 2 条）、game_updates（"Added to PlayBloo"，source_url 指向官网）。
- 查重：库内无 slug/title 含 odio / chocolate 的记录，`odio-el-chocolate` slug 未被占用。
- 线上 `https://playbloo.net/game/odio-el-chocolate` HTTP 200：`<title>`/meta description 逐字核对通过；H1=Odio el chocolate；封面直连自家 Storage（页面 `_next/image` 出现次数 0）；iframe URL 已进入 RSC payload（GameIframe 客户端水合后挂载，与其他 iframe 游戏一致）。真实浏览器点击 Launch game 后 Unity 在站内 iframe 完整加载至游戏警告屏（截图确认），Instant Play / Play Here / Source checked 徽标、Horror+Survival 标签、编辑推荐区块、Game Info（Wantho、browser+desktop、Playable here）渲染全部正常。
- 截图数组与 noillirk 行为一致：详情页模板当前不把 screenshots 渲染为 DOM img（noillirk 页实测同为 0 处引用），6 张截图照惯例入库备后续使用。
- Storage：7 个对象全部 200 image/webp；对象元数据 cacheControl=max-age=604800 与既有封面一致（公开 URL 响应头本机统一显示 private, no-cache，noillirk/farflung 封面同此表现，属 Storage 公开端在本机的统一行为，非本次上传缺陷）。
- sitemap：动态生成（`game.updated_at` 作 lastmod）、1h 刷新，抓取时（入库后约 20 分钟）尚未收录，属预期滞后；数据侧核验通过——odio-el-chocolate `updated_at=2026-11-04T15:17:57Z`（即实际入库时刻，等于上线日 2026-11-04），按 updated_at 倒序全库扫描，2026-11-04 当天只有 noillirk（上一轮）与本行更新，farflung `updated_at=2026-11-02T16:57:29.800629Z` 逐字未变，动态生成器无需改动。
- 本轮无游戏上下架之外的目录变化，未运行任何图片预热脚本（该脚本已废弃）。

## 时间戳说明

added_at 为脚本内计算时刻 UTC `2026-11-04T15:17:46`，created_at/updated_at 为数据库写入完成时刻 `2026-11-04T15:17:57`（即 sitemap lastmod，等于上线日 2026-11-04 当天）；release_date 用 itch 官方首发日 2026-10-15，不充当 sitemap lastmod。

## 收尾提醒

- GSC：`https://playbloo.net/game/odio-el-chocolate` 可到 Google Search Console「网址检查 → 请求编入索引」加速收录（单条手工提交即可）。
- 游戏 UI 为西语/英语混合展示，文案已注明 "Spanish/English mixed presentation"；若后续用户要求统一标题大小写（Odio el Chocolate），改 games.title 即可，slug 不受影响。
