import React from 'react';
import styles from './transaction-status.module.less';
export type TransactionStatusValue = 'pending' | 'success' | 'failed';
export interface TransactionStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: TransactionStatusValue;
    children?: React.ReactNode;
}
export const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, children, className, ...rest }) => (
    <span className={[styles.status, styles[status], className].filter(Boolean).join(' ')} {...rest}>
        {children ?? { pending: 'Pending', success: 'Completed', failed: 'Failed' }[status]}
    </span>
);
TransactionStatus.displayName = 'TransactionStatus';
