// 全局样式
import './styles/index.less';

export {
    FresnicaThemeProvider,
    useFresnicaTheme,
    applyFresnicaTheme,
    deriveFresnicaThemeTokens,
    getFresnicaThemeAdjustment,
    normalizeThemeColor,
    DEFAULT_PRIMARY_COLOR,
    FRESNICA_THEME_STORAGE_KEY,
    FRESNICA_THEME_VARIABLES,
    getStoredFresnicaThemeMode,
} from './theme';
export type {
    FresnicaThemeMode,
    FresnicaThemeAdjustment,
    FresnicaThemeSnapshot,
    FresnicaThemeTokens,
    FresnicaThemeProviderProps,
    FresnicaThemeContextValue,
} from './theme';

// ============================================
// 基础 UI 组件
// ============================================
export { Button } from './components/Button';
export type { ButtonProps, ButtonType, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps, InputSize } from './components/Input';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchSize } from './components/Switch';

export { Modal } from './components/Modal';
export type { ModalProps, ModalVariant } from './components/Modal';

export { Drawer } from './components/Drawer';
export type { DrawerPlacement, DrawerProps, DrawerVariant } from './components/Drawer';

export { Card } from './components/Card';
export type { CardProps, CardType, CardColor } from './components/Card';

export { Footer } from './components/Footer';
export type { FooterProps, FooterType } from './components/Footer';

export { Collapse } from './components/Collapse';
export type { CollapseProps } from './components/Collapse';

export { Cursor } from './components/Cursor';
export type { CursorProps } from './components/Cursor';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { Typewriter } from './components/Typewriter';
export type { TypewriterProps } from './components/Typewriter';

export { Icon, ICON_LIST } from './components/Icon';
export type { IconProps, IconName } from './components/Icon';

export { Select } from './components/Select';
export type { SelectPlacement, SelectProps, SelectOption } from './components/Select';

export { DatePicker } from './components/DatePicker';
export type { DatePickerProps, DatePickerSize, DatePickerStatus, DatePickerValue } from './components/DatePicker';

export { TimePicker } from './components/TimePicker';
export type { TimePickerProps, TimePickerSize, TimePickerStatus, TimePart } from './components/TimePicker';

export { Tabs } from './components/Tabs';
export type { TabItem, TabsProps, TabsSize, TabsVariant } from './components/Tabs';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps, CheckboxOption, CheckboxSize } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps, RadioOption, RadioSize } from './components/Radio';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipPlacement, TooltipTrigger, TooltipVariant } from './components/Tooltip';

export { Form, FormItem, useForm } from './components/Form';
export type {
    ColProps,
    FieldData,
    FormInstance,
    FormItemLayout,
    FormItemProps,
    FormLabelAlign,
    FormLayout,
    FormProps,
    FormSize,
    NamePath,
    RequiredMark,
    RuleObject,
    RuleRender,
    RuleType,
    Rules,
    ScrollOptions,
    ValidateError,
    ValidateInfo,
    ValidateStatus,
} from './components/Form';

export { Title } from './components/Title';
export type { TitleProps, TitleSize, TitleColor, TitleVariant, TitleElement } from './components/Title';

export { CodeBlock } from './components/CodeBlock';
export type { CodeBlockProps } from './components/CodeBlock';

export { Loading } from './components/Loading';
export type { LoadingProps } from './components/Loading';

export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps, EmptyStateSize } from './components/EmptyState';

export { ErrorState } from './components/ErrorState';
export type { ErrorStateProps, ErrorStateSize } from './components/ErrorState';

export { Table } from './components/Table';
export type { TableProps, TableColumn } from './components/Table';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

export { Tag } from './components/Tag';
export type { TagProps, TagSize, TagVariant, TagColor } from './components/Tag';

export {
    Notification,
    notificationOpen,
    notificationDestroy,
    NOTIFICATION_DEFAULT_DURATION,
} from './components/Notification';
export type {
    NotificationStatic,
    NotificationConfig,
    NotificationType,
    NotificationPosition,
    NotificationPlacement,
    NotificationVariant,
    NotificationItem,
} from './components/Notification';

export { Progress } from './components/Progress';
export type { ProgressProps, ProgressSize, ProgressInfoPosition } from './components/Progress';

// ============================================
// 新增组件
// ============================================
export { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from './components/Skeleton';
export type {
    SkeletonProps,
    SkeletonVariant,
    SkeletonButtonProps,
    SkeletonInputProps,
    SkeletonAvatarProps,
} from './components/Skeleton';

export { BackTop } from './components/BackTop';
export type { BackTopProps } from './components/BackTop';

export { Image } from './components/Image';
export type { ImageProps, ImageColor } from './components/Image';

export { Carousel } from './components/Carousel';
export type { CarouselProps } from './components/Carousel';

// Fresnica wallet business components
export { BalanceCard } from './components/BalanceCard';
export type { BalanceCardProps } from './components/BalanceCard';

export { AssetRow } from './components/AssetRow';
export type { AssetRowProps } from './components/AssetRow';

export { TransactionRow } from './components/TransactionRow';
export type {
    TransactionRowProps,
    TransactionStatus as TransactionRowStatus,
    TransactionAmountTone,
    TransactionDirection,
} from './components/TransactionRow';

export { AssetIcon } from './components/AssetIcon';
export type { AssetIconProps } from './components/AssetIcon';
export { NetworkBadge } from './components/NetworkBadge';
export type { NetworkBadgeProps, NetworkBadgeSize, NetworkStatus } from './components/NetworkBadge';
export { WalletSwitcher } from './components/WalletSwitcher';
export type { WalletSwitcherProps } from './components/WalletSwitcher';
export { QuickAction } from './components/QuickAction';
export type { QuickActionProps, QuickActionSize, QuickActionVariant } from './components/QuickAction';
export { TransactionStatus } from './components/TransactionStatus';
export type { TransactionStatusProps, TransactionStatusValue } from './components/TransactionStatus';
export { AddressField } from './components/AddressField';
export type { AddressFieldMode, AddressFieldProps, AddressFieldStatus } from './components/AddressField';
export { AmountField } from './components/AmountField';
export type { AmountFieldProps, AmountFieldStatus } from './components/AmountField';
export { FeeSummary } from './components/FeeSummary';
export type { FeeSummaryProps, FeeSummaryItem } from './components/FeeSummary';
export { SwapRoute } from './components/SwapRoute';
export type { SwapRouteProps } from './components/SwapRoute';
export { BottomNavigation } from './components/BottomNavigation';
export type {
    BottomNavigationItem,
    BottomNavigationPosition,
    BottomNavigationProps,
} from './components/BottomNavigation';
export { TransactionDetails } from './components/TransactionDetails';
export type { TransactionDetailsProps, TransactionDetailField } from './components/TransactionDetails';
