# Fresnica V3 — final mobile quality work plan (2026-11-17)

## Baseline and scope

- Active development branch: `design/website-vision-motion-concept-2026-10-27`. Frozen `main` is not part of this work.
- Scope: V3 marketing website only. Preserve the previously accepted hero orb, second-screen particle behavior, mobile phone preview, navigation, and bilingual themes.
- Latest review: 8.5/10; 18 viewport/theme configurations and 168 captures were reported with zero failures. This is browser evidence, not physical-device acceptance.
- No product functionality, asset availability, security guarantees, app-store URLs, or release dates may be invented.

## Prioritized work

| Priority | Task | Success criterion | Status |
| --- | --- | --- | --- |
| P0 | Audit iOS, Android and desktop download destinations | Unsupported URLs remain unavailable; each channel is enabled only after a verified official HTTPS release destination is approved | Verified safeguards; official destinations pending |
| P1 | Repair cropped next-card headings on screen 4 | On phone widths, the visible rail is exactly one complete compact feature card; horizontal touch swipes and the bilingual hint remain functional | Browser QA passed ([Visual QA run](https://github.com/Pixman022/fresnica-ui/actions/runs/44013491622)); real-device review pending |
| P1 | Make screen-5 desktop concept easier to read on phones | 16:9 ratio at 320–680px; retain all four selectable sections; use simpler content at <=360px; no clipping | Browser QA passed ([Visual QA run](https://github.com/Pixman022/fresnica-ui/actions/runs/44013491622)); real-device review pending |
| P1 | Recheck screens 8–9 transition boundaries | No previous-scene residue or clipped content in light/dark, English/Chinese across supported widths | Desktop and mobile screenshots reviewed; full-height FAQ fix and touch regression added, latest QA pending |
| P2 | Audit supporting copy and touch targets | No tiny or untranslatable copy, horizontal overflow, or blocked touch controls | Security support type adjusted; remaining copy/touch review ongoing |
| P2 | Physical-device acceptance | Real Android/iOS screenshots, touch behavior, and power/performance evidence | Requires device tests |
| P3 | Remove only demonstrably redundant CSS | Pixel and motion regressions remain absent | Deferred until visual baseline stabilizes |

## 2026-11-17 implementation log

- Mobile feature rail width now follows the existing compact card width (`min(300px, 100vw - 88px)`), so a partial heading from the next card cannot appear at the visible edge.
- The desktop concept retains a landscape 16:9 window. At <=480px its content scaling increases to 0.80; at <=360px it increases to 0.72 and shows one representative asset instead of squeezing two rows.
- Added browser assertions for whole-card visibility, mobile asset count, minimum preview scale, and preserved landscape ratio.
- No download links were enabled or replaced with placeholders.
- Implementation commits: `d16222f`, `b05d8ab`. Browser and cross-engine QA must pass before the work is marked accepted.

## Continuation — 2026-11-17

- Reviewed CI captures of desktop security/FAQ in Chromium, Firefox and WebKit, plus 320px and 430px Chinese mobile captures. Existing mobile Q&A scene occupied less than a viewport, visibly revealing the next chapter too early.
- Changed the compact Q&A minimum to `max(650px,100dvh)`; this preserves native vertical scrolling for longer content. Added a browser invariant that the FAQ covers the viewport.
- Extended the simulated real-touch suite to scroll the long security chapter, verify the exact security-to-FAQ boundary with the next chapter below the fold, and open an FAQ answer.
- Increased mobile security-card supporting copy from 12px to 13px, and the security footer support label from 8px to 10px; added a type-size regression check.
- Related commits: `b9fb4a1` (FAQ height), `520a759` (height test), `1b73499` (touch boundary), `c765072` (type), `4e0f83d` (type test).
- The previous card and desktop-preview changes passed [V3 browser visual QA](https://github.com/Pixman022/fresnica-ui/actions/runs/44013491622) and [native OS QA](https://github.com/Pixman022/fresnica-ui/actions/runs/44013427506). The newest FAQ/type check is awaiting completion; these automated tests are not physical-device sign-off.

## Verification gate

1. Verify `V3 Website Visual QA` and native-OS checks on the V3 branch, including 320/360/393/430/480/680px, theme and language matrices.
2. Inspect screenshots for the feature rail, four desktop tabs, and security-to-FAQ transition; programmatic passing does not alone constitute visual approval.
3. Check that disabled download destinations remain disabled; get official publication destinations separately.
4. Leave real-device performance and the decision to remove `noindex` open until release verification.
