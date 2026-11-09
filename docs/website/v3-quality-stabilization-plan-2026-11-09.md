# Fresnica V3 官网稳定性与发布质量工作计划

> 日期：2026-11-09  
> 工作范围：`Pixman022/fresnica-ui` 的 `design/website-vision-motion-concept-2026-10-27` 分支，仅 V3 预览与其专属测试。冻结的 V2、`main` 及其他 GitHub 账号不在本次修改范围。  
> 依据：[V3 设计规范验收](v3-design-system-alignment-qa-2026-11-04.md) 与 [Fresnica 设计规范](../design-system/design-rules.md)。

## 工作原则

- **先复现再修改**：区分脚本测试不稳定、滚轮事件丢失和页面真实交互故障；不以增大超时、重试或跳过失败作为修复。
- **保留现有设计**：不重做已确认的九屏叙事、球体粒子、资产曲线、四模块桌面演示和全站按钮。优先局部修改、重用既有 CSS Token。
- **以可验证结果结束每一步**：静态审核、Chromium 视觉回归、Firefox/WebKit 正反向九屏、Windows/macOS 布局及 Windows Edge 缩放有各自的验收边界。
- **保持预览属性**：正式下载链接、隐私政策、法律信息、公开索引及真实产品安全声明必须有经核实的资料。未核实前不能擅自开放下载或改写安全承诺。

## P0 — 完整九屏滚动稳定性（立即执行）

- [x] 复现并诊断反向滚动测试超时：事件到达页面且被取消，但测试尚在动画惯性保护内发出下一轮输入。
- [x] 修正 **测试同步时机**，等待五次方缓动尾段与 M13 的 110ms 惯性保护结束；页面原有滚动逻辑无须改变，未延长驻留断言的故障超时。
- [x] Firefox 与 WebKit 均完成九屏正向 8 次 + 逆向 8 次；Chromium 视觉与转场断言同时通过，完整双作业已在 [#42548056651](https://github.com/Pixman022/fresnica-ui/actions/runs/42548056651) 成功。临时滚轮诊断探针已移除。

**验收**：`V3 Website Visual QA` 中两个独立作业均成功，特别是 `check-website-v3-engine-scenes.mjs` 两引擎 PASS，且部署工作流成功。

## P1 — 窄屏可用性与内容完整性（P0 后执行）

- [x] 核对 320px/430px 第五屏的可滚动标签与无遮挡快捷操作；在窄屏第五屏隐藏遮挡示例的悬浮回顶控件，固定品牌 Logo 仍可返回首页。
- [x] 增加 320px/430px 中文 × 深浅模式的滚动可达性、品牌返回入口与回顶按钮避让断言；[Chromium CI #42547918650](https://github.com/Pixman022/fresnica-ui/actions/runs/42547918650) 14 组视口/主题、79 张截图、20 个模块场景通过。
- [x] 沿用已有顶部导航边界、44px 点击面积与键盘焦点回归，近期 Windows Edge 原生缩放 [#42547905622](https://github.com/Pixman022/fresnica-ui/actions/runs/42547905622) 及跨平台检查 [#42547905647](https://github.com/Pixman022/fresnica-ui/actions/runs/42547905647) 成功。

**验收**：窄屏不存在不可达操作或页面横向溢出；截图与 DOM 几何检查一致。

## P2 — 动画性能与样式维护（稳定后执行）

- [x] 取得首屏球体、第二屏粒子、第六屏走马灯、第七屏安全粒子的 Chromium CI 正常/减少动态 8 组 RAF/主线程任务基线；不将该数据冒充真实设备 GPU FPS。
- [ ] 仅针对实测热点降低粒子或绘制占用，严格保留已经确认的球体中心静态点阵 Logo。
- [x] 完成重复/冲突 CSS 的静态候选清单；只记录优先核对的样式层叠位置，不在缺少逐屏视觉证据时合并既有规则。

**验收**：提供可重现的性能记录，优化不影响画面和通过的现有回归。

- **2026-11-09 · WebKit 第 04→05 屏回归修复已验证**：针对滚轮事件可达、页面却停留原场景的失效，测试等待 M13 将滚动容器的内联 `scrollBehavior` 从 `auto` 恢复，确认五次方切屏动画最后一帧执行完，再给 110ms 惯性保护留出空间。没有增大 5.5s 故障判定时限，也没有修改生产页面滚动逻辑。测试保持可追踪的真实浏览器滚轮与非交互边缘命中检查。完整 [V3 Visual QA #42552701712](https://github.com/Pixman022/fresnica-ui/actions/runs/42552701712) **双作业成功**：Chromium 多视口/双主题/动效通过，Firefox 与 WebKit 分别完成九屏正向 8 + 逆向 8 次，页面脚本异常 0。此为一次完整 CI 成功，不代替真实设备视觉/GPU 验收；若未来同场景再复现，优先检查保留的滚轮追踪证据，而不是调大超时。

- **2026-11-09 · 三组高优先级 CSS 层叠复核**：对照 V3 当前样式加载顺序（内联 m28 → `m29-polish.css` → 内联 m47 → m53，以及独立 `m50-desktop-preview.css`），确认：① 导航 `.top-nav` 的 `gap/padding` 逐层配合 <=680px、<=375px、<=360px 和触控目标尺寸；② `.back-to-top` 的 m16 位置/展开及 <=680px 第五屏避让、m53 中性按钮配色属于不同职责；③ 第五屏 `.workspace-mini` 的 16:9 布局与 `.dp-receive-card` 在 m50 中的 1100/800/680px 及矮屏分支属于适配层，不应凭选择器重复次数删除。既有 [#42552701712](https://github.com/Pixman022/fresnica-ui/actions/runs/42552701712) Chromium 14 组视口/主题与 Firefox/WebKit 九屏回归成功，未见需立即改样式的可复现故障。此结论仅是**重点候选的源代码分类及自动化几何证据**，不等同人工批准所有 34 组候选、真机颜色或 GPU 视觉；因此没有擅自合并 CSS。移动端 iOS/Android 品牌图标的实际尺寸/一行排版已另加浏览器回归（`scripts/check-website-v3-browser.mjs`），等待该次独立 CI 结果。

## 发布前单独决策（本轮不擅自开启）

- [ ] 经确认的 iOS/Android/桌面端官方下载链接与发布状态。
- [ ] 联系方式、隐私/条款文档和产品安全承诺经事实核对。
- [ ] 确认公开收录策略后再移除预览站的 `noindex,nofollow`。
- [ ] 隐藏/移除调试用球体参数入口须经网站最终版本设计决定；预览阶段保留。
- [ ] 真实 GPU/移动设备、macOS Safari 原生缩放及设计负责人逐屏视觉确认（执行记录和样本模板见 [V3 真实设备验收记录模板](v3-device-performance-acceptance-2026-11-09.md)，目前均未以真实硬件签收）。

## 初始证据

- 2026-11-06 部署 [#42151892321](https://github.com/Pixman022/fresnica-ui/actions/runs/42151892321) 成功；Windows Edge 缩放 [#42151892186](https://github.com/Pixman022/fresnica-ui/actions/runs/42151892186)、Windows/macOS [#42151892204](https://github.com/Pixman022/fresnica-ui/actions/runs/42151892204) 成功。
- 最新视觉 QA [#42151916677](https://github.com/Pixman022/fresnica-ui/actions/runs/42151916677) Chromium 作业成功，Firefox/WebKit 九屏测试在第四屏反向回第三屏均超时：不能宣称整套 CI 已通过。

## 执行记录

- **2026-11-09**：工作计划建立；P0 通过事件探针与对照测试定位到测试过早发出滚轮（真实 UI 的惯性保护仍在生效），调整测试同步后 Firefox/WebKit 两引擎 16 次切换均通过，未修改生产滚动行为。P1 已修复 320px 回顶遮挡并通过 Chromium/跨平台/原生缩放回归，预览站已重新部署 [#42547905593](https://github.com/Pixman022/fresnica-ui/actions/runs/42547905593)。
- **2026-11-09 · P2 基线核查**：既有走马灯空闲生命周期测试通过（初始离屏帧数 0，展示时 RAF 继续运行）；真实 GPU、持续 FPS/CPU/内存指标依然未验收，保留待办，不为了微优化改动已签定的视觉效果。
- **2026-11-09 · P2 CSS 层叠候选清单**：对 V3 的 14 组内联 `<style>` 和 5 个外部 CSS（m13/m14/m15/m29/m50）进行静态规则扫描；检索到 1,594 组可识别规则，74 组相同选择器及媒体条件的重复定义，其中 34 组的声明值存在差异。此为**候选数量，不代表实际冲突或页面缺陷**；扫描器未进行完整 CSS 级联计算，不能据此直接删除。优先人工检查：① 顶部导航 `html.m10-framed .site-header .top-nav` 在 m28、m47、m29 的间距/内边距覆盖；② `html.m10-framed .back-to-top` 在 m16 与 m53 的交互过渡覆盖；③ 第五屏 `#v3-workspace .workspace-mini` 及 `.dp-receive-card` 在不同断点/设计版本的布局覆盖。暂不重构，待 320/390/720×450/1440px、中英/双主题及动画截图验证后，逐项移除确认为冗余的声明。

- **2026-11-09 · P2 8 组可重复性能基线**：新增 `scripts/check-website-v3-performance.mjs`，并接入 V3 Chromium QA 产物 `performance-baseline.json`；初次成功的完整 [#42550383016](https://github.com/Pixman022/fresnica-ui/actions/runs/42550383016) 记录：正常动效下首屏约 15 个 RAF 时间戳/秒、1.6s 采样期间约 1,517ms 主线程任务耗时；第二屏为 0 RAF 回调、约 226ms 任务；第六屏约 96 RAF 回调、约 171ms 任务；第七屏约 97 RAF 回调、约 281ms 任务。减少动态模式下，四场景均为 0 RAF 回调。**解释边界**：CI 可能采用软件渲染，任务时间不是 CPU 百分比，RAF 时间戳不是 GPU 帧率，单次样本尚不能证明真实设备卡顿。首屏是优先进一步定位的热点，不因此直接削减已确认的中心静态 Logo 与球体视觉。仍需真实 GPU/设备复核与前后对照后才可关闭优化项。

- **2026-11-09 · 首屏静态 Logo Path2D 局部优化**：首屏帧循环仍绘制原有球体、粒子与 Logo；仅将中心白色点阵 Logo 的每点独立 `fill()` 合并为尺寸/数据变化时重建的单个 `Path2D`，防止逐帧重复提交相同静态圆点。优化后的 [Chromium QA #42551785819](https://github.com/Pixman022/fresnica-ui/actions/runs/42551785819) 已通过 14 组视口/主题、79 张截图、20 个桌面模块及性能 8 组采样。该次首屏采样约 23.5 个 RAF 时间戳/秒、1,527ms 主线程任务时间（先前约 15 个/秒、1,517ms）；**不同 CI 运行存在噪声，不能仅凭这两点证明 FPS 改善或 CPU 下降**。应保留后续真实硬件测量待办，当前不进一步削减球体粒子。另 WebKit 九屏偶发在第 4→5 屏无动作，已在测试中记录输入事件并明确将每次真实鼠标滚轮定位到非交互画布边缘，等待独立完整回归。

- **2026-11-09 · WebKit 回归与实机验收准备**：CI [#42552046399](https://github.com/Pixman022/fresnica-ui/actions/runs/42552046399) 的 Chromium 作业通过，WebKit 仍偶发第 04→05 屏无动作；轮询日志表明滚轮事件已送达页面。测试修正为先等待 M13 把内联 `scrollBehavior` 从 `auto` 恢复（动画真实结束），再等待 110ms 惯性保护，而非仅凭驻留位置进入 12px 容差；无生产滚轮改动。加入非交互区域鼠标滚轮坐标检查与事件诊断，等待最新 CI 确认。为真实 GPU、移动端、Safari 与设计验收新增 [设备记录模板](v3-device-performance-acceptance-2026-11-09.md)；此为流程准备而非实机结果。
