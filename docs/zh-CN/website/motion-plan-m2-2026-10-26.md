# Fresnica 官网动画工作计划 — Motion M2 — 2026-10-26

## 背景

Motion M1 已完成 1440px 浏览器级视觉验收。

QA 截图确认 Hero、Features、Security、Download、FAQ 与 Reduced Motion 均保持 Geometric Light V2.4 的既定布局；验收过程中还发现并修复了一个与动画无关的 About highlight CSS 选择器问题。

M2 继续保持克制，只增加一个指针交互动效和一项运行时性能优化，不引入滚动联动动画。

## M2 — 本轮直接实现

1. **Hero 指针视差**
    - 仅桌面端启用：宽度大于 1100px，并且设备支持精细指针和 hover。
    - Hero 整体视觉最大只移动约横向 4px / 纵向 3px。
    - 背景几何与细节点使用略有不同的移动深度。
    - 手机保持可读，原有轨道旋转节奏不改变。
    - 指针离开 Hero 主视觉后平滑回到原位。

2. **离开视口后暂停环境动画**
    - Hero 轨道与手机浮动只在 Hero 主视觉进入视口时运行。
    - Security 轨道只在 Security 主视觉进入视口时运行。
    - 使用 pause/resume 保留动画进度，不通过删除动画重新从头播放。

3. **无障碍 / 性能**
    - `prefers-reduced-motion: reduce` 下完全关闭指针视差。
    - 触摸 / 粗指针设备不启用视差。
    - 复用现有 IntersectionObserver，不增加滚动驱动动画。
    - 不改移动端布局。

## 继续延后

- 跨区块轨道贯穿；
- 滚动联动几何动画；
- 中英文切换淡入淡出；
- Hero 以外的指针效果；
- Features 内更丰富的持续动画。

以上内容等待 M2 完成视觉验收后再决定。


## M2 视觉 QA 与运行时收口

- 主分支 CI 已生成并检查 1440px Hero、全页以及 Reduced Motion 截图。
- Hero、Features、Security、Download、About 与 FAQ 的布局未发现由 M2 引入的溢出或位移回归。
- 指针视差不会改变页面布局；静态 QA 截图保持 Geometric Light V2.4 构图。
- M2.1 额外在浏览器标签页隐藏时移除环境动画运行状态；返回页面后重新按视口状态恢复。
- 此收口不增加新动画类型，也不改变移动端行为。

## 完成标准

- 指针位移保持克制，不改变页面布局。
- Hero 与 Security 环境动画在离开视口时暂停。
- Reduced Motion 不存在持续动画或指针视差。
- 不修改产品、安全、下载或发布状态声明。
- 现有 1440px Visual QA 截图保持已确认布局。
- CI、文档同步、Demo build、Delivery artifact 与 GitHub Pages 部署全部通过。
