import React from 'react';
import { ArrowLeft, RefreshCw, WifiOff } from 'lucide-react';
import { Button, Card, ErrorState, Select, type ErrorStateSize } from '../../../src';

const sizeOptions = [
    { key: 'small', label: 'Small · 紧凑' },
    { key: 'middle', label: 'Middle · 默认' },
    { key: 'large', label: 'Large · 强调' },
];

const ErrorStateDemo: React.FC = () => {
    const [size, setSize] = React.useState<ErrorStateSize>('middle');
    const [retried, setRetried] = React.useState(false);

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
                    <strong style={{ color: 'var(--Fresnica-text-color)' }}>网络请求失败</strong>
                    <Select
                        options={sizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as ErrorStateSize)}
                        aria-label="选择错误状态尺寸"
                    />
                </div>
                <ErrorState
                    size={size}
                    icon={<WifiOff size={size === 'small' ? 28 : size === 'large' ? 44 : 36} />}
                    title={retried ? 'Retry requested' : 'Network unavailable'}
                    description={
                        retried ? 'The caller can now start a fresh request.' : 'Check the connection and try again.'
                    }
                    action={
                        <Button type="primary" icon={<RefreshCw size={18} />} onClick={() => setRetried(true)}>
                            Retry
                        </Button>
                    }
                />
            </Card>
            <Card>
                <ErrorState
                    title="Session expired"
                    description="Your session has ended. Return to the previous step and try again without losing your entered data."
                    action={
                        <Button icon={<ArrowLeft size={18} />} onClick={() => setRetried(true)}>
                            Go back
                        </Button>
                    }
                />
            </Card>
            <Card>
                <div style={{ width: 'min(100%, 320px)', marginInline: 'auto' }}>
                    <ErrorState
                        size="small"
                        title="Could not load"
                        description="Use a short, actionable message for an inline error region."
                    />
                </div>
            </Card>
        </div>
    );
};

export default ErrorStateDemo;
