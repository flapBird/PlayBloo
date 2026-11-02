# itch 批次导入 2026-11-02

雷达当日批次（status=new，10 款全部免费、quality_ok）→ 入库 8 款，跳过 2 款。

注意：本日起雷达 API 的「未用」状态枚举从 `ready` 改为 `new`（fetch_batch.py 需 `--status new`），skill 文档待更新。

| # | 游戏 | slug | 分类 | 引擎 | 画面 | 状态 |
|---|------|------|------|------|------|------|
| 1 | Terraform | terraform | simulation, idle | — | 2D | released |
| 2 | Kingdom Idle | kingdom-idle | simulation, idle | — | 3D | demo (prototype) |
| 3 | +1 Soldier Clicker | plus-one-soldier | idle, casual | Godot | 2D | released |
| 4 | Solo Tale | solo-tale | rpg, adventure | — | 2D | early-access (alpha) |
| 5 | Mr. Axe | mr-axe | simulation, idle | Godot | 2D | early-access |
| 6 | Twist & Untangle | twist-and-untangle | simulation, casual | — | 2D | demo (prototype) |
| 7 | 歐告與嘎逼的農場 | minifarm | simulation, casual | — | 2D | released |
| 8 | Starbot Zone | starbot-zone | platformer, action | Godot | 2D | released |

- 入库：8 games + 16 category links + 8 "Added to PlayBloo" updates（生产库，2026-11-02，updated_at=实际入库时刻）
- 素材：封面 + 28 张截图全部镜像至 Supabase Storage `covers/2026-11-02/`、`screenshots/2026-11-02/`，ERRORS 0。动图 5 张（minifarm 封面 + minifarm-1、plus-one-soldier-1/2、mr-axe-1/2）转动画 WebP；抽验 minifarm 封面：30 ANMF 帧、560×444，动效保住。
- 跳过（留在雷达，不标记 used）：
  - Budget Blitz（jalan-journey）——页面无任何图片素材（无 og:image、无封面、0 截图）、无正文，无法生成卡片缩略图（同 11-01 A Viagem de Flávio 先例）
  - Next Step（kenneth-vital.itch.io）——查重跳过：库内已有同游戏（slug `next-step`，2026-10-11 自 n3vm.itch.io 导入）。kenneth-vital 页面署名 "by Kenneth Vital, N3VM"，为同一游戏迁移账号重传，不重复入库；其 URL 已并入 mark_used 清单使雷达侧同步标记，避免后续重复拉出
- sitemap：sitemap.ts 动态生成，新游戏 updated_at=实际入库时刻（2026-11-02T15:11 UTC）自动收录；未触碰任何老游戏的 updated_at/lastmod（next-step 经 mirror 收编封面后 updated_at 仍为 2026-10-11T01:39，验证未改写）
- 页面验证（curl 实测 https://playbloo.net/game/<slug>，terraform / minifarm / mr-axe 三页）：
  - `<title>` 渲染 56/46/52 字符（≤60 达标），meta description 127/119/135 字符（≤160 达标）
  - 封面与推荐位图片全部来自 `game-media` 自家 storage，页面无 `itch.zone` 直链
  - "Why we're featuring" editorial 区块渲染正常；外链按钮指向各自 itch 官方页
- mark_used：见下方回填结果记录
- 页面 URL（GSC 逐个「网址检查 → 请求编入索引」，手工配额约 10-12 条/天，正好覆盖本批）：
  - https://playbloo.net/game/terraform
  - https://playbloo.net/game/kingdom-idle
  - https://playbloo.net/game/plus-one-soldier
  - https://playbloo.net/game/solo-tale
  - https://playbloo.net/game/mr-axe
  - https://playbloo.net/game/twist-and-untangle
  - https://playbloo.net/game/minifarm
  - https://playbloo.net/game/starbot-zone
- 文案要点：信息厚薄分级——Solo Tale（页面特详）写足 6 段/10 features；Kingdom Idle、Next Step、Starbot Zone 页面近空，各写 3 段/5 features 内并引导去原页；minifarm 注明 Traditional Chinese presentation 与 PS5/Xbox 手柄支持；meta_title/meta_description 全部原创且经长度校验（最长 title 47 / desc 137，均在限内）
