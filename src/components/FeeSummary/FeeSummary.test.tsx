import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeeSummary } from './FeeSummary';
import styles from './fee-summary.module.less';

describe('FeeSummary', () => {
    it('渲染费用明细、弱化项和总计', () => {
        render(
            <FeeSummary
                data-testid="summary"
                className="custom"
                items={[
                    { label: 'Network fee', value: '0.00001 XLM' },
                    { label: 'Minimum balance', value: '1 XLM', muted: true },
                ]}
                total={{ label: 'Total', value: '1.00001 XLM' }}
            />
        );

        expect(screen.getByTestId('summary')).toHaveClass(styles.summary, 'custom');
        expect(screen.getByText('Network fee').parentElement).toHaveClass(styles.item);
        expect(screen.getByText('Minimum balance').parentElement).toHaveClass(styles.muted);
        expect(screen.getByText('Total').parentElement).toHaveClass(styles.total);
        expect(screen.getByText('1.00001 XLM')).toBeInTheDocument();
    });
});
