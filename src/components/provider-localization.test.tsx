import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FresnicaUiProvider } from '../ui-context';
import { enUS } from '../locales';
import { Carousel } from './Carousel';
import { CodeBlock } from './CodeBlock';
import { DatePicker } from './DatePicker';
import { Input } from './Input';
import { Loading } from './Loading';
import { Modal } from './Modal';
import { Pagination } from './Pagination';
import { Select } from './Select';
import { Table } from './Table';
import { Tag } from './Tag';
import { TimePicker } from './TimePicker';

describe('Web Provider locale integration', () => {
    it('applies Provider copy to priority generic components', () => {
        render(
            <FresnicaUiProvider locale={enUS}>
                <Loading />
                <Input allowClear defaultValue="value" />
                <Tag closable>Tag</Tag>
                <Table columns={[{ title: 'Name', dataIndex: 'name' }]} />
            </FresnicaUiProvider>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('applies Provider copy to Modal while preserving its focusable action contract', () => {
        render(
            <FresnicaUiProvider locale={enUS}>
                <Modal open closable title="Title">
                    Body
                </Modal>
            </FresnicaUiProvider>
        );

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('uses labels before Provider and explicit props before labels', () => {
        render(
            <FresnicaUiProvider locale={enUS}>
                <Modal
                    open
                    closable
                    labels={{ confirm: '局部确认', cancel: '局部取消', close: '局部关闭' }}
                    okText="Explicit confirm"
                    closeLabel="Explicit close"
                />
            </FresnicaUiProvider>
        );

        expect(screen.getByRole('button', { name: 'Explicit confirm' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '局部取消' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Explicit close' })).toBeInTheDocument();
    });

    it('keeps historical defaults when no Provider is present', () => {
        render(
            <>
                <Input allowClear defaultValue="value" />
                <Table columns={[{ title: 'Name', dataIndex: 'name' }]} />
                <Tag closable>Tag</Tag>
            </>
        );

        expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument();
        expect(screen.getByText('暂无数据')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
    });

    it('localizes Select listbox from Provider without changing its explicit trigger label', async () => {
        const user = userEvent.setup();
        render(
            <FresnicaUiProvider locale={enUS}>
                <Select options={[{ key: 'one', label: 'One' }]} value="" onChange={() => undefined} />
            </FresnicaUiProvider>
        );

        await user.click(screen.getByRole('combobox'));
        expect(await screen.findByRole('listbox', { name: 'Select options' })).toBeInTheDocument();
    });

    it('localizes navigation and content primitives from Provider', () => {
        render(
            <FresnicaUiProvider locale={enUS}>
                <Carousel>
                    <span>One</span>
                    <span>Two</span>
                </Carousel>
                <Pagination total={24} showTotal />
                <CodeBlock code="const value = 1" />
            </FresnicaUiProvider>
        );

        expect(screen.getByRole('region', { name: 'Carousel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
        expect(screen.getByText('24 items')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
    });

    it('localizes DatePicker and TimePicker internal controls from Provider', () => {
        const { unmount } = render(
            <FresnicaUiProvider locale={enUS}>
                <DatePicker open aria-label="Date" />
            </FresnicaUiProvider>
        );

        expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
        unmount();

        render(
            <FresnicaUiProvider locale={enUS}>
                <TimePicker open aria-label="Time" />
            </FresnicaUiProvider>
        );

        expect(screen.getByRole('dialog', { name: 'Select time' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Now' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
});
