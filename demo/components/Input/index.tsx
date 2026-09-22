import React, { useState } from 'react';
import { CornerDownLeft, Search } from 'lucide-react';
import { Input } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const INPUT_API: ApiRow[] = [
    {
        prop: 'size',
        desc: '输入框尺寸',
        type: `'small' | 'middle' | 'large'`,
        defaultVal: "'middle'",
    },
    { prop: 'prefix', desc: '前缀图标', type: 'ReactNode', defaultVal: '-' },
    { prop: 'suffix', desc: '后缀图标', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'allowClear',
        desc: '允许清除',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'status',
        desc: '校验状态',
        type: `'error' | 'warning'`,
        defaultVal: '-',
    },
    {
        prop: 'onChange',
        desc: '值变化回调',
        type: 'ChangeEventHandler<HTMLInputElement>',
        defaultVal: '-',
    },
    { prop: 'onClear', desc: '清除回调', type: '() => void', defaultVal: '-' },
    {
        prop: '...',
        desc: '继承 React.InputHTMLAttributes',
        type: 'HTMLInputElement',
        defaultVal: '-',
    },
];

const S = {
    col: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--Fresnica-spacing-md)',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
    } as React.CSSProperties,
};

const InputDemo: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Input <DemoTag>3 sizes</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>基础用法</div>
                <div style={{ ...(S.col as any), maxWidth: 360 }}>
                    <Input placeholder="输入钱包名称" />
                    <Input
                        placeholder="搜索 Stellar 资产"
                        allowClear
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClear={() => setInputValue('')}
                    />
                    <Input
                        placeholder="输入资产代码，例如 XLM"
                        prefix={<Search size={16} aria-hidden="true" />}
                        suffix={<CornerDownLeft size={16} aria-hidden="true" />}
                    />
                </div>
                <div style={labelStyle}>size 尺寸</div>
                <div style={{ ...(S.col as any), maxWidth: 360 }}>
                    <Input placeholder="小号：交易备注" size="small" />
                    <Input placeholder="中号：Stellar 地址" size="middle" />
                    <Input placeholder="大号：资产搜索" size="large" />
                </div>
                <div style={labelStyle}>status 校验状态</div>
                <div style={{ ...(S.col as any), maxWidth: 360 }}>
                    <Input placeholder="无效的 Stellar 地址" status="error" />
                    <Input placeholder="请确认 Memo 内容" status="warning" />
                </div>
                <div style={labelStyle}>disabled 禁用</div>
                <div style={{ ...(S.col as any), maxWidth: 360 }}>
                    <Input placeholder="当前钱包为只读状态" disabled />
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { CornerDownLeft, Search } from 'lucide-react';
import { Input } from 'fresnica-ui';

const App = () => {
    const [val, setVal] = useState('');
    return (
        <div>
            {/* 基础输入框 */}
            <Input placeholder="输入钱包名称" />
            {/* 带清除按钮 */}
            <Input placeholder="搜索 Stellar 资产" allowClear value={val} onChange={e => setVal(e.target.value)} />
            {/* 前后缀 */}
            <Input placeholder="输入资产代码" prefix={<Search size={16} />} suffix={<CornerDownLeft size={16} />} />
            {/* 小尺寸 */}
            <Input placeholder="交易备注" size="small" />
            {/* 大尺寸 */}
            <Input placeholder="资产搜索" size="large" />
            {/* 错误状态 */}
            <Input placeholder="无效的 Stellar 地址" status="error" />
            {/* 警告状态 */}
            <Input placeholder="请确认 Memo 内容" status="warning" />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={INPUT_API} />
        </div>
    );
};

export default InputDemo;
