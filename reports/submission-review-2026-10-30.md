# 用户投稿审核 · 2026-10-30

本轮处理当前 **1 条待审核投稿，核实为合格浏览器游戏并通过发布**；重复、拒绝、待处理、失败均为 0。处理后待审队列清零。

使用完整实时基线：1,131 款游戏、50 条投稿。快照采集于 2026-10-29T16:0xZ（`/tmp/playbloo-review-snapshot-1029-b.json`，私有）；写库前对目标投稿做了实时复核（status 仍为 `pending_review`，`updated_at` 与快照一致）。

## 审核结果

| 投稿 | 判定 | 结果 |
|---|---|---|
| Number Beasts: Bond Lab（官方投稿，https://beast.rork.app/lab ，Honest Little Apps） | **approved** | 新建并发布 [number-beasts-bond-lab](https://playbloo.net/game/number-beasts-bond-lab)（game id `2f26d352-498c-4511-8745-2e99bb601261`），发布时刻 2026-10-29T16:08:24.624Z（北京时间 2026-10-30 00:08:24） |

## 身份与去重

- 投稿来源为官网提交（`source_type=official`），发行商署名 Honest Little Apps。身份链核实：beast.rork.app 页脚 © 2026 James Gray；Honest Little Apps 工作室站（honestlittleapps.netlify.app）收录 Number Beasts: Bond Lab 应用页；App Store listing id6817125699 开发者为 James Gray。发行商品牌与个人开发者指向同一身份。
- 快照 + 写库前双重查库（slug、source_url、external_url、official_website_url、标题关键词，含未发布草稿）：0 命中，非重复。iOS App（id6817125699）是独立原生版本，不构成同款合并对象；本记录只收录浏览器版。

## 浏览器版本核实（2026-10-29，实机操作）

- **实机试玩验证**：在浏览器中打开投稿 URL，完整渲染出 45 关关卡选择（三个世界 + Daily Lab，Stage 1 解锁）；进入 Stage 1 后实际操作——移动发射器对准 Beast 6、按下 Launch，完成 `4 + 6 = 10` 的 bond，界面显示 "Stage clear · 3 of 3 stars"。发射、瞄准辅助预览、par 计数、失败/通关对话框均真实工作。这是**实际游玩验证**，非仅静态阅读。
- **游戏页**（beast.rork.app/lab）：确认 Bond/Feed/Bridge/Spill 四种机制说明、45 关内置求解器保证可解、Daily Lab 每日同一随机种子、辅助瞄准可开关；页内键盘帮助（arrows 移动、Q/W/E 角度、1-9 选数字、Space 发射）与实机界面一致。
- **官网**（beast.rork.app）：声明完全免费、无广告、无内购、无账号、无追踪；进度存本机、加载后可离线；iOS 版为独立应用且进度分开。App Store 链接在部分地区尚未指向 listing（官网 FAQ 称 iOS 版 "on its way"），与本审核无关（仅收录浏览器版）。
- **工作室应用页**（honestlittleapps.netlify.app/apps/number_beasts）：机制描述与浏览器版一致。其 Beast Workshop、英雄道具等仅见于 iOS 版描述，浏览器版未验证到，未写入 features。

结论：有可验证、可实机游玩的浏览器版本，判定合格。

## 内容与素材

- 五栏全部基于核实事实英文撰写：`description`（目标、bond/feed/bridge/spill 循环、三世界与版本范围、免费无账号）、`how_to_play`（选关、移动/瞄准/发射实际步骤）、`controls`（鼠标/触屏 6 项 + 键盘 4 项，均来自实机界面帮助文本）、`tips`（基于已证实机制）、`features`（45 关、Daily Lab、辅助瞄准、par 与三星、免费、键鼠触控支持）。
- 字段：`platforms=["browser"]`、`monetization=free`、`development_status=released`、`multiplayer=single-player`、`source_type=official`、`external_url` 指向已核实入口（默认外链播放器，不猜 iframe）；`release_date`、`engine`、`publisher` 留空/null（无依据），`missingDetailFields` 已记录。
- 分类：`puzzle`、`educational`（投稿建议的两项，库内既有）；标签：`single-player`；未关联系列。
- 素材：封面使用该游戏官网自己的 og-image（官方品牌图，1200×630 → 640×336 WebP，27KB），镜像至 `covers/submissions-2026-10-29/number-beasts-bond-lab.webp`；截图 1 张为审核实机操作时第一方截取的真实浏览器画面（964×1280 WebP，20.8KB），镜像至 `screenshots/submissions-2026-10-29/number-beasts-bond-lab-1.webp`。两个公开 URL 均验证 200 + `image/webp` + RIFF 头 + 字节数一致，上传前确认无同名对象。未使用通用图库或完整版冒充图。

## 写入与验证

- 服务角色直写流程：插入草稿（`is_published=false`）→ 写入 2 条分类 + 1 条标签关联 → 匿名客户端确认草稿不可见（0 行）→ 条件发布（`is_published=true` + 真实 `updated_at=2026-10-29T16:08:24.624Z`，匹配 1 行）→ 回读全部字段正确。
- 投稿条件更新：精确 ID + `status=pending_review` + 快照 `updated_at` 三重条件，返回 1 行 → `status=approved`、`approved_game_id` 绑定、`reviewed_at=2026-10-29T16:08:25.227Z`。`reviewed_by=null`（本机无管理员会话，服务角色直写，不冒用管理员）。原 notes 保留并追加审核说明；原 `extracted_data` 保留并合并 `_editorial_review`（method/reviewedAt/status/reason/4 个来源 URL/缺项）；`extraction_status=partial` 未改（自动提取确实只是部分成功，人工补全记录在 `_editorial_review`）。
- 基线比较：全部 1,131 款既有游戏的 title/slug/updated_at/is_published/正文/cover_url 与快照逐一比对，**0 差异**；发布数 1124→1125、草稿 7→7，恰好 +1。未触碰分类/标签/系列表本身及任何老游戏行。

## 公开页、sitemap 与缓存

- 线上详情页 https://playbloo.net/game/number-beasts-bond-lab HTTP 200：标题、五栏（How to Play / Controls / Tips & Tricks / Features）、`beast.rork.app/lab` 外链入口、镜像封面均已渲染；页面无任何 `/_next/image` 引用（图片直连约定保持）。
- **sitemap**：本地构建 `/sitemap.xml` 共 1,199 条 URL（+1），新游戏已收录且 `lastmod=2026-10-29T16:08:24.624Z`（等于实际首次发布时刻，非提交/创建/构建时间）；7 款草稿未收录；抽查老游戏（color-block-jam、dead-centre）lastmod 与基线 `updated_at` 完全一致。本轮无下架/删除。
- **线上缓存限制**：服务角色直写不触发 Next 缓存失效。截至报告时，线上 `/sitemap.xml` 仍为旧版（1,198 条，无新游戏）、首页最新列表未见新游戏——详情页本身是动态/新页可直接访问。无可用管理员会话执行受认证的缓存失效，不为此开放无鉴权接口、不自动部署；待下次部署或缓存自然过期后线上 sitemap 将包含新条目。
- `public/llms.txt` 为站点功能描述、无逐款清单，本轮无需修改。

## 交付

数据库已全部生效（游戏发布、投稿终态 approved、待审队列 0）；代码零改动，无部署需求。本地提交本报告与 JSON manifest（不含投稿人邮箱、请求指纹、凭据或快照私人 notes 原文），不 push。

Manifest：[submission-review-2026-10-30.json](./submission-review-2026-10-30.json)
