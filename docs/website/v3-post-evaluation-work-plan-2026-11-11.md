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
