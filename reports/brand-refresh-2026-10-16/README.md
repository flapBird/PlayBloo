# PlayBloo 折带标志

用户选择第二轮设计中的第 1 款，并要求同时作为网站图标。本轮把该标志应用到现有导航栏与各尺寸网站图标，保留既有文字、布局与主题。

## 预览

- 本地页面：http://127.0.0.1:3000/
- `header-dark.png` / `header-light.png`：导航栏实拍。
- `desktop-dark.png` / `mobile-light.png` / `mobile-dark-header.png`：桌面及手机宽度验证。
- `approved-reference.webp`：用户选中的设计参考缩略副本。
- `reference-icon-36.png` / `actual-icon-36.png`：统一到 36px 的参考与实现，用于对照形态。
- 完整验收记录：仓库根目录 `design-qa.md` 的 2026-10-16 部分。

## 资源

| 路径 | 尺寸 | 用途 |
| --- | --- | --- |
| `public/images/brand/playbloo-ribbon.webp` | 144 × 144，透明 | 导航栏以 36px 显示 |
| `public/favicon.ico` | 16、32、48、256px | 浏览器网站图标 |
| `public/favicon.png` | 48 × 48，透明 | PNG 网站图标 |
| `public/icon.png` | 512 × 512，透明 | 大尺寸网站图标与后续派生素材 |
| `public/apple-touch-icon.png` | 180 × 180，深色底 | 手机收藏图标 |

资源来自同一张透明背景原图，以 Sharp 缩放。导航栏 WebP 使用 quality 92、alphaQuality 100；PNG 使用最高无损压缩。ICO 含四张对应尺寸的 PNG 帧。Apple 图标将原图缩至 148px，居中放入 180px 的 `#0B0D12` 背景。没有启用 Next.js 图片优化器。

## 生成来源

生成工具：内置 `image_gen`；以用户批准的图片为输入进行透明底提取，未重新设计标志。

原始参考：`/Users/admin/.codex/generated_images/01a1405c-1f6d-74e3-ad1d-219ac4180cc4/exec-006c3175-733b-42a8-8d58-ba02f95eb29a.png`

透明素材输出：`/Users/admin/.codex/generated_images/01a1405c-1f6d-74e3-ad1d-219ac4180cc4/exec-3128dfe5-7866-417e-b188-b604e355ff88.png`（1254 × 1254 RGBA）。

提取参数：`transparent_background: true`；`referenced_image_paths` 指向上述原始参考。

最终提示词：

> Extract the existing large lavender folded-ribbon logo symbol from the upper left of this approved PlayBloo brand reference as a standalone production logo asset. Preserve the EXACT existing silhouette, proportions, curved teardrop lower loop, long upward ribbon tip, central dark opening which must become transparent, fold locations, pale lavender face and darker violet reverse. This is asset isolation, NOT redesign: do not add a second loop, change the gesture, rotate, invent a new symbol or simplify the approved shape. Remove ALL text, all UI, divider and background. Return one logo only, centered on a square 1024x1024 genuinely transparent canvas with a modest even safe margin, occupying approximately 88% of canvas height. The ribbon remains tall with the same width-to-height proportion as the large source symbol. Clean antialiased edges, smooth lavender shading matching the reference, no texture, no drop shadow, no glow. Keep the space inside the loop transparent. Output RGBA transparency, no checkerboard pattern baked into pixels. This exact extracted artwork will be used at 36px in a website header and downsampled to favicon sizes.

实际生成尺寸由工具返回，使用实际的 1254px 原图制作各发布尺寸。浏览器标签页引用带版本参数，以更新旧图标缓存。

类型检查、针对性 ESLint、生产构建和浏览器检查通过。没有发布到线上。
