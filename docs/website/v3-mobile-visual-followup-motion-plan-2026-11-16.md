# Fresnica V3 · 移动端截图后续优化与第二屏粒子恢复计划（2026-11-16）

## 目标、决策及改动边界

基于用户最新移动端长截图和首屏截图、现行移动端视觉优化计划及 V3 当前源码。用户要求**制定工作计划、开始工作；恢复移动端第二屏的粒子动效，其他保持不变**。

本轮优先执行唯一明确指定的视觉变更：恢复移动端第二屏（`#v3-ecosystem`）灰色粒子从外侧沿直线向中央绿点收敛的循环动画。其他建议仅记录为后续候选，**本轮不实施**，以免在已确认的移动端画面上引入额外改动。

- 只修改 V3 分支 `design/website-vision-motion-concept-2026-10-27`；保留冻结主分支和 V2 网站。
- 保留第二屏 **136 个粒子**、原移动端 **2.2–4.6px** 尺寸、灰色粒子/绿色中心配色、现有分布与上下标题位置。
- 不增加 WebGL、`requestAnimationFrame` 或新定时器；复用已有 CSS 粒子流入动画与 `m14-current` 页面可见性管理。
- 移动端（宽度 ≤680px）且 **无“减少动态效果”设置**时恢复粒子连续运动；进入第二屏时开始，离屏或切后台/打开菜单时暂停。
- 用户启用 `prefers-reduced-motion: reduce` 时，第二屏仍为原静态粒子分布，不允许运动覆盖静态规则。
- 球体、Logo、其他粒子效果（中心绿点呼吸光晕、电流、盾牌与页脚）、菜单、桌面端、暗黑配色等**保持现状**。

## 评估建议及优先级

| 优先级 | 截图建议 | 本轮处理 |
| --- | --- | --- |
| P0 | 恢复第二屏移动端粒子流向中心的动效 | **执行**：仅 CSS 动画 + 生命周期回归 |
| P1 | 首屏球体在首屏视野内更明显；球体相对文案上移 | 记录；本轮保持不变 |
| P1 | 核对手机正文小字号、第五屏桌面示例内部可读性 | 记录；本轮保持不变 |
| P1 | 第六屏卡片占比、第七屏盾牌轮廓对比 | 记录；本轮保持不变 |
| P2 | 首屏按钮自然宽度一致性、第四屏辅助文字 | 记录；本轮保持不变 |
| P2 | 顶部 Logo/大标题、第三屏手机展示 | 现有方案保留 |

## 验收步骤

1. 源码核对：只改变第二屏移动端动画开关和专用关键帧；粒子数量、大小、分布、静态 Fallback、其他页面保持不变。
2. 视觉 QA 在移动端 `no-preference` 检查：
   - 首页时第二屏粒子处于 paused；
   - 导航到第二屏时动画 `running`，粒子实际位置发生变化；
   - 离屏时暂停；切后台与菜单展开时也暂停；
   - 移动端点数、点径、外侧起点以及布局安全区保持不变；
   -  `reduce` 仍静止。
3. 同时保留桌面粒子动效、其他三块静态 Canvas、四模块桌面示例、九屏滚动、中英文及深浅主题回归。
4. 读取 GitHub Actions 的 Chromium 视觉 QA、Firefox/WebKit 和 Pages 部署结果。如 CI 未完成/不通过，明确记录原因，不宣称通过。
5. 真正 Android/iOS 上的流畅度和功耗仍需真实设备采样，本轮自动化只能验证行为，不能替代真机 FPS/视觉签收。

## 执行记录

- [x] 读取 V3 最新源码与此前移动端计划，确认动效被 `m62-mobile-static-particles` 屏蔽。
- [x] 修改第二屏移动端粒子 CSS：提交 [f908931](https://github.com/Pixman022/fresnica-ui/commit/f908931fdd14372161b7bf1498272f12d1f6b8c2)，将原静止样式限定为 `reduce`，在 `no-preference` 仅为第二屏灰点恢复向中心流动的关键帧；保留 136 点/原尺寸/原分布及中心光晕、电流静止行为。
- [x] 更新浏览器回归：提交 [0084eb3](https://github.com/Pixman022/fresnica-ui/commit/0084eb3979f26b4719ed04ce11b32bbd7d9bebad)，验证进屏运行、真实位移、菜单暂停、离屏暂停和 `reduce` 静态降级，以及桌面原有动画。
- [x] [GitHub Pages 部署](https://github.com/Pixman022/fresnica-ui/actions/runs/43824140851) 已成功，预览地址不变。
- [x] **最终 V3 浏览器 QA 已通过**：[更新测试后的完整视觉 QA #43824200669](https://github.com/Pixman022/fresnica-ui/actions/runs/43824200669) 双作业 success；日志为 `mobile-393 screen-two particle motion PASS (visible, menu, offscreen, reduce)`，18 组视口/主题、163 张截图，`0 findings`。四模块桌面演示（20 项）、九屏双向切换、动效、走马灯空闲与 WebGL 恢复等检查均通过。
- [x] **跨系统和部署通过**：[Windows/macOS QA #43824140955](https://github.com/Pixman022/fresnica-ui/actions/runs/43824140955)、[Windows Edge 缩放 #43824140902](https://github.com/Pixman022/fresnica-ui/actions/runs/43824140902)、[GitHub Pages #43824140851](https://github.com/Pixman022/fresnica-ui/actions/runs/43824140851) 均 success。
- [x] **解释中间版本失败**：较早的 [#43824140824](https://github.com/Pixman022/fresnica-ui/actions/runs/43824140824) 使用旧版“移动端必须静止”断言，在恢复动效后因 `ecosystemStill=false` 失败；随后明确更新断言，并由最新 QA 验证动态/静态两种行为通过。
- [x] **补充移动端性能观测**：新增 [脚本 14c401d](https://github.com/Pixman022/fresnica-ui/commit/14c401d915fcf81419f55d9e70f9fd46d71635db)，在 Chromium 移动模拟 `393×852@2x` 下，对第二屏正常/减少动态模式各执行 3 次 1.6 秒稳定驻留采样，记录 CDP 主线程 TaskDuration、ScriptDuration、LayoutDuration 和 JS 堆。集成 [QA 工作流 ece0a4c](https://github.com/Pixman022/fresnica-ui/commit/ece0a4ca25a44a8883389280ec2bd751ab41f42f)，原有 8 组桌面样本不变，输出单独的 `mobile-particle-load.json`。该数据仅是 CI 浏览器线索，不能说明移动端 GPU/FPS/功耗。
- [x] **性能观测及回归通过**：[V3 Website Visual QA #43825130246](https://github.com/Pixman022/fresnica-ui/actions/runs/43825130246) 两个作业均 success；新增的 `mobile-particle-load.json` 报告为 `PASS`，6 组样本、0 failures。原有 Chromium 18 组视口/主题、163 张截图 0 异常，Firefox/WebKit 也通过。
- [x] **实测数据记录（仅 CI 模拟）**：393×852 @ DPR 2，136 CSS 点，取样窗均为约 1.6 秒。正常动效 TaskDuration 为 `182.2 / 0.7 / 0.9ms`，减少动态模式为 `0.6 / 0.1 / 0.3ms`，中位数分别 `0.9ms`、`0.3ms`。首轮正常动效明显偏高，可能包含首帧启动或其他任务；无原生 trace 不能归因于粒子，不能据此得出真实设备不卡顿或已改善的结论。两种模式的 ScriptDuration 和 LayoutDuration 记录均为 0ms，JS 堆读数分别约 3.2MB 与 2.6MB；不同浏览器上下文不应用这组堆读数断言内存节省。
- [x] **不调整已确认视觉**：此次仅新增 QA 脚本、工作流入口和记录，无生产 CSS/JS 修改。
- [ ] **真实 Android/iOS 设备签收**：需实际确认流畅度、耗电、设备温度及视觉体验；浏览器模拟和 CI 不构成真实设备性能验收。
