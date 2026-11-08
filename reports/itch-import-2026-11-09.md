# itch 新游戏批量入库 · 2026-11-09

雷达批次：`fetch_batch.py --date 2026-11-09`，status=new 共 10 款。全部免费，**9 款入库、1 款内容政策剔除**。入库后站点游戏总数 1242。

## 本批入库（9 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| Floor Scrubber Empire: Giant Bathroom Cleaning Simulator | `floor-scrubber-empire` | simulation, casual | Godot | early-access | 巨人浴室驾驶式洗地机：160×220m 持久污垢、标记工位 95% 验收计酬、workshop 物理改装、雇佣至多 4 台机器人洗地机；GIF 封面转动画 WebP |
| Professional Pamperer | `professional-pamperer` | casual, simulation | HTML5 | early-access | 「有偿哄小姐」单梗 sim：pamper 永远与食物有关、食材自带、满意才结账；信息薄按薄写 |
| Captwist | `captwist` | idle, casual | Godot | released | 拧瓶盖翻面赌运气 clicker：coin or poop、Skills 加速+改概率、银瓶→机械臂自动化、攒钱买王冠成 King of Caps |
| Hold the Bridge (Demo) | `hold-the-bridge-demo` | action, strategy | three.js | demo | 3D 三车道桥面防守：士兵自动开火、站位即策略；左补给桶（红桶有代价）/中尸潮（蓝门射大加兵）/右巨人（1 of 3 大奖励）；3 关 boss、6 关终 boss；首载 ~88MB 有 Low 画质 |
| Jappy Company 2.0 | `jappy-company` | rpg, simulation | HTML5 | early-access | 韩语现代都市在线 RPG：生活/投资/钓鱼/致富；页面仅一句 pitch，按薄写并注明韩语 UI；页面自称在线 RPG → online multiplayer |
| DATATHEFT | `datatheft` | survival, horror | GameMaker | released | FNTD（Roblox Five Night Tower Defence）AU 同人恐怖生存：地堡内解谜+监控外部威胁+逃出；如实标注 fan-made |
| Hốc Du Ký | `hocduky` | rpg, adventure | RPG Maker | released | 越南语洞穴冒险：1 True End + 10 Bad Ends + 集齐隐藏道具解锁 bonus room；Hốc Con 社群 Hốctober III 礼物项目 |
| Path of the idle cultivator | `idle-cultivation-path` | idle, rpg | HTML5 | early-access | 武侠挂机增量：50 境界 7 大阶、天劫 50 回合必死→转世携带魂力/传承、剑/掌/魔/御兽/天选多路线、宗门阵营+弟子+炼魂武器+血脉+战争、终局弑天劫混沌神；另有 Steam 版 |
| How to date a Sleep Paralysis Demon- Part 2(Demo) | `how-to-date-a-sleep-paralysis-demon` | casual, horror | Ren'Py | demo | 恐怖恋爱 VN：废柴 Dust 与睡眠瘫痪恶魔；Part 1 web 版 7 结局、Part 2 仅下载版（web 版仍是 Part 1，文案明确标注）、3 结局；页面自带 content warning（轻度暗示/血/多眼/闪图）已保留 |

分类合计 18 条：casual 3 / rpg 2 / simulation 2 / idle 2 / horror 2 / action 1 / strategy 1 / adventure 1 / survival 1（按关联计）。

## 剔除（1 款）

| 游戏 | URL | 原因 |
|---|---|---|
| dress up fangame | https://gatotin024.itch.io/shovikmiheart | 页面正文明确标注 `tw: shotacon`（性化未成年内容），不符合站点收录底线，不入库、不写文案。**未标记雷达已用**（按流程留在 new）；建议到 SEO 控制台手动标 used/屏蔽，避免每天重现。 |

## 过程记录

- 本批唯一动图素材：floor-scrubber-empire 的 GIF 封面走 ffmpeg+libwebp 转动画 WebP（560×444、34 帧、403KB），libwebp 按帧复核页数>1 通过；其余 8 款封面+27 张截图全静态图。镜像 0 错误。
- 开发状态映射：itch In development → early-access（floor-scrubber-empire、professional-pamperer、jappy-company、idle-cultivation-path）；页面标题/正文明示 Demo → demo（hold-the-bridge-demo、how-to-date-a-sleep-paralysis-demon）；其余 released（captwist、datatheft、hocduky）。
- meta 三件套：9 款 meta_title 渲染后（+` | PlayBloo` 11 字符）41-53 全部 ≤60；meta_description 131-148 全部 ≤155，无返工。
- how-to-date-a-sleep-paralysis-demon 的标题里「Part 2(Demo)」与 web 实际内容（Part 1）不一致，已在 description/how_to_play/features 三处明确「web 版目前只到 Part 1、Part 2 需 itch 下载」，避免用户误判。
- 雷达回填：`mark_used.py` marked=9、not_found=[]，与入库数一致。

## 验证

- 线上抽检 9/9 个 `/game/<slug>` 全部 200（professional-pamperer 与 how-to-date-a-sleep-paralysis-demon 首次请求 000 为本机到 CF 线路波动，重试即 200）；`<title>` 为「meta_title + | PlayBloo」且 ≤60 字符，meta description 渲染内容与库内一致，图片引用指向 game-media，外链按钮（External）渲染正常。
- DB 核验：9 行游戏 / 18 条分类 / 9 条 "Added to PlayBloo" Updates 全部落库；added_at=updated_at=2026-11-08T16:55:49Z（北京时间 11-09 00:55，即实际首次上线时刻）；thumbnail_url 全部指向 `game-media/covers/2026-11-09/`。
- sitemap（数据侧核验，按约定不等待线上 ISR 刷新）：本批新增游戏由 `src/app/sitemap.ts` 动态收录，lastModified 取 updated_at＝实际上线时刻 2026-11-08T16:55Z；抽查上批 echoloc/orbit-weave/tower-defense 的 updated_at 仍为 2026-11-07T17:11:28Z、gum-collector/recall 仍为 2026-11-07T03:30:06Z，老游戏未被改写；剔除款未入库、无衍生页面需清理。
- GSC：本批 9 条详情页 URL 清单见下，提醒逐个「网址检查 → 请求编入索引」。

## GSC 提交清单

- https://playbloo.net/game/floor-scrubber-empire
- https://playbloo.net/game/professional-pamperer
- https://playbloo.net/game/captwist
- https://playbloo.net/game/hold-the-bridge-demo
- https://playbloo.net/game/jappy-company
- https://playbloo.net/game/datatheft
- https://playbloo.net/game/hocduky
- https://playbloo.net/game/idle-cultivation-path
- https://playbloo.net/game/how-to-date-a-sleep-paralysis-demon
