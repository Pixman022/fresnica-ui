# General — pixel spec

Pixel-level styling for the general-purpose components: Button, Icon, Typewriter and Cursor.

## Button

| Property      | small                         | middle                          | large                         |
| ------------- | ----------------------------- | ------------------------------- | ----------------------------- |
| min-height    | `--Fresnica-height-sm`        | `--Fresnica-height-base`        | `--Fresnica-height-lg`        |
| padding       | `0 --Fresnica-spacing-md`     | `0 --Fresnica-spacing-lg`       | `0 --Fresnica-spacing-xl`     |
| font-size     | `--Fresnica-font-size-sm`     | `--Fresnica-font-size-base`     | `--Fresnica-font-size-lg`     |
| border-radius | `--Fresnica-border-radius-sm` | `--Fresnica-border-radius-base` | `--Fresnica-border-radius-base` |
| border-width  | `--Fresnica-border-width`     | `--Fresnica-border-width`       | `--Fresnica-border-width`     |

**Primary button:**

```css
color: var(--Fresnica-on-primary-color); /* always white */
background: var(--Fresnica-primary-color); /* light #00A875, dark #00CA8A */
border-color: var(--Fresnica-primary-color);
box-shadow: none;

/* hover */
background: var(--Fresnica-primary-color-hover);
border-color: var(--Fresnica-primary-color-hover);
box-shadow: none;
transform: translateY(-1px);

/* active */
background: var(--Fresnica-primary-color-active);
transform: scale(0.98);
```

Default and dashed buttons use the neutral surface and border tokens. Text and link buttons remain transparent.
Focus uses a 2px focus-token outline; disabled buttons use `opacity: 0.55` and no shadow.
Primary-button text, Lucide icons, and loading indicators explicitly inherit
`--Fresnica-on-primary-color` (white) in both themes.
Reserve Primary for the dominant action in an action region. Copy, Max/All, direction switching, filtering and other
supporting actions use default, dashed or text treatments so primary green remains visually scarce.

**inverse button (Swap / high-contrast core action):**

```css
/* Light theme */
color: var(--Fresnica-on-inverse-color); /* #fff */
background: var(--Fresnica-inverse-color); /* #111214 */

/* Dark theme */
color: var(--Fresnica-on-inverse-color); /* #111214 */
background: var(--Fresnica-inverse-color); /* #fff */
```

Use `type="inverse"` only for a small number of core actions whose contrast should intentionally invert with the
surface theme (the homepage Swap action is the canonical example). Hover and active states use
`--Fresnica-inverse-color-hover` and `--Fresnica-inverse-color-active`; do not use this type for ordinary secondary actions.

**Loading state:**

Loading keeps the button semantic background and uses the Lucide `LoaderCircle` icon.
Use `opacity: 0.82` and `pointer-events: none`; disable the button while loading to
prevent duplicate submissions. Do not add decorative textures or repeating gradients.

**danger primary button:**

```css
color: var(--Fresnica-on-error-color); /* white */
background: var(--Fresnica-error-color); /* #C73945 in both themes */
border-color: var(--Fresnica-error-color);

/* hover and active stay in the error colour family */
background: var(--Fresnica-error-color-hover);
background: var(--Fresnica-error-color-active);
```

## Icon

Lucide icon library with wallet-focused semantic names (`wallet`, `camera`, `message-circle`, `book-open`, `palette`, `wrench`, `send`, `map`, `shopping-bag`, `settings`). The runtime `ICON_LIST` export is authoritative; icons inherit currentColor and support custom size and stroke width.

Lucide SVG icons are rendered inside a lightweight `<span>`. The supported semantic names are `wallet`, `camera`,
`message-circle`, `book-open`, `palette`, `wrench`, `send`, `map`, `shopping-bag`, and `settings`. Icons inherit
`currentColor`; `size` (default `24`) controls width/height and `strokeWidth` controls line weight. Set `bounce` only
when a subtle attention animation is useful.

Ordinary standalone icons inherit neutral text color. Apply primary only for an explicit selected/active state, success
only for a completed or healthy state, gain/loss only for actual financial movement, and protocol/network accents only
when the icon identifies that domain.

> Usage: `<Icon name="camera" size={32} />`.

## Typewriter

```tsx
<Typewriter speed={90} trigger={openCount} autoPlay onDone={() => ...}>
  <p>Line one <strong>bold</strong></p>
  <p>Line two</p>
</Typewriter>
```

Props:

| name       | type          | default | Description                                                            |
| ---------- | ------------- | ------- | ---------------------------------------------------------------------- |
| `children` | `ReactNode`   | —       | Content to type out character by character; **the original element structure / line breaks / styles are preserved** |
| `speed`    | `number (ms)` | `90`    | Interval between characters                                             |
| `trigger`  | `unknown`     | —       | Any value change replays the animation (typically a modal open counter or an incrementing key) |
| `autoPlay` | `boolean`     | `true`  | `false` renders the full content immediately                            |
| `onDone`   | `() => void`  | —       | Fired when playback completes                                           |

**Implementation notes:**

- `countText(node)`: recursively counts the plain-text length of a ReactNode
- `renderTruncated(node, state)`: recursively truncates by remaining character count; `React.cloneElement` preserves the original nodes and their styles
- `useEffect` depends on `[total, speed, trigger, autoPlay]`, with an internal `setInterval` stepping `count` upward
- **No stylesheet**, and no extra DOM wrapper (returns `<>...</>`), so layout is completely unaffected

## Cursor

```tsx
<Cursor forceAll={false}>
    <App />
</Cursor>
```

Cursor is a scoped semantic-cursor wrapper. It contains no custom image asset. The root `<div>` carries `Fresnica-cursor` plus a mode class.

```css
.Fresnica-cursor { cursor: default; }
.Fresnica-cursor--force button,
.Fresnica-cursor--force a,
.Fresnica-cursor--force [role='button'] { cursor: pointer; }
.Fresnica-cursor input,
.Fresnica-cursor textarea { cursor: text; }
.Fresnica-cursor [disabled],
.Fresnica-cursor [aria-disabled='true'] { cursor: not-allowed; }
```

- `forceAll` defaults to `true` and assigns pointer semantics to descendant links and buttons.
- Inputs and textareas retain the text cursor; disabled controls retain `not-allowed`.
- `className` and `style` apply to the root wrapper.

## Icon catalog update

The built-in Lucide catalog now contains 53 wallet-focused icons. `IconName` and `ICON_LIST` are the source of truth; use these semantic names for navigation, wallet actions, network and transaction status, QR/copy actions and settings. Arbitrary glyphs and decorative animal or plant imagery are not part of the component library.
