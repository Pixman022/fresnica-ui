# Fresnica 官网桌面视觉 V1.1 — 源码复核与内容核验记录

- 复核日期：2026-10-23
- 范围：`public/fresnica-website-preview/index.html`，主分支提交 `867eca67da6210a05224b85e8634ca379d488e8a`
- 目标画板：1440 × 900 桌面端
- 本轮性质：**源码及文案静态复核**，不是浏览器截图目视签核，也不是产品功能验收
- 范围排除：移动端视觉/适配，真机体验，钱包功能实现
- 状态：**待视觉签核 / 待官方内容核验**，不得称为已正式发布或完成最终视觉批准

## 已从当前源码确认

| 检查点 | 结果 | 证据位置 |
| --- | --- | --- |
| 单生态定位 | 页面主线仅围绕 Stellar、XLM、Stellar-issued assets、Payments、Swap、compatible apps | `onepage()`、`featureCards`、`featureArea()` |
| 信息架构 | Home、Features、Download、About、Help 单页结构 | `header()`、`onepage()`、`footer()` |
| 桌面 V1.1 定向样式 | `@media (min-width:1280px)` 单独提高导航、功能卡片、下载区、FAQ 等文字可读性 | 样式末尾「Desktop visual V1.1」 |
| 预发布标识 | iOS / Android planned、In development；下载说明明确无已核实的发布渠道 | `onepage()`、`platformGrid()` |
| 预览数据 | Hero 产品图带 `Product illustration, demo data only` 无障碍说明；样例界面使用 Example / Concept | `onepage()`、`phone()` |
| 官方信息占位 | 联系方式、社区、政策以“经核实后公布”处理，没有直接虚构链接 | `helpArea()`、`footer()` |
| 基础可访问性 | Skip-to-content、主导航标签、FAQ 的 `aria-expanded` / `aria-controls` 已存在 | `header()`、`helpArea()` |

上述“确认”指代码中存在这些保护和结构，**不等于**在浏览器中验证过最终画面、键盘操作或朗读表现。

## 待完成：桌面视觉签核

1. 在实际部署预览中，以 **1440 × 900** 分别采集英文及中文完整页面截图，检查首屏层次、留白、文字溢出、手机概念图、四张功能卡、Download 双栏、About、FAQ 和 Footer。
2. 检查桌面常见缩放（100% 和 125%）、键盘 Tab 顺序、焦点可见性、FAQ 展开与中英文切换；记录截图/复核者/日期/结论。
3. 核实桌面视觉 V1.1 样式是否确实随 Pages 部署，不能仅以主分支合并推断线上发布成功。
4. 若出现问题，用单独 PR 进行最小修改；不将该轮桌面任务扩展为移动端重设计。

## 待完成：上线前内容真实性与产品决策

| 项目 | 当前源码口径 | 发布前动作 |
| --- | --- | --- |
| Assets / Payments / Swap / DApps | 产品方向与概念展示 | 与真实 Stellar 钱包功能清单逐项核对；未实现内容保留“计划/概念”限定 |
| 安全与签署体验 | “Designed to make … easier to understand” | 经产品和安全负责人核实，避免推断已实现的安全保障或认证 |
| iOS / Android 下载 | 计划中、尚未提供真实下载 | 取得官方 App Store / Google Play 来源和发布状态后再开启下载 |
| 社区/支持联系 | 未验证，保留占位 | 取得经过认证的官方地址后增加链接 |
| 隐私政策/服务条款 | 未验证，保留占位 | 法务/产品批准实际页面后再上线 |
| 实际产品截图 | 当前为模拟数据和概念图 | 若替换为真实截图，先确认版本、授权及功能对应性 |

## 阶段判断

- **工程交付**：截至复核时，V1.1 对应提交已出现在主分支；这并不自动证明 Pages 已部署。
- **设计审批**：尚无带画面证据和审核人签字的正式桌面视觉批准记录。
- **真实性验收**：当前文案对未发布能力采取限定性表述，但仍待真实产品功能和官方渠道逐项确认。
- **继续工作的优先级**：桌面实图视觉审核 → 当前产品能力核验 → 官方链接/政策核验 → 发布前签核。
- **明确暂停**：移动端页面改版；无须由本轮任务推动。

## 关联

- [V1.1 最新提交](https://github.com/Pixman022/fresnica-ui/commit/867eca67da6210a05224b85e8634ca379d488e8a)
- 预览源文件：`public/fresnica-website-preview/index.html`
