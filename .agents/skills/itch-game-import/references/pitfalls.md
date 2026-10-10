# 踩坑清单（每一项都真实发生过）

按流程顺序排列。做批次导入时通读一遍，能避开本次会话踩过的所有坑。

## 1. 数据来源

- **SEOGrowthManage 本地仓库的 SQLite 是旧的**（`data/backlink_manager.db` 停更于 2026-08），itch 数据在远程服务器 Docker 里（`DATABASE_URL=sqlite:////app/data/backlink_manager.db`）。别查本地库。
- 拿数据的两条路：① 用户直接把导出 Markdown 粘进来（最常见）；② 用 `SEOGrowthManage/.env` 里的 `ADMIN_USERNAME/PASSWORD` POST 登录 `https://seo.leeswalvpn.ccwu.cc/login`（表单字段 username/password，拿 session cookie 后 GET `/itch/export?date=YYYY-MM-DD`）。本机 shell 对该站 curl 可能被取消/超时，问用户要数据最稳。
- 导出里的"状态：待补全 + 抓取备注 403"说明雷达服务器抓 itch 被拒——**本机走代理能抓到**，详情比导出丰富得多，值得逐款抓取。

## 2. 抓取 itch.io

- **itch.io 游戏页本机直连不通**（HTTP 000），必须走本地 Clash 混合端口 `http://127.0.0.1:7890`；代理端口可用 `curl -x http://127.0.0.1:7890 https://itch.io/` 探测。
- **img.itch.zone（封面）直连通常是通的**（HTTP 200），只有主站被墙——所以封面下载不用代理、高频下载时反而别走代理（代理出口被 itch 限速返回 400）。
- 雷达 403 的游戏页面，本机带浏览器 UA 走代理大多能抓到（雷达服务器 IP 被 itch 拒）。
- 页面 404 = 游戏在雷达抓取后已删除/隐藏，**跳过并在汇报中说明**，不要强行入库。
- 解析点：`og:image`（original 尺寸封面）、`og:description`、`<h1>`（页面实际标题）、侧栏 `<tr><td>Author/Made with/Genre/Published/Status/Platforms</td>...`、`formatted_description` div、`screenshot_list`。Author 缺失时用子域名兜底。
- 高频抓取时 itch 可能限速：并发 ≤6、失败重试。**HTTP 429 = 代理出口 IP 进入冷却**，单发请求是通的——降到 `--workers 2`、间隔几分钟再补抓；抓之前先单发验证。**404 要单发复核**再判定下架：同一批里既出现过真 404（开发者当天删页面，如 static-saints/last-lift），也可能只是限速误报（单发 200 的要重抓）。

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
- 下载 itch 封面：直连 + 0.35s 节奏 + 失败重试；单图 <200B 视为可疑（HTML 错误页），报错。
- **站点前端套了 Cloudflare**：非浏览器 UA（Python-urllib、curl 默认 UA）访问 playbloo.net 会被 403。任何打站点的脚本都要带浏览器 UA。
- **`/_next/image` 只接受 next.config.ts 里配置的宽度**（imageSizes+deviceSizes），乱传 `w=241` 得 400；`q` 必须在 qualities 列表（60/75）。响应头 `x-vercel-cache: MISS/HIT` 可判断预热状态。
- **每次部署会清空 Vercel 图片优化缓存**，首个访客要为每图每宽度冷转换，弱线路上大量超时 → 全站裂图。部署后跑 `node scripts/warm-image-cache.mjs`（脚本用浏览器 UA，读 .env.local，把全部封面 × 96/240/480 宽度预热成边缘命中）。
- 排查页面图片 URL 时注意 HTML 里 srcset 的 URL 是**百分号编码**的（`%2F` 代替 `/`），grep `object/public/covers` 会漏报，grep `covers/<slug>` 或解码后再查。

## 5. 站点架构备忘（影响导入决策）

- 详情页预渲染上限 500（`generateStaticParams`），`revalidate=300`；数据改动后最快 5 分钟反映（后台刷新，访客无感）。
- `/api/stats`（view/play/external_click 计数）是 5 秒延迟的 fire-and-forget，devtools 里 2s+ 属正常（serverless 冷启动+跨境），不影响渲染。
- 测站点性能时区分：源站（看 `x-vercel-cache`） vs 线路（国内到 CF/Vercel 晚高峰可能极差，TCP 握手 0.3-0.5s 但 TLS/传输波动 0.6s→60s+）。源站缓存命中还慢 = 线路问题，改代码没用。
- git 规则：本轮改动完成后 commit（不 push，除非用户要求）；skill/脚本入库到 `.agents/skills/`。
