import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';
import styles from './footer.module.less';

describe('Footer', () => {
    it('默认使用 Fresnica footer 语义和文案', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.footer, styles.default);
        expect(root).toHaveTextContent('Fresnica');
    });

    it('compact 类型应用紧凑样式', () => {
        const { container } = render(<Footer type="compact" />);
        expect(container.firstChild).toHaveClass(styles.footer, styles.compact);
    });

    it('支持自定义 children、className 与 style', () => {
        const { container } = render(
            <Footer className="x" style={{ height: 50 }}>
                Stellar network
            </Footer>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('x');
        expect(root).toHaveStyle({ height: '50px' });
        expect(root).toHaveTextContent('Stellar network');
    });
});
