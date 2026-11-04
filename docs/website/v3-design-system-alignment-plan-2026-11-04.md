# Fresnica V3 官网设计规范对齐工作计划

> 日期：2026-11-04 · 执行分支：`design/website-vision-motion-concept-2026-10-27`
>
> 范围：`public/fresnica-v3-motion-preview/`。保留冻结的 V2 及其部署路径，不修改 `main` 上的组件库。此处是营销网站，正式设计规范主要约束**钱包 UI 示例、交互控件与语义颜色**；品牌动画、首屏点阵球体和分屏叙事可保留独立视觉表达。

## 依据与边界

- `docs/design-system/design-rules.md`、`design-tokens.md`、`cross-platform-core.md`、`platform-adaptation.md`。
- `docs/design-system/visual-regression-checklist.md` 的视口、主题、焦点与缩放验收。
- 保持已确认的五张卡片布局和动画：趋势圆点、SEND 下沉、Swap Success 精简、DApp 中心消失后全体恢复、Activity 滚动归档。
- **已知规范冲突**：规范要求主色亮绿加纯白按钮文字，但 `#00A875` 和 `#00CA8A` 配白字对小号文字未达到 4.5:1；因此保留品牌主色，同时为**填充按钮**单独设置通过对比度的语义背景色，不随意改变品牌主色。

## P0 · 交互可访问性（第一批）

- [x] 浏览器实测主题、语言、顶部导航及下载控件在 320–1440px 宽度均至少 40px、44px 高，未越出视口；主要功能示例按钮另有静态样式约束。
- [x] 焦点样式使用 Fresnica 语义色；Chrome 通过 Enter 打开章节/下载/语言菜单、Escape 关闭并归还焦点的自动验收。
- [x] 主要填充操作按钮白字对比度至少 4.5:1，已按语义色值复核；其他小字号装饰文本继续保留逐屏人工复核。
- [x] 浏览器实测未上线下载按钮保持 disabled；网站无真实转账、兑换功能。

**验收**：检查计算样式、颜色对比度，实测键盘与 320/360/393/430px、768px 和桌面视口。

## P1 · 官网语义 Token 与组件一致性（第二批）

- [x] 建立官网语义桥接变量：品牌强调、AA 主按钮、焦点、面板、边框、正文/辅助文本、成功与收益。
- [ ] 对齐 Hero、导航及五张卡片的核心产品 UI 视觉颜色；避免把收益色、成功色与品牌绿混用。
- [x] 产品示例（钱包卡片、桌面端数据与数额）统一使用 Fresnica 字体 Token 和 tabular-nums；品牌 Editorial 大标题的样式保持独立。
- [x] 产品 UI 示例采用边框和分层表面，去除主要产品面板和导航浮层阴影；品牌背景光效保留。
- [ ] 已替换移动端展示区 Send / Receive / Swap 字符图标；其他自定义展示图标的完整审查仍待 P2 视觉验收。

**验收**：双主题检查五张卡片的默认、成功、禁用、悬停与焦点状态；原动画关键帧与文案保留。

## P2 · 浏览器视觉/响应式与回归（第三批）

- [ ] 逐屏对比浅色/深色、桌面宽度、768px、430px、393px、360px、320px；验证 200% 缩放。
- [x] 补充 Linux Chromium 原生页面 200% 缩放（1440×900 起始视口，真实 Ctrl+加号），检查中英双语/深浅主题、导航目标、CTA 与标签栏间距及横向溢出；1280×800 起始视口已单独本地复核。其他浏览器与设计人工签收仍待完成。
- [x] 补充 Linux Firefox 与 WebKit 引擎的独立浏览器自动检查：每引擎 1440/768/390px × 双主题，共 12 组；验证英文/中文、关键控件、桌面键盘菜单与安全布局，截图抽查。此 Linux 专项不包含真实设备和完整 GPU 性能；跨系统引擎测试见下方独立记录。
- [x] Firefox/WebKit 正常动效另补充首屏 → 第 2 屏 → 第 3 屏的圆点扩张、驻留和第三屏手机完整入场可见性回归；后续七屏的跨引擎实际动画和 GPU 性能仍需继续验收。
- [x] Linux Firefox/WebKit 桌面正常动效九屏前进与回退的驻留状态自动回归；解决 WebKit Q&A 发光滤镜动画引起的页面崩溃；第 4～9 屏 Firefox/WebKit 截图均已归档并抽查。macOS 原生 Safari、真实 GPU 与设计正式签收仍未完成。
- [x] Windows Server 2025 系统 Edge + Playwright Firefox、macOS 15 Playwright WebKit 独立 QA：桌面/手机/720×450 短高视口 × 中英/双主题 + 圆点扩张正常动效，共 21/21 PASS；仍不等同于真机或 Safari 原生应用。
- [x] 通过 macOS WebKit 截图与修复前断言复现第 5 屏短高视口 16:9 示例被固有网格内容撑至 360px、顶部遮挡；限定宽 681–740px/高不超过 520px 修复，双平台回归及 Pages 发布通过。
- [x] Chrome 在正常动效模式下验证五张卡片的关键动画启动、运动状态和复位，并覆盖 reduced-motion 静态场景；还已完成桌面/430/320px 双主题简体中文标题的自动检查和截图。
- [ ] 仍需设计所有者逐屏审看中文排版、所有动画的实际观感与真实设备表现，不能以自动化检查代替签收。
- [x] 通过截图发现并修复 320–430px 的首卡裁切；修复嵌套 style 标签并加入静态/浏览器断言。
- [x] 逐屏复核发现并修复桌面第 5 屏 reduced-motion 下载按钮裁切；新增 CTA 边界自动回归检查，并复核 1440px 中英文/深浅主题截图。
- [x] 第 6 屏走马灯仅在可见且允许运动时请求动画帧：保持原卡片视觉与速度，暂停时不再持续调度；补充离屏/减弱动效/焦点/4.5 秒暂停/隐藏标签页的浏览器测试。
- [x] 本地 Chromium 1440×900 常规动效检查首屏 → 生态连接 → 下载 → 功能卡片的连续滚轮切换及圆点扩张转场；无脚本报错。仍待真实硬件与设计所有者全面审看。
- [x] 将九屏顺序前进、末屏逆向抽查、圆点扩张完成/取消、减弱动效滚动和普通/圆点过渡中视口变化纳入 Chromium 自动回归；修复切换途中调整窗口后使用旧驻留像素坐标的问题。

- [x] 第三屏手机示例 Send/Receive/Swap 三个快捷操作图标的内边距、边框和 SVG 居中问题已修复；Linux/Windows/macOS 浏览器自动回归已补充图标位置检查并通过。
- [x] Windows Server 2025 的有界面系统 Edge 已使用真实 OS 键盘事件达成原生 200% 页面缩放：CSS 视口 1440→720px、DPR 1→2，12 个语言/主题/章节截图及布局检查 PASS；其他浏览器及实机仍待验收。

**验收**：保存带有视口/主题/日期的审核记录；未进行视觉检查的项目不得标记完成。

## P3 · 持续一致性与文案收尾（第四批）

- [x] 为 `public/fresnica-v3-motion-preview/` 增加独立静态审核 `npm run audit:website-v3`；仅检查 V3，且不修改组件库 CI。
- [x] 清理页脚重复 Experience 导航与英文重复文案，补齐对应中文翻译；静态检查锚点均存在，下载占位状态保留。
- [x] 已整理浏览器 QA 记录：`docs/website/v3-design-system-alignment-qa-2026-11-04.md`；记录剩余真实缩放、非 reduced-motion 和正式视觉签收。

**验收**：新增审核可重复运行，且不会误将纯品牌视觉效果判定为产品组件违规。

## 执行记录

- 2026-11-04：基于源码和规范完成差距分析并建立计划，提交 `c6ac5086`。
- 2026-11-04 · **P0 已落地，浏览器验收待办**：`f2cec46` 扩大导航和功能按钮操作区域、统一焦点色、提供高对比按钮色，保持 SEND 动画时间点不变；白字按钮对比度浅色 5.50:1、深色 5.63:1。
- 2026-11-04 · **P1 主要语义对齐已落地，完整迁移待办**：`0c9f955` 接入网站独立的 Fresnica 语义变量桥接，对齐产品示意界面、Swap 反色按钮、状态/收益角色和三枚线条图标；`8821ed1` 补中性列表动效及导航阴影处理；`b0cf700` 修正浅色收益数字对比度；`12f1bb9` 保留趋势圆点的主题对比描边。
- **静态验收**：保持五张卡片及既有动画关键帧；验证 SEND/SWAP、文字、状态容器和收益数字的所选色对满足普通文字 4.5:1 目标。构建/部署验证单独记录；这些检查不能替代逐屏浏览器截图。
- **当前边界**：点击区域、14 组视口/主题的自动检查与截图、P3 独立审计和 Chromium 原生 200% 缩放基线已完成。跨浏览器原生缩放、完整动画时间轴、全部中英双语版式的人工逐屏签收及真机检查仍待完成。
- **GitHub Pages 验证**：V3 最后一次源码提交 `12f1bb969d08862cc7ac955707b5887c56301f78` 的部署工作流 [#41753630186](https://github.com/Pixman022/fresnica-ui/actions/runs/41753630186) 已成功，16/16 步骤通过；这覆盖构建、资源核对及发布，不代表截图视觉验收。
- **色彩计算记录**：白字对可访问按钮底色——浅色 5.50:1，深色 5.63:1；SWAP 黑白反色 18.74:1；成功容器浅色 8.09:1、深色 10.37:1；收益正文通过 `--v3-gain-ink` 避免规范浅色收益 `#0A8F68` 在白底下仅 4.08:1 的问题。
- 2026-11-04 · **P3 静态审核完成**：`61fd3db` 删除重复页脚文案和导航；`584eff4` 同步中文翻译；`ecf7454`、`35a12fd` 新增独立 `npm run audit:website-v3`。GitHub Actions 首次静态审核已通过（73 个 ID、9 个锚点、17 个资源引用、5 张卡片、按钮配色 AA）。
- 2026-11-04 · **P2/P3 自动基线已建立并通过**：独立 Chrome 工作流在 Ubuntu 26.04 改用 Runner 系统浏览器；`64b6e897` 修复移动端首卡裁切，320/360/393/430px 的首卡左边距实测 24px；`2e7b7093` 增加样式标签嵌套检查；[V3 浏览器 QA #41756436561](https://github.com/Pixman022/fresnica-ui/actions/runs/41756436561) 全部通过，覆盖 14 组视口/主题、55 张截图；[Pages #41756436557](https://github.com/Pixman022/fresnica-ui/actions/runs/41756436557) 成功，16/16 检查通过。详见 [验收记录](v3-design-system-alignment-qa-2026-11-04.md)。**未宣称完整视觉签收。**
- 2026-11-04 · **扩大 P2 自动验收**：`17077edb`、`210b93da` 补齐菜单键盘焦点闭环；`b30a157`、`cf42c70` 添加正常动效与 CSS 200% 缩放近似压力检查，成功运行 [#41757717173](https://github.com/Pixman022/fresnica-ui/actions/runs/41757717173)，6/6 项动画/缩放观察通过；`a9e37f1` 引入 3 个代表性视口 × 2 主题的中文截图，成功运行 [#41757835642](https://github.com/Pixman022/fresnica-ui/actions/runs/41757835642)，79 张基础与中文截图、五张卡片正常动效检查均通过。**CSS zoom 2x 并非原生浏览器页面缩放。**
- 2026-11-04 · **后续小幅调整**：`01d2170` 修复 320px 中文功能标题不自然断行；`8e6f0f5` 统一钱包及桌面 UI 示例的字体和数字宽度。最新代码 `8e6f0f5` 的 [Pages #41758286270](https://github.com/Pixman022/fresnica-ui/actions/runs/41758286270) 与 [V3 Chrome QA #41758286308](https://github.com/Pixman022/fresnica-ui/actions/runs/41758286308) 均已成功；79 张基础及中文截图、5 张动效/模拟缩放截图及记录无报错，并已人工复核 320px 中英文主标题的重点截图。仍需原生缩放/真机与设计所有者最终签收。
- 2026-11-04 · **P2 截图复核修复第 5 屏 CTA 裁切**：`047645d` 恢复桌面 reduced-motion 下为布局定位所需的 `translateY(-50%)`（未恢复入场动效）；`2479be0` 对 1440、768、720×450 近似视口的 CTA 越界增加双主题断言。[V3 Chrome QA #41759917426](https://github.com/Pixman022/fresnica-ui/actions/runs/41759917426) 成功；[GitHub Pages #41759900489](https://github.com/Pixman022/fresnica-ui/actions/runs/41759900489) 发布成功；已复核新一轮桌面第 5 屏 1440px 中英双语 × 深浅主题四张截图，按钮均完整显示。详细证据见 [P2 验收记录](v3-design-system-alignment-qa-2026-11-04.md)。原生浏览器 200% 缩放、真实设备和设计负责人最终逐屏验收仍未完成。
- 2026-11-04 · **P2 原生 Chromium 200% 缩放继续验收**：`404b9a3` 修复中文顶部章节按钮缩窄至 30–32px 的问题；`c4cdeb2` 与 `1a999d1` 新增有界面浏览器原生缩放脚本；`a93043d` 接入 Xvfb CI，首轮 [Chrome QA #41761658774](https://github.com/Pixman022/fresnica-ui/actions/runs/41761658774) 成功。对原生 720×450 CSS 视口第 5 屏截图的二次复核发现 CTA 与标签栏间距不足；`799bf2f` 修复短高屏幕布局，`7f2f8ac` 新增至少 12px 间距断言，`a931cdf` 补齐 CI 触发路径；本地回归先失败后通过；最终 [V3 QA #41762349233](https://github.com/Pixman022/fresnica-ui/actions/runs/41762349233) 已成功，归档 `native-zoom-results.json` 为 PASS、DPR 2、CSS 视口宽 720px、8 张原生缩放截图及全部原有检查。完整证据与未验收边界见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 2026-11-04 · **P2 第 6 屏离屏帧调度与整屏转场抽查**：`0a1ac3a` 修复走马灯不可见时仍持续请求 RAF 的问题，动画速度、5 张原卡与 5 张克隆卡不变；`cdc0ff1` 新增独立生命周期回归，`b14f279` 接入 V3 CI。旧脚本对照失败，修复后本地和 [V3 QA #41763615194](https://github.com/Pixman022/fresnica-ui/actions/runs/41763615194) 全部通过；Artifact 中 carousel-idle-results.json 为 PASS、失败数 0，首页不再发出走马灯 RAF，进入第 6 屏正常运行。同时本地 Chromium 常规动效连续测试概览 → 生态连接 → 移动端下载（圆点扩张）→ 五张卡片，章节状态和驻留正常，脚本错误数 0。该结果不是 GPU 性能和全量动画签收，见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 2026-11-04 · **P2 九屏滚动与视口变更时的目标驻留**：本地 Chromium 1440×900 常规动效验证九屏顺向滚动、末屏三次逆向抽查、绿色圆点转黑扩张、Esc 取消及减弱动效原生滚动；发现视口在过渡期间从 1440×900 改为 1200×720 时旧目标像素未更新，页面停在 1797px 而非 1438px。`0ca94fd` 记录目标章节，在真实 resize 时清理旧过渡并重新对齐章节；`171850b` 新增完整回归脚本，`a8bb442` 将其接入 V3 CI。本地 5 个场景全部通过，自动截图和报告随 CI 归档；云端 [V3 QA #41766299879](https://github.com/Pixman022/fresnica-ui/actions/runs/41766299879) **已通过**，已核对 Artifact `transition-results.json`：PASS、5 个场景、0 个失败，关键阶段截图及既有动效/原生缩放测试均在同轮归档。此修复不改动既定动效速度与视觉，真实硬件性能/全部设计签收仍未完成。详见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 2026-11-04 · **P2 Linux Firefox/WebKit 兼容性基线**：b9615fc 新增 scripts/check-website-v3-engines.mjs，9712f59 将独立 v3-browser-engine-qa 作业加入现有工作流；首次执行因 runner Ubuntu 26.04 不受 Playwright 1.55.1 的 Firefox/WebKit 支持而在安装阶段失败（非网站错误）。06a06b0 仅将该作业固定到 Ubuntu 24.04，未更改既有 Chromium 基线。最终 [V3 QA #41767698389](https://github.com/Pixman022/fresnica-ui/actions/runs/41767698389) 两个作业均成功；已核对 engine-results.json：Firefox/WebKit 12/12 PASS、失败 0、英文/中文横向溢出均为 0px；已抽样比较四张关键截图。**仅为 Linux 引擎 reduced-motion 检查，不宣称 Windows/macOS Safari 或真机验收。**详见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 2026-11-04 · **P2 Firefox/WebKit 正常动效抽查通过**：327cb32 新增浏览器引擎全动效的前两次滚轮过渡、圆点变色扩张与下载屏驻留测试，a9206a7 接入独立 CI；f91399e 发现截图需等待错峰入场完成，补充手机完整入场后的 opacity/filter/布局断言。首次 WebKit 右侧手机暂时不显示是截图早于入场结束的测试时机问题，不需要修改网站。[V3 QA #41768662316](https://github.com/Pixman022/fresnica-ui/actions/runs/41768662316) Chromium 和 Firefox/WebKit 两作业均成功；归档 engine-motion-results.json 2/2 PASS，Firefox/WebKit 第 2 屏 1797px、第 3 屏 3052/3051px，手机最终可见、脚本错误 0。跨系统浏览器与剩余整屏动效/真实 GPU 仍需验收。详见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 2026-11-04 · **P2 Linux Firefox/WebKit 九屏往返与 WebKit Q&A 崩溃修复**：完善 scripts/check-website-v3-engine-scenes.mjs，对全九屏共 8 次前进、8 次反向返回逐次验证驻留几何、遮罩、入场及溢出；独立诊断确认 WebKit 在 Q&A 页崩溃由 `+` 图标的 m14-signal 滤镜动画触发，禁用该动画能复现绿色对照，禁用标题短线动画则无效。`9ca2f3b` 将 Q&A `+` 的动效更换为不含滤镜的轻量透明度呼吸，保留动态感和原视觉主线。[CI #41780980410](https://github.com/Pixman022/fresnica-ui/actions/runs/41780980410) 两项作业均成功，Firefox/WebKit 各 8 次前进+8 次返回 PASS、0 失败；Q&A 八种诊断场景全部 PASS，Pages 发布成功。`070b201` 将第 4～9 屏 WebKit 截图也归档并取消常规 CI 中非阻断诊断作业，完整九屏仍为实际验收门槛；[最新 CI #41781419359](https://github.com/Pixman022/fresnica-ui/actions/runs/41781419359) 两项作业全部通过，20 张引擎截图已逐屏对照，未见明显跨引擎错位。仅限 Linux 浏览器引擎与模拟视口，不等于 Windows/macOS 真机或正式视觉签收。详见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 2026-11-04 · **P2 Windows/macOS 专项 + WebKit 短高视口问题修复**：`cd12626` 新增跨平台浏览器、双主题/中文/菜单/圆点扩张测试；`778458a` 新增 windows-2025 Edge/Firefox 与 macos-15 WebKit 独立工作流。初轮 [#41783191855](https://github.com/Pixman022/fresnica-ui/actions/runs/41783191855) 21 项全部通过，但截图人工复核发现 WebKit 在 720×450 的第 5 屏右侧示例被导航遮挡。`ae8f01b` 加入容器上边界断言后，[#41783699037](https://github.com/Pixman022/fresnica-ui/actions/runs/41783699037) Mac WebKit 双主题按预期失败，实测高 360px、顶边 31.5px；Windows Edge/Firefox 通过。`3517ba2` 只为短高视口增加 16:9 高度上限，修复后 [跨 OS QA #41783886750](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886750) **21/21 PASS**，Windows/macOS 两作业成功；[Linux V3 QA #41783886749](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886749) 两作业通过，[Pages #41783886747](https://github.com/Pixman022/fresnica-ui/actions/runs/41783886747) 成功。macOS WebKit 修复前后截图已核对；不宣称原生 200% 缩放、macOS Safari、真实设备 GPU 或设计负责人视觉签收。详见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 2026-11-04 · **P2 Windows Edge 原生 200% 与第三屏图标对齐**：a9f28aa、dd92a55、58bdbe5 新增系统 Edge 有界面键盘 Ctrl+加号验证；[CI #41788697714](https://github.com/Pixman022/fresnica-ui/actions/runs/41788697714) 及图标修复后复测 [#41789022659](https://github.com/Pixman022/fresnica-ui/actions/runs/41789022659) 均成功，已读取 Windows 原生缩放 Artifact：CSS 视口 1440→720px、DPR 1→2、CSS zoom=1、12 张双语言/双主题/章节截图。用户指出第三屏手机界面 Send 图标偏低，源码及本地 Chromium 修复前后截图确认 `.phone-quick span` 误为内部图标增加 13px 上内边距及 1px 边框；f589453 将规则限制为直接子卡片 `.phone-quick > span`，Send/Receive/Swap 三图标均恢复无边框/无内边距、22×22px 居中。4f7cc59 和 aae3f30 增加 Linux 与 Windows/macOS 图标几何断言；[Linux V3 QA #41789060919](https://github.com/Pixman022/fresnica-ui/actions/runs/41789060919) 双作业成功，[跨系统 QA #41789085384](https://github.com/Pixman022/fresnica-ui/actions/runs/41789085384) **21/21 PASS**、[V3 Pages #41789022690](https://github.com/Pixman022/fresnica-ui/actions/runs/41789022690) 发布成功。限制于 V3，无其他视觉/动画改动；原生 macOS Safari、真机 GPU 及设计最终签收仍未完成。详见 [QA 记录](v3-design-system-alignment-qa-2026-11-04.md)。
- 更新状态时必须写清提交及验证范围；GitHub Pages 部署成功不等于真实浏览器视觉验收成功。
