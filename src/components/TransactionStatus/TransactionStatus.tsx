import React from 'react';
import styles from './transaction-status.module.less';
import type { ComponentLabelOverrides } from '../labels';
export type TransactionStatusValue = 'pending' | 'success' | 'failed';
export interface TransactionStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: TransactionStatusValue;
    children?: React.ReactNode;
    labels?: Pick<ComponentLabelOverrides, 'pending' | 'completed' | 'failed'>;
}
export const TransactionStatus: React.FC<TransactionStatusProps> = ({
    status,
    children,
    labels,
    className,
    ...rest
}) => {
    const fallback = { pending: 'Pending', success: 'Completed', failed: 'Failed' }[status];
    const localized = { pending: labels?.pending, success: labels?.completed, failed: labels?.failed }[status];
    return (
        <span className={[styles.status, styles[status], className].filter(Boolean).join(' ')} {...rest}>
            {children ?? localized ?? fallback}
        </span>
    );
};
TransactionStatus.displayName = 'TransactionStatus';
