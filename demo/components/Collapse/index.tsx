import React from 'react';
import { Collapse } from '../../../src';
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

const COLLAPSE_API: ApiRow[] = [
    {
        prop: 'question',
        desc: '问题标题',
        type: 'ReactNode',
        defaultVal: '-',
        required: true,
    },
    {
        prop: 'answer',
        desc: '答案内容',
        type: 'ReactNode',
        defaultVal: '-',
        required: true,
    },
    {
        prop: 'defaultExpanded',
        desc: '是否默认展开',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'disabled',
        desc: '是否禁用',
        type: 'boolean',
        defaultVal: 'false',
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const CollapseDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Collapse <DemoTag>FAQ</DemoTag>
        </div>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>基础用法</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="如何查看 Stellar 交易详情？"
                    answer={<p>在活动记录中选择一笔交易，即可查看金额、手续费、哈希和确认状态。</p>}
                />
                <Collapse
                    question="Fresnica 支持哪些网络？"
                    answer={<p>当前仅支持 Stellar 网络，可在设置中查看 Mainnet 与 Testnet 连接状态。</p>}
                />
            </div>
            <div style={labelStyle}>defaultExpanded 默认展开</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="如何备份钱包地址？"
                    answer={<p>复制并安全保存你的 Stellar 地址与密钥信息，任何时候都不要向他人透露私钥。</p>}
                    defaultExpanded
                />
            </div>
            <div style={labelStyle}>disabled 禁用状态</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="网络维护中（暂不可展开）"
                    answer={<p>Stellar 节点维护完成后将恢复访问。</p>}
                    disabled
                />
            </div>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Collapse } from 'fresnica-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Collapse
                question="如何查看 Stellar 交易详情？"
                answer={<p>在活动记录中选择一笔交易即可查看状态、费用与交易哈希。</p>}
            />
            {/* 默认展开 */}
            <Collapse
                question="Stellar 网络是否正常？"
                answer={<p>当前已连接 Stellar Mainnet，最新账本同步正常。</p>}
                defaultExpanded
            />
            {/* 禁用状态 */}
            <Collapse
                question="节点维护说明"
                answer={<p>Horizon 节点维护完成后将恢复访问。</p>}
                disabled
            />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={COLLAPSE_API} />
    </div>
);

export default CollapseDemo;
