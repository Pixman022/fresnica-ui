# Fresnica UI style（中文对照，仅供人工 review）

> 本文件是 [SKILL.md](SKILL.md) 的中文对照；Agent 读取英文版。

Fresnica UI 是面向 Stellar 钱包产品的 React + TypeScript 组件库，使用语义 `--Fresnica-*` Token、Lucide 界面图标与 CC BY-NC 4.0 协议。

## 选择场景

| 场景 | 入口 |
| --- | --- |
| 使用 npm 包的 React 项目 | [references/react-project.md](references/react-project.md) |
| 单个自包含 HTML 文件 | [references/standalone-html.md](references/standalone-html.md) |

## 视觉契约

- 浅色主色 `#00A875`，深色主色 `#00CA8A`。
- 所有绿色实心控件使用白色文字。
- Swap 可使用 inverse 操作：浅色主题黑色，深色主题白色。
- 使用中性语义表面、细边框与 8–24px 圆角；不使用层级投影。
- Roboto 字体，中文回退为 `Noto Sans SC`；余额、手续费、汇率使用等宽数字。
- 界面图标使用 Lucide；只有已批准的 Fresnica Logo/应用图标可以使用图片。
- 动效时长 0.15–0.35s，并提供 reduced-motion 行为。
- 除非用户扩大网络范围，产品内容只使用 Stellar 术语。
- 避免装饰插画、纹理背景、异形与游戏效果。

## Token

在应用入口只导入一次 `fresnica-ui/style`，随后使用 `var(--Fresnica-*)`。精确数值见[设计 Token](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/design-tokens.md)与[组件规范](https://github.com/Pixman022/fresnica-ui/tree/main/docs/design-system/components)。

协议紫语义使用 `--Fresnica-accent-purple-*`。原 `--Fresnica-secondary-*` 兼容别名已在 2.0.0 清理中删除。

只有需要明确表达“无投影”契约时才使用 `--Fresnica-shadow-base`。原 `--Fresnica-shadow-sm` 与 `--Fresnica-shadow-lg` 兼容别名已在 2.0.0 清理中删除。

## 组件参考

使用 API 前先读取对应文件：

- [通用](references/components/general.md)
- [布局与产品组合](references/components/layout.md)
- [表单控件](references/components/form-controls.md)
- [Form](references/components/Form.md)
- [浮层](references/components/overlays.md)
- [反馈](references/components/feedback.md)
- [Notification](references/components/Notification.md)
- [数据展示](references/components/data-display.md)

## 硬规则

1. 不虚构 props，以源码声明为准。
2. 在应用入口只导入一次 `fresnica-ui/style`。
3. 已有语义 Token 时不硬编码颜色。
4. 保持焦点可见，触控目标至少 40px，主要操作优先 48px。
5. 界面图标使用 Lucide，不使用 emoji、Unicode 字符或手绘 SVG 控件。
6. 标题与浮层保持语义化矩形结构，不添加装饰插画。
7. 在 320px、360px、390–393px、430px 移动宽度，以及 768px 平板过渡和桌面宽度下验证亮/暗主题。
8. 产品示例只使用 Stellar Mainnet、Testnet 与 Horizon 术语。
