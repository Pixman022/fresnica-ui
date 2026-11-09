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
| Android 标志 | 页脚包含 Google/Android robot 商标及 CC 3.0 署名说明 | 该声明存在，但品牌使用的法律最终审查仍需负责人进行 |
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
