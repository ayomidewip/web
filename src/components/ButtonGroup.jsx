import React, { Children, cloneElement, forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import { ButtonGroupContext } from './Button';

/**
 * ButtonGroup - Enhanced groups buttons together with Genie integration
 * Groups buttons together with shared borders and single-selection behavior
 * Automatically manages selection state where only one button can be selected at a time
 * Maintains all button styling while creating a cohesive group appearance
 *
 * Enhanced Features:
 * - Full Genie positioning support
 * - Corner-aware floating card positioning
 * - Built-in trigger capabilities for tooltips, popovers, context menus
 * - Automatic hover state management
 */
export const ButtonGroup = forwardRef(({
    children,
    className = '',
    size = 'default', // 'small', 'default', 'large'
    spaced = false, // Add spacing between buttons instead of shared borders
    defaultSelected = null, // Index or ID of initially selected button
    allowDeselect = false, // Allow deselecting all buttons
    theme = null, // Optional theme override
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
    const buttonGroupTheme = theme || effectiveTheme.currentTheme;

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

    const [selectedButton, setSelectedButton] = useState(defaultSelected);

    // Genie integration state and logic
    const buttonGroupRef = ref || useRef(null);
    const [isFloatingActive, setIsFloatingActive] = useState(false);

    // Auto-detect best corner position based on viewport location
    const detectBestPosition = useCallback(() => {
        if (!buttonGroupRef.current) return 'auto';

        const rect = buttonGroupRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Determine best position based on button group location in viewport
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Quadrant-based positioning
        if (centerX < viewportWidth / 2 && centerY < viewportHeight / 2) {
            return 'bottom-right'; // Top-left quadrant
        } else if (centerX >= viewportWidth / 2 && centerY < viewportHeight / 2) {
            return 'bottom-left'; // Top-right quadrant
        } else if (centerX < viewportWidth / 2 && centerY >= viewportHeight / 2) {
            return 'top-right'; // Bottom-left quadrant
        } else {
            return 'top-left'; // Bottom-right quadrant
        }
    }, []);

    // Genie event handlers
    const handleGenieShow = useCallback(() => {
        setIsFloatingActive(true);
        if (buttonGroupRef.current) {
            buttonGroupRef.current.classList.add('has-floating-card-active');
        }
        if (onGenieShow) onGenieShow();
    }, [onGenieShow]);

    const handleGenieHide = useCallback(() => {
        setIsFloatingActive(false);
        if (buttonGroupRef.current) {
            buttonGroupRef.current.classList.remove('has-floating-card-active');
        }
        if (onGenieHide) onGenieHide();
    }, [onGenieHide]);

    const handleButtonSelect = (buttonId) => {
        if (selectedButton === buttonId && allowDeselect) {
            // Deselect if clicking the same button and deselect is allowed
            setSelectedButton(null);
        } else {
            // Select the clicked button
            setSelectedButton(buttonId);
        }
    };

    // Event handlers for different trigger types
    const triggerProps = useMemo(() => {
        if (!genie) return {};

        const props = {};

        switch (genieTrigger) {
            case 'hover':
                props.onMouseEnter = handleGenieShow;
                props.onMouseLeave = handleGenieHide;
                break;
            case 'click':
                props.onClick = (e) => {
                    // No longer calling e.stopPropagation() to allow the event to bubble
                    // This allows parent components to also handle the click
                    if (isFloatingActive) {
                        handleGenieHide();
                    } else {
                        handleGenieShow();
                    }
                };
                break;
            case 'contextmenu':
                props.onContextMenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleGenieShow();
                };
                break;
        }

        return props;
    }, [genie, genieTrigger, isFloatingActive, handleGenieShow, handleGenieHide]);

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

    const getSpacedClass = () => {
        return spaced ? 'spaced' : '';
    };

    const getJustifySelfClass = () => {
        if (justifySelf) {
            return `justify-self-${justifySelf}`;
        }
        return '';
    };

    // Clone children and provide context
    const enhancedChildren = Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
            const buttonId = child.props.id || index;
            return (
                <ButtonGroupContext.Provider
                    value={{
                        selectedButton,
                        buttonId,
                        onButtonSelect: handleButtonSelect
                    }}
                >
                    {cloneElement(child, {
                        // Don't override existing props
                        ...child.props
                    })}
                </ButtonGroupContext.Provider>
            );
        }
        return child;
    });

    return (
        <div className={`button-group-container ${genie ? 'has-floating-card' : ''}`} style={getMarginStyle()}>
            <div
                ref={buttonGroupRef}
                className={`button-group ${getSizeClass()} ${getSpacedClass()} ${getJustifySelfClass()} ${genie ? 'floating-card-trigger' : ''} theme-${buttonGroupTheme} ${className}`}
                data-theme={buttonGroupTheme}
                style={{justifySelf}}
                {...props}
                {...triggerProps}
            >
                {enhancedChildren}
            </div>

            {/* Genie Integration */}
            {genie && (
                <Genie
                    visible={isFloatingActive}
                    position={detectBestPosition()}
                    onClose={handleGenieHide}
                    triggerRef={buttonGroupRef}
                >
                    {typeof genie === 'object' && genie.content ? genie.content : genie}
                </Genie>
            )}
        </div>
    );
});

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
