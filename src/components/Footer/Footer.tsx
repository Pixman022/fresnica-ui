import React from 'react';
import styles from './footer.module.less';
import type { ComponentLabelOverrides } from '../labels';

export type FooterType = 'default' | 'compact';

export interface FooterProps {
    type?: FooterType;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    labels?: Pick<ComponentLabelOverrides, 'footer'>;
}

export const Footer: React.FC<FooterProps> = ({ type = 'default', className, style, children, labels }) => (
    <footer className={[styles.footer, styles[type], className].filter(Boolean).join(' ')} style={style}>
        {children ?? labels?.footer ?? 'Fresnica · Stellar wallet interface'}
    </footer>
);

Footer.displayName = 'Footer';
