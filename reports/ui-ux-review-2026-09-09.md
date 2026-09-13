# PlayBloo UI、交互与信息展示检查

> 2026-09-13：已按页面报告实施修复并复验，见[修复记录](/Users/wanggang/Documents/Codex/PlayBloo/reports/ui-ux-fixes-2026-09-13.md)。全屏遮挡在后续游戏加载后实际复现，现已修复；本文保留初次检查时的证据状态。

日期：2026-09-09。对象：当前工作区的公开站点代码。

> 2026-09-12 更新：浏览器实测已完成主要公开页面走查，见[页面实测报告](/Users/wanggang/Documents/Codex/PlayBloo/reports/ui-ux-visual-review-2026-09-12.md)。以下保留最初代码检查的范围与记录；“实测受阻”描述仅对应初次检查。第 02 项已根据实测撤回确定性结论。后续启动游戏会产生正常浏览/启动计数和本机历史记录。

## 结论与证据边界

存在明确的交互和信息展示问题，建议先处理导航断点、游戏加载失败恢复、列表字段缺失、收藏容量和攻略归属，再调整视觉细节。全屏遮挡在后续实测中未复现，不列为已确认故障。

本次完成的是系统性的代码检查，**不是已经完成的浏览器视觉审查**。内置浏览器加载、Chrome 标签页连接和原生窗口读取均发生工具超时，没有得到可接受的站点截图，也没有完成点击实测。工具超时不代表站点本身超时。网页检索返回的是旧抓取内容，未作为本次视觉或行为证据。当前工作区与线上部署是否一致也未确认。

以下“已确认”指当前代码中可以确定的实现及条件性后果，不代表相关条件已经在线上出现。未修改产品代码、数据或发布站点。管理后台不在此次公开站点检查范围内。

## 流程覆盖

| 步骤 | 范围 | 代码检查结果 | 实测状态 |
|---|---|---|---|
| 1 | 首页、页头、信息流与榜单 | 导航断点、榜单口径、切换语境有问题 | 截图和点击受工具阻塞 |
| 2 | 搜索、筛选、列表/网格、分页 | 分类 ID 暴露、内容字段缺失、越界恢复有问题 | 同上 |
| 3 | 分类、标签、系列 | 分类入口不完整，分页和返回路径需改善；系列实现了顺序排序 | 同上 |
| 4 | 游戏详情、启动、全屏 | 启动入口清楚，但失败恢复和全屏有问题 | 未加载第三方游戏 |
| 5 | 收藏、最近游玩、首页资料库 | 收藏截断、管理入口和异常反馈有问题 | 未改变用户收藏或历史 |
| 6 | 攻略索引、搜索、详情 | 游戏与攻略归属校验缺失，搜索竞态与反馈有问题 | 未播放视频 |
| 7 | 投稿 | 基础校验和反馈较完整；来源提示存在错误认定 | 未提交表单 |
| 8 | 联系、404、全局可访问性 | 联系入口和 HTML 语义需完善 | 未发送邮件；未做读屏实测 |

## 已确认的实现问题

### 01 · 平板宽度下主导航消失 — 高优先级

**触发条件：** 视口宽度为 768–1023 CSS px。桌面导航使用 `hidden lg:flex`，菜单按钮和菜单内容却使用 `md:hidden`，两套入口在此区间同时隐藏。用户在详情等页面失去页头的 Games / Updates / Popular / Playable 入口。

**建议：** 统一菜单与桌面导航的切换断点；验证 767、768、1023、1024 px。

证据：[Header.tsx:47](/Users/wanggang/Documents/Codex/PlayBloo/src/components/layout/Header.tsx:47)、[Header.tsx:96](/Users/wanggang/Documents/Codex/PlayBloo/src/components/layout/Header.tsx:96)、[Header.tsx:126](/Users/wanggang/Documents/Codex/PlayBloo/src/components/layout/Header.tsx:126)。

### 02 · 游戏“全屏”层级存在待验证风险 — 实测未复现

游戏全屏是 `fixed inset-0 z-50`，它在 `.site-main` 的 `z-index: 1` 堆叠上下文内；页头本身为 `sticky z-50`。这一组合值得验证，但不能只凭静态 CSS 推断实际遮挡。2026-09-12 在 Color Block Jam 桌面页启动并进入全屏时，页头没有遮住右上方控制按钮，Escape 可以退出。撤回此前“必然遮挡”的结论。

**建议：** 将全屏容器 portal 到 body 或采用适当的 Fullscreen API，并处理退出、焦点恢复和滚动锁定。焦点进入跨域 iframe 后，父窗口的 Escape 监听不能保证收到按键；也需要验证。

代码线索：[globals.css:116](/Users/wanggang/Documents/Codex/PlayBloo/src/app/globals.css:116)、[GameIframe.tsx:139](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameIframe.tsx:139)、[Header.tsx:38](/Users/wanggang/Documents/Codex/PlayBloo/src/components/layout/Header.tsx:38)。截图与测试限制见页面实测报告；跨域 iframe 获取焦点后的退出行为仍未覆盖。

### 03 · 游戏加载失败没有恢复流程 — 高优先级

iframe 只在 `onLoad` 中结束加载，缺少超时、失败提示、重试和返回启动页的状态。网络卡住时可能持续转圈；被第三方禁止嵌入时也不能通过 `onLoad` 判断游戏是否可玩。只有存在 externalUrl 时才有一个外链图标，且没有可访问名称。

**建议：** 提供可理解的加载状态、超时提示、重新加载、返回详情及有明确文字的外部打开入口。跨域游戏不能只依赖 iframe 的 load 事件认定加载成功。

证据：[GameIframe.tsx:168](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameIframe.tsx:168)、[GameIframe.tsx:194](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameIframe.tsx:194)。未认定任何具体第三方游戏已经失效。

### 04 · 分类筛选标签显示数据库 ID — 高优先级

Genre 下拉框提交的是分类 ID；ActiveFilterChips 直接将 `filters.category` 当文案输出。后续实际选中 Driving 后，结果区显示 UUID，无法帮助用户辨认条件。标签自身不能单独移除，只有 Clear all。当前筛选器未提供 Puzzle 选项，原先以 Puzzle 举例不准确。

**建议：** 用分类 ID 映射可读名称，每个条件支持单独移除；清除操作明确是否保留排序和视图。

证据：[SearchFilterPanel.tsx:14](/Users/wanggang/Documents/Codex/PlayBloo/src/components/search/SearchFilterPanel.tsx:14)、[SearchFilterPanel.tsx:32](/Users/wanggang/Documents/Codex/PlayBloo/src/components/search/SearchFilterPanel.tsx:32)。

### 05 · 搜索与分类列表丢失已审核简介和更新信息 — 高优先级

搜索、分类、标签、系列使用 `PUBLIC_GAME_CARD_FIELDS`，不读取 `content_verified`、`short_description`、`description`、`last_updated_at`、`added_at`。而 GameListItem 只有在 `content_verified` 为真时才显示真实简介。因此即使详情和首页已有已审核介绍，这些列表仍统一显示泛化句子。最近更新列表也无法根据该字段显示 UPDATED；列表日期始终标为 Added，无法说明为何进入发布/更新排名。

**建议：** 为列表定义包含短简介、审核状态和发现日期的轻量字段集；发布、更新排序分别显示对应日期。

证据：[discovery-data.ts:9](/Users/wanggang/Documents/Codex/PlayBloo/src/lib/discovery-data.ts:9)、[search/page.tsx:53](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:53)、[GameListItem.tsx:42](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameListItem.tsx:42)。

### 06 · 同一游戏在列表和详情中可能显示不同可玩状态 — 高优先级

详情的可玩判断支持 `original_game_url`、`official_website_url` 作为外链来源；公共卡片查询和推荐池不读取这些字段，推荐池还把 original_game_url 明确置空。只填写这些来源的游戏可能在列表中被归为 Details only / 未完成来源核实，而详情中可以打开官网。

**建议：** 在服务端统一生成可玩模式与最终可用链接，列表、推荐和详情共享该结果。

证据：[game-utils.ts:7](/Users/wanggang/Documents/Codex/PlayBloo/src/lib/game-utils.ts:7)、[discovery-data.ts:9](/Users/wanggang/Documents/Codex/PlayBloo/src/lib/discovery-data.ts:9)、[game/[slug]/page.tsx:100](/Users/wanggang/Documents/Codex/PlayBloo/src/app/game/[slug]/page.tsx:100)。

### 07 · 接口失败被伪装为没有内容 — 中优先级

搜索查询错误返回空数组和 0；SavedGamesGrid 不检查 response.ok，错误 JSON 会变为空列表；LevelEpisodes 的异常也呈现“暂无攻略”。用户因此无法分辨“没有收藏/没有游戏”和“暂时加载失败”。首页数据库错误也显示新游戏即将出现。

**建议：** 分开 loading / empty / error / success，错误时保留已有内容并提供重试。

证据：[search/page.tsx:77](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:77)、[SavedGamesGrid.tsx:31](/Users/wanggang/Documents/Codex/PlayBloo/src/components/library/SavedGamesGrid.tsx:31)、[LevelEpisodes.tsx:23](/Users/wanggang/Documents/Codex/PlayBloo/src/components/levels/LevelEpisodes.tsx:23)、[app/page.tsx:97](/Users/wanggang/Documents/Codex/PlayBloo/src/app/page.tsx:97)。

### 08 · 分页越界后没有返回路径，大分类页码不完整 — 中优先级

当页码超出最后一页时，仍可能显示总游戏数，但列表为空；Previous/Next 被包在 `games.length > 0` 分支内，空页中也就没有返回上一页的入口。分类页仅生成前 10 个页码，再尝试筛选当前页附近页码；总页数超过 10 时，当前页与末页可能根本不在候选集合内。搜索页还允许小数 page 进入范围计算。

**建议：** 标准化为有限正整数；越界跳回有效页或提供明确返回动作；分页窗口围绕当前页计算并保留首末页。

证据：[search/page.tsx:152](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:152)、[search/page.tsx:192](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:192)、[category/[slug]/page.tsx:154](/Users/wanggang/Documents/Codex/PlayBloo/src/app/category/[slug]/page.tsx:154)、[tag/[slug]/page.tsx:95](/Users/wanggang/Documents/Codex/PlayBloo/src/app/tag/[slug]/page.tsx:95)。

### 09 · 收藏超过 30 个后，旧收藏无法从收藏页访问 — 高优先级

本地收藏没有容量上限，展示时却只取前 30 个 ID，API 的 ids 也截断为 30。界面没有总数说明、加载更多或分页。用户继续收藏后，早期收藏仍在存储中，却从页面消失。

**建议：** 客户端分页或分批读取全部收藏，展示总数与已加载数量。

证据：[SavedGamesGrid.tsx:22](/Users/wanggang/Documents/Codex/PlayBloo/src/components/library/SavedGamesGrid.tsx:22)、[api/games/route.ts:16](/Users/wanggang/Documents/Codex/PlayBloo/src/app/api/games/route.ts:16)、[user-library.ts:84](/Users/wanggang/Documents/Codex/PlayBloo/src/lib/user-library.ts:84)。

### 10 · 收藏页和历史页缺少管理动作 — 中优先级

两页均复用没有 FavoriteButton 和删除按钮的 GameCard。取消收藏需要进入详情；删除历史只在首页最多 4 条记录的区域里有入口，完整历史页无法直接删除指定记录；clearHistory 函数没有页面入口。

**建议：** 收藏页提供取消收藏，历史页提供单项删除和清空，删除后可撤销。收藏入口的空状态文案也应指向实际位置，目前“any game 上的心形按钮”与卡片没有心形入口不一致。

证据：[SavedGamesGrid.tsx:64](/Users/wanggang/Documents/Codex/PlayBloo/src/components/library/SavedGamesGrid.tsx:64)、[GameCard.tsx](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameCard.tsx)、[HomeLibraryPanel.tsx](/Users/wanggang/Documents/Codex/PlayBloo/src/components/home/HomeLibraryPanel.tsx)、[user-library.ts:130](/Users/wanggang/Documents/Codex/PlayBloo/src/lib/user-library.ts:130)。

### 11 · 收藏写入失败仍提示成功，跨标签页刷新不一致 — 中优先级

writeArray 吞掉存储异常；toggleFavorite 无论写入结果都返回新的收藏状态。存储不可用或已满时，按钮可能显示 Favorited，刷新后却丢失。FavoriteButton 监听 storage 事件，但收藏网格和首页资料库只监听同窗口自定义事件，其他标签页修改不会及时同步。历史迁移中还有一次 localStorage.getItem 位于 try 外，受限环境下可中断流程。

**建议：** 写入返回成功/失败；失败给出简短反馈；资料库组件统一订阅跨标签页事件并保护所有存储访问。

证据：[user-library.ts:38](/Users/wanggang/Documents/Codex/PlayBloo/src/lib/user-library.ts:38)、[user-library.ts:51](/Users/wanggang/Documents/Codex/PlayBloo/src/lib/user-library.ts:51)、[FavoriteButton.tsx:48](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/FavoriteButton.tsx:48)、[SavedGamesGrid.tsx:42](/Users/wanggang/Documents/Codex/PlayBloo/src/components/library/SavedGamesGrid.tsx:42)。

### 12 · 方向键会在用户没有意识到时切换游戏 — 中优先级

GameNeighbors 全局监听左右方向键并直接 router.push。虽然排除了输入框和已经聚焦的 iframe，但在页面、收藏按钮或全屏控制按钮上按方向键仍可切换游戏；页面未说明此快捷键。误操作可能中断当前游玩。

**建议：** 移除全局快捷键，或只在明确获得焦点的前后导航区域启用；游玩期间禁用。

证据：[GameNeighbors.tsx:11](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameNeighbors.tsx:11)。

### 13 · 攻略可以挂在错误游戏下展示 — 高优先级

攻略详情分别按游戏 slug 和关卡 slug 查询，却未验证 `level.game_id === game.id`。构造 A 游戏路径 + B 游戏有效关卡 slug，会将 A 的面包屑、开始游玩和前后关卡导航与 B 的攻略内容组合。查询游戏还没有 is_published 过滤。

**建议：** 使用游戏 ID + 关卡 slug 联合查询，并统一公开状态约束；metadata 使用相同的归属查询。

证据：[level/[levelSlug]/page.tsx:30](/Users/wanggang/Documents/Codex/PlayBloo/src/app/game/[slug]/level/[levelSlug]/page.tsx:30)、[level/[levelSlug]/page.tsx:40](/Users/wanggang/Documents/Codex/PlayBloo/src/app/game/[slug]/level/[levelSlug]/page.tsx:40)、[level/[levelSlug]/page.tsx:94](/Users/wanggang/Documents/Codex/PlayBloo/src/app/game/[slug]/level/[levelSlug]/page.tsx:94)。未在线上构造或抓取错误归属页面。

### 14 · 关卡搜索存在过期结果覆盖和无结果反馈缺失 — 中优先级

300ms 防抖只推迟请求，没有取消已经发出的请求，也没有序号校验。快速输入 A → AB，A 的慢响应可以覆盖 AB 的结果；清空输入后旧响应也可能重新打开下拉。无匹配时直接隐藏下拉，用户无法区分搜索完成、无结果和出错。请求最多取 10 条，但底部写 N levels found，容易被理解为全部结果数。

**建议：** AbortController 或请求序号防竞态；提供“无匹配”和错误提示；标明最多显示 10 条，增加查看全部入口。

证据：[LevelSearch.tsx:33](/Users/wanggang/Documents/Codex/PlayBloo/src/components/levels/LevelSearch.tsx:33)、[LevelSearch.tsx:43](/Users/wanggang/Documents/Codex/PlayBloo/src/components/levels/LevelSearch.tsx:43)、[LevelSearch.tsx:116](/Users/wanggang/Documents/Codex/PlayBloo/src/components/levels/LevelSearch.tsx:116)。

### 15 · 首页榜单与 View all 的范围和排序不同 — 中优先级

首页先取最新创建的 60 个游戏，再从这 60 个中生成 Trending、发布、更新、可玩和 Hidden gems。更早入库但最近更新/爆红的游戏可能不会出现。首页 Trending 将人工 is_trending 置前，搜索 Trending 则只按 hot_score / play_count；首页和 View all 不一定保持顺序。Hidden gems 的相对阈值也在不同候选池上计算。

**建议：** 同一榜单共用筛选和排序函数，以完整目录生成前 N 项；首页只截取完整结果的前几项。

证据：[app/page.tsx:45](/Users/wanggang/Documents/Codex/PlayBloo/src/app/page.tsx:45)、[app/page.tsx:74](/Users/wanggang/Documents/Codex/PlayBloo/src/app/page.tsx:74)、[search/page.tsx:60](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:60)、[search/page.tsx:72](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:72)。实际影响取决于目录规模与数据。

### 16 · “Recently Released”可能首先展示尚未发布游戏 — 中优先级

首页只接受过去的发布日期；搜索的 released 排序却仅排除 null，没有排除未来日期。存在 upcoming 数据时，未来日期会排在已经发布的游戏前。recently-updated 查询也没有与首页统一的未来日期过滤。

**建议：** “已发布/已更新”只使用不晚于当前时间的日期；Upcoming 单独展示。

证据：[app/page.tsx:65](/Users/wanggang/Documents/Codex/PlayBloo/src/app/page.tsx:65)、[search/page.tsx:70](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:70)。

### 17 · 信息流切换后排序语境丢失 — 中优先级

首页看似同一信息流的 New / Trending / Released 实际跳入另一套搜索布局；Grid 也导航到 search，而不是只切换当前 14 项的展示。无查询词时目标页标题统一为 Find your next game。手机端排序藏在 Filters 弹层里，ActiveFilterChips 不包含 sort，关闭弹层后看不出自己正在浏览哪个榜单。桌面页头除首页 Games 外也没有选中状态。

**建议：** 结果页明确显示“Trending games / Recently released”等标题或保留榜单导航；手机端直接展示当前排序；视图切换保留数据上下文和页码。

证据：[app/page.tsx:222](/Users/wanggang/Documents/Codex/PlayBloo/src/app/page.tsx:222)、[search/page.tsx:178](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:178)、[SearchFilterPanel.tsx:32](/Users/wanggang/Documents/Codex/PlayBloo/src/components/search/SearchFilterPanel.tsx:32)、[Header.tsx:48](/Users/wanggang/Documents/Codex/PlayBloo/src/components/layout/Header.tsx:48)。

### 18 · 分类和系列入口受 SEO 门槛限制，返回路径不完整 — 中优先级

分类目录与 Genre 筛选只展示至少 3 个游戏的分类，导致有 1–2 个游戏的有效分类无法在主目录选择；但这些分类仍可从游戏标签进入，信息架构不一致。分类、标签、系列详情虽有 BreadcrumbJsonLd，但它不生成可见面包屑，页面缺少直接返回上级目录的入口。分类目录在结果为空时还没有空状态提示。

**建议：** 区分“是否允许索引”和“是否允许用户浏览”；展示所有非空类别；加可见上级入口和目录空状态。

证据：[category/page.tsx:17](/Users/wanggang/Documents/Codex/PlayBloo/src/app/category/page.tsx:17)、[search/page.tsx:119](/Users/wanggang/Documents/Codex/PlayBloo/src/app/search/page.tsx:119)、[series/page.tsx](/Users/wanggang/Documents/Codex/PlayBloo/src/app/series/page.tsx)、[category/[slug]/page.tsx:102](/Users/wanggang/Documents/Codex/PlayBloo/src/app/category/[slug]/page.tsx:102)。

### 19 · 主要行动文案与下一步不完全匹配 — 中优先级

列表与网格的 Play now 只是进入详情，仍需再点 Launch game；外部游戏的 View game 使用外链图标，但实际也先进入本站详情。启动区域用了较大篇幅解释统计什么时候计数、历史什么时候记录，挤占了设备要求、控制方式、是否支持触屏等更有帮助的信息。

**建议：** 将详情入口统一标为 View game；真正启动才使用 Play / Launch；外链图标只用于真正离站的动作。统计说明移至轻量帮助文字。

证据：[GameListItem.tsx:106](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameListItem.tsx:106)、[GameCard.tsx:89](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameCard.tsx:89)、[GameIframe.tsx:108](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameIframe.tsx:108)。

### 20 · 投稿来源提示把任意网址称为官方站点 — 中优先级

sourceHint 对除 Steam 和子域 itch.io 外的任何可解析 URL 都返回 Official site detected，但代码并没有核验是否官方。“识别域名类型”不能说明官方身份。

**建议：** 改为“Website link detected — details will be reviewed”；不要在审核前表达官方认证。成功反馈可补充可预期的后续流程，但不要承诺尚未实现的通知功能。

证据：[SubmitGameForm.tsx:11](/Users/wanggang/Documents/Codex/PlayBloo/src/app/submit-game/SubmitGameForm.tsx:11)。表单现有必填、URL/邮箱类型、长度限制、超时、禁用提交、错误与成功公告值得保留。

### 21 · 联系方式不可直接操作，投稿渠道重复 — 低优先级

联系页的邮箱全部为普通文本，没有 mailto 或复制动作；Game Submissions 只有邮箱，没有连接现有 Submit a Game 表单。用户需要手动复制或回到其他页面找投稿入口。

**建议：** 加可点击邮件地址及复制操作；投稿分组优先引导站内投稿表单。

证据：[contact/page.tsx:24](/Users/wanggang/Documents/Codex/PlayBloo/src/app/contact/page.tsx:24)。

### 22 · 全局和播放器存在可访问性语义缺口 — 中优先级

- 播放器外链、全屏按钮只有图标，缺少 aria-label；加载动画没有文本或状态公告。
- Header 和 LevelSearch 输入只有 placeholder，缺少持久的 label / aria-label。
- RootLayout 已有 main，首页和搜索又渲染 main，造成嵌套主内容地标。
- 404 和攻略的部分入口为 Link 内再放 button，形成嵌套交互控件。
- 导航、视图选择和页码普遍只有视觉选中样式，没有 aria-current 等对应状态；关卡搜索未实现组合框键盘交互。

**建议：** 补充明确名称与状态；每页一个主内容地标；导航用单一链接元素；完善关卡搜索的键盘操作。以上是代码层面的缺口，不是完整的 WCAG 合规结论。

证据：[GameIframe.tsx:146](/Users/wanggang/Documents/Codex/PlayBloo/src/components/games/GameIframe.tsx:146)、[Header.tsx:59](/Users/wanggang/Documents/Codex/PlayBloo/src/components/layout/Header.tsx:59)、[LevelSearch.tsx:73](/Users/wanggang/Documents/Codex/PlayBloo/src/components/levels/LevelSearch.tsx:73)、[layout.tsx:59](/Users/wanggang/Documents/Codex/PlayBloo/src/app/layout.tsx:59)、[not-found.tsx:15](/Users/wanggang/Documents/Codex/PlayBloo/src/app/not-found.tsx:15)。

### 23 · 游戏介绍的审核状态在攻略页不一致 — 中优先级

游戏详情只展示 content_verified 的介绍；攻略侧栏却直接显示 game.description，且查询根本不读取 content_verified。用户可能在详情看到“审核中”，进入攻略后又看到同一段未审核介绍。

**建议：** 游戏信息在所有页面统一应用审核规则，未审核时使用同样的事实性简述。

证据：[game/[slug]/page.tsx](/Users/wanggang/Documents/Codex/PlayBloo/src/app/game/[slug]/page.tsx)、[level/[levelSlug]/page.tsx:34](/Users/wanggang/Documents/Codex/PlayBloo/src/app/game/[slug]/level/[levelSlug]/page.tsx:34)、[level/[levelSlug]/page.tsx:216](/Users/wanggang/Documents/Codex/PlayBloo/src/app/game/[slug]/level/[levelSlug]/page.tsx:216)。

## 必须补做截图验证的 UI 风险

这些项目不能仅靠代码定性为已发生的视觉缺陷：

1. **首页首屏信息负担：** 首个游戏前有介绍、可选资料库、7 类切换、三栏信号面板；手机端三栏变三行，部分面板无内容仍占位。应在 390×844 等视口测量首个可玩入口的位置。
2. **网格徽章与文本密度：** 徽章仅 9px，位于小缩略图上且半透明；多徽章可能遮挡封面、与图像对比不足。需要实际图片和真实标题截图。
3. **列表长标题与手机布局：** 112px 固定缩略图加单行 truncate 标题，在窄屏上可能损失辨认游戏的关键信息；统计和日期可能多次换行。320/360/390 px 应分别查看。
4. **攻略顶部溢出：** 面包屑和固定不收缩的 Walkthroughs 按钮同排，缺少整体换行安排；长游戏名有溢出风险。全局 overflow-x: clip 可能把溢出隐藏，而非解决布局。
5. **游戏横屏高度：** 游戏窗口最小 500px，md 以上 600px，手机横屏或低高度屏幕可能无法同时看到完整游戏和控件；需要真机/模拟视口确认。
6. **信息流选中下划线：** 下划线定位在链接底部之外，父级同时有滚动和裁剪；可能不显示，应检查实际截图与 computed styles。
7. **弹层和焦点：** 手机筛选弹层继承居中 Dialog 的默认位置/动画，再覆盖为底部抽屉；应检查开闭动画、软键盘遮挡、滚动到底后能否提交及焦点恢复。
8. **真实资源与可访问性：** 所有缩略图加载、200% 缩放、Tab 焦点、屏幕阅读器顺序、实际文字对比度、减少动态效果偏好均未验证。

## 建议修复顺序与验收

1. **先保障核心流程：** 01 / 02 / 03 / 04 / 05 / 06 / 09 / 13。分别用平板导航、全屏退出、加载失败、分类筛选、已审核列表内容、仅官网链接的游戏、31 个收藏和错误归属攻略 URL 验收。
2. **再完善反馈与一致性：** 07 / 08 / 10–12 / 14–18 / 22 / 23。覆盖离线/接口错误、越界页码、多标签收藏、快速搜索、未来日期、手机排序语境和键盘操作。
3. **最后调整文案和视觉：** 19–21，以及上述截图风险清单。应在桌面 1440×900、平板 768/1024 px、手机 320/390 px、手机横屏和 200% 缩放下完成截图复验。

建议保留现有的可玩/外部状态区分、收藏的 aria-pressed、本地保存说明、投稿表单的校验与反馈、已审核内容规则及系列排序。修复应围绕现有结构展开，不需要先推翻整个视觉设计。
