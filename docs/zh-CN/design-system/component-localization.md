# 组件多语言文案契约

组件库保留默认文案以支持零配置使用，同时允许产品外壳注入翻译后的界面文案，不改变视觉 Token 或业务内容。

## `labels` 属性

导出的 `ComponentLabels` 类型提供共享文案词汇。每个组件只接收自己使用的字段子集，并通过可选的 `labels` 属性注入，因此消费者不需要提供完整的语言包。

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

支持的组件分组：

- 钱包表单：`AmountField`、`AddressField`。
- 钱包状态与详情：`TransactionStatus`、`TransactionRow`、`NetworkBadge`、`TransactionDetails`。
- 覆盖层：`Modal`。
- 日期/时间控件：`DatePicker`、`TimePicker`。
- 导航与反馈基础组件：`Carousel`、`Pagination`、`Loading`、`Footer`、`Notification`。
- 内容基础组件：`CodeBlock`、`Image`、`Select`、`Table`。

非钱包组件采用小范围、按组件拆分的文案契约：

- `Carousel`：`carousel`、`previousSlide`、`nextSlide`、`selectSlide`、`goToSlide`、`pauseAutoplay`、`resumeAutoplay`。
- `Pagination`：`pagination`、`previousPage`、`nextPage`、`pageSizeLabel`、`pageSizeOption`、`pageSizeMenu`、`pageCount`、`jumpToPage`、`jumpToPagePrefix`、`jumpToPageSuffix`。
- `DatePicker`：除已有日期操作文案外，支持 `weekdays`、`months`、`dateLabel`、`monthLabel`、`yearLabel`。
- `Loading` 与 `Footer`：分别使用 `loading` 和 `footer`。
- `CodeBlock`：`codeCopy`、`codeCopied`、`codeCopyError`、`codeCopyLabel`。
- `Image`：`imageLoadFailed`、`imagePreview`、`closePreview`。
- `Select`：`selectMenu` 用于下拉列表的无障碍名称；可见的空值仍使用已有 `placeholder` 属性。
- `Table`：`emptyState` 和 `loadingState`。
- `Notification`：使用 `NotificationItem.closeLabel` 设置关闭按钮的无障碍名称。
- `Drawer` 与 `Tag`：通过 `labels={{ close }}` 注入关闭按钮无障碍名称；组件的显式 `closeLabel` 属性仍然具有更高优先级。

`weekdays` 按周日开头，`months` 按一月开头。日期格式化回调接收数字参数，由产品语言适配器决定具体格式，不改变组件状态或布局。

已有的显式属性（例如 `maxLabel`、`copyLabel`、`statusLabel`、`okText`、`cancelText`、`closeLabel` 和 `aria-label`）仍然具有更高优先级。`children` 也继续覆盖 `TransactionStatus` 自动生成的文案。

## 兼容性与范围

- 默认中英文文案保持不变，因此现有截图和消费者不会发生变化。
- `labels` 只改变文案和无障碍名称，不改变间距、字号、颜色或组件状态语义。
- 产品专属文案应由使用方维护；组件库只提供可复用的界面文案，不建立全局语言提供器或钱包术语注册表。
- `labels` 是增量且可选的。组件自身已有的显式属性（`emptyText`、`label`、`placeholder`、`closeLabel`、`aria-label` 等）仍拥有最高优先级。
- 本文档规定当前 Web 包的文案契约。Android 优先的原生适配层沿用由 App LocalizationProvider
  注入文案的原则，并增加平台无障碍语义；边界见 `mobile-native-baseline.md`。
