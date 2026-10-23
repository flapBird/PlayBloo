# itch.io 批量导入记录 · 2026-10-23

本轮用户一次贴来两批雷达导出（2026-10-22 与 2026-10-23 各 10 款）。其中 **2026-10-22 批次已在 10-22 凌晨全部入库**（见 `itch-import-2026-10-22.md`，commit cdbedfe），本次跳过；**2026-10-23 批次 10 款全部新增并发布**，重复、跳过和写入失败均为 0。导出抓取时间 2026-10-23 11:08，来源 `https://itch.io/games/new-and-popular/free/platform-web.xml`。

生产库游戏总量由 1,065 条增至 **1,075 条**（已发布 1,058 → 1,068），分类关联由 2,230 条增至 **2,251 条**（+21）。游戏均通过外链前往官方 itch 页面游玩。

## 游戏清单

| 游戏 / PlayBloo 页面 | 分类 | 版本 | 引擎 | 发行日 |
|---|---|---|---|---|
| [Run the Earth: Idle Runner](https://playbloo.net/game/run-the-earth-idle-runner) | idle, simulation | early-access | Godot | 2026-10-20 |
| [Idle Mage: Conquest](https://playbloo.net/game/idle-mage-conquest) | idle, rpg | demo | raylib | 2026-10-21 |
| [Give Me Back My Goat!](https://playbloo.net/game/give-me-back-my-goat) | strategy, idle | released | HTML5 | 2026-10-22 |
| [Island Crusade - Demo](https://playbloo.net/game/island-crusade) | strategy, idle | demo | Godot | 2026-10-22 |
| [Duck Hunt Incremental](https://playbloo.net/game/duck-hunt-incremental) | shooting, idle | early-access | HTML5 | 2026-10-21 |
| [FOGBOUND](https://playbloo.net/game/fogbound) | simulation, survival, horror | released | HTML5 | 2026-10-22 |
| [Grow a Rock](https://playbloo.net/game/grow-a-rock) | idle, casual | demo | HTML5 | 2026-10-21 |
| [Automated Love Obsession](https://playbloo.net/game/automated-love-obsession) | casual, horror | demo | Ren'Py | 2026-10-21 |
| [Trash Inc.](https://playbloo.net/game/trash-inc) | simulation, idle | demo | HTML5 | 2026-10-21 |
| [Increlight](https://playbloo.net/game/increlight) | idle, strategy | demo | Unity | 2026-10-21 |

## 抓取与来源

- 导出 10 条全部带 403 抓取备注（雷达服务器被 itch 拒）；本机带浏览器 UA 走代理 **10/10** 抓到官方页面，解析出 og:image、正文、侧栏、截图。
- **发行日统一取 itch 页面侧栏 Published 的绝对时间（UTC）**：本批所有页面侧栏 Published 都渲染为相对时间（"1 day ago" 等），已逐款从该行的 `<abbr title="… UTC">` 取回绝对时间戳。其中 Idle Mage: Conquest（RSS 旧日期 2025-11-11）与 Automated Love Obsession（RSS 2026-09-30）为开发者重发布页面，页面 Published（2026-10-21）比 RSS 更真实，按上一批先例以页面为准。
- **标题清理**：雷达导出的「[UPD] Duck Hunt Incremental」中 `[UPD]` 是雷达的更新标记而非游戏名（页面 h1 被 feed 污染），入库前已去掉，标题为 Duck Hunt Incremental。

## 内容与素材

- 逐款编写英文介绍、玩法、操作、技巧与特性，素材只取官方页面正文与侧栏信息（含 Languages / Inputs / AI Disclosure / Tags）。Duck Hunt Incremental、Trash Inc. 官方未给操作说明，只写明去原页面看；其余按官方原文列出。
- **版本标注按官方自述**：Give Me Back My Goat!、FOGBOUND 官方 Released；Grow a Rock（自称 free browser trial，$2.99 完整版另购）、Idle Mage: Conquest（"This is the demo"）、Island Crusade（标题 Demo）、Automated Love Obsession（Prototype、FAQ 称 demo phase）、Trash Inc.（"PLAY DEMO NOW"）、Increlight（自称 20–30 分钟 prototype）标 demo；Run the Earth 与 Duck Hunt Incremental 官方 In development，标 early-access。
- **敏感/成人提示如实披露**：Automated Love Obsession 保留官方 13+ content warnings（obsessive behaviour、stalking、jumpscares、flashing 等）；FOGBOUND 保留 Lovecraftian 恐怖与夜间猎杀机制描述。
- **AI 披露按页面原文转述**：Run the Earth（Code/Graphics/Text）、Idle Mage（Code）、Give Me Back My Goat!（Code/Graphics/Sounds/Text）、Island Crusade（Code/Text，页面正文注明美术与音乐均为署名的人工素材包、AI 仅用于文本翻译）、Duck Hunt Incremental（Code/Graphics/Sounds，工作室自称"与 AI 一起做游戏"）、FOGBOUND（AI Assisted）、Grow a Rock（Graphics）在官方页面有 AI 披露；Automated Love Obsession、Trash Inc.、Increlight 官方标注 No generative AI was used，同样如实保留。
- **语言与地区**：Duck Hunt Incremental 为俄语游戏（页面自带英文简介），已注明俄/英双语呈现；Grow a Rock 注明英/韩双语；FOGBOUND 注明英/日双语。
- 58 个素材对象（10 张封面 + 48 张截图）全部转 WebP 镜像至 Supabase Storage `game-media`（`covers/2026-10-23/`、`screenshots/2026-10-23/`），0 错误；本批无 GIF 动图。抽查公开 URL 返回 200、`image/webp`、`cache-control: public, max-age=604800`。

## 验证

- 抽查 `/game/fogbound`、`/game/give-me-back-my-goat`、`/game/trash-inc` 线上页面：标题、og:image（自家存储封面）、简介、itch 外链按钮渲染均正常（首个 401/超时为跨境线路瞬断，重试即 200）。
- 10 款的 thumbnail_url 与 screenshots 已全部指向 `game-media/2026-10-23` 路径，逐款校验通过。
- sitemap：`/sitemap.xml` 已收录全部 10 个新游戏 URL，`<lastmod>` 为 2026-10-23（= PlayBloo 实际上线日期，insert 时间即 updated_at）；本轮未触碰任何老游戏行，老游戏 lastmod 不受影响。
- 每款游戏写入一条 "Added to PlayBloo" Updates 记录（共 10 条）。
