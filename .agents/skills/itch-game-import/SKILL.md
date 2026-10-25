---
name: itch-game-import
description: PlayBloo（playbloo.net）itch.io 新游戏批量入库的完整工作流。当用户提到「itch 新游戏 / 新游戏速递 / itch 导出 / 雷达导出数据要加进 PlayBloo / 拉一批 / 批量添加 itch 游戏 / 入库这批游戏 / 今日新游戏入库」，或贴出「# itch.io 新游戏速递」格式的 Markdown，或要求完善 itch 游戏详情、上传游戏截图封面到 PlayBloo 时使用——即使没有明说"用 skill"。
---

# itch.io 新游戏批量入库（PlayBloo）

把 SEO 控制台 itch 雷达每日的新游戏（API 自动拉取，status=ready 即「未用于 PlayBloo」），做成 PlayBloo 生产库里的完整游戏详情页：抓取官方页面补全详情 → 撰写英文文案 → 写入 Supabase（games + 分类 + Updates）→ 封面镜像到自家存储 → 回填雷达「已用」状态。所有游戏是外链游玩（`external_url` 指向 itch 页面），不做 iframe 内嵌。

**先读 `references/pitfalls.md`**（每一项都是真实事故），写作细节和分类映射在 `references/content-guide.md`。

## 环境事实

- 运行目录：PlayBloo 仓库根。`.env.local` 里的 Supabase **就是生产库**（service role key，写入即上线）。
- SEO 控制台雷达 API `https://seo.leeswalvpn.ccwu.cc`：密钥在 `.env.local` 的 `ITCH_RADAR_API_KEY`（控制台 /itch 页签发，明文只显示一次）。该站**本机直连超时，必须走代理**（fetch_batch.py / mark_used.py 默认走 `http://127.0.0.1:7890`）。
- itch.io 页面直连不通 → 走本地代理 `http://127.0.0.1:7890`（脚本默认）；supabase.co 必须直连（脚本已内置）；`img.itch.zone` 直连可达。
- 站点前端套了 Cloudflare，非浏览器 UA 会被 403——打站点的脚本一律带浏览器 UA。

## 流程

### 1. 拉批次数据（fetch_batch.py，自动）
```bash
mkdir -p /tmp/itch-import && python3 .agents/skills/itch-game-import/scripts/fetch_batch.py \
  --date 2026-10-25        # date 缺省=今天（东八区）；status 缺省 ready=未用于 PlayBloo
```
从雷达 API 拉当日未用游戏，写两个文件：`batch.json`（API 原始响应，存档核对用，**不要改**）和 `games.json`（工作清单）。终端打印每款的质量标记/价格/类型表。**挑选 = 直接编辑 games.json，删掉不入库的游戏**（后面 mark-used 只回填实际入库的 URL，未选的自动留在 ready，下次还能拉到）。count 为 0 说明当天雷达还没跑完，用 `--date` 取前几天。**不要**查 SEOGrowthManage 本地 SQLite（是旧库）。

API 不可用时的回退：让用户粘贴「# itch.io 新游戏速递」导出 Markdown（parse_and_fetch.py 仍支持 Markdown 输入），该路径完成后需**人工**到控制台标记已用。

### 2. 抓取详情（parse_and_fetch.py）
```bash
python3 .agents/skills/itch-game-import/scripts/parse_and_fetch.py \
  /tmp/itch-import/games.json /tmp/itch-import/enriched.json
```
产出 enriched.json：API 字段（cover_url/description/genres/tags/keywords/price/quality_ok 等）与页面抓取结果合并——og:image / og:description / 作者 / Genre / 引擎 / 截图 / 页面正文；页面缺截图时用雷达截图兜底。结尾会列出抓取失败清单——404 的游戏已下架，记录后跳过；网络类失败重跑一次。

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
- **GSC 提交加速**：汇报里附上本批全部游戏页的完整 URL 清单（`https://playbloo.net/game/<slug>`，与 reports 清单对应），提醒用户到 Google Search Console 逐个「网址检查 → 请求编入索引」。手工配额约每天 10-12 条，正好覆盖一批 10 款；GSC 没有官方提交 API，不要写脚本模拟浏览器操作 GSC（账号风控风险，配额也不会变多）。可选加速：`curl -s "https://www.google.com/ping?sitemap=https://playbloo.net/sitemap.xml"`——该 ping 端点 2023 年起已被 Google 弃用，可能无效但无害；本机直连不了 Google 时走 `http://127.0.0.1:7890` 代理。
- 按仓库 git 规范 commit（导入记录写 `reports/itch-import-<date>.md`，含游戏清单表格）。
- **回填雷达已用状态（mark_used.py，入库成功后必做）**：
```bash
python3 .agents/skills/itch-game-import/scripts/mark_used.py \
  --urls-file /tmp/itch-import/imported-urls.txt --date 2026-10-25
```
import_games.py 已把**实际入库**的 external_url 写进 imported-urls.txt（挑选剩下的、查重跳过的、抓取失败的不在其中，自动留在 ready）。核对返回的 `marked` == 入库数且 `not_found` 为空，对不上就比对 batch.json 查原因。漏标不致命——重复拉到同一款时 import_games 的查重会兜住。
- 汇报：入库 N 款 + 跳过原因 + 已标记 marked 数。

## 部署相关（代码有改动时）

详情页构建期预渲染最近 1500 款（按上线时间倒序，`generateStaticParams`），新游戏在构建时即入缓存。站点图片全部直连原始 URL（`next.config.ts` 已设 `images.unoptimized: true`），没有图片优化缓存需要预热；**不要再运行 `scripts/warm-image-cache.mjs`**——那是优化器时代的脚本，现在运行只会白烧 Transformations 配额。

## 已知边界

- 老游戏的内容回填（editorial_take / meta_title / meta_description 三件套）不在本 skill 的导入流程里，但写作规范复用 `references/content-guide.md` 的「原创性三件套」一节；工作清单 = 后台 Games 列表勾选 "Missing editorial take"（按 view_count 倒序）。回填只写这三个字段，不动 updated_at/last_updated_at。
- 后台手工添加的 itch 游戏 thumbnail 仍指向 itch CDN，需再跑一次 mirror_covers.py 收编。
- `/api/stats` 接口 devtools 显示 2s+ 属正常（serverless 冷启动），fire-and-forget 不影响渲染，不要"优化"它。
- 游戏页打开慢先分清源站 vs 线路：看 `x-opennext-cache` 命中情况（命中还慢 = 本地到 Cloudflare 线路问题，改代码无用）。
