# Fresnica V3 M10 — Framed page & scroll-screen transitions QA

Date: 2026-10-27
Branch: `design/website-vision-motion-concept-2026-10-27`
Status: M10 local Chromium acceptance complete; release status verified after GitHub Actions.

## Scope
- Original video's navy background is a presentation mat, not the website. M10 replaces eleven isolated rounded cards with one viewport-sized rounded and clipped page canvas.
- Internal scrolling within `#v3-page-frame` now holds the current screen, changes content, then slides the next screen upward into the same bounded canvas.
- The five existing M5 pinned sequences and horizontal card rail remain. Other scenes receive compact runways and scroll-responsive entrance/exit text movement.
- Removed the 745px desktop minimum and oversized per-section padding; retuned Hero, contrast, feature cards, asset, audience, workspace, paths, clarity, availability, and footer vertical anchors for 1440×900 and 1440×720.
- The existing WebGL shader and first Hero inline script are byte-identical. M5/M6/M7 scripts, product copy and development-only disclaimers remain unchanged.
- Mobile (<681px), Reduced Motion and no-JS retain a readable, linear alternative, with no forced pinning.

## Local browser checks
- **80/80** targeted Chromium/Playwright checks passed at 1440×900, 1440×720, 900×844, 390×844 and 1440×900 Reduced Motion.
- Checked 11 sections, bounded page size, zero horizontal overflow, absence of navy body backing, capsule inside frame, no 745px minimum, visible mid-runway scenes, 720px FAQ/workspace geometry, reversible M6 assets and network (1→2→3→1), anchors, menu and Escape, FAQ, footer theme, runtime Reduced Motion on/off, and mobile panel placement.
- No uncaught JS exceptions. Screenshots captured for nine chapter states plus twelve inter-screen transitions. The first Hero still uses the exact earlier WebGL material; current headless browser displays the fallback.
- This is a reference-aligned transition implementation, not a frame-perfect clone of the full 94-second original video.

## Next checks
- Review the real published page in Windows Chrome with GPU acceleration; manually compare scroll rhythm and sphere appearance.
- Safari, Firefox and lower-end device performance remain unverified.
- V2 `main` and the frozen archive must remain unchanged; protected Pages deploy builds immutable V2 and overlays only the V3 path.
