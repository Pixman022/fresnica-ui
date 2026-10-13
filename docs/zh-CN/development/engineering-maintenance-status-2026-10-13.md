# 工程维护状态 — 2026-10-13

> **计划：** Fresnica 工程维护与无障碍后续工作计划  
> **仓库：** `Pixman022/fresnica-ui` 与 `Pixman022/fresnica-ui-native`

## 工程任务状态

| 任务 | 状态 | 证据 |
| --- | --- | --- |
| M01 · 生产依赖审计门禁 | 完成，另保留 1 项仓库设置确认 | Web PR #22 / `cfb87a9c4394b2549c68782bed58105d8982da9b`；Native PR #71 / `48fd6e165ac2b8ec2a652d094b9288e258440faa` |
| M02 · Drawer 属性命名 | 完成 | Web PR #23 / `16639ca349e0b6ee9dfa6a46e0f366604fc6b386` |
| M03 · 构建资产告警 | 已调查 / 资源验证通过后保留告警 | Web PR #24 / `2719c1e356b1522b7f5aa7da32d46bf1971e4683` |
| M04 · 回归与维护记录 | 代码/CI 已完成；Web required-check 设置仍需管理员确认 | 本记录及下列 CI 证据 |

## M01 审计门禁证据

两个仓库都继续把完整开发依赖审计作为 report-only，同时将
`npm audit --omit=dev --audit-level=moderate` 改为阻断步骤。

最新成功生产审计：

- Web `main` CI `38360214555`：**生产依赖 0 漏洞**。
- Native `main` CI `38359310945`：**生产依赖 0 漏洞**。

临时非零验证没有引入真实漏洞：

- Web PR #25 只把审计命令指向故意不存在的 workspace；`Full quality gate` 在生产审计
  命令处以 exit code 1 失败，之后 React 18 consumer、Demo build、Delivery artifact 均未执行。
  该 PR 已关闭且未合并。
- Native PR #72 使用同样方式；required `test` job 在生产审计命令处以 exit code 1 失败。
  该 PR 已关闭且未合并。

Web 自动 Pages 部署仍要求 `main` CI 成功；手动 `workflow_dispatch` 入口也会在构建和部署前
执行相同生产审计。

### 仓库 required-check 状态

Native 的 `Protect main` ruleset（ID `24701211`）处于 active 状态，并要求 `test` status
check，因此 Native 生产审计失败时 required check 不会通过。

Web 的 repository rulesets API 当前返回空；连接器又无权读取 classic branch protection
（HTTP 403）。因此本次会话无法验证 Web 仓库层是否已经把某个 CI check 配成 required。
CI 路径中的阻断已实现并经过验证，但 Web 合并规则仍保留为**管理员确认/配置项**，本文不宣称
它已经在仓库层阻止合并。

## M02 Drawer 结果

Drawer 内部标记已统一为小写 `data-fresnica-drawer-portal` 与
`data-fresnica-drawer-ignore`。Portal 排除和背景 ignore 覆盖继续由 Drawer 测试验证。
最新 Web `main` 组合测试日志中已经没有旧 `data-Fresnica-drawer-portal` 的 React 属性告警。

其他无关的测试环境告警没有通过全局屏蔽 console 的方式隐藏。

## M03 资产告警结果

最新 library build 仍会出现：

`[vite-plugin-lib-assets]: Failed to obtain the sourcemap when handling the style file...`

该告警被准确记录为已调查的上游/工具链限制，不描述为“已修复”。

产物和真实浏览器验证没有发现当前资源损坏：

- 打包的 `fresnica-ui-1.1.0.tgz` 包含 CSS 引用的全部 6 个 Noto Sans SC `.woff2`；
- 真实 Chromium 成功加载打包后的公开 `dist/index.css`，并实际加载简体中文和 Latin
  Noto Sans SC 字体资源；
- CI 的 `demo-dist` 按 GitHub Pages `/fresnica-ui/` base 验证：主页 17 个资源请求、
  0 missing；`examples.html` 13 个资源请求、0 missing；没有观察到图片加载失败。

本轮没有为了隐藏告警而升级插件、Vite 基线或依赖版本。

## M04 最终回归证据

Web `main`：`2719c1e356b1522b7f5aa7da32d46bf1971e4683`

- CI `38360214555`：Node 20/22 lint/test、Full quality gate、coverage、React 18.0
  打包消费、Demo build、Delivery artifact — **全部成功**。
- Pages `38360736540` — **成功**。

Native `main`：`48fd6e165ac2b8ec2a652d094b9288e258440faa`

- CI `38359310945`：生产审计门禁、独立测试、固定 Token 来源验证、build、packed-package
  contract、internal delivery candidate — **全部成功**。

本轮没有修改共享 Token 源：

- `design-system/tokens.json` blob：`9c4bbc478618d5a5ef5d1ecdd11d41ee8afdeb5c`
- `design-system/platform-token-source.json` blob：`6ee1c1da3a3be52e84bc8247e13bb577fdbb4cc6`

这些值仍与 `fresnica-ui-native/token-source.lock.json` 完全一致，因此无需推进 Native Token lock。

## 条件任务

- **C01 Android 真机无障碍：** 未启动。仍需要明确验收宿主、可操作 Android 设备和实际测试人员。
  Native Issue #49 继续作为 deferred integration gate。
- **C02 关键配色评审：** 未启动。现有已批准品牌配色及对比度限制继续有效，不修改正式品牌 Token。

## 当前结论

M01–M04 的工程实现和验证已经完成，唯一例外是上述 Web 仓库级 required-check 管理员确认/配置项。
计划明确禁止在没有证据时宣称合并已被阻断，因此该子项继续保持待办。

C01 与 C02 仍是条件任务，不阻塞本轮工程维护。
