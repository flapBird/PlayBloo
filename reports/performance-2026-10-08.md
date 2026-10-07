# PlayBloo 加载缓慢排查（2026-10-08）

## 结论与范围

本次从执行环境访问线上站点，主要异常是访问链路耗时大、波动严重。首页、游戏页和静态资源即使命中缓存仍然很慢，不能仅归因于 Supabase 查询、图片转换或页面体积。当前样本不足以判定是本地网络、代理、运营商跨境线路，还是 Cloudflare 接入线路的问题，也不能代表所有地区用户的速度。

响应头显示请求经过 Cloudflare LAX 节点，后端为 Vercel。首页与游戏页已有预渲染缓存；CSS 和 JS 同时命中 Cloudflare 与 Vercel 缓存。没有修改线上 CDN、DNS 或部署设置。

## 线上实测

测量时间：北京时间 2026-10-08 00:53 起。用 curl GET 读取完整响应；除第一条外启用压缩，超时上限 40 秒。抽样资源最多三个请求并发，并非浏览器整页加载指标。TTFB 包含 DNS、TCP 和 TLS 建连时间。

| 请求 | 传输大小 | TTFB | 总耗时 | 缓存状态 |
| --- | ---: | ---: | ---: | --- |
| 首页，未压缩 | 196,674 B | 3.47 s | 7.64 s | Vercel HIT / Cloudflare DYNAMIC |
| 首页，压缩，第 1 次 | 17,679 B | 3.11 s | 34.01 s | Vercel HIT / Cloudflare DYNAMIC |
| 首页，压缩，第 2 次 | 17,679 B | 2.07 s | 2.69 s | Vercel HIT / Cloudflare DYNAMIC |
| 首页，压缩，第 3 次 | 0 B | 未收到首字节 | 40 s 超时 | 未收到响应头 |
| `/search` | 20,690 B | 1.12 s | 4.05 s | Vercel MISS / Cloudflare DYNAMIC |
| `/game/fiole-rage` | 17,528 B | 14.78 s | 16.30 s | Vercel HIT / Cloudflare DYNAMIC |
| `/guides` | 9,565 B（未完成） | 15.55 s | 40 s 超时 | Vercel HIT / Cloudflare DYNAMIC |
| 首页 CSS `3hh0z8p77i_wp.css` | 13,498 B | 6.05 s | 7.79 s | Vercel HIT / Cloudflare HIT |
| 首页 JS `3sn7tdzleu1ki.js` | 8,829 B | 2.40 s | 39.29 s | Vercel HIT / Cloudflare HIT |
| 首张封面 `fiole-rage.png`，宽 240 | 16,301 B | 1.20 s | 7.79 s | Vercel HIT / Cloudflare DYNAMIC |
| 同一封面，宽 480 | 24,480 B | 1.52 s | 3.55 s | Vercel HIT / Cloudflare DYNAMIC |

封面本次返回 HTTP 200。图片探测没有发送 `Accept: image/webp`，大小仅代表该次响应，不代表浏览器实际选取的格式。CSS、JS 的 `Cache-Control` 为一年且 immutable。首页未压缩体积不能当成浏览器的实际传输体积，gzip 后约为 18 KB。

内置浏览器导航也超时，因此本轮没有取得可靠的 LCP、INP、CLS 或浏览器请求瀑布；上述秒数不能当作这些指标。

## 本轮代码调整

- 关闭首页与导航栏搜索入口、榜单入口及首页推荐攻略的自动预取。既有游戏卡片和页脚已关闭预取。慢线路下减少尚未点击页面的后台请求；代价是点击这些入口时不再复用预取结果。
- Clarity 从 `afterInteractive` 改为 `lazyOnload`，等页面资源完成并进入空闲期再加载会话录制。更晚开始录制可能遗漏最早的交互；Google Analytics 时机保持原样。
- 列表中指定立即加载的首张封面增加 `fetchPriority="high"`，其余图片继续懒加载。

这些调整降低首屏竞争，不会修复线路自身的高延迟，也没有用修改后的本地代码宣称线上已提速。本轮没有上线。

## 后续定位顺序

1. 在同一设备用当前网络、手机热点及可用的另一条线路各重复测试。结合 Cloudflare Ray 后缀记录接入节点，先区分单一线路问题和广泛问题。
2. 若主要服务中国大陆用户，在目标运营商网络下比较 CDN 线路。不能仅凭接了 Cloudflare 就认为已覆盖大陆节点；其大陆网络是单独的产品，见 [Cloudflare China Network](https://developers.cloudflare.com/china-network/)。先做测速再决定是否迁移或购买服务。
3. 首页 HTML 和图片本次在 Cloudflare 为 DYNAMIC，但 Vercel 已 HIT。改善边缘缓存可减少回源，仍不能解释或修复已经 Cloudflare HIT 的 JS 下载 39 秒。若调整图片缓存，保留完整 `url`、`w`、`q` 查询参数并处理 `Accept` 格式差异；若调整 HTML 缓存，需区分 HTML 与 RSC，并排除后台和私有 API。见 [Cloudflare 内容协商与 Next.js RSC 缓存说明](https://developers.cloudflare.com/cache/advanced-configuration/serve-tailored-content/)。
4. 搜索页是动态页面，本次约 4 秒返回。只有在解决线路问题后仍存在稳定的服务端延迟，才继续针对热门查询缓存和数据库查询做独立测量。

## 验证

- `npx tsc --noEmit`：通过。
- 修改文件的 ESLint 检查及完整 `npm run lint`：通过。
- `npm run build`：通过，生成 121 个静态页面；首页保持 5 分钟 ISR。
- 检查构建产物首页 HTML：15 张图片，首张为 eager/high，其余均 lazy。
- `git diff --check`：通过。

首次构建因沙箱禁止 Turbopack 内部进程绑定本地端口失败；在允许该编译进程及构建所需数据库读取的环境中重跑成功。
