# 表单控件 — Fresnica 规范

表单控件与 Stellar 钱包流程共用中性表面、字体、焦点样式和语义状态色。具体实现以组件源码为准。

## 通用规则

- 字体：`var(--Fresnica-font-family)`，即 Roboto、Noto Sans SC 与系统无衬线回退字体。
- 正文使用 `--Fresnica-text-color`；辅助内容使用 `--Fresnica-text-color-secondary` 或 `--Fresnica-text-color-muted`。
- 默认表面使用 `--Fresnica-surface`；低层级区域使用 `--Fresnica-surface-low`。
- 边框使用 `--Fresnica-border-color`；hover 使用 `--Fresnica-border-color-hover`。
- 焦点使用 2px `--Fresnica-focus-color` 描边或等价 Token 焦点环。
- 错误、警告、成功状态在 hover 与 focus 时必须保持各自语义色，不能回落到主绿色。
- 禁用控件使用禁用表面和文字 Token，并显示 `cursor: not-allowed`。
- 不使用纹理背景、夸张阴影或与主题无关的写死颜色。

## Input

Input 使用中性 Token 表面、标准控件高度、14px 基础文字和统一圆角。前缀、后缀和清除按钮继承所在状态的文字颜色。

```css
background: var(--Fresnica-surface);
color: var(--Fresnica-text-color);
border: 1px solid var(--Fresnica-border-color);
border-radius: var(--Fresnica-border-radius-base);

/* hover */
border-color: var(--Fresnica-border-color-hover);

/* focus */
border-color: var(--Fresnica-focus-color);
outline: 2px solid var(--Fresnica-focus-color);
outline-offset: 1px;
```

`status="error"` 的 hover 与 focus 使用 `--Fresnica-error-color-hover`，不能变为绿色；warning 同理使用警告色 Token。

## Select

Select 与 Input 共用尺寸和表面语言。触发器默认使用 `--Fresnica-surface`，hover 或展开时使用 `--Fresnica-surface-high`。下拉层使用 `--Fresnica-surface`、Token 边框、基础圆角且不使用投影，因此深浅主题都不会出现写死的白色浮层。

- 选项 hover 使用低透明度主色背景。
- 当前选项使用 `--Fresnica-primary-color` 背景与 `--Fresnica-on-primary-color` 文字，不显示前置或后置圆点。
- 展开箭头使用 Lucide 图标并继承 `currentColor`。
- Escape 与点击外部关闭弹层；键盘行为遵循 listbox 语义。
- `placement="bottom"` 会尽量让菜单保持在触发器下方，空间不足时向上展开，并根据视口剩余空间限制高度与宽度；适合窄容器或右对齐的预览控件。默认仍使用 `auto` 自动定位。

## Checkbox

Checkbox 默认使用紧凑 Token 边框；选中后使用主色填充，勾选图标为白色。
状态切换保持直接克制，不使用扩散、粒子、弹跳或延迟绘制勾选的动画。
未选中控件使用 `--Fresnica-surface`；禁用控件使用 `--Fresnica-surface-high`，深色模式下不能出现白色填充。
选中填充、描边和前景均使用运行时 Token，因此无需重新构建样式即可分别跟随浅色 `#00A875` 与深色 `#00CA8A`。

```css
/* checked */
background: var(--Fresnica-primary-color);
border-color: var(--Fresnica-primary-color);
color: var(--Fresnica-on-primary-color);
```

半选状态使用同一语义色板。不使用装饰性爆发动画。

## Radio

Radio 默认使用中性外圈；选中后外圈和圆点使用主色。Label 保持正常文字颜色，不能引入无关的棕色或黄色焦点色。
所有状态的圆环表面使用 `--Fresnica-surface`；禁用状态使用 `--Fresnica-surface-high`。深色模式下，未选中圆环使用更明亮的 muted 文字 Token，确保描边清晰可见。
选中圆环与圆点在运行时读取 `--Fresnica-primary-color`，因此会跟随当前浅色或深色主题。

```css
/* checked */
border-color: var(--Fresnica-primary-color);

/* inner dot */
background: var(--Fresnica-primary-color);
```

## Switch

Switch 使用原生 Button 和 `role="switch"`，支持受控/非受控状态、small/default 尺寸、禁用和 Loading。off 轨道使用 `--Fresnica-surface-high`，不使用黑色；深色模式下未选中的圆形滑块使用白色 `--Fresnica-inverse-color`，确保轮廓清楚。选中背景使用 `--Fresnica-primary-color`，位于该背景上的文字与图标使用 `--Fresnica-on-primary-color`。

## AddressField

AddressField 由钱包地址输入框和复制操作组成。它沿用 Input 的表面与字体规范、关闭拼写检查，并使用 Lucide `Check` 图标反馈复制成功。复制与粘贴按钮使用中性表面和次级文字 Token，不持续显示为品牌绿。复制按钮必须具有无障碍名称。

## AmountField

AmountField 是十进制金额输入框，支持资产符号、余额和 Max 操作。资产、余额和 Max/All 都属于辅助控件，使用中性表面和次级文字 Token；品牌绿留给流程中的提交或复核主操作。金额不能为负数。

## FeeSummary

FeeSummary 展示 Label/Value 行及可选总计。普通行使用辅助文字色，总计使用更强字重与轻量 Token 分隔线，并保持适合交易确认面板的紧凑尺寸。

## DatePicker

DatePicker 与 Select 使用一致的 16px 圆角、描边触发器和弹层语言。默认触发器高度为 48px，浮层通过边框而非投影表达层级。

- 触发器：标准控件高度、统一圆角、Token 表面和边框。
- 面板：`--Fresnica-surface`、1px Token 边框、16px 圆角且无投影。
- 日期 hover：低透明度主色背景。
- 选中日期：主色背景与 `--Fresnica-on-primary-color` 前景。
- 范围 hover、区间日期与起止端点和 Select 使用相同主色系；起止端点增加白色 Token 描边。
- 今天：使用主色描边或文字强调，不添加装饰表现。
- 范围端点和区间背景使用主色 Token；warning/error 保持语义状态。
- 导航与日历操作统一使用 Lucide 图标。

## TimePicker

TimePicker 与 DatePicker、Select 共用带描边且无投影的触发器和弹层规范。值使用 `HH:mm:ss` 字符串，不依赖日期库。

- 列表选项默认使用中性表面。
- hover 使用低透明度主色背景。
- 选中项使用中性灰背景与主绿色文字，并保证可读性。
- 确认操作遵循 Primary Button 规范，文字和图标均为白色。
- 禁用值使用禁用 Token，不能只依靠透明度区分。

## 无障碍

- 每个控件必须具有可见 Label、`aria-label` 或 `aria-labelledby`。
- 错误和帮助文字应通过 `aria-describedby` 与控件关联。
- 弹层提供正确的 combobox、listbox 或 dialog 语义。
- 所有控件支持键盘操作，并保留清晰的可见焦点。
- 动效遵守 `prefers-reduced-motion`。
