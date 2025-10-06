import React from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import { Typography } from './Typography';

/**
 * Switch - Themed toggle switch component
 * Inherits styling from the current theme
 * Enhanced with theme inheritance support
 */
export const Switch = ({
    className = '',
    checked,
    defaultChecked,
    onChange,
    label = '',
    disabled = false,
    id,
    size = 'default',
    theme = null, // Optional theme override for this switch
    justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'
    ...props
}) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const switchTheme = theme || effectiveTheme.currentTheme;
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    // Determine if this is a controlled or uncontrolled component
    const isControlled = checked !== undefined;
    const switchValue = isControlled ? checked : defaultChecked;

    // Remove defaultChecked from props to avoid conflicts
    const {defaultChecked: _, ...inputProps} = props;

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'switch-small';
            case 'large':
                return 'switch-large';
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
        <div 
            className={`switch-wrapper flex items-center gap-sm ${getJustifySelfClass()} ${className}`}
            style={{ justifySelf }}
        >
            <div 
                className={`switch-container themed-switch ${getSizeClass()} theme-${switchTheme}`}
                data-theme={switchTheme} 
                data-theme-source={theme ? 'local' : 'inherited'}
            >
                <input
                    type="checkbox"
                    id={switchId}
                    className="switch-input sr-only"
                    {...(isControlled ? { checked } : { defaultChecked })}
                    onChange={onChange}
                    disabled={disabled}
                    {...inputProps}
                />
                <label
                    htmlFor={switchId}
                    className={`switch-track ${switchValue ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
                >
                    <span className="switch-thumb" />
                </label>
            </div>
            {label && (
                <Typography
                    as="label"
                    htmlFor={switchId}
                    className={`switch-label themed-label theme-${switchTheme}`}
                    data-theme={switchTheme}
                >
                    {label}
                </Typography>
            )}
        </div>
    );
};

export default Switch;
