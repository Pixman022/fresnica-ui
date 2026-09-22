import React from 'react';
import { MobilePreviewProvider } from '../../tools';
import styles from './wallet-demo-shell.module.less';

export interface WalletDemoShellProps {
    route: string;
    children: React.ReactNode;
}

/** Shared 390 × 844 product canvas for Fresnica wallet-flow demos. */
const WalletDemoShell: React.FC<WalletDemoShellProps> = ({ route, children }) => (
    <MobilePreviewProvider>
        <div
            className={styles.shell}
            data-fresnica-route={route}
            data-fresnica-mobile-preview="true"
            aria-label="390×844 手机比例预览"
        >
            <div className={styles.content}>{children}</div>
        </div>
    </MobilePreviewProvider>
);

export default WalletDemoShell;
