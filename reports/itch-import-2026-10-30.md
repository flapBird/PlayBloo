# itch.io 批次导入记录 · 2026-10-30

雷达当日 00:02 抓取 10 款，但全批卡在 `status=new`——雷达服务器补全 itch 详情再次被 403（与既往批次同形态），本轮按 `--status new` 拉取（等价于导出 Markdown 回退路径，详情由本机抓取补全）。入库 **10 款**，跳过 0 款；入库后 `POST /api/itch/mark-used` 回填，**marked=10, not_found=[]**。

生产库已发布游戏总量 1,124 → **1,135**（count=exact；本批 +10，另 +1 为投稿 Number Beasts: Bond Lab，系 10-30 凌晨投稿审核会话发布）。本轮新增分类关联 20 条、`game_updates`（"Added to PlayBloo"）10 条。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 画面 |
|---|---|---|---|---|
| [SPARKMIND](https://playbloo.net/game/sparkmind) | idle, simulation | released | HTML5 | 2D |
| [Antpire](https://playbloo.net/game/antpire) | idle, simulation | released | LÖVE | 2D |
| [ノートサイン配球ゲーム](https://playbloo.net/game/notesign-haikyu) | sports, simulation | released | HTML5 | 2D |
| [Debug the Monolith](https://playbloo.net/game/debug-the-monolith) | idle, simulation | early-access | HTML5 | 2D |
| [The Idle Countdown](https://playbloo.net/game/idle-countdown) | idle, casual | released | GameMaker | （未填） |
| [One Button to Infinity](https://playbloo.net/game/one-button-to-infinity) | idle, puzzle | released | HTML5 | 2D |
| [ORCHINKO](https://playbloo.net/game/i-was-reborn-as-a-warlord-of-patinko-orcs-and-i-need-to-crush-my-enemy) | arcade, strategy | released | Phaser | 2D |
| [TurboVektor](https://playbloo.net/game/turbovektor) | racing, action | early-access | Z80 assembly（ZX Spectrum 浏览器模拟） | 3D |
| [Last Flag Standing](https://playbloo.net/game/last-flag-standing) | strategy, casual | early-access | HTML5 | 2D |
| [The Lands](https://playbloo.net/game/the-lands) | rpg, simulation | early-access | HTML5 | 2D |

完整 URL 清单（GSC 逐个「网址检查 → 请求编入索引」用）：

```
https://playbloo.net/game/sparkmind
https://playbloo.net/game/antpire
https://playbloo.net/game/notesign-haikyu
https://playbloo.net/game/debug-the-monolith
https://playbloo.net/game/idle-countdown
https://playbloo.net/game/one-button-to-infinity
https://playbloo.net/game/i-was-reborn-as-a-warlord-of-patinko-orcs-and-i-need-to-crush-my-enemy
https://playbloo.net/game/turbovektor
https://playbloo.net/game/last-flag-standing
https://playbloo.net/game/the-lands
```

## 挑选与核验

- 10 款全部逐款单发抓取核验浏览器播放器嵌入（`html_embed_widget` + `game_frame` 均存在），全部免费，全部入库，无跳过。The Lands 页面带开发者自标 "18+"（政治讽刺题材，页面无 itch 成人门禁），照常入库并按规范在描述中保留该提示。
- development_status 以 itch 侧栏状态判定：sparkmind / antpire / notesign-haikyu / idle-countdown / orchinko / one-button-to-infinity 为 Released；debug-the-monolith / turbovektor / last-flag-standing / the-lands 为 In development 的可玩构建 → early-access。
- 语言注记：notesign-haikyu 为日语界面（按规则在描述与 features 注明 Japanese-language presentation）；the-lands 截图显示泰语界面（页面正文为英文），已在描述注明 Thai-language interface；debug-the-monolith 自述 Vietnamese & English；last-flag-standing 自述 10 语言。

## 抓取与自动化

- **网络形态**：本机 Clash 代理（127.0.0.1:7890）未运行，但今晚 itch.io 与 SEO 控制台均**直连可达**——fetch_batch / parse_and_fetch / mark_used 全部走 `--direct`，无需代理；Supabase 与 img.itch.zone 照例直连。
- **API 拉批次**：`--date 2026-10-30 --status ready` 为 0（全批卡 `new`，雷达详情抓取被 itch 403），改 `--status new` 拉到全批 10 款（RSS 基础字段 + `quality_ok=true`，无作者/分类，由页面抓取补全）。
- **页面抓取**：并发 5 首轮 9/10，The Idle Countdown 撞 HTTP 429；等 150 秒后单发重抓成功（合并时需**替换**原失败记录——首次合并因 URL 已存在被跳过，已修正）。最终 10/10，无 404。
- **文案**：10 款全部按 content-guide 写齐 description/how_to_play/controls/tips/features + editorial_take/meta_title/meta_description 三件套。要点：turbovektor 按页面完整抄录 ZX Spectrum 四套控制方案与浏览器专用提示（选 4 用方向键+0 开火）；antpire 抄录完整键位（QWE/R/1-5/TAB/Esc/F8）；the-lands 信息薄（一句话简介+泰语 UI），按最薄模板写并如实标注 18+ 与 Thai-language interface；notesign-haikyu 译介 NPB 2004–2013 失分概率数据来源；sparkmind / idle-countdown / one-button-to-infinity 页面未给键位，controls 用回填句；idle-countdown 的 graphics 留空（纯文本界面）。
- **入库**：dry-run 零 PROBLEM（10 rows + 20 分类）后正式执行。
- **素材镜像**：mirror_media.mjs 上传 10 封面 + 35 截图至 `game-media` bucket（`covers/2026-10-30/`、`screenshots/2026-10-30/`），全部转 WebP，0 错误。ORCHINKO 封面为 GIF 动图（1.1MB），连同 3 张动图截图转成动画 WebP，脚本帧校验通过；线上核验 `content-type: image/webp`、`cache-control: max-age=604800`。DB 10 款 thumbnail/screenshots 全部指向 game-media（URL 均含 bucket 名）。
- **验证**：抽查 sparkmind / turbovektor / orchinko 三页均 200，meta_title 覆盖生效（标题带 "| PlayBloo" 后缀），editorial/How to Play/Tips/Features/Updates 区块渲染正常，封面截图均指向 game-media 镜像，外链按钮指向原 itch 页面。
- **mark_used 回填**：`mark_used.py --urls-file imported-urls.txt --date 2026-10-30 --direct` → `marked=10 not_found=[]`，与入库数一致。

## sitemap

本轮纯 INSERT，未 UPDATE 任何老游戏行；核对线上 XML 中 death-spiral（2026-06-28T14:22:15.256Z）与 powder-peak-tycoon（2026-10-25T08:22:50.965Z）的 lastmod 与 10-29 报告记录一致，未被改写。10-29 批次 10 款已全部出现在线上 XML（DO 免费版缓存冻结问题已恢复）。新 10 款 `is_published=true`，updated_at=2026-10-29T16:33:08Z（=本地 2026-10-30 00:33，即实际上线时刻；XML 按惯例渲染为 UTC 时间戳），动态 sitemap（`updated_at` 取 lastmod）数据侧完全就绪。

入库时刻（00:33）线上 `/sitemap.xml` 的 ISR 缓存（1 小时）尚未到期，截至 00:39 线上 XML（1199 条）未含本批 10 款；缓存过期后会自动收录，无需改任何数据。数据侧核验已通过（新增 10 款 lastmod=上线时刻、老游戏时间戳未动），**按用户 2026-10-30 明确的约定，不再等待线上缓存刷新做收录确认**。
