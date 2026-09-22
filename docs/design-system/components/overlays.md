# Overlays — pixel spec

Modal, Drawer and Tooltip use conventional fintech surfaces, semantic tokens and restrained motion. They contain no decorative artwork or custom-shaped clipping.

## Modal

- Mask: fixed viewport layer, `--Fresnica-mask-bg`, `z-index: 1000`, 16px desktop padding.
- Container: default width 520px, maximum `calc(100vw - 32px)`, maximum height `calc(100vh - 32px)`.
- Surface: `--Fresnica-surface`, 1px semantic border, the 24px large-radius token, 24px padding and no shadow. Text uses the matching theme text tokens.
- Title: 20/normal line-height, weight 700. Body: 16px, weight 400, line-height 1.5.
- Footer: right aligned, wraps with 12px gap. Cancel uses the neutral default Button; the primary action uses green plus `--Fresnica-on-primary-color`.
- Motion: token-driven fade and 0.96-to-1 scale. Focus is trapped while open and restored after close.
- At 480px and below, the dialog becomes a bottom sheet with 20px padding and the 24px large-radius token on its top corners.

## Drawer

- Mask: fixed viewport layer using `--Fresnica-mask-bg`; opacity transitions with the slow motion token.
- Panel: `--Fresnica-surface`, 1px semantic border, no shadow, and 24px radius on the exposed edge. It must never force a white panel in dark mode.
- Side drawers default to 378px; top/bottom drawers default to 300px. All stay within the viewport.
- Header: 20px padding, 20px/700 title, 40px circular Lucide close control.
- Body: 16px, line-height 1.5, `0 20px 20px`. Footer: 12px gap and `0 20px 20px`.
- Placement controls the translateX/translateY entrance. Duration and easing use the slow motion tokens.
- `pushBackground` may scale the application surface to 0.94 with 1px blur while open. Disable it when a host cannot safely transform its root.
- At 480px and below, left/right drawers occupy the full width.

## Tooltip

- Default surface: `--Fresnica-surface-high`, 1px semantic border, the 8px small-radius token, `8px 12px` padding and no shadow.
- Accent surface: `--Fresnica-primary-color` with `--Fresnica-on-primary-color` text.
- Typography: 12px, weight 500, line-height 1.5; maximum width 240px.
- Trigger gap: 12px. Entry combines opacity with a 4px directional translation.
- Supports 12 placements and `hover`, `focus`, or `click` triggers. The trigger receives `aria-describedby` only while visible.

## Overlay API additions

- `Modal` supports `variant="danger"`, consistent `okText`/`cancelText`, loading/disabled confirmation states and optional close affordances.
- `Drawer` supports `variant="sheet"`, `showHandle` and `safeArea` for mobile bottom-sheet presentation.

## ConfirmDialog usage

`ConfirmDialog` is a usage pattern built on the existing `Modal`; no separate wrapper is required.

- Use `variant="confirm"` for reversible or ordinary confirmation and `variant="danger"` for destructive actions.
- Keep `title` action-specific, state the consequence in the body, and use explicit `okText`/`cancelText` labels.
- Use `okLoading` while the action is pending and `okDisabled` to prevent duplicate submission. Do not close the dialog until the operation is accepted or the caller reports failure.
- Keep `maskClosable={false}` for destructive or unsaved-work confirmations. `closable` may provide an additional close control.
- Keep `onOk` and `onClose` stable and restore focus through the Modal contract. Escape and cancel must not trigger the primary action.
- For ordinary confirmation use the neutral cancel Button and primary confirmation; for danger use the danger variant and concise, irreversible-action copy.
