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
    "categories": ["action", "horror"],
    "engine": "Unity",
    "graphics": "2D",
    "multiplayer": "single-player",
    "development_status": "released"
  }
}
```

校验失败会被 import_games.py 拒绝（缺字段/分类不合法都会报 PROBLEM），先补齐再入库。

## 写作规则（2026-10-07 批次沉淀）

1. **只写有依据的内容**——素材是 og:description + 页面 formatted_description + 侧栏信息。没有的机制不编造；信息太少就写薄（1-2 段 + 少量 features），并引导用户去原页面看细节。
2. **语言与口吻**：全英文（站点语言），描述性、具体、可直接引用开发者的自述（itch 页面文案是公开宣传语，聚合站引用+外链署名是惯例，既有 death-spiral 先例就是这么做的）。非英语游戏（西语/日语/中文/韩语）翻译其前提并注明 UI 语言，如 "Spanish-language presentation"。
3. **短简介 short_description**：一句话钩子，优先化用 og:description（详情页 meta/卡片用）。目标风格参考：\"A witch and her cat cross a haunted garden\"。
4. **controls**：页面给了控制说明就结构化列出（`Move – WASD` 每行一条）；页面没给就写 `"See the original itch.io page for the developer's control notes."`，不要发明键位。
5. **tips**：只写从玩法能推出的建议（路径规划、资源管理等）；纯猜测不写。语气可以轻幽默，引用开发者自嘲要标注是页面的梗。
6. **features**：6-10 条（内容薄的 3-5 条），一条一个特性，含引擎/平台/语言/人数等硬信息。
7. **粉丝作品/Sprunki mod/二创**：如实写 fan-made、非官方、community project；不要写得像官方游戏。
8. **敏感内容**：页面带 content warning（如 youre-a-buge 的性别烦躁主题）要在 description 里保留提示。
9. **Demo**：页面自称 demo（"Free browser demo"、"Tower Defense Demo"）→ `development_status: "demo"`，其余 "released"。
10. **人数**：默认 "single-player"；本地多人写 "local multiplayer (2–4 players)"；合作写 "single-player or two-player co-op"；对 bot 大战写 "single-player vs bots"。
11. **graphics**：只在有把握时填 "2D"/"3D"（bitsy=2D、Unity 3D 场景=3D、WebGPU 自研=3D）；不确定就 null。
12. **engine**：侧栏 "Made with" 原文（Unity/Godot/bitsy）；多工具链取运行时（"GIMP, FL Studio, Scratch" → "Scratch"）；页面自称 HTML5 无引擎 → "HTML5"；自研引擎写 "Custom WebGPU engine"。

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
- 汇报时说明：入库 N 款、跳过哪些及原因（404 等）、分类分布；提醒用户在 SEO 控制台把本批标记「已用于 PlayBloo」（雷达状态流转是人工驱动的，不要代操作）。
