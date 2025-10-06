import React from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import { Typography } from './Typography';

/**
 * ProgressBar - Themed progress bar component
 * Shows progress with a single color that changes from error to warning to tertiary to success
 */
export const ProgressBar = ({
    value = 0,
    max = 100,
    className = '',
    size = 'default',
    showLabel = false,
    label = '',
    showPercentage = false,
    animated = false,
    striped = false,
    variant = 'default', // 'default', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error'
    theme = null, // Optional theme override
    justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'
    ...props
}) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const progressTheme = theme || effectiveTheme.currentTheme;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Helper functions for classes
    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'progress-bar-small';
            case 'large':
                return 'progress-bar-large';
            default:
                return '';
        }
    };
    const getAnimatedClass = () => animated ? 'progress-animated' : '';
    const getStripedClass = () => striped ? 'progress-striped' : '';

    // For default variant, pick color class based on percentage
    const getDynamicColorClass = () => {
        if (variant !== 'default') return `progress-${variant}`;
        if (percentage < 33) return 'progress-error';
        if (percentage < 66) return 'progress-warning';
        if (percentage < 85) return 'progress-tertiary';
        return 'progress-success';
    };

    const getJustifySelfClass = () => {
        if (justifySelf) {
            return `justify-self-${justifySelf}`;
        }
        return '';
    };

    return (
        <div className={`progress-wrapper ${getJustifySelfClass()} ${className}`} style={{ justifySelf }}>
            {(showLabel || label) && (
                <div className="progress-label flex justify-between mb-sm">
                    <Typography as="span" size="sm">{label}</Typography>
                    {showPercentage && (
                        <Typography as="span" size="sm">{Math.round(percentage)}%</Typography>
                    )}
                </div>
            )}
            <div
                className={`progress-bar themed-progress-bar ${getSizeClass()} ${getAnimatedClass()} ${getStripedClass()} theme-${progressTheme}`}
                data-theme={progressTheme}
                {...props}
            >
                <div
                    className={`progress-fill themed-progress-fill ${getDynamicColorClass()}${striped ? ' progress-striped' : ''}${striped && animated ? ' progress-striped-animated' : ''}`}
                    style={{
                        width: `${percentage}%`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-label={label || `Progress: ${Math.round(percentage)}%`}
                >
                    {/* No overlay for default striped, let CSS handle stripes/animation */}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
