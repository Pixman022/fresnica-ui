# 待删除清单

本清单记录清理候选和已完成的清理决定。新的待删除事项必须先记录在这里，得到明确批准后才能删除；已完成事项继续
保留作为审计记录。

## 候选事项

| 编号 | 范围 | 当前位置 | 列为候选的原因 | 风险 / 依赖 | 状态 |
| --- | --- | --- | --- | --- | --- |
| DEL-001 | 历史视觉素材 | `demo/img/`（`demo/img/fresnica/` 除外）、`src/assets/img/`、`docs/img/` | 历史主题素材未参与 Fresnica 组件和 Demo 构建。 | 未发现运行时引用；Fresnica 品牌资源已保留。 | 已于 2026-09-11 删除 |
| DEL-002 | 废弃 Token 别名 | `src/styles/themes/default.less`：`--Fresnica-secondary-*` | 兼容旧协议紫命名的别名。 | 未发现源码或 Demo 使用；本次清理已批准删除公开别名。 | 已于 2026-09-11 删除 |
| DEL-003 | 废弃阴影别名 | `src/styles/themes/default.less`：`--Fresnica-shadow-sm`、`--Fresnica-shadow-lg` | 设计体系已改为明确的 `--Fresnica-shadow-base: none` 契约。 | 未发现源码或 Demo 使用；本次清理已批准删除公开别名。 | 已于 2026-09-11 删除 |
| DEL-004 | 未使用的旧 Demo 路由/组件 | `src/components/Countdown/`、`src/components/Phone/`、`src/components/Time/`、`src/components/Wallet/` | 这些空的旧目录不属于当前 Fresnica Stellar 组件导航或 `PAGES` 映射。 | 全仓库使用审计未发现运行时、导出、Demo 路由或文档引用。 | 2026-09-16 经明确批准后删除 |
| DEL-005 | 已废弃的兼容属性 | `Card.pattern`、`Tabs.stateAnimation`、`Tabs.shadow`、`Input.shadow` | 为兼容旧版本消费者而保留，但在当前 Fresnica 设计体系中没有视觉效果。 | 已批准作为公开 API 删除；升级至 2.0.0 前需迁移消费者。 | 已于 2026-09-11 删除 |
| DEL-006 | 已被 WebP 替代的 Banner PNG 源文件 | `demo/img/fresnica/banner01.png` 至 `banner04.png` | Image 和 Carousel Demo 已改用优化后的 WebP 文件。 | 所有运行时和代码示例引用均已迁移至 WebP；原 PNG 在获得明确批准前暂时保留。 | 2026-09-18 经明确批准后删除 |

## 不列入候选

- `Icon` 不删除：它是文档化的 Lucide 封装，并有独立 Demo 页面。
- `Loading` 不删除：它是通用钱包反馈状态，Demo 页面过场仍在使用。
- Fresnica 品牌 Logo、应用图标等资源继续作为已批准的产品资源保留。

## 复核流程

删除前搜索源码、Demo、文档、包导出和已发布用法中的引用；运行完整 CI；同步中英文设计体系文档；并在变更日志记录
决定。金融语义颜色和公开 Token 不得因无关清理而合并或删除。
