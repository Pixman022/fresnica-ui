import React, { useMemo, useState } from 'react';
import { FlaskConical, Globe2, Search, Waypoints, type LucideIcon } from 'lucide-react';
import { Button, Tag } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';
import FresnicaNavigation from '../FresnicaNavigation';

const DAPPS = [
    { name: 'Blend', description: 'A universal liquidity protocol primitive', icon: FlaskConical, category: 'DeFi' },
    {
        name: 'Stellar Liquidity',
        description: 'Liquidity routing for Stellar USDC pools',
        icon: Waypoints,
        category: 'DeFi',
        beta: true,
    },
    {
        name: 'Fresnica Stellar Demo',
        description: 'Trusted Stellar auto-connect and signing test',
        icon: Globe2,
        category: 'Tools',
        beta: true,
    },
];

const FresnicaExploreDappsDemo: React.FC = () => {
    const [tab, setTab] = useState<'home' | 'recent'>('home');
    const [category, setCategory] = useState<string | null>(null);
    const [notice, setNotice] = useState('');
    const visible = useMemo(() => (category ? DAPPS.filter((dapp) => dapp.category === category) : DAPPS), [category]);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Explore dApps <DemoTag>原稿信息架构</DemoTag>
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--Fresnica-spacing-xl)',
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-screen-title)' }}>dApps</h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--Fresnica-spacing-lg)' }}>
                        <button type="button" aria-label="Search dApps" style={iconButtonStyle}>
                            <Search size={27} />
                        </button>
                        <button type="button" aria-label="Open web" style={iconButtonStyle}>
                            <Globe2 size={27} />
                        </button>
                    </span>
                </header>

                <main
                    style={{
                        flex: 1,
                        display: 'grid',
                        alignContent: 'start',
                        gap: 'var(--Fresnica-spacing-xl)',
                        padding: '0 var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl)',
                    }}
                >
                    <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-md)' }}>
                        {(['home', 'recent'] as const).map((value) => (
                            <Button
                                key={value}
                                type={tab === value ? 'inverse' : 'default'}
                                size="large"
                                onClick={() => setTab(value)}
                            >
                                {value === 'home' ? 'Home' : 'Recent'}
                            </Button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-md)', flexWrap: 'wrap' }}>
                        {['DeFi', 'Tools'].map((value) => (
                            <Button
                                key={value}
                                type={category === value ? 'primary' : 'default'}
                                onClick={() => setCategory((current) => (current === value ? null : value))}
                            >
                                {value}
                            </Button>
                        ))}
                    </div>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-md)' }}>
                        <h3 style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-section-title)' }}>
                            {tab === 'home' ? 'Our suggestions' : 'Recently opened'}
                        </h3>
                        <DappRow
                            name="Fresnica Stellar Demo"
                            description="Trusted Stellar auto-connect and signing test"
                            icon={Globe2}
                            beta
                            onOpen={() => setNotice('Fresnica Stellar Demo details opened')}
                        />
                    </section>

                    <section style={{ display: 'grid', gap: 'var(--Fresnica-spacing-md)' }}>
                        <h3 style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-section-title)' }}>All</h3>
                        <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                            {visible.map((dapp) => (
                                <DappRow
                                    key={dapp.name}
                                    {...dapp}
                                    onOpen={() => setNotice(`${dapp.name} details opened`)}
                                />
                            ))}
                        </div>
                    </section>

                    {notice && (
                        <div
                            role="status"
                            style={{
                                color: 'var(--Fresnica-text-color-secondary)',
                                textAlign: 'center',
                                fontSize: 'var(--Fresnica-font-size-sm)',
                            }}
                        >
                            {notice}
                        </div>
                    )}
                </main>

                <div
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 5,
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <FresnicaNavigation activeKey="explore" />
                </div>
            </div>
        </div>
    );
};

const DappRow: React.FC<{
    name: string;
    description: string;
    icon: LucideIcon;
    beta?: boolean;
    onOpen: () => void;
}> = ({ name, description, icon: Icon, beta, onOpen }) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: '56px minmax(0, 1fr) auto',
            alignItems: 'center',
            gap: 'var(--Fresnica-spacing-md)',
            minHeight: 72,
        }}
    >
        <span
            aria-hidden="true"
            style={{
                display: 'grid',
                placeItems: 'center',
                width: 56,
                height: 56,
                border: '1px solid var(--Fresnica-border-color)',
                borderRadius: 'var(--Fresnica-border-radius-base)',
                background: 'var(--Fresnica-surface-high)',
                color: 'var(--Fresnica-text-color-secondary)',
            }}
        >
            <Icon size={27} strokeWidth={2.1} />
        </span>
        <span style={{ display: 'grid', minWidth: 0, gap: 'var(--Fresnica-spacing-xs)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--Fresnica-spacing-sm)', minWidth: 0 }}>
                <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</strong>
                {beta && (
                    <Tag color="app-orange" variant="soft" size="small">
                        Beta
                    </Tag>
                )}
            </span>
            <span
                style={{
                    color: 'var(--Fresnica-text-color-secondary)',
                    fontSize: 'var(--Fresnica-font-size-supporting)',
                    lineHeight: 1.35,
                }}
            >
                {description}
            </span>
        </span>
        <Button type="default" size="small" onClick={onOpen}>
            About
        </Button>
    </div>
);

const iconButtonStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 40,
    height: 40,
    padding: 0,
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'transparent',
    color: 'var(--Fresnica-text-color)',
    cursor: 'pointer',
};

export default FresnicaExploreDappsDemo;
