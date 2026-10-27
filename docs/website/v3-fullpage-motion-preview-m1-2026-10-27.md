# Fresnica V3 — Full-page motion preview / M1

Date: 2026-10-27

## Scope and source of truth

- Reference: user-supplied 94-second website video and the previously accepted V3 storyboard layout comparison.
- First-screen Hero: preserved from `public/fresnica-v3-orb-demo/index.html`; its material/shader is not redesigned in this milestone.
- Implementation: `public/fresnica-v3-motion-preview/index.html` on branch `design/website-vision-motion-concept-2026-10-27` only.
- Previous `main` website and `archive/website-baseline-2026-10-27` are unchanged.
- All shown account/activity data are explicitly illustrative. Android and iOS are planned, with no live store/download links.

## M1 implemented

1. Video-like rounded white stage, left editorial Hero and right fluid orb, with fixed capsule navigation.
2. Light particle storytelling scene and dark contrast scene.
3. Pinned horizontal feature progression driven by vertical scrolling; previous/next controls.
4. Left-copy/right-workspace balance panels, audience carousel and illustrative interaction map.
5. Dual action paths, inset black review panel, and pre-release availability + FAQ.
6. Dark ending with large dotted Fresnica wordmark and a local light/dark switch.
7. Scroll-aware section title, jump menu, staged entrance, low-motion layout, and functional keyboard-accessible controls.

## Verified locally

- HTML parsed with no duplicated IDs or unresolved local hash links.
- Both embedded JavaScript blocks pass `node --check`.
- Chromium Playwright `page.set_content` test: 11 sections; navigation changes with scroll; feature advance, FAQ expand/collapse, footer toggle and jump-menu Esc work; no uncaught JS errors.
- `prefers-reduced-motion: reduce` disables the scroll-pinned horizontal translation and text reveal transitions.
- Without JS, reveal text remains visible.
- Checked 1440px, 900px, and 390px viewport widths for horizontal document overflow.

## Intentionally deferred

- Full video-timed choreography, exact scroll-scrub easing, scene-to-scene morphs, and genuine particle assembly/dispersal.
- Final video-to-website visual difference review after the fully animated version is ready.
- App release assets and download links, verified legal/contact data, and specific unverified custody/key-management claims.
- Production deployment: GitHub Pages currently deploys `main`; this branch preview was not published over the frozen live website.

## Next pass

- M2: align each transition against the original video's time-coded keyframes (especially 0–15s, 18–33s, and 81–93s); refine sticky ranges, frame interpolation and particle typography.
- Then review desktop animation performance and browser compatibility; keep reduced-motion behavior.
- Only after approval, prepare a separate V3 preview deployment path without replacing the existing website.