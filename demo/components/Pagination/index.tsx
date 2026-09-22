import React, { useState } from 'react';
import { Pagination, Table } from '../../../src';
import { ApiRow, ApiTable, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const PAGINATION_API: ApiRow[] = [
    { prop: 'total', desc: '数据总数', type: 'number', defaultVal: '-', required: true },
    { prop: 'current', desc: '当前页（受控）', type: 'number', defaultVal: '-' },
    { prop: 'defaultCurrent', desc: '默认当前页', type: 'number', defaultVal: '1' },
    { prop: 'pageSize', desc: '每页条数（受控）', type: 'number', defaultVal: '-' },
    { prop: 'defaultPageSize', desc: '默认每页条数', type: 'number', defaultVal: '10' },
    { prop: 'onChange', desc: '页码或每页条数变化回调', type: '(page, pageSize) => void', defaultVal: '-' },
    { prop: 'onShowSizeChange', desc: '每页条数变化回调', type: '(current, size) => void', defaultVal: '-' },
    { prop: 'showSizeChanger', desc: '是否显示每页条数切换器', type: 'boolean', defaultVal: 'false' },
    { prop: 'pageSizeOptions', desc: '可选的每页条数列表', type: 'number[]', defaultVal: '[10, 20, 50, 100]' },
    { prop: 'showQuickJumper', desc: '是否显示快速跳转输入框', type: 'boolean', defaultVal: 'false' },
    { prop: 'showTotal', desc: '是否显示总条数文本', type: 'boolean', defaultVal: 'false' },
    { prop: 'disabled', desc: '是否禁用', type: 'boolean', defaultVal: 'false' },
];

const COLUMNS = [
    { title: '资产', dataIndex: 'name', width: 120 },
    { title: '余额', dataIndex: 'balance', width: 100, align: 'right' as const },
    { title: '网络', dataIndex: 'network' },
];

const ASSET_RECORDS = [
    'XLM|1,248.62|Stellar Mainnet',
    'USDC|820.00|Stellar Mainnet',
    'EURC|326.40|Stellar Mainnet',
    'AQUA|18,420.00|Stellar Mainnet',
    'yXLM|96.25|Stellar Mainnet',
    'XLM|250.00|Stellar Testnet',
    'USDC|120.00|Stellar Testnet',
    'EURC|75.80|Stellar Testnet',
    'AQUA|4,500.00|Stellar Testnet',
    'yXLM|42.00|Stellar Testnet',
].map((row, i) => {
    const [name, balance, network] = row.split('|');
    return { key: String(i + 1), name, balance, network };
}) as Record<string, unknown>[];

const PaginationDemo: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Pagination <DemoTag>分页</DemoTag> <DemoTag>受控 / 非受控</DemoTag>
            </div>

            <div style={labelStyle}>基础用法</div>
            <Pagination total={85} defaultPageSize={10} defaultCurrent={4} />

            <div style={labelStyle}>总条数 + 每页条数切换</div>
            <Pagination total={85} defaultCurrent={3} showTotal showSizeChanger pageSizeOptions={[10, 20, 50]} />

            <div style={labelStyle}>快速跳转（受控）</div>
            <Pagination
                total={500}
                current={page}
                pageSize={pageSize}
                showTotal
                showQuickJumper
                onChange={(p, s) => {
                    setPage(p);
                    setPageSize(s);
                }}
            />

            <div style={labelStyle}>禁用</div>
            <Pagination total={85} defaultCurrent={4} disabled />

            <div style={labelStyle}>配合 Table（pagination 属性）</div>
            <Table
                columns={COLUMNS}
                dataSource={ASSET_RECORDS}
                pagination={{
                    defaultPageSize: 5,
                    showTotal: true,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20],
                }}
            />

            <CodeBlock
                code={`import { Pagination, Table } from 'fresnica-ui';

// 独立使用（受控）
<Pagination
    total={500}
    current={page}
    pageSize={20}
    showTotal
    showQuickJumper
    onChange={(p, s) => setPage(p)}
/>

// Table 内置客户端分页
<Table
    columns={columns}
    dataSource={data}
    pagination={{ defaultPageSize: 5, showTotal: true, showSizeChanger: true }}
/>`}
            />
            <ApiTable rows={PAGINATION_API} />
        </div>
    );
};

export default PaginationDemo;
