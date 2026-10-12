# 平台适配层契约

本契约用于将已批准的 Web Token 基线转换为平台产物，不复制 Web 实现。
它是边界文档，不是 React Native 或桌面运行时包。

## 源与产物

`design-system/tokens.json` 继续作为结构化源，`design-system/tokens.css` 继续作为 Web 产物。
机器可读的基线元数据位于 `design-system/platform-token-source.json`。Native 会锁定明确审核过的
Web 来源提交；共享 Token 发生变化时先在 Web 审核，再由 Native 主动更新来源锁、重新生成并验证
映射。普通 Web 提交不会自动推进 Native 的 Token 锁。

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

## 已交付原生适配范围

当前 Native 包已经交付 15 个基础组件：`Typography`、`Button`、`Field`、`Screen`、`Header`、
`ListRow`、`Modal`、`StateView`、`IconButton`、`Divider`、`StatusBadge`、`InlineMessage`、
`Skeleton`、`Progress`、`SegmentedControl`。新增共享组件只有在真实、稳定复用得到验证后才提升；
此前建议的 `Toast/Announcement`、`Sheet/ActionSheet` 等不再属于当前必交付范围。

Native 也已经提供 `FresnicaUiProvider`、主题/语言 hooks 和 `enUS`/`zhCN` 通用组件文案；宿主 App
仍负责选择和持久化。Web 继续复用既有 `FresnicaThemeProvider`；Web 全局 Locale 是独立的 WS03
实现，不建立第二套主题系统。

## 明确不做

- 基线阶段不向本 Web 仓库添加 React Native 依赖。
- 不把 DOM 组件宣称为原生组件。
- 不为解决未经原生产品确认的冲突而修改 Web 视觉 Token。
- Table、Pagination、Date/Time Picker 和浏览器导航继续作为 Web 模式，直到平台产品提出适配需求。

## 跨平台行为职责 — 2026-10-12

共享行为目标不要求两端使用相同 API。Web DOM 组件自己管理浏览器焦点和原生元素 ref；Web
`Modal` 已负责焦点进入、Tab 限制与关闭恢复。Native 通过平台 ref/生命周期配合处理焦点和
Android 专属行为。TextInputProps、Pressable ref、TalkBack、系统 Back 与系统栏接口继续只属于
Native。Native NU01–NU08 已完成；Web WS01–WS06 只同步可复用契约，不重开 Native 交付。
