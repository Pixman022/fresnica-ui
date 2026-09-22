import React from 'react';
import styles from './bottom-navigation.module.less';
export interface BottomNavigationItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    disabled?: boolean;
    ariaLabel?: string;
}
export type BottomNavigationPosition = 'static' | 'sticky' | 'fixed';
export interface BottomNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
    items: BottomNavigationItem[];
    activeKey?: string;
    onChange?: (key: string) => void;
    position?: BottomNavigationPosition;
    safeArea?: boolean;
}
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    items,
    activeKey,
    onChange,
    position = 'sticky',
    safeArea = true,
    className,
    ...rest
}) => (
    <nav
        aria-label="Primary navigation"
        className={[styles.nav, styles[`position-${position}`], safeArea && styles.safeArea, className]
            .filter(Boolean)
            .join(' ')}
        {...rest}
    >
        {items.map((item) => (
            <button
                type="button"
                key={item.key}
                className={item.key === activeKey ? styles.active : undefined}
                aria-current={item.key === activeKey ? 'page' : undefined}
                aria-label={item.ariaLabel}
                disabled={item.disabled}
                onClick={() => !item.disabled && onChange?.(item.key)}
            >
                <span className={styles.icon} aria-hidden="true">
                    {item.icon}
                    {item.badge !== undefined && <span className={styles.badge}>{item.badge}</span>}
                </span>
                <span className={styles.label}>{item.label}</span>
            </button>
        ))}
    </nav>
);
BottomNavigation.displayName = 'BottomNavigation';
