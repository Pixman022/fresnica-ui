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
    PackageCheck,
    Palette,
    Pause,
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
import styles from './icon.module.less';

const ICONS = {
    activity: Activity,
    'alert-triangle': AlertTriangle,
    'arrow-down': ArrowDown,
    'arrow-down-left': ArrowDownLeft,
    'arrow-down-up': ArrowDownUp,
    'arrow-left': ArrowLeft,
    'arrow-left-right': ArrowLeftRight,
    'arrow-right': ArrowRight,
    'arrow-up': ArrowUp,
    'arrow-up-right': ArrowUpRight,
    blocks: Blocks,
    'book-open': BookOpen,
    'calendar-days': CalendarDays,
    camera: Camera,
    check: Check,
    'chevron-down': ChevronDown,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'clipboard-paste': ClipboardPaste,
    'clock-3': Clock3,
    circle: Circle,
    compass: Compass,
    copy: Copy,
    'corner-down-left': CornerDownLeft,
    'external-link': ExternalLink,
    'globe-2': Globe2,
    history: History,
    home: Home,
    inbox: Inbox,
    info: Info,
    'loader-circle': LoaderCircle,
    map: Map,
    menu: Menu,
    'message-circle': MessageCircle,
    moon: Moon,
    'package-check': PackageCheck,
    palette: Palette,
    pause: Pause,
    play: Play,
    plus: Plus,
    'qr-code': QrCode,
    search: Search,
    send: Send,
    settings: Settings,
    'settings-2': Settings2,
    'shield-check': ShieldCheck,
    'shopping-bag': ShoppingBag,
    star: Star,
    sun: Sun,
    wallet: Wallet,
    'wallet-cards': WalletCards,
    wrench: Wrench,
    x: X,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
    name?: IconName;
    size?: number | string;
    bounce?: boolean;
    strokeWidth?: number;
}

export const ICON_LIST = (Object.keys(ICONS) as IconName[]).map((name) => ({ name, label: name }));

export const Icon: React.FC<IconProps> = ({
    name = 'wallet',
    size = 24,
    className,
    style,
    bounce = false,
    strokeWidth = 2,
    ...rest
}) => {
    const LucideComponent = ICONS[name];
    return (
        <span
            className={[styles.icon, bounce ? styles.bounce : '', className].filter(Boolean).join(' ')}
            style={{ width: size, height: size, ...style }}
            {...rest}
        >
            <LucideComponent width="100%" height="100%" strokeWidth={strokeWidth} aria-hidden="true" />
        </span>
    );
};
