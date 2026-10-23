---
name: itch-game-import
description: PlayBloo（playbloo.net）itch.io 新游戏批量入库的完整工作流。当用户提到「itch 新游戏 / 新游戏速递 / itch 导出 / 雷达导出数据要加进 PlayBloo / 批量添加 itch 游戏 / 入库这批游戏」，或贴出「# itch.io 新游戏速递」格式的 Markdown，或要求完善 itch 游戏详情、上传游戏截图封面到 PlayBloo 时使用——即使没有明说"用 skill"。
---

# itch.io 新游戏批量入库（PlayBloo）

把 SEO 控制台 itch 雷达每日导出的新游戏，做成 PlayBloo 生产库里的完整游戏详情页：抓取官方页面补全详情 → 撰写英文文案 → 写入 Supabase（games + 分类 + Updates）→ 封面镜像到自家存储。所有游戏是外链游玩（`external_url` 指向 itch 页面），不做 iframe 内嵌。

**先读 `references/pitfalls.md`**（每一项都是真实事故），写作细节和分类映射在 `references/content-guide.md`。

## 环境事实

- 运行目录：PlayBloo 仓库根。`.env.local` 里的 Supabase **就是生产库**（service role key，写入即上线）。
- itch.io 页面直连不通 → 走本地代理 `http://127.0.0.1:7890`（脚本默认）；supabase.co 必须直连（脚本已内置）；`img.itch.zone` 直连可达。
- 站点前端套了 Cloudflare，非浏览器 UA 会被 403——打站点的脚本一律带浏览器 UA。

## 流程

### 1. 拿批次数据
用户粘贴的「# itch.io 新游戏速递 · YYYY-MM-DD」导出 Markdown 就是数据源，存成文件（如 `/tmp/itch-import/export.md`）。若没有，让用户从 SEO 控制台（需登录）复制导出，或提供登录凭据后由你抓取 `/itch/export?date=...`。**不要**查 SEOGrowthManage 本地 SQLite（是旧库）。

### 2. 抓取详情（parse_and_fetch.py）
```bash
mkdir -p /tmp/itch-import && python3 .agents/skills/itch-game-import/scripts/parse_and_fetch.py \
  /tmp/itch-import/export.md /tmp/itch-import/enriched.json
```
产出 enriched.json：每款游戏的 og:image / og:description / 作者 / Genre / 引擎 / 截图 / 页面正文。结尾会列出抓取失败清单——404 的游戏已下架，记录后跳过；网络类失败重跑一次。

### 3. 撰写文案（模型手工活，最花工时的一步）
按 `references/content-guide.md` 的格式和写作规则，为每款游戏写 content.json（英文 description/how_to_play/controls/tips/features + **editorial_take/meta_title/meta_description 原创性三件套（必写）** + 分类 + engine/graphics 等）。铁律：**只写页面里有依据的内容**，信息薄就写薄；short_description/meta_description 必须原创改写、不得照搬 og:description；demo 标 `development_status: "demo"`。52 款约需 1-2 个大批次写入。

### 4. 入库（import_games.py）
```bash
# 先 dry-run 看校验结果（查重/字段/分类合法性）
python3 .agents/skills/itch-game-import/scripts/import_games.py \
  /tmp/itch-import/enriched.json /tmp/itch-import/content.json --dry-run
# 确认无误后正式执行（games + game_categories + game_updates 三表）
python3 .agents/skills/itch-game-import/scripts/import_games.py \
  /tmp/itch-import/enriched.json /tmp/itch-import/content.json
```
PROBLEM 行必须清零再执行正式入库。脚本会自动查重（slug / itch_project_slug / external_url 对 DB 和批内）、创建每款游戏的 "Added to PlayBloo" Updates 记录（否则前台 Updates 模块永远空白）。

### 5. 素材镜像（mirror_media.mjs）
```bash
node .agents/skills/itch-game-import/scripts/mirror_media.mjs \
  --enriched /tmp/itch-import/enriched.json --batch 2026-10-21
```
把 `img.itch.zone` 的封面与截图转存到 Supabase Storage 公开 bucket `game-media`（`covers/<日期>/`、`screenshots/<日期>/`），并 PATCH `thumbnail_url` 与 `screenshots`——图片从此走自家存储直连（站点已全局关闭 Vercel 图片优化），不再受 itch 热链影响。**不要直接热链 itch 封面**（国内访客裂图，这是加镜像机制前的事故形态）。

- **GIF 封面/截图必须保留动效**：脚本对 GIF 走 ffmpeg + libwebp 转成**动画 WebP**（封面 6fps/560px/q42，截图 10fps/640px/q52），sharp 不能用（会把帧拼成超高长条）。转完按帧校验：libwebp 解码后页数 > 1 且抽帧哈希各不相同，才算动图保住。
- 静态图走 sharp 转 WebP（封面最长边 640，截图最长边 1280，不放大）。
- `mirror_covers.py` 是早期只处理封面的旧脚本，处理历史遗留封面时仍可用。

### 6. 验证与收尾
- 抓 2-3 个 `/game/<slug>` 页面确认标题/简介/图片/外链按钮渲染正常（grep 时注意 srcset 里的 URL 是 %2F 编码的）。
- 首页、sitemap（1h 刷新）稍后自动收录；详情页"相关游戏"有 30 分钟缓存，改库后短暂滞后属正常。
- 按仓库 git 规范 commit（导入记录写 `reports/itch-import-<date>.md`，含游戏清单表格）。
- 汇报：入库 N 款 + 跳过原因；**提醒用户在 SEO 控制台把本批标记为「已用于 PlayBloo」**（人工驱动，不要代操作）。

## 部署相关（代码有改动时）

详情页构建期预渲染最近 1500 款（按上线时间倒序，`generateStaticParams`），新游戏在构建时即入缓存。站点图片全部直连原始 URL（`next.config.ts` 已设 `images.unoptimized: true`），没有图片优化缓存需要预热；**不要再运行 `scripts/warm-image-cache.mjs`**——那是优化器时代的脚本，现在运行只会白烧 Transformations 配额。

## 已知边界

- 老游戏的内容回填（editorial_take / meta_title / meta_description 三件套）不在本 skill 的导入流程里，但写作规范复用 `references/content-guide.md` 的「原创性三件套」一节；工作清单 = 后台 Games 列表勾选 "Missing editorial take"（按 view_count 倒序）。回填只写这三个字段，不动 updated_at/last_updated_at。
- 后台手工添加的 itch 游戏 thumbnail 仍指向 itch CDN，需再跑一次 mirror_covers.py 收编。
- `/api/stats` 接口 devtools 显示 2s+ 属正常（serverless 冷启动），fire-and-forget 不影响渲染，不要"优化"它。
- 游戏页打开慢先分清源站 vs 线路：看 `x-opennext-cache` 命中情况（命中还慢 = 本地到 Cloudflare 线路问题，改代码无用）。
