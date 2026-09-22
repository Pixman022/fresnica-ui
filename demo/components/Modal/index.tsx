import React, { useState } from 'react';
import { Button, Modal } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const MODAL_API: ApiRow[] = [
    {
        prop: 'open',
        desc: '是否可见',
        type: 'boolean',
        defaultVal: '-',
        required: true,
    },
    { prop: 'title', desc: '标题', type: 'ReactNode', defaultVal: '-' },
    { prop: 'variant', desc: '弹窗语义变体', type: "'default' | 'confirm' | 'danger'", defaultVal: "'default'" },
    { prop: 'width', desc: '宽度', type: 'number | string', defaultVal: '520' },
    {
        prop: 'maskClosable',
        desc: '点击遮罩关闭',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'footer',
        desc: '底部按钮区域，传 null 则不显示',
        type: 'ReactNode | null',
        defaultVal: '默认按钮',
    },
    { prop: 'onClose', desc: '关闭回调', type: '() => void', defaultVal: '-' },
    { prop: 'onOk', desc: '确认回调', type: '() => void', defaultVal: '-' },
    { prop: 'okText', desc: '确认按钮文案', type: 'ReactNode', defaultVal: '确定' },
    { prop: 'cancelText', desc: '取消按钮文案', type: 'ReactNode', defaultVal: '取消' },
    { prop: 'okLoading', desc: '确认按钮加载状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'okDisabled', desc: '确认按钮禁用状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'closable', desc: '是否显示右上角关闭按钮', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'children',
        desc: '自定义内容',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'className',
        desc: '自定义类名',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'typeSpeed',
        desc: '打字机每字间隔 (ms)',
        type: 'number',
        defaultVal: '80',
    },
    {
        prop: 'typewriter',
        desc: '是否启用打字机效果',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'maskStyle',
        desc: '遮罩层自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const S = {
    row: {
        display: 'flex',
        gap: 'var(--Fresnica-spacing-lg)',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
};

const ModalDemo: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [customFooterOpen, setCustomFooterOpen] = useState(false);
    const [noTypewriterOpen, setNoTypewriterOpen] = useState(false);
    const [lightMaskOpen, setLightMaskOpen] = useState(false);
    const [darkMaskOpen, setDarkMaskOpen] = useState(false);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Modal <DemoTag>弹窗</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>基础弹窗</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setModalOpen(true)}>
                        基础 Modal
                    </Button>
                    <Button onClick={() => setTitleModalOpen(true)}>带标题 Modal</Button>
                    <Button type="dashed" onClick={() => setCustomFooterOpen(true)}>
                        自定义 Footer
                    </Button>
                </div>
                <div style={labelStyle}>开启打字机效果</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setNoTypewriterOpen(true)}>
                        开启打字机效果
                    </Button>
                </div>
                <div style={labelStyle}>自定义遮罩样式</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setLightMaskOpen(true)}>
                        浅色遮罩
                    </Button>
                    <Button type="primary" onClick={() => setDarkMaskOpen(true)}>
                        深色遮罩
                    </Button>
                </div>
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} onOk={() => setModalOpen(false)}>
                <div
                    style={{
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--Fresnica-spacing-sm)',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--Fresnica-text-color)',
                            fontSize: 'var(--Fresnica-font-size-section-title)',
                            fontWeight: 700,
                        }}
                    >
                        交易已提交
                    </span>
                    <span>正在等待 Stellar 网络确认…</span>
                </div>
            </Modal>
            <Modal
                open={titleModalOpen}
                title="添加资产确认"
                onClose={() => setTitleModalOpen(false)}
                onOk={() => setTitleModalOpen(false)}
            >
                确认将该 Stellar 资产添加到当前钱包吗？添加后可在资产列表中查看余额与活动记录。
            </Modal>
            <Modal
                open={customFooterOpen}
                title="确认操作"
                variant="danger"
                onClose={() => setCustomFooterOpen(false)}
                onOk={() => setCustomFooterOpen(false)}
                cancelText="再想想"
                okText="确认撤销"
            >
                确定要移除此钱包吗？这个操作不可撤销。
            </Modal>
            <Modal
                open={noTypewriterOpen}
                title="网络状态"
                onClose={() => setNoTypewriterOpen(false)}
                onOk={() => setNoTypewriterOpen(false)}
                typewriter
            >
                Stellar Mainnet 运行正常，最新账本已同步。
            </Modal>
            <Modal
                open={lightMaskOpen}
                title="浅色遮罩"
                onClose={() => setLightMaskOpen(false)}
                onOk={() => setLightMaskOpen(false)}
                maskStyle={{ background: 'var(--Fresnica-mask-bg-subtle)' }}
            >
                这是一个浅色遮罩的弹窗，遮罩几乎透明。
            </Modal>
            <Modal
                open={darkMaskOpen}
                title="深色遮罩"
                onClose={() => setDarkMaskOpen(false)}
                onOk={() => setDarkMaskOpen(false)}
                maskStyle={{ background: 'var(--Fresnica-mask-bg-strong)' }}
            >
                这是一个深色遮罩的弹窗，背景更暗、聚焦感更强。
            </Modal>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Button, Modal } from 'fresnica-ui';

const App = () => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Button type="primary" onClick={() => setOpen(true)}>打开 Modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} onOk={() => setOpen(false)}>
                Modal 内容
            </Modal>

            {/* 带标题 */}
            <Modal open={open} title="标题" onClose={() => setOpen(false)}>
                内容
            </Modal>

            {/* 自定义 Footer */}
            <Modal open={open} title="确认" footer={<Button>自定义按钮</Button>}>
                内容
            </Modal>

            {/* 无 Footer */}
            <Modal open={open} footer={null}>
                无底部按钮
            </Modal>

            {/* 开启打字机效果 */}
            <Modal open={open} typewriter>
                直接显示全部内容
            </Modal>

            {/* 自定义遮罩样式 */}
            <Modal open={open} maskStyle={{ background: 'var(--Fresnica-mask-bg-subtle)' }}>
                浅色遮罩
            </Modal>
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={MODAL_API} />
        </div>
    );
};

export default ModalDemo;
