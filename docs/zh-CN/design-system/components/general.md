# 通用组件 — 精确样式规范

通用组件 Button、Icon、Typewriter、Cursor 的样式与使用约束。

## Button

| 属性       | small                         | middle                          | large                           |
| ---------- | ----------------------------- | ------------------------------- | ------------------------------- |
| 最小高度   | `--Fresnica-height-sm`        | `--Fresnica-height-base`        | `--Fresnica-height-lg`          |
| 水平内边距 | `--Fresnica-spacing-md`       | `--Fresnica-spacing-lg`         | `--Fresnica-spacing-xl`         |
| 字号       | `--Fresnica-font-size-sm`     | `--Fresnica-font-size-base`     | `--Fresnica-font-size-lg`       |
| 圆角       | `--Fresnica-border-radius-sm` | `--Fresnica-border-radius-base` | `--Fresnica-border-radius-base` |
| 边框宽度   | `--Fresnica-border-width`     | `--Fresnica-border-width`       | `--Fresnica-border-width`       |

**Primary 主按钮：**

```css
color: var(--Fresnica-on-primary-color); /* 始终为白色 */
background: var(--Fresnica-primary-color); /* 浅色 #00A875，深色 #00CA8A */
border-color: var(--Fresnica-primary-color);
box-shadow: none;

/* hover */
background: var(--Fresnica-primary-color-hover);
border-color: var(--Fresnica-primary-color-hover);
box-shadow: none;
transform: translateY(-1px);

/* active */
background: var(--Fresnica-primary-color-active);
transform: scale(0.98);
```

Default 与 dashed 按钮使用中性表面和边框 Token；text 与 link 保持透明背景。键盘焦点使用 2px 焦点色描边；禁用状态使用 `opacity: 0.55` 并去除阴影。

Primary 按钮中的文字、Lucide 图标和 Loading 图标在两套主题中都必须显式继承 `--Fresnica-on-primary-color`（白色）。

Primary 只用于单个操作区域中的主操作。复制、Max/All、方向切换、筛选等辅助操作使用 default、dashed 或 text 样式，避免品牌绿失去视觉稀缺性。

**Inverse 按钮（Swap / 高对比核心操作）：**

```css
/* 浅色主题 */
color: var(--Fresnica-on-inverse-color); /* #fff */
background: var(--Fresnica-inverse-color); /* #111214 */

/* 深色主题 */
color: var(--Fresnica-on-inverse-color); /* #111214 */
background: var(--Fresnica-inverse-color); /* #fff */
```

`type="inverse"` 仅用于少量需要随主题反转对比度的核心操作，首页 Swap 是标准示例。hover 与 active 分别使用 `--Fresnica-inverse-color-hover` 和 `--Fresnica-inverse-color-active`。

**Loading 状态：**

Loading 保持按钮自身的语义背景，并使用 Lucide `LoaderCircle` 图标。图标容器使用 `opacity: 0.82` 与 `pointer-events: none`；加载期间禁用按钮，避免重复提交。不添加重复渐变或装饰性纹理。

**Danger 主按钮：**

```css
color: var(--Fresnica-on-error-color); /* 白色 */
background: var(--Fresnica-error-color); /* 两套主题均为 #C73945 */
border-color: var(--Fresnica-error-color);

/* hover 与 active 始终保持错误色语义 */
background: var(--Fresnica-error-color-hover);
background: var(--Fresnica-error-color-active);
```

Danger 与其他按钮类型组合时，文字、边框、hover 与 active 也必须使用错误色系，不能回落到主绿色。

## Icon

Icon 使用 Lucide，并提供钱包场景所需的语义名称：`wallet`、`camera`、`message-circle`、`book-open`、`palette`、`wrench`、`send`、`map`、`shopping-bag`、`settings`。运行时以 `ICON_LIST` 为准。

```tsx
<Icon name="send" size={24} strokeWidth={2} />
```

- 图标继承 `currentColor`，由按钮或容器统一控制颜色。
- `size` 默认 24，`strokeWidth` 默认 2。
- `bounce` 仅在确实需要轻量提示时使用，并遵守系统减少动态效果设置。
- 普通独立图标继承中性文字色。只有明确选中/激活状态才使用主色；完成或健康状态使用成功色；真实金融变化使用上涨/下跌色；协议与网络辅助色仅在图标用于识别对应领域时使用。

## Typewriter

```tsx
<Typewriter speed={90} trigger={openCount} autoPlay onDone={() => undefined}>
    <p>
        第一行 <strong>强调内容</strong>
    </p>
    <p>第二行</p>
</Typewriter>
```

| 属性       | 类型          | 默认值 | 说明                                       |
| ---------- | ------------- | ------ | ------------------------------------------ |
| `children` | `ReactNode`   | —      | 逐字显示内容，保留原元素结构、换行与样式   |
| `speed`    | `number (ms)` | `90`   | 每个字符的间隔                             |
| `trigger`  | `unknown`     | —      | 值改变时重新播放                           |
| `autoPlay` | `boolean`     | `true` | `false` 时直接显示全部内容                  |
| `onDone`   | `() => void`  | —      | 播放完成后的回调                           |

组件不额外包裹 DOM，不改变原内容布局；减少动态效果时应避免长时间动画。

## Cursor

```tsx
<Cursor forceAll={false}>
    <App />
</Cursor>
```

Cursor 是语义光标容器，不使用自定义图片资源。

```css
.Fresnica-cursor {
    cursor: default;
}
.Fresnica-cursor--force button,
.Fresnica-cursor--force a,
.Fresnica-cursor--force [role='button'] {
    cursor: pointer;
}
.Fresnica-cursor input,
.Fresnica-cursor textarea {
    cursor: text;
}
.Fresnica-cursor [disabled],
.Fresnica-cursor [aria-disabled='true'] {
    cursor: not-allowed;
}
```

- `forceAll` 默认 `true`，为链接和按钮提供 pointer 语义。
- 输入框保留 text 光标，禁用控件使用 `not-allowed`。
- `className` 与 `style` 应用到根容器。
