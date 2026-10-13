# 构建与发布

`npm run build` 产出发布物：`vite build` 把 JavaScript、CSS 与静态资源输出到 `dist/`，随后 `tsc --project tsconfig.build.json --emitDeclarationOnly` 把类型声明输出到 `dist/types/`。下面这些选择背后的理由记录在 [../adr/](../adr/)，本页是契约本身。

## 构建契约

`vite.config.ts` 在 `@vitejs/plugin-react` 之上注册了五个插件来支撑按需引入。改动构建逻辑时若不保住以下契约，就会破坏消费者的 tree-shaking：

- **双格式输出** —— ES 输出到 `dist/es/`，CJS 输出到 `dist/cjs/`，两者都开 `preserveModules: true` 与 `preserveModulesRoot: 'src'`，消费者才能按组件 tree-shake，未使用组件的字体与图片也不会进入他们的产物包。不要关掉 `preserveModules`。
- **external 不打包** —— `react`、`react-dom`、`react/jsx-runtime`、`classnames` 永不被打进产物，它们是 peerDependencies。
- **`cssCodeSplit: true` + `injectImportedCssPlugin`** —— 组件 CSS 按模块拆分，插件把 `import "./x.css"`（ES）/ `require("./x.css")`（CJS）回填进产出的 JavaScript，消费者 import 一个组件就只带进它自己的样式。不要关掉 `cssCodeSplit`。
- **资源不内联** —— `@laynezh/vite-plugin-lib-assets`（`outputPath: 'files'`、`limit: 0`）把实际引用的字体与已批准品牌资源写到 `dist/files/`，而不是让 library mode 强制内联。
- **全局样式入口** —— `emitGlobalStyleEntryPlugin` 聚合出 `dist/index.css`（即 `fresnica-ui/style` 指向的文件），并清理 `dist/files/` 里的孤儿资源。改完某个组件的 CSS 后，确认这些样式仍出现在 `dist/index.css` 里。
- **字体只留 woff2** —— `stripWoffFallbackPlugin` 删掉与 woff2 一起产出的 woff 备份，字体体积降低约 40%。
- `pruneEmptyDirsPlugin('dist')` 清理上述步骤留下的空目录。

## 包契约

`package.json` 已经为按需引入配好，保持这个状态：

- `exports` 把 `.` 映射到 ES / CJS / types 三件套，`./style` 映射到 `dist/index.css`，`./es/*` 映射到保留模块结构的 ES 产物。
- `sideEffects: false` 让打包器可以丢弃未使用的模块。
- `files` 把发布的 tarball 限制在 `dist/`、README、LICENSE 与 `THIRD_PARTY_NOTICES.md`。
- `lucide-react` 是唯一的直接运行时依赖，用于统一界面图标系统。

`prepublishOnly` 会执行 `npm run build`，因此每次发布带出去的都是新鲜产物。

## 徽章

`npm run badges`（`scripts/generate-coverage-badges.mjs`）读取 `coverage/coverage-summary.json` 与 `coverage/vitest-results.json`，写出 `coverage/badges/coverage.json`，通过扫描 `src/components/` 下含有同名 `<Name>.tsx` 的目录统计组件数，并改写 `README.md` 与 `docs/README.zh-CN.md` 里硬编码的 `tests-NN` 和 `components-NN` 徽章。先跑 `npm run test:cov` —— 覆盖率汇总文件缺失时脚本会直接报错退出。

## Demo 站点

`npm run build:demo` 用 `vite.config.demo.ts` 把 demo 构建到 `demo-dist/`。demo 永远不进 npm 产物。

公开预览由 `.github/workflows/pages.yml` 负责：`main` 上的 `CI` 成功后，工作流重新构建 `demo-dist/`，使用 GitHub 官方 Pages artifact action 上传，并部署到：

- `https://pixman022.github.io/fresnica-ui/`
- `https://pixman022.github.io/fresnica-ui/examples.html`

`npm run preview:demo` 继续用于本地生产构建预览。现有 `npm run deploy` 脚本不是 GitHub Actions Pages 流程的必需步骤。


### 资源校验

`npm run build` 最后会执行 `npm run verify:assets`，对构建 CSS 中的本地 `url(...)` / `@import` 引用进行校验；引用目标缺失或逃逸出 `dist/` 时直接失败。当前 `vite-plugin-lib-assets` sourcemap 告警已按上游限制完成调查，产物与真实浏览器证据见 [build-asset-warning-2026-10-13.md](./build-asset-warning-2026-10-13.md)。

## 交付记录

Web `1.1.0` 按自己的 SemVer 从 `1.0.0` 演进。本次 minor 版本来自 Web 的向后
兼容 API 新增，不与 Native 包版本绑定。

运行：

```bash
npm ci
npm run delivery:record
```

`delivery:record` 会复用正常 library build，执行 `npm pack --json --ignore-scripts`，
检查必须交付的包表面，把 tarball 移到 `delivery/`，计算 SHA-256，并写出匹配的 JSON
记录。记录包含精确 Git 源码 SHA、包版本、tarball 文件名、Node/React 基线、必须打包文件和
已知限制。

CI 会在完整质量门禁、React 18 消费验证和 Demo build 之后执行同一个
`Delivery artifact` 任务，并上传 `delivery/` 目录；该流程不会发布 npm。

审核后的交付必须引用一次具体 CI 运行生成的固定源码 SHA 和校验值，不能把浮动
`main` 写成已经审核的来源。

## Web 1.1 迁移

本轮同步的 `1.1.0` 改动均为增量兼容：

- 既有 `FresnicaThemeProvider` 调用继续有效；只有需要全局通用组件文案时才加入
  `FresnicaUiProvider`。
- 既有显式文案属性和逐组件 `labels` 继续有效，并且优先于 Provider Locale。
- 不使用 Locale Provider 的旧调用继续使用组件历史默认文案。
- `Button` 与 `Input` 现在转发类型明确的 DOM ref；调用方不必提供 ref。
- `fresnica-ui/locales` 是稳定的公开语言包子路径，不应从 `src/` 或 `dist/`
  内部路径导入语言包。
- 本次 Web 版本不改变 Token 数值、默认视觉、钱包业务 API、Native TalkBack 状态、iOS 状态
  或 Native 减少动画决定。

未来若出现破坏性 API，必须单独提供 major 版本迁移方案，不能根据 Native 包版本推导。
