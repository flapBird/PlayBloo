# itch 新游戏批量入库 · 2026-11-05

雷达批次：`fetch_batch.py --date 2026-11-05`，status=new 共 10 款。入库 **9 款**，跳过 1 款（源站不可达）。

## 本批入库（9 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| Find the Clover | `find-the-clover` | idle, casual | Unity | demo | 百万草坪收割放置，160+ 升级 + 5 种矮妖；Prototype 阶段映射 demo，4.6 分 |
| Metropolis: Ink Ridge | `metropolis-ink-ridge` | simulation, strategy | HTML5 | early-access | 手绘墨水风城市建造，页面信息薄按规范写薄 |
| Tiny Ecosystem | `tiny-ecosystem` | idle, simulation | Godot | released | 罐中生态食物链放置，5 栖息地 24 真实生物；信息最全 |
| Idle Datacenter | `idle-datacenter` | idle, simulation | HTML5 | early-access | 树莓派到云数据中心放置，信息薄写薄 |
| コンちゃんの九本しっぽ | `kon9` | action, arcade | HTML5 | released | 日语动作：狐火收集打妖怪头目；注明日语呈现 |
| One Star Planet | `one-star-planet` | idle, casual | HTML5 | early-access | 星球收租放置 + 房客怨气抉择；页面自带 AI 辅助开发披露，如实转述 |
| Don't: Obey | `dont-obey` | horror, puzzle | Godot | released | 规则书形式心理恐怖（20 条指令）；内容警告保留，4.8 分，双 jam 入选 |
| Petri | `petri` | idle, simulation | HTML5 | early-access | 微生物学家做的基因工程放置，15 生物 CRISPR 编辑，50-80h |
| Box Out! | `box-out` | puzzle, platformer, multiplayer | Unity | early-access | 像素科幻双人合作解谜平台；2022 老游戏本批新发现，4.6 分 |

分类合计 19 条：idle 4 / simulation 4 / casual 2 / action 1 / arcade 1 / strategy 1 / horror 1 / puzzle 2 / platformer 1 / multiplayer 1（按关联计）。

## 跳过（1 款）

| 游戏 | 原因 |
|---|---|
| Core Drain PlayTest v1.2 (semihe29.itch.io) | 源站不可达：代理/直连均 SSL EOF，Internet Archive 无任何快照；本身为 PlayTest 测试版。留在雷达 new 状态，下次拉到可再试 |

## 过程记录

- 抓取 6/10 首轮成功；`idle-datacenter`、`dont-obey` 触发 429 限速，冷却 2 分钟后 `--workers 2` 补抓成功；`core-drain-test`、`box-out` 持续 SSL EOF。
- **Box Out! 走 Internet Archive 快照兜底**（pitfalls 第 2 节流程）：`zegley.itch.io` 整域 SSL 失败且直连不通，取 CDX 最新快照 20260422211301 补齐正文/侧栏/4 张截图/评分（4.6 分 31 评）等全部详情，status_label 标注快照来源。
- 镜像：9 款封面 + 37 张截图入 Supabase Storage（`covers/2026-11-05/`、`screenshots/2026-11-05/`）。`box-out` GIF 封面转动画 WebP（140 个 ANMF 帧，动效保留）；`dont-obey` 3 张截图为动图。
- `tiny-ecosystem` 2 张截图 itch CDN 502（347x500 与 794x1000 变体均 502，original 变体 200）——用 original 源补转，5 张截图全部镜像后 PATCH（脚本只在全部成功时才 PATCH，故单独补齐）。
- meta 三件套长度：按 2026-11-04 批次沉淀规则预留 11 字符站名后缀，9 款 meta_title 渲染后 45-58 字符全部 ≤60，meta_description ≤155；线上抽查实测一致（dont-obey 渲染 58、box-out 45、tiny-ecosystem 56）。

## 验证

- 线上页抽查 3 款（dont-obey / box-out / tiny-ecosystem）：HTTP 200，title/h1/meta description 渲染正确，图片指向自家存储（game-media），外链游玩按钮正常。
- sitemap 数据侧：本批 9 款 updated_at=2026-11-04T18:11Z（= 2026-11-05 02:11 UTC+8 实际入库时刻）；全库自本批开始以来有更新的恰为 9 款，无任何老游戏时间戳被波及；生成器（sitemap.ts）按 catalog（is_published=true）+ updated_at 输出，等 1h 缓存过期后自动收录，不做等待确认。
- GSC 提交清单（请逐个「网址检查 → 请求编入索引」，9 条正好在每日配额内）：
  - https://playbloo.net/game/find-the-clover
  - https://playbloo.net/game/metropolis-ink-ridge
  - https://playbloo.net/game/tiny-ecosystem
  - https://playbloo.net/game/idle-datacenter
  - https://playbloo.net/game/kon9
  - https://playbloo.net/game/one-star-planet
  - https://playbloo.net/game/dont-obey
  - https://playbloo.net/game/petri
  - https://playbloo.net/game/box-out
