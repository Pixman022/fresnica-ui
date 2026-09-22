# Feedback components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## EmptyState

```ts
type EmptyStateSize = 'small' | 'middle' | 'large';
interface EmptyStateProps extends React.HTMLAttributes<HTMLElement> {
    icon?: React.ReactNode;
    title?: React.ReactNode; // default 'No data'
    description?: React.ReactNode;
    action?: React.ReactNode;
    size?: EmptyStateSize; // default 'middle'
}
```

```tsx
<EmptyState title="No results" description="Try changing your filters." action={<Button>Clear filters</Button>} />
```

Use for completed requests with no content. The default Inbox icon is decorative; keep the message and action meaningful without it.

## ErrorState

```ts
type ErrorStateSize = 'small' | 'middle' | 'large';
interface ErrorStateProps extends React.HTMLAttributes<HTMLElement> {
    icon?: React.ReactNode;
    title?: React.ReactNode; // default 'Something went wrong'
    description?: React.ReactNode;
    action?: React.ReactNode;
    size?: ErrorStateSize; // default 'middle'
}
```

```tsx
<ErrorState title="Network unavailable" description="Try again in a moment." action={<Button onClick={retry}>Retry</Button>} />
```

Use for recoverable failures. The root has `role="alert"`; prefer retry/back actions and do not expose raw provider errors as the only copy.

## Loading

```ts
interface LoadingProps {
    active?: boolean; // default true
    className?: string;
    style?: React.CSSProperties;
    label?: string; // default 'Loading'
}
```

```tsx
<Loading />                  {/* inline Stellar wallet loading status */}
<Loading active={isLoading} />
```

> Inline status indicator with a Lucide `LoaderCircle` and optional `label` (default `Loading`). When `active={false}`, it renders nothing.
>
> **Not supported:** no `tip` / `text`, no `size`, no `spinning`, no `delay`, no `indicator`, no `children` (this is NOT a generic Spin-style wrapper — do not wrap content with it). Use it as a sibling overlay element controlled via `active`.

## Progress

Horizontal bar using a static primary-to-primary-hover gradient. The track uses `--Fresnica-surface-high` with a semantic border and no shadow. The percent label sits inside the fill (default, white), to the right, or on top.

```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressInfoPosition = 'inside' | 'right' | 'top';

interface ProgressProps {
    percent: number; // REQUIRED, 0-100, clamped; non-integer rounded for aria
    size?: ProgressSize; // default 'middle' (small=12px, middle=20px, large=28px)
    showInfo?: boolean; // default true
    infoPosition?: ProgressInfoPosition; // default 'inside'
    infoFormat?: (percent: number) => React.ReactNode; // default `${percent}%`
    duration?: number; // fill width transition in seconds; 0 disables; default 0.6
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Progress percent={50} size="large" />
<Progress percent={45} infoPosition="right" />          {/* or "inside" (default) / "top" */}
<Progress percent={50} infoFormat={(p) => `${Math.round(p / 10)} / 10`} />
<Progress percent={pct} duration={0} />                 {/* no fill-width animation */}
<Progress percent={66} showInfo={false} />
```

Notes:

- **Always provide `percent`.** Out-of-range values are clamped to `[0, 100]`. NaN is treated as `0`. The aria value is rounded.
- **Default `infoPosition="inside"`** — the label rides at the right edge of the fill. If `percent < 18`, the label is automatically moved to the track end with secondary text for legibility.
- **Fill color is fixed** to the theme gradient — there is no `status` / `strokeColor` / `stateAnimated` prop.
- **Width animation** transitions on `percent` change (`duration` prop, default 0.6s, `0` disables) with a theme easing curve; reduced-motion mode disables it.
- **Accessibility**: root has `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=<rounded percent>`, and `aria-valuetext` set to the rendered text when it's a string.

## Skeleton

Loading placeholder rendering theme-aware neutral surfaces with a restrained shimmer animation. When `loading` is `false`, children are rendered directly.

```ts
type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

interface SkeletonProps {
    loading?: boolean;           // default true
    variant?: SkeletonVariant;   // default 'text'
    active?: boolean;            // shimmer animation, default true
    rows?: number;               // for 'paragraph', default 3
    width?: number | string;     // for 'text'/'circle'/'rect'
    rowWidths?: (number | string)[]; // for 'paragraph', per-line widths
    widthValue?: number | string;    // for 'circle'/'rect'
    heightValue?: number | string;   // for 'circle'/'rect'
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;  // rendered when loading=false
}

// Sub-components
interface SkeletonButtonProps { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonInputProps  { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonAvatarProps { size?: 'small' | 'middle' | 'large'; shape?: 'circle' | 'square'; active?: boolean; }
```

```tsx
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from 'fresnica-ui';

<Skeleton variant="text" width="80%" />
<Skeleton variant="circle" widthValue={44} />
<Skeleton variant="rect" widthValue={200} heightValue={120} />
<Skeleton variant="paragraph" rows={4} />
<SkeletonButton size="middle" />
<SkeletonInput size="large" />
<SkeletonAvatar size="small" shape="square" />
<Skeleton loading={fetching}><div>Content loaded</div></Skeleton>
```

Notes:

- **Shimmer**: a restrained primary-tinted transparent sweep moves left-to-right over 1.6s.
- **Shapes**: `circle` is 50% rounded; `rect` uses the 16px base-radius token; text and paragraph lines use the 8px small-radius token.
- **All sub-components** (`SkeletonButton`, `SkeletonInput`, `SkeletonAvatar`) share the same theme-aware surfaces and shimmer.
- **A11y**: the skeleton root is marked `aria-hidden` to hide it from screen readers when `loading=true`.

## BackTop

Floating back-to-top button that appears in the bottom-right corner after scrolling past a threshold. It uses the Lucide `ArrowUp` icon and smooth-scrolls to the top with an easeInOutQuad animation.

```ts
interface BackTopProps {
    target?: () => HTMLElement | Window; // default () => window
    visibilityHeight?: number;           // default 400 (px)
    duration?: number;                   // scroll animation ms, default 300
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<BackTop />                                    {/* ArrowUp icon, 400px threshold */}
<div ref={ref} style={{ height: 300, overflow: 'auto' }}>
    <BackTop target={() => ref.current!} visibilityHeight={200} />
</div>
<BackTop duration={800} />
```

Notes:

- **Default target is `window`** — works out of the box for page-level scrolling. Pass `target` for a custom scroll container.
- **Mobile responsive**: the control moves closer to the viewport edge under 768px while retaining a 44px touch target.
- **A11y**: `role="button"`, `tabIndex={0}`, `aria-label="返回顶部"`. Enter/Space trigger the scroll.
