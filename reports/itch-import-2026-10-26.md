# itch.io 批次导入记录 · 2026-10-26

雷达当日 00:02 抓取 10 款（status=new，ready 队列为空），入库 **9 款**，跳过 1 款；入库后 `POST /api/itch/mark-used` 回填，**marked=9, not_found=[]**。

生产库已发布游戏总量由 1,085 条增至 **1,094 条**（count=exact），本轮新增分类关联 17 条、`game_updates`（"Added to PlayBloo"）9 条。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 多人 |
|---|---|---|---|---|
| [Shuriken Maestro](https://playbloo.net/game/shuriken-maestro) | action, idle | early-access | HTML5 | 单人 |
| [Felisomnia: Behind a Cat's Eyes](https://playbloo.net/game/felisomnia-behind-a-cats-eyes) | action, survival | early-access | Unity | 单人 |
| [Battle of Builds](https://playbloo.net/game/bob) | strategy, rpg | early-access | HTML5 | 单人 |
| [Infinipop (Demo)](https://playbloo.net/game/infinipop-demo) | simulation, casual | demo | Godot | 单人 |
| [To Find A Home [DEMO]](https://playbloo.net/game/to-find-a-home) | casual | demo | Ren'Py | 单人 |
| [超パンケーキ返し](https://playbloo.net/game/super-pancake-flip) | arcade, casual | released | Godot | 单人 |
| [Tiny Bastion](https://playbloo.net/game/tiny-bastion) | strategy, idle | early-access | Godot | 单人 |
| [EX-LIBRIS](https://playbloo.net/game/ex-libris) | puzzle, casual | released | Godot | 单人 |
| [Apex Sweeper](https://playbloo.net/game/apex-sweeper) | adventure, casual | early-access | Ren'Py | 单人 |

完整 URL 清单（GSC 逐个「网址检查 → 请求编入索引」用）：

```
https://playbloo.net/game/shuriken-maestro
https://playbloo.net/game/felisomnia-behind-a-cats-eyes
https://playbloo.net/game/bob
https://playbloo.net/game/infinipop-demo
https://playbloo.net/game/to-find-a-home
https://playbloo.net/game/super-pancake-flip
https://playbloo.net/game/tiny-bastion
https://playbloo.net/game/ex-libris
https://playbloo.net/game/apex-sweeper
```

## 挑选与跳过

- **丸吞まれ屋**（tasogare-vore.itch.io/marunomi-supporter）：页面自述「成人向けの作品です（18歳以上）」、vore 题材（无 Gore），不适合全年龄门户，跳过。未标记已用，仍留在雷达（status=new），后续批次可再评估。

## 抓取与自动化

- **API 拉批次**：`fetch_batch.py --date 2026-10-26 --status new`（与 10-25 批次相同，ready 为空、new 字段完整，quality_ok 全部为 true）。SEO API 走 Clash 代理。
- **页面抓取 10/10 成功**（代理 + 浏览器 UA），无 404/429；挑选落实后从 games.json 删除跳过款并重跑 parse_and_fetch，enriched.json 最终含 9 款。
- **文案**：9 款全部按 content-guide 写齐 description/how_to_play/controls/tips/features + editorial_take/meta_title/meta_description 三件套；To Find A Home 保留开发者 Content Warning（轻微受伤、过往自残模糊提及、可选性暗示内容等）；EX-LIBRIS 页面仅 222 字符按薄写法处理；Apex Sweeper 如实写 fan-made / 非 SEGA 官方。
- **入库**：dry-run 零 PROBLEM（9 rows + 17 分类，无 slug 冲突）后正式执行。
- **素材镜像**：mirror_media.mjs 上传 9 封面 + 41 截图至 `game-media` bucket（`covers/2026-10-26/`、`screenshots/2026-10-26/`），全部转 WebP，ERRORS: 0。两个动图素材逐帧复核：Battle of Builds 封面动画 WebP 含 19 个 ANMF 帧、Felisomnia 动图截图含 38 帧，动效保留。
- **验证**：抽查 shuriken-maestro / bob / to-find-a-home / super-pancake-flip 四页均 200，meta_title 覆盖生效（含日文标题款），封面均指向 game-media 镜像，外链与 editorial_take 区块渲染正常。super-pancake-flip 首访传输偏慢（50s 仅 5.4KB，ISR 生成中间态），与 10-25 批次 powder-peak-tycoon 首访形态一致，属线路/首访缓存问题非页面缺陷。
- **mark_used 回填**：`mark_used.py --urls-file imported-urls.txt --date 2026-10-26` → `marked=9 not_found=[]`，与入库数一致。
- **Google ping**：`/ping?sitemap=` 端点返回 404（2023 年已弃用，预期内）；GSC 加速按清单手工提交。

## sitemap

本轮纯 INSERT，未 UPDATE 任何老游戏行；抽样核对 powder-peak-tycoon 的 lastmod 仍为昨日入库时刻（2026-10-25T08:22:50.965Z），未被批量改写。新 9 款 `is_published=true`，动态 sitemap（按 `updated_at` 取 lastmod）1h 缓存刷新后自动收录；lastmod 即实际上线时刻（2026-10-25T16:3xZ = 本地 2026-10-26 00:3x，UTC 与东八区跨日，时间戳本身准确）。抓取当时（00:4x）9 款尚未进入线上 XML，属 1h 缓存未到期，未做任何人工干预。分类/标签/系列页面本轮只增不减，仍满足收录条件。

## 版本状态备注

- Shuriken Maestro / Felisomnia / Battle of Builds / Tiny Bastion / Apex Sweeper：页面标注 In development 且可玩，入库为 `early-access`。
- Infinipop (Demo) / To Find A Home [DEMO]：页面自述 demo，入库为 `demo`（标题保留页面 h1 的 (Demo)/[DEMO] 后缀）。
- 超パンケーキ返し / EX-LIBRIS：Released，入库为 `released`。
