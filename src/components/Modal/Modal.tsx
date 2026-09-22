import React, { useEffect, useCallback, useState, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../Button';
import { Typewriter } from '../Typewriter';
import styles from './modal.module.less';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
].join(',');

const getFocusable = (root: HTMLElement): HTMLElement[] => {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    );
};

export type ModalVariant = 'default' | 'confirm' | 'danger';

export interface ModalProps {
    /** 是否可见 */
    open: boolean;
    /** 标题 */
    title?: React.ReactNode;
    /** 宽度 */
    width?: number | string;
    /** 点击遮罩关闭 */
    maskClosable?: boolean;
    /** 底部按钮区域 */
    footer?: React.ReactNode | null;
    /** 关闭回调 */
    onClose?: () => void;
    /** 确认回调 */
    onOk?: () => void;
    /** 自定义内容 */
    children?: React.ReactNode;
    className?: string;
    /** 打字机每字间隔 (ms), 默认 80 */
    typeSpeed?: number;
    /** 是否启用打字机效果, 默认 true */
    typewriter?: boolean;
    /** 遮罩层自定义样式 */
    maskStyle?: React.CSSProperties;
    /** 默认、确认或危险操作形态 */
    variant?: ModalVariant;
    okText?: React.ReactNode;
    cancelText?: React.ReactNode;
    okLoading?: boolean;
    okDisabled?: boolean;
    closable?: boolean;
    closeLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    title,
    width = 520,
    maskClosable = true,
    footer,
    onClose,
    onOk,
    children,
    className,
    typeSpeed = 80,
    typewriter = false,
    maskStyle,
    variant = 'default',
    okText = '确定',
    cancelText = '取消',
    okLoading = false,
    okDisabled = false,
    closable = false,
    closeLabel = '关闭',
}) => {
    // 每次 open 变为 true 时重启打字机
    const [playKey, setPlayKey] = useState(0);
    useEffect(() => {
        if (open) setPlayKey((k) => k + 1);
    }, [open]);

    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // 打开时记录触发元素 + 把焦点送进对话框；关闭时归还焦点
    useEffect(() => {
        if (!open) return;
        previouslyFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
        // 等下一个 microtask，让对话框节点已经挂载且 createPortal 完成
        const id = window.setTimeout(() => {
            const dialog = dialogRef.current;
            if (!dialog) return;
            const focusables = getFocusable(dialog);
            (focusables[0] ?? dialog).focus();
        }, 0);
        return () => {
            window.clearTimeout(id);
            previouslyFocusedRef.current?.focus?.();
        };
    }, [open]);

    // ESC 关闭 + Tab/Shift+Tab 焦点陷阱
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose?.();
                return;
            }
            if (e.key !== 'Tab') return;
            const dialog = dialogRef.current;
            if (!dialog) return;
            const focusables = getFocusable(dialog);
            if (focusables.length === 0) {
                e.preventDefault();
                dialog.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;
            if (e.shiftKey) {
                if (active === first || !dialog.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last || !dialog.contains(active)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // 禁止滚动
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleMaskClick = useCallback(() => {
        if (maskClosable) onClose?.();
    }, [maskClosable, onClose]);

    const handleContentClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const idPrefix = `Fresnica-modal-${useId().replace(/:/g, '')}`;
    const titleId = `${idPrefix}-title`;
    const bodyId = `${idPrefix}-body`;

    if (!open) return null;

    const defaultFooter = (
        <>
            <Button onClick={onClose}>{cancelText}</Button>
            <Button
                type="primary"
                danger={variant === 'danger'}
                loading={okLoading}
                disabled={okDisabled}
                onClick={onOk}
            >
                {okText}
            </Button>
        </>
    );

    const modalContent = (
        <div className={styles.mask} style={maskStyle} onClick={handleMaskClick}>
            <div
                ref={dialogRef}
                className={[styles.modal, styles[`variant-${variant}`], className].filter(Boolean).join(' ')}
                style={{ width }}
                onClick={handleContentClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={bodyId}
                tabIndex={-1}
            >
                <div className={styles.modalClipped}>
                    {(title || closable) && (
                        <div className={styles.header}>
                            {title && (
                                <div className={styles.title} id={titleId}>
                                    {title}
                                </div>
                            )}
                            {closable && (
                                <button
                                    type="button"
                                    className={styles.close}
                                    onClick={onClose}
                                    aria-label={closeLabel}
                                >
                                    <X size={18} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    )}
                    <div className={styles.body} id={bodyId}>
                        {typewriter ? (
                            <Typewriter speed={typeSpeed} trigger={playKey}>
                                {children}
                            </Typewriter>
                        ) : (
                            children
                        )}
                    </div>
                    {footer !== null && (
                        <div className={styles.footer}>{footer === undefined ? defaultFooter : footer}</div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';
