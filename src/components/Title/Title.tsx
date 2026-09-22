import React from 'react';
import classNames from 'classnames';
import styles from './title.module.less';

export type TitleSize = 'small' | 'middle' | 'large';
export type TitleVariant = 'heading';
export type TitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';

export type TitleColor =
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

export interface TitleProps {
    children: React.ReactNode;
    size?: TitleSize;
    color?: TitleColor;
    variant?: TitleVariant;
    as?: TitleElement;
    className?: string;
    style?: React.CSSProperties;
}

export const Title: React.FC<TitleProps> = ({
    children,
    size = 'middle',
    color = 'default',
    as = 'h2',
    className,
    style,
}) => {
    const Heading = as;
    return (
        <Heading
            className={classNames(
                styles.heading,
                styles[`heading-${size}`],
                color !== 'default' && styles[`heading-color-${color}`],
                className
            )}
            style={style}
        >
            {children}
        </Heading>
    );
};

Title.displayName = 'Title';
