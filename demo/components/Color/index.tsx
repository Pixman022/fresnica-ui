import React from 'react';
import { Tag, type TagColor } from '../../../src';
import { ApiTable, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle, useIsMobile } from '../../tools';

interface SemanticRole {
    label: string;
    token: string | string[];
    swatch: string;
    values: string;
    usage: string;
    container?: string;
    foreground?: string;
}

interface ColorFamily {
    color: TagColor;
    family: string;
    description: string;
    roles: SemanticRole[];
}

const colorFamilies: ColorFamily[] = [
    {
        color: 'default',
        family: 'Neutral 中性',
        description: '页面、卡片、描边和普通文字的基础层级。',
        roles: [
            {
                label: '标准表面',
                token: '--Fresnica-surface',
                swatch: 'var(--Fresnica-surface)',
                values: 'Light #FFFFFF / Dark #222226',
                usage: '卡片、菜单、弹层和输入控件',
            },
        ],
    },
    {
        color: 'app-teal',
        family: 'Teal 绿色',
        description: '同属绿色家族，但品牌、完成状态和资产上涨必须使用各自的语义 Token。',
        roles: [
            {
                label: '品牌主色',
                token: '--Fresnica-primary-color',
                swatch: 'var(--Fresnica-primary-color)',
                values: 'Light #00A875 / Dark #00CA8A',
                usage: '品牌识别、唯一主操作和必要选中状态；不表示成功或上涨',
            },
            {
                label: '成功',
                token: '--Fresnica-success-color',
                swatch: 'var(--Fresnica-success-color)',
                values: 'Light #00CA8A / Dark #00CA8A',
                usage: '交易确认和请求完成',
                container: 'var(--Fresnica-success-color-bg)',
                foreground: 'var(--Fresnica-on-success-container-color)',
            },
            {
                label: '上涨',
                token: '--Fresnica-gain-color',
                swatch: 'var(--Fresnica-gain-color)',
                values: 'Light #0A8F68 / Dark #32DFA4',
                usage: '资产价格或余额的正向变化',
                container: 'var(--Fresnica-gain-color-bg)',
                foreground: 'var(--Fresnica-on-gain-container-color)',
            },
        ],
    },
    {
        color: 'app-red',
        family: 'Red 红色',
        description: '相同色值只展示一次；错误、交易失败和资产下跌仍按业务语义调用对应 Token。',
        roles: [
            {
                label: '错误 / 失败',
                token: ['--Fresnica-error-color', '--Fresnica-failure-color'],
                swatch: 'var(--Fresnica-failure-color)',
                values: 'Light/Dark #C73945',
                usage: '输入校验使用 error；交易或请求失败使用 failure',
                container: 'var(--Fresnica-failure-color-bg)',
                foreground: 'var(--Fresnica-on-failure-container-color)',
            },
            {
                label: '下跌',
                token: '--Fresnica-loss-color',
                swatch: 'var(--Fresnica-loss-color)',
                values: 'Light #B42318 / Dark #FF7A86',
                usage: '资产价格或余额的负向变化',
                container: 'var(--Fresnica-loss-color-bg)',
                foreground: 'var(--Fresnica-on-loss-container-color)',
            },
        ],
    },
    {
        color: 'purple',
        family: 'Purple 紫色',
        description: '科技协议相关信息，不作为随机装饰色。',
        roles: [
            {
                label: '协议',
                token: '--Fresnica-accent-purple-color',
                swatch: 'var(--Fresnica-accent-purple-color)',
                values: 'Light #6956C8 / Dark #B8A9FF',
                usage: '协议、路由和签名信息',
            },
        ],
    },
    {
        color: 'app-blue',
        family: 'Blue 蓝色',
        description: '网络信息专用色。',
        roles: [
            {
                label: '网络',
                token: '--Fresnica-accent-blue-color',
                swatch: 'var(--Fresnica-accent-blue-color)',
                values: 'Light #356AE6 / Dark #8EAEFF',
                usage: 'Stellar 网络与节点信息',
            },
        ],
    },
    {
        color: 'app-yellow',
        family: 'Yellow 黄色',
        description: '待处理与警告同属黄色家族，分别保留信息状态与风险提示语义。',
        roles: [
            {
                label: '待处理',
                token: '--Fresnica-accent-yellow-color',
                swatch: 'var(--Fresnica-accent-yellow-color)',
                values: 'Light #A87500 / Dark #F6C65B',
                usage: '等待确认和处理中状态',
            },
            {
                label: '警告',
                token: '--Fresnica-warning-color',
                swatch: 'var(--Fresnica-warning-color)',
                values: 'Light #9A6700 / Dark #F59E0B',
                usage: '需要注意但仍可继续的操作',
                container: 'var(--Fresnica-warning-color-bg)',
                foreground: 'var(--Fresnica-on-warning-container-color)',
            },
        ],
    },
    {
        color: 'app-orange',
        family: 'Orange 橙色',
        description: '流动性提示与高风险提示共用暖色家族，但高风险必须使用专属 Token。',
        roles: [
            {
                label: '流动性',
                token: '--Fresnica-accent-orange-color',
                swatch: 'var(--Fresnica-accent-orange-color)',
                values: 'Light #C96A16 / Dark #FFB86B',
                usage: 'Swap、手续费和流动性信息',
            },
            {
                label: '高风险',
                token: '--Fresnica-risk-high-color',
                swatch: 'var(--Fresnica-risk-high-color)',
                values: 'Light #7A271A / Dark #FF9B85',
                usage: '资金安全、危险签名和不可逆提示',
                container: 'var(--Fresnica-risk-high-color-bg)',
                foreground: 'var(--Fresnica-on-risk-high-container-color)',
            },
        ],
    },
];

const pairings = [
    ['绿色实心', 'primary + on-primary', '单一区域主操作和必要选中项；文字与 Lucide 图标固定使用白色'],
    ['中性次要操作', 'surface-high + text-secondary', '复制、Max、切换方向、普通图标和辅助入口'],
    ['红色危险', 'error/failure + on-error', '危险操作的 hover、active 继续使用红色系'],
    ['语义容器', '*-color-bg + on-*-container', '成功、失败、上涨、下跌、警告和高风险状态'],
    ['中性表面', 'surface + text-color', '卡片、弹层、菜单和表单；自动适配深浅主题'],
];

const ColorDemo: React.FC = () => {
    const isMobile = useIsMobile(1180);

    return (
        <div style={{ ...sectionStyle, maxWidth: 960 }}>
            <div style={sectionTitleStyle}>
                配色 <DemoTag>7 color families</DemoTag>
            </div>
            <p
                style={{
                    margin: '0 0 var(--Fresnica-spacing-lg)',
                    color: 'var(--Fresnica-text-color-secondary)',
                    lineHeight: 1.7,
                }}
            >
                配色规范与 Tag 保持相同的七个视觉家族。完全相同的浅色/深色色值合并展示，仍在同一行标明各业务语义
                Token；仅视觉接近的颜色不会合并。
            </p>

            <div style={labelStyle}>完整配色规范</div>
            <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-md)' }}>
                {colorFamilies.map(({ color, family, description, roles }) => (
                    <section
                        key={color}
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-md)',
                            padding: 'var(--Fresnica-spacing-lg)',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-base)',
                            background: 'var(--Fresnica-surface)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-md)',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Tag color={color} variant="soft">
                                {family}
                            </Tag>
                            <span
                                style={{
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-sm)',
                                }}
                            >
                                {description}
                            </span>
                        </div>
                        <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                            {roles.map(({ label, token, swatch, values, usage, container, foreground }) => (
                                <div
                                    key={label}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile
                                            ? '32px minmax(0, 1fr)'
                                            : '32px 88px minmax(210px, 1fr) minmax(190px, 1fr) minmax(180px, 1fr)',
                                        alignItems: 'center',
                                        gap: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-md)',
                                        padding: 'var(--Fresnica-spacing-md)',
                                        borderRadius: 'var(--Fresnica-border-radius-control)',
                                        background: 'var(--Fresnica-surface-low)',
                                    }}
                                >
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            width: 28,
                                            height: 28,
                                            border: '1px solid var(--Fresnica-border-color)',
                                            borderRadius: 'var(--Fresnica-border-radius-sm)',
                                            background: swatch,
                                        }}
                                    />
                                    <strong style={{ color: 'var(--Fresnica-text-color)' }}>{label}</strong>
                                    <code
                                        style={{
                                            gridColumn: isMobile ? '2' : undefined,
                                            color: 'var(--Fresnica-text-color)',
                                            fontSize: 'var(--Fresnica-font-size-sm)',
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {(Array.isArray(token) ? token : [token]).map((tokenName) => (
                                            <span key={tokenName} style={{ display: 'block' }}>
                                                {tokenName}
                                            </span>
                                        ))}
                                    </code>
                                    <span
                                        style={{
                                            gridColumn: isMobile ? '2' : undefined,
                                            color: 'var(--Fresnica-text-color-secondary)',
                                            fontSize: 'var(--Fresnica-font-size-sm)',
                                        }}
                                    >
                                        {values}
                                    </span>
                                    <span
                                        style={{
                                            gridColumn: isMobile ? '2' : undefined,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--Fresnica-spacing-sm)',
                                            flexWrap: 'wrap',
                                            color: 'var(--Fresnica-text-color-secondary)',
                                            fontSize: 'var(--Fresnica-font-size-sm)',
                                        }}
                                    >
                                        <span>{usage}</span>
                                        {container && foreground && (
                                            <span
                                                style={{
                                                    padding: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-sm)',
                                                    borderRadius: 'var(--Fresnica-border-radius-pill)',
                                                    background: container,
                                                    color: foreground,
                                                    fontWeight: 'var(--Fresnica-font-weight-semibold)',
                                                }}
                                            >
                                                容器搭配
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <div style={labelStyle}>推荐搭配</div>
            <ApiTable
                title="颜色组合"
                rows={pairings.map(([prop, type, desc]) => ({ prop, type, desc, defaultVal: 'WCAG AA' }))}
            />

            <div style={labelStyle}>使用规则</div>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--Fresnica-text-color-secondary)', lineHeight: 1.8 }}>
                <li>单个页面或操作区域原则上只保留一个大面积品牌绿重点；钱包首页快捷操作组是已批准例外。</li>
                <li>普通图标、资产符号、复制、Max、方向切换、说明文字和预计数值使用中性色。</li>
                <li>钱包首页余额卡片使用主题中性表面，不使用绿色渐变、装饰描边或地址底色。</li>
                <li>底部导航当前项仅使用绿色图标与文字，背景保持透明。</li>
                <li>所有绿色实心背景上的文字和 Lucide 图标统一使用白色。</li>
                <li>红色危险操作的 hover、active 和选中状态始终保持红色系。</li>
                <li>品牌、成功、失败、上涨、下跌、警告和高风险必须调用对应语义 Token。</li>
                <li>紫、蓝、橙、黄只表达规定的业务含义，不作为随机装饰。</li>
                <li>容器背景必须搭配对应的 on-container 前景色，不直接复用强调色作为正文颜色。</li>
            </ul>
            <CodeBlock
                code={`:root {
    --Fresnica-primary-color: #00A875;
    --Fresnica-on-primary-color: #FFFFFF;
}

[data-theme='dark'] {
    --Fresnica-primary-color: #00CA8A;
}`}
            />
        </div>
    );
};

export default ColorDemo;
