// 独立的轻量页面元信息，供 App 等场景静态导入，避免拉入整个 ComponentPage bundle
export const PAGE_INFO: Record<string, { title: string; desc: string }> = {
    'fresnica-home': {
        title: 'Fresnica 钱包首页',
        desc: '移动端钱包首页组合示例 — 主题 Logo、钱包操作、资产列表、Swap inverse 操作和固定底部导航',
    },
    'fresnica-swap': {
        title: 'Fresnica Swap 兑换',
        desc: '钱包兑换原稿示例 — 支付与获得资产、金额、方向切换、费率摘要和 Review Swap 操作',
    },
    'fresnica-transfer': {
        title: 'Fresnica Transfer 转账',
        desc: '资产发送原稿示例 — Stellar 网络、来源钱包、资产、可用余额、金额和底部操作',
    },
    'fresnica-activity': {
        title: 'Fresnica Activity 交易记录',
        desc: '钱包交易记录原稿示例 — 搜索、筛选、日期分组、交易方向、金额和底部导航',
    },
    'fresnica-settings': {
        title: 'Fresnica Settings 设置',
        desc: '原项目设置页示例 — Accounts、Address book、General、Advanced、Security 与帮助信息入口',
    },
    'fresnica-transaction-details': {
        title: 'Fresnica Transaction Details 交易详情',
        desc: '交易详情原稿示例 — 资产操作、发行方、余额上限、交易 ID、费用、Memo 与浏览器入口',
    },
    'fresnica-asset-details': {
        title: 'Fresnica Asset Details 资产详情',
        desc: '资产详情原稿 Modal Sheet — AQUA 余额、发行方、Send、Swap 与 Remove token 操作',
    },
    'fresnica-network-nodes': {
        title: 'Fresnica Network & Nodes 网络节点',
        desc: '网络与节点示例 — 主网/测试网切换、节点选择与自定义 Horizon 端点',
    },
    'fresnica-explore-dapps': {
        title: 'Fresnica Explore dApps 探索',
        desc: 'Stellar dApp 探索示例 — 分类筛选、推荐列表与 dApp 信息入口',
    },
    'fresnica-scan': {
        title: 'Fresnica Scan 扫描',
        desc: '原项目 Scan 操作面板 — 最近使用、Swap 快捷操作与 Scan QR code 入口',
    },
    button: {
        title: 'Button 按钮',
        desc: '按钮组件 — 支持 primary / dashed / text / link / inverse 类型，危险、处理中、禁用状态，Lucide 图标与 block 布局',
    },
    input: {
        title: 'Input 输入框',
        desc: '输入框组件 — 支持三种尺寸、clearable 清除、prefix / suffix 前后缀、error / warning 校验状态、disabled 禁用',
    },
    switch: {
        title: 'Switch 开关',
        desc: '开关组件 — 支持受控 / 非受控、自定义文案、small 尺寸、loading 状态',
    },
    card: {
        title: 'Card 卡片',
        desc: '卡片容器组件 — 支持 default / dashed 层级、语义色与可交互状态',
    },
    collapse: {
        title: 'Collapse 折叠面板',
        desc: '折叠面板组件 — 支持展开/收起、默认展开、禁用状态',
    },
    cursor: {
        title: 'Cursor 光标',
        desc: '桌面端语义光标容器 — 统一链接、按钮、输入框与禁用状态的原生光标反馈',
    },
    footer: {
        title: 'Footer 页脚',
        desc: '轻量页脚组件，支持默认与紧凑布局',
    },
    modal: {
        title: 'Modal 弹窗',
        desc: '模态弹窗组件 — 标准矩形表面、支持标题、关闭按钮、自定义 Footer、ESC / 遮罩关闭、自定义遮罩样式',
    },
    drawer: {
        title: 'Drawer 抽屉',
        desc: '下沉景深抽屉组件 — 背景下沉 + 缩放 + 降亮突出主体，支持 left/right/top/bottom 四个方向、自定义宽高、ESC / 遮罩关闭',
    },
    typewriter: {
        title: 'Typewriter 打字机',
        desc: '打字机组件 — 按字符逐个显示文本，支持多行与 ReactNode 富内容，不改变原有样式',
    },
    icon: {
        title: 'Icon 图标',
        desc: '基于 Lucide 的统一图标组件，支持钱包、转账、扫描等常用语义',
    },
    color: {
        title: 'Color 配色',
        desc: 'Fresnica 颜色角色、主题差异、语义搭配、前景对比度与使用规则',
    },
    layout: {
        title: 'Layout 布局规范',
        desc: 'Fresnica 间距、圆角与控件高度规范 — 使用现有 Token 统一页面和组件的几何节奏',
    },
    select: {
        title: 'Select 选择器',
        desc: '下拉选择器组件 — 支持自定义选项列表，高亮当前选中项',
    },
    'date-picker': {
        title: 'DatePicker 日期选择',
        desc: '日期选择组件 — 年/月/日三级面板切换与开始~结束范围选择，支持受控/非受控、三种尺寸、allowClear 清空、disabledDate 禁用日期、自定义格式与键盘导航',
    },
    'time-picker': {
        title: 'TimePicker 时间选择',
        desc: '时间选择组件 — 时/分/秒三列滚选，此刻/确定快捷操作，支持受控/非受控、自定义格式、时/分/秒步进、allowClear 清空与键盘导航',
    },
    tabs: {
        title: 'Tabs 标签页',
        desc: '标签页组件 — 支持受控/非受控模式切换',
    },
    checkbox: {
        title: 'Checkbox 多选框',
        desc: '多选框组件 — 支持受控/非受控、水平/垂直排列、三种尺寸、禁用单项或全部禁用',
    },
    radio: {
        title: 'Radio 单选框',
        desc: '单选框组件 — 支持受控/非受控、水平/垂直排列、三种尺寸、禁用单项或全部禁用',
    },
    tooltip: {
        title: 'Tooltip 气泡提示',
        desc: '气泡提示组件 — 支持 12 个方向、hover/click/focus 三种触发，标准与强调两种风格',
    },
    title: {
        title: 'Title 字体',
        desc: 'Fresnica 字体规范 — 字体族、字号层级、字重、行高与语义配色',
    },
    codeblock: {
        title: 'CodeBlock 代码高亮',
        desc: '代码高亮组件 — JSX/TS 语法高亮，支持一键复制、自定义样式和类名',
    },
    loading: {
        title: 'Loading 加载',
        desc: '钱包加载状态组件，支持自定义文案、样式和类名',
    },
    table: {
        title: 'Table 表格',
        desc: '数据表格组件，支持交替行背景、边框、加载状态、内置分页等常用功能',
    },
    pagination: {
        title: 'Pagination 分页',
        desc: '分页组件 — 支持受控/非受控、每页条数切换、快速跳转、总条数展示，可配合 Table 使用',
    },
    tag: {
        title: 'Tag 标签',
        desc: '标签组件 — 支持四种视觉层级、七种语义颜色与三种尺寸，可关闭、可点击',
    },
    notification: {
        title: 'Notification 通知',
        desc: '命令式通知组件 — 4 种 type (success/info/warning/error) × 6 个 position，支持 description / btn / onClick / onClose，显式 key 二次调用会更新现有通知',
    },
    progress: {
        title: 'Progress 进度条',
        desc: '主题绿色渐变进度条 — 3 档 size，支持 inside/right/top 三种文字位置、自定义格式化与 duration 宽度过渡',
    },
    form: {
        title: 'Form 表单',
        desc: '表单组件 — 支持 useForm 命令式实例、多种校验规则、三种布局（horizontal / vertical / inline）、labelCol / wrapperCol 网格',
    },
    skeleton: {
        title: 'Skeleton 骨架屏',
        desc: '骨架屏加载占位组件 — 四种变体（text / circle / rect / paragraph），包含 Skeleton.Button / Skeleton.Input / Skeleton.Avatar 子组件，支持 loading 切换动画',
    },
    'empty-state': {
        title: 'EmptyState 空状态',
        desc: '通用空状态组件：区分无内容与加载/错误状态，支持说明、尺寸和下一步操作',
    },
    'error-state': {
        title: 'ErrorState 错误状态',
        desc: '通用错误状态组件：提供可恢复的错误说明、重试或返回操作',
    },
    backtop: {
        title: 'BackTop 返回顶部',
        desc: '返回顶部组件，支持全局/容器内滚动、自定义显示高度、自定义图标、平滑动画',
    },
    image: {
        title: 'Image 图片',
        desc: '图片组件 — 中性媒体容器与错误占位，支持懒加载、点击预览和 Lucide 关闭图标',
    },
    carousel: {
        title: 'Carousel 轮播图',
        desc: '轮播图组件 — 支持受控/非受控索引、自动播放、首尾循环、箭头/圆点和完整键盘导航',
    },
    skill: {
        title: 'Skill 介绍',
        desc: '项目配套的 fresnica-ui-style 技能 — 提供 Fresnica 钱包页面与组件的实现规范',
    },
};
