# Token architecture

Fresnica UI uses a three-layer token model. The layers make the visual system easier to extend across light, dark and locally customized themes without changing component markup or the existing visual baseline.

## Layer responsibilities

| Layer | Purpose | Typical contents |
| --- | --- | --- |
| Primitive | Stores reusable raw building blocks. A primitive describes a value, not why it is used. | Colors, font families and sizes, weights, line height, spacing, radius, control sizes, border width, motion and shadow values. |
| Semantic | Gives a primitive a product meaning so themes can change the value behind a role. | Canvas and surface backgrounds, primary and secondary content, borders, primary actions, disabled state, feedback, status, risk, focus and overlay roles. |
| Component | Defines the contract consumed by one component family. It combines semantic roles with geometry and interaction states. | Button, Input, Card, Dialog/Modal, Select, Drawer, Table and Tag backgrounds, content, borders, sizes, padding, radius, state colors and transitions. |

The direction is always:

```text
legacy runtime variable → Primitive → Semantic → Component
```

Components should consume Component tokens where a component contract exists. New components should add a Component contract only when the value is reused or represents a stable public behavior; one-off geometry remains local and documented.

## Files and runtime behavior

- `design-system/tokens.json` is the structured inventory and light-theme baseline for the three layers.
- `design-system/tokens.css` exposes the layers as CSS custom properties. Its aliases intentionally resolve to the existing `--Fresnica-*` runtime variables.
- `src/styles/themes/default.less` remains the source for light, dark and custom-theme runtime values.
- `src/styles/index.less` imports the layered CSS before component styles.

This compatibility bridge is deliberate. The first migration does not delete or rename any existing `--Fresnica-*` variable and does not change a rendered value. Existing theme switching and local custom-theme generation therefore continue to work through the legacy runtime variables.

## Current migration map

| Existing style contract | Layered contract | Status |
| --- | --- | --- |
| `--Fresnica-primary-color*` | `primitive.color.brand-primary*` → `semantic.color.action-primary*` → `component.button.primary-background*` | Button migrated |
| `--Fresnica-surface*`, `--Fresnica-text-color*` | `semantic.color.surface-*`, `semantic.color.content-*` | Button, Input, Card, Dialog, Select, Drawer, Table and Tag migrated where applicable |
| `--Fresnica-border-color*` | `primitive.color.border-*` → `semantic.color.border-*` | Same components migrated where applicable |
| `--Fresnica-spacing-*`, `--Fresnica-border-radius-*`, `--Fresnica-height-*` | `primitive.space.*`, `primitive.radius.*`, `primitive.size.*` | Component geometry migrated for the listed components |
| `--Fresnica-mask-bg` and motion variables | `semantic.overlay-scrim`, `semantic.motion.*` | Dialog and shared interaction contracts migrated |
| Wallet display, navigation and compact status variables (`--Fresnica-spacing-*`, `--Fresnica-surface-*`, feedback, status and focus roles) | Primitive geometry plus semantic surface, content, action, feedback and status roles | BalanceCard, AmountField, AssetRow, AssetIcon, BackTop, BottomNavigation, NetworkBadge, TransactionStatus and WalletSwitcher migrated; legacy runtime values remain unchanged |
| Supporting display, feedback and navigation variables (`--Fresnica-spacing-*`, `--Fresnica-surface-*`, content, border and motion roles) | Primitive geometry plus semantic surface, content, action, feedback, border and motion roles | Divider, EmptyState, ErrorState, FeeSummary, Footer, Loading, Skeleton, Tabs and Title migrated; legacy runtime values remain unchanged |
| Progress and selection controls (`--Fresnica-primary-color*`, `--Fresnica-border-color*`, `--Fresnica-motion-*`) | Primitive control geometry plus semantic action, content, surface, border and focus roles | Progress, Radio and Switch migrated; inverse handle colors remain legacy compatibility values because no new visual value was introduced |
| Choice and shortcut controls (`--Fresnica-primary-color*`, `--Fresnica-surface-*`, `--Fresnica-spacing-*`) | Primitive geometry plus semantic action, content, surface and focus roles | Checkbox and QuickAction migrated; existing variants and states retain their visual values |
| Address, disclosure and code presentation variables (`--Fresnica-border-color*`, `--Fresnica-spacing-*`, `--Fresnica-motion-*`) | Primitive geometry plus semantic content, surface, border, action and focus roles | AddressField, Collapse and CodeBlock migrated; dedicated syntax/code colors remain compatibility variables |
| Tooltip, route and transaction-row variables (`--Fresnica-surface-*`, `--Fresnica-spacing-*`, status roles) | Primitive geometry plus semantic content, surface, border, action, focus and financial status roles | SwapRoute, Tooltip and TransactionRow migrated; success/warning/failure status container contracts remain separate |
| Media and carousel variables (`--Fresnica-surface-*`, `--Fresnica-border-color*`, `--Fresnica-motion-*`) | Primitive media geometry plus semantic surface, border, content, action, overlay and focus roles | Image and Carousel migrated; raster content and code-specific colors remain outside the semantic palette |
| Date/time, pagination and feedback variables (`--Fresnica-spacing-*`, `--Fresnica-surface-*`, `--Fresnica-text-color*`, `--Fresnica-primary-color*`, inverse surface/content) | Primitive control geometry plus semantic surface, content, border, action, feedback, focus and inverse roles | DatePicker, TimePicker, Pagination, Notification and TransactionDetails migrated; inverse notification surface/content aliases preserve the existing compact-notification contrast |
| Component-specific legacy declarations | `component.select.*`, `component.drawer.*`, `component.table.*`, `component.tag.*` | New compatibility contracts added without changing values; Table row hover now consumes a Component Token that preserves the existing 10% primary tint |

The old variables remain the compatibility API during this phase. The layered names are additive and may be adopted incrementally by other components.

## Compatibility and migration order

1. Keep legacy variables and theme overrides unchanged.
2. Add or update the structured entry in `tokens.json`.
3. Add the corresponding CSS alias in `tokens.css`, resolving through the legacy runtime variable or an earlier layer.
4. Migrate one component family to Component tokens while comparing rendered values.
5. Run `npm run audit:tokens`, visual checks and component tests.
6. Document any intentionally unused public contract; do not remove it automatically.

The current component migration is complete for the reviewed component families. Any remaining direct legacy-variable usage is an intentional compatibility bridge or a reviewed exception. Future migrations may adopt the layered names incrementally while preserving existing values and state behavior; renaming, deleting a legacy variable, or introducing a new visual value requires a separate design-system decision.

## Contract rules

- Do not use a Component token to replace a different semantic role merely because the current colors happen to match.
- Keep financial roles such as success, failure, gain, loss, warning and risk separate.
- Prefer semantic aliases for theme-sensitive colors; keep raw values in Primitive definitions or reviewed exceptions.
- Component interaction tokens may contain a CSS color function when that function is the exact existing visual contract; keep the referenced semantic role inside the function so theme switching remains intact.
- Keep unused public contracts when they represent a future state, variant or compatibility bridge.
- Treat `tokens.json` and `tokens.css` as additive in the first migration; the existing runtime theme remains authoritative.
