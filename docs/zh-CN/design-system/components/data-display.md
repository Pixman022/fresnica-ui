# 数据展示组件规范

数据展示组件优先保证可扫描性、交易确认感和浅色 / 深色模式对比度一致。表面、文字、边框、焦点环与交互状态必须使用 Fresnica 语义 Token。

## Table 表格

源码：`src/components/Table`。

- 用于交易历史、资产列表和结构化 Stellar 数据。
- 容器使用 `--Fresnica-surface` 与低对比度边框，表头使用 `--Fresnica-surface-high`。
- 行之间使用克制的实线分隔；可选斑马纹使用 `--Fresnica-surface-low`。
- 行悬浮使用 10% 主色混合，不使用纹理或装饰位移。
- 加载状态使用半透明表面遮罩和主色进度图标。
- 内置分页位于表格底部，并在客户端对数据分页。

不要只依赖整行颜色表达状态，应将状态文字与语义 `Tag` 配合使用。

## Pagination 分页

源码：`src/components/Pagination`。

分页使用紧凑圆形控件、Lucide 方向图标和中性辅助输入。当前页使用主色圆形背景，文字为 `--Fresnica-on-primary-color`；悬浮为低透明度主色，焦点使用 `--Fresnica-focus-color`。

- 始终显示首尾页；总页数超过 7 时使用省略号。
- `current` 与 `pageSize` 可受控；未传入时由组件维护内部状态。
- 每页数量菜单与快速跳转输入使用 Token 表面和边框；选中项与 Select 一致，使用主色背景和白色文字。
- 分页只保留一套语义样式：未选项为中性色，悬浮反馈与当前页使用主题主色。
- 禁用示例中的当前页使用比其他透明禁用页码更明显的中性填充与边框；禁用状态不使用绿色。

## CodeBlock 代码块

源码：`src/components/CodeBlock`。

代码块在两种主题中均使用固定深色技术表面，支持 JSX / TypeScript 高亮和可选复制操作。代码文字使用组件提供的等宽字体栈，不继承正文排版。

```tsx
<CodeBlock code={stellarExample} copyable />
```

复制控件必须使用 Lucide 图标、提供无障碍名称，并保留至少 44px 的触控区域。

## Tag 标签

源码：`src/components/Tag`。

标签用于紧凑的元数据与状态。默认使用 `soft`；只有高强调状态才使用 `solid`，并确保前景内容可读。

| 推荐颜色 | 含义 |
| --- | --- |
| `default` | 中性元数据 |
| `app-teal` | 成功 / 已确认 |
| `app-red` | 失败 / 危险 |
| `purple` | 协议 / 签名 |
| `app-blue` | 信息 / 网络 |
| `app-yellow` | 警告 / 待处理 |
| `app-orange` | 注意 / 手续费变化 |

Tag 调色板严格限制为以上七种，近似的旧颜色已从 `TagColor` 移除。`default` 使用中性表面 Token，其余语义色与 Color 配色页展示的主色、错误色、紫、蓝、黄、橙 Token 完全一致。可交互标签支持 Enter 与空格键；可关闭标签使用 Lucide `X` 图标。

## Image 图片

源码：`src/components/Image`。

图片组件用于钱包 Logo、资产图标、二维码相关图形和文档媒体。外框使用中性 Token 表面、1px 描边、12px 内缩、8px 圆角且无投影；正式页面不使用相框隐喻、纹理或装饰性色彩组合。

- 必须提供有意义的 `alt`；只有纯装饰图片可使用空值。
- `lazy` 对应浏览器原生懒加载。
- 开启 `preview` 后，点击会打开无障碍预览；Escape 关闭，焦点返回触发元素。
- 预览关闭操作使用 Lucide `X` 图标，不使用 CSS 伪元素绘制界面图标。
- 加载失败时显示 Lucide Camera 占位图标及可读文字。
- 正式页面优先使用 `white` 或 `default`；旧颜色外框只用于兼容文档示例。

正式素材建议规格：

| 素材 | 源文件尺寸 / 比例 | 格式 |
| --- | --- | --- |
| 资产图标 | 40–64px，1:1 | WebP 或 PNG |
| 二维码 / 凭证 | 240–320px，1:1，并保留清晰安静区 | PNG 或 SVG |
| 横幅 / 文档图 | 16:9 | 优先 WebP；照片内容可使用 JPEG |
| 透明 Logo | 矢量，或至少达到显示尺寸的 2 倍 | 优先 SVG，否则使用透明 PNG |

固定尺寸显示的位图应提供 2x 源文件：例如显示为 64px 的图标，应使用 128px 素材。示例路径应明确素材用途，例如 `/path/to/stellar-asset-preview.webp`，不要将文档占位路径原样用于正式项目。

键盘焦点统一使用 `--Fresnica-focus-color`，不得使用硬编码黄色焦点环。
