import { render, screen } from '@testing-library/react';
import { FresnicaUiProvider, useUiLocale } from './ui-context';
import { enUS, zhCN } from './locales';

function LocaleProbe({ testId }: { testId: string }) {
    const locale = useUiLocale();
    return (
        <span data-testid={testId}>
            {String(locale.close ?? 'none')}|{String(locale.loading ?? 'none')}|{String(locale.clear ?? 'none')}
        </span>
    );
}

describe('FresnicaUiProvider', () => {
    it('keeps the no-provider path empty so component defaults remain authoritative', () => {
        render(<LocaleProbe testId="locale" />);
        expect(screen.getByTestId('locale')).toHaveTextContent('none|none|none');
    });

    it('keeps built-in enUS and zhCN key sets aligned', () => {
        expect(Object.keys(zhCN)).toEqual(Object.keys(enUS));
    });

    it('updates locale reactively', () => {
        const view = render(
            <FresnicaUiProvider locale={zhCN}>
                <LocaleProbe testId="locale" />
            </FresnicaUiProvider>
        );

        expect(screen.getByTestId('locale')).toHaveTextContent('关闭|加载中|清除');

        view.rerender(
            <FresnicaUiProvider locale={enUS}>
                <LocaleProbe testId="locale" />
            </FresnicaUiProvider>
        );

        expect(screen.getByTestId('locale')).toHaveTextContent('Close|Loading|Clear');
    });

    it('merges nested partial overrides with the nearest parent locale', () => {
        render(
            <FresnicaUiProvider locale={enUS}>
                <LocaleProbe testId="outer" />
                <FresnicaUiProvider locale={{ close: 'Dismiss' }}>
                    <LocaleProbe testId="inner" />
                </FresnicaUiProvider>
            </FresnicaUiProvider>
        );

        expect(screen.getByTestId('outer')).toHaveTextContent('Close|Loading|Clear');
        expect(screen.getByTestId('inner')).toHaveTextContent('Dismiss|Loading|Clear');
    });

    it('keeps separate React roots isolated', () => {
        const first = render(
            <FresnicaUiProvider locale={zhCN}>
                <LocaleProbe testId="first" />
            </FresnicaUiProvider>
        );
        const second = render(<LocaleProbe testId="second" />);

        expect(first.getByTestId('first')).toHaveTextContent('关闭|加载中|清除');
        expect(second.getByTestId('second')).toHaveTextContent('none|none|none');
    });
});
