import React, { useState } from 'react';
import { Form, FormItem, useForm, Input, Button, Radio, Checkbox, Card } from '../../../src';
import type { FormInstance } from '../../../src';
import { labelStyle, ApiTable, CodeBlock, ApiRow, sectionStyle, sectionTitleStyle, DemoTag } from '../../tools';

const FORM_API: ApiRow[] = [
    { prop: 'form', desc: '受控 form 实例（Form.useForm() 产出）', type: 'FormInstance', defaultVal: '-' },
    {
        prop: 'initialValues',
        desc: '表单初始值',
        type: 'Record<string, unknown>',
        defaultVal: '-',
    },
    {
        prop: 'layout',
        desc: '布局方向',
        type: "'horizontal' | 'vertical' | 'inline'",
        defaultVal: "'horizontal'",
    },
    {
        prop: 'labelAlign',
        desc: 'label 对齐',
        type: "'left' | 'right'",
        defaultVal: "'right'",
    },
    {
        prop: 'labelCol / wrapperCol',
        desc: 'label / 控件的网格配置',
        type: '{ span?: number; offset?: number }',
        defaultVal: '{ span: 5 / 19 }',
    },
    { prop: 'size', desc: '全局尺寸', type: "'small' | 'middle' | 'large'", defaultVal: "'middle'" },
    { prop: 'disabled', desc: '全局禁用', type: 'boolean', defaultVal: 'false' },
    { prop: 'colon', desc: 'label 后是否显示冒号', type: 'boolean', defaultVal: 'true' },
    {
        prop: 'requiredMark',
        desc: '必填星号显示策略',
        type: "boolean | 'optional'",
        defaultVal: 'true',
    },
    {
        prop: 'onFinish',
        desc: '校验通过、提交时触发',
        type: '(values) => void',
        defaultVal: '-',
    },
    {
        prop: 'onFinishFailed',
        desc: '校验失败时触发',
        type: '(info) => void',
        defaultVal: '-',
    },
    {
        prop: 'onValuesChange',
        desc: '任意字段值变化',
        type: '(changed, all) => void',
        defaultVal: '-',
    },
    { prop: 'onReset', desc: 'reset 事件', type: '(e) => void', defaultVal: '-' },
];

const FORM_ITEM_API: ApiRow[] = [
    { prop: 'name', desc: '字段名（无 name 仅作展示）', type: 'NamePath', defaultVal: '-' },
    { prop: 'label', desc: 'label 文本', type: 'ReactNode', defaultVal: '-' },
    { prop: 'rules', desc: '校验规则', type: 'RuleObject[]', defaultVal: '-' },
    { prop: 'required', desc: '显示必填星号（不参与校验）', type: 'boolean', defaultVal: 'false' },
    { prop: 'valuePropName', desc: '子节点接收的 value prop 名', type: 'string', defaultVal: "'value'" },
    { prop: 'trigger', desc: '子节点的 change 事件名', type: 'string', defaultVal: "'onChange'" },
    {
        prop: 'getValueFromEvent',
        desc: '从事件对象取值（默认兼容 input/checkbox/radio）',
        type: '(event) => unknown',
        defaultVal: '-',
    },
    { prop: 'normalize', desc: '写入前的标准化处理', type: '(value, prev, all) => unknown', defaultVal: '-' },
    { prop: 'hidden', desc: '不渲染 DOM', type: 'boolean', defaultVal: 'false' },
    { prop: 'help', desc: '帮助文本（错误时显示错误）', type: 'ReactNode', defaultVal: '-' },
    { prop: 'noStyle', desc: '不渲染 label/wrapper，仅包 children', type: 'boolean', defaultVal: 'false' },
    { prop: 'labelCol / wrapperCol', desc: '覆盖父级网格', type: 'ColProps', defaultVal: '-' },
    { prop: 'initialValue', desc: '字段初始值', type: 'unknown', defaultVal: '-' },
];

const FormDemo: React.FC = () => {
    // 表单实例：演示 setFieldsValue / resetFields
    const [form] = useForm<{ name: string; asset: string; actions: string[] }>();
    const [instanceResult, setInstanceResult] = useState<string>('');

    // 监听 onValuesChange
    const [liveValues, setLiveValues] = useState<Record<string, unknown>>({});

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Form <DemoTag>表单</DemoTag> <DemoTag>useForm</DemoTag> <DemoTag>校验</DemoTag>
            </div>

            <div style={labelStyle}>Form 表单组件 — 集成表单实例、校验规则、布局网格、依赖字段等基础能力。</div>

            {/* ========== 基础用法：解锁钱包 ========== */}
            <div style={labelStyle}>基础用法：解锁钱包（required / minLength / 自定义 validator）</div>
            <Card style={{ marginTop: 'var(--Fresnica-spacing-md)', cursor: 'default', width: '100%', maxWidth: 360 }}>
                <Form
                    layout="vertical"
                    style={{ width: '100%', maxWidth: 300 }}
                    initialValues={{ walletName: '', password: '' }}
                    onFinish={(values) => {
                        // 表单自带的 per-field 错误提示已足够，不再展示顶部 alert
                        console.log('wallet unlock success:', values);
                    }}
                    onFinishFailed={(info) => {
                        // 表单自带的 per-field 错误提示已足够，不再展示顶部 alert
                        console.log('wallet unlock failed:', info);
                    }}
                >
                    <FormItem
                        label="钱包名称"
                        name="walletName"
                        required
                        rules={[
                            { required: true, message: '请输入钱包名称' },
                            { min: 3, max: 24, message: '长度需在 3 - 24 字符之间' },
                        ]}
                    >
                        <Input placeholder="例如：Main wallet" />
                    </FormItem>
                    <FormItem
                        label="访问密码"
                        name="password"
                        required
                        rules={[
                            { required: true, message: '请输入访问密码' },
                            {
                                validator: (_rule, value) => {
                                    if (typeof value === 'string' && value.length > 0 && value.length < 6) {
                                        return Promise.reject(new Error('访问密码至少 6 位'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input type="password" placeholder="请输入访问密码" />
                    </FormItem>
                    <FormItem>
                        {/* 按钮与上一个 input 多 8px 间距，叠加 form 的 8px gap = 16px */}
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--Fresnica-spacing-sm)',
                                maxWidth: '100%',
                                marginTop: 'var(--Fresnica-spacing-sm)',
                            }}
                        >
                            <Button type="primary" htmlType="submit" block>
                                解锁钱包
                            </Button>
                        </div>
                    </FormItem>
                </Form>
            </Card>

            {/* ========== 三种布局 ========== */}
            <div style={labelStyle}>三种布局：horizontal / vertical / inline</div>
            <Card
                style={{
                    marginTop: 'var(--Fresnica-spacing-md)',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--Fresnica-spacing-sm)',
                    width: '100%',
                    maxWidth: 360,
                }}
            >
                <div
                    style={{
                        fontSize: 'var(--Fresnica-font-size-sm)',
                        color: 'var(--Fresnica-text-color-secondary)',
                        marginBottom: 'var(--Fresnica-spacing-xs)',
                    }}
                >
                    layout="horizontal"
                </div>
                <Form
                    layout="horizontal"
                    style={{ width: '100%', maxWidth: 300 }}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    labelAlign="left"
                    initialValues={{ address: '', memo: '' }}
                >
                    <FormItem label="地址" name="address" required>
                        <Input placeholder="G..." />
                    </FormItem>
                    <FormItem label="Memo" name="memo">
                        <Input placeholder="可选" />
                    </FormItem>
                </Form>

                <div
                    style={{
                        fontSize: 'var(--Fresnica-font-size-sm)',
                        color: 'var(--Fresnica-text-color-secondary)',
                        marginTop: 'var(--Fresnica-spacing-md)',
                        marginBottom: 'var(--Fresnica-spacing-xs)',
                    }}
                >
                    layout=&quot;vertical&quot;
                </div>
                <Form layout="vertical" style={{ width: '100%', maxWidth: 300 }} initialValues={{ amount: '' }}>
                    <FormItem label="金额" name="amount" required>
                        <Input placeholder="0.00 XLM" />
                    </FormItem>
                </Form>

                <div
                    style={{
                        fontSize: 'var(--Fresnica-font-size-sm)',
                        color: 'var(--Fresnica-text-color-secondary)',
                        marginTop: 'var(--Fresnica-spacing-md)',
                        marginBottom: 'var(--Fresnica-spacing-xs)',
                    }}
                >
                    layout=&quot;inline&quot;
                </div>
                <Form layout="inline" style={{ width: '100%', maxWidth: 300 }} initialValues={{ query: '' }}>
                    <FormItem name="query">
                        <Input placeholder="搜索 Stellar 资产" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" size="middle">
                            搜索
                        </Button>
                    </FormItem>
                </Form>
            </Card>

            {/* ========== Form.useForm + 命令式 API ========== */}
            <div style={labelStyle}>Form.useForm + 命令式 API（setFieldsValue / resetFields）</div>
            <Card style={{ marginTop: 'var(--Fresnica-spacing-md)', cursor: 'default', width: '100%', maxWidth: 360 }}>
                <Form
                    form={form}
                    layout="vertical"
                    style={{ width: '100%', maxWidth: 300 }}
                    initialValues={{ name: '', asset: 'XLM', actions: [] }}
                    onFinish={(values) => setInstanceResult(`onFinish: ${JSON.stringify(values)}`)}
                >
                    <FormItem label="钱包名称" name="name" required>
                        <Input placeholder="输入钱包名称" />
                    </FormItem>
                    <FormItem label="默认资产" name="asset" initialValue="XLM">
                        <Input placeholder="XLM / USDC / AQUA" />
                    </FormItem>
                    <FormItem label="快捷操作" name="actions">
                        <Checkbox
                            options={[
                                { label: '交易签名', value: 'signing' },
                                { label: '生物识别', value: 'biometric' },
                                { label: '交易提醒', value: 'alerts' },
                            ]}
                        />
                    </FormItem>
                    <FormItem>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--Fresnica-spacing-sm)',
                                maxWidth: '100%',
                                marginTop: 'var(--Fresnica-spacing-sm)',
                            }}
                        >
                            <Button
                                type="dashed"
                                onClick={() => {
                                    form.setFieldsValue({
                                        name: 'Fresnica Wallet',
                                        asset: 'USDC',
                                        actions: ['signing', 'alerts'],
                                    });
                                }}
                                style={{ margin: 0 }}
                            >
                                一键填充
                            </Button>
                            <Button onClick={() => form.resetFields()} style={{ margin: 0 }}>
                                重置
                            </Button>
                            <Button type="primary" htmlType="submit" style={{ margin: 0 }}>
                                提交
                            </Button>
                        </div>
                    </FormItem>
                </Form>
                {instanceResult && (
                    <div
                        style={{
                            marginTop: 'var(--Fresnica-spacing-sm)',
                            padding: 'var(--Fresnica-spacing-sm)',
                            background: 'var(--Fresnica-primary-color-bg)',
                            border: '1px solid var(--Fresnica-primary-color)',
                            borderRadius: 'var(--Fresnica-border-radius-sm)',
                            fontSize: 'var(--Fresnica-font-size-sm)',
                            color: 'var(--Fresnica-on-primary-container-color)',
                        }}
                    >
                        {instanceResult}
                    </div>
                )}
            </Card>

            {/* ========== 同步值（onValuesChange）========== */}
            <div style={labelStyle}>onValuesChange：实时同步字段值</div>
            <Card style={{ marginTop: 'var(--Fresnica-spacing-md)', cursor: 'default', width: '100%', maxWidth: 360 }}>
                <Form
                    layout="vertical"
                    style={{ width: '100%', maxWidth: 300 }}
                    initialValues={{ network: 'mainnet', alerts: ['transaction', 'signature'] }}
                    onValuesChange={(_changed, all) => setLiveValues(all)}
                >
                    <FormItem label="Stellar 网络" name="network">
                        <Radio
                            options={[
                                { label: 'Mainnet', value: 'mainnet' },
                                { label: 'Testnet', value: 'testnet' },
                            ]}
                        />
                    </FormItem>
                    <FormItem label="钱包提醒" name="alerts">
                        <Checkbox
                            options={[
                                { label: '交易确认', value: 'transaction' },
                                { label: '签名请求', value: 'signature' },
                                { label: '低余额', value: 'low-balance' },
                            ]}
                        />
                    </FormItem>
                </Form>
                <div
                    style={{
                        marginTop: 'var(--Fresnica-spacing-sm)',
                        fontSize: 'var(--Fresnica-font-size-sm)',
                        color: 'var(--Fresnica-text-color-secondary)',
                        fontFamily: 'var(--Fresnica-font-family)',
                        background: 'var(--Fresnica-surface-low)',
                        border: '1px solid var(--Fresnica-border-color-light)',
                        borderRadius: 'var(--Fresnica-border-radius-sm)',
                        padding: 'var(--Fresnica-spacing-sm)',
                    }}
                >
                    当前钱包设置：{JSON.stringify(liveValues)}
                </div>
            </Card>

            {/* ========== 多种校验规则 ========== */}
            <div style={labelStyle}>校验规则：required / pattern / max / 自定义 async</div>
            <Card style={{ marginTop: 'var(--Fresnica-spacing-md)', cursor: 'default', width: '100%', maxWidth: 360 }}>
                <Form
                    layout="vertical"
                    style={{ width: '100%', maxWidth: 300 }}
                    initialValues={{ address: '', amount: '', memo: '' }}
                    onFinish={(v) => alert(`提交: ${JSON.stringify(v)}`)}
                >
                    <FormItem
                        label="Stellar 地址"
                        name="address"
                        required
                        rules={[
                            { required: true, message: '请输入收款地址' },
                            { pattern: /^G[A-Z2-7]{55}$/, message: '请输入有效的 Stellar 公钥' },
                        ]}
                    >
                        <Input placeholder="G..." />
                    </FormItem>
                    <FormItem
                        label="转账金额"
                        name="amount"
                        required
                        rules={[
                            { required: true, message: '请输入金额' },
                            { pattern: /^\d+(\.\d{1,7})?$/, message: '金额最多保留 7 位小数' },
                        ]}
                    >
                        <Input placeholder="0.00 XLM" />
                    </FormItem>
                    <FormItem label="Memo" name="memo" rules={[{ max: 28, message: 'Memo 最多 28 个字符' }]}>
                        <Input placeholder="可选交易备注" />
                    </FormItem>
                    <FormItem>
                        <div style={{ marginTop: 'var(--Fresnica-spacing-sm)' }}>
                            <Button type="primary" htmlType="submit" block>
                                提交
                            </Button>
                        </div>
                    </FormItem>
                </Form>
            </Card>

            <CodeBlock
                code={`import React from 'react';
import { Form, FormItem, useForm, Input, Button } from 'fresnica-ui';

const App = () => {
    const [form] = useForm();

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{ walletName: '' }}
            onFinish={(values) => console.log('success', values)}
            onFinishFailed={(info) => console.log('failed', info)}
        >
            <FormItem
                label="钱包名称"
                name="walletName"
                required
                rules={[
                    { required: true, message: '请输入钱包名称' },
                    { min: 3, max: 24, message: '长度 3 - 24' },
                ]}
            >
                <Input placeholder="例如：Main wallet" />
            </FormItem>
            <FormItem>
                <Button type="primary" htmlType="submit">提交</Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
            </FormItem>
        </Form>
    );
};`}
            />
            <ApiTable rows={FORM_API} title="Form API" />
            <ApiTable rows={FORM_ITEM_API} title="FormItem API" />
        </div>
    );
};

// 规避 lint: 引用以保留类型
export type { FormInstance };

export default FormDemo;
