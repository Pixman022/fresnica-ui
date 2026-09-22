import React from 'react';
import styles from './asset-row.module.less';

export interface AssetRowProps {
    name: React.ReactNode;
    symbol: React.ReactNode;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    balance?: React.ReactNode;
    fiatValue?: React.ReactNode;
    change?: number;
    trailing?: React.ReactNode;
    size?: 'compact' | 'default';
    selected?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    style?: React.CSSProperties;
}

export const AssetRow: React.FC<AssetRowProps> = ({
    name,
    symbol,
    icon,
    description,
    balance,
    fiatValue,
    change,
    trailing,
    size = 'default',
    selected = false,
    disabled = false,
    onClick,
    className,
    style,
}) => {
    const hasValues = balance !== undefined || fiatValue !== undefined || change !== undefined;
    const cls = [
        styles.row,
        styles[`size-${size}`],
        selected && styles.selected,
        trailing && styles.hasTrailing,
        className,
    ]
        .filter(Boolean)
        .join(' ');
    const content = (
        <>
            <span className={styles.icon} aria-hidden="true">
                {icon ?? String(symbol).slice(0, 1)}
            </span>
            <span className={styles.identity}>
                <strong>{name}</strong>
                <span>{description ?? symbol}</span>
            </span>
            {hasValues && (
                <span className={styles.values}>
                    {balance !== undefined && <strong>{balance}</strong>}
                    {(fiatValue !== undefined || change !== undefined) && (
                        <span className={styles.fiat}>
                            {fiatValue}
                            {change !== undefined && (
                                <span className={change >= 0 ? styles.positive : styles.negative}>
                                    {` ${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
                                </span>
                            )}
                        </span>
                    )}
                </span>
            )}
            {trailing && (
                <span className={styles.trailing} aria-hidden="true">
                    {trailing}
                </span>
            )}
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                className={cls}
                style={style}
                onClick={onClick}
                disabled={disabled}
                aria-pressed={selected || undefined}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={cls} style={style} aria-disabled={disabled || undefined}>
            {content}
        </div>
    );
};

AssetRow.displayName = 'AssetRow';
