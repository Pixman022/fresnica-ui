import React from 'react';
import { Compass, History, Home, QrCode, Settings, type LucideIcon } from 'lucide-react';
import { BottomNavigation } from '../../../src';
import styles from './fresnica-navigation.module.less';

export type FresnicaNavKey = 'home' | 'activity' | 'scan' | 'explore' | 'settings';

const ROUTES: Record<FresnicaNavKey, string> = {
    home: '/fresnica-home',
    activity: '/fresnica-activity',
    scan: '/fresnica-scan',
    explore: '/fresnica-explore-dapps',
    settings: '/fresnica-settings',
};

const ICONS: Record<FresnicaNavKey, LucideIcon> = {
    home: Home,
    activity: History,
    scan: QrCode,
    explore: Compass,
    settings: Settings,
};

const LABELS: Record<FresnicaNavKey, string> = {
    home: 'Home',
    activity: 'Activity',
    scan: 'Scan',
    explore: 'Explore',
    settings: 'Settings',
};

export interface FresnicaNavigationProps {
    activeKey: FresnicaNavKey;
}

/** Shared wallet navigation used by every Fresnica business demo page. */
const FresnicaNavigation: React.FC<FresnicaNavigationProps> = ({ activeKey }) => {
    const items = (Object.keys(LABELS) as FresnicaNavKey[]).map((key) => {
        const Icon = ICONS[key];
        return {
            key,
            label: LABELS[key],
            icon:
                key === 'scan' ? (
                    <img
                        className={styles.scanIcon}
                        src={new URL('../../img/fresnica/icon_tabbar_actions.png', import.meta.url).href}
                        alt=""
                        aria-hidden="true"
                    />
                ) : (
                    <Icon aria-hidden="true" size={22} strokeWidth={2} />
                ),
        };
    });

    return (
        <BottomNavigation
            items={items}
            activeKey={activeKey}
            className={styles.navigation}
            onChange={(key) => {
                const route = ROUTES[key as FresnicaNavKey];
                if (route) window.location.hash = route;
            }}
        />
    );
};

export default FresnicaNavigation;
