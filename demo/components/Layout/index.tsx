import React from 'react';
import { Send, WalletCards } from 'lucide-react';
import { Button, Card, Input, Select, Switch } from '../../../src';
import { DemoTag, labelStyle, sectionStyle, sectionTitleStyle, useIsMobile } from '../../tools';

const spacingScale = [
    { name: 'XS', token: '--Fresnica-spacing-xs', value: '4px', usage: '图标内部、紧凑元素间隔' },
    { name: 'SM', token: '--Fresnica-spacing-sm', value: '8px', usage: '同组控件与文字间隔' },
    { name: 'MD', token: '--Fresnica-spacing-md', value: '12px', usage: '控件内边距与列表间隔' },
    { name: 'LG', token: '--Fresnica-spacing-lg', value: '16px', usage: '卡片内边距与内容分组' },
    { name: 'XL', token: '--Fresnica-spacing-xl', value: '24px', usage: '页面区块与主要分组' },
];

const radiusScale = [
    { name: 'Small', token: '--Fresnica-border-radius-sm', value: '8px', usage: '小标签、图标底板' },
    { name: 'Control', token: '--Fresnica-border-radius-control', value: '12px', usage: '按钮、输入框、选择器' },
    { name: 'Base', token: '--Fresnica-border-radius-base', value: '16px', usage: '标准卡片与菜单' },
    { name: 'Large', token: '--Fresnica-border-radius-lg', value: '24px', usage: '重点卡片与移动端容器' },
    { name: 'Pill', token: '--Fresnica-border-radius-pill', value: '9999px', usage: '胶囊标签与圆形控件' },
];

const heightScale = [
    { name: 'Small', token: '--Fresnica-height-sm', value: '32px', usage: '紧凑按钮与小型开关' },
    { name: 'Compact', token: '--Fresnica-height-compact', value: '36px', usage: '工具栏和次级操作' },
    { name: 'Base', token: '--Fresnica-height-base', value: '48px', usage: '默认表单控件与按钮' },
    { name: 'Emphasis', token: '--Fresnica-height-emphasis', value: '52px', usage: '移动端顶部栏与重点操作' },
    { name: 'Large', token: '--Fresnica-height-lg', value: '56px', usage: '底部主操作和大尺寸控件' },
];

type ViewportPreset = 'auto' | 320 | 360 | 393 | 430 | 768;

const viewportPresets: Array<{ value: ViewportPreset; label: string; context: string; reference: string }> = [
    { value: 320, label: '320', context: '小屏移动端', reference: 'iPhone 5 / 5s / SE 第一代、部分小屏 Android' },
    { value: 360, label: '360', context: '常见移动端', reference: '大量 Android 手机的常见 CSS 视口' },
    { value: 393, label: '393', context: '大屏移动端', reference: 'iPhone 14 Pro、15 / 15 Pro、16 等' },
    { value: 430, label: '430', context: '超大屏移动端', reference: 'Plus / Pro Max 类设备，部分设备约 428px' },
    { value: 768, label: '768', context: '平板竖屏', reference: 'iPad 竖屏、部分 Android 平板' },
    { value: 'auto', label: '桌面自适应', context: '当前浏览器窗口', reference: '无固定设备参考' },
];

const viewportOptions = viewportPresets.map(({ value, label, context }) => ({
    key: String(value),
    label: value === 'auto' ? `${label} · ${context}` : `${label}px · ${context}`,
}));

interface ScaleRowProps {
    name: string;
    token: string;
    value: string;
    usage: string;
    preview: React.ReactNode;
    compact: boolean;
}

const ScaleRow: React.FC<ScaleRowProps> = ({ name, token, value, usage, preview, compact }) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: compact
                ? '72px minmax(0, 1fr)'
                : 'minmax(0, 0.5fr) minmax(0, 1.2fr) minmax(48px, 0.4fr) minmax(0, 1fr)',
            alignItems: 'center',
            gap: 'var(--Fresnica-spacing-md)',
            padding: 'var(--Fresnica-spacing-md)',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
            border: '1px solid var(--Fresnica-border-color)',
            borderRadius: 'var(--Fresnica-border-radius-control)',
            background: 'var(--Fresnica-surface)',
        }}
    >
        <strong style={{ minWidth: 0, color: 'var(--Fresnica-text-color)', overflowWrap: 'anywhere' }}>{name}</strong>
        <code
            style={{
                minWidth: 0,
                color: 'var(--Fresnica-primary-color)',
                fontSize: 'var(--Fresnica-font-size-sm)',
                overflowWrap: 'anywhere',
            }}
        >
            {token}
        </code>
        <span style={{ minWidth: 0, color: 'var(--Fresnica-text-color-secondary)', overflowWrap: 'anywhere' }}>
            {value}
        </span>
        <span
            style={{
                minWidth: 0,
                color: 'var(--Fresnica-text-color-secondary)',
                fontSize: 'var(--Fresnica-font-size-sm)',
                overflowWrap: 'anywhere',
            }}
        >
            {usage}
        </span>
        <div style={{ gridColumn: '1 / -1', minWidth: 0, maxWidth: '100%' }}>{preview}</div>
    </div>
);

const LayoutDemo: React.FC = () => {
    const browserMobile = useIsMobile(720);
    const [viewport, setViewport] = React.useState<ViewportPreset>('auto');
    const [showMetrics, setShowMetrics] = React.useState(false);
    const stageRef = React.useRef<HTMLDivElement>(null);
    const [stageWidth, setStageWidth] = React.useState(0);

    React.useEffect(() => {
        const stage = stageRef.current;
        if (!stage || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(([entry]) => setStageWidth(Math.round(entry.contentRect.width)));
        observer.observe(stage);
        return () => observer.disconnect();
    }, [viewport]);

    const effectiveWidth = viewport === 'auto' ? stageWidth || (browserMobile ? 360 : 1024) : viewport;
    const compact = effectiveWidth < 768;
    const stacked = effectiveWidth < 560;
    const narrow = effectiveWidth <= 360;
    const previewWidth = viewport === 'auto' ? '100%' : `min(100%, ${viewport}px)`;
    const viewportContext = viewportPresets.find((preset) => preset.value === viewport);
    const viewportSummary = viewportContext
        ? viewport === 'auto'
            ? viewportContext.context
            : `${viewportContext.label}px · ${viewportContext.context}`
        : '';
    const viewportReference = viewportContext?.reference ?? '';
    const handleViewportChange = (key: string) => {
        const selected = viewportPresets.find((preset) => String(preset.value) === key);
        if (selected) setViewport(selected.value);
    };

    return (
        <div style={{ ...sectionStyle, maxWidth: 1200, overflowX: 'hidden' }}>
            <div style={{ ...sectionTitleStyle, minWidth: 0, flexWrap: 'wrap' }}>
                布局规范 <DemoTag>spacing · radius · height</DemoTag>
            </div>
            <p
                style={{
                    margin: '0 0 var(--Fresnica-spacing-lg)',
                    color: 'var(--Fresnica-text-color-secondary)',
                    lineHeight: 1.7,
                }}
            >
                页面只使用以下现有 Token。优先通过内容层级选择规格，不为单个页面临时增加新的间距、圆角或控件高度。
            </p>

            <div
                style={{
                    display: 'grid',
                    gap: 'var(--Fresnica-spacing-sm)',
                    marginBottom: 'var(--Fresnica-spacing-md)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--Fresnica-spacing-md)',
                        flexWrap: 'wrap',
                    }}
                >
                    <strong style={{ color: 'var(--Fresnica-text-color)' }}>屏幕宽度预览</strong>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 'var(--Fresnica-spacing-md)',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Select
                            options={viewportOptions}
                            value={String(viewport)}
                            onChange={handleViewportChange}
                            placement="bottom"
                            aria-label="选择组件组合预览宽度"
                        />
                        <label
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-sm)',
                                color: 'var(--Fresnica-text-color-secondary)',
                                fontSize: 'var(--Fresnica-font-size-sm)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span>显示尺寸标注</span>
                            <Switch
                                size="small"
                                checked={showMetrics}
                                onChange={setShowMetrics}
                                aria-label="显示尺寸标注"
                            />
                        </label>
                    </div>
                </div>
                <span
                    style={{ color: 'var(--Fresnica-text-color-secondary)', fontSize: 'var(--Fresnica-font-size-sm)' }}
                >
                    当前档位：{viewportSummary}。
                </span>
                <span style={{ color: 'var(--Fresnica-text-color-muted)', fontSize: 'var(--Fresnica-font-size-sm)' }}>
                    设备参考：{viewportReference}。
                </span>
                {showMetrics && (
                    <div
                        role="status"
                        aria-label="当前预览尺寸标注"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: 'var(--Fresnica-spacing-sm)',
                            padding: 'var(--Fresnica-spacing-md)',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-control)',
                            background: 'var(--Fresnica-surface-low)',
                        }}
                    >
                        <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                            <strong style={{ color: 'var(--Fresnica-text-color)' }}>字号</strong>
                            <span
                                style={{
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-sm)',
                                }}
                            >
                                正文 14/20px · 辅助 13px · 按钮 15/20px
                            </span>
                        </div>
                        <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                            <strong style={{ color: 'var(--Fresnica-text-color)' }}>图标</strong>
                            <span
                                style={{
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-sm)',
                                }}
                            >
                                普通 18–20px · 主要操作 22–24px
                            </span>
                        </div>
                        <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                            <strong style={{ color: 'var(--Fresnica-text-color)' }}>触控区域</strong>
                            <span
                                style={{
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-sm)',
                                }}
                            >
                                最小 44px · 表单/主要按钮 48px
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div
                ref={stageRef}
                style={{
                    width: previewWidth,
                    maxWidth: '100%',
                    minWidth: 0,
                    marginInline: 'auto',
                    padding: narrow ? 'var(--Fresnica-spacing-md)' : 'var(--Fresnica-spacing-lg)',
                    boxSizing: 'border-box',
                    border: '1px dashed var(--Fresnica-border-color)',
                    borderRadius: 'var(--Fresnica-border-radius-lg)',
                    background: 'var(--Fresnica-bg-color)',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gap: 'var(--Fresnica-spacing-xl)',
                        width: '100%',
                        minWidth: 0,
                        boxSizing: 'border-box',
                        padding: 'var(--Fresnica-spacing-xl)',
                        border: '1px solid var(--Fresnica-border-color)',
                        borderRadius: 'var(--Fresnica-border-radius-lg)',
                        background: 'var(--Fresnica-surface-low)',
                    }}
                >
                    <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                        <strong style={{ color: 'var(--Fresnica-text-color)' }}>发送 Stellar 资产</strong>
                        <span
                            style={{
                                color: 'var(--Fresnica-text-color-secondary)',
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                            }}
                        >
                            页面区块使用 XL（24px）间距，形成清晰的一级内容分组。
                        </span>
                    </div>

                    <Card
                        style={{
                            display: 'grid',
                            gap: 'var(--Fresnica-spacing-lg)',
                            width: '100%',
                            minWidth: 0,
                            boxSizing: 'border-box',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--Fresnica-spacing-md)',
                                minWidth: 0,
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 'var(--Fresnica-height-base)',
                                    height: 'var(--Fresnica-height-base)',
                                    flexShrink: 0,
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: 'var(--Fresnica-primary-color-bg)',
                                    color: 'var(--Fresnica-primary-color)',
                                }}
                            >
                                <WalletCards size={20} />
                            </span>
                            <span style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                                <strong style={{ color: 'var(--Fresnica-text-color)' }}>Main wallet</strong>
                                <span
                                    style={{
                                        color: 'var(--Fresnica-text-color-secondary)',
                                        fontSize: 'var(--Fresnica-font-size-supporting)',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    卡片内边距与内容组使用 LG（16px）
                                </span>
                            </span>
                        </div>

                        <label style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                            <span
                                style={{
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-supporting)',
                                }}
                            >
                                Stellar 地址
                            </span>
                            <Input placeholder="输入或粘贴地址" aria-label="Stellar 地址布局示例" />
                        </label>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
                                gap: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            <Button block>取消</Button>
                            <Button type="primary" block icon={<Send size={18} />}>
                                继续
                            </Button>
                        </div>
                    </Card>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: stacked ? '1fr' : 'minmax(0, 1.35fr) minmax(0, 1fr)',
                            gap: 'var(--Fresnica-spacing-lg)',
                            minWidth: 0,
                        }}
                    >
                        <Card
                            style={{
                                display: 'grid',
                                gap: 'var(--Fresnica-spacing-md)',
                                minWidth: 0,
                                boxSizing: 'border-box',
                            }}
                        >
                            <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                                <strong style={{ color: 'var(--Fresnica-text-color)' }}>响应式表单组合</strong>
                                <span
                                    style={{
                                        color: 'var(--Fresnica-text-color-secondary)',
                                        fontSize: 'var(--Fresnica-font-size-sm)',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    长说明文字在窄屏自动换行，字段与操作区根据可用宽度重排。
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: stacked ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                                    gap: 'var(--Fresnica-spacing-md)',
                                    minWidth: 0,
                                }}
                            >
                                <label style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                                    <span
                                        style={{
                                            color: 'var(--Fresnica-text-color-secondary)',
                                            fontSize: 'var(--Fresnica-font-size-sm)',
                                        }}
                                    >
                                        名称
                                    </span>
                                    <Input aria-label="名称" placeholder="输入项目名称" />
                                </label>
                                <label style={{ display: 'grid', gap: 'var(--Fresnica-spacing-xs)', minWidth: 0 }}>
                                    <span
                                        style={{
                                            color: 'var(--Fresnica-text-color-secondary)',
                                            fontSize: 'var(--Fresnica-font-size-sm)',
                                        }}
                                    >
                                        状态
                                    </span>
                                    <Input aria-label="状态" placeholder="例如：进行中" />
                                </label>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--Fresnica-spacing-sm)' }}>
                                <Button block={narrow}>取消</Button>
                                <Button type="primary" block={narrow}>
                                    保存设置
                                </Button>
                            </div>
                        </Card>

                        <Card
                            style={{
                                display: 'grid',
                                gap: 'var(--Fresnica-spacing-md)',
                                minWidth: 0,
                                boxSizing: 'border-box',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 'var(--Fresnica-spacing-sm)',
                                    minWidth: 0,
                                }}
                            >
                                <strong style={{ color: 'var(--Fresnica-text-color)' }}>信息列表</strong>
                                <span
                                    style={{
                                        color: 'var(--Fresnica-text-color-muted)',
                                        fontSize: 'var(--Fresnica-font-size-sm)',
                                    }}
                                >
                                    3 项
                                </span>
                            </div>
                            {['设计 Token', '组件状态', '可访问性'].map((item, index) => (
                                <div
                                    key={item}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 'var(--Fresnica-spacing-md)',
                                        minWidth: 0,
                                        paddingBottom: index < 2 ? 'var(--Fresnica-spacing-sm)' : 0,
                                        borderBottom: index < 2 ? '1px solid var(--Fresnica-border-color)' : 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            minWidth: 0,
                                            color: 'var(--Fresnica-text-color)',
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {item}
                                    </span>
                                    <span
                                        style={{
                                            flexShrink: 0,
                                            color: 'var(--Fresnica-success-color)',
                                            fontSize: 'var(--Fresnica-font-size-sm)',
                                        }}
                                    >
                                        已完成
                                    </span>
                                </div>
                            ))}
                        </Card>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: compact ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                            gap: 'var(--Fresnica-spacing-sm)',
                        }}
                    >
                        {[
                            ['间距', 'XL 页面 / LG 卡片 / MD 控件'],
                            ['圆角', 'LG 容器 / Control 控件'],
                            ['高度', 'Base 48px 默认触控尺寸'],
                        ].map(([title, description]) => (
                            <div
                                key={title}
                                style={{
                                    display: 'grid',
                                    gap: 'var(--Fresnica-spacing-xs)',
                                    minWidth: 0,
                                    padding: 'var(--Fresnica-spacing-md)',
                                    border: '1px solid var(--Fresnica-border-color)',
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: 'var(--Fresnica-surface)',
                                }}
                            >
                                <strong style={{ color: 'var(--Fresnica-text-color)' }}>{title}</strong>
                                <span
                                    style={{
                                        minWidth: 0,
                                        color: 'var(--Fresnica-text-color-secondary)',
                                        fontSize: 'var(--Fresnica-font-size-sm)',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    {description}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={labelStyle}>间距</div>
            <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                {spacingScale.map((item) => (
                    <ScaleRow
                        key={item.token}
                        {...item}
                        compact={compact}
                        preview={
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'block',
                                    width: `var(${item.token})`,
                                    height: 'var(--Fresnica-spacing-sm)',
                                    borderRadius: 'var(--Fresnica-border-radius-pill)',
                                    background: 'var(--Fresnica-primary-color)',
                                }}
                            />
                        }
                    />
                ))}
            </div>

            <div style={labelStyle}>圆角</div>
            <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                {radiusScale.map((item) => (
                    <ScaleRow
                        key={item.token}
                        {...item}
                        compact={compact}
                        preview={
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'block',
                                    width: 96,
                                    height: 48,
                                    border: '1px solid var(--Fresnica-border-color)',
                                    borderRadius: `var(${item.token})`,
                                    background: 'var(--Fresnica-surface-low)',
                                }}
                            />
                        }
                    />
                ))}
            </div>

            <div style={labelStyle}>控件高度</div>
            <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-sm)' }}>
                {heightScale.map((item) => (
                    <ScaleRow
                        key={item.token}
                        {...item}
                        compact={compact}
                        preview={
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 160,
                                    height: `var(${item.token})`,
                                    border: '1px solid var(--Fresnica-border-color)',
                                    borderRadius: 'var(--Fresnica-border-radius-control)',
                                    background: 'var(--Fresnica-surface-low)',
                                    color: 'var(--Fresnica-text-color-secondary)',
                                }}
                            >
                                {item.value}
                            </span>
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default LayoutDemo;
