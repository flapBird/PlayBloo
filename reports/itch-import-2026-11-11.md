# itch 新游戏批量入库 · 2026-11-11

雷达批次：`fetch_batch.py --date 2026-11-11`，status=new 共 10 款。全部免费，**10 款全部入库，无剔除**。入库后站点游戏总数 1255。

## 本批入库（10 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| Lumberjack Empire | `lumberjack-empire` | simulation, idle | Godot | released | 等距 HD 像素木材大亨：6 树种、水力锯木厂→精炼→家具、8 建筑×5 级、5 森林（黄金林/冻谷/巨人林/神秘林）、28 目标+传奇斧结局（约 5h）、离线 8h、8 语言含简体中文；3 张 GIF 截图转动画 WebP |
| Free Shipyard | `free-shipyard` | simulation, idle | pygame | released | 像素港口增量：首台绞盘 16 废料、手工吊机浪尖双倍、废料→合金→零件、513 蓝图链式自动化、12 海区各自玩法+灯塔航线、离线 2h、31 语言 |
| Kingdom Estate Clicker | `kingdom-estate-clicker` | clicker, idle | Godot | released | 地图点击王国：20 庄园（本土 10+边境 10）、管家可见走动自动化、传冠换荣耀→35 技能王室编年史、结局全管家约 20h、日英 UI；2 张 GIF 截图转动画 WebP |
| Infinigon | `infinigon` | idle, casual | HTML5 | released | 极简几何增量：多边形核心逐顶点生长、The Codes 修饰卡格、Sacrifice 分支抉择；**itch 页面零文字描述**，文案按截图薄写并注明 |
| Spinsmash | `spinsmash` | idle, casual | Godot | early-access | 陀螺物理增量：点击旋转+右键阵风撞栏杆每击得钱、10 种陀螺（瓷/黄铜/磁铁/炸药…）4 助手、5 张巡演桌各规则、技能树、约 3h；页面自称 prototype（完整起止）→ early-access |
| Cash & Sins | `cash-sins` | simulation, idle | HTML5 | early-access | 灵魂抵押打工：硬币真物理滚动堆积、分拣/点钞/掷诅咒钞票/对封印/老虎机/开保险柜、建机器逐线自动化、声望解锁升级分支 |
| SPIRO IDLE | `spiro-idle` | idle, casual | Godot | early-access | 治愈系螺旋图 idle：画线赚 INK、升级提速叠层解锁复杂图案、73 图鉴完成后飘入背景、日英 UI、原创合成配乐 |
| The Midnight Troupe | `the-midnight-troupe` | casual, horror | HTML5 | early-access | 互动恐怖/恋爱小说：马戏团等了你 140 年、主角性别/性格自定义、5 位可攻略（皆危险）、与 Charlie 的友情线、仅双结局皆有代价；**开发者 content warning（18+ 可选成人内容等）全文保留** |
| Deblock | `deblock` | idle, casual | Unity | demo | 3D 体素破坏增量 demo：升级树、水晶商店转生永久升级、护符组合、新工具换破坏方式；完整版将上 Steam，已在文案标注 demo 性质 |
| Earth ReGen | `earth-regen` | simulation, idle | HTML5 | demo | 蓝图连线工厂增量 demo：数据包沿线可视、垃圾场变健康土地、天气改数值（雨倍树减挖掘/风暴灭火）、demo 32 机器 41 目标至 Grid Foundry 结束、完整版 83 机器上 Steam；开发者已披露 AI 辅助代码/文本（美术全代码绘制），如实转述 |

分类合计 20 条：idle 9 / casual 6 / simulation 4 / clicker 1 / horror 1（按关联计）。

## 过程记录

- Infinigon 页面无 og:description、无正文、无 Genre/引擎——唯一信息源是标题与截图。下载 3 张截图核实（The Core 顶点升级 / The Codes 卡片格 / Sacrifice 抉择卡）后按薄写处理，description 明确注明依据截图与"页面无文字"，controls 用兜底句。
- 开发状态映射：itch In development → early-access（cash-sins、spiro-idle、the-midnight-troupe）；页面自称 prototype 但"complete from start to finish" → early-access（spinsmash）；页面明示 Demo → demo（deblock、earth-regen）；其余 released（lumberjack-empire、free-shipyard、kingdom-estate-clicker、infinigon）。
- 动图素材：lumberjack-empire 3 张、kingdom-estate-clicker 2 张 GIF 截图走 ffmpeg+libwebp 转动画 WebP，脚本按帧校验 0 错误；其余全部静态图（封面 10 + 截图 46，其中动图 5）。镜像 0 错误。
- meta 三件套：10 款 meta_title 本身 37-43（渲染后 +` | PlayBloo` 11 字符 = 48-54，全部 ≤60）；meta_description 初稿 2 条 156 超限（infinigon、the-midnight-troupe），收窄后 148-154 全部 ≤155，无返工。cash-sins 的 meta_title/meta_description 用 "Cash and Sins" 规避 `&` 转义计数问题。
- the-midnight-troupe 按写作规则 8 完整保留开发者 content warning（心理/存在恐怖、操纵胁迫、死亡、身份迷失、道德黑暗恋爱、身体恐怖、提及的虐待儿童、18+ 可选露骨内容），并写进 description、tips、features 三处。
- earth-regen 开发者披露 generative AI 写代码与部分文本（设计/平衡/测试/音乐为本人、美术全代码绘制无生成图）——按"如实呈现页面事实"原则写进 features 与 description。
- 雷达回填：`mark_used.py` marked=10、not_found=[]，与入库数一致。

## 验证

- 线上抽检 3 个 `/game/<slug>`（lumberjack-empire、the-midnight-troupe、infinigon）全部 200；`<title>` 为「meta_title + | PlayBloo」且 ≤60 字符（实测 53/53/48），meta description 渲染与库内一致，封面引用指向 `game-media/covers/2026-11-11/`，外链按钮正常（infinigon 含 frostleafgames.itch.io 外链）。
- DB 核验：10 行游戏 / 20 条分类 / 10 条 "Added to PlayBloo" Updates 全部落库；added_at=updated_at=2026-11-11T01:46（实际首次上线时刻）；thumbnail_url 全部指向 `game-media/covers/2026-11-11/`，screenshots 1-6 张不等且已换自家存储。
- sitemap（数据侧核验，按约定不等待线上 ISR 刷新）：`src/app/sitemap.ts` 动态生成，游戏 lastModified 取 updated_at＝本批实际上线时刻 2026-11-11T01:46；线上当前缓存版 sitemap（521 URL）抽查上批 pluvia/supermarket-spree-dx 的 lastmod 仍为 2026-11-09T16:25 未被改写，本批新游戏待 1h TTL 后自然收录；本批无下架/删除，无衍生页面需清理。
- GSC：本批 10 条详情页 URL 清单见下，提醒逐个「网址检查 → 请求编入索引」。

## GSC 提交清单

```
https://playbloo.net/game/lumberjack-empire
https://playbloo.net/game/free-shipyard
https://playbloo.net/game/kingdom-estate-clicker
https://playbloo.net/game/infinigon
https://playbloo.net/game/spinsmash
https://playbloo.net/game/cash-sins
https://playbloo.net/game/spiro-idle
https://playbloo.net/game/the-midnight-troupe
https://playbloo.net/game/deblock
https://playbloo.net/game/earth-regen
```
