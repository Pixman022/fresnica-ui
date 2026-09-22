import React, { useState } from 'react';
import { Tabs } from '../../../src';
import type { TabItem } from '../../../src';
import { labelStyle, ApiTable, CodeBlock, sectionStyle, sectionTitleStyle, DemoTag, demoBoxStyle } from '../../tools';

const TABS_API = [
    { prop: 'items', desc: '标签页配置列表', type: 'TabItem[]', defaultVal: '-', required: true },
    { prop: 'defaultActiveKey', desc: '默认激活的标签', type: 'string', defaultVal: '第一个标签' },
    { prop: 'activeKey', desc: '受控模式当前激活标签', type: 'string', defaultVal: '-' },
    { prop: 'onChange', desc: '标签切换回调', type: '(key: string) => void', defaultVal: '-' },
    { prop: 'variant', desc: '标签视觉变体', type: "'card' | 'segmented' | 'underline'", defaultVal: "'card'" },
    { prop: 'size', desc: '标签尺寸', type: "'compact' | 'default'", defaultVal: "'default'" },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const TabsDemo: React.FC = () => {
    const [activeKey, setActiveKey] = useState('tab1');
    const items: TabItem[] = [
        {
            key: 'tab1',
            label: '资产',
            children: (
                <div>
                    <p style={{ marginBottom: 'var(--Fresnica-spacing-md)' }}>
                        查看 XLM、USDC、AQUA 等 Stellar 资产余额。
                    </p>
                    <p>资产金额使用等宽数字，并展示对应法币估值。</p>
                </div>
            ),
        },
        {
            key: 'tab2',
            label: '活动',
            children: (
                <div>
                    <p style={{ marginBottom: 'var(--Fresnica-spacing-md)' }}>查看发送、接收与兑换记录。</p>
                    <p>每条记录均显示 Stellar 网络状态与时间。</p>
                </div>
            ),
        },
        {
            key: 'tab3',
            label: '网络',
            children: (
                <div>
                    <p style={{ marginBottom: 'var(--Fresnica-spacing-md)' }}>当前连接 Stellar Mainnet。</p>
                    <p>可查看 Horizon 节点状态与响应延迟。</p>
                </div>
            ),
        },
    ];

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Tab <DemoTag>基础用法</DemoTag>
            </div>
            <div style={labelStyle}>非受控模式</div>
            <div style={demoBoxStyle}>
                <Tabs
                    items={[
                        { key: 'a', label: '资产', children: <p>XLM、USDC、AQUA...</p> },
                        { key: 'b', label: '交易', children: <p>发送、接收、兑换...</p> },
                        { key: 'c', label: '网络', children: <p>Stellar 主网与测试网...</p> },
                    ]}
                    defaultActiveKey="a"
                />
            </div>
            <div style={labelStyle}>受控模式</div>
            <div style={demoBoxStyle}>
                <Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />
            </div>
            <div style={labelStyle}>分段标签（compact）</div>
            <div style={demoBoxStyle}>
                <Tabs
                    variant="segmented"
                    size="compact"
                    items={[
                        { key: 'assets', label: '资产', children: <p>XLM 和 USDC 余额</p> },
                        { key: 'activity', label: '活动', children: <p>最近的钱包活动</p> },
                    ]}
                    defaultActiveKey="assets"
                />
            </div>
            <div
                style={{
                    marginTop: 'var(--Fresnica-spacing-lg)',
                    fontSize: 'var(--Fresnica-font-size-supporting)',
                    color: 'var(--Fresnica-text-color-secondary)',
                }}
            >
                当前选中:{' '}
                <span style={{ color: 'var(--Fresnica-primary-color)', fontWeight: 600 }}>
                    {items.find((i) => i.key === activeKey)?.label}
                </span>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Tabs } from 'fresnica-ui';

const App = () => {
    return (
        <div>
            {/* 非受控模式 */}
            <Tabs
                items={[
                    { key: 'assets', label: '资产', children: <p>XLM、USDC、AQUA</p> },
                    { key: 'activity', label: '活动', children: <p>最近交易</p> },
                ]}
                defaultActiveKey="tab1"
            />
            {/* 受控模式 */}
            <Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={TABS_API} />
        </div>
    );
};

export default TabsDemo;
