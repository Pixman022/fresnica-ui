import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwapRoute } from './SwapRoute';
import styles from './swap-route.module.less';

describe('SwapRoute', () => {
    it('渲染直接兑换路径', () => {
        render(<SwapRoute from="XLM" to="USDC" rate="1 XLM = 0.12 USDC" data-testid="route" />);

        expect(screen.getByTestId('route')).toHaveClass(styles.route);
        expect(screen.getByText('XLM')).toBeInTheDocument();
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('Rate 1 XLM = 0.12 USDC')).toBeInTheDocument();
        expect(screen.queryByText('Best route')).not.toBeInTheDocument();
    });

    it('渲染中转资产和最佳路径状态', () => {
        const { container } = render(
            <SwapRoute from="XLM" via="AQUA" to="USDC" best className="custom" data-testid="route" />
        );

        expect(screen.getByTestId('route')).toHaveClass(styles.route, styles.best, 'custom');
        expect(screen.getByText('AQUA')).toBeInTheDocument();
        expect(screen.getByText('Best route')).toHaveClass(styles.badge);
        expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
    });
});
