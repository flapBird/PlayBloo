# Thief Puzzle 上架报告（2026-11-18）

- 来源：用户提供 `https://play.famobi.com/thief-puzzle`（Famobi 官方分发页）
- 终态：**新增公开 1**，重复跳过 0，草稿 0，失败 0
- 游戏 ID：`c04f1e56-6a90-4147-990a-77f9f275ff70`；正式 URL：https://playbloo.net/game/thief-puzzle

## 身份与去重

- 查库（含草稿、全量分页字段检索 `title/slug/external_url/iframe_url` 的 thief 相关行）：仅命中 `trick-or-thief`（SpunkySarb 的 itch 项目，不同作品），无 Thief Puzzle 记录。
- slug `thief-puzzle` 写入前二次核对，无冲突。
- 现有目录总量 1280（写入前）。

## 字段依据（核实时间 2026-11-17T16:07Z / 本地 2026-11-18）

| 字段 | 值 | 依据 |
|---|---|---|
| title / slug | Thief Puzzle / thief-puzzle | Famobi 页面 `<title>` 与 URL |
| developer / publisher | WEEGOON / Famobi | Fandom Browser Version 页与 littlegames 等 WEEGOON 署名；Famobi 为 Web 分发方（games.famobi.com、thiefpuzzle.com footer、CrazyGames 页面） |
| iframe_url / external_url | `https://play.famobi.com/thief-puzzle` | Famobi 官方 iframe 嵌入入口：HTTP 头无 X-Frame-Options/CSP frame-ancestors；wrapper 页自身即嵌入 `games.cdn.famobi.com/html5games/t/thief-puzzle/v090/`；站内 Bloxd.io 已有外域 iframe 先例 |
| monetization | free-with-ads | Famobi 分发模式含广告（实测开屏后有插屏广告、可跳过）；thiefpuzzle.com 称无可购买内容 |
| development_status / platforms | released / ["browser"] | 多门户在架可玩 |
| release_date / last_updated_at | 空 | 未找到该浏览器版本的可靠发行/更新日期（CrazyGames 2024-09 仅为该门户上架时间，不采用） |
| engine / graphics / multiplayer / screenshots / tags / series | 空 | 无可靠依据，留空 |
| sources | official ×3（play.famobi.com、games.famobi.com、thiefpuzzle.com）+ portal ×1（crazygames.com） | 详情页玩法事实来源 |
| last_verified_at / content_verified | 写入时实际时间 / true | 五栏目均已核实填写 |

详情文案（About/How to Play/Controls/Tips/Features）综合 Famobi 目录页、thiefpuzzle.com（Famobi 官方游戏站：拖拽伸长手臂、碰到任何障碍即失败、守卫/锯子/炸药等障碍、dozens of heist scenes、四步玩法）与 CrazyGames 页面（左键按住拖拽、具体关卡示例：长椅钱包/守护犬车钥匙/试卷/珍珠/假发、角度与最短路径、难度递增）。未将移动端独有功能写入。

missingDetailFields：无（五栏目齐全）。关卡总数未写具体数字（官方仅称 dozens），里程碑/皮肤等移动端内容未写入。

## 封面镜像

- 原图：`https://img.cdn.famobi.com/portal/html5games/images/tmp/ThiefPuzzleTeaser.jpg`（320×320 JPEG 21,225B，官方 teaser，游戏 logo 清晰可读）
- 压缩：WebP q88，320×320（最长边 ≤640，未放大），21,098B
- 上传：`game-media/covers/2026-11-18/thief-puzzle.webp`（bucket 公开 URL 200、content-type image/webp、字节一致）；`thumbnail_url` 与 `cover_url` 同值
- 上传前核对该对象路径无既有资产，未覆盖他人文件

## 写库流程

1. 先插草稿（is_published=false）→ 绑定分类 puzzle + casual → 回读 15 项检查全部通过
2. 发布与 `updated_at=2026-11-17T16:08:01Z` 同操作写入（即本地 2026-11-18 00:08，真实首次上线时间）；added_at/created_at 为 DB 默认 NOW()
3. 只写入本游戏行与 2 条 game_categories 关联，未触碰任何老游戏行/时间戳；is_featured/is_trending=false

## 线上验证（匿名访问）

- 游戏页 https://playbloo.net/game/thief-puzzle ：HTTP 200；`<title>` "Thief Puzzle - Play Here | PlayBloo"（35 字符 ≤60）；meta description 157 字符 ≤160；About/How to Play/Controls/Tips/Features/分类徽章（Casual、Puzzle）/Game Info（WEEGOON、Famobi、Free With Ads、Released）全部渲染；Instant play 启动态
- 内嵌游玩实测（浏览器自动化）：Launch game 后 iframe 挂载 `play.famobi.com/thief-puzzle`，Famobi 启动画面渲染、按钮响应指针事件；对照直开 Famobi 原页可完成 cookie 同意 → 插屏广告（可跳过）→ 游戏标题画面全流程，确认构建可运行、无盗链拦截。canvas 关卡的自动化点击推进未成功，属自动化环境限制，非嵌入故障
- 封面 URL 匿名 200 image/webp
- llms.txt：站点级文档列分类与 guides，不含单游戏清单 → 无需修改，未改

## Sitemap（curated，2026-11-12 规则）

- 现行 `src/app/sitemap.ts` 只收录 view_count ≥3 或 GSC 已索引的游戏页（注释明确新游 0 浏览时不列入，页面仍可内链爬取）
- Thief Puzzle 0 浏览 → 未列入线上 sitemap（201 条 URL 无该页），与 bloxd-io、cold-smoke 等 11-17 新游一致；达到 3 浏览后自动进入，无需改生成器
- 老游戏 lastmod：本轮对 DB 的写操作仅限新游戏行，老行未动；live sitemap 中 sort-the-court、anxiety 等老游时间戳由既有数据生成，未批量刷新
- 验证点：新增未列入符合现行收录条件（如实记录，非遗漏）；下架类验证不适用；直接写库不会自动失效 Next 缓存，游戏页为 ISR（revalidate=3600）首次访问已按需渲染并缓存成功（见上 200 与内容验证）

## 待观察 / 风险

- iframe 为 Famobi 域外链嵌入（非 R2 自托管）：依赖 Famobi 服务可用性与其条款；如后续要自托管需按 itch-game-selfhost 流程单独评估
- 游戏内含广告与 Famobi 隐私提示，站点隐私页未因嵌入第三方游戏新增披露（与既有外嵌游戏一致）

## 2026-11-18 修复：play.famobi.com 包装页会劫持跳出站外

用户反馈点击 Play 跳到站外。扒 `play.famobi.com` 包装页 inline script 确认机制（未注册合作域名的嵌入门控，`redirectToBlank = isInsideFrame && adProvider==="dfp" && portalParams.ad_ingame && !portalParams.dfp_available`，默认 A1000 门户 `dfp_available=false`）：

1. 包装页的 Play 按钮是 `<a href="play.famobi.com/thief-puzzle/A1000-11" target="_blank">`，点击开新标签跳到 Famobi CDN（用户实际开出两个 games.cdn.famobi.com 标签）
2. 更糟：`redirectTimer = setTimeout(() => window.top.location = getGameLink(), 15000)` —— 嵌入后 15 秒无条件把整个宿主页面顶走

另核实 playbloo.net 无 ads.txt（404），未注册 Famobi 合作；真正页内嵌入仅对注册发布商开放（其门户配置 `dfp_available=true` 时包装页才走 `window.location.replace(url)` 在 iframe 内载入游戏）。

**修复（用户选定方案：直嵌 CDN 游戏本体）**：`iframe_url` 改为包装页自身跳转生成的游戏构建地址
`https://games.cdn.famobi.com/html5games/t/thief-puzzle/v090/?fg_domain=play.famobi.com&fg_aid=A1000-11&fg_uid=56b693d4-476b-472b-a1ed-25cc7cabbd09&fg_pid=4638e320-4444-4514-81c4-d80a8c662371&fg_beat=704`
——绕过包装页的跳板与 15 秒劫持，游戏加载屏在 localhost iframe 直嵌测试中可正常加载；Famobi 广告与 A1000-11 归因保留。`external_url` 仍指 play.famobi.com/thief-puzzle 作为恢复态"Open game site"兜底。`last_verified_at` 刷新为 2026-11-17T16:34:59Z；`updated_at` 未动（仍为首次上线 2026-11-17T16:08:01Z）。

**残留风险**：CDN 路径含版本号 v090 且属未注册热链，Famobi 升版/封链即裂——裂时游戏页恢复态有 "Open game site" 外链兜底，需人工跟进。线上游戏页 ISR 缓存 `s-maxage≈33min`，修复后旧 iframe 最多再服务约半小时（无管理员会话可主动 revalidatePath）。

**修复后线上验证（17:14Z 缓存翻新后）**：live HTML iframe src 已为 CDN 构建地址；浏览器实测 Launch game → iframe 挂载 `games.cdn.famobi.com/.../v090/` 游戏加载屏正常渲染，宿主页 `topUrl` 在点击后 15 秒+保持 `playbloo.net/game/thief-puzzle` 不变（wrapper 的 15 秒 top 劫持随包装页一并绕过）。iframe 内游戏加载屏的后续点击（cookie/广告/开始）在自动化环境无法穿透跨域 iframe，但直开该构建 URL 时全流程（cookie 同意→插屏广告→标题画面）已在页内验证通过，且授权发布商的正常嵌入路径同为 iframe 内运行该构建。
