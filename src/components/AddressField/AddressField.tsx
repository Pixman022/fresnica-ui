import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ClipboardPaste, Copy } from 'lucide-react';
import styles from './address-field.module.less';

export type AddressFieldMode = 'input' | 'display';
export type AddressFieldStatus = 'default' | 'error' | 'warning';

export interface AddressFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onCopy'> {
    mode?: AddressFieldMode;
    status?: AddressFieldStatus;
    helperText?: React.ReactNode;
    truncate?: boolean;
    copyable?: boolean;
    copyLabel?: string;
    copiedLabel?: string;
    pasteLabel?: string;
    onCopy?: (value: string) => void;
    onPasteClick?: () => void;
    containerClassName?: string;
}

export const AddressField: React.FC<AddressFieldProps> = ({
    mode = 'input',
    status = 'default',
    helperText,
    truncate = true,
    copyable = true,
    copyLabel = 'Copy address',
    copiedLabel = 'Address copied',
    pasteLabel = 'Paste address',
    onCopy,
    onPasteClick,
    containerClassName,
    className,
    ...rest
}) => {
    const [copied, setCopied] = useState(false);
    const copiedTimerRef = useRef<number | null>(null);
    const helpId = `Fresnica-address-help-${useId().replace(/:/g, '')}`;
    const value = String(rest.value ?? rest.defaultValue ?? '');
    const describedBy = rest['aria-describedby'] ?? (helperText ? helpId : undefined);

    useEffect(
        () => () => {
            if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
        },
        []
    );

    const copy = async () => {
        try {
            await navigator.clipboard?.writeText(value);
        } catch {
            // Clipboard access can be unavailable in file:// previews.
        }
        onCopy?.(value);
        setCopied(true);
        if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = window.setTimeout(() => setCopied(false), 1400);
    };

    const fieldClass = [styles.field, styles[`status-${status}`], containerClassName].filter(Boolean).join(' ');
    const valueClass = [styles.input, truncate && styles.truncate, className].filter(Boolean).join(' ');

    return (
        <div className={styles.wrapper}>
            <div className={fieldClass}>
                {mode === 'display' ? (
                    <span className={valueClass} title={truncate ? value : undefined}>
                        {value}
                    </span>
                ) : (
                    <input
                        {...rest}
                        className={valueClass}
                        inputMode="text"
                        spellCheck={false}
                        aria-invalid={status === 'error' || undefined}
                        aria-describedby={describedBy}
                    />
                )}
                <span className={styles.actions}>
                    {mode === 'input' && onPasteClick && (
                        <button
                            type="button"
                            className={styles.action}
                            onClick={onPasteClick}
                            disabled={rest.disabled}
                            aria-label={pasteLabel}
                        >
                            <ClipboardPaste size={16} aria-hidden="true" />
                        </button>
                    )}
                    {copyable && (
                        <button
                            type="button"
                            className={styles.action}
                            onClick={copy}
                            disabled={rest.disabled || !value}
                            aria-label={copied ? copiedLabel : copyLabel}
                        >
                            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                        </button>
                    )}
                </span>
            </div>
            {helperText && (
                <span className={styles.helper} id={helpId}>
                    {helperText}
                </span>
            )}
        </div>
    );
};

AddressField.displayName = 'AddressField';
