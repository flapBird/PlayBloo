# 手工新增游戏记录（生产库三表插入）

适用：游戏不在库里、也没走 itch-game-import 雷达批次的单款自托管上架。**写库前必须把记录摘要给用户确认**（标题/slug/分类/文案要点/来源/封面）。

## 0. 字段模板

先抄一份近期导入的游戏做字段参照（字段集随迁移演进，别凭记忆写全量）：

```bash
curl -s "$SUPABASE_URL/rest/v1/games?slug=eq.<最近导入的slug>&select=*" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
```

## 1. games 主表（POST，Prefer: return=representation 拿回 id）

必写字段：

| 字段 | 值 |
|---|---|
| `title` / `slug` | 游戏名 / kebab-case（与 R2 路径一致，先查重） |
| `iframe_url` | `https://cdn.playbloo.net/games/<slug>/index.html`（自托管流程走到这里时游戏已在 R2） |
| `external_url` | null（内嵌模式，不留 itch 外链） |
| `description` / `how_to_play` / `controls` / `tips` / `features` | 英文文案，规范见 itch-game-import 的 `references/content-guide.md`（只写页面有依据的内容） |
| `meta_title` / `meta_description` / `editorial_take` | 原创性三件套，**必写**（渲染后 title ≤60 字符、description ≤160 字符，长度按含站点后缀算） |
| `source_url` / `source_type` / `sources` / `official_website_url` | 非 itch 官方来源（作者官网/官方频道/更新通道），`sources` 为 JSONB 数组 `[{"url":"...","type":"official","verifiedAt":"<YYYY-MM-DD>"}]`——满足 `games_verified_content_has_source` 约束 |
| `is_published` | true（用户确认后） |
| `developer` | 游戏页有明确作者名就写真实作者（与去 itch 展示不冲突：这是署名不是 itch 链接；用户明确要求匿名化才置 null） |
| `thumbnail_url` / `cover_url` | 按 itch-game-import 的 mirror_media.mjs 惯例镜像到 Supabase Storage `game-media`，**不要热链 itch 图片** |

`created_at`/`updated_at` 用默认 NOW；`view_count`/`play_count`/`hot_score` 用默认 0。

## 2. game_categories（每分类一行）

```bash
# 先查分类 id
curl -s "$SUPABASE_URL/rest/v1/categories?select=id,slug" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
# 表结构：game_id UUID + category_id UUID，复合主键
```

分类选择依据 content-guide 的分类映射；1-3 个为宜。

## 3. game_updates（前台 Updates 模块的数据源，不写前台永远空白）

```json
{
  "game_id": "<上一步返回的 id>",
  "title": "Added to PlayBloo",
  "summary": "<一句话概括玩法>. Verified and added to the PlayBloo catalogue.",
  "source_url": "<官方来源 URL>",
  "published_at": "<NOW，ISO8601>"
}
```

注意 summary **不写** "Discovered on itch.io's new releases feed"——自托管上架的记录从第一天就保持无 itch 痕迹。

## 4. 收尾核验

- 回读三表数据；`content_verified=true` 时确认约束字段非空
- 抓 `https://playbloo.net/game/<slug>`（浏览器 UA）确认渲染；新页面无 ISR 旧缓存问题（首次生成即新数据）
- sitemap 1h 内自动收录新游戏 URL，`lastmod` = 实际上线时刻；按 itch-game-import 惯例在汇报里附 GSC 提交提醒
