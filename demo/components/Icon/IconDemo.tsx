import React from 'react';
import {
    Activity,
    AlertTriangle,
    ArrowDown,
    ArrowDownLeft,
    ArrowDownUp,
    ArrowLeft,
    ArrowLeftRight,
    ArrowRight,
    ArrowUp,
    ArrowUpRight,
    Blocks,
    BookOpen,
    CalendarDays,
    Camera,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ClipboardPaste,
    Clock3,
    Circle,
    Compass,
    Copy,
    CornerDownLeft,
    ExternalLink,
    Globe2,
    History,
    Home,
    Inbox,
    Info,
    LoaderCircle,
    Map,
    Menu,
    MessageCircle,
    Moon,
    Pause,
    PackageCheck,
    Palette,
    Play,
    Plus,
    QrCode,
    Search,
    Send,
    Settings,
    Settings2,
    ShieldCheck,
    ShoppingBag,
    Star,
    Sun,
    Wallet,
    WalletCards,
    Wrench,
    X,
    type LucideIcon,
} from 'lucide-react';
import { Icon } from '../../../src';
import {
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    CodeBlock,
    labelStyle,
    demoBodyStyle,
} from '../../tools';

const ICON_API: ApiRow[] = [
    { prop: 'name', desc: '内置 Lucide 图标名称', type: 'IconName', defaultVal: 'wallet' },
    { prop: 'size', desc: '图标尺寸', type: 'number | string', defaultVal: '24' },
    { prop: 'strokeWidth', desc: '描边宽度', type: 'number', defaultVal: '2' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const PROJECT_ICONS: Array<{ name: string; use: string; icon: LucideIcon }> = [
    { name: 'Wallet', use: '钱包', icon: Wallet },
    { name: 'WalletCards', use: '账户与资产', icon: WalletCards },
    { name: 'Send', use: '转账', icon: Send },
    { name: 'ArrowUp', use: '发送 / 返回顶部', icon: ArrowUp },
    { name: 'ArrowDown', use: '接收', icon: ArrowDown },
    { name: 'ArrowLeft', use: '返回', icon: ArrowLeft },
    { name: 'ArrowRight', use: '路径方向', icon: ArrowRight },
    { name: 'ArrowUpRight', use: '转出', icon: ArrowUpRight },
    { name: 'ArrowDownLeft', use: '转入', icon: ArrowDownLeft },
    { name: 'ArrowLeftRight', use: '兑换 / 交易', icon: ArrowLeftRight },
    { name: 'ArrowDownUp', use: '切换兑换方向', icon: ArrowDownUp },
    { name: 'ChevronLeft', use: '上一项', icon: ChevronLeft },
    { name: 'ChevronRight', use: '下一项', icon: ChevronRight },
    { name: 'ChevronDown', use: '展开', icon: ChevronDown },
    { name: 'Check', use: '确认 / 完成', icon: Check },
    { name: 'X', use: '关闭 / 清除', icon: X },
    { name: 'Plus', use: '添加', icon: Plus },
    { name: 'Copy', use: '复制地址', icon: Copy },
    { name: 'Search', use: '搜索资产', icon: Search },
    { name: 'CornerDownLeft', use: '提交输入', icon: CornerDownLeft },
    { name: 'CalendarDays', use: '日期', icon: CalendarDays },
    { name: 'Clock3', use: '时间', icon: Clock3 },
    { name: 'Circle', use: '单选状态', icon: Circle },
    { name: 'LoaderCircle', use: '处理中', icon: LoaderCircle },
    { name: 'Info', use: '信息', icon: Info },
    { name: 'AlertTriangle', use: '警告', icon: AlertTriangle },
    { name: 'Inbox', use: '空状态', icon: Inbox },
    { name: 'ExternalLink', use: '区块浏览器', icon: ExternalLink },
    { name: 'QrCode', use: '二维码', icon: QrCode },
    { name: 'Camera', use: '扫码 / 图片占位', icon: Camera },
    { name: 'ClipboardPaste', use: '粘贴地址', icon: ClipboardPaste },
    { name: 'ShieldCheck', use: '安全校验', icon: ShieldCheck },
    { name: 'Home', use: '首页', icon: Home },
    { name: 'History', use: '交易记录', icon: History },
    { name: 'Compass', use: '探索', icon: Compass },
    { name: 'Activity', use: '交易状态', icon: Activity },
    { name: 'Globe2', use: '网络 / dApps', icon: Globe2 },
    { name: 'Settings', use: '设置', icon: Settings },
    { name: 'Settings2', use: '节点配置', icon: Settings2 },
    { name: 'Star', use: '收藏资产', icon: Star },
    { name: 'Menu', use: '移动菜单', icon: Menu },
    { name: 'Sun', use: '浅色主题', icon: Sun },
    { name: 'Moon', use: '深色主题', icon: Moon },
    { name: 'Play', use: '播放', icon: Play },
    { name: 'Pause', use: '暂停', icon: Pause },
    { name: 'MessageCircle', use: '消息', icon: MessageCircle },
    { name: 'BookOpen', use: '文档', icon: BookOpen },
    { name: 'Blocks', use: '组件与模块', icon: Blocks },
    { name: 'Map', use: '路径', icon: Map },
    { name: 'ShoppingBag', use: '资产入口', icon: ShoppingBag },
    { name: 'Palette', use: '主题', icon: Palette },
    { name: 'Wrench', use: '工具', icon: Wrench },
    { name: 'PackageCheck', use: '构建与发布状态', icon: PackageCheck },
];

const IconDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Icon 图标 <DemoTag>Lucide</DemoTag> <DemoTag>{PROJECT_ICONS.length} used icons</DemoTag>
        </div>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>组件库和钱包 Demo 当前使用的 Lucide 图标及其主要用途。</div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(138px, 1fr))',
                    gap: 'var(--Fresnica-spacing-sm)',
                }}
            >
                {PROJECT_ICONS.map(({ name, use, icon: LucideComponent }) => (
                    <div
                        key={name}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '32px minmax(0, 1fr)',
                            alignItems: 'center',
                            gap: 'var(--Fresnica-spacing-sm)',
                            minHeight: 'var(--Fresnica-height-lg)',
                            padding: 'var(--Fresnica-spacing-sm)',
                            border: '1px solid var(--Fresnica-border-color)',
                            borderRadius: 'var(--Fresnica-border-radius-control)',
                            background: 'var(--Fresnica-surface)',
                            color: 'var(--Fresnica-text-color)',
                        }}
                    >
                        <LucideComponent size={24} strokeWidth={2} aria-hidden="true" />
                        <span style={{ minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: 12 }}>{name}</strong>
                            <span
                                style={{
                                    fontSize: 'var(--Fresnica-font-size-caption)',
                                    color: 'var(--Fresnica-text-color-secondary)',
                                }}
                            >
                                {use}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
            <div style={labelStyle}>内置 Icon 组件</div>
            <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-lg)', alignItems: 'center' }}>
                <Icon name="wallet" size={20} />
                <Icon name="send" size={24} />
                <Icon name="camera" size={28} />
                <Icon name="settings" size={32} />
            </div>
        </div>
        <CodeBlock
            code={`import { Send } from 'lucide-react';
import { Icon } from 'fresnica-ui';

<Send size={20} strokeWidth={2} aria-hidden="true" />
<Icon name="wallet" size={24} />`}
        />
        <ApiTable rows={ICON_API} />
    </div>
);

export default IconDemo;
