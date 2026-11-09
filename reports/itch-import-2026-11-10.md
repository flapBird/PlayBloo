# itch 新游戏批量入库 · 2026-11-10

雷达批次：`fetch_batch.py --date 2026-11-10`，status=new 共 10 款。全部免费、无 NSFW 标记，**10 款全部入库**，无剔除。入库后站点游戏总数 1252。

## 本批入库（10 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| This Desert Won't Vacuum Itself | `this-desert-wont-vacuum-itself` | simulation, idle | Godot | released | 第一人称 3D 清扫增量：口袋→茶匙→吸尘器的工具阶梯、200×200m 三区沙漠、11 处发现+8 修复区、27 件商店、3 台自主清洁机；GIF 封面转动画 WebP（72 帧核验通过） |
| PLUVIA — Be the Rain | `pluvia` | simulation, casual | HTML5 | released | 逐像素水模拟雨神沙盒：左键降雨右键饮洪、村庄许愿成长、野火、天空升级、5 山谷+23 挑战无尽模式；1 张动图截图转动画 WebP（37 帧） |
| Season Shift | `seasonshift` | puzzle, casual | HTML5 | released | 扭曲世界采花的像素解谜：约 15 关+兔子；信息薄按薄写；GIF 封面转动画 WebP（70 帧）；作者取 credits 中的 Emlise |
| guesthour | `guesthour` | horror, rpg | — | released | 点选+回合制的礼貌恐怖：知识准备是关键、怠慢客人即惩罚；Terrorottobre Jam 2026 一个月作；移动可玩但建议鼠标；引擎未标注留空 |
| Dateline Tdb | `datelinetdb` | casual | Ren'Py | released | Turma da Batatinha（巴西 YT 频道）葡语粉丝 VN：自称女神的 Batatinha 绑架嘉宾录节目，Yuyu/Sunny/Kode 可攻略；如实标注 fan-made、葡语呈现 |
| Dice No.順タップ | `dice-no-shun-tatupu` | arcade, casual | HTML5 | released | いれいす (Ireisu) 粉丝向时间挑战：按 Dice No.1→6 顺序点 tap 六名成员计时；日语 UI；非营利无官方素材，如实标注 |
| The Deconsecration Initiative | `the-deconsecration-initiative` | idle, strategy | Godot | demo | 杀神激光增量：碎片→电站/火箭/mini laser、工人被腐化成蛞蝓/水晶树后"物尽其用"；demo 含前 3 关，完整版求 Steam 愿望单 |
| BoosterWare | `boosterware` | card, strategy | Unity | demo | 2000s 假桌面里给卡牌游戏开挂的组牌自动战斗：拆包→外挂自动化→市场倒卡，Tin→Legend 天梯；demo 覆盖前 2 小时，完整版 2027 |
| Success Prints Crash Course | `stratus-university` | educational, simulation | Unity | demo | 3D 低多边形大学校园教育模拟：orientation 导览+第一周社交学业平衡；"隐藏课程"主题；免费版（存档功能在付费版）；作者署名 Success Prints（页面多次出现） |
| Supermarket Spree DX | `supermarket-spree-dx` | puzzle, trivia | GB Studio | released | GB 风格《Supermarket Sweep》致敬：700+ 商品扫货、购物清单、bonus 小游戏、ssdx.online 线上排行榜；官方 PDF 手册+键位表齐全 |

分类合计 19 条：casual 4 / simulation 3 / idle 2 / strategy 2 / puzzle 2 / arcade 1 / horror 1 / rpg 1 / card 1 / educational 1 / trivia 1（按关联计）。

## 过程记录

- **429 限速两轮补抓**：首轮 5/10 成功，其余 429；冷却后 `--workers 2` 补抓 3 款，再等 75s `--workers 1` 补齐最后 2 款，三份输出按 URL 去重（ok=True 优先）合并回 enriched.json，最终 10/10。
- **graphics 逐款确认**：6 款不确定的封面原图直连下载核图——Success Prints 为 3D 低多边形校园、This Desert 为第一人称 3D，Dice/Deconsecration/Season Shift/guesthour 均为 2D。
- **作者补正**：stratus-university 页面无 Author 行，按页面署名补 "Success Prints"；seasonshift 取 credits 中的 Emlise。
- **动图素材**：2 款 GIF 封面（this-desert / seasonshift）+1 张 pluvia 动图截图走 ffmpeg+libwebp 转动画 WebP，ANMF 帧块核验 72/70/37 帧全部 >1；其余静态图走 sharp。
- meta 三件套：10 款 meta_title 本体 32-45（渲染后 43-56 全部 ≤60）；meta_description 134-152 全部 ≤155。
- 开发状态映射：页面事实卡自述 demo / 免费版 → demo（deconsecration、boosterware、stratus-university）；其余 released。
- 本批未改 `src/app/sitemap.ts`：动态生成已能正确反映上下架，无需动生成器。

## 验证

- 线上抽检 `/game/this-desert-wont-vacuum-itself`、`/game/supermarket-spree-dx`、`/game/guesthour`（走代理带浏览器 UA）：页面 200，`<title>` 为 meta_title+` | PlayBloo`，meta description 与库内一致，itch 外链按钮、editorial 区块、Controls/Tips/Features 全部渲染。
- DB 核验：10 行 slug / 19 分类 / 10 条 "Added to PlayBloo" Updates 落库；thumbnail_url 全部指向 `game-media/covers/2026-11-10/`；updated_at 一律 2026-11-09T16:25 UTC（北京时间 11-10 00:25，即实际上线时刻）。
- 老游戏保护：按 updated_at 倒序前 14 条恰为本批 10 款，第 11-14 名仍是上批 2026-11-08T16:55，老游戏时间戳未被改写。
- sitemap（数据侧核验，按约定不等待线上刷新）：线上 sitemap 抽查 floor-scrubber-empire lastmod=2026-11-08T16:55:56Z 与 DB updated_at 一致；本批 10 款待 1h 周期刷新后自动收录，lastmod 将取本次上线时刻。
- supermarket-spree-dx 页面抓到的是镜像 PATCH 之前的 ISR 缓存（og:image/hero 仍指 itch CDN），DB 已正确，revalidate=300 到期自愈，与 11-08 批"最快 5 分钟反映"一致，不再等待确认。
- 雷达回填：`mark_used.py` marked=10、not_found=[]，与入库数一致。

## GSC 提交清单

- https://playbloo.net/game/this-desert-wont-vacuum-itself
- https://playbloo.net/game/pluvia
- https://playbloo.net/game/seasonshift
- https://playbloo.net/game/guesthour
- https://playbloo.net/game/datelinetdb
- https://playbloo.net/game/dice-no-shun-tatupu
- https://playbloo.net/game/the-deconsecration-initiative
- https://playbloo.net/game/boosterware
- https://playbloo.net/game/stratus-university
- https://playbloo.net/game/supermarket-spree-dx
