import React, { useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { AddressField, AmountField, AssetIcon, AssetRow, Button } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';

const FresnicaTransferDemo: React.FC = () => {
    const [amount, setAmount] = useState('0');
    const balance = '7128.1571367';
    const address = 'GB3URDBK64ZBUYOSUV77BVRGNTBSGCBBA5I2GTEIWH3WJXQITRHPWVOR';
    const fiatValue = useMemo(() => {
        const numericAmount = Number(amount);
        return Number.isFinite(numericAmount) ? numericAmount.toFixed(2) : '0.00';
    }, [amount]);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Send Assets <DemoTag>原稿信息架构</DemoTag>
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
                        minHeight: 96,
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
                    <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--Fresnica-spacing-xs)' }}>
                        <strong style={{ fontSize: 'var(--Fresnica-font-size-screen-title)' }}>Send</strong>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-sm)',
                                color: 'var(--Fresnica-text-color-secondary)',
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 'var(--Fresnica-font-weight-semibold)',
                            }}
                        >
                            <i
                                aria-hidden="true"
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 'var(--Fresnica-border-radius-pill)',
                                    background: 'var(--Fresnica-accent-blue-color)',
                                }}
                            />
                            Stellar Mainnet
                        </span>
                    </div>
                </header>

                <main
                    style={{
                        flex: 1,
                        display: 'grid',
                        alignContent: 'start',
                        minWidth: 0,
                        gap: 'var(--Fresnica-spacing-xl)',
                        padding: 'var(--Fresnica-spacing-xl)',
                    }}
                >
                    <section style={{ display: 'grid', minWidth: 0, gap: 'var(--Fresnica-spacing-sm)' }}>
                        <span style={{ color: 'var(--Fresnica-text-color-secondary)' }}>From</span>
                        <strong style={{ fontSize: 'var(--Fresnica-font-size-section-title)' }}>Superwallet</strong>
                        <AddressField mode="display" value={address} />
                    </section>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                        <span style={{ color: 'var(--Fresnica-text-color-secondary)' }}>Token</span>
                        <AssetRow
                            name="XLM"
                            symbol="XLM"
                            description={`Available: ${balance}`}
                            icon={
                                <AssetIcon
                                    symbol="X"
                                    size="medium"
                                    style={{ color: 'var(--Fresnica-text-color-secondary)' }}
                                />
                            }
                            trailing={<ChevronDown size={22} />}
                            onClick={() => undefined}
                        />
                    </section>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-md)' }}>
                        <label htmlFor="send-amount" style={{ color: 'var(--Fresnica-text-color-secondary)' }}>
                            Amount
                        </label>
                        <AmountField
                            id="send-amount"
                            aria-label="Amount"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            currency="XLM"
                            balance={balance}
                            fiatValue={`~ ${fiatValue} USD`}
                            maxLabel="All"
                            onMax={() => setAmount(balance)}
                        />
                    </section>
                </main>

                <footer
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        display: 'grid',
                        gridTemplateColumns: '0.76fr 1.24fr',
                        gap: 'var(--Fresnica-spacing-md)',
                        padding: 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl)',
                        borderTop: '1px solid var(--Fresnica-border-color-light)',
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <Button type="text" size="large" icon={<ArrowLeft size={18} />}>
                        Back
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        disabled={!Number(amount)}
                        icon={<ChevronRight size={18} />}
                        style={{ flexDirection: 'row-reverse' }}
                    >
                        Next
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default FresnicaTransferDemo;
