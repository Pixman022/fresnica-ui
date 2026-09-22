import React from 'react';
import { Card } from '../../../src';
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

const CARD_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '卡片层级',
        type: `'default' | 'dashed'`,
        defaultVal: `'default'`,
    },
    {
        prop: 'color',
        desc: '语义辅助色；业务卡片优先使用 default',
        type: `'default' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-red'`,
        defaultVal: `'default'`,
    },
    { prop: 'hoverable', desc: '是否启用可点击卡片的轻量 hover 反馈', type: 'boolean', defaultVal: 'false' },
    { prop: 'children', desc: '卡片内容', type: 'ReactNode', defaultVal: '-' },
];

const row: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--Fresnica-spacing-lg)',
    flexWrap: 'wrap',
    alignItems: 'stretch',
};

const cardContent = (title: string, description: string) => (
    <>
        <div style={{ fontSize: 'var(--Fresnica-font-size-base)', fontWeight: 700, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 'var(--Fresnica-font-size-sm)', lineHeight: 1.6, opacity: 0.82 }}>{description}</div>
    </>
);

const CardDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Card <DemoTag>钱包容器</DemoTag> <DemoTag>语义表面</DemoTag>
        </div>

        <div style={demoBodyStyle}>
            <div style={labelStyle}>基础层级</div>
            <div style={row}>
                <Card style={{ width: 260 }}>
                    {cardContent('资产摘要', '用于余额、网络状态和交易信息等主要内容。')}
                </Card>
                <Card type="dashed" style={{ width: 260 }}>
                    {cardContent('添加资产', '虚线边框仅用于待配置、空状态或创建入口。')}
                </Card>
                <Card hoverable style={{ width: 260 }} tabIndex={0}>
                    {cardContent('可交互卡片', '可点击内容启用轻量描边与位移反馈。')}
                </Card>
            </div>

            <div style={labelStyle}>辅助语义色</div>
            <div style={row}>
                <Card color="app-teal" style={{ width: 180 }}>
                    {cardContent('成功', '已完成或已确认')}
                </Card>
                <Card color="app-blue" style={{ width: 180 }}>
                    {cardContent('信息', '网络与数据说明')}
                </Card>
                <Card color="purple" style={{ width: 180 }}>
                    {cardContent('协议', '智能合约与技术信息')}
                </Card>
                <Card color="app-yellow" style={{ width: 180 }}>
                    {cardContent('提醒', '需要用户注意')}
                </Card>
                <Card color="app-orange" style={{ width: 180 }}>
                    {cardContent('等待', '处理中或待确认')}
                </Card>
                <Card color="app-red" style={{ width: 180 }}>
                    {cardContent('风险', '失败或高风险提示')}
                </Card>
            </div>
        </div>

        <CodeBlock
            code={`import { Card } from 'fresnica-ui';

<Card>
    资产摘要
</Card>

<Card type="dashed">
    添加资产
</Card>

            <Card color="app-red">
    高风险提示
</Card>

<Card hoverable tabIndex={0}>
    可交互卡片
</Card>`}
        />
        <ApiTable rows={CARD_API} />
    </div>
);

export default CardDemo;
