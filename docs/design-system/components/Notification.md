# Notification

Source: `src/components/Notification/NotificationPortal.tsx`, `Notification.tsx`, and `notification.module.less`.

Notification provides an imperative API. Calls mount a single SSR-safe root on `document.body`, and `useSyncExternalStore` keeps the six position groups in sync.

## API

```tsx
Notification.open({ message: 'Transaction submitted', position: 'top', duration: 4.5 });
Notification.success('Saved');
Notification.info('Stellar ledger synchronized');
Notification.warning('XLM balance is low');
Notification.error('Network request failed');
Notification.destroy();
Notification.destroy('request-key');
```

Config supports `message`, `description`, `type`, `position`, `duration`, `btn`, `icon`, `closeIcon`, `onClick`, `onClose`, and a stable `key` for in-place updates.

## Position layer

- Positions: `top`, `topLeft`, `topRight`, `bottom`, `bottomLeft`, `bottomRight`.
- Edge offset: 16px; group gap: 12px (`--Fresnica-spacing-md`).
- Root uses `pointer-events: none`; individual notification cards restore `pointer-events: auto`.
- Bottom groups use `column-reverse` so the newest item remains nearest the edge.

## Card

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

Type borders and icon wrappers use their corresponding semantic tokens:

- Success: `--Fresnica-success-color`.
- Info: `--Fresnica-primary-color`.
- Warning: `--Fresnica-warning-color`.
- Error: `--Fresnica-error-color`.

Error notification hover, focus, and actions must remain in the error colour family. Primary actions use white text and white Lucide icons.

## Content and actions

- Icon wrapper: 32px circle with a 16% semantic-colour tint.
- Title: 14px, 700 weight, `--Fresnica-text-color`.
- Description: 13px, regular weight, `--Fresnica-text-color-secondary`.
- Close action: 28px circular control using a Lucide icon and inherited colour.
- Clickable cards use a 1px upward hover translation and primary border emphasis.
- Keyboard focus uses a 2px `--Fresnica-focus-color` outline.

## Motion and accessibility

Top and bottom notifications enter and leave with a 12px directional translation plus opacity. Motion uses the shared duration/easing tokens and drops to 0.01s under `prefers-reduced-motion`.

Clickable notifications expose button semantics and keyboard activation. Close controls have an accessible label, and timers pause while users interact where required by the implementation.
