import React from 'react';
import { useEffectiveTheme, useTheme } from '../contexts/ThemeContext';

/**
 * CircularProgress - Animated circular loading indicator
 * Features only an animated rotating bar with no deterministic progress values
 * Pure loading animation inspired by modern circular loaders
 */
export const CircularProgress = ({
    className = '',
    size = 'default', // 'small', 'sm', 'default', 'large', 'lg', 'xl'
    variant = 'primary', // 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error'
    strokeWidth = null, // Override default stroke width
    speed = 'default', // 'slow', 'default', 'fast'
    theme = null, // Optional theme override
    justifySelf = null, // CSS justify-self property
    ...props
}) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const progressTheme = theme || effectiveTheme.currentTheme;

    // Helper functions for classes
    const getSizeClass = () => {
        switch (size) {
            case 'small':
            case 'sm':
                return 'circular-progress-small';
            case 'large':
            case 'lg':
                return 'circular-progress-large';
            case 'xl':
                return 'circular-progress-xl';
            default:
                return 'circular-progress-default';
        }
    };

    const getSpeedClass = () => {
        switch (speed) {
            case 'slow':
                return 'circular-progress-slow';
            case 'fast':
                return 'circular-progress-fast';
            default:
                return 'circular-progress-default-speed';
        }
    };

    const getVariantClass = () => `circular-progress-${variant}`;

    const getJustifySelfClass = () => {
        if (!justifySelf) return '';
        return `justify-self-${justifySelf}`;
    };

    // Combine all classes
    const circularProgressClasses = [
        'circular-progress',
        'themed-circular-progress',
        getSizeClass(),
        getSpeedClass(),
        getVariantClass(),
        getJustifySelfClass(),
        className
    ].filter(Boolean).join(' ');

    // Size-based dimensions, stroke widths, and dash lengths
    const getSizeDimensions = () => {
        switch (size) {
            case 'small':
            case 'sm':
                return {size: 24, defaultStroke: 3, dashRatio: 0.15}; // Shorter dash for small
            case 'large':
            case 'lg':
                return {size: 64, defaultStroke: 6, dashRatio: 0.35}; // Longer dash for large
            case 'xl':
                return {size: 80, defaultStroke: 8, dashRatio: 0.4}; // Longest dash for xl
            default:
                return {size: 40, defaultStroke: 4, dashRatio: 0.25}; // Default dash length
        }
    };

    const {size: svgSize, defaultStroke, dashRatio} = getSizeDimensions();
    const actualStrokeWidth = strokeWidth || defaultStroke;
    const radius = (svgSize - actualStrokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Calculate dash length based on size-specific ratio
    const dashLength = circumference * dashRatio;
    const gapLength = circumference - dashLength;

    return (
        <div
            className={circularProgressClasses}
            data-theme={progressTheme}
            {...props}
        >
            <svg
                className="circular-progress-svg"
                width={svgSize}
                height={svgSize}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
                {/* Background circle */}
                <circle
                    className="circular-progress-track"
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={radius}
                    strokeWidth={actualStrokeWidth}
                    fill="none"
                />

                {/* Animated progress circle */}
                <circle
                    className="circular-progress-bar"
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={radius}
                    strokeWidth={actualStrokeWidth}
                    fill="none"
                    strokeDasharray={`${dashLength} ${gapLength}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
                />
            </svg>
        </div>
    );
};

export default CircularProgress;
