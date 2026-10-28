# Fresnica V3 — M15 typography alignment and cinematic snap easing

Date: 2026-10-28
Branch: `design/website-vision-motion-concept-2026-10-27`
Scope: typography + full-screen wheel-snap duration and velocity profile only.

## Canonical project references
- `docs/design-system/design-tokens.md` and `docs/design-system/design-rules.md` on `main`.
- `design-system/tokens.json`, `src/styles/fonts.less`, `demo/fonts.css`, and the existing `@fontsource/roboto` package.
- Official base stack: `Roboto, 'Noto Sans SC', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif`.
- Canonical primitive sizes: 11 / 12 / 13 / 14 / 15 / 16 / 18 / 20 / 28 / 32 / 48 px; weights 400 / 500 / 600 / 700, base line-height 1.5715.
- Large editorial headings intentionally retain their established responsive, video-inspired website dimensions. They use the approved font family and token weights rather than forcing mobile-app 20px titles onto a marketing hero.

## Implemented
1. New isolated `m15-typography.css` uses the canonical font stack and CSS variables, replacing the previous Inter/Arial and ad hoc numerical weights where the V3 layout renders text. Body, controls, headlines, chapter labels, card headings, descriptions, illustrative wallet data, Q&A, navigation, and footer typography are mapped to approved semantic roles.
2. Financial figures and important numeric labels use `font-variant-numeric: tabular-nums`. Chinese headings have neutral tracking and safe wrapping. Mobile body keeps at least 14px for primary text.
3. The GitHub Pages overlay copies and checksum-compares 4 existing `@fontsource/roboto` Latin WOFF2 faces (400/500/600/700) and 3 bundled Noto Sans SC Simplified Chinese faces (400/500/700), exclusively into the V3 preview font directory. No external Google Fonts call is needed, and no binary font file is committed to this branch.
4. The M13 full-screen snap now uses `clamp(535 + distance * .115, 620, 920)` ms instead of `clamp(450 + distance * .098, 500, 780)` ms. A quartic symmetric ease-in-out replaces the cubic version, giving stronger initial acceleration and terminal deceleration with a faster mid-transition.
5. The 74px wheel threshold, final snap targets, all ten scene order, language toggle, reduced-motion fallback, ambient M14 animations, page content and WebGL Hero shader are unchanged.

## Motion reference / tradeoffs
- User-provided source: 94.03s, 30fps reference video. The dark-screen transition around 11.5–12s accelerates noticeably and settles sharply; a quartic profile is a purposeful approximation, **not** a claim of pixel-perfect original motion reconstruction.
- For scroll distances 600/900/1200/1800/2400px, predicted old duration is 509/538/568/626/685ms, new duration is 620/638/673/742/811ms respectively, i.e. approximately 18–22% slower with a stronger mid-course peak.
- Cinematic full-screen scrolling intentionally takes longer than the component-library 0.15–0.35s micro-interaction duration tokens. Buttons and local component motion retain their existing behavior.

## Local Chromium QA
- Standalone test fixture rebuilt from the M14 HTML and scripts with the new typography CSS and M13 timing changes inlined. The original approved Hero WebGL inline script was not edited.
- **99/99** Playwright assertions passed at 1440x900, 1920x1080, 1280x720, 900x844, 390x844, 320x640 and 1440x900 Reduced Motion.
- All ten scenes retained, no document horizontal overflow or uncaught JS errors. Tested canonical CSS variables, family/weight/size roles, 15px buttons, 11px labels, tabular financial numerals, English to Chinese and back, five desktop cards still fully visible, and mobile header controls without logo overlap.
- Live desktop wheel progress verified forward, decelerated and parked at the intended chapter state. Test screenshots exist for desktop and mobile.
- Fonts resolved through OS fallbacks for local smoke testing because the assistant's local test document used inline CSS. Font-file existence and byte-for-byte copying are checked by the publishing workflow; actual Windows/browser font loading requires a live preview review.
- Do not mark the reference video as frame-perfect, or assume WebGL2 hardware results from this headless Chromium environment.

## Release protection and acceptance
- Only V3 isolated HTML/CSS/JS and V3 Pages-overlay rules are changed. Pages builds frozen V2 source `f3e68515d90fe05a12a640db153f1b14004cad32` and must compare old `fresnica-website-preview/index.html` before deployment.
- GitHub Actions deployment status and inclusion of all font files should be verified separately and recorded after the commit.

## Confirmed GitHub Pages release
- V3 code commit: `203703a739adda78509d8b76f3079528fa20a2f4`.
- [GitHub Actions run 40624117944](https://github.com/Pixman022/fresnica-ui/actions/runs/40624117944) completed **success**.
- Source-verification, production dependency audit, V3-only overlay, artifact upload and Pages deployment steps all succeeded.
- Workflow explicitly reported: **M15 typography CSS and 7 existing project font files copied and checked**. The artifact listed `m15-typography.css` and both Roboto and Noto Sans SC WOFF2 files.
- Frozen V2 source: `f3e68515d90fe05a12a640db153f1b14004cad32`, with original preview HTML SHA-256 `c522893e32d794ade98e7338624e9756d634a744bc93f199f7ea3289824679fe` unchanged. `main` and archive branch were rechecked after deployment.
- Preview URL: https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/
- GPU-specific appearance and actual user-device scroll feel remain separate manual acceptance tasks; this report verifies the release artifact and local automated behavior.
