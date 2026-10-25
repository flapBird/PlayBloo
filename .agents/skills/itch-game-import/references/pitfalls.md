# 踩坑清单（每一项都真实发生过）

按流程顺序排列。做批次导入时通读一遍，能避开本次会话踩过的所有坑。

## 1. 数据来源

- **SEOGrowthManage 本地仓库的 SQLite 是旧的**（`data/backlink_manager.db` 停更于 2026-08），itch 数据在远程服务器 Docker 里（`DATABASE_URL=sqlite:////app/data/backlink_manager.db`）。别查本地库。
- 拿数据首选**雷达 API**（`fetch_batch.py`）：`GET /api/itch/games?status=ready`，密钥在 PlayBloo `.env.local` 的 `ITCH_RADAR_API_KEY`（SEOGrowthManage 控制台 `/itch` 页签发，明文只显示一次）。**该站本机直连超时，必须走代理**（脚本默认 `http://127.0.0.1:7890`）。回退路：① 用户粘贴导出 Markdown（parse_and_fetch.py 仍支持）；② `SEOGrowthManage/.env` 的 `ADMIN_USERNAME/PASSWORD` 登录抓 `/itch/export`（最后手段，本机对该站 curl 可能被取消/超时）。
- 入库成功后用 `mark_used.py` 回填已用（`POST /api/itch/mark-used`，urls 原样传 imported-urls.txt 里的）。标记失败/漏标不致命——重复拉到同一款时 import_games 的查重会兜住，下次照常标记即可。
- 导出里的"状态：待补全 + 抓取备注 403"说明雷达服务器抓 itch 被拒——**本机走代理能抓到**，详情比导出丰富得多，值得逐款抓取。

## 2. 抓取 itch.io

- **itch.io 游戏页本机直连不通**（HTTP 000），必须走本地 Clash 混合端口 `http://127.0.0.1:7890`；代理端口可用 `curl -x http://127.0.0.1:7890 https://itch.io/` 探测。
- **img.itch.zone（封面）直连通常是通的**（HTTP 200），只有主站被墙——所以封面下载不用代理、高频下载时反而别走代理（代理出口被 itch 限速返回 400）。
- 雷达 403 的游戏页面，本机带浏览器 UA 走代理大多能抓到（雷达服务器 IP 被 itch 拒）。
- 页面 404 = 游戏在雷达抓取后已删除/隐藏，**跳过并在汇报中说明**，不要强行入库。
- 解析点：`og:image`（original 尺寸封面）、`og:description`、`<h1>`（页面实际标题）、侧栏 `<tr><td>Author/Made with/Genre/Published/Status/Platforms</td>...`、`formatted_description` div、`screenshot_list`。Author 缺失时用子域名兜底。
- 高频抓取时 itch 可能限速：并发 ≤6、失败重试。**HTTP 429 = 代理出口 IP 进入冷却**，单发请求是通的——降到 `--workers 2`、间隔几分钟再补抓；抓之前先单发验证。**404 要单发复核**再判定下架：同一批里既出现过真 404（开发者当天删页面，如 static-saints/last-lift），也可能只是限速误报（单发 200 的要重抓）。
- **某个 itch 子域整体不可达**（不是 404）：直连、代理、多个 DNS 解析出的 IP、境外中转服务全部超时或 522，说明是源站当前不可用（2026-10-21 的 misha.itch.io 就是这样）。别急着跳过——用 **Internet Archive 快照**取回官方页面：`http://web.archive.org/cdx/search/cdx?url=<host>/<slug>&output=json` 找最近快照，再抓 `https://web.archive.org/web/<timestamp>id_/<url>`（**必须加 `--compressed`**，否则拿到的是 gzip 原始字节）。快照里的正文、侧栏、截图与官方一致；发行日取快照里的 Published。
- itch **主站（itch.io 域名）是可达的**，即使子域不可达：用 `https://itch.io/search?q=<关键词>` 拿作者名、Genre、平台和评分，用官方 RSS（`https://itch.io/games/new-and-popular/free/platform-web.xml`）拿 pubDate 与封面。注意搜索里可能有**同名不同作者**的游戏，别张冠李戴。
- **封面来源冲突**：页面 `og:image` 有时不是封面（比如 lurkers.io 的 og:image 是张静态截图，而 RSS 给的是动图封面）。以 RSS 的 `imageurl` 为准；用户要求保留动效时优先选 GIF。

## 3. Supabase（生产库）

- **PlayBloo 仓库根的 `.env.local` 就是生产库**（oktplxtuew…supabase.co），`SUPABASE_SERVICE_ROLE_KEY` 可直接 REST 读写，站点游戏总量不大（2026-10 时 16→68）。
- **所有 supabase.co 请求必须直连（禁用系统代理）**：走本地代理时会随机报鬼错误——最典型的是 storage 上传报 `Bucket not found`（bucket 明明存在），切直连立刻正常。Python 里 `build_opener(ProxyHandler({}))`，curl 用 `--noproxy '*'`。本机环境 urllib 会读系统代理（getproxies），务必显式覆盖。
- **storage 公开 URL 必须带 bucket 名**：`/storage/v1/object/public/game-media/covers/x.png`。漏掉 `game-media/` 上传照样成功、DB 照样写入，但站点所有图片 400 裂图（2026-10-07 真实事故）。
- 唯一约束：`games.slug`、`games.itch_project_slug`（partial unique index，空串必须写 SQL NULL 或干脆不给该键；itch 导入用 slug 填充即可）。插入前对 DB 和批内双向查重。
- check 约束：`monetization IN ('free','free-with-ads','freemium','paid')`；`development_status IN ('upcoming','demo','early-access','released','discontinued')`；`content_verified=true` 要求至少一个来源字段非空（itch 导入天然满足）。
- 字段惯例（对照 death-spiral 等既有 itch 行）：`external_url=source_url=original_game_url=itch_url`；`platforms=["browser"]`（TEXT[]）；`screenshots` 为 URL 字符串数组（≤6 张，347x500 的即可）；`sources=[{url,type:"itch.io",verifiedAt:"YYYY-MM-DD"}]`；`cover_url`/`publisher`/`steam_url` 存空串；`iframe_url` 空 = 外链游玩模式（GameIframe 出"Play Here/External"按钮由 iframe_url 有无决定）。
- 分类只绑 `game_categories`（tags 表为空、既有 itch 游戏都没绑标签）。可用 slug：action, adventure, arcade, board-game, card, casual, clicker, driving, educational, fighting, horror, idle, multiplayer, music, platformer, puzzle, racing, rpg, shooting, simulation, sports, strategy, survival, trivia。
- **`game_updates` 表是 Updates 模块的数据源**，导入流程不写它就永远没数据（前台组件空数据直接不渲染）。每款游戏写一条 `title="Added to PlayBloo"`，`published_at` 用入库时间。
- 写完 `games` 后页面 5 分钟内出现（ISR `revalidate=300`，新 slug 无缓存首访即生成）；sitemap 1 小时刷新；详情页"相关游戏"来自 30 分钟的 `unstable_cache` 推荐池（key `public-recommendation-pool-v2`），改库后这部分最长滞后 30 分钟，别当成 bug。

## 4. 封面镜像与图片管道

- 镜像目标：公开 bucket `game-media`（不存在则创建，创建后等 2 秒再传），对象路径 `covers/{slug}.{ext}`，然后 PATCH `games.thumbnail_url`。旧 URL 存 mapping json 备查（itch 页面也可随时找回）。
- 上传用 `x-upsert: true` 头 + 正确 Content-Type。
- **上传必须带 `cache-control` 请求头（`max-age=604800`）**：Storage API 以该头作为对象的 cacheControl 存储；不带会存成 `no-cache`，CDN 每次浏览都回源校验每个封面——Supabase 免费版 1GB/月的 Log Ingestion 主要就是被这类请求烧掉的（2026-10-23 已用 `scripts/fix-storage-cache-control.mjs` 把存量 1489 个对象全部修成长缓存）。注意 `?cacheControl=` 查询参数不生效，会把对象重置回 `no-cache`；改完缓存头后公开 URL 的响应头要过一两分钟才跟着变，别当成没生效。
- 下载 itch 封面：直连 + 0.35s 节奏 + 失败重试；单图 <200B 视为可疑（HTML 错误页），报错。
- **GIF 素材要保留动效**：itch 封面/截图里经常有动图。sharp 处理 GIF 会把帧拼成一条超高长条（800×25650），必须走 ffmpeg + libwebp 转**动画 WebP**（`fps=10,scale='min(640,iw)':-2`、`-quality 52`、`-loop 0`）。转完要按帧核对：libwebp 解码页数 > 1、抽帧哈希各不相同，才算动图真的保住了；只看后缀名不算数。
- **上传后立刻读公开 URL 可能拿到 CDN 旧缓存**（同一路径重传后仍返回上一版字节与 sha）。校验要用带 cache-busting 参数的请求（`?cb=<ts>`），否则会误判成"改了没生效"。
- Storage CDN 回源对动画 WebP 的 Content-Type 是 `image/webp`，但 `ffprobe` 解不出动画 WebP（报 "image data not found"）；用 libwebp/sharp 读 `pages` 或直接数 RIFF 里的 `ANMF` 块。
- **站点前端套了 Cloudflare**：非浏览器 UA（Python-urllib、curl 默认 UA）访问 playbloo.net 会被 403。任何打站点的脚本都要带浏览器 UA。
- **Vercel Transformations 按（图片 × 宽度）计费，配额耗尽后所有新转换 402**，症状是"线上裂图、本地正常"（2026-10-11 事故：本地图片走 `/_next/image` 全裂）。2026-10-11 起 `next.config.ts` 已设 `images.unoptimized: true` 全局关闭优化器，所有图片直连原始 URL，页面不再产生 srcset/`/_next/image` 引用。**不要再运行 `scripts/warm-image-cache.mjs`**（优化器时代脚本，现在运行只会白烧配额）；若线上裂图复发，先查是否有人重新启用了优化器或删了该配置。

## 5. 站点架构备忘（影响导入决策）

- 详情页预渲染上限 500（`generateStaticParams`），`revalidate=300`；数据改动后最快 5 分钟反映（后台刷新，访客无感）。
- `/api/stats`（view/play/external_click 计数）是 5 秒延迟的 fire-and-forget，devtools 里 2s+ 属正常（serverless 冷启动+跨境），不影响渲染。
- 测站点性能时区分：源站（看 `x-vercel-cache`） vs 线路（国内到 CF/Vercel 晚高峰可能极差，TCP 握手 0.3-0.5s 但 TLS/传输波动 0.6s→60s+）。源站缓存命中还慢 = 线路问题，改代码没用。
- git 规则：本轮改动完成后 commit（不 push，除非用户要求）；skill/脚本入库到 `.agents/skills/`。
