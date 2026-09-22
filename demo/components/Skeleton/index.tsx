import React, { useState } from 'react';
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar, Button, Switch } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const SKELETON_API: ApiRow[] = [
    { prop: 'loading', desc: '是否显示骨架屏', type: 'boolean', defaultVal: 'true' },
    { prop: 'variant', desc: '变体', type: `'text' | 'circle' | 'rect' | 'paragraph'`, defaultVal: "'text'" },
    { prop: 'active', desc: '是否启用流光动画', type: 'boolean', defaultVal: 'true' },
    { prop: 'rows', desc: '行数（paragraph 模式）', type: 'number', defaultVal: '3' },
    { prop: 'width', desc: '宽度（text/circle/rect 模式）', type: 'number | string', defaultVal: '100%' },
    { prop: 'rowWidths', desc: '每行宽度数组（paragraph 模式）', type: '(number | string)[]', defaultVal: '-' },
    { prop: 'widthValue', desc: '宽（circle/rect 有效）', type: 'number | string', defaultVal: '-' },
    { prop: 'heightValue', desc: '高（circle/rect 有效）', type: 'number | string', defaultVal: '-' },
    { prop: 'children', desc: 'loading=false 时渲染的内容', type: 'ReactNode', defaultVal: '-' },
];

const S = {
    row: {
        display: 'flex',
        gap: 'var(--Fresnica-spacing-lg)',
        flexWrap: 'wrap' as const,
        alignItems: 'center',
    },
    col: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--Fresnica-spacing-md)',
    },
    card: {
        width: 240,
        padding: 'var(--Fresnica-spacing-xl)',
        borderRadius: 'var(--Fresnica-border-radius-lg)',
        background: 'var(--Fresnica-surface)',
        border: '1px solid var(--Fresnica-border-color)',
    },
};

const SkeletonDemo: React.FC = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Skeleton <DemoTag>骨架屏</DemoTag> <DemoTag>加载占位</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                {/* ---- 切换 loading ---- */}
                <div style={labelStyle}>loading 切换</div>
                <div
                    style={{
                        display: 'flex',
                        gap: 'var(--Fresnica-spacing-md)',
                        alignItems: 'center',
                        marginBottom: 'var(--Fresnica-spacing-lg)',
                    }}
                >
                    <Switch checked={loading} onChange={(v) => setLoading(v)} />
                    <span
                        style={{
                            fontSize: 'var(--Fresnica-font-size-supporting)',
                            color: 'var(--Fresnica-text-color-secondary)',
                        }}
                    >
                        {loading ? '加载中' : '已加载'}
                    </span>
                </div>

                {/* ---- 1. 变体 ---- */}
                <div style={labelStyle}>variant — 四种变体</div>
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={S.card}>
                        <div
                            style={{
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 600,
                                color: 'var(--Fresnica-text-color-secondary)',
                                marginBottom: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            text
                        </div>
                        <Skeleton loading={loading} variant="text" width="100%" />
                        <Skeleton loading={loading} variant="text" width="80%" />
                        <Skeleton loading={loading} variant="text" width="60%" />
                    </div>
                    <div style={S.card}>
                        <div
                            style={{
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 600,
                                color: 'var(--Fresnica-text-color-secondary)',
                                marginBottom: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            circle
                        </div>
                        <Skeleton loading={loading} variant="circle" widthValue={56} />
                    </div>
                    <div style={S.card}>
                        <div
                            style={{
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 600,
                                color: 'var(--Fresnica-text-color-secondary)',
                                marginBottom: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            rect
                        </div>
                        <Skeleton loading={loading} variant="rect" widthValue={200} heightValue={120} />
                    </div>
                    <div style={S.card}>
                        <div
                            style={{
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 600,
                                color: 'var(--Fresnica-text-color-secondary)',
                                marginBottom: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            paragraph
                        </div>
                        <Skeleton loading={loading} variant="paragraph" rows={4} />
                    </div>
                </div>

                {/* ---- 2. 子组件骨架 ---- */}
                <div style={labelStyle}>Skeleton.Button / Skeleton.Input / Skeleton.Avatar</div>
                <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={S.card}>
                        <div
                            style={{
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 600,
                                color: 'var(--Fresnica-text-color-secondary)',
                                marginBottom: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            Button
                        </div>
                        {loading ? <SkeletonButton size="middle" /> : <Button>加载完成</Button>}
                    </div>
                    <div style={S.card}>
                        <div
                            style={{
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 600,
                                color: 'var(--Fresnica-text-color-secondary)',
                                marginBottom: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            Input
                        </div>
                        {loading ? (
                            <SkeletonInput size="middle" />
                        ) : (
                            <div
                                style={{
                                    color: 'var(--Fresnica-text-color-secondary)',
                                    fontSize: 'var(--Fresnica-font-size-base)',
                                }}
                            >
                                输入框已加载
                            </div>
                        )}
                    </div>
                    <div style={S.card}>
                        <div
                            style={{
                                fontSize: 'var(--Fresnica-font-size-supporting)',
                                fontWeight: 600,
                                color: 'var(--Fresnica-text-color-secondary)',
                                marginBottom: 'var(--Fresnica-spacing-md)',
                            }}
                        >
                            Avatar
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-sm)' }}>
                            {loading ? (
                                <>
                                    <SkeletonAvatar size="small" />
                                    <SkeletonAvatar size="middle" />
                                    <SkeletonAvatar size="large" />
                                </>
                            ) : (
                                <span
                                    style={{
                                        color: 'var(--Fresnica-text-color-secondary)',
                                        fontSize: 'var(--Fresnica-font-size-base)',
                                    }}
                                >
                                    头像已加载
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---- 3. children 模式 ---- */}
                <div style={labelStyle}>loading=false 时直接渲染 children</div>
                <Skeleton loading={false} variant="text">
                    <div
                        style={{
                            padding: 'var(--Fresnica-spacing-md)',
                            background: 'var(--Fresnica-primary-color-bg)',
                            borderRadius: 'var(--Fresnica-border-radius-control)',
                            color: 'var(--Fresnica-primary-color)',
                            fontWeight: 600,
                        }}
                    >
                        内容已加载，骨架屏自动隐藏
                    </div>
                </Skeleton>
            </div>

            <CodeBlock
                code={`import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from 'fresnica-ui';

// 文字骨架
<Skeleton variant="text" width="100%" />

// 圆形骨架
<Skeleton variant="circle" widthValue={56} />

// 矩形骨架
<Skeleton variant="rect" widthValue={200} heightValue={120} />

// 段落骨架
<Skeleton variant="paragraph" rows={4} />

// 子组件骨架
<SkeletonButton size="middle" />
<SkeletonInput size="large" />
<SkeletonAvatar size="middle" />

// loading 模式
<Skeleton loading={loading}>
    <div>内容已加载</div>
</Skeleton>`}
            />
            <ApiTable rows={SKELETON_API} />
        </div>
    );
};

export default SkeletonDemo;
