# itch 新游戏批量入库 · 2026-11-07

雷达批次：`fetch_batch.py --date 2026-11-07`，status=new 共 10 款。全部免费、无 NSFW 标记，**10 款全部入库**，无剔除。

## 本批入库（10 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| Recall | `recall` | idle, simulation | — | early-access | 扮演小内存 AI：Think 产 token、三类记忆自增殖、合并/rotate 保留 insight 加速重开；手机浏览器向，itch In development → early-access |
| Wrapper Hunter: Gum Car Collector | `gum-collector` | simulation, card | Unity | demo | 开泡泡糖包装集 50 辆手绘车卡填爷爷相册，Slap 小游戏；Chapter 1 demo 约 1 小时；GIF 封面+4 张动画截图转动画 WebP |
| Mold inc. | `the-mold` | simulation, idle | — | released | 从冰箱霉菌蔓延全星球，ecological strain 过度扩张坍塌；有结局；itch 标 Strategy 但页面自述为点击+挂机，按机制入 idle |
| DeCube | `decube` | simulation, idle | Unity | early-access | 挖穿行星找核心，雇工+装备升级，6 世界 campaign+自定义世界生成器；页面自述 early playtest → early-access |
| SORT.SYS | `sortsys` | idle, puzzle | — | released | CRT 终端增量：升级全是真实算法（冒泡/快排/A*/二分…），5 个程序+30 层 roguelike The Descent+收件箱叙事 |
| Red Banner 1993 | `red-banner-1993` | card, strategy | — | released | 信息极薄：无 og:image/描述/正文/截图（复核原页确认页面即空白），按规范写薄并引导去原页 |
| Stone Idle | `stone-idle` | idle, casual | Construct | released | 点石头增量：升级采石设备、后期稀有资源；2021 年 12 月老游戏被雷达新发现 |
| TESTIMONIUM | `testimonium` | horror, action | Godot | released | 7-15 分钟模拟恐怖：门外来路不明的 VHS 磁带，铁处女+血腥仪式+罪之房间循环；页面自述 web 版性能较差已如实转述 |
| Kritsana | `kritsana` | horror, puzzle | Godot | demo | 1997 泰国 CCTV 异常观察：A/D 切换摄像头、按住左键报告，3 误报/4 异常即败；免费 demo 10-15 分钟，完整版已上 Steam；3 张动画截图 |
| Dating Killmulator | `datingkillmulator` | casual | Construct | released | 获奖浪漫喜剧约会模拟：凶杀+梗+离婚协议，8-9 小时免费内容+2 小时付费 DLC，多路线；三人团队（页面自述 award-winning，按引用处理） |

分类合计 19 条：idle 4 / simulation 4 / card 2 / casual 2 / horror 2 / puzzle 2 / action 1 / strategy 1（按关联计）。

## 过程记录

- **429 限速贯穿全程**：首轮 2/10 成功，之后 `--workers 2` + 冷却 3-7 分钟又分两轮补抓。踩到 parse_and_fetch.py 每次运行**覆盖**输出文件的坑：第三轮补抓时把前两轮已成功的 Recall、Wrapper Hunter 结果冲掉，发现后改为「只把未成功的写入 games-remaining.json 单独抓 + 三份输出合并回 enriched.json」，全部 10 款抓齐。
- `red-banner-1993` 页面几乎空白（无 og 标签、无 formatted_description、26KB 纯框架），单发复核确认非限速误报，按「信息薄就写薄」处理，features 仅 4 条。
- meta 三件套：10 款 meta_title 渲染后（+` | PlayBloo` 11 字符）42-54 全部 ≤60，meta_description 115-131 全部 ≤155。
- 镜像：9 款封面 + 43 张截图入 Supabase Storage（`covers/2026-11-07/`、`screenshots/2026-11-07/`）；`red-banner-1993` 原页无封面，thumbnail_url 留空串。动画 WebP：gum-collector 封面 + 4 张截图、kritsana 3 张截图，动效保留。
- 开发状态映射：itch In development 且页面自述 playtest/未完成 → early-access（recall、decube）；页面明示 demo → demo（gum-collector、kritsana）；其余 released。

## 验证

- 线上页抽查 3 款（recall / gum-collector / red-banner-1993）：HTTP 200，title/meta description 渲染正确，图片指向自家存储（game-media/covers|screenshots/2026-11-07/），itch 外链（External）按钮正常。
- 镜像封面直连抽检：recall.webp 200 image/webp 9706B、gum-collector.webp 200 image/webp 393792B（动画版）。
- sitemap 数据侧：本批 10 款 created_at/updated_at=2026-11-07T03:30Z（= 11:30 UTC+8 实际入库时刻）；老游戏抽样（box-out / odio-el-chocolate / last-flag-standing / and-youll-miss-it）updated_at 与入库前一致、未被本批改写；1h 缓存过期后自动收录，不做等待确认。
- GSC 提交清单（请逐个「网址检查 → 请求编入索引」，10 条正好在每日配额内）：
  - https://playbloo.net/game/recall
  - https://playbloo.net/game/gum-collector
  - https://playbloo.net/game/the-mold
  - https://playbloo.net/game/decube
  - https://playbloo.net/game/sortsys
  - https://playbloo.net/game/red-banner-1993
  - https://playbloo.net/game/stone-idle
  - https://playbloo.net/game/testimonium
  - https://playbloo.net/game/kritsana
  - https://playbloo.net/game/datingkillmulator

## 雷达回填

`mark_used.py --urls-file /tmp/itch-import/imported-urls.txt --date 2026-11-07`：marked=10，not_found=[]，与入库数完全一致。
