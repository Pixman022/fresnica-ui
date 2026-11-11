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

## 2026-11-11 追踪：面向最终发布的文案事实矩阵

> 本轮仅逐项复核 V3 当前实际页面文案和可执行按钮，不推断钱包 App 已经实现对应能力。若负责人未给出证据，状态维持“待核实”；预览按钮仍禁用。技术实现/截图不会替代产品或法律批准。

| 当前实际页面表述（英文） | 位置 | 需要提供的发布依据 | 当前判定 |
| --- | --- | --- | --- |
| “Fresnica is a Stellar wallet for XLM, issued assets, payments, swaps, and compatible apps.” | 页面 `meta description` | Stellar-only 定位及支持范围、交易和应用连接能力对应发布版本 | 定位已明确；能力上线状态待产品确认 |
| “A focused mobile wallet experience for XLM, Stellar-issued assets, payments, swaps and compatible apps.” | 第三屏移动端介绍 | iOS/Android 版本功能清单、真实可用状态和实际官方发布渠道 | 待产品和发布负责人确认；两枚按钮仍禁用 |
| “Manage Stellar assets, review payments, explore swaps and connect with compatible apps in a clear desktop experience.” | 第五屏桌面端介绍 | 桌面客户端是否真有交付计划、平台范围及具体功能是否已实现 | 仍为设计展示；不应当作现有桌面软件能力的证据 |
| “Review transaction details before approving, understand connection requests, and stay in control of your wallet.” | 第七屏 Security | 密钥保管和签名模型、交易前核对、DApp 请求权限及实际测试 | 高优先级待安全与产品负责人审核 |
| “Manage XLM and Stellar-issued assets together in one clear view.” | 第八屏 Q&A | 真实支持的资产类型、信任线/发行资产展示范围及实现状态 | 待功能验收，不以模拟资产余额验证 |
| “Create, review and confirm wallet transactions in the Fresnica app.” | 第八屏 Q&A | App 实际发布状态、交易构建/签名/提交功能 | 文字是目标体验描述；发布前须核实是否需要未来式 |
| “Download iOS / Download Android / DOWNLOAD” | 第三、五屏按钮 | 真实 App Store / Android / 桌面发行版 URL、下载链接归属、发布批准 | 当前禁用；不可为了测试或视觉而启用 |
| “Get Fresnica” | 顶部下载菜单 | 仅页内跳转到第三与第五屏，不暗示已开放安装包 | 现阶段导航成立；正式发布时须核实目标 |
| `noindex,nofollow,noarchive` | SEO | 域名、正式发布日期、收录策略及 canonical URL | 保留预览限制，未经批准不可删除 |

**后续执行门槛**：由产品、安全、发布与法律负责人逐条提供证据或明确改写决策；涉及实际下载、隐私、服务条款、品牌许可的决定不可从 UI 演示推导。审核后同步更新中英双语及相关自动化断言。

### 设备性能收集入口

2026-11-11 增加了 [物理设备采样操作指南](v3-real-device-performance-capture-2026-11-11.md) 与 `?debug=perf` 本地探针。正常预览不会加载探针；只在用户明确请求时记录浏览器指标并手动导出 JSON。当前无来自物理设备的采样证据，因此**性能验收未完成**，不能作为正式发布放行依据。

## 2026-11-11 · 预览部署文件完整性补充审计

检查 `.github/workflows/pages.yml` 发现此前静态白名单复制未包含源码的 `third-party-notices.html` 与 `v3-perf-probe.js`。这影响页脚声明页面和仅在 `?debug=perf` 启用的本地性能采样入口的**部署完整性**，与 App 正式下载渠道无关。

- 已在 [提交 `e359642`](https://github.com/Pixman022/fresnica-ui/commit/e35964275b4e10128ca0ca4d1fa729b08d3e22b1) 补齐发布文件；部署前强制检查源文件及 V3 根目录全部文件的产物校验。
- [Pages #42975732804](https://github.com/Pixman022/fresnica-ui/actions/runs/42975732804) 显示 `V3 root asset parity verified` 和部署成功，V2 原有首页继续保持冻结的 SHA-256 校验。
- 注意：静态文件进入 Pages 构建产物不等于对公网从任意设备完成 HTTP 可访问性验收；此处尚无独立 HTTP 探测证据，不应声称已完成所有公网可访问性签收。
- 官方下载 URL、隐私/条款、安全能力和最终设计验收仍按原 P3 阶段处理，未修改禁用按钮、`noindex` 或未经批准的营销承诺。
