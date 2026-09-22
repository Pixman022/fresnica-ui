import React, { useState } from 'react';
import { Table, Button, Tag } from '../../../src';
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

const TableDemo: React.FC = () => {
    const [striped, setStriped] = useState(true);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '资产',
            dataIndex: 'name',
            width: 120,
        },
        {
            title: '数量',
            dataIndex: 'amount',
            width: 80,
            align: 'center' as const,
        },
        {
            title: '网络',
            dataIndex: 'network',
        },
        {
            title: '估值',
            dataIndex: 'value',
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (value: unknown) => {
                const status = value as string;
                const tagColors: Record<string, 'app-teal' | 'app-yellow' | 'app-red'> = {
                    已确认: 'app-teal',
                    处理中: 'app-yellow',
                    失败: 'app-red',
                };
                return <Tag color={tagColors[status] ?? 'app-teal'}>{status}</Tag>;
            },
        },
    ];

    const dataSource = [
        { key: '1', name: 'XLM', amount: '124.50', network: 'Stellar', value: '$14.38', status: '已确认' },
        { key: '2', name: 'USDC', amount: '85.00', network: 'Stellar', value: '$85.00', status: '处理中' },
        { key: '3', name: 'AQUA', amount: '1,240', network: 'Stellar', value: '$2.48', status: '已确认' },
        { key: '4', name: 'yXLM', amount: '42.10', network: 'Stellar', value: '$5.01', status: '失败' },
        { key: '5', name: 'EURC', amount: '18.00', network: 'Stellar', value: '$19.54', status: '已确认' },
    ] as Record<string, unknown>[];

    // 分页示例数据：12 条，配 defaultPageSize 3
    const statuses = ['已确认', '处理中', '失败'];
    const assets = ['XLM', 'USDC', 'AQUA', 'yXLM', 'EURC', 'SLT'];
    const bigDataSource = Array.from({ length: 12 }, (_, i) => ({
        key: String(i + 1),
        name: assets[i % assets.length],
        amount: `${(i + 1) * 12}.00`,
        network: 'Stellar',
        value: `$${((i + 1) * 7.25).toFixed(2)}`,
        status: statuses[i % statuses.length],
    })) as Record<string, unknown>[];

    const handleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Table <DemoTag>表格</DemoTag>
            </div>
            <div style={labelStyle}>数据表格组件，支持交替行背景、边框、加载状态等常用功能。</div>

            <div
                style={{
                    marginBottom: 'var(--Fresnica-spacing-lg)',
                    display: 'flex',
                    gap: 'var(--Fresnica-spacing-lg)',
                    flexWrap: 'wrap',
                }}
            >
                <Button type={striped ? 'primary' : 'default'} onClick={() => setStriped(!striped)}>
                    交替行：{striped ? '开启' : '关闭'}
                </Button>
                <Button type="primary" onClick={handleLoading} disabled={loading}>
                    {loading ? '加载中...' : '模拟加载'}
                </Button>
            </div>

            <div
                className="demo-overflow-x"
                style={{ ...demoBodyStyle, padding: 0, overflowX: 'auto', overflowY: 'hidden' }}
            >
                <Table columns={columns} dataSource={dataSource} striped={striped} loading={loading} />
            </div>

            <div style={labelStyle}>内置分页（pagination 属性，客户端分页）</div>
            <div
                className="demo-overflow-x"
                style={{ ...demoBodyStyle, padding: 0, overflowX: 'auto', overflowY: 'hidden' }}
            >
                <Table
                    columns={columns}
                    dataSource={bigDataSource}
                    pagination={{
                        defaultPageSize: 3,
                        showTotal: true,
                        showSizeChanger: true,
                        pageSizeOptions: [3, 5, 8],
                    }}
                />
            </div>

            <CodeBlock
                code={`import React, { useState } from 'react';
import { Table } from 'fresnica-ui';

interface AssetRecord {
    key: string;
    name: string;
    amount: string;
    network: string;
    value: string;
    status: string;
}

const columns = [
    {
        title: '资产',
        dataIndex: 'name',
        width: 120,
    },
    {
        title: '年龄',
        dataIndex: 'amount',
        width: 80,
        align: 'center',
    },
    {
        title: '网络',
        dataIndex: 'network',
    },
    {
        title: '估值',
        dataIndex: 'value',
    },
    {
        title: '爱好',
        dataIndex: 'status',
        render: (value) => (
            <span style={{
                padding: 'var(--Fresnica-spacing-xs) var(--Fresnica-spacing-md)',
                background: 'var(--Fresnica-primary-color-bg)',
                border: '1px solid var(--Fresnica-primary-color)',
                borderRadius: 'var(--Fresnica-border-radius-control)',
                color: 'var(--Fresnica-primary-color)',
            }}>
                {value}
            </span>
        ),
    },
];

const data = [
    { key: '1', name: 'XLM', amount: '124.50', network: 'Stellar', value: '$14.38', status: '已确认' },
    { key: '2', name: 'USDC', amount: '85.00', network: 'Stellar', value: '$85.00', status: '处理中' },
    { key: '3', name: 'AQUA', amount: '1,240', network: 'Stellar', value: '$2.48', status: '已确认' },
];

const App = () => {
    const [striped, setStriped] = useState(true);

    return (
        <Table
            columns={columns}
            dataSource={data}
            striped={striped}
        />
    );
};`}
            />
            <ApiTable rows={TABLE_API} />
        </div>
    );
};

const TABLE_API: ApiRow[] = [
    { prop: 'columns', desc: '表格列配置', type: 'TableColumn[]', defaultVal: '[]' },
    { prop: 'dataSource', desc: '表格数据源', type: 'T[]', defaultVal: '[]' },
    { prop: 'rowKey', desc: '行唯一标识字段名或函数', type: 'string | (record) => string', defaultVal: 'key' },
    { prop: 'striped', desc: '是否显示交替行背景', type: 'boolean', defaultVal: 'true' },
    { prop: 'showHeader', desc: '是否显示表头', type: 'boolean', defaultVal: 'true' },
    { prop: 'loading', desc: '加载状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'emptyText', desc: '空数据显示文本', type: 'ReactNode', defaultVal: '暂无数据' },
    {
        prop: 'pagination',
        desc: '分页配置，传入对象开启客户端分页（透传 Pagination 属性）',
        type: 'false | PaginationProps',
        defaultVal: 'false',
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

export default TableDemo;
