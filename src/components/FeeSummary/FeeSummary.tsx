import React from 'react';
import styles from './fee-summary.module.less';
export interface FeeSummaryItem {
    label: React.ReactNode;
    value: React.ReactNode;
    muted?: boolean;
}
export interface FeeSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
    items: FeeSummaryItem[];
    total?: FeeSummaryItem;
}
export const FeeSummary: React.FC<FeeSummaryProps> = ({ items, total, className, ...rest }) => (
    <div className={[styles.summary, className].filter(Boolean).join(' ')} {...rest}>
        {items.map((item, i) => (
            <div className={item.muted ? styles.muted : styles.item} key={i}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
            </div>
        ))}
        {total && (
            <div className={styles.total}>
                <span>{total.label}</span>
                <strong>{total.value}</strong>
            </div>
        )}
    </div>
);
FeeSummary.displayName = 'FeeSummary';
