# iOS 设计规范

本文定义 Fresnica 设计系统的 iOS 平台层。它不替代共享语义规则，也不把 Web CSS 数值直接变成
iOS 设计要求。

## 规则优先级

按以下顺序读取：

1. 共享语义含义及与产品无关的设计原则。
2. 本文明确记录的 iOS 平台适配。
3. Native 组件契约与 Preview 示例中的实现细节。
4. 消费应用负责的导航、产品流程、安全区组合和系统服务规则。

当 Web 专用规则与明确的 iOS 规则冲突时，iPhone 上以 iOS 规则为准；但 Token 或组件状态的
语义用途不得被静默改变。

## 范围

- React Native 组件包，首轮支持 iPhone。
- iOS 15.1 作为 RN 0.87 模板继承的计划最低包目标；实际运行覆盖单独记录。
- iPad、真机验收、VoiceOver 实际执行和产品发布认证不作为首轮完成条件。
- 颜色与对比度继续保持既有暂缓状态。
- Native Modal 继续保留现有 `fade` 行为。

## 字体

iOS 默认评审起点使用系统字体，不把 Web 的 Roboto / Noto Sans 字体栈作为 iOS 强制要求。

IOS03 本轮保留下列包内角色的现有映射：

- `body`
- `supporting`
- `action`
- `sectionTitle`
- `screenTitle`
- `display`

已评审 Native 数值保持 body 14、supporting 13、action 15、sectionTitle 18、screenTitle 20、
display 48。由于 Simulator 证据支持针对布局调整，而不是整体放大基础字号，因此没有采用更大的
iOS 专用候选映射。

文字必须兼容 Dynamic Type。长标签和较大文字需要更多空间时，可以调整布局，不应为了保持
Web 固定行高而强行裁切。Bold Text 和辅助功能大字号应按平台真实行为验证，不能只依赖固定倍数
模拟。

## 布局与触控

- 默认交互目标以至少 44×44 pt 为基线。
- 较大文字需要空间时，优先保证内容层级和可读性，而不是保持紧凑密度。
- 除非组件契约明确拥有内部 inset，否则最外层安全区和键盘避让由屏幕宿主负责。
- 不直接把 Web 像素宽度当作设备断点；IOS05 使用实际 iPhone 尺寸和 Simulator 场景记录。

## 导航与呈现

组件包不创建或管理应用导航栈。

- `Header` 是可复用的视觉/操作组件，不等同于原生导航控制器。
- 返回、关闭、完成操作的语义必须与消费页面任务一致。
- 适合现有契约的任务继续使用现有 `Modal`。
- 需要 Sheet 时，先由宿主使用合适的平台呈现方式组合；只有稳定复用成立后才评估新增共享 Sheet。
- 原生返回手势、路由转场和全屏产品任务仍由宿主负责。

## 图标

组件图标插槽继续使用 `ReactNode`。

- 已批准品牌资产保持原身份。
- 消费 iOS 宿主可以在合适场景使用 SF Symbols。
- 在出现明确共享需求前，组件包不新增 SF Symbols 原生桥接及其 API。
- Web 的 Lucide 限定不要求 Native 使用相同字形来源或新增对应桥接。

## 系统偏好

分别记录以下行为：

- Light / Dark
- Dynamic Type / 较大文字
- Bold Text
- Reduce Motion
- 仅在实际使用系统材质时记录 Reduce Transparency

Increase Contrast 引起的配色变化继续归入暂缓的颜色/对比度事项。当前 Native Modal 保留
`fade`；观察 Reduce Motion 的结果不代表组件已修改为跟随该设置。

## 组件状态与无障碍契约

disabled、loading、error、selected、progress 等共享状态保持原语义。Native accessibility
role、label、state 属于组件契约。

实际 VoiceOver 朗读、手势及真机焦点表现继续属于独立设备验收。Simulator 与 Jest 结果不能描述
为真机 VoiceOver 已验收。

## 验证层级

以下结论必须分别记录：

1. **包契约通过**：TypeScript/Jest/Token/包检查通过。
2. **iOS 构建通过**：packed 包可安装且生成宿主可编译。
3. **iOS Simulator 运行通过**：宿主已启动并执行记录的场景。
4. **视觉评审通过**：实际审核人对记录画面/范围给出批准。
5. **真机验收通过**：仅在独立实际执行后成立；当前暂缓。

较低层级不能自动推出较高层级。

## 与现有规则的关系

当前 Web `design-rules.md` 对 Web 继续有效。语义状态含义、克制动效、本地化职责及与产品无关的
组件行为等共享原则继续适用。Web 专用字体栈、CSS 焦点环、hover 行为和像素数值，不会自动成为
iOS 规则，除非本文明确再次定义。

## 组件规格

版本化的 [iOS 组件设计规格](ios-component-specs.md) 将现有 15 个 Native 组件对应到 iPhone
用途、状态、无障碍和宿主职责。IOS03 字体与 IOS05 Simulator 证据已经完成当前设计系统范围的
定稿；真机、VoiceOver、真实键盘/autofill 和颜色/对比度验收继续保持独立。
