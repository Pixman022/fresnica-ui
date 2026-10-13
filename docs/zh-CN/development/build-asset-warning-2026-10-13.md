# 构建资产告警调查 — 2026-10-13

状态：**已调查 / 保留告警并增加验证**

## 触发原因

Web CI 运行 `38332163314` 的 library build 会输出：

`[vite-plugin-lib-assets]: Failed to obtain the sourcemap when handling the style file...`

仓库当前锁定 `@laynezh/vite-plugin-lib-assets@2.1.3`。库样式通过 Less `@import` 组合，并引用
本地字体资源；插件会尝试利用 Vite CSS transform 的 sourcemap 追踪样式资源。这个告警表示插件
没有取得它期望的 sourcemap，本身不能证明产物资源已经缺失。

上游已有 2.2.0，但公开变更与该告警无关；Vite 7 的 CSS sourcemap 限制仍有上游讨论。因此
M03 不为了隐藏日志而盲目升级插件。

## 产物验证

证据来自成功的 `main` CI 运行 `38332163314`。

### 打包组件库

生成的 `fresnica-ui-1.1.0.tgz` 包含构建 CSS 引用的全部 6 个 Noto Sans SC `.woff2` 文件。
打包 CSS 中发现的每个本地 `files/...woff2` 引用都能解析到 tarball 内的实际文件。

使用真实 Chromium 144，通过拦截 HTTP origin 加载打包后的公开 `dist/index.css` 并返回
tarball 中的真实资源，结果为：

- `document.fonts.status === "loaded"`
- `document.fonts.check('400 16px "Noto Sans SC"', '中文字体测试') === true`
- 浏览器实际请求了简体中文和 Latin 的 400 字重 `.woff2`
- 未观察到 CSS/字体资源缺失

### Demo / GitHub Pages base

CI 的 `demo-dist` 使用 `https://pixman022.github.io/fresnica-ui/` 作为文档 base，在真实
Chromium 中加载，资源响应直接来自实际 CI artifact。

- `index.html`：17 个资源请求，0 missing；其中字体 11、CSS 2、JS 3、图片 1；无图片加载失败。
- `examples.html`：13 个资源请求，0 missing；其中字体 3、CSS 3、JS 4、图片 3；无图片加载失败。
- 两个页面都渲染出预期 Fresnica 内容，并报告字体已加载。

这些结果证明当前包与 Demo 的资源路径有效，但不把 sourcemap 告警描述为“已经消失”。

## 持续门禁

`npm run build` 现在最后执行 `npm run verify:assets`。校验器扫描所有构建 CSS，按 CSS
文件位置解析本地 `url(...)` 与 `@import`，拒绝逃逸出 `dist/` 的引用，并在本地引用目标
不存在时直接失败。

既有 React 18 打包消费、Demo build 与 delivery 检查保持不变，并继续在正常质量门禁后执行。

## 结论

M03 将该上游 sourcemap 告警作为准确记录的限制保留。当前构建没有发现字体、图片或 CSS
资源缺失；新增资源引用校验会把真正的本地资源缺失转为 build failure。只有上游版本明确修复
该告警，或项目有计划升级 Vite/工具链基线时，再重新评估插件升级。
