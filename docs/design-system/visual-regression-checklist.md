# Visual Regression Checklist

This checklist is the manual baseline for Fresnica UI visual review. It complements the token audit: token checks verify contracts, while this checklist verifies how the contracts appear together in the rendered interface.

## Review setup

- Viewport matrix: 320px, 360px, 390–393px (393px primary, 390px compatibility), 430px, 768px and an actual desktop width. Use CSS viewport pixels, not physical device pixels.
- Themes: complete the light pass and dark pass independently.
- Browser: latest Chromium or the product's supported browser matrix.
- State: capture the default, hover/focus, selected, disabled, loading and error states where the component supports them.
- Network: examples and wallet flows use Stellar terminology only.
- Wallet examples: Fresnica wallet flows remain inside the fixed 390 × 844 mobile preview frame. Treat it as the mobile-large example, then repeat the responsive checks at the matrix widths; scroll inside the frame to inspect content below the fold.
- Layout composition: use the built-in width switcher to review the same generic composition at 320px, 360px, 393px, 430px, 768px and desktop width.

At 200% browser zoom or an equivalent large-text setting, verify that headings, long addresses, amounts, dialogs, forms and navigation reflow without clipping or horizontal overflow. The design-system entry is evaluated as a web surface; the wallet entry remains a product example.

## Wallet flow routes

Review these Demo routes in both themes at mobile width:

- `/fresnica-home`
- `/fresnica-swap`
- `/fresnica-transfer`
- `/fresnica-activity`
- `/fresnica-settings`
- `/fresnica-transaction-details`
- `/fresnica-asset-details`
- `/fresnica-network-nodes`
- `/fresnica-explore-dapps`
- `/fresnica-scan`

For each route, verify:

- The page title is plain semantic text with the default theme text color; no ribbon, illustration or decorative banner appears.
- Primary actions use the correct theme primary (`#00A875` light, `#00CA8A` dark) and white text/icons on filled green surfaces.
- Each screen or action region has at most one large filled-primary emphasis. The wallet-home Send / Swap / Receive group is the approved exception.
- Ordinary icons, asset-symbol fallbacks, copy and Max/All actions, direction switches, helper text and estimated values use neutral tokens.
- The wallet-home balance card uses the neutral theme surface, no decorative outline or green gradient, and no address background fill.
- The active bottom-navigation item uses a primary icon and label on a transparent background, without a green selected container.
- Swap keeps its intentional inverse treatment: black in light theme and white in dark theme.
- Financial roles remain distinct: brand, success, transaction/request failure, validation error, gain, loss, warning and high risk are not merged because their hex values are similar.
- Surfaces use theme-aware tokens, visible borders and no elevation shadows.
- Lucide icons have the intended semantic color and a minimum 44px interactive target where applicable.
- Long Stellar addresses, balances and transaction states remain readable without clipping or horizontal overflow.

## Component state pass

- Button: primary, secondary, inverse/swap, danger, disabled, loading and icon-only states.
- AddressField and AmountField: copy, paste and Max/All actions remain neutral; semantic validation states retain their own colors.
- Select, DatePicker and TimePicker: open panel, selected item, keyboard focus and dark-theme surface.
- Checkbox, Radio and Switch: selected/unselected, disabled and dark-theme control borders.
- Modal, Drawer and Notification: white/light-theme and dark-theme surfaces, semantic icon colors, focus restore and close actions.
- Progress and Skeleton: token colors, readable labels and no green used for unrelated failure or disabled states.
- Tabs, Table, Pagination and BackTop: selected, disabled, alternating-row and dark-theme states.
- Image and Carousel: broken-image fallback, loading state, preview close action and approved asset proportions.

## Custom theme pass

- Open the theme-color control from the design-system home, component documentation and wallet examples.
- Enter a valid six-digit HEX value and confirm that brand and interaction colors update in both light and dark modes.
- Try a very light, very dark and highly saturated color; primary action text and icons must remain readable at WCAG AA contrast.
- When an adjustment occurs, the inline status explains that visibility was protected, shows the effective HEX color, and the HEX field keeps the original input.
- Enter an invalid HEX value; the current valid theme must remain active and the field must recover to the last valid value on blur.
- Confirm that success, failure, gain, loss, warning and high-risk colors remain visually distinct from the generated brand color.
- Reload the page, open a second tab and change the theme; persistence and cross-tab synchronization must both work.
- Use “Reset” and confirm that the original Fresnica light/dark tokens are restored without changing unrelated semantic colors.

## Evidence

Record the review date, browser, viewport, theme and route. When a mismatch is found, attach a screenshot and link the issue to the relevant Token or component document. Do not change a Token solely to match one screenshot without checking both themes and the financial semantic role.

### Latest review record

- 2026-09-20 · 200% browser zoom · design-system `/layout` · light/dark theme behavior and responsive card bounds reviewed and accepted after the layout overflow fix.
- The shared responsive contract remains: page containers shrink with `min-width: 0`, long content wraps, and tables/API blocks own their local horizontal scrolling. Follow-up checks use the viewport matrix above.
