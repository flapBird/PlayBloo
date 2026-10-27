# itch.io 批次导入记录 · 2026-10-28

雷达当日 00:02 抓取 10 款（ready 队列为空，全批 `status=error`——雷达服务器抓 itch 被拒，与既往批次同形态；记录字段完整，本机走代理补抓即可），入库 **9 款**，跳过 1 款；入库后 `POST /api/itch/mark-used` 回填，**marked=9, not_found=[]**。

生产库已发布游戏总量 1,104 → **1,113**（count=exact，本批 +9）。本轮新增分类关联 16 条、`game_updates`（"Added to PlayBloo"）9 条。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 画面 |
|---|---|---|---|---|
| [Sun Smith](https://playbloo.net/game/sun-smith) | simulation, idle | released | Godot | 2D |
| [Dreamium - Liminal Dream Simulator](https://playbloo.net/game/dreamium) | simulation, adventure | early-access | Three.js | 3D |
| [Farm Island](https://playbloo.net/game/farm-island) | simulation, casual | released | HTML5 | 2D |
| [Wuthering Waves: Abyss](https://playbloo.net/game/wuthering-waves-abyss) | action, survival | released | Godot | 2D |
| [Battle of Talingchan](https://playbloo.net/game/battle-of-talingchan) | arcade, casual | released | （未填） | 2D |
| [Eldritch Apocalypse](https://playbloo.net/game/eldritch-apocalypse) | card, strategy | released | Unity | 2D |
| [NOSFER-A-TOOTH](https://playbloo.net/game/nosferatooth) | strategy, card | demo | Unity | 2D |
| [Love is Strange](https://playbloo.net/game/lisvn) | casual | released | （未填） | 2D |
| [Dating Killmulator 2](https://playbloo.net/game/dating-killmulator-2) | casual | released | Construct | 2D |

完整 URL 清单（GSC 逐个「网址检查 → 请求编入索引」用）：

```
https://playbloo.net/game/sun-smith
https://playbloo.net/game/dreamium
https://playbloo.net/game/farm-island
https://playbloo.net/game/wuthering-waves-abyss
https://playbloo.net/game/battle-of-talingchan
https://playbloo.net/game/eldritch-apocalypse
https://playbloo.net/game/nosferatooth
https://playbloo.net/game/lisvn
https://playbloo.net/game/dating-killmulator-2
```

## 挑选与跳过

- **Retro Commander**（noblemaster.itch.io/retro-commander）：侧栏平台标了 HTML5，但页面 7 个上传项全部是桌面安装包（Windows/macOS/Linux），无 itch 浏览器播放器嵌入（`html_embed_widget`/`game_frame` 均无），实际不能在浏览器游玩，不符合收录条件，跳过。未标记已用，仍留在雷达（status=error）。
- 其余 9 款逐款核验浏览器播放器嵌入均存在，全部免费、无年龄门，全部入库。

## 抓取与自动化

- **API 拉批次**：`fetch_batch.py --date 2026-10-28` ready 为空（雷达刚跑完，全部 status=error），改用 `--status error` 拉到全批 10 款。SEO API 走 Clash 代理。
- **页面抓取 10/10 成功**（代理 + 浏览器 UA），无 404；首次批量核验浏览器嵌入时连续触发 itch 429，降到单发 + 1.5s 间隔后全部通过。挑选落实后从 enriched.json 删除 Retro Commander，最终 9 款。
- **文案**：9 款全部按 content-guide 写齐 description/how_to_play/controls/tips/features + editorial_take/meta_title/meta_description 三件套。要点：Wuthering Waves: Abyss 与 Love is Strange 均如实写 unofficial fan game（前者保留页面四语言披露的 AI 素材说明，后者注明 2016 年 Tumblr 起源的粉丝 VN）；Battle of Talingchan 页面无正文，按最薄模板写并注明泰语 UI；Dreamium 标题以 h1 为准去掉 RSS 的 [Web] [Open-Source] 后缀，自述 pre-release 入库为 early-access；NOSFER-A-TOOTH 页面自述 PROTOTYPE 入库为 demo。
- **入库**：dry-run 零 PROBLEM（9 rows + 16 分类）后正式执行。
- **素材镜像**：mirror_media.mjs 上传 9 封面 + 40 截图至 `game-media` bucket（`covers/2026-10-28/`、`screenshots/2026-10-28/`），全部转 WebP。2 张 GIF 封面（Eldritch Apocalypse、NOSFER-A-TOOTH）转动画 WebP；farm-island 2 张动图截图由脚本转换。中途 1 个上传 520（farm-island 截图 1）导致该游戏 screenshots 整组 PATCH 按设计跳过——脚本逻辑为"全部成功才 PATCH"——随后按避坑清单用 ffmpeg 手工补转（40 帧动画 WebP，抽帧哈希校验通过）、补传并回填 6 张截图数组；49/49 对象 sha256 与公开 URL 校验一致，DB 9 款 thumbnail/screenshots 全部指向 game-media。对象 cacheControl 元数据 max-age=604800 正确存储（公开 URL 响应头 CDN 滞后几分钟属正常）。
- **验证**：抽查 sun-smith / wuthering-waves-abyss / nosferatooth 三页均 200，meta_title/meta_description 覆盖生效（标题带 "| PlayBloo" 后缀），editorial_take/About/How to Play/Controls/Tips/Features/Updates 区块渲染正常，封面截图均指向 game-media 镜像，外链按钮指向原 itch 页面。
- **mark_used 回填**：`mark_used.py --urls-file imported-urls.txt --date 2026-10-28` → `marked=9 not_found=[]`，与入库数一致。

## sitemap

本轮纯 INSERT，未 UPDATE 任何老游戏行；核对 death-spiral（2026-06-28）与 powder-peak-tycoon（2026-10-25）的 updated_at 均未被改写。新 9 款 `is_published=true`，updated_at=2026-10-27T17:28Z（=本地 2026-10-28 01:28，即实际上线时刻），动态 sitemap（按 `updated_at` 取 lastmod）数据侧完全就绪。分类/标签/系列页面本轮只增不减，仍满足收录条件。

**但截至 02:30 线上 XML 未刷新**——这不是本批的问题，而是一个持续 30+ 小时的基础设施故障，本批导入时已存在：

- 线上 `/sitemap.xml` 的 `x-opennext-cache: STALE`，生成时间冻结在 2026-10-27T13:28:33Z（=21:28 CST），带任意 cache-busting 参数亦不重新渲染。
- `wrangler tail` 抓到每次请求（首页/详情页/sitemap 全部）都在报 **"Error: Exceeded allowed duration in Durable Objects free tier"**——OpenNext 的 tag-cache DO 检查（hasBeenRevalidated / isStale / 重验证队列）全部被 DO 时长限制杀掉，OpenNext 回退为"当作未过期"直接吐旧缓存。页面内容本身仍正常（新 slug 无缓存条目时按需渲染成功，本批 3 个抽查页即如此）。
- Cloudflare GraphQL 按小时统计：DO 错误自 2026-10-26T18:00Z（本地 10-27 02:00，即 10-27 批次导入后约 1 小时）起持续存在，每小时 100-400 个错误，跨 UTC 日期未恢复（排除 UTC 日配额重置说）；17:00Z 起 230 个请求里 221 个报错，18:00Z 后 31/31 全错。症状指向某个 tag-cache 分片 DO 实例卡死（单请求挂起 30s 被杀），而非配额耗尽。
- 影响范围：sitemap、首页、相关游戏推荐等所有依赖 ISR 后台重验证的缓存延迟/冻结；不影响新页面首次渲染与数据正确性。
- 可尝试的恢复手段：重新部署 Worker（部署会重启 DO 运行时，大概率解卡）——涉及部署动作，留给用户决定；或升级 Workers 付费计划。

**验证结论**：sitemap 生成器与 DB 数据已核对无误（新 9 款 lastmod=上线时刻、老游戏未动），线上 XML 收录待 DO 故障恢复后自动完成，无需再改任何数据。
