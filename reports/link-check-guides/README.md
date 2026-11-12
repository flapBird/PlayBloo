# 全站链接体检（2026-11-12）

背景：GSC 报告 404 占爬虫请求 11%（90 天约 120 次），而用于发现新页面的抓取只有 33 次（3%）。

## GSC 明细（Not found 404 + Soft 404，共 8 个 URL）

| URL | GSC 分类 | 状态 | 处理 |
| --- | --- | --- | --- |
| /game/and-hopes-for-all | 404 | 库中无记录，线上 404 | proxy 410 |
| /game/increvengeance | soft 404 | 同上 | proxy 410 |
| /game/pixel-orbit | soft 404 | 同上 | proxy 410 |
| /game/spin-the-squid | soft 404 | 同上 | proxy 410 |
| /game/bone-scrambler | soft 404 | 同上 | proxy 410 |
| /game/feed-the-ai | soft 404 | 同上 | proxy 410 |
| /$ | 404 | 垃圾路径，无来源 | next.config 308 → / |
| /& | 404 | 同上 | next.config 308 → / |

6 个游戏 slug 在代码、git 历史、submissions 表中均无痕迹——是 itch 批量导入后被彻底删除的 DB 记录，
无合理 301 目标，故用 410 Gone 让 Google 尽快清退（410 比 404 出报告更快，且明示"永不回来"）。

## 全站爬取结果（生产站，1271 页 / 76338 条链接 / 1271 个唯一目标）

- **真实死链：0**。除 GSC 那 8 个 URL 外，没有任何站内链接指向 404。
- 爬虫报告里的 47×503 + 2×超时为**假阳性**：自定义爬虫 UA 触发 Cloudflare 对未知 bot 的限流。
  全部 49 个目标用浏览器 UA 复测均为 200。
- 不在 sitemap 的 200 页共 37 个，全部符合预期：工具页（/about、/contact、/privacy、/terms、
  /search*、/favorites、/recently-played）刻意不收录；分类页 ?page≥2 属分页惯例；
  /guides/ocarina-of-time-remake/walkthrough 是 preview 状态（渲染但 noindex），sitemap 只收 published，自洽。

## 遗留与后续

- 生产站尚未部署本批修复（410/308 生效需等 Cloudflare Workers Builds 部署）。部署后：
  1. 在 GSC 对 "Not found (404)" 与 "Soft 404" 报告点"验证修复"；
  2. 复查 /new-games、/popular、/trending 新落地页的游戏链接（部署后才有内容）。
- 90 天窗口内 404 爬请求数应随 Google 清退这批 URL 显著下降；sitemap 精简（并行改造）+ 无死链内链
  意味着后续抓取预算全部花在有效页面上。

## 工具

`scripts/check-links.mjs`：全站内链体检。用法：
- `node scripts/check-links.mjs` 全量（sitemap 起爬，较慢）
- `node scripts/check-links.mjs --guides-only --out reports/link-check-guides` 只种 guides+静态页
- 爬生产站请保持浏览器 UA 与低并发（脚本已内置），否则会被 Cloudflare 限流产生 503 假阳性。
