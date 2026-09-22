import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, CircleMinus, CirclePlus, Filter, Search, Send } from 'lucide-react';
import { AssetIcon, Input } from '../../../src';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';
import FresnicaNavigation from '../FresnicaNavigation';

interface ActivityItem {
    id: string;
    date: string;
    title: string;
    action: string;
    time: string;
    amount?: string;
    symbol?: string;
    direction: 'gain' | 'loss' | 'neutral';
    icon: 'swap' | 'add' | 'remove' | 'send';
}

const activityItems: ActivityItem[] = [
    {
        id: '1',
        date: '14 Aug',
        title: 'XLM / AQUA',
        action: 'Swapped',
        time: '2:50:39 PM',
        amount: '+ 10',
        symbol: 'AQUA',
        direction: 'gain',
        icon: 'swap',
    },
    {
        id: '2',
        date: '14 Aug',
        title: 'AQUA',
        action: 'Add asset',
        time: '2:48:59 PM',
        direction: 'neutral',
        icon: 'add',
    },
    {
        id: '3',
        date: '11 Aug',
        title: 'AQUA',
        action: 'Remove asset',
        time: '3:15:07 PM',
        direction: 'neutral',
        icon: 'remove',
    },
    {
        id: '4',
        date: '11 Aug',
        title: 'GB3U****RHPW',
        action: 'Sent',
        time: '3:14:44 PM',
        amount: '- 0.5',
        symbol: 'XLM',
        direction: 'loss',
        icon: 'send',
    },
    {
        id: '5',
        date: '11 Aug',
        title: 'USDC',
        action: 'Remove asset',
        time: '3:14:00 PM',
        direction: 'neutral',
        icon: 'remove',
    },
    {
        id: '6',
        date: '11 Aug',
        title: 'GBNZ****AQUA',
        action: 'Sent',
        time: '3:13:32 PM',
        amount: '- 2',
        symbol: 'USDC',
        direction: 'loss',
        icon: 'send',
    },
];

const ActivityIcon: React.FC<{ type: ActivityItem['icon'] }> = ({ type }) => {
    const common = { size: 20, strokeWidth: 2.2 };
    if (type === 'swap') return <ArrowLeftRight {...common} />;
    if (type === 'add') return <CirclePlus {...common} />;
    if (type === 'remove') return <CircleMinus {...common} />;
    return <Send {...common} />;
};

const FresnicaActivityDemo: React.FC = () => {
    const [query, setQuery] = useState('');
    const filteredItems = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return normalized
            ? activityItems.filter((item) => `${item.title} ${item.action}`.toLowerCase().includes(normalized))
            : activityItems;
    }, [query]);
    const dates = [...new Set(filteredItems.map((item) => item.date))];

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Activity <DemoTag>原稿信息架构</DemoTag>
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
                        padding: 'var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl) var(--Fresnica-spacing-md)',
                    }}
                >
                    <strong style={{ fontSize: 'var(--Fresnica-font-size-screen-title)' }}>Activity</strong>
                    <button type="button" aria-label="Filter activity" style={iconButtonStyle}>
                        <Filter size={24} strokeWidth={2.2} />
                    </button>
                </header>
                <div style={{ padding: '0 var(--Fresnica-spacing-xl) var(--Fresnica-spacing-md)' }}>
                    <Input
                        aria-label="Search activity"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        prefix={<Search size={19} />}
                        allowClear
                    />
                </div>

                <main
                    style={{
                        flex: 1,
                        display: 'grid',
                        alignContent: 'start',
                        padding: '0 var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl)',
                    }}
                >
                    {dates.map((date) => (
                        <section key={date}>
                            <h2
                                style={{
                                    margin: 0,
                                    padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-sm)',
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-supporting)',
                                }}
                            >
                                {date}
                            </h2>
                            {filteredItems
                                .filter((item) => item.date === date)
                                .map((item) => (
                                    <button key={item.id} type="button" style={activityRowStyle}>
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                display: 'grid',
                                                placeItems: 'center',
                                                width: 44,
                                                height: 44,
                                                flexShrink: 0,
                                                border: '1px solid var(--Fresnica-border-color)',
                                                borderRadius: 'var(--Fresnica-border-radius-pill)',
                                                background: 'var(--Fresnica-surface-low)',
                                                color: 'var(--Fresnica-text-color-secondary)',
                                            }}
                                        >
                                            {item.icon === 'swap' ? (
                                                <span style={{ display: 'flex', marginLeft: -4 }}>
                                                    <AssetIcon
                                                        symbol="X"
                                                        size="small"
                                                        style={{ color: 'var(--Fresnica-text-color-secondary)' }}
                                                    />
                                                    <AssetIcon
                                                        symbol="R"
                                                        size="small"
                                                        style={{
                                                            marginLeft: -10,
                                                            color: 'var(--Fresnica-text-color-secondary)',
                                                        }}
                                                    />
                                                </span>
                                            ) : (
                                                <ActivityIcon type={item.icon} />
                                            )}
                                        </span>
                                        <span style={{ display: 'grid', minWidth: 0, textAlign: 'left' }}>
                                            <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.title}
                                            </strong>
                                            <span
                                                style={{
                                                    color: 'var(--Fresnica-text-color-muted)',
                                                    fontSize: 'var(--Fresnica-font-size-supporting)',
                                                }}
                                            >
                                                {item.action} · {item.time}
                                            </span>
                                        </span>
                                        {item.amount && (
                                            <span
                                                style={{
                                                    display: 'grid',
                                                    justifyItems: 'end',
                                                    marginLeft: 'auto',
                                                    color:
                                                        item.direction === 'gain'
                                                            ? 'var(--Fresnica-gain-color)'
                                                            : 'var(--Fresnica-loss-color)',
                                                    fontVariantNumeric: 'tabular-nums',
                                                }}
                                            >
                                                <strong>{item.amount}</strong>
                                                <span
                                                    style={{
                                                        color: 'var(--Fresnica-text-color-muted)',
                                                        fontSize: 'var(--Fresnica-font-size-sm)',
                                                    }}
                                                >
                                                    {item.symbol}
                                                </span>
                                            </span>
                                        )}
                                    </button>
                                ))}
                        </section>
                    ))}
                </main>

                <div
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 5,
                        background: 'var(--Fresnica-surface)',
                    }}
                >
                    <FresnicaNavigation activeKey="activity" />
                </div>
            </div>
        </div>
    );
};

const iconButtonStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    width: 44,
    height: 44,
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-pill)',
    background: 'transparent',
    color: 'var(--Fresnica-text-color-secondary)',
    cursor: 'pointer',
};

const activityRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--Fresnica-spacing-md)',
    width: '100%',
    minHeight: 68,
    padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-sm)',
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-control)',
    background: 'transparent',
    color: 'var(--Fresnica-text-color)',
    font: 'inherit',
    cursor: 'pointer',
};

export default FresnicaActivityDemo;
