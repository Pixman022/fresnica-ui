import type { ReactNode } from 'react';

export interface UiLocale {
    close: string;
    loading: string;
    confirm: ReactNode;
    cancel: ReactNode;
    clear: string;
    selectMenu: string;
    emptyState: ReactNode;
    loadingState: string;
    notificationClose: string;
    codeCopy: string;
    codeCopied: string;
    codeCopyError: string;
    codeCopyLabel: string;
    imageLoadFailed: string;
    imagePreview: string;
    closePreview: string;
    carousel: string;
    previousSlide: string;
    nextSlide: string;
    selectSlide: string;
    goToSlide: (index: number, count: number) => string;
    pauseAutoplay: string;
    resumeAutoplay: string;
    pagination: string;
    previousPage: string;
    nextPage: string;
    pageSizeLabel: (size: number) => string;
    pageSizeOption: (size: number) => string;
    pageSizeMenu: string;
    pageCount: (total: number) => string;
    jumpToPage: string;
    jumpToPagePrefix: string;
    jumpToPageSuffix: string;
    footer: ReactNode;
    today: ReactNode;
    now: ReactNode;
    clearDate: string;
    clearTime: string;
    selectDate: string;
    selectDateRange: string;
    selectTime: string;
    previousYear: string;
    previousMonth: string;
    nextMonth: string;
    nextYear: string;
    hour: string;
    minute: string;
    second: string;
    weekdays: string[];
    months: string[];
    dateLabel: (year: number, month: number, day: number) => string;
    monthLabel: (month: number) => string;
    yearLabel: (year: number) => string;
}

export type UiLocaleOverrides = Partial<UiLocale>;

export const enUS: UiLocale = {
    close: 'Close',
    loading: 'Loading',
    confirm: 'Confirm',
    cancel: 'Cancel',
    clear: 'Clear',
    selectMenu: 'Select options',
    emptyState: 'No data',
    loadingState: 'Loading',
    notificationClose: 'Close notification',
    codeCopy: 'Copy',
    codeCopied: 'Copied',
    codeCopyError: 'Copy failed',
    codeCopyLabel: 'Copy code',
    imageLoadFailed: 'Image failed to load',
    imagePreview: 'View image',
    closePreview: 'Close preview',
    carousel: 'Carousel',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    selectSlide: 'Select slide',
    goToSlide: (index, count) => `Go to slide ${index} of ${count}`,
    pauseAutoplay: 'Pause autoplay',
    resumeAutoplay: 'Resume autoplay',
    pagination: 'Pagination',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pageSizeLabel: (size) => `${size} items per page`,
    pageSizeOption: (size) => `${size} / page`,
    pageSizeMenu: 'Select page size',
    pageCount: (total) => `${total} items`,
    jumpToPage: 'Jump to page',
    jumpToPagePrefix: 'Go to',
    jumpToPageSuffix: 'page',
    footer: 'Fresnica · Stellar wallet interface',
    today: 'Today',
    now: 'Now',
    clearDate: 'Clear date',
    clearTime: 'Clear time',
    selectDate: 'Select date',
    selectDateRange: 'Select date range',
    selectTime: 'Select time',
    previousYear: 'Previous year',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    nextYear: 'Next year',
    hour: 'hour',
    minute: 'minute',
    second: 'second',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dateLabel: (year, month, day) => `${year}-${month}-${day}`,
    monthLabel: (month) => `Month ${month}`,
    yearLabel: (year) => `Year ${year}`,
};

export const zhCN: UiLocale = {
    close: '关闭',
    loading: '加载中',
    confirm: '确定',
    cancel: '取消',
    clear: '清除',
    selectMenu: '选择选项',
    emptyState: '暂无数据',
    loadingState: '加载中',
    notificationClose: '关闭通知',
    codeCopy: '复制',
    codeCopied: '已复制',
    codeCopyError: '复制失败',
    codeCopyLabel: '复制代码',
    imageLoadFailed: '图片加载失败',
    imagePreview: '查看图片',
    closePreview: '关闭预览',
    carousel: '轮播图',
    previousSlide: '上一张',
    nextSlide: '下一张',
    selectSlide: '选择轮播页',
    goToSlide: (index, count) => `转到第 ${index} 张，共 ${count} 张`,
    pauseAutoplay: '暂停自动播放',
    resumeAutoplay: '继续自动播放',
    pagination: '分页',
    previousPage: '上一页',
    nextPage: '下一页',
    pageSizeLabel: (size) => `每页 ${size} 条`,
    pageSizeOption: (size) => `${size} 条/页`,
    pageSizeMenu: '选择每页条数',
    pageCount: (total) => `共 ${total} 条`,
    jumpToPage: '跳转到指定页',
    jumpToPagePrefix: '跳至',
    jumpToPageSuffix: '页',
    footer: 'Fresnica · Stellar wallet interface',
    today: '今天',
    now: '此刻',
    clearDate: '清除日期',
    clearTime: '清除时间',
    selectDate: '选择日期',
    selectDateRange: '选择日期范围',
    selectTime: '选择时间',
    previousYear: '上一年',
    previousMonth: '上个月',
    nextMonth: '下个月',
    nextYear: '下一年',
    hour: '时',
    minute: '分',
    second: '秒',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    dateLabel: (year, month, day) => `${year}年${month}月${day}日`,
    monthLabel: (month) => `${month}月`,
    yearLabel: (year) => `${year}年`,
};
