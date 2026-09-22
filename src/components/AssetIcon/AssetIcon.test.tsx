import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssetIcon } from './AssetIcon';
import styles from './asset-icon.module.less';

describe('AssetIcon', () => {
    it('没有图片时显示资产符号和默认尺寸', () => {
        render(<AssetIcon symbol="XLM" data-testid="asset" className="custom" />);

        expect(screen.getByTestId('asset')).toHaveClass(styles.icon, styles.medium, 'custom');
        expect(screen.getByText('XLM')).toBeInTheDocument();
    });

    it('有图片时隐藏备用符号并应用尺寸', () => {
        const { container } = render(<AssetIcon symbol="XLM" src="xlm.png" size="large" />);

        expect(container.querySelector('img')).toHaveAttribute('src', 'xlm.png');
        expect(container.querySelector('img')).toHaveAttribute('alt', '');
        expect(screen.queryByText('XLM')).not.toBeInTheDocument();
        expect(container.firstChild).toHaveClass(styles.large);
    });
});
