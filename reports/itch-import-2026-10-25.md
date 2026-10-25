# itch.io 批次导入记录 · 2026-10-25

本轮为雷达 API 自动化流程（fetch_batch → 挑选 → 建页 → mark_used 回填）首次实跑。雷达当日抓取 10 款（status=new，ready 队列为空），入库 **7 款**，跳过 3 款；入库后 `POST /api/itch/mark-used` 分两次回填（6+1），**marked=7, not_found=[]**。

生产库游戏总量由 1,085 条增至 **1,092 条**（已发布 1,078 → 1,085），分类关联由 2,271 条增至 **2,285 条**（+14）。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 多人 |
|---|---|---|---|---|
| [Powder Peak Tycoon](https://playbloo.net/game/powder-peak-tycoon) | idle, simulation | released | HTML5 | 单人 |
| [Rei, Tashitokimashita.](https://playbloo.net/game/rei-tashitokimashita) | simulation, casual | released | HTML5 | 单人 |
| [Factory Go（ファクトリ囲碁）](https://playbloo.net/game/factory-go) | strategy, board-game | released | HTML5 | CPU/本地/在线 |
| [CHAIR Champions](https://playbloo.net/game/chair-champions) | racing, action, multiplayer | early-access | Godot | 分屏双人 |
| [RPG In Another World](https://playbloo.net/game/rpg-in-another-world) | rpg, adventure | early-access | Godot | 单人 |
| [Chained Path](https://playbloo.net/game/chainedpath) | strategy, rpg | demo | Unity | 单人 |
| [หนึ่งในอสงไขย](https://playbloo.net/game/1inasamkhyeya) | simulation | early-access | HTML5 | 单人 |

完整 URL 清单（GSC 逐个「网址检查 → 请求编入索引」用）：

```
https://playbloo.net/game/powder-peak-tycoon
https://playbloo.net/game/rei-tashitokimashita
https://playbloo.net/game/factory-go
https://playbloo.net/game/chair-champions
https://playbloo.net/game/rpg-in-another-world
https://playbloo.net/game/chainedpath
https://playbloo.net/game/1inasamkhyeya
```

## 挑选与跳过

- **缘缘庄小吃铺**（notgudong.itch.io/yuanyuanpu）：明日方舟 Endfield 同人作品，页面正文仅 110 字符，素材与可写内容不足，跳过。
- **sahi**（lil999999.itch.io/sahi）：页面无封面、无简介、无截图、无正文，无法建页，跳过。
- **Shape of You: Crossing**（soytg.itch.io/shape-of-you-crossing）：页面自述为成人向（adult）互动小说，不适合全年龄门户，跳过。
- 跳过的 3 款未标记已用，仍留在雷达（status=new），后续批次可再评估。

## 追记：1 ในอสงไขย 复核后补录

初判因「无正文无简介」跳过；复核确认 itch 页面可见文本仅 511 字符（标题/作者/侧栏，Tags: mythology），雷达记录的 description/screenshots/genres 亦全为 null——但游戏本身可玩、有封面、有明确 Genre（Simulation）。按 content-guide「信息薄就写薄」规则改判入库（第 7 款），文案按薄写法处理（明确注明页面未提供玩法说明）。页面 h1「หนึ่งในอสงไขย」比 RSS 标题「1 ในอสงไขย」更权威，入库用 h1；release_date 用雷达 `itch_published_at`（2026-10-23）。

## 抓取与自动化

- **API 拉批次**：`fetch_batch.py --date 2026-10-25 --status new`（ready 为空，当天雷达未走完质检晋升；`new` 数据字段完整，quality_ok 全部为 true，直接使用）。SEO API 本机直连超时，走 Clash 代理正常。
- **页面抓取 10/10 成功**（代理 + 浏览器 UA），无 404/429；API 字段（cover_url/genres/keywords/quality_ok）与页面字段合并进 enriched.json。
- **CHAIR Champions 标题去版本号**：RSS 标题为「CHAIR Champions 0.4.1.5 Halloween Edition 🎃」，版本号随每次更新变动，入库标题定为 `CHAIR Champions`（slug 不变）。
- **入库**：dry-run 零 PROBLEM 后正式执行（7 games + 14 分类 + 7 条 "Added to PlayBloo" Updates，分 6+1 两批）；import_games.py 自动落盘 imported-urls.txt。本轮顺手修复 import_games.py 取发行日只认 Markdown 路径 `published_at` 的问题，补上 API 路径 `itch_published_at` 兜底。
- **素材镜像**：mirror_media.mjs 上传 6 封面 + 28 截图至 `game-media` bucket（`covers/2026-10-25/`、`screenshots/2026-10-25/`），全部转 WebP，0 错误；CHAIR Champions 1 张动图截图保留动画（动画 WebP 校验通过）。
- **验证**：抽查 powder-peak-tycoon / chair-champions / factory-go 三页均 200、meta_title 覆盖生效、game-media 镜像图与 itch 外链正常；powder-peak-tycoon 首访 9.5KB 为 ISR 生成中间态，二次访问 98KB 完整渲染（含 editorial_take 区块）。
- **mark_used 回填**：`mark_used.py --urls-file imported-urls.txt --date 2026-10-25` → `marked=6 not_found=[]`，与入库数一致。

## sitemap

本轮纯 INSERT，未 UPDATE 任何老游戏行，老游戏 `updated_at` 不变。新 6 款 `is_published=true`，动态 sitemap（`src/app/sitemap.ts` 按 `updated_at` 取 lastmod）下次刷新（约 1h）自动收录，lastmod 即今日上线日期，无需改生成器。

## 版本状态备注

- CHAIR Champions / RPG In Another World：页面标注 In development 且可玩，入库为 `early-access`。
- Chained Path：页面自述 "Play the free demo in your browser"，入库为 `demo`。
