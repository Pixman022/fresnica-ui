import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Tag } from './components/Tag';
import { enUS, zhCN, type UiLocale } from './locales';
import { FresnicaThemeProvider, useFresnicaTheme } from './theme';
import { FresnicaUiProvider } from './ui-context';

const RegressionProbe: React.FC = () => {
    const { mode } = useFresnicaTheme();

    return (
        <>
            <span data-testid="theme-mode">{mode}</span>
            <Input allowClear defaultValue="stable" />
            <Input aria-label="locked" value="locked" disabled readOnly />
            <Button loading>Submit</Button>
            <Tag closable>Tag</Tag>
        </>
    );
};

const Host: React.FC = () => {
    const [locale, setLocale] = useState<UiLocale>(zhCN);

    return (
        <>
            <button type="button" onClick={() => setLocale((current) => (current === zhCN ? enUS : zhCN))}>
                Switch locale
            </button>
            <FresnicaThemeProvider initialMode="dark" persist={false} syncTabs={false}>
                <FresnicaUiProvider locale={locale}>
                    <RegressionProbe />
                </FresnicaUiProvider>
            </FresnicaThemeProvider>
        </>
    );
};

describe('Provider regression boundaries', () => {
    it('changes Locale without changing theme, value, disabled, or loading state', async () => {
        const user = userEvent.setup();
        render(<Host />);

        const editable = screen.getAllByRole('textbox')[0];
        const locked = screen.getByRole('textbox', { name: 'locked' });
        const loadingButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(editable, ' value');

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
        expect(editable).toHaveValue('stable value');
        expect(locked).toBeDisabled();
        expect(loadingButton).toBeDisabled();
        expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Switch locale' }));

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
        expect(editable).toHaveValue('stable value');
        expect(locked).toBeDisabled();
        expect(loadingButton).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
});
