# 导航层级规范

本文件定义 Fresnica 钱包示例的导航职责。它属于跨平台核心之上的产品示例规范，不会为组件库新增公开组件。

## 层级

| 层级 | 作用 | 当前示例 | 使用规则 |
| --- | --- | --- | --- |
| 一级目的地 | 在产品主要区域之间切换 | Home、Activity、Scan、Explore、Settings | 移动端钱包页面使用统一的五项 `BottomNavigation`。当前项使用主色图标与文字、透明背景，并设置 `aria-current="page"`。 |
| 二级流程 | 完成从一级目的地进入的一项任务 | Swap、Send/Receive | 使用顶部上下文栏，包含 44px 返回触控目标和居中页面标题。页面只保留一个主要任务，不再叠加第二套一级导航。 |
| 详情 / 工具页面 | 查看或操作某个对象或系统区域 | Transaction details、Asset details、Network & Nodes | 使用顶部上下文栏或抽屉/底部 Sheet 标题栏。右侧操作只能服务当前对象；详情浮层中不重复放置一级底部导航。 |
| 系统反馈 | 解释状态或请求确认 | Empty、Error、Confirm、Loading | 保持当前导航上下文，使用 `EmptyState`、`ErrorState`、`Modal` 或确认规范，不新增导航层。 |

## 顶部栏规则

- 标题描述当前页面或任务，不描述上一个目的地。
- 只有从其他页面进入，或以 Sheet 形式呈现时才显示返回操作。
- 返回操作触控目标不小于 44px，使用语义化 Lucide 图标并提供无障碍标签。
- 右侧操作必须属于当前页面（例如更多操作或关闭），不能重复底部导航目的地。
- Modal 和 Sheet 自己负责关闭操作；Sheet 内不再叠加第二个页面级返回按钮。
- 长标题和辅助信息允许换行，顶部栏不能因此产生横向滚动。

## 路由映射

- 一级目的地：`/fresnica-home`、`/fresnica-activity`、`/fresnica-scan`、`/fresnica-explore-dapps`、`/fresnica-settings`。
- 二级流程：`/fresnica-swap`、`/fresnica-transfer`。
- 详情 / 工具页面：`/fresnica-transaction-details`、`/fresnica-asset-details`、`/fresnica-network-nodes`。

钱包示例外壳负责移动端画布和滚动；设计系统 Demo 使用自己的 Web 侧栏与顶部栏，不继承钱包底部导航契约。

## 组件抽取边界

当前二级顶部栏只有行为相似，视觉和 API 尚未稳定统一：Swap 与 Transfer 使用居中的任务标题，Transaction details 还需要右侧操作，Asset details 与 Network & Nodes 则是 Sheet 形式。现阶段保留各路由内部实现。只有至少三个页面可以共享标题、左侧操作、右侧操作、安全区和无障碍 API，且无需路由特例时，才重新评估是否抽取 `NavigationHeader`。
