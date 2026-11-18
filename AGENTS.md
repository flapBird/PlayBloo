<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sitemap 维护约定

- 每轮功能迭代或修改结束前，检查本轮是否新增上线、下架或删除了游戏。若有，必须同步更新 sitemap 信息并验证结果；若无，不因本轮迭代而刷新游戏的 sitemap 时间戳。
- 本项目通过 `src/app/sitemap.ts` 动态生成 `/sitemap.xml`。根据实际改动维护游戏数据、收录条件或生成逻辑；动态生成已能正确反映上下架状态时，无需为了留下文件差异而修改生成器。
- 新游戏上线后必须收录其正式 URL，sitemap 的 `lastModified`（XML 中的 `<lastmod>`，即更新时间）使用该游戏在 PlayBloo 的实际首次上线日期。不得使用游戏原始发行日期、提前导入或创建记录的日期，也不得使用之后构建、部署或生成 sitemap 的时间代替上线日期。
- 本站可玩（iframe 直嵌，`iframe_url` 非空）的游戏不设浏览量门槛，必须收录进 sitemap：`src/app/sitemap.ts` 的 featured 查询已带 `iframe_url.like.http*` 条件（2026-11-18 起），自托管上架或转直嵌完成后即自动收录，不等自然播放。注意查询里用 `like.http*` 匹配真实嵌入 URL——PostgREST 的 `neq.""` 会把空字符串行一并放行（实测 897 vs 真实 35），不能用。外链游玩的游戏维持 `view_count≥3`（或 GSC 名单）的收录线。
- sitemap 中老游戏已有的内容更新时间必须保留。不得因新增其他游戏、下架游戏、批量导入、数据同步、功能迭代、构建、部署或重新生成 sitemap 而批量改写老游戏的 `lastModified`，也不得为了刷新 sitemap 而批量更新老游戏的 `updated_at`。除非用户另有明确要求，不调整老游戏已有的 sitemap 更新时间。
- 游戏下架或删除后，必须从 sitemap 移除对应游戏 URL，以及依赖该游戏上线状态的关卡等页面 URL；同时检查受影响的分类、标签、系列等页面是否仍符合现有收录条件。
- 验证至少覆盖：新增上线游戏被收录且更新时间等于上线日期；下架或删除游戏及其依赖页面不再被收录；本轮未变动的老游戏更新时间与修改前一致。最终回复简要说明 sitemap 的处理及验证结果；无法验证时如实说明原因。

# 页面 SEO 标题与描述长度原则

- 所有新增页面的 `<title>` 渲染结果（含站点后缀，如 guides 内容是 `content.title + " | PlayBloo"`）不得超过 60 字符；meta description 不得超过 160 字符。校验按"页面上实际渲染的完整文本"计长，不是内容数据里的裸字段。
- 内容数据里写 title/description 时就预留后缀长度（guides 的后缀是 11 字符），不要写完再砍；关键词尽量放在前 50 个字符内。标题避免使用裸 `&`：HTML 转义成 `&amp;` 后原始长度 +4，按原始 HTML 长度校验最稳妥（`&` 用 "and" 或全角"／"等替代）。
- 上线验收必须实测渲染后的长度：可用 `node scripts/verify-guides.mjs <本地地址>`（WikiGacha 起的 guides 页面已内置长度断言）、查看页面 HTML 的 `<title>`/`<meta name="description">`，或用 AITDK 等 SEO 扩展核对。
- 已上线的老页面不为此批量回改标题或描述（会无谓刷新其更新时间）；发现超限时，随该页面下一次实质性内容更新一并收窄。

# 图片管道约定

- 站点所有图片直连原始 URL：`next.config.ts` 已设 `images.unoptimized: true` 全局关闭 Vercel 图片优化（2026-10-11 起）。不要移除该配置，不要给单个 `<Image>` 重新启用优化，也不要引入会请求 `/_next/image` 的自定义 loader。
- 原因：Vercel Transformations 按（图片 × 宽度）计费，Hobby 配额耗尽后所有新转换 402，症状是"线上裂图、本地正常"（2026-10 两次事故）。`scripts/warm-image-cache.mjs` 是优化器时代的产物，已无用且运行只会消耗配额，不要再在部署后运行。
- 没有优化器兜底，新增图片素材必须预先压缩到位（WebP、合理尺寸，参考 `public/images/guides/` 下 1600px 宽的封面规格），浏览器直接加载原图缩放显示。
- 游戏封面镜像到 Supabase Storage 的惯例不变——那是为了绕开 itch 热链问题，与图片优化无关。

# CDN 游戏托管约定

- 本站自托管（iframe 直嵌）游戏统一放在 Cloudflare R2 桶 `cdn-assets`，公开访问域名 **`https://cdn.playbloo.net`**，路径 `games/<slug>/index.html`（现有：odio-el-chocolate、last-flag-standing、wreckbox、how-long-can-you-last、my-sweet-pets-demo、the-web-poolrooms、choo-choo-mania、dreamium、lisvn、rotten-machines、dearest-darling-dragon、anxiety、sort-the-court、six-cats-under、we-become-what-we-behold、cold-smoke、the-freak-circus、friday-night-funkin、mega-plane-evolution）。把游戏改造成站内直嵌时，`games.iframe_url` 一律指向该域名下对应 slug 的 index.html。the-freak-circus 特例：作者在游戏首屏明示 "only through its official website / shared without permission"，用户 2026-11-18 知情后拍板仍上架（游戏文件与声明屏原样保留，未删作者声明）。friday-night-funkin 特例：官方 funkin.assets 仓库 LICENSE.md 明文禁止非版权方公开分发游戏内容（美术/音频等创作内容），用户 2026-11-18 知情后拍板仍上架；另一特例是构建含 `manifest/<library>.json` 这类不在 GitHub 仓库里的运行时清单（songs/week1-7/weekend1/sserafim/tutorial/videos/shared 共 13 个），漏传会导致选歌后卡 LOADING（2026-11-18 首测事故）。mega-plane-evolution 特例：来源是 CrazyGames（开发者 GKG，2026-11-18 独占首发），官方 iframe 包装页对第三方域显示 "exclusively on CrazyGames" 拦截页（`disableEmbedding: true`），无法直嵌；游戏文件在 `*.game-files.crazygames.com`，下载需带 crazygames Referer 才放行（防盗链），用户知情后拍板解析自托管；游戏对 CrazyGames SDK 有原生无 SDK 降级，index.html 注入 stub（`window.CrazyGames.SDK.init` 抛错）阻断 `sdk.crazygames.com` 注入，广告/免费升级按钮按设计不可用。
- 上传用 Wrangler CLI（项目本地 `npx wrangler`，OAuth 已有 R2 写权限）：`r2 object put` 仅支持单文件，批量需脚本并发循环；`r2 object get` 不接受 `-y`。上传必须显式设 Content-Type（html/js/json/mp3/svg/png 各归各类），缓存策略：index.html 与数据 JSON 用 `max-age=300`，其余静态资源 `max-age=86400`。
- 复制/改造 itch 游戏时，必须从 index.html 移除 `<script src="https://static.itch.io/htmlgame.js">` 引用（2026-11-06 last-flag-standing 事故）：这是 itch 的反盗链脚本，检测到嵌入方为非 itch 域名就上报 itch 并把整个框架跳转到 "You should be using itch.io" 盗链提示页；顶层窗口打开时不触发，所以本地直开正常、线上 iframe 嵌入必炸。文件内其余 itch 字样（ITCH 主机名判断、模板字符串里的链接）不加载 itch 资源，可保留。
- 游戏自带的隐藏外呼（更新检查、统计打点、内嵌反馈表单等）用 fetch 垫片拦截或改道本地副本（skill 的 references/fetch-shim.md）；2026-11-15 rotten-machines 实例：Unity data 内嵌开局自动 POST Google Forms，垫片拦 `docs.google.com`。注意 Response 构造坑：204 是 null-body 状态码，`new Response("", {status: 204})` 抛 RangeError 被 catch 吞掉后请求照发——要用 `new Response(null, {status: 204})` 或 status 200。判定以运行时 `performance.getEntriesByType("resource")` 为准，静态 grep 会被压缩容器骗过（Unity 的 .gz 实为未压缩 UnityWebData）。

# 部署与缓存纪律

- 唯一部署路径是 push → Cloudflare Workers Builds 自动构建部署（Build command `npm run build:cloudflare`，Deploy command 在 CF Dashboard 维护）。**未经用户明确指令，不得在本地执行任何部署到 Cloudflare 的命令**，包括 `npm run deploy`、`npm run deploy:rclone`、`npx wrangler deploy`、`npx opennextjs-cloudflare deploy/upload` 等（2026-11-18 用户明令）。
- 本地运维脚本同样只在用户明确要求时运行：`scripts/warm-cache.mjs`、`scripts/populate-r2-cache.mjs`、`scripts/cleanup-r2-cache.mjs`。
- 缓存策略（2026-11-18 定稿）：线上 Deploy command 为 `npx opennextjs-cloudflare deploy --rclone -- --keep-vars && node scripts/cleanup-r2-cache.mjs`，全量预热 + 旧命名空间清理，是唯一部署方式。每次 push 全量写入新 buildId 命名空间（实测 ~8000 条/约 450MB）。Class A 账目（2026-11-19 修正）：R2 将 DELETE 列为 Free operations，删除不计任何额度——cleanup 的清理成本 ≈ 0（只有几十次 LIST 计 Class A），每部署 Class A 主体是 ~8000 次写入，Free 每月 100 万额度约支撑 120 次 push；此前"写+删 1.6 万、支撑 60 次"是把删除错计入 Class A 的旧账，作废。
- **禁止跳过预热的轻部署**（2026-11-18 事故定论）：曾试运行轻-A（`OPEN_NEXT_DEPLOY=true npx wrangler deploy --keep-vars`，不预填 R2、靠首次访问被动预热），部署后全站冷渲染撞 Free 计划 10ms CPU 硬限制，游戏页大面积 Error 1102（Worker exceeded resource limits），失败渲染不写缓存导致反复重试持续失败，已回滚恢复。docs/cloudflare.md 的"冷启动或重新生成不保证低于 Free 的 10ms CPU 预算"是硬约束——运行时只能承担"读缓存吐 HTML"级别的 CPU 负载，页面 HTML 必须随部署全量预填 R2。此后不再提议任何跳过/部分预热的方案（含只传 route-cache 的轻-B 变体；配额真吃紧时需先压测冷渲染 CPU 再评估）。`OPEN_NEXT_DEPLOY=true` 的机制：wrangler 会检测 OpenNext 项目（`next.config.*` + `open-next.config.ts`）并自动转发回 `opennextjs-cloudflare deploy`，该变量用于抑制转发，仅在绕过 OpenNext CLI 直跑 wrangler 时才需要。
- `scripts/cleanup-r2-cache.mjs` 的保留策略（2026-11-19）：保留当前 buildId + 按最后写入时间最近 1 个旧命名空间，其余删除——回滚到上一版本必须能读到热缓存，2026-11-18 事故的回滚恢复路径正依赖这一点；保留数可用 `CLEANUP_KEEP_OLD_BUILDS` 调整。脚本仍要求当前 buildId 在桶内才动手（防桶配错误删）：接在部署尾部自洽可用；本地手动跑时本地构建的 buildId 大概率不在桶内（buildId 每次构建随机生成），会拒绝删除任何内容。所有 rclone 调用带 `--s3-no-check-bucket`：R2 token 只有 Object Read & Write 权限，rclone 的 bucket 探测对写/删操作会 403。
- 部署方式无选择题：所有 push 一律全量预热，不存在"这次要不要 full"的判断（2026-11-18 起，轻部署已证伪禁用）。

# 本地测试端口清理

- 为本地测试临时起的服务（`python -m http.server`、`next dev`、`npx serve` 等，含后台 `&`/子 shell 启动的）在任务完成收尾时必须关闭，不留常驻监听进程；进程被 shell 复位等因素挂起也要在下轮检查补杀。
- 关闭后验证无残留再汇报：`pgrep -fl "http.server"` 与 `lsof -nP -iTCP:<端口> -sTCP:LISTEN` 均应为空。发现往期会话遗留、只绑 127.0.0.1 的测试服务可顺手清理（2026-11-18 收尾时发现 8899、8924 两个遗留测试服务仍在监听）；用途不明的进程先向用户确认再杀。
