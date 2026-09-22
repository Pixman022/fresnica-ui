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
});
