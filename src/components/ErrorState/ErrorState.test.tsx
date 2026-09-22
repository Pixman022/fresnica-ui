import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
    it('uses an alert role and semantic default icon', () => {
        render(<ErrorState title="Network unavailable" description="Try again in a moment." />);

        expect(screen.getByRole('alert', { name: 'Network unavailable' })).toBeInTheDocument();
        expect(screen.getByText('Try again in a moment.')).toBeInTheDocument();
        expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('supports the large presentation size and custom content', () => {
        render(
            <ErrorState size="large" title="Could not load" action={<a href="/retry">Retry</a>}>
                <span>Request failed</span>
            </ErrorState>
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Retry' })).toHaveAttribute('href', '/retry');
        expect(screen.getByText('Request failed')).toBeInTheDocument();
    });
});
