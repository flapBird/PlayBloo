# Pitfalls：真实事故清单（每条都发生过）

## 1. htmlgame.js 盗链拦截页（2026-11-06 last-flag-standing 事故）

复制的 index.html 若保留 `<script defer src="https://static.itch.io/htmlgame.js">`，该脚本会检查 `location.ancestorOrigins[0] ?? document.referrer`：嵌入方域名不是 itch.io/itch.zone 就 sendBeacon 上报 itch 并 `window.location` 跳转到 "You should be using itch.io" 盗链提示页。**顶层窗口打开时 ancestorOrigins/referrer 为空、不触发**——所以本地直开正常、测试全过，一到 PlayBloo iframe 里就炸。删标签后做逐字节校验（新文件 = 原文件 − 该 87 字节标签），防止误伤其他内容。

## 2. 批量上传禁止 shell 循环（2026-11-07 wreckbox 事故）

`xargs -I{} sh -c 'IFS="|" read -r a b c <<< "{}"; cmd "$a" ...'` 两个坑：`printf | read` 的 read 在子 shell 里执行、变量全部丢失，wrangler 收到空参数还可能静默"成功"；herestring 方案又因引号转义炸掉。**结论：批量上传一律用 `scripts/r2_upload.py`**（python subprocess 数组参数，无 shell 转义问题，逐文件校验 "Upload complete"）。

## 3. `r2 object get` 不接受 `-y`

`-y/--force` 只在 `r2 object put` 存在。给 get 传 `-y` 报 `Unknown argument: y`（且退出码可能仍是 0），校验脚本会全军覆没还看似正常。

## 4. 静态分析会被混淆骗过（wreckbox 案例）

游戏运行时会 fetch `https://vilonx-01.github.io/wreckbox-updates/version.json`，但源码里 `github.io`、`version.json`、甚至 `fetch(` 全部字符串拆散拼装、零命中。**判定依赖以运行时监控为准**（服务器访问日志 + 页面 `performance.getEntriesByType("resource")` + error 收集器），静态 grep 只是初筛。外部请求的判定标准：全部来自本域/本地 = 干净。

## 5. CDN 边缘缓存 300s

`max-age=300` 的对象重新上传后，立即 GET 可能命中旧边缘缓存。验证要么等 5 分钟，要么带随机 query 参数（Cloudflare 按完整 URL 含 query 缓存）。线上报"还是旧版"先看时间，别急着回滚。

## 6. performance 资源缓冲区上限 250 条

`performance.getEntriesByType("resource")` 默认只留 250 条，先到的记录会把后到的挤掉（last-flag-standing：241 面国旗把 12 个音效请求挤出了缓冲区，造成"音效没加载"的假象）。资源多的游戏先 `performance.clearResourceTimings()`，再触发要观察的交互，读完后立即取值。

## 7. ISR 1 小时：线上页面旧 ≠ 数据没生效

`/game/<slug>` 页面 `revalidate = 3600`。PATCH 数据库后线上页面可能还显示旧内容最长 1 小时。按站内约定：数据侧核验通过即收尾，**不要 sleep 等缓存**。要提前看嵌入效果，用本地页面 iframe 嵌 CDN URL 模拟（嵌入方为非 itch 域名即等价真实场景）。

## 8. fetch 垫片的两个边界

- 只对**绝对 URL**（含 `//`）做改道：相对路径请求若包含匹配关键词，`indexOf("//") = -1` 的处理路径不能动它，否则会把目录切掉（wreckbox 复验时测试请求被切成 `/version.json` 变 404）
- 改道目标必须**相对当前文档目录**解析（`location.pathname.replace(/[^/]*$/,"")`），本地根目录（`/index.html` → base `/`）与 CDN 子目录（`/games/<slug>/index.html` → base `/games/<slug>/`）才能同一份垫片通吃

## 9. content_verified 来源约束

`games_verified_content_has_source` CHECK：`content_verified=true` 时至少保留 source_url / original_game_url / developer_url / steam_url / itch_url / sources 之一。全部置 null 的 UPDATE 会直接报错。去 itch 化的解法：`source_url`/`official_website_url`/`sources` 改指非 itch 官方来源（作者官网、官方 Telegram 频道——游戏页脚和更新通道里通常有线索）。不要为了绕约束把 `content_verified` 改 false，那会动站点的信任标识。

## 10. sitemap 与 updated_at 约定

自托管改造是真实内容更新：该游戏的 `updated_at` 刷为实际修改时刻（sitemap lastmod 自动跟随）；其他游戏时间戳一律不动；无上下架不改 `src/app/sitemap.ts`。数据侧核验通过即收尾，不等 ISR/sitemap 缓存。

## 11. Ren'Py 导出的 PWA service worker 要整个移除（2026-11-08 my-sweet-pets-demo 事故）

Ren'Py web 导出自带 `service-worker.js` + index.html 内的注册代码（PWA 离线缓存）。iframe 嵌入实测中 SW 的 `cache.put(182MB response.clone())` 在受限存储环境直接炸掉 game.zip 下载（"Could not download game.zip: network error"），wasm 首次加载也报 "both async and sync fetching of the wasm failed"。**处理：删 service-worker.js 文件 + 精确移除 index.html 里的 SW 注册代码块（保留 `window.gameZipURL` 行）**，Ren'Py 引擎不依赖 SW，去掉后本地与 CDN iframe 嵌入全部正常。附带收益：避免 CDN 上更新游戏后 SW 缓存返回旧版。

## 12. r2_upload.py 的未知扩展名是静默跳过（2026-11-08 my-sweet-pets-demo 事故）

Ren'Py 的 `renpy.data`（引擎启动必需）因 `.data` 不在 CONTENT_TYPES 里被 "SKIP（未知类型）" 跳过，且该行混在正常输出里极易漏看——上传"93/93 成功"但游戏根本起不来。上传后必须核对：脚本输出的 SKIP 行逐条处理（给脚本补类型映射或手工补传），并抽一个**运行时关键文件**回读校验，不能只看成功计数。

## 13. Ren'Py 大体量 web 导出：182MB 单流 game.zip 在不稳网络下必然失败（2026-11-08 my-sweet-pets-demo 线上事故）

`renpy-pre.js` 的 `loadGameZip()` 是单次流式 fetch（无重试无续传），game.zip 93% 体积是音频时（本例 162MB/174MB），长连接任何一次抖动 = 整局失败（"Could not download game.zip: network error"）。修复三板斧（全部实测通过）：
1. **改写 renpy-pre.js**：Range 断点续传 + 10 次重试（206 续传 / 200 重来，`FS.open` 用 'a'/'w' 区分），CDN 的 206 支持先 curl 验证
2. **音频外移按需加载**：把 `game/audio/*` 从 zip 移除，追加进 zip 内 `game/renpyweb_remote_files.txt`（格式：`audio/x.mp3` 换行 `music <字节数>`；BGM/环境声用 music、一次性音效用 voice——该清单是运行时按需下载的资格表，loader 找不到文件且名单内有才抛 DownloadNeeded 触发 XHR）。游戏脚本用"逻辑曲目名→候选扩展名列表（mp3→ogg→wav）"运行时解析，`renpy.loadable` 认可清单内的远端文件，所以 wav 死重可直接剔除（本例 72MB menu_theme.wav / 67MB bgm_laboratory.wav 都有同名 ogg 且候选链里 ogg 优先/主菜单硬编码 ogg）
3. **缓存绕行**：zip/js 变更后 index.html 里给 `gameZipURL` 和 `renpy-pre.js` 加 `?v=N`（max-age=86400 的对象换内容，不加 query 会让边缘缓存旧版最长一天）

**重建 zip 的两个坑**：① 必须原样保留目录条目（`game/`、`game/images/` 等）——webloader 的 XHR 用 `FS.writeFile` 落盘**不建父目录**，缺 `game/images/` 目录条目会让场景图下载写入失败（报 `Download error: OK`）；② 用 python zipfile 重写时别把原清单和更新后的清单写重名（先跳过旧条目再写新的），写完 `Counter(namelist)` 查重。

验证口径：本地 http.server 日志能看到 `GET /game/audio/*.mp3` 按需请求（200→304）即管线通；CDN 顶层打开读 `performance.getEntriesByType("resource")` 确认全部同源且音频/图片按需命中。


