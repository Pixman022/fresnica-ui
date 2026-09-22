import React from 'react';
import styles from './footer.module.less';

export type FooterType = 'default' | 'compact';

export interface FooterProps {
    type?: FooterType;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ type = 'default', className, style, children }) => (
    <footer className={[styles.footer, styles[type], className].filter(Boolean).join(' ')} style={style}>
        {children ?? 'Fresnica · Stellar wallet interface'}
    </footer>
);

Footer.displayName = 'Footer';
