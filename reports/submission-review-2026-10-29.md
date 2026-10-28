# 用户投稿审核 · 2026-10-29

本轮处理当前 **1 条待审核投稿，核实为纯下载版 Steam 游戏并拒绝**；通过、重复、待处理、失败均为 0。处理后待审队列清零（其余 48 条投稿已在此前三轮批次处理完）。

使用完整实时基线：1,131 款游戏、47 条投稿（含历史终态 38 approved + 10 rejected）+ 1 条新建待审。快照采集于 2026-10-28T16:40:06Z；写库前对目标投稿做了实时状态复核（status 仍为 `pending_review`，`updated_at` 与快照一致）。

## 审核结果

| 投稿 | 判定 | 依据 |
|---|---|---|
| [Constraints](https://store.steampowered.com/app/2156350/Constraints)（Steam App ID 2156350，Above Constraints / Mauro Leoci） | **rejected** | 仅 Windows 下载版（Unreal Engine 5v5 多人动作游戏，Q4 2026 才开 Early Access，需 Above Constraints 三方账号），无任何可验证浏览器版本 |

## 身份与去重

- 投稿来源为 Steam 提交（`steam_app_id=2156350`，`source_type=steam`），开发者身份经工作室页 aboveconstraints.com/who-we-are 与公开搜索交叉确认（一人工作室，Mauro Leoci）。
- 写库前三重查库（steam_app_id、slug=`constraints`、标题模糊匹配，含未发布草稿）：0 命中，不构成重复，也未据此创建任何游戏记录。

## 浏览器版本核实（2026-10-29）

- **Steam 商店页**：平台仅 Windows；状态为 "Coming Soon To Early Access"（计划 Q4 2026），免费开测；Unreal Engine；要求第三方 Above Constraints 账号；页面通篇无浏览器游玩选项、无 itch.io 或 web demo 链接。
- **官网 playconstraints.com**：一次抓取返回 HTTP 500——按约定 500 不单独作为结论，改用第二个抓取器成功取回内容：纯营销页（operators、匹配机制、地图、社区），无任何浏览器游玩入口。
- **工作室页** aboveconstraints.com/who-we-are：发行渠道为 Steam 与移动端应用，无 web 版本。
- **itch.io 搜索**：无名为 Constraints 的游戏，无 Above Constraints / Mauro Leoci 开发者。
- **两组 web 搜索**：均未发现任何浏览器/HTML5/web demo 版本。

结论：按既定规则「仅收录有可验证浏览器版本的单款游戏，下载版投稿标记拒绝」，判 `rejected`。拒绝理由基于核实到的页面内容，而非个别抓取失败。

## 写入与验证

- 条件更新：精确 ID + `status=pending_review` + 快照 `updated_at=2026-10-28T01:50:46.773+00:00` 三重条件，返回 1 行，无并发覆盖。
- 回读：`status=rejected`，`reviewed_at=2026-10-28T16:42:53.356Z`（北京时间 2026-10-29 00:42:53），`reviewed_by=null`（本机无管理员会话，服务角色直写，不冒用管理员身份）；`duplicate_game_id`/`approved_game_id` 均空。
- 原 `notes` 保留并追加审核说明；原自动提取字段全部保留，`extraction_status=success` 未改（自动提取确实成功过）；`_editorial_review` 记录 method/status/reviewedAt/reason/4 个来源 URL。
- 本轮未创建、未修改任何游戏行，未触碰分类/标签/系列及关联；无批量写操作。

## Sitemap、缓存与 llms.txt

- 拒绝不产生目录条目，本批无游戏上线/下架/删除，sitemap 按设计不受影响：未改任何游戏时间戳、未触发重新生成，sitemap 回归测试未重跑（输入未变）。
- 无新增公开页面，无需页面/缓存验证；`public/llms.txt` 无站点功能变化，未修改。

## 交付

数据库已生效（投稿终态 rejected，待审队列 0）。本地提交本报告与 JSON manifest，不部署、不 push。报告与 manifest 不含投稿人邮箱、请求指纹、凭据或快照私人 notes 原文。

Manifest：[submission-review-2026-10-29.json](./submission-review-2026-10-29.json)
