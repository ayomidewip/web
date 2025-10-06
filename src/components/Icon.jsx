import React from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import * as Icons from 'react-icons/fi'; // Feather icons
import * as MdIcons from 'react-icons/md'; // Material Design icons
import * as HiIcons from 'react-icons/hi'; // Heroicons
import * as FaIcons from 'react-icons/fa'; // Font Awesome icons
import * as GrIcons from 'react-icons/gr';
import * as TbIcons from 'react-icons/tb';

// Get icon component from libraries
const getIcon = (iconName) => {
    // Try each library in order
    return Icons[iconName] ||
        MdIcons[iconName] ||
        HiIcons[iconName] ||
        FaIcons[iconName] ||
        GrIcons[iconName] ||
        TbIcons[iconName] ||
        Icons.FiHelpCircle; // fallback
};

/**
 * Icon - Themed icon component
 * Uses react-icons with direct icon names - no abstraction layer!
 *
 * Usage examples:
 * <Icon name="FiHome" />                  // Feather Home icon
 * <Icon name="MdSettings" />             // Material Design Settings icon
 * <Icon name="HiUser" />                 // Heroicons User icon
 * <Icon name="FaSpinner" />              // Font Awesome Spinner icon
 */
export const Icon = ({
    name = 'FiHelpCircle',
    variant = 'primary', // 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'text'
    size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
                         className = '',
                         hover = false,
                         clickable = false,
                         onClick,
                         style = {},
                         theme = null, // Optional theme override
                         justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'
                         ...props
                     }) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const iconTheme = theme || effectiveTheme.currentTheme;

    // Get the icon component directly
    const IconComponent = getIcon(name);

    const getJustifySelfClass = () => {
        if (justifySelf) {
            return `justify-self-${justifySelf}`;
        }
        return '';
    };

    // Build class names
    const classes = ['themed-icon', `icon-${variant}`, `icon-${size}`, hover && 'icon-hover', clickable && 'icon-clickable', getJustifySelfClass(), className].filter(Boolean).join(' ');

    return (
        <IconComponent
            className={classes}
            onClick={onClick}
            style={{...style, justifySelf}}
            {...props}
        />
    );
};

export default Icon;
