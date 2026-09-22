import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from './Divider';
import styles from './divider.module.less';

describe('Divider', () => {
    it('默认使用 subtle 类型', () => {
        const { container } = render(<Divider />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.divider, styles.subtle);
    });

    it('支持自定义 type', () => {
        const { container } = render(<Divider type="dashed" />);
        expect(container.firstChild).toHaveClass(styles.dashed);
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Divider className="x" style={{ width: 100 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('x');
        expect(root).toHaveStyle({ width: '100px' });
    });
});
