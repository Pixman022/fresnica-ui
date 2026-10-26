# Fresnica website motion plan — Motion M2 — 2026-10-26

## Context

Motion M1 has completed browser-level visual QA at 1440px.

The QA artifact confirmed that Hero, Features, Security, Download, FAQ, and Reduced Motion keep the intended Geometric Light V2.4 layout. It also exposed an unrelated About highlight selector bug, which was fixed before starting M2.

M2 remains deliberately small. It adds one pointer-driven effect and one runtime efficiency improvement without introducing scroll-linked animation.

## M2 — implement now

1. **Hero pointer parallax**
    - Desktop only: width above 1100px with a fine pointer and hover capability.
    - Move the complete Hero visual by at most roughly 4px horizontally / 3px vertically.
    - Move background geometry and detail nodes at slightly different depths.
    - Keep the phone readable and the orbital rotation unchanged.
    - Reset smoothly when the pointer leaves the Hero visual.

2. **Pause ambient motion offscreen**
    - Hero orbital/phone animation runs only while the Hero illustration intersects the viewport.
    - Security orbital animation runs only while the Security illustration intersects the viewport.
    - Preserve animation progress by pausing rather than removing/restarting the animation.

3. **Accessibility / performance**
    - Keep all pointer parallax disabled under `prefers-reduced-motion: reduce`.
    - Do not enable parallax on touch/coarse-pointer devices.
    - Reuse the existing motion observer instead of adding scroll-event animation.
    - No mobile layout changes.

## Still deferred

- cross-section orbital drift;
- scroll-linked geometry;
- language-switch crossfade;
- pointer effects outside the Hero;
- richer continuous animation inside feature cards.

These remain deferred until M2 is visually reviewed.


## M2 visual QA and runtime closeout

- Main-branch CI generated and reviewed 1440px Hero, full-page, and Reduced Motion screenshots.
- Hero, Features, Security, Download, About, and FAQ show no M2-introduced overflow or layout displacement.
- Pointer parallax does not alter layout; static QA captures retain the Geometric Light V2.4 composition.
- M2.1 additionally removes the ambient-motion running state while the browser tab is hidden and restores viewport-based motion state when the page becomes visible again.
- This closeout adds no new motion category and does not change mobile behavior.

## Success criteria

- Maximum pointer displacement stays subtle and does not alter layout.
- Hero and Security ambient animations pause outside the viewport.
- Reduced Motion has no continuous animation or pointer parallax.
- No product, security, download, or release claims change.
- Existing 1440px visual QA screenshots retain the approved layout.
- Existing CI, docs sync, Demo build, Delivery artifact, and GitHub Pages deploy remain green.
