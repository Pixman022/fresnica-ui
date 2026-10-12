# Component localization contract

The component library keeps default labels for a zero-configuration experience, while allowing product shells to inject translated UI copy without changing visual tokens or business content.

## `labels` prop

The exported `ComponentLabels` type is a shared vocabulary. Each component accepts only the subset it uses through an optional `labels` prop. This keeps the API additive: consumers do not need to provide a complete locale object.

```tsx
<AmountField
  labels={{ max: '全部', balance: '余额', selectAsset: '选择资产' }}
  onMax={fillBalance}
  onCurrencyClick={openAssetPicker}
/>

<Modal
  open={open}
  labels={{ confirm: '确认', cancel: '返回', close: '关闭对话框' }}
  onOk={submit}
  onClose={close}
/>
```

Supported component groups:

- Wallet fields: `AmountField`, `AddressField`.
- Wallet status and details: `TransactionStatus`, `TransactionRow`, `NetworkBadge`, `TransactionDetails`.
- Overlays: `Modal`.
- Date/time controls: `DatePicker`, `TimePicker`.
- Navigation and feedback primitives: `Carousel`, `Pagination`, `Loading`, `Footer`, `Notification`.
- Content primitives: `CodeBlock`, `Image`, `Select`, `Table`.

The non-wallet fields are intentionally small, component-scoped contracts:

- `Carousel`: `carousel`, `previousSlide`, `nextSlide`, `selectSlide`, `goToSlide`, `pauseAutoplay`, `resumeAutoplay`.
- `Pagination`: `pagination`, `previousPage`, `nextPage`, `pageSizeLabel`, `pageSizeOption`, `pageSizeMenu`, `pageCount`, `jumpToPage`, `jumpToPagePrefix`, `jumpToPageSuffix`.
- `DatePicker`: `weekdays`, `months`, `dateLabel`, `monthLabel`, `yearLabel` in addition to its existing date actions.
- `Loading` and `Footer`: `loading` and `footer`.
- `CodeBlock`: `codeCopy`, `codeCopied`, `codeCopyError`, `codeCopyLabel`.
- `Image`: `imageLoadFailed`, `imagePreview`, `closePreview`.
- `Select`: `selectMenu` for the listbox accessible name; use the existing `placeholder` prop for the visible empty value.
- `Table`: `emptyState` and `loadingState`.
- `Notification`: `NotificationItem.closeLabel` for the close button accessible name.
- `Drawer` and `Tag`: `labels={{ close }}` for the close button accessible name; their explicit `closeLabel` props remain higher priority.

`weekdays` is ordered Sunday-first and `months` January-first. Formatter callbacks receive numeric values so a product locale adapter can apply its own date conventions without changing component state or layout.

Existing explicit props such as `maxLabel`, `copyLabel`, `statusLabel`, `okText`, `cancelText`, `closeLabel`, and `aria-label` remain the most specific override. `children` also continues to override the generated `TransactionStatus` text.

## Global Locale provider

WS03 adds a Web-wide generic Locale context without replacing the existing theme provider:

```tsx
import { FresnicaThemeProvider, FresnicaUiProvider, zhCN } from 'fresnica-ui';

<FresnicaThemeProvider>
  <FresnicaUiProvider locale={zhCN}>
    <App />
  </FresnicaUiProvider>
</FresnicaThemeProvider>;
```

Built-in packs are exported from both the package root and the stable
`fresnica-ui/locales` subpath. `FresnicaUiProvider` accepts a partial locale object and
merges it with the nearest parent provider field-by-field. Missing fields remain absent so
components can fall back to their historical defaults. The provider does not persist language,
read product state, create a global mutable setter, or duplicate `FresnicaThemeProvider`.

For components connected in WS04, copy precedence is:

1. existing explicit component copy such as `closeLabel`, `label` or `clearAriaLabel`;
2. the component `labels` field when that component already exposes one;
3. the nearest `FresnicaUiProvider` Locale value;
4. the component's historical default copy.

WS03 delivers the provider and language-pack contract. Component adoption is tracked by WS04;
until that task merges, existing components continue using their current explicit/labels/default
resolution.

## WS04 component coverage and behavior ownership

WS04 connects the generic Web component copy to `FresnicaUiProvider` while preserving the
existing precedence: explicit component prop → component `labels` → Provider Locale → historical
default.

| Component area | Provider status | Higher-priority/local exception |
| --- | --- | --- |
| Modal | Connected | `okText`, `cancelText`, `closeLabel`, then `labels` |
| Drawer / Tag | Connected | `closeLabel`, then `labels.close` |
| Loading | Connected | `label`, then `labels.loading` |
| Input | Connected | `clearAriaLabel`; no component `labels` API is added |
| Select | Connected | explicit `aria-label`, then `labels.selectMenu` |
| Table | Connected | `emptyText`, then `labels.emptyState/loadingState` |
| Carousel / Pagination | Connected | existing component `labels` remain higher priority |
| DatePicker / TimePicker | Connected for generic controls, arrays and formatter labels | explicit placeholder/ARIA props stay outside Provider |
| CodeBlock / Image / Footer | Connected | existing `labels`, `alt`, `children` or other explicit props stay higher priority |
| Notification static API | Explicit-prop managed | its imperative API mounts a separate React root, so use `closeLabel`; WS04 does not add global mutable Locale state |
| Button | Not applicable | no generic action copy is owned by Button; loading remains the existing disabled spinner behavior |

Web Modal retains its existing focus entry, Tab trap and focus restoration. Loading/disabled state
continues to prevent repeated actions through the component that owns that state. Status or error
announcements remain owned by the component that renders the semantic `status`/`alert`; consuming
apps should not add a duplicate live announcement for the same state.

Button action tiers remain platform-specific names with equivalent intent rather than identical
props: Native `secondary` corresponds to the normal secondary/default Web action role, and Native
`quiet` corresponds to the low-emphasis Web `text` role. Their visual implementations and public
prop names remain independent.

## Compatibility and scope

- Default English/Chinese labels are unchanged, so existing screenshots and consumers remain stable.
- `labels` changes text and accessible names only; it does not change spacing, typography, color, or component state semantics.
- Product-specific copy belongs in the consuming app. The Web package now provides an optional global Locale provider for generic UI copy while preserving existing explicit props/`labels` behavior. Wallet terminology stays outside the generic locale surface.
- Labels are additive and optional. Existing explicit props (`emptyText`, `label`, `placeholder`, `closeLabel`, and `aria-label`) remain the most specific override for the component that owns them.
- This file specifies the current Web package contract. The Android-first Native adapter now ships
  `FresnicaUiProvider`, `useUiLocale`, `useUiTheme`, and built-in `enUS`/`zhCN` packs for generic
  component copy. App-owned selection/persistence and explicit component overrides remain outside
  that provider. See `mobile-native-baseline.md` for the platform boundary.

## Cross-platform synchronization status — 2026-10-12

Native NU01–NU08 are complete at `ea40207351d9a2a62c58226c2c361f06444ee309`.
Web WS03 provides the global Locale context and public language packs. WS04 is complete: eligible
generic component copy now consumes that context while preserving explicit props, component
`labels` and historical defaults. WS05 regression and packed-consumer validation are also complete.
