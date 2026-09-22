import React from 'react';
import { Footer as FooterComponent } from '../../../src';
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

const FOOTER_API: ApiRow[] = [
    { prop: 'type', desc: '布局密度', type: "'default' | 'compact'", defaultVal: "'default'" },
    { prop: 'children', desc: '页脚内容', type: 'ReactNode', defaultVal: 'Fresnica · Stellar wallet interface' },
];

const FooterDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Footer <DemoTag>页脚</DemoTag>
        </div>
        <div style={labelStyle}>为 Fresnica 钱包页面提供统一的产品信息和版权区域。</div>
        <div style={{ ...demoBodyStyle, padding: '32px 0' }}>
            <FooterComponent />
        </div>
        <div style={{ ...demoBodyStyle, padding: '32px 0' }}>
            <FooterComponent type="compact">Stellar network · Fresnica wallet</FooterComponent>
        </div>
        <CodeBlock
            code={`import { Footer } from 'fresnica-ui';\n\n<Footer />\n<Footer type="compact">Stellar network · Fresnica wallet</Footer>`}
        />
        <ApiTable rows={FOOTER_API} />
    </div>
);

export default FooterDemo;
