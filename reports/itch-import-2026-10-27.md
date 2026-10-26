# itch.io 批次导入记录 · 2026-10-27

雷达当日 00:02 抓取 10 款（status=new，ready 队列为空），入库 **8 款**，跳过 2 款；入库后 `POST /api/itch/mark-used` 回填，**marked=8, not_found=[]**。

生产库已发布游戏总量 1,094 → **1,104**（count=exact；本批 +8，另 +2 为 10-25 独立补录的 1inas 相关游戏，与本批无关）。本轮新增分类关联 15 条、`game_updates`（"Added to PlayBloo"）8 条。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 画面 |
|---|---|---|---|---|
| [Lake Placid](https://playbloo.net/game/lake-placid) | adventure, simulation | early-access | Godot | 2D |
| [MY SWEET PETS[Demo]](https://playbloo.net/game/my-sweet-pets-demo) | casual | demo | Ren'Py | 2D |
| [Raise Your AI](https://playbloo.net/game/raise-your-ai) | idle, casual | released | HTML5 | 3D |
| [Je suis Maranza](https://playbloo.net/game/je-suis-maranza) | action, arcade | released | HTML5 | 2D |
| [Dragon Dynasty](https://playbloo.net/game/dragon-dynasty) | idle, strategy | released | Godot | 2D |
| [Flakeparty](https://playbloo.net/game/flakeparty) | card, strategy | early-access | Unity | 2D |
| [Great Expanse: Road to Immortality](https://playbloo.net/game/great-expanse-road-to-immortality) | simulation, rpg | released | HTML5 | 文本（未填） |
| [Rotten Machines](https://playbloo.net/game/rotten-machines) | adventure, racing | released | Unity | 3D |

完整 URL 清单（GSC 逐个「网址检查 → 请求编入索引」用）：

```
https://playbloo.net/game/lake-placid
https://playbloo.net/game/my-sweet-pets-demo
https://playbloo.net/game/raise-your-ai
https://playbloo.net/game/je-suis-maranza
https://playbloo.net/game/dragon-dynasty
https://playbloo.net/game/flakeparty
https://playbloo.net/game/great-expanse-road-to-immortality
https://playbloo.net/game/rotten-machines
```

## 挑选与跳过

- **Costa Sul**（natitawrites.itch.io/costa-sul）：页面自述「COSTA SUL is an 18+ slice-of-life interactive fiction, for explicit language, explicit sexual themes, alcohol use…」，不适合全年龄门户，跳过。未标记已用，仍留在雷达（status=new），后续批次可再评估。
- **Ragdoll sandbox**（themilitarysimularper.itch.io/ragdoll-sandbox）：核心玩法为「watch dummies suffer」的虐待沙盒，封面/截图含血泊、内脏器官设定与枪械/酸液等武器面板，与全年龄门户定位不符，跳过。未标记已用，仍留在雷达。
- 其余 8 款 quality_ok 全部为 true，全部免费、HTML5 浏览器可玩，全部入库。

## 抓取与自动化

- **API 拉批次**：`fetch_batch.py --date 2026-10-27 --status new`（ready 为空，与 10-25/10-26 批次相同形态）。SEO API 走 Clash 代理。
- **页面抓取 10/10 成功**（代理 + 浏览器 UA），无 404/429；挑选落实后从 games.json 删除 2 款跳过款并重跑 parse_and_fetch，enriched.json 最终含 8 款。
- **文案**：8 款全部按 content-guide 写齐 description/how_to_play/controls/tips/features + editorial_take/meta_title/meta_description 三件套。要点：Je suis Maranza 为意大利语页面，如实写 Italian-language presentation 并翻译玩法前提；Lake Placid 保留开发者 AI 素材披露；Flakeparty 保留 web build 音调偏高的已知问题与 Steam 替代；MY SWEET PETS 标注 itch 页英文、游戏内截图为日文 UI。
- **入库**：dry-run 零 PROBLEM（8 rows + 15 分类）后正式执行。
- **素材镜像**：mirror_media.mjs 上传 8 封面 + 32 截图至 `game-media` bucket（`covers/2026-10-27/`、`screenshots/2026-10-27/`），全部转 WebP，ERRORS: 0。2 张动图截图（Dragon Dynasty、Flakeparty）由脚本按帧校验转换。
- **验证**：抽查 lake-placid / je-suis-maranza / dragon-dynasty 三页均 200，meta_title/meta_description 覆盖生效（标题带 "| PlayBloo" 后缀），editorial_take/How to Play/Controls/Tips 区块渲染正常，封面截图均指向 game-media 镜像，外链按钮指向原 itch 页面。dragon-dynasty 与 lake-placid 首访 60s 超时仅返回部分字节（ISR 生成中间态），重拉即完整，与 10-25/10-26 批次首访形态一致，非页面缺陷。
- **mark_used 回填**：`mark_used.py --urls-file imported-urls.txt --date 2026-10-27` → `marked=8 not_found=[]`，与入库数一致。
- **Google ping**：`/ping?sitemap=` 端点 2023 年起弃用（预期内），GSC 加速按清单手工提交。

## sitemap

本轮纯 INSERT，未 UPDATE 任何老游戏行；抓取时核对 powder-peak-tycoon 的 lastmod 仍为 2026-10-25T08:22:50.965Z（未被批量改写）。新 8 款 `is_published=true`，created_at=2026-10-26T16:48Z（=本地 2026-10-27 00:48，即实际上线时刻）；动态 sitemap（按 `updated_at` 取 lastmod）1h 缓存刷新后自动收录，抓取时（00:5x）尚未进入线上 XML，属缓存未到期，未做人工干预。分类/标签/系列页面本轮只增不减，仍满足收录条件。

## 版本状态备注

- Lake Placid / Flakeparty：页面标注 In development 且可玩，入库为 `early-access`。
- MY SWEET PETS[Demo]：页面自述 DEMO（标题保留 h1 的 [Demo] 后缀），入库为 `demo`。
- Raise Your AI / Je suis Maranza / Dragon Dynasty / Great Expanse / Rotten Machines：Released，入库为 `released`。
