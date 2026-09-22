import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './swap-route.module.less';
export interface SwapRouteProps extends React.HTMLAttributes<HTMLDivElement> {
    from: React.ReactNode;
    to: React.ReactNode;
    via?: React.ReactNode;
    rate?: React.ReactNode;
    best?: boolean;
}
export const SwapRoute: React.FC<SwapRouteProps> = ({ from, to, via, rate, best = false, className, ...rest }) => (
    <div className={[styles.route, best && styles.best, className].filter(Boolean).join(' ')} {...rest}>
        <div className={styles.path}>
            <span>{from}</span>
            <ArrowRight size={16} aria-hidden="true" />
            {via && (
                <>
                    <span>{via}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                </>
            )}
            <span>{to}</span>
        </div>
        <div className={styles.meta}>
            {rate && <span>Rate {rate}</span>}
            {best && <span className={styles.badge}>Best route</span>}
        </div>
    </div>
);
SwapRoute.displayName = 'SwapRoute';
