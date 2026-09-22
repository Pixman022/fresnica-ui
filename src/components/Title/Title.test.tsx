import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Title } from './Title';
import styles from './title.module.less';

describe('Title', () => {
    it('渲染 children 文本', () => {
        const { container } = render(<Title>Hello</Title>);
        expect(container.textContent).toContain('Hello');
    });

    it('默认使用纯文字 heading 语义元素', () => {
        const { container } = render(<Title>X</Title>);
        expect(container.querySelector('h2')).toHaveClass(styles.heading, styles['heading-middle']);
    });

    it('size=large 字号 28px', () => {
        const { container } = render(<Title size="large">X</Title>);
        expect(container.querySelector('h2')).toHaveClass(styles.heading, styles['heading-large']);
    });

    it('color 非 default 时应用 color-${color}', () => {
        const { container } = render(<Title color="app-pink">X</Title>);
        expect(container.querySelector('h2')).toHaveClass(styles['heading-color-app-pink']);
    });

    it('应用 className 与 style 到根 span', () => {
        const { container } = render(
            <Title className="my-t" style={{ marginLeft: 4 }}>
                X
            </Title>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('my-t');
        expect(root).toHaveStyle({ marginLeft: '4px' });
    });

    it('heading 变体使用语义元素', () => {
        const { container } = render(
            <Title variant="heading" as="h1" size="large">
                Fresnica
            </Title>
        );
        expect(container.querySelector('h1')).toHaveTextContent('Fresnica');
        expect(container.querySelector('h1')).toHaveClass(styles.heading, styles['heading-large']);
    });
});
