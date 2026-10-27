# Fresnica V3 — M10 Framed Screens & Scroll-Scene Transitions (2026-10-27)

## Goal and reference
The user clarified that the navy surround in the 94-second reference video is a **video presentation background, not part of the website**. The web page is only the rounded, light/dark rectangle. The latest V3 has dark outer gutters, eleven separately rounded cards, fixed 745px minimum chapter height, and excessive vertical whitespace. This phase corrects the page boundary, screen composition, and between-screen scroll transition **without redesigning the Stellar copy or changing the approved orb shader**.

## Required results / acceptance
1. **One bounded page canvas.** Remove the video-style navy backing and repeated card gaps; render one viewport-sized, round-corner-clipped site. The outer browser pixels are not a themed website background. Fixed navigation is inside that page canvas.
2. **Vertical composition.** Each desktop scene should use the canvas's visible height. Adjust section-specific top/middle/bottom anchors so headings, illustrations, controls and bottom labels stay inside the same frame, including 1440×900 and 1440×720. Eliminate the hard 745px desktop min-height and hard-coded oversized blank padding. Preserve intentional empty space in the sparse-particle scene.
3. **Scroll-scene switching.** Use one scroll container and pinned, sequential scene runways so scrolling first changes a screen's content and then moves the next full screen into the same frame (vertical wipe/slide, not eleven separate scrolling cards). The existing M5/M6 product-state motion must remain reversible when scrolling up; preserve the features horizontal track.
4. **Accessibility and fallback.** Native scrolling, anchors, menu, keyboard and FAQ must work inside the page frame. Reduced Motion and narrow viewports must have readable linear flow with no trapped content or forced animation. No-JS readable content must remain possible.
5. **Protection.** Only `design/website-vision-motion-concept-2026-10-27` is modified. Preserve old `main`, archive, old Pages route, and the currently approved Hero sphere shader exactly. Keep pre-release labels and avoid official-download/security claims.
6. **Verification.** Capture viewport screenshots at key checkpoints, exercise forward/back scroll, anchor/FAQ/menu/theme, check no horizontal overflow and document no-JS behavior. Test desktop 1440×900 and 1440×720; mobile 390×844; Reduced Motion. Check GitHub Pages artifact includes all scripts and untouched frozen V2 checksum before describing M10 as deployed.

## Implementation steps
- A. Record the baseline and isolate a complete M9 copy. Work on HTML/CSS + one dedicated `m10-frame.js` enhancement instead of rewriting M5/M6/M7 or the Hero code.
- B. Add a viewport frame around the existing 11 scenes; move the fixed capsule navigation into the frame. Make page scrolling occur within that frame and dispatch the existing scroll listeners, preserving all earlier animations.
- C. Replace page-card margins and min-heights with a uniform full-frame geometry. Locally retune the Hero, compare, feature, audience, workspace, payment, trust, availability and footer compositions.
- D. Enable pinned runways for remaining plain chapters, retaining the five M5 runways and horizontal feature track. Add scroll-derived reveal/exit transforms only to plain scenes.
- E. Verify in a browser and repair regressions before committing. If the transition fidelity is incomplete, explicitly identify what remains.
- F. Update the guarded GitHub Pages overlay to include the new JS, then publish and confirm old-site checksum.

## Known constraints
- The reference video illustrates another product; its UI and wording cannot be copied as Fresnica product claims.
- Existing WebGL material is unchanged. Headless browser tests may render the static orb fallback.
- Manual Windows Chrome GPU review remains necessary for final motion/visual fidelity.
