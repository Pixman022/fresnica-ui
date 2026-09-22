import React from 'react';
import { Cursor } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    demoDashedBoxStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const CURSOR_API: ApiRow[] = [
    {
        prop: 'forceAll',
        desc: '是否为后代链接和按钮统一补充 pointer；输入框与禁用项始终保留原生语义光标',
        type: 'boolean',
        defaultVal: 'true',
    },
    { prop: 'children', desc: '子元素', type: 'ReactNode', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const CursorDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Cursor <DemoTag>光标</DemoTag>
        </div>
        <p style={labelStyle}>
            Cursor 组件统一管理桌面端语义光标，不加载自定义图片。默认 <code>forceAll=true</code> 为链接与按钮补充
            pointer；输入框和禁用项始终保留 text / not-allowed 语义。
        </p>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>forceAll=true（默认）：统一交互语义</div>
            <Cursor>
                <div style={{ ...demoDashedBoxStyle, padding: 'var(--Fresnica-spacing-xl)', textAlign: 'center' }}>
                    钱包操作区域：按钮与链接使用 pointer
                </div>
            </Cursor>
            <div style={labelStyle}>forceAll=false：完全交给浏览器</div>
            <Cursor forceAll={false}>
                <div
                    style={{
                        ...demoDashedBoxStyle,
                        padding: 'var(--Fresnica-spacing-xl)',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--Fresnica-spacing-md)',
                    }}
                >
                    <div>资产信息区域：各元素使用浏览器默认语义</div>
                    <div
                        style={{
                            display: 'flex',
                            gap: 'var(--Fresnica-spacing-lg)',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                            查看 Stellar Explorer
                        </a>
                        <button type="button">复制地址</button>
                        <button type="button" disabled>
                            暂不可转账
                        </button>
                        <input
                            type="text"
                            placeholder="搜索 Stellar 资产"
                            style={{ padding: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-sm)' }}
                        />
                        <span style={{ userSelect: 'text' }}>G... Stellar 地址</span>
                    </div>
                </div>
            </Cursor>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Cursor } from 'fresnica-ui';

const App = () => {
    return (
        <div>
            {/* 默认：为链接和按钮统一补充 pointer */}
            <Cursor>
                <button>复制 Stellar 地址</button>
            </Cursor>

            {/* forceAll=false：完全使用浏览器默认语义 */}
            <Cursor forceAll={false}>
                <a href="#">查看 Stellar Explorer</a>
                <button>选择资产</button>
                <input type="text" placeholder="搜索 Stellar 资产" />
            </Cursor>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={CURSOR_API} />
    </div>
);

export default CursorDemo;
