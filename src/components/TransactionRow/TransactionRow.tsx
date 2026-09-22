import React from 'react';
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import styles from './transaction-row.module.less';

export type TransactionStatus = 'pending' | 'success' | 'failed';
export type TransactionDirection = 'in' | 'out' | 'swap';
export type TransactionAmountTone = 'gain' | 'loss' | 'neutral';

export interface TransactionRowProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    icon?: React.ReactNode;
    amount?: React.ReactNode;
    fiatValue?: React.ReactNode;
    status?: TransactionStatus | null;
    statusLabel?: React.ReactNode;
    direction?: TransactionDirection;
    amountTone?: TransactionAmountTone;
    trailing?: React.ReactNode;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    style?: React.CSSProperties;
}

const STATUS_LABEL: Record<TransactionStatus, string> = {
    pending: 'Pending',
    success: 'Completed',
    failed: 'Failed',
};

export const TransactionRow: React.FC<TransactionRowProps> = ({
    title,
    subtitle,
    icon,
    amount,
    fiatValue,
    status = 'success',
    statusLabel,
    direction = 'out',
    amountTone,
    trailing,
    disabled = false,
    onClick,
    className,
    style,
}) => {
    const resolvedAmountTone = amountTone ?? (direction === 'in' ? 'gain' : direction === 'out' ? 'loss' : 'neutral');
    const cls = [styles.row, styles[`direction-${direction}`], styles[`amount-${resolvedAmountTone}`], className]
        .filter(Boolean)
        .join(' ');
    const DirectionIcon = direction === 'in' ? ArrowDownLeft : direction === 'out' ? ArrowUpRight : ArrowLeftRight;
    const content = (
        <>
            <span className={styles.icon} aria-hidden="true">
                {icon ?? <DirectionIcon size={18} strokeWidth={2.25} />}
            </span>
            <span className={styles.details}>
                <strong>{title}</strong>
                <span>{subtitle}</span>
            </span>
            {(amount !== undefined || fiatValue !== undefined) && (
                <span className={styles.values}>
                    {amount !== undefined && <strong>{amount}</strong>}
                    {fiatValue !== undefined && <span>{fiatValue}</span>}
                </span>
            )}
            {status && (
                <span className={`${styles.status} ${styles[`status-${status}`]}`}>
                    {statusLabel ?? STATUS_LABEL[status]}
                </span>
            )}
            {trailing && (
                <span className={styles.trailing} aria-hidden="true">
                    {trailing}
                </span>
            )}
        </>
    );

    return onClick ? (
        <button type="button" className={cls} style={style} onClick={onClick} disabled={disabled}>
            {content}
        </button>
    ) : (
        <div className={cls} style={style} aria-disabled={disabled || undefined}>
            {content}
        </div>
    );
};

TransactionRow.displayName = 'TransactionRow';
