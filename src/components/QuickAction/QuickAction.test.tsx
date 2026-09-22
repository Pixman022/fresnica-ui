import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setup } from '@test/utils';
import { QuickAction } from './QuickAction';
import styles from './quick-action.module.less';

describe('QuickAction', () => {
    it('渲染图标、标签和自定义类名', () => {
        render(<QuickAction icon="S" label="发送" className="custom" />);

        const button = screen.getByRole('button', { name: '发送' });
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveClass(styles.action, 'custom');
        expect(button.querySelector(`.${styles.icon}`)).toHaveAttribute('aria-hidden', 'true');
    });

    it('响应点击并遵守 disabled', async () => {
        const user = setup();
        const onClick = vi.fn();
        const { rerender } = render(<QuickAction label="发送" onClick={onClick} />);

        await user.click(screen.getByRole('button', { name: '发送' }));
        expect(onClick).toHaveBeenCalledTimes(1);

        rerender(<QuickAction label="发送" onClick={onClick} disabled />);
        await user.click(screen.getByRole('button', { name: '发送' }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('支持品牌形态、选中态和加载态', () => {
        render(<QuickAction label="兑换" variant="primary" size="compact" selected loading />);
        const button = screen.getByRole('button', { name: '兑换' });
        expect(button).toHaveClass(styles['variant-primary'], styles['size-compact'], styles.selected);
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-busy', 'true');
    });
});
