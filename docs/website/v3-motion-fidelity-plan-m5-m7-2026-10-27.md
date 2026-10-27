# Fresnica V3 — Video Motion Fidelity Execution Plan (2026-10-27)

## Objective
Move from section-by-section appearance effects toward the reference video's scroll-scrubbed visual narrative without changing the approved editorial layout, Stellar-focused copy, or first-screen orb shader. This is a motion-specific plan, not a new website redesign.

## Baselines and protection
- Original 94-second user-supplied video is the motion reference; its other-product UI and claims are not copied.
- Branch: `design/website-vision-motion-concept-2026-10-27` only.
- Preserve `main` and `archive/website-baseline-2026-10-27` at `f3e68515d90fe05a12a640db153f1b14004cad32`.
- Preserve the Hero orb shader and agreed green fluid appearance; no unverified store links, security claims, or simulated live data.
- Publish only the isolated V3 Pages path; the Pages workflow builds immutable frozen V2 and checks its HTML checksum before overlay.

## M5 (P0) — continuous scroll choreography
1. Add a small optional motion layer on top of the existing M3 page; no wholesale rewrite.
2. Introduce pinned scroll runways for five scenes: particle intro, dark comparison, asset overview, workspace, and payment paths.
3. Scrub entrance → detail → exit progress with the scroll position, instead of treating every appearance as an independent one-shot fade.
4. Make current-card / current-step emphasis progress-responsive while keeping established feature-card scrolling, navigation, FAQ, and footer theme operation intact.
5. Honor Reduced Motion and narrow screens with readable, non-pinned content; keep no-JavaScript fallback unchanged.

M5 acceptance: desktop scene runways genuinely hold position, content evolves in at least three different scroll states, returns correctly on upward scrolling, and does not cause blank scroll gaps; existing controls and links still operate. Check 1440/900/390px, keyboard/FAQ/theme, Reduced Motion, no JavaScript, browser console and original orb block identity.

## M6 (P1) — product UI and network state
1. Expand the existing illustrative wallet assets, send/receive and swaps into staged interface walkthroughs.
2. Tie network nodes and diagram paths to specific phases (not generic looping animation).
3. Keep every figure labeled illustrative and never imply real transactions.
4. Verify each stage against the reference's compositional rhythm and contrast.

M6 acceptance: at least three intentional product-interface states are visible during one scroll chapter, and network highlight/path draw progress matches them.

## M7 (P2) — particle and interaction polish
1. Refine particle scatter / reassembly, footer wordmark dissolution, and point-size variation.
2. Improve sticky capsule transitions and typography masking only where the original video supports them.
3. Profile reduced-motion, offscreen pause, layout shifts, memory usage, and Safari/Firefox compatibility.

M7 acceptance: motion energy is visible but restrained, there are no uncontrolled animation loops or keyboard traps, and user review against extracted video checkpoints supports final sign-off.

## Delivery and verification
- After each milestone commit only the isolated V3 files and record exact checks; do not merge into `main`.
- GitHub Pages is shared: a successful V3 overlay may be replaced by future V2-only deploy; confirm the published source SHA and link after each commit.
- The user reviews the working V3 URL and decides on remaining motion/style refinements after each verified milestone.
- Software-rendered headless WebGL cannot substitute for Windows Chrome GPU material approval.
