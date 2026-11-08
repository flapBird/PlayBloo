<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sitemap 维护约定

- 每轮功能迭代或修改结束前，检查本轮是否新增上线、下架或删除了游戏。若有，必须同步更新 sitemap 信息并验证结果；若无，不因本轮迭代而刷新游戏的 sitemap 时间戳。
- 本项目通过 `src/app/sitemap.ts` 动态生成 `/sitemap.xml`。根据实际改动维护游戏数据、收录条件或生成逻辑；动态生成已能正确反映上下架状态时，无需为了留下文件差异而修改生成器。
- 新游戏上线后必须收录其正式 URL，sitemap 的 `lastModified`（XML 中的 `<lastmod>`，即更新时间）使用该游戏在 PlayBloo 的实际首次上线日期。不得使用游戏原始发行日期、提前导入或创建记录的日期，也不得使用之后构建、部署或生成 sitemap 的时间代替上线日期。
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

- 本站自托管（iframe 直嵌）游戏统一放在 Cloudflare R2 桶 `cdn-assets`，公开访问域名 **`https://cdn.playbloo.net`**，路径 `games/<slug>/index.html`（现有：odio-el-chocolate、last-flag-standing、wreckbox、how-long-can-you-last）。把游戏改造成站内直嵌时，`games.iframe_url` 一律指向该域名下对应 slug 的 index.html。
- 上传用 Wrangler CLI（项目本地 `npx wrangler`，OAuth 已有 R2 写权限）：`r2 object put` 仅支持单文件，批量需脚本并发循环；`r2 object get` 不接受 `-y`。上传必须显式设 Content-Type（html/js/json/mp3/svg/png 各归各类），缓存策略：index.html 与数据 JSON 用 `max-age=300`，其余静态资源 `max-age=86400`。
- 复制/改造 itch 游戏时，必须从 index.html 移除 `<script src="https://static.itch.io/htmlgame.js">` 引用（2026-11-06 last-flag-standing 事故）：这是 itch 的反盗链脚本，检测到嵌入方为非 itch 域名就上报 itch 并把整个框架跳转到 "You should be using itch.io" 盗链提示页；顶层窗口打开时不触发，所以本地直开正常、线上 iframe 嵌入必炸。文件内其余 itch 字样（ITCH 主机名判断、模板字符串里的链接）不加载 itch 资源，可保留。
