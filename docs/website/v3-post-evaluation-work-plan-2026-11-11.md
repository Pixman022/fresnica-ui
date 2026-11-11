# Fresnica V3 官网评估后工作计划 · 2026-11-11

> 范围：仅 `Pixman022/fresnica-ui` 的 `design/website-vision-motion-concept-2026-10-27` 分支、`public/fresnica-v3-motion-preview/` 与其专属回归。冻结的 V2 / `main` 不改动；钱包 App 代码不属于本次任务。
>
> 起点：提交 `3d43840`。对应 GitHub Pages、V3 Visual QA、Windows Edge 原生缩放及 Native OS Browser QA 全部成功。本计划的验收口径是代码/浏览器测试与人工真机签收分开记录，不把模拟帧率当 GPU 性能。

## 执行优先级

### P0 · 建立稳定基准（不改变已有品牌与九屏结构）
- [x] 核对最新预览分支、四类 CI 与设计规范；保留已通过的首页/第二屏首次加载和锚点回归。
- [x] 从最新视觉 QA 截图确认 320px 首屏的问题是球体露出面积不足，而非文本/CTA 丢失；同时确认球体渐变调试按钮在常规预览中暴露。
- [x] 首批改动通过 Chromium 14 组宽度/主题、Firefox/WebKit 九屏、Edge 原生缩放及 Pages 部署回归；具体记录见下方执行日志。

### P1 · 移动端首屏视觉与调试控件收口（首批直接执行）
- [x] 仅在 <=480px 缩紧首屏标题前后留白、CTA 间距与布局顶部安全间距。320×720 首视口球体可见面积提高，保留标题/按钮顺序和球体着色器/粒子。
- [x] 默认预览不显示 ORB GRADIENT 开发控件；通过 `?debug=orb` 才显示，参数调节、复制、重置及键盘操作回归通过。
- [x] 浏览器增加正常/调试模式可见性、320/360/393/430px 球体布局区域与 CTA 边界断言；七视口/双主题、中文字体、Firefox/WebKit 及九屏原有回归通过。
- [x] 对照 320px 深浅主题和 430px 浅色截图：首屏球体上半部提前露出，文字与两枚 CTA 完整，调试浮层消失；本轮相关 CI 与 Pages 全部成功。

**完成判据**：320px 首次视口可看到可辨识的球体区域（不是仅显示其上边界），正文与两枚 CTA 完整；调试入口默认隐藏；原有 WebGL 与正常/降低动态回归不退化。

### P2 · 工程及性能维护（分批开展，避免大改）
- [x] 已加强物理设备采样工具的数据有效性判定：中途滚动、视口变化、主题/语言与系统动态偏好变化均会标记，恢复原状态也不能误判有效；回归覆盖稳定/中断样本及实际 JSON 内容。
- [x] 每轮采样独立记录视口与 DPR；新增离线多文件 JSON 汇总及有效记录过滤、同组至少三轮提示。合成数据与真实浏览器导出格式由 CI 验证，但仍未取得任何真实设备采样结果。
- [x] 已提供仅限 `?debug=perf` 的真实设备本地记录器和导出 JSON 能力，并编写统一采样指南；四类设备的**实际采样与最终签收仍未完成**。
- [ ] 以 `v3-device-performance-acceptance-2026-11-09.md` 的真实设备清单为模板，记录 Windows GPU / macOS Safari / iOS Safari / Android Chrome 各平台首屏、第二屏、第六屏和安全屏的实测帧时间、长任务与内存趋势；未实际测试的项目标为“未验收”。
- [ ] 只有实测确认瓶颈后，才局部优化球体与粒子；保持中心白色点阵 Logo 与已批准的几何/配色。
- [x] 已复核 M10/M12/M13 控制职责：移除 M12 旧滚轮实现；新增“初始深链接后快速切换章节”回归，确认修复前失败、修复后通过；M10/M13 部分初始校正的进一步合并留作单独验证，避免大改。
- [x] 已按实际媒体条件和组件职责审查导航、回顶、第五屏示例及移动首屏的重复 CSS；未发现需立即删除的已证实冲突。详见专项复核记录，保留现有视觉。

### P3 · 正式发布前置条件（待外部事实与批准）
- [x] 已对当前 V3 实际营销文案建立逐条“声明—证据—负责人决定”清单，更新 [发布事实验收](v3-publication-readiness-2026-11-09.md)；所有需要外部证明的项仍待确认。
- [ ] 核实 iOS / Android / 桌面下载的官方渠道与状态，方可启用下载。
- [ ] 产品负责人确认安全能力文案、隐私/服务条款、正式联系方式及收录策略；预览继续保留 `noindex`。
- [ ] 由设计负责人完成真实设备、九屏、双语与主题的最终视觉签收。

## 变更原则与验收记录

- 首先修复可见缺陷和可复现问题，之后再处理工程债；不要为了“整洁”修改已经通过的动效和布局。
- 不改变 V2、其他用户仓库、正式产品宣称及禁用下载状态。
- 每批执行后补充：提交 SHA、截图变化、静态审核、Chromium、Firefox/WebKit、Edge、Pages 的结果；任一失败明确记录原因，未通过不标记完成。

## 2026-11-11 · 首批执行与验收记录

- 计划建立：`f5ba666`。视觉/调试控件变更：[`397d247`](https://github.com/Pixman022/fresnica-ui/commit/397d247230f3a1dcefc1efa409e560184a58e698)；球体回归测量修正：[`035a9ba`](https://github.com/Pixman022/fresnica-ui/commit/035a9ba40833afc4d7fb5f0230d33e8ceb9a3908)。
- 测试中的第一轮误报：当 WebGL 启用时，备用渐变层 `#fallback-orb` 应隐藏，旧测试用其 DOM 大小判定球体不可见而失败；没有从该误报推断网页缺陷。改为对 `.orb-field` 内实际球体布局占位进行测量，保持 WebGL 图层和备份图层两种渲染路径都适用。
- [最终 V3 Visual QA #42969648996](https://github.com/Pixman022/fresnica-ui/actions/runs/42969648996)：Chromium 14 组视口/双主题、97 张截图、0 项浏览器发现，五张卡片、第二屏载入/驻留、动画回归与 8 组性能基线通过；Firefox/WebKit 独立作业也通过。
- [Pages #42969375402](https://github.com/Pixman022/fresnica-ui/actions/runs/42969375402)、[Windows Edge 原生缩放 #42969375403](https://github.com/Pixman022/fresnica-ui/actions/runs/42969375403)、[Windows/macOS #42969375371](https://github.com/Pixman022/fresnica-ui/actions/runs/42969375371)：均成功。CI 验证不等于设计批准或真实设备性能签收。
- 对照 320×720 首屏前后截图：改动前球体大半位于初始视口下方，改动后可看到球体中心白色点阵 Logo 的上部与球壳轮廓；首页文案、两枚 CTA 和 WALLET 卡片继续完整。真实手机需另行验收。
- 既有性能观测仍以 2026-11-11 CI 为基准：无头 Chromium 首屏正常动效约 1.7 秒采样内 26 次 RAF 回调（约 15.2 callbacks/s），第六、七屏同期约 60 callbacks/s；该数值**不是**手机或 PC 真实 GPU FPS，不构成直接削减球体粒子的依据。

### 后续未阻断项

- **P2（尚未完成）**：按真实设备模板记录 Windows GPU / macOS Safari / iOS / Android 的交互及性能；无物理采样不作最终结论。
- **P2（已完成审查，后续按需）**：M12 已退出滚轮控制；M13 的过期锚点恢复已以失败/成功对照修复。M10/M13 尚有初始对齐职责重叠，CSS 层叠仍保留按视口/状态分工的规则；若出现可复现缺陷，再以专项回归局部收敛。见 [职责与级联专项复核](v3-scroll-style-responsibility-audit-2026-11-11.md)。
- **P3（待负责人资料）**：正式下载 URL、安全文案、隐私条款、联系入口、SEO 及最终设计签收。

## 2026-11-11 · P2 第二批执行记录

- [`c50778b`](https://github.com/Pixman022/fresnica-ui/commit/c50778bbf59f2a30f87b596965e38e976cec7789)：移除 M12 的旧滚轮累计/动画控制器（约 3.4 KB），保留中英翻译和功能卡片排版；静态审计新增 M13 唯一 desktop wheel owner 断言。[原有九屏全量 QA #42970620200](https://github.com/Pixman022/fresnica-ui/actions/runs/42970620200) 通过，Pages/Edge/Windows/macOS 同轮通过。
- [`97de4a8`](https://github.com/Pixman022/fresnica-ui/commit/97de4a8fba5c32038e096e649e9d3a02c5e30667) 增加第二屏深链接后立即切到第五屏回归。[修复前 QA #42970836175](https://github.com/Pixman022/fresnica-ui/actions/runs/42970836175) **预期失败**：URL 已是 `#v3-workspace`，实际滚动却回到第二屏约 1797px，目标约 6663px。
- [`2e38b0e`](https://github.com/Pixman022/fresnica-ui/commit/2e38b0e0a128570b014bf938c2f381cc5a600634) 在 M13 初始锚点校正中识别 `hashchange` 和新 URL，防止过期的 `pageshow` / 字体加载定时器覆盖用户最新章节。
- **验收通过**：[V3 Visual QA #42971091576](https://github.com/Pixman022/fresnica-ui/actions/runs/42971091576) 的 Chromium 14 组视口/双主题、97 张截图、0 项异常，九屏与 11 项动态观察均通过，新增快速切换用例 PASS；Firefox/WebKit 独立作业通过。[Windows/macOS QA #42971091546](https://github.com/Pixman022/fresnica-ui/actions/runs/42971091546)、[Edge 200% #42971091507](https://github.com/Pixman022/fresnica-ui/actions/runs/42971091507)、[Pages #42971091551](https://github.com/Pixman022/fresnica-ui/actions/runs/42971091551) 也全部通过。
- CSS 的导航固定宽度、悬浮回顶、四模块桌面演示与移动首屏多层规则已分类记录；没有在缺乏视觉差异证据时一次性删改，以免破坏已通过布局。
- **继续待办**：真实 Windows/macOS/iOS/Android 硬件上的 FPS、GPU、热量/功耗及设计签收尚无用户/真实设备提供的证据，保持“未验收”。正式安装链接与法律信息仍待发布决策。

## 2026-11-11 · P2 第三批执行：物理设备采样准备

- [`8df5cd3`](https://github.com/Pixman022/fresnica-ui/commit/8df5cd339b625faa10ded8daf734d5d8eef29f9f)：新增 `?debug=perf` 可选本地浏览器采样器，支持 15s/多轮记录和手动 JSON 导出。普通预览不加载脚本，不使用网络上传；只观测 rAF 调度、PerformanceObserver 可用长任务、部分 JS 堆指标，不推断 GPU FPS。
- [真实设备采样指南](v3-real-device-performance-capture-2026-11-11.md)：规定四个章节、系统正常/减少动态两种状态，每项至少三轮，并记录设备、浏览器、电源、刷新率与 trace。现无实际物理设备采样，保持原 P2 真机验收待办。
- [V3 全量浏览器测试 #42972356755](https://github.com/Pixman022/fresnica-ui/actions/runs/42972356755)：Chromium 14 组视口/主题，97 张截图、0 项浏览器发现，11 项动效观察通过；新增调试采样器的 URL 入口、短时采样和本地 JSON 下载回归通过。Firefox/WebKit 独立作业成功。
- [Pages #42972356763](https://github.com/Pixman022/fresnica-ui/actions/runs/42972356763)、[Edge 缩放 #42972356750](https://github.com/Pixman022/fresnica-ui/actions/runs/42972356750)、[Windows/macOS 跨系统 #42972356728](https://github.com/Pixman022/fresnica-ui/actions/runs/42972356728)：均成功。
- [发布事实核对](v3-publication-readiness-2026-11-09.md)：已列出实际的英文宣传/安全/下载声明及各自所需的官方证据，**不替负责人批准**。禁用的正式安装按钮、`noindex` 和冻结 V2 均保持原状。

**状态区分**：工具开发与自动化回归已完成；P2 真机性能/最终视觉签收仍待外部设备，P3 发布能力、法务及下载事实仍待负责人批准。无足够证据前不调整已验收的球体和粒子参数。

## 2026-11-11 · P2 第四批：采样数据完整性修复与验收

- [`2fdb070`](https://github.com/Pixman022/fresnica-ui/commit/2fdb070c2209eef38d5bc2cd715748172c7a1798)：修复 `validHold` 仅比较开始/结束章节的问题。采样期间监听滚动、视口变化、页面主题、语言和系统动态偏好；中途改变后即使恢复原状也标记 `validHold=false`。新增 `changedDuringSample` 标志，在报告中解释无效原因。
- 浏览器回归执行一个稳定短样本及一个“滚动离开再返回、主题与语言切换后恢复”的中断样本；检查导出的真实 JSON 既包含有效样本也包含标记为无效的中断样本。测试只验证**功能与数据完整性**，不是物理设备帧率基线。
- [V3 视觉及浏览器回归 #42973343278](https://github.com/Pixman022/fresnica-ui/actions/runs/42973343278)：Chromium 14 组视口/主题、97 张截图、0 项异常，11 项动效观察和 8 组无头性能观测通过；Firefox/WebKit 作业通过。
- [Pages 部署 #42973343281](https://github.com/Pixman022/fresnica-ui/actions/runs/42973343281)、[Windows Edge 200% #42973343528](https://github.com/Pixman022/fresnica-ui/actions/runs/42973343528)、[Windows/macOS 跨系统 #42973343282](https://github.com/Pixman022/fresnica-ui/actions/runs/42973343282)：全部成功。
- 操作说明在 [设备性能采样指南](v3-real-device-performance-capture-2026-11-11.md)。本轮没有接入物理设备，也没有发布新的下载链接、调整视觉球体或更改 V2。
- **当前阻断项仍不变**：真实设备采样/最终设计签收、官方发布渠道与法律安全审查，需要负责人提供实际测试记录或批准，不能由 CI 自行完成。

## 2026-11-11 · P2 第五批：设备数据分组和本地汇总

- [`05854b7`](https://github.com/Pixman022/fresnica-ui/commit/05854b7a0cc4a0a6bf3d5703a2c0cedcd13b2fcd) 新增 `scripts/summarize-website-v3-device-performance.mjs` 及合成数据测试，可在本地将导出 JSON 生成 Markdown 汇总报告，不进行网络传输，也不混合不同文件来源的设备。
- [`2865c18`](https://github.com/Pixman022/fresnica-ui/commit/2865c18e135f45be5e2e7ac4a090452cf900a7ed) 让每一轮记录包含实际视口宽高与 DPR，修复只有导出时整体环境快照导致不同视口记录可能被误合并的问题。浏览器回归增加导出字段检查，V3 CI 增加脚本单测门禁。
- [`6de43e9`](https://github.com/Pixman022/fresnica-ui/commit/6de43e933ef003b9614b104203f6bf75cd4f0c23) 补充同一份 JSON 内含不同宽度的合成测试，确保按单轮环境正确分组。
- 汇总仅统计 `validHold=true`、期间无操作变化、实测时长至少 14 秒、具有逐轮视口字段和 rAF p95 的样本；至少三条合格记录才提示“够三轮、仍待人工签收”。长任务或堆内存缺失时显示未支持，而不是补零。采样脚本本身的测试结果不应当被当作真实 GPU FPS。
- [V3 全量 Chromium / Firefox / WebKit QA #42974849708](https://github.com/Pixman022/fresnica-ui/actions/runs/42974849708) 两个作业均 **success**，包含新增离线报告单测和原有九屏回归；此前源代码变更提交的 [V3 QA #42974627153](https://github.com/Pixman022/fresnica-ui/actions/runs/42974627153)、[Windows/macOS QA #42974627164](https://github.com/Pixman022/fresnica-ui/actions/runs/42974627164)、[Windows Edge 缩放 #42974627260](https://github.com/Pixman022/fresnica-ui/actions/runs/42974627260)、[Pages 部署 #42974627165](https://github.com/Pixman022/fresnica-ui/actions/runs/42974627165) 全部通过。
- 使用说明见 [真实设备性能采样指南](v3-real-device-performance-capture-2026-11-11.md)。**本批仅完成采样数据处理能力和自动化验收，不是 Windows/macOS/iOS/Android 的物理设备性能签收，也没有修改任何已批准的粒子和品牌视觉参数。**

## 2026-11-11 · P2 第六批：修复 Pages 发布文件遗漏

- **发现的实际工程缺陷**：此前 V3 Pages overlay 使用逐文件复制清单。源码存在 `v3-perf-probe.js`（`?debug=perf` 动态脚本）和 `third-party-notices.html`（页脚第三方声明），但两者未列在 Pages 发布副本里；CI 的成功不代表它们已进入发布物。因此，调试功能和页脚声明链接有潜在失效风险。
- [修复提交 `e359642`](https://github.com/Pixman022/fresnica-ui/commit/e35964275b4e10128ca0ca4d1fa729b08d3e22b1)：Pages overlay 补齐两文件的源文件检查、复制和 `cmp`，并新增根目录所有 V3 源文件与待发布文件逐一比对。后续忘记登记新静态资源时，部署将因缺文件而失败，而不是返回绿色成功。
- [Pages 工作流 #42975732804](https://github.com/Pixman022/fresnica-ui/actions/runs/42975732804) **success**；日志明确打印 `V3 root asset parity verified`，并对冻结 V2 路由进行原始文件 SHA-256 核对。此批仅修改 Pages 工作流，无视觉/交易逻辑改动。
- **验证状态更新（第七批）**：现在已补上部署后 GitHub Runner 的 HTTP 内容检查，公开首页、第三方声明与性能采样脚本均成功下载且与发布产物一致；详见下一节。真实 GPU/设备性能与正式上线资料仍待外部证据。

## 2026-11-11 · P2 第七批：公开页面 HTTP 验收

- [`3258026`](https://github.com/Pixman022/fresnica-ui/commit/3258026da4a7b17da8224e6cc77978843ac1b49d)：在 Pages 部署成功后新增基于实际公开 URL 的三个资源检查，用 `curl` 下载 `index.html`、`third-party-notices.html` 与 `v3-perf-probe.js`，逐文件与部署产物 `cmp` 校验。后续只要公网资源缺失、404 或内容不一致，工作流就不应绿色结束。
- 首轮工作流 [#42976242359](https://github.com/Pixman022/fresnica-ui/actions/runs/42976242359) 遇到 GitHub Actions 产物索引短暂不可见而未能创建部署；在同一个运行内重试，又因两份同名 `github-pages` 产物导致重复而被拒绝。**属于 Pages 部署阶段故障，未进入 HTTP 检查；不应记录为已通过。**
- [`980ad29`](https://github.com/Pixman022/fresnica-ui/commit/980ad29af8206db9104afa7f4c6dea43083c3431) 加入上传后短暂产物索引缓冲，并由新提交启动全新部署运行，避免沿用存在两份产物的失败运行。
- [**Pages #42976671768**](https://github.com/Pixman022/fresnica-ui/actions/runs/42976671768) **success**：GitHub Pages 部署、V3 全部根目录文件产物校验、冻结 V2 文件 SHA-256 检查、以及三个公开 URL 的 HTTP 下载和文件内容一致性核对，均通过；日志明确包含 `Public V3 route verified: index.html`、`third-party-notices.html`、`v3-perf-probe.js`。
- **验收边界**：这证明 GitHub Actions 所在网络从公开地址实际获得相同资源，不代表全球每个地区可访问，也不等于进行了手机端手动交互或真实 GPU 性能验收。本批只调整部署流水线，未修改网站视觉、V2、钱包 App、禁用下载按钮及 `noindex`。
