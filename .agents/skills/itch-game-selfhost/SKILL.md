---
name: itch-game-selfhost
description: PlayBloo（playbloo.net）把 itch.io HTML5 游戏改造成站内自托管（R2 CDN iframe 直嵌）游戏的完整流程。当用户说「把这个 itch 游戏复制到本地 / 变成本地玩 / 上传 R2 / 变成站内游戏 / 内嵌上架 / CDN 直嵌 / 更新游戏地址为 cdn.playbloo.net / 去掉 itch 来源信息」，或给出 html-classic.itch.zone/html/<id>/index.html 形式的游戏资源地址要求处理时使用——即使没明说"用 skill"。覆盖：依赖拆解、itch 反盗链脚本移除、隐藏外呼改道、R2 上传、库内游戏记录的更新或新增。批量外链入库（不内嵌）走 itch-game-import，不要用本 skill。
---

# itch 游戏自托管上架（PlayBloo CDN 直嵌）

把 itch 托管的 HTML5 游戏完整复制为 PlayBloo 自托管资源并上架：定位资源 → 本地复制拆依赖 → 去 itch 化 → 本地实测 → R2 上传 → 更新/新增库内记录 → 收尾验证。已有成功实践：last-flag-standing（2026-11-06）、wreckbox（2026-11-07），两个案例差异很大，流程按本 skill 走可两者通吃。

**先读 `references/pitfalls.md`**——每一条都是真实事故，标了 ⚠️ 的步骤直接对应事故。

## 环境事实

- 本地游戏源码目录：`/Users/admin/Documents/出海/GameSource/<slug>/`（独立 git 仓库，与聚合站代码隔离，已初始化）
- R2 桶 `cdn-assets`，公开域 **`https://cdn.playbloo.net`**，路径 `games/<slug>/index.html`（**games 是复数**，与桶内既有约定一致，勿用单数）
- Wrangler：PlayBloo 项目本地 `npx --no-install wrangler`（OAuth 已有 R2 写权限，账号 leeswal123@gmail.com）。`r2 object put` 仅单文件、可带 `-y`；`r2 object get` **不接受 `-y`**；批量上传必须用本 skill 的 `scripts/r2_upload.py`，**禁止 shell 循环**（见 pitfalls #2）
- Supabase 生产库：`.env.local`（写入即上线），REST 直连
- 网络：`*.itch.io`、`static.itch.io`、`*.github.io` 直连不通走代理 `http://127.0.0.1:7890`；supabase、`cdn.playbloo.net` 直连；`playbloo.net` 直连多数可用、超时即切代理。打站点的请求一律带浏览器 UA
- 数据约束 `games_verified_content_has_source`：`content_verified=true` 的游戏必须保留至少一个来源字段（source_url / original_game_url / developer_url / steam_url / itch_url / sources 非空）——去 itch 化时必须给替代来源

## 第 0 步：授权风险检查（先于一切）

读 itch 游戏页的 License 栏；若游戏自带更新通道（version.json 之类），下载读其中声明——wreckbox 作者就在更新文件里明确写了「未经授权的副本不允许发布」。向用户明示风险再继续：**本地自玩**与**上架 CDN 对外**是两个风险等级，后者必须用户明确拍板，作者明示禁止的要在汇报里置顶提醒。

## 第 1 步：定位游戏资源 URL

- 通常由用户在 itch 页面控制台 `document.querySelector("iframe").src` 给出，形如 `https://html-classic.itch.zone/html/<id>/index.html?v=<时间戳>`
- 没给就自己抓 itch 游戏页 HTML 找 `id="game_drop"` 的 iframe（走代理 + 浏览器 UA）
- 保留 `?v=` 参数一起下载

## 第 2 步：本地复制

```bash
mkdir -p /Users/admin/Documents/出海/GameSource/<slug> && cd $_
curl -sL -m 30 "<资源URL>" -A "Mozilla/5.0 ..." -o index.html
```

slug 规则：库内已有游戏用库内 slug；新游戏用标题 kebab-case（与用户确认）。

## 第 3 步：依赖拆解（静态 + 运行时，缺一不可）

静态扫描（在 index.html 上）：
```bash
grep -oE '(src|href)="[^"]{1,150}"' index.html | grep -vE "#|data:|javascript:"   # 外链资源
grep -oE '"[^"]{1,120}\.(png|jpe?g|webp|gif|svg|mp3|ogg|wav|json|js|css|wasm|glb|bin|ttf|woff2?)"' index.html
grep -oE "https?://[a-zA-Z0-9.-]+/..." index.html                                  # 外部域名
grep -oE "(fetch\(|XMLHttpRequest|importScripts|new Worker|new Audio)" index.html   # 动态加载
```

⚠️ 运行时监控（必做）：**静态分析会被混淆骗过**（wreckbox 的版本检查 URL 连 "fetch(" 字样都查不到，全部字符串拆散拼装），必须用运行时实际请求为准：

1. `python3 -m http.server <port> --bind 127.0.0.1`（后台），**保留日志文件**——游戏若请求任何文件，日志必有记录；`/favicon.ico` 404 是浏览器行为不是依赖
2. 用 `control-browser` skill 打开页面，读取 `performance.getEntriesByType("resource")` 看真实发出的请求；⚠️ 资源缓冲区默认只有 250 条，资源多的游戏（如 196 面 SVG 国旗）会挤掉后面的记录，先 `performance.clearResourceTimings()` 再触发交互重测
3. 挂 `window.addEventListener("error"/"unhandledrejection")` 收集器看运行时报错

## 第 4 步：下载依赖

按运行时+静态清单并发下载（`xargs -P` 或 python），**保持源站目录结构**（`sfx/`、`flags/` 等相对路径原样）。逐文件校验：非零字节、文件头正确（mp3 的 ID3/MPEG 头、svg 含 `<svg`、png 签名）、必要时与源站逐字节比对。集合类依赖（如 flags/*.svg）的文件名清单从数据文件提取（如 world.json 的 flag 字段），保证与代码读取完全对齐。

## 第 5 步：去 itch 化

1. ⚠️ **必删** `<script defer src="https://static.itch.io/htmlgame.js">`——itch 反盗链脚本，检测到非 itch 域名 iframe 嵌入就把整个框架跳转到 "You should be using itch.io" 盗链页（顶层窗口打开不触发，所以本地直开正常、线上嵌入必炸，2026-11-06 事故）。删完做逐字节校验：新文件 = 原文件 − 该标签
2. 隐藏外呼（更新检查、统计打点等）→ 加 fetch 垫片改道到本地副本：**读 `references/fetch-shim.md`**，含完整代码与注入位置
3. favicon 抑制：charset meta 后加 `<link rel="icon" href="data:,">`
4. 代码内的 itch 字样（主机名判断 `ITCH = /itch\.(zone|io)$/`、模板字符串里的链接）不加载 itch 资源，**保留不动**

## 第 6 步：本地实测

`http.server` + `control-browser`：标题/菜单渲染 ✓ → 点进玩法操作几轮 ✓ → 运行时错误收集器为零 ✓ → 资源请求全部本地 ✓。截图给用户看。

## 第 7 步：上传 R2 并验证

```bash
python3 <skill目录>/scripts/r2_upload.py --dir /Users/admin/Documents/出海/GameSource/<slug> --target cdn-assets/games/<slug>
```

脚本自动生成 manifest（Content-Type 按扩展名、`index.html` 与 JSON 用 `max-age=300`、其余 `max-age=86400`）、并发上传、逐文件回读 md5 校验。手工单文件的语法：

```bash
npx --no-install wrangler r2 object put "cdn-assets/games/<slug>/<key>" --file <本地文件> --remote --content-type "<mime>" --cache-control "public, max-age=300" -y
```

⚠️ CDN 边缘有 `max-age=300` 缓存：上传后立即 GET 可能拿到旧版，等 5 分钟再验证，或带随机 query 参数绕过。

## 第 8 步：更新或新增游戏记录

先查库：`GET /rest/v1/games?or=(slug.eq.<slug>,itch_url.ilike.*<slug>*)&select=...`（apikey/Authorization 用 `.env.local` 的 `SUPABASE_SERVICE_ROLE_KEY`）。

### 已有游戏 → PATCH 更新（照 last-flag-standing / wreckbox 模式）

| 字段 | 动作 |
|---|---|
| `iframe_url` | `https://cdn.playbloo.net/games/<slug>/index.html`（变内嵌模式） |
| `external_url` / `original_game_url` | 置 null（移除外链 itch 按钮） |
| `developer` / `developer_url` / `itch_url` | 置 null（移除 itch 开发者信息展示） |
| `official_website_url` / `source_url` / `source_type` / `sources` | 改指向**非 itch 的官方来源**（作者官网、官方 Telegram 频道等，游戏页脚/更新通道里通常有线索）；`sources` 改为 `[{"url":"...","type":"official","verifiedAt":"<今天>"}]` |
| `updated_at` | 刷为实际修改时刻（真实内容更新，sitemap lastmod 随之更新） |

同步清理 `game_updates` 记录里的 "Discovered on itch.io's new releases feed" 字样与 `source_url`（`published_at` 保留原值）。PATCH 后逐字段回读核验。

### 新游戏 → 新增（读 `references/manual-add.md`）

按 itch-game-import 的 `references/content-guide.md` 规范写英文文案（含原创性三件套），三表插入（games / game_categories / game_updates），封面截图按其 mirror_media.mjs 惯例镜像。**入库前把将写入的记录摘要（标题/slug/分类/文案要点/来源）给用户确认**——这是生产库。

## 第 9 步：收尾

- 线上 `/game/<slug>` 页是 1h ISR：数据侧核验通过即可收尾，**不要 sleep 等缓存**；要闭环嵌入效果可本地起页 iframe 嵌 CDN URL 实测（嵌入方为非 itch 域名即等价真实场景）
- sitemap：无上下架则不动生成逻辑；老游戏时间戳只随本次真实更新变动
- 更新 PlayBloo `AGENTS.md`「CDN 游戏托管约定」里的现有游戏清单
- 提交两个仓库：GameSource（游戏文件与改动）、PlayBloo（AGENTS.md 等）
- 汇报：资源清单、隐藏外呼及改道情况、库内变更字段、**授权风险提示**（第 0 步结论）
