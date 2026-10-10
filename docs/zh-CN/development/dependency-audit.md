# 依赖审计分类 — 2026-10-10

本文记录 Fresnica 质量修复计划 WP06 的依赖审计结果。重点区分组件包生产运行时暴露与开发、测试、构建工具链告警；CI 全绿不等于不存在依赖风险。

## 证据基线

### Web — `Pixman022/fresnica-ui`

证据：GitHub Actions CI 运行
[`38017055794`](https://github.com/Pixman022/fresnica-ui/actions/runs/38017055794)
的 Full quality gate。

- 全量依赖审计：**23 个漏洞**——1 low、9 moderate、13 high。
- 生产依赖审计（`npm audit --omit=dev --audit-level=moderate`）：**0 个漏洞**。
- 包的直接运行时依赖为 `lucide-react`；React、React DOM 和 classnames 为 peer dependencies。当前生产依赖审计没有在本仓库安装图中报告这些依赖存在漏洞。
- 因此当前 23 个告警位于开发、测试、构建或部署工具链，不属于发布组件包的生产依赖图。

全量审计中观察到的主要依赖族包括：

- `@vitest/mocker` / `vitest`：单元测试和覆盖率工具链。npm 建议
  `npm audit fix`。WP06 暂时保留；未来通过经过验证的 Vitest 维护升级处理，并重新执行覆盖率和无障碍门禁。
- `baseline-browser-mapping` / `browserslist`：浏览器/构建元数据。npm 建议
  `npm audit fix`。WP06 暂时保留；随所属构建工具的 lock 更新一起处理，并重新执行 Node 20/22 矩阵。
- `brace-expansion`：ESLint、API extractor、Vue language tooling 的间接依赖。npm 建议
  `npm audit fix`。作为开发工具间接依赖保留；在 ESLint 或声明生成工具升级时复核。
- `braces` / `micromatch` / `fast-glob` / `globby` / `gh-pages`：Demo 部署工具链。npm 对该链路建议 force fix。当前保留，**不执行强制升级**；部署工具升级或移除时重新评估。
- `esbuild`、`nanoid`、`postcss`、`source-map-js`：Vite/构建链。npm 建议
  `npm audit fix`。WP06 暂时保留；通过经过验证的 Vite/工具链 lock 刷新处理。
- `fast-uri` / `js-yaml`：lint/config 工具链。npm 建议 `npm audit fix`。
  作为开发配置间接依赖保留；随所属直接依赖升级时复核。
- `sprintf-js`（经 API extractor / `vite-plugin-dts`）：声明构建工具链。npm 对该链路建议 force fix。当前保留，不强制升级，因为类型声明输出属于发布契约。
- `undici`：开发工具间接依赖。npm 建议 `npm audit fix`。作为 dev-only 间接依赖保留；在直接工具链维护时复核。

以上分类依据 npm 输出中的依赖路径，不代表列出的每个包都是直接依赖。

### Native — `Pixman022/fresnica-ui-native`

证据：当前 React Native 0.87 / Jest 工具链最近一次 Native CI 审计输出。

- 全量依赖审计：**40 个漏洞**——5 moderate、34 high、1 critical。
- 生产依赖审计（`npm audit --omit=dev --audit-level=moderate`）：**0 个漏洞**。
- 可复用 Native 包把 React / React Native 作为 peer dependencies，并没有普通运行时
  `dependencies` 项；因此当前审计告警位于仓库的开发、测试、构建依赖图。
- 已观察到的路径包括 Jest/Babel/Istanbul、Metro/React Native 工具链、
  `braces` / `micromatch`、`shell-quote`（critical，npm 报告有非 force 修复）
  以及 `sprintf-js` / YAML 相关测试工具链。

**生产依赖 0 告警**仅适用于当前组件包安装图，不能推广为未来 Fresnica 钱包 App
也没有依赖风险；钱包 App 会拥有自己的运行时依赖图。

## 处置策略

1. CI 中持续分开记录全量审计和生产依赖审计。
2. 只有在保持已声明 React、React Native、Node 和构建基线的前提下，才优先采用兼容的非 force lock/依赖更新。
3. 不为了降低告警数量运行或模仿 `npm audit fix --force`。force-only 修复可能改变
   `gh-pages`、API extractor/声明工具、Jest、Metro 或 React Native 兼容性，必须作为独立升级验证。
4. 任何实际依赖变更都必须通过仓库完整 CI 以及相关 consumer/build 验证。
5. 暂时保留的告警继续记录其 dev-only 暴露范围和重新评估触发条件。

## 重新评估触发条件

出现以下任一情况时重新执行分类：

- Vite/Vitest、Jest、Metro、React Native 或声明生成工具基线升级；
- 当前 dev-only 依赖进入运行时产物；
- npm 报告生产依赖漏洞；
- 第一个真实钱包宿主增加自己的运行时依赖图；
- 之前 force-only 的链路出现普通非 force 修复方案。

## 当前 WP06 状态

审计拆分和分类已经建立。**WP06 不修改依赖版本**：两个组件包的生产依赖审计均为
0，当前报告的告警都位于开发、测试或构建工具链，而且受影响包大多是固定测试/构建生态的间接依赖。普通修复候选保留到所属直接工具链被明确维护升级时处理，届时需要检查 lock 差异并重新通过完整 quality、consumer 和 build 门禁。force-only 变更在没有独立兼容性升级验证前明确拒绝。

全量审计数量继续作为维护信号，生产依赖审计作为组件包运行时门槛。这是一项有记录的处置决定，不代表开发依赖告警无害或被永久接受。
