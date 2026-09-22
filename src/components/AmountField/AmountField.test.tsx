import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setup } from '@test/utils';
import { AmountField } from './AmountField';
import styles from './amount-field.module.less';

describe('AmountField', () => {
    it('渲染金额、资产和余额', () => {
        render(
            <AmountField aria-label="Amount" currency="XLM" balance="120.50 XLM" className="custom" defaultValue="10" />
        );

        const input = screen.getByRole('textbox', { name: 'Amount' });
        expect(input).toHaveValue('10');
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveAttribute('inputmode', 'decimal');
        expect(input).toHaveClass(styles.input, 'custom');
        expect(screen.getByText('XLM')).toBeInTheDocument();
        expect(screen.getByText('Balance 120.50 XLM')).toHaveClass(styles.supporting);
    });

    it('点击 Max 触发回调', async () => {
        const user = setup();
        const onMax = vi.fn();
        render(<AmountField aria-label="Amount" onMax={onMax} />);

        await user.click(screen.getByRole('button', { name: 'Max' }));
        expect(onMax).toHaveBeenCalledTimes(1);
    });

    it('渲染法币估值和错误帮助文本', () => {
        render(<AmountField aria-label="Amount" fiatValue="$12.00" status="error" helpText="余额不足" />);
        expect(screen.getByText('$12.00')).toBeInTheDocument();
        expect(screen.getByText('余额不足')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
});
