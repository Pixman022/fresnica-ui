import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TransactionRow } from './TransactionRow';

describe('TransactionRow', () => {
    it('renders transaction status and values', () => {
        render(
            <TransactionRow
                title="Sent XLM"
                subtitle="Today · GABC…WXYZ"
                amount="− 320 XLM"
                fiatValue="$38.40"
                status="pending"
            />
        );
        expect(screen.getByText('Sent XLM')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('− 320 XLM')).toBeInTheDocument();
    });

    it('uses a native button when interactive', () => {
        const onClick = vi.fn();
        render(<TransactionRow title="Swap" amount="10 XLM" direction="swap" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('supports custom status text, gain tone and transactions without an amount', () => {
        const { rerender } = render(
            <TransactionRow title="Received" amount="+ 10 XLM" direction="in" statusLabel="已完成" />
        );
        expect(screen.getByText('已完成')).toBeInTheDocument();
        expect(screen.getByText('+ 10 XLM').closest('span')).toBeInTheDocument();

        rerender(<TransactionRow title="Added asset" status={null} />);
        expect(screen.getByText('Added asset')).toBeInTheDocument();
        expect(screen.queryByText('Completed')).not.toBeInTheDocument();
    });
});
