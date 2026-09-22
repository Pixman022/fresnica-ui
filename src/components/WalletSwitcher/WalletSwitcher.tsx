import React from 'react';
import { ChevronDown, Wallet } from 'lucide-react';
import styles from './wallet-switcher.module.less';
export interface WalletSwitcherProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    wallet: React.ReactNode;
    address?: React.ReactNode;
    avatar?: React.ReactNode;
    open?: boolean;
    compact?: boolean;
}
export const WalletSwitcher: React.FC<WalletSwitcherProps> = ({
    wallet,
    address,
    avatar,
    open,
    compact = false,
    className,
    ...rest
}) => (
    <button
        type="button"
        className={[styles.switcher, compact && styles.compact, open && styles.open, className]
            .filter(Boolean)
            .join(' ')}
        aria-expanded={open}
        {...rest}
    >
        <span className={styles.avatar} aria-hidden="true">
            {avatar ?? <Wallet size={18} strokeWidth={2.25} />}
        </span>
        <span className={styles.identity}>
            <strong>{wallet}</strong>
            {address && <small>{address}</small>}
        </span>
        <span className={styles.chevron} aria-hidden="true">
            <ChevronDown size={17} strokeWidth={2.25} />
        </span>
    </button>
);
WalletSwitcher.displayName = 'WalletSwitcher';
