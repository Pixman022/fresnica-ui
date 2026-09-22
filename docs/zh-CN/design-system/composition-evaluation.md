# 组合级组件评估记录

状态：2026-09-17 已评估。本次不新增公开组件。

## 范围

本记录用于关闭 TODO 中关于 `WalletScreen`、`PageHeader` 的待评估项，检查对象是 `demo/components/Fresnica*` 下的钱包示例，以及共享的 `WalletDemoShell`、`FresnicaNavigation` 辅助组件。

## 结论

### WalletScreen

`WalletDemoShell` 已经是示例页面稳定的组合边界，负责 390×844 手机画布、主题上下文和溢出行为。各页面的滚动方式、顶部结构和内容密度仍有明确差异。若把完整页面提升为组件库组件，会把组件库绑定到示例路由和产品信息架构。

决定：继续保留 `WalletDemoShell` 作为示例辅助组件，不新增公开的 `WalletScreen`。

### PageHeader

当前顶部结构有多种有意的模式：

- 居中标题和返回操作（`Swap`、`Send`）；
- 标题、返回和更多操作（`Transaction details`）；
- 产品身份与网络状态（`Home`、`Network & Nodes`）；
- 标题和上下文操作（`Activity`、`Explore dApps`、`Scan`）。

它们共享间距和字体 Token，但结构与操作 API 并不稳定。通用 Header 要么暴露产品专用属性，要么掩盖重要的布局差异。

决定：继续使用原生元素和现有的 `Title`、`Button`、`Icon` 及 Token 组合页面头部。只有至少三个产品页面需要完全相同的 DOM 结构和交互契约时再重新评估。

## 重新评估条件

只有同时满足以下条件，才考虑新增组合组件：

1. 相同结构出现在三个或更多已交付产品页面中；
2. 键盘、安全区和响应式行为可以脱离路由单独定义；
3. Props 无需引入钱包业务字段即可完成文档化；
4. 可以用组件级测试覆盖交互契约。

在此之前，这是一项观察记录，不是组件库缺口。
