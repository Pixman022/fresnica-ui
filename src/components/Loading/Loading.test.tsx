import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Loading } from './Loading';
import styles from './Loading.module.less';

describe('Loading', () => {
    it('渲染 Lucide spinner 和状态语义', () => {
        const { container } = render(<Loading />);
        const root = container.querySelector(`.${styles.container}`);
        expect(root).toBeInTheDocument();
        expect(root).toHaveAttribute('role', 'status');
        expect(root?.querySelector('svg')).toBeInTheDocument();
    });

    it('应用 className、style 与自定义标签', () => {
        const { container } = render(<Loading className="my-loading" style={{ background: 'red' }} label="同步中" />);
        const inner = container.querySelector(`.${styles.container}`) as HTMLElement;
        expect(inner).toHaveClass('my-loading');
        expect(inner.style.background).toBe('red');
        expect(inner).toHaveTextContent('同步中');
    });

    it('active=false 时不渲染加载状态', () => {
        const { container } = render(<Loading active={false} />);
        expect(container.querySelector(`.${styles.container}`)).toBeNull();
    });
});
