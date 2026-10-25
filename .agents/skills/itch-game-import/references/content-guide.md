# 文案与数据规范（每批次由模型逐款撰写）

## content.json 格式

键 = itch URL 的 slug（`https://ahansahoo.itch.io/the-staring-contest` → `the-staring-contest`）。每款：

```json
{
  "the-staring-contest": {
    "short_description": "Run. Don't take your eyes off them. And run.",
    "description": "2-4 段英文正文，基于官方页面内容…",
    "how_to_play": "玩法循环说明…",
    "controls": "Move – WASD\nShoot – Left click …（未知就写 See the original itch.io page…）",
    "tips": "每行一条，只写有依据的",
    "features": "每行一条特性",
    "editorial_take": "2-4 句站点自己的推荐语：为什么值得玩、适合谁、亮点是什么…",
    "meta_title": "Play The Staring Contest Online - Browser Demo",
    "meta_description": "One-sentence original SERP description, ≤155 chars…",
    "categories": ["action", "horror"],
    "engine": "Unity",
    "graphics": "2D",
    "multiplayer": "single-player",
    "development_status": "released"
  }
}
```

校验失败会被 import_games.py 拒绝（缺字段/分类不合法都会报 PROBLEM），先补齐再入库。

## 写作规则（2026-10-07 批次沉淀，2026-10-23 增补原创性规则）

1. **只写有依据的内容**——素材是 og:description + 页面 formatted_description + 侧栏信息。没有的机制不编造；信息太少就写薄（1-2 段 + 少量 features），并引导用户去原页面看细节。
2. **语言与口吻**：全英文（站点语言），描述性、具体、可直接引用开发者的自述（itch 页面文案是公开宣传语，聚合站引用+外链署名是惯例，既有 death-spiral 先例就是这么做的）。非英语游戏（西语/日语/中文/韩语）翻译其前提并注明 UI 语言，如 "Spanish-language presentation"。
3. **短简介 short_description**：一句话钩子，**必须原创改写**——吸收 og:description 的信息点后用自己的句子重写，不得整句照搬（这 1000+ 张卡片会原样出现在列表、搜索和 meta description 里，照搬等于把 itch 的 meta 文案复制到全站）。目标风格参考："A witch and her cat cross a haunted garden"。
4. **controls**：页面给了控制说明就结构化列出（`Move – WASD` 每行一条）；页面没给就写 `"See the original itch.io page for the developer's control notes."`，不要发明键位。
5. **tips**：只写从玩法能推出的建议（路径规划、资源管理等）；纯猜测不写。语气可以轻幽默，引用开发者自嘲要标注是页面的梗。
6. **features**：6-10 条（内容薄的 3-5 条），一条一个特性，含引擎/平台/语言/人数等硬信息。
7. **粉丝作品/Sprunki mod/二创**：如实写 fan-made、非官方、community project；不要写得像官方游戏。
8. **敏感内容**：页面带 content warning（如 youre-a-buge 的性别烦躁主题）要在 description 里保留提示。
9. **Demo**：页面自称 demo（"Free browser demo"、"Tower Defense Demo"）→ `development_status: "demo"`，其余 "released"。
10. **人数**：默认 "single-player"；本地多人写 "local multiplayer (2–4 players)"；合作写 "single-player or two-player co-op"；对 bot 大战写 "single-player vs bots"。
11. **graphics**：只在有把握时填 "2D"/"3D"（bitsy=2D、Unity 3D 场景=3D、WebGPU 自研=3D）；不确定就 null。
12. **engine**：侧栏 "Made with" 原文（Unity/Godot/bitsy）；多工具链取运行时（"GIMP, FL Studio, Scratch" → "Scratch"）；页面自称 HTML5 无引擎 → "HTML5"；自研引擎写 "Custom WebGPU engine"。

## 原创性三件套（2026-10-23 新增，Google 收录优化的核心）

游戏页大部分区块的信息源就是 itch 页面，这是与 itch 内容同质、Google 只给"Discovered - currently not indexed"的主要原因。以下三个字段是页面上**只属于 PlayBloo 的内容**，每款必写：

13. **editorial_take**（游戏页 "Why we're featuring X" 高亮区块）：2-4 句站点第一视角的推荐语——为什么收录它、适合什么玩家、最突出的一两个亮点、和同品类游戏相比的位置。规则：只下"有依据的判断"（依据仍是页面素材），可以带观点（"standout pick for fans of X"），但不得虚构未提及的机制、评分或奖项；不复述 description 的句子。
14. **meta_title**（SERP 标题，设置后覆盖默认 `{title} - Play Here`）：≤60 字符，含游戏名 + 一个差异化的搜索意图词（如 "Play … Online"、"… Browser Demo"、"Free … Web Game"）；不要重复站名后缀（模板会自己加）。
15. **meta_description**（SERP 描述，设置后覆盖 description 截断）：≤155 字符，**原创句子**（可以化用 short_description，但不要与它逐字相同），写清"是什么 + 玩点 + 可直接在浏览器玩"。

这三个字段同样用于老游戏回填：后台 Games 列表勾选 "Missing editorial take"（按 view_count 倒序）就是回填工作清单，每批处理约 20 款；回填只补这三个字段，**不要动 `updated_at`/`last_updated_at`**（sitemap 的 lastmod 依赖它们保持不变）。

## 分类映射（itch Genre → PlayBloo categories）

| itch Genre | categories |
|---|---|
| Platformer | platformer (+action) |
| Puzzle | puzzle (+casual) |
| Shooter | shooting (+action 或 arcade) |
| Action | action (+arcade/horror 看题材) |
| Adventure | adventure (+action/casual) |
| Strategy / Tower Defense | strategy |
| Simulation | simulation (+arcade/adventure 看内容) |
| Racing / driving | racing (+action/casual) |
| Role Playing | rpg (+adventure) |
| Visual Novel / bitsy 叙事 | casual |
| Survival | survival (+action/music 看机制) |
| Educational / 语言学习 | educational (+puzzle) |
| Idle / clicker | idle (+casual) |
| Card | card (+strategy) |
| Music / 节奏 / Sprunki mod | music (+casual) |
| 本地多人（热座） | action/casual + **multiplayer** |
| Genre 缺失 | 按描述判断；完全没有信息 → arcade + casual |

多数游戏 1-2 个分类；本次 52 款共 91 条关联可作密度参考（casual 21 / action 13 / adventure 9 / simulation 8 / strategy 6 / arcade 6 / puzzle 5 …）。

## 流程性提醒

- 上架时间 `published_at`（UTC+8）取日期部分作 `release_date`。
- 标题用导出里的 RSS 标题（与页面 h1 通常一致；页面 h1 更权威时以 h1 为准）。
- 汇报时说明：入库 N 款、跳过哪些及原因（404 等）、分类分布；入库成功后用 `mark_used.py` 回填雷达已用状态（urls 取 import_games.py 落盘的 imported-urls.txt）。
