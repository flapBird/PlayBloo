# Bloxd.io 单款上架记录（2026-11-17）

非 itch 雷达批次的单款导入：用户提供资源地址 `https://www.miniplay.com/embed/bloxd-io`（MiniPlay 嵌入页）。入库、文案、封面镜像沿用 itch-game-import 的规范，未走 fetch_batch / mark_used。

## 资源核实与嵌入源决策

MiniPlay 的 embed 页只是套壳：其内部 iframe 实际加载 `https://bloxd.io?mp_assets=...&mp_embed=0...`（minijuegos 分发参数），且自带 50px MINIPLAY 品牌条、preroll「点击开始」广告位和 GTM/GA 跟踪层，embed 页本身 `x-robots-tag: noindex`。

真源 `https://bloxd.io` 直连可达，响应头无 X-Frame-Options / CSP frame-ancestors。本地双 iframe 实测（localhost 第三方域嵌入）：**两个源都能完整跑起来**（同一个模式大厅、WebGL 正常、隐私弹窗可交互），直嵌 bloxd.io 画面干净无第三方 UI。据此 `iframe_url` 取官方源 `https://bloxd.io/`，与库内既有外源直嵌行（noillirk、farflunggame、escape-road 系列）同型；`source_type: official`。

## DB 写入

- games 行：id `1081b45f-4ef8-4716-87ed-313260ec0cf6`，slug `bloxd-io`，title `Bloxd.io`
- `iframe_url: https://bloxd.io/`（站内 Play Here 直嵌）；`external_url: ""`；`original_game_url / source_url / developer_url: https://bloxd.io/`
- developer `Arthur`（依据 MiniPlay 页面正文：独立开发者 Arthur，项目始于约 2021 年）；engine 未写（页面无依据）；graphics `3D`；multiplayer；development_status `released`；release_date 留空（原始发布月份无依据，前端相应隐藏 Released 徽标）
- 分类：multiplayer + survival（页面明示 Survival 为最热门模式）
- game_updates：1 条 "Added to PlayBloo"（摘要注明来源为 MiniPlay 目录 + 官网核验）
- sources：official（bloxd.io）+ miniplay.com 两条，verifiedAt 2026-11-17

## 文案（原创性三件套核验）

- meta_title 渲染后 57 字符（≤60）：`Bloxd.io - Free Minecraft-Style Online Sandbox | PlayBloo`
- meta_description 144 字符（≤155），原创句子
- editorial_take 为站点第一视角推荐语；short_description / 各字段均基于 MiniPlay 页面正文与官方站点信息改写，未照搬 og:description
- controls 仅列页面有依据的键位（WASD、Shift/双击 W、C/CapsLock、鼠标、1-8/滚轮、T/Enter、B、/）

## 封面

- 源：官方 og:image `https://bloxd.io/textures/miscImages/bloxd_io_free_online_games.jpg`（1200×630），弃用 MiniPlay 的 300×206 缩略图
- sharp 转 WebP 640×336 / q82 / 41KB，上传 Supabase Storage `game-media/covers/2026-11-17/bloxd-io.webp`（Cache-Control max-age=604800）
- 公网 GET 校验 sha256 与本地一致（6f7ddfc65873a00c…），已 PATCH `thumbnail_url`
- screenshots：无可镜像素材，留空（页面条件渲染）

## 验证结果

- 线上 `https://playbloo.net/game/bloxd-io`（经代理抓取）：HTTP 200；title 57 字符、meta description 144 字符均达标；"Play Here" 直嵌徽标、bloxd.io iframe、自家存储封面、Multiplayer/Survival 分类徽章、"Added to PlayBloo" Updates、"Source checked" 全部渲染正常。
- sitemap 数据侧核验：bloxd-io `updated_at = 2026-11-17T15:43:58Z`（= 实际首次上线时刻，非构建时间）；本轮写入仅涉及 bloxd-io 一行（insert + thumbnail PATCH），未改动任何老游戏行。线上 sitemap.xml 当前 201 条 URL 尚未含 bloxd-io：当前生成器（959e10e）有意只收录 `view_count ≥ 3` 的游戏页，新游戏随自然播放达标后自动进入（six-cats-under / sort-the-court / anxiety 即此路径），GSC 名单仅为已收录 URL 的保护名单，生成器无需修改；游戏页本身通过 new-games 列表与分类页内链可被抓取。
- 雷达回填：不适用（非 itch 雷达来源，无 mark_used 步骤）。

## 建议

- 到 Google Search Console 对 `https://playbloo.net/game/bloxd-io` 执行「网址检查 → 请求编入索引」。
- 若坚持使用 MiniPlay 套壳地址（含其广告与品牌条），把 games 行 `iframe_url` 改为 `https://www.miniplay.com/embed/bloxd-io` 即可。
