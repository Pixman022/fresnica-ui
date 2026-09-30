import { render, screen } from '@testing-library/react';
import { AmountField } from './AmountField';
import { AddressField } from './AddressField';
import { BalanceCard } from './BalanceCard';
import { Modal } from './Modal';
import { NetworkBadge } from './NetworkBadge';
import { TransactionStatus } from './TransactionStatus';
import { Carousel } from './Carousel';
import { CodeBlock } from './CodeBlock';
import { Footer } from './Footer';
import { Loading } from './Loading';
import { Pagination } from './Pagination';
import { Table } from './Table';
import { NotificationView } from './Notification/Notification';

describe('component labels contract', () => {
    it('supports localized labels on wallet fields and status components', () => {
        render(
            <>
                <AmountField
                    balance="12"
                    onMax={() => undefined}
                    labels={{ max: '全部', balance: '余额', selectAsset: '选择资产' }}
                    currency="XLM"
                    onCurrencyClick={() => undefined}
                />
                <AddressField
                    value="GTEST"
                    labels={{ copyAddress: '复制地址', copiedAddress: '已复制', pasteAddress: '粘贴地址' }}
                    onPasteClick={() => undefined}
                />
                <TransactionStatus status="success" labels={{ completed: '已完成' }} />
                <NetworkBadge network="Stellar" status="offline" showStatusText labels={{ offline: '离线' }} />
                <BalanceCard balance="12" hidden labels={{ totalBalance: '总余额', balanceHidden: '余额已隐藏' }} />
            </>
        );

        expect(screen.getByRole('button', { name: '全部' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '选择资产' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '复制地址' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '粘贴地址' })).toBeInTheDocument();
        expect(screen.getByText('余额 12')).toBeInTheDocument();
        expect(screen.getByText('已完成')).toBeInTheDocument();
        expect(screen.getByText('离线')).toBeInTheDocument();
        expect(screen.getByText('总余额')).toBeInTheDocument();
        expect(screen.getByLabelText('余额已隐藏')).toBeInTheDocument();
    });

    it('keeps explicit component props ahead of labels', () => {
        render(
            <>
                <AmountField onMax={() => undefined} maxLabel="Max now" labels={{ max: '全部' }} />
                <Modal
                    open
                    okText="Save now"
                    cancelText="Back now"
                    closeLabel="Close now"
                    labels={{ confirm: '确认', cancel: '返回', close: '关闭' }}
                    closable
                />
            </>
        );

        expect(screen.getByRole('button', { name: 'Max now' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save now' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back now' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close now' })).toBeInTheDocument();
    });

    it('supports labels on shared navigation, content, and feedback primitives', () => {
        render(
            <>
                <Carousel
                    labels={{
                        carousel: 'Featured items',
                        previousSlide: 'Previous item',
                        nextSlide: 'Next item',
                        selectSlide: 'Choose item',
                        goToSlide: (index, count) => `Item ${index} of ${count}`,
                    }}
                >
                    <span>One</span>
                    <span>Two</span>
                </Carousel>
                <Pagination
                    total={24}
                    showTotal
                    labels={{
                        pagination: 'Page navigation',
                        previousPage: 'Previous page',
                        nextPage: 'Next page',
                        pageCount: (total) => `${total} records`,
                    }}
                />
                <Loading labels={{ loading: 'Loading records' }} />
                <Footer labels={{ footer: 'Wallet footer' }} />
                <CodeBlock
                    code="const value = 1"
                    labels={{ codeCopy: 'Copy source', codeCopyLabel: 'Copy source code' }}
                />
                <Table columns={[{ title: 'Name', dataIndex: 'name' }]} labels={{ emptyState: 'No records' }} />
                <NotificationView
                    item={{
                        key: 'notice',
                        message: 'Saved',
                        type: 'success',
                        position: 'top',
                        placement: 'top',
                        createdAt: Date.now(),
                        duration: 0,
                        closeLabel: 'Dismiss notice',
                    }}
                    onRemove={() => undefined}
                />
            </>
        );

        expect(screen.getByRole('region', { name: 'Featured items' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous item' })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Page navigation' })).toBeInTheDocument();
        expect(screen.getByText('24 records')).toBeInTheDocument();
        expect(screen.getByText('Loading records')).toBeInTheDocument();
        expect(screen.getByText('Wallet footer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Copy source code' })).toBeInTheDocument();
        expect(screen.getByText('No records')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Dismiss notice' })).toBeInTheDocument();
    });
});
