import React, { useState, useCallback, useImperativeHandle, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './input.module.less';
import { useUiLocale } from '../../ui-context';

export type InputSize = 'small' | 'middle' | 'large';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    /** 输入框尺寸 */
    size?: InputSize;
    /** 前缀图标 */
    prefix?: React.ReactNode;
    /** 后缀图标 */
    suffix?: React.ReactNode;
    /** 允许清除 */
    allowClear?: boolean;
    /** 错误状态 */
    status?: 'error' | 'warning';
    /** 值变化回调 */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    /** 清除回调 */
    onClear?: () => void;
    /** 清除按钮的无障碍标签，默认"清除" */
    clearAriaLabel?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            size = 'middle',
            prefix,
            suffix,
            allowClear = false,
            status,
            disabled = false,
            className,
            value,
            defaultValue,
            onChange,
            onClear,
            clearAriaLabel,
            ...rest
        },
        forwardedRef
    ) => {
        const locale = useUiLocale();
        const [innerValue, setInnerValue] = useState(defaultValue ?? '');
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : innerValue;
        const inputRef = useRef<HTMLInputElement>(null);
        const { ['aria-invalid']: ariaInvalid, ...inputProps } = rest;
        const resolvedClearAriaLabel = clearAriaLabel ?? locale.clear ?? '清除';

        useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

        const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
            (e) => {
                if (!isControlled) setInnerValue(e.target.value);
                onChange?.(e);
            },
            [isControlled, onChange]
        );

        const handleClear = useCallback(() => {
            if (!isControlled) setInnerValue('');
            onClear?.();
            // 通过 dispatchEvent 产生真实的 React SyntheticEvent
            // 避免手搓假事件导致的 preventDefault/stopPropagation 缺失和 target 属性残缺
            const input = inputRef.current;
            if (input) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value'
                )?.set;
                nativeInputValueSetter?.call(input, '');
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            }
        }, [isControlled, onClear]);

        const wrapperCls = [
            styles.wrapper,
            styles[`wrapper-${size}`],
            status && styles[`wrapper-${status}`],
            disabled && styles['wrapper-disabled'],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <span className={wrapperCls}>
                {prefix && <span className={styles.prefix}>{prefix}</span>}
                <input
                    {...inputProps}
                    ref={inputRef}
                    className={styles.input}
                    disabled={disabled}
                    value={currentValue}
                    onChange={handleChange}
                    aria-invalid={status === 'error' ? true : ariaInvalid}
                />
                {allowClear && currentValue && !disabled && (
                    <button
                        type="button"
                        className={styles.clear}
                        onClick={handleClear}
                        aria-label={resolvedClearAriaLabel}
                    >
                        <X size={16} strokeWidth={2.25} aria-hidden="true" />
                    </button>
                )}
                {suffix && <span className={styles.suffix}>{suffix}</span>}
            </span>
        );
    }
);

Input.displayName = 'Input';
