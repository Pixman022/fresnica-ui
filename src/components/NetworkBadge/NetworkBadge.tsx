import React from 'react';
import styles from './network-badge.module.less';

export type NetworkStatus = 'online' | 'degraded' | 'offline';
export type NetworkBadgeSize = 'compact' | 'default';

export interface NetworkBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    network: React.ReactNode;
    status?: NetworkStatus;
    size?: NetworkBadgeSize;
    statusText?: React.ReactNode;
    showStatusText?: boolean;
}

const STATUS_TEXT: Record<NetworkStatus, string> = {
    online: 'Online',
    degraded: 'Degraded',
    offline: 'Offline',
};

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({
    network,
    status = 'online',
    size = 'default',
    statusText,
    showStatusText = false,
    className,
    ...rest
}) => (
    <span
        {...rest}
        className={[styles.badge, styles[status], styles[`size-${size}`], className].filter(Boolean).join(' ')}
        role="status"
        data-status={status}
    >
        <i className={styles.indicator} aria-hidden="true" />
        <span>{network}</span>
        {showStatusText && <span className={styles.statusText}>{statusText ?? STATUS_TEXT[status]}</span>}
    </span>
);
NetworkBadge.displayName = 'NetworkBadge';
