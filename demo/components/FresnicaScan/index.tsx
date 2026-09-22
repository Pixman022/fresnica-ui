import React, { useState } from 'react';
import { ArrowDownUp, ChevronDown, QrCode } from 'lucide-react';
import { Button } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';
import styles from '../FresnicaHome/fresnica-home.module.less';

const FresnicaScanDemo: React.FC = () => {
    const [notice, setNotice] = useState('');

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Scan <DemoTag>原项目操作面板</DemoTag>
            </div>
            <div
                style={{
                    position: 'relative',
                    minHeight: '100%',
                    overflow: 'hidden',
                    background: 'var(--Fresnica-bg-color)',
                    color: 'var(--Fresnica-text-color)',
                }}
            >
                <div style={{ padding: 'var(--Fresnica-spacing-xl)', opacity: 0.55 }}>
                    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className={styles.brandLogo} style={{ width: 128 }}>
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
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-sm)',
                                color: 'var(--Fresnica-text-color-secondary)',
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                            }}
                        >
                            <i
                                aria-hidden="true"
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: 'var(--Fresnica-border-radius-pill)',
                                    background: 'var(--Fresnica-accent-blue-color)',
                                }}
                            />
                            Stellar Mainnet
                        </span>
                    </header>
                    <button
                        type="button"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            minHeight: 68,
                            marginTop: 'var(--Fresnica-spacing-lg)',
                            padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-lg)',
                            border: 0,
                            borderRadius: 'var(--Fresnica-border-radius-control)',
                            background: 'var(--Fresnica-surface-low)',
                            color: 'var(--Fresnica-text-color)',
                            font: 'inherit',
                            textAlign: 'left',
                        }}
                    >
                        <span style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)' }}>
                            <strong>XWallet</strong>
                            <small style={{ color: 'var(--Fresnica-text-color-secondary)' }}>GAXC65…7AUU</small>
                        </span>
                        <ChevronDown size={22} />
                    </button>
                </div>

                <div
                    aria-hidden="true"
                    style={{ position: 'absolute', inset: 0, background: 'var(--Fresnica-mask-bg-subtle)' }}
                />

                <section
                    role="dialog"
                    aria-label="Scan actions"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                        minHeight: 610,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl)',
                        border: '1px solid var(--Fresnica-border-color)',
                        borderRadius: 'var(--Fresnica-border-radius-lg) var(--Fresnica-border-radius-lg) 0 0',
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            alignSelf: 'center',
                            width: 48,
                            height: 5,
                            marginBottom: 'var(--Fresnica-spacing-xl)',
                            borderRadius: 'var(--Fresnica-border-radius-pill)',
                            background: 'var(--Fresnica-text-color-muted)',
                            opacity: 0.7,
                        }}
                    />

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-lg)' }}>
                        <h2
                            style={{
                                margin: 0,
                                color: 'var(--Fresnica-text-color-secondary)',
                                fontSize: 'var(--Fresnica-font-size-lg)',
                                fontWeight: 'var(--Fresnica-font-weight-medium)',
                            }}
                        >
                            Recently used
                        </h2>
                        <button type="button" disabled style={actionTileStyle}>
                            <span style={emptyTileStyle}>None</span>
                        </button>
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-lg)',
                            marginTop: 'var(--Fresnica-spacing-xl)',
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                color: 'var(--Fresnica-text-color-secondary)',
                                fontSize: 'var(--Fresnica-font-size-lg)',
                                fontWeight: 'var(--Fresnica-font-weight-medium)',
                            }}
                        >
                            Quick actions
                        </h2>
                        <button
                            type="button"
                            onClick={() => setNotice('Swap opened')}
                            style={{ ...actionTileStyle, color: 'var(--Fresnica-text-color)' }}
                        >
                            <span
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 64,
                                    height: 64,
                                    border: '1px solid var(--Fresnica-border-color)',
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: 'var(--Fresnica-surface-high)',
                                    color: 'var(--Fresnica-text-color)',
                                }}
                            >
                                <ArrowDownUp size={30} strokeWidth={2.3} />
                            </span>
                            <span>Swap</span>
                        </button>
                    </section>

                    <div style={{ flex: 1 }} />
                    {notice && (
                        <div
                            role="status"
                            style={{
                                marginBottom: 'var(--Fresnica-spacing-sm)',
                                color: 'var(--Fresnica-text-color-secondary)',
                                textAlign: 'center',
                                fontSize: 'var(--Fresnica-font-size-sm)',
                            }}
                        >
                            {notice}
                        </div>
                    )}
                    <Button
                        type="inverse"
                        size="large"
                        block
                        icon={<QrCode size={22} />}
                        onClick={() => setNotice('QR scanner opened')}
                    >
                        Scan QR code
                    </Button>
                </section>
            </div>
        </div>
    );
};

const actionTileStyle: React.CSSProperties = {
    display: 'grid',
    justifyItems: 'center',
    gap: 'var(--Fresnica-spacing-sm)',
    width: 72,
    padding: 0,
    border: 0,
    background: 'transparent',
    color: 'var(--Fresnica-text-color-muted)',
    font: 'inherit',
    fontSize: 'var(--Fresnica-font-size-supporting)',
    cursor: 'pointer',
};

const emptyTileStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 64,
    height: 64,
    border: '1px solid var(--Fresnica-border-color)',
    borderRadius: 'var(--Fresnica-border-radius-control)',
    background: 'var(--Fresnica-surface-high)',
    color: 'var(--Fresnica-text-color-disabled)',
};

export default FresnicaScanDemo;
