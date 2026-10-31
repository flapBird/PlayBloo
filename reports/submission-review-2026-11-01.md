# 用户投稿审核 2026-11-01

待审队列 3 条（全部 Bludle 官方站投稿，extraction_status=partial）→ **3 款全部通过并发布**，0 重复、0 拒绝、0 待处理。

| 游戏 | slug | 分类 | 收费 | 上线时间（CST） |
|---|---|---|---|---|
| [Second Sight](https://playbloo.net/game/second-sight) | second-sight | puzzle, casual | free-with-ads | 2026-11-01 01:41:13 |
| [Rulebreaker](https://playbloo.net/game/rulebreaker) | rulebreaker | puzzle, casual | free | 2026-11-01 01:41:15 |
| [Word Mash](https://playbloo.net/game/word-mash) | word-mash | puzzle, casual | free | 2026-11-01 01:41:17 |

## 去重与判定

- 基线快照（53 条投稿 / 1160 款游戏）+ 实时查库：3 款均无同身份记录（Bludle 已上架的是 Dead Centre、Afterimage、Word Bridge、Werdle，互不同款）；标题/slug 无候选冲突。插入前逐款再次实时查重（slug + external_url + 标题 ilike）。
- 三款都在发行商官网独立路径直接可玩，符合"仅收录可验证浏览器版本"的既定规则；官方页 + 官方 JS 静态阅读核实规则，未声称完整试玩。
- Second Sight 页面有广告卡（class="ad-card" / Advertisement）→ `free-with-ads`；Rulebreaker、Word Mash 页面无广告标记 → `free`。
- 元字段按既有 Bludle 惯例：developer=Bludle、developer_url=官网、platforms=['browser']、source_type=official、meta_title/meta_description/editorial_take 留空、release_date/engine/graphics/development_status 依据不足留 null。

## 玩法核实（官方页 + 官方脚本静态阅读）

- **Second Sight**：每日 10 轮色彩记忆比较；先后看两个颜色，判断变亮/变暗/变鲜艳/变淡或红绿黄蓝偏移（8 个维度）；答案后并排揭示并说明变化的维度。secondsight.js 证实答题面板支持数字键 1-8 选择。
- **Rulebreaker**：每日密码传输；搭建自上而下即时重跑的规则链（字母移位、镜像、倒序、旋转、元音循环、词序等模块，含干扰项），信号清晰度表从 Static 到 Clear，3 条递进提示，首条传输自带正确模块只需调参（KHOOR→HELLO）。
- **Word Mash**：每日双线索猜词（最多 6 次），把两个答案按首尾字母重叠熔接成一个词（star + artist = startist，重叠字母只写一次）；script.js 证实 streak 与 last-win 存浏览器本地。

## 素材

- 3 张官方品牌/界面图压缩为 WebP（640px 宽、不放大，共 39,940 字节），路径 `covers/submissions-2026-11-01/`，公开 URL 逐张验证（HTTP 200、image/webp、SHA-256 一致、cache-control max-age=604800）。无截图，无生成图。

## 写入

- 每款先插 `is_published=false` 草稿 → 写 puzzle/casual 关联 → 全字段回读一致 → 匿名客户端确认草稿不可见 → 以真实时刻显式发布（updated_at=上线时刻）→ 按精确 ID + `status=pending_review` + 基线 `updated_at` 条件更新投稿为 `approved` 并绑定 `approved_game_id`，返回行数核对为 1。
- `extracted_data` 合并 `_editorial_review`（method/reviewedAt/reason/sourceUrls/missingDetailFields），原 notes 保留并追加审核标记；原 extraction_status=partial 不改写、不冒充自动提取修复。服务角色审核不冒用管理员，`reviewed_by` 为 null。
- 未创建 "Added to PlayBloo" 版本记录（投稿审批不产生 game_updates，按约定）。

## 验证

- 3/3 投稿终态 approved、绑定正确；3/3 游戏已发布、未精选/未趋势、匿名可读、分类关联正确。
- 老游戏基线对比：1160 款全部非统计字段 **0 变化**（view/play/hot 计数自然漂移单列）。
- 线上 3 个详情页：HTTP 200，五栏（description/how_to_play/controls/tips/features）、外链游玩按钮、官方封面全部渲染；0 个 `/_next/image` 引用；标题为默认 `{title} - Game Details | PlayBloo`（均 ≤60 字符）。
- sitemap 本地生成器（真实 catalog 逻辑 + 实时库）：1190 条；3/3 新 URL 收录且 lastmod=实际上线时刻；1153 款老游戏 lastmod 不变；7 条草稿全部排除；回归测试 `tests/sitemap/pagination.test.mjs` 5 pass / 0 fail。
- 线上 sitemap.xml 与首页信息流此时尚未出现新条目（ISR/CDN 缓存滞后；服务角色直写不触发 Next 缓存失效，无管理员会话可用失效路径）——如实记录，不强刷、不改老游戏日期。llms.txt 与现状一致，未改动。

## 交付

数据库与素材已生效；线上详情页已可访问，sitemap/首页随缓存自然刷新。本轮仅提交本报告与 JSON manifest，不部署、不 push；保留其他未跟踪文件。
