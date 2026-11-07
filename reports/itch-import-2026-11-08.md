# itch 新游戏批量入库 · 2026-11-08

雷达批次：`fetch_batch.py --date 2026-11-08`，status=new 共 10 款。全部免费、无 NSFW 标记，**10 款全部入库**，无剔除。入库后站点游戏总数 1233。

## 本批入库（10 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| Orbit Weave | `orbit-weave` | action, arcade | Godot | early-access | 一键反转月球轨道的街机生存：Graze 擦弹攒 Frenzy 倍率、Stardust 解锁 8 段行星演化、Blue Star Year boss 相；itch In development → early-access |
| A Rock of My Own (Demo) | `a-rock-of-my-own` | idle, casual | Godot | demo | 撸山 16-bit 挂机：直播撸 Mount Barnaby、顺纹抚摸攒 Calm 倍率、Doreen 商店+招募帮撸，demo 覆盖前 30 分钟，完整版将上 Steam |
| ECHOLOC | `echoloc` | action, horror | — | released | 全盲设定：弹舌回声定位即视野，怪物全靠听觉狩猎、尖叫引同伴；空间音频建议耳机电脑玩；作者 Luis Quesada Torres |
| CORE DRILL | `core-drill` | idle, simulation | — | released | 钻向地心 6,371km：12 真实地层+真实纪录（哈利法塔/珠峰/科拉超深钻孔 12,262m）、热量冷却管理、Turbo ×3、Core Crystals 转生 |
| I'M AWAKE! | `iam-awake` | puzzle, casual | — | released | 单键时机游戏：眼睑全闭+脖颈过 30° 同时满足才是真睡，50 夜递进、日英双语；日语文案页面自带 |
| Symptoms of Devotion [BETA TEST] | `symptoms-of-devotion` | casual, horror | — | early-access | 心理恐怖+恋爱 VN：没人痊愈的医院与不肯放手的 Medkit 医生；独立 AU 二创、与 PHIGHTING! 无关；BETA 内容会变 → early-access |
| Gospel Drift Demo | `gospel-drift-demo` | racing, arcade | GameMaker | demo | 奶奶漂移碾魔收魂：敌车抢魂、卖魂升级改装；像素风"街机赛车战斗"，Steam 版开发中，页面事实卡自述 demo |
| Tower-Defense | `tower-defense` | strategy | Godot | early-access | 2017 老项目 2026-11 用 Godot 4.7 重制：7 塔型（防空/冰/火油）、每塔可选目标优先级、轰炸机反拆塔、3 难度 6 图；itch In development → early-access |
| Dominion of Darkness | `dominion` | rpg, strategy | Twine | released | 索伦式黑暗魔君文字战略：军队/间谍网/邪教/腐化自由子民，单局约 1 小时强重开；2022 年老游戏被雷达新发现 |
| Martin: No Filter Fighters (Unofficial Fan Game). | `martin-no-filter-fighters-unofficial-fan-game` | fighting, action | — | early-access | 90s 情景喜剧 Martin 同人像素格斗：新角色 Hustle Man、Ol' Otis 与 Bank of Detroit 舞台；非官方粉丝作品如实标注；itch In development → early-access |

分类合计 19 条：action 3 / casual 3 / idle 2 / arcade 2 / horror 2 / simulation 1 / puzzle 1 / racing 1 / strategy 2 / rpg 1 / fighting 1（按关联计）。

## 过程记录

- **429 单页冷却**：首轮 8/10 成功；Gospel Drift、Tower-Defense 连续 429。单发验证发现是**按页面**的冷却（同页 curl 200、脚本 429），拆成单文件 `--workers 1` 分三次补抓（Tower-Defense 成功后又在补抓轮 429，用首轮成功结果），最终 10/10 抓齐，三份输出按 URL 去重（ok=True 优先）合并回 enriched.json。
- 本批**无动图素材**：10 款封面+33 张截图全部静态图走 sharp 转 WebP（封面 640px、截图 1280px）。
- meta 三件套：10 款 meta_title 渲染后（+` | PlayBloo` 11 字符）44-52 全部 ≤60；meta_description 初稿 4 条超 155（orbit-weave/core-drill/gospel-drift/dominion），当场收窄后 135-154 全部达标。
- 开发状态映射：itch In development → early-access（orbit-weave、tower-defense、symptoms-of-devotion、martin）；页面标题/事实卡明示 Demo → demo（a-rock-of-my-own、gospel-drift-demo）；其余 released。
- 雷达回填：`mark_used.py` marked=10、not_found=[]，与入库数一致。

## 验证

- 线上抽检 `/game/echoloc`、`/game/orbit-weave`、`/game/tower-defense`：`<title>` 为「meta_title + | PlayBloo」≤60 字符，meta description 渲染内容与库内一致，页面 200。
- DB 核验：10 行 slug/19 分类/10 条 "Added to PlayBloo" Updates 全部落库；thumbnail_url 全部指向 `game-media/covers/2026-11-08/`；echoloc screenshots 4 张指向 `game-media/screenshots/2026-11-08/`。
- sitemap（数据侧核验，按约定不等待线上 ISR 刷新）：本批新增游戏由 `src/app/sitemap.ts` 动态收录，lastModified 取 `updated_at`＝实际首次上线时刻 2026-11-07T17:11:28Z（北京时间 11-08 01:11）；抽查上批 kritsana/decube 的 updated_at 仍为 2026-11-07T03:30:06Z，老游戏未被动过。
- GSC：本批 10 条详情页 URL 清单见下，提醒逐个「网址检查 → 请求编入索引」。

## GSC 提交清单

- https://playbloo.net/game/orbit-weave
- https://playbloo.net/game/a-rock-of-my-own
- https://playbloo.net/game/echoloc
- https://playbloo.net/game/core-drill
- https://playbloo.net/game/iam-awake
- https://playbloo.net/game/symptoms-of-devotion
- https://playbloo.net/game/gospel-drift-demo
- https://playbloo.net/game/tower-defense
- https://playbloo.net/game/dominion
- https://playbloo.net/game/martin-no-filter-fighters-unofficial-fan-game
