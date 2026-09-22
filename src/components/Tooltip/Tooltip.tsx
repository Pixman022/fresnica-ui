import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './tooltip.module.less';

export type TooltipPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

export type TooltipTrigger = 'hover' | 'focus' | 'click';
export type TooltipVariant = 'default' | 'accent';

export interface TooltipProps {
    title: React.ReactNode;
    placement?: TooltipPlacement;
    trigger?: TooltipTrigger;
    variant?: TooltipVariant;
    bordered?: boolean;
    children: React.ReactElement;
    className?: string;
    style?: React.CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
    title,
    placement = 'top',
    trigger = 'hover',
    variant = 'default',
    bordered = true,
    children,
    className,
    style,
}) => {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const tooltipId = `Fresnica-tooltip-${useId().replace(/:/g, '')}`;

    const show = useCallback(() => {
        clearTimeout(timerRef.current);
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        timerRef.current = setTimeout(() => setVisible(false), 100);
    }, []);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const child = React.Children.only(children);
    const childProps = child.props as {
        onMouseEnter?: React.MouseEventHandler;
        onMouseLeave?: React.MouseEventHandler;
        onFocus?: React.FocusEventHandler;
        onBlur?: React.FocusEventHandler;
        onClick?: React.MouseEventHandler;
        'aria-describedby'?: string;
    };

    const triggerProps: Record<string, unknown> = {
        'aria-describedby': visible
            ? [childProps['aria-describedby'], tooltipId].filter(Boolean).join(' ')
            : childProps['aria-describedby'],
    };

    if (trigger === 'hover') {
        triggerProps.onMouseEnter = (event: React.MouseEvent) => {
            show();
            childProps.onMouseEnter?.(event);
        };
        triggerProps.onMouseLeave = (event: React.MouseEvent) => {
            hide();
            childProps.onMouseLeave?.(event);
        };
    } else if (trigger === 'focus') {
        triggerProps.onFocus = (event: React.FocusEvent) => {
            show();
            childProps.onFocus?.(event);
        };
        triggerProps.onBlur = (event: React.FocusEvent) => {
            hide();
            childProps.onBlur?.(event);
        };
    } else {
        triggerProps.onClick = (event: React.MouseEvent) => {
            setVisible((current) => !current);
            childProps.onClick?.(event);
        };
    }

    return (
        <div className={classNames(styles.tooltipWrapper, className)} style={style}>
            {React.cloneElement(child, triggerProps)}
            <div
                className={classNames(
                    styles.tooltip,
                    styles[placement.replace(/-/g, '_')],
                    variant === 'accent' && styles.accent,
                    bordered ? styles.bordered : styles.borderless,
                    visible && styles.visible
                )}
                role="tooltip"
                id={tooltipId}
                aria-hidden={!visible}
                onMouseEnter={trigger === 'hover' ? show : undefined}
                onMouseLeave={trigger === 'hover' ? hide : undefined}
            >
                <div className={styles.content}>{title}</div>
            </div>
        </div>
    );
};

Tooltip.displayName = 'Tooltip';
