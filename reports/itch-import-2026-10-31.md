# itch 批次导入 2026-10-31

雷达当日批次（status=new，10 款全部免费、quality_ok）→ 全部入库，0 跳过。

| # | 游戏 | slug | 分类 | 引擎 | 画面 | 状态 |
|---|------|------|------|------|------|------|
| 1 | Slimeglass | slimeglass | idle, simulation | Godot | 2D | early-access |
| 2 | Incredig | incredig | idle, simulation | Unity | 2D | early-access |
| 3 | 賄賂でビンゴ！ | wairo-de-bingo | card, strategy | HTML5 | 2D | released |
| 4 | Nine Heavens: Path to Immortality | nine-heavens | rpg, adventure | HTML5 | 文本 | early-access |
| 5 | Aria Sandbox | aria-sandbox | arcade, casual | HTML5 | — | released |
| 6 | Maiu Online | maiu-online | rpg, adventure | Bevy | 3D | early-access |
| 7 | SPLASHLAND IS CLOSED! | splashland-is-closed | survival, horror | HTML5 | 3D | demo |
| 8 | BENs_Playground | bens-playground | adventure, horror | RPG Maker MV | 2D | released |
| 9 | 打破三觀只留五官 | wuguan | casual, trivia | HTML5 | 2D | released |
| 10 | Interact With Me! | interact-with-me | casual, simulation | Ren'Py | 2D | early-access |

- 入库：10 games + 20 category links + 10 "Added to PlayBloo" updates（生产库，2026-10-31 01:43 CST）
- 素材：封面 + 截图全部镜像至 Supabase Storage `covers/2026-10-31/`、`screenshots/2026-10-31/`（interact-with-me 含 3 张动图转动画 WebP），ERRORS 0
- 页面 URL（GSC 逐个「网址检查 → 请求编入索引」）：
  - https://playbloo.net/game/slimeglass
  - https://playbloo.net/game/incredig
  - https://playbloo.net/game/wairo-de-bingo
  - https://playbloo.net/game/nine-heavens
  - https://playbloo.net/game/aria-sandbox
  - https://playbloo.net/game/maiu-online
  - https://playbloo.net/game/splashland-is-closed
  - https://playbloo.net/game/bens-playground
  - https://playbloo.net/game/wuguan
  - https://playbloo.net/game/interact-with-me
- 备注：
  - 本机 ClashX 订阅（tr202613）全部节点失效、Clash Verge 订阅（repanther）鉴权失效；本次抓 itch 页面改走 v2rayN 里的自建 edgetunnel（leeswalvpn.ccwu.cc CF Worker，VLESS+WS+TLS，mihomo 本地 7899 端口 + 每请求重试包装器）。上游 TLS 握手间歇被掐，脚本侧重试 14 次后 10/10 成功。
  - 雷达今天批次状态为 new（非 ready），fetch 用 `--status new` 拉取；mark_used 按 URL 标记不受影响。
  - Aria Sandbox 页面无任何描述/标签，文案按规范写薄并如实说明。
