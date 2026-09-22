import React, { useState } from 'react';
import { Checkbox } from '../../../src';
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

const CHECKBOX_API: ApiRow[] = [
    { prop: 'options', desc: '选项列表', type: 'CheckboxOption[]', defaultVal: '-', required: true },
    { prop: 'value', desc: '受控选中值列表', type: 'Array<string | number>', defaultVal: '-' },
    { prop: 'defaultValue', desc: '默认选中值列表', type: 'Array<string | number>', defaultVal: '[]' },
    { prop: 'size', desc: '尺寸', type: "'small' | 'middle' | 'large'", defaultVal: "'middle'" },
    { prop: 'disabled', desc: '禁用全部选项', type: 'boolean', defaultVal: 'false' },
    { prop: 'direction', desc: '排列方向', type: "'horizontal' | 'vertical'", defaultVal: "'horizontal'" },
    { prop: 'onChange', desc: '选中值变化回调', type: '(values: Array<string | number>) => void', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', defaultVal: '-' },
];

const walletOptions = [
    { label: '账户余额', value: 'balance' },
    { label: '交易记录', value: 'activity' },
    { label: '收藏资产', value: 'assets' },
    { label: '价格提醒', value: 'alerts' },
];

const networkOptions = [
    { label: 'Stellar Mainnet', value: 'mainnet' },
    { label: 'Stellar Testnet', value: 'testnet' },
    { label: 'Soroban RPC', value: 'soroban', disabled: true },
    { label: 'Horizon API', value: 'horizon' },
    { label: '交易模拟', value: 'simulation' },
];
const controlBoxStyle: React.CSSProperties = { ...demoBoxStyle, background: 'var(--Fresnica-surface)' };

const CheckboxDemo: React.FC = () => {
    const [selected1, setSelected1] = useState<Array<string | number>>(['balance', 'assets']);
    const [selected2, setSelected2] = useState<Array<string | number>>([]);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Checkbox <DemoTag>基础用法</DemoTag>
            </div>

            <div style={labelStyle}>默认水平排列（受控）</div>
            <div
                style={{
                    marginBottom: 'var(--Fresnica-spacing-sm)',
                    fontSize: 'var(--Fresnica-font-size-supporting)',
                    color: 'var(--Fresnica-text-color-secondary)',
                }}
            >
                已选中:{' '}
                <span style={{ color: 'var(--Fresnica-primary-color)', fontWeight: 600 }}>
                    {selected1.length > 0
                        ? walletOptions
                              .filter((o) => selected1.includes(o.value))
                              .map((o) => o.label)
                              .join('、')
                        : '无'}
                </span>
            </div>
            <div style={controlBoxStyle}>
                <Checkbox options={walletOptions} value={selected1} onChange={setSelected1} style={{ gap: 20 }} />
            </div>

            <div style={labelStyle}>垂直排列 + 含禁用选项</div>
            <div style={controlBoxStyle}>
                <Checkbox
                    options={networkOptions}
                    value={selected2}
                    onChange={setSelected2}
                    direction="vertical"
                    style={{ gap: 'var(--Fresnica-spacing-md)' }}
                />
            </div>

            <div style={labelStyle}>小尺寸</div>
            <div style={controlBoxStyle}>
                <Checkbox options={walletOptions} defaultValue={['balance']} size="small" />
            </div>

            <div style={labelStyle}>中尺寸（默认）</div>
            <div style={controlBoxStyle}>
                <Checkbox options={walletOptions} defaultValue={['assets']} size="middle" />
            </div>

            <div style={labelStyle}>大尺寸</div>
            <div style={controlBoxStyle}>
                <Checkbox options={walletOptions.slice(0, 3)} defaultValue={['balance']} size="large" />
            </div>

            <div style={labelStyle}>全部禁用</div>
            <div style={controlBoxStyle}>
                <Checkbox options={walletOptions} defaultValue={['alerts']} disabled />
            </div>

            <CodeBlock
                code={`import React, { useState } from 'react';
import { Checkbox } from 'fresnica-ui';

const options = [
    { label: '账户余额', value: 'balance' },
    { label: '交易记录', value: 'activity' },
    { label: '收藏资产', value: 'assets' },
];

const App = () => {
    return (
        <div>
            {/* 非受控 */}
            <Checkbox options={options} defaultValue={['balance']} />
            {/* 受控 */}
            <Checkbox options={options} value={values} onChange={setValues} />
            {/* 垂直排列 */}
            <Checkbox options={options} direction="vertical" />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={CHECKBOX_API} />
        </div>
    );
};

export default CheckboxDemo;
