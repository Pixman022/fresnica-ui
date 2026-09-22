# Feedback — 精确样式规范

Loading、Progress、Skeleton 与 BackTop 使用语义 Token 和 Lucide 图标表达系统状态。

## EmptyState

- 用于请求已完成但没有内容的场景，例如无结果或空集合；不要用于加载中或请求失败。
- 根节点是带标签的 `section`；`title` 默认是 `No data`，`description` 和 `action` 可选。
- 默认 Inbox 图标保持中性并标记为装饰内容（`aria-hidden`）；自定义图标不能成为唯一的信息来源。
- 支持 `small`、默认 `middle` 和 `large` 三种尺寸。action 插槽可放 Button、链接或其他符合平台习惯的恢复操作。
- 文案保持简短，并在有下一步时给出指引。钱包业务文案放在示例入口中维护。
- 设计系统 Demo 覆盖无搜索结果、创建入口、无操作和窄容器换行场景；可通过尺寸选择器查看 `small`、`middle`、`large`。两个页面保持独立，不能因为结构相似而混用语义。

## ErrorState

- 用于可恢复的失败或暂时不可用结果；不要用于空集合或加载中。
- 根节点提供 `role="alert"`；`title` 默认是 `Something went wrong`，`description` 说明失败原因或恢复路径。
- 默认 CircleAlert 图标使用失败语义并标记为装饰内容；真正含义由文字和操作传达。
- 支持 `small`、默认 `middle` 和 `large` 三种尺寸。action 插槽用于重试、返回或联系支持等操作。
- 不要把原始服务端错误作为唯一文案。文案应可行动，重试时保留用户已输入的数据。
- 设计系统 Demo 覆盖网络失败、会话恢复、无操作和窄容器场景；可通过尺寸选择器查看三种尺寸。保持 `role="alert"` 和 failure 语义，与 `EmptyState` 明确区分。

## Loading

- 行内状态容器最小高度 48px，内边距 16px，间距 8px。
- Lucide `LoaderCircle`：32px、stroke 2.25、主色、0.85s 线性旋转。
- 标签：14px/500，使用次级文字色。根节点提供 `role="status"` 与 `aria-live="polite"`。
- `active={false}` 时不渲染；reduced-motion 下减慢旋转。

## Progress

- 尺寸：small 12px、middle 20px、large 28px；Track 均使用全圆角。
- Track：`--Fresnica-surface-high`、1px 语义边框且无投影。
- Fill：主色到主色 hover 的对角条纹，周期 28.28px，1s 线性移动。
- 宽度过渡默认 0.6s；`duration={0}` 与 reduced-motion 会关闭过渡。
- 内部文字使用 `--Fresnica-on-primary-color`；进度低于 18% 时，信息移到 Track 上以保持可读性。
- 根节点提供 progressbar 数值属性和等价文本。

## Skeleton

- 基础表面使用 `--Fresnica-surface-high` 与 `--Fresnica-surface-highest`。
- 变体包括 text、circle、rect、paragraph；文字/行使用 8px 小圆角 Token，矩形使用 16px 基础圆角 Token。
- active 流光在透明渐变中混入少量主色，周期 1.6s。
- 段落行使用 12px 间距 Token，最后一行默认宽 60%。
- 占位内容对辅助技术隐藏。

## BackTop

- 固定按钮：44×44px、16px 基础圆角 Token、主色背景、白色前景、细描边且无投影。
- 使用 Lucide `ArrowUp`，22px，stroke 2.25。
- 桌面偏移：右 32px、下 48px；移动端：右 16px、下 24px。
- 超过配置滚动阈值后显示，支持 Enter/Space，并使用语义焦点环。
- 滚动动画默认 300ms，采用 ease-in-out 二次插值。
