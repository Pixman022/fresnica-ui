# Data display components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

Covers: Table, Pagination, CodeBlock, Tag, Image.

## Table

The table wrapper preserves a readable minimum table width and exposes horizontal overflow on narrow containers; consumers should avoid clipping the wrapper with `overflow: hidden`.

```ts
interface TableColumn<T = Record<string, unknown>> {
    title: React.ReactNode;
    dataIndex?: keyof T;
    render?: (value: unknown, record: T, index: number) => React.ReactNode;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    style?: React.CSSProperties;
}

interface TableProps<T = Record<string, unknown>> {
    columns?: TableColumn<T>[]; // default []
    dataSource?: T[]; // default []
    rowKey?: string | ((record: T) => string); // default 'key'
    striped?: boolean; // default true
    showHeader?: boolean; // default true
    rowClassName?: string | ((record: T, index: number) => string);
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
    loading?: boolean; // default false
    emptyText?: React.ReactNode; // default '暂无数据'
    scroll?: { x?: number | string; y?: number | string };
    pagination?: false | PaginationProps; // default false — object enables client-side paging
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Table
    columns={[
        { title: '名称', dataIndex: 'name', width: 160 },
        { title: '价格', dataIndex: 'price', align: 'right' },
        { title: '操作', render: (_, r) => <Button size="small">买</Button> },
    ]}
    dataSource={items}
    rowKey="id"
/>
```

> **Not supported:** no built-in `sorter` / `filters` / column-networkrch, no `rowSelection` / checkbox column, no `expandable` / nested rows, no `summary` row, no `bordered` toggle (always borderless), no virtual scroll. `scroll.x` / `scroll.y` only enable native overflow scrolling. Client-side paging IS built in via `pagination={{ ... }}` (see Pagination below) — for server-side paging, slice `dataSource` yourself and drive `<Pagination current pageSize>`.

## Pagination

```ts
interface PaginationProps {
    total: number; // REQUIRED
    current?: number; // controlled page; defaultCurrent defaults to 1
    pageSize?: number; // controlled size; defaultPageSize defaults to 10
    onChange?: (page: number, pageSize: number) => void;
    onShowSizeChange?: (current: number, size: number) => void; // size change only; current clamped
    showSizeChanger?: boolean; // default false — page-size popover; pageSizeOptions default [10,20,50,100]
    showQuickJumper?: boolean; // default false — "跳至 <input> 页"
    showTotal?: boolean; // default false — "共 N 条" on the left
    disabled?: boolean; // default false
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Pagination total={85} defaultCurrent={3} showTotal showSizeChanger pageSizeOptions={[10, 20, 50]} />
// controlled
<Pagination total={500} current={page} pageSize={20} showQuickJumper onChange={(p) => setPage(p)} />
// inside Table — Table owns the page state when current/pageSize are not set
<Table columns={columns} dataSource={data} pagination={{ defaultPageSize: 5, showTotal: true }} />
```

Notes:
- Visual language: transparent 32px circles with semantic hover and primary active states; size trigger and jumper input use theme surface tokens, and the selected page-size option uses a primary background with white text.
- Disabled pagination stays neutral: the current page has a stronger gray fill and border than other disabled page buttons, never a green fill.
- Page run: first + last page always visible, current ±1 neighbourhood, `···` ellipses when `pageCount > 7`.
- `current` / `pageSize` are controlled when passed, otherwise internal state. `onChange` fires for both page and size changes; `onShowSizeChange` only for size (page clamped into the new page count). Quick jumper accepts Enter/blur and clamps out-of-range input.
- The size changer is a self-contained upward popover (click-outside / Escape closes) — no dependency on `Select`. a11y: `<nav aria-label="分页">` root, active page has `aria-current="page"`, prev/next use native `disabled` + `aria-label`.

## CodeBlock

```ts
interface CodeBlockProps {
    code: string; // REQUIRED — raw source string
    style?: React.CSSProperties; // merged on top of the dark preset
    className?: string;
    copyable?: boolean; // default true
    onCopy?: (code: string) => void;
}
```

```tsx
<CodeBlock code={`import { Button } from 'fresnica-ui';\n\n<Button type="primary">Go</Button>`} />

// Override theme
<CodeBlock code={src} style={{ borderRadius: 5, backgroundColor: '#242c46' }} />
```

> Renders a `<pre>` with built-in JSX/TS tokenizer and a top-right copy button. The button reports copied/error status; set `copyable={false}` to hide it. It reserves 96px right padding unless custom padding is supplied. No `language` prop, line numbers or word-wrap. Default theme: dark technical surface `#11141a`, border `1px solid #2b313c`, radius 16px, font-size 14, line-height 1.7.

## Tag

```ts
type TagSize = 'small' | 'medium' | 'large';
type TagVariant = 'solid' | 'outlined' | 'dashed' | 'soft';
type TagColor =
    | 'default'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-red';

interface TagProps {
    children?: React.ReactNode;
    size?: TagSize; // default 'medium'
    variant?: TagVariant; // default 'soft'
    color?: TagColor; // default 'default'
    closable?: boolean; // default false
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void; // enables clickable + keyboard a11y
    disabled?: boolean; // default false
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Tag>默认标签</Tag>
<Tag color="app-red" variant="solid">失败</Tag>
<Tag color="app-teal" variant="outlined">草稿</Tag>
<Tag color="app-orange" variant="dashed" size="small">费用变化</Tag>
<Tag closable onClose={(e) => console.log('closed')}>可关闭</Tag>
<Tag color="app-blue" onClick={() => alert('clicked')}>可点击</Tag>
<Tag disabled>禁用</Tag>
```

Notes:

- **Color palette matches the Color specification page** and stays theme-aware. `solid` uses an emphasized background; `outlined` and `dashed` use the selected color for text and border; `soft` uses a low-emphasis surface. `color="default"` uses semantic neutral tokens.
- **3 sizes**: small 24px / medium 32px / large 40px, with font-size 12 / 14 / 16. All use a full capsule radius, weight 600 and a reserved transparent border to prevent layout shifts.
- **`closable` renders a Lucide `X` button** with `aria-label="close"`. Close clicks stop propagation and do not trigger the parent `onClick`.
- **`onClick` upgrades the tag to a button** (`role="button"`, `tabIndex={0}`) — supports Enter and Space keys. Without `onClick` the tag is a plain `<span>`. Hover/active states use a restrained 1px lift without elevation shadow. Focus ring uses `--Fresnica-focus-color`.
- **`disabled`** sets `opacity: 0.5` and `pointer-events: none` on the whole tag, AND disables the close button (which gets a separate `cursor: not-allowed`).
- a11y: when clickable, the tag is a button. Close button is reachable via Tab. All interactive states have visible focus styles.

## Image

```ts
type ImageColor =
    | 'white'
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height' | 'onLoad' | 'onError'> {
    src: string; // REQUIRED
    alt?: string; // default '' — empty means decorative
    width?: number | string;
    height?: number | string;
    color?: ImageColor; // default 'white' — theme surface; other values are semantic documentation frames
    lazy?: boolean; // default false — maps to native loading="lazy"
    preview?: boolean; // default true — click opens a lightbox (ESC / mask / close button)
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}
```

```tsx
<Image src="/photo.png" alt="网络风景" width={200} height={150} />
<Image src="/photo.png" alt="纯白" color="white" />
<Image src="/photo.png" alt="粉色" color="app-pink" />
<Image src="/photo.png" alt="懒加载" lazy />
<Image src="/photo.png" alt="预览" width={200} height={130} preview />
<Image src="/broken.png" alt="失败" width={140} height={140} />
```

> Renders a `<img>` in a fixed token surface with a 1px border, 12px inset, 8px radius and no shadow. `width`/`height` apply to the frame while the image fills it at 100%. The image stays hidden (`opacity: 0`) until `onLoad` fades it in; on error it renders a Lucide camera placeholder (`role="img"` + `aria-label`). With `preview` (on by default), the frame becomes a `<button>` and clicking opens a portaled lightbox (`role="dialog"` + `aria-modal`, name from `alt`) — close via ESC, the mask, or the top-right Lucide `X` button; focus is moved to the close button on open and restored on close.
