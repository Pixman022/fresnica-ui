# Fresnica 设计 Token

规范实现位于 `src/styles/variables.less` 与 `src/styles/themes/default.less`。产品代码应使用 CSS 自定义属性，不重复硬编码原始值。

## 品牌与语义色

| 角色 | 浅色 | 深色 | 浅色 hover | 深色 hover |
| --- | --- | --- | --- | --- |
| 主色 | `#00A875` | `#00CA8A` | `#00CA8A` | `#32DFA4` |
| 成功（已完成状态） | `#00CA8A` | `#00CA8A` | `#19BD8A` | `#19BD8A` |
| 失败（交易 / 请求） | `#C73945` | `#C73945` | `#DD5662` | `#DD5662` |
| 警告 | `#9A6700` | `#F59E0B` | `#B47B00` | `#F7C35F` |
| 协议紫 | `#6956C8` | `#B8A9FF` | `#7B6BD6` | `#C9BEFF` |
| 网络蓝 | `#356AE6` | `#8EAEFF` | `#2858C9` | `#A9C1FF` |
| 流动性橙 | `#C96A16` | `#FFB86B` | `#AA5510` | `#FFCA8F` |
| 待处理黄 | `#A87500` | `#F6C65B` | `#8B6200` | `#FFD982` |
| 上涨（资产变化） | `#0A8F68` | `#32DFA4` | `#0F9F72` | `#5AE8BA` |
| 下跌（资产变化） | `#B42318` | `#FF7A86` | `#D92D20` | `#FF9AA3` |
| 高风险 | `#7A271A` | `#FF9B85` | `#9E2F20` | `#FFB5A3` |

主色 active 在浅色模式为 `#008F65`，深色模式为 `#00A875`。所有主色实心控件使用 `--Fresnica-on-primary-color: #FFFFFF`。主色属于强调 Token，不是普通图标或信息的默认颜色；普通图标、元数据、辅助操作和预计数值使用中性表面/文字色阶。

Inverse 操作在浅色模式使用 `#111214` 配白字，深色模式使用白色配 `#111214` 文字。仅用于 Swap 等少数核心操作。

完成状态使用 `--Fresnica-success-*`；交易或请求失败使用 `--Fresnica-failure-*`；输入校验错误继续使用 `--Fresnica-error-*`。金融方向使用独立的 `--Fresnica-gain-*` 与 `--Fresnica-loss-*` Token；警告使用 `--Fresnica-warning-*`，高风险提示使用 `--Fresnica-risk-high-*`。即使两个值视觉接近，这些角色也不能合并。

### 语义容器

紧凑状态标签使用背景色与明确的 `on-*-container` 前景色搭配。未经对比度检查，不得直接在对应浅色背景上使用原始强调色。

| 角色 | 浅色背景 / 前景 | 深色背景 / 前景 |
| --- | --- | --- |
| 成功 | `#D4F7E9` / `#005235` | `#12372B` / `#A9F5D0` |
| 失败 | `#FCEBED` / `#871D29` | `#44262B` / `#FFC0C6` |
| 上涨 | `#E0F7EF` / `#075C43` | `#123D30` / `#B2F5DC` |
| 下跌 | `#FDE8E7` / `#8F1D15` | `#4A252B` / `#FFD0D4` |
| 警告 | `#FFF3D6` / `#684700` | `#463817` / `#FFE3A1` |
| 高风险 | `#FBE9E7` / `#5C1D14` | `#4A2923` / `#FFD2C7` |

## 中性色与表面

| Token | 浅色 | 深色 |
| --- | --- | --- |
| `--Fresnica-bg-color` | `#F9F9FB` | `#222226` |
| `--Fresnica-bg-color-secondary` | `#F3F3F5` | `#1A1A1E` |
| `--Fresnica-surface-lowest` | `#FFFFFF` | `#0E0E10` |
| `--Fresnica-surface` | `#FFFFFF` | `#222226` |
| `--Fresnica-surface-high` | `#EDEEF0` | `#2A2A30` |
| `--Fresnica-surface-highest` | `#E8E8EA` | `#34343C` |
| `--Fresnica-text-color` | `#1A1C1D` | `#F5F5F7` |
| `--Fresnica-text-color-secondary` | `#3F4942` | `#A0A0A5` |
| `--Fresnica-border-color` | `#E3E3E5` | `#2E2E34` |

`--Fresnica-surface-lowest` 是为应用外壳或全屏背景保留的公开画布 Token，当前没有组件库消费者是有意为之。组件应根据层级使用 `--Fresnica-surface`、`--Fresnica-surface-low`、`--Fresnica-surface-high` 或 `--Fresnica-surface-highest`，不能把 `surface-lowest` 当作通用白色/黑色替代值。

浮层遮罩在浅色模式为 `rgba(0,0,0,.45)`，深色模式为 `rgba(0,0,0,.72)`。需要明确展示不同透明度时，使用 `--Fresnica-mask-bg-subtle` 或 `--Fresnica-mask-bg-strong`；组件不得重复写原始遮罩值。

## 代码展示

代码展示使用独立的非金融语义配色。`--Fresnica-code-bg`、`--Fresnica-code-border`、`--Fresnica-code-text` 与其他 `--Fresnica-code-*` 语法角色在两种应用主题中保持已确认的深色编辑器效果。代码块字体使用 `--Fresnica-font-family-mono`；这些角色不得代替品牌色、状态色或金融涨跌色。

## 字体

```css
font-family: Roboto, 'Noto Sans SC', -apple-system, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

基础字号为 12px、14px 与 16px。角色型字号包括：Caption 11px、辅助文字 13px、操作文字 15px、区块标题 18px、页面标题 20px、大标题 28px、金额 32px、展示金额 48px。支持的字重通过 `--Fresnica-font-weight-*` 提供：Regular 400、Medium 500、Semibold 600、Bold 700。产品页面采用 `design-rules.md` 的移动端层级；余额与手续费使用等宽数字。

## 几何与间距

- 间距：4、8、12、16、24px。
- 圆角：`--Fresnica-border-radius-sm`（8px）、`--Fresnica-border-radius-control`（12px）、`--Fresnica-border-radius-base`（16px）、`--Fresnica-border-radius-lg`（24px）；紧凑胶囊控件使用 `--Fresnica-border-radius-pill`（9999px）。圆形可以作为组件级形状例外使用 50%。
- 控件高度：32px（`sm`）、36px（`compact`）、48px（`base`）、52px（`emphasis`）和 56px（`lg`）。
- 默认边框：1px。

协议紫语义使用更明确的 `--Fresnica-accent-purple-*`。原 `--Fresnica-secondary-*` 兼容别名已在 2.0.0 清理中删除。同样，`text-color-secondary` 表示辅助文字，`text-color-muted` 在深色模式下会更弱，两者不能随意互换。

## 阴影与动效

- `--Fresnica-shadow-base` 是正式支持的“明确无投影”契约，在两个主题中均为 `none`。原 `--Fresnica-shadow-sm` 与 `--Fresnica-shadow-lg` 兼容别名已在 2.0.0 清理中删除。层级通过表面对比与 1px 描边表达。
- 时长：0.15s、0.25s、0.35s。
- 缓动：`cubic-bezier(0.4, 0, 0.2, 1)`。
- 焦点环使用 `--Fresnica-focus-color`，在两个主题中都跟随主色。
- 连续或明显动效必须提供 `prefers-reduced-motion` 回退。
