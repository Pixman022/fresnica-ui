import React from 'react';
import { SearchX, WalletCards } from 'lucide-react';
import { Button, Card, EmptyState, Select, type EmptyStateSize } from '../../../src';

const sizeOptions = [
    { key: 'small', label: 'Small · 紧凑' },
    { key: 'middle', label: 'Middle · 默认' },
    { key: 'large', label: 'Large · 强调' },
];

const EmptyStateDemo: React.FC = () => {
    const [size, setSize] = React.useState<EmptyStateSize>('middle');
    const [cleared, setCleared] = React.useState(false);

    return (
        <div style={{ display: 'grid', gap: 'var(--Fresnica-spacing-lg)', maxWidth: 720 }}>
            <Card>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--Fresnica-spacing-md)',
                        flexWrap: 'wrap',
                        marginBottom: 'var(--Fresnica-spacing-sm)',
                    }}
                >
                    <strong style={{ color: 'var(--Fresnica-text-color)' }}>无搜索结果</strong>
                    <Select
                        options={sizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as EmptyStateSize)}
                        aria-label="选择空状态尺寸"
                    />
                </div>
                {cleared ? (
                    <div style={{ padding: 'var(--Fresnica-spacing-xl)', textAlign: 'center' }}>
                        Filters cleared. The empty pattern remains reusable for the next query.
                    </div>
                ) : (
                    <EmptyState
                        size={size}
                        icon={<SearchX size={size === 'small' ? 28 : size === 'large' ? 44 : 36} />}
                        title="No results"
                        description="Try changing your filters or clear them to start again."
                        action={<Button onClick={() => setCleared(true)}>Clear filters</Button>}
                    />
                )}
            </Card>
            <Card>
                <EmptyState
                    size="large"
                    icon={<WalletCards size={44} />}
                    title="No wallets yet"
                    description="Create or import a wallet to see your assets and activity here."
                    action={<Button type="primary">Create wallet</Button>}
                />
            </Card>
            <Card>
                <div style={{ width: 'min(100%, 320px)', marginInline: 'auto' }}>
                    <EmptyState
                        size="small"
                        title="No activity yet"
                        description="This compact, action-free pattern demonstrates long copy wrapping inside a narrow list region."
                    />
                </div>
            </Card>
        </div>
    );
};

export default EmptyStateDemo;
