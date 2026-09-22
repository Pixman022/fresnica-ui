import React from 'react';
import { LoaderCircle } from 'lucide-react';
import styles from './quick-action.module.less';

export type QuickActionVariant = 'neutral' | 'primary' | 'inverse';
export type QuickActionSize = 'compact' | 'default';

export interface QuickActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    label: React.ReactNode;
    variant?: QuickActionVariant;
    size?: QuickActionSize;
    selected?: boolean;
    loading?: boolean;
}

export const QuickAction: React.FC<QuickActionProps> = ({
    icon,
    label,
    variant = 'neutral',
    size = 'default',
    selected = false,
    loading = false,
    disabled,
    className,
    ...rest
}) => (
    <button
        type="button"
        className={[
            styles.action,
            styles[`variant-${variant}`],
            styles[`size-${size}`],
            selected && styles.selected,
            className,
        ]
            .filter(Boolean)
            .join(' ')}
        disabled={disabled || loading}
        aria-pressed={selected || undefined}
        aria-busy={loading || undefined}
        {...rest}
    >
        <span className={styles.icon} aria-hidden="true">
            {loading ? <LoaderCircle className={styles.spinner} size={20} /> : icon}
        </span>
        <span className={styles.label}>{label}</span>
    </button>
);
QuickAction.displayName = 'QuickAction';
