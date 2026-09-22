# Form — 精确样式规范

Form 与 FormItem 使用 Fresnica 语义 Token，并遵循常见 React 表单行为。

## 布局

- 基础字体：14px、使用 `--Fresnica-line-height-base` 行高和 `--Fresnica-text-color`。
- Vertical 布局以 8px 间距堆叠字段，Label 与控件间距 6px。
- Horizontal 布局使用 24 列网格，不额外增加列间距。
- Inline 布局允许换行，控件间距 8px。
- small、middle、large 的 Label 字号分别为 12px、14px、16px。

## 字段状态

- 帮助文字：12px、行高 1.5、上边距 4px，使用 muted 文字 Token。
- 必填标记与错误反馈使用 `--Fresnica-error-color`。
- warning、success、validating 分别使用警告、成功、次要语义 Token。
- 反馈图标使用 Lucide，默认 14px，并继承对应状态色。
- 禁用 Form 使用 0.6 透明度，并把禁用语义传给兼容的子控件。

## 行为

- `FormItem` 必须位于 `Form` 或 `Form.Provider` 内。
- 当子控件未显式覆盖时，`size`、`disabled` 与错误状态会传给兼容子控件。
- 校验提示保持简洁，并紧邻受影响字段。
