# PlayBloo 集成参考

这份参考记录 2026-10-08 已验证的结构。执行新批次时读仓库当前实现；不要把此文件当作永不变化的数据库契约。

## 定位与字段

- 项目：`/Users/admin/Documents/Codex/PlayBloo`；站点：`https://playbloo.net`；正式游戏路由 `/game/{slug}`。
- 类型：`src/lib/types.ts`；SQL：`supabase/migrations/`，尤其 00001、00003、00004；后台批量单游戏 JSON 格式：`src/lib/admin-game-bulk.ts`。
- `games` 主表；`game_categories(game_id, category_id)`、`game_tags`、`game_series` 是关联表。分类从当前库匹配，不按标题自动新建；tags/series 无依据则不填。
- 管理 API：`src/app/api/admin/games/route.ts`，需已认证管理员，提供受控字段写入及受影响页面失效。其创建接口会在关联插入前返回游戏数据，因此仍须回读关联是否完整。
- `src/app/api/admin/import/route.ts` 的旧 CSV 接口仅覆盖部分字段，不自动完成去重、研究、完整元数据与分类流程；不要误以为上传 CSV 就完成本 skill。
- 服务角色客户端：`src/lib/supabase/admin.ts`。若现有环境授权用服务角色直接批量操作，可读 `.env.local` 的 `NEXT_PUBLIC_SUPABASE_URL` 与 `SUPABASE_SERVICE_ROLE_KEY`；只在进程内使用，不能打印、写入报告/skill、提交或传给浏览器。安装 skill 不包含任何密钥。
- 后台单条 JSON `playbloo.game.v1` 的 `format`、`read_only`、分类 slug 数组等是编辑器交换格式，**不是直接可插入 games 的数据库 payload**。入库需移除非表字段，并单独处理关联。

## 重要映射

| 字段 | 约定 |
|---|---|
| `itch_project_slug` | `creator/project`，不能只存项目路径；数据库有唯一索引 |
| `steam_app_id` | 已确认的 App ID；数据库有唯一索引 |
| `source_type` | games 的既有 itch 条目为 `itch.io`；submission 工作流用 `itch`，两者不要混淆 |
| `source_url`, `original_game_url`, `itch_url` | 游戏专属来源；保留可用项目入口和原始来源的可追溯性 |
| `external_url` | 真实外链游玩入口；目前 itch 导入默认用官方项目页外链游玩 |
| `iframe_url` | 无经确认可用嵌入入口则为空 |
| `sources` | JSON 数组，元素 `{ "type": "guide", "url": "https://…", "verifiedAt": "实际 ISO 时间" }`；type 是字符串，可记录 official/review/community 等真实来源类别 |
| `last_verified_at` | 实际核实时间，不是清单指定日期 |
| `content_verified` | 核实过已写内容才为 true；无核心依据的草稿为 false |
| `platforms` | 当前浏览器版本为 `["browser"]`，其他平台须核实 |
| `monetization` | `free` / `free-with-ads` / `freemium` / `paid`，未知为空；区分免费试玩与付费扩展范围 |
| `development_status` | `upcoming` / `demo` / `early-access` / `released` / `discontinued`，未知为空；不要把 prototype 字符串直接塞进受约束枚举 |
| `screenshots` | JSON URL 数组，只有实际作品图片才填 |
| `added_at` | 实际入库时间；数据库默认 NOW()，不可按历史批次日期回填 |
| `release_date` | 作品实际发行日，未知为空 |
| `last_updated_at` | 有依据的游戏更新日期，不能使用导入、文案补充或部署时间 |
| `is_published` | 先 false，检查完成后按用户本批要求发布 |
| `is_featured`, `is_trending` | 默认 false，不能为新导入项目随意置 true |

数据库可空字段使用 null；后台交换格式部分字段要求空字符串，两者应按实际入口转换。浏览器外链版是否收费、可玩范围、是否只有演示等，要写清当前版本。公开页面不显示的依据和缺项理由保存到报告。

## 图片与加载速度

此前直接用大型 `img.itch.zone` 图片影响访问速度。已有成功路径是镜像真实作品封面到 Supabase 公开 bucket `game-media`，对象路径 `covers/{batch-date}/{slug}.webp`，封面保持比例、最长边不超过 640px、不放大，选择能保留封面文字的 WebP 质量。

公开 URL 必须完整包含 bucket：

```text
{SUPABASE_URL}/storage/v1/object/public/game-media/covers/{batch-date}/{slug}.webp
```

验证上传成功、公开访问为图片、Content-Type 与字节一致，再设置 `thumbnail_url`。记录原图 URL、优化图 URL、尺寸与字节数；同一对象路径已存在时先核对，不盲目覆盖其他批次资产。不能把 HTML 错误页上传成图片。报告不需提交原图或网页全文。

使用项目已有图片工具，或已有 sharp/Pillow 等压缩；无需为此换技术栈。`scripts/warm-image-cache.mjs` 可按其当前实现预热图片，先阅读参数与范围；验证本批实际 `/_next/image` URL 即可，不必无条件预热全站。动态游戏截图需要保留动态内容时不要强制转成单帧封面。

## 写库可靠性与日期

- 完整分页读取现有 games 及必要关联、记录修改前基线。Supabase 单次查询结果上限不能假定足以覆盖未来目录。
- 写入 manifest 的每项含稳定身份、目标 slug、决策和字段。入库前重新检查；先 insert 草稿，再写关联并回读；只按明确 ID 发布已验条目。
- 请求超时先按稳定身份查库；保存每项成功 ID，失败重试只处理未完成项。重复执行应新增 0 条，不 upsert 覆盖现有条目。
- 仓库 SQL 中 `games.updated_at` 有默认 NOW()，但不能假设数据库具备自动更新触发器；当前管理 API 的可写字段也不包含它。确认实际数据层行为：直接写库时，仅对本批新条目在正式发布的同一操作写入真实 `updated_at`，并回读验证；经管理 API 发布时核对其结果，不合要求则修复本批发布路径，不批量改旧游戏。先完成文案和关联再发布，不能把早先的草稿创建时间作为上线日期。
- 已有草稿默认属于“系统已收录”，本批去重跳过；如用户明确要求发布旧草稿，另行核实，并使用这次真实上线时间。
- 不为导入建立 `game_updates`；该表表示真实游戏版本/内容更新，`Added to PlayBloo` 会误导其含义。

## 缓存、sitemap 与 llms.txt

- `src/app/sitemap.ts` 动态生成 `/sitemap.xml`，当前 `revalidate=3600`；游戏取公开 games，`lastModified=games.updated_at`。实际以执行时源码为准。
- 认证管理 API 会尝试 `revalidatePath`；直接操作 Supabase 不会自动刷新 Next/Vercel 页面缓存。优先使用已有认证失效路径，服务角色密钥不能替代管理员会话，也不要临时开放无鉴权刷新接口。
- 验证正式线上 XML 包含本批新增游戏、lastmod 是真实首次上线日期、草稿不出现，且未改动老游戏时间戳。如果变更了下架状态，还须验证相关 level 页面及分类/标签/系列收录条件，遵循 AGENTS.md。
- 本地构建可验证生成数据，但不能证明边缘缓存已更新。有限次数复查后仍旧缓存，记录待刷新及所需手段，不反复盲刷或自动 push/deploy。
- `public/llms.txt` 是静态文件，DB 写入不能发布本地文件修改。核对其路由和功能描述；普通目录新增往往无需修改。报告明确哪些是在线 DB 内容、哪些是本地文件和待部署内容。
- `npm run build` 会查询当前数据库并生成公开游戏页；校验本批路由覆盖，检查 `generateStaticParams` 当前上限，超出上限不表示该路由不可访问，但需确认实际按需渲染行为。

## 报告内容

默认 `reports/game-import-{batch-date}.md` 与同名 `.json`；同日多批追加可区分后缀。续做已有 itch 批次可以沿用其原路径。

JSON 建议保留：

- `batchDate`, `inputCount`, `entries`, `verification`；每项 `index`, `inputTitle`, `sourceUrl`, `resolvedUrl`, `identity`, `decision`, `reason`, `gameId`, `slug`, `publishedAt`。
- `game`（实际写入字段）、`categories`、`detailResearchSources`（URL、时间、支持字段/事实、版本范围）、`missingDetailFields`。
- 图片镜像与压缩结果、逐项写入/发布结果、线上详情验证及 sitemap 结果；状态未完成的步骤不得记为成功。

明确计数口径：每条输入恰有一个终态（新增公开、新增草稿、重复跳过、其他跳过、失败/待处理）；研究扩写数量与发布数量分开统计。不要把“已有游戏数 + 输入数”当成新目录数。可参考项目 `reports/itch-import-2026-10-08.*` 的可追溯结构，但不照抄旧来源政策或旧缓存结论。
