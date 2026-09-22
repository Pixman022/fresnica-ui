import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setup } from '@test/utils';
import { WalletSwitcher } from './WalletSwitcher';
import styles from './wallet-switcher.module.less';

describe('WalletSwitcher', () => {
    it('渲染钱包信息和默认头像', () => {
        render(<WalletSwitcher wallet="Main Wallet" address="GABC…WXYZ" className="custom" />);

        const button = screen.getByRole('button', { name: /Main Wallet/ });
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveClass(styles.switcher, 'custom');
        expect(screen.getByText('GABC…WXYZ')).toBeInTheDocument();
        expect(button.querySelector(`.${styles.avatar} svg`)).toBeInTheDocument();
        expect(button.querySelector(`.${styles.chevron} svg`)).toBeInTheDocument();
    });

    it('支持自定义头像并响应点击', async () => {
        const user = setup();
        const onClick = vi.fn();
        render(<WalletSwitcher wallet="Savings" avatar="S" onClick={onClick} />);

        expect(screen.getByText('S')).toHaveClass(styles.avatar);
        await user.click(screen.getByRole('button', { name: /Savings/ }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('公开展开态并支持紧凑模式', () => {
        render(<WalletSwitcher wallet="Main Wallet" open compact />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button')).toHaveClass(styles.open, styles.compact);
    });
});
