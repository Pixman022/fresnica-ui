# Fresnica 双主题配色迁移 — 2026-11-26

## 决策
本次明确更新 Web 1.0.0 的旧品牌配色，Web / Native 共享 Token 合约升级为 **1.1.0**。

| 语义角色 | 浅色 | 深色 |
| --- | --- | --- |
| `action-primary` | `#0F7954` | `#00CA8A` |
| `action-primary-hover`（Web） | `#0D724F` | `#32DFA4` |
| `action-primary-pressed` | `#0C6748` | `#00A875` |
| `content-on-primary` | `#FFFFFF` | `#101312` |
| `background-canvas` | `#F9F9FB` | `#101312` |
| `surface-default` | `#FFFFFF` | `#171B19` |
| `surface-raised`（Native） | `#FFFFFF` | `#202623` |
| `content-primary` | `#1A1C1D` | `#F4F7F5` |

品牌色与金融反馈色继续采用不同语义角色：不因绿色接近而替换成功、失败、收益/损失、警告和高风险配色。

## 对比度检查（WCAG AA 普通文字最低 4.5:1）
- 浅色主按钮 `#0F7954` + 白字：**5.41:1**。
- 浅色按下态 `#0C6748` + 白字：**6.89:1**。
- 深色主按钮 `#00CA8A` + `#101312` 深色文字：**8.73:1**。
- 深色按下态 `#00A875` + `#101312` 深色文字：**6.10:1**。

主按钮状态组合纳入 `npm run test:contrast` 门禁，但不宣称全部状态、弱化文字或焦点的无障碍审核已完成。

## 交付方式
1. Web 源头为 `design-system/tokens.json`、`src/styles/variables.less`、`src/styles/themes/default.less`。
2. Native 由 `design-system/platform-token-source.json` 生成，对 Web commit 和两份源文件 Git Blob SHA 锁定并在 CI 验证。
3. 自定义主题保持用户输入品牌色，按明暗模式计算可读前景色，金融业务状态色不随之变化。
4. 已冻结的 V2 官网保留历史视觉基线；现行 V3 宣传页面单独迁移。程序化粒子效果和 Logo 素材不当作按钮 Token 处理。
