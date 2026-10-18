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

如果使用 Workers Builds，在 **Build variables and secrets** 中另外配置两个 `NEXT_PUBLIC_SUPABASE_*` 变量，以及构建时静态页面查询所需的 `SUPABASE_SERVICE_ROLE_KEY`。公共变量会写入浏览器产物，修改后需要重新构建；只更新 Worker 运行时值无法替换已有客户端代码中的值。详见 [OpenNext 环境变量说明](https://opennext.js.org/cloudflare/howtos/env-vars)。

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

依赖安装应使用 `npm ci` 并安装 devDependencies，因为适配器和 Wrangler 位于 devDependencies。不要把 Build command 改成仅 `npm run build`；Workers 需要 `.open-next` 产物。详见 [Cloudflare OpenNext 配置文档](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)。

## 缓存与图片

站点已有页面 ISR、`unstable_cache` 和后台 `revalidatePath`。`open-next.config.ts` 使用 R2 保存页面和数据缓存，DO Queue 协调定时刷新，分片 DO Tag Cache 保存按需失效记录，`baseShardSize` 为 4，`regionalCache` 为 `false`。

当前未启用 regional cache、cache interception 或 Cache API purge，不需要 purge Durable Object、`CACHE_PURGE_API_TOKEN` 或 `CACHE_PURGE_ZONE_ID`。以后若增加区域缓存，需要重新评估按需失效与 purge 配置，避免后台修改后继续返回旧缓存。详见 [OpenNext 缓存说明](https://opennext.js.org/cloudflare/caching)。

图片继续通过原始 URL 加载，`images.unoptimized: true` 保持启用，无需配置 Cloudflare Images 绑定。新增图片仍须预先压缩；不要运行已停用的 `scripts/warm-image-cache.mjs`。`public/_headers` 为 `/_next/static/*` 设置长期不可变缓存。

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
