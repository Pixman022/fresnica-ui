import React, { useState } from 'react';
import { Tag, type TagColor } from '../../../src';
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

const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--Fresnica-spacing-md)',
    flexWrap: 'wrap',
    alignItems: 'center',
};

const TAG_API: ApiRow[] = [
    { prop: 'children', desc: '标签内容', type: 'ReactNode', defaultVal: '-' },
    { prop: 'size', desc: '尺寸', type: `'small' | 'medium' | 'large'`, defaultVal: "'medium'" },
    {
        prop: 'variant',
        desc: '视觉层级',
        type: `'solid' | 'outlined' | 'dashed' | 'soft'`,
        defaultVal: "'soft'",
    },
    {
        prop: 'color',
        desc: '七种语义颜色',
        type: `'default' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-red'`,
        defaultVal: "'default'",
    },
    { prop: 'closable', desc: '是否可关闭', type: 'boolean', defaultVal: 'false' },
    { prop: 'onClose', desc: '关闭回调', type: '(e: MouseEvent) => void', defaultVal: '-' },
    { prop: 'onClick', desc: '传入后标签可交互', type: '(e: MouseEvent) => void', defaultVal: '-' },
    { prop: 'disabled', desc: '禁用状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const COLORS: Array<{ color: TagColor; label: string; meaning: string }> = [
    { color: 'default', label: 'Default', meaning: '中性信息' },
    { color: 'app-teal', label: 'Teal', meaning: '成功 / 已确认' },
    { color: 'app-red', label: 'Red', meaning: '失败 / 危险' },
    { color: 'purple', label: 'Purple', meaning: '协议 / 签名' },
    { color: 'app-blue', label: 'Blue', meaning: '信息 / 网络' },
    { color: 'app-yellow', label: 'Yellow', meaning: '警告 / 待处理' },
    { color: 'app-orange', label: 'Orange', meaning: '注意 / 费用变化' },
];

type ClosableItem = { name: string; color: TagColor };

const TagDemo: React.FC = () => {
    const [items, setItems] = useState<ClosableItem[]>([
        { name: 'Stellar Mainnet', color: 'app-blue' },
        { name: '签名请求', color: 'purple' },
        { name: '待确认', color: 'app-yellow' },
    ]);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Tag <DemoTag>7 semantic colors</DemoTag> <DemoTag>4 variants</DemoTag> <DemoTag>3 sizes</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>主要语义颜色</div>
                <div style={rowStyle}>
                    {COLORS.map(({ color, label, meaning }) => (
                        <Tag key={color} color={color} variant="soft">
                            {label} · {meaning}
                        </Tag>
                    ))}
                </div>

                <div style={labelStyle}>视觉层级</div>
                <div style={rowStyle}>
                    <Tag variant="soft" color="app-teal">
                        Soft
                    </Tag>
                    <Tag variant="solid" color="app-red">
                        Solid
                    </Tag>
                    <Tag variant="outlined" color="app-blue">
                        Outlined
                    </Tag>
                    <Tag variant="dashed" color="purple">
                        Dashed
                    </Tag>
                </div>

                <div style={labelStyle}>尺寸</div>
                <div style={rowStyle}>
                    <Tag size="small">Small</Tag>
                    <Tag size="medium">Medium</Tag>
                    <Tag size="large">Large</Tag>
                </div>

                <div style={labelStyle}>可关闭标签</div>
                <div style={rowStyle}>
                    {items.map((item) => (
                        <Tag
                            key={item.name}
                            color={item.color}
                            closable
                            onClose={() => setItems((current) => current.filter((entry) => entry.name !== item.name))}
                        >
                            {item.name}
                        </Tag>
                    ))}
                    {items.length === 0 && (
                        <span
                            style={{
                                fontSize: 'var(--Fresnica-font-size-sm)',
                                color: 'var(--Fresnica-text-color-secondary)',
                            }}
                        >
                            所有标签均已关闭
                        </span>
                    )}
                </div>

                <div style={labelStyle}>交互状态</div>
                <div style={rowStyle}>
                    <Tag color="app-blue" onClick={() => alert('打开 Stellar 网络详情')}>
                        可点击
                    </Tag>
                    <Tag disabled>已禁用</Tag>
                </div>
            </div>
            <CodeBlock
                code={`import { Tag } from 'fresnica-ui';

<Tag color="app-teal">已确认</Tag>
<Tag color="app-yellow">待处理</Tag>
<Tag color="app-red">失败</Tag>
<Tag color="purple" variant="outlined">签名请求</Tag>
<Tag color="app-blue" closable>Stellar Mainnet</Tag>`}
            />
            <ApiTable rows={TAG_API} />
        </div>
    );
};

export default TagDemo;
