import type { CardColor, IconName, TagColor } from '../../../src';

// ============================================
// Skill 介绍页数据 —— 事实来源：
//   skills/fresnica-ui-style/SKILL.md、README.md
// 改技能内容时同步此处
// ============================================

export const INTRO_TAGS = ['React + TypeScript', '46 个组件', 'Lucide 图标', 'CC BY-NC 4.0'];

export interface QuickStep {
    title: string;
    desc: string;
    code?: string;
}

/** 快速开始 —— 用户视角的三步 */
export const QUICK_STEPS: QuickStep[] = [
    {
        title: '安装技能',
        desc: '用 skills CLI 一键安装；或手动把 fresnica-ui-style/ 目录复制到代理的 skills 位置。',
        code: `# 方式一：skills CLI（推荐）\nskills add Pixman022/fresnica-ui\n\n# 方式二：手动复制到 Claude Code 的 skills 目录\n# cp -r fresnica-ui-style ~/.claude/skills/`,
    },
    {
        title: '正常提需求',
        desc: '无需记住任何指令。描述里出现「Fresnica 钱包风格」或指定用 fresnica-ui 搭页面时，代理会自动加载技能。',
        code: `# 对话里直接说即可\n用 fresnica-ui 做一个 Stellar 资产详情页：余额、活动与网络状态\n做一个 Fresnica 钱包风格的单文件 HTML 预览页，不要构建步骤`,
    },
    {
        title: '按规则验收',
        desc: '产出必须满足技能里的硬性规则：使用库组件与 var(--Fresnica-*) 令牌、绿色实心控件为白字、图标统一使用 Lucide，并验证亮暗主题。',
    },
];

export interface WorkflowStep {
    icon: IconName;
    title: string;
    desc: string;
}

/** 工作原理 —— 代理视角的五步 */
export const WORKFLOW: WorkflowStep[] = [
    {
        icon: 'shopping-bag',
        title: '装载',
        desc: '技能是纯文本知识包，没有可执行代码，安装后躺在代理的 skills 目录里',
    },
    {
        icon: 'message-circle',
        title: '触发',
        desc: '代理按 SKILL.md 的 description 匹配当前对话，命中才加载正文，不占用日常上下文',
    },
    {
        icon: 'settings',
        title: '路由',
        desc: 'React 项目读 react-project.md，单文件 HTML 读 standalone-html.md',
    },
    {
        icon: 'book-open',
        title: '对照 API',
        desc: 'props、合法取值、默认值逐个查 references/components/，杜绝凭印象编造',
    },
    {
        icon: 'palette',
        title: '产出',
        desc: '按令牌与硬性规则落地：中性表面、绿色主色、Roboto 字体与清晰的操作层级',
    },
];

export interface Scenario {
    title: string;
    icon: IconName;
    color: CardColor;
    agents: string[];
    desc: string;
    entry: string;
}

export const SCENARIOS: Scenario[] = [
    {
        title: 'React 项目',
        icon: 'palette',
        color: 'app-teal',
        agents: ['Claude Code', 'Codex', 'Cursor'],
        desc: '已安装 fresnica-ui npm 包的工程：代理以包内 TypeScript 声明为准搭页面，并用 --Fresnica-* 令牌做主题。',
        entry: 'references/react-project.md',
    },
    {
        title: '独立 HTML',
        icon: 'map',
        color: 'app-yellow',
        agents: ['任意兼容代理'],
        desc: '无 npm、无打包器：React 走 CDN + Babel 运行时，手写组件但镜像真实 API，产出单个 index.html。',
        entry: 'references/standalone-html.md',
    },
];

export const FRESNICA_GUIDE = `fresnica-ui-style/
├── SKILL.md                     # 入口：风格摘要、令牌、场景路由、硬性规则
├── SKILL.zh-CN.md               # 中文翻译（人工审阅用，代理只读 SKILL.md）
└── references/
    ├── react-project.md         # 场景一：React 项目 + npm 包
    ├── standalone-html.md       # 场景二：单文件 HTML，无构建
    └── components/              # 按分类维护的组件 props 参考`;

export interface CatalogRow {
    category: string;
    color: TagColor;
    components: string[];
    reference: string;
}

export const CATALOG: CatalogRow[] = [
    {
        category: 'General',
        color: 'app-teal',
        components: ['Button', 'Icon', 'Typewriter', 'Cursor'],
        reference: 'general.md',
    },
    {
        category: 'Layout',
        color: 'app-yellow',
        components: ['Card', 'Title', 'Divider', 'Collapse', 'Tabs'],
        reference: 'layout.md',
    },
    {
        category: 'Form controls',
        color: 'app-blue',
        components: ['Input', 'Switch', 'Checkbox', 'Radio', 'Select'],
        reference: 'form-controls.md',
    },
    {
        category: 'Form container',
        color: 'purple',
        components: ['Form', 'FormItem', 'useForm'],
        reference: 'Form.md',
    },
    { category: 'Overlays', color: 'purple', components: ['Modal', 'Drawer', 'Tooltip'], reference: 'overlays.md' },
    {
        category: 'Feedback',
        color: 'app-orange',
        components: ['Loading', 'Progress', 'Skeleton', 'BackTop'],
        reference: 'feedback.md',
    },
    { category: 'Notification', color: 'app-red', components: ['Notification'], reference: 'Notification.md' },
    {
        category: 'Data displays',
        color: 'app-teal',
        components: ['Table', 'CodeBlock', 'Tag'],
        reference: 'data-display.md',
    },
    {
        category: 'Wallet composition',
        color: 'default',
        components: ['BalanceCard', 'WalletSwitcher', 'NetworkBadge'],
        reference: 'data-display.md',
    },
];

export interface RuleGroup {
    title: string;
    icon: IconName;
    color: TagColor;
    rules: string[];
}

export const RULE_GROUPS: RuleGroup[] = [
    {
        title: 'API 纪律',
        icon: 'book-open',
        color: 'app-red',
        rules: [
            '绝不编造 props —— 每个 prop 必须出现在组件参考或包内 TS 声明中。',
            'Select 仅受控（options + value + onChange 全必填）；受控 Input / Switch / Checkbox / Radio 也必须带 onChange。',
            '优先库组件而非裸 HTML：不出现可见的原生 button / input / select / checkbox / radio。',
        ],
    },
    {
        title: '导入与工程',
        icon: 'map',
        color: 'app-blue',
        rules: [
            "样式只导入一次：应用入口 `import 'fresnica-ui/style'`，否则组件无样式。",
            '只从包根与 style 入口导入 —— 禁止深路径导入。',
            '禁止用 className / style 覆盖组件的颜色、圆角、阴影；自定义元素用 var(--Fresnica-*) 令牌上色。',
        ],
    },
    {
        title: '色彩与字体',
        icon: 'palette',
        color: 'purple',
        rules: [
            '所有绿色实心控件使用白色文字，亮暗主题保持一致。',
            '焦点环统一使用 --Fresnica-focus-color。',
            '字体为 Roboto + Noto Sans SC；字重不低于 400；UI 文本不用等宽字体（CodeBlock 除外）。',
        ],
    },
    {
        title: '形状与质感',
        icon: 'wrench',
        color: 'app-yellow',
        rules: [
            '控件使用 8–16px 圆角，卡片与浮层使用 16–24px 圆角。',
            '不使用层级投影；通过表面色差与 1px 描边表达层级。',
            'Fresnica 页面使用语义化文字标题与清晰层级；不要引入渐变或无业务价值的装饰。',
        ],
    },
    {
        title: '图标与动效',
        icon: 'camera',
        color: 'app-teal',
        rules: [
            '界面图标统一使用 Lucide；不使用 emoji、Unicode 字符或手写 SVG 控件。',
            '动效使用 cubic-bezier(0.4, 0, 0.2, 1)，时长 0.15–0.35s。',
        ],
    },
];

export interface TokenGroup {
    label: string;
    tokens: string[];
}

/** 有颜色的令牌 —— 渲染成色板 */
export const COLOR_TOKEN_GROUPS: TokenGroup[] = [
    {
        label: '主色 primary',
        tokens: [
            '--Fresnica-primary-color',
            '--Fresnica-primary-color-hover',
            '--Fresnica-primary-color-active',
            '--Fresnica-primary-color-bg',
        ],
    },
    {
        label: '状态色 status',
        tokens: ['--Fresnica-success-color', '--Fresnica-warning-color', '--Fresnica-error-color'],
    },
    {
        label: '文字色 text',
        tokens: ['--Fresnica-text-color', '--Fresnica-text-color-secondary', '--Fresnica-text-color-disabled'],
    },
    {
        label: '边框与背景 border / bg',
        tokens: [
            '--Fresnica-border-color',
            '--Fresnica-border-color-light',
            '--Fresnica-bg-color',
            '--Fresnica-bg-color-secondary',
        ],
    },
];

/** 非颜色令牌 —— 只列名字 */
export const SCALE_TOKEN_GROUPS: TokenGroup[] = [
    {
        label: '圆角',
        tokens: ['--Fresnica-border-radius-sm', '--Fresnica-border-radius-base', '--Fresnica-border-radius-lg'],
    },
    {
        label: '间距',
        tokens: [
            '--Fresnica-spacing-xs',
            '--Fresnica-spacing-sm',
            '--Fresnica-spacing-md',
            '--Fresnica-spacing-lg',
            '--Fresnica-spacing-xl',
        ],
    },
    {
        label: '阴影',
        tokens: ['--Fresnica-shadow-base'],
    },
    {
        label: '字体',
        tokens: [
            '--Fresnica-font-family',
            '--Fresnica-font-size-sm',
            '--Fresnica-font-size-base',
            '--Fresnica-font-size-lg',
        ],
    },
];
