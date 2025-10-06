import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import Icon from './Icon';
import { useGeniePortal } from './Genie';

/**
 * Input - Themed input component with modern layouts
 * Supports multiple variants, sizes, icons, and floating labels
 * Inherits styling from the current theme
 * Enhanced with theme inheritance support
 */
export const Input = ({
    className = '',
    type = 'text', // 'text', 'password', 'email', 'checkbox', 'search'.
    variant = 'default', // 'default', 'outline', 'filled', 'underline', 'floating'
    size = 'default', // 'small', 'default', 'large'
    placeholder = '',
    label = '',
    value,
    onChange,
    disabled = false,
    required = false,
    helpText = '',
    state = 'default', // 'default', 'success', 'warning', 'tertiary', 'error'
    icon = '',
    iconPosition = 'left', // 'left', 'right'
    width = null, // Width value (e.g., '100%', '200px', '10rem')
    theme = null, // Optional theme override for this input
    justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'
    marginTop = null, // 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    marginBottom = null, // 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
    multiline = false, // Enable textarea for multiline input
    rows = 3, // Number of rows for textarea (when multiline is true)
    // Validation props
    validate = false, // Enable/disable validation - now defaults to false, auto-enabled by required
    minLength = null, // Minimum length validation
    maxLength = null, // Maximum length validation
    onValidation = null, // Callback for validation results
    confirmField = null, // For password confirmation - value to match against
    // Checkbox-specific props
    checked = false, // For checkbox variant
    indeterminate = false, // For checkbox variant - "some selected" state
    // Positioning props
    position = null, // 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    positionOffset = 'default', // 'inset', 'default', 'extended' - distance from edges
    // Genie integration props
    genie = null, // Genie content to show
    genieTrigger = 'click', // hover, click, contextmenu
                          ...props
                      }) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const inputTheme = theme || effectiveTheme.currentTheme;

    // Generate a stable unique ID for the input element using React's useId hook
    const reactId = useId();
    const inputId = props.id || `input-${reactId}`;
    const inputName = props.name || inputId;
    // State for input
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validationState, setValidationState] = useState({isValid: true, message: ''});
    const [isTouched, setIsTouched] = useState(false);

    // Simple validation function
    const validateField = (value) => {
        const fieldLabel = label || 'Field';

        // Check if required field is empty
        if (!value) {
            if (required) return {isValid: false, message: `${fieldLabel} is required`};
            return {isValid: true, message: ''};
        }

        // Email format validation for email type inputs
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return {isValid: false, message: `${fieldLabel} must be a valid email address`};
            }
        }

        // Check minimum length
        if (minLength && value.length < minLength) {
            return {isValid: false, message: `${fieldLabel} must be at least ${minLength} characters`};
        }

        // Check maximum length
        if (maxLength && value.length > maxLength) {
            return {isValid: false, message: `${fieldLabel} cannot exceed ${maxLength} characters`};
        }

        // For password confirmation
        if (confirmField !== null) {
            if (confirmField !== value) {
                return {isValid: false, message: 'Passwords do not match'};
            }
        }

        return {isValid: true, message: ''};
    };

    // Main validation function
    const performValidation = (inputValue) => {
        // Auto-enable validation if required is true, or if validate is explicitly true
        const shouldValidate = required || validate;

        if (!shouldValidate || disabled) return {isValid: true, message: ''};

        // Use simple field validation for all cases
        return validateField(inputValue);
    };

    // Effect to validate on value change
    useEffect(() => {
        const shouldValidate = required || validate;
        if (isTouched && shouldValidate) {
            const validation = performValidation(value);
            setValidationState(validation);

            // Call validation callback if provided
            if (onValidation) {
                onValidation(validation, inputName);
            }
        }
    }, [value, isTouched, required, validate, confirmField]);

    // Determine if this is a password type input
    const isPasswordType = type === 'password';

    // Determine if this is a date-type input
    const isDateType = ['date', 'datetime-local', 'time', 'month', 'week'].includes(type);

    // Auto-provide calendar icon for date inputs if no icon is specified
    const effectiveIcon = icon || (isDateType ? 'FiCalendar' : '');
    const effectiveIconPosition = isDateType && !icon ? 'right' : iconPosition;

    // Calculate actual input type based on password type and showPassword state
    const actualType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    // Parse genie prop - support both old API and new object API
    const genieConfig = useMemo(() => {
        if (!genie) return null;

        if (typeof genie === 'object' && genie.content) {
            // New API: genie is an object with trigger, content, position
            return {
                content: genie.content,
                trigger: genie.trigger || genieTrigger,
                position: genie.position || 'auto'
            };
        }

        // Old API: genie is just the content, other props are separate
        return {
            content: genie,
            trigger: genieTrigger,
            position: 'auto'
        };
    }, [genie, genieTrigger]);

    // Genie integration using simplified portal hook
    const inputRef = useRef(null);
    const {triggerProps: genieTriggerProps, GeniePortal, handleShow, handleHide} = useGeniePortal(
        genieConfig,
        inputRef,
        null, // onShow handled in focus/blur
        null  // onHide handled in focus/blur
    );

    // Sync hasValue state with value prop
    useEffect(() => {
        // For checkbox inputs, don't use hasValue logic
        if (type !== 'checkbox') {
            // Handle both controlled and uncontrolled components
            if (value !== undefined) {
                // Controlled component - use value prop
                setHasValue(!!value);
            } else {
                // Uncontrolled component - check input element directly
                if (inputRef.current) {
                    setHasValue(!!inputRef.current.value);
                }
            }
        }
    }, [value, type]);

    // Handle Genie integration
    const handleChange = (e) => {
        if (type === 'checkbox') {
            // For checkbox inputs, pass the event directly
            if (onChange) {
                onChange(e);
            }
        } else {
            // For text inputs, update hasValue state and call onChange
            const newValue = e.target.value;
            setHasValue(!!newValue);

            if (onChange) {
                onChange(e);
            }
        }
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (props.onFocus) {
            props.onFocus(e);
        }
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        setIsTouched(true); // Mark as touched for validation
        if (props.onBlur) {
            props.onBlur(e);
        }
    };

    // Combine Genie trigger props with focus/blur handlers
    const getAllTriggerProps = () => {
        const focusBlurProps = {
            onFocus: handleFocus,
            onBlur: handleBlur
        };

        // Combine with genie trigger props
        return {
            ...focusBlurProps,
            ...genieTriggerProps
        };
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle keyboard shortcut for password toggle (Ctrl+Shift+P)
    const handleKeyDown = (e) => {
        if (isPasswordType && e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            togglePasswordVisibility();
        }

        if (props.onKeyDown) {
            props.onKeyDown(e);
        }
    };

    const getVariantClass = () => {
        return `themed-input-${variant}`;
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'input-small';
            case 'large':
                return 'input-large';
            default:
                return '';
        }
    };

    const getPositionClass = () => {
        if (!position) return '';

        let classes = ['positioned-child', `position-${position}`];

        if (positionOffset !== 'default') {
            classes.push(`offset-${positionOffset}`);
        }

        return classes.join(' ');
    };
    const getStateClasses = () => {
        const classes = [];
        if (isFocused) classes.push('input-focused');
        // For hasValue, check both the hasValue state and the actual value prop properly
        if (hasValue || (value !== undefined && value !== '')) classes.push('input-has-value');

        // Use validation state if touched and validation is enabled, otherwise use prop state
        const shouldValidate = required || validate;
        if (shouldValidate && isTouched) {
            if (!validationState.isValid) classes.push('input-error');
            else if (validationState.isValid && value) classes.push('input-success');
        } else {
            if (state === 'error') classes.push('input-error');
            if (state === 'success') classes.push('input-success');
            if (state === 'warning') classes.push('input-warning');
            if (state === 'tertiary') classes.push('input-tertiary');
        }

        if (disabled) classes.push('input-disabled');
        if (effectiveIcon) classes.push(`input-with-icon-${effectiveIconPosition}`);
        return classes.join(' ');
    };
    const getHelpTextClass = () => {
        const baseClass = type === 'checkbox'
            ? `checkbox-help-text themed-help-text theme-${inputTheme}`
            : `input-help-text themed-help-text theme-${inputTheme}`;

        // Add size class for help text
        const sizeClass = getSizeClass().replace('input-', 'help-text-');

        let resultClass;
        const effectiveState = getEffectiveState();

        switch (effectiveState) {
            case 'success':
                resultClass = type === 'checkbox'
                    ? `${baseClass} checkbox-help-text-success ${sizeClass}`
                    : `${baseClass} input-help-text-success ${sizeClass}`;
                break;
            case 'warning':
                resultClass = type === 'checkbox'
                    ? `${baseClass} checkbox-help-text-warning ${sizeClass}`
                    : `${baseClass} input-help-text-warning ${sizeClass}`;
                break;
            case 'tertiary':
                resultClass = type === 'checkbox'
                    ? `${baseClass} checkbox-help-text-tertiary ${sizeClass}`
                    : `${baseClass} input-help-text-tertiary ${sizeClass}`;
                break;
            case 'error':
                resultClass = type === 'checkbox'
                    ? `${baseClass} checkbox-help-text-error ${sizeClass}`
                    : `${baseClass} input-help-text-error ${sizeClass}`;
                break;
            default:
                resultClass = `${baseClass} ${sizeClass}`;
        }
        return resultClass.trim();
    };

    // Get effective help text - validation message or default helpText
    const getEffectiveHelpText = () => {
        const shouldValidate = required || validate;
        if (shouldValidate && isTouched && validationState.message) {
            return validationState.message;
        }
        return helpText;
    };

    // Get effective state for styling - validation state or prop state
    const getEffectiveState = () => {
        const shouldValidate = required || validate;
        if (shouldValidate && isTouched) {
            return validationState.isValid ? (value ? 'success' : 'default') : 'error';
        }
        return state;
    };

    // Helper function to get margin styles
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

    const getJustifySelfClass = () => {
        if (justifySelf) {
            return `justify-self-${justifySelf}`;
        }
        return '';
    };
    const renderInput = () => {
        // Filter out custom props that shouldn't be passed to the DOM element
        const {
            variant: _variant,
            size: _size,
            label: _label,
            helpText: _helpText,
            state: _state,
            icon: _icon,
            iconPosition: _iconPosition,
            showPasswordToggle: _showPasswordToggle,
            onFocus: _onFocus,
            onBlur: _onBlur,
            name: _name,
            position: _position,
            positionOffset: _positionOffset,
            genie: _genie,
            genieTrigger: _genieTrigger,
            theme: _theme,
            justifySelf: _justifySelf,
            width: _width,
            onKeyDown: _onKeyDown,
            defaultValue: _defaultValue, // Remove defaultValue to prevent controlled/uncontrolled conflicts
            value: _value, // Remove value to handle controlled/uncontrolled properly
            multiline: _multiline, // Remove multiline from DOM props
            rows: _rows, // Remove rows from DOM props for input elements
            type: _type, // Remove type from DOM props when rendering textarea
            ...validInputProps
        } = props;

        // For textarea, filter out type since textarea doesn't accept type attribute
        const domProps = multiline ? validInputProps : {type: actualType, ...validInputProps};

        // Generate ARIA attributes for accessibility
        const shouldValidate = required || validate;
        const ariaAttributes = {
            'aria-invalid': (shouldValidate && isTouched && !validationState.isValid) || state === 'error' ? 'true' : 'false',
            'aria-required': required ? 'true' : 'false',
            'aria-describedby': (getEffectiveHelpText() || helpText) ? `${inputId}-help` : undefined
        };

        // For checkbox type, use different styling and props
        if (type === 'checkbox') {
            return (
                <input
                    ref={(element) => {
                        if (inputRef) {
                            inputRef.current = element;
                        }
                        // Set indeterminate property directly on DOM element
                        if (element) {
                            element.indeterminate = indeterminate;
                        }
                    }}
                    id={inputId}
                    name={inputName}
                    type="checkbox"
                    className={`themed-checkbox ${getPositionClass()} ${genie ? 'genie-trigger' : ''} theme-${inputTheme} ${className}`}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    data-theme={inputTheme}
                    data-theme-source={theme ? 'local' : 'inherited'}
                    style={{width}}
                    {...ariaAttributes}
                    {...domProps}
                    {...getAllTriggerProps()}
                />
            );
        }

        // For date inputs, we need to handle the placeholder differently due to browser limitations
        const isDateInput = ['date', 'datetime-local', 'time', 'month', 'week'].includes(type);

        // For date inputs, we'll use a technique to overlay our placeholder when empty
        const dateInputProps = isDateInput ? {
            onFocus: (e) => {
                // Hide our custom placeholder when focused
                const overlay = e.target.parentElement.querySelector('.date-placeholder-overlay');
                if (overlay) overlay.style.display = 'none';
                handleFocus(e);
            },
            onBlur: (e) => {
                // Show our custom placeholder if still empty
                const overlay = e.target.parentElement.querySelector('.date-placeholder-overlay');
                if (overlay && !e.target.value) overlay.style.display = 'block';
                handleBlur(e);
            },
            style: {
                // Make the native date input completely transparent when empty
                color: value ? 'var(--text-color)' : 'transparent'
            }
        } : {};

        return (
            <>
                {multiline ? (
                    <textarea
                        ref={inputRef}
                        id={inputId}
                        name={inputName}
                        className={`input themed-input textarea ${getVariantClass()} ${getSizeClass()} ${getStateClasses()} ${getPositionClass()} ${genie ? 'genie-trigger' : ''} theme-${inputTheme} ${className}`}
                        placeholder={variant === 'floating' && label ? '' : placeholder}
                        {...(value !== undefined ? {value} : {})}
                        onChange={handleChange}
                        disabled={disabled}
                        required={required}
                        data-theme={inputTheme}
                        data-theme-source={theme ? 'local' : 'inherited'}
                        {...ariaAttributes}
                        {...domProps}
                        {...getAllTriggerProps()}
                        rows={rows}
                    />
                ) : (
                    <input
                        ref={inputRef}
                        id={inputId}
                        name={inputName}
                        className={`input themed-input ${getVariantClass()} ${getSizeClass()} ${getStateClasses()} ${getPositionClass()} ${genie ? 'genie-trigger' : ''} theme-${inputTheme} ${className}`}
                        placeholder={variant === 'floating' && label ? '' : (isDateInput ? '' : placeholder)}
                        {...(value !== undefined ? {value} : {})}
                        onChange={handleChange}
                        disabled={disabled}
                        required={required}
                        data-theme={inputTheme}
                        data-theme-source={theme ? 'local' : 'inherited'}
                        {...ariaAttributes}
                        {...domProps}
                        {...getAllTriggerProps()}
                    />
                )}
            </>
        );
    };
    if (variant === 'floating' && label) {
        return (
            <div
                className={`input-container input-floating-container variant-${variant} ${getJustifySelfClass()} theme-${inputTheme}`}
                style={{justifySelf, width, ...getMarginStyle()}} data-theme={inputTheme}
                data-theme-source={theme ? 'local' : 'inherited'}>
                <div
                    className={`input-field-wrapper ${effectiveIcon ? `has-icon has-icon-${effectiveIconPosition}` : ''} ${getStateClasses()}`}>
                    {effectiveIcon && effectiveIconPosition === 'left' && (
                        <span className="input-icon input-icon-left">
              <Icon name={effectiveIcon} variant="muted" size="sm"/>
            </span>
                    )}
                    {renderInput()}
                    <label
                        htmlFor={inputId}
                        className={`input-floating-label themed-label theme-${inputTheme} ${isFocused || hasValue || (value !== undefined && value !== '') ? 'floating' : ''}`}
                        data-theme={inputTheme}
                    >
                        {label}
                        {required && <span className="input-required">*</span>}
                    </label>
                    {effectiveIcon && effectiveIconPosition === 'right' && (
                        <span className="input-icon input-icon-right">
              <Icon name={effectiveIcon} variant="muted" size="sm"/>
            </span>
                    )}
                    {isPasswordType && (
                        <button
                            type="button"
                            className="input-password-toggle"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                            title={`${showPassword ? 'Hide' : 'Show'} password (Ctrl+Shift+P)`}
                            tabIndex={0}
                        >
                            <Icon name={showPassword ? 'FiEyeOff' : 'FiEye'} variant="muted" size="sm"/>
                        </button>
                    )}
                </div>
                {(getEffectiveHelpText() || helpText) && (
                    <span
                        id={`${inputId}-help`}
                        className={getHelpTextClass()}
                        data-theme={inputTheme}
                    >
            {getEffectiveHelpText()}
          </span>
                )}

                {/* Genie Integration */}
                {genie && (
                    <Genie
                        visible={isFloatingActive}
                        position={detectBestPosition()}
                        variant={'popover'}
                        size={'medium'}
                        role="tooltip"
                        closeOnClickOutside={true}
                        closeOnEscape={true}
                        onClose={handleFloatingHide}
                        triggerRef={inputRef}
                    >
                        {typeof genie === 'object' && genie.content ? genie.content : genie}
                    </Genie>
                )}
            </div>
        );
    }
    // Special handling for checkbox type
    if (type === 'checkbox') {
        return (
            <div className={`checkbox-wrapper input-container ${getJustifySelfClass()} theme-${inputTheme}`}
                 style={{justifySelf, width, ...getMarginStyle()}} data-theme={inputTheme}
                 data-theme-source={theme ? 'local' : 'inherited'}>
                <div className="checkbox-input-wrapper">
                    {renderInput()}
                    {label && (
                        <label
                            htmlFor={inputId}
                            className={`checkbox-label themed-label theme-${inputTheme}`}
                            data-theme={inputTheme}
                        >
                            {label}
                            {required && <span className="input-required">*</span>}
                        </label>
                    )}
                </div>
                {(getEffectiveHelpText() || helpText) && (
                    <span
                        id={`${inputId}-help`}
                        className={getHelpTextClass()}
                        data-theme={inputTheme}
                    >
            {getEffectiveHelpText()}
          </span>
                )}

                {/* Genie Integration */}
                {GeniePortal}
            </div>
        );
    }
    return (
        <div className={`input-container ${getJustifySelfClass()} theme-${inputTheme}`}
             style={{justifySelf, width, ...getMarginStyle()}} data-theme={inputTheme}
             data-theme-source={theme ? 'local' : 'inherited'}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`input-label themed-label theme-${inputTheme}`}
                    data-theme={inputTheme}
                >
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div
                className={`input-field-wrapper ${effectiveIcon ? `has-icon has-icon-${effectiveIconPosition}` : ''} ${getStateClasses()}`}>
                {effectiveIcon && effectiveIconPosition === 'left' && (
                    <span className="input-icon input-icon-left">
            <Icon name={effectiveIcon} variant="muted" size="sm"/>
          </span>
                )}
                {renderInput()}
                {effectiveIcon && effectiveIconPosition === 'right' && (
                    <span className="input-icon input-icon-right">
            <Icon name={effectiveIcon} variant="muted" size="sm"/>
          </span>)}{isPasswordType && (
                <button
                    type="button"
                    className="input-password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    title={`${showPassword ? 'Hide' : 'Show'} password (Ctrl+Shift+P)`}
                    tabIndex={0}
                >
                    <Icon name={showPassword ? 'FiEyeOff' : 'FiEye'} variant="muted" size="sm"/>
                </button>)}
            </div>
            {(getEffectiveHelpText() || helpText) && (
                <span
                    id={`${inputId}-help`}
                    className={getHelpTextClass()}
                    data-theme={inputTheme}
                >
          {getEffectiveHelpText()}
        </span>)}

            {/* Genie Integration */}
            {GeniePortal}
        </div>
    );
};

export default Input;
