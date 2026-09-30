import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { AssetIcon } from '../AssetIcon';
import { Button } from '../Button';
import { TransactionStatus, TransactionStatusValue } from '../TransactionStatus';
import styles from './transaction-details.module.less';
import type { ComponentLabelOverrides } from '../labels';

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
    labels?: Pick<
        ComponentLabelOverrides,
        | 'back'
        | 'copy'
        | 'transactionDetails'
        | 'transactionSummary'
        | 'pending'
        | 'completed'
        | 'failed'
        | 'viewOnExplorer'
    >;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    assetSymbol,
    assetName,
    title,
    status,
    timestamp,
    fields,
    explorerLabel,
    onExplorerClick,
    onCopy,
    onBack,
    labels,
    className,
    ...rest
}) => (
    <article className={[styles.details, className].filter(Boolean).join(' ')} {...rest}>
        <header className={styles.header}>
            <Button type="text" size="small" aria-label={labels?.back ?? 'Go back'} onClick={onBack}>
                <ArrowLeft size={16} aria-hidden="true" />
            </Button>
            <span className={styles.headerTitle}>{labels?.transactionDetails ?? 'Transaction details'}</span>
            <span className={styles.headerSpacer} aria-hidden="true" />
        </header>
        <section className={styles.hero} aria-label={labels?.transactionSummary ?? 'Transaction summary'}>
            <AssetIcon symbol={assetSymbol} size="large" />
            {assetName && <span className={styles.assetName}>{assetName}</span>}
            <h2>{title}</h2>
            <TransactionStatus
                status={status}
                labels={{ pending: labels?.pending, completed: labels?.completed, failed: labels?.failed }}
            />
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
                                aria-label={`${labels?.copy ?? 'Copy'} ${String(field.label)}`}
                                onClick={() => onCopy?.(field.copyValue as string)}
                            >
                                {labels?.copy ?? 'Copy'}
                            </Button>
                        )}
                    </dd>
                </div>
            ))}
        </dl>
        {onExplorerClick && (
            <Button type="dashed" block onClick={onExplorerClick}>
                {explorerLabel ?? labels?.viewOnExplorer ?? 'View on explorer'}{' '}
                <ExternalLink size={16} aria-hidden="true" />
            </Button>
        )}
    </article>
);

TransactionDetails.displayName = 'TransactionDetails';
