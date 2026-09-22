import React, { useState, useId, useRef, useCallback } from 'react';
import styles from './tabs.module.less';

export interface TabItem {
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    disabled?: boolean;
}

export type TabsVariant = 'card' | 'segmented' | 'underline';
export type TabsSize = 'compact' | 'default';

export interface TabsProps {
    items: TabItem[];
    defaultActiveKey?: string;
    activeKey?: string;
    onChange?: (key: string) => void;
    className?: string;
    style?: React.CSSProperties;
    variant?: TabsVariant;
    size?: TabsSize;
    /** 无可见标题时给 tablist 一个无障碍标签 */
    'aria-label'?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    items,
    defaultActiveKey,
    activeKey,
    onChange,
    className,
    style,
    variant = 'card',
    size = 'default',
    'aria-label': ariaLabel,
}) => {
    const [internalActiveKey, setInternalActiveKey] = useState(
        defaultActiveKey || items.find((item) => !item.disabled)?.key
    );

    const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;

    // tablist 内每个 tab 的稳定 id 前缀，用于 aria-controls / aria-labelledby 双向关联
    const idPrefix = `Fresnica-tabs-${useId().replace(/:/g, '')}`;
    const tabId = (k: string) => `${idPrefix}-tab-${k}`;
    const panelId = (k: string) => `${idPrefix}-panel-${k}`;

    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const handleTabClick = useCallback(
        (key: string) => {
            if (items.find((item) => item.key === key)?.disabled) return;
            if (activeKey === undefined) {
                setInternalActiveKey(key);
            }
            onChange?.(key);
        },
        [activeKey, items, onChange]
    );

    const focusTab = (key: string) => {
        tabRefs.current.get(key)?.focus();
    };

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const { key } = e;
            if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') {
                return;
            }
            e.preventDefault();
            const enabledItems = items.filter((item) => !item.disabled);
            if (enabledItems.length === 0) return;
            const idx = enabledItems.findIndex((i) => i.key === currentActiveKey);
            if (idx < 0) return;
            let nextIdx = idx;
            if (key === 'ArrowRight') nextIdx = (idx + 1) % enabledItems.length;
            else if (key === 'ArrowLeft') nextIdx = (idx - 1 + enabledItems.length) % enabledItems.length;
            else if (key === 'Home') nextIdx = 0;
            else if (key === 'End') nextIdx = enabledItems.length - 1;
            const nextKey = enabledItems[nextIdx].key;
            handleTabClick(nextKey);
            focusTab(nextKey);
        },
        [items, currentActiveKey, handleTabClick]
    );

    const activeItem = items.find((item) => item.key === currentActiveKey);

    const cls = [styles.tabs, styles[`variant-${variant}`], styles[`size-${size}`], className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cls} style={style}>
            <div
                className={styles.tabList}
                role="tablist"
                aria-label={ariaLabel}
                aria-orientation="horizontal"
                onKeyDown={handleKeyDown}
            >
                {items.map((item) => {
                    const isActive = item.key === currentActiveKey;
                    return (
                        <button
                            key={item.key}
                            ref={(el) => {
                                if (el) tabRefs.current.set(item.key, el);
                                else tabRefs.current.delete(item.key);
                            }}
                            id={tabId(item.key)}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={panelId(item.key)}
                            aria-disabled={item.disabled || undefined}
                            tabIndex={isActive ? 0 : -1}
                            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
                            disabled={item.disabled}
                            onClick={() => handleTabClick(item.key)}
                        >
                            {item.icon && (
                                <span className={styles.tabIcon} aria-hidden="true">
                                    {item.icon}
                                </span>
                            )}
                            <span className={styles.tabLabel}>{item.label}</span>
                            {item.badge !== undefined && <span className={styles.tabBadge}>{item.badge}</span>}
                        </button>
                    );
                })}
            </div>
            <div
                className={styles.tabContent}
                role="tabpanel"
                id={activeItem ? panelId(activeItem.key) : undefined}
                aria-labelledby={activeItem ? tabId(activeItem.key) : undefined}
                tabIndex={0}
            >
                <div className={styles.tabContentInner}>{activeItem?.children}</div>
            </div>
        </div>
    );
};

Tabs.displayName = 'Tabs';
