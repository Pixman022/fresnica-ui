# 移动端原生基线

本文档是将原生移动客户端纳入 Fresnica 设计系统范围后的实施基线。第一阶段优先交付
Android。React Native 用于共享 UI 实现；无法安全地用 TypeScript 表达的 App 外壳和平台
集成，可分别使用 Kotlin 与 Swift。

版本和平台数值来自已确认的项目文档《技术栈基线.md》。仓库内这份文档是可审查的实施依据；
如果外部文档变更，需要同时更新本文档和机器可读元数据。

## 交付范围

| 范围 | 第一阶段 | 后续阶段 |
| --- | --- | --- |
| 平台 | Android 实现与验收 | iOS 实现与真机验收 |
| 共享 UI | Theme、Typography、Button、Field、Screen、Header、ListRow、Modal、StateView | 在复用得到验证后补充其他组件 |
| 原生代码 | App 外壳、系统栏、生命周期和无法避免的平台桥接 | 按具体能力单独审批 |
| 产品 UI | 使用共享基础组件在 Feature 内组合 | 至少两个 Feature 稳定复用后再提升为共享组件 |

Web 包继续独立维护。React Native 代码不得导入 DOM 组件、CSS、Less、Web Portal 或浏览器
存储 API。

## 工具链基线

- 使用 React Native CLI，不使用 Expo。
- React Native `0.87.0`、React `19.2.3`、TypeScript `6.0.3`。
- Node.js `>=22.13.0`、npm，并提交 `package-lock.json`。
- 启用 Hermes 和 React Native New Architecture。
- Android：minSdk 26、targetSdk 36、compileSdk 37、Kotlin 2.2.0、NDK
  27.1.12297006。
- iOS 后续阶段：最低 iOS 15.1，使用 CocoaPods，同时支持 Simulator 和真实 iPhone。

原生包统一使用 React Native `StyleSheet`、组件同目录 `styles.ts`、函数组件和 Hooks。
React 与 React Native 作为 peerDependencies。UI 组件优先使用 TypeScript/React Native 实现，
不得静默增加原生模块。

## 架构边界

组件包不得创建 `NavigationContainer`、决定产品路由、发起网络请求、持有钱包/账户/交易状态，
也不得依赖 Realm、Stellar SDK、Fresnica Native SDK、产品 Feature、全局可变 service 或 store。

App 外壳负责导航、安全区组合、StatusBar、系统导航栏、持久化和平台 Overlay。组件只通过
props 和 callback 工作。已批准的导航基线是 React Navigation 7 的 native stack 与 bottom
tabs、`react-native-safe-area-context`、`react-native-screens` 和 NetInfo。

## 主题与 Token 策略

- 保持 Primitive → Semantic → Component 三层结构。
- 各平台共享语义名称和含义。平台可以通过明确的覆盖值使用不同数值，但必须记录理由并通过
  无障碍检查；不得静默改变该语义角色。
- Web 1.0.0 数值继续冻结。原生端单独生成类型化颜色、尺寸和字体指标，组成 `AppTheme`。
- 原生主题支持 Light、Dark 和 System。用户只选择一个品牌主题色，浅色与深色角色一起生成。
- 不使用 Android 系统动态强调色，保证 Fresnica 品牌与语义角色在支持设备上保持一致。
- 图片取色主题等待单独产品决策，第一阶段不实现。
- 金融反馈色与用户选择的品牌主题色保持隔离。

系统状态栏和导航栏跟随当前页面表面色，并自动推导清晰可见的图标明暗。默认不直接使用品牌
主色填充系统栏。

## 多语言与区域行为

第一阶段支持 English 和简体中文。组件通过可注入的 props 暴露稳定 enum、label、hint、
error 与无障碍文案，由 App 现有 LocalizationProvider 提供实际翻译。组件不建立全局语言
Provider，也不内置钱包业务术语。

日期、时间、数字分组与 12/24 小时制跟随系统语言和区域。保存的时间戳和领域值保持与区域
无关。

## 图标与动效

原生图标依赖批准前，组件 API 接收 `ReactNode` 图标。如果采用 `lucide-react-native` 和
`react-native-svg`，必须先完成依赖评审并登记到第三方许可说明。Web 端现有的
`lucide-react` 不得导入原生代码。

基础动效使用 React Native `Animated` 并尊重减弱动效设置。Reanimated 和 Gesture Handler
需要单独决策，组件不得隐式引入。

## 无障碍与验收门槛

每个原生交互组件都要按需定义 role、label、hint、state、disabled、selected、checked 和
busy 行为；保持合理焦点顺序，支持 `onAccessibilityTap`、Dynamic Type、长翻译文案和至少
44×44 的触控区域。状态不能只靠颜色表达。

第一阶段验收门槛：

1. TypeScript、ESLint、Prettier 和 Jest 通过。
2. Light、Dark、System 主题测试通过，组件内没有裸颜色或重复设计常量。
3. disabled、loading、error、pressed 状态具备组件测试。
4. accessibility role/state/label 测试通过；异步失败只能使用一条主动播报路径。
5. Android 渲染、TalkBack、键盘、安全区、系统栏、减弱动效和 Dynamic Type 完成人工验收。
6. 在 320、360、390–393、430 逻辑像素宽度下完成布局检查。

iOS VoiceOver 与真机验收属于后续交付门槛，第一阶段不宣称已经完成。
