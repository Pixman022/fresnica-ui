import React from 'react';
import './cursor.css';

export interface CursorProps {
    /** 子元素 */
    children?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /**
     * 是否为后代交互元素统一补充语义光标。默认 `true`。
     * - `true`：链接、按钮和 role=button 使用 pointer
     * - `false`：仅应用容器的 default 光标，其余元素使用浏览器自身语义
     */
    forceAll?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ children, className, style, forceAll = true }) => {
    const cls = ['Fresnica-cursor', forceAll ? 'Fresnica-cursor--force' : 'Fresnica-cursor--scoped', className]
        .filter(Boolean)
        .join(' ');
    return (
        <div className={cls} style={style}>
            {children}
        </div>
    );
};

Cursor.displayName = 'Cursor';
