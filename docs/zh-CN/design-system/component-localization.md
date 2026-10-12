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

## 全局 Locale Provider

WS03 新增 Web 通用 Locale Context，但不会替换既有主题 Provider：

```tsx
import { FresnicaThemeProvider, FresnicaUiProvider, zhCN } from 'fresnica-ui';

<FresnicaThemeProvider>
  <FresnicaUiProvider locale={zhCN}>
    <App />
  </FresnicaUiProvider>
</FresnicaThemeProvider>;
```

内置语言包同时从包根入口和稳定的 `fresnica-ui/locales` 子路径导出。
`FresnicaUiProvider` 接收局部 locale 对象，并按字段与最近的父级 Provider 合并。
未提供字段继续保持缺失，使组件可以回退到原有默认文案。Provider 不持久化语言、
不读取产品状态、不提供全局可变 setLocale，也不复制 `FresnicaThemeProvider` 的主题状态。

WS04 接入组件后，文案优先级为：

1. 组件已有显式文案属性，例如 `closeLabel`、`label`、`clearAriaLabel`；
2. 组件已有的 `labels` 对应字段；
3. 最近的 `FresnicaUiProvider` Locale 字段；
4. 组件原有默认文案。

WS03 只交付 Provider 与语言包契约；具体通用组件接入由 WS04 跟踪。在 WS04 合并前，
现有组件仍按原来的显式属性 / `labels` / 默认值解析。

## WS04 组件覆盖与行为所有权

WS04 将 Web 通用组件文案接入 `FresnicaUiProvider`，并保持既有优先级：
组件显式属性 → 组件 `labels` → Provider Locale → 历史默认值。

| 组件范围 | Provider 状态 | 更高优先级 / 局部例外 |
| --- | --- | --- |
| Modal | 已接入 | `okText`、`cancelText`、`closeLabel`，再到 `labels` |
| Drawer / Tag | 已接入 | `closeLabel`，再到 `labels.close` |
| Loading | 已接入 | `label`，再到 `labels.loading` |
| Input | 已接入 | `clearAriaLabel`；不为此新增组件 `labels` API |
| Select | 已接入 | 显式 `aria-label`，再到 `labels.selectMenu` |
| Table | 已接入 | `emptyText`，再到 `labels.emptyState/loadingState` |
| Carousel / Pagination | 已接入 | 既有组件 `labels` 继续优先 |
| DatePicker / TimePicker | 通用操作、数组与 formatter 文案已接入 | 显式 placeholder/ARIA 属性不进入 Provider |
| CodeBlock / Image / Footer | 已接入 | 既有 `labels`、`alt`、`children` 等显式属性继续优先 |
| Notification 静态 API | 由显式属性管理 | 命令式 API 使用独立 React root，因此使用 `closeLabel`；WS04 不新增全局可变 Locale |
| Button | 不适用 | Button 不拥有通用动作文案；loading 继续保持既有禁用 + spinner 行为 |

Web Modal 继续保留已有的焦点进入、Tab 限制和关闭后焦点恢复。loading/disabled 仍由拥有该状态的
组件阻止重复操作。状态或错误播报继续由渲染语义 `status`/`alert` 的组件负责，消费 App
不应对同一状态再做一次重复 live announcement。

Button 动作层级只对齐用途，不强制使用相同 props：Native `secondary` 对应 Web 普通次级 /
`default` 动作角色，Native `quiet` 对应 Web 低强调的 `text` 角色。两端视觉实现和公开
属性命名继续独立。

## 兼容性与范围

- 默认中英文文案保持不变，因此现有截图和消费者不会发生变化。
- `labels` 只改变文案和无障碍名称，不改变间距、字号、颜色或组件状态语义。
- 产品专属文案应由使用方维护。Web 包现已提供可选的全局 Locale Provider 管理通用 UI 文案，同时保持既有显式属性/`labels` 行为兼容。钱包术语不进入通用语言包。
- `labels` 是增量且可选的。组件自身已有的显式属性（`emptyText`、`label`、`placeholder`、`closeLabel`、`aria-label` 等）仍拥有最高优先级。
- 本文档规定当前 Web 包的文案契约。Android 优先的 Native 适配层现已提供
  `FresnicaUiProvider`、`useUiLocale`、`useUiTheme` 和内置 `enUS`/`zhCN`，用于通用组件文案；
  App 仍负责选择与持久化，组件显式覆盖继续优先。平台边界见 `mobile-native-baseline.md`。

## 跨平台同步状态 — 2026-10-12

Native NU01–NU08 已在 `ea40207351d9a2a62c58226c2c361f06444ee309` 完成。
Web WS03 已提供全局 Locale Context 与公开语言包；WS04 已完成符合范围的通用组件文案接入，
并保持显式属性、组件 `labels` 和原有默认值的优先级。WS05 的回归与打包消费验证也已完成。
