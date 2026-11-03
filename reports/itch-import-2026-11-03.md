# itch 批次导入 2026-11-03

雷达当日批次（status=new，10 款全部免费、quality_ok）→ 入库 9 款，跳过 1 款。

| # | 游戏 | slug | 分类 | 引擎 | 画面 | 状态 |
|---|------|------|------|------|------|------|
| 1 | Dungeon Smash Clicker | dungeon-smash-clicker | idle, casual | Godot | 2D | released |
| 2 | Big Bang Pickaxe | big-bang-pickaxe | simulation, idle | — | 2D | demo |
| 3 | A Game About Building Swarms [playtest] | a-game-about-building-swarms-playtest-a | simulation, idle | Unity | 2D | demo (playtest) |
| 4 | Lucky Ticket Tycoon | lucky-ticket-tycoon | simulation, casual | — | 2D | released |
| 5 | Idle Brick Breaker | idle-brick-breaker | arcade, idle | Unity | 2D | early-access |
| 6 | UNDERTALE VS GOJO | undertale-vs-gojo | action, fighting | Godot | 2D | released |
| 7 | Sleigh the Spire 🎄🎁 | sleigh-the-spire | card, strategy | Construct | 2D | released |
| 8 | Hostage Heart | hostage-heart | adventure, casual | Ren'Py | 2D | released |
| 9 | The MachinEGG | the-machinegg | simulation, idle | PixiJS | 2D | released |

- 入库：9 games + 18 category links + 9 "Added to PlayBloo" updates（生产库，2026-11-03，updated_at=实际入库时刻）
- 素材：封面 + 40 张截图全部镜像至 Supabase Storage `covers/2026-11-03/`、`screenshots/2026-11-03/`，ERRORS 0。动图 4 张（dungeon-smash-clicker-1/2、swarms-1 等）转动画 WebP；抽验 swarms-1：29 ANMF 帧，动效保住。
- 跳过（留在雷达，不标记 used）：
  - CWR-RankHub（peanuts2）——页面无 og:image、无封面、0 截图、无正文（更像工具页而非游戏），无法生成卡片缩略图
- 本轮网络状况备注：本机 Clash 未运行（mihomo 进程存活但出口节点死，混合端口已从 7890 改为 7899）。雷达 API 靠 curl 直连重试拉取；用户恢复节点后页面抓取走 7899。首抓遇 itch 限速（SSL EOF ×10、429），按 pitfalls 降并发 --workers 2 + 冷却后补抓完成 10/10。
- UNDERTALE VS GOJO 为非官方同人（页面自带 credits：Toby Fox / Gege Akutami / Yoshimasa Terui），文案如实标注 fan-made 并建议支持原作。
- sitemap：sitemap.ts 动态生成，新游戏 updated_at=实际入库时刻自动收录；未触碰任何老游戏的 updated_at/lastmod。
- 页面验证（curl 实测 https://playbloo.net/game/<slug>，dungeon-smash-clicker / undertale-vs-gojo / lucky-ticket-tycoon 三页）：
  - `<title>` 渲染 57/58/57 字符（≤60 达标），meta description 133/138/138 字符（≤160 达标）
  - 封面与推荐位图片全部来自 `game-media` 自家 storage，页面无 `itch.zone` 直链
  - "Why we're featuring" editorial 区块渲染正常；外链按钮指向各自 itch 官方页
  - 首次抓取曾遇 ISR 生成中间态（27-51KB 骨架页），重抓即完整（142KB），非故障
- mark_used：marked=9 与入库数一致；首次执行暴露 mark_used.py 参数 bug（--proxy 的值被当作 URL 计入清单，误报一条 not_found，无实害），已修复并经雷达侧复查：11-03 批次现为 9 used + 1 new（CWR-RankHub 按跳过决定保留）
- 页面 URL（GSC 逐个「网址检查 → 请求编入索引」，手工配额约 10-12 条/天，正好覆盖本批）：
  - https://playbloo.net/game/dungeon-smash-clicker
  - https://playbloo.net/game/big-bang-pickaxe
  - https://playbloo.net/game/a-game-about-building-swarms-playtest-a
  - https://playbloo.net/game/lucky-ticket-tycoon
  - https://playbloo.net/game/idle-brick-breaker
  - https://playbloo.net/game/undertale-vs-gojo
  - https://playbloo.net/game/sleigh-the-spire
  - https://playbloo.net/game/hostage-heart
  - https://playbloo.net/game/the-machinegg
- 文案要点：信息厚薄分级——Lucky Ticket Tycoon / Dungeon Smash Clicker / Hostage Heart 写足；Swarms playtest 正文仅一行玩法循环，写薄 3 段并引导去原页/反馈；UNDERTALE VS GOJO 与 Hostage Heart 保留原页 credits 与语言说明；meta_title/meta_description 全部原创且经长度校验（最长 title 52 / desc 138，均在限内，无裸 &）
