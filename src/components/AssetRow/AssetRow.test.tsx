import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AssetRow } from './AssetRow';
import styles from './asset-row.module.less';

describe('AssetRow', () => {
    it('renders asset values and change', () => {
        render(<AssetRow name="Stellar" symbol="XLM" balance="4,281.2 XLM" fiatValue="$520.41" change={1.8} />);
        expect(screen.getByText('Stellar')).toBeInTheDocument();
        expect(screen.getByText('4,281.2 XLM')).toBeInTheDocument();
        expect(screen.getByText(/\+1\.80%/)).toBeInTheDocument();
    });

    it('uses a native button when interactive', () => {
        const onClick = vi.fn();
        render(<AssetRow name="USD Coin" symbol="USDC" balance="500 USDC" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('exposes the selected asset state without adding a selected outline override', () => {
        render(<AssetRow name="Stellar" symbol="XLM" balance="4,281.2 XLM" selected />);
        const row = screen.getByText('Stellar').closest('div');

        expect(row).toHaveClass(styles.selected);
        expect(row).not.toHaveAttribute('aria-disabled');
    });

    it('supports selector rows without a balance and exposes trailing content', () => {
        render(
            <AssetRow
                name="Stellar"
                symbol="XLM"
                description="Available: 12.50"
                trailing={<span data-testid="trailing">›</span>}
                size="compact"
                onClick={() => undefined}
                selected
            />
        );
        const row = screen.getByRole('button');
        expect(row).toHaveAttribute('aria-pressed', 'true');
        expect(row).toHaveClass(styles['size-compact'], styles.hasTrailing);
        expect(screen.getByText('Available: 12.50')).toBeInTheDocument();
        expect(screen.getByTestId('trailing')).toBeInTheDocument();
    });
});
