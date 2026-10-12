/* eslint-disable react-refresh/only-export-components -- provider and hook intentionally share one context module. */
import React, { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import type { UiLocaleOverrides } from './locales';

export interface FresnicaUiProviderProps {
    children: React.ReactNode;
    locale?: UiLocaleOverrides;
}

const EMPTY_LOCALE = Object.freeze({}) as UiLocaleOverrides;
const UiLocaleContext = createContext<UiLocaleOverrides>(EMPTY_LOCALE);

export const FresnicaUiProvider: React.FC<PropsWithChildren<FresnicaUiProviderProps>> = ({ children, locale }) => {
    const parentLocale = useContext(UiLocaleContext);
    const value = useMemo(() => (locale ? { ...parentLocale, ...locale } : parentLocale), [locale, parentLocale]);

    return <UiLocaleContext.Provider value={value}>{children}</UiLocaleContext.Provider>;
};

export const useUiLocale = (): UiLocaleOverrides => useContext(UiLocaleContext);
