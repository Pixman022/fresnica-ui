# Web / Native 契约同步完成状态 — 2026-10-12

状态：**Complete / Maintenance**

本记录关闭 Native NU01–NU08 完成后建立的 Web 契约同步计划。两端继续保留适合各自平台的
公共 API，同时对齐可复用的配置、文案、交互所有权、打包和交付契约。

## 完成汇总

| 任务 | 结果 | 证据 |
| --- | --- | --- |
| WS01 | Complete | PR #11，合并提交 `5a8c19a4cd925e2ed659a6ac9a57688e082f3e70` |
| WS02 | Complete | PR #12，合并提交 `0489babbe3d597049138794f7c5cd25452c58c76` |
| WS03 | Complete | PR #14，合并提交 `091ded4a42026c65a966e1f31ad44b2a6d472a9e` |
| WS04 | Complete | PR #15，合并提交 `4bfc7b514e4ccdf6c616f76cf69adbac0528e463` |
| WS05 | Complete | PR #16，合并提交 `c2ef4e2a3341ab2a675964b1e14a151be6e71232` |
| WS06 | Complete | PR #17 合并 `0c0a69d7cb34f869a5cf612fd6a102ff648d97a7`；PR #18 合并 `eb710c22c8050e36cf1627919e33f421c637deb6` |

PR #13 在 WS03 分支更新到最新 main 时被后续 PR 取代，不作为完成证据。

## 已验证 Web 交付物

Web 按自身版本策略从 `1.0.0` 升级到向后兼容的 minor 版本 `1.1.0`，不与 Native
`1.1.0-rc.1` 绑定。

最终审核包由 PR #18 的 CI run `38227260805` 实际生成：

| 字段 | 已验证值 |
| --- | --- |
| 包 | `fresnica-ui@1.1.0` |
| 审核源码 SHA | `42f68582170279c3f8185a1f793994b04d5ad235` |
| 合并后 main SHA | `eb710c22c8050e36cf1627919e33f421c637deb6` |
| Git tree | `f427ff53842e8f8c454149b8895812ffc8b0df8a` |
| Tarball | `fresnica-ui-1.1.0.tgz` |
| SHA-256 | `7de704860bd5022bef5172ac721aba325989598918e8de3c395f6d33d93ccd10` |
| Node 基线 | `>=20.19.0` |
| React peer | `>=18.0.0` |
| React DOM peer | `>=18.0.0` |

审核源码与 squash 合并后的 main 提交拥有相同 Git tree
（`f427ff53842e8f8c454149b8895812ffc8b0df8a`），因此已验证 tarball 与合并后的仓库内容一致。

交付生成器会检查包内是否包含公开 package 元数据、README、LICENSE、第三方声明、全局样式、
ES/CJS 入口、根类型声明、Locale 类型声明以及 UI Provider 类型声明。

## 验证结果

PR #18 CI run `38227260805` 已全部通过：

- Node 20 / Node 22 Lint。
- Node 20 / Node 22 单元测试。
- Full quality gate，包括格式、Token 审计、文档同步、对比度检查、lint、单测、无障碍测试、
  build 与覆盖率。
- React 18.0 打包消费端类型检查和生产 Vite build。
- Demo build。
- Delivery artifact 生成与上传。

WS05 还验证了公开 Provider、Locale 子路径、DOM ref、嵌套/自定义 Locale、多 React root、
主题与语言组合、320px 布局和文字放大，并保持冻结的默认视觉契约。

## 迁移与兼容

Web 1.1 改动均为增量兼容：

- 既有 `FresnicaThemeProvider` 继续有效。
- `FresnicaUiProvider` 为可选能力。
- 文案优先级保持：组件显式文案 → 组件 `labels` → Provider Locale → 历史默认值。
- 不使用 Locale Provider 的旧调用继续保持历史默认显示。
- `Button` 与 `Input` DOM ref 为可选新增能力。
- 公开语言包通过 `fresnica-ui/locales` 导入。
- 不需要破坏性迁移。

交付生成和迁移细节见 [build-and-release.md](./build-and-release.md)，Locale/组件契约见
[../design-system/component-localization.md](../design-system/component-localization.md)。

## Token 与跨平台边界

本轮没有修改 `design-system/tokens.json` 或
`design-system/platform-token-source.json`。Native 可以继续使用已审核的 Web Token 来源锁；
普通 Web 代码、文档或版本提交不要求推进该锁。

以下事项继续不属于本轮已完成的 Web 同步范围：

- Native 真机 / TalkBack 验收。
- iOS 实现与真机验收。
- Native 减少动画策略调整。
- 已记录的品牌色对比度限制。
- 钱包产品实现、密钥、签名、交易、链上状态和产品导航。
- 公开 npm 发布或生产部署。

## 完成结论

WS01–WS06 已全部完成并合并。本轮跨平台同步回到 **Complete / Maintenance** 状态。
只有出现新的产品需求、Token 变更、破坏性 API 提案或平台验收阶段时，才开启新的工作；
本记录不自动产生这些任务。
