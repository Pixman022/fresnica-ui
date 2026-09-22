import React, { useState } from 'react';
import { Select, type SelectOption } from '../../../src';
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

const SELECT_API: ApiRow[] = [
    { prop: 'options', desc: '选项列表', type: 'SelectOption[]', defaultVal: '-', required: true },
    { prop: 'value', desc: '当前选中值', type: 'string', defaultVal: '-', required: true },
    {
        prop: 'onChange',
        desc: '选中值变化回调',
        type: '(key: string) => void',
        defaultVal: '-',
        required: true,
    },
    { prop: 'placeholder', desc: '占位文字', type: 'string', defaultVal: '请选择' },
    { prop: 'disabled', desc: '禁用状态', type: 'boolean', defaultVal: 'false' },
];

const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--Fresnica-spacing-lg)',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
};

const assetOptions: SelectOption[] = [
    { key: 'xlm', label: 'XLM · Stellar Lumens' },
    { key: 'usdc', label: 'USDC · Circle' },
    { key: 'aqua', label: 'AQUA · Aquarius' },
    { key: 'eurc', label: 'EURC · Circle' },
];

const networkOptions: SelectOption[] = [
    { key: 'mainnet', label: 'Stellar Mainnet' },
    { key: 'testnet', label: 'Stellar Testnet' },
];

const transactionOptions: SelectOption[] = [
    { key: 'payment', label: 'Payment' },
    { key: 'swap', label: 'Path Payment / Swap' },
    { key: 'trustline', label: 'Change Trust' },
    { key: 'offer', label: 'Manage Sell Offer' },
];

const SelectDemo: React.FC = () => {
    const [asset, setAsset] = useState('xlm');
    const [network, setNetwork] = useState('');
    const [transaction, setTransaction] = useState('');

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Select <DemoTag>Stellar wallet</DemoTag> <DemoTag>primary selected state</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>资产选择</div>
                <div style={rowStyle}>
                    <Select options={assetOptions} value={asset} onChange={setAsset} aria-label="选择资产" />
                </div>

                <div style={labelStyle}>占位状态</div>
                <div style={rowStyle}>
                    <Select
                        options={networkOptions}
                        value={network}
                        onChange={setNetwork}
                        placeholder="选择 Stellar 网络"
                        aria-label="选择 Stellar 网络"
                    />
                    <Select
                        options={transactionOptions}
                        value={transaction}
                        onChange={setTransaction}
                        placeholder="选择交易类型"
                        aria-label="选择交易类型"
                    />
                </div>

                <div style={labelStyle}>禁用状态</div>
                <div style={rowStyle}>
                    <Select
                        options={networkOptions}
                        value="mainnet"
                        onChange={() => undefined}
                        disabled
                        aria-label="当前网络"
                    />
                </div>
            </div>
            <CodeBlock
                code={`import { useState } from 'react';
import { Select } from 'fresnica-ui';

const assets = [
    { key: 'xlm', label: 'XLM · Stellar Lumens' },
    { key: 'usdc', label: 'USDC · Circle' },
];

const [asset, setAsset] = useState('xlm');

<Select
    options={assets}
    value={asset}
    onChange={setAsset}
    aria-label="选择资产"
/>;`}
            />
            <ApiTable rows={SELECT_API} />
        </div>
    );
};

export default SelectDemo;
