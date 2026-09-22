# Token 分层架构

Fresnica UI 使用三层 Token 模型。分层可以在不改变组件结构和现有视觉基线的前提下，继续支持浅色、深色和本地自定义主题。

## 各层职责

| 层级 | 作用 | 典型内容 |
| --- | --- | --- |
| Primitive（原始层） | 保存可复用的原始构建值，只描述“是什么值”，不描述使用原因。 | 颜色、字体族与字号、字重、行高、间距、圆角、控件尺寸、边框宽度、动效和阴影。 |
| Semantic（语义层） | 为原始值赋予产品语义，使主题可以在角色背后替换具体值。 | 画布与表面背景、主要/次要内容、边框、主要操作、禁用状态、反馈、状态、风险、焦点和遮罩。 |
| Component（组件层） | 定义单个组件族消费的契约，将语义角色与几何尺寸、交互状态组合起来。 | Button、Input、Card、Dialog/Modal、Select、Drawer、Table、Tag 的背景、内容、边框、尺寸、内边距、圆角、状态颜色和过渡。 |

依赖方向始终为：

```text
旧运行时变量 → Primitive → Semantic → Component
```

当组件已有组件契约时，组件样式应消费 Component Token。只有在值被复用或代表稳定的公开行为时，才新增组件契约；一次性的几何值继续保留在组件内部并记录为例外。

## 文件与运行时行为

- `design-system/tokens.json` 是三层结构清单和浅色基线。
- `design-system/tokens.css` 将三层输出为 CSS 自定义属性，并有意指向现有 `--Fresnica-*` 运行时变量。
- `src/styles/themes/default.less` 仍是浅色、深色和自定义主题运行时值的来源。
- `src/styles/index.less` 在组件样式之前引入分层 CSS。

这个兼容桥接是有意设计的。第一阶段不会删除或重命名任何现有 `--Fresnica-*` 变量，也不会改变渲染值，因此现有主题切换和本地自定义主题仍通过旧运行时变量生效。

## 当前迁移映射

| 现有样式契约 | 分层契约 | 状态 |
| --- | --- | --- |
| `--Fresnica-primary-color*` | `primitive.color.brand-primary*` → `semantic.color.action-primary*` → `component.button.primary-background*` | Button 已迁移 |
| `--Fresnica-surface*`、`--Fresnica-text-color*` | `semantic.color.surface-*`、`semantic.color.content-*` | Button、Input、Card、Dialog、Select、Drawer、Table、Tag 已按需迁移 |
| `--Fresnica-border-color*` | `primitive.color.border-*` → `semantic.color.border-*` | 上述组件已按需迁移 |
| `--Fresnica-spacing-*`、`--Fresnica-border-radius-*`、`--Fresnica-height-*` | `primitive.space.*`、`primitive.radius.*`、`primitive.size.*` | 已列出的组件几何值已迁移 |
| `--Fresnica-mask-bg` 与动效变量 | `semantic.overlay-scrim`、`semantic.motion.*` | Dialog 与共享交互契约已迁移 |
| 钱包展示、导航与紧凑状态变量（`--Fresnica-spacing-*`、`--Fresnica-surface-*`、反馈、状态与焦点角色） | Primitive 几何 Token 与 Semantic surface、content、action、feedback、status 角色 | BalanceCard、AmountField、AssetRow、AssetIcon、BackTop、BottomNavigation、NetworkBadge、TransactionStatus、WalletSwitcher 已迁移；旧运行时值保持不变 |
| 支持性展示、反馈与导航变量（`--Fresnica-spacing-*`、`--Fresnica-surface-*`、内容、边框与动效角色） | Primitive 几何 Token 与 Semantic surface、content、action、feedback、border、motion 角色 | Divider、EmptyState、ErrorState、FeeSummary、Footer、Loading、Skeleton、Tabs、Title 已迁移；旧运行时值保持不变 |
| 进度与选择控件（`--Fresnica-primary-color*`、`--Fresnica-border-color*`、`--Fresnica-motion-*`） | Primitive 控件几何 Token 与 Semantic action、content、surface、border、focus 角色 | Progress、Radio、Switch 已迁移；反色手柄颜色仍保留旧兼容值，因为没有引入新的视觉值 |
| 选择与快捷操作控件（`--Fresnica-primary-color*`、`--Fresnica-surface-*`、`--Fresnica-spacing-*`） | Primitive 几何 Token 与 Semantic action、content、surface、focus 角色 | Checkbox、QuickAction 已迁移；现有变体与状态保持原有视觉值 |
| 地址、折叠与代码展示变量（`--Fresnica-border-color*`、`--Fresnica-spacing-*`、`--Fresnica-motion-*`） | Primitive 几何 Token 与 Semantic content、surface、border、action、focus 角色 | AddressField、Collapse、CodeBlock 已迁移；专用语法/代码颜色仍保留为兼容变量 |
| Tooltip、路由与交易行变量（`--Fresnica-surface-*`、`--Fresnica-spacing-*`、状态角色） | Primitive 几何 Token 与 Semantic content、surface、border、action、focus、金融状态角色 | SwapRoute、Tooltip、TransactionRow 已迁移；成功/警告/失败状态容器契约保持独立 |
| 媒体与轮播变量（`--Fresnica-surface-*`、`--Fresnica-border-color*`、`--Fresnica-motion-*`） | Primitive 媒体几何 Token 与 Semantic surface、border、content、action、overlay、focus 角色 | Image、Carousel 已迁移；栅格内容和代码专用颜色仍不纳入语义调色板 |
| 日期时间、分页与反馈变量（`--Fresnica-spacing-*`、`--Fresnica-surface-*`、`--Fresnica-text-color*`、`--Fresnica-primary-color*`、反色表面/内容） | Primitive 控件几何 Token 与 Semantic surface、content、border、action、feedback、focus、inverse 角色 | DatePicker、TimePicker、Pagination、Notification、TransactionDetails 已迁移；通知反色表面/内容别名保留原紧凑通知的对比度 |
| 组件专用旧声明 | `component.select.*`、`component.drawer.*`、`component.table.*`、`component.tag.*` | 新增兼容契约，视觉值保持不变；Table 行悬停现在消费组件 Token，并保留原有 10% 主色混合效果 |

迁移期间旧变量仍是兼容 API。分层名称是新增能力，其他组件可以逐步采用。

## 兼容与迁移顺序

1. 保持旧变量和主题覆盖值不变。
2. 在 `tokens.json` 中新增或更新结构化条目。
3. 在 `tokens.css` 中增加对应别名，通过旧运行时变量或更早层级解析。
4. 一次迁移一个组件族，并对比渲染值。
5. 运行 `npm run audit:tokens`、视觉检查和组件测试。
6. 对有意保留的未消费公开契约补充说明，不自动删除。

当前已完成已评审组件族的迁移。仍直接消费旧变量的部分属于有意保留的兼容桥接或已评审例外。后续可以在保持原有值和状态行为的前提下渐进采用分层名称；重命名、删除旧变量或引入新视觉值，需要单独的设计系统决策。

## 契约规则

- 不要因为当前颜色恰好相同，就用另一个语义角色的 Component Token 替代它。
- success、failure、gain、loss、warning、risk 等金融语义必须保持独立。
- 对需要适配主题的颜色优先使用 Semantic 别名；原始值只放在 Primitive 或已评审例外中。
- 当 CSS 颜色函数本身就是现有视觉契约时，组件交互 Token 可以表达该函数；函数内部仍应引用语义角色，以保持主题切换能力。
- 如果公开契约代表未来状态、变体或兼容桥接，应保留未消费状态，不要自动删除。
- 第一阶段的 `tokens.json` 和 `tokens.css` 只做增量扩展，现有运行时主题仍是权威来源。
