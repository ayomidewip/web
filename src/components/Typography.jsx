import React from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';

/**
 * Typography - Unified typography component for all text in the application
 * Simplified text component using size and weight props
 * Automatically converts href prop to link elements with proper styling
 * Enhanced with theme inheritance support
 */
export const Typography = ({
    children,
    className = '',
    size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'
    weight = 'normal', // 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'
    color = 'default', // 'default', 'primary', 'secondary', 'success', 'warning', 'error', 'muted', 'header', 'tertiary', 'contrast'
    font = 'primary', // 'primary', 'secondary', 'monospace' - different font families per theme
    theme = null, // Optional theme override for this typography element
    width = null, // Width value (e.g., '100%', '200px', 'auto')
    height = null, // Height value (e.g., '2rem', '32px', 'auto')
    minWidth = null, // Minimum width (e.g., '100px', '5rem')
    minHeight = null, // Minimum height (e.g., '2rem', '32px')
    maxWidth = null, // Maximum width (e.g., '500px', '100%')
    maxHeight = null, // Maximum height (e.g., '10rem', '200px')
    justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'
    marginTop = null, // Margin top spacing: 'xs', 'sm', 'md', 'lg', 'xl'
    marginBottom = null, // Margin bottom spacing: 'xs', 'sm', 'md', 'lg', 'xl'
    margin = null, // All margin spacing: 'none', 'xs', 'sm', 'md', 'lg', 'xl'
    padding = null, // All padding spacing: 'none', 'xs', 'sm', 'md', 'lg', 'xl'
    href, // URL for links - automatically renders as link with proper styling
    target, // Link target (_blank, _self, etc.)
    rel, // Link relationship (e.g., 'noopener noreferrer' for external links)
    ...props
}) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const typographyTheme = theme || effectiveTheme.currentTheme;

    // If href is provided, automatically render as a link
    const Component = href ? 'a' : 'span';

    // Detect if this is an external link
    const isExternalLink = href && (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        (href.includes('://') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
    );

    // Auto-set target and rel for external links for security and UX
    const linkProps = href ? {
        href,
        target: target || (isExternalLink ? '_blank' : undefined),
        rel: rel || (isExternalLink ? 'noopener noreferrer' : undefined)
    } : {};
    
    const isLink = Component === 'a' || href;

    const getSizeClass = () => {
        // Map size prop to CSS class - handle both long and short forms
        const sizeMap = {
            'small': 'sm',
            'large': 'lg',
            'extra-large': 'xl'
        };
        const mappedSize = sizeMap[size] || size;
        return `typography-size-${mappedSize}`;
    };

    const getWeightClass = () => {
        // Weight class that will use font files with weight suffixes
        return `typography-weight-${weight}`;
    };

    const getFontClass = () => {
        // Font family class for different font types
        return `typography-font-${font}`;
    };

    const getColorStyle = () => {
        if (color === 'default') {
            return {};
        }

        // Define the mapping to CSS custom properties based on the new color system
        const colorMapping = {
            'primary': 'var(--primary-color)',
            'secondary': 'var(--secondary-color)',
            'tertiary': 'var(--tertiary-color)',
            'success': 'var(--success-color)',
            'warning': 'var(--warning-color)',
            'error': 'var(--error-color)',
            'neutral': 'var(--neutral-color)',
            'info': 'var(--tertiary-color)', // Map info to tertiary since info color was removed
            'muted': 'var(--text-muted)',
            'header': 'var(--header-text-color, var(--text-color))',
            'contrast': 'var(--text-contrast-color)'
        };

        return {color: colorMapping[color] || 'inherit'};
    };

    const getColorClass = () => {
        // Remove color class since we're using inline styles
        return '';
    };

    const getElementClass = () => {
        if (isLink) return 'typography-link';
        return 'typography-text';
    };

    const getLinkClass = () => {
        if (!isLink) return '';
        return isExternalLink ? 'typography-link-external' : 'typography-link-internal';
    };

    const getJustifySelfClass = () => {
        if (justifySelf) {
            return `justify-self-${justifySelf}`;
        }
        return '';
    };

    const getMarginClasses = () => {
        const classes = [];
        if (margin) {
            classes.push(`margin-${margin}`);
        }
        if (marginTop) {
            classes.push(`margin-top-${marginTop}`);
        }
        if (marginBottom) {
            classes.push(`margin-bottom-${marginBottom}`);
        }
        return classes.join(' ');
    };

    const getPaddingClasses = () => {
        if (padding) {
            return `padding-${padding}`;
        }
        return '';
    };

    const getTypographyStyle = () => {
        const style = { ...getColorStyle() };

        // Sizing
        if (width !== null) style.width = width;
        if (height !== null) style.height = height;
        if (minWidth !== null) style.minWidth = minWidth;
        if (minHeight !== null) style.minHeight = minHeight;
        if (maxWidth !== null) style.maxWidth = maxWidth;
        if (maxHeight !== null) style.maxHeight = maxHeight;

        if (justifySelf !== null) style.justifySelf = justifySelf;

        return style;
    };

    return (
        <Component
            className={`typography ${getElementClass()} ${getSizeClass()} ${getWeightClass()} ${getFontClass()} ${getColorClass()} ${getLinkClass()} ${getJustifySelfClass()} ${getMarginClasses()} ${getPaddingClasses()} theme-${typographyTheme} ${className}`.trim()}
            data-typography-element={Component}
            data-typography-weight={weight}
            data-typography-font={font}
            data-typography-color={color}
            data-theme={typographyTheme}
            data-theme-source={theme ? 'local' : 'inherited'}
            style={getTypographyStyle()}
            {...linkProps}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Typography;
