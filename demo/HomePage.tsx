import React, { useState } from 'react';
import { ArrowDown, ArrowRight, Blocks, Palette, PackageCheck } from 'lucide-react';
import { Card, Button, Typewriter } from '../src';
import { useIsMobile } from './tools';

// ============================================
// Syntax highlighting
// ============================================
const HL_TOKENS: { pattern: RegExp; style: React.CSSProperties }[] = [
    {
        pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
        style: { color: 'var(--Fresnica-code-comment)', fontStyle: 'italic', fontWeight: 400 },
    },
    {
        pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        style: { color: 'var(--Fresnica-code-string)' },
    },
    { pattern: /(<\/?[\w.]+|\/?>)/g, style: { color: 'var(--Fresnica-code-jsx)' } },
    {
        pattern: /\b(import|from|const|let|var|function|return|export|default|true|false|null|undefined)\b/g,
        style: { color: 'var(--Fresnica-code-keyword)' },
    },
    { pattern: /\b(npm|yarn|pnpm)\b/g, style: { color: 'var(--Fresnica-code-jsx)' } },
    {
        pattern: /(install|uninstall|run|add|remove)\b/g,
        style: { color: 'var(--Fresnica-code-string)' },
    },
    { pattern: /(\{|\})/g, style: { color: 'var(--Fresnica-code-operator)' } },
    { pattern: /(=>)/g, style: { color: 'var(--Fresnica-code-keyword)' } },
    { pattern: /(--[\w-]+)(?=\s*:)/g, style: { color: 'var(--Fresnica-code-property)' } },
    { pattern: /(:root)/g, style: { color: 'var(--Fresnica-code-jsx)' } },
    { pattern: /(#[0-9a-fA-F]{3,8})\b/g, style: { color: 'var(--Fresnica-code-component)' } },
];

const highlightCode = (code: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const lines = code.split('\n');
    lines.forEach((line, li) => {
        type Seg = { start: number; end: number; style: React.CSSProperties };
        const segs: Seg[] = [];
        for (const t of HL_TOKENS) {
            const re = new RegExp(t.pattern.source, t.pattern.flags);
            let m: RegExpExecArray | null;
            while ((m = re.exec(line)) !== null) {
                const s = m.index + (m[0] !== m[1] && m[1] ? m[0].indexOf(m[1]) : 0);
                const text = m[1] || m[0];
                segs.push({ start: s, end: s + text.length, style: t.style });
            }
        }
        segs.sort((a, b) => a.start - b.start);
        const merged: Seg[] = [];
        for (const seg of segs) {
            if (merged.length === 0 || seg.start >= merged[merged.length - 1].end) merged.push(seg);
        }
        let idx = 0;
        for (const seg of merged) {
            if (seg.start > idx) parts.push(line.slice(idx, seg.start));
            parts.push(
                <span key={`${li}-${seg.start}`} style={seg.style}>
                    {line.slice(seg.start, seg.end)}
                </span>
            );
            idx = seg.end;
        }
        if (idx < line.length) parts.push(line.slice(idx));
        if (li < lines.length - 1) parts.push('\n');
    });
    return parts;
};

const CodeBlock: React.FC<{ code: string }> = ({ code }) => <pre style={S.codeBox}>{highlightCode(code)}</pre>;

const FeatureCard: React.FC<{ feature: (typeof features)[0] }> = ({ feature }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <Card
            style={{
                ...S.featureCard,
                borderColor: hovered ? 'var(--Fresnica-primary-color)' : 'var(--Fresnica-border-color)',
                boxShadow: 'var(--Fresnica-shadow-base)',
                transition: 'border-color var(--Fresnica-motion-duration-fast) ease',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                aria-hidden="true"
                style={{
                    width: 42,
                    height: 42,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--Fresnica-border-radius-control)',
                    background: 'var(--Fresnica-primary-color-bg)',
                    color: 'var(--Fresnica-primary-color)',
                    fontSize: 'var(--Fresnica-font-size-screen-title)',
                    fontWeight: 900,
                    transform: hovered ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                }}
            >
                {feature.glyph}
            </div>
            <div style={S.featureTitle}>{feature.title}</div>
            <div style={S.featureDesc}>{feature.desc}</div>
        </Card>
    );
};

// ============================================
// Styles
// ============================================
const S = {
    page: {
        width: '100%',
        minHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
    } as React.CSSProperties,

    // Hero
    hero: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '60px 40px 40px',
        position: 'relative',
    } as React.CSSProperties,
    heroContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 150,
        alignItems: 'center',
        maxWidth: 880,
        width: '100%',
    } as React.CSSProperties,
    heroContentMobile: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 32,
        alignItems: 'center',
        maxWidth: 880,
        width: '100%',
    } as React.CSSProperties,
    heroText: {
        textAlign: 'left' as const,
    } as React.CSSProperties,
    heroLogo: {
        fontSize: 72,
        lineHeight: 1,
        marginBottom: 'var(--Fresnica-spacing-lg)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } as React.CSSProperties,
    heroTitle: {
        fontFamily: 'var(--Fresnica-font-family)',
        fontSize: 55,
        fontWeight: 800,
        lineHeight: 1.1,
        color: 'var(--Fresnica-text-color)',
        margin: '0 0 var(--Fresnica-spacing-md)',
    } as React.CSSProperties,
    heroVersion: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 'var(--Fresnica-font-size-sm)',
        fontWeight: 600,
        padding: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-sm)',
        borderRadius: 'var(--Fresnica-border-radius-sm)',
        background: 'var(--Fresnica-primary-color-bg)',
        color: 'var(--Fresnica-primary-color)',
        marginLeft: 'var(--Fresnica-spacing-sm)',
        verticalAlign: 'middle',
        textShadow: 'none',
    } as React.CSSProperties,
    heroSubtitle: {
        fontSize: 17,
        color: 'var(--Fresnica-text-color-secondary)',
        lineHeight: 1.7,
        margin: '0 0 var(--Fresnica-spacing-xl)',
        maxWidth: 520,
    } as React.CSSProperties,
    heroActions: {
        display: 'flex',
        gap: 'var(--Fresnica-spacing-lg)',
        alignItems: 'center',
    } as React.CSSProperties,

    // Sections
    section: {
        padding: '48px 40px',
        maxWidth: 960,
        margin: '0 auto',
    } as React.CSSProperties,
    sectionTitle: {
        fontFamily: 'var(--Fresnica-font-family)',
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--Fresnica-text-color)',
        margin: '0 0 var(--Fresnica-spacing-sm)',
        textAlign: 'center' as const,
    } as React.CSSProperties,
    sectionDesc: {
        fontSize: 'var(--Fresnica-font-size-base)',
        color: 'var(--Fresnica-text-color-secondary)',
        textAlign: 'center' as const,
        marginBottom: 32,
    } as React.CSSProperties,

    // Features
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--Fresnica-spacing-lg)',
    } as React.CSSProperties,
    featureCard: {
        padding: 'var(--Fresnica-spacing-xl)',
        textAlign: 'center' as const,
    } as React.CSSProperties,
    featureIcon: {
        fontSize: 'var(--Fresnica-font-size-amount)',
        marginBottom: 'var(--Fresnica-spacing-md)',
    } as React.CSSProperties,
    featureTitle: {
        fontSize: 'var(--Fresnica-font-size-action)',
        fontWeight: 700,
        color: 'var(--Fresnica-text-color)',
        marginBottom: 'var(--Fresnica-spacing-sm)',
    } as React.CSSProperties,
    featureDesc: {
        fontSize: 'var(--Fresnica-font-size-supporting)',
        color: 'var(--Fresnica-text-color-secondary)',
        lineHeight: 1.6,
        display: '-webkit-box' as const,
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis' as const,
    } as React.CSSProperties,

    // Component grid
    compGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--Fresnica-spacing-md)',
    } as React.CSSProperties,
    compCard: {
        padding: 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl)',
        cursor: 'pointer',
    } as React.CSSProperties,
    compName: {
        fontSize: 'var(--Fresnica-font-size-action)',
        fontWeight: 700,
        color: 'var(--Fresnica-text-color)',
        marginBottom: 'var(--Fresnica-spacing-xs)',
    } as React.CSSProperties,
    compDesc: {
        fontSize: 'var(--Fresnica-font-size-sm)',
        color: 'var(--Fresnica-text-color-secondary)',
        lineHeight: 1.5,
    } as React.CSSProperties,

    // Code block
    codeBox: {
        maxWidth: 600,
        margin: '0 auto',
        padding: 'var(--Fresnica-spacing-xl)',
        background: 'var(--Fresnica-code-bg)',
        border: '1px solid var(--Fresnica-code-border)',
        borderRadius: 'var(--Fresnica-border-radius-base)',
        fontFamily: 'var(--Fresnica-font-family-mono)',
        fontSize: 'var(--Fresnica-font-size-supporting)',
        fontWeight: 600,
        color: 'var(--Fresnica-code-text)',
        textAlign: 'left' as const,
        lineHeight: 1.8,
        whiteSpace: 'pre' as const,
        overflow: 'auto' as const,
        tabSize: 4,
    } as React.CSSProperties,

    // Footer
    footer: {
        padding: '32px 40px',
        textAlign: 'center' as const,
        fontSize: 'var(--Fresnica-font-size-sm)',
        color: 'var(--Fresnica-text-color-secondary)',
        marginTop: 32,
    } as React.CSSProperties,
    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--Fresnica-spacing-lg)',
        marginBottom: 'var(--Fresnica-spacing-md)',
    } as React.CSSProperties,
    footerLink: {
        fontSize: 'var(--Fresnica-font-size-supporting)',
        color: 'var(--Fresnica-text-color-secondary)',
        cursor: 'pointer',
    } as React.CSSProperties,
};

// ============================================
// Data
// ============================================
const features = [
    {
        glyph: <span aria-hidden="true">F</span>,
        title: 'Fresnica 风格',
        desc: '简洁几何、清晰层级与高对比操作，面向钱包产品的可靠 UI 质感',
    },
    {
        glyph: <Blocks size={22} aria-hidden="true" />,
        title: '30+ 个组件',
        desc: 'Button / Input / Switch / Modal / Form / Table / 字体 / Icon / Tooltip / Typewriter / Card / Collapse / Checkbox / Select / DatePicker / TimePicker / Tabs / CodeBlock / Loading / Radio / Tag / Notification / Progress',
    },
    {
        glyph: <Palette size={22} aria-hidden="true" />,
        title: '主题定制',
        desc: '40+ CSS 自定义属性，运行时换肤无需重新构建',
    },
    {
        glyph: <PackageCheck size={22} aria-hidden="true" />,
        title: '开箱即用',
        desc: 'ESM + CJS 双格式输出，TypeScript 类型声明完整',
    },
];

const components = [
    {
        key: 'fresnica-home',
        name: 'Fresnica Home',
        desc: '钱包首页组合示例：余额、资产、Swap 与底部导航',
    },
    {
        key: 'fresnica-swap',
        name: 'Fresnica Swap',
        desc: '完整兑换流程：资产选择、路由比较、手续费和确认状态',
    },
    {
        key: 'fresnica-transfer',
        name: 'Fresnica Transfer',
        desc: '发送与接收资产：地址、金额、费用和复制地址',
    },
    {
        key: 'fresnica-activity',
        name: 'Fresnica Activity',
        desc: '交易记录、筛选、状态和详情面板',
    },
    {
        key: 'fresnica-settings',
        name: 'Fresnica Settings',
        desc: '网络、主题、动效偏好和钱包连接',
    },
    {
        key: 'fresnica-transaction-details',
        name: 'Fresnica Transaction Details',
        desc: '资产摘要、链上字段、状态与浏览器入口',
    },
    { key: 'fresnica-asset-details', name: 'Fresnica Asset Details', desc: '资产余额、估值与 Send / Swap 操作' },
    {
        key: 'fresnica-network-nodes',
        name: 'Fresnica Network & Nodes',
        desc: '网络切换、节点选择与自定义 Horizon 端点',
    },
    { key: 'fresnica-explore-dapps', name: 'Fresnica Explore dApps', desc: 'Stellar dApp 推荐、分类筛选和信息入口' },
    { key: 'fresnica-scan', name: 'Fresnica Scan', desc: 'Stellar 地址与 dApp QR 扫描入口' },
    {
        key: 'button',
        name: 'Button',
        desc: '5 种类型、3 种尺寸、加载/危险/幽灵模式',
    },
    { key: 'input', name: 'Input', desc: '前后缀、一键清空、校验状态' },
    {
        key: 'form',
        name: 'Form',
        desc: '校验规则 / useForm 命令式 / 三种布局',
    },
    {
        key: 'switch',
        name: 'Switch',
        desc: '受控/非受控、自定义文案、加载状态',
    },
    { key: 'checkbox', name: 'Checkbox', desc: '多选框组件，支持水平/垂直排列' },
    {
        key: 'select',
        name: 'Select',
        desc: '下拉选择器，支持搜索和禁用',
    },
    { key: 'date-picker', name: 'DatePicker', desc: '日期选择与范围选择，年/月/日面板、禁用日期、键盘导航' },
    { key: 'time-picker', name: 'TimePicker', desc: '时间选择，时/分/秒滚选、此刻/确定、步进' },
    { key: 'tabs', name: 'Tabs', desc: '标签页组件，支持受控/非受控模式' },
    {
        key: 'pagination',
        name: 'Pagination',
        desc: '分页组件，每页条数切换、快速跳转',
    },
    { key: 'modal', name: 'Modal', desc: '标准矩形弹窗、ESC 关闭与遮罩控制' },
    { key: 'drawer', name: 'Drawer', desc: '多方向抽屉，支持遮罩和背景层级' },
    {
        key: 'notification',
        name: 'Notification',
        desc: '命令式通知，4 种 type × 6 个 position',
    },
    {
        key: 'progress',
        name: 'Progress',
        desc: '状态填充进度条，5 种 status × 3 档 size',
    },
    {
        key: 'typewriter',
        name: 'Typewriter',
        desc: '逐字打字机效果，支持多行与富内容',
    },
    { key: 'card', name: 'Card', desc: '中性/虚线层级与语义状态卡片' },
    { key: 'collapse', name: 'Collapse', desc: 'FAQ 折叠面板、平滑展开动画' },
    { key: 'codeblock', name: 'CodeBlock', desc: '代码语法高亮组件' },
    { key: 'image', name: 'Image', desc: '中性媒体容器，支持懒加载 / 点击预览' },
    { key: 'carousel', name: 'Carousel', desc: '自动播放、箭头/圆点与键盘导航' },
    {
        key: 'skill',
        name: 'AI Skill',
        desc: 'fresnica-ui-style 技能介绍，教 AI 搭建同风格页面',
    },
];

// ============================================
// HomePage
// ============================================
interface HomePageProps {
    onNavigate?: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    const isMobile = useIsMobile();
    const [showScrollHint, setShowScrollHint] = useState(true);
    const pageRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (pageRef.current) {
            if (pageRef.current.scrollTop > 70) {
                setShowScrollHint(false);
            } else {
                setShowScrollHint(true);
            }
        }
    };

    return (
        <div ref={pageRef} style={{ ...S.page, overflow: 'auto' }} onScroll={handleScroll}>
            {/* Hero */}
            <div style={{ ...S.hero }}>
                <div style={isMobile ? S.heroContentMobile : S.heroContent}>
                    {isMobile && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={new URL('./img/fresnica/fresnica-logo.png', import.meta.url).href}
                                style={{
                                    width: 'min(86vw, 300px)',
                                    height: 'auto',
                                    padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-lg)',
                                    borderRadius: 'var(--Fresnica-border-radius-lg)',
                                    background: 'var(--Fresnica-inverse-color)',
                                }}
                                alt="Fresnica"
                                decoding="async"
                            />
                        </div>
                    )}
                    <div style={isMobile ? { textAlign: 'center' as const } : S.heroText}>
                        <h1 style={{ ...S.heroTitle, fontSize: isMobile ? 37 : 60 }}>
                            {isMobile ? (
                                'Fresnica UI'
                            ) : (
                                <>
                                    Fresnica <br /> UI
                                </>
                            )}
                            <span style={S.heroVersion}>v1.7.0</span>
                        </h1>
                        <Typewriter speed={60}>
                            <p style={{ ...S.heroSubtitle, fontSize: isMobile ? 14 : 17 }}>
                                面向数字资产产品的 React 组件库，基于 TypeScript + Vite 构建，兼顾清晰度与品牌质感
                            </p>
                        </Typewriter>
                        <div style={{ ...S.heroActions, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ArrowRight size={18} aria-hidden="true" />}
                                onClick={() => onNavigate?.('/button')}
                            >
                                开始使用
                            </Button>
                        </div>
                    </div>
                    {!isMobile && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={new URL('./img/fresnica/fresnica-logo.png', import.meta.url).href}
                                style={{
                                    width: 320,
                                    height: 'auto',
                                    padding: 'var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xl)',
                                    borderRadius: 'var(--Fresnica-border-radius-lg)',
                                    background: 'var(--Fresnica-inverse-color)',
                                }}
                                alt="Fresnica"
                                decoding="async"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--Fresnica-spacing-xs)',
                    cursor: 'pointer',
                    animation: showScrollHint ? 'bounce 2s ease-in-out infinite' : 'none',
                    opacity: showScrollHint ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: showScrollHint ? 'auto' : 'none',
                }}
            >
                <span
                    style={{
                        color: 'var(--Fresnica-text-color-secondary)',
                        fontSize: 'var(--Fresnica-font-size-sm)',
                    }}
                >
                    向下滑动
                </span>
                <ArrowDown size={16} aria-hidden="true" />
            </div>
            <style>{`
            @keyframes bounce {
                0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
                50% { transform: translateX(-50%) translateY(-8px); opacity: 0.7; }
            }
        `}</style>

            {/* Features */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>特性</div>
                <div style={S.sectionDesc}>为什么选择 Fresnica UI</div>
                <div style={S.features}>
                    {features.map((f) => (
                        <FeatureCard key={f.title} feature={f} />
                    ))}
                </div>
            </div>

            {/* Components */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>组件一览</div>
                <div style={S.sectionDesc}>点击卡片查看详细文档和在线演示</div>
                <div style={S.compGrid}>
                    {components
                        .filter((c) => !c.key.startsWith('fresnica-'))
                        .map((c) => (
                            <Card key={c.key} style={S.compCard} onClick={() => onNavigate?.(`/${c.key}`)}>
                                <div style={S.compName}>{c.name}</div>
                                <div style={S.compDesc}>{c.desc}</div>
                            </Card>
                        ))}
                </div>
            </div>

            {/* Install */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>安装</div>
                <div style={S.sectionDesc}>一行命令即可安装</div>
                <CodeBlock code={`// 使用 npm 安装\nnpm install fresnica-ui`} />
            </div>

            {/* Quick Start */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>快速上手</div>
                <div style={S.sectionDesc}>引入组件即可使用，样式自动加载</div>
                <CodeBlock
                    code={`// 1. 引入组件\nimport { Button, Modal, Switch } from 'fresnica-ui';\nimport 'fresnica-ui/style';\n\nfunction App() {\n    return <Button>开始</Button>;\n}`}
                />
            </div>

            {/* Theme */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>主题定制</div>
                <div style={S.sectionDesc}>通过覆盖 CSS 自定义属性实现运行时换肤，无需重新构建</div>
                <CodeBlock
                    code={`/* 覆盖主题变量 */\n:root {\n    --Fresnica-primary-color: #00A875;\n    --Fresnica-text-color: #1A1C1D;\n    --Fresnica-font-family: Roboto, 'Noto Sans SC', sans-serif;\n    --Fresnica-border-radius-base: 16px;\n    /* ... Fresnica design tokens */\n}`}
                />
            </div>

            {/* Footer */}
            <div style={{ ...S.footer, padding: isMobile ? '24px 16px' : '32px 40px' }}>
                <div style={S.footerLinks}>
                    <span style={S.footerLink} onClick={() => onNavigate?.('/button')}>
                        组件文档
                    </span>
                    <a href="./examples.html#/fresnica-home" style={{ ...S.footerLink, textDecoration: 'none' }}>
                        Fresnica 钱包示例
                    </a>
                    <span
                        style={S.footerLink}
                        onClick={() => window.open('https://github.com/Pixman022/fresnica-ui', '_blank')}
                    >
                        GitHub
                    </span>
                </div>
                <div>CC BY-NC 4.0 · React + TypeScript + Vite</div>
            </div>
        </div>
    );
};

export default HomePage;
