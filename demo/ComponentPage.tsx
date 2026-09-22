import React from 'react';
import { Title, Typewriter } from '../src';
import TabsDemo from './components/Tabs';
import CheckboxDemo from './components/Checkbox';
import RadioDemo from './components/Radio';
import TitleDemo from './components/Title';
import IconDemo from './components/Icon/IconDemo';
import ColorDemo from './components/Color';
import LayoutDemo from './components/Layout';
import CodeBlockDemo from './components/CodeBlock';
import TableDemo from './components/Table/TableDemo';
import PaginationDemo from './components/Pagination';
import DrawerDemo from './components/Drawer/DrawerDemo';
import FormDemo from './components/Form';
import TagDemo from './components/Tag';
import NotificationDemo from './components/Notification';
import ProgressDemo from './components/Progress';
import SkeletonDemo from './components/Skeleton';
import EmptyStateDemo from './components/EmptyState';
import ErrorStateDemo from './components/ErrorState';
import BackTopDemo from './components/BackTop';
import ImageDemo from './components/Image';
import ButtonDemo from './components/Button';
import InputDemo from './components/Input';
import SwitchDemo from './components/Switch';
import CardDemo from './components/Card';
import CollapseDemo from './components/Collapse';
import ModalDemo from './components/Modal';
import TypewriterDemo from './components/Typewriter';
import SelectDemo from './components/Select';
import DatePickerDemo from './components/DatePicker';
import TimePickerDemo from './components/TimePicker';
import CarouselDemo from './components/Carousel';
import SkillDemo from './components/Skill';
import { PAGE_INFO } from './pageInfo';
const pageDescStyle: React.CSSProperties = {
    fontSize: 'var(--Fresnica-font-size-base)',
    color: 'var(--Fresnica-text-color-secondary)',
    marginBottom: 'var(--Fresnica-spacing-xl)',
};

// ============================================
// Page info & mapping
// ============================================

const PAGES: Record<string, React.FC> = {
    button: ButtonDemo,
    input: InputDemo,
    switch: SwitchDemo,
    card: CardDemo,
    collapse: CollapseDemo,
    modal: ModalDemo,
    drawer: DrawerDemo,
    typewriter: TypewriterDemo,
    select: SelectDemo,
    'date-picker': DatePickerDemo,
    'time-picker': TimePickerDemo,
    tabs: TabsDemo,
    checkbox: CheckboxDemo,
    radio: RadioDemo,
    title: TitleDemo,
    icon: IconDemo,
    color: ColorDemo,
    layout: LayoutDemo,
    codeblock: CodeBlockDemo,
    table: TableDemo,
    pagination: PaginationDemo,
    tag: TagDemo,
    notification: NotificationDemo,
    progress: ProgressDemo,
    form: FormDemo,
    skeleton: SkeletonDemo,
    'empty-state': EmptyStateDemo,
    'error-state': ErrorStateDemo,
    backtop: BackTopDemo,
    image: ImageDemo,
    carousel: CarouselDemo,
    skill: SkillDemo,
};

// ============================================
// ComponentPage
// ============================================
interface ComponentPageProps {
    activeKey: string;
}

const ComponentPage: React.FC<ComponentPageProps> = ({ activeKey }) => {
    const Page = PAGES[activeKey];
    const info = PAGE_INFO[activeKey];

    // 根据 activeKey 固定映射一种颜色，切换页面时变色但同一页面不随机抖动
    if (!Page || !info) return null;

    return (
        <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <Title variant="heading" as="h1" size="large" style={{ marginBottom: 30, marginLeft: 18 }}>
                {info.title}
            </Title>
            <div style={{ ...pageDescStyle, minHeight: 40 }}>
                <Typewriter key={activeKey} trigger={activeKey} speed={30}>
                    {info.desc}
                </Typewriter>
            </div>
            <Page />
        </div>
    );
};

export default ComponentPage;
