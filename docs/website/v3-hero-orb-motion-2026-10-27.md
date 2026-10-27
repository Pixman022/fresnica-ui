# Fresnica V3 — video-inspired Hero orb motion prototype

## Scope
- Standalone, self-contained `index.html`; no remote JavaScript, image, or font dependencies.
- This is a **first-screen visual/motion study**, not a replacement for the previously frozen website.
- Reference: user-provided ~94s video, particularly seconds 0–6 (liquid blue sphere / concentric tick ring / floating cards).
- Target: retain reference's positioning, sizing and controlled motion; replace the orb's center with subtle emerald/teal green.

## Motion
- GPU sphere mesh, animated low-amplitude surface deformation, slowly drifting marbled shading, soft highlights and green core.
- 96 segmented radial ticks with an orbiting active arc and three markers.
- Mouse/pointer parallax constrained to ~6px around the Hero.
- In-page pause/resume and replay buttons; visual labels and controls are keyboard focusable.
- Pauses drawing/animation offscreen and while the browser tab is hidden.
- Reduced-motion preference freezes ambient animation and ticker; a CSS fallback appears if WebGL2 is unavailable.

## Local preview
Open `index.html` in a modern browser. No build step or network access is required. If using a local dev server: `python3 -m http.server 8080` and visit `/index.html`.

## Acceptance criteria
- Orb: opaque/gel-like liquid form, subtle green inner glow; no point-cloud sphere and no physical moon texture.
- Ring: fine, low-contrast ticks aligned with original circular dial; orbit points circulate subtly.
- Composition: video-like left editorial headline, right sphere, floating white cards, central black navigation capsule, white rounded stage on dark backdrop.
- Animation: slow and restrained; pause/replay; no uncontrolled rapid movements.
- Product: Stellar-focused and clearly in development; no active store download buttons or unverified security claims.
- Previous website baseline and main branch remain untouched.

## Status
- HTML and JS parse checks completed.
- Automated browser visual QA could not run inside the current container due to enterprise browser navigation policy (`ERR_BLOCKED_BY_ADMINISTRATOR`), so GPU appearance must be reviewed in the user's browser.
- This prototype is not the complete V3 website and has not been deployed to the existing live GitHub Pages URL.