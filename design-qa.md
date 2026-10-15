# Game card refresh — 2026-10-15

final result: passed

## Reference and evidence
- Desktop visual target: `/var/folders/ll/zfhgnxpx1sl87rndkww8r32w0000gq/T/codex-clipboard-0b878a38-4125-416c-9198-c82d7bcf99f4.png` (772 × 392).
- Mobile regression supplied by user: `/var/folders/ll/zfhgnxpx1sl87rndkww8r32w0000gq/T/codex-clipboard-99511590-f7ee-4fbc-9f15-1197be057be6.png`.
- Desktop verification: `reports/card-refresh-2026-10-15/desktop.png`, 1434 × 996 image pixels from a 1440 × 1000 CSS viewport, 1× content capture.
- Mobile verification: `reports/card-refresh-2026-10-15/mobile.png`, 384 × 831 image pixels from a 390 × 844 CSS viewport, 1× content capture.
- URL: http://127.0.0.1:3000/search
- Component-level comparison: existing PlayBloo game assets and content are intentional adaptations of the desktop source. Desktop and mobile have different interaction models.

## Findings and corrections
- [P1, resolved] All mobile cards permanently displayed the purple desktop information layer, obscuring the covers. The earlier QA incorrectly accepted that treatment as the touch fallback.
- Move card information outside the media container. On small screens, coarse pointers and non-hover devices, display only a two-line title below the unobstructed cover; hide secondary metadata and remove the overlay background.
- Limit hover reveal, media highlight and enlargement to fine-pointer devices with hover and width >= 640px. Mobile keyboard focus keeps its outline without an overlay or enlargement.
- Keep the media at 16:10 with flex-shrink disabled. Preserve bottom overlay rounding for the desktop sibling layout.
- No outstanding P0/P1/P2 findings in the verified states.

## Fidelity surfaces
- Typography: existing site font; compact mobile titles use theme foreground, 14px/1.35 and weight 600. Two-line space keeps grid rows aligned.
- Spacing/layout: mobile captions follow their cover without overlap; desktop keeps six columns and absolute-positioned information. Caption and cover remain one link.
- Colors: no mobile gradient; readable foreground in light/dark themes. Desktop retains the purple reveal layer and accessible focus outline.
- Assets: existing compressed covers, original URLs and global unoptimized image setting preserved.
- Content: title always available on mobile; category, mode, dates and views are desktop reveal details. No fabricated statistics.

## Verification
- 320px and 390px viewport checks: computed caption background image is none; no horizontal overflow.
- 390px: caption position static, below media; cover width/height ratio 1.6.
- Mobile keyboard focus: no transform, no media shadow, no caption gradient; solid outline remains.
- A single card click navigated to `/game/gyra` with navigation completion awaited.
- Homepage: all 20 mobile cards have no overlay. Light and dark theme text inspected.
- Desktop: default copy absolute and opacity 0; keyboard focus changes opacity to 1, keeps 16px bottom corners and expected enlargement.
- Browser console errors: none observed.
- Actual touch hardware and physical mouse hover were not separately exercised. Browser viewport checks and CSS media conditions cover the corresponding layouts; no claim of a real-device test.
- TypeScript, targeted ESLint and diff checks pass. llms.txt synchronized. No game publishing/data or sitemap timestamp changes.
