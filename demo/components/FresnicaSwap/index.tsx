import React, { useMemo, useState } from 'react';
import { ArrowDownUp, ArrowLeft, ChevronDown } from 'lucide-react';
import { AssetIcon, Button } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';

const detailRows = [
    ['Rate', '1 XLM ≈ 0.68650 AQUA'],
    ['Price impact', '< 0.05%'],
    ['Network fee', '0.00001 XLM (~$0.000001)'],
    ['Minimum received', '0 AQUA'],
];

const FresnicaSwapDemo: React.FC = () => {
    const [amount, setAmount] = useState('0');
    const [reversed, setReversed] = useState(false);
    const maxBalance = 7128.1571;
    const receiveAmount = useMemo(() => {
        const numericAmount = Number(amount);
        return Number.isFinite(numericAmount) && numericAmount > 0 ? (numericAmount * 0.6865).toFixed(4) : '0';
    }, [amount]);
    const from = reversed ? { symbol: 'AQUA', balance: '4,893.7693861' } : { symbol: 'XLM', balance: '7,128.1571367' };
    const to = reversed ? { symbol: 'XLM', balance: '7,128.1571367' } : { symbol: 'AQUA', balance: '4,893.7693861' };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Swap Assets <DemoTag>原稿信息架构</DemoTag>
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
                        position: 'relative',
                        display: 'grid',
                        placeItems: 'center',
                        minHeight: 88,
                        padding: 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl)',
                    }}
                >
                    <button
                        type="button"
                        aria-label="Back"
                        style={{
                            position: 'absolute',
                            left: 'var(--Fresnica-spacing-lg)',
                            display: 'grid',
                            placeItems: 'center',
                            width: 44,
                            height: 44,
                            border: 0,
                            borderRadius: 'var(--Fresnica-border-radius-pill)',
                            background: 'transparent',
                            color: 'var(--Fresnica-text-color)',
                            cursor: 'pointer',
                        }}
                    >
                        <ArrowLeft size={26} strokeWidth={2.2} />
                    </button>
                    <strong style={{ fontSize: 'var(--Fresnica-font-size-screen-title)' }}>Swap</strong>
                </header>

                <main
                    style={{
                        flex: 1,
                        display: 'grid',
                        alignContent: 'start',
                        gap: 'var(--Fresnica-spacing-md)',
                        padding: 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl)',
                    }}
                >
                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button type="button" style={assetSelectorStyle}>
                                <AssetIcon
                                    symbol={from.symbol.slice(0, 1)}
                                    size="small"
                                    style={{ color: 'var(--Fresnica-text-color-secondary)' }}
                                />
                                <strong>{from.symbol}</strong>
                                <ChevronDown size={18} color="var(--Fresnica-text-color-muted)" />
                            </button>
                            <span style={balanceStyle}>Spendable: {from.balance}</span>
                        </div>
                        <div style={amountPanelStyle}>
                            <div style={{ display: 'flex', alignItems: 'baseline', minWidth: 0, flex: 1 }}>
                                <strong
                                    style={{
                                        color: 'var(--Fresnica-text-color)',
                                        fontSize: 'var(--Fresnica-font-size-title-lg)',
                                    }}
                                >
                                    −
                                </strong>
                                <input
                                    inputMode="decimal"
                                    aria-label={`Amount of ${from.symbol} to send`}
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    style={{ ...amountInputStyle, color: 'var(--Fresnica-text-color)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', justifyItems: 'end', gap: 'var(--Fresnica-spacing-sm)' }}>
                                <span style={sideLabelStyle}>Send</span>
                                <button
                                    type="button"
                                    onClick={() => setAmount(String(maxBalance))}
                                    style={maxButtonStyle}
                                >
                                    Max
                                </button>
                            </div>
                            <span style={fiatStyle}>≈ ${Number(amount || 0).toFixed(2)} USD</span>
                        </div>
                    </section>

                    <div style={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: 44 }}>
                        <span
                            aria-hidden="true"
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: 1,
                                background: 'var(--Fresnica-border-color-light)',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setReversed((value) => !value)}
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-sm)',
                                minHeight: 40,
                                padding: '0 var(--Fresnica-spacing-lg)',
                                border: '1px solid var(--Fresnica-border-color)',
                                borderRadius: 'var(--Fresnica-border-radius-pill)',
                                background: 'var(--Fresnica-surface-high)',
                                color: 'var(--Fresnica-text-color)',
                                font: 'inherit',
                                fontWeight: 'var(--Fresnica-font-weight-semibold)',
                                cursor: 'pointer',
                            }}
                        >
                            <ArrowDownUp size={18} /> Switch
                        </button>
                    </div>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button type="button" style={assetSelectorStyle}>
                                <AssetIcon
                                    symbol={to.symbol.slice(0, 1)}
                                    size="small"
                                    style={{ color: 'var(--Fresnica-text-color-secondary)' }}
                                />
                                <strong>{to.symbol}</strong>
                                <ChevronDown size={18} color="var(--Fresnica-text-color-muted)" />
                            </button>
                            <span style={balanceStyle}>Balance: {to.balance}</span>
                        </div>
                        <div style={amountPanelStyle}>
                            <div style={{ display: 'flex', alignItems: 'baseline', minWidth: 0, flex: 1 }}>
                                <strong
                                    style={{
                                        color: 'var(--Fresnica-text-color)',
                                        fontSize: 'var(--Fresnica-font-size-title-lg)',
                                    }}
                                >
                                    ~
                                </strong>
                                <input
                                    readOnly
                                    aria-label={`Estimated amount of ${to.symbol}`}
                                    value={receiveAmount}
                                    style={{ ...amountInputStyle, color: 'var(--Fresnica-text-color)' }}
                                />
                            </div>
                            <span style={sideLabelStyle}>Obtain</span>
                            <span style={fiatStyle}>≈ ${Number(receiveAmount).toFixed(2)} USD</span>
                        </div>
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-sm)',
                            marginTop: 'var(--Fresnica-spacing-sm)',
                            padding: 'var(--Fresnica-spacing-lg)',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-control)',
                            background: 'var(--Fresnica-surface)',
                        }}
                    >
                        {detailRows.map(([label, value]) => (
                            <div
                                key={label}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 'var(--Fresnica-spacing-md)',
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-sm)',
                                }}
                            >
                                <span>{label}</span>
                                <strong style={{ color: 'var(--Fresnica-text-color)', textAlign: 'right' }}>
                                    {label === 'Minimum received' ? `${receiveAmount} ${to.symbol}` : value}
                                </strong>
                            </div>
                        ))}
                    </section>
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
                    <Button type="primary" size="large" block disabled={!Number(amount)}>
                        Review Swap
                    </Button>
                </footer>
            </div>
        </div>
    );
};

const assetSelectorStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--Fresnica-spacing-sm)',
    minHeight: 40,
    padding: 0,
    border: 0,
    background: 'transparent',
    color: 'var(--Fresnica-text-color)',
    font: 'inherit',
    fontSize: 'var(--Fresnica-font-size-lg)',
    cursor: 'pointer',
};

const balanceStyle: React.CSSProperties = {
    color: 'var(--Fresnica-text-color-secondary)',
    fontSize: 'var(--Fresnica-font-size-sm)',
    fontVariantNumeric: 'tabular-nums',
};

const amountPanelStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-md)',
    minHeight: 104,
    padding: 'var(--Fresnica-spacing-lg)',
    border: '1px solid transparent',
    borderRadius: 'var(--Fresnica-border-radius-base)',
    background: 'var(--Fresnica-surface-low)',
};

const amountInputStyle: React.CSSProperties = {
    width: '100%',
    minWidth: 0,
    border: 0,
    outline: 0,
    background: 'transparent',
    font: 'inherit',
    fontSize: 'var(--Fresnica-font-size-title-lg)',
    fontWeight: 'var(--Fresnica-font-weight-bold)',
    fontVariantNumeric: 'tabular-nums',
};

const sideLabelStyle: React.CSSProperties = {
    color: 'var(--Fresnica-text-color-secondary)',
    fontSize: 'var(--Fresnica-font-size-caption)',
    fontWeight: 'var(--Fresnica-font-weight-semibold)',
    textTransform: 'uppercase',
};

const maxButtonStyle: React.CSSProperties = {
    padding: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-sm)',
    border: '1px solid var(--Fresnica-border-color)',
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'var(--Fresnica-surface-high)',
    color: 'var(--Fresnica-text-color-secondary)',
    font: 'inherit',
    fontSize: 'var(--Fresnica-font-size-sm)',
    fontWeight: 'var(--Fresnica-font-weight-semibold)',
    cursor: 'pointer',
};

const fiatStyle: React.CSSProperties = {
    gridColumn: '1 / -1',
    color: 'var(--Fresnica-text-color-secondary)',
    fontSize: 'var(--Fresnica-font-size-sm)',
    fontVariantNumeric: 'tabular-nums',
};

export default FresnicaSwapDemo;
