# 平台适配层契约

本契约用于将已批准的 Web Token 基线转换为平台产物，不复制 Web 实现。
它是边界文档，不是 React Native 或桌面运行时包。

## 源与产物

`design-system/tokens.json` 继续作为结构化源，`design-system/tokens.css` 继续作为 Web 产物。
机器可读的基线元数据位于 `design-system/platform-token-source.json`。

| 层级 | Web | 移动端 | 桌面端 |
| --- | --- | --- | --- |
| Primitive | CSS 别名和尺寸 | 类型化颜色、数值与字体指标 | 类型化值或宿主变量 |
| Semantic | CSS 自定义属性 | 基于语义角色生成主题对象 | 主题对象或宿主主题桥接 |
| Component | Less 模块消费语义 Token | 原生组件消费相同语义角色 | 宿主组件消费相同语义角色 |
| 导航 | 浏览器路由/顶部或侧边导航 | 按需使用适配安全区的底部导航 | 侧边/顶部导航与键盘焦点 |
| 聚焦任务 | Dialog、Drawer 或 Popover | Sheet 或原生 Dialog | Dialog、侧面板或 Popover |

## 适配规则

1. 适配层消费语义角色，不消费组件 CSS 选择器。
2. 适配层可以改变布局、输入方式、焦点行为和系统集成，但不能静默改变语义 Token 的含义。
3. 平台新增值使用平台命名空间，不覆盖共享 Token 名称。
4. 引入原生适配期间，现有 Web props 和默认视觉值保持兼容。
5. 钱包业务流程在至少两个功能证明稳定复用前，保持在 Feature 内部。

## 原生适配层最小范围

第一批原生适配应覆盖 `Text/Typography`、`Icon`、`IconButton`、`Field`、`StatusBadge`、
`InlineMessage`、`Toast/Announcement`、`Skeleton`、`Progress`、`Sheet/ActionSheet` 和
`SegmentedControl`，同时定义角色、标签、提示、状态播报、Dynamic Type、安全区、键盘避让、
减弱动效和系统主题同步行为。

## 明确不做

- 基线阶段不向本 Web 仓库添加 React Native 依赖。
- 不把 DOM 组件宣称为原生组件。
- 不为解决未经原生产品确认的冲突而修改 Web 视觉 Token。
- Table、Pagination、Date/Time Picker 和浏览器导航继续作为 Web 模式，直到平台产品提出适配需求。
