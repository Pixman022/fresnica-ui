import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronDown,
    CircleHelp,
    Clock3,
    FileLock2,
    Globe2,
    KeyRound,
    Menu,
    Network,
    ShieldCheck,
    WalletCards,
    X,
} from 'lucide-react';
import fresnicaLogo from '../demo/img/fresnica/fresnica-logo-light.png';
import './site.css';

type Language = 'en' | 'zh';

const copy = {
    en: {
        nav: ['The wallet', 'Your data', 'Get Fresnica'],
        language: '中文',
        menu: 'Open navigation',
        close: 'Close navigation',
        kicker: 'Your Stellar, in your hands.',
        title: 'A wallet that moves at your pace.',
        intro: 'From your first account to the latest transaction, Fresnica keeps your Stellar essentials close and clear.',
        primary: 'Meet your wallet',
        secondary: 'Find your platform',
        note: 'Encrypted on your device. Never uploaded.',
        ledgerLabel: 'Wallet ledger',
        ledgerState: 'Stellar Testnet · demo',
        total: 'Total balance',
        account: 'Personal account',
        localFile: 'Local wallet file',
        protected: 'Password protected',
        recent: 'Recent activity',
        received: 'Received XLM',
        trustline: 'Trustline updated',
        flowKicker: 'Made for the flow of your funds',
        flowTitle: 'Know what’s yours. See where it goes.',
        flowIntro: 'A considered path through the things a wallet is here to do.',
        flow: [
            [
                '01',
                'Wallet',
                'Begin with your account',
                'Create or import accounts, then move between them with ease.',
                'accounts',
            ],
            [
                '02',
                'Assets',
                'Every asset has a place',
                'See your balances and manage the Trustlines connected to your account.',
                'assets',
            ],
            [
                '03',
                'Send',
                'Make every payment intentional',
                'Review the destination, amount, and Memo before signing.',
                'send',
            ],
            [
                '04',
                'Activity',
                'The details stay in view',
                'Revisit your transactions and open each one to see the details.',
                'activity',
            ],
        ],
        securityKicker: 'Control starts with where it lives',
        securityTitle: 'Your wallet stays yours.',
        securityBody:
            'Fresnica stores the wallet as a JSON file encrypted with your password. It stays on your device and is not uploaded. Fresnica does not custody your assets.',
        securityFacts: ['Password-encrypted', 'Stored on your device', 'No asset custody'],
        downloadKicker: 'Your next step',
        downloadTitle: 'Fresnica is finding its way to you.',
        downloadBody: 'Platform links will appear here as they become available.',
        android: 'Android',
        apk: 'APK download',
        play: 'Google Play',
        ios: 'iOS',
        soon: 'Coming soon',
        faqTitle: 'A few things worth knowing',
        faq: [
            [
                'Where does my wallet live?',
                'Your encrypted wallet file stays on your device. Fresnica does not upload it.',
            ],
            ['Does Fresnica hold my assets?', 'No. Fresnica does not custody your assets.'],
            [
                'Where can I use Fresnica?',
                'Android is the current platform direction. APK, Google Play, and iOS availability will be updated here when confirmed.',
            ],
        ],
        footer: 'Your Stellar wallet, on your terms.',
        status: 'Illustrative interface',
    },
    zh: {
        nav: ['钱包', '你的数据', '获取 Fresnica'],
        language: 'English',
        menu: '打开导航',
        close: '关闭导航',
        kicker: '你的 Stellar，由你掌握。',
        title: '按照你的节奏，管理每一次 Stellar 交互。',
        intro: '从账户到最新交易，Fresnica 让 Stellar 使用中的重要信息清晰可见。',
        primary: '认识你的钱包',
        secondary: '查看支持平台',
        note: '在你的设备上加密保存，不会上传。',
        ledgerLabel: '钱包账本',
        ledgerState: 'Stellar Testnet · 示例',
        total: '总余额',
        account: '个人账户',
        localFile: '本地钱包文件',
        protected: '密码保护',
        recent: '最近活动',
        received: '收到 XLM',
        trustline: 'Trustline 已更新',
        flowKicker: '为资产流动而设计',
        flowTitle: '看清所持资产，也看清每一步去向。',
        flowIntro: '围绕钱包真正要做的事，带来清晰连贯的使用体验。',
        flow: [
            ['01', 'Wallet', '从你的账户开始', '创建或导入账户，在需要时轻松切换。', 'accounts'],
            ['02', 'Assets', '每项资产，各有其位', '查看资产余额，管理账户关联的 Trustline。', 'assets'],
            ['03', 'Send', '让每笔付款，都经过确认', '签名前，核对收款地址、金额与 Memo。', 'send'],
            ['04', 'Activity', '交易脉络，随时可查', '回看交易记录，打开每笔活动了解详情。', 'activity'],
        ],
        securityKicker: '掌控，从数据存放之处开始',
        securityTitle: '钱包，由你保管。',
        securityBody:
            'Fresnica 将钱包保存为由你的密码加密的 JSON 文件。文件保存在设备本地，不会上传。Fresnica 官方不托管你的资产。',
        securityFacts: ['密码加密', '保存在你的设备上', '官方不托管资产'],
        downloadKicker: '下一步，由你选择',
        downloadTitle: 'Fresnica 正在前往你的设备。',
        downloadBody: '各平台下载链接将在正式提供后更新。',
        android: 'Android',
        apk: 'APK 下载',
        play: 'Google Play',
        ios: 'iOS',
        soon: '即将推出',
        faqTitle: '你可能想了解',
        faq: [
            ['钱包文件保存在哪里？', '加密后的钱包文件保存在你的设备上，Fresnica 不会上传。'],
            ['Fresnica 会托管我的资产吗？', '不会。Fresnica 官方不托管你的资产。'],
            [
                '我可以在哪些平台使用 Fresnica？',
                '当前平台方向为 Android。APK、Google Play 与 iOS 的正式状态确认后，会在这里更新。',
            ],
        ],
        footer: '你的 Stellar 钱包，按你的方式使用。',
        status: '界面示意',
    },
} as const;

const flowIcons = [WalletCards, Network, ArrowUpRight, Clock3];

function BrandLogo() {
    return <img className="brand-logo" src={fresnicaLogo} alt="Fresnica" />;
}

function Website() {
    const [language, setLanguage] = useState<Language>(() =>
        localStorage.getItem('fresnica-site-language') === 'zh' ? 'zh' : 'en'
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const t = copy[language];

    useEffect(() => {
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
        document.title = language === 'zh' ? 'Fresnica — Stellar 钱包' : 'Fresnica — Stellar wallet';
        localStorage.setItem('fresnica-site-language', language);
    }, [language]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="site-shell">
            <header className="site-header">
                <a className="brand" href="#top" onClick={closeMenu} aria-label="Fresnica home">
                    <BrandLogo />
                </a>
                <button
                    className="menu-toggle"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? t.close : t.menu}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
                    <a href="#product" onClick={closeMenu}>
                        {t.nav[0]}
                    </a>
                    <a href="#security" onClick={closeMenu}>
                        {t.nav[1]}
                    </a>
                    <a href="#download" onClick={closeMenu}>
                        {t.nav[2]}
                    </a>
                    <button
                        className="language-button"
                        type="button"
                        onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                    >
                        <Globe2 size={15} /> {t.language}
                    </button>
                </nav>
            </header>

            <main>
                <section className="hero section-wrap" id="top">
                    <div className="hero-copy">
                        <p className="hero-kicker">
                            <span />
                            {t.kicker}
                        </p>
                        <h1>{t.title}</h1>
                        <p className="hero-intro">{t.intro}</p>
                        <div className="hero-actions">
                            <a className="button-primary" href="#product">
                                {t.primary}
                                <ArrowRight size={17} />
                            </a>
                            <a className="button-quiet" href="#download">
                                {t.secondary}
                            </a>
                        </div>
                        <p className="hero-note">
                            <FileLock2 size={15} /> {t.note}
                        </p>
                    </div>
                    <div className="ledger-stage" aria-label={t.status}>
                        <div className="ledger-backdrop" />
                        <div className="ledger-panel">
                            <div className="ledger-head">
                                <span className="ledger-title">
                                    <span className="ledger-mark">
                                        <WalletCards size={14} />
                                    </span>
                                    {t.ledgerLabel}
                                </span>
                                <span className="ledger-state">
                                    <i />
                                    {t.ledgerState}
                                </span>
                            </div>
                            <div className="ledger-balance">
                                <span>{t.total}</span>
                                <strong>
                                    1,248.50 <small>XLM</small>
                                </strong>
                                <div>
                                    <span className="account-avatar">F</span>
                                    {t.account}
                                    <ChevronDown size={13} />
                                </div>
                            </div>
                            <div className="ledger-line" />
                            <div className="ledger-meta">
                                <span>
                                    <FileLock2 size={14} />
                                    <b>{t.localFile}</b>
                                    <small>{t.protected}</small>
                                </span>
                                <span className="ledger-check">
                                    <Check size={13} />
                                </span>
                            </div>
                            <div className="ledger-line" />
                            <div className="activity-head">
                                <b>{t.recent}</b>
                                <span>24h</span>
                            </div>
                            <div className="activity-row">
                                <span className="activity-icon receive">
                                    <ArrowDownLeft size={16} />
                                </span>
                                <span>
                                    <b>{t.received}</b>
                                    <small>Today · 09:42</small>
                                </span>
                                <strong>+120.00</strong>
                            </div>
                            <div className="activity-row">
                                <span className="activity-icon trust">
                                    <Network size={15} />
                                </span>
                                <span>
                                    <b>{t.trustline}</b>
                                    <small>Yesterday · 18:06</small>
                                </span>
                                <strong className="neutral">USDC</strong>
                            </div>
                        </div>
                        <div className="ledger-caption">
                            <span>{t.status}</span>
                            <span>FRESNICA / 01</span>
                        </div>
                    </div>
                </section>

                <section className="flow-section section-wrap" id="product">
                    <div className="flow-heading">
                        <div>
                            <p className="section-kicker">{t.flowKicker}</p>
                            <h2>{t.flowTitle}</h2>
                        </div>
                        <p>{t.flowIntro}</p>
                    </div>
                    <div className="flow-list">
                        {t.flow.map(([number, name, title, body, key], index) => {
                            const Icon = flowIcons[index];
                            return (
                                <article className="flow-row" key={key}>
                                    <span className="flow-number">{number}</span>
                                    <span className={`flow-icon flow-icon-${index}`}>
                                        <Icon size={20} />
                                    </span>
                                    <div className="flow-copy">
                                        <h3>
                                            {name}
                                            <span>{title}</span>
                                        </h3>
                                        <p>{body}</p>
                                    </div>
                                    <span className="flow-arrow">
                                        <ArrowRight size={18} />
                                    </span>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="security-section" id="security">
                    <div className="section-wrap security-inner">
                        <div className="security-emblem">
                            <KeyRound size={22} />
                            <span>
                                <Check size={12} />
                            </span>
                        </div>
                        <div className="security-copy">
                            <p className="section-kicker">{t.securityKicker}</p>
                            <h2>{t.securityTitle}</h2>
                            <p>{t.securityBody}</p>
                        </div>
                        <div className="security-facts">
                            {t.securityFacts.map((fact) => (
                                <div key={fact}>
                                    <ShieldCheck size={15} />
                                    {fact}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="download-section section-wrap" id="download">
                    <div className="download-copy">
                        <p className="section-kicker">{t.downloadKicker}</p>
                        <h2>{t.downloadTitle}</h2>
                        <p>{t.downloadBody}</p>
                    </div>
                    <div className="platform-list">
                        <div className="platform-row">
                            <span className="platform-logo android">A</span>
                            <span>
                                <b>{t.android}</b>
                            </span>
                            <em>{t.soon}</em>
                            <span aria-hidden="true" />
                        </div>
                        <div className="platform-row">
                            <span className="platform-logo apk">↓</span>
                            <span>
                                <b>{t.apk}</b>
                            </span>
                            <em>{t.soon}</em>
                            <span aria-hidden="true" />
                        </div>
                        <div className="platform-row">
                            <span className="platform-logo play">▶</span>
                            <span>
                                <b>{t.play}</b>
                            </span>
                            <em>{t.soon}</em>
                            <span aria-hidden="true" />
                        </div>
                        <div className="platform-row">
                            <span className="platform-logo apple">●</span>
                            <span>
                                <b>{t.ios}</b>
                            </span>
                            <em>{t.soon}</em>
                            <span aria-hidden="true" />
                        </div>
                    </div>
                </section>

                <section className="faq-section section-wrap">
                    <div className="faq-title">
                        <CircleHelp size={19} />
                        <h2>{t.faqTitle}</h2>
                    </div>
                    <div className="faq-list">
                        {t.faq.map(([question, answer], index) => (
                            <article className="faq-item" key={question}>
                                <button
                                    type="button"
                                    aria-expanded={openFaq === index}
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span>{question}</span>
                                    <ChevronDown size={17} />
                                </button>
                                {openFaq === index && <p>{answer}</p>}
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="site-footer section-wrap">
                <a className="brand" href="#top">
                    <BrandLogo />
                </a>
                <span>{t.footer}</span>
                <span>© 2026 Fresnica</span>
            </footer>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Website />
    </React.StrictMode>
);
