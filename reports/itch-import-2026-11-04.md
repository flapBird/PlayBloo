# itch 新游戏批量入库 · 2026-11-04

雷达批次：`fetch_batch.py --date 2026-11-04`，status=new 共 10 款。挑选后入库 **9 款**，剔除 1 款 NSFW。

## 本批入库（9 款）

| 游戏 | Slug | 分类 | Engine | 状态 | 备注 |
|---|---|---|---|---|---|
| Tower of the Dragon's Girth | `tower-of-the-dragons-girth` | rpg, adventure | Twine | early-access | TF×体重管理×爬塔文字 RPG，11 结局；英/日双语；含题材内容提示 |
| Crimes of Crow | `crimes-of-crow` | simulation, arcade | HTML5 | early-access | 乌鸦犯罪集团模拟：先富城再偷窃 |
| Sprunki Pepper's Take | `sprunki-peppers-take` | music, casual | HTML5 | released | Sprunki 粉丝 mod，信息薄按规范写薄 |
| OUTPOST: Zombie Last Stand | `outpost-alpha` | strategy, action | HTML5 | early-access | 信息最全：8 武器/400+ 卡牌/35+ 僵尸；controls 齐全 |
| Laszlovania | `laszlovania` | adventure, platformer | DSVania Editor | released | WWDITS×老 Castlevania 同人，MATURE 45-60min；DS/3DS 付费版并存 |
| The Devil's in the Details | `the-devils-in-the-details` | casual | Ren'Py | released | Spooktober 2026 jam 恶魔办公室恋爱喜剧，3 结局 |
| With Bruised Blood | `with-bruised-blood` | casual, horror | Twine | early-access | 吸血鬼校园谋杀 IF，18+ 内容警告完整保留 |
| Idle Marble | `idle-marble` | idle, casual | Unity | early-access | 弹珠轨道放置；Prototype 阶段已含 11 语言 |
| The Academy : Love Potions (FR) | `the-academy-love-potions-fr` | casual | HTML5 | early-access | 纯法语 VN；页面无 og:image，封面用首张截图兜底 |

分类合计 16 条：casual 4 / adventure 2 / simulation / arcade / music / rpg / strategy / action / horror / idle / platformer（按款计）。

## 跳过（1 款）

| 游戏 | 原因 |
|---|---|
| yua_faphero (yotogi-chan) | NSFW 成人向（标题即 fap hero 题材），不符合站点定位；留在雷达 new 状态 |

## 过程记录

- 抓取 7/9 首轮成功，`idle-marble`、`the-academy-love-potions-fr` 触发 itch 429 限速；冷却 2.5 分钟后 `--workers 2` 补抓成功，9/9 齐全，无 404。
- 镜像：9 款封面 + 37 张截图全部入 Supabase Storage（`covers/2026-11-04/`、`screenshots/2026-11-04/`），ERRORS 0。`outpost-alpha`、`with-bruised-blood` 封面为 GIF，已转动画 WebP（脚本帧校验通过）。公开 URL 全部 200 且 `cache-control: max-age=604800`。
- **meta_title 长度修正**：首写 4 款按 skill 指南 ≤60 直接写，实测渲染后 `meta_title + " | PlayBloo"`（模板后缀 11 字符）超 60 上限（AGENTS.md 标准）；已收窄并 PATCH——tower(51)、outpost(50)、the-devils(50)、the-academy(60，渲染后实测)。其余 5 款渲染后 ≤60 合规（sprunki、idle-marble 恰为 60）。**skill 的 content-guide 规则 14 建议后续把"≤60 字符"改写为"渲染后 ≤60（预留 11 字符站名后缀）"**，避免下批重蹈。
- `the-academy-love-potions-fr` 页面无 og:image（grep 复核确认），`enriched.json` 的 og_image 用首张截图兜底后重跑 mirror 补齐封面。
- PATCH meta_title 后核对本批 `updated_at` 仍为入库时刻（2026-11-04T15:31:38Z），未被刷新。

## 验证

- 线上页抽查 5 款（outpost-alpha / idle-marble / the-academy-love-potions-fr / tower-of-the-dragons-girth / 老游戏对照）：HTTP 200，title/meta description 渲染正确，图片指向自家存储。
- sitemap 数据侧：本批 9 款 created=updated=2026-11-04（实际上线日）；老游戏抽查 updated_at 均 < 今天；全库今天有更新的 11 款 = 本批 9 款 + 当日手工上架的 noillirk、odio-el-chocolate，无波及。
- GSC 提交清单（请逐个「网址检查 → 请求编入索引」，约 9 条正好在每日配额内）：
  - https://playbloo.net/game/tower-of-the-dragons-girth
  - https://playbloo.net/game/crimes-of-crow
  - https://playbloo.net/game/sprunki-peppers-take
  - https://playbloo.net/game/outpost-alpha
  - https://playbloo.net/game/laszlovania
  - https://playbloo.net/game/the-devils-in-the-details
  - https://playbloo.net/game/with-bruised-blood
  - https://playbloo.net/game/idle-marble
  - https://playbloo.net/game/the-academy-love-potions-fr
