# iOS 组件设计规格

状态：IOS06 草案。组件集合和平台职责已经明确；最终 iOS 字体数值与视觉验收仍依赖 IOS03
和 IOS05 的实际证据。

本文描述现有 React Native 组件包，不建立 SwiftUI/UIKit 组件 SDK、产品导航模型或钱包专用 UI
层。

## 共享规则

- 共享语义角色与组件状态含义保持不变。
- 首轮目标为 iPhone；外层安全区、导航、键盘避让和产品级系统呈现由宿主负责。
- 可交互控件沿用至少 44×44 pt 的命中目标基线。
- 文字继续支持系统缩放；Fresnica iOS 字体角色最终值由 IOS03 在 Simulator 评审后记录。
- 颜色继续引用现有语义主题角色；颜色与对比度修改保持暂缓。
- 真机 VoiceOver、真实键盘/autofill 和产品验收保持独立。
- Native Modal 继续保留现有 `fade` 行为。

## Typography

**用途：** 正文、辅助文字、操作文字、区块标题、页面标题和较大强调文字。

**结构：** React Native `Text`，使用六个公开 Fresnica typography role 之一。

**iOS 行为：** 使用系统字体并允许 Dynamic Type 增长；不直接复制 Web 字体栈或固定 CSS 行高。

**大字号：** 优先换行和纵向增长而不是裁切；最终角色数值等待 IOS03 定稿。

**无障碍：** 翻译后的可见文字可由平台读屏读取；拥有标题职责的组件（如 Header）负责 heading
语义。

## Button

**用途：** 主要、次要、轻量和危险操作。

**结构与尺寸：** Pressable 容器、可选图标和文字标签。保持现有最小命中目标，长文字或大字号时允许
控件纵向增长。

**状态：** 正常、按下、禁用、加载。加载状态继续为 disabled/busy，并以调用方动作标签作为无障碍
名称。

**大字号：** 必要时允许长标签换行/增高，不强制保持 Web 风格单行固定高度。

**无障碍：** button role、本地化标签、disabled/busy 状态；动作含义与提交流程由宿主负责。

## Field

**用途：** 普通文本、邮箱、数字/小数、安全输入和多行输入。

**结构：** 可见标签、原生 TextInput、可选 leading 内容及辅助/错误文字。

**状态：** default、focused、error、disabled；disabled 对透传原生属性保持最高优先级。

**iOS 输入配置：** 消费页面按真实内容用途选择 keyboard type、input mode、content type、
autocomplete、return key 和 secure entry。

**大字号：** 标签、输入值和辅助文字必须保持可读；当前辅助文字固定行高由 IOS03/IOS05 验证。

**无障碍：** 可见 label 默认作为输入框标签；调用方可以显式覆盖 label/hint。秘密值不得进入可见
辅助文字或 accessibility 字符串。

## Screen

**用途：** 可复用内容表面及可选滚动容器。

**结构：** 主题背景和可选包内 ScrollView。

**iOS 行为：** 外层 safe area、导航容器、system bar 与 keyboard avoidance 由消费 App 负责。

**大字号：** 内容超过可用高度时使用滚动而不是裁切。

**无障碍：** 保持内容顺序，不把无关子元素合并为一个控件。

## Header

**用途：** 可复用页面标题及可选 leading/trailing 操作。

**不负责：** UINavigationController/导航栈、路由转场或 iOS 返回手势。

**结构：** leading 区、居中标题、trailing 区；当前标题最多两行后截断。

**大字号：** 两行截断在更大字号下是否继续合适，由 IOS03/IOS05 结果决定。

**无障碍：** 可见标题暴露 heading 语义；返回/关闭/完成操作标签由调用方提供并匹配页面任务。

## ListRow

**用途：** 带标题/描述的列表内容，使用整行操作或独立尾部操作二选一。

**结构：** 可选 leading、标题/描述、可选 trailing 展示或控件。

**交互：** 不允许同时存在可点击整行和另一个独立可操作 trailing 控件。

**大字号：** 列表行允许纵向增长；长标题/描述在 IOS05 中验证。

**无障碍：** 整行操作只暴露一个 button；独立 trailing 操作保持独立控件。

## Modal

**用途：** 符合当前受控弹层契约的任务。

**不负责：** 自动替代 iOS Sheet 或全屏导航；在稳定共享需求出现前，这些呈现选择属于宿主。

**结构：** scrim、surface、标题、关闭控件和可滚动内容。

**状态与关闭路径：** `visible` 与 `onRequestClose` 由调用方控制；宿主/平台关闭路径应统一到同一
close callback。

**大字号：** 标题、内容和操作可达性由 IOS05 验证；优先滚动而不是裁切。

**无障碍：** 暴露 modal 语义；宿主可协调初始焦点与关闭后的焦点恢复。实际 VoiceOver 焦点仍属
真机检查。

## StateView

**用途：** empty、error、success 结果状态和可选操作。

**结构：** 标题、可选描述、可选操作。

**大字号：** 居中文字允许增长；当前 description 固定行高由 IOS03 评审。

**无障碍：** 状态意义必须存在于文字或等效标签中，不能只依赖颜色。

## IconButton

**用途：** 具有稳定语义的纯图标操作。

**结构与尺寸：** 44×44 命中目标，内部为调用方提供的图标内容。

**状态：** 沿用现有 normal/disabled 契约。

**无障碍：** 调用方提供本地化标签。图标可以是品牌资产、自定义 ReactNode 或宿主选择的 SF
Symbol；共享包不新增 SF Symbols bridge。

## Divider

**用途：** 相关内容区域间的视觉分隔。

**结构：** 主题 separator role 与 hairline 风格视觉。

**无障碍：** 装饰性分隔不能成为状态或层级的唯一信号。

**宿主职责：** 判断是否真正需要分隔，不把 Divider 当作导航或交互控件。

## StatusBadge

**用途：** 简短 positive、negative、warning 或 neutral 状态。

**结构：** pill 风格容器和可读标签。

**大字号：** 随文字增长，不用于承载较长说明。

**无障碍：** 状态意义包含文字，不能只使用颜色。

## InlineMessage

**用途：** 与相关内容相邻的 info、success、warning、error 反馈。

**结构：** 可选图标与消息文字。

**播报：** 组件作为播报所有者时使用 alert；App 自行控制播报时使用 passive。

**大字号：** 消息文字换行并纵向增长。

**无障碍：** 不同时由 App 和 alert 语义重复播报同一错误。

## Skeleton

**用途：** 最终内容暂未出现时的非交互加载占位。

**结构：** 主题占位表面和调用方提供的本地化 loading label。

**无障碍：** 暴露有意义的加载/忙碌上下文，不重复暴露每个装饰形状。

**动效：** 当前行为保持不变；观察 Reduce Motion 不等于新增全局 motion provider。

## Progress

**用途：** 0 到 1 的确定性进度。

**结构：** 视觉进度轨道/填充与无障碍 progress 语义。

**状态：** 输入值限制在支持范围内。

**无障碍：** 暴露 min/max/current 和调用方提供的本地化进度标签。

## SegmentedControl

**用途：** 少量互斥的视图/筛选选项。

**结构：** group 容器与等宽 pressable segment。

**状态：** 一个 selected 选项，并逐项暴露选择状态。

**大字号：** 长标签与辅助功能大字号在 IOS05 中验证；横向密度不可用时应调整布局，不通过嵌套
动作解决。

**无障碍：** 调用方提供 group label；每项暴露标签和 selected state。

## Preview 与证据对应

Native 中性 Preview 是以上组件状态的实现参考。IOS05 使用 S01–S06 Simulator 场景覆盖小/大
iPhone、Light/Dark、中英文、长文案、较大字号、键盘限制高度和 Modal 行为。

IOS06 最终完成仍需要：

- IOS03 最终字体映射及大字号决定；
- IOS04 已确认组件修复与使用规则；
- IOS05 runtime matrix 结果和长期保存截图；
- 代码示例与 package API 链接和最终 Native 实现一致。

这些依赖未关闭前，本文是可版本化的设计草案，不是视觉批准记录。
