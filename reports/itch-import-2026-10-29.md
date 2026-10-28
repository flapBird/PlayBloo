# itch.io 批次导入记录 · 2026-10-29

雷达当日 00:02 抓取 10 款（全批 `status=error`——雷达服务器抓 itch 被拒，与既往批次同形态，用 `--status error` 拉取），入库 **10 款**，跳过 0 款；入库后 `POST /api/itch/mark-used` 回填，**marked=10, not_found=[]**。

生产库已发布游戏总量 1,113 → **1,124**（count=exact；本批 +10，另 +1 为 eggy-car，系 10-28 白天另一会话单独导入，见未入库的 reports/eggy-car-import-2026-10-28.md）。本轮新增分类关联 18 条、`game_updates`（"Added to PlayBloo"）10 条。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 画面 |
|---|---|---|---|---|
| [AZOTH: The Starforger's Idle](https://playbloo.net/game/azoth) | simulation, idle | released | Godot | 2D |
| [Sawtopsy Demo](https://playbloo.net/game/sawtopsy-demo) | simulation | demo | （未填） | （未填） |
| [MOVECORP](https://playbloo.net/game/movecorp) | simulation, casual | early-access | Godot | 2D |
| [OreGrid](https://playbloo.net/game/oregrid) | simulation, idle | early-access | GameMaker | 2D |
| [AEROFORGE](https://playbloo.net/game/aeroforge) | strategy, simulation | early-access | （未填） | 2D |
| [ร้อยวัน · One Hundred Days](https://playbloo.net/game/roiwan) | horror, adventure | demo | Godot | 2D |
| [ClownTastic Romance](https://playbloo.net/game/clowntastic-romance) | casual | released | Ren'Py | 2D |
| [Hoard Sweeper](https://playbloo.net/game/hoard-sweeper) | simulation, idle | released | Unity | 3D |
| [99%](https://playbloo.net/game/99) | casual, simulation | released | （未填） | 2D |
| [Multi Modal Transit](https://playbloo.net/game/multi-modal) | simulation, strategy | demo | （未填） | 2D |

完整 URL 清单（GSC 逐个「网址检查 → 请求编入索引」用）：

```
https://playbloo.net/game/azoth
https://playbloo.net/game/sawtopsy-demo
https://playbloo.net/game/movecorp
https://playbloo.net/game/oregrid
https://playbloo.net/game/aeroforge
https://playbloo.net/game/roiwan
https://playbloo.net/game/clowntastic-romance
https://playbloo.net/game/hoard-sweeper
https://playbloo.net/game/99
https://playbloo.net/game/multi-modal
```

## 挑选与核验

- 10 款全部逐款单发抓取核验浏览器播放器嵌入（`html_embed_widget` + `game_frame` 均存在），全部免费、无年龄门，全部入库，无跳过。
- development_status 以 itch 侧栏状态 + 页面自述判定：azoth / clowntastic-romance / hoard-sweeper / 99 / multi-modal 为 Released（multi-modal 浏览器版自述为 demo）；sawtopsy-demo / roiwan 页面自称 demo；movecorp / oregrid / aeroforge 为 In development 的可玩构建 → early-access。

## 抓取与自动化

- **网络形态变化**：本机 Clash 代理（127.0.0.1:7890）未运行，但今晚 itch.io 与 SEO 控制台均**直连可达**——fetch_batch / parse_and_fetch / mark_used 全部改用 `--direct` 完成，无需代理；Supabase 与 img.itch.zone 照例直连。
- **API 拉批次**：`--date 2026-10-29 --status ready` 为空（全批 error），改 `--status error` 拉到全批 10 款。
- **页面抓取 10/10 成功**，无 404、无 429。
- **文案**：10 款全部按 content-guide 写齐 description/how_to_play/controls/tips/features + editorial_take/meta_title/meta_description 三件套（meta_title ≤60、meta_description ≤155 逐款程序校验通过）。要点：roiwan（ร้อยวัน · One Hundred Days）如实写泰国丧葬百日习俗背景、保留页面内容警告（恐怖/突发巨响/闪光，可调轻）并按页面给出的完整键位写 controls；clowntastic-romance 如实标 unofficial fan-made；sawtopsy-demo 页面仅一句话、主游戏未发布，按最薄模板写并以封面（血染警示三角）作为语气依据；movecorp 截图显示游戏内商店 UI 为西班牙语（页面正文为英文），已在描述与 tips 中注明；hoard-sweeper 按页面写齐 PC/移动端两套键位；99 / multi-modal / aeroforge 页面无 "Made with"，engine 留空。
- **入库**：dry-run 零 PROBLEM（10 rows + 18 分类）后正式执行。
- **素材镜像**：mirror_media.mjs 上传 10 封面 + 44 截图至 `game-media` bucket（`covers/2026-10-29/`、`screenshots/2026-10-29/`），全部转 WebP，0 错误；本批无 GIF 动图素材。DB 10 款 thumbnail/screenshots 全部指向 game-media（URL 均含 bucket 名）。
- **验证**：抽查 azoth / hoard-sweeper / roiwan 三页均 200，meta_title/meta_description 覆盖生效（标题带 "| PlayBloo" 后缀），editorial_take/About/How to Play/Controls/Tips/Features/Updates 区块渲染正常，封面截图均指向 game-media 镜像，外链按钮指向原 itch 页面。
- **mark_used 回填**：`mark_used.py --urls-file imported-urls.txt --date 2026-10-29 --direct` → `marked=10 not_found=[]`，与入库数一致。

## sitemap

本轮纯 INSERT，未 UPDATE 任何老游戏行；核对线上 XML 中 death-spiral（2026-06-28T14:22:15Z）与 powder-peak-tycoon（2026-10-25T08:22:50Z）的 lastmod 均未被改写。新 10 款 `is_published=true`，updated_at=2026-10-28T16:27Z（=本地 2026-10-29 00:27，即实际上线时刻），动态 sitemap（按 `updated_at` 取 lastmod）数据侧完全就绪。分类/标签/系列页面本轮只增不减，仍满足收录条件。

**截至 00:45 线上 XML 未收录本批**——与 10-28 报告记录的 DO 免费版时长故障同形态，仍在持续：

- 线上 `/sitemap.xml` 的 `x-opennext-cache: STALE`，生成时间冻结在 2026-10-28T08:23:43Z（=16:23 CST，即本批入库前约 4 分钟），带 cache-busting 参数亦不刷新。
- 冻结点之前的变更均已收录：eggy-car（06:40Z，另一会话导入）与 10-28 itch 批次 9 款（lastmod=2026-10-27T17:28Z）都在线上 XML 中；缺席的正是本批 10 款。
- 影响范围同 10-28 报告：依赖 ISR 后台重验证的缓存延迟/冻结；新页面首次渲染与数据正确性不受影响（本批 3 个抽查页即正常按需渲染）。
- 恢复手段同前：重新部署 Worker（重启 DO 运行时）或升级 Workers 付费计划——涉及部署动作，留给用户决定。冻结解除后本批 10 款会自动进入 sitemap，无需再改任何数据。

**验证结论**：sitemap 生成器与 DB 数据已核对无误（新 10 款 lastmod=上线时刻、老游戏未动），线上收录待 DO 故障恢复后自动完成。
