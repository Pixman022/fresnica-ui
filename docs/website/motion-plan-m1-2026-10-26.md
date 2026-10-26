# Fresnica website motion plan — Motion M1 — 2026-10-26

## Goal

Add restrained motion to the frozen **Geometric Light V2.4** website without changing product claims, information architecture, download status, or the established light geometric visual system.

The motion should make the page feel alive while keeping the product UI secondary to the overall composition.

## Principles

- Prefer `transform` and `opacity`; avoid layout-heavy effects, large blur animation, WebGL, and heavy 3D.
- Keep continuous motion slow and ambient.
- Use green only as a focal accent; animation must not increase green density.
- Motion must not imply product availability, loading, or live wallet data.
- Respect `prefers-reduced-motion: reduce` and leave all content fully usable without motion.
- Do not introduce a mobile redesign. Continuous ambient motion is desktop/tablet-first in M1.

## M1 — implement now

1. **Hero entrance**
    - Fade / rise the hero copy and illustration once on initial view.
    - Keep the distance small and the easing soft.

2. **Hero ambient geometry**
    - Slowly rotate the two abstract orbital rings.
    - Add a very small vertical float to the phone mockup.
    - Keep the phone stable enough to remain readable.

3. **Features**
    - Reveal the section heading and four feature cards once as they enter the viewport.
    - Stagger the cards lightly.
    - Add a 3–4px hover lift and small feature-specific micro-movements.

4. **Security**
    - Rotate the two orbital rings slowly in opposite directions.
    - Reveal the copy and geometry once on entry.
    - Keep the lock itself stable.

5. **FAQ**
    - Animate expand/collapse with a short grid-row transition.
    - Keep ARIA state synchronized with the visual state.

6. **Accessibility / performance**
    - Disable continuous motion and transitions under reduced-motion preferences.
    - Use one shared IntersectionObserver for reveal effects.
    - Avoid scroll-driven JavaScript animation in M1.

## Deferred to M2

- mouse/pointer parallax;
- cross-section orbital drift;
- scroll-linked geometry;
- language-switch crossfade;
- richer per-feature animation.

These are deferred until M1 is visually reviewed in a real browser.

## Success criteria

- No layout or content architecture changes.
- No new product/security/download claims.
- No active download links.
- No animation blocks reading or interaction.
- Reduced-motion mode has no continuous animation.
- Existing CI, docs sync, Demo build, and Delivery artifact remain green.
- GitHub Pages deploy succeeds.
