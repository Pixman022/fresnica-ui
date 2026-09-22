import React, { useState } from 'react';
import { ArrowDownUp, ArrowUpRight, Copy, Star, Trash2, Waves } from 'lucide-react';
import { Button } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';

const issuer = 'GBNZ****AQUA';

const FresnicaAssetDetailsDemo: React.FC = () => {
    const [notice, setNotice] = useState('');
    const showNotice = (message: string) => {
        setNotice(message);
        window.setTimeout(() => setNotice(''), 1400);
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Asset Details <DemoTag>原稿 Modal Sheet</DemoTag>
            </div>
            <div
                style={{
                    position: 'relative',
                    minHeight: '100%',
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center',
                    padding: 'var(--Fresnica-spacing-xl)',
                    background: 'var(--Fresnica-surface-lowest)',
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--Fresnica-mask-bg-subtle)',
                        backdropFilter: 'blur(8px)',
                    }}
                />
                <section
                    role="dialog"
                    aria-label="AQUA asset details"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'grid',
                        gap: 'var(--Fresnica-spacing-lg)',
                        width: '100%',
                        padding: 'var(--Fresnica-spacing-xl)',
                        border: '1px solid var(--Fresnica-border-color)',
                        borderRadius: 'var(--Fresnica-border-radius-lg)',
                        background: 'var(--Fresnica-surface)',
                        color: 'var(--Fresnica-text-color)',
                    }}
                >
                    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button
                            type="button"
                            style={headerButtonStyle}
                            onClick={() => showNotice('Added to favorites')}
                        >
                            <Star size={19} /> Star
                        </button>
                        <button type="button" style={closeButtonStyle} onClick={() => showNotice('Sheet closed')}>
                            Close
                        </button>
                    </header>

                    <div
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-lg)',
                            padding: 'var(--Fresnica-spacing-lg)',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-base)',
                            background: 'var(--Fresnica-surface-low)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-md)',
                                fontSize: 'var(--Fresnica-font-size-title-lg)',
                                fontWeight: 'var(--Fresnica-font-weight-bold)',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 36,
                                    height: 36,
                                    flexShrink: 0,
                                    borderRadius: 'var(--Fresnica-border-radius-sm)',
                                    background: 'var(--Fresnica-accent-purple-color)',
                                    color: 'var(--Fresnica-on-primary-color)',
                                }}
                            >
                                <Waves size={22} />
                            </span>
                            4,893.7693861
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                void navigator.clipboard?.writeText(issuer);
                                showNotice('Issuer copied');
                            }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '64px minmax(0, 1fr) 18px',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-md)',
                                minHeight: 96,
                                padding: 'var(--Fresnica-spacing-md)',
                                border: '1px solid var(--Fresnica-border-color)',
                                borderRadius: 'var(--Fresnica-border-radius-base)',
                                background: 'var(--Fresnica-surface)',
                                color: 'var(--Fresnica-text-color)',
                                font: 'inherit',
                                textAlign: 'left',
                                cursor: 'pointer',
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 64,
                                    height: 64,
                                    borderRadius: 'var(--Fresnica-border-radius-base)',
                                    background: 'var(--Fresnica-accent-purple-color)',
                                    color: 'var(--Fresnica-on-primary-color)',
                                }}
                            >
                                <Waves size={34} />
                            </span>
                            <span style={{ display: 'grid', minWidth: 0, gap: 'var(--Fresnica-spacing-sm)' }}>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--Fresnica-spacing-sm)',
                                        minWidth: 0,
                                    }}
                                >
                                    <strong style={{ fontSize: 'var(--Fresnica-font-size-lg)' }}>AQUA</strong>
                                    <span style={{ color: 'var(--Fresnica-text-color-muted)' }}>•</span>
                                    <span
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            color: 'var(--Fresnica-accent-blue-color)',
                                        }}
                                    >
                                        aqua.network
                                    </span>
                                </span>
                                <span
                                    style={{
                                        color: 'var(--Fresnica-text-color-secondary)',
                                        fontFamily: 'var(--Fresnica-font-family-mono)',
                                        fontSize: 'var(--Fresnica-font-size-sm)',
                                    }}
                                >
                                    {issuer}
                                </span>
                            </span>
                            <Copy size={17} color="var(--Fresnica-text-color-muted)" />
                        </button>

                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<ArrowUpRight size={19} />}
                            onClick={() => showNotice('Send opened')}
                        >
                            Send
                        </Button>
                        <Button
                            type="inverse"
                            size="large"
                            block
                            icon={<ArrowDownUp size={19} />}
                            onClick={() => showNotice('Swap opened')}
                        >
                            Swap
                        </Button>
                        <Button
                            type="text"
                            danger
                            block
                            icon={<Trash2 size={18} />}
                            onClick={() => showNotice('Remove token selected')}
                        >
                            Remove token
                        </Button>
                    </div>

                    {notice && (
                        <div
                            role="status"
                            style={{
                                minHeight: 18,
                                color: 'var(--Fresnica-text-color-secondary)',
                                textAlign: 'center',
                                fontSize: 'var(--Fresnica-font-size-sm)',
                            }}
                        >
                            {notice}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const headerButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--Fresnica-spacing-sm)',
    minHeight: 40,
    padding: '0 var(--Fresnica-spacing-sm)',
    border: 0,
    background: 'transparent',
    color: 'var(--Fresnica-text-color-secondary)',
    font: 'inherit',
    fontWeight: 'var(--Fresnica-font-weight-semibold)',
    cursor: 'pointer',
};

const closeButtonStyle: React.CSSProperties = {
    minHeight: 40,
    padding: '0 var(--Fresnica-spacing-lg)',
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'var(--Fresnica-surface-low)',
    color: 'var(--Fresnica-text-color)',
    font: 'inherit',
    fontWeight: 'var(--Fresnica-font-weight-semibold)',
    cursor: 'pointer',
};

export default FresnicaAssetDetailsDemo;
