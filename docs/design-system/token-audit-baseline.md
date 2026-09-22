# Token Audit Baseline

This file records the reviewed baseline for design-token audits. It is a comparison point, not a permanent freeze: values may change through an explicit design-system decision.

## Baseline

- Recorded: 2026-09-11
- Git base: `1d5ffd5` on `main`, plus the reviewed working-tree design changes
- Canonical sources: `src/styles/variables.less` and `src/styles/themes/default.less`
- Runtime prefix: `--Fresnica-*`
- Light primary: `#00A875`
- Dark primary: `#00CA8A`
- Typography: Roboto, Noto Sans SC, then system sans-serif fallbacks
- Elevation: semantic surfaces and 1px borders; shadow tokens resolve to `none`
- Network scope: Stellar only
- Audit scope: `src/`, `demo/` and the root `index.html`; standalone `preview/` pages are static reference boards and are intentionally excluded from runtime style checks
- Current audit snapshot: 285/335 tokens consumed (85.1%); 0 undeclared references; 0 style findings; 0 legacy theme findings.

The three-layer migration intentionally expands the public token inventory, so coverage is lower than the previous 115-token snapshot. The decrease does not indicate a visual or reference regression. Primitive and Semantic aliases in `design-system/tokens.css` are compatibility bridges, and unconsumed contracts are retained for future component migration or public state coverage. They are not removal candidates by default.

Financial roles remain separate even when values are identical or visually similar: brand, success, transaction/request failure, validation error, gain, loss, warning and high risk.

Protocol purple is canonicalized as `--Fresnica-accent-purple-*`. The former `--Fresnica-secondary-*` compatibility names were removed in the 2.0.0 cleanup.

`--Fresnica-shadow-base` is the supported explicit no-shadow contract. The former `--Fresnica-shadow-sm` and `--Fresnica-shadow-lg` compatibility names were removed in the 2.0.0 cleanup.

`--Fresnica-surface-lowest` remains a public reserved contract for app-shell or full-screen canvas backgrounds. Its lack of an internal component consumer is intentional and is not grounds for deprecation. Components must continue to use the appropriate component-surface token instead.

The following equal-value pairs are intentional semantic duplicates and must not be merged: primary/success (`#00CA8A` in light-theme success and dark-theme primary), failure/validation error (transaction/request failure versus input validation), and the direction/status roles gain/loss versus success/failure. Shared values are maintained independently so a future visual change can preserve each role's meaning.

## Allowed raw-value exceptions

Raw colors, dimensions or font names are allowed only in these reviewed locations:

1. Token definitions in `src/styles/variables.less` and dark-theme overrides in `src/styles/themes/default.less`.
2. Code examples that display literal token values for documentation, including the Color demo and HomePage theme snippet. These strings do not style the UI.
3. Brand image, logo and raster/SVG asset data.
4. Component geometry that cannot express a reusable semantic scale, such as `50%` circles, viewport calculations, intrinsic media sizes and one-off icon artwork alignment.
5. Test fixtures that intentionally verify consumer-provided inline styles.
6. Third-party or browser-required keywords and measurements where no Fresnica token is meaningful.
7. Demo-only layout breakpoints, grid minimum widths, token-swatch dimensions and index-marker geometry where introducing a global scale would reduce fidelity without creating a reusable component contract.

Syntax-highlight colors are not a raw-value exception in component code. They use the dedicated `--Fresnica-code-*` tokens. Overlay opacity variants use `--Fresnica-mask-bg`, `--Fresnica-mask-bg-subtle` or `--Fresnica-mask-bg-strong`.

## Not allowed

- Raw colors in component or Demo presentation styles when a semantic Fresnica token exists.
- Replacing one financial role with another because the current hex values happen to match.
- Using primary tokens for ordinary icons, metadata, copy/Max actions, direction switches, estimated values, completion states or financial gains without primary-action or selection meaning.
- Hard-coded Roboto/Noto font stacks outside font-face declarations or documentation strings.
- Green borders or text for disabled controls.
- White-only surfaces that do not adapt to dark mode.

Any new exception must identify its file, purpose, owner and removal condition during review.

## Reviewed typography and geometry queue

The audit's typography and geometry queue has been reviewed as follows. These values remain component-level exceptions; they do not justify new public Tokens unless the same semantic role is reused by another component family.

| Scope | Current values | Reason retained | Revisit when |
| --- | --- | --- | --- |
| Icon/control line boxes | `line-height: 0`, `1`, fixed `24px` | Removes inline-image baseline gaps or vertically centers compact icon-only controls and picker cells. | A shared icon-control primitive replaces the local geometry. |
| Dense labels and rows | `1.25`, `1.3`, `1.4`, `1.45`, `1.5`, `1.6`, `1.7`, `1.8` | Content-specific line boxes for rows, overlays, helper text and documentation; replacing them with the global `1.5715` would change measured component height. | Two or more component families adopt one named text role with identical metrics. |
| Display and title tracking | negative `em`/pixel tracking | Optical correction for large balances, Modal titles, Title headings and transaction summaries. | A named display/title typography Token is approved. |
| Compact control tracking | `0.01em`, `0.02em`, `1px` | Improves legibility of short labels, picker values and status text; it is not spacing between layout elements. | The same role is standardized across the full control set. |
| Micro alignment offsets | `2px`, `4px`, `7px`, `22px`, `30px`, `-6px` | Local optical alignment for picker cells, validation markers, switch labels/handles, notification marks, wallet metadata and font fallback correction. | The affected component geometry or bundled font changes. |
| Modal content inset | `20px` bottom padding | Preserves the measured Modal content/action rhythm between the 16px and 24px spacing steps. | Modal anatomy is redesigned or a reusable 20px spacing step is approved. |

Owner: Fresnica UI maintainers. Removal condition: replace an exception only when an exact existing Token preserves the rendered geometry, or when a reviewed design-system change introduces a reusable semantic Token. These exceptions may not contain raw colors, shadows or financial semantic substitutions.

## Repeatable audit

Run `npm run audit:tokens` to report Token coverage, undeclared references, raw style colors/shadows, raw typography declarations, raw spacing/radius declarations and legacy theme keywords. The command is read-only: unused public contracts are reported for review but are never removed automatically. Typography and geometry findings are review queues rather than CI failures because some component-specific measurements are valid documented exceptions.

## Reviewed unused contracts

The audit now classifies all currently unused public contracts:

- Explicitly reserved state contracts: hover/active variants and the `surface-lowest` app-shell canvas contract.
- Compatibility contracts retained: legacy runtime names such as `--Fresnica-primary-color-*`, `--Fresnica-text-color-*`, legacy accent/background names and inverse state names.
- Primitive bridge contracts retained: `--Fresnica-primitive-*` aliases that expose the raw scale to the three-layer system.
- Semantic contracts reserved: roles without a current component scenario, such as gain/risk containers and secondary backgrounds.
- Component contracts reserved: component-level contracts such as the Card shadow, retained for a future explicit variant.

These are review decisions, not deletion suggestions. A contract may be promoted to active usage when a component needs the role; until then it remains compatible and documented. The audit should report zero unclassified unused contracts.
