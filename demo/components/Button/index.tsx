import React, { useState } from 'react';
import { Plus, Send, WalletCards } from 'lucide-react';
import { Button } from '../../../src';
import {
    ApiTable,
    ApiRow,
    CodeBlock,
    DemoTag,
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    demoBodyStyle,
} from '../../tools';

const BUTTON_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '按钮类型',
        type: "'primary' | 'default' | 'dashed' | 'text' | 'link' | 'inverse'",
        defaultVal: "'default'",
    },
    { prop: 'size', desc: '按钮尺寸', type: "'small' | 'middle' | 'large'", defaultVal: "'middle'" },
    { prop: 'danger', desc: '破坏性操作状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'block', desc: '块级布局', type: 'boolean', defaultVal: 'false' },
    { prop: 'loading', desc: '处理中状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'disabled', desc: '禁用状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'icon', desc: 'Lucide 图标', type: 'ReactNode', defaultVal: '-' },
];
const row: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--Fresnica-spacing-md)',
    flexWrap: 'wrap',
    alignItems: 'center',
};

const ButtonDemo: React.FC = () => {
    const [selectedAction, setSelectedAction] = useState<'asset' | 'add' | null>(null);
    const selectedButtonStyle: React.CSSProperties = {
        color: 'var(--Fresnica-primary-color)',
        borderColor: 'var(--Fresnica-primary-color)',
        background: 'var(--Fresnica-primary-color-bg)',
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Button <DemoTag>钱包操作</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>操作层级</div>
                <div style={row}>
                    <Button type="primary">确认交易</Button>
                    <Button>次要操作</Button>
                    <Button type="dashed">添加资产</Button>
                    <Button type="text">取消</Button>
                    <Button type="link">查看详情</Button>
                    <Button type="inverse">Swap</Button>
                </div>
                <div style={labelStyle}>处理中与破坏性操作</div>
                <div style={row}>
                    <Button type="primary" loading>
                        处理中
                    </Button>
                    <Button type="primary" danger>
                        移除钱包
                    </Button>
                    <Button danger>撤销操作</Button>
                    <Button type="dashed" danger>
                        拒绝签名
                    </Button>
                    <Button type="primary" disabled>
                        暂不可用
                    </Button>
                </div>
                <div style={labelStyle}>Stellar 钱包图标按钮（Lucide）</div>
                <div
                    style={{
                        marginBottom: 'var(--Fresnica-spacing-sm)',
                        fontSize: 'var(--Fresnica-font-size-sm)',
                        color: 'var(--Fresnica-text-color-secondary)',
                    }}
                >
                    点击“资产”或“添加资产”查看选中态：文字与图标统一使用主绿色。
                </div>
                <div style={row}>
                    <Button type="primary" icon={<Send size={16} aria-hidden="true" />}>
                        转账
                    </Button>
                    <Button
                        icon={<WalletCards size={16} aria-hidden="true" />}
                        aria-pressed={selectedAction === 'asset'}
                        onClick={() => setSelectedAction(selectedAction === 'asset' ? null : 'asset')}
                        style={selectedAction === 'asset' ? selectedButtonStyle : undefined}
                    >
                        资产
                    </Button>
                    <Button
                        type="dashed"
                        icon={<Plus size={16} aria-hidden="true" />}
                        aria-pressed={selectedAction === 'add'}
                        onClick={() => setSelectedAction(selectedAction === 'add' ? null : 'add')}
                        style={selectedAction === 'add' ? selectedButtonStyle : undefined}
                    >
                        添加资产
                    </Button>
                </div>
                <div style={labelStyle}>尺寸与块级布局</div>
                <div style={row}>
                    <Button size="small">Small</Button>
                    <Button>Middle</Button>
                    <Button size="large">Large</Button>
                </div>
                <div style={{ width: '100%', maxWidth: 360, minWidth: 0, boxSizing: 'border-box' }}>
                    <Button type="primary" block>
                        继续
                    </Button>
                </div>
            </div>
            <CodeBlock
                code={`import { Send } from 'lucide-react';\nimport { Button } from 'fresnica-ui';\n\n<Button type="primary" icon={<Send size={16} />}>转账</Button>\n<Button type="primary" loading>处理中</Button>\n<Button type="primary" danger>移除钱包</Button>\n<Button type="inverse">Swap</Button>`}
            />
            <ApiTable rows={BUTTON_API} />
        </div>
    );
};
export default ButtonDemo;
