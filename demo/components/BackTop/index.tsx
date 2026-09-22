import React, { useCallback, useEffect } from 'react';
import { BackTop, Card } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const BACKTOP_API: ApiRow[] = [
    { prop: 'visibilityHeight', desc: '滚动多少 px 后显示', type: 'number', defaultVal: '400' },
    {
        prop: 'target',
        desc: '滚动容器函数，默认 window',
        type: '() => HTMLElement | Window',
        defaultVal: '() => window',
    },
    { prop: 'duration', desc: '滚动动画时长(ms)', type: 'number', defaultVal: '300' },
    { prop: 'onClick', desc: '点击回调', type: '(e) => void', defaultVal: '-' },
];

const RECORDS = [
    ['XLM', 'Stellar Mainnet', '8,420.00'],
    ['USDC', 'Stellar Mainnet', '1,250.00'],
    ['AQUA', 'Stellar Mainnet', '3,800.00'],
    ['EURC', 'Stellar Mainnet', '640.00'],
    ['yXLM', 'Stellar Mainnet', '2,120.00'],
    ['SLT', 'Stellar Mainnet', '960.00'],
];

const BackTopDemo: React.FC = () => {
    const getTarget = useCallback(() => document.querySelector('main') || window, []);
    useEffect(() => {
        const timer = setTimeout(
            () => document.querySelector('main')?.scrollTo({ top: 9999, behavior: 'smooth' }),
            300
        );
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                BackTop <DemoTag>返回顶部</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div
                    style={{
                        fontSize: 'var(--Fresnica-font-size-base)',
                        color: 'var(--Fresnica-text-color-secondary)',
                        marginBottom: 'var(--Fresnica-spacing-lg)',
                        lineHeight: 1.6,
                    }}
                >
                    页面会自动滚动到底部，点击右下角的 ArrowUp 图标返回顶部。
                </div>
                <div style={labelStyle}>Stellar 资产列表</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--Fresnica-spacing-md)' }}>
                    {RECORDS.map(([symbol, network, balance], index) => (
                        <Card
                            key={symbol}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-md)',
                                background: 'var(--Fresnica-surface)',
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: 'var(--Fresnica-primary-color-bg)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontWeight: 700,
                                    color: 'var(--Fresnica-primary-color)',
                                }}
                            >
                                {symbol.slice(0, 2)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>{symbol}</div>
                                <div style={{ fontSize: 'var(--Fresnica-font-size-sm)', opacity: 0.7 }}>{network}</div>
                            </div>
                            <strong>{balance}</strong>
                        </Card>
                    ))}
                </div>
            </div>
            <BackTop target={getTarget} visibilityHeight={-1} />
            <CodeBlock code={`import { BackTop } from 'fresnica-ui';\n\n<BackTop visibilityHeight={400} />`} />
            <ApiTable rows={BACKTOP_API} />
        </div>
    );
};

export default BackTopDemo;
