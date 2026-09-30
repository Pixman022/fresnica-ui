import React from 'react';
import { LoaderCircle } from 'lucide-react';
import styles from './Loading.module.less';
import type { ComponentLabelOverrides } from '../labels';

export interface LoadingProps {
    className?: string;
    style?: React.CSSProperties;
    active?: boolean;
    label?: string;
    labels?: Pick<ComponentLabelOverrides, 'loading'>;
}

export const Loading: React.FC<LoadingProps> = ({ className, style, active = true, label, labels }) => {
    if (!active) return null;

    return (
        <div
            className={[styles.container, className].filter(Boolean).join(' ')}
            style={style}
            role="status"
            aria-live="polite"
        >
            <LoaderCircle className={styles.spinner} size={32} strokeWidth={2.25} aria-hidden="true" />
            <span className={styles.label}>{label ?? labels?.loading ?? 'Loading'}</span>
        </div>
    );
};

Loading.displayName = 'Loading';
