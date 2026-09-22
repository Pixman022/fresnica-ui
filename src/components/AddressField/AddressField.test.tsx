import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setup } from '@test/utils';
import { AddressField } from './AddressField';
import styles from './address-field.module.less';

describe('AddressField', () => {
    it('渲染地址输入框并透传输入属性', () => {
        render(<AddressField aria-label="Stellar address" defaultValue="GABC" className="custom" />);

        const input = screen.getByRole('textbox', { name: 'Stellar address' });
        expect(input).toHaveValue('GABC');
        expect(input).toHaveAttribute('inputmode', 'text');
        expect(input).toHaveAttribute('spellcheck', 'false');
        expect(input).toHaveClass(styles.input, 'custom');
    });

    it('复制当前地址并显示完成状态', async () => {
        const user = setup();
        const onCopy = vi.fn();
        render(<AddressField aria-label="Stellar address" value="GTEST" readOnly onCopy={onCopy} />);

        await user.click(screen.getByRole('button', { name: 'Copy address' }));

        expect(onCopy).toHaveBeenCalledWith('GTEST');
        expect(screen.getByRole('button', { name: 'Address copied' }).querySelector('svg')).toBeInTheDocument();
    });

    it('支持只读展示和粘贴操作', async () => {
        const user = setup();
        const onPasteClick = vi.fn();
        render(<AddressField mode="display" value="GDISPLAY" onPasteClick={onPasteClick} />);
        expect(screen.getByText('GDISPLAY')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Paste address' })).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Copy address' }));
    });
});
