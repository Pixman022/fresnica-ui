# Fresnica V3 — M13 revised screens, snap pacing and carousel QA

Date: 2026-10-28
Branch: `design/website-vision-motion-concept-2026-10-27`

## Requested changes / implemented

- Wheel threshold remains intentional (74 px desktop), but auto-snap duration is reduced to 440–680 ms. Snap targets correspond to a chapter's fully revealed *hold* state, not the onset of its entrance. Standard native scrolling remains on mobile and when the user enables Reduced Motion.
- The header's top-right IN DEVELOPMENT status pill was removed. The language and disabled global-theme placeholder controls now have dark backgrounds. The introductory sphere's product-development notice remains for accurate status.
- The Hero text/visual grid is expanded, with a larger orbit field. The WebGL shader and existing fluid orb implementation are unchanged.
- On screen 2, the upper "Your Stellar world." title persists while "Your next move." enters; the next wheel gesture advances to the newly reordered screen 3.
- The site now contains **ten ordered screens**: Hero; ecosystem; mobile-app download/availability; five essentials; assets; audience carousel; illustrative desktop companion; payment paths; dark Q&A; footer. Original screen 10 download is not duplicated.
- Mobile-app and desktop-companion content is consistently labeled **planned/concept**, without invented availability or live download links.
- All five feature cards are simultaneously centered and visible at desktop widths >=1280px. The existing responsive horizontal rail remains on smaller viewports.
- The audience cards now auto-scroll when their screen enters view, looping via clones. Actual user interaction/focus pauses the carousel; Reduced Motion disables auto-scroll. The existing previous/next buttons remain.
- The dark Q&A screen contains four accessible expandable questions with truthful Stellar, release and desktop concept statements.
- The footer wordmark is pulled closer vertically to footer navigation. Ten-screen chapter counts and menu links are updated.
- English remains the default; Chinese translations cover the new desktop and Q&A text.
- M5 particle scene upper title persistence and M7's retained navbar styling are small guard adjustments. All other original M5/M6/M10 logic is unchanged.

## Local testing
- Chromium/Playwright: **89/89** desktop and responsive checks passed for 1440x900, 1920x1080, 1280x720, 900x844, 390x844 and 1440x900 Reduced Motion.
- Verified exact ten-screen ordering; third mobile, fourth five-card feature, sixth carousel, seventh desktop, ninth dark Q&A, tenth footer.
- Verified every card fully visible and group centered at 1280/1440/1920. No page horizontal overflow or uncaught JS exceptions.
- On the second screen's snap stop, top and bottom headlines both have computed opacity 1. The next wheel gesture reaches the mobile-app page.
- Audience track advanced from approximately 41px to 138px in 1.6s during the active screen, with its original controls intact.
- Language toggles correctly to Chinese and back. Desktop and Q&A segmented headlines were tested in Chinese at 1440px and 390px.
- FAQ expansion/collapse and theme placeholder state were verified.
- Mobile uses readable static text; Reduced Motion keeps its native navigation fallback.
- Browser screenshots captured for eight desktop screens and seven mobile screens.

## Limitations
- Approval of the exact timing on the user's real mouse/trackpad, Windows hardware WebGL and visual resemblance to the original 94-second reference remain open.
- This is a website concept; Android/iOS downloads and desktop software were not asserted available.
- Pages deployment must verify the two added M13 assets, preserve frozen V2 HTML checksum, and release only the isolated V3 preview path.

## Published release verification
- V3 source commit: `6ab93e89752b482cc56eda66aed972112e0972c5`.
- [GitHub Pages workflow run 40616935537](https://github.com/Pixman022/fresnica-ui/actions/runs/40616935537) completed **success**.
- Verification, production dependency audit, V3 overlay checks, Pages artifact upload and deployment all passed.
- Published artifact listing contains both `./fresnica-v3-motion-preview/m13-revisions.js` and `./fresnica-v3-motion-preview/m13-styles.css`; workflow also uses file-content comparisons before upload.
- The original V2 checkout is still `f3e68515d90fe05a12a640db153f1b14004cad32`; old preview HTML SHA-256 remains `c522893e32d794ade98e7338624e9756d634a744bc93f199f7ea3289824679fe`.
- The unchanged `main` and archived V2 refs were rechecked after the deploy.
- URL: https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/
- This confirms Pages deployment and artifacts; the assistant's browser could not independently fetch the live GitHub Pages URL, so real Windows Chrome GPU/scroll-wheel visual approval remains open.
