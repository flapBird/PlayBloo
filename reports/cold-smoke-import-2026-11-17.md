# Cold Smoke（雪迹）单款上架记录（2026-11-17）

非 itch 雷达批次的单款导入：用户提供 itch widget embed（5363257），游戏地址 `https://huiskylabs.itch.io/cold-smoke`。沿用 itch-game-import 全管线（parse_and_fetch → content → import_games → mirror_media），未走 fetch_batch 挑选。slug 取 itch 路径 `cold-smoke`（英文，用户明确要求）。

## 页面核实要点

- h1：雪迹 · Cold Smoke；作者 huiskylabs；Genre Sports；Platforms HTML5；Status Released
- 精确发布时间：页面 abbr title `14 November 2026 @ 20:43 UTC` → `release_date = 2026-11-14`（手工补进 enriched 记录的 `itch_published_at`，避免相对日期 "2 days ago" 落成导入日）
- 卖点：无限下坡滑雪、程序化生成一座不重复的山；画面与声音全部由代码实时生成（无图片/音频/模型/贴图文件，单 ~1.7 MB HTML 文件，WebGPU 或 WebGL2）；Today's Mountain 每天一座全球同款山；无分数无解锁
- 键位来自封面 UI 自带说明：←→ 转向、↑↓ 压板尖/板尾、Space 跳、Shift 屈身蹲滑；中英双语呈现

## DB 写入

- slug `cold-smoke`，title `雪迹 · Cold Smoke`；external play 模式（`iframe_url` 空，前台 External game 按钮）
- 分类：sports + casual（itch Genre Sports + 无分数休闲向）
- engine `Custom WebGPU/WebGL2 engine`；graphics `3D`（封面为程序化 3D 雪山场景）；multiplayer single-player；development_status released；monetization free
- game_updates 1 条 "Added to PlayBloo"；screenshots 1 张；sources itch.io verifiedAt 2026-11-17

## 文案（原创性三件套核验）

- meta_title 渲染后 54 字符（≤60）：`Play Cold Smoke Online - Procedural Ski Run | PlayBloo`
- meta_description 148 字符（≤155），原创句子，未照搬 og:description
- short_description 原创改写；controls 仅列页面有依据的键位；editorial_take 站点第一视角

## 封面与截图镜像

- og:image（img.itch.zone PNG 630×500）+ 页面截图 1 张，mirror_media.mjs 转 WebP 上传 `game-media/covers/2026-11-17/cold-smoke.webp` 与 `screenshots/2026-11-17/`，ERRORS: 0；`thumbnail_url`/`screenshots` 已 PATCH，前台确认加载自家存储 URL

## 验证结果

- 线上 `https://playbloo.net/game/cold-smoke`（代理 + 浏览器 UA）：HTTP 200；title 54 / meta description 148 达标；External game 按钮、itch 外链、自家存储封面、Sports/Casual 徽章、"Added to PlayBloo" Updates 全部渲染正常
- 数据侧：`updated_at = 2026-11-17T15:59:42Z` = 实际首次上线时刻（= 本地 2026-11-17 23:59 UTC+8）；本轮仅写入 cold-smoke 一行（insert + 同行 thumbnail PATCH），未触碰任何老游戏行
- sitemap：线上 201 条 URL 不含 cold-smoke——当前生成器（2026-11-12 治理）有意只收 `view_count ≥ 3` 的游戏页，新游戏随自然播放达标后自动进入（six-cats-under 在列即此路径先例），生成器无需修改；游戏页经 new-games 列表与分类页内链可被抓取
- 雷达回填：不适用——核对 2026-11-14 / 11-15 两批雷达数据均无此游戏（huiskylabs 未进雷达抓取源），无 mark_used 步骤

## 建议

- 到 Google Search Console 对 `https://playbloo.net/game/cold-smoke` 执行「网址检查 → 请求编入索引」
