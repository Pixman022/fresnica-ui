import React, { useState } from 'react';
import { Circle, CirclePlus, Network, RefreshCw, Trash2, X } from 'lucide-react';
import { Button, Input, Tag } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';

const FresnicaNetworkNodesDemo: React.FC = () => {
    const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
    const [selected, setSelected] = useState<'public' | 'custom'>('custom');
    const [alias, setAlias] = useState('');
    const [notice, setNotice] = useState('');

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Network & Nodes <DemoTag>原稿信息架构</DemoTag>
            </div>
            <div
                style={{
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--Fresnica-surface-low)',
                    color: 'var(--Fresnica-text-color)',
                }}
            >
                <header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: 104,
                        padding: 'var(--Fresnica-spacing-xl)',
                    }}
                >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--Fresnica-spacing-md)' }}>
                        <img
                            src={new URL('../../img/fresnica/fresnica-app-icon.png', import.meta.url).href}
                            alt=""
                            width={48}
                            height={48}
                            style={{ borderRadius: 'var(--Fresnica-border-radius-control)' }}
                        />
                        <strong style={{ fontSize: 'var(--Fresnica-font-size-screen-title)', letterSpacing: 2 }}>
                            FRESNICA
                        </strong>
                    </span>
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
                                width: 9,
                                height: 9,
                                borderRadius: 'var(--Fresnica-border-radius-pill)',
                                background: 'var(--Fresnica-accent-blue-color)',
                            }}
                        />
                        Stellar Mainnet
                    </span>
                </header>

                <main
                    style={{
                        flex: 1,
                        display: 'grid',
                        alignContent: 'start',
                        gap: 'var(--Fresnica-spacing-lg)',
                        padding: 'var(--Fresnica-spacing-xl)',
                        borderRadius: 'var(--Fresnica-border-radius-lg) var(--Fresnica-border-radius-lg) 0 0',
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            justifySelf: 'center',
                            width: 48,
                            height: 4,
                            borderRadius: 'var(--Fresnica-border-radius-pill)',
                            background: 'var(--Fresnica-text-color-muted)',
                            opacity: 0.7,
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-screen-title)' }}>
                            Network & Nodes
                        </h2>
                        <button type="button" aria-label="Close" style={closeButtonStyle}>
                            <X size={24} />
                        </button>
                    </div>

                    <div
                        role="tablist"
                        aria-label="Stellar network"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            padding: 'var(--Fresnica-spacing-xs)',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-base)',
                            background: 'var(--Fresnica-surface-low)',
                        }}
                    >
                        {(['mainnet', 'testnet'] as const).map((value) => (
                            <button
                                key={value}
                                type="button"
                                role="tab"
                                aria-selected={network === value}
                                onClick={() => setNetwork(value)}
                                style={{
                                    minHeight: 44,
                                    border: 0,
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: network === value ? 'var(--Fresnica-surface)' : 'transparent',
                                    color:
                                        network === value
                                            ? 'var(--Fresnica-text-color)'
                                            : 'var(--Fresnica-text-color-secondary)',
                                    font: 'inherit',
                                    fontWeight: 'var(--Fresnica-font-weight-semibold)',
                                    cursor: 'pointer',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 'var(--Fresnica-spacing-xs)',
                                    }}
                                >
                                    <Circle size={10} strokeWidth={2} aria-hidden="true" />
                                    {value === 'mainnet' ? 'Stellar Mainnet' : 'Testnet'}
                                </span>
                            </button>
                        ))}
                    </div>

                    <button type="button" style={connectedCardStyle} onClick={() => setSelected('public')}>
                        <span style={networkIconStyle}>
                            <Network size={23} />
                        </span>
                        <span style={{ display: 'grid', minWidth: 0, gap: 'var(--Fresnica-spacing-xs)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--Fresnica-spacing-sm)' }}>
                                <strong>Stellar Mainnet</strong>
                                <Tag
                                    color="default"
                                    variant="soft"
                                    size="small"
                                    style={{
                                        background: 'var(--Fresnica-success-color-bg)',
                                        color: 'var(--Fresnica-on-success-container-color)',
                                        borderColor: 'var(--Fresnica-success-color)',
                                    }}
                                >
                                    Connected
                                </Tag>
                            </span>
                            <span
                                style={{
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-sm)',
                                }}
                            >
                                Passphrase: Public Global Stellar Network
                            </span>
                        </span>
                        <RadioMark checked={selected === 'public'} />
                    </button>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                        <strong>Default Horizon RPC</strong>
                        <NodeRow
                            name="Stellar Public Horizon"
                            url="https://horizon.stellar.org"
                            badge="Fast"
                            selected={selected === 'public'}
                            onSelect={() => setSelected('public')}
                        />
                    </section>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                        <strong>Custom Nodes (1)</strong>
                        <NodeRow
                            name="Fresnica Horizon Cluster"
                            url="https://horizon.fresnica.example"
                            badge="Active"
                            selected={selected === 'custom'}
                            warning="Current node · Connected with compatibility warning"
                            onSelect={() => setSelected('custom')}
                            removable
                        />
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-md)',
                            padding: 'var(--Fresnica-spacing-lg)',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-base)',
                            background: 'var(--Fresnica-surface-low)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <strong
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 'var(--Fresnica-spacing-sm)',
                                }}
                            >
                                <CirclePlus size={20} color="var(--Fresnica-text-color-secondary)" /> Add Custom Horizon
                                RPC
                            </strong>
                            <span
                                style={{
                                    color: 'var(--Fresnica-text-color-muted)',
                                    fontSize: 'var(--Fresnica-font-size-sm)',
                                }}
                            >
                                HTTPS required
                            </span>
                        </div>
                        <label
                            htmlFor="node-alias"
                            style={{
                                color: 'var(--Fresnica-text-color-secondary)',
                                fontSize: 'var(--Fresnica-font-size-sm)',
                            }}
                        >
                            Node Name / Alias (Optional)
                        </label>
                        <Input
                            id="node-alias"
                            placeholder="e.g. My Private Validator"
                            value={alias}
                            onChange={(event) => setAlias(event.target.value)}
                        />
                    </section>
                </main>

                <footer
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl)',
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<CirclePlus size={19} />}
                        onClick={() => setNotice(`RPC selected: ${selected}`)}
                    >
                        Add RPC ({network === 'mainnet' ? 'Stellar Mainnet' : 'Stellar Testnet'})
                    </Button>
                    {notice && (
                        <div
                            role="status"
                            style={{
                                marginTop: 'var(--Fresnica-spacing-sm)',
                                color: 'var(--Fresnica-text-color-secondary)',
                                textAlign: 'center',
                                fontSize: 'var(--Fresnica-font-size-sm)',
                            }}
                        >
                            {notice}
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

const RadioMark: React.FC<{ checked: boolean }> = ({ checked }) => (
    <span
        aria-hidden="true"
        style={{
            display: 'grid',
            placeItems: 'center',
            width: 28,
            height: 28,
            flexShrink: 0,
            border: `2px solid ${checked ? 'var(--Fresnica-primary-color)' : 'var(--Fresnica-border-color-hover)'}`,
            borderRadius: 'var(--Fresnica-border-radius-pill)',
        }}
    >
        {checked && (
            <span
                style={{
                    width: 14,
                    height: 14,
                    borderRadius: 'var(--Fresnica-border-radius-pill)',
                    background: 'var(--Fresnica-primary-color)',
                }}
            />
        )}
    </span>
);

const NodeRow: React.FC<{
    name: string;
    url: string;
    badge: string;
    selected: boolean;
    warning?: string;
    removable?: boolean;
    onSelect: () => void;
}> = ({ name, url, badge, selected, warning, removable, onSelect }) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
            alignItems: 'center',
            gap: 'var(--Fresnica-spacing-sm)',
            padding: 'var(--Fresnica-spacing-lg)',
            border: `1px solid ${warning ? 'var(--Fresnica-accent-yellow-color)' : 'var(--Fresnica-border-color)'}`,
            borderRadius: 'var(--Fresnica-border-radius-base)',
            background: 'var(--Fresnica-surface-low)',
        }}
    >
        <span style={{ display: 'grid', minWidth: 0, gap: 'var(--Fresnica-spacing-xs)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--Fresnica-spacing-sm)' }}>
                <strong>{name}</strong>
                <Tag color={warning ? 'app-yellow' : 'default'} variant="soft" size="small">
                    {badge}
                </Tag>
            </span>
            <span
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--Fresnica-text-color-secondary)',
                    fontFamily: 'var(--Fresnica-font-family-mono)',
                    fontSize: 'var(--Fresnica-font-size-sm)',
                }}
            >
                {url}
            </span>
        </span>
        <button type="button" aria-label={`Refresh ${name}`} style={rowActionStyle}>
            <RefreshCw size={18} />
        </button>
        {removable && (
            <button
                type="button"
                aria-label={`Remove ${name}`}
                style={{ ...rowActionStyle, color: 'var(--Fresnica-error-color)' }}
            >
                <Trash2 size={18} />
            </button>
        )}
        <button type="button" aria-label={`Select ${name}`} onClick={onSelect} style={radioButtonStyle}>
            <RadioMark checked={selected} />
        </button>
        {warning && (
            <span
                style={{
                    gridColumn: '1 / -1',
                    padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-md)',
                    borderRadius: 'var(--Fresnica-border-radius-control)',
                    background: 'var(--Fresnica-warning-color-bg)',
                    color: 'var(--Fresnica-on-warning-container-color)',
                    fontSize: 'var(--Fresnica-font-size-sm)',
                }}
            >
                {warning}
            </span>
        )}
    </div>
);

const closeButtonStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 48,
    height: 48,
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'var(--Fresnica-surface-low)',
    color: 'var(--Fresnica-text-color)',
    cursor: 'pointer',
};

const connectedCardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '48px minmax(0, 1fr) 28px',
    alignItems: 'center',
    gap: 'var(--Fresnica-spacing-md)',
    width: '100%',
    padding: 'var(--Fresnica-spacing-lg)',
    border: '1px solid var(--Fresnica-border-color)',
    borderRadius: 'var(--Fresnica-border-radius-base)',
    background: 'var(--Fresnica-surface)',
    color: 'var(--Fresnica-text-color)',
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
};

const networkIconStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'var(--Fresnica-surface-high)',
    color: 'var(--Fresnica-text-color-secondary)',
};

const rowActionStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 40,
    height: 40,
    padding: 0,
    border: '1px solid var(--Fresnica-border-color)',
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'var(--Fresnica-surface)',
    color: 'var(--Fresnica-text-color-secondary)',
    cursor: 'pointer',
};

const radioButtonStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 40,
    height: 40,
    padding: 0,
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
};

export default FresnicaNetworkNodesDemo;
