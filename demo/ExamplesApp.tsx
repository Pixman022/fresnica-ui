import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Menu, Moon, Sun, X } from 'lucide-react';
import { useFresnicaTheme } from '../src';
import ThemeCustomizer from './components/ThemeCustomizer';
import FresnicaHomeDemo from './components/FresnicaHome';
import FresnicaSwapDemo from './components/FresnicaSwap';
import FresnicaTransferDemo from './components/FresnicaTransfer';
import FresnicaActivityDemo from './components/FresnicaActivity';
import FresnicaSettingsDemo from './components/FresnicaSettings';
import FresnicaTransactionDetailsDemo from './components/FresnicaTransactionDetails';
import FresnicaAssetDetailsDemo from './components/FresnicaAssetDetails';
import FresnicaNetworkNodesDemo from './components/FresnicaNetworkNodes';
import FresnicaExploreDappsDemo from './components/FresnicaExploreDapps';
import FresnicaScanDemo from './components/FresnicaScan';
import WalletDemoShell from './components/WalletDemoShell';
import { useIsMobile } from './tools';

const PAGES = {
    'fresnica-home': { label: 'Wallet Home', component: FresnicaHomeDemo },
    'fresnica-swap': { label: 'Swap', component: FresnicaSwapDemo },
    'fresnica-transfer': { label: 'Transfer', component: FresnicaTransferDemo },
    'fresnica-activity': { label: 'Activity', component: FresnicaActivityDemo },
    'fresnica-settings': { label: 'Settings', component: FresnicaSettingsDemo },
    'fresnica-transaction-details': { label: 'Transaction Details', component: FresnicaTransactionDetailsDemo },
    'fresnica-asset-details': { label: 'Asset Details', component: FresnicaAssetDetailsDemo },
    'fresnica-network-nodes': { label: 'Network & Nodes', component: FresnicaNetworkNodesDemo },
    'fresnica-explore-dapps': { label: 'Explore dApps', component: FresnicaExploreDappsDemo },
    'fresnica-scan': { label: 'Scan', component: FresnicaScanDemo },
} as const;

type PageKey = keyof typeof PAGES;

const readRoute = (): PageKey => {
    const key = window.location.hash.slice(1).replace(/^\//, '') as PageKey;
    return key in PAGES ? key : 'fresnica-home';
};

const ExamplesApp: React.FC = () => {
    const isMobile = useIsMobile();
    const [route, setRoute] = useState<PageKey>(readRoute);
    const [menuOpen, setMenuOpen] = useState(false);
    const { mode, setMode } = useFresnicaTheme();
    const dark = mode === 'dark';

    useEffect(() => {
        const onHashChange = () => setRoute(readRoute());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const navigate = useCallback((next: PageKey) => {
        window.location.hash = `/${next}`;
        setMenuOpen(false);
    }, []);

    const CurrentPage = PAGES[route].component;
    const currentLabel = PAGES[route].label;
    const themeToggle = (
        <button
            type="button"
            onClick={() => setMode(dark ? 'light' : 'dark')}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                display: 'grid',
                placeItems: 'center',
                width: 44,
                height: 44,
                padding: 0,
                border: 0,
                borderRadius: 'var(--Fresnica-border-radius-pill)',
                background: 'transparent',
                color: 'var(--Fresnica-text-color)',
                cursor: 'pointer',
            }}
        >
            {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
    );
    const navigation = useMemo(
        () =>
            Object.entries(PAGES).map(([key, page]) => ({
                key: key as PageKey,
                label: page.label,
            })),
        []
    );

    const sidebar = (
        <aside
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: isMobile ? 280 : 248,
                minWidth: isMobile ? 280 : 248,
                height: '100%',
                background: 'var(--Fresnica-surface)',
                borderRight: '1px solid var(--Fresnica-border-color)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 'var(--Fresnica-height-emphasis)',
                    padding: '0 var(--Fresnica-spacing-lg)',
                    borderBottom: '1px solid var(--Fresnica-border-color)',
                    color: 'var(--Fresnica-text-color)',
                    fontWeight: 'var(--Fresnica-font-weight-bold)',
                }}
            >
                <span>Fresnica Examples</span>
                {isMobile && (
                    <button
                        type="button"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close examples menu"
                        style={{ border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer' }}
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                )}
            </div>
            <nav
                aria-label="Fresnica wallet example pages"
                style={{ overflow: 'auto', padding: 'var(--Fresnica-spacing-sm)' }}
            >
                {navigation.map((item) => {
                    const active = item.key === route;
                    return (
                        <button
                            type="button"
                            key={item.key}
                            onClick={() => navigate(item.key)}
                            aria-current={active ? 'page' : undefined}
                            style={{
                                display: 'block',
                                width: '100%',
                                minHeight: 44,
                                marginBottom: 'var(--Fresnica-spacing-xs)',
                                padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-md)',
                                border: 0,
                                borderRadius: 'var(--Fresnica-border-radius-control)',
                                background: active ? 'var(--Fresnica-primary-color)' : 'transparent',
                                color: active
                                    ? 'var(--Fresnica-on-primary-color)'
                                    : 'var(--Fresnica-text-color-secondary)',
                                font: 'inherit',
                                textAlign: 'left',
                                cursor: 'pointer',
                            }}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );

    return (
        <div
            style={{
                display: 'flex',
                height: '100dvh',
                overflow: 'hidden',
                background: 'var(--Fresnica-bg-color)',
                color: 'var(--Fresnica-text-color)',
                fontFamily: 'var(--Fresnica-font-family)',
            }}
        >
            {!isMobile && sidebar}
            {isMobile && menuOpen && (
                <>
                    <div
                        role="presentation"
                        onClick={() => setMenuOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'var(--Fresnica-mask-bg)' }}
                    />
                    <div style={{ position: 'fixed', inset: '0 auto 0 0', zIndex: 21 }}>{sidebar}</div>
                </>
            )}
            <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
                {isMobile && (
                    <header
                        style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: 'var(--Fresnica-height-emphasis)',
                            padding: '0 var(--Fresnica-spacing-md)',
                            background: 'var(--Fresnica-surface)',
                            borderBottom: '1px solid var(--Fresnica-border-color)',
                        }}
                    >
                        <a
                            href="./index.html"
                            aria-label="Back to Fresnica UI design system"
                            style={{ color: 'inherit' }}
                        >
                            <ArrowLeft size={20} aria-hidden="true" />
                        </a>
                        <strong>{currentLabel}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--Fresnica-spacing-xs)' }}>
                            <ThemeCustomizer
                                labels={{
                                    button: 'Theme color',
                                    title: 'Customize theme',
                                    hex: 'HEX color',
                                    light: 'Light',
                                    dark: 'Dark',
                                    reset: 'Restore default',
                                    adjusted:
                                        'The selected color may affect text and icon visibility, so it was adjusted to {effective} to keep content clear.',
                                }}
                            />
                            {themeToggle}
                            <button
                                type="button"
                                onClick={() => setMenuOpen(true)}
                                aria-label="Open examples menu"
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 44,
                                    height: 44,
                                    border: 0,
                                    borderRadius: 'var(--Fresnica-border-radius-pill)',
                                    background: 'transparent',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                }}
                            >
                                <Menu size={20} aria-hidden="true" />
                            </button>
                        </div>
                    </header>
                )}
                <div
                    style={{
                        maxWidth: 960,
                        margin: '0 auto',
                        padding: isMobile ? 'var(--Fresnica-spacing-md)' : 'var(--Fresnica-spacing-xl)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 'var(--Fresnica-spacing-md)',
                            marginBottom: 'var(--Fresnica-spacing-lg)',
                        }}
                    >
                        {!isMobile && (
                            <h1 style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-screen-title)' }}>
                                Fresnica wallet examples
                            </h1>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--Fresnica-spacing-sm)' }}>
                            <ThemeCustomizer
                                labels={{
                                    button: 'Theme color',
                                    title: 'Customize theme',
                                    hex: 'HEX color',
                                    light: 'Light',
                                    dark: 'Dark',
                                    reset: 'Restore default',
                                    adjusted:
                                        'The selected color may affect text and icon visibility, so it was adjusted to {effective} to keep content clear.',
                                }}
                            />
                            {themeToggle}
                            <a
                                href="./index.html"
                                style={{
                                    color: 'var(--Fresnica-primary-color)',
                                    fontWeight: 'var(--Fresnica-font-weight-bold)',
                                }}
                            >
                                Design system docs
                            </a>
                        </div>
                    </div>
                    <WalletDemoShell route={route}>
                        <CurrentPage />
                    </WalletDemoShell>
                </div>
            </main>
        </div>
    );
};

export default ExamplesApp;
