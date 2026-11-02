# 用户投稿审核报告 — 2026-11-02

- 输入：1 条待审投稿（快照 `pending_review` 唯一一条）
- 结果：**通过 1**，重复 0，拒绝 0，待处理 0，失败 0
- 审核方式：人工编辑审核（服务角色在本次授权审核范围内直接写库；无管理员会话，`reviewed_by` 留 null，实际方式记录于投稿 `_editorial_review`）

## 逐条结果

### 1. Covenant Cards — 通过发布

| 项 | 值 |
|---|---|
| submissionId | `cec2a9cb-6ae8-416f-8a78-5d6f19dde946` |
| inputUrl | https://covenant.cards/ （source_type: official） |
| resolvedUrl | https://covenant.cards/#battle （已核实的浏览器对战预览入口） |
| identity | 官方站点 covenant.cards；开发者 Gal Itach（solo，工作室 Valorem，valorem.ing）；Google Play 包名 `io.github.galitach.covenantcards` 与开发者名互证；无 Steam App ID / itch slug |
| decision | approved |
| reason | 免费英文浏览器对战预览实测可玩；投稿 notes 所列事实逐条核实（3 副 16 卡牌组、双方 15 点队长生命、每方至多 7 回合、非浏览器多人）；目录 1163 款（含草稿）按标题/作者/URL 身份扫描无同款 |
| gameId | `e8776e1b-caf4-4a1d-bfd9-5ab5c74396b0` |
| slug | `covenant-cards` |
| publishedAt | 2026-11-01T20:39:07.242Z（发布动作写入的真实 `updated_at`） |
| game | title: Covenant Cards；developer: Gal Itach；developer_url: https://valorem.ing/ ；external_url: https://covenant.cards/#battle ；platforms: [browser]；monetization: free；development_status: demo（明确标注为有限浏览器预览，不套用原生完整版功能）；original_game_url 保留投稿输入地址 |
| categories | card, strategy（均用库内既有分类，未新建） |
| tags | single-player（练习遭遇战 vs AI，已核实） |
| researchSources | 见下方来源清单 |
| missingDetailFields | engine、release_date（浏览器预览）、last_updated_at（浏览器预览）、multiplayer、publisher、graphics — 留 null，见 JSON 缺项说明 |
| media | 封面镜像 `covers/submissions-2026-11-02/covenant-cards.webp`（640×360 WebP，37,480 字节，取自官方 key art `game-assets/cinematic-breach-v2.webp`，压缩后公开 URL 200/类型/字节校验通过；标注为官方品牌图，未冒充浏览器预览截图）；截图：无（预览为 DOM 渲染交互，未取得可代表预览画面的静态素材，不虚构） |
| outcome | 数据库写入完成并回读；线上详情页、首页、sitemap 源查询验证通过（详见下文） |

## 研究依据（均于 2026-11-02 核实）

- https://covenant.cards/ — 官方首页（curl + 真实浏览器）；页脚 "Created by Gal Itach"、"an independent game from Valorem"；完整版为 iOS/Android 原生（App Store id6759227375 / Google Play `io.github.galitach.covenantcards`）
- https://covenant.cards/#battle — 浏览器对战预览，**真实浏览器实测**：拖拽 Locust Swarm 上场（法力 8→6、Momentum 0→1、单位入板）；牌组选择弹窗确认 3 副 16 卡牌组（Vanguard/Sanctuary/Serpent）、"15 health · 7 turns each"、AI 对手 Pharaoh 三策略（Assault/Bastion/Hex）、种子复现（如 CC-WLOMFU）与复制挑战链接
- 公开站点 bundle 静态阅读（帮助文字核对，不作为试玩证据）：nav "Browser battle preview"/"Browser pack preview" 区块、卡牌数据（阵营 Judaism/Egypt/Babylon、费用/攻/血）
- https://covenant.cards/game-assets/cinematic-breach-v2.webp — 官方 key art（封面来源）
- 页内 FAQ/正文确认：预览与完整原生版分离；pack 预览独立且不解锁完整版卡牌；预览非多人

投稿 notes 事实核对：3×16 卡牌组 ✓、15 点起始队长生命 ✓、每方至多 7 回合 ✓、简化预览与原生版分离 ✓、非浏览器多人 ✓；按其要求标注为 limited browser preview，仅外链收录、不代托管/内嵌（iframe_url 留空）。

## 写库与验证

1. 草稿先行：`is_published=false` 插入，五栏（description/how_to_play/controls/tips/features）+ short_description 完整写入并回读；分类/标签关联写入；匿名客户端按 id 与 slug 查询均为 0 行（草稿不可见）。
2. 发布：条件更新 `is_published=true` 并写入真实发布时刻 `updated_at=2026-11-01T20:39:07.242Z`（`added_at` 为实际入库时刻 2026-11-01T17:53:56.884Z）；`is_featured`/`is_trending` 保持 false。
3. 投稿回写：精确 ID + `status=pending_review` 条件更新，返回行数 =1；`status=approved`、`approved_game_id` 绑定、`reviewed_at` 写入；`extracted_data` 合并 `_editorial_review`（方法/时间/理由/来源/缺项），原 notes 保留并追加审核说明；`extraction_status` 保持 partial（不冒称自动提取修复）。`reviewed_by=null`（服务角色直写、无管理员会话，已在私有审核元数据说明）。
4. 中途异常如实记录：插入脚本在网络回读阶段卡住被停止，回读确认插入与关联均已成功，未重复执行创建。
5. 线上详情页 https://playbloo.net/game/covenant-cards HTTP 200：渲染标题 41 字符（"Covenant Cards - Game Details | PlayBloo"，<60）、meta description 152 字符（<160）、五栏实文抽查 12/12 命中、外链指向 `covenant.cards/#battle`、封面直连 Storage 域且全页无 `/_next/image`；canonical 正确。
6. 首页已含新游戏卡片，封面为 Storage 直连 preload，无图片优化器参与。
7. sitemap：
   - 线上 https://playbloo.net/sitemap.xml 尚未收录新游戏：1156 条 /game/ URL 与基线 1156 款公开游戏逐一比对，lastmod 全部一致、0 错位（另 3 条为 Color Block Jam 关卡页，属正常）；即线上 XML 仍是发布前缓存，**服务角色直写不触发 Next 缓存失效，且本会话无管理员会话可用现有认证失效路径** —— 记录为缓存/部署限制，未伪造失效、未自动部署。
   - 本地以与 `src/app/sitemap.ts` 相同的分页源查询验证：公开游戏现为 1157 款，`covenant-cards` 将被收录且 lastmod = 2026-11-01T20:39:07.242Z（真实发布时刻）；无重复 slug。sitemap 生成器无代码改动，未运行分页回归测试（未改代码）。
8. 基线比对：除本条新增游戏与对应投稿外，老游戏内容/时间戳、分类/标签/系列表均无改动（1156/1156 lastmod 与基线一致即为证据）。
9. `public/llms.txt`：仅描述路由格式，不逐款列游戏，无需改动。
10. 本轮无应用代码改动，未运行构建。

## 待跟进

- 线上 sitemap.xml 与（如走静态化）列表缓存待下一次部署或现有认证失效路径刷新后自然收录新 URL；未做任何手动缓存 hack。
