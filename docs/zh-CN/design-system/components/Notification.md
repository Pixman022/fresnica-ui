# Notification 通知

源码：`src/components/Notification/NotificationPortal.tsx`、`Notification.tsx` 与 `notification.module.less`。

Notification 提供命令式 API。首次调用时在 `document.body` 挂载一个支持 SSR 的根节点，并通过 `useSyncExternalStore` 同步六个位置分组。

## API

```tsx
Notification.open({ message: '交易已提交', position: 'top', duration: 4.5 });
Notification.success('保存成功');
Notification.info('Stellar 账本已同步');
Notification.warning('XLM 可用余额偏低');
Notification.error('网络请求失败');
Notification.destroy();
Notification.destroy('request-key');
```

配置支持 `message`、`description`、`type`、`position`、`duration`、`btn`、`icon`、`closeIcon`、`onClick`、`onClose`，以及用于原位更新的稳定 `key`。

## 位置层

- 位置：`top`、`topLeft`、`topRight`、`bottom`、`bottomLeft`、`bottomRight`。
- 边缘间距 16px，通知间距 12px（`--Fresnica-spacing-md`）。
- 根容器使用 `pointer-events: none`，通知卡片恢复 `pointer-events: auto`。
- 底部分组使用 `column-reverse`，使最新通知靠近屏幕边缘。

## 通知卡片

```css
.notification {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 384px;
    max-width: calc(100vw - 32px);
    padding: 16px;
    color: var(--Fresnica-text-color);
    background: var(--Fresnica-surface-high);
    border: 1px solid var(--Fresnica-border-color);
    border-radius: 16px;
    box-shadow: none;
}
```

类型边框与图标容器使用对应的语义 Token：

- Success：`--Fresnica-success-color`。
- Info：`--Fresnica-primary-color`。
- Warning：`--Fresnica-warning-color`。
- Error：`--Fresnica-error-color`。

错误通知的 hover、focus 和操作必须保持错误色系。Primary 操作中的文字与 Lucide 图标必须为白色。

## 内容与操作

- 图标容器：32px 圆形，背景为 16% 透明度的语义色。
- 标题：14px、700 字重、`--Fresnica-text-color`。
- 描述：13px、常规字重、`--Fresnica-text-color-secondary`。
- 关闭操作：28px 圆形控件，使用 Lucide 图标并继承文字颜色。
- 可点击通知 hover 上移 1px，并使用主色边框强调。
- 键盘焦点使用 2px `--Fresnica-focus-color` 描边。

## 动效与无障碍

顶部和底部通知通过 12px 定向位移与透明度进入、离开。动效使用共享时长与缓动 Token；`prefers-reduced-motion` 下缩短至 0.01s。

可点击通知提供按钮语义和键盘触发；关闭按钮具有无障碍名称。需要用户交互时，计时器应按照实现约定暂停。
