---
name: fresnica-ui-style
description: >
    Build React or standalone HTML interfaces in the Fresnica Stellar wallet design
    language: minimal fintech surfaces, green primary actions, Roboto typography,
    Lucide icons, light/dark themes and mobile-first wallet flows.
---

# Fresnica UI style

Fresnica UI is a React + TypeScript component library for Stellar wallet products. It uses semantic `--Fresnica-*` tokens, Lucide interface icons and CC BY-NC 4.0 licensing.

## Choose the scenario

| Scenario | Entry |
| --- | --- |
| React project using the npm package | [references/react-project.md](references/react-project.md) |
| Single self-contained HTML file | [references/standalone-html.md](references/standalone-html.md) |

## Visual contract

- Light primary `#00A875`; dark primary `#00CA8A`.
- Every green filled control uses white text.
- Swap can use the inverse action: black in light mode and white in dark mode.
- Neutral semantic surfaces, subtle borders and 8–24px radii; do not use elevation shadows.
- Roboto with `Noto Sans SC` fallback; tabular numerals for balances, fees and rates.
- Interface icons come from Lucide. Only approved Fresnica logo/app-icon assets may use images.
- Motion lasts 0.15–0.35s and provides reduced-motion behavior.
- Product content is limited to Stellar terminology unless the user expands network scope.
- Avoid decorative artwork, textured backgrounds, irregular shapes and game-like effects.

## Tokens

Import `fresnica-ui/style` once, then consume `var(--Fresnica-*)` variables. Exact values live in the canonical [design tokens](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/design-tokens.md) and [component specs](https://github.com/Pixman022/fresnica-ui/tree/main/docs/design-system/components).

Use `--Fresnica-accent-purple-*` for protocol-purple semantics. The former `--Fresnica-secondary-*` compatibility alias was removed in the 2.0.0 cleanup.

Use `--Fresnica-shadow-base` only when explicitly expressing the no-shadow contract. The former `--Fresnica-shadow-sm` and `--Fresnica-shadow-lg` compatibility aliases were removed in the 2.0.0 cleanup.

## Component references

Read the matching file before using an API:

- [General](references/components/general.md)
- [Layout and product composition](references/components/layout.md)
- [Form controls](references/components/form-controls.md)
- [Form](references/components/Form.md)
- [Overlays](references/components/overlays.md)
- [Feedback](references/components/feedback.md)
- [Notification](references/components/Notification.md)
- [Data display](references/components/data-display.md)

## Hard rules

1. Never invent props; source declarations are authoritative.
2. Import `fresnica-ui/style` exactly once at the application entry.
3. Use semantic tokens instead of hard-coded colors when a token exists.
4. Keep focus visible, touch targets at least 40px and primary actions preferably 48px.
5. Use Lucide for interface icons; do not use emoji, Unicode glyphs or hand-drawn SVG controls.
6. Keep titles and overlays semantic and rectangular, without decorative artwork.
7. Verify both themes at 320px, 360px, 390–393px and 430px mobile widths, plus the 768px tablet transition and a desktop width.
8. Use only Stellar Mainnet, Testnet and Horizon terminology in product examples.
