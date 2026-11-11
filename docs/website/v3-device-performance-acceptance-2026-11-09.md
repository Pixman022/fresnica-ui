# Fresnica V3 真实设备动效与视觉验收记录模板

> 建立日期：2026-11-09  
> 状态：**待真实设备执行；此文档不是已通过的验收记录**。  
> 目标分支：`design/website-vision-motion-concept-2026-10-27`。官网预览：`https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/`。  
> 边界：本项目的 GitHub Actions、无头 Chromium、Linux WebKit/Firefox 与 Windows Edge 虚拟机结果不能替代真实 GPU、macOS Safari 或用户设计签收。

## 一、测试前提

1. 记录 **Git 提交 SHA、测试 URL、测试日期、操作系统版本、浏览器版本、设备型号、GPU 型号、屏幕分辨率、实际 DPR/缩放、刷新率、是否接电及系统省电模式**；正式验收不要只记录「Chrome 可用」。
2. 确认使用本分支当前部署而非旧缓存。清理页面缓存或硬刷新；记录是否启用硬件加速。页面全部九屏、浅色/深色、中/英文应可切换。
3. 先关闭 DevTools 录制，在同一场景驻留 10 秒预热；再进行录制。尽量避免屏幕录像及其他 GPU 大负载同时运行。**不要在录制中修改球体参数**。
4. 优先实际硬件：① Windows Chrome/Edge + 独显或核显；② macOS Safari；③ iOS Safari；④ Android Chrome。缺少任一类别，只记录「未测」，不得用 CI 结果填入。

## 二、复测场景（正常与减少动态各测一遍）

| 章节 | 场景 | 重点观察 |
| --- | --- | --- |
| 01 · `overview` | 首屏球体及中心白色点阵 Logo | 球体绘制、外壳粒子流畅性、静态 Logo 形状与闪烁状态、主题对比 |
| 02 · `v3-ecosystem` | 中心绿点/粒子/电流 | 粒子聚合、电流进出、第二屏至第三屏的黑点扩张 |
| 06 · `v3-for-you` | 自动走马灯 | 连续平滑滚动；切换离屏后停止；回屏恢复 |
| 07 · `v3-security` | 粒子安全形状 | 轮廓清晰度、移动跟随、驻留不卡顿、离屏后停止 |

额外检查：九屏依次前进 8 次、后退 8 次；在第 04→05 屏以及 05→04 屏多次触发鼠标滚轮，确认页面没有停留、跳屏、输入丢失或尚未完成的覆盖层。窗口变宽/变窄后仍停在正确章节。

**减少动态效果**：使用操作系统或浏览器的 `prefers-reduced-motion: reduce`，确认可阅读静态图形、可原生滚动、动态 RAF 没有持续占用；恢复 `no-preference` 后重复首屏与第六屏检查。不要仅靠暂停按钮替代 reduced-motion。

## 三、实际测量

1. 每个章节分别以 **no-preference / reduce** 两种设置记录 **连续 15 秒、至少三次**；每次记录启动前是否清缓存。若需比较优化前后，保持同一硬件、主题、视口、DPR、浏览器版本与电源设置。
2. Chrome/Edge：DevTools Performance 录制并保存 `.json` trace；查看 Frames/Rendering、Main Thread 的 Long Tasks（单次超过 50ms）及 Scripting/Painting。Memory/Performance Monitor 记录 JS Heap 的变化，检查离屏动画是否仍有活动。Chrome Task Manager 或操作系统工具可附记 GPU/CPU 占用，但**不可**把 Chrome 的 `TaskDuration` 等价为 CPU 利用率。
3. macOS Safari：Web Inspector 的 Timelines 记录 JavaScript、Rendering、Layout 及帧卡顿；如有系统级 GPU 诊断，注明采样工具与权限。WebKit 自动化测试通过不等于 Safari 原生通过。
4. iOS/Android：分别在正常/省电模式状态记录触控滚动、发热/功耗感知、掉帧、文字截断与横向溢出。可通过连接桌面调试工具进行帧分析；不具备调试连接时，标注「仅手动视觉检查」，不要推断 FPS。
5. 记录滚轮、动画、深浅主题、中英互换后是否出现视觉回归，特别是首屏中心白色点阵 Logo、第四屏卡片曲线圆点、第五屏四模块桌面示例与移动端平台品牌图标。设计审核人与技术复核人分列，不能互代。

## 四、结果填写

| 设备 / 浏览器 / 版本 | 章节 / 模式 | 3 次帧时间 / 掉帧 / 长任务 | JS 堆变化 / GPU/CPU（带工具名） | 视觉与滚轮现象 | 证据链接 | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
| 未测 | 01 / 正常 | 待填 | 待填 | 待填 | 待填 | **未验收** |
| 未测 | 01 / 减少动态 | 待填 | 待填 | 待填 | 待填 | **未验收** |
| 未测 | 02、06、07 / 正常与减少动态 | 待填 | 待填 | 待填 | 待填 | **未验收** |
| 未测 | 九屏双向滚动 / 正常 | 待填 | 待填 | 待填 | 待填 | **未验收** |

**判断原则**：先对同一设备下 3 次采样进行比较，再决定是否值得优化；不要用 GitHub CI 无头浏览器 FPS 判断真机流畅性。视觉、互动、掉帧、功耗的正式通过阈值应由产品/设计与工程共同确认，未确认时结论写「待定」而非擅自设定阈值。

## 五、已有自动化证据（非真实设备签收）

- [V3 完整 QA #42551785819](https://github.com/Pixman022/fresnica-ui/actions/runs/42551785819)：球体静态 Logo Path2D 调整后的 Chromium/Firefox/WebKit 自动检查成功。
- `scripts/check-website-v3-performance.mjs`：4 章节 × 正常/减少动态，输出 `performance-baseline.json` 到 V3 Chromium QA 工件。指标为 RAF 执行/回调开销、Chrome 主线程任务时间、JS 堆和 CSS 动画数；**不能当作真实 GPU 帧率**。
- `scripts/check-website-v3-carousel-idle.mjs`：验证第六屏离屏、减少动态、键盘焦点、隐藏标签页时 RAF 挂起与恢复。
- `scripts/check-website-v3-engine-scenes.mjs`：Firefox/WebKit 双向九屏自动滚轮测试，继续以最新运行结果作为回归门槛。

## 六、验收收口条件

- 四个指定动态章节至少在实际 Windows GPU 浏览器及实际 macOS Safari 完成正常/减少动态采样；手机浏览器按正式发布范围补齐。
- 九屏进退、第四到第五屏、首屏点阵 Logo、深浅主题/双语均无阻断性问题。
- 每个异常有截图/trace、设备信息、复现条件与修复前后对照；没有数据不能宣称「已达到目标帧率」。
- 技术回归通过与设计负责人视觉批准分别有记录；正式下载、法律文案及收录策略仍按 [V3 稳定性计划](v3-quality-stabilization-plan-2026-11-09.md) 单独决策。

## 七、2026-11-11 · 可选网页采样工具（当前仅就绪，尚无实测数据）

仓库在 V3 预览加入了 **只通过 `?debug=perf` 启用** 的本地性能采样工具，操作步骤见 [`v3-real-device-performance-capture-2026-11-11.md`](v3-real-device-performance-capture-2026-11-11.md)。

1. 在实际设备打开 `https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/?debug=perf`。普通入口不会加载采样脚本。
2. 找到页面左下角 `FRESNICA · DEVICE PERF`，在指定章节静置十秒后点击 **Record 15 s**。同一章节/主题/动态模式至少记录三轮。
3. 点击 **Export JSON** 保留浏览器 rAF 调度间隔、支持时的长任务/长动画帧、Chrome 可提供的 JS 堆变化和测试环境字段。
4. 导出文件仅在用户主动点击时由浏览器生成，不自动上传。含浏览器标识和设备能力字段，分享前可检查脱敏。
5. JSON 中 `p95IntervalMs`、`gapsAbove33Ms` 是观察线索，**不是渲染 GPU 帧率/真实掉帧数**。Firefox/Safari 缺少的 API 为 `null`，不得填成零。需结合各平台原生 Profiler/Timeline 和设计/交互签收完成最终验收。

[浏览器自动化 #42972356755](https://github.com/Pixman022/fresnica-ui/actions/runs/42972356755) 已通过调试工具访问、短样本和 JSON 导出的功能验证，但这不是实际设备测试。当前四类物理设备结果仍为 **未验收**。
