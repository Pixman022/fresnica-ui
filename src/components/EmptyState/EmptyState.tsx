import React, { useId } from 'react';
import { Inbox } from 'lucide-react';
import styles from './empty-state.module.less';

export type EmptyStateSize = 'small' | 'middle' | 'large';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    /** Optional visual cue; the default is a neutral Inbox icon. */
    icon?: React.ReactNode;
    /** Heading shown above the optional description. */
    title?: React.ReactNode;
    /** Supporting explanation or next-step guidance. */
    description?: React.ReactNode;
    /** Optional action, usually a Button or link. */
    action?: React.ReactNode;
    size?: EmptyStateSize;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title = 'No data',
    description,
    action,
    size = 'middle',
    className,
    children,
    ...rest
}) => {
    const titleId = useId();
    const descriptionId = useId();
    const classNames = [styles.emptyState, styles[`size-${size}`], className].filter(Boolean).join(' ');

    return (
        <section
            className={classNames}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            {...rest}
        >
            <div className={styles.icon} aria-hidden="true">
                {icon ?? <Inbox size={size === 'small' ? 28 : 36} strokeWidth={1.8} />}
            </div>
            {title && (
                <h2 className={styles.title} id={titleId}>
                    {title}
                </h2>
            )}
            {description && (
                <p className={styles.description} id={descriptionId}>
                    {description}
                </p>
            )}
            {action && <div className={styles.action}>{action}</div>}
            {children}
        </section>
    );
};

EmptyState.displayName = 'EmptyState';
