import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setup } from '@test/utils';
import { BottomNavigation } from './BottomNavigation';
import styles from './bottom-navigation.module.less';

const items = [
    { key: 'assets', label: '资产', icon: 'A' },
    { key: 'activity', label: '活动', icon: 'B' },
];

describe('BottomNavigation', () => {
    it('标记当前页面并提供导航名称', () => {
        render(<BottomNavigation items={items} activeKey="assets" className="custom" />);

        expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toHaveClass(styles.nav, 'custom');
        expect(screen.getByRole('button', { name: '资产' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('button', { name: '资产' })).toHaveClass(styles.active);
        expect(screen.getByRole('button', { name: '活动' })).not.toHaveAttribute('aria-current');
    });

    it('点击导航项返回对应 key', async () => {
        const user = setup();
        const onChange = vi.fn();
        render(<BottomNavigation items={items} activeKey="assets" onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: '活动' }));
        expect(onChange).toHaveBeenCalledWith('activity');
    });

    it('支持固定位置、安全区、徽标和禁用项', async () => {
        const user = setup();
        const onChange = vi.fn();
        render(
            <BottomNavigation
                position="fixed"
                items={[{ key: 'activity', label: '活动', badge: 3, disabled: true }]}
                onChange={onChange}
            />
        );
        const nav = screen.getByRole('navigation');
        expect(nav).toHaveClass(styles['position-fixed'], styles.safeArea);
        expect(screen.getByText('3')).toHaveClass(styles.badge);
        await user.click(screen.getByRole('button', { name: '活动' }));
        expect(onChange).not.toHaveBeenCalled();
    });
});
