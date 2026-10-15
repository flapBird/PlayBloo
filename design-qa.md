# PlayBloo ribbon identity — 2026-10-16

final result: passed

## Reference and evidence

- Approved direction: first lavender folded-ribbon concept in the second design round. The user requested this mark for both the navigation and website icon.
- Persistent reference: `reports/brand-refresh-2026-10-16/approved-reference.webp` (768 × 512); original board was 1536 × 1024. Asset provenance and extraction prompt are recorded in that folder's `README.md`.
- URL: http://127.0.0.1:3000/
- Desktop: `desktop-dark.png`, 1434 × 896 captured pixels from a 1440 × 900 CSS viewport at 1× content density. Focused `header-dark.png` and `header-light.png` are 530 × 82 clips.
- Mobile: `mobile-light.png`, 384 × 831 captured pixels from a 390 × 844 CSS viewport at 1× content density; `mobile-dark-header.png` is a 390 × 100 clip.
- The oversized concept board and existing website have different layout purposes. Fidelity was assessed at the symbol level: `reference-icon-36.png` and `actual-icon-36.png` normalize the approved header symbol and implemented asset to 36 × 36. Both images and the rendered header were inspected together.

## Fidelity and implementation

- Preserve the approved tall ribbon, open lower loop, pale lavender front face and darker reverse. The transparent mark replaces the square gamepad badge; it has no enclosing background or added shadow.
- Keep the established 64px header, existing sans-serif wordmark (20px desktop, 18px mobile, weight 900), 8px mark-to-text gap and navigation. The mark occupies a 36 × 36 image box with its source proportions preserved.
- The source is isolated with image generation and downsampled with Sharp. The shipped header WebP is 144 × 144, 5,340 bytes, supporting the 36px display at up to 4× resolution. No visible edge halo was found at the displayed size in either theme.
- The favicon, 512px icon and Apple touch icon all derive from the same isolated artwork. The Apple icon uses a dark background and safe padding. Versioned metadata URLs avoid reusing the old cached icon reference.
- Preserve all visible copy and the accessible home-link name. The adjacent image has empty alt text so the site name is announced once.
- No outstanding P0/P1/P2 findings in the verified states.

## Verification

- Desktop 1440px and mobile 390px layouts: no horizontal overflow; theme toggle and mobile menu open/close work.
- Browser image inspection: loaded successfully at 144 × 144 natural size and 36 × 36 rendered size, from the direct asset URL. Global `images.unoptimized: true` remains unchanged.
- Metadata contains the versioned ICO, 48px PNG, 512px PNG and 180px Apple touch icon links.
- All five shipped image resources returned HTTP 200 locally, with the expected MIME types and bytes matching the files on disk. All four ICO frames decode at 16, 32, 48 and 256 pixels.
- Browser application error logs: none observed. Physical iOS installation and the browser's native tab icon UI were not separately tested; resource and metadata checks cover the favicon integration.
- `npx next typegen`, `npx tsc --noEmit`, targeted ESLint and `git diff --check` pass. An initial type check overlapped development type generation; regenerating types and running the check sequentially passed.
- `npm run build` passes, including all 555 static pages.
- `public/llms.txt` was checked and remains accurate; no update needed for the visual identity change.
- No game publication, removal, route or data changes. Sitemap logic and existing game timestamps remain unchanged.
- Verified locally; no deployment or push performed.

---

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
