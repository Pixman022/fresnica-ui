# Demo Site

The demo is split into two independent HTML entries. `index.html` documents the Fresnica design system and component library; `examples.html` presents the Fresnica Stellar wallet flows. Both use semantic CSS variables and no decorative background images.

## Layout

- Root: full `100dvh` flex layout with a neutral background and a subtle primary radial highlight.
- Desktop sidebar: 268px wide, 12px outer margin, 16px radius, semantic border and no shadow.
- Main area: flexible width, independent scrolling, `32px 40px` padding.
- Active menu item: primary background and `--Fresnica-on-primary-color`; inactive items use secondary text.
- Menu items have a 44px minimum height, adapt to wrapped labels, use a 12px radius and a restrained primary-container hover.

## Mobile

- Breakpoint follows `useIsMobile`; the fixed top bar is 52px high with a blurred semantic surface.
- Main content uses 16px side padding and 68px top padding.
- The navigation drawer is 240px wide with a standard dark mask.
- Navigation controls use Lucide icons and expose accessible labels.
- The Layout page provides a demo-only viewport switcher for `320px`, `360px`, `393px`, `430px`, `768px` and desktop-width composition checks.

## Home page

- Hero uses the approved Fresnica logo and app icon only.
- Typography uses Roboto with `Noto Sans SC` fallback and the mobile scale from the design rules.
- Feature and component cards use semantic surfaces, borders, radii and restrained lift-on-hover motion.
- Examples describe Stellar assets, transfers, swaps, network status and transaction signing.
- Theme examples show light primary `#00A875`, dark primary `#00CA8A`, and only `--Fresnica-*` variables.

## Wallet examples (`examples.html`)

Keep the following routes visually verified in both themes at mobile width: home, swap, transfer, activity, settings, transaction details, asset details, network nodes, dApp exploration and scan.

- `WalletDemoShell` is the single preview contract for wallet routes: 390px wide, 844px high, theme-aware canvas, internal vertical scrolling with the visual scrollbar hidden, and hidden horizontal overflow. This is the mobile-large example, not the cross-platform layout baseline.
- Responsive review presets are 320px, 360px, 390–393px, 430px, 768px and actual desktop width. The wallet frame remains fixed for product preview; responsive behavior is validated separately.
- Wallet controls inside this canvas use the existing `--Fresnica-height-base` contract as the minimum touch target. Larger authored controls keep their intended size.
- The shell forces the wallet composition into its mobile layout through React context. Wallet demos must not infer their layout from the desktop browser width when rendered inside this frame.
- Product information architecture follows the supplied Fresnica references: screen context first, one primary task per route, supporting content second and the shared five-item navigation last.
- The shell is Demo-only. It is not exported as a public library component and must not introduce new wallet fields or product capabilities.

The design-system entry does not include these product pages in its navigation or component bundle. Use the examples entry when reviewing product information architecture and mobile wallet composition. Empty and error patterns are documented as generic components in the design-system entry; their wallet usage remains in the examples entry.
