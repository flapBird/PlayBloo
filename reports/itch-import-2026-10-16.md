# itch.io 批量导入记录 · 2026-10-16

本批 10 款全部新增并发布；重复、跳过、未发布草稿及失败均为 0。首次上线时间：**2026-10-16T00:26:12+08:00**。生产库从 960 条变为 970 条（含既有草稿）。

用户提供的雷达上架时间仅保留为输入元数据，不当作 PlayBloo 上线日期，也不直接作为作品发行日。

## 游戏清单

| # | 游戏 / PlayBloo 页面 | 分类 | 当前版本 |
|---|---|---|---|
| 1 | [Dust Buster [JAM]](https://playbloo.net/game/dust-buster) | arcade, action | released |
| 2 | [Respect The Horde (Demo)](https://playbloo.net/game/respect-the-horde) | strategy, survival | demo |
| 3 | [Amber Forest](https://playbloo.net/game/amber-forest) | card, strategy | demo |
| 4 | [The Chimera Gameboy](https://playbloo.net/game/the-chimera-gameboy) | shooting, puzzle | demo |
| 5 | [Better on Paper!](https://playbloo.net/game/better-on-paper) | casual, simulation | released |
| 6 | [Midas Crutch](https://playbloo.net/game/midas-crutch) | puzzle, platformer | released |
| 7 | [Bombermaid](https://playbloo.net/game/bombermaid) | puzzle, action | released |
| 8 | [0:07](https://playbloo.net/game/007) | action, shooting | released |
| 9 | [Kenzu: Shadow and Light](https://playbloo.net/game/kenzu) | action, adventure | early-access |
| 10 | [Pokémon Overlord](https://playbloo.net/game/pokemon-overlord) | strategy, rpg, multiplayer | released |

## 资料与范围

- 完整分页查重（含未发布草稿），写入前再次检查来源、creator/project 身份和 slug；未覆盖旧游戏。
- 官方 itch 页面最终全部直连抓取成功。默认代理端口不可用；The Chimera Gameboy 与 Better on Paper! 首次遇到 429，单独重试成功。
- 每款填写英文简介、玩法、技巧、特性和已核实操作信息。技巧为基于已确认机制的编辑建议，未声称实际试玩或通关。
- Better on Paper! 与 Pokémon Overlord 的具体浏览器操作键位未找到可靠依据，controls 留空，manifest 的 missingDetailFields 已记录。其他仅列输入设备的游戏没有猜测键位。
- Kenzu 当前约 1 小时、标记 early-access；8–10 小时是完整版目标。Amber Forest 仅列当前卡牌、敌人和首个 Boss，不把遗物、消耗品、地图、多幕和元进度计划写成已实现功能。
- Respect The Horde 和 The Chimera Gameboy 标记 demo；不承诺完整战役或未来新增功能。
- Better on Paper! 保留抑郁提及、焦虑及暗示恐同提示；0:07 保留暴力、心理主题、令人不安的对白及听到声音的提示。
- Pokémon Overlord 明确为非官方同人，Versus 为本地离线模式；未描述为在线联机。
- Aseprite 是 Dust Buster 的美术工具，未作为引擎写入。多作者项目按当前官方署名记录。
- release_date、last_updated_at 无额外可靠依据时保持 null。没有创建将收录事件混作游戏版本更新的 game_updates。

## 图片与发布

- 10 张封面、53 张截图，共 63 张 WebP，总计 0.90 MiB。封面最大边不超过 640px，截图不超过 1280px，不放大；GIF 使用首帧作为静态展示，封面已视觉检查。
- 镜像到公开 game-media bucket 的 covers/2026-10-16/ 与 screenshots/2026-10-16/；逐张检查公开读取、Content-Type、实际字节及 SHA-256。未覆盖旧对象或修改存储权限。
- 先插入草稿、绑定 21 条既有分类关联，回读字段与分类并验证匿名不可读，再按本批 ID 发布。
- 正式发布操作同时写入真实 added_at、updated_at；匿名发布后可读且时间一致。10 个浏览器入口 HTML 及可识别主要引用资源均已检查；这是静态可用性检查，不是完整游戏测试。

## 验证

- 10/10 线上详情页 HTTP 200，标题、已填写栏目、封面及官方外链检查通过；没有 /_next/image 优化入口。
- 原有 960 条记录的文案、状态和时间戳保持不变；旧分类关联不变。访问计数和热度的自然变化排除于内容对比。
- 首页 HTTP 200，检查时可见本批 0/10 款；受 300 秒 ISR 缓存影响，不将缓存页面视为数据库写入失败。
- npm run build 通过；本批 10/10 正式 URL 已在构建 sitemap 收录，lastmod 与发布时间一致；953 个老游戏的 sitemap 时间戳与导入前一致；本批 0/10 被预渲染（当前按热度选取前 500 款）；10 个线上详情页的正文已另行验证

## Sitemap 与 llms.txt

- 动态 sitemap 使用公开游戏 updated_at；构建结果收录本批 10/10，lastmod 等于实际上线时间，所有旧游戏时间戳不变，草稿排除。
- 线上 sitemap 本次检查收录 0/10，lastmod 与上线时间匹配 0/10；老游戏时间戳变化 0 条。仍是发布前缓存，待最长一小时 ISR 刷新；没有绕过鉴权或自动部署。
- 没有下架、删除游戏或新增关卡，分类收录由既有动态门槛决定；未修改 sitemap 生成器或刷新旧游戏日期。
- public/llms.txt 已检查，现有路由、外链游玩、目录与 sitemap 说明保持一致，无需更新。

## 交付

数据库与图片已在生产环境生效。本地仅新增本报告及同名 JSON manifest；没有应用代码改动、Git push 或部署。

请在 SEO 控制台将本批标记为「已用于 PlayBloo」。
