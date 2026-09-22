import React, { useId } from 'react';
import styles from './amount-field.module.less';

export type AmountFieldStatus = 'default' | 'error' | 'warning';

export interface AmountFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    currency?: React.ReactNode;
    balance?: React.ReactNode;
    fiatValue?: React.ReactNode;
    onMax?: () => void;
    onCurrencyClick?: () => void;
    maxLabel?: React.ReactNode;
    balanceLabel?: React.ReactNode;
    status?: AmountFieldStatus;
    helpText?: React.ReactNode;
    containerClassName?: string;
}

export const AmountField: React.FC<AmountFieldProps> = ({
    currency,
    balance,
    fiatValue,
    onMax,
    onCurrencyClick,
    maxLabel = 'Max',
    balanceLabel = 'Balance',
    status = 'default',
    helpText,
    containerClassName,
    className,
    ...rest
}) => {
    const helpId = `Fresnica-amount-help-${useId().replace(/:/g, '')}`;
    const describedBy = rest['aria-describedby'] ?? (helpText ? helpId : undefined);
    const fieldClass = [styles.field, styles[`status-${status}`], containerClassName].filter(Boolean).join(' ');

    const currencyNode = onCurrencyClick ? (
        <button
            type="button"
            className={styles.currencyButton}
            onClick={onCurrencyClick}
            disabled={rest.disabled}
            aria-label="Select asset"
        >
            {currency}
        </button>
    ) : (
        currency && <span className={styles.currency}>{currency}</span>
    );

    return (
        <div className={fieldClass}>
            <div className={styles.control}>
                <input
                    {...rest}
                    className={[styles.input, className].filter(Boolean).join(' ')}
                    type="text"
                    inputMode="decimal"
                    aria-invalid={status === 'error' || undefined}
                    aria-describedby={describedBy}
                />
                <div className={styles.trailing}>
                    {currencyNode}
                    {onMax && (
                        <button type="button" className={styles.maxButton} onClick={onMax} disabled={rest.disabled}>
                            {maxLabel}
                        </button>
                    )}
                </div>
            </div>
            {(balance !== undefined || fiatValue !== undefined || helpText !== undefined) && (
                <div className={styles.meta} id={helpText ? helpId : undefined}>
                    <span className={styles.supporting}>
                        {helpText ?? (balance !== undefined ? `${String(balanceLabel)} ${String(balance)}` : null)}
                    </span>
                    {fiatValue !== undefined && <span className={styles.fiat}>{fiatValue}</span>}
                </div>
            )}
        </div>
    );
};

AmountField.displayName = 'AmountField';
