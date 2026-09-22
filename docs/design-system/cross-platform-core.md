# Cross-platform core

The cross-platform core defines the parts of Fresnica UI that must remain consistent across mobile, web and desktop clients. It describes meaning, hierarchy and behavior without prescribing a platform-specific navigation pattern.

## Purpose

- Keep brand, semantic color, typography and state language consistent.
- Provide one vocabulary for component states and accessibility.
- Keep wallet examples separate from the reusable design-system contract.
- Allow each platform to choose an interaction idiom that fits its input model.

## Principles

- Clarity before decoration: content and task hierarchy remain visible.
- Deference: the theme supports the task and does not compete with financial content.
- Explicit state: loading, empty, success, warning and error states are distinguishable without color alone.
- Recoverability: failed or destructive actions provide a clear next step.
- Consistent semantics: the same token name means the same intent on every platform.

## Shared foundations

The following are shared by every platform:

- Semantic tokens for surfaces, text, borders, actions and status colors.
- Light/dark themes and local custom primary-color generation.
- Typography hierarchy, spacing, radius, motion and elevation tokens.
- Component states: default, hover/pressed, focus, selected, disabled, loading, empty and error.
- WCAG AA contrast, visible keyboard focus where applicable, reduced motion and non-color status cues.
- Wallet data readability rules for amounts, long addresses, timestamps and transaction states.

Use semantic names such as `color.surface.primary`, `color.text.primary` and `color.action.primary`; platform adapters map these names to CSS, native or desktop implementation values.

## Responsive baseline

The shared baseline is expressed in CSS viewport pixels for previews and web surfaces:

| Preset | Width | Purpose |
| --- | ---: | --- |
| Mobile compact | 320px | Tightest layout and overflow check |
| Mobile common | 360px | Common Android viewport |
| Mobile large | 390–393px | Main mobile visual baseline; 393px primary, 390px compatibility |
| Mobile wide | 430px | Wider phone spacing and density |
| Tablet | 768px | Tablet transition and multi-column decision |
| Web/desktop | Actual window width | Container, navigation and data-density checks |

These are test presets, not device-specific CSS branches. Prefer fluid sizing, max-width containers and content-driven breakpoints.

## In scope and out of scope

The core documents component contracts, states, tokens, accessibility and layout principles. Product-specific wallet information architecture remains in `examples.html` and its product documentation; it is not a required section of the reusable design-system core.

Apple Human Interface Guidelines, Material Design and web accessibility guidance are reference sources. None of them changes the platform-neutral naming used by this project.
