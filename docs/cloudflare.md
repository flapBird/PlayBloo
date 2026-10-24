# Cloudflare Workers 部署

PlayBloo 使用 `@opennextjs/cloudflare` 将 Next.js 构建产物部署到 Cloudflare Workers，数据库、身份认证和图片存储继续使用现有 Supabase 项目。本说明对应仓库配置；完成本地构建不代表已经发布或通过真实 Cloudflare 环境验证。

## 运行环境与命令

要求 Node.js 24 或更高版本，推荐使用 `.node-version` 指定的 Node.js 24。当前固定版本为 Next.js 16.4.2、OpenNext Cloudflare 1.20.12、Wrangler 4.151.1；安装时使用 lockfile：

```sh
npm ci
cp .env.example .env.local
```

已有 `.env.local` 时保留原文件，不要用示例覆盖。在 `.env.local` 中填写实际配置，不要提交该文件：

| 变量 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL，构建时注入客户端，也供服务端使用 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公共 anon key，构建时注入客户端 |
| `SUPABASE_SERVICE_ROLE_KEY` | 仅服务端使用的 Supabase service role key |
| `SUBMISSION_FINGERPRINT_SECRET` | 投稿指纹密钥；可选，未设置时使用 service role key |

需要明确本地 Workers 预览模式时，可执行 `cp .dev.vars.example .dev.vars`。示例设置 `NEXTJS_ENV=production`，与预览所用的生产构建一致；应用变量仍从 `.env.local` 加载。

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 常规 Next.js 本地开发 |
| `npm run build` | 标准 Next.js 生产构建 |
| `npm run build:cloudflare` | 生成 `.open-next/worker.js` 和 Workers 静态资源 |
| `npm run preview` | 构建并在本地 Workers 运行时预览，初始化本地缓存 |
| `npm run deploy` | 构建、初始化远程缓存并部署到 Cloudflare |
| `npm run cf:typegen` | 根据 Wrangler 配置生成本地绑定类型 |

`next start` 运行的是 Node.js 服务；验证 Workers 兼容性时使用 `npm run preview`。`.open-next`、`.wrangler`、生成的绑定类型以及本地环境文件已加入忽略规则。

`cloudflare-env.d.ts` 包含 Workers 的全局运行时类型，供检查绑定或独立 Worker 工具使用；Next.js 的 `tsconfig.json` 排除该文件，避免覆盖浏览器 DOM 类型。应用当前通过适配器使用缓存绑定，无需直接导入这些类型。

## 首次配置 Cloudflare

在目标 Cloudflare 账号中启用 Workers 和 R2，然后登录并创建增量缓存桶：

```sh
npx wrangler login
npx wrangler r2 bucket create playbloo-next-cache
```

已存在同名桶时直接使用，不要重复创建。`wrangler.jsonc` 定义以下资源：

| 配置 / 绑定 | 当前值 |
| --- | --- |
| Worker 名称 | `playbloo` |
| 入口与静态资源 | `.open-next/worker.js`、`.open-next/assets` |
| 兼容日期 | `2026-10-18` |
| 兼容标记 | `nodejs_compat`、`global_fetch_strictly_public` |
| `WORKER_SELF_REFERENCE` | 同一 Worker：`playbloo` |
| `NEXT_INC_CACHE_R2_BUCKET` | R2 桶：`playbloo-next-cache` |
| `NEXT_CACHE_DO_QUEUE` | Durable Object 类：`DOQueueHandler` |
| `NEXT_TAG_CACHE_DO_SHARDED` | Durable Object 类：`DOShardedTagCache` |

首次部署时，Wrangler 使用 `v1` migration 创建这两个 SQLite Durable Object 类，无需另建 D1 数据库或 Cloudflare Queues。若修改 Worker 名称，必须同步修改 self reference 的 `service`；若修改桶名，必须同步修改 R2 绑定。

## 构建变量与运行时密钥

Cloudflare 的构建环境和 Worker 运行环境分别配置；本地 `.env.local` 不会自动变成线上 Worker secrets。

在 Worker 的运行时变量设置中配置上述四个变量。也可以逐项运行以下命令，在交互提示中输入值：

```sh
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put SUBMISSION_FINGERPRINT_SECRET
```

最后一个变量可按前述回退规则省略。`SUPABASE_SERVICE_ROLE_KEY` 和 `SUBMISSION_FINGERPRINT_SECRET` 必须使用 secrets，不要放入可提交的配置或加上 `NEXT_PUBLIC_` 前缀。部署脚本带 `--keep-vars`，保留在 Dashboard 中配置的运行时普通变量；secrets 由 Cloudflare 保存。

如果使用 Workers Builds，进入 **Workers & Pages → playbloo → Settings → Build → Variables and secrets**（构建设置中的 **Build variables and secrets**），另外配置以下三个同名变量：

| 变量 | 构建配置类型 | 必需原因 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Variable | 注入客户端，并在静态生成时连接 Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Variable | 注入浏览器的 Supabase 客户端 |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | 构建时读取游戏、关卡和 sitemap 数据 |

`Settings → Variables and Secrets` 配置的是运行时，不能代替这一步；保留已有运行时配置。保存构建变量后，再重新运行失败的构建。公共变量会写入浏览器产物，修改后需要重新构建；只更新 Worker 运行时值无法替换已有客户端代码中的值。详见 [OpenNext 环境变量说明](https://opennext.js.org/cloudflare/howtos/env-vars)。

### 排查 `supabaseUrl is required`

若日志在 `Collecting page data` 阶段报 `supabaseUrl is required`，表示构建进程未获得 `NEXT_PUBLIC_SUPABASE_URL`。仅添加运行时变量后依然会失败。先检查上述构建设置中的三个变量是否同名、非空并已保存；若使用不同构建环境，也要检查本次构建对应的变量配置。

生产构建会在编译前检查这三个变量，缺失时只报告变量名和配置位置，不输出变量值。不要把 service role key 填到公共变量、构建命令或提交进仓库。

Next.js telemetry 提示不会中止构建。本地绑定代理只在 `next dev` 中初始化；生产构建不会为它启动本地 DO。若在开发日志里看到 `DOQueueHandler` 或 `DOShardedTagCache` 的内部绑定提示，不要为此删除正式部署需要的 DO 绑定；Workers 产物由 OpenNext 导出对应类。

## 预览与发布

先运行必要检查并在本地 Workers 中预览：

```sh
npm run lint
npm run test:submissions
npm run preview
```

使用命令输出的本地地址检查页面和只读 API。确认后，通过以下命令发布：

```sh
npm run deploy
```

该脚本执行 OpenNext 构建和 `opennextjs-cloudflare deploy -- --keep-vars`。OpenNext 部署命令会初始化远程构建缓存；直接执行 `wrangler deploy` 会跳过此步骤。缓存初始化期间，适配器可能临时创建 `open-next-cache-populate` 辅助 Worker，部署账号需要相应 Worker 和 R2 权限。详见 [OpenNext CLI](https://opennext.js.org/cloudflare/cli)。

通过 Git 仓库使用 Workers Builds 时，设置 Node.js 24，配置构建及运行时变量，命令填写：

| 设置 | 命令 |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npx opennextjs-cloudflare deploy -- --keep-vars` |

若已按「rclone 直传」一节配置 R2 S3 凭据，Deploy command 改用 `npx opennextjs-cloudflare deploy --rclone -- --keep-vars`，避免每次部署消耗数万次 Workers 请求额度。

依赖安装应使用 `npm ci` 并安装 devDependencies，因为适配器和 Wrangler 位于 devDependencies。不要把 Build command 改成仅 `npm run build`；Workers 需要 `.open-next` 产物。详见 [Cloudflare OpenNext 配置文档](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)。

## 缓存与图片

站点使用页面 ISR、`unstable_cache` 和后台按需失效。首页有效期为 15 分钟，游戏详情为 1 小时，分类总览、系列页面以及分类/标签列表数据为 1 小时（带查询参数的分类/标签详情仍动态渲染），关卡页面仍为 30 分钟。到期后有访问才刷新，不会定时扫描整个目录。游戏推荐、分类导航和搜索筛选数据缓存 1 小时；推荐池与 sitemap 共用的整目录条目（`public-catalog-v1`）以及 sitemap 的关卡清单（`public-sitemap-levels-v1`）同样缓存 1 小时，后台关卡增删改会立即失效关卡清单并刷新 /sitemap.xml。后台发布、下架、改名或调整游戏关联会让对应共享数据立即过期，普通内容编辑只刷新相关页面和分类/标签列表。后台修改通过 API 后在下一次访问重新生成，不代表保存接口同步生成整站。

`open-next.config.ts` 使用 R2 保存页面和数据缓存，并启用 `enableCacheInterception`，缓存命中时跳过 NextServer 页面代码加载。DO Queue 外包一层 30 秒的 `queueCache`，只抑制同一旧缓存版本的重复刷新入队，不缓存 HTML 或失效标签；先等队列确认再记录去重。后台 `revalidatePath`/`revalidateTag` 的有效性仍直接由 Tag Cache 决定，不依赖刷新队列的缓存。

`wrangler.jsonc` 的 `MAX_REVALIDATE_CONCURRENCY=10` 将新刷新任务分散到十个队列分片，每个分片 `NEXT_CACHE_DO_QUEUE_MAX_REVALIDATION=8`（正常刷新最多约 80 个并发）；`NEXT_CACHE_DO_QUEUE_MAX_RETRIES=3` 提高失败重试上限，`NEXT_CACHE_DO_QUEUE_RETRY_INTERVAL_MS=1000` 缩短指数退避，`NEXT_CACHE_DO_QUEUE_REVALIDATION_TIMEOUT_MS=30000` 覆盖慢页面重渲染所需时间（默认 10 秒会让慢页面刷新一律失败）。这些上限原先设为 2/2/2，即实际只有 4 个并发，批量导入时刷新队列会整体排队。重试 Alarm 和旧部署已排队任务不受这一并发估算保证。升级后核对线上变量与配置一致；这些设置减少无效重试，不能提高 Free 的 CPU 限额。

分片 DO Tag Cache 保持 `baseShardSize: 4, regionalCache: false`。当前未配置全局 purge 凭据，因此不增加页面/标签的区域缓存，避免后台下架之后其他地区继续读到旧数据；不需要 purge Durable Object、`CACHE_PURGE_API_TOKEN` 或 `CACHE_PURGE_ZONE_ID`。以后启用这些缓存层必须一起验证全局按需清理。详见 [OpenNext 缓存说明](https://opennext.js.org/cloudflare/caching)。

构建阶段批量预渲染的游戏查询允许等待 30 秒；线上游戏详情的主数据查询最多等 4 秒，数据库错误会使本次生成失败而非写入错误的 404；共享目录与 sitemap 关卡清单的读取（`src/lib/catalog.ts`、sitemap 分页查询）最多等 5 秒，超时的生成失败后由下次访问重试，页面可暂时不显示推荐。更新记录和关卡存在性查询最多等 2 秒。推荐排名只保留六个最佳候选，不再对整池候选排序；导航链接关闭预加载，减少未点击页面的 RSC 请求。这些措施不能保证冷启动或重新生成一定低于 Free 的 10ms CPU 预算；网络等待和 CPU 执行时间是不同指标。

游戏详情页的预渲染按上线时间倒序取最近 1500 款，而不是按 `hot_score`。在架游戏的 `hot_score` 全为 0，按它排序等于取最旧的一批，最新游戏反而落在按需渲染路径上，而新 URL 只有一次抓取机会，冷渲染超时就会永久停在「已发现但未抓取」。预渲染顺序改动后，新游戏在构建时即写入缓存，首次抓取直接命中。

推荐池与 sitemap 统一走 `src/lib/catalog.ts`：从分类、标签、系列各自一侧读取成员关系，而不是在每行游戏上做三层嵌套 JOIN；上千行宽 JOIN 贴近超时上限，且曾使推荐池间歇性失败，页面渲染不出相关推荐。两处的整目录读取都落在同一个共享缓存条目上，每小时最多回源一次；sitemap 的关卡清单按 1000 行分页取全并缓存（不带 range 的全量查询会被 PostgREST 静默截断，超出部分会从 sitemap 消失）。

## 部署与缓存预热

`npm run deploy` 通过临时创建的 `open-next-cache-populate` Worker（`*.workers.dev`）把构建产物上传到 R2。这条路径有两个已知问题：

1. **消耗 Workers 请求额度**：每个缓存条目对应一次打到该临时 Worker 的请求（2026-10-24 全量约 2.3 万条，其中 95% 是 `__fetch` 数据缓存，随目录增长还会变多）。临时 Worker 部署完即删除，这些请求在 Analytics 里全部归入 `__unknown__`，但**计入 Free 计划全账号每天 10 万次的请求额度**；目录再翻几倍，一次部署就可能耗尽当天额度，导致所有 Worker 返回 1027 配额错误。
2. 在 workers.dev 不可达的网络中，这一步会重试 15 次后失败并中止整次部署，线上仍停留在旧版本。

### rclone 直传（推荐，不占 Workers 额度）

OpenNext 内置 `--rclone` 选项：预热改走 R2 的 S3 端点（`<account>.r2.cloudflarestorage.com`）直传，完全绕开 Workers 请求额度；对象键名与 Worker 路径使用同一套 `computeCacheKey`，两者可互换。代价只计入 R2 Class A 写操作（Free 每月 100 万次，当前规模约可支撑 40+ 次全量部署），且 S3 端点速率远高于 REST API，全量预热只需几分钟。

一次性配置：

1. Dashboard → **R2 → Manage R2 API Tokens** 创建 API Token，权限 Object Read & Write，范围限定 `playbloo-next-cache` 桶，得到 Access Key ID 和 Secret Access Key。
2. 本地部署：在 `.env.local` 中加入 `R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`CF_ACCOUNT_ID`（账号 ID 非密钥，可与脚本默认值相同）。OpenNext 通过 `process.env` / wrangler vars / `.env*` 读取这三个变量。
3. 之后本地用 `npm run deploy:rclone` 代替 `npm run deploy`。
4. Workers Builds 自动部署：在 **Settings → Build → Variables and secrets** 中配置同名构建变量，Deploy command 改为 `npx opennextjs-cloudflare deploy --rclone -- --keep-vars`。

`rclone.js`（devDependency）自带对应平台的 rclone 二进制；npm 安装时被 allow-scripts 拦截的 `selfupdate` postinstall 只影响版本自更新，不影响使用。缺任意一个凭据变量时 `--rclone` 会直接报错中止，因此在配置完成前不要把默认 `deploy` 脚本切到该路径。

### REST API 直传（无 S3 Token 时的兜底）

改用 `node scripts/populate-r2-cache.mjs` 走 Cloudflare REST API 直传：遇到 429 按 `retry-after` 全局退避，写入幂等、可中断续传。R2 REST API 对对象写入有速率限制，全量预热约需一小时；配额耗尽时返回 429，凭据过期时返回 401（跑一次 `npx wrangler whoami` 即可刷新）。REST API 请求同样不占 Workers 额度，但速度远慢于 rclone。

绕过 OpenNext 的自动转发可直接部署 Worker：`OPEN_NEXT_DEPLOY=true npx wrangler deploy --keep-vars`。

`wrangler deploy` 只上传已有的 `.open-next` 产物，不会重新构建。改了代码后必须先跑 `npm run build:cloudflare`，否则上线的仍是旧代码——这一点在排查"埋点没生效"时尤其容易误判。新构建的 build ID 会变，R2 里旧 build ID 的缓存条目随之失效，部署后需要重新预热。

预热脚本的键名必须与适配器一致：`__fetch` 条目直接用文件名做键，`route-cache` 条目先剥掉 `.cache` 后缀再做键（`.cache` 只是磁盘上的文件名，不属于键的一部分）。键名写错时对象照样上传成功，但 Worker 读不到，页面会退化成每次按需渲染。

部署后如果线上内容与构建产物不一致，通常是 R2 里残留了旧构建 ID 的缓存。删掉对应路由的 `route-cache` 条目即可让下次访问重新生成。

直接通过 Supabase、脚本或其他绕过后台 API 的写入不会自动调用这些失效函数，需在导入流程中另行失效缓存或重新构建发布。缓存优化不修改游戏的上线日期或 sitemap 时间戳。

图片继续通过原始 URL 加载，`images.unoptimized: true` 保持启用，无需配置 Cloudflare Images 绑定。新增图片仍须预先压缩；不要运行已停用的 `scripts/warm-image-cache.mjs`。`public/_headers` 为 `/_next/static/*` 设置长期不可变缓存。

## 扫描请求拦截

2026-10-19 在 `playbloo.net` 的 Cloudflare 自定义 WAF 规则中启用 `playbloo_block_sensitive_file_probes`，拦截 `/.env`、`/.env.*`、`/@fs/.env`、`/@fs/.env.*`、`/.git` 和 `/.git/` 下的请求，在进入 Worker 前返回 403。规则位于 zone 的 `http_request_firewall_custom` 阶段，不随代码部署创建；新环境需要单独配置。不封锁正常游戏页面、搜索引擎或所有 HEAD 请求（ISR 本身使用 HEAD）。

## 正式域名与 Supabase Auth

预览完成后，在 Worker 的 **Settings → Domains & Routes** 中将 `playbloo.net` 配置为正式域名。切换前确认域名所属 Cloudflare zone、现有 DNS 和路由的接管方式；切换后检查 HTTPS 与站点访问。具体操作参考 [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)。

站点 canonical、结构化数据、robots 和 sitemap 保持正式域名 `https://playbloo.net`，预览域名不会替换 SEO 地址。迁移承载平台不改变游戏上线日期，不批量修改旧游戏的 sitemap `lastModified` 或数据库 `updated_at`。

Supabase Auth 的 Site URL 应保持 `https://playbloo.net`。当前后台使用邮箱密码登录；如果项目还使用邮件确认、密码重置或 OAuth 跳转，应在 Supabase Auth 的 URL Configuration 中保留正式回调 URL，并按需加入受信任的本地或 Workers 预览回调地址。只加入实际使用的路径，不凭空配置不存在的 `/auth/callback` 路由。参考 [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)。

## 发布前后只读检查

本轮适配不需要修改线上游戏、投稿、用户或图片数据。以下检查使用 GET 请求；缓存可能正常写入 R2/DO。游戏详情的浏览器脚本会发送统计请求，需要完全不写业务数据时，使用 `curl` 检查 HTML，或在浏览器中阻止 `/api/stats` 请求。

- 首页、`/search`、`/category`、`/series`、`/guides` 和一个已存在的游戏详情 URL 返回正常内容；不存在的游戏返回 404。
- `/api/games?limit=1`、`/api/categories` 和 `/api/series` 能读取数据；匿名请求 `/api/admin/check-auth` 返回 401。已有管理员会话只检查列表读取，不提交编辑表单。
- `/sitemap.xml`、`/robots.txt` 和 `/llms.txt` 正常返回；canonical 及 sitemap URL 使用 `https://playbloo.net`，迁移前后未变动游戏的 `<lastmod>` 一致。
- 代表性的封面原始 URL 和一个 `/_next/static/` 文件可访问；浏览器没有 `/_next/image` 请求，静态构建资源包含长期缓存头。
- Worker 日志没有未绑定的 R2/DO、环境变量缺失或运行时异常。首次和重复请求都正常，页面不存在整体 500。
- 缓存按需失效、投稿提交和 CSV 导入涉及写操作；如需端到端验证，在独立测试环境使用测试数据，不通过修改正式游戏来做烟测。

可将实际预览或正式地址填入变量执行基础检查；`/game/<slug>` 使用站点已有游戏的 slug：

```sh
PLAYBLOO_CHECK_URL=https://playbloo.example.workers.dev
curl -fsS -o /dev/null "$PLAYBLOO_CHECK_URL/"
curl -fsS -o /dev/null "$PLAYBLOO_CHECK_URL/api/games?limit=1"
curl -fsS "$PLAYBLOO_CHECK_URL/sitemap.xml"
curl -sS -o /dev/null -w '%{http_code}\n' "$PLAYBLOO_CHECK_URL/api/admin/check-auth"
```

最后一条预期输出 `401`。正式切换后再对 `https://playbloo.net` 执行同一组只读检查；部署、域名切换和真实环境检查的结果需由实际操作确认。
