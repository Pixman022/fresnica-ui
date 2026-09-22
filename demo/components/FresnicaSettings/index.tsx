import React from 'react';
import {
    Activity,
    BookUser,
    ChevronRight,
    CircleHelp,
    FileText,
    Info,
    PanelsTopLeft,
    Shield,
    SlidersHorizontal,
} from 'lucide-react';
import { DemoTag, sectionStyle, sectionTitleStyle } from '../../tools';
import FresnicaNavigation from '../FresnicaNavigation';

const groups = [
    [
        { label: 'Accounts', icon: PanelsTopLeft },
        { label: 'Address book', icon: BookUser },
    ],
    [
        { label: 'General', icon: SlidersHorizontal },
        { label: 'Advanced', icon: Activity },
    ],
    [{ label: 'Security', icon: Shield }],
    [
        { label: 'Questions & Support', icon: CircleHelp },
        { label: 'Terms & Conditions', icon: FileText },
        { label: 'About', icon: Info },
    ],
];

const FresnicaSettingsDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Settings <DemoTag>原项目信息架构</DemoTag>
        </div>
        <div
            style={{
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--Fresnica-surface)',
                color: 'var(--Fresnica-text-color)',
            }}
        >
            <header style={{ padding: 'var(--Fresnica-spacing-xl)' }}>
                <h2 style={{ margin: 0, fontSize: 'var(--Fresnica-font-size-screen-title)' }}>Settings</h2>
            </header>
            <main
                style={{
                    flex: 1,
                    display: 'grid',
                    alignContent: 'start',
                    padding: '0 var(--Fresnica-spacing-xl) var(--Fresnica-spacing-xl)',
                }}
            >
                {groups.map((group, groupIndex) => (
                    <section
                        key={group[0].label}
                        style={{
                            padding: 'var(--Fresnica-spacing-sm) 0',
                            borderBottom:
                                groupIndex < groups.length - 1
                                    ? '1px solid var(--Fresnica-border-color-light)'
                                    : undefined,
                        }}
                    >
                        {group.map(({ label, icon: Icon }) => (
                            <button key={label} type="button" style={settingRowStyle}>
                                <Icon aria-hidden="true" size={25} strokeWidth={2} />
                                <span>{label}</span>
                                <ChevronRight
                                    aria-hidden="true"
                                    size={22}
                                    style={{ marginLeft: 'auto', color: 'var(--Fresnica-text-color-secondary)' }}
                                />
                            </button>
                        ))}
                    </section>
                ))}
            </main>
            <div
                style={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 5,
                    background: 'var(--Fresnica-surface)',
                }}
            >
                <FresnicaNavigation activeKey="settings" />
            </div>
        </div>
    </div>
);

const settingRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--Fresnica-spacing-lg)',
    width: '100%',
    minHeight: 68,
    padding: 'var(--Fresnica-spacing-md) var(--Fresnica-spacing-sm)',
    border: 0,
    borderRadius: 'var(--Fresnica-border-radius-control)',
    background: 'transparent',
    color: 'var(--Fresnica-text-color)',
    font: 'inherit',
    fontSize: 'var(--Fresnica-font-size-lg)',
    textAlign: 'left',
    cursor: 'pointer',
};

export default FresnicaSettingsDemo;
