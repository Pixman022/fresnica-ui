# Data display components

Data display components prioritize scanability, transaction confidence and consistent light/dark contrast. Surfaces, text, borders, focus rings and interaction states must use Fresnica semantic tokens.

## Table

Source: `src/components/Table`.

- Use tables for transaction history, assets and structured Stellar data.
- The container uses `--Fresnica-surface` and a subtle border; headers use `--Fresnica-surface-high`.
- Rows use quiet solid dividers. Optional striped rows use `--Fresnica-surface-low`.
- Row hover is a 10% primary tint without texture or decorative movement.
- Loading uses a translucent surface mask and a primary spinner.
- Built-in pagination stays inside the table footer and slices data client-side.
- On narrow viewports the table keeps a readable minimum column width and the container provides horizontal scrolling instead of clipping cells.

Do not encode status by row color alone. Pair text with a semantic `Tag`.

## Pagination

Source: `src/components/Pagination`.

Pagination uses compact circular controls, Lucide chevrons and neutral auxiliary fields. The active page is a primary circle with `--Fresnica-on-primary-color` text. Hover uses a low-opacity primary tint; focus uses `--Fresnica-focus-color`.

- First and last pages remain visible; ellipses appear when page count exceeds seven.
- `current` and `pageSize` may be controlled; otherwise internal state is used.
- The page-size menu and quick jumper use token surfaces and borders; its selected option matches Select with a primary background and white text.
- Pagination has one semantic treatment: neutral inactive controls, primary hover feedback and a primary active page.
- In the disabled example, the current page uses a stronger neutral fill and border than the remaining transparent disabled page buttons; disabled states never use green.

## CodeBlock

Source: `src/components/CodeBlock`.

CodeBlock uses a fixed dark technical surface for readable code in both themes. It supports JSX/TypeScript highlighting and an optional copy action. Use the monospace stack supplied by the component and do not apply product body typography inside code.

```tsx
<CodeBlock code={stellarExample} copyable />
```

The copy control must use a Lucide icon, have an accessible label and preserve at least 44px of touch target space.

## Tag

Source: `src/components/Tag`.

Tags communicate compact metadata and status. Default to `soft`; use `solid` only for high-emphasis state and keep its foreground readable.

| recommended color | meaning |
| --- | --- |
| `default` | neutral metadata |
| `app-teal` | success / confirmed |
| `app-red` | failed / destructive |
| `purple` | protocol / signing |
| `app-blue` | information / network |
| `app-yellow` | warning / pending |
| `app-orange` | attention / fee change |

The palette is intentionally limited to these seven values; near-duplicate legacy colors are no longer part of `TagColor`. `default` uses neutral surface tokens, while every semantic color consumes the same primary, error, purple, blue, yellow or orange tokens shown on the Color page. Interactive tags support Enter and Space. Closable tags use the Lucide `X` icon.

## Image

Source: `src/components/Image`.

Image is intended for wallet logos, asset icons, QR-related artwork and documentation media. The frame uses a neutral token surface, 1px border, 12px inset, 8px radius and no shadow. It does not use a photo-mat metaphor, patterns or decorative color combinations in product screens.

- Provide meaningful `alt` text; use an empty value only for truly decorative media.
- Image frames cap their width to the containing block, so fixed-size examples remain visible at narrow widths without widening the page.
- `lazy` maps to native lazy loading.
- With `preview` enabled, activation opens an accessible modal preview; Escape closes and focus returns to the trigger.
- The preview close action uses the Lucide `X` icon; do not draw interface icons with CSS pseudo-elements.
- Loading failure shows a Lucide camera placeholder and readable text.
- Prefer `white` or `default`; colored legacy frames should be limited to documentation examples.

Recommended production asset specifications:

| asset | source size / ratio | format |
| --- | --- | --- |
| asset icon | 40–64px, 1:1 | WebP or PNG |
| QR code / credential | 240–320px, 1:1 with a clear quiet zone | PNG or SVG |
| banner / documentation image | 16:9 | WebP; JPEG for photographic content |
| transparent logo | scalable or at least 2x its display size | SVG preferred, otherwise transparent PNG |

For fixed-size bitmap rendering, provide a 2x source asset: a 64px displayed icon should use a 128px source. Example paths should describe their role, such as `/path/to/stellar-asset-preview.webp`; do not copy documentation placeholders into production unchanged.

Keyboard focus uses `--Fresnica-focus-color`, never a hard-coded yellow ring.
