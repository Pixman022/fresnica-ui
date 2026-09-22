import React from 'react';
import styles from './divider.module.less';

export type DividerType = 'solid' | 'subtle' | 'dashed' | 'accent';

export interface DividerProps {
    type?: DividerType;
    className?: string;
    style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({ type = 'subtle', className, style }) => (
    <div
        className={[styles.divider, styles[type], className].filter(Boolean).join(' ')}
        style={style}
        role="separator"
    />
);

Divider.displayName = 'Divider';
