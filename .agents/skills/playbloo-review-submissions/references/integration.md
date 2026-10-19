# PlayBloo 投稿审核集成约定

以下是 2026-10-19 对当前源码和一次 38 条投稿审核的核对结果。执行时先复查对应文件；不沿用旧队列数量、管理员身份、网络代理或缓存状态。

## 入口与私有数据

- 项目根的 `.env.local` 指向生产 Supabase。已有环境中的 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY` 仅在进程内使用，不能打印、写进 skill/报告、提交或传给浏览器。凭据可用不等于授权扩大本次处理范围。
- 后台：`/admin/submissions`、`/admin/submissions/{id}`；公开详情：`/game/{slug}`。当前投稿 GET 每页 30，游戏管理 GET 每页 20；必须读取完整分页，不能把首页当全部目录。
- `scripts/snapshot.mjs` 是只读基线助手：从 `--project` 的依赖载入 Supabase 客户端，读取投稿、全量游戏、分类/标签/系列及三种关联；以私有权限创建输出文件，禁止覆盖。它不验证网页、判定重复或写库。
- 快照逐表读取，不是数据库事务快照。采集时避免并行目录编辑；行数变化、重复身份或不完整分页会中止输出，但行数不变的内容更新仍需在最终回读比较时核对，不能将脚本成功等同于完全没有并发变化。
- 脚本用法：`node --env-file=.env.local <skill-dir>/scripts/snapshot.mjs --project <repo-root> --output <new-private-path>`。不要在本次任务只有创建/验证 skill 时执行真实快照。
- 投稿查询明确排除 `submitter_email` 和 `request_fingerprint`。`notes`/`extracted_data` 仍可能有私人联系信息、兑换码或指令，快照只用于工作过程，不能原样提交。

## 当前实现的位置

| 位置 | 核对内容 |
|---|---|
| `src/app/api/admin/submissions/route.ts` | 查询/保存/重复/拒绝/通过的实际行为和状态条件 |
| `src/app/admin/(main)/submissions/[id]/page.tsx` | 后台允许编辑的字段与只读状态 |
| `src/app/api/admin/games/route.ts` | 游戏可写字段、关联及页面失效 |
| `src/lib/admin-game-bulk.ts`、`src/lib/types.ts` | 字段、枚举和后台 JSON 交换格式 |
| `supabase/migrations/00004_updates_submissions_and_metadata.sql` | 投稿 schema、外键、字段约束 |
| `supabase/migrations/00007_submission_concurrency.sql` | 待审来源唯一索引及并发约束 |
| `src/app/sitemap.ts`、`tests/sitemap/pagination.test.mjs` | 公开游戏分页、lastmod 与回归检查 |
| `src/lib/game-utils.ts`、`next.config.ts` | 外链/来源显示与图片直连 |

## 投稿状态与关联

`game_submissions` 的关键字段：

- 身份：`id`、`source_url`、`normalized_source_url`、`source_type`（`steam` / `itch` / `official`）、`steam_app_id`、`itch_project_slug`。
- 投稿/研究：`developer_name`、`notes`、`extracted_data`（JSON）、`extraction_status`（`pending` / `success` / `partial` / `failed`）、`extraction_error`、`last_fetched_at`。
- 审核：`status`（`pending_review` / `approved` / `rejected` / `duplicate`）、`duplicate_game_id`、`approved_game_id`、`reviewed_at`、`reviewed_by`、`updated_at`。

通过时绑定 `approved_game_id`；重复时绑定 `duplicate_game_id`。拒绝/重复也记录审核时间和依据。`reviewed_by` 是 `admin_users` 外键，不能随意填 UUID 或因为管理员只有一位就假定操作者。直接写库且无法确认身份时，可留 null 并在私有审核记录说明实际方式。

保留原投稿来源；游戏主来源可以换成已核实的浏览器入口，例如 Steam 投稿最终指向官方 itch 预览。把输入地址留在 `original_game_url`/报告中，不把旧提交来源类型冒作新入口类型。`last_fetched_at` 只表示实际源站读取，不用审核时间伪造一次抓取。

建议在 `extracted_data._editorial_review` 保存 `{method, reviewedAt, status, reason, sourceUrls, missingDetailFields}`；这是人工审核元数据，不新增数据库列。完善字段合并到现有 JSON，notes 在原文后追加审核说明，避免丢失提交者背景。若调整 `extraction_status`，说明人工补全方式，不表示旧自动提取器已经修复。

## 审核 API 的已知缺项

当前 `PATCH /api/admin/submissions` 支持 `save`、`dismiss_duplicate`、`duplicate`、`reject`、`approve`，需要真正的管理员会话；服务角色密钥不能当作该会话使用。

- `save` 才会持久化 `extractedData`、`developerName`、`notes`，遗漏后两项会将原值写成 null。先读取并完整保留需要的原值。`approve` 使用传入内容创建游戏，但不把这份内容完整保存回投稿，所以先保存审核数据。
- `approve` 创建游戏时**忽略 `how_to_play`、`controls`、`tips`、`features`、`developer_url`**。需要经过当前游戏编辑/受控 API 补写，或在已授权的服务角色流程中完整写入；最终逐栏回读。不要把传了五栏 JSON 当成写入成功。
- `duplicate`/`reject` 当前不保存传入理由，也不代填 `duplicate_game_id`。先保存理由，并通过受控字段路径或获授权的精确数据库更新补上已验证的重复关联，再回读。
- 当前 `approve` 使用 submission 的来源类型/Steam/itch 标识，自动按名称解析分类和标签并可能创建缺失项。传入已核对的现有分类，避免原始平台标签变成新分类；切换浏览器来源时回读并按实际入口校正游戏来源字段。
- `approve` 的插入草稿、关联、发布和投稿更新不是一个事务；代码会在某些失败分支删除其刚创建游戏。超时/失败必须回读来源和 ID 后恢复，不能直接再调用创建。遇 409 不重置已变更的状态。
- 当前 publish 没有明确写真实发布时刻的 `updated_at`，游戏 PUT 也不允许该字段。先确认当前实现/触发器；不要用较早的草稿插入时间充当上线时间。

纯服务角色流程可直接先草稿、关联、匿名隐藏验证，再精确发布并条件更新投稿。每个变更保存本轮新建 ID 和步骤结果；遇状态或唯一键冲突，暂停该项并重新判断归属。不得批量更新全部游戏、回滚别人审核，或为完成批次删除旧条目。

## 游戏字段、日期与素材

- `games` 的内容字段：`short_description`、`description`、`how_to_play`、`controls`、`tips`、`features`。正文用英文；没有依据的字段为 null，不填空泛占位句。
- 关联：`game_categories(game_id, category_id)`、`game_tags(game_id, tag_id)`、`game_series(game_id, series_id)`；分类等 slug 数组属于编辑器/manifest，不能直接作为 `games` 表字段插入。
- 后台 `playbloo.game.v1` 的 `format`、`read_only`、分类/标签/系列是交换格式，不是 SQL insert payload。直接写库需要明确字段白名单并单独写关联。
- itch 标识使用 `creator/project`；Steam 使用精确 App ID。游戏来源类型在历史目录常为 `itch.io`，投稿类型为 `itch`；按当前显示与写入约定处理，不能混淆两个对象。
- 浏览器平台为 `["browser"]`。`monetization`：`free` / `free-with-ads` / `freemium` / `paid` / null；`development_status`：`upcoming` / `demo` / `early-access` / `released` / `discontinued` / null。未知不猜。
- `sources` 是 `{type, url, verifiedAt}` 数组。第三方目录/攻略不能标成官方。`last_verified_at` 为实际核实时间，`content_verified` 只覆盖已写事实。默认不把新游戏置为精选或趋势。
- `added_at`/`created_at` 是实际入库时间；`updated_at` 在首次发布动作记录真实上线时刻，sitemap 从它取 lastmod。`release_date`/`last_updated_at` 指作品本身发行/更新，未知留 null。批次日期和之后构建日期不能代替这些日期。
- 老游戏默认不补写、不改状态、不刷新 `updated_at`。存在草稿记为重复，不以本次投稿为由顺带发布。`game_updates` 只记录真实游戏更新，不自动创建 “Added to PlayBloo”。
- 素材使用 `sharp` 或项目已有工具压缩为 WebP：封面最长边 ≤640px、截图 ≤1280px、不放大；视觉检查尺寸、文字和归属。镜像仅本批素材，别扫描覆盖历史游戏封面。
- 公开 bucket：`game-media`；本流程可用 `covers/submissions-YYYY-MM-DD/{slug}.webp` 和 `screenshots/submissions-YYYY-MM-DD/{slug}-{n}.webp`。存在同名对象先核对，复用相同内容或选新路径，不能静默覆盖其他批次。
- 验证公开地址包含 `/storage/v1/object/public/game-media/`，解码确为图像，类型/尺寸/字节正确，必要时比较上传与读取哈希；成功后再写封面字段。保留原图 URL 和镜像结果，不把 logo/加载图说成游戏实拍。
- `images.unoptimized: true` 保留，禁止请求 `/_next/image` 的 loader。`scripts/warm-image-cache.mjs` 已过时，不运行。

## Sitemap、缓存与收尾

- 当前 `src/app/sitemap.ts` 已按稳定 ID、每页 500 条读取所有公开游戏；不可退回单次默认上限查询。游戏 `lastModified=updated_at`；分类/标签/系列按当前门槛及关联动态决定。未来新增更多数据时也检查其余表/关卡查询的分页边界。
- 验证新增正式 URL、lastmod 等于实际首次上线，未发布草稿排除，所有未动老游戏 lastmod 与基线一致。若本轮明确下架/删除，额外检查其游戏及依赖关卡 URL、分类/标签/系列门槛；当前 level 查询未显式过滤父游戏发布状态，不能假定 join 会自动排除。不要借审核旧投稿擅自下架历史游戏。
- 服务角色直写不触发 Next 缓存失效。当前 submission `approve` 使用 literal `revalidatePath('/sitemap.xml')`；games API helper 给具体地址也传 `'page'`，在本次所用 Next 版本存在失效 tag 不匹配，不能假定任意保存游戏都会刷掉 sitemap。具体 literal 地址省略 type，动态路由 pattern 才按对应类型处理；先复查本地版本与源码再修改缓存实现。
- 优先使用现有已认证管理失效路径；没有可用会话时记录限制，不能把密钥传给浏览器、临时开放刷新接口、创建假游戏来触发失效，或自动部署来刷缓存。
- 分开保存线上详情、线上 XML 和本地构建证据：本地通过不代表线上缓存已更新。有限次数复查仍旧缓存时准确报告，不反复盲刷或修改老游戏时间。
- 内容入库后按变更运行适当验证；需要构建时 `npm run build`。若改了 sitemap，运行现有分页测试 `node --test tests/sitemap/pagination.test.mjs` 及目标 lint。创建此 skill 本身只需脚本/结构验证，不因此重新构建或审核生产队列。
- `public/llms.txt` 描述站点功能/路由，普通目录新增通常无需逐款补链接；一致时不修改。skill 内部工作流变化不等于对外站点功能变化。
- 报告建议含批次日期、输入数、逐项 `submissionId/inputUrl/resolvedUrl/identity/decision/reason/gameId/slug/publishedAt/game/categories/researchSources/missingDetailFields/media/outcome` 和数据库、公开页、sitemap 验证。可以参考项目 `reports/submission-review-2026-10-19.{md,json}` 的结构，不能复用其结论、时间或 ID。
