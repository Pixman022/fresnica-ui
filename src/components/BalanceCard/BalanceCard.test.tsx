import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BalanceCard } from './BalanceCard';

describe('BalanceCard', () => {
    it('renders balance, currency and change', () => {
        render(<BalanceCard balance={12840.52} currency="USD" secondaryValue="≈ 31,200 XLM" change={2.41} />);
        expect(screen.getByRole('region', { name: 'Total balance' })).toBeInTheDocument();
        expect(screen.getByText('12,840.52')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByText('+2.41%')).toBeInTheDocument();
    });

    it('masks sensitive values', () => {
        render(<BalanceCard balance="1,000" currency="USD" secondaryValue="$1,000" hidden />);
        expect(screen.getByLabelText('Balance hidden')).toHaveTextContent('••••••');
        expect(screen.queryByText('USD')).not.toBeInTheDocument();
        expect(screen.queryByText('$1,000')).not.toBeInTheDocument();
    });
});
