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
