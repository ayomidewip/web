import React, { createContext, forwardRef, useContext, useMemo, useRef } from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import { useGeniePortal } from './Genie';

// Context for ButtonGroup to manage selection
export const ButtonGroupContext = createContext(null);

/**
 * Button - Enhanced themed button component with Genie integration
 * Automatically toggles selected state when clicked
 * Inherits colors and styling from the current theme
 *
 * Enhanced Features:
 * - Full Genie positioning support
 * - Corner-aware floating card positioning
 * - Built-in trigger capabilities for tooltips, popovers, context menus
 * - Automatic hover state management
 * - Theme inheritance support via theme prop
 */
export const Button = forwardRef(({
    children,
    className = '',
    variant = 'primary', // 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'border-shadow'
    size = 'default', // 'small', 'default', 'large'
    disabled = false,
    selected: externalSelected = null, // Allow external control of selected state
    type = 'button',
    onClick,
    width = null, // Width value (e.g., '100%', '200px', '10rem')
    theme = null, // Optional theme override for this button
    marginTop = null, // Margin top: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    marginBottom = null, // Margin bottom: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'
    // Genie integration props
    genie = null, // Genie content to show
    genieTrigger = 'click', // 'click', 'hover', 'contextmenu'
    onGenieShow = null, // Callback when genie shows
    onGenieHide = null, // Callback when genie hides
    ...props
}, ref) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const buttonTheme = theme || effectiveTheme.currentTheme;

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

    const buttonGroupContext = useContext(ButtonGroupContext);

    // Parse genie prop - support both old API and new object API
    const genieConfig = useMemo(() => {
        if (!genie) return null;

        if (typeof genie === 'object' && genie.content) {
            // New API: genie is an object with trigger, content
            return {
                content: genie.content,
                trigger: genie.trigger || genieTrigger
            };
        }

        // Old API: genie is just the content, other props are separate
        return {
            content: genie,
            trigger: genieTrigger
        };
    }, [genie, genieTrigger]);

    // Genie integration using simplified portal hook
    const buttonRef = ref || useRef(null);
    const {triggerProps: genieTriggerProps, GeniePortal} = useGeniePortal(
        genieConfig,
        buttonRef,
        onGenieShow,
        onGenieHide
    );
    // Determine the actual selected state - external selected prop takes priority over ButtonGroup
    const isSelected = externalSelected !== null
        ? externalSelected
        : (buttonGroupContext
            ? buttonGroupContext.selectedButton === buttonGroupContext.buttonId
            : false);

    const handleClick = (e) => {
        if (disabled) return;

        // Handle Genie click trigger first
        if (genieConfig && genieConfig.trigger === 'click') {
            // Call the genie click handler from triggerProps if it exists
            if (genieTriggerProps.onClick) {
                // Create a new event to prevent stopPropagation from affecting this event
                const genieEvent = {...e};
                genieTriggerProps.onClick(genieEvent);
            }
            // Continue with button logic instead of returning early
        }

        // Only participate in ButtonGroup selection if no external selected prop is provided
        if (buttonGroupContext && externalSelected === null) {
            // In a ButtonGroup - notify the group of selection
            buttonGroupContext.onButtonSelect(buttonGroupContext.buttonId);
        }

        // Call external onClick if provided
        if (onClick) {
            onClick(e);
        }
    };

    // Merge button onClick with genie trigger props (for non-click triggers)
    const combinedProps = {
        ...genieTriggerProps,
        onClick: handleClick // Always use our handleClick which handles both Genie and Button logic
    };
    const getVariantClass = () => {
        return `themed-button-${variant}`;
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'small';
            case 'large':
                return 'large';
            default:
                return '';
        }
    };

    const getSelectedClass = () => {
        return isSelected ? 'selected' : '';
    };

    const getJustifySelfClass = () => {
        if (justifySelf) {
            return `justify-self-${justifySelf}`;
        }
        return '';
    };

    // Filter out custom props that shouldn't be passed to the DOM element
    const {
        size: _size,
        selected: _selected,
        width: _width,
        expandDirection: _expandDirection,
        flexFill: _flexFill,
        genie: _genie,
        genieTrigger: _genieTrigger,
        onGenieShow: _onGenieShow,
        onGenieHide: _onGenieHide,
        ...validButtonProps
    } = props;

    return (
        <>
            <button
                ref={buttonRef}
                type={type}
                className={`button themed-button ${getVariantClass()} ${getSizeClass()} ${getSelectedClass()} ${getJustifySelfClass()} ${genieConfig ? 'genie-trigger' : ''} theme-${buttonTheme} ${className}`}
                disabled={disabled}
                data-theme={buttonTheme}
                data-theme-source={theme ? 'local' : 'inherited'}
                data-genie-position={genieConfig?.position || 'auto'}
                {...validButtonProps}
                {...combinedProps}
                style={{ justifySelf, width, ...getMarginStyle() }}
            >
                <span className="button-content">
                    {children}
                </span>
            </button>
            {/* Genie Integration using Portal */}
            {GeniePortal}
        </>
    );
});

Button.displayName = 'Button';

export default Button;
