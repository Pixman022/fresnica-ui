import React from 'react';
import { Tooltip, Button } from '../../../src';
import {
    labelStyle,
    ApiTable,
    CodeBlock,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBoxStyle,
} from '../../tools';

const TOOLTIP_API: ApiRow[] = [
    {
        prop: 'title',
        desc: '提示内容，支持多行（可用 \\n 或 <br/> 换行）',
        type: 'ReactNode',
        defaultVal: '-',
        required: true,
    },
    {
        prop: 'placement',
        desc: '位置',
        type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'",
        defaultVal: "'top'",
    },
    { prop: 'trigger', desc: '触发方式', type: "'hover' | 'focus' | 'click'", defaultVal: "'hover'" },
    { prop: 'variant', desc: '视觉风格', type: "'default' | 'Fresnica'", defaultVal: "'default'" },
    { prop: 'bordered', desc: '是否显示边框（含箭头描边）', type: 'boolean', defaultVal: 'true' },
    { prop: 'children', desc: '触发元素', type: 'ReactElement', defaultVal: '-', required: true },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', defaultVal: '-' },
];

const leftColStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--Fresnica-spacing-md)',
    alignItems: 'flex-start',
};

const rightColStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--Fresnica-spacing-md)',
    alignItems: 'flex-end',
};

const placementRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--Fresnica-spacing-md)',
};

const placementBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--Fresnica-spacing-md)',
};

const centerMarkStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--Fresnica-border-radius-base)',
    background: 'var(--Fresnica-surface-high)',
    color: 'var(--Fresnica-text-color-secondary)',
    fontSize: 'var(--Fresnica-font-size-sm)',
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.3,
    flexShrink: 0,
};

const leftTooltipTitle = (label: string) => (
    <>
        {label}
        <br />
        箭头在右侧
        <br />
        指向触发按钮
    </>
);

const rightTooltipTitle = (label: string) => (
    <>
        {label}
        <br />
        箭头在左侧
        <br />
        指向触发按钮
    </>
);

const TooltipDemo: React.FC = () => {
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Tooltip <DemoTag>气泡提示</DemoTag>
            </div>

            <div style={labelStyle}>基础用法 — hover 触发</div>
            <div style={demoBoxStyle}>
                <div
                    style={{
                        display: 'flex',
                        gap: 'var(--Fresnica-spacing-lg)',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Tooltip title="提示文字">
                        <Button type="primary" size="small">
                            Hover 我
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <div style={labelStyle}>风格 — 标准矩形与强调色气泡</div>
            <div style={{ ...demoBoxStyle, overflow: 'visible' }}>
                <div
                    style={{
                        display: 'flex',
                        gap: 'var(--Fresnica-spacing-xl)',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Tooltip title="标准矩形气泡" placement="top">
                        <Button size="small">default</Button>
                    </Tooltip>
                    <Tooltip title="无边框矩形" placement="top" bordered={false}>
                        <Button size="small">default 无边框</Button>
                    </Tooltip>
                    <Tooltip
                        variant="accent"
                        bordered
                        placement="top"
                        title={
                            <>
                                Transaction <span style={{ color: 'var(--Fresnica-success-color)' }}>confirmed</span>
                                <br />
                                已记录到 Stellar 网络
                            </>
                        }
                    >
                        <Button size="small">强调色有边框</Button>
                    </Tooltip>
                    <Tooltip
                        variant="accent"
                        bordered={false}
                        placement="top"
                        title={
                            <>
                                无边框强调气泡
                                <br />
                                圆点指示方向
                            </>
                        }
                    >
                        <Button size="small">强调色无边框</Button>
                    </Tooltip>
                </div>
            </div>

            <div style={labelStyle}>12 个方向</div>
            <div style={{ ...demoBoxStyle, overflow: 'visible' }}>
                <div style={placementBoxStyle}>
                    <div style={placementRowStyle}>
                        <Tooltip title="top-start" placement="top-start">
                            <Button size="small">top-start</Button>
                        </Tooltip>
                        <Tooltip title="top" placement="top">
                            <Button size="small">top</Button>
                        </Tooltip>
                        <Tooltip title="top-end" placement="top-end">
                            <Button size="small">top-end</Button>
                        </Tooltip>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
                        <div style={leftColStyle}>
                            <Tooltip title={leftTooltipTitle('left-start')} placement="left-start">
                                <Button size="small">left-start</Button>
                            </Tooltip>
                            <Tooltip title={leftTooltipTitle('left')} placement="left">
                                <Button size="small">left</Button>
                            </Tooltip>
                            <Tooltip title={leftTooltipTitle('left-end')} placement="left-end">
                                <Button size="small">left-end</Button>
                            </Tooltip>
                        </div>

                        <div style={centerMarkStyle}>
                            12
                            <br />
                            placements
                        </div>

                        <div style={rightColStyle}>
                            <Tooltip title={rightTooltipTitle('right-start')} placement="right-start">
                                <Button size="small">right-start</Button>
                            </Tooltip>
                            <Tooltip title={rightTooltipTitle('right')} placement="right">
                                <Button size="small">right</Button>
                            </Tooltip>
                            <Tooltip title={rightTooltipTitle('right-end')} placement="right-end">
                                <Button size="small">right-end</Button>
                            </Tooltip>
                        </div>
                    </div>

                    <div style={placementRowStyle}>
                        <Tooltip title="bottom-start" placement="bottom-start">
                            <Button size="small">bottom-start</Button>
                        </Tooltip>
                        <Tooltip title="bottom" placement="bottom">
                            <Button size="small">bottom</Button>
                        </Tooltip>
                        <Tooltip title="bottom-end" placement="bottom-end">
                            <Button size="small">bottom-end</Button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div style={labelStyle}>触发方式 — click</div>
            <div style={demoBoxStyle}>
                <Tooltip title="点击触发，再点关闭" trigger="click" placement="bottom">
                    <Button size="small">Click 触发</Button>
                </Tooltip>
            </div>

            <div style={labelStyle}>触发方式 — focus</div>
            <div style={demoBoxStyle}>
                <Tooltip title="聚焦时显示" trigger="focus" placement="right">
                    <input
                        type="text"
                        placeholder="点击输入框聚焦"
                        style={{
                            padding: 'var(--Fresnica-spacing-sm) var(--Fresnica-spacing-lg)',
                            borderRadius: 'var(--Fresnica-border-radius-control)',
                            border: '1px solid var(--Fresnica-border-color)',
                            background: 'var(--Fresnica-surface)',
                            fontFamily: 'inherit',
                            fontSize: 'var(--Fresnica-font-size-base)',
                            color: 'var(--Fresnica-text-color)',
                            outline: 'none',
                        }}
                    />
                </Tooltip>
            </div>

            <div style={labelStyle}>多行内容</div>
            <div style={demoBoxStyle}>
                <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-lg)', flexWrap: 'wrap' }}>
                    <Tooltip
                        title={
                            <>
                                第一行文字
                                <br />
                                第二行文字
                                <br />
                                第三行文字
                            </>
                        }
                        placement="top"
                    >
                        <Button size="small">多行 JSX</Button>
                    </Tooltip>

                    <Tooltip title={'第一行\n第二行\n第三行'} placement="top">
                        <Button size="small">换行符 \n</Button>
                    </Tooltip>

                    <Tooltip
                        title="这是一段比较长的提示文字，用来测试 Tooltip 的自动换行效果。当文字超过最大宽度时会自动换行。"
                        placement="top"
                    >
                        <Button size="small">自动换行长文本</Button>
                    </Tooltip>
                </div>
            </div>

            <CodeBlock
                code={`import React from 'react';
import { Tooltip, Button } from 'fresnica-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Tooltip title="提示文字">
                <Button>Hover 我</Button>
            </Tooltip>

            {/* 强调色风格 — bordered 默认 true */}
            <Tooltip variant="accent" bordered title="主色强调提示">
                <Button>Accent</Button>
            </Tooltip>
            <Tooltip variant="accent" bordered={false} title="无边框提示">
                <Button>Accent 无边框</Button>
            </Tooltip>

            {/* 12 个方向 */}
            <Tooltip title="我在上方" placement="top">
                <Button>Top</Button>
            </Tooltip>
            <Tooltip title="我在左下方" placement="bottom-start">
                <Button>Bottom-Start</Button>
            </Tooltip>

            {/* Click 触发 */}
            <Tooltip title="点击触发" trigger="click">
                <Button>Click</Button>
            </Tooltip>

            {/* Focus 触发 */}
            <Tooltip title="聚焦显示" trigger="focus">
                <input placeholder="点击聚焦" />
            </Tooltip>

            {/* 多行内容 */}
            <Tooltip
                title={
                    <>
                        第一行
                        <br />
                        第二行
                        <br />
                        第三行
                    </>
                }
            >
                <Button>多行</Button>
            </Tooltip>
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={TOOLTIP_API} />
        </div>
    );
};

export default TooltipDemo;
