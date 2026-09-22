/* eslint-disable react-refresh/only-export-components -- provider and hook intentionally share one context module. */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';
import {
    applyFresnicaTheme,
    DEFAULT_PRIMARY_COLOR,
    FRESNICA_THEME_STORAGE_KEY,
    normalizeThemeColor,
    type FresnicaThemeMode,
    type FresnicaThemeSnapshot,
} from './theme';

export interface FresnicaThemeProviderProps {
    children: React.ReactNode;
    initialPrimaryColor?: string;
    initialMode?: FresnicaThemeMode;
    persist?: boolean;
    syncTabs?: boolean;
    storageKey?: string;
    target?: HTMLElement;
}

export interface FresnicaThemeContextValue extends FresnicaThemeSnapshot {
    setPrimaryColor: (color: string) => void;
    setMode: (mode: FresnicaThemeMode) => void;
    reset: () => void;
}

const ThemeContext = createContext<FresnicaThemeContextValue | null>(null);

const readStored = (storageKey: string): Partial<FresnicaThemeSnapshot> => {
    if (typeof window === 'undefined') return {};
    try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
            const parsed = JSON.parse(stored) as Partial<FresnicaThemeSnapshot>;
            return {
                primaryColor: normalizeThemeColor(parsed.primaryColor ?? '') ?? undefined,
                mode: parsed.mode === 'dark' ? 'dark' : parsed.mode === 'light' ? 'light' : undefined,
                customized: parsed.customized === true,
            };
        }
        const legacyMode = window.localStorage.getItem('fresnica-theme');
        return legacyMode === 'dark' || legacyMode === 'light' ? { mode: legacyMode } : {};
    } catch {
        return {};
    }
};

const getInitialSnapshot = (props: FresnicaThemeProviderProps): FresnicaThemeSnapshot => {
    const stored = props.persist === false ? {} : readStored(props.storageKey ?? FRESNICA_THEME_STORAGE_KEY);
    const initialColor = normalizeThemeColor(props.initialPrimaryColor ?? '');
    const primaryColor = stored.primaryColor ?? initialColor ?? DEFAULT_PRIMARY_COLOR;
    return {
        primaryColor,
        mode: stored.mode ?? props.initialMode ?? 'light',
        customized:
            stored.customized ??
            Boolean(stored.primaryColor || (initialColor && initialColor !== DEFAULT_PRIMARY_COLOR)),
    };
};

export const FresnicaThemeProvider: React.FC<PropsWithChildren<FresnicaThemeProviderProps>> = (props) => {
    const storageKey = props.storageKey ?? FRESNICA_THEME_STORAGE_KEY;
    const [snapshot, setSnapshot] = useState<FresnicaThemeSnapshot>(() => getInitialSnapshot(props));

    useEffect(() => {
        const target = props.target ?? document.documentElement;
        applyFresnicaTheme(target, snapshot);
        if (props.persist !== false) {
            try {
                window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
            } catch {
                /* local persistence is optional when storage is unavailable */
            }
        }
    }, [props.persist, props.target, snapshot, storageKey]);

    useEffect(() => {
        if (props.syncTabs === false || typeof window === 'undefined') return undefined;
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== storageKey || !event.newValue) return;
            try {
                const parsed = JSON.parse(event.newValue) as Partial<FresnicaThemeSnapshot>;
                const nextColor = normalizeThemeColor(parsed.primaryColor ?? '');
                if (!nextColor) return;
                setSnapshot({
                    primaryColor: nextColor,
                    mode: parsed.mode === 'dark' ? 'dark' : 'light',
                    customized: parsed.customized === true,
                });
            } catch {
                /* Ignore malformed values from another tab. */
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [props.syncTabs, storageKey]);

    const setPrimaryColor = useCallback((color: string) => {
        const normalized = normalizeThemeColor(color);
        if (!normalized) return;
        setSnapshot((current) => ({ ...current, primaryColor: normalized, customized: true }));
    }, []);

    const setMode = useCallback((mode: FresnicaThemeMode) => {
        setSnapshot((current) => ({ ...current, mode }));
    }, []);

    const reset = useCallback(() => {
        setSnapshot((current) => ({ ...current, primaryColor: DEFAULT_PRIMARY_COLOR, customized: false }));
    }, []);

    const value = useMemo(
        () => ({ ...snapshot, setPrimaryColor, setMode, reset }),
        [reset, setMode, setPrimaryColor, snapshot]
    );

    return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
};

export const useFresnicaTheme = (): FresnicaThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useFresnicaTheme must be used inside FresnicaThemeProvider');
    return context;
};
