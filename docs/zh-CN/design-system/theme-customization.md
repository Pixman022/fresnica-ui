# 主题定制

组件库通过 `FresnicaThemeProvider` 支持用户在本地选择品牌主题色。它只改变品牌色和交互色；成功、失败、涨、跌、警告和高风险等金融语义颜色保持独立。

```tsx
import { FresnicaThemeProvider } from 'fresnica-ui';

<FresnicaThemeProvider>
    <App />
</FresnicaThemeProvider>;
```

## 行为规则

- `primaryColor` 使用一个 HEX 颜色（支持 `#RRGGBB`，也接受三位简写）。
- 浅色和深色值由同一个主题色生成，不单独配置深色主题色。
- 主操作前景色会自动调整，满足 WCAG AA 对比度要求。
- 如果发生调整，预览入口会提示所选颜色可能影响文字和图标的可视度，并显示为保证内容清晰可见而实际采用的 HEX 色值。
- 设置保存在浏览器 `localStorage` 的 `fresnica-theme-settings` 中，并通过 `storage` 事件在多个标签页同步。
- `reset()` 恢复 Fresnica 默认品牌色和样式 Token。
- 主题只在本地生效，不连接网络，也不提供主题文件导出。

设计系统和钱包示例都在全局外观控制中提供“主题色 / Theme color”入口。它用于预览；业务应用可以直接使用 Provider。

## Token 范围

自定义主题会更新 `primary-color`、悬停/按下变体、`primary-color-bg`、`on-primary-color`、`on-primary-container-color`、`border-color-hover` 和 `focus-color`。中性表面、字体、间距、圆角、阴影以及全部金融语义颜色继续使用当前浅色/深色设计基线。

如果业务应用需要解释颜色调整，可以调用 `getFresnicaThemeAdjustment(color, mode)`。它会返回规范化输入色、实际生效的主色、前景色、对比度和 `adjusted` 标记。
