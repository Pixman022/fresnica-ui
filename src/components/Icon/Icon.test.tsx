import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, ICON_LIST } from './Icon';
import styles from './icon.module.less';

describe('Icon', () => {
    it('默认渲染 Lucide 钱包图标', () => {
        const { container } = render(<Icon />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.icon);
        expect(root.querySelector('svg')).toBeInTheDocument();
    });

    it('size 应用为内联 width/height', () => {
        const { container } = render(<Icon name="camera" size={32} />);
        expect(container.firstChild).toHaveStyle({ width: '32px', height: '32px' });
    });

    it('支持字符串 size（如 100%）', () => {
        const { container } = render(<Icon name="camera" size="100%" />);
        expect(container.firstChild).toHaveStyle({ width: '100%' });
    });

    it('bounce=true 应用 bounce 类', () => {
        const { container } = render(<Icon name="camera" bounce />);
        expect(container.firstChild).toHaveClass(styles.bounce);
    });

    it('应用自定义 className 与 style', () => {
        const { container } = render(<Icon name="camera" className="extra" style={{ opacity: 0.5 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('extra');
        expect(root).toHaveStyle({ opacity: '0.5' });
    });

    it('未传 name 时使用 wallet 图标', () => {
        const { container } = render(<Icon />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('未传 size 时默认 24px', () => {
        const { container } = render(<Icon name="wallet" />);
        expect(container.firstChild).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('透传未知属性到根节点（如 data-* / aria-label）', () => {
        const { container } = render(<Icon name="wallet" data-testid="my-icon" aria-label="钱包" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('data-testid', 'my-icon');
        expect(root).toHaveAttribute('aria-label', '钱包');
        expect(root).toHaveAccessibleName('钱包');
    });

    it('style 可覆盖默认的 width/height', () => {
        const { container } = render(<Icon name="wallet" size={32} style={{ width: 50 }} />);
        expect(container.firstChild).toHaveStyle({ width: '50px', height: '32px' });
    });

    it('为每个 Lucide 图标渲染对应 SVG', () => {
        ICON_LIST.forEach(({ name }) => {
            const { container } = render(<Icon name={name} />);
            expect((container.firstElementChild as HTMLElement | null)?.querySelector('svg')).toBeInTheDocument();
        });
    });

    it('ICON_LIST 覆盖项目使用的 Lucide 图标且无重复', () => {
        const names = ICON_LIST.map((i) => i.name);
        expect(names).toHaveLength(53);
        expect(names).toEqual(
            expect.arrayContaining(['wallet', 'wallet-cards', 'send', 'copy', 'qr-code', 'settings'])
        );
        expect(new Set(names).size).toBe(names.length);
    });

    it('ICON_LIST 每项都带非空 label', () => {
        ICON_LIST.forEach(({ label }) => {
            expect(typeof label).toBe('string');
            expect(label.length).toBeGreaterThan(0);
        });
    });
});
