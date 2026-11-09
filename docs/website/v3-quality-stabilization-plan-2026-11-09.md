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

- [ ] 测量首屏球体、第二屏粒子、第六屏走马灯、第七屏安全粒子在正常/减少动态模式下的 RAF 活动与性能；避免只凭感觉判断性能。
- [ ] 仅针对实测热点降低粒子或绘制占用，严格保留已经确认的球体中心静态点阵 Logo。
- [ ] 梳理已追加的重复/冲突 CSS 规则，整理候选清单；不在 P0 故障排查时大规模重构。

**验收**：提供可重现的性能记录，优化不影响画面和通过的现有回归。

## 发布前单独决策（本轮不擅自开启）

- [ ] 经确认的 iOS/Android/桌面端官方下载链接与发布状态。
- [ ] 联系方式、隐私/条款文档和产品安全承诺经事实核对。
- [ ] 确认公开收录策略后再移除预览站的 `noindex,nofollow`。
- [ ] 隐藏/移除调试用球体参数入口须经网站最终版本设计决定；预览阶段保留。
- [ ] 真实 GPU/移动设备、macOS Safari 原生缩放及设计负责人逐屏视觉确认。

## 初始证据

- 2026-11-06 部署 [#42151892321](https://github.com/Pixman022/fresnica-ui/actions/runs/42151892321) 成功；Windows Edge 缩放 [#42151892186](https://github.com/Pixman022/fresnica-ui/actions/runs/42151892186)、Windows/macOS [#42151892204](https://github.com/Pixman022/fresnica-ui/actions/runs/42151892204) 成功。
- 最新视觉 QA [#42151916677](https://github.com/Pixman022/fresnica-ui/actions/runs/42151916677) Chromium 作业成功，Firefox/WebKit 九屏测试在第四屏反向回第三屏均超时：不能宣称整套 CI 已通过。

## 执行记录

- **2026-11-09**：工作计划建立；P0 通过事件探针与对照测试定位到测试过早发出滚轮（真实 UI 的惯性保护仍在生效），调整测试同步后 Firefox/WebKit 两引擎 16 次切换均通过，未修改生产滚动行为。P1 已修复 320px 回顶遮挡并通过 Chromium/跨平台/原生缩放回归，预览站已重新部署 [#42547905593](https://github.com/Pixman022/fresnica-ui/actions/runs/42547905593)。
- **2026-11-09 · P2 基线核查**：既有走马灯空闲生命周期测试通过（初始离屏帧数 0，展示时 RAF 继续运行）；真实 GPU、持续 FPS/CPU/内存指标依然未验收，保留待办，不为了微优化改动已签定的视觉效果。
