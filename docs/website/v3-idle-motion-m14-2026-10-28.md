# Fresnica V3 — M14: persistent in-screen motion after wheel snap
Date: 2026-10-28
Branch: `design/website-vision-motion-concept-2026-10-27`
Status: local Chromium acceptance passed; final Windows GPU visual approval pending.

## Goal
After the wheel threshold automatically aligns to a full screen, the content *within the current screen* must continue to animate naturally; the page itself must remain parked. This extends M13 without changing ten-screen order, copy, snap speed, stage progress, globe material or theme placeholders.

## Implementation
- Added `m14-idle.js`: detects which chapter occupies the rounded canvas centre, applies exactly one `m14-current` class, removes it as soon as another chapter becomes current, and clears active animations when the tab is hidden or Reduced Motion is enabled.
- Added `m14-idle.css`: GPU-friendly subtle, looping interior content animation scoped only to the current visible chapter. Does not animate the whole chapter container or alter M5/M6 scroll-driven stage data.
- Screen 1: existing animated WebGL sphere, orbit ring and ticker continue; CSS-only fallback also gently floats.
- Screen 2: particle nodes independently twinkle while the two approved headline groups stay readable.
- Screen 3: Android / iOS *planned* preview cards gain a soft green ambient pulse and moving light, without active download links.
- Screen 4: the five centred feature-card UI previews have independent micro-shimmers and balance/row activity, while the five-card page frame remains still.
- Screen 5: asset/payment/swap preview maintains its selected scroll-defined state while values/rows and the surface illumination move subtly.
- Screen 6: existing audience carousel continues auto-scrolling; visible cards also have restrained float detail.
- Screen 7: a tiny emerald packet traverses the actual SVG network path, only while the desktop concept screen is visible.
- Screen 8: send/swap route accents and the current step highlight continue animating without advancing the transaction steps.
- Screen 9: subtle Q&A accent line and plus glyphs animate, but questions never open automatically.
- Screen 10: the previously implemented Canvas FRESNICA particle wordmark continues its idle motion and theme-transition effects.

## Local checks
- Existing M13 browser regression: **89/89 passed** across 1440×900, 1920×1080, 1280×720, 900×844, 390×844 and 1440×900 Reduced Motion. Includes bilingual toggle, accessible FAQ, snap landing at the fully revealed second screen, next-screen navigation, desktop centred five cards, carousel movement and no JS exceptions.
- M14 scene-by-scene QA: **20/20** time-separated visual comparisons (ten chapters at 1440×900 and 390×844) showed actual visible pixel changes while the same scene remained active; no console exceptions.
- Additional focused behavior: **17/17** passed. This includes stable screen and M6 asset step while parked, a moving network packet with unchanged M6 network stage, stopping packet / animation in offscreen screens, hidden-tab suspension, Reduced Motion, resuming motion, and no JS exceptions.
- Testing used headless Chromium. It exercised the CSS fallback Hero; real Windows Chrome hardware WebGL and Safari/Firefox have not been visually approved.

## Release gate
Only V3 preview HTML and two newly linked M14 resources, plus the Pages asset copy/compare rules and this report are changed. GitHub Pages must build from the immutable V2 `f3e68515d90fe05a12a640db153f1b14004cad32` source, verify the original `fresnica-website-preview/index.html` remains byte-identical, include both M14 assets, then deploy the V3 isolated path.

## Limitations
This change makes each screen's ambient animation continue after stopping. It does not automatically cycle the larger scroll-driven product stage or reconstruct the original video's every frame; M5/M6 sequencing remains under scroll control. The site's reduced-motion setting takes priority over these loops.
