# Fresnica V3 — M11 desktop safe width and alignment (2026-10-27)

## User request and scope
- Some desktop chapters spread too far toward the edges; others do not form a horizontally centred composition.
- Keep the M10 single rounded page canvas, original video-inspired full-bleed background/feature rail, same Stellar wallet copy, approved Hero orb, and M5–M10 scroll choreography.
- Change **only** a final, `html.m10-framed`-scoped CSS layer inside the existing V3 HTML. No JavaScript or scroll parameters changed.

## Layout decisions
- Common **1180px maximum safe content width** on desktop, with fluid side gutters and centred placement.
- Hero uses balanced two-column artwork/copy within the safe grid.
- Asset scene uses equal outer insets, balanced responsive grid tracks, full-width asset demo card, no padded text-column imbalance, and a mathematically centred bottom stepper.
- Workspace copy and panel use matching left/right safe insets; wide-screen maximum is 390px copy + 710px demonstration with 80px gap.
- Audience reel and relevant headings, footer text, trust panel, and particle-page captions are capped/centred. The oversized footer particle wordmark has its own **1260px safe width**.
- Feature card animation window **remains full bleed** as in the video. Only its bottom navigation/progress controls align to the safe content grid.
- Narrow <=680px flow retains its existing linear mobile layout; no new pinning or overflow behavior.

## Measured results (local Chromium geometry)
- At **1920px**, assets content range was x=100..1534 (group midpoint x=817) and is now x=370..1550 (midpoint **x=960**, exactly viewport centre). Asset stepper now uses x=600..1320, also centred.
- At **1920px**, workspace content used x=134..1805 (~1671px wide), now x=370..1550 (**1180px wide**, exactly centred).
- At **1920px**, footer navigation/text uses x=370..1550 instead of x=100..1820.
- At **1440px**, assets and workspace each fit within a centred 1180px safe area (x=130..1310).
- Existing full-bleed feature rail is untouched and can still slide partially out of view intentionally.

## Verification
- **109/109** focused layout and primary interaction checks passed across 1920x1080, 1440x900, 1280x720, 900x844, 768x1024, 681x900, and 390x844. Includes group centring, safe width, gap, no horizontal overflow, screen counts, FAQ and footer theme.
- **80/80** original M10 scroll and accessibility regression checks passed on 1440x900, 1440x720, 900x844, 390x844 and 1440x900 Reduced Motion.
- The candidate was checked against the original M10 GitHub HTML: removing the single new CSS block restores the original **byte for byte**; the first Hero inline WebGL script also matches byte for byte.
- Reference screenshots and focused desktop before/after comparison are available from the development session. Performance under real GPU acceleration is not asserted.

## Release safeguards
- Work remains only in `design/website-vision-motion-concept-2026-10-27`; `main` and frozen V2 archive must remain at `f3e68515d90fe05a12a640db153f1b14004cad32`.
- Existing Pages workflow builds frozen V2 and copies isolated V3 HTML and M5/M6/M7/M10 JS files; no new runtime asset was introduced.
- Confirm GitHub Actions run for the V3 HTML change and verify the old V2 HTML checksum before marking this as deployed.
- Real Windows Chrome GPU appearance and the reference video's full 94-second microtiming remain separate acceptance tasks.
