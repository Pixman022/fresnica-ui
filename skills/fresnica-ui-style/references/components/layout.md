# Layout components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Footer

Text-only footer for Fresnica screens. Use `type="default"` for the standard spacing or `type="compact"` for dense layouts.

## Card

```ts
type CardType = 'default' | 'dashed';

type CardColor =
    | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal'
    | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: CardType; // default 'default'
    color?: CardColor; // default 'default'
    hoverable?: boolean; // default false (no hover); true → cursor pointer + translateY(-2px) on hover
    children?: React.ReactNode;
}
```

Color is semantic and theme-aware. Prefer the distinct wallet meanings shown on the Color page: neutral default, protocol purple, network blue, warning yellow, liquidity orange, primary teal and error red. Legacy aliases map to those same token roles. Filled semantic surfaces use readable foreground tokens; do not introduce decorative hues for product screens.

```tsx
<Card>Default wallet card (read-only, no hover)</Card>
<Card hoverable>Interactive card (hover lifts -2px, cursor pointer)</Card>
<Card type="dashed">Draft / empty-state container</Card>
<Card color="app-yellow">Notification</Card>
<Card color="app-blue">Network information</Card>
```

Use `<Title variant="heading">` for Fresnica product screens. Titles are semantic text headings with no decorative artwork. Screen-level titles always use the default text color (black/near-black in light theme, high-contrast light text in dark theme); do not apply accent colors to the page heading.

## Title

```ts
type TitleSize = 'small' | 'middle' | 'large';
type TitleVariant = 'heading';
type TitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';

type TitleColor =
    | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal'
    | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';

interface TitleProps {
    children: React.ReactNode; // REQUIRED
    size?: TitleSize; // default 'middle'
    color?: TitleColor; // default 'default'
    variant?: TitleVariant; // default 'heading'; Fresnica screens use 'heading'
    as?: TitleElement; // default 'h2' for heading variant
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Title>Wallet activity</Title>
<Title size="large" color="app-yellow">Notification</Title>
<Title variant="heading" as="h1" size="large">Activity</Title>
```

`variant="heading"` renders a semantic plain heading using Fresnica typography and theme tokens. `size` remains small 14px /
middle 18px / large 28px, all at weight 700.

Choose the semantic element with `as="h1"` through `as="h4"` (or `div` / `span` when appropriate). The component has no banner container or decorative modifiers such as `bordered`, `code`, `mark`, `underline` or `delete`.

## Divider

```ts
type DividerType = 'solid' | 'subtle' | 'dashed' | 'accent';

interface DividerProps {
    type?: DividerType; // default 'subtle'
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Divider />
<Divider type="accent" />
```

Divider is a semantic `role="separator"` with a 1px CSS border. Choose `subtle` for low contrast, `solid` for standard contrast, `dashed` for grouped content, or `accent` for the primary-color rule.

## Collapse

```ts
interface CollapseProps {
    question: React.ReactNode; // REQUIRED — header
    answer: React.ReactNode; // REQUIRED — body
    defaultExpanded?: boolean; // default false
    disabled?: boolean; // default false
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Collapse question="Why is this transaction pending?" answer="The Stellar network is still processing the submitted operation." />
<Collapse defaultExpanded question="Network details" answer={<p>Fresnica currently supports Stellar Mainnet and Stellar Testnet.</p>} />
```

Uses a pure CSS grid-row transition — no JS height measurement, safe for SSR. Single panel only — no `accordion` / `items` group API; render multiple `<Collapse>` siblings if you need a list.

## Tabs

```ts
interface TabItem {
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
}

interface TabsProps {
    items: TabItem[]; // REQUIRED
    defaultActiveKey?: string; // default: first tab
    activeKey?: string; // controlled mode
    onChange?: (key: string) => void;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
// Uncontrolled
<Tabs
    items={[
        { key: 'tab1', label: '资产', children: <p>XLM、USDC...</p> },
        { key: 'tab2', label: '活动', children: <p>最近交易...</p> },
    ]}
    defaultActiveKey="tab1"
/>;

// Controlled
const [activeKey, setActiveKey] = useState('tab1');
<Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />;
```

Supports both controlled and uncontrolled modes. Selection changes use restrained color and border state changes without decorative motion or elevation shadows.

**Not supported:** no `tabPosition` (always top), no `type="card"` / `type="editable-card"`, no `tabBarExtraContent`, no closable tabs.

## Carousel

```ts
interface CarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
    children: React.ReactNode; // REQUIRED; each direct child is one slide
    activeIndex?: number;
    defaultActiveIndex?: number; // default 0
    onChange?: (index: number) => void;
    autoplay?: boolean; // default false
    interval?: number; // default 3000
    loop?: boolean; // default true
    showArrows?: boolean; // default true
    showDots?: boolean; // default true
    pauseOnHover?: boolean; // default true; focus also pauses
}
```

```tsx
<Carousel autoplay aria-label="网络照片">
    <img src="/asset-preview.jpg" alt="资产预览" />
    <img src="/activity-preview.jpg" alt="活动预览" />
</Carousel>
```

Supports controlled/uncontrolled indexes, CSS fade transitions, looping, arrows, dots and ArrowLeft/ArrowRight/Home/End navigation. Autoplay automatically renders a pause/resume control and pauses on hover/focus. Set a useful `aria-label`; every slide receives a position/count label automatically.

## TransactionDetails

Fresnica wallet transaction detail surface. Use `TransactionDetails` with `assetSymbol`, `title`, `status`, optional `timestamp`, and a `fields` array for protocol metadata. Fields may provide `copyValue`; `onCopy` receives the full value while the visible value can be shortened. The optional explorer action is supplied with `onExplorerClick`. It composes `AssetIcon`, `TransactionStatus`, and themed `Button` primitives and is suitable for both light and dark Fresnica screens.
