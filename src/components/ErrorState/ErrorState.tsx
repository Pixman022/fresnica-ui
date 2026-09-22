import React, { useId } from 'react';
import { CircleAlert } from 'lucide-react';
import styles from './error-state.module.less';

export type ErrorStateSize = 'small' | 'middle' | 'large';

export interface ErrorStateProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    /** Optional visual cue; the default is a semantic alert icon. */
    icon?: React.ReactNode;
    /** Heading shown above the optional description. */
    title?: React.ReactNode;
    /** Explanation that helps the user understand or recover from the error. */
    description?: React.ReactNode;
    /** Optional recovery action, usually a retry or back button. */
    action?: React.ReactNode;
    size?: ErrorStateSize;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    icon,
    title = 'Something went wrong',
    description,
    action,
    size = 'middle',
    className,
    children,
    ...rest
}) => {
    const titleId = useId();
    const descriptionId = useId();
    const classNames = [styles.errorState, styles[`size-${size}`], className].filter(Boolean).join(' ');

    return (
        <section
            className={classNames}
            role="alert"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            {...rest}
        >
            <div className={styles.icon} aria-hidden="true">
                {icon ?? <CircleAlert size={size === 'small' ? 28 : 36} strokeWidth={1.8} />}
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

ErrorState.displayName = 'ErrorState';
