import React from 'react';
import styles from './balance-card.module.less';

export interface BalanceCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Card eyebrow, for example "Total balance". */
    label?: React.ReactNode;
    /** Primary balance value. Numbers are formatted using the current locale. */
    balance: React.ReactNode;
    /** Currency or asset unit displayed after the value. */
    currency?: React.ReactNode;
    /** Optional secondary valuation. */
    secondaryValue?: React.ReactNode;
    /** Optional period change in percent. */
    change?: number;
    /** Hide sensitive values without removing their layout. */
    hidden?: boolean;
    /** Wallet action controls. */
    actions?: React.ReactNode;
}

const formatBalance = (value: React.ReactNode) =>
    typeof value === 'number' ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(value) : value;

export const BalanceCard: React.FC<BalanceCardProps> = ({
    label = 'Total balance',
    balance,
    currency,
    secondaryValue,
    change,
    hidden = false,
    actions,
    className,
    ...rest
}) => {
    const changeTone = change === undefined ? '' : change >= 0 ? styles.positive : styles.negative;
    const cls = [styles.card, className].filter(Boolean).join(' ');

    return (
        <section className={cls} aria-label={typeof label === 'string' ? label : 'Wallet balance'} {...rest}>
            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <div className={styles.balance} aria-label={hidden ? 'Balance hidden' : undefined}>
                    <span className={styles.value}>{hidden ? '••••••' : formatBalance(balance)}</span>
                    {currency && !hidden && <span className={styles.currency}>{currency}</span>}
                </div>
                <div className={styles.meta}>
                    {secondaryValue && <span>{hidden ? '••••' : secondaryValue}</span>}
                    {change !== undefined && !hidden && (
                        <span className={changeTone}>{`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}</span>
                    )}
                </div>
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </section>
    );
};

BalanceCard.displayName = 'BalanceCard';
