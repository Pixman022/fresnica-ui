import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionStatus } from './TransactionStatus';
import styles from './transaction-status.module.less';

describe('TransactionStatus', () => {
    it.each([
        ['pending', 'Pending'],
        ['success', 'Completed'],
        ['failed', 'Failed'],
    ] as const)('为 %s 状态提供默认文案', (status, label) => {
        render(<TransactionStatus status={status} data-testid="status" />);
        expect(screen.getByTestId('status')).toHaveClass(styles.status, styles[status]);
        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('允许自定义可读状态文案和类名', () => {
        render(
            <TransactionStatus status="success" className="custom">
                已确认
            </TransactionStatus>
        );
        expect(screen.getByText('已确认')).toHaveClass(styles.status, styles.success, 'custom');
    });
});
