# Form control components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Input

```ts
type InputSize = 'small' | 'middle' | 'large';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    size?: InputSize; // default 'middle'
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean; // default false
    status?: 'error' | 'warning';
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onClear?: () => void;
}
```

```tsx
<Input placeholder="Search Stellar assets" allowClear size="large" prefix={<Search size={16} />} value={q} onChange={e => setQ(e.target.value)} status="error" disabled />
```

## Switch

```ts
type SwitchSize = 'small' | 'default';

interface SwitchProps {
    checked?: boolean; // controlled
    defaultChecked?: boolean; // default false
    size?: SwitchSize; // default 'default'
    disabled?: boolean; // default false
    loading?: boolean; // default false
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    onChange?: (checked: boolean) => void;
    className?: string;
}
```

```tsx
<Switch defaultChecked onChange={v => console.log(v)} />
```

The off track uses `--Fresnica-surface-high`; the checked track uses `--Fresnica-primary-color` with `--Fresnica-on-primary-color` content. Both surfaces follow the active theme.

## Checkbox

```ts
type CheckboxSize = 'small' | 'middle' | 'large';

interface CheckboxOption {
    label: React.ReactNode;
    value: string | number;
    disabled?: boolean; // disable this option only
}

interface CheckboxProps {
    options: CheckboxOption[]; // REQUIRED
    value?: Array<string | number>; // controlled
    defaultValue?: Array<string | number>; // default []
    size?: CheckboxSize; // default 'middle'
    disabled?: boolean; // default false — disables all
    direction?: 'horizontal' | 'vertical'; // default 'horizontal'
    onChange?: (values: Array<string | number>) => void;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Checkbox options={[{ label: 'Stellar 主网', value: 'mainnet' }, { label: 'Stellar 测试网', value: 'testnet' }, { label: '离线模式', value: 'offline', disabled: true }]} defaultValue={['mainnet']} />
```

Group-level `disabled` disables every item; per-option `disabled` disables a single row. Unchecked boxes use `--Fresnica-surface`, disabled boxes use `--Fresnica-surface-high`, and checked fill, border, and white-check foreground resolve the runtime theme tokens, so Light and Dark retain their distinct primary values. No indeterminate state, no standalone `<Checkbox.Single>` — group-only via `options`.

## Radio

```ts
type RadioSize = 'small' | 'middle' | 'large';

interface RadioOption {
    label: React.ReactNode;
    value: string | number;
    disabled?: boolean;
}

interface RadioProps {
    options: RadioOption[]; // REQUIRED
    value?: string | number; // controlled
    defaultValue?: string | number; // uncontrolled
    size?: RadioSize; // default 'middle'
    disabled?: boolean; // default false — disables all
    direction?: 'horizontal' | 'vertical'; // default 'horizontal'
    onChange?: (value: string | number) => void;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
const [v, setV] = useState<string | number>('zh');
<Radio value={v} onChange={setV} options={[{ label: '中文', value: 'zh' }, { label: 'English', value: 'en' }, { label: '日本語', value: 'ja', disabled: true }]} />;
```

Implements WAI-ARIA roving tabindex (Arrow / Home / End keyboard navigation). The ring uses `--Fresnica-surface` and disabled radios use `--Fresnica-surface-high`, so both themes retain a neutral control surface; dark-mode unchecked rings use a brighter muted outline. The selected ring and dot resolve `--Fresnica-primary-color` at runtime and follow the active theme. Single-select counterpart to `Checkbox`. **Not supported:** no `optionType="button"` / `buttonStyle` / indeterminate / nested groups / standalone per-`<Radio>` (group-only via `options`).

## Select

```ts
type SelectOption = { key: string; label: string };

interface SelectProps {
    options: SelectOption[]; // REQUIRED
    value: string; // REQUIRED — controlled-only
    onChange: (key: string) => void; // REQUIRED
    placeholder?: string; // default '请选择'
    disabled?: boolean; // default false
    placement?: 'auto' | 'bottom'; // default 'auto'; bottom keeps the menu within a narrow preview flow
}
```

```tsx
const [lang, setLang] = useState('zh');
<Select value={network} onChange={setNetwork} options={[{ key: 'mainnet', label: 'Stellar Mainnet' }, { key: 'testnet', label: 'Stellar Testnet' }]} placeholder="Choose Stellar network" />;
```

- **Controlled only** — `value` / `onChange` required, no `defaultValue`. Dropdown auto-flips by default and click-outside closes; `placement="bottom"` keeps it below the trigger when possible, flips upward when needed, and constrains its height and width for narrow containers. The trigger and menu use theme surface tokens; the selected option uses primary green with white text and no option dots. No `className` / `style` / `renderOption`; style via `.wrapper`. **Not supported:** `multiple`, `tags`, search, loading, clear, custom labels or custom empty content.

## DatePicker

```ts
type DatePickerSize = 'small' | 'middle' | 'large';
type DatePickerStatus = 'error' | 'warning';
type DatePickerValue = string | [string, string] | null; // null = cleared

interface DatePickerProps {
    range?: boolean; // default false — pick a start & end date
    value?: DatePickerValue; // string for date mode, [start, end] for range
    defaultValue?: string | [string, string]; // uncontrolled
    onChange?: (value: DatePickerValue) => void; // null when cleared
    placeholder?: string; // default '请选择日期'
    disabled?: boolean; // default false
    allowClear?: boolean; // default false
    size?: DatePickerSize; // default 'middle'
    status?: DatePickerStatus;
    format?: string; // default 'YYYY-MM-DD'; tokens YYYY / MM / DD / M / D
    disabledDate?: (date: Date) => boolean;
    picker?: 'date' | 'month'; // default 'date' — 'month' opens the month grid and commits YYYY-MM
    open?: boolean; // controlled open state
    onOpenChange?: (open: boolean) => void;
    showToday?: boolean; // default true
    'aria-label'?: string; 'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<DatePicker value={date} onChange={setDate} allowClear />
<DatePicker range value={range} onChange={setRange} disabledDate={d => d.getDay() === 0} />
```

Calendar popup date picker. The value is a plain `YYYY-MM-DD` string — no date library, zero runtime deps. Click the year-month label to switch to year / month selection; `disabledDate` disables any date (weekends etc.); `range` renders two linked month panels for a start & end date. Picking sets a pending value shown live in the trigger; `确定` commits and closes, Esc / click-outside discards. Selected dates, range hover, in-range days and endpoints use the primary green family with white foreground; endpoints add a white token border. Keyboard: Enter/Space/ArrowDown opens, arrows move the focus date, Enter sets the pending date, Esc closes, PageUp/PageDown flips months.

## TimePicker

```ts
type TimePickerSize = 'small' | 'middle' | 'large';
type TimePickerStatus = 'error' | 'warning';
type TimePart = { h: number; m: number; s: number };

interface TimePickerProps {
    value?: string; // controlled, HH:mm:ss
    defaultValue?: string; // uncontrolled
    onChange?: (value: string | null) => void; // null when cleared
    placeholder?: string; // default '请选择时间'
    disabled?: boolean; // default false
    allowClear?: boolean; // default false
    size?: TimePickerSize; // default 'middle'
    status?: TimePickerStatus;
    format?: string; // default 'HH:mm:ss'; tokens HH / mm / ss; ss shows the seconds column
    hourStep?: number; // default 1
    minuteStep?: number; // default 1
    secondStep?: number; // default 1
    open?: boolean; // controlled open state
    onOpenChange?: (open: boolean) => void;
    'aria-label'?: string; 'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}
```
```tsx
<TimePicker value={time} onChange={setTime} minuteStep={15} allowClear />
```

Time popup picker with hour / minute / second scroll columns; picking updates the pending value live in the trigger; `此刻` sets the current time, `确定` commits (`onChange`) and closes; Esc / click-outside discard. Enter/Space opens, Enter confirms, Esc closes.
