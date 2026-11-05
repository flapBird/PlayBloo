# itch 新游戏批量入库 · 2026-11-06

雷达批次：`fetch_batch.py --date 2026-11-06`，status=new 共 10 款。入库 **9 款**，剔除 1 款（NSFW）。

## 本批入库（9 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| Yet Another Mining Incremental | `yet-another-mining-incremental` | simulation, idle | LÖVE | released | 自嘲式挖矿增量，页面信息薄按规范写薄；库内首个 LÖVE engine 记录 |
| Field Notes: Grandfather's Sanctuary · 들숲 도감 | `deulsup-dogam` | adventure, simulation | HTML5 | released | 韩语野生动物诱捕+庇护所经营，51 种动物+27 鱼，濒危物种信任机制；页面披露 AI 辅助代码/像素（设计手工），如实转述 |
| Moshi Moshi Nagant: Obrez (モシモシナガン) | `moshi-moshi-nagant` | shooting, simulation | Three.js | released | 单文件 WebXR 栓动步枪靶场，VR/PC 双模式、5 种靶道、S/A/B/C 段位；实测 Quest Browser |
| Hold the Tide | `hold-the-tide` | simulation, survival | HTML5 | demo | 海堤求生原型：运石筑墙对抗涨潮，最后一级浪定生死；itch Prototype 状态映射 demo（沿用 2026-11-05 批次先例） |
| Multi Purpose Wheel Incremental | `multi-purpose-wheel-incremental` | idle, simulation | Unity | early-access | 旋转主题增量：手摇曲柄起家、6 模块 5 货币 65 升级；itch In development → early-access |
| Palabraz | `palabraz` | educational, puzzle | HTML5 | released | 西班牙语正字法打字游戏（CSZ→BV/GJ/LLY 关卡）；注明西语呈现 |
| Ninja | `ninja` | action | HTML5 | released | 像素潜入，题材为真实忍者史（1578 天正伊贺之乱→1853 黑船）；页面信息薄写薄 |
| Muertitos | `muertitos` | puzzle, casual | HTML5 | released | 亡灵节 4x4 推入式消除，calaveritas 美术；2014 手游复活版 |
| And You'll Miss It | `and-youll-miss-it` | casual | Three.js | released | 3D 互动 zine，开发者个人叙事（博客文章改编）；GIF 封面+截图转动画 WebP，动效保留 |

分类合计 16 条：simulation 4 / idle 2 / adventure 1 / shooting 1 / survival 1 / educational 1 / puzzle 2 / action 1 / casual 1（按关联计）。

## 剔除（1 款）

| 游戏 | 原因 |
|---|---|
| Bloody Flower of Teyvat [Genshin Impact Fangame] (xogua.itch.io) | NSFW：页面写明 Hard Mode 含「详细描写亲密接触（NSFW）+ 血腥暴力」「18+ content」；按站点惯例剔除。留 radar new 状态，不会被重复拉到（mark_used 未标记则下次仍会出现，重复导入有查重兜底，但该游戏永远不入库——下次遇到直接再剔） |

## 过程记录

- 抓取首轮 8/10 成功；`deulsup-dogam`、`palabraz` 触发 429 限速，冷却 90 秒后 `--workers 1` 单发补抓成功，全部 10 款均完成详情抓取。
- 合并 enriched.json 时踩到格式坑：手工 merge 后写成 `{"games":[...]}` 包装，而 import_games.py 期望纯数组，报 `'str' object has no attribute 'get'`；重写为纯 list 后通过。
- meta 三件套：9 款 meta_title 渲染后（+` | PlayBloo` 11 字符）46-59 全部 ≤60，meta_description ≤160；线上实测 deulsup-dogam 59/158、moshi-moshi-nagant 54/146、and-youll-miss-it 58/150。
- 镜像：9 款封面 + 31 张截图入 Supabase Storage（`covers/2026-11-06/`、`screenshots/2026-11-06/`），0 错误。`and-youll-miss-it` GIF 封面与 1 张截图转动画 WebP，动效保留。
- `hold-the-tide` 入库时先写 early-access，核对 2026-11-05 批次报告「Prototype 阶段映射 demo」先例后 PATCH 为 demo（本批新游戏，不涉及老游戏时间戳问题）。

## 验证

- 线上页抽查 3 款（deulsup-dogam / moshi-moshi-nagant / and-youll-miss-it）：HTTP 200，title/meta description 渲染正确，图片指向自家存储（game-media/covers|screenshots/2026-11-06/），itch 外链按钮正常。
- sitemap 数据侧：本批 9 款 updated_at=2026-11-05T16:31Z（= 2026-11-06 00:31 UTC+8 实际入库时刻）；老游戏抽样（box-out / noillirk / odio-el-chocolate / last-lift）updated_at 与线上 sitemap lastmod 一致、未被本批改写；1h 缓存过期后自动收录，不做等待确认。
- GSC 提交清单（请逐个「网址检查 → 请求编入索引」，9 条正好在每日配额内）：
  - https://playbloo.net/game/yet-another-mining-incremental
  - https://playbloo.net/game/deulsup-dogam
  - https://playbloo.net/game/moshi-moshi-nagant
  - https://playbloo.net/game/hold-the-tide
  - https://playbloo.net/game/multi-purpose-wheel-incremental
  - https://playbloo.net/game/palabraz
  - https://playbloo.net/game/ninja
  - https://playbloo.net/game/muertitos
  - https://playbloo.net/game/and-youll-miss-it

## 雷达回填

`mark_used.py --urls-file /tmp/itch-import/imported-urls.txt --date 2026-11-06`（结果见汇报；NSFW 剔除的 1 款不标记，留 new）。
