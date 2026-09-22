import React, { useState } from 'react';
import { Radio } from '../../../src';
import {
    labelStyle,
    ApiTable,
    CodeBlock,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBoxStyle,
} from '../../tools';

const RADIO_API: ApiRow[] = [
    { prop: 'options', desc: '选项列表', type: 'RadioOption[]', defaultVal: '-', required: true },
    { prop: 'value', desc: '受控选中值', type: 'string | number', defaultVal: '-' },
    { prop: 'defaultValue', desc: '默认选中值', type: 'string | number', defaultVal: '-' },
    { prop: 'size', desc: '尺寸', type: "'small' | 'middle' | 'large'", defaultVal: "'middle'" },
    { prop: 'disabled', desc: '禁用全部选项', type: 'boolean', defaultVal: 'false' },
    { prop: 'direction', desc: '排列方向', type: "'horizontal' | 'vertical'", defaultVal: "'horizontal'" },
    { prop: 'onChange', desc: '选中值变化回调', type: '(value: string | number) => void', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', defaultVal: '-' },
];

const networkOptions = [
    { label: 'Stellar 主网', value: 'mainnet' },
    { label: 'Stellar 测试网', value: 'testnet' },
    { label: '自定义节点', value: 'custom' },
    { label: '离线模式', value: 'offline' },
];

const assetOptions = [
    { label: 'XLM', value: 'xlm' },
    { label: 'USDC', value: 'usdc' },
    { label: 'AQUA', value: 'aqua' },
    { label: 'EURC', value: 'eurc', disabled: true },
    { label: 'yXLM', value: 'yxlm' },
];

const feePriorityOptions = [
    { label: '快速', value: 'fast' },
    { label: '标准', value: 'standard' },
    { label: '低费率', value: 'economy' },
    { label: '自定义', value: 'custom' },
];
const controlBoxStyle: React.CSSProperties = { ...demoBoxStyle, background: 'var(--Fresnica-surface)' };

const RadioDemo: React.FC = () => {
    const [selected1, setSelected1] = useState<string | number>('mainnet');
    const [selected2, setSelected2] = useState<string | number>('');
    const [selected3, setSelected3] = useState<string | number>('standard');

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Radio <DemoTag>单选框</DemoTag>
            </div>

            <div style={labelStyle}>水平排列（受控）— 支持方向键切换</div>
            <div
                style={{
                    marginBottom: 'var(--Fresnica-spacing-sm)',
                    fontSize: 'var(--Fresnica-font-size-supporting)',
                    color: 'var(--Fresnica-text-color-secondary)',
                }}
            >
                已选中:{' '}
                <span style={{ color: 'var(--Fresnica-primary-color)', fontWeight: 600 }}>
                    {networkOptions.find((o) => o.value === selected1)?.label ?? '无'}
                </span>
            </div>
            <div style={controlBoxStyle}>
                <Radio options={networkOptions} value={selected1} onChange={setSelected1} style={{ gap: 20 }} />
            </div>

            <div style={labelStyle}>垂直排列 + 含禁用选项</div>
            <div style={controlBoxStyle}>
                <Radio
                    options={assetOptions}
                    value={selected2}
                    onChange={setSelected2}
                    direction="vertical"
                    style={{ gap: 'var(--Fresnica-spacing-md)' }}
                />
            </div>

            <div style={labelStyle}>小尺寸</div>
            <div style={controlBoxStyle}>
                <Radio options={feePriorityOptions} defaultValue="standard" size="small" />
            </div>

            <div style={labelStyle}>中尺寸（默认）</div>
            <div style={controlBoxStyle}>
                <Radio options={feePriorityOptions} defaultValue="standard" size="middle" />
            </div>

            <div style={labelStyle}>大尺寸</div>
            <div style={controlBoxStyle}>
                <Radio options={feePriorityOptions} defaultValue="standard" size="large" />
            </div>

            <div style={labelStyle}>受控模式 — 实时同步交易速度</div>
            <div
                style={{
                    marginBottom: 'var(--Fresnica-spacing-sm)',
                    fontSize: 'var(--Fresnica-font-size-supporting)',
                    color: 'var(--Fresnica-text-color-secondary)',
                }}
            >
                已选中:{' '}
                <span style={{ color: 'var(--Fresnica-primary-color)', fontWeight: 600 }}>
                    {feePriorityOptions.find((o) => o.value === selected3)?.label ?? '无'}
                </span>
            </div>
            <div style={controlBoxStyle}>
                <Radio options={feePriorityOptions} value={selected3} onChange={setSelected3} size="large" />
            </div>

            <div style={labelStyle}>全部禁用</div>
            <div style={controlBoxStyle}>
                <Radio options={networkOptions} defaultValue="mainnet" disabled />
            </div>

            <CodeBlock
                code={`import React, { useState } from 'react';
import { Radio } from 'fresnica-ui';

const options = [
    { label: 'Stellar 主网', value: 'mainnet' },
    { label: 'Stellar 测试网', value: 'testnet' },
    { label: '自定义节点', value: 'custom' },
];

const App = () => {
    const [value, setValue] = useState('mainnet');
    return (
        <div>
            {/* 非受控 */}
            <Radio options={options} defaultValue="mainnet" />
            {/* 受控 */}
            <Radio options={options} value={value} onChange={setValue} />
            {/* 垂直排列 */}
            <Radio options={options} direction="vertical" />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={RADIO_API} />
        </div>
    );
};

export default RadioDemo;
