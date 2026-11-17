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
| P1 | Recheck screens 8–9 transition boundaries | No previous-scene residue or clipped content in light/dark, English/Chinese across supported widths | Desktop/mobile captures reviewed; FAQ viewport and simulated touch regressions passed ([Visual QA run](https://github.com/Pixman022/fresnica-ui/actions/runs/44016143079)); real-device sign-off pending |
| P1 | Prevent premature adjacent-chapter peeks on mobile screens 4/5/6/9 | Each compact chapter fills at least its viewport and the last footer starts flush at the top; longer content remains scrollable | Browser visual regression passed ([V3 QA](https://github.com/Pixman022/fresnica-ui/actions/runs/44028746119)); physical-device review pending |
| P2 | Audit supporting copy and touch targets | No tiny or untranslatable copy, horizontal overflow, or blocked touch controls | Mobile footer tap targets (>=44px) and 12px notice label passed browser checks; further physical-device review pending |
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
- The previous card and desktop-preview changes passed [V3 browser visual QA](https://github.com/Pixman022/fresnica-ui/actions/runs/44013491622) and [native OS QA](https://github.com/Pixman022/fresnica-ui/actions/runs/44013427506). The FAQ/type changes passed [V3 browser QA](https://github.com/Pixman022/fresnica-ui/actions/runs/44016276792); these automated tests are not physical-device sign-off.

## Continuation — compact chapter and footer tap-target audit (2026-11-17)

- Compared Chinese mobile 320px and 430px screenshots. Short feature, desktop and audience chapters ended below one viewport, so the next heading appeared prematurely; the final footer was shorter than the viewport and left a preceding dark strip at its top.
- Changed mobile minimum height for screens 4, 5, 6 and the About footer to at least `100dvh`, retaining natural scrolling for any overflowing content. The screen-8 FAQ fix remains intact.
- Increased the mobile footer navigation and third-party notice link hit areas to 44px; the notice link is now 12px (was 10px) with improved contrast. Desktop styling is unchanged.
- Added mobile browser checks for all affected scene heights, footer top alignment and footer link geometry, across compact viewport/theme cases.
- Commits: `1e8c8ab`, `de26d59`, `98528f0`, `860f32e`, `d21df78`, `6a068ad`. The earlier mobile About rule with higher ID specificity retained `80dvh`; `6a068ad` corrected this actual override to `100dvh` without altering the deliberately shorter desktop ending. Final [visual QA](https://github.com/Pixman022/fresnica-ui/actions/runs/44028746119), [native OS browsers](https://github.com/Pixman022/fresnica-ui/actions/runs/44028746183) and [Windows Edge zoom](https://github.com/Pixman022/fresnica-ui/actions/runs/44028746044) passed; physical-device acceptance remains open.

## Verification gate

1. Verify `V3 Website Visual QA` and native-OS checks on the V3 branch, including 320/360/393/430/480/680px, theme and language matrices.
2. Inspect screenshots for the feature rail, four desktop tabs, and security-to-FAQ transition; programmatic passing does not alone constitute visual approval.
3. Check that disabled download destinations remain disabled; get official publication destinations separately.
4. Leave real-device performance and the decision to remove `noindex` open until release verification.

## 2026-11-17 · secondary-page download semantics

- The main V3 preview already exposes three disabled iOS, Android and Desktop channels. The third-party notice page incorrectly routed its download options to product-description scenes.
- Changed both notice menus to three independent, explicitly unavailable channels with no navigation target and a bilingual status caption. The ordinary section navigation still links back with the selected language/theme.
- Added static release-audit coverage, localized download-group accessible names and 320px/393px/desktop checks. The test now asserts disabled status before a synthetic click, rather than asking Playwright to activate a disabled link. Commits: `9e40c06`, `630d9e0`, `7a0ac72`, `74d9b18`, `b66aa2e`, `ead2d32`; [latest visual QA run](https://github.com/Pixman022/fresnica-ui/actions/runs/44034861131) is the verification gate.
- Official HTTPS destinations, real device acceptance and publication approval remain pending; noindex and main-page download controls are unchanged.
