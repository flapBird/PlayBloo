# itch 批次导入 2026-11-01

雷达当日批次（status=new，10 款全部免费、quality_ok）→ 入库 8 款，跳过 2 款。

| # | 游戏 | slug | 分类 | 引擎 | 画面 | 状态 |
|---|------|------|------|------|------|------|
| 1 | Twig's Trick or Treat | twigs-trick-or-treat | casual, arcade | Godot | 2D | released |
| 2 | Underwood | underwood | idle, simulation | Godot | — | early-access |
| 3 | Túi Ba Gang | tui-ba-gang | adventure, puzzle | HTML5 | 2D | released |
| 4 | Kill The Hero | kill-the-hero | strategy, action | Unity | 2D | early-access |
| 5 | OBSESSED With Fashion | obsession | casual, horror | Unity | 2D | released |
| 6 | The Community Notes Are Wrong | the-community-notes-are-wrong | casual | Ren'Py | 2D | released |
| 7 | Game About Botting in an MMORPG | game-about-botting-in-an-mmorpg | idle, rpg | Unity | 2D | demo |
| 8 | NASUBI | nasubi | simulation, horror | Godot | 3D | early-access |

- 入库：8 games + 15 category links + 8 "Added to PlayBloo" updates（生产库，2026-11-01 01:19 CST，updated_at=实际入库时刻）
- 素材：封面 + 37 张截图全部镜像至 Supabase Storage `covers/2026-11-01/`、`screenshots/2026-11-01/`（kill-the-hero 4 张动图、nasubi 1 张动图转动画 WebP），ERRORS 0
- 跳过（留在雷达，不标记 used）：
  - The Demon King and the Hero（redwolf-fenrir）——页面描述仅为 "vore！！！"（恋物癖向内容），不适合全年龄段门户
  - A Viagem de Flávio（anonuser2026）——页面无任何图片素材（无 og:image、无封面、无截图），无法生成卡片缩略图
- 页面 URL（GSC 逐个「网址检查 → 请求编入索引」，手工配额约 10-12 条/天，正好覆盖本批）：
  - https://playbloo.net/game/twigs-trick-or-treat
  - https://playbloo.net/game/underwood
  - https://playbloo.net/game/tui-ba-gang
  - https://playbloo.net/game/kill-the-hero
  - https://playbloo.net/game/obsession
  - https://playbloo.net/game/the-community-notes-are-wrong
  - https://playbloo.net/game/game-about-botting-in-an-mmorpg
  - https://playbloo.net/game/nasubi
- 验证：
  - 线上 3 页（nasubi / tui-ba-gang / twigs-trick-or-treat）实测 `<title>`、meta description、Storage 封面、itch 外链渲染正常
  - 8 款渲染后完整标题（meta_title + " | PlayBloo"）全部 ≤60 字符：game-about-botting-in-an-mmorpg 首次超限（63），已修正为 "Game About Botting in an MMORPG - Free Idle RPG"（58），页面随 ISR 5 分钟内刷新
  - sitemap：lastmod 取 games.updated_at，8 款新游戏 = 2026-11-01 01:19 CST 上线时刻；未触碰任何老游戏时间戳（本轮零更新旧行）
  - mark_used：marked=8，not_found=[]，与入库数一致
- 备注：
  - 本地代理再次变化：Clash Verge mihomo 7899 端口存活但上游节点失效（对 baidu 也 502）；本次全程改走 v2rayN 的 socks5（127.0.0.1:10808），脚本统一 `--proxy socks5h://127.0.0.1:10808`。系统 Python 无 PySocks 且 PEP 668 受限，改用独立 venv（/tmp/itch-import/venv）安装 pysocks，urllib 原生支持 socks5h。
  - 雷达批次状态为 new（详情补全仍被 itch 拒），fetch 用 `--status new` 拉取；雷达"今日已收录满 10 款"的配额口径正常（东八区 00:02 收录）。手动触发 POST /itch/run 正常（注意 curl 不能带 -L，会把 POST 带进重定向目标报 405）。
