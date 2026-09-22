# ADR 0005：Lucide 运行时图标体系

## 状态

Accepted（已采纳）

## 背景

Fresnica UI 需要在钱包操作、导航和反馈场景中保持一致且易访问的界面图标语言。项目已在组件和 Demo 层统一采用
Lucide。与作为 peer dependency 的渲染包不同，图标实现需要随组件库交付，让消费者不必额外安装图标包或重建图标映射。

## 决策

`lucide-react` 是组件库唯一的直接运行时依赖。组件从该包按名称引入图标；库构建继续将 React、React DOM、
`react/jsx-runtime` 与 `classnames` 保持 external，同时打包实际使用的 Lucide 模块。图片图标仅限已批准的 Fresnica
品牌标志。

## 影响

- 所有组件和 Demo 使用统一的 Lucide 描边语言，并通过 `currentColor` 适配主题状态。
- 消费者只需引入组件，不必另行配置第二套图标系统。
- ADR 0001 的“零运行时依赖”作为 peer 渲染依赖的历史决策继续保留；其中“包没有直接运行时依赖”的表述由本 ADR
  取代。
- 后续新增图标必须来自 `lucide-react`，除非新的架构决策明确批准其他来源。
