# Fresnica V3 官网设计规范对齐验收记录 · 2026-11-04

## 范围与基准

- 代码：`design/website-vision-motion-concept-2026-10-27`，V3 官网 `public/fresnica-v3-motion-preview/`，**不含冻结的 V2**。
- 设计来源：`docs/design-system/design-rules.md`、`design-tokens.md`、`cross-platform-core.md` 和 `platform-adaptation.md`。
- 验收使用 GitHub Actions Ubuntu 26.04 Runner 上的系统 Chrome、Node 22，按本分支源文件启动本地静态 HTTP 服务；不以公共 Pages 缓存版本代替分支源码。

## 已完成的检查

| 维度 | 结果 | 证据或限制 |
| --- | --- | --- |
| 独立静态规范审核 | **通过** | `npm run audit:website-v3`：73 个 ID、9 个内部锚点、17 次本地资源引用、5 张卡片；检查主色、AA 按钮对比度、禁用交易示例与关键动画存在 |
| CSS 样式块结构 | **通过** | 检测 `<style>` 标签配对与嵌套，防止移动端规则被错误嵌入造成无效样式 |
| 浏览器截图 | **已生成** | 7 个视口 × 2 个主题 = 14 组；基础截图 55 张，新增中文布局截图 24 张，另附动效关键状态和 CSS Zoom 2x 截图；并非全部经设计所有者逐张签收 |
| 页面横向溢出 | **通过** | 14 组均记录 `scrollWidth-innerWidth = 0` |
| 顶部交互控件尺寸 | **通过** | 主题/语言/章节/下载目标在所有视口均至少约 40px 宽、44px 高；未出现视口边缘截断 |
| 语言切换与换行 | **通过（自动）** | 桌面、430px、320px 均执行简体中文切换、深浅主题和核心标题溢出检查；320px 第四屏断行已修复为自然两行 |
| 菜单与键盘焦点 | **通过** | 使用键盘 Enter 打开章节/下载/语言菜单，Esc 关闭后焦点返回按钮；未替换原有交互 |
| 主题切换与产品示意 | **通过（自动）** | 主题根状态正确，五张卡片在 DOM，支持 reduced-motion；另用 no-preference 模式对五卡动画启动、复位与关键时序完成专项验证 |
| 下载占位 | **通过** | 未上线示意按钮继续保持禁用 |
| 移动端第四屏卡片安全区 | **通过** | 320/360/393/430px 的首卡实际左侧间距为 **24px**；不再裁切「Manage assets」的首字 |
| 主要按钮静态对比度 | **通过** | 白字/填充绿：浅色 5.50:1，深色 5.63:1，满足普通文字 AA 4.5:1 |
| 第 5 屏桌面下载按钮边界 | **通过（自动 + 重点截图复核）** | 1440px、768px 和 720×450 近似视口，双主题 reduced-motion 下按钮须留在屏内；确认 1440px 中英文深浅主题截图均完整显示 |
| Chromium 原生页面 Zoom 200% | **通过（最新 CI + 本地）** | 有界面 Chromium 通过 X11 键盘快捷键原生缩放，1440×900 变为 CSS 720×450、DPR 2，非 CSS zoom；EN/zh-CN × light/dark 检查导航热区、按钮/标签栏间距、横向溢出与控制状态，增加可重复 CI。1280×800 的 CSS 640×400 原生缩放场景仅做了本地检查 |

### 最新可复查证据

- [第五屏四模块 Linux Chromium/Firefox/WebKit QA（全部成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41792595032)（20 + 40 个模块布局/切换断言、对应桌面和小尺寸截图）；[跨系统 QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41792945973)；[部署（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41792595063)。

- [第三屏 Send/Receive/Swap 图标修复后 Linux QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41789060919)、[Windows/macOS QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41789085384) 与 [V3 Pages（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41789022690)；[Windows Edge 原生 200% 缩放（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41789022659)。

- [Windows Edge/Firefox 与 macOS WebKit 跨系统 CI（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886750)：21/21 PASS、0 失败；[同步 Linux V3 全套 QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886749)；[修复版 GitHub Pages（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886747)。短高视口的 WebKit 右侧示例通过修复前失败、修复后通过的独立断言。

- [最新 V3 Linux Firefox/WebKit 九屏与 Chromium 全量 QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41781419359)：Firefox/WebKit 8 次前进 + 8 次反向各通过，第 4～9 屏双引擎截图归档，Q&A WebKit 崩溃修复保留回归；Chromium 原有测试成功。

- [V3 Firefox/WebKit 正常动效补充与 Chromium 全量回归（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41768662316)：engine-results.json 12/12 PASS、engine-motion-results.json 2/2 PASS，含两种引擎的圆点扩张和第三屏手机完整入场截图；原有 Chromium QA 亦通过。

- [V3 Firefox/WebKit 双引擎与既有 Chromium QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41767698389)：Linux Firefox/WebKit 12/12 场景 PASS、失败 0；独立 fresnica-v3-browser-engines-qa Artifact 保存四张对比截图与 engine-results.json；原有 Chromium 视觉/动效/原生缩放回归亦成功。

- [V3 九屏滚动/视口变化综合 QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41766299879)：新增 `transition-results.json` 为 **PASS、5 个场景、0 个失败**；九屏前进、三个逆向回归、绿色圆点扩张、中途调整窗口尺寸及 Esc 清理、减弱动效原生滚动均通过；关键转场截图两张，原有截图/五卡动效/走马灯生命周期及原生 Zoom 200% 回归同轮成功。
- [V3 完整 Chrome QA（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41763615194)，包括新增的走马灯动画生命周期测试，以及既有七视口/双主题、五卡动效、原生 Zoom 200% 回归。该次 fresnica-v3-visual-qa Artifact 中 carousel-idle-results.json 状态 PASS、失败数 0；首屏不再申请走马灯动画帧，进入走马灯页面后继续正常运动。

- [GitHub Pages 修复版预览发布（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41759900489)，对应下载按钮布局源码提交 `047645d`
- [V3 Chromium 最新截图与自动验收（成功）](https://github.com/Pixman022/fresnica-ui/actions/runs/41759917426)，对应回归测试提交 `2479be0`；基础 14 组、中文 6 组、五卡正常动效、CSS zoom 2x 近似场景以及新增第 5 屏按钮边界断言均通过。已核对本次工作流中桌面 1440px 中英文、深浅四张第 5 屏截图，CTA 完整显示。截图与 `results.json`、`motion-results.json` 保存在 `fresnica-v3-visual-qa` Artifact（保留 14 天）
- [V3 官网预览](https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/)

## 发现的问题及处理

1. 页脚 `Experience` 重复及英文简介尾句重复：已删除，同时补充新的中文文本映射。
2. 初始浏览器 QA 因 npm 临时依赖树、Ubuntu 26.04 与较旧浏览器下载器不兼容而未启动：已改为在独立临时目录安装自动化包并启动 Runner 现有 Chrome。
3. 首轮中文页脚检查错误地读取了 `chapter-kicker` 而非正文：已修正选择器；实际截图中的中文翻译没有问题。
4. 移动端第一张功能卡片裁切：修复了样式标签嵌套与横向边距。浏览器断言从 8px 的实测不足，改进到 24px，通过回归检测。
5. 移动端章节截图曾使用居中滚动导致首屏标题被假性截断：已改为从章节起始位置截图，区分截图方法与真实布局问题。
6. 中文 320px 第四屏主标题曾出现不自然的分词断行：缩小仅超窄屏中文标题字号；通过最新深浅主题截图复核，两行展示且未出现横向溢出。
7. 产品示例仍混用 Consolas/Arial：仅将钱包面板、活动数字和桌面端统计/标签切换为 Fresnica 语义字体及 tabular-nums；保持营销主标题字体不变。
8. 记录为 [P2/P3 工作计划](v3-design-system-alignment-plan-2026-11-04.md) 的阶段性自动验收证据；本记录不代替用户/设计负责人最终视觉批准。
9. **桌面端第 5 屏下载按钮被裁切**：审看上轮 1440×900 中英文截图时发现 CTA 在 reduced-motion 下接近或超出页面底部；原因是全局 `.reveal` 的 `transform:none!important` 同时取消了垂直居中所需的 `translateY(-50%)`。`047645d` 针对桌面 reduced-motion 恢复定位位移，保持入口动效禁用；`2479be0` 在自动验收中新增 CTA 相对于章节高度的边界断言。经本地 Chromium 实测及最新 CI 桌面中英深浅四张截图复核，按钮全部完整显示。此项不代表原生 Zoom 200% 或真机验收。

## 2026-11-04 P2 补充：原生页面缩放

- **实现方式**：启动有界面 Chromium，通过 X11 键盘事件实际发送五次 Ctrl+加号。检测 1440px 初始 CSS 视口变为 720px、`devicePixelRatio` 变为 2、`visualViewport.scale` 为 1、CSS `zoom` 仍为 1，以防把样式缩放误报成浏览器原生缩放。
- **问题 A（已修复）**：中文短章节名称导致顶部菜单按钮在 200% 下缩为约 30–32px，低于 40px 目标。提交 `404b9a3` 设定 44px 最小宽度；常规 Chrome QA [#41761537156](https://github.com/Pixman022/fresnica-ui/actions/runs/41761537156) 成功。
- **问题 B（已修复）**：桌面第 5 屏 CTA 在 720×450 CSS 视口中与底部标签栏间距仅约 8px（英文），中文重叠约 5px。提交 `799bf2f` 局部收紧窄而矮视口的标题与文案位置；提交 `7f2f8ac` 新增 CTA 与标签栏至少 12px 的浏览器断言。本地原生缩放回归先失败、修复后通过。
- **复现与归档**：`scripts/check-website-v3-native-zoom.mjs`、`scripts/v3-native-zoom-keys.py`，`.github/workflows/website-v3-qa.yml`；首轮原生缩放 CI [#41761658774](https://github.com/Pixman022/fresnica-ui/actions/runs/41761658774) 成功。新间距断言在 [V3 QA #41762349233](https://github.com/Pixman022/fresnica-ui/actions/runs/41762349233) **执行成功并通过**。已下载核对 CI Artifact：`native-zoom-results.json` 状态 `PASS`、失败数 0、1440×900 的原生缩放实测 CSS 宽 720、DPR 2、CSS zoom 1、8 张 EN/中文 × 双主题的真实缩放截图；其余原有浏览器与动效测试亦通过。截图及报告随 `fresnica-v3-visual-qa` Artifact 上传。
- **性能观察边界**：本地无 GPU 代表性的头less Chromium 抽样显示首屏帧间隔长于其他章节，不能据此判定真机帧率或直接修改已确认的粒子视觉；仍待硬件环境采样与用户视觉签收。

## 2026-11-04 P2 补充：整屏转场与第 6 屏动画调度

- **整屏转场烟测（本地 Chromium 1440×900 / 常规动效）**：使用 V3 公共预览构建资源，内联静态资源后运行整页脚本，依次通过滚轮触发概览 → 生态连接（驻留 scrollTop≈1797）、生态连接 → 移动端下载（圆点扩张后驻留 scrollTop≈3052）、下载 → 五张卡片（驻留 scrollTop≈4633）。三次章节状态识别正确，浏览器脚本异常 0。这是本地无代表性 GPU 的功能烟测，不是全部屏幕的正式视觉/帧率签收。
- **发现并修复离屏性能浪费**：原 m13-revisions.js 的第 6 屏走马灯在不可见时仍每帧执行 RAF 回调。独立 Chromium 场景实测：首屏停留约 0.62 秒，修复前申请 40 次 RAF、修复后 0 次；离开第 6 屏和 reduced-motion 状态不再持续调度。可见时仍保持既定 dt*.037 运动速度，保留 5 张原卡和 5 张用于循环的克隆卡。 在整页 V3 的本地 Chromium 冒烟测试中，进入第 6 屏后的 850ms 走马灯位置从 12px 增至 55px；转入安全屏后停在 56px，之后约 600ms 保持 56px；页面脚本异常 0。
- **保留交互行为**：只有在可见、非减弱动效、标签页未隐藏且无键盘焦点时才启动 RAF；原有用户操作后 4.5 秒暂停和恢复语义保留。重新进入页面不会跳帧推进已停留时间。修改限定于走马灯调度，未改变 Hero 粒子数量、品牌效果和卡片视觉。
- **可重复回归**：源码提交 [0a1ac3a](https://github.com/Pixman022/fresnica-ui/commit/0a1ac3a3582ba65097c2f58bb2d879b504e89fc1)；独立测试 scripts/check-website-v3-carousel-idle.mjs 与 V3 专属 workflow 由 cdc0ff1、b14f279 接入。该测试已验证旧脚本失败、新脚本成功；[V3 QA #41763615194](https://github.com/Pixman022/fresnica-ui/actions/runs/41763615194) 最终通过。已下载并读取该 CI Artifact 中 carousel-idle-results.json：PASS，失败数 0，初始 RAF=0，进入页面后 46 次 RAF、走马灯水平滚动 44px；其余既有测试仍通过。
- **性能结论边界**：证明的是“非活动场景动画帧申请归零”和行为回归，而非网站整体 FPS、GPU 占用或内存降低百分比；这些仍需真实硬件测量和设计视觉审看。

## 2026-11-04 P2 补充：九屏驻留与窗口变更中断

- **问题与复现**：旧版 `m13-revisions.js` 在滚动过渡开始后保存旧视口的固定像素目的地；窗口由 1440×900 改为 1200×720 后仍停在 1797px，而新视口应驻留在约 1438px，产生约 359px 的偏移。第 2→3 屏圆点扩张期间改变尺寸时同样存在目标坐标失效风险。
- **限定修复**：提交 `0ca94fd` 保存当次过渡的目标章节 ID，真实视口变化时取消旧动画、清理遮罩、重新计算同一目标章节的驻留位置；合成 `resize` 事件且视口尺寸未变时不改变过渡。保留普通滚动的运动曲线、860–1180ms 时长和圆点扩张 960ms 时序，不改变品牌视觉。
- **本地整页 Chromium 回归（常规动效，1440×900）**：九屏顺序前进全部驻留正确；从末屏向前抽查三次均正确；绿色圆点变黑并扩张后，下载屏驻留和遮罩清理正常；Esc 可取消遮罩；减弱动效下滚轮保留浏览器原生行为。窗口改变期间普通滚动目的地修正为约 1438px，第 2→3 屏遮罩切换修正为约 2442px，未发现脚本异常。旧版正常滚动中改尺寸的测试失败，修复版通过。
- **自动复核**：新增 `scripts/check-website-v3-transitions.mjs`（`171850b`），通过 `.github/workflows/website-v3-qa.yml`（`a8bb442`）接入原有专项 CI；输出 `transition-results.json` 和圆点扩张、下载屏驻留两个关键截图。本地报告 PASS，5 个场景、0 个失败；[云端 V3 QA #41766299879](https://github.com/Pixman022/fresnica-ui/actions/runs/41766299879) **已成功**。下载并核对 `fresnica-v3-visual-qa` Artifact：`transition-results.json` 报告 PASS，5 个场景、0 个失败，章节驻留值与本地一致；另有两张关键转场截图，原有截图/动效/走马灯及原生缩放测试仍通过。
- **验收边界**：这些是 Linux Chromium 的功能和几何驻留检查，不代替 Windows/macOS 交叉浏览器、真实 GPU 端到端性能以及视觉负责人逐屏签收。

## 2026-11-04 P2 补充：Firefox / WebKit 浏览器引擎

- **范围**：独立 GitHub Actions 作业 v3-browser-engine-qa，在 Ubuntu 24.04 上使用 Playwright 1.55.1 的 Firefox 和 WebKit；每种引擎覆盖 1440×900、768×1024、390×844 三种视口 × light/dark 主题，共 12 组。检查英文/简体中文页面横向溢出、五张卡片与首卡边距、页面顶部导航按钮的尺寸及边界、未发布下载入口保持禁用、桌面端 CTA 边界；桌面浅色场景还验证 Enter 打开章节/下载/语言菜单、Escape 关闭与焦点回归。
- **验证**：[V3 Website Visual QA #41767698389](https://github.com/Pixman022/fresnica-ui/actions/runs/41767698389) 最终 success，已有 Chromium 作业与新增浏览器引擎作业均通过。已读取 fresnica-v3-browser-engines-qa Artifact 中的 engine-results.json：**12/12 PASS，失败数 0**，所有场景的英文和中文 scrollWidth-innerWidth 均为 **0px**。另有 Firefox/WebKit 两种引擎各两张截图（桌面浅色安全章节、移动端中文深色功能章节），已抽样并排比对，未见明显跨引擎布局差异。
- **首次运行问题**：初始 ubuntu-latest 已为 Ubuntu 26.04，Playwright 1.55.1 无法在该系统安装 Firefox/WebKit，失败发生在浏览器安装前，非网页错误。提交 06a06b0 仅把新增作业改为 ubuntu-24.04，既有 Chromium 作业不变。新增脚本 scripts/check-website-v3-engines.mjs（b9615fc），工作流首次接入 9712f59；本轮未改网页视觉或动效源码。
- **限制**：此结果是 **Linux 上 Firefox/WebKit 浏览器引擎的 reduced-motion 基础兼容性**，不能代替 Windows 版 Firefox/Edge、macOS 原生 Safari、iOS Safari、Android 真机，也不证明两种引擎下正常动效的完整视觉与 GPU 性能。原生 200% 缩放此前仅针对 Linux Chromium，跨系统/引擎缩放仍待补充。

## 2026-11-04 P2 补充：Firefox / WebKit 正常动效入场

- **新增可重复测试**：scripts/check-website-v3-engine-motion.mjs（327cb32）在两种引擎的 1440×900 桌面视口启用 no-preference 正常动效，真实滚轮触发首屏 → 第 2 屏 → 第 3 屏，检查章节驻留、绿色核心转为黑色圆点、遮罩清理和脚本异常；后由 f91399e 强化第 3 屏手机示例入场结束后的元素尺寸、透明度、滤镜与可见性检查。测试已并入 V3 专用浏览器引擎 CI，未改动页面源码。
- **实测结果**：[V3 QA #41768662316](https://github.com/Pixman022/fresnica-ui/actions/runs/41768662316) 中原有 Chromium 与 Firefox/WebKit 两个作业均成功。下载核对 fresnica-v3-browser-engines-qa Artifact：engine-motion-results.json 为 **2/2 PASS、失败 0**，Firefox/WebKit 第 2 屏均驻留 1797px，第 3 屏约 3052/3051px，过渡结束均未残留遮罩，脚本错误 0。最终下载屏手机示例均为 **opacity=1、filter=opacity(1) blur(0px)**，尺寸约 600×753px。
- **截图时机误判已排除**：首轮在绿色圆点切换完毕后仅停 210ms 截图，WebKit 右侧手机仍处于延迟入场阶段而未显示，Firefox 同期为模糊状态。等待完整的错峰入场动画后重新截取，Firefox 与 WebKit 的手机均完整显示。故本轮只修正测试时序和断言，没有改变已确认的动画或页面样式。归档含两种引擎各自的圆点扩张与完整下载画面截图。
- **验收边界**：仅证明两种 Linux 引擎在正常动效下前两次分屏切换及手机入场可用；不能外推为九屏所有动画在跨系统浏览器全部通过，亦非真实 GPU 帧率测试或设计视觉签收。

## 2026-11-04 P2 补充：Firefox/WebKit 九屏往返与 Q&A 崩溃修复

- **覆盖扩大**：scripts/check-website-v3-engine-scenes.mjs 在 Linux Ubuntu 24.04 的 Firefox 与 WebKit 上，1440×900 正常动效模式，逐屏执行概览至页脚的全部 8 次前进和 8 次反向返回；检查当前章节唯一性、预期驻留几何位置、遮罩关闭、入场标识与横向溢出。两引擎总计 **32 次章节切换**。使用有界的实测驻留等待，不再以固定的 1.55 秒立即判定；在超时情况下保留真实布局和滚动状态信息。该变更只影响测试，不放宽位置误差门槛。
- **真实 WebKit 兼容性问题（已修复）**：早期 CI 在 WebKit 进入第 8 屏 Q&A 时出现页面进程崩溃。专项诊断 scripts/diagnose-website-v3-webkit-exit.mjs 分别禁用 Q&A 标题装饰线与问答加号动画，确认只有禁用问答加号的 m14-signal（含动画化 drop-shadow 滤镜）才能避免崩溃；禁用标题装饰线并不能解决。提交 [9ca2f3b](https://github.com/Pixman022/fresnica-ui/commit/9ca2f3b66e4749ad42f4db4324b3e35e493bfa4f) 仅将 Q&A 加号改为不含滤镜动画的透明度呼吸 m14-qa-pulse，其余粒子、页面布局、过渡时长及视觉风格不变。
- **修复后证据**：[V3 QA #41780980410](https://github.com/Pixman022/fresnica-ui/actions/runs/41780980410) 两个作业均成功；已下载归档核对 engine-scenes-results.json：Firefox 与 WebKit **各 8 次前进 + 8 次返回，PASS，失败数 0**。webkit-security-exit-diagnostic.json 中 8 个场景全部 PASS（包括之前崩溃的 baseline），WebKit 不再出现 Q&A 进程崩溃；engine-results.json 12/12 PASS、engine-motion-results.json 2/2 PASS，Chromium 原有全套 QA 亦成功。对应的 [Pages #41780980377](https://github.com/Pixman022/fresnica-ui/actions/runs/41780980377) 已成功发布修复版。
- **双引擎逐屏视觉抽查**：后续将 Firefox/WebKit 的第 4～9 屏截图都纳入 CI（070b201），不再每次运行 8 组诊断页；诊断脚本保留供故障调查，完整九屏回归仍作为真正的阻断验收。最新 [V3 QA #41781419359](https://github.com/Pixman022/fresnica-ui/actions/runs/41781419359) 两个作业成功，归档 engine-scenes-results.json PASS，0 失败；共 20 张浏览器引擎截图。已对照两引擎的五卡、桌面端、走马灯、安全粒子、Q&A、页脚六屏布局，未见明显跨引擎错位或裁切。截图检查为重点抽查，不代表正式设计批准。
- **仍待完成**：Windows/macOS 原生浏览器缩放及真实设备、真实 GPU 性能采样、正式设计负责人逐屏签收。Linux WebKit 引擎通过不应等同于 macOS Safari 全设备通过。

## 2026-11-04 P2 补充：Windows/macOS 浏览器与 WebKit 短高视口修复

- **新基线与环境**：新增独立 [V3 Native OS Browser QA](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886750)；Windows Server 2025 运行系统安装的 Microsoft Edge 和 Playwright Firefox，macOS 15 运行 Playwright WebKit。测试脚本为 `scripts/check-website-v3-cross-os.mjs`（`cd12626`），独立工作流 `.github/workflows/website-v3-os-qa.yml`（`778458a`），不修改原有 Linux Chromium/Firefox/WebKit 测试门槛。
- **检查范围**：每浏览器覆盖 1440×900 桌面、390×844 手机和 720×450 短高视口，分别检查浅/深主题与英文/中文，含顶部控件尺寸/边界、菜单 Enter/Escape 焦点返回、五张卡片、下载占位禁用状态、桌面 CTA 位置和横向溢出；另以正常动效检查首屏→第 2 屏→第 3 屏的圆点扩张与手机完整入场。每引擎 6 组布局/主题 + 1 组动画；Windows 两引擎 14 项，macOS 一引擎 7 项，共 **21 项**。720×450 **只是 200% 等效 CSS 视口**，不能称为原生浏览器 200% 缩放。
- **修复前实际问题**：首次跨 OS 基线 [#41783191855](https://github.com/Pixman022/fresnica-ui/actions/runs/41783191855) 在旧断言下通过，但人工对照发现 macOS WebKit 第 5 屏在 720×450 时右侧应用示例顶部被固定导航栏遮挡。新增几何断言 `ae8f01b` 后，[#41783699037](https://github.com/Pixman022/fresnica-ui/actions/runs/41783699037) **如预期在 macOS WebKit 的浅色/深色两组失败**：16:9 目标宽约 388.8px，实际容器高 **360px**、顶部相对章节仅 **31.5px**；Windows Edge/Firefox 同一检查通过。
- **局部修复**：`3517ba2` 仅在宽度 681–740px 且高度不超过 520px 的场景，为 `#v3-workspace .workspace-mini` 设置 `min-height:0;max-height:30.375vw`；这里示例宽为 54vw，高度上限对应 16:9，不改变正常宽度的视觉。macOS WebKit 复测截图显示示例完整避开顶部导航，与 Windows Edge/Firefox 短高布局对齐。
- **修复后 CI 与归档**：[Windows/macOS #41783886750](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886750) 两作业 **SUCCESS**；归档 `cross-os-results.json` Windows **14/14 PASS**、macOS **7/7 PASS**，均 **0 失败**；21 组中英文横向溢出记录均为 0px。已抽查桌面安全屏、中文深色手机功能卡片、短高中文桌面端和动效下载页截图。同步执行的 [Linux V3 QA #41783886749](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886749) Chromium/Firefox/WebKit 两作业均成功；[V3 Pages 发布 #41783886747](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886747) 成功。没有修改 `main` 或冻结的 V2。
- **边界**：Windows Edge 是系统浏览器，但测试运行在 GitHub 托管虚拟机；Playwright Firefox 和 macOS WebKit 使用其随版本提供的测试浏览器，不是未经修改的 Firefox 或 macOS Safari 应用。无真实 GPU 帧率结论、无设备级 200% 页面缩放结论、无设计负责人最终视觉签收。

## 2026-11-04 P2 补充：第三屏手机快捷操作图标对齐

- **复现**：第三屏手机示意中的 Send/Receive/Swap 三个快捷操作使用外层卡片 span 包裹内部 `.phone-quick-icon` span。旧版 `#v3-availability .phone-quick span` 同时给内部图标添加 13px 顶部内边距、11px 底部内边距、1px 边框和背景。浏览器本地复现：图标容器实际高约 **26px**（设计高 22px），内部 20px SVG 向下偏移约 **13px**；三个图标均受影响。
- **最小修复**：`f589453` 把选择器限定为 `.phone-quick > span`，让卡片样式只作用于直接子元素，内部图标保持无边框/无内边距的 22×22px 居中网格；不改变图标路径、文字、按钮卡片尺寸、入场动画。修复前后在本地 Chromium 实际整张手机示例截图中复核。
- **自动防回归**：`4f7cc59` 在 Linux Firefox/WebKit 测试、`aae3f30` 在 Windows Edge/Firefox 与 macOS WebKit 测试中加入三个图标的宽高、SVG 中心偏差、边框/内边距校验。修复后 [Linux V3 QA #41789060919](https://github.com/Pixman022/fresnica-ui/actions/runs/41789060919) 双作业成功；[Windows/macOS QA #41789085384](https://github.com/Pixman022/fresnica-ui/actions/runs/41789085384) **21/21 PASS、失败 0**；[GitHub Pages #41789022690](https://github.com/Pixman022/fresnica-ui/actions/runs/41789022690) 成功。均仅涉及 V3，未修改 `main` 或冻结的 V2。

## 2026-11-04 P2 补充：Windows Edge 真实 200% 页面缩放

- **实现**：独立 Windows 2025 有界面 Edge 作业 `.github/workflows/website-v3-windows-native-zoom.yml`（`58bdbe5`），以 `scripts/v3-native-zoom-windows.ps1`（`a9f28aa`）发出 Windows 原生 Ctrl+加号事件；`scripts/check-website-v3-windows-native-zoom.mjs`（`dd92a55`）核实浏览器实际缩放，而非 CSS zoom 或浏览器移动设备模拟。
- **证据**：[V3 Windows Edge 原生缩放 #41788697714](https://github.com/Pixman022/fresnica-ui/actions/runs/41788697714) 已成功，归档 `windows-native-zoom-results.json` 报告 **PASS、0 失败**：初始 CSS 视口 **1440px/DPR 1**，原生缩放后 **720px/DPR 2**，`visualViewport.scale=1`，`CSS zoom=1`。英文/中文 × 深浅主题 × 3 个章节共 **12 张截图**，横向溢出、CTA/桌面端右侧示例、标签栏间距及顶部菜单键盘行为全部通过。第三屏图标修复后的重跑 [#41789022659](https://github.com/Pixman022/fresnica-ui/actions/runs/41789022659) 仍成功。
- **边界**：此为 GitHub Windows 托管虚拟机中 Microsoft Edge 的真实页面缩放；不是 Mac Safari 的原生页面缩放、真实 Windows 用户硬件 GPU 或移动设备验收。其他浏览器的系统级 200% 页面缩放仍待检查。

## 2026-11-04 P2 补充：第五屏桌面钱包四模块功能化重设计

- **需求与范围**：保留第五屏整体布局、16:9 桌面设备窗口、四个可点击切换的标签及原有滚动驻留方式。将 Assets / Payments / Swap / Connect 的内部演示从通用三行文案改为四种对应功能的可辨识界面，不涉及真实钱包交易、签名、网络请求或下载能力。
- **四模块内容**：Assets 展示资产总值、曲线和资产列表；Payments 组合发送目标/金额/备注与接收地址卡片；Swap 展示支付/接收两种资产、方向和报价核对；Connect 展示应用身份、连接请求、权限清单和确认动作。侧栏精简为与底部四标签一致的项目并同步高亮，保持方向键、Home/End 与 ARIA 选中状态。新增 `m50-desktop-preview.css` 响应式双主题样式、`m12-experience.js` 中英翻译及 `m25-desktop-tabs.js` 侧栏映射；产品示例内的核对操作仅为视觉呈现，非真实支付按钮。
- **兼容修复**：首次回归发现旧的 `.network polyline` 已移除，而页面保留的 M2 动效仍直接调用 `networkLine.style`，导致 Chromium/Firefox/WebKit 脚本错误；提交 `a18e0c9` 对旧网络元素做可选检查，保留其他章节的动效逻辑。首轮新增的桌面模块测试又发现 390px 中文深色 Connect 底部多出约 **6px**，提交 `b7e4107` 只压缩该视口权限卡与操作区间距，未删除内容；后续统一紧凑态核对按钮右对齐，并将资产角标由固定的“3 assets”改为“Portfolio”，避免窄屏隐藏最后一行时信息不一致。
- **自动验收**：新增 `scripts/check-website-v3-desktop-panels.mjs`（`50dd25f`）及独立 CI 门槛（`72c0c8a`），每引擎涵盖桌面浅色英文、桌面深色中文、平板浅色英文、720×450 深色中文、390px 手机深色中文 × 四模块；检查模块结构、唯一可见面板、侧栏同步、翻译、内部横/纵向裁切、方向键操作。修复后的 [Linux V3 QA #41792595032](https://github.com/Pixman022/fresnica-ui/actions/runs/41792595032) **两项作业均成功**；实际归档 `desktop-panels-results.json` 为 Chromium **20/20 PASS**、Firefox/WebKit 合计 **40/40 PASS**、失败 0。原有九屏、缩放、卡片动效和静态审计均在同次成功。
- **跨系统验收**：`b3f2290` 将四模块边界/选中/截图检查加入 Windows Edge/Firefox 与 macOS WebKit 独立基线。[跨系统 CI #41792945973](https://github.com/Pixman022/fresnica-ui/actions/runs/41792945973) Windows 与 macOS 均成功；[Windows Edge 原生 200% #41792594956](https://github.com/Pixman022/fresnica-ui/actions/runs/41792594956) 继续成功；[V3 Pages #41792595063](https://github.com/Pixman022/fresnica-ui/actions/runs/41792595063) 发布成功。已抽样核对四模块的桌面浅色英文、桌面深色中文和 720×450 中文截图，未见明显错位、内容截断。
- **未完成**：原生 macOS Safari、其他浏览器的原生 200% 缩放、真实 GPU 性能及设计所有者的最终逐屏视觉批准。自动化成功不代表钱包后台功能已经接入。

## 2026-11-04 P2 补充：首页球体浅色模式二次对比增强

- **原因**：方案 A 只将近白外壳粒子改为淡灰绿，但实际 1440×900 主页截图中 WebGL 球面仍然太浅，且球面边缘透明度降低，球体轮廓与白背景分离不足。
- **局部调整**：`24a7589` 仅调整 `public/fresnica-v3-motion-preview/index.html` 首页球体。增加 WebGL 浅色模式 uniform，在浅色模式提高球面及边缘不透明度，并向较清楚的薄荷绿调整颜色；Canvas 外壳粒子改为更清楚的灰绿与绿色。深色模式的着色和粒子配色计算保持原参数。增加主题切换时的重绘事件，确保减弱动态模式在切换主题后也刷新球面颜色。不改变 Logo 粒子、外部轨道、旋转速率、点数和几何尺寸。
- **视觉取样与复核**：使用同一组 1440×900 Chromium 渲染图对比球体外圈（中心约 x=994, y=516、半径 135–180px）的平均 sRGB 亮度，修复前约 **233.5/255**、调整后约 **217.9/255**，背景仍接近白色。该取样是视觉回归辅助指标，不等同于文字可访问性对比度。已人工比对浅色模式前后截图及深色模式截图；浅色球体边缘和点阵更容易看清。
- **回归状态**：[Linux Chromium/Firefox/WebKit V3 QA #41796882492](https://github.com/Pixman022/fresnica-ui/actions/runs/41796882492) 两项作业 **SUCCESS**；[Windows Edge/Firefox + macOS WebKit QA #41796882621](https://github.com/Pixman022/fresnica-ui/actions/runs/41796882621) 两项作业 **SUCCESS**；[Windows Edge 原生 200% #41796882493](https://github.com/Pixman022/fresnica-ui/actions/runs/41796882493) **SUCCESS**；[V3 Pages #41796882531](https://github.com/Pixman022/fresnica-ui/actions/runs/41796882531) **SUCCESS**。视觉方案仍可由设计负责人继续微调，并非正式硬件 GPU 或逐屏视觉签收。

## 2026-11-04 P2 补充：浅色首页球壳粒子调亮

- **用户反馈**：二次增强球面透明度与边缘轮廓后，球壳 Canvas 点阵颜色偏暗，视觉密度太重。
- **调整**：`5bdc653` 仅修改浅色模式的两组外壳粒子颜色与不透明度：绿色 `rgba(50,148,107)` × 0.90 改为 `rgba(106,186,150)` × 0.76，灰绿 `rgba(70,124,100)` × 0.90 改为 `rgba(138,174,157)` × 0.72，均保留逐粒子本地透明度调节。WebGL 球面及边缘对比度沿用上一版；不改变白色 Logo、几何形状、粒子数量、尺寸、动画和深色模式。已比对相同 1440×900 Chromium 首页截图，浅色外壳点阵更柔和，球面轮廓仍可辨。
- **验收**：[Linux Chromium/Firefox/WebKit #41798122358](https://github.com/Pixman022/fresnica-ui/actions/runs/41798122358)、[Windows Edge/Firefox 与 macOS WebKit #41798122317](https://github.com/Pixman022/fresnica-ui/actions/runs/41798122317)、[Windows Edge 原生 200% #41798122304](https://github.com/Pixman022/fresnica-ui/actions/runs/41798122304)、[Pages #41798122293](https://github.com/Pixman022/fresnica-ui/actions/runs/41798122293) 全部成功。仍以使用者实际审看视觉效果为准。

## 未完成 / 不应宣称已验收的内容

- **真实设备与剩余浏览器原生缩放**：Linux Chromium 和 Windows Edge 均已通过 OS 键盘触发的原生 200% 页面缩放（由 CSS 1440×900 到 720×450、DPR 1→2），其中 Windows Edge 含双语言/双主题的 12 张截图。此前 CSS `zoom:2` 仅视作近似压力检查。Windows Firefox、macOS Safari/WebKit 的系统级原生缩放、真实设备 GPU 与设计负责人逐屏签收仍未完成。
- **动效视觉与性能**：新增 no-preference 模式测试，曲线圆点、SEND、Swap、DApp 同步返回、Activity 滚动均已验证启动/关键阶段/归位；仍需在非减弱动效下人工审看整屏切换、粒子效果和真机性能。
- **全量人工视觉签收**：已人工查看桌面九屏缩略合成图与部分移动端截图，尚不能将所有 55 张图视为经过设计所有者逐张批准；应继续保留视觉审核人与签收记录。
- **组件设计完全同源**：本次只把营销网站中的产品示意面板对齐语义 Token；未承诺官网全部品牌场景都迁移到组件库。网站独立的品牌动效仍是保留项。

## 结论

P0/P1 的主要规范整改、P3 的静态审核以及 P2 的多视口/双主题/中文/五卡正常动画自动验收均已完成。**浏览器自动检查通过，不等于全部设计视觉签收。** 后续针对整屏过渡和粒子性能、其他系统/浏览器的原生缩放及真实设备进行补充检查，保留已确认的品牌视觉。
