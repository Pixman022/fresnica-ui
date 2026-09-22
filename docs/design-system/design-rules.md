# Fresnica Design Rules

These rules are the current source of truth for Fresnica products.

## Visual principles

1. **Product character**: modern fintech and crypto wallet; corporate, precise, and softly rounded.
2. **Primary color**: Light `#00A875`; Dark `#00CA8A`. Recommended hover colors are Light `#00CA8A` and Dark `#32DFA4`; active colors are Light `#008F65` and Dark `#00A875`. Reserve primary green for brand identity, the dominant action and necessary selection states; it is not the default color for ordinary information.
3. **Secondary colors**: keep a four-color semantic accent palette—protocol purple (Light `#6956C8`, Dark `#B8A9FF`), network blue (Light `#356AE6`, Dark `#8EAEFF`), swap/liquidity orange (Light `#C96A16`, Dark `#FFB86B`), and pending/caution yellow (Light `#A87500`, Dark `#F6C65B`). Do not add hues without a new product state.
4. **Surfaces**: use semantic surface levels and visible 1px borders. Components and floating layers do not use elevation shadows; hierarchy comes from surface contrast, borders and overlays.
5. **Radius**: controls use 8–16px radii; cards and floating surfaces use 16–24px. Full pills are reserved for compact tags, switches, and segmented controls.
6. **Typography**: Roboto, `Noto Sans SC`, then system fallbacks. Body starts at weight 400; labels and actions typically use 600–700.
7. **Motion**: 0.15–0.35s with `cubic-bezier(0.4, 0, 0.2, 1)` and a reduced-motion fallback.
8. **Focus**: every interactive element uses `--Fresnica-focus-color`, never an unrelated decorative color.

## Mobile typography baseline

Use Roboto for Latin/numeric content and `Noto Sans SC` for Chinese, with the existing system fallbacks. The mobile baseline is checked at 320px, 360px, 390–393px and 430px; 768px and desktop widths use the platform adaptation rules:

| Role | Size / line-height | Weight | Usage |
| --- | --- | --- | --- |
| Screen title | 20 / 26px | 700 | Top bar and page title |
| Section title | 16 / 22px | 700 | Card and sheet headings |
| Body | 14 / 20px | 400 | Primary content and form values |
| Label | 12 / 16px | 600 | Field labels, metadata, badges |
| Primary amount | 28–32 / 36–40px | 700 | Balance and transaction amount |
| Button label | 15 / 20px | 600 | Primary and inverse actions |

Use tabular numerals for balances, rates, fees and transaction IDs. Keep text blocks at roughly 45–70 characters per line and do not reduce body text below 14px for primary content.

## Network scope

The current product scope is Stellar only. Network labels, nodes and examples must use Stellar Mainnet, Stellar Testnet or Stellar Horizon terminology; do not introduce Ethereum, Solana, Polygon or other chain-specific UI until the product scope changes.

## Foreground contrast contract

- Every green filled action or selected control uses pure white text: `#FFFFFF`.
- This includes primary buttons, loading primary buttons, active Tabs, selected Pagination items, selected DatePicker/TimePicker items, and primary Modal actions.
- Never use dark text on a green filled control, even in dark mode.
- Purple filled controls must use a foreground that passes WCAG AA; soft purple containers use `--Fresnica-accent-purple-color-bg` and `--Fresnica-accent-purple-color`.
- Disabled controls may reduce opacity but must remain legible.

## Green emphasis hierarchy

- Keep at most one large filled-primary emphasis in a screen or action region. The approved Send / Swap / Receive group on the wallet home screen is a documented product exception.
- Use neutral surface and text tokens for ordinary icons, asset-symbol fallbacks, copy actions, Max/All actions, direction switches, helper text and estimated values.
- Bottom navigation marks the current destination with a primary icon and label on a transparent background; it does not add a green selected container.
- Brand primary, success and gain remain separate roles. A completed transaction or online connection uses success tokens; a positive asset movement uses gain tokens; neither uses the primary token simply because all three appear green.
- Protocol identity may use protocol purple, and network identity may use network blue. These accents communicate meaning and must not become decoration.
- Focus may use the focus token without changing a neutral control into a persistent primary-green control.

## Component rules

- **Button**: primary is green with white text and is reserved for the dominant action; default/dashed stay on neutral surfaces. Copy, Max/All, direction switching and other secondary actions remain neutral. `inverse` is reserved for Swap and similarly rare core actions that intentionally invert black/white across themes.
- **Tabs**: active tab is green with white text; inactive tabs use secondary text.
- **Card**: use semantic surfaces and subtle borders; avoid ornamental game patterns in wallet flows.
- **Input and Select**: 48px default touch height, neutral surface, visible green focus ring.
- **Modal and Drawer**: conventional rounded fintech surfaces with focus trapping and a strong overlay hierarchy.
- **Feedback**: brand, success, transaction failure, gain, loss, warning, high risk, and protocol roles use separate semantic tokens—even when their hues are related. Input validation errors use `error`, not `failure`.
- **Data display**: preserve compact density, tabular numerals, horizontal overflow, and clear row states.

## Prohibited in Fresnica production UI

- Nature-themed illustrations, playful scene decoration, irregular blobs, or novelty cursors.
- Textured backgrounds, exaggerated thick shadows, or ornamental hover fills.
- Pure black text on dark surfaces or low-contrast gray text.
- Hard-coded colors where a Fresnica semantic token exists.
- Non-Lucide interface icons, except the approved Fresnica logo and app icon brand assets.

## Review checklist

- Light and dark themes both render correctly.
- A screen does not use primary green for ordinary icons, metadata, estimated values or secondary actions.
- Large primary-green emphasis is limited to one action region, except for the approved wallet-home quick-action group.
- Green filled controls display white text in default, hover, active, and loading states.
- Keyboard focus is visible and logical.
- Touch targets are at least 40px, preferably 48px for primary actions.
- Text and controls meet WCAG AA contrast.
- Components use semantic tokens and retain their documented API behavior.
