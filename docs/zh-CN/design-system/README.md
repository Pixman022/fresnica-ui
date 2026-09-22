# Design System

本目录是 fresnica-ui 设计语言的唯一真源。组件库源码是它的实现，其余所有使用类文档都是对这里内容的派生摘要。

## 设计语言

fresnica-ui 是面向 Fresnica 产品的跨平台 React + TypeScript UI 组件库，覆盖移动端、Web 和桌面客户端适配。

当前 Fresnica 产品语言是**简约科技体系**：克制且稀缺的翠绿色主操作、中性表面层级、彼此独立的语义状态色、响应式布局规则与 Lucide 界面图标。钱包流程作为独立产品示例维护。

- 源码：`src/components/<ComponentName>/`
- Demo 站：`demo/`
- 构建：Vite (library mode)，`vite.config.ts` 构建库，`vite.config.demo.ts` 构建 Demo
- 样式系统：Less Modules + `src/styles/variables.less` 设计 token

## 全量导出清单

48 个组件 + 3 个伴生导出（`FormItem` / `useForm` / `ICON_LIST`），全部从 `src/index.ts` 导出：

| 组件           | 职责                                                                                                                                                                                    | 交互 | 装饰 / 纯展示 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------- |
| `Button`       | 按钮，6 种类型 × 3 种尺寸                                                                                                                                                                   | ✓    |               |
| `Input`        | 输入框，3 种尺寸 + clear/prefix/suffix                                                                                                                                                      | ✓    |               |
| `Switch`       | 开关，默认/小号                                                                                                                                                                             | ✓    |               |
| `Modal`        | 标准圆角弹窗，支持焦点管理和遮罩                                                                                                                                                            | ✓    |               |
| `Drawer`       | 标准圆角抽屉，支持遮罩与四个方向                                                                                                                                                            | ✓    |               |
| `Card`         | 中性的 `default`/`dashed` 容器及语义提示色                                                                                                        |      | ✓             |
| `Title`        | 语义化章节标题与 Fresnica 字体规范                                                                                                                                                           |      | ✓             |
| `Collapse`     | 手风琴（动画用 CSS Grid 0fr↔1fr 实现，无 JS 动画）                                                                                                                                          | ✓    |               |
| `Select`       | 下拉选择器（受控）                                                                                                                                                                          | ✓    |               |
| `DatePicker`   | 日期选择器，支持日期/月/年面板、范围选择与键盘导航                                                                                                                                           | ✓    |               |
| `TimePicker`   | 时间选择器，支持时/分/秒滚选、步进与键盘导航                                                                                                                                                 | ✓    |               |
| `Checkbox`     | 多选框组，水平/垂直，3 种尺寸                                                                                                                                                               | ✓    |               |
| `Radio`        | 单选框组，3 种尺寸，键盘 roving tabindex                                                                                                                                                    | ✓    |               |
| `Tooltip`      | 12 种 placement，`hover`/`focus`/`click` 触发，`default`/`accent` 形态                                                                                                                         | ✓    |               |
| `Icon`         | SVG 图标库（10 个）                                                                                                                                                                         |      | ✓             |
| `Footer`       | 文字型底部信息（`default`/`compact`）                                                                                                                                                       |      | ✓             |
| `Divider`      | CSS 分割线（`subtle`/`solid`/`dashed`/`accent`）                                                                                                                                               |      | ✓             |
| `Cursor`       | 局部光标包裹器                                                                                                                                                                               |      | ✓             |
| `Typewriter`   | 打字机效果，保留 ReactNode 结构                                                                                                                                                             |      | ✓             |
| `Tabs`         | 支持键盘操作的标签页切换，中性表面与主色当前态                                                                                                                                             | ✓    |               |
| `CodeBlock`    | JSX/TS 语法高亮代码块                                                                                                                                                                       |      | ✓             |
| `Loading`      | Lucide spinner 与可访问状态文本                                                                                                                                                              |      | ✓             |
| `EmptyState`   | 中性空状态，适用于请求完成但没有内容，支持说明和下一步操作                                                                                                                                     |      | ✓             |
| `ErrorState`   | 带 alert 语义的可恢复错误状态，支持错误说明和重试/返回操作                                                                                                                                        | ✓    |               |
| `Table`        | 数据表格，固定列、空状态、loading                                                                                                                                                           | ✓    |               |
| `Form`         | 表单容器 + 校验（含 `FormItem` / `useForm` 伴生导出，类主流表单库 API）                                                                                                                    | ✓    |               |
| `Tag`          | 胶囊标签，3 种尺寸 × 4 种变体 × 7 种语义颜色，支持 closable / onClick / disabled                                                                                                           | ✓    |               |
| `Notification` | 命令式全局通知（antd 风格）：4 种 type × 6 个 position，支持 description / btn / onClick / key 复用更新 / destroy 全部                                                                      | ✓    |               |
| `Progress`     | 基于 Token 的进度指示器：3 档 size，支持 inside/right/top 文字位置、infoFormat 自定义与 duration 控制填充过渡 |      | ✓             |
| `Skeleton`     | 中性加载占位骨架，4 种变体（`text`/`circle`/`rect`/`paragraph`）及按钮、输入框、头像子组件                                                   |      | ✓             |
| `BackTop`      | 固定右下角回到顶部按钮（ArrowUp 图案，easeInOutQuad 平滑滚动）                                                                                                                            | ✓    |               |
| `Image`        | 基于 Token 的图片外框，支持懒加载、错误占位和点击预览                                                                                                                                      | ✓    |               |
| `Carousel`     | 受控/非受控轮播，支持自动播放、循环、箭头、圆点和键盘导航                                                                                                                                   | ✓    |               |

类型导出覆盖当前 Fresnica 组件及其伴生类型；旧 Fresnica 装饰组件已从公共包移除。

运行时值：`Notification`、`notificationOpen`、`notificationDestroy`、`NOTIFICATION_DEFAULT_DURATION`、`ICON_LIST`。伴生导出：`FormItem`、`useForm`（默认导出 `Form` 也支持 `Form.Item` / `Form.useForm` 写法）。

## 本目录文件

- [design-tokens.md](./design-tokens.md) — 色彩、字体、间距、圆角、边框、阴影与动效的精确值。
- [design-rules.md](./design-rules.md) — 7 条设计铁律、14 条视觉硬规则，以及 ❌/✅ 反例速查。
- [visual-regression-checklist.md](./visual-regression-checklist.md) —— 钱包页面和组件状态的浅色/深色移动端视觉回归基线。
- [css-variables.md](./css-variables.md) — 不依赖组件库自实现样式时的完整 `:root` 变量模板。
- [token-audit-baseline.md](./token-audit-baseline.md) — 已评审的审计基线与允许保留的原始值清单。
- [token-architecture.md](./token-architecture.md) — Primitive → Semantic → Component 三层模型、兼容桥接与迁移映射。
- [pending-deletions.md](./pending-deletions.md) — 等待最终产品/API 决策的清理候选事项。
- [components/](./components/) — 各组件的像素级样式规范。
- [demo-site.md](./demo-site.md) — Demo 与文档站的布局规范（不属于发布的组件库）。
- [composition-evaluation.md](./composition-evaluation.md) — `WalletScreen`、`PageHeader` 等组合级组件的评估记录。
- [theme-customization.md](./theme-customization.md) — 本地主题色生成、持久化与多标签页同步规则。
- [cross-platform-core.md](./cross-platform-core.md) — 共享设计原则、语义 Token、状态、可访问性和响应式基线。
- [platform-adaptation.md](./platform-adaptation.md) — 移动端、Web 和桌面客户端的布局与交互适配。
- [navigation-hierarchy.md](./navigation-hierarchy.md) — 钱包示例的一级、二级和详情导航职责。
