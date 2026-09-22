import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NetworkBadge } from './NetworkBadge';
import styles from './network-badge.module.less';

describe('NetworkBadge', () => {
    it('默认显示在线状态', () => {
        render(<NetworkBadge network="Stellar Mainnet" data-testid="network" className="custom" />);

        expect(screen.getByTestId('network')).toHaveClass(styles.badge, styles.online, 'custom');
        expect(screen.getByText('Stellar Mainnet')).toBeInTheDocument();
        expect(screen.getByTestId('network')).toHaveAttribute('role', 'status');
        expect(screen.getByTestId('network')).toHaveAttribute('data-status', 'online');
        expect(screen.getByTestId('network').querySelector('i')).toHaveClass(styles.indicator);
    });

    it('应用指定网络状态', () => {
        render(<NetworkBadge network="Horizon" status="degraded" data-testid="network" />);
        expect(screen.getByTestId('network')).toHaveClass(styles.degraded);
    });

    it('支持紧凑尺寸和可见状态文字', () => {
        render(<NetworkBadge network="Horizon" status="offline" size="compact" showStatusText />);
        expect(screen.getByRole('status')).toHaveClass(styles['size-compact'], styles.offline);
        expect(screen.getByText('Offline')).toHaveClass(styles.statusText);
    });
});
