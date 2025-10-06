import React from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';

/**
 * Badge - Themed badge component for status indicators
 * Inherits styling from the current theme
 * Enhanced with theme inheritance support
 */
export const Badge = ({
    children,
    className = '',
    variant = 'default', // 'default', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error'
    size = 'default', // 'small', 'default', 'large'
    theme = null, // Optional theme override for this badge
    marginTop = null, // Margin top: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    marginBottom = null, // Margin bottom: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'
    ...props
}) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const badgeTheme = theme || effectiveTheme.currentTheme;

    // Helper function to convert margin prop to CSS style
    const getMarginStyle = () => {
        const style = {};

        // Only apply margins if explicitly provided
        if (marginTop !== null) {
            if (marginTop === 'none') {
                style.marginTop = '0';
            } else if (['xs', 'sm', 'md', 'lg', 'xl'].includes(marginTop)) {
                style.marginTop = `var(--spacing-${marginTop})`;
            } else {
                style.marginTop = marginTop;
            }
        }

        // Only apply margins if explicitly provided
        if (marginBottom !== null) {
            if (marginBottom === 'none') {
                style.marginBottom = '0';
            } else if (['xs', 'sm', 'md', 'lg', 'xl'].includes(marginBottom)) {
                style.marginBottom = `var(--spacing-${marginBottom})`;
            } else {
                style.marginBottom = marginBottom;
            }
        }

        return style;
    };

    const getVariantClass = () => {
        return `themed-badge-${variant}`;
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'badge-small';
            case 'large':
                return 'badge-large';
            default:
                return '';
        }
    };

    const getJustifySelfClass = () => {
        if (justifySelf) {
            return `justify-self-${justifySelf}`;
        }
        return '';
    };

    return (
        <span
            className={`badge themed-badge ${getVariantClass()} ${getSizeClass()} ${getJustifySelfClass()} theme-${badgeTheme} ${className}`}
            data-theme={badgeTheme}
            data-theme-source={theme ? 'local' : 'inherited'}
            style={{ justifySelf, ...getMarginStyle() }}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
