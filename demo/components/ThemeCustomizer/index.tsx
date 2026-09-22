import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Info, Moon, Palette, Sun } from 'lucide-react';
import {
    getFresnicaThemeAdjustment,
    normalizeThemeColor,
    useFresnicaTheme,
    type FresnicaThemeMode,
} from '../../../src';

interface ThemeCustomizerProps {
    placement?: 'top' | 'bottom';
    labels?: {
        button?: string;
        title?: string;
        hex?: string;
        light?: string;
        dark?: string;
        reset?: string;
        adjusted?: string;
    };
}

const DEFAULT_LABELS = {
    button: '主题色',
    title: '自定义主题',
    hex: 'HEX 颜色',
    light: '浅色',
    dark: '深色',
    reset: '恢复默认',
    adjusted: '所选颜色可能影响文字和图标的可视度，已调整为 {effective}，以保证内容清晰可见。',
};

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ placement = 'bottom', labels = DEFAULT_LABELS }) => {
    const copy = { ...DEFAULT_LABELS, ...labels };
    const { primaryColor, mode, customized, setPrimaryColor, setMode, reset } = useFresnicaTheme();
    const [open, setOpen] = useState(false);
    const [hex, setHex] = useState(primaryColor);
    const [panelPosition, setPanelPosition] = useState<{ left: number; top: number } | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => setHex(primaryColor), [primaryColor]);

    useEffect(() => {
        if (!open) return undefined;
        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    useLayoutEffect(() => {
        if (!open) {
            setPanelPosition(null);
            return undefined;
        }

        const updatePanelPosition = () => {
            const anchor = rootRef.current?.getBoundingClientRect();
            const panel = panelRef.current?.getBoundingClientRect();
            if (!anchor || !panel) return;

            const viewportPadding = 12;
            const gap = 8;
            const maxLeft = Math.max(viewportPadding, window.innerWidth - panel.width - viewportPadding);
            const left = Math.min(Math.max(anchor.right - panel.width, viewportPadding), maxLeft);
            const aboveTop = anchor.top - panel.height - gap;
            const belowTop = anchor.bottom + gap;
            const fitsAbove = aboveTop >= viewportPadding;
            const fitsBelow = belowTop + panel.height <= window.innerHeight - viewportPadding;
            const preferredTop = placement === 'top' ? aboveTop : belowTop;
            let top = preferredTop;
            if (placement === 'top' && !fitsAbove && fitsBelow) top = belowTop;
            if (placement === 'bottom' && !fitsBelow && fitsAbove) top = aboveTop;
            const clampedTop = Math.min(
                Math.max(top, viewportPadding),
                Math.max(viewportPadding, window.innerHeight - panel.height - viewportPadding)
            );

            setPanelPosition({ left, top: clampedTop });
        };

        const frame = window.requestAnimationFrame(updatePanelPosition);
        window.addEventListener('resize', updatePanelPosition);
        window.addEventListener('scroll', updatePanelPosition, true);
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', updatePanelPosition);
            window.removeEventListener('scroll', updatePanelPosition, true);
        };
    }, [open, placement]);

    const updateHex = (value: string) => {
        setHex(value);
        const normalized = normalizeThemeColor(value);
        if (normalized) setPrimaryColor(normalized);
    };

    const changeMode = (nextMode: FresnicaThemeMode) => setMode(nextMode);
    const adjustment = getFresnicaThemeAdjustment(primaryColor, mode);
    const adjustmentMessage = copy.adjusted?.replace('{effective}', adjustment.effectivePrimaryColor);
    const defaultPrimaryColor = mode === 'dark' ? '#00CA8A' : '#00A875';

    return (
        <div ref={rootRef} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-label={copy.button}
                title={copy.button}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--Fresnica-spacing-xs)',
                    height: 44,
                    minHeight: 44,
                    padding: '0 var(--Fresnica-spacing-sm)',
                    border: 0,
                    borderRadius: 'var(--Fresnica-border-radius-sm)',
                    background: 'transparent',
                    color: 'var(--Fresnica-text-color)',
                    cursor: 'pointer',
                    font: 'inherit',
                }}
            >
                <Palette size={17} aria-hidden="true" />
                <span style={{ fontSize: 'var(--Fresnica-font-size-sm)' }}>{copy.button}</span>
            </button>
            {open && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-label={copy.title}
                    style={{
                        position: 'fixed',
                        left: panelPosition?.left ?? 0,
                        top: panelPosition?.top ?? 0,
                        visibility: panelPosition ? 'visible' : 'hidden',
                        zIndex: 1000,
                        width: 272,
                        padding: 'var(--Fresnica-spacing-lg)',
                        border: '1px solid var(--Fresnica-border-color)',
                        borderRadius: 'var(--Fresnica-border-radius-base)',
                        background: 'var(--Fresnica-surface)',
                        color: 'var(--Fresnica-text-color)',
                        boxShadow: 'var(--Fresnica-shadow-base)',
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'var(--Fresnica-font-weight-bold)',
                            marginBottom: 'var(--Fresnica-spacing-md)',
                        }}
                    >
                        {copy.title}
                    </div>
                    <label
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-xs)',
                            fontSize: 'var(--Fresnica-font-size-sm)',
                        }}
                    >
                        <span>{copy.hex}</span>
                        <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-sm)', alignItems: 'center' }}>
                            <input
                                type="color"
                                value={normalizeThemeColor(hex) ?? primaryColor}
                                onChange={(event) => updateHex(event.target.value)}
                                aria-label={copy.hex}
                                style={{ width: 40, height: 36, padding: 2, border: 0, background: 'transparent' }}
                            />
                            <input
                                type="text"
                                value={hex}
                                onChange={(event) => updateHex(event.target.value)}
                                onBlur={() => setHex(primaryColor)}
                                inputMode="text"
                                spellCheck={false}
                                aria-label={copy.hex}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    height: 36,
                                    boxSizing: 'border-box',
                                    padding: '0 var(--Fresnica-spacing-sm)',
                                    border: '1px solid var(--Fresnica-border-color)',
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: 'var(--Fresnica-surface-low)',
                                    color: 'var(--Fresnica-text-color)',
                                    font: 'inherit',
                                }}
                            />
                        </div>
                    </label>
                    {customized && adjustment.adjusted && (
                        <div
                            role="status"
                            aria-live="polite"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--Fresnica-spacing-xs)',
                                marginTop: 'var(--Fresnica-spacing-sm)',
                                color: 'var(--Fresnica-accent-blue-color)',
                                fontSize: 'var(--Fresnica-font-size-caption)',
                                lineHeight: 1.4,
                            }}
                        >
                            <Info size={14} aria-hidden="true" style={{ flex: '0 0 auto', marginTop: 2 }} />
                            <span>{adjustmentMessage}</span>
                        </div>
                    )}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--Fresnica-spacing-sm)',
                            marginTop: 'var(--Fresnica-spacing-md)',
                        }}
                    >
                        {(
                            [
                                ['light', Sun, copy.light],
                                ['dark', Moon, copy.dark],
                            ] as const
                        ).map(([value, Icon, label]) => (
                            <button
                                type="button"
                                key={value}
                                onClick={() => changeMode(value)}
                                aria-pressed={mode === value}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 'var(--Fresnica-spacing-xs)',
                                    minHeight: 36,
                                    border: '1px solid var(--Fresnica-border-color)',
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: mode === value ? 'var(--Fresnica-primary-color-bg)' : 'transparent',
                                    color:
                                        mode === value
                                            ? 'var(--Fresnica-primary-color)'
                                            : 'var(--Fresnica-text-color-secondary)',
                                    font: 'inherit',
                                    cursor: 'pointer',
                                }}
                            >
                                <Icon size={15} aria-hidden="true" />
                                {label}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={reset}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--Fresnica-spacing-xs)',
                            marginTop: 'var(--Fresnica-spacing-md)',
                            padding: 0,
                            border: 0,
                            background: 'transparent',
                            color: 'var(--Fresnica-text-color-secondary)',
                            font: 'inherit',
                            fontSize: 'var(--Fresnica-font-size-sm)',
                            cursor: 'pointer',
                        }}
                    >
                        <span
                            aria-hidden="true"
                            style={{
                                width: 12,
                                height: 12,
                                flex: '0 0 auto',
                                borderRadius: 'var(--Fresnica-border-radius-pill)',
                                border: '1px solid var(--Fresnica-border-color)',
                                background: defaultPrimaryColor,
                            }}
                        />
                        {copy.reset}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ThemeCustomizer;
