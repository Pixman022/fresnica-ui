# Fresnica website motion plan — Motion M3 — 2026-10-26

## Context

Motion M2 is complete and visually reviewed on the main branch. Its restrained pointer parallax, viewport-aware ambient animation, hidden-tab pause, Reduced Motion behavior, CI, and GitHub Pages deployment are green.

M3 adds only state-change micro-interactions. It does not add new ambient animation, scroll-linked motion, mobile redesign, or product claims.

## M3 — implement now

1. **Language switch crossfade**
   - Use the browser View Transitions API when available.
   - Keep the transition short and low-contrast.
   - Fall back to the existing immediate render on unsupported browsers.
   - Preserve keyboard focus on the language control when the switch was triggered from that control.

2. **FAQ answer refinement**
   - Keep the existing grid-row open/close behavior.
   - Add a small content fade and vertical offset so the answer feels less abrupt.
   - Keep ARIA state and interaction behavior unchanged.

3. **CTA directional feedback**
   - Move the existing Hero button arrow by only a few pixels on hover/focus.
   - Do not change button geometry, wording, routing, or availability state.

4. **Accessibility / performance**
   - Disable all M3 transition effects under `prefers-reduced-motion: reduce`.
   - Use only opacity and transform.
   - No scroll listeners or continuous animation are added by M3.

## Still deferred

- cross-section orbital drift;
- scroll-linked geometry;
- pointer effects outside the Hero;
- richer continuous animation inside feature cards.

These remain deferred because they would materially increase visual motion density.

## Success criteria

- Language switching remains functional with and without View Transitions support.
- Keyboard focus returns to the language control after an explicit language-button switch.
- FAQ ARIA state remains correct.
- Reduced Motion adds no M3 animation.
- No layout, information architecture, product, security, download, or release claims change.
- CI, docs sync, Demo build, Delivery artifact, visual QA, and GitHub Pages remain green.
