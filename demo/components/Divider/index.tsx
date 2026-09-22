import React from 'react';
import { Divider } from '../../../src';
import { labelStyle, sectionStyle, sectionTitleStyle, DemoTag, ApiTable, ApiRow, CodeBlock } from '../../tools';

const DIVIDER_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '分隔线类型',
        type: `'solid' | 'subtle' | 'dashed' | 'accent'`,
        defaultVal: "'subtle'",
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const DividerDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Divider <DemoTag>4 types</DemoTag>
        </div>
        <div style={labelStyle}>subtle（低对比度）</div>
        <Divider type="subtle" />
        <div style={labelStyle}>solid（实线）</div>
        <Divider type="solid" />
        <div style={labelStyle}>dashed（虚线）</div>
        <Divider type="dashed" />
        <div style={labelStyle}>accent（主色强调）</div>
        <Divider type="accent" />
        <CodeBlock
            code={`import React from 'react';
import { Divider } from 'fresnica-ui';

const App = () => {
    return (
        <div>
            <Divider type="subtle" />
            <Divider type="solid" />
            <Divider type="dashed" />
            <Divider type="accent" />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={DIVIDER_API} />
    </div>
);

export default DividerDemo;
