# Fresnica UI TODO

- [x] 确认四种语义辅助色：科技协议紫、网络信息蓝、Swap/流动性橙、待处理警示黄；对应 Light/Dark 值已写入 Token 与预览。
- [x] 完成第一批 Fresnica 钱包业务组件：BalanceCard、AssetRow、TransactionRow。
- [x] 完成第二批 Fresnica 钱包业务组件：AssetIcon、NetworkBadge、WalletSwitcher、QuickAction、TransactionStatus、AddressField、AmountField、FeeSummary、SwapRoute、BottomNavigation。
- [x] 完成 React Swap 业务页面 Demo：资产选择、金额输入、方向切换、路由比较、手续费摘要与确认状态。
- [x] 完成 React Transfer 业务页面 Demo：Send / Receive、地址、金额、费用、网络状态与复制反馈。
- [x] 完成 React Activity 与 Settings 业务页面 Demo：交易筛选/详情、网络、主题和动效偏好。
- [x] 完成 Fresnica Transaction Details、Asset Details、Network & Nodes 页面 Demo，并抽取 TransactionDetails 组件。
- [x] 接入 Fresnica/Xaman Logo、应用图标和 Tab 图标资源（暂不替换正式品牌字体）。
- [x] 明确当前仅支持 Stellar，并补充移动端 App 字体基线规范。
- [x] 完成 Fresnica Explore dApps 页面 Demo（Stellar 专属分类与推荐列表）。
- [x] 钱包首页按 Fresnica 原型重构：Logo、网络胶囊、钱包卡片、圆形操作、资产工具栏和五项底部导航。
- [x] 为 TransactionDetails 增加组件级测试（状态/字段/复制回调）。
- [x] 接入原方案五项底部导航结构，全部导航项统一使用 Lucide 图标，Scan 作为正式导航项。
- [x] 将包名与安装示例切换为 `fresnica-ui`。
- [x] 从 Demo 菜单与首页组件目录中移除旧主题专属入口；Icon 作为 Lucide 图标规范保留，Loading 作为通用反馈组件保留。
- [x] 引入 `lucide-react` 图标层，首页、Explore dApps、Scan 与底部导航统一使用 Lucide 图标。
- [x] 新增正式 Scan 页面 Demo，提供 Stellar QR 扫描、相机和粘贴入口。
- [x] 首页和 Scan / Explore 页面统一使用 Lucide 图标体系。
- [x] Title 默认切换为 Fresnica 语义 heading，Demo 使用纯文字标题与统一 Token。
- [x] 建立 Demo 首页及钱包业务页面的视觉回归检查清单，并完成逐页人工视觉验收。
- [x] 评估并替换剩余 Fresnica 专属图标、背景和装饰资源。

## 当前阶段

- [x] 抽取 `WalletDemoShell`，统一钱包示例的 390×844 画布、主题背景、内部滚动和移动端布局上下文。
- [x] 按已提供的 Fresnica 原稿重组钱包示例的信息层级，不新增业务字段，保持 Stellar 网络范围。
- [x] 对照亮色/暗色原稿逐页完成人工视觉验收，并归档视觉验收结果。
- [x] 逐项复核 Token 审计中的 60 项原始排版值与 12 项几何值，并在中英文基线中完成例外分类与保留条件记录。
- [x] 为资产选中态补充回归测试；登记并按批准删除未使用的空旧模块目录。
- [x] 将当前工作区改动按 Token、组件、钱包 Demo、文档和审计工具整理为 Git 提交（已完成本地提交，不包含网络同步）。

## 组件库调整阶段

- [x] 完成现有钱包组件 API 与状态扩展：QuickAction、AmountField、AddressField、AssetRow、TransactionRow、WalletSwitcher、NetworkBadge。
- [x] 完成现有通用组件交互扩展：Icon、Tabs、BottomNavigation、Drawer、Modal、Notification，并补充对应 Demo 与测试。
- [x] 完成组件级类型检查、518 项单元测试、lint、生产构建与格式检查。
- [x] 将钱包产品示例拆分到独立的 `examples.html`，保留 `index.html` 作为设计系统与组件规范入口。
- [x] 记录并评估后续新增组件（如 WalletScreen、PageHeader）；结论见 `docs/design-system/composition-evaluation.md`，当前不实现，避免扩大组件库范围。
- [x] 完成自定义主题色能力：HEX 输入、浅色/深色自动生成、本地持久化、多标签页同步和金融语义色隔离。
- [x] 完成自定义主题的人工视觉验收：极端颜色、入口位置、恢复默认和多标签页同步。

## 后续规划（讨论记录）

以下事项根据 Apple Human Interface Guidelines 适配评估记录，当前仅登记，不代表已经开始实施。

### 当前版本基线

当前 `package.json` 与 `package-lock.json` 均为 `1.0.0`。由于 `1.8.0` 与 `2.0.0` 属于历史遗留版本线，现有设计 Token、组件库、主题能力、设计系统预览和钱包示例统一按 `1.0.0` 作为全新项目的当前版本基线；后续版本按 SemVer 管理，暂不执行发布或网络同步。

### P1

- [x] 建立并精简移动端宽度验收规范：将 390px 与 393px 合并为 390-393px 常见大屏手机档位，以 393px 作为主要视觉检查、390px 作为兼容性检查；验收矩阵覆盖 320px、360px、390-393px、430px、768px 和桌面宽度，并纳入 200% 文字放大、长地址、金额、弹窗、表单和底部导航检查。
- [x] 执行响应式与大字号人工验收：按上述矩阵确认长地址、金额、弹窗、表单和底部导航不发生横向溢出或裁切；200% Layout 页面已完成修正并通过验收，其余页面沿用同一收缩、换行和局部滚动契约。
- [x] 统一钱包页面导航层级规范：明确页面标题、返回按钮、右侧操作、详情页进入路径和底部 Tab 的职责边界；当前顶部栏差异仍保留路由内实现，暂不抽取 `NavigationHeader`，规范见 `docs/design-system/navigation-hierarchy.md`。
- [x] 重组设计系统信息架构：拆分“跨平台核心”和“平台适配层”，并将移动端、Web、桌面客户端的布局与交互规则分别归档；Apple HIG、Material Design 和 Web 可访问性规范仅作为参考来源。
- [x] 统一跨平台术语：使用“移动端”“移动端视口”“移动端底部导航”等描述，不以 iOS 作为设计系统默认平台名称。

### P2

- [x] 更新预览与验收入口：保留 390×844 钱包预览作为常见大屏手机示例，补充 320、360、390-393、430、768 和桌面宽度的响应式验收说明；不在钱包示例页面内加入设备切换器。
- [x] 将钱包业务信息架构排除在设计系统核心规范之外：钱包示例继续作为独立产品示例维护，设计系统只保留通用组件、跨平台布局、状态和可访问性规则。
- [x] 设计并实现 `EmptyState`：提供通用无内容状态、说明、尺寸和下一步操作，并补充设计系统 Demo 与中英文文档；钱包业务文案留在示例入口。
- [x] 设计并实现 `ErrorState`：提供通用错误说明、尺寸和重试/返回操作，并补充设计系统 Demo 与中英文文档；具体业务错误留在示例入口。
- [x] 基于现有 `Modal` 建立 `ConfirmDialog` 使用规范：覆盖普通确认、危险操作、加载、防重复提交、焦点恢复和中英文文案；现有 API 已足够，不新增包装组件。

### 暂缓（不计入当前待办）

- 暂不接入相机、系统权限、真实扫码或其他原生硬件能力。
- 暂不开展 iPhone 真机、VoiceOver、Dynamic Type 原生专项验收。
- 暂不引入 SwiftUI/UIKit、SF Symbols、原生手势或触感反馈实现。

## 评估后的公开仓库与跨平台路线

- [x] 将许可证从 CC BY-NC 4.0 调整为 MIT，允许商业使用，并同步 package、锁文件、文档、Demo 和可安装 Skill 文案。
- [x] 将工具链最低 Node 版本与当前 Vite/jsdom 依赖对齐为 `>=20.19.0`。
- [x] 建立跨平台适配路线文档，明确当前仓库保留 Web 设计系统，并通过 Android 优先的 React Native 适配层接入移动端。
- [x] 冻结当前 Web Token 作为 1.0.0 跨平台基线；原生冲突值需另行记录，不改变 Web 视觉。
- [x] 建立平台无关 Token 源元数据和 Web/移动端/桌面端适配契约；Native 数值与 Light/Dark 颜色产物已由独立适配源生成。
- [x] 收口跨平台 secondary 语义：`content-secondary` 仅用于辅助内容，`accent-blue` 仅用于网络信息；不新增泛化 secondary 操作 Token。
- [x] 为公共 Web 组件补充可注入的 locale/label 契约，保持默认文案和 API 兼容；原生端沿用同一注入原则，具体实现见移动端基线。
- [ ] 在原生客户端进入范围后，补充 TalkBack/VoiceOver、Dynamic Type、安全区、键盘与系统主题验收。
- [x] 发布前重新生成测试/组件徽章，并确认 npm 发布状态与 README 安装说明一致（当前暂未发布 npm）。
- [x] 核对品牌图片来源；Logo、App 图标、Tabbar 图标和 Banner 均为原创项目素材，可公开分发。
- [x] 完成当前素材与第三方依赖许可清单；后续新增外部素材或依赖时，按 `docs/design-system/asset-provenance.md` 与 `THIRD_PARTY_NOTICES.md` 追加登记。

### 原生移动端范围（Android 优先）

- [x] 确认 React Native CLI 0.87.0、React 19.2.3、TypeScript 6.0.3、Node >=22.13.0、Hermes 与 New Architecture 基线；Android minSdk 26 / targetSdk 36 / compileSdk 37。
- [x] 确认第一阶段只实现 Theme/AppTheme、Typography、Button、Field、Screen、Header、ListRow、Modal、StateView 等共享基础组件，不迁移全部 Web 组件。
- [x] 确认 React Native 不直接复用 DOM/CSS/Less/Web Portal；导航、安全区、系统栏和平台 Overlay 由 App 外壳负责。
- [x] 确认 Light/Dark/System 主题、状态栏/导航栏随表面色自动推导图标明暗，不使用 Android 动态强调色；图片取色主题暂缓待确认。
- [x] 确认第一阶段只支持 English 与简体中文；翻译由 App 的 LocalizationProvider 注入，日期/时间/数字遵循系统区域。
- [x] 确认原生图标先使用 ReactNode API；`lucide-react-native` / `react-native-svg` 需单独评审后再引入。
- [x] 在当前仓库建立可迁出的 `fresnica-ui-native` 原生包脚手架、`AppTheme` 类型和 Token 源校验入口；正式独立仓库建立后迁出并生成 lockfile。
- [x] 明确原生 `AppTheme` 与共享语义 Token 的角色映射，并修正 System 主题解析为由 App 外壳传入系统外观结果；原生仓库已建立，spacing、radii、typography 与 Light/Dark 颜色均由共享 Token 与平台适配源生成。
- [x] 在独立原生仓库实现第一批无业务状态的 Button、Field、StateView 基础组件，并通过 TypeScript/Prettier 校验；Android 工程壳与平台验收仍待后续阶段。
- [x] 在独立原生仓库实现 Screen、Header、ListRow、Modal 基础组件，并通过 TypeScript/Prettier 校验；导航、安全区与平台 Overlay 仍由 App 外壳负责。
- [x] 为原生基础组件补充 API/无障碍契约与首轮测试矩阵文档；真实 TalkBack、键盘、安全区和 Dynamic Type 验收仍需 Android App 壳。
- [x] 明确 Android App 壳的依赖边界、主题/系统栏解析和实施顺序；不在组件包内提前引入导航、安全区或平台模块。
- [x] 补充原生组件库集成指南，明确最终 App 负责业务路由、状态、持久化、权限和本地化注入；组件库不创建 App 工程。
- [x] 完成第二批原生通用组件：Typography、IconButton、Divider、StatusBadge、InlineMessage、Skeleton、Progress、SegmentedControl；已使用 Jest + React Native Testing Library 补充组件级交互和无障碍语义渲染测试。
- [x] 建立原生 Token 生成入口：`npm run generate:tokens` 从 Web `design-system/tokens.json` 与平台适配源生成可提交的 `src/generated-token-contract.ts`；Native Light/Dark 颜色值已纳入生成链路，主题偏好仍由各平台独立管理。
- [x] 增加原生组件契约检查：`npm test` 覆盖核心无障碍属性、状态契约和 Token 使用；`npm run test:render` 覆盖组件级渲染和交互语义。
- [x] 已准备 Jest/React Native Testing Library 测试配置和首批组件级渲染用例；`npm run test:render` 已通过并覆盖 Button、Field、Modal、SegmentedControl、Progress、Header、ListRow、IconButton、InlineMessage、StatusBadge、Skeleton 和 Typography。真实 Android 宿主与设备行为仍需最终 App 验收。
- [x] 在项目根目录创建独立本地 `fresnica-ui-native` Git 仓库并迁出原生脚手架；远程 Git 地址和网络同步仍待用户单独决定。
- [x] 实现 Android 优先的共享基础组件与组件级测试；TalkBack、Dynamic Type、键盘、安全区、系统栏和减弱动效验收属于最终 App 壳与设备阶段，尚未在组件库中宣称完成。
- [x] 确定 Web/Mobile 间距、圆角、字号和 elevation 的基线策略：Web 1.0.0 数值保持不变，Native 覆盖值记录在 `design-system/platform-token-source.json` 并生成到原生包；后续仅在产品宿主提供新证据时复审。
