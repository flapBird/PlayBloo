# 用户投稿审核 · 2026-10-21

本轮处理当前 **6 条待审核投稿，6 条全部补全并发布**；重复、拒绝、待处理、失败均为 0。初次读取为 5 条，中断后实时回读新增 Alien Strike，纳入本次审核。仅收录经过核实的浏览器版本。

使用恢复时的完整实时基线：1,049 款游戏（含 7 条草稿）、45 条投稿。发布后目录共 1,055 条，其中公开 1,048 条；既有内容和此前已审投稿均保留。

## 审核结果

| 游戏 / 正式页面 | 分类 | 实际首次上线时间（北京时间） |
|---|---|---|
| [Letter Sweep](https://playbloo.net/game/letter-sweep) | puzzle, educational, casual | 2026-10-21T20:47:17+08:00 |
| [Box Claim](https://playbloo.net/game/box-claim) | board-game, strategy, multiplayer | 2026-10-21T20:49:16+08:00 |
| [Dead Centre](https://playbloo.net/game/dead-centre) | puzzle, casual | 2026-10-21T20:50:03+08:00 |
| [Afterimage](https://playbloo.net/game/afterimage-bludle) | puzzle, casual | 2026-10-21T20:54:53+08:00 |
| [Word Bridge](https://playbloo.net/game/word-bridge) | puzzle, casual | 2026-10-21T20:57:46+08:00 |
| [Alien Strike](https://playbloo.net/game/alien-strike) | educational, trivia, arcade | 2026-10-21T20:57:57+08:00 |

## 去重与资料

- 先读取全部公开游戏与草稿，按官方专属来源、稳定项目身份、重定向和 slug 核对；每款创建前再次实时查库。作者主页和共享品牌不作为同款依据。
- 库里已有 Recks Studio 的 AfterImage（/game/afterimage），与 Bludle 的颜色记忆游戏是不同作品。本次使用 /game/afterimage-bludle，未覆盖或改动原记录。
- Letter Sweep 为主题找词，后续引入斜线及反向查找；Box Claim 为电脑或同设备双人点格棋，未写成联机对战。两款有广告集成，标为 free-with-ads。
- Dead Centre 按官方当前规则写成 8 轮位置记忆；Afterimage 为 5 轮 RGB 颜色重建；Word Bridge 是每日双向搭词且有 3 次机会。没有直接照搬投稿简介。
- Alien Strike 按官方说明及静态程序核实五次攻击、一次替换目标、瞄准操作、距离计分和纽约午夜重置。排行榜达到至少 20 次每日完成后才显示，文案保留条件。官网未独立确认提交者 funifygame 的开发者署名，相关字段留 null。
- 六款均补齐英文短简介、介绍、玩法、操作、技巧及特性，关联既有分类，记录来源和实际核实时间。未知作者、引擎、开发阶段、精确发行或更新时间等按逐项依据留空；详情与缺项见 JSON manifest。
- 仅静态核实公开网页和程序帮助，没有声称完整试玩，没有创建账号、发送消息或付费。

## 素材与写入

- 6 张官方封面压缩为 WebP，最长边不超过 640px、不放大，共 148,022 字节；已目视检查并逐张验证公开读取、类型和 SHA-256。对象路径为 game-media/covers/submissions-2026-10-21/。
- Croko 和 Bludle 使用官方品牌/分享封面；Alien Strike 使用官方指定的 Earth 地图素材，不称为实际游戏截图。本批没有额外截图。所有图片直连公开原图，未启用 /_next/image，也未运行旧优化预热脚本。
- 每款先创建未发布草稿、写入分类、回读所有字段和关联，并确认匿名不可见，再以实际发布动作显式写 updated_at。发布成功后按精确 submission ID、pending_review 和原 updated_at 条件更新为 approved，并设置 approved_game_id。
- 保留原投稿来源和 notes，将完整核实字段及 _editorial_review 合并回 extracted_data，保存审核时间与理由。原自动 extraction 状态保留，不将人工补全冒充自动提取修复。
- 服务角色审核未冒用管理员身份，reviewed_by 为 null；人工方式与依据已记录。没有创建 Added to PlayBloo 游戏版本更新，也没有修改既有游戏。

## 验证

- 6/6 投稿 approved 状态及游戏关联正确；新草稿匿名隐藏、发布后匿名可读。所有新游戏元字段、五栏、分类与来源均回读确认。
- 6/6 线上详情 HTTP 200，实际标题、五栏全文、游玩外链及镜像封面均通过；短简介数据库回读正确，页面 meta 按当前介绍截断规则核验通过，页面无 /_next/image。
- 比较原有 1,049 条游戏所有非统计字段、发布状态和时间戳，以及原有分类/标签/系列关联，均未变。自然访问、游玩与热度计数单独排除。此前已处理投稿状态和时间戳未变。
- 现有 sitemap 与游戏缓存回归测试 7/7 通过。直接执行当前 sitemap.ts 的游戏目录生成逻辑并访问实时数据库；为隔离其他正在编辑的内容，独立 Guides 生成器旁路为 []，本次未执行完整应用构建。

## Sitemap 与 llms.txt

- 实际目录生成器收录全部 1,048 个公开游戏；本批 6/6 正式 URL 收录，lastmod 与实际首次发布时刻一致。1,042 个旧公开游戏日期未变，原有草稿未收录。本轮无下架、删除或新增关卡。
- 线上 sitemap HTTP 200，当前收录本批 0/6，发布时间匹配 0/6；前后可比较的 1,042 个旧 URL 日期变化 0 条。线上仍有缓存滞后；服务角色写库不会触发缓存失效，未通过部署或改旧日期强刷。
- 当前代码的游戏缓存失效已集中在 revalidateGameChange，旧 skill 参考的历史 page-tag 限制不再适用；本轮直接写库未调用该认证路径，所以仍分别记录线上与实际生成器结果。
- public/llms.txt 已检查，其浏览器目录、外链游玩和游戏路由说明仍适配本批；保留其已有 Guides 改动，本轮无需编辑或提交该文件。

## 交付

数据库、投稿状态与公开素材已经生效。本地仅提交本报告和 JSON manifest，不部署、不 push；保留用户/其他任务已有的暂存、未暂存和未跟踪文件。报告没有复制私人投稿 notes、联系邮箱、请求指纹或凭据。
