<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sitemap 维护约定

- 每轮功能迭代或修改结束前，检查本轮是否新增上线、下架或删除了游戏。若有，必须同步更新 sitemap 信息并验证结果；若无，不因本轮迭代而刷新游戏的 sitemap 时间戳。
- 本项目通过 `src/app/sitemap.ts` 动态生成 `/sitemap.xml`。根据实际改动维护游戏数据、收录条件或生成逻辑；动态生成已能正确反映上下架状态时，无需为了留下文件差异而修改生成器。
- 新游戏上线后必须收录其正式 URL，sitemap 的 `lastModified`（XML 中的 `<lastmod>`，即更新时间）使用该游戏在 PlayBloo 的实际首次上线日期。不得使用游戏原始发行日期、提前导入或创建记录的日期，也不得使用之后构建、部署或生成 sitemap 的时间代替上线日期。
- sitemap 中老游戏已有的内容更新时间必须保留。不得因新增其他游戏、下架游戏、批量导入、数据同步、功能迭代、构建、部署或重新生成 sitemap 而批量改写老游戏的 `lastModified`，也不得为了刷新 sitemap 而批量更新老游戏的 `updated_at`。除非用户另有明确要求，不调整老游戏已有的 sitemap 更新时间。
- 游戏下架或删除后，必须从 sitemap 移除对应游戏 URL，以及依赖该游戏上线状态的关卡等页面 URL；同时检查受影响的分类、标签、系列等页面是否仍符合现有收录条件。
- 验证至少覆盖：新增上线游戏被收录且更新时间等于上线日期；下架或删除游戏及其依赖页面不再被收录；本轮未变动的老游戏更新时间与修改前一致。最终回复简要说明 sitemap 的处理及验证结果；无法验证时如实说明原因。
