import React from 'react';
import styles from './asset-icon.module.less';
export interface AssetIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    symbol: React.ReactNode;
    src?: string;
    size?: 'small' | 'medium' | 'large';
}
export const AssetIcon: React.FC<AssetIconProps> = ({ symbol, src, size = 'medium', className, ...rest }) => (
    <span className={[styles.icon, styles[size], className].filter(Boolean).join(' ')} {...rest}>
        {src ? <img src={src} alt="" /> : symbol}
    </span>
);
AssetIcon.displayName = 'AssetIcon';
