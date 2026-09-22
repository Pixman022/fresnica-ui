import React, { useState } from 'react';
import { AssetIcon, AssetRow, Button, QuickAction } from '../../../src';
import { ArrowDown, ArrowLeftRight, ArrowUp, ChevronDown, CirclePlus, Copy, Search, WalletCards } from 'lucide-react';
import { sectionStyle, sectionTitleStyle, DemoTag, useIsMobile } from '../../tools';
import FresnicaNavigation from '../FresnicaNavigation';
import styles from './fresnica-home.module.less';

const FresnicaHomeDemo: React.FC = () => {
    const isMobile = useIsMobile(560);
    const [copied, setCopied] = useState(false);
    const address = 'GABC1234...WXYZ5678';
    const copyAddress = () => {
        void navigator.clipboard?.writeText(address);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    };
    return (
        <div
            style={{
                ...sectionStyle,
                maxWidth: 520,
                padding: isMobile ? 'var(--Fresnica-spacing-sm)' : 'var(--Fresnica-spacing-xl)',
            }}
        >
            <div style={{ ...sectionTitleStyle, flexWrap: 'wrap' }}>
                Fresnica Wallet Home <DemoTag>原型首页</DemoTag>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100%',
                    overflow: 'hidden',
                    border: '1px solid var(--Fresnica-border-color)',
                    borderRadius: isMobile ? 'var(--Fresnica-border-radius-base)' : 'var(--Fresnica-border-radius-lg)',
                    background: 'var(--Fresnica-bg-color)',
                }}
            >
                <header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile
                            ? 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-sm)'
                            : 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-lg)',
                        background: 'var(--Fresnica-surface)',
                        borderBottom: '1px solid var(--Fresnica-border-color)',
                    }}
                >
                    <span className={styles.brandLogo} style={{ width: isMobile ? 128 : 150 }}>
                        <img
                            className={styles.logoLight}
                            src={new URL('../../img/fresnica/fresnica-logo-light.png', import.meta.url).href}
                            alt="Fresnica"
                        />
                        <img
                            className={styles.logoDark}
                            src={new URL('../../img/fresnica/fresnica-logo-dark.png', import.meta.url).href}
                            alt="Fresnica"
                        />
                    </span>
                    <button
                        type="button"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--Fresnica-spacing-sm)',
                            padding: '9px 13px',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-pill)',
                            background: 'var(--Fresnica-surface)',
                            color: 'var(--Fresnica-text-color)',
                            font: 'inherit',
                            fontSize: 'var(--Fresnica-font-size-supporting)',
                            fontWeight: 700,
                            boxShadow: 'var(--Fresnica-shadow-base)',
                        }}
                    >
                        <i
                            style={{
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                background: 'var(--Fresnica-success-color)',
                            }}
                        />{' '}
                        Mainnet <ChevronDown aria-hidden="true" size={16} />
                    </button>
                </header>
                <main
                    style={{
                        display: 'grid',
                        alignContent: 'start',
                        flex: 1,
                        gap: isMobile ? 'var(--Fresnica-spacing-lg)' : 'var(--Fresnica-spacing-xl)',
                        padding: isMobile ? 'var(--Fresnica-spacing-md)' : 'var(--Fresnica-spacing-lg)',
                    }}
                >
                    <section
                        className={styles.walletCard}
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-lg)',
                            padding: isMobile ? 18 : 24,
                            borderRadius: isMobile
                                ? 'var(--Fresnica-border-radius-base)'
                                : 'var(--Fresnica-border-radius-lg)',
                            boxShadow: 'var(--Fresnica-shadow-base)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: 'var(--Fresnica-font-size-section-title)' }}>Main wallet</strong>
                            <Button type="text" size="small" aria-label="Wallet options">
                                <WalletCards size={21} />
                            </Button>
                        </div>
                        <button
                            type="button"
                            onClick={copyAddress}
                            style={{
                                justifySelf: 'start',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-sm)',
                                padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-md)',
                                border: 0,
                                borderRadius: 'var(--Fresnica-border-radius-control)',
                                background: 'transparent',
                                color: 'var(--Fresnica-text-color-secondary)',
                                font: 'inherit',
                                fontSize: 'var(--Fresnica-font-size-base)',
                                cursor: 'pointer',
                            }}
                        >
                            {address}
                            <Copy size={18} />
                        </button>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 'var(--Fresnica-spacing-md)',
                                marginTop: 'var(--Fresnica-spacing-xs)',
                            }}
                        >
                            <QuickAction
                                label="Send"
                                variant="primary"
                                size={isMobile ? 'compact' : 'default'}
                                icon={<ArrowUp size={24} strokeWidth={2.5} />}
                            />
                            <QuickAction
                                label="Swap"
                                variant="inverse"
                                size={isMobile ? 'compact' : 'default'}
                                icon={<ArrowLeftRight size={22} strokeWidth={2.5} />}
                            />
                            <QuickAction
                                label="Receive"
                                variant="primary"
                                size={isMobile ? 'compact' : 'default'}
                                icon={<ArrowDown size={24} strokeWidth={2.5} />}
                            />
                        </div>
                    </section>
                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-md)' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-sm)',
                                flexWrap: 'wrap',
                            }}
                        >
                            <strong style={{ fontSize: 'var(--Fresnica-font-size-section-title)' }}>Assets</strong>
                            <span
                                aria-hidden="true"
                                style={{
                                    color: 'var(--Fresnica-text-color-muted)',
                                    fontSize: 'var(--Fresnica-font-size-section-title)',
                                }}
                            >
                                <ChevronDown size={22} />
                            </span>
                            <span style={{ flex: 1 }} />
                            <button
                                type="button"
                                aria-label="Search assets"
                                style={{
                                    border: 0,
                                    borderRadius: 'var(--Fresnica-border-radius-pill)',
                                    padding: isMobile ? '8px 12px' : '9px 18px',
                                    background: 'var(--Fresnica-surface-low)',
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    font: 'inherit',
                                }}
                            >
                                <>
                                    <Search size={18} />
                                    &nbsp; Search
                                </>
                            </button>
                            <button
                                type="button"
                                aria-label="Add asset"
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 40,
                                    height: 40,
                                    border: 0,
                                    borderRadius: 'var(--Fresnica-border-radius-sm)',
                                    background: 'transparent',
                                    color: 'var(--Fresnica-text-color)',
                                    cursor: 'pointer',
                                }}
                            >
                                <CirclePlus size={28} strokeWidth={2} />
                            </button>
                        </div>
                        <AssetRow
                            name="XLM"
                            symbol="X"
                            balance="12,480.50"
                            fiatValue="1.50"
                            icon={
                                <AssetIcon
                                    symbol="X"
                                    size="small"
                                    style={{ color: 'var(--Fresnica-text-color-secondary)' }}
                                />
                            }
                            style={{
                                // Keep the approved pale brand tint without applying selected-state foreground colors.
                                background:
                                    'color-mix(in srgb, var(--Fresnica-primary-color) 8%, var(--Fresnica-surface))',
                                border: 0,
                                minHeight: 82,
                                padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-lg)',
                            }}
                        />
                        <AssetRow
                            name="USDC"
                            symbol="$"
                            balance="2,350.00 USDC"
                            fiatValue="$1.00"
                            icon={
                                <AssetIcon
                                    symbol="$"
                                    size="small"
                                    style={{ color: 'var(--Fresnica-text-color-secondary)' }}
                                />
                            }
                            style={{
                                background: 'var(--Fresnica-surface)',
                                minHeight: 82,
                                padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-lg)',
                            }}
                        />
                    </section>
                </main>
                {copied && (
                    <div
                        role="status"
                        style={{
                            padding: '0 var(--Fresnica-spacing-lg) var(--Fresnica-spacing-md)',
                            textAlign: 'center',
                            color: 'var(--Fresnica-success-color)',
                            fontSize: 'var(--Fresnica-font-size-sm)',
                        }}
                    >
                        Address copied
                    </div>
                )}
                <div
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 5,
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <FresnicaNavigation activeKey="home" />
                </div>
            </div>
        </div>
    );
};

export default FresnicaHomeDemo;
