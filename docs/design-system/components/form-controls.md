# Form controls — Fresnica specification

Form controls use the same neutral surfaces, typography, focus treatment, and semantic status colours as the Stellar wallet flows. Component source remains authoritative for exact implementation details.

## Shared rules

- Font: `var(--Fresnica-font-family)` (Roboto, Noto Sans SC, system sans-serif fallback).
- Text: `--Fresnica-text-color`; supporting text: `--Fresnica-text-color-secondary` or `--Fresnica-text-color-muted`.
- Surface: `--Fresnica-surface`; low-emphasis area: `--Fresnica-surface-low`.
- Border: `--Fresnica-border-color`; hover: `--Fresnica-border-color-hover`.
- Focus: 2px `--Fresnica-focus-color` outline or an equivalent token-based focus ring.
- Error, warning, and success states must remain in their semantic colour families on hover and focus.
- Disabled controls use the disabled surface/text tokens and `cursor: not-allowed`.
- Do not use textured backgrounds, exaggerated shadows, or unrelated fixed colours.

## Input

Input uses a neutral token surface, standard control height, readable 14px base text, and the shared control radius. Prefixes, suffixes, and clear actions inherit the surrounding semantic colour.

```css
background: var(--Fresnica-surface);
color: var(--Fresnica-text-color);
border: 1px solid var(--Fresnica-border-color);
border-radius: var(--Fresnica-border-radius-base);

/* hover */
border-color: var(--Fresnica-border-color-hover);

/* focus */
border-color: var(--Fresnica-focus-color);
outline: 2px solid var(--Fresnica-focus-color);
outline-offset: 1px;
```

For `status="error"`, hover and focus use `--Fresnica-error-color-hover`; they never fall back to primary green. Warning follows the warning tokens.

## Select

Select shares Input dimensions and surface treatment. The trigger uses `--Fresnica-surface` at rest and `--Fresnica-surface-high` while hovered or open. The dropdown uses `--Fresnica-surface`, a token border, the base radius, and no shadow, so it follows both themes without a hard-coded white layer.

- Hovered options use a low-opacity primary tint.
- The selected option uses `--Fresnica-primary-color` with `--Fresnica-on-primary-color` text and no leading or trailing dot.
- The chevron is a Lucide icon and inherits `currentColor`.
- Escape and outside click close the popup; keyboard navigation follows native listbox expectations.
- `placement="bottom"` keeps the menu below the trigger when possible, flips upward when needed, and constrains both its height and width to the available viewport space; use it inside narrow or right-aligned preview containers. The default `auto` placement remains available for contextual menus.

## Checkbox

Checkbox uses a compact token border at rest and primary fill when checked. Its check icon is white on the primary background.
State changes are immediate and restrained: no splash, particle burst, bounce or delayed check drawing.
The unchecked control uses `--Fresnica-surface`; disabled controls use `--Fresnica-surface-high`, so dark mode never introduces a white control fill.
The checked fill, border, and foreground use runtime tokens, so the control follows Light `#00A875` and Dark `#00CA8A` without rebuilding the stylesheet.

```css
/* checked */
background: var(--Fresnica-primary-color);
border-color: var(--Fresnica-primary-color);
color: var(--Fresnica-on-primary-color);
```

Indeterminate uses the same semantic palette. Decorative burst animations are not part of the Fresnica wallet style.

## Radio

Radio uses a neutral ring at rest and a primary ring/dot when selected. Labels retain normal text colour; selection must not introduce unrelated brown or yellow focus colours.
The ring surface remains `--Fresnica-surface` in every state; disabled radios use `--Fresnica-surface-high`. In dark mode, an unchecked ring uses the brighter muted text token for a clearly visible outline.
The selected ring and dot resolve `--Fresnica-primary-color` at runtime and therefore follow the active Light or Dark theme.

```css
/* checked */
border-color: var(--Fresnica-primary-color);

/* inner dot */
background: var(--Fresnica-primary-color);
```

## Switch

Switch is a native button with `role="switch"` and supports controlled/uncontrolled state, small/default sizes, disabled state, and loading state. The off track uses `--Fresnica-surface-high` rather than black; in dark mode its unselected circular handle uses the white `--Fresnica-inverse-color` so the control remains visible. Checked backgrounds use `--Fresnica-primary-color`; any text or icon placed on that background uses `--Fresnica-on-primary-color`.

## AddressField

AddressField combines a wallet-address input with a copy action. It uses the shared Input surface and typography, disables spellcheck, and provides copied feedback with the Lucide `Check` icon. Copy and paste buttons use neutral surface and secondary-text tokens; they do not use persistent primary green. The copy button must have an accessible name.

## AmountField

AmountField is a decimal numeric input with optional currency, balance, and Max action. Currency, balance and Max/All are supporting controls and use neutral surface and secondary-text tokens. Primary green is reserved for the flow's submit/review action. Amounts must never accept negative values.

## FeeSummary

FeeSummary displays label/value rows and an optional total. Regular rows use secondary text; the total uses stronger text weight and a subtle token divider. It must stay compact enough for transaction confirmation panels.

## DatePicker

DatePicker uses the same 16px-radius, bordered trigger and popup language as Select. The default trigger height is 48px; floating panels use borders instead of shadows.

- Trigger: standard control height, shared radius, token surface and border.
- Panel: `--Fresnica-surface`, 1px token border, 16px radius and no shadow.
- Day hover: low-opacity primary tint.
- Selected day: primary background with `--Fresnica-on-primary-color` foreground.
- Range hover, in-range days and range endpoints use the same primary family as Select; endpoints add a white token border.
- Today: primary outline or text emphasis without decorative treatment.
- Range endpoints and range fill use primary tokens; warning/error feedback remains semantic.
- Navigation and calendar actions use Lucide icons.

## TimePicker

TimePicker follows the same bordered, shadow-free trigger and popup rules as DatePicker and Select. Values use `HH:mm:ss` strings and do not require a date library.

- Column options use neutral surfaces at rest.
- Hover uses a low-opacity primary tint.
- Selected options use primary emphasis and accessible contrast.
- Confirm actions use Primary Button rules, including white text and icons.
- Disabled values use disabled tokens rather than opacity alone.

## Accessibility

- Every control must have a visible label, `aria-label`, or `aria-labelledby`.
- Error/help content must be associated with the control through `aria-describedby` where applicable.
- Popups expose the correct combobox/listbox/dialog semantics.
- All controls remain usable by keyboard, and visible focus cannot be removed.
- Motion respects `prefers-reduced-motion`.

## Wallet field API additions

- `AddressField` supports read-only `mode="display"`, truncation, copy/paste actions and semantic `status`/`helperText` feedback.
- `AmountField` uses a text input with `inputMode="decimal"` and supports fiat value, balance metadata and semantic validation states.
