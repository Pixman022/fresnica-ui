# Composition-level component evaluation

Status: evaluated 2026-09-17. No new public component is introduced by this review.

## Scope

This record closes the open TODO about possible `WalletScreen` and `PageHeader` components. The review covers the wallet product examples under `demo/components/Fresnica*` and the shared `WalletDemoShell` / `FresnicaNavigation` helpers.

## Findings

### WalletScreen

`WalletDemoShell` is already the stable composition boundary for the examples: it owns the 390 × 844 mobile canvas, theme provider and overflow behavior. The page bodies still differ in scrolling, header treatment, and content density. Promoting the whole page into a library component would couple the component package to demo-only routing and product information architecture.

Decision: keep `WalletDemoShell` as a demo helper; do not add a public `WalletScreen` component.

### PageHeader

The current headers fall into several intentionally different patterns:

- centered title with a back affordance (`Swap`, `Send`);
- title with back and overflow actions (`Transaction details`);
- product identity plus network indicator (`Home`, `Network & Nodes`);
- title with contextual actions (`Activity`, `Explore dApps`, `Scan`).

They share spacing and typography tokens, but not a stable structure or action API. A generic header would either expose product-specific props or hide meaningful layout differences.

Decision: continue composing headers from native elements and existing `Title`, `Button`, `Icon` and token primitives. Revisit only after at least three product surfaces require the same DOM structure and interaction contract.

## Revisit triggers

Consider a new composition component only when all of the following are true:

1. The same structure appears in three or more shipped product surfaces.
2. Its keyboard, safe-area and responsive behavior can be specified independently of a route.
3. The props can be documented without wallet-specific business fields.
4. A component-level test can cover the interaction contract.

Until then, this is an observation item rather than a missing library capability.
