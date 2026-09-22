import React, { useState } from 'react';
import { ArrowLeft, Copy, Ellipsis, ExternalLink, Waves } from 'lucide-react';
import { Button } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';

const transactionId = '47db18ca000000000000000000000000000000000000000000000000d0516358';
const issuer = 'GBNZKQW4****AQUA';

const FresnicaTransactionDetailsDemo: React.FC = () => {
    const [copied, setCopied] = useState('');
    const copy = (label: string, value: string) => {
        void navigator.clipboard?.writeText(value);
        setCopied(label);
        window.setTimeout(() => setCopied(''), 1400);
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Transaction Details <DemoTag>原稿信息架构</DemoTag>
            </div>
            <div
                style={{
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--Fresnica-surface)',
                    color: 'var(--Fresnica-text-color)',
                }}
            >
                <header
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '44px 1fr 44px',
                        alignItems: 'center',
                        gap: 'var(--Fresnica-spacing-sm)',
                        minHeight: 76,
                        padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-lg)',
                    }}
                >
                    <button type="button" aria-label="Back" style={iconButtonStyle}>
                        <ArrowLeft size={26} />
                    </button>
                    <strong
                        style={{
                            textAlign: 'center',
                            fontSize: 'var(--Fresnica-font-size-screen-title)',
                        }}
                    >
                        Transaction details
                    </strong>
                    <button type="button" aria-label="More options" style={iconButtonStyle}>
                        <Ellipsis size={27} />
                    </button>
                </header>

                <main
                    style={{
                        flex: 1,
                        display: 'grid',
                        alignContent: 'start',
                        gap: 'var(--Fresnica-spacing-xl)',
                        padding: 'var(--Fresnica-spacing-xl)',
                    }}
                >
                    <section
                        style={{
                            display: 'grid',
                            justifyItems: 'center',
                            gap: 'var(--Fresnica-spacing-md)',
                            padding: 'var(--Fresnica-spacing-lg) 0',
                            textAlign: 'center',
                        }}
                    >
                        <Waves size={48} strokeWidth={2.4} color="var(--Fresnica-accent-purple-color)" />
                        <span
                            style={{
                                marginTop: 'var(--Fresnica-spacing-lg)',
                                fontSize: 'var(--Fresnica-font-size-lg)',
                                fontWeight: 'var(--Fresnica-font-weight-bold)',
                            }}
                        >
                            AQUA
                        </span>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 'var(--Fresnica-font-size-title-lg)',
                                lineHeight: 1.2,
                            }}
                        >
                            Add asset
                        </h2>
                        <time
                            style={{
                                marginTop: 'var(--Fresnica-spacing-xl)',
                                color: 'var(--Fresnica-text-color-secondary)',
                            }}
                        >
                            Friday, August 14, 2026 2:48 PM
                        </time>
                    </section>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                        <strong>Issuer</strong>
                        <button
                            type="button"
                            onClick={() => copy('issuer', issuer)}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '48px minmax(0, 1fr) 20px',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-md)',
                                minHeight: 84,
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
                                    width: 48,
                                    height: 48,
                                    border: '1px solid var(--Fresnica-border-color-light)',
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: 'var(--Fresnica-surface-low)',
                                }}
                            />
                            <span style={{ display: 'grid', minWidth: 0, gap: 'var(--Fresnica-spacing-xs)' }}>
                                <strong>AQUA</strong>
                                <span
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        color: 'var(--Fresnica-text-color-secondary)',
                                        fontFamily: 'var(--Fresnica-font-family-mono)',
                                        fontSize: 'var(--Fresnica-font-size-sm)',
                                    }}
                                >
                                    {copied === 'issuer' ? 'Issuer copied' : issuer}
                                </span>
                            </span>
                            <Copy size={17} color="var(--Fresnica-text-color-muted)" />
                        </button>
                    </section>

                    <dl style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xl)', margin: 0 }}>
                        <Detail label="Balance limit" value="1000000000" />
                        <Detail
                            label="Transaction ID"
                            value={copied === 'transaction' ? 'Transaction ID copied' : '47db18ca...d0516358'}
                            mono
                            onCopy={() => copy('transaction', transactionId)}
                        />
                        <Detail label="Transaction fee" value="0.00001 XLM" muted />
                        <Detail label="Memo" value="-" muted />
                    </dl>
                </main>

                <footer
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        padding: 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl)',
                        borderTop: '1px solid var(--Fresnica-border-color-light)',
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <Button type="dashed" size="large" block icon={<ExternalLink size={18} />}>
                        View on Stellar Explorer
                    </Button>
                </footer>
            </div>
        </div>
    );
};

const Detail: React.FC<{
    label: string;
    value: string;
    muted?: boolean;
    mono?: boolean;
    onCopy?: () => void;
}> = ({ label, value, muted, mono, onCopy }) => (
    <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
        <dt style={{ fontWeight: 'var(--Fresnica-font-weight-semibold)' }}>{label}</dt>
        <dd
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--Fresnica-spacing-sm)',
                minWidth: 0,
                margin: 0,
                color: muted ? 'var(--Fresnica-text-color-secondary)' : 'var(--Fresnica-text-color)',
                fontFamily: mono ? 'var(--Fresnica-font-family-mono)' : undefined,
                fontVariantNumeric: 'tabular-nums',
            }}
        >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
            {onCopy && (
                <button type="button" aria-label={`Copy ${label}`} onClick={onCopy} style={copyButtonStyle}>
                    <Copy size={17} />
                </button>
            )}
        </dd>
    </div>
);

const iconButtonStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 44,
    height: 44,
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'transparent',
    color: 'var(--Fresnica-text-color)',
    cursor: 'pointer',
};

const copyButtonStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 40,
    height: 40,
    flexShrink: 0,
    padding: 0,
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-sm)',
    background: 'transparent',
    color: 'var(--Fresnica-text-color-muted)',
    cursor: 'pointer',
};

export default FresnicaTransactionDetailsDemo;
