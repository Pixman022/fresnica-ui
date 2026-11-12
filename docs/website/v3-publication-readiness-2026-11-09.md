# Fresnica V3 官网发布前事实与链接验收

> 审核日期：2026-11-09  
> 适用范围：`Pixman022/fresnica-ui` · `design/website-vision-motion-concept-2026-10-27` · `public/fresnica-v3-motion-preview/`。  
> **当前结论：V3 设计预览可以继续展示；不等于正式产品发布审核通过。** 不改冻结的 `main` / V2，也不对其他用户账号执行操作。

## 来源与审核边界

- 读取 **V3 当前页面** `index.html`、`m12-experience.js` 的下载按钮、导航、问答、页脚及 `meta`；参考 [V3 质量计划](v3-quality-stabilization-plan-2026-11-09.md)。
- [旧 V2 发布事实审计](pre-release-fact-audit-2026-10-26.md) 只能用来对照已有披露原则，**不能替代本次 V3 页面检查**。
- 正常视觉/中文/Firefox/WebKit 九屏 [QA #42555111731](https://github.com/Pixman022/fresnica-ui/actions/runs/42555111731)，Windows/macOS [QA #42555199408](https://github.com/Pixman022/fresnica-ui/actions/runs/42555199408)，Windows Edge 原生缩放 [QA #42555204374](https://github.com/Pixman022/fresnica-ui/actions/runs/42555204374) 均通过；这些证明浏览器检查通过，**不证明真实钱包能力或法律合规**。

## 目前已验证的 V3 预览状态

| 事项 | 当前代码中实际状态 | 发布意义 |
| --- | --- | --- |
| SEO | `<meta name="robots" content="noindex,nofollow,noarchive" />` | 预览阶段继续限制索引；是否开放收录需另行批准 |
| iOS / Android 下载 | 第三屏两枚独立平台图标、单行按钮文字；原生 `disabled` | 不存在可执行安装/下载动作，需官方渠道 URL |
| 桌面端下载 | 第五屏 `.desktop-download:disabled` | 未公布正式安装包或发布渠道 |
| 顶部下载菜单 | 仅锚点跳转到第三屏或第五屏 | 导航入口**不是**有效 App Store / Google Play 下载按钮 |
| 正文与页脚导航 | 均指向本页既有章节 | 没有对外社区、邮箱或隐私政策链接被伪装成已核实 |
| 官网能力范围 | 静态演示钱包界面和切屏动画 | 本网站不处理资产、私钥或实际交易 |
| 品牌及网络 | 明确定位 Stellar 生态钱包；未声称多链支持 | 与现有产品定位一致 |
| Android 标志 | 页脚保留 `Third-party notices` 链接，Android/Google 商标与 CC 3.0 声明集中放在 `third-party-notices.html` | 页面不再直接展示冗长署名；声明页仍需最终法律审核 |
| 语言/字体 | 中文与英文切换；Noto Sans SC 本地字体 | 浏览器已验证中文显示，不代表所有设备设计签收 |

### 发布信息待核实

1. **分发事实**：iOS App Store、Android 官方渠道、Windows/macOS 等桌面分发地址（如适用）；由发布负责人提供可核实正式地址，以及每个平台的实际上线/可用状态。不要从代码仓库、包名或演示视频猜测官方 URL。
2. **法律及联系方式**：隐私政策、服务条款（根据实际提供服务判断）、官方联系入口及其发布批准者。没有批准时不添加虚构邮件或账号。
3. **安全与产品能力**：资产管理、交换路由、兼容 DApp 连接、签名与交易、密钥/恢复/托管模型各自的实际实现与审定宣传措辞。当前页面是设计愿景，**不能仅凭 UI 演示认定后端能力已经上线**。
4. **搜索收录**：网站是否从 V3 预览路径升级为正式官网、是否取消 `noindex`，以及 canonical 域名、站点地图和公开发布时间，均需运营/产品明确决定。
5. **设计与真实设备**：Windows 真实 GPU、macOS Safari、iOS Safari、Android Chrome 与设计负责人实际逐屏验收见 [真机检查清单](v3-device-performance-acceptance-2026-11-09.md)。Linux WebKit 不能等同 macOS Safari 真机。

## 预览保护与未来发布切换

`scripts/audit-website-v3.mjs` 现在阻止在预览阶段无意中：
- 删除 `noindex,nofollow,noarchive` 中任一标识；
- 在静态页面或动态导航菜单加入未核实的非本地链接；
- 添加数据收集表单或嵌入第三方页面；
- 将 iOS/Android 或桌面下载按钮从禁用状态开放。

这些是当前设计预览的**技术保护**，而不是对将来永久禁止外部链接。正式发布前应在**有官方材料和审核记录的明确任务**中更新相应链接、按钮、文案与测试断言，再经过完整 CI、跨系统验收与部署确认。不要为使 CI 通过而私下删除保护条件。

## 当前判断

**可继续执行：** 预览站的技术维护、可靠性/无障碍回归、中文与配色检查、九屏动效稳定性、数据记录。  
**当前不能替负责人决策：** 放开正式下载、公开索引、添加隐私/条款与外部联系方式、承诺尚未核实的安全能力、签发真实设备/设计最终通过。  
**发布准入结论：待决策与待证据；非失败，也非正式通过。**

## 2026-11-12 复核：对应 V3 新版文案的发布事实矩阵

> 本轮已按 2026-11-12 实际站点的最新文案更新矩阵（功能卡、辅助标题、FAQ 与 SEO）；不推断钱包 App 已经实现对应能力。若负责人未给出证据，状态维持“待核实”；预览按钮仍禁用。技术实现/截图不会替代产品或法律批准。

| 当前 V3 实际页面表述（英文） | 位置 | 正式发布需核实的事实 | 状态 |
| --- | --- | --- | --- |
| “Fresnica is a wallet built for Stellar. Manage assets, send and receive payments, explore swaps, and connect to compatible apps across mobile and desktop.” | SEO description | Stellar-only 网络定位，相关功能实现与桌面发行支持 | 网络定位明确；能力与平台待产品证明 |
| “A thoughtfully designed wallet for your assets, payments, swaps, and app connections.” | 首页介绍 | 资产、收发、兑换与 DApp 连接是否在实际发版可用 | 待产品验收 |
| “From checking your assets to sending payments and swapping” | 第三屏移动端 | iOS / Android 真实构建版本、功能清单与官方分发入口 | 待核实；下载仍禁用 |
| “Review addresses, amounts, and memos before sending.” | 第四屏收发卡 | 发送前地址、金额、memo 展示及交易确认流程 | 待功能验收 |
| “Review available quotes and swap details before exchanging.” | 第四屏兑换卡 | Swap 报价是否实际提供、费用/滑点/交易确认流程 | 待功能与产品审核 |
| “Explore compatible apps and review requests before connecting.” | 第四屏应用连接卡 | DApp 兼容范围、请求字段与实际授权机制 | 待功能与安全审核 |
| “A focused workspace for managing assets, reviewing payments and swaps, and connecting with apps.” | 第五屏桌面端 | 桌面客户端平台、可用程度、功能范围与安装包 | 待产品及发布负责人核实 |
| “Know before you approve.” / “Signing Review” | 第七屏安全 | 签名可读性、连接授权、密钥保管与交易核对等真实能力 | 高优先级待安全负责人审核 |
| “Fresnica is built specifically for Stellar. It is not a multichain wallet.” | FAQ 网络问题 | 发布网络与资产实际支持范围 | Stellar-only 定位已明确；细节待产品签收 |
| “Fresnica is designed for iOS, Android, and desktop” | FAQ 设备问题 | 所提平台的交付计划与可公开宣称的支持范围 | 待发行确认；仅设计定位 |
| “Download iOS” / “Download Android” / “Download” | 第三、第五屏按钮 | App Store、Android、桌面端正式发布链接与归属 | 全部按钮继续禁用 |
| “Get Fresnica” | 顶部/首页 CTA | 当前仅跳转本页下载区域，不代表可安装 | 预览可用；正式发布时重新审定 |
| `noindex,nofollow,noarchive` | SEO robots | 正式域名、canonical、收录时机与法律审核 | 维持预览限制 |

**后续执行门槛**：由产品、安全、发布与法律负责人逐条提供证据或明确改写决策；涉及实际下载、隐私、服务条款、品牌许可的决定不可从 UI 演示推导。审核后同步更新中英双语及相关自动化断言。

### 设备性能收集入口

2026-11-11 增加了 [物理设备采样操作指南](v3-real-device-performance-capture-2026-11-11.md) 与 `?debug=perf` 本地探针。正常预览不会加载探针；只在用户明确请求时记录浏览器指标并手动导出 JSON。当前无来自物理设备的采样证据，因此**性能验收未完成**，不能作为正式发布放行依据。

## 2026-11-11 · 预览部署文件完整性补充审计

检查 `.github/workflows/pages.yml` 发现此前静态白名单复制未包含源码的 `third-party-notices.html` 与 `v3-perf-probe.js`。这影响页脚声明页面和仅在 `?debug=perf` 启用的本地性能采样入口的**部署完整性**，与 App 正式下载渠道无关。

- 已在 [提交 `e359642`](https://github.com/Pixman022/fresnica-ui/commit/e35964275b4e10128ca0ca4d1fa729b08d3e22b1) 补齐发布文件；部署前强制检查源文件及 V3 根目录全部文件的产物校验。
- [Pages #42975732804](https://github.com/Pixman022/fresnica-ui/actions/runs/42975732804) 显示 `V3 root asset parity verified` 和部署成功，V2 原有首页继续保持冻结的 SHA-256 校验。
- 状态更新：现已在新部署流程中进行**实际公开 URL 的 HTTP 下载与逐字节一致性检查**。参见 [成功的 Pages #42976671768](https://github.com/Pixman022/fresnica-ui/actions/runs/42976671768)，首页、第三方声明页与可选性能采样脚本三项均通过。该结论仅覆盖 GitHub Actions Runner 的网络与这三个资源，不代表全球可用性或手机端逐屏签收。
- 官方下载 URL、隐私/条款、安全能力和最终设计验收仍按原 P3 阶段处理，未修改禁用按钮、`noindex` 或未经批准的营销承诺。

### 2026-11-11 · Pages 公网资源检查落地

- [`3258026`](https://github.com/Pixman022/fresnica-ui/commit/3258026da4a7b17da8224e6cc77978843ac1b49d) 在 Pages 成功部署后增加公开 URL 下载与文件一致性检查。
- 初次新增检查的工作流 [#42976242359](https://github.com/Pixman022/fresnica-ui/actions/runs/42976242359) 因 GitHub Artifact 索引/重跑重名限制未能部署；并非文件内容错误，也**未到实际 HTTP 检查步骤**。
- [`980ad29`](https://github.com/Pixman022/fresnica-ui/commit/980ad29af8206db9104afa7f4c6dea43083c3431) 处理上传后索引延迟，新工作流 [#42976671768](https://github.com/Pixman022/fresnica-ui/actions/runs/42976671768) 成功部署，且公网 `index.html`、`third-party-notices.html`、`v3-perf-probe.js` 三项内容均与产物完全匹配，原冻结 V2 仍保持文件 SHA-256 校验。
- 其余 P3 的官方发行渠道、法律及安全声明、SEO 发布批准与四类物理设备最终签收尚未完成。

### 2026-11-11 · 第三方声明页主题和语言往返

- 曾经仅保留中文语言：当用户在官网切换深色主题后前往 `third-party-notices.html`，该页面会按操作系统主题选择颜色；返回时也会丢失原先的站点主题偏好。
- [`1b7f0e9`](https://github.com/Pixman022/fresnica-ui/commit/1b7f0e931dbcfe7fbb6a09e21d2893f7f9112171) 通过链接查询参数显式传递 `lang` 和 `theme`，第三方声明页匹配展示，返回官网恢复；不使用跨会话持久化存储或未授权外部服务。
- [QA #42979076051](https://github.com/Pixman022/fresnica-ui/actions/runs/42979076051) 已验证主题/语言来回跳转；[Pages #42979076355](https://github.com/Pixman022/fresnica-ui/actions/runs/42979076355) 部署及关键公网资源检查成功。本次未启用官方下载、没有移除预览 `noindex`，声明内容及法律最终签收仍需负责人审核。
