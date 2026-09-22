import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
    it('renders a labelled empty section with a neutral default icon', () => {
        render(<EmptyState title="No transactions" description="Your activity will appear here." />);

        expect(screen.getByRole('region', { name: 'No transactions' })).toBeInTheDocument();
        expect(screen.getByText('Your activity will appear here.')).toBeInTheDocument();
        expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('renders a custom action and forwards its attributes', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <EmptyState
                title="No results"
                data-testid="empty"
                action={<button onClick={onClick}>Clear filters</button>}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('empty')).toBeInTheDocument();
    });
});
