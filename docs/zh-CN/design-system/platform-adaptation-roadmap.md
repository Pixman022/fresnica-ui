# 跨平台适配路线

本路线用于记录评估结论，但不把当前 Web 组件库当作 React Native 组件库。
共享设计语言仍是唯一规范来源，各客户端通过适配层处理布局、输入、无障碍与系统集成。

## 状态

### 已完成：公开仓库基线

- 仓库改用 MIT 许可证，允许商业使用、修改、分发和私有集成，并保留版权与许可证声明。
- 仓库文档和 Demo 文案已不再描述“仅限非商业”或“仅供学习”。
- Node 工具链契约已统一记录为 Node 20.19.0 或更高版本。
- 当前 Web Token 数值已冻结为 1.0.0 跨平台基线；原生适配层消费已审查的 Native 覆盖值，不改变 Web 视觉。
- 当前基线不新增泛化的 `secondary` 操作 Token。`content-secondary` 仅表示辅助内容，
  `accent-blue` 仅表示网络信息色；次要操作使用组件自身的中性表面、边框等语义，
  不把网络蓝错误映射为通用次要操作色。

### 当前采用：Web 设计系统

- 保留 Primitive → Semantic → Component 三层 Token 架构。
- 保留现有浅色/深色 CSS 变量实现；在跨平台 Token 决策确认前不改变现有视觉值。
- Table、Pagination、Date/Time Picker、浏览器导航等 Web 专属模式留在 Web 层。
- 钱包业务流程留在示例/Feature 层，不提升为通用组件。

### 当前范围：Android 优先的原生移动端适配层

- 第一批原生客户端采用 React Native CLI `0.87.0`，以 Android 作为交付与验收优先级。
  具体工具链见[移动端原生基线](./mobile-native-baseline.md)。
- 第一批共享范围为 Theme/AppTheme、Typography、Button、Field、Screen、Header、ListRow、
  Modal 和 StateView。Web 包与现有视觉数值保持不变。
- 导航、系统栏、安全区、持久化和平台 Overlay 由 App 外壳负责；Kotlin/Swift 是必要时的
  平台集成出口，不是为每个组件再维护一套 UI 实现。

### 后续：其他移动端与桌面适配层

- 基于共享语义 Token 创建平台原生基础组件；不把 DOM 组件、CSS Modules 或浏览器 Portal 引入 React Native。
- 定义浅色、深色和系统模式的原生主题输出，包含主色、专用辅助语义色、状态栏和系统导航语义。
  当前基线不定义泛化的 secondary 操作角色。
- 补充平台无障碍契约：角色、状态、标签、提示、焦点顺序、播报、Dynamic Type、键盘/安全区与减弱动效。
- 第一批原生范围加入 Android TalkBack、Dynamic Type、键盘、安全区、系统栏和减弱动效验收。
  iOS 适配开始后再加入 VoiceOver 与真机验收。

## 评估问题与处理

| 问题 | 处理 | 优先级 |
| --- | --- | --- |
| 当前许可证限制商业使用 | 已将 CC BY-NC 替换为 MIT，并同步仓库文案 | 已完成 |
| 当前实现不是 React Native | 将 RN 定义为 Android 优先的适配层，不直接复用 Web 代码 | 基线已解决 |
| Web/Mobile Token 数值冲突 | 当前 Web 值已冻结为 1.0.0 基线；间距、圆角、字号和 elevation 的 Native 覆盖值已记录并生成 | 已解决（基线） |
| 主题契约缺少原生输出 | 在原生适配层生成类型化 `AppTheme`；图片取色继续暂缓 | Android 优先计划已记录 |
| 泛化 secondary 语义不明确 | 保持 `content-secondary` 与 `accent-blue` 的专用语义，不将任一者别名为通用 secondary 操作色 | 基线已收口 |
| 公共组件存在默认文案 | 已增加可注入 locale/label 契约，并保留现有默认值 | 已完成 |
| 缺少原生无障碍规则 | 组件角色、标签、提示和状态已记录，并由无宿主 RN 渲染测试覆盖；设备行为仍由 App 外壳负责 | 组件基线完成；设备阶段 P1 |
| README 测试/组件统计可能漂移 | 发布前用最新覆盖率报告重新生成徽章 | P1 |
| 第三方素材可能有独立许可 | 已建立清单；项目图片素材已确认可公开分发 | 已完成；素材变更时复核 |

## 迁移顺序

1. 按已确认的技术基线创建 Android 优先的 React Native 适配包，消费已审查的 Web/Mobile
   间距、圆角、字号和 elevation 适配值，不修改 Web 基线。
2. 从统一源生成平台产物；CSS 变量作为 Web 产物，类型化数值作为原生产物。
3. 实现共享原生基础组件（Text、Icon、Field、StatusBadge、InlineMessage、Toast、Skeleton、Progress、Sheet、SegmentedControl）。
4. 按功能切片逐步迁移；钱包专属组件在证明复用前保持 Feature 内聚。
5. 增加 Android 无障碍、Dynamic Type、安全区、键盘和系统主题验收门槛；iOS 适配开始后再增加
   对应门槛。

## 兼容规则

- 迁移期间不删除或静默重命名现有 Web Token。
- 新语义别名可以先增加，再逐步迁移组件消费者。
- 现有组件 props 和默认文案保持兼容；先增加 locale 注入，再在弃用窗口后考虑移除默认值。
- Token 决策、包元数据、文档、构建矩阵和视觉验收全部对齐前，不创建正式 Release。
