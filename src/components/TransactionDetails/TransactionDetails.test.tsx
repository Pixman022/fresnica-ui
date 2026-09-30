import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TransactionDetails } from './TransactionDetails';

describe('TransactionDetails', () => {
    it('renders summary, status and detail fields', () => {
        render(
            <TransactionDetails
                assetSymbol="X"
                assetName="XLM"
                title="Send asset"
                status="success"
                fields={[{ label: 'Transaction ID', value: 'abcd…1234' }]}
            />
        );
        expect(screen.getByText('Send asset')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('abcd…1234')).toBeInTheDocument();
    });

    it('forwards full values to copy handler', () => {
        const onCopy = vi.fn();
        render(
            <TransactionDetails
                assetSymbol="X"
                title="Add asset"
                status="success"
                fields={[{ label: 'Transaction ID', value: 'abcd…1234', copyValue: 'abcdef1234' }]}
                onCopy={onCopy}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: 'Copy Transaction ID' }));
        expect(onCopy).toHaveBeenCalledWith('abcdef1234');
    });

    it('accepts localized labels for navigation and explorer actions', () => {
        render(
            <TransactionDetails
                assetSymbol="X"
                title="发送资产"
                status="success"
                fields={[]}
                onExplorerClick={() => undefined}
                labels={{
                    back: '返回',
                    transactionDetails: '交易详情',
                    transactionSummary: '交易摘要',
                    viewOnExplorer: '在浏览器查看',
                }}
            />
        );

        expect(screen.getByRole('button', { name: '返回' })).toBeInTheDocument();
        expect(screen.getByText('交易详情')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '在浏览器查看' })).toBeInTheDocument();
        expect(screen.getByLabelText('交易摘要')).toBeInTheDocument();
    });
});
