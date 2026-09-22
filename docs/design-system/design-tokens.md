# Fresnica Design Tokens

The canonical implementation is `src/styles/variables.less` plus `src/styles/themes/default.less`. Product code should consume the CSS custom properties, not duplicate raw values.

## Brand and semantic colors

| Role | Light | Dark | Light hover | Dark hover |
| --- | --- | --- | --- | --- |
| Primary | `#00A875` | `#00CA8A` | `#00CA8A` | `#32DFA4` |
| Success (completed state) | `#00CA8A` | `#00CA8A` | `#19BD8A` | `#19BD8A` |
| Failure (transaction/request) | `#C73945` | `#C73945` | `#DD5662` | `#DD5662` |
| Warning | `#9A6700` | `#F59E0B` | `#B47B00` | `#F7C35F` |
| Protocol purple | `#6956C8` | `#B8A9FF` | `#7B6BD6` | `#C9BEFF` |
| Network blue | `#356AE6` | `#8EAEFF` | `#2858C9` | `#A9C1FF` |
| Liquidity orange | `#C96A16` | `#FFB86B` | `#AA5510` | `#FFCA8F` |
| Pending yellow | `#A87500` | `#F6C65B` | `#8B6200` | `#FFD982` |
| Gain (asset change) | `#0A8F68` | `#32DFA4` | `#0F9F72` | `#5AE8BA` |
| Loss (asset change) | `#B42318` | `#FF7A86` | `#D92D20` | `#FF9AA3` |
| High risk | `#7A271A` | `#FF9B85` | `#9E2F20` | `#FFB5A3` |

Primary active is `#008F65` in light mode and `#00A875` in dark mode. Every primary filled control uses `--Fresnica-on-primary-color: #FFFFFF`. Primary is an emphasis token, not a default icon or information color: ordinary icons, metadata, helper actions and estimated values use the neutral surface/text scale.

Inverse actions use `#111214` with white text in light mode and white with `#111214` text in dark mode. Reserve this treatment for Swap and similarly rare core actions.

Completion uses `--Fresnica-success-*`; transaction or request failure uses `--Fresnica-failure-*`; input validation errors retain `--Fresnica-error-*`. Financial direction uses separate `--Fresnica-gain-*` and `--Fresnica-loss-*` tokens. Warnings use `--Fresnica-warning-*`, while high-risk warnings use `--Fresnica-risk-high-*`. These roles remain separate even when two values are visually related.

### Semantic containers

Compact status labels use a background plus an explicit `on-*-container` foreground. Do not place the raw accent color on its own tinted background without checking contrast.

| Role | Light background / foreground | Dark background / foreground |
| --- | --- | --- |
| Success | `#D4F7E9` / `#005235` | `#12372B` / `#A9F5D0` |
| Failure | `#FCEBED` / `#871D29` | `#44262B` / `#FFC0C6` |
| Gain | `#E0F7EF` / `#075C43` | `#123D30` / `#B2F5DC` |
| Loss | `#FDE8E7` / `#8F1D15` | `#4A252B` / `#FFD0D4` |
| Warning | `#FFF3D6` / `#684700` | `#463817` / `#FFE3A1` |
| High risk | `#FBE9E7` / `#5C1D14` | `#4A2923` / `#FFD2C7` |

## Neutral surfaces

| Token | Light | Dark |
| --- | --- | --- |
| `--Fresnica-bg-color` | `#F9F9FB` | `#222226` |
| `--Fresnica-bg-color-secondary` | `#F3F3F5` | `#1A1A1E` |
| `--Fresnica-surface-lowest` | `#FFFFFF` | `#0E0E10` |
| `--Fresnica-surface` | `#FFFFFF` | `#222226` |
| `--Fresnica-surface-high` | `#EDEEF0` | `#2A2A30` |
| `--Fresnica-surface-highest` | `#E8E8EA` | `#34343C` |
| `--Fresnica-text-color` | `#1A1C1D` | `#F5F5F7` |
| `--Fresnica-text-color-secondary` | `#3F4942` | `#A0A0A5` |
| `--Fresnica-border-color` | `#E3E3E5` | `#2E2E34` |

`--Fresnica-surface-lowest` is the reserved public canvas token for an app shell or full-screen background. It intentionally has no component-library consumer yet. Components must use `--Fresnica-surface`, `--Fresnica-surface-low`, `--Fresnica-surface-high`, or `--Fresnica-surface-highest` according to their layer; do not use `surface-lowest` as a generic white/black replacement.

Floating-layer masks are `rgba(0,0,0,.45)` in light mode and `rgba(0,0,0,.72)` in dark mode. Demonstrations that require an intentional opacity variant use `--Fresnica-mask-bg-subtle` or `--Fresnica-mask-bg-strong`; components never duplicate raw overlay values.

## Code presentation

Code presentation is a separate non-financial semantic palette. `--Fresnica-code-bg`, `--Fresnica-code-border`, `--Fresnica-code-text` and the `--Fresnica-code-*` syntax roles preserve the approved dark editor treatment in both application themes. Code blocks use `--Fresnica-font-family-mono`; none of these roles may substitute for brand, status or financial-direction colors.

## Typography

```css
font-family: Roboto, 'Noto Sans SC', -apple-system, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

Base sizes are 12px, 14px and 16px. Role tokens cover caption 11px, supporting text 13px, actions 15px, section titles 18px, screen titles 20px, large titles 28px, amounts 32px and display amounts 48px. The supported weights are regular 400, medium 500, semibold 600 and bold 700 through `--Fresnica-font-weight-*`. Product pages use the mobile hierarchy in `design-rules.md`, including tabular numerals for balances and fees.

## Geometry and spacing

- Spacing scale: 4, 8, 12, 16 and 24px.
- Radius scale: `--Fresnica-border-radius-sm` (8px), `--Fresnica-border-radius-control` (12px), `--Fresnica-border-radius-base` (16px), `--Fresnica-border-radius-lg` (24px); compact pills use `--Fresnica-border-radius-pill` (9999px). Circles may use 50% as a component-level shape exception.
- Control heights: 32px (`sm`), 36px (`compact`), 48px (`base`), 52px (`emphasis`) and 56px (`lg`).
- Borders: 1px by default.

Protocol-purple semantics use the explicit `--Fresnica-accent-purple-*` names. The former `--Fresnica-secondary-*` compatibility aliases were removed in the 2.0.0 cleanup. Likewise, `text-color-secondary` is supporting text while `text-color-muted` is intentionally quieter in dark mode; they are not interchangeable.

## Elevation and motion

- `--Fresnica-shadow-base` is the supported explicit no-shadow contract and resolves to `none` in both themes. The former `--Fresnica-shadow-sm` and `--Fresnica-shadow-lg` compatibility aliases were removed in the 2.0.0 cleanup. Hierarchy is expressed with surface contrast and 1px borders.
- Durations: 0.15s, 0.25s and 0.35s.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- Focus rings use `--Fresnica-focus-color`, which follows the primary color in each theme.
- Components must supply a `prefers-reduced-motion` fallback for continuous or substantial motion.
