# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version baseline

当前项目以 `1.0.0` 作为全新项目版本基线。下方 `1.8.0`、`2.0.0` 及更早条目保留为历史遗留记录，不代表当前项目的版本起点。

## [Unreleased]

### Added

- Added `FresnicaThemeProvider`, local HEX theme-color customization, automatic light/dark token generation, WCAG AA foreground adjustment, local persistence, and cross-tab synchronization. Financial semantic colors remain independent.

### Removed

- 删除未使用且为空的旧示例组件目录：`Countdown`、`Phone`、`Time` 和 `Wallet`；现有 Fresnica 组件、Demo 路由及公开导出不受影响。
- 删除已被 WebP 替代的 Demo Banner PNG 源文件：`banner01.png` 至 `banner04.png`；Image 和 Carousel 的运行时与代码示例引用均已迁移至 WebP。

## [2.0.0] - 2026-09-11

### Added

- 工具链：ESLint flat config + CI workflow + EditorConfig
- 设计体系审计：新增 `npm run audit:tokens`，并接入本地 CI 与 GitHub Actions 静态检查阶段

### Removed

- 删除历史 `demo/img/`、`src/assets/img/` 与 `docs/img/` 中未使用的动物主题素材；Fresnica Logo 与应用图标保留。
- 删除 `--Fresnica-secondary-*` 废弃协议紫别名；请使用 `--Fresnica-accent-purple-*`。
- 删除 `--Fresnica-shadow-sm` / `--Fresnica-shadow-lg` 兼容别名；统一使用 `--Fresnica-shadow-base`（明确的无投影契约）。
- 删除 `Card.pattern`、`Tabs.stateAnimation`、`Tabs.shadow` 与 `Input.shadow` 旧版兼容属性；这些属性在 Fresnica 主题中没有视觉效果。

### Migration

- `--Fresnica-secondary-color*` → `--Fresnica-accent-purple-color*`
- `--Fresnica-shadow-sm` / `--Fresnica-shadow-lg` → `--Fresnica-shadow-base`
- 删除 `Card.pattern`、`Tabs.stateAnimation`、`Tabs.shadow`、`Input.shadow`；请移除调用方中的这些属性。
- 历史主题图片已从仓库工作目录移除；Fresnica Logo 与应用图标路径保持不变。

## [1.0.1] - 2026-06-09

### Fixed

- `vite.config.ts`：`assetInfo.name` → `assetInfo.names`（对齐 Rollup 弃用 API）
- `vite.config.ts`：修复 Vite 7 `assetFileNames` 多 output 一致性校验
- `vite.config.ts`：CSS 产物 `build.lib.cssFileName` 命名规范化
- `package.json`：`classnames` 移出 `dependencies`、改入 `peerDependencies`
- Icon 组件：488 个 PNG 由静态 import 改为动态懒加载

### Changed

- 字体加载策略调整
- 图片格式优化：`.png` → `.webp` / `.jpg`
- 移除 CSS 内联的 base64 图片

## [1.0.0] - 2026-XX-XX

### Added

- 首次正式发布 1.0.0 版本

## [0.9.x]

历史版本 0.9.0 ~ 0.9.8 见 [GitHub Releases](https://github.com/Pixman022/fresnica-ui/releases)
