import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { AssetIcon } from '../AssetIcon';
import { Button } from '../Button';
import { TransactionStatus, TransactionStatusValue } from '../TransactionStatus';
import styles from './transaction-details.module.less';

export interface TransactionDetailField {
    label: React.ReactNode;
    value: React.ReactNode;
    copyValue?: string;
}

export interface TransactionDetailsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onCopy'> {
    assetSymbol: React.ReactNode;
    assetName?: React.ReactNode;
    title: React.ReactNode;
    status: TransactionStatusValue;
    timestamp?: React.ReactNode;
    fields: TransactionDetailField[];
    explorerLabel?: React.ReactNode;
    onExplorerClick?: () => void;
    onCopy?: (value: string) => void;
    onBack?: () => void;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    assetSymbol,
    assetName,
    title,
    status,
    timestamp,
    fields,
    explorerLabel = 'View on explorer',
    onExplorerClick,
    onCopy,
    onBack,
    className,
    ...rest
}) => (
    <article className={[styles.details, className].filter(Boolean).join(' ')} {...rest}>
        <header className={styles.header}>
            <Button type="text" size="small" aria-label="Go back" onClick={onBack}>
                <ArrowLeft size={16} aria-hidden="true" />
            </Button>
            <span className={styles.headerTitle}>Transaction details</span>
            <span className={styles.headerSpacer} aria-hidden="true" />
        </header>
        <section className={styles.hero} aria-label="Transaction summary">
            <AssetIcon symbol={assetSymbol} size="large" />
            {assetName && <span className={styles.assetName}>{assetName}</span>}
            <h2>{title}</h2>
            <TransactionStatus status={status} />
            {timestamp && <time className={styles.timestamp}>{timestamp}</time>}
        </section>
        <dl className={styles.fields}>
            {fields.map((field, index) => (
                <div className={styles.field} key={index}>
                    <dt>{field.label}</dt>
                    <dd>
                        <span className={field.copyValue ? styles.mono : undefined}>{field.value}</span>
                        {field.copyValue && (
                            <Button
                                type="text"
                                size="small"
                                aria-label={`Copy ${String(field.label)}`}
                                onClick={() => onCopy?.(field.copyValue as string)}
                            >
                                Copy
                            </Button>
                        )}
                    </dd>
                </div>
            ))}
        </dl>
        {onExplorerClick && (
            <Button type="dashed" block onClick={onExplorerClick}>
                {explorerLabel} <ExternalLink size={16} aria-hidden="true" />
            </Button>
        )}
    </article>
);

TransactionDetails.displayName = 'TransactionDetails';
