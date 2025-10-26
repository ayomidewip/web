import React, { Children, cloneElement, forwardRef, useState } from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import { ButtonGroupContext } from './Button';

/**
 * ButtonGroup - Enhanced button grouping component
 * Groups buttons together with shared borders and single-selection behavior
 * Automatically manages selection state where only one button can be selected at a time
 * Maintains all button styling while creating a cohesive group appearance
 */
export const ButtonGroup = forwardRef(({
    children,
    className = '',
    size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
    spaced = false, // Add spacing between buttons instead of shared borders
    theme = null, // Optional theme override
    width = null, // Custom width
    height = null, // Custom height
    minWidth = null, // Minimum width
    minHeight = null, // Minimum height
    maxWidth = null, // Maximum width
    maxHeight = null, // Maximum height
    marginTop = null, // Margin top: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    marginBottom = null, // Margin bottom: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    justify = 'flex-start', // Horizontal alignment of the group within its container
    align = 'center', // Vertical alignment of the group within its container
    ...props
}, ref) => {
    const { currentTheme } = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme/current theme from context
    const buttonGroupTheme = theme || effectiveTheme.currentTheme || currentTheme;

    const { style: groupStyleProp = {}, ...restProps } = props;

    const normalizeJustify = (value) => {
        switch (value) {
            case 'start':
                return 'flex-start';
            case 'end':
                return 'flex-end';
            case 'between':
                return 'space-between';
            case 'around':
                return 'space-around';
            case 'evenly':
                return 'space-evenly';
            default:
                return value;
        }
    };

    const normalizeAlign = (value) => {
        switch (value) {
            case 'start':
                return 'flex-start';
            case 'end':
                return 'flex-end';
            case 'stretch':
                return 'stretch';
            default:
                return value;
        }
    };

    const getButtonGroupStyle = () => {
        const style = {};

        // Handle width
        if (width !== null) {
            style.width = width;
        }

        // Handle height
        if (height !== null) {
            style.height = height;
        }

        // Handle minWidth
        if (minWidth !== null) {
            style.minWidth = minWidth;
        }

        // Handle minHeight
        if (minHeight !== null) {
            style.minHeight = minHeight;
        }

        // Handle maxWidth
        if (maxWidth !== null) {
            style.maxWidth = maxWidth;
        }

        // Handle maxHeight
        if (maxHeight !== null) {
            style.maxHeight = maxHeight;
        }

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

        // Alignment and layout handling
        style.display = 'flex';
        style.justifyContent = normalizeJustify(justify);
        style.alignItems = normalizeAlign(align);

        return style;
    };

    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonSelect = (buttonId) => {
        setSelectedButton(buttonId);
    };

    const getSizeClass = () => {
        switch (size) {
            case 'xs':
                return 'xs';
            case 'sm':
                return 'sm';
            case 'lg':
                return 'lg';
            case 'xl':
                return 'xl';
            case 'md':
            default:
                return 'md';
        }
    };

    const getSpacedClass = () => {
        return spaced ? 'spaced' : '';
    };

    // Clone children and provide context
    const enhancedChildren = Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
            const buttonId = child.props.id || index;
            const childProps = {
                ...child.props,
                size: child.props.size ?? size,
            };

            if (theme !== null) {
                childProps.theme = theme;
            }

            return (
                <ButtonGroupContext.Provider
                    value={{
                        selectedButton,
                        buttonId,
                        onButtonSelect: handleButtonSelect
                    }}
                >
                    {cloneElement(child, childProps)}
                </ButtonGroupContext.Provider>
            );
        }
        return child;
    });

    return (
        <div className="button-group-container" style={getButtonGroupStyle()}>
            <div
                ref={ref}
                className={`button-group ${getSizeClass()} ${getSpacedClass()} theme-${buttonGroupTheme} ${className}`}
                data-theme={buttonGroupTheme}
                style={{
                    justifyContent: groupStyleProp.justifyContent ?? normalizeJustify(justify),
                    alignItems: groupStyleProp.alignItems ?? normalizeAlign(align),
                    ...groupStyleProp
                }}
                {...restProps}
            >
                {enhancedChildren}
            </div>
        </div>
    );
});

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
