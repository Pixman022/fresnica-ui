import React, { createContext, useContext, useState, useEffect } from 'react';
import { CodeBlock as CodeBlockBase, Tag } from '../../src';

const MobilePreviewContext = createContext(false);

export const MobilePreviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MobilePreviewContext.Provider value>{children}</MobilePreviewContext.Provider>
);

export const useIsMobile = (breakpoint = 768) => {
    const isPreviewMobile = useContext(MobilePreviewContext);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint || isPreviewMobile);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < breakpoint || isPreviewMobile);
        window.addEventListener('resize', handler);
        handler();
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint, isPreviewMobile]);
    return isMobile;
};

export interface ApiRow {
    prop: string;
    desc: string;
    type: string;
    defaultVal?: string;
    required?: boolean;
}

export const sectionStyle: React.CSSProperties = {
    marginBottom: 'clamp(16px, 4vw, var(--Fresnica-spacing-xl))',
    padding: 'clamp(16px, 4vw, var(--Fresnica-spacing-xl))',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    background: 'var(--Fresnica-surface)',
    borderRadius: 'clamp(12px, 3vw, var(--Fresnica-border-radius-base))',
    border: '1px solid var(--Fresnica-border-color)',
    boxShadow: 'var(--Fresnica-shadow-base)',
};

export const sectionTitleStyle: React.CSSProperties = {
    fontSize: 'clamp(18px, 3vw, var(--Fresnica-font-size-screen-title))',
    fontWeight: 700,
    color: 'var(--Fresnica-text-color)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(var(--Fresnica-spacing-xs), 2vw, var(--Fresnica-spacing-sm))',
};

/** Demo 标题旁的语义标签，用 Tag 组件渲染，替代原来手写 tagStyle 的 span */
export const DemoTag: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <Tag size="small" variant="soft" style={style}>
        {children}
    </Tag>
);

export const labelStyle: React.CSSProperties = {
    fontSize: 'var(--Fresnica-font-size-sm)',
    color: 'var(--Fresnica-text-color-secondary)',
    marginTop: 'clamp(var(--Fresnica-spacing-lg), 4vw, var(--Fresnica-spacing-xl))',
    marginBottom: 'clamp(var(--Fresnica-spacing-sm), 2vw, var(--Fresnica-spacing-md))',
    fontWeight: 700,
    letterSpacing: '0.04em',
};

export const textStyle: React.CSSProperties = {
    fontSize: 'var(--Fresnica-font-size-supporting)',
    color: 'var(--Fresnica-text-color-secondary)',
    margin: 0,
};

export const demoBodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

export const demoBoxStyle: React.CSSProperties = {
    marginTop: 'var(--Fresnica-spacing-md)',
    padding: 'clamp(var(--Fresnica-spacing-lg), 4vw, var(--Fresnica-spacing-xl))',
    background: 'color-mix(in srgb, var(--Fresnica-surface) 84%, var(--Fresnica-surface-high))',
    borderRadius: 'clamp(12px, 3vw, var(--Fresnica-border-radius-base))',
    border: '1px solid var(--Fresnica-border-color)',
};

export const demoDashedBoxStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--Fresnica-spacing-lg)',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'clamp(var(--Fresnica-spacing-md), 3vw, var(--Fresnica-spacing-lg))',
    background: 'var(--Fresnica-surface-low)',
    border: '1px dashed var(--Fresnica-border-color)',
    borderRadius: 'clamp(12px, 3vw, var(--Fresnica-border-radius-base))',
};

const codeLabelStyle: React.CSSProperties = {
    fontSize: 'var(--Fresnica-font-size-sm)',
    fontWeight: 700,
    color: 'var(--Fresnica-text-color-secondary)',
    marginBottom: 'var(--Fresnica-spacing-sm)',
    letterSpacing: '0.04em',
};

export const ApiTable: React.FC<{ rows: ApiRow[]; title?: string }> = ({ rows, title = 'API' }) => (
    <div style={{ marginTop: 'var(--Fresnica-spacing-xl)' }}>
        <div style={codeLabelStyle}>{title}</div>
        <div
            className="demo-overflow-x"
            style={{
                background: 'color-mix(in srgb, var(--Fresnica-surface) 84%, var(--Fresnica-surface-high))',
                border: '1px solid var(--Fresnica-border-color)',
                borderRadius: 'var(--Fresnica-border-radius-base)',
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            <table
                style={{
                    width: '100%',
                    minWidth: '560px',
                    borderCollapse: 'collapse',
                    fontSize: 'var(--Fresnica-font-size-supporting)',
                    tableLayout: 'auto',
                }}
            >
                <thead>
                    <tr
                        style={{
                            background: 'color-mix(in srgb, var(--Fresnica-surface) 64%, var(--Fresnica-surface-high))',
                            color: 'var(--Fresnica-text-color)',
                        }}
                    >
                        <th
                            style={{
                                padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                textAlign: 'left',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            属性
                        </th>
                        <th
                            style={{
                                padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                textAlign: 'left',
                                fontWeight: 600,
                            }}
                        >
                            说明
                        </th>
                        <th
                            style={{
                                padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                textAlign: 'left',
                                fontWeight: 600,
                            }}
                        >
                            类型
                        </th>
                        <th
                            style={{
                                padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                textAlign: 'left',
                                fontWeight: 600,
                            }}
                        >
                            默认值
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            style={{
                                color: 'var(--Fresnica-text-color-secondary)',
                                borderTop: '1px solid var(--Fresnica-border-color)',
                            }}
                        >
                            <td
                                style={{
                                    padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                    verticalAlign: 'top',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                <span style={{ color: 'var(--Fresnica-text-color)' }}>{row.prop}</span>
                                {row.required && (
                                    <span
                                        style={{
                                            color: 'var(--Fresnica-error-color)',
                                            marginLeft: 'var(--Fresnica-spacing-xs)',
                                        }}
                                    >
                                        *
                                    </span>
                                )}
                            </td>
                            <td
                                style={{
                                    padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                    verticalAlign: 'top',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {row.desc}
                            </td>
                            <td
                                style={{
                                    padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                    color: 'var(--Fresnica-accent-purple-color)',
                                    verticalAlign: 'top',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {row.type}
                            </td>
                            <td
                                style={{
                                    padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                                    color: 'var(--Fresnica-primary-color)',
                                    verticalAlign: 'top',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {row.defaultVal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <div
        style={{
            marginTop: 'var(--Fresnica-spacing-xl)',
            paddingTop: 'var(--Fresnica-spacing-xl)',
            borderTop: '1px solid var(--Fresnica-border-color)',
        }}
    >
        <div style={codeLabelStyle}>使用示例</div>

        <CodeBlockBase
            style={{
                marginTop: 0,
                borderRadius: 'var(--Fresnica-border-radius-base)',
                border: '1px solid var(--Fresnica-border-color)',
            }}
            code={code}
        />
    </div>
);
