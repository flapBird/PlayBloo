# PlayBloo 页面实测：布局、交互与信息展示

> 2026-09-13：已按页面报告实施修复并复验，见[修复记录](/Users/wanggang/Documents/Codex/PlayBloo/reports/ui-ux-fixes-2026-09-13.md)。全屏遮挡在后续游戏加载后实际复现，现已修复；本文保留初次检查时的证据状态。

这是同一次持续检查的浏览器阶段，截图采集于 2026-09-09 至 2026-09-12。检查本地工作区服务；恢复服务后地址为 http://127.0.0.1:3001。未修改产品代码，未发布站点，未提交投稿或发送邮件。测试启动游戏产生了正常的计数和本机最近游玩记录。

**结论：页面上确实存在用户可见的问题。** 优先处理平板导航缺失、分类筛选暴露 UUID、320 px 攻略入口被裁切；随后处理首页和启动页面的行动优先级、系列顺序、来源识别文案和内容摘要。基础页面风格统一，多数列表和表单结构正常，不需要推倒重做。

## 覆盖范围与结果

| 步骤 | 实际走查 | 健康程度 |
|---|---|---|
| 1 | 首页：1440×900、820×1180、390×844；手机菜单展开 | 需优先修复：平板导航缺失；手机游戏列表过低 |
| 2 | 搜索、Driving 筛选、列表/网格切换、手机搜索无结果 | 基础交互正常；筛选标签和卡片信息有问题 |
| 3 | 分类目录、Driving 分类；系列目录、Escape Road 系列 | 页面可用；分类发现不完整，系列顺序文案与结果不一致 |
| 4 | Color Block Jam 详情、启动、全屏、Escape 退出 | 详情可用；手机启动层级需调整；游戏实际运行未验证 |
| 5 | Color Block Jam 攻略索引、Level 29；390 与 320 px | 需修复窄屏裁切、关卡辨识；视频实际播放未验证 |
| 6 | 收藏空状态、启动后的最近游玩页 | 空状态清楚；历史页管理与时间信息不足 |
| 7 | 投稿页及填写 example.com 后的即时提示 | 表单布局基本正常；错误认定“官网” |
| 8 | 联系页与邮箱入口 | 信息可读；缺少直接联系动作 |

主要目标是帮助访客找到游戏、判断玩法、开始游玩、查看攻略和再次返回。没有覆盖后台、全部游戏、投稿成功链路、真实手机软键盘、读屏完整流程和跨浏览器兼容性。

## 1. 首页与导航

**P1：820 px 时桌面导航和手机菜单同时消失。** 在 768–1023 px 断点区间，用户失去页头的主要导航入口。统一两组导航的切换断点，验证 767、768、1023、1024 px。

![820 px 首页：页头没有主导航或菜单按钮](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-09/03-home-tablet.png)

**P2：首页手机首屏迟迟看不到游戏卡片。** 390×844 时，第一条游戏记录顶部约在文档 y=926.6 px。介绍、搜索入口、标签栏、三个榜单先占据页面，其中 Recently updated 没有数据仍保留整块区域。对于“找一个游戏马上玩”的目标，建议把游戏列表提到介绍后方，榜单缩为紧凑入口，空更新榜单隐藏或合并。

**P2：手机标签栏的右侧选项被截断，横向滚动提示不足。** 首屏最后一项只露出“Hi…”。可用渐隐边缘、明确的更多入口或较短标签帮助发现其余选项。

![390 px 首页：列表在首屏下方，右侧标签只露出部分](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-09/04-home-mobile.png)

手机菜单本身可以展开、关闭，入口文字清楚；因此问题主要集中在断点配合，而非菜单整体失效。

![390 px 展开的导航菜单](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/29-mobile-menu.png)

## 2. 搜索、筛选与卡片

**P1：应用 Driving 筛选后直接显示数据库 UUID。** 复现：打开 Filters → Genre 选 Driving → Apply。结果为 7 个游戏，但活动条件显示 `13eab6eb-2b1f-49eb-9795-5adcc8be9e64`。用户无法辨认所选分类，长文案又使工具区换行。应显示 Driving，并允许逐项移除条件。

![Driving 筛选后显示 UUID](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-10/08-filter-result-mobile.png)

**P2：列表简介缺乏区分度。** 搜索、分类和系列反复显示“某类别 game you can launch directly on PlayBloo”。Color Block Jam 详情已有玩法和控制说明，列表却没有利用这些信息。优先展示一两句真实玩法摘要，把可在站内启动保留为短标签；源码字段遗漏见原代码报告第 05 项。

**P2：网格封面上的状态标签难以辨认。** 黄色 TRENDING、绿色 PLAY HERE 叠在高饱和封面上，底色过透明，和封面的文字、色块竞争。建议改为稳定的深色底或移到封面下方。这里是截图可见的对比度风险，未作完整 WCAG 数值测量。

![实际手机网格：封面状态标签与图片混在一起](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/12-grid-mobile.png)

![实际桌面网格](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/11-grid-desktop.png)

已通过：390×844 的筛选弹层能完整显示 Apply；列表与网格能切换。手机页头搜索可提交查询；无结果时明确显示 0 games found，并提供 Clear all 恢复路径。

![手机筛选弹层：操作区可见](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-09/07-mobile-filters.png)

![搜索无结果：有明确清除入口](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/30-search-empty-mobile.png)

## 3. 分类与系列

**P2：分类发现入口遗漏已有类别。** 目录与筛选器仅列出 Action、Arcade、Driving、Racing、Survival，但 Color Block Jam 在详情和最近游玩中显示 Puzzle。访客无法从常规分类入口找到该类别。应将“是否展示浏览入口”和“是否达到搜索引擎收录门槛”分开。

![分类目录只有五类](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/20-categories-mobile.png)

Driving 分类页能够显示 7 个游戏，行结构整齐。不过部分卡片只展示 Survival，会弱化“为何出现在 Driving 中”的解释；在分类页优先展示当前匹配类别，其他标签次要展示。

![Driving 分类页与泛化简介](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/21-driving-mobile.png)

**P2：系列宣称按顺序游玩，却先显示续作。** Escape Road 系列页的实际顺序为 Escape Road 2、Escape Road City 2、Escape Road、Escape Road 3、Escape Road City、Escape Road Halloween；并标有 1–6 序号。页面未解释这个顺序的依据。不能仅凭排序代码已存在，就认定内容排序正确。请核对编辑维护的 sort_order；若是推荐顺序，应明确说明，而非笼统宣称系列顺序。

![系列目录：入口清晰](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/22-series-mobile.png)

![系列详情：续作第一、原作第三](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/23-series-detail-mobile.png)

## 4. 游戏详情、启动和全屏

桌面详情的双栏结构、标题和正文整体清楚。Color Block Jam 有具体的 About、How to Play、Controls、Tips 等内容，具备可利用的信息基础。

![桌面详情](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/14-game-desktop.png)

**P2：手机详情中攻略入口压过了启动入口。** 收藏、关卡搜索、紫色攻略按钮、统计信息、标签与预览图都出现在 Launch game 之前，启动按钮接近首屏底部。建议把明确的“开始游戏”放在标题附近或预览图内，攻略作为次级动作；启动统计说明无需占据主要行动区。

**P2：Play Now 与实际动作不一致。** 列表/资料库的 Play Now 先进入详情，详情还需 Launch game；部分启动控件又使用外部跳转图标。建议将“查看详情”“站内启动”“外站打开”按实际动作命名和配图标，减少对一次点击结果的误判。

![手机详情：攻略先出现，启动靠近折叠线](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/13-game-mobile.png)

**加载恢复仍需补齐，但不能认定第三方游戏失效。** 此环境启动后没有验证到可操作的游戏画面，仅观察到加载/黑色区域。页面应提供等待过久时的说明、重试和有文字的外部打开入口。外部资源、网络和嵌入限制均可能影响结果，本次未定位黑屏原因。

**纠正旧结论：全屏遮挡未复现。** 实测进入全屏时，右上角控件可见，页头没有遮住它们，Escape 能退出。旧报告“确定遮挡”的结论已撤回。跨域游戏获取键盘焦点后的 Escape 行为未验证。

全屏截图文件 `16-fullscreen-overlap.png` 的旧命名不代表存在遮挡；它只记录黑色嵌入区域和可见控件，不作为游戏成功运行的证据。`15-game-launched.png` 为加载中的过程记录，不作为稳定游戏页面截图。

## 5. 攻略索引与详情

**P2：索引卡片难以快速辨认关卡。** 两个卡片都把较长的游戏名和 Walkthrough & Guide 重复放进窄列，标题视觉上接近相同的“Color Blo…”。应突出 Level 1、Level 29，游戏名由页面标题统一交代。

![攻略索引：重复前缀挤占关卡标题](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/17-walkthrough-index-mobile.png)

**P1：320 px 攻略页的 Walkthroughs 按钮被右边界裁切。** 面包屑和按钮强行同排，游戏名被挤为三行，按钮伸出视口后被裁掉。应让按钮在窄屏单独一行，面包屑允许合理换行或截断。

![320 px 攻略页：右侧按钮裁切](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/19-walkthrough-320.png)

**P2：Level 29 页标题承诺 Guide，实际缺少文字攻略。** 页面主要是视频嵌入和返回游玩卡片，没有该关卡的步骤、难点说明或备用文字内容。本次视频区域持续为黑色，未验证播放。即使视频正常，增加关键操作步骤也能提高可检索性和失败时的可用性。

![390 px 攻略详情：文字步骤缺失；黑色视频区仅记录受限状态](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/18-walkthrough-mobile.png)

截图可证明布局、标题和文字内容，不能证明视频永久不可用。视频播放本身是本步骤的未完成验证项。

## 6. 收藏与最近游玩

收藏空状态提供 Discover games，且说明保存在当前浏览器、不需要账户，这是清楚的反馈。细节文案“Use the heart on any game”容易让用户误以为列表卡片都有心形按钮；应指向实际的游戏详情页收藏入口。

![收藏空状态](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/24-favorites-mobile.png)

**P2：最近游玩页缺少管理与时间信息。** 启动的 Color Block Jam 已出现，但页面没有删除入口，也没有“上次游玩时间”；小卡片主要显示浏览数和启动数。建议把最近游玩时间放在此场景的主要元数据位置，并提供删除动作。

![最近游玩：记录出现，但缺少时间与删除动作](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/25-recent-mobile.png)

此次没有制造超过 30 条收藏，也没有模拟存储失败；旧报告的容量、同步和异常反馈问题仍属于代码证据，不能升级为浏览器已复现问题。

## 7. 投稿

字段有可见名称，必填与选填区分清楚，人工审核和隐私说明可见。手机端三个流程说明块占用较多高度，可压缩成一行简短说明，让 URL 输入更早进入视野。

![手机投稿初始页面](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/26-submit-mobile.png)

**P2：任意有效 URL 被称为已识别的官网。** 输入 `https://example.com` 后立即显示“Official site detected — an editor will verify the details manually.”。前半句声称已确定网站身份，后半句却说待审核，两者矛盾。建议改成“链接格式有效，将由编辑核实来源”。仅填写了示例 URL，没有提交。

![示例域名也被标为 Official site detected](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/27-submit-url-feedback.png)

## 8. 联系

**P2：邮箱是普通文本，缺少下一步动作。** 四类联系目的容易理解，但邮箱没有 mailto 链接或复制按钮。Game Submissions 区域也未直接链接已存在的投稿表单。增加可点击邮箱、复制反馈和投稿入口，减少用户手动转移信息。

![联系页：邮箱显示为纯文本](/Users/wanggang/Documents/Codex/PlayBloo/reports/screenshots-2026-09-12/28-contact-mobile.png)

## 可访问性与证据限制

- 已观察到：320 px 的可操作入口裁切；图片上的状态标签辨识困难；小号统计文字与 Play 链接偏弱；游戏嵌入控件在可访问树中没有清晰名称；搜索结果有嵌套 main。这些分别影响缩放/重排、辨识、触控和辅助技术理解。
- 已通过的有限检查：手机菜单有 Open/Close 名称及展开状态；搜索输入可以提交；无结果有恢复动作；所测全屏状态能用 Escape 退出。
- 未进行全站键盘顺序、焦点陷阱、屏幕阅读器、对比度量化、真实触控和软键盘测试。因此不作完整 WCAG 合规结论。
- 本地开发服务一度因输出管道 EPIPE 停滞，已换用文件日志恢复。9 月 10 日 `09-grid-mobile.png`、`10-grid-desktop.png` 捕获的是未完成切换状态，已排除；网格结论只采用 9 月 12 日的 11、12 号截图。
- 本地工作区和线上部署的一致性未确认；游戏与视频未验证实际运行。页面黑色嵌入区域仅说明本次测试受限，不等于线上资源永久失效。
- 原代码报告继续保留条件性风险，见[代码检查及修正记录](/Users/wanggang/Documents/Codex/PlayBloo/reports/ui-ux-review-2026-09-09.md)。

## 建议修复顺序

1. 修复导航断点、活动筛选名称、攻略窄屏换行，先消除明确的可见故障。
2. 调整首页和详情的主要行动顺序；补充加载超时、重试和外部打开文案。
3. 校正系列顺序、分类入口、列表玩法摘要和来源识别提示。
4. 完善收藏/历史管理、攻略文字内容、联系动作及可访问性细节。

所有截图来自本次持续审查；这份报告交付检查结果和修复建议，产品实现尚未改动。
