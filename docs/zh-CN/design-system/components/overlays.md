# Overlays — 精确样式规范

Modal、Drawer 与 Tooltip 使用常规金融科技表面、语义 Token 和克制动效，不包含装饰插画或异形裁切。

## Modal

- 遮罩：固定视口层，使用 `--Fresnica-mask-bg`，`z-index: 1000`，桌面端留 16px 边距。
- 容器：默认宽 520px，最大宽 `calc(100vw - 32px)`，最大高 `calc(100vh - 32px)`。
- 表面：`--Fresnica-surface`、1px 语义边框、24px 大圆角 Token、24px 内边距且无投影；文字使用当前主题的文字 Token。
- 标题：20px、字重 700；正文：16px、字重 400、行高 1.5。
- Footer：右对齐、可换行、12px 间距。取消操作使用中性 Default Button；主要操作使用绿色与 `--Fresnica-on-primary-color`。
- 动效：Token 控制淡入与 0.96 到 1 的缩放。打开时捕获焦点，关闭后归还焦点。
- 480px 及以下改为底部 Sheet，内边距 20px，顶部两角使用 24px 大圆角 Token。

## Drawer

- 遮罩：固定视口层，使用 `--Fresnica-mask-bg`，透明度按 slow motion Token 过渡。
- 面板：`--Fresnica-surface`、1px 语义边框、无投影，内容侧为 24px 圆角；深色模式不能强制使用白色面板。
- 左右抽屉默认 378px，顶部/底部抽屉默认 300px，始终限制在视口内。
- Header：20px 内边距、20px/700 标题、40px 圆形 Lucide 关闭控件。
- Body：16px、行高 1.5、`0 20px 20px`；Footer：12px 间距与 `0 20px 20px`。
- placement 控制 translateX/translateY 入场，时长和缓动使用 slow motion Token。
- `pushBackground` 可在打开时把应用表面缩放到 0.94 并添加 1px 模糊；宿主根节点不适合 transform 时关闭此项。
- 480px 及以下，左右抽屉占满宽度。

## Tooltip

- 默认表面：`--Fresnica-surface-high`、1px 语义边框、8px 小圆角 Token、`8px 12px` 内边距且无投影。
- accent 表面：`--Fresnica-primary-color` 背景与 `--Fresnica-on-primary-color` 文字。
- 字体：12px、字重 500、行高 1.5；最大宽度 240px。
- 与触发器间距 12px；入场使用透明度加 4px 方向位移。
- 支持 12 个方向以及 `hover`、`focus`、`click` 触发；仅在显示时给触发器添加 `aria-describedby`。

## ConfirmDialog 使用规范

`ConfirmDialog` 是基于现有 `Modal` 的使用模式，不需要新增独立包装组件。

- 可恢复或普通确认使用 `variant="confirm"`，危险操作使用 `variant="danger"`。
- `title` 应直接说明操作，正文说明后果，并使用明确的 `okText`/`cancelText`。
- 提交处理中使用 `okLoading`，用 `okDisabled` 防止重复提交。操作被接受或调用方报告失败前，不要关闭弹窗。
- 危险操作或未保存内容确认使用 `maskClosable={false}`；需要额外关闭入口时启用 `closable`。
- 保持 `onOk` 与 `onClose` 稳定，并依赖 Modal 的焦点恢复契约。Escape 和取消操作不能触发主要操作。
- 普通确认使用中性取消按钮和主色确认按钮；危险操作使用 danger 变体和简洁、明确的不可逆操作文案。
