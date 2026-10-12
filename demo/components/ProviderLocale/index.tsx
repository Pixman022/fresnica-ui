import React, { useRef, useState } from 'react';
import {
    Button,
    Card,
    FresnicaUiProvider,
    Input,
    Loading,
    Modal,
    Table,
    Tag,
    enUS,
    useFresnicaTheme,
    zhCN,
} from '../../../src';

type DemoLanguage = 'zh-CN' | 'en-US';

const columns = [{ title: 'Name', dataIndex: 'name' }];

const surfaceStyle: React.CSSProperties = {
    display: 'grid',
    gap: 'var(--Fresnica-spacing-md)',
    padding: 'var(--Fresnica-spacing-lg)',
};

const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 'var(--Fresnica-spacing-sm)',
};

const ProviderLocaleDemo: React.FC = () => {
    const [language, setLanguage] = useState<DemoLanguage>('zh-CN');
    const [modalOpen, setModalOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { mode } = useFresnicaTheme();
    const locale = language === 'zh-CN' ? zhCN : enUS;
    const localLoading =
        language === 'zh-CN'
            ? '这是组件级局部覆盖：切换语言不会覆盖这条显式 labels 文案。'
            : 'This is a component-level override: Provider changes do not replace explicit labels copy.';
    const longCopy =
        language === 'zh-CN'
            ? '此区域固定验证 320px 宽度与较长文案。浏览器文字放大后应继续换行，不改变主题、输入值、禁用或加载状态。'
            : 'This constrained surface checks long copy at 320px. Browser text zoom should wrap copy without changing theme, input value, disabled state, or loading state.';
    const disabledValue = language === 'zh-CN' ? '禁用值保持不变' : 'Disabled value stays stable';

    return (
        <FresnicaUiProvider locale={locale}>
            <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-lg)' }}>
                <Card style={surfaceStyle}>
                    <div style={rowStyle}>
                        <strong>Locale</strong>
                        <Button
                            type={language === 'zh-CN' ? 'primary' : 'default'}
                            aria-pressed={language === 'zh-CN'}
                            onClick={() => setLanguage('zh-CN')}
                        >
                            简体中文
                        </Button>
                        <Button
                            type={language === 'en-US' ? 'primary' : 'default'}
                            aria-pressed={language === 'en-US'}
                            onClick={() => setLanguage('en-US')}
                        >
                            English
                        </Button>
                    </div>
                    <p style={{ margin: 0, color: 'var(--Fresnica-text-color-secondary)' }}>
                        Theme remains independent from Locale. Current theme mode: <strong>{mode}</strong>
                    </p>
                </Card>

                <Card style={surfaceStyle}>
                    <strong>Provider copy + DOM focus</strong>
                    <div style={rowStyle}>
                        <Input ref={inputRef} allowClear defaultValue="Stable input value" />
                        <Button onClick={() => inputRef.current?.focus()}>Focus input through DOM ref</Button>
                    </div>
                    <div style={rowStyle}>
                        <Tag closable>Provider close label</Tag>
                        <Loading />
                        <Button loading>Submit</Button>
                    </div>
                </Card>

                <Card style={surfaceStyle}>
                    <strong>Local override precedence</strong>
                    <Loading labels={{ loading: localLoading }} />
                    <Table columns={columns} />
                </Card>

                <Card style={surfaceStyle}>
                    <strong>Modal focus / localized actions</strong>
                    <div style={rowStyle}>
                        <Button type="primary" onClick={() => setModalOpen(true)}>
                            Open modal
                        </Button>
                    </div>
                    <Modal
                        open={modalOpen}
                        title="Provider Locale"
                        onOk={() => setModalOpen(false)}
                        onClose={() => setModalOpen(false)}
                    >
                        The Modal keeps its existing focus entry, Tab trap and focus restoration behavior.
                    </Modal>
                </Card>

                <Card style={{ ...surfaceStyle, width: 'min(100%, 320px)', boxSizing: 'border-box' }}>
                    <strong>320px + long-copy check</strong>
                    <p
                        style={{
                            margin: 0,
                            color: 'var(--Fresnica-text-color-secondary)',
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {longCopy}
                    </p>
                    <Input disabled value={disabledValue} readOnly />
                </Card>
            </div>
        </FresnicaUiProvider>
    );
};

export default ProviderLocaleDemo;
