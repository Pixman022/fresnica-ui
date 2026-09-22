# Form — pixel spec

Form and FormItem use Fresnica semantic tokens and follow conventional React form behavior.

## Layout

- Base typography: 14px with `--Fresnica-line-height-base` and `--Fresnica-text-color`.
- Vertical layout stacks fields with an 8px gap; labels sit 6px above controls.
- Horizontal layout uses a 24-column grid without an extra column gap.
- Inline layout wraps controls with an 8px gap.
- Label sizes are 12px, 14px and 16px for small, middle and large.

## Field state

- Help text: 12px, line-height 1.5, 4px top margin and the muted text token.
- Required mark and error feedback use `--Fresnica-error-color`.
- Warning, success and validating states use the warning, success and secondary semantic tokens respectively.
- Feedback icons are Lucide icons, 14px by default, and inherit the state color.
- Disabled forms use 0.6 opacity and propagate disabled semantics to compatible child controls.

## Behavior

- `FormItem` must be nested under `Form` or `Form.Provider`.
- `size`, `disabled` and error status are passed to compatible child controls when the child does not override them.
- Keep validation messages concise and place them next to the affected field.
