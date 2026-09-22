import React, { useState } from 'react';
import { Loading as LoadingComponent, Button } from '../../../src';
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

const LoadingDemo: React.FC = () => {
    const [active, setActive] = useState(true);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Loading <DemoTag>加载动画</DemoTag>
            </div>
            <div style={labelStyle}>
                Fresnica 钱包 Loading 组件，使用 Lucide 旋转指示器与状态文本，适合交易提交和数据同步场景。
            </div>
            <div style={{ marginBottom: 'var(--Fresnica-spacing-lg)' }}>
                <Button type={active ? 'default' : 'primary'} onClick={() => setActive(!active)}>
                    {active ? '关闭 Loading' : '开启 Loading'}
                </Button>
            </div>
            <div style={{ ...demoBodyStyle, position: 'relative', height: 800, padding: 0, overflow: 'hidden' }}>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--Fresnica-bg-color-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--Fresnica-font-size-title-lg)',
                        fontWeight: 600,
                        color: 'var(--Fresnica-text-color-secondary)',
                    }}
                >
                    底层内容 · Underlying Content
                </div>
                <LoadingComponent active={active} style={{ height: '100%', position: 'absolute', inset: 0 }} />
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Loading } from 'fresnica-ui';

const App = () => {
    const [active, setActive] = useState(true);
    return (
        <div style={{ position: 'relative', height: 800 }}>
            {/* 底层内容 */}
            <div style={{ position: 'absolute', inset: 0 }}>Underlying Content</div>
            {/* Loading 状态覆盖层 */}
            <Loading
                active={active}
                style={{ position: 'absolute', inset: 0, height: '100%' }}
            />
            <button onClick={() => setActive(!active)}>
                {active ? '关闭 Loading' : '开启 Loading'}
            </button>
        </div>
    );
};`}
            />
            <ApiTable rows={LOADING_API} />
        </div>
    );
};

const LOADING_API: ApiRow[] = [
    { prop: 'active', desc: '是否显示加载动画', type: 'boolean', defaultVal: 'true' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

export default LoadingDemo;
