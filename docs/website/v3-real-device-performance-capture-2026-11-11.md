# Fresnica V3 实际设备性能采样操作说明 · 2026-11-11

> 状态：**采样工具已实现，真实物理设备测试仍未执行；不是性能验收通过证明。**
>
> 仅对应 `Pixman022/fresnica-ui` 的 V3 预览分支。正式下载与钱包 App 不在此项范围。

## 一、调试入口及数据边界

- 普通预览：[Fresnica V3](https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/)：不请求、加载或运行设备采样脚本。
- 明确启用：[设备采样模式](https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/?debug=perf)：页面左下方出现 `FRESNICA · DEVICE PERF`，手动采样；不要把 `?debug=perf` 作为正式官网入口。
- 球体参数调试仍独立使用 `?debug=orb`，不要在性能采样时调参数。
- 采样在浏览器本机运行，不自动上传、不请求第三方服务、不保存到本地持久存储。点击 **Export JSON** 才生成 JSON 文件，由测试者决定是否分享。
- 导出文件包含 User-Agent、视口尺寸、DPR、逻辑屏幕尺寸、部分硬件能力字段；如需分享给外部，请先检查设备信息并按需要脱敏。

## 二、测试步骤（每台设备）

1. 记录设备型号、OS/浏览器版本、GPU（如知道）、显示刷新率、是否充电、省电模式和是否启用硬件加速；这些信息不由网页探针推断。
2. 打开上述 `?debug=perf` 链接，完成页面加载。选择本轮目标的语言（英文/中文）、深浅主题与系统动态设置（正常/减少动态），不再在同一记录中切换设置。
3. 使用右上角页面导航进入指定章节，等待 10 秒使页面与 GPU 状态稳定；在不滚动、不切换窗口的情况下点击 **Record 15 s**。
4. 记录结束后再次点击 **Record 15 s**，同一章节、同一设置至少完成三轮。若浏览器切后台、发生滚动/缩放或中途切换章节、主题、语言、系统动态偏好，采样将标为 `validHold=false`，应重新录制；即使最后返回原始设置也不算有效。
5. 点击 **Export JSON**，保存并命名设备信息；同一页面内记录的多次采样会合并在一个 JSON 文件。每轮样本均记录开始时的视口宽高和 DPR，避免中途在两轮之间改变窗口大小后混入同一组。对每个目标章节重复第 3—5 步。
6. 切换 `prefers-reduced-motion: reduce` 后重新载入采样页，重复同样流程；不要用网站内的暂停按钮替代系统减少动态设置。
7. 附上真实浏览器开发者工具的 Performance/Timelines 记录与手动视觉观察，按 [真实设备验收模板](v3-device-performance-acceptance-2026-11-09.md) 整理，负责人审阅后才可确认验收。

### 四个重点章节

| 章节 | ID | 核对内容 |
| --- | --- | --- |
| 01 · 首屏 | `overview` | 球体壳层、白色粒子 Logo、桌面与窄屏下的持续绘制 |
| 02 · 连接体验 | `v3-ecosystem` | 粒子/中心绿点、电流、完整驻留及黑点切屏 |
| 06 · 走马灯 | `v3-for-you` | 自动滚动是否流畅，离屏是否停止 |
| 07 · 安全性 | `v3-security` | 粒子盾牌轮廓清晰与动画占用 |

每个章节建议 **正常 / 减少动态各三轮 × 15 秒**。跨主题、双语和双向九屏操作另外做视觉/交互签收，不要在一条性能记录中同时切换多个状态。

## 三、JSON 字段与正确解释

| 字段 | 含义 | 限制 |
| --- | --- | --- |
| `scene`, `sceneEnd`, `validHold` | 章节、前后台及主题/语言/动态偏好是否稳定，期间是否触发滚动或视口尺寸变化 | `validHold=true` 仅表明这些检查未发现干扰，并不等于性能达标 |
| `viewport`（单条样本） | 本次采样开始时的视口宽高及 DPR | 不以导出时的最终视口替代所有记录 |
| `changedDuringSample` | 标明期间是否出现滚动、视口尺寸变化、深浅主题、中英文或动态偏好切换 | 任意字段为 `true` 时该轮数据不应用于稳定驻留对比 |
| `rafScheduling.meanIntervalMs`, `p95IntervalMs`, `maxIntervalMs` | 调试采样循环在主线程获得 rAF 回调的间隔 | **不是 WebGL 实际 FPS，不是实际显示帧率**；记录循环本身会增加少量负载 |
| `gapsAbove33Ms`, `gapsAbove50Ms` | 该采样循环在观察期内出现较长 rAF 间隔的次数 | 不能直接当“掉帧数”，需结合设备刷新率与原生 trace |
| `longTasks`, `longAnimationFrames` | 浏览器 PerformanceObserver 支持时记录的长任务/长动画帧 | 不支持时为 `null`，不能解读为 0 |
| `heapUsedMB` | 浏览器可提供的 JavaScript 已使用堆（起始/结束） | 只是一部分内存，不包括 GPU 或总进程内存；不支持时为 `null` |
| `environment` | 浏览器标识、视口、DPR、屏幕及可用设备参数 | 不足以推断 GPU/机型；仅记录浏览器公开数据 |

### 特别注意

- 此工具用于**可重复采样和发现异常的线索**，不会提供真实 GPU FPS、功耗、设备温度或严格的 CPU 利用率。
- 不能以采样脚本的 rAF 数值代替 Chrome/Edge Performance trace、macOS Safari Timelines 或手机端原生工具；也不能直接从 CI 的 1.6 秒数据推断手机性能。
- 正式对比优化前后的效果，务必保持同一硬件、显示刷新率、系统/浏览器、电源模式、主题、DPR、章节和视口；数据最好保存三次原始记录，而非仅报单个平均值。
- 无设备数据的项目始终记录 **未验收**；不设定未经用户批准的 FPS 门槛，不因低于任意虚构指标而修改当前粒子数量与视觉效果。

## 四、技术核查

- 入口只在 `?debug=perf` 时动态加载 `v3-perf-probe.js`；普通访问不会加载此文件。
- `scripts/audit-website-v3.mjs` 校验该调试入口仍是手动启用、脚本保持无网络上传接口。
- `scripts/check-website-v3-browser.mjs` 核对普通访问没有调试面板；调试模式可生成短样本并执行本地 JSON 导出。CI 用短样本只检验功能，**不是设备性能验收**。
- 正式物理设备测试与设计签收仍记录到 [主验收模板](v3-device-performance-acceptance-2026-11-09.md)，在所有设备实际采样完成前继续维持“待验收”。

## 五、离线整理多轮 JSON（不会上传采样文件）

将仓库更新到包含 `scripts/summarize-website-v3-device-performance.mjs` 的 V3 分支。在 Windows PowerShell 项目根目录运行：

```powershell
node scripts/summarize-website-v3-device-performance.mjs "C:\测试数据\我的设备记录.json" > v3-device-summary.md
```

若有多份记录，可在命令末尾继续加入其他 JSON 路径。生成的 Markdown **按文件分别汇总，不跨文件合并未知硬件**；同一文件内进一步按章节、正常/减少动态、主题、语言、每轮实际视口及 DPR 分组。

脚本只将 `validHold=true`、中途无变化、每轮至少 14 秒、逐轮视口数据齐全、存在有效 rAF p95 的样本计入中位数。只有同组至少 **三次合格记录**才标注“够三轮”；这仍不是性能通过或正式真机签收。不支持的长任务/JS 堆数据记为 `—`，不会错误解释为零。

脚本不联网、不修改输入 JSON。自带合成数据回归，可用 `node scripts/test-website-v3-device-summary.mjs` 运行。对比结果须结合设备信息、真实 Performance/Timelines 记录与设计验收。
