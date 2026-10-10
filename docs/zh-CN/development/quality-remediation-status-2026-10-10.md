# Fresnica 质量修复状态报告 — 2026-10-10

> 范围：以 `Pixman022/fresnica-ui` 为主，并引用 `Pixman022/fresnica-ui-native` 的既有质量证据。  
> 结论：最新质量修复计划 WP01–WP06 已完成。  
> 本报告不扩大到钱包业务、Mainnet、真机产品发布或 WCAG AA 全面合规声明。

## 工作包状态

- **WP01 — 完成：** 修复 Form 异步校验竞态与过期结果。证据：PR #2，合并提交 `fe2614971743de5d86af2954f5e35500c4af9673`。
- **WP02 — 完成：** 将 Web React peer 基线统一到 React 18，并验证最低 React 18 consumer。证据：PR #3，合并提交 `1fe10dfe40ff477ca11b7a84a372fe9a5d480e7f`。
- **WP03 — 完成：** 补齐 Web 完整质量门禁、coverage、consumer build 与 Demo build。证据：PR #3，CI 全绿。
- **WP04 — 完成：** 自定义绿色主题保持白色前景，不改冻结默认品牌色。证据：PR #5，合并提交 `85c8bfc2e87292c565441afc67fe2f42c50cc5ac`。
- **WP05 — 完成：** 同步中英文 Mobile/Native 基线与当前主题、Modal、真机验收决策。证据：PR #6，合并提交 `8e11dfb2d626db480d5918e70ba3d678fd11c1a9`。
- **WP06 — 完成：** 分离生产/全量依赖审计并完成风险分类。证据：PR #7，合并提交 `602d2d48b3e902e943c9888549ed08582edcba6a`。

## WP01 — Form 异步校验

已解决旧异步校验覆盖最新值/错误状态的问题：

- 校验开始时冻结返回值快照；
- 值变化、reset 或后续校验使旧轮次成为 `outOfDate`；
- 旧轮次不会覆盖最新 error / validating；
- submit 不会因为旧结果误触发成功回调。

对应回归测试已随 PR #2 合并。

## WP02 / WP03 — React 与完整 Web 质量门禁

当前 Web 包明确以 React 18 为最低 peer 基线，并有独立 packed consumer 验证。

CI 包含：

- Node 20 / 22 lint 与测试；
- `npm run ci`；
- 文档同步、Token 审计、contrast、a11y；
- coverage 阈值；
- React 18 minimum consumer typecheck/build；
- library build；
- Demo build。

这解决了旧评估中 React 声明与真实 API 使用不一致、以及 CI 未覆盖完整发布链的问题。

## WP04 — 自定义绿色主题前景

已按现有设计规则统一：

- 自定义 primary 为绿色通道主导时，Light/Dark filled controls 使用纯白前景；
- 必要时只调整**自定义 effective primary** 以满足该自定义主题自身的可读性计算；
- 冻结默认品牌 Light `#00A875` / Dark `#00CA8A` 不修改；
- 非绿色自定义主题继续使用既有自适应前景策略。

此工作**不代表默认品牌绿/白字已经达到 WCAG AA**。

旧重复 PR #4 已关闭，避免将过期分支重复合并；有效实现为 PR #5。

## WP05 — Mobile/Native 基线同步

中文版基线已与英文和当前项目决定对齐：

- 图片取色主题当前明确不需要；
- Native Modal 保持现有 `fade`；
- reduced-motion 不宣称已通过；
- 组件包工程门槛、首个钱包真机集成硬门槛、正式发布门槛分开；
- 英文/简体中文范围与原品牌配色约束保持不变。

## WP06 — 依赖审计分类

Web：

- 全量审计：23 个漏洞（1 low / 9 moderate / 13 high）；
- 生产依赖审计：0。

Native：

- 全量审计：40 个漏洞（5 moderate / 34 high / 1 critical）；
- 生产依赖审计：0。

当前发现位于开发、测试、构建或部署工具链。处置策略：

1. 全量审计与生产审计分开保留；
2. 兼容、非 force 的维护升级优先；
3. 不运行 `npm audit fix --force` 来机械降低数量；
4. 任意实际依赖升级必须重新通过完整 CI 与 consumer/build 门禁；
5. 第一个真实钱包 App 需要独立审计自己的运行时依赖图。

详见：

- `docs/development/dependency-audit.md`
- `docs/zh-CN/development/dependency-audit.md`

## 保留但不属于当前质量修复计划的工作

以下事项继续保持既有项目决策，不作为 WP01–WP06 未完成项：

- 默认品牌绿/白字对比度缺口：已知且保留，不宣称 WCAG AA 全面达标；
- Android 真机 TalkBack、焦点、键盘、安全区与动态字体：首个真实钱包 App 集成硬门槛；
- reduced-motion 完整复核：未来产品集成/发布门槛；
- iOS / VoiceOver：iOS 实施阶段再进入门槛；
- 图片取色主题：当前产品方向不需要；
- 钱包安全、密钥、签名、Mainnet：不属于当前 UI 质量修复范围。

## 当前结论

质量修复计划 WP01–WP06 已完成，当前 Web / Native 设计系统可继续作为未来 Fresnica 钱包 UI 集成基础。

后续只有在出现以下触发条件时重新打开相应质量工作：

- 新的组件或工具链版本改变现有契约；
- 生产依赖审计出现漏洞；
- 首个真实钱包 App 开始集成；
- 新产品决定重新引入此前明确排除的能力。
