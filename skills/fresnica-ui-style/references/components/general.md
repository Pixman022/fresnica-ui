# General components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Button

```ts
type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link' | 'inverse';
type ButtonSize = 'small' | 'middle' | 'large';
type ButtonHTMLType = 'submit' | 'reset' | 'button';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    type?: ButtonType; // default 'default'
    size?: ButtonSize; // default 'middle'
    danger?: boolean; // default false
    block?: boolean; // default false
    loading?: boolean; // default false — renders Lucide spinner and disables repeat submission
    disabled?: boolean; // default false
    icon?: React.ReactNode;
    htmlType?: ButtonHTMLType; // default 'button'
    children?: React.ReactNode;
}
```

```tsx
<Button type="primary" onClick={save}>Save</Button>
<Button type="primary" danger loading>Deleting…</Button>
<Button type="dashed" icon={<PlusIcon />} size="large" block>Add</Button>
<Button type="text">Cancel</Button>
<Button type="inverse">Swap</Button>
```

## Icon (+ `ICON_LIST`)

```ts
type IconName =
    | 'wallet' | 'camera' | 'message-circle' | 'book-open' | 'palette'
    | 'wrench' | 'send' | 'map' | 'shopping-bag' | 'settings';

interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
    name?: IconName; // default 'wallet'
    size?: number | string; // default 24 — applied to width & height
    bounce?: boolean; // default false — adds hover bounce animation
    strokeWidth?: number; // default 2
}

// Runtime catalogue for dynamic rendering / pickers (length = 10):
declare const ICON_LIST: { name: IconName; label: string }[];
```

```tsx
<Icon name="camera" size={32} />
<Icon name="message-circle" bounce />
{ICON_LIST.map(({ name, label }) => <Icon key={name} name={name} />)}
```

Icons render Lucide React SVGs inside a `<span>`. Use `size` (number = px, string = any CSS length) and `strokeWidth` to tune the line weight.

## Typewriter

```ts
interface TypewriterProps {
    children?: React.ReactNode; // ANY ReactNode — preserves element structure, classNames, inline styles
    speed?: number; // ms per char, default 90
    trigger?: unknown; // change this value to restart animation (e.g. modal openCount)
    autoPlay?: boolean; // default true (false = show full immediately)
    onDone?: () => void;
}
```

```tsx
<Typewriter speed={60} onDone={() => setStep(2)}>
  <p>交易已提交至 <strong>Stellar</strong>。</p>
  <p>正在等待账本确认。</p>
</Typewriter>

// Restart on modal open:
<Typewriter trigger={openCount}>{dialogueText}</Typewriter>
```

Renders NO wrapper element; zero layout impact. Recursively truncates the ReactNode by character count while preserving the original node structure.

## Cursor

```ts
interface CursorProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    forceAll?: boolean; // default true — add pointer semantics to links and buttons
}
```

Wrap desktop regions that need consistent native cursor semantics:

```tsx
<Cursor>
    <App />
</Cursor>
```

Cursor does not load or draw a custom image. With `forceAll` (default `true`), descendant links, buttons, and `role="button"` elements use `pointer`; inputs and textareas use `text`; disabled elements use `not-allowed`. Set `forceAll={false}` when browser-native descendant behavior is sufficient. `className` and `style` apply to the root wrapper.
# BalanceCard

Green wallet total surface with white foreground text, masked values, metadata, and optional actions.

# AssetRow

Compact asset holding row with icon, identity, tabular balance, fiat value, and semantic change.

# TransactionRow

Transfer or swap history row with readable direction, amount, and status in both themes.

# AssetIcon

Circular asset mark with image fallback and three supported sizes.

# NetworkBadge

Compact semantic network availability badge.

# TransactionStatus

Status pill for pending, completed, and failed transactions.

# SwapRoute

Swap path comparison surface with optional best-route emphasis.

# WalletSwitcher

Accessible wallet selector with identity, address, avatar, and trigger affordance.

# QuickAction

Compact icon-and-label action button for wallet shortcuts.

# BottomNavigation

Mobile primary navigation with active-page semantics.

# AddressField

Wallet address field with copy affordance and visible focus.

# AmountField

Numeric asset amount field with currency, balance, and Max affordances.

# FeeSummary

Compact fee and transaction total key/value summary.
