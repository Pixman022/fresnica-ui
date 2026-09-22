import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { ArrowLeft, Menu, Moon, Sun } from 'lucide-react';
import { useFresnicaTheme } from '../src';
import '../src/styles/index.less';
import './fonts.css';
import HomePage from './HomePage';
import { PAGE_INFO } from './pageInfo';
import { useIsMobile } from './tools';
import ThemeCustomizer from './components/ThemeCustomizer';

// Lazy-load ComponentPage so homepage does not pull in every demo on initial load
const ComponentPage = lazy(() => import('./ComponentPage'));

// ============================================
// Simple hash router
// ============================================
const useHash = () => {
    const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/');

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash.slice(1) || '/');
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    return { hash, navigate };
};

interface MenuItemChild {
    key: string;
    label: string;
}

interface MenuItem {
    key: string;
    label: string;
    children?: MenuItemChild[];
}

// ============================================
// Menu config — 5 categories by function:
//   基础      → 无状态/纯展示 (字体, Button, Tag, CodeBlock)
//   表单      → 数据录入/校验 (Input, Switch, Select, Checkbox, Radio, Form)
//   反馈      → 浮层/状态/异步反馈 (Notification, Modal, Drawer, Tooltip, Loading, Progress)
//   数据展示  → 容器/列表/排版 (Card, Collapse, Tabs, Table, Typewriter)
//   Fresnica 业务页面通过“指南”分类展示；不再暴露旧主题装饰组件
// ============================================
const MENU_ITEMS: MenuItem[] = [
    {
        key: 'cat-guide',
        label: '── 指南 ──',
        children: [
            { key: 'fresnica-home', label: 'Fresnica 钱包首页' },
            { key: 'fresnica-swap', label: 'Fresnica Swap 兑换' },
            { key: 'fresnica-transfer', label: 'Fresnica Transfer 转账' },
            { key: 'fresnica-activity', label: 'Fresnica Activity 记录' },
            { key: 'fresnica-settings', label: 'Fresnica Settings 设置' },
            { key: 'fresnica-transaction-details', label: 'Fresnica Transaction Details 详情' },
            { key: 'fresnica-asset-details', label: 'Fresnica Asset Details 资产' },
            { key: 'fresnica-network-nodes', label: 'Fresnica Network & Nodes 节点' },
            { key: 'fresnica-explore-dapps', label: 'Fresnica Explore dApps 探索' },
            { key: 'fresnica-scan', label: 'Fresnica Scan 扫描' },
            { key: 'skill', label: 'Skill 介绍' },
        ],
    },
    {
        key: 'cat-basic',
        label: '── 基础 ──',
        children: [
            { key: 'title', label: 'Title 字体' },
            { key: 'icon', label: 'Icon 图标' },
            { key: 'color', label: 'Color 配色' },
            { key: 'layout', label: 'Layout 布局规范' },
            { key: 'button', label: 'Button 按钮' },
            { key: 'tag', label: 'Tag 标签' },
            { key: 'codeblock', label: 'CodeBlock 代码高亮' },
        ],
    },
    {
        key: 'cat-form',
        label: '── 表单 ──',
        children: [
            { key: 'input', label: 'Input 输入框' },
            { key: 'switch', label: 'Switch 开关' },
            { key: 'select', label: 'Select 选择器' },
            { key: 'date-picker', label: 'DatePicker 日期选择' },
            { key: 'time-picker', label: 'TimePicker 时间选择' },
            { key: 'checkbox', label: 'Checkbox 多选框' },
            { key: 'radio', label: 'Radio 单选框' },
            { key: 'form', label: 'Form 表单' },
        ],
    },
    {
        key: 'cat-feedback',
        label: '── 反馈 ──',
        children: [
            { key: 'notification', label: 'Notification 通知' },
            { key: 'modal', label: 'Modal 弹窗' },
            { key: 'drawer', label: 'Drawer 抽屉' },
            { key: 'progress', label: 'Progress 进度条' },
            { key: 'skeleton', label: 'Skeleton 骨架屏' },
            { key: 'empty-state', label: 'EmptyState 空状态' },
            { key: 'error-state', label: 'ErrorState 错误状态' },
            { key: 'backtop', label: 'BackTop 返回顶部' },
        ],
    },
    {
        key: 'cat-data-display',
        label: '── 数据展示 ──',
        children: [
            { key: 'card', label: 'Card 卡片' },
            { key: 'collapse', label: 'Collapse 折叠面板' },
            { key: 'tabs', label: 'Tabs 标签页' },
            { key: 'table', label: 'Table 表格' },
            { key: 'pagination', label: 'Pagination 分页' },
            { key: 'typewriter', label: 'Typewriter 打字机' },
            { key: 'image', label: 'Image 图片' },
            { key: 'carousel', label: 'Carousel 轮播图' },
        ],
    },
];

const DESIGN_MENU_ITEMS: MenuItem[] = MENU_ITEMS.map((item) => ({
    ...item,
    children: item.children?.filter((child) => !child.key.startsWith('fresnica-')),
})).filter((item) => !item.children || item.children.length > 0);

// ============================================
// Shared styles
// ============================================
const S = {
    layout: {
        display: 'flex',
        height: '100dvh',
        overflow: 'hidden',
        fontFamily: 'var(--Fresnica-font-family)',
        background:
            'radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--Fresnica-primary-color) 8%, transparent), transparent 34%), var(--Fresnica-bg-color)',
    } as React.CSSProperties,
    sidebar: {
        width: 268,
        minWidth: 268,
        background: 'var(--Fresnica-surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: 'var(--Fresnica-spacing-md) 0 var(--Fresnica-spacing-md) var(--Fresnica-spacing-md)',
        borderRadius: 'var(--Fresnica-border-radius-base)',
        border: '1px solid var(--Fresnica-border-color)',
        boxShadow: 'var(--Fresnica-shadow-base)',
        height: 'calc(100dvh - 24px)',
    } as React.CSSProperties,
    homeBg: {
        background:
            'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--Fresnica-primary-color) 14%, transparent), transparent 45%), var(--Fresnica-bg-color)',
    } as React.CSSProperties,
    sidebarHeader: {
        width: '100%',
        padding: 'var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl) var(--Fresnica-spacing-md)',
        background: 'transparent',
        border: 0,
        fontFamily: 'var(--Fresnica-font-family)',
        borderBottom: '1px solid var(--Fresnica-border-color)',
        fontWeight: 700,
        fontSize: 'var(--Fresnica-font-size-action)',
        color: 'var(--Fresnica-text-color)',
        letterSpacing: -0.3,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        cursor: 'pointer',
    } as React.CSSProperties,
    menuList: {
        flex: 1,
        overflow: 'auto',
        padding: 'var(--Fresnica-spacing-sm) 0',
    } as React.CSSProperties,
    menuItem: (active: boolean, dark: boolean) =>
        ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--Fresnica-spacing-sm)',
            margin: '1px 5px',
            width: 'calc(100% - 10px)',
            minHeight: 44,
            padding:
                'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-md) var(--Fresnica-spacing-sm) var(--Fresnica-spacing-xl)',
            border: 0,
            fontFamily: 'var(--Fresnica-font-family)',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: 'var(--Fresnica-font-size-base)',
            lineHeight: 1.3,
            textAlign: 'left',
            cursor: 'pointer',
            color: active ? 'var(--Fresnica-on-primary-color)' : 'var(--Fresnica-text-color-secondary)',
            background: active ? 'var(--Fresnica-primary-color)' : 'transparent',
            borderRadius: 'var(--Fresnica-border-radius-control)',
            borderRight: 'none',
            transition: 'all var(--Fresnica-motion-duration-fast)',
        }) as React.CSSProperties,
    main: {
        flex: 1,
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'auto',
        overflowX: 'hidden',
        padding: '32px 40px',
    } as React.CSSProperties,
};

// ============================================
// Sidebar content (shared between desktop & mobile drawer)
// ============================================
const SidebarContent: React.FC<{
    activeKey: string;
    onNavigate: (path: string) => void;
    dark: boolean;
    onToggleTheme: () => void;
}> = ({ activeKey, onNavigate, dark, onToggleTheme }) => (
    <>
        <button type="button" style={S.sidebarHeader} onClick={() => onNavigate('/')}>
            <img
                src={new URL('./img/fresnica/fresnica-app-icon.png', import.meta.url).href}
                alt=""
                width={24}
                height={24}
                style={{
                    marginRight: 'var(--Fresnica-spacing-sm)',
                    borderRadius: 'var(--Fresnica-border-radius-sm)',
                    objectFit: 'cover',
                }}
            />
            Fresnica UI
        </button>
        <nav style={S.menuList}>
            {DESIGN_MENU_ITEMS.map((item) => {
                if (item.children) {
                    return (
                        <div key={item.key}>
                            <div
                                style={{
                                    padding:
                                        'var(--Fresnica-spacing-md) var(--Fresnica-spacing-lg) var(--Fresnica-spacing-xs)',
                                    fontSize: 'var(--Fresnica-font-size-caption)',
                                    color: dark
                                        ? 'var(--Fresnica-text-color-secondary)'
                                        : 'var(--Fresnica-text-color-muted)',
                                    fontWeight: 600,
                                    letterSpacing: 0.5,
                                }}
                            >
                                {item.label}
                            </div>
                            {item.children.map((child) => (
                                <button
                                    type="button"
                                    key={child.key}
                                    style={S.menuItem(activeKey === child.key, dark)}
                                    onClick={() => onNavigate(`/${child.key}`)}
                                    onMouseEnter={(e) => {
                                        if (activeKey !== child.key)
                                            e.currentTarget.style.background = 'var(--Fresnica-primary-color-bg)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeKey !== child.key) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span
                                        style={{
                                            minWidth: 0,
                                            color:
                                                activeKey === child.key
                                                    ? 'var(--Fresnica-on-primary-color)'
                                                    : 'var(--Fresnica-text-color-secondary)',
                                        }}
                                    >
                                        {child.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    );
                }
                return (
                    <button
                        type="button"
                        key={item.key}
                        style={S.menuItem(activeKey === item.key, dark)}
                        onClick={() => onNavigate(`/${item.key}`)}
                        onMouseEnter={(e) => {
                            if (activeKey !== item.key)
                                e.currentTarget.style.background = 'var(--Fresnica-primary-color-bg)';
                        }}
                        onMouseLeave={(e) => {
                            if (activeKey !== item.key) e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span
                            style={{
                                minWidth: 0,
                                color:
                                    activeKey === item.key
                                        ? 'var(--Fresnica-on-primary-color)'
                                        : 'var(--Fresnica-text-color-secondary)',
                            }}
                        >
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--Fresnica-spacing-xs)',
                margin: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-md) var(--Fresnica-spacing-md)',
            }}
        >
            <ThemeCustomizer placement="top" />
            <button
                type="button"
                onClick={onToggleTheme}
                aria-label={dark ? '切换浅色模式' : '切换深色模式'}
                title={dark ? '切换浅色模式' : '切换深色模式'}
                style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 44,
                    minWidth: 44,
                    height: 44,
                    minHeight: 44,
                    flex: '0 0 44px',
                    padding: 0,
                    border: '1px solid var(--Fresnica-border-color)',
                    borderRadius: 'var(--Fresnica-border-radius-sm)',
                    background: 'var(--Fresnica-surface-low)',
                    color: 'var(--Fresnica-text-color)',
                    cursor: 'pointer',
                }}
            >
                {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
        </div>
    </>
);

// ============================================
// App
// ============================================
const App: React.FC = () => {
    const { hash, navigate } = useHash();
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loadingActive, setLoadingActive] = useState(false);
    const [loadingMounted, setLoadingMounted] = useState(false);
    const { mode, setMode } = useFresnicaTheme();
    const dark = mode === 'dark';
    const mainRef = React.useRef<HTMLElement>(null);

    const activeKey = hash.startsWith('/') && hash.length > 1 ? hash.slice(1) : 'home';
    const isHomePage = activeKey === 'home';

    useEffect(() => {
        if (activeKey.startsWith('fresnica-')) {
            window.location.href = `./examples.html#/${activeKey}`;
        }
    }, [activeKey]);

    // Close drawer when switching to desktop
    useEffect(() => {
        if (!isMobile) setDrawerOpen(false);
    }, [isMobile]);

    // Close drawer when route changes + scroll main to top
    useEffect(() => {
        setDrawerOpen(false);
        mainRef.current?.scrollTo({ top: 0 });
    }, [activeKey]);

    const handleNavigate = useCallback(
        (path: string) => {
            navigate(path);
            setDrawerOpen(false);
        },
        [navigate]
    );

    // 首页跳转到组件页时显示 2s Loading 覆盖层
    const handleHomeNavigate = useCallback(
        (path: string) => {
            setLoadingMounted(true);
            setLoadingActive(true);
            navigate(path);
            // 2s 后开始关闭，再多留 1.5s 给关闭扩散动画后卸载
            window.setTimeout(() => setLoadingActive(false), 2000);
            window.setTimeout(() => setLoadingMounted(false), 3500);
        },
        [navigate]
    );

    return (
        <>
            <style>{`
                @keyframes fresnica-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            {isHomePage ? (
                /* Home page — full screen, no sidebar */
                <div
                    style={{
                        ...S.layout,
                        ...S.homeBg,
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            position: 'fixed',
                            top: 'var(--Fresnica-spacing-md)',
                            right: 'var(--Fresnica-spacing-md)',
                            zIndex: 60,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--Fresnica-spacing-xs)',
                        }}
                    >
                        <ThemeCustomizer />
                        <button
                            type="button"
                            onClick={() => setMode(dark ? 'light' : 'dark')}
                            aria-label={dark ? '切换浅色模式' : '切换深色模式'}
                            style={{
                                border: 0,
                                background: 'transparent',
                                color: 'var(--Fresnica-text-color)',
                                padding: 'var(--Fresnica-spacing-sm)',
                                cursor: 'pointer',
                            }}
                        >
                            {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                        </button>
                    </div>
                    <HomePage onNavigate={handleHomeNavigate} />
                </div>
            ) : (
                /* Component page — with sidebar */
                <div style={S.layout}>
                    {/* Desktop sidebar */}
                    {!isMobile && (
                        <aside style={S.sidebar}>
                            <SidebarContent
                                activeKey={activeKey}
                                onNavigate={handleNavigate}
                                dark={dark}
                                onToggleTheme={() => setMode(dark ? 'light' : 'dark')}
                            />
                        </aside>
                    )}

                    {/* Mobile top bar */}
                    {isMobile && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 'var(--Fresnica-height-emphasis)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 var(--Fresnica-spacing-md)',
                                background: 'color-mix(in srgb, var(--Fresnica-surface) 92%, transparent)',
                                backdropFilter: 'blur(8px)',
                                borderBottom: '1px solid var(--Fresnica-border-color)',
                                zIndex: 50,
                                fontFamily: S.layout.fontFamily,
                            }}
                        >
                            <div style={{ position: 'absolute', right: 86, display: 'flex', alignItems: 'center' }}>
                                <ThemeCustomizer />
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                aria-label="返回首页"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 'var(--Fresnica-font-size-screen-title)',
                                    color: 'var(--Fresnica-text-color)',
                                    padding: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-sm)',
                                    borderRadius: 'var(--Fresnica-border-radius-sm)',
                                    lineHeight: 1,
                                }}
                            >
                                <ArrowLeft size={18} aria-hidden="true" />
                            </button>
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontSize: 'var(--Fresnica-font-size-action)',
                                    color: 'var(--Fresnica-text-color)',
                                }}
                            >
                                {PAGE_INFO[activeKey]?.title ?? '组件文档'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(true)}
                                aria-label="打开菜单"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 'var(--Fresnica-font-size-screen-title)',
                                    color: 'var(--Fresnica-text-color)',
                                    padding: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-sm)',
                                    borderRadius: 'var(--Fresnica-border-radius-sm)',
                                    lineHeight: 1,
                                }}
                            >
                                <Menu size={20} aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => setMode(dark ? 'light' : 'dark')}
                                aria-label={dark ? '切换浅色模式' : '切换深色模式'}
                                style={{
                                    position: 'absolute',
                                    right: 52,
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--Fresnica-text-color)',
                                    padding: 'var(--Fresnica-spacing-sm)',
                                    lineHeight: 1,
                                }}
                            >
                                {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                            </button>
                        </div>
                    )}

                    {/* Mobile drawer overlay */}
                    {isMobile && drawerOpen && (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'var(--Fresnica-mask-bg)',
                                    zIndex: 98,
                                }}
                                onClick={() => setDrawerOpen(false)}
                            />
                            <aside
                                style={{
                                    ...S.sidebar,
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 240,
                                    minWidth: 240,
                                    zIndex: 99,
                                    boxShadow: 'var(--Fresnica-shadow-base)',
                                }}
                            >
                                <SidebarContent
                                    activeKey={activeKey}
                                    onNavigate={handleNavigate}
                                    dark={dark}
                                    onToggleTheme={() => setMode(dark ? 'light' : 'dark')}
                                />
                            </aside>
                        </>
                    )}

                    <main
                        ref={mainRef}
                        style={{
                            ...S.main,
                            position: 'relative',
                            zIndex: 1,
                            padding: isMobile ? '16px' : '32px 40px',
                            paddingTop: isMobile ? 68 : 32,
                        }}
                    >
                        <Suspense fallback={null}>
                            <ComponentPage activeKey={activeKey} />
                        </Suspense>
                    </main>
                </div>
            )}
            {/* 首页跳转组件页的过场 Loading，全屏覆盖 */}
            {loadingMounted && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        pointerEvents: loadingActive ? 'auto' : 'none',
                    }}
                >
                    <div
                        aria-label="Loading"
                        role="status"
                        style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '100%',
                            height: '100%',
                            background: 'var(--Fresnica-mask-bg)',
                            opacity: loadingActive ? 1 : 0,
                            transition: 'opacity var(--Fresnica-motion-duration-base) ease',
                        }}
                    >
                        <span
                            style={{
                                width: 34,
                                height: 34,
                                border: '3px solid var(--Fresnica-border-color)',
                                borderTopColor: 'var(--Fresnica-primary-color)',
                                borderRadius: '50%',
                                animation: 'fresnica-spin 0.75s linear infinite',
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default App;
