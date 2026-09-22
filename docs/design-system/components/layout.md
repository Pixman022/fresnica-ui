# Layout and structure

Fresnica layout components use neutral surfaces, visible borders and semantic color tokens without elevation shadows. Product screens must not add scene illustrations, ribbons, texture patterns or playful decorative motion.

## Footer

The footer is text-only. Use `default` for ordinary pages and `compact` for dense mobile layouts.

## Card

Source: `src/components/Card`.

- Default cards use `--Fresnica-surface`, a subtle token border and the 24px large-radius token.
- `type="dashed"` is reserved for add/import/empty-state entry points.
- Set `hoverable` only when the complete card is interactive. Hover changes the border to the primary color and lifts the card by 2px; dashed cards do not move.
- `color` is for short semantic callouts, not large page containers. Use the documented semantic roles shown in the demo; financial roles (success, failure, gain, loss, warning and high risk) remain distinct from brand and protocol accents.
- Legacy color aliases remain API-compatible but map to those same semantic tokens; they never introduce extra hues or light-only surfaces.

```tsx
<Card>Account summary</Card>
<Card type="dashed" hoverable>Add account</Card>
<Card color="purple">Protocol notice</Card>
```

## Responsive composition preview

The Layout demo includes a demo-only viewport switcher for the generic component composition. It previews the same content at `320px`, `360px`, `393px`, `430px`, `768px` and the available desktop width.

- The preview changes the container width, not the browser window or the library tokens.
- The width menu includes a neutral context label (`small mobile`, `common mobile`, `large mobile`, `extra-wide mobile`, `tablet portrait` or `current browser window`). These are scenario references rather than one-to-one device mappings.
- The selected preset is followed by a device-reference line for orientation only; the reference names are examples and do not define a device compatibility contract.
- The Layout page uses a `1200px` maximum content width on desktop so the composition can show its multi-column behavior without stretching into an unreadable full-viewport line length; other component pages keep their normal reading width.
- Below the compact breakpoint, the form becomes one column, actions wrap, and supporting text is allowed to reflow.
- At wider widths, the form and information list can share a row; the scale rows remain bounded by the preview container.
- Use the preview to compare spacing, radius and control-height relationships across widths. It is not a device simulator and does not replace product-route visual review.
- The switcher is part of the design-system demo only; it does not add a public component or change wallet examples.
- Turn on `显示尺寸标注` in the demo to review the typography, icon-size and touch-target baselines used by the composition. The annotation is a review aid, not a runtime component contract.

## TransactionDetails

Use `TransactionDetails` for a transaction summary, status, Stellar fields and an optional explorer action. Protocol-specific data belongs in `fields`. The component uses semantic surface and text tokens in both themes.

## Title

`Title` is plain semantic text using the Roboto / Noto Sans SC stack. It has no container, ribbon, gradient or ornament.

| size | intended use | type scale |
| --- | --- | --- |
| `large` | screen title | 28px / 700 |
| `middle` | section title | 18px / 700 |
| `small` | group title | 14px / 700 |

Choose `as="h1"` through `as="h4"` by document hierarchy rather than appearance. Screen-level titles (the large heading rendered at the top of each demo/product page) always use the default text color: black/near-black in the light theme (`--Fresnica-text-color`) and the high-contrast light value of that token in the dark theme. Do not assign page titles an accent color; semantic color variants are reserved for headings whose meaning requires them.

```tsx
<Title as="h1" size="large">Activity</Title>
<Title as="h2" size="middle">Assets</Title>
```

## Carousel

Source: `src/components/Carousel`.

Carousel is suitable only for a small set of product announcements or onboarding panels. It uses neutral surfaces, Lucide navigation icons and primary-color state indicators. Avoid autoplay for financial data and transaction states.

- Arrow buttons: 42px circular controls with `ChevronLeft` and `ChevronRight`.
- Indicator targets: 30px minimum; the active indicator is a 24px primary pill.
- Autoplay is off by default and pauses on pointer hover or keyboard focus.
- ArrowLeft/ArrowRight, Home and End navigate; reduced-motion mode removes transitions.

## Divider

Divider is a 1px token-based rule with `subtle`, `solid`, `dashed` and `accent` variants. Use `subtle` by default. Use `accent` sparingly to separate an important wallet action or summary.

## Collapse

Source: `src/components/Collapse`.

Collapse is intended for advanced transaction details, network explanations and help content. Its surface, border, text and focus states use Fresnica tokens. The leading Plus and trailing ChevronDown are Lucide icons; their rotation communicates expanded state and is functional motion, not decoration.

- Header hit area uses comfortable mobile padding.
- Expanded content is linked with `aria-controls` and `aria-labelledby`.
- Disabled items reduce opacity and remain non-interactive.

## Tabs

Source: `src/components/Tabs`.

Tabs use a `--Fresnica-surface` container and a primary active pill with white text. Hover uses `--Fresnica-primary-color-bg`; keyboard focus uses `--Fresnica-focus-color`. The container and tab list remain theme-aware instead of forcing a white background.

- Use two to five peer views, such as Assets / Activity or Send / Receive.
- Keep labels short and do not use decorative emoji or state badges.
- The small circle is a selection marker, not an illustration.
- ArrowLeft/ArrowRight, Home and End switch focus and selection.

All active primary surfaces must keep text and icons white through `--Fresnica-on-primary-color`.

## BalanceCard

BalanceCard is the filled-primary balance-summary variant. It supports fiat and secondary values, change display and privacy masking, and counts as the screen's single large primary emphasis. Use it only when that hierarchy is explicitly required. The current wallet-home example instead uses a neutral `--Fresnica-surface` card in light mode and `--Fresnica-surface-high` in dark mode, with no decorative border or gradient. On a filled-primary BalanceCard, negative change uses the loss container pair rather than raw loss text directly on green.

## WalletSwitcher

Compact account selector showing the current wallet, shortened address and optional avatar. Use it to switch local Stellar accounts, not networks.

## QuickAction

Mobile shortcut for Send, Receive, Swap and Scan. Supply Lucide icons only. The icon and label form one button with a minimum 44px target. Use neutral shortcuts by default. Primary or inverse variants require an explicit product hierarchy; the wallet-home Send / Swap / Receive group is the approved exception that retains its established colors.

## BottomNavigation

Formal mobile navigation for the product's primary destinations. Use the navigation labels and Lucide icons defined by the Fresnica product. Keep it pinned to the bottom of the mobile canvas with no decorative outer border. The active item uses semantic primary color for its icon and label, keeps a transparent background, and sets `aria-current="page"`. Reserve the soft primary background for hover; keyboard focus remains visible through the focus outline.

## AssetIcon

Displays an asset image when supplied and otherwise falls back to a short uppercase symbol. Use for Stellar assets and keep the rendered size consistent within a list. Fallback symbols use neutral text by default; apply protocol or issuer colors only when they identify the asset, never as generic decoration.

## AssetRow

One selectable asset summary with `AssetIcon`, balance, fiat value and optional change. Positive and negative change use gain/loss tokens only when they represent an actual change. Estimated values and ordinary balances stay neutral. The whole row may be interactive; selection may use a restrained primary tint without forcing all row text to primary green.

## TransactionRow

Compact transaction item for activity lists. Direction icons use Lucide; status text uses semantic container pairs and must not rely on color alone. Success uses `success`, failure uses `failure`, and pending uses `warning`.

## TransactionStatus

Status badge for `pending`, `success` and `failed`. Always render a readable label alongside the status marker. Use the corresponding `*-color-bg` and `on-*-container-color` pair so 11px labels remain legible in both themes.

## NetworkBadge

Displays the Stellar network and connection state (`online`, `degraded`, `offline`). Online uses success tokens, degraded uses warning tokens and offline uses failure tokens; brand primary is not a substitute for connection status. Fresnica currently supports Stellar only; network wording must not imply additional chains.

## SwapRoute

Displays the selected Stellar swap path, optional intermediate asset, rate and best-route status. Direction arrows come from Lucide and route emphasis stays informational rather than promotional.

### Component API additions

- `QuickAction` supports `variant` (`neutral`, `primary`, `inverse`), `size`, `selected` and `loading` for wallet shortcuts.
- `NetworkBadge` supports `size="compact"`, `showStatusText` and explicit `online`/`degraded`/`offline` status semantics.
