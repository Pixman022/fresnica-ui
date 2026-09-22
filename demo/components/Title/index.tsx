import React from 'react';
import { Title } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const TITLE_API: ApiRow[] = [
    { prop: 'children', desc: '标题内容', type: 'ReactNode', defaultVal: '-', required: true },
    {
        prop: 'size',
        desc: '字号层级：small 14px / middle 18px / large 28px',
        type: "'small' | 'middle' | 'large'",
        defaultVal: "'middle'",
    },
    { prop: 'color', desc: '语义配色，默认使用当前主题文字色', type: 'TitleColor', defaultVal: "'default'" },
    {
        prop: 'variant',
        desc: 'Fresnica 语义文字标题',
        type: "'heading'",
        defaultVal: "'heading'",
    },
    { prop: 'as', desc: 'heading 渲染元素', type: "'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span'", defaultVal: "'h2'" },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', defaultVal: '-' },
];

const rows = [
    ['Display / 页面标题', 'h1', '28px / 36px', '700', '页面入口、核心流程标题'],
    ['Section / 区块标题', 'h2', '18px / 23px', '700', '卡片、资产、交易分组'],
    ['Subsection / 子标题', 'h3', '14px / 18px', '700', '详情字段、辅助分组'],
];
const semanticColors = [
    ['Default', 'var(--Fresnica-text-color)', '普通页面和区块标题'],
    ['Primary', 'var(--Fresnica-primary-color)', '品牌强调和必要选中状态；不表示成功或上涨'],
    ['Protocol', 'var(--Fresnica-accent-purple-color)', '协议、路由、签名信息'],
    ['Network', 'var(--Fresnica-accent-blue-color)', '网络和节点信息'],
    ['Liquidity', 'var(--Fresnica-accent-orange-color)', 'Swap、流动性提示'],
    ['Caution', 'var(--Fresnica-accent-yellow-color)', '待处理、注意状态'],
    ['Error', 'var(--Fresnica-error-color)', '失败和危险提示'],
];

const TitleDemo: React.FC = () => (
    <div style={{ ...sectionStyle, maxWidth: 860 }}>
        <div style={sectionTitleStyle}>
            字体 <DemoTag>Fresnica typography</DemoTag>
        </div>

        <div style={labelStyle}>字体基线</div>
        <section
            style={{
                display: 'grid',
                gap: 'var(--Fresnica-spacing-sm)',
                padding: 'var(--Fresnica-spacing-xl)',
                border: '1px solid var(--Fresnica-border-color)',
                borderRadius: 'var(--Fresnica-border-radius-base)',
                background: 'var(--Fresnica-surface)',
                color: 'var(--Fresnica-text-color)',
            }}
        >
            <p style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-base)', lineHeight: '20px' }}>
                <strong>字体族：</strong>Roboto（拉丁字母、数字） / Noto Sans SC（中文） / 系统无衬线字体
            </p>
            <p style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-base)', lineHeight: '20px' }}>
                <strong>字形：</strong>标题使用 700；正文使用 400；标签和按钮使用 600–700；余额、汇率、手续费、交易 ID
                使用等宽数字。
            </p>
            <p style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-base)', lineHeight: '20px' }}>
                <strong>移动端：</strong>基准宽度 360–430px；主要正文不低于 14px；标题避免全大写和过度字距。
            </p>
        </section>

        <div style={labelStyle}>标题层级</div>
        <section
            style={{
                display: 'grid',
                gap: 'var(--Fresnica-spacing-lg)',
                padding: 'var(--Fresnica-spacing-xl)',
                border: '1px solid var(--Fresnica-border-color)',
                borderRadius: 'var(--Fresnica-border-radius-base)',
                background: 'var(--Fresnica-surface)',
                color: 'var(--Fresnica-text-color)',
            }}
        >
            {rows.map(([role, element, size, weight, usage]) => (
                <div
                    key={role}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1.3fr .5fr 1fr .5fr 1.5fr',
                        alignItems: 'center',
                        gap: 'var(--Fresnica-spacing-md)',
                        paddingBottom: 12,
                        borderBottom: '1px solid var(--Fresnica-border-color-light)',
                    }}
                >
                    <strong>{role}</strong>
                    <code>{element}</code>
                    <span>{size}</span>
                    <span>{weight}</span>
                    <span style={{ color: 'var(--Fresnica-text-color-secondary)', fontSize: 13 }}>{usage}</span>
                </div>
            ))}
            <div style={{ display: 'grid', gap: 5 }}>
                <Title as="h1" size="large">
                    Fresnica Wallet
                </Title>
                <Title as="h2" size="middle">
                    Assets
                </Title>
                <Title as="h3" size="small">
                    Transaction details
                </Title>
            </div>
        </section>

        <div style={labelStyle}>语义配色</div>
        <section
            style={{
                display: 'grid',
                gap: 'var(--Fresnica-spacing-sm)',
                padding: 'var(--Fresnica-spacing-xl)',
                border: '1px solid var(--Fresnica-border-color)',
                borderRadius: 'var(--Fresnica-border-radius-base)',
                background: 'var(--Fresnica-surface)',
            }}
        >
            {semanticColors.map(([name, color, usage]) => (
                <div
                    key={name}
                    style={{ display: 'grid', gridTemplateColumns: '120px 220px 1fr', alignItems: 'center', gap: 12 }}
                >
                    <Title as="h3" size="small" style={{ color }}>
                        {name}
                    </Title>
                    <code style={{ color, fontSize: 12 }}>{color}</code>
                    <span style={{ color: 'var(--Fresnica-text-color-secondary)', fontSize: 13 }}>{usage}</span>
                </div>
            ))}
        </section>

        <div style={labelStyle}>使用规则</div>
        <section
            style={{
                padding: 'var(--Fresnica-spacing-xl)',
                border: '1px solid var(--Fresnica-border-color)',
                borderRadius: 'var(--Fresnica-border-radius-base)',
                background: 'var(--Fresnica-surface)',
                color: 'var(--Fresnica-text-color-secondary)',
                fontSize: 'var(--Fresnica-font-size-base)',
                lineHeight: 1.7,
            }}
        >
            <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>页面只使用一个 h1；区块按 h2、h3 顺序递进，不跳级。</li>
                <li>标题不承担正文说明；说明文字使用 14px 正文或 12px 元数据样式。</li>
                <li>页面和区块标题默认使用正文色；主绿色标题只用于确有品牌或选中语义的局部标题。</li>
                <li>颜色表达业务语义，不使用装饰色；深色主题下优先使用对应浅色 Token。</li>
                <li>标题过长时允许两行换行，避免使用省略号隐藏资产名、网络名和交易状态。</li>
                <li>保持可见键盘焦点和 WCAG AA 对比度；不要使用纯黑文字覆盖深色表面。</li>
            </ul>
        </section>

        <CodeBlock
            code={`import { Title } from 'fresnica-ui';\n\n<Title as="h1" size="large">Fresnica Wallet</Title>\n<Title as="h2" size="middle">Assets</Title>\n<Title as="h3" size="small" color="app-blue">Network</Title>`}
        />
        <ApiTable rows={TITLE_API} />
    </div>
);

export default TitleDemo;
