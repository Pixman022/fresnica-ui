# Fresnica dual-theme palette rollout — 2026-11-26

## Decision
This is an explicit replacement of the previous Web 1.0.0 brand palette. Web/Native token contract version: **1.1.0**.

| Semantic role | Light | Dark |
| --- | --- | --- |
| `action-primary` | `#0F7954` | `#00CA8A` |
| `action-primary-hover` (Web) | `#0D724F` | `#32DFA4` |
| `action-primary-pressed` | `#0C6748` | `#00A875` |
| `content-on-primary` | `#FFFFFF` | `#101312` |
| `background-canvas` | `#F9F9FB` | `#101312` |
| `surface-default` | `#FFFFFF` | `#171B19` |
| `surface-raised` (Native) | `#FFFFFF` | `#202623` |
| `content-primary` | `#1A1C1D` | `#F4F7F5` |

Brand colors and financial feedback colors remain separate semantic roles. This change does **not** replace the success, failure, gain/loss, warning, or risk-high palette, even where two roles happen to use similar green values.

## Contrast checkpoints (WCAG AA normal text: 4.5:1)
- Light primary `#0F7954` / white: **5.41:1**.
- Light pressed `#0C6748` / white: **6.89:1**.
- Dark primary `#00CA8A` / dark text `#101312`: **8.73:1**.
- Dark pressed `#00A875` / dark text `#101312`: **6.10:1**.

Primary button state pairs are now gated by `npm run test:contrast`. The change does not imply that all statuses, muted text, or focus states have passed a full accessibility audit.

## Delivery and compatibility
1. Web source of truth: `design-system/tokens.json`, `src/styles/variables.less` and `src/styles/themes/default.less`.
2. Platform theme source: `design-system/platform-token-source.json`. Native consumes a **pinned Web commit and two Git blob SHAs**, regenerates its contract, then runs Native CI.
3. Custom-theme UI keeps the user's selected brand HEX but derives a mode-appropriate foreground color and preserves semantic financial colors.
4. The archived/frozen V2 website remains available as a historical visual baseline. Active V3 marketing preview is adjusted separately; procedural visual effects and brand image assets are not treated as the same token as interactive button color.
