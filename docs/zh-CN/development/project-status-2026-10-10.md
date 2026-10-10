# Fresnica UI 项目状态简报 — 2026-10-10

> **状态：** Complete / Maintenance（已完成 / 维护）  
> **范围：** 仅 Fresnica Web 设计系统 + React Native 共享 UI primitives。  
> 钱包产品实现、密钥管理、签名、交易执行、Mainnet 与产品级真机发布验收均不属于当前项目范围。

## 一、结论摘要

当前 Fresnica UI / Native 设计系统规划范围已经完成。

- Web 质量修复计划 WP01–WP06：全部完成。
- Native 阶段一 DS-01–DS-14：全部完成。
- 钱包 UI 集成准备 IR-01–IR-04：全部完成。
- 当前 15 个 Native 共享 primitives 已足够作为未来消费方的 UI 基础；目前没有证据支持继续新增共享组件。
- 图片取色主题明确不需要。
- 默认 Fresnica 品牌绿 + 浅色文字的对比度缺口已记录，不宣称整体达到 WCAG AA。
- CI、coverage、React 18 最低消费方验证、Demo build、依赖审计门禁均已建立。
- Web GitHub Actions 的 checkout/setup-node 已升级到 v7，并在合并前通过现有完整质量链路。

## 二、仓库当前状态

### `Pixman022/fresnica-ui`

- 当前开放 PR：0。
- 当前开放 Issue：0。
- 最新质量修复计划：WP01–WP06 全部完成。
- WP06 记录的生产依赖漏洞：0。
- CI 覆盖 Node 20 / 22、完整质量门禁、coverage、React 18 最低消费方与 Demo build。

### `Pixman022/fresnica-ui-native`

- 当前开放 PR：0。
- 阶段一 UI 组件库交付：完成。
- 已交付 15 个共享 primitives。
- Issue #21、#22 已按 `not planned` 关闭，因为钱包产品工作不属于当前项目。
- Issue #49 保持开放，仅作为未来真实消费方的无障碍真机证据门槛；不阻塞当前项目完成状态。

## 三、当前项目范围

### 包含

- Web 设计系统组件与文档
- Design Tokens 与平台映射
- Native 共享 UI primitives
- Light / Dark / System 主题
- 组件契约与基础无障碍能力
- 自动化测试、CI、coverage、消费方验证
- 视觉基准与集成规范
- 回归、依赖和工具链兼容性维护

### 不包含

- 钱包产品页面的正式业务实现
- 钱包创建 / 导入 / 恢复
- 密钥存储、签名与交易执行
- Horizon / Mainnet 产品逻辑
- 钱包产品安全架构
- 产品级 Android / iOS 真机发布验收
- 图片取色主题

## 四、延期但不阻塞的事项

当前唯一刻意保留开放的 Native 后续项是 Issue #49：未来真实消费方集成时的 TalkBack、焦点、键盘、字体缩放和系统 UI 真机证据。

它不是当前组件库的实现任务。只有未来出现真实消费 App，并决定执行该集成验收门槛时才重新进入执行状态。

## 五、维护触发条件

只有出现以下情况之一时，才重新启动当前项目开发：

1. 共享组件或 Token 出现回归；
2. 生产依赖审计出现漏洞；
3. React、Node、React Native、GitHub Actions 等工具链变化破坏当前支持契约；
4. 至少两个真实消费 Feature 证明需要同一个缺失的跨 Feature 共享 primitive；
5. 出现新的、明确批准的设计系统需求。

## 六、当前结论

**当前 Fresnica UI / Native 设计系统范围内，必须完成的实现任务为 0。**

项目应维持 **Complete / Maintenance（已完成 / 维护）** 状态，直到出现维护触发条件或新的范围内设计系统需求。
