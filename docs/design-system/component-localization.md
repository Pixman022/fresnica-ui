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

## Compatibility and scope

- Default English/Chinese labels are unchanged, so existing screenshots and consumers remain stable.
- `labels` changes text and accessible names only; it does not change spacing, typography, color, or component state semantics.
- Product-specific copy belongs in the consuming app. The Web package currently exposes reusable UI labels without a global Locale provider; adding that provider is WS03 work and must preserve existing explicit props/`labels` behavior. Wallet terminology stays outside the generic locale surface.
- Labels are additive and optional. Existing explicit props (`emptyText`, `label`, `placeholder`, `closeLabel`, and `aria-label`) remain the most specific override for the component that owns them.
- This file specifies the current Web package contract. The Android-first Native adapter now ships
  `FresnicaUiProvider`, `useUiLocale`, `useUiTheme`, and built-in `enUS`/`zhCN` packs for generic
  component copy. App-owned selection/persistence and explicit component overrides remain outside
  that provider. See `mobile-native-baseline.md` for the platform boundary.

## Cross-platform synchronization status — 2026-10-12

Native NU01–NU08 are complete at `ea40207351d9a2a62c58226c2c361f06444ee309`.
For Web, the current precedence remains explicit component copy → component `labels` → existing
component defaults. WS03 will add Provider Locale between `labels` and defaults; WS04 will connect
eligible generic copy. Until those tasks merge, the Provider behavior is Native-only and must not
be inferred as a Web feature.
