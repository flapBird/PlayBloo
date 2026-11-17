# Cold Smoke（雪迹）自托管上架记录（2026-11-18）

把 2026-11-17 外链上架的 itch 游戏 Cold Smoke 改造成站内直嵌（R2 CDN iframe）。资源 = 单个 ~1.7 MB HTML 文件（画面声音全部代码生成，零素材文件），是 selfhost 场景里依赖最少的一例。

## ⚠️ 授权风险（置顶）

itch 页面**无 License 栏**（侧栏只有 Author/Genre/Platforms/Published/Status/Tags）= 默认「保留所有权利」；作者 huiskylabs 无任何对外官网/社交链接，也未明示禁止转载。用户明确要求改站内直嵌后按既有惯例执行；若作者日后提出异议，下架路径 = 删 R2 `games/cold-smoke/` + games 行 iframe_url 置空。developer 字段保留真名 `huiskylabs` 作为署名。

## 资源与改造

- 真实游戏 iframe：`https://html-classic.itch.zone/html/20525775/index.html?v=1794687949`（页面静态 HTML 无 game_drop，从页面内嵌数据属性提取）
- GameSource 仓库：`/Users/admin/Documents/出海/GameSource/cold-smoke/`（独立 git，commit 9f424ab）
- **去 itch 化**：删除 `<script defer src="https://static.itch.io/htmlgame.js">`（唯一 itch 引用，逐字节校验 -333B）；文件内不再含任何 `http(s)://` 外链
- **字体自托管**（新增于本例，此前 selfhost 案例未涉及）：游戏 JS 运行时注入 3 个 Google Fonts CSS（Jost、Cormorant Garamond、Noto Serif SC）。Noto Serif SC 走 `&text=` 精确子集（界面汉字），三个字重共用 1 个 26 KB woff2。已抓全部 CSS + 9 个 woff2（共 ~203 KB）落地 `fonts/`，CSS url 改写为相对路径，游戏内 `add()` 调用改指本地 CSS——国内访客不再依赖被墙的 fonts.googleapis.com
- favicon 抑制：charset meta 后加 `<link rel="icon" href="data:,">`
- 隐藏外呼：无（fetch/XHR/Worker/Audio 静态扫描全 0，运行时审计亦无外呼）

## 本地实测（control-browser）

- 菜单渲染 ✓（雪迹衬线标题 = 本地字体生效）；程序化建山进度条（立起天空→点亮星云→种树→调光→铺雪→第一缕光）约 60s
- 点「出发」进玩法：转向/Shift 加速（39→63 KM/H）/跳跃正常
- 运行时审计：5 个资源请求全部本地，external=0，error/rejection=0

## R2 上传与 CDN 验证

- r2_upload.py：13 个文件（index.html + fonts 12 个）上传 cdn-assets/games/cold-smoke/，回读 md5 全部一致
- CDN 直连验证：index.html 200 / text-html / max-age=300，字体 max-age=86400，index.html 与本地逐字节一致
- **iframe 嵌入实测**：本地 8925 端口包装页（非 itch 域名嵌入方 = 等价真实场景）iframe 嵌 CDN URL——游戏正常加载、场景生成进行中、无盗链跳转（htmlgame.js 移除有效），跨域 iframe 内 WebGPU 正常工作

## 库内变更（照 last-flag-standing / wreckbox 模式 + 库内四先例字段惯例）

- `iframe_url` → `https://cdn.playbloo.net/games/cold-smoke/index.html`（站内 Play Here 直嵌）
- `external_url` / `original_game_url` / `itch_url` / `developer_url` / `official_website_url` → null
- `developer` 保留 `huiskylabs`；`source_url`/`source_type` 保留 itch.io（唯一真实上游，非 itch 官方源不存在，也满足 content_verified 来源约束）；`sources` 更新 verifiedAt 2026-11-18
- `updated_at` → 2026-11-17T16:19:47Z（真实内容更新时刻，游戏自身时间戳按 skill 约定刷新）
- game_updates："Added to PlayBloo" 摘要重写（去掉 itch feed 字样、注明站内可玩），`source_url` 置 null，`published_at` 不变
- PATCH 后逐字段回读核验 ✓；前端公开页本就不渲染这些 attribution 字段，显示变化仅 External 按钮消失、Play Here 出现

## sitemap 与收尾

- 无上下架变动（同一游戏改播放模式）：生成器不动；cold-smoke 仍 0 浏览，低于 view_count≥3 收录线，暂不进 sitemap；老游戏时间戳零改动
- 线上 `/game/cold-smoke` 为 ISR 缓存，数据侧核验通过即收尾，未等待缓存刷新
- AGENTS.md「CDN 游戏托管约定」清单已补 `cold-smoke`
- 两仓库提交：GameSource（游戏文件）+ PlayBloo（AGENTS.md + 本报告）
