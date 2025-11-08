import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from '@contexts/ThemeContext';
import {
    Page,
    Container,
    Button,
    ButtonGroup,
    FloatingActionButton,
    Card,
    Input,
    Typography,
    Select,
    Switch,
    Badge,
    ProgressBar,
    CircularProgress,
    Icon,
    Data,
    TreeView,
    Editor,
    Flow,
    Image,
    Video,
    Audio,
} from '@components/Components';

/**
 * Component Demo Refactored - Interactive Component Playground
 * 
 * Three-Section Layout:
 * 1. Component Selector - ButtonGroup to choose which component to demo
 * 2. Live Demo Area - Visual display of the selected component with current props
 * 3. Props Control Panel - Dynamic tabs with inputs/selects to modify component props in real-time
 */

// =============================================================================
// COMPONENT METADATA CONFIGURATION
// =============================================================================

const STANDARD_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const EXTENDED_TEXT_SIZES = [...STANDARD_SIZES, '2xl', '3xl', '4xl'];
const STATUS_COLORS = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'];
const BADGE_COLORS = ['default', ...STATUS_COLORS];
const PROGRESS_COLORS = ['default', ...STATUS_COLORS];
const TREEVIEW_COLORS = ['default', 'primary', 'secondary', 'tertiary', 'background'];
const THEME_OVERRIDES = [null, 'modern', 'dark', 'minimal', 'vibrant', 'admin', 'pink', 'fancy'];
const THEME_OPTION_LABELS = {
    null: 'Inherit Theme',
    modern: 'Modern',
    dark: 'Dark',
    minimal: 'Minimal',
    vibrant: 'Vibrant',
    admin: 'Admin',
    pink: 'Pink',
    fancy: 'Fancy'
};
const FAB_SIZES = STANDARD_SIZES; // ['xs', 'sm', 'md', 'lg', 'xl']
const FAB_VARIANTS = STATUS_COLORS;
const FAB_POSITIONS = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];
const FAB_PARENT_TYPES = ['auto', 'page', 'card', 'container'];
const COMMON_LAYOUTS = ['block', 'flex', 'flex-column', 'grid', 'multicolumn', 'positioned'];
const COMMON_GAPS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
const COMMON_PADDING = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
const ALIGN_OPTIONS = ['start', 'center', 'end', 'stretch'];
const JUSTIFY_OPTIONS = ['start', 'center', 'end', 'between', 'around', 'evenly', 'wrap'];

// Genie configuration helpers - these create the actual genie objects
// MUST be defined BEFORE COMPONENT_METADATA so they're available when defaultProps are set
const createDataRowGenieConfig = (trigger = 'click') => ({
    trigger,
    variant: 'card',
    position: 'auto',
    content: (item) => (
        <Container layout="flex-column" gap="xs" padding="sm" width="220px">
            <Typography size="sm" weight="semibold">{item.name}</Typography>
            <Typography size="xs" color="muted">{item.email}</Typography>
            <Typography size="xs" color="muted">Role: {item.role}</Typography>
            <Badge size="sm" color={item.status === 'Active' ? 'success' : 'warning'}>
                {item.status}
            </Badge>
        </Container>
    )
});

const createFabGenieConfig = (trigger = 'click') => ({
    trigger,
    variant: 'popover',
    position: 'auto',
    content: ({ onClose }) => (
        <Container layout="flex-column" gap="sm" padding="sm" width="200px">
            <Typography size="sm" weight="semibold">Quick Actions</Typography>
            <Button size="sm" variant="ghost" onClick={onClose}>
                <Icon name="FiEdit" size="sm" /> Compose
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
                <Icon name="FiShare2" size="sm" /> Share
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
                <Icon name="FiSettings" size="sm" /> Settings
            </Button>
        </Container>
    )
});

const createButtonGenieConfig = (trigger = 'click') => ({
    trigger,
    variant: 'popover',
    position: 'auto',
    content: ({ onClose }) => (
        <Container layout="flex-column" gap="xs" padding="sm" width="180px">
            <Typography size="xs" weight="semibold">Button Actions</Typography>
            <Button size="xs" variant="ghost" onClick={onClose}>
                <Icon name="FiCopy" size="xs" /> Copy
            </Button>
            <Button size="xs" variant="ghost" onClick={onClose}>
                <Icon name="FiEdit2" size="xs" /> Edit
            </Button>
        </Container>
    )
});

const createCardGenieConfig = (trigger = 'click') => ({
    trigger,
    variant: 'popover',
    position: 'auto',
    content: ({ onClose }) => (
        <Container layout="flex-column" gap="xs" padding="sm" width="180px">
            <Typography size="xs" weight="semibold">Card Actions</Typography>
            <Button size="xs" variant="ghost" onClick={onClose}>
                <Icon name="FiMaximize2" size="xs" /> Expand
            </Button>
            <Button size="xs" variant="ghost" onClick={onClose}>
                <Icon name="FiShare2" size="xs" /> Share
            </Button>
        </Container>
    )
});

const createContainerGenieConfig = (trigger = 'click') => ({
    trigger,
    variant: 'popover',
    position: 'auto',
    content: ({ onClose }) => (
        <Container layout="flex-column" gap="xs" padding="sm" width="180px">
            <Typography size="xs" weight="semibold">Container Actions</Typography>
            <Button size="xs" variant="ghost" onClick={onClose}>
                <Icon name="FiLayout" size="xs" /> Configure
            </Button>
            <Button size="xs" variant="ghost" onClick={onClose}>
                <Icon name="FiCopy" size="xs" /> Duplicate
            </Button>
        </Container>
    )
});

const COMPONENT_METADATA = {
    Button: {
        component: Button,
        defaultProps: {
            children: 'Click Me',
            color: 'primary',
            variant: null,
            size: 'md',
            disabled: false,
            selected: false,
            icon: '',
            iconPosition: 'left',
            theme: null,
            genie: createButtonGenieConfig('click'),
            genieTrigger: 'click'
        },
        propConfigs: {
            children: { type: 'text', label: 'Button Text', group: 'Content' },
            icon: {
                type: 'text',
                label: 'Icon Name (Demo Only)',
                group: 'Content',
                placeholder: 'e.g., FiSave, FiEdit, FiTrash - Leave empty for no icon'
            },
            iconPosition: {
                type: 'select',
                label: 'Icon Position (Demo Only)',
                group: 'Content',
                options: ['left', 'right']
            },
            color: { 
                type: 'select', 
                label: 'Color', 
                group: 'Appearance',
                options: STATUS_COLORS
            },
            variant: {
                type: 'select',
                label: 'Variant',
                group: 'Appearance',
                options: [null, 'border-shadow', 'ghost', 'solid'],
                optionLabels: { null: 'Default', 'border-shadow': 'Border Shadow', 'ghost': 'Ghost', 'solid': 'Solid' }
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            },
            disabled: { type: 'boolean', label: 'Disabled', group: 'State' },
            selected: { type: 'boolean', label: 'Selected', group: 'State' },
            genieTrigger: {
                type: 'select',
                label: 'Genie Trigger',
                group: 'Genie',
                options: ['click', 'hover', 'contextmenu']
            }
        },
        description: 'Interactive button with theme support and multiple variants'
    },
    
    Input: {
        component: Input,
        defaultProps: {
            type: 'text',
            variant: 'default',
            color: 'primary',
            size: 'md',
            placeholder: 'Enter text...',
            label: 'Input Label',
            value: '',
            disabled: false,
            required: false,
            validationState: 'default',
            helpText: '',
            icon: '',
            iconPosition: 'left',
            multiline: false,
            rows: 3,
            theme: null
        },
        propConfigs: {
            type: {
                type: 'select',
                label: 'Input Type',
                group: 'Basic',
                options: ['text', 'password', 'email', 'search', 'checkbox', 'range']
            },
            variant: {
                type: 'select',
                label: 'Variant',
                group: 'Appearance',
                options: ['default', 'outline', 'filled', 'underline', 'floating']
            },
            color: {
                type: 'select',
                label: 'Color',
                group: 'Appearance',
                options: ['primary', 'secondary', 'tertiary']
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            placeholder: { type: 'text', label: 'Placeholder', group: 'Content' },
            label: { type: 'text', label: 'Label', group: 'Content' },
            helpText: { type: 'text', label: 'Help Text', group: 'Content' },
            icon: { type: 'text', label: 'Icon Name', group: 'Content', placeholder: 'e.g., FiSearch' },
            iconPosition: {
                type: 'select',
                label: 'Icon Position',
                group: 'Appearance',
                options: ['left', 'right']
            },
            disabled: { type: 'boolean', label: 'Disabled', group: 'State' },
            required: { type: 'boolean', label: 'Required', group: 'State' },
            validationState: {
                type: 'select',
                label: 'Validation State',
                group: 'State',
                options: ['default', 'success', 'warning', 'error']
            },
            multiline: { type: 'boolean', label: 'Multiline (Textarea)', group: 'Basic' },
            rows: { type: 'number', label: 'Rows (for Multiline)', group: 'Basic', min: 1, max: 20 },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Versatile input component with multiple styles and validation states'
    },

    Select: {
        component: Select,
        defaultProps: {
            variant: 'default',
            color: 'primary',
            size: 'md',
            multiSelect: false,
            options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
                { value: 'option4', label: 'Option 4' }
            ],
            value: 'option1',
            placeholder: 'Search options...',
            label: 'Select Label',
            disabled: false,
            validationState: 'default',
            helpText: '',
            theme: null
        },
        propConfigs: {
            variant: {
                type: 'select',
                label: 'Variant',
                group: 'Appearance',
                options: ['default', 'outline', 'filled', 'underline']
            },
            color: {
                type: 'select',
                label: 'Color',
                group: 'Appearance',
                options: ['primary', 'secondary', 'tertiary']
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            multiSelect: { type: 'boolean', label: 'Multi-Select Mode', group: 'Basic' },
            label: { type: 'text', label: 'Label', group: 'Content' },
            placeholder: { type: 'text', label: 'Placeholder', group: 'Content' },
            helpText: { type: 'text', label: 'Help Text', group: 'Content' },
            disabled: { type: 'boolean', label: 'Disabled', group: 'State' },
            validationState: {
                type: 'select',
                label: 'Validation State',
                group: 'State',
                options: ['default', 'success', 'warning', 'error']
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Searchable dropdown with single or multi-select support'
    },

    Switch: {
        component: Switch,
        defaultProps: {
            checked: false,
            label: 'Toggle Switch',
            disabled: false,
            size: 'md',
            theme: null
        },
        propConfigs: {
            label: { type: 'text', label: 'Label', group: 'Content' },
            checked: { type: 'boolean', label: 'Checked', group: 'State' },
            disabled: { type: 'boolean', label: 'Disabled', group: 'State' },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Toggle switch component for binary choices'
    },

    Badge: {
        component: Badge,
        defaultProps: {
            children: 'Badge',
            color: 'default',
            size: 'md',
            theme: null
        },
        propConfigs: {
            children: { type: 'text', label: 'Badge Text', group: 'Content' },
            color: {
                type: 'select',
                label: 'Color',
                group: 'Appearance',
                options: BADGE_COLORS
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Small status indicator with theme colors'
    },

    ProgressBar: {
        component: ProgressBar,
        defaultProps: {
            value: 65,
            max: 100,
            size: 'md',
            showPercentage: true,
            showLabel: false,
            label: '',
            animated: false,
            striped: false,
            color: 'default',
            theme: null
        },
        propConfigs: {
            value: { type: 'number', label: 'Current Value', group: 'Content', min: 0, max: 100 },
            max: { type: 'number', label: 'Max Value', group: 'Content', min: 1, max: 100 },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            color: {
                type: 'select',
                label: 'Color',
                group: 'Appearance',
                options: PROGRESS_COLORS
            },
            showPercentage: { type: 'boolean', label: 'Show Percentage', group: 'Display' },
            showLabel: { type: 'boolean', label: 'Show Label', group: 'Display' },
            label: { type: 'text', label: 'Label Text', group: 'Content' },
            animated: { type: 'boolean', label: 'Animated', group: 'Appearance' },
            striped: { type: 'boolean', label: 'Striped Pattern', group: 'Appearance' },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Progress indicator with multiple visual styles'
    },

    CircularProgress: {
        component: CircularProgress,
        defaultProps: {
            size: 'md',
            color: 'primary',
            speed: 'default',
            theme: null
        },
        propConfigs: {
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            color: {
                type: 'select',
                label: 'Color',
                group: 'Appearance',
                options: STATUS_COLORS
            },
            speed: {
                type: 'select',
                label: 'Animation Speed',
                group: 'Appearance',
                options: ['slow', 'default', 'fast']
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Circular loading spinner with animated rotation'
    },

    Typography: {
        component: Typography,
        defaultProps: {
            children: 'Sample Text',
            as: 'p',
            size: 'md',
            weight: 'normal',
            color: 'default',
            font: 'primary',
            theme: null
        },
        propConfigs: {
            children: { type: 'text', label: 'Text Content', group: 'Content' },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Appearance',
                options: EXTENDED_TEXT_SIZES
            },
            weight: {
                type: 'select',
                label: 'Font Weight',
                group: 'Appearance',
                options: ['light', 'normal', 'medium', 'semibold', 'bold']
            },
            color: {
                type: 'select',
                label: 'Color',
                group: 'Appearance',
                options: ['default', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'muted']
            },
            font: {
                type: 'select',
                label: 'Font Family',
                group: 'Appearance',
                options: ['primary', 'secondary', 'monospace']
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Flexible typography component for all text content'
    },

    Icon: {
        component: Icon,
        defaultProps: {
            name: 'FiHome',
            size: 'md',
            color: 'primary',
            hover: false,
            clickable: false,
            theme: null
        },
        propConfigs: {
            name: { 
                type: 'text', 
                label: 'Icon Name (react-icons)', 
                group: 'Content',
                placeholder: 'e.g., FiHome, MdSettings'
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: [...STANDARD_SIZES, '2xl']
            },
            color: {
                type: 'select',
                label: 'Color',
                group: 'Appearance',
                options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'text']
            },
            hover: { type: 'boolean', label: 'Hover Effect', group: 'Behavior' },
            clickable: { type: 'boolean', label: 'Clickable Style', group: 'Behavior' },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Icon component supporting react-icons library'
    },

    Card: {
        component: Card,
        defaultProps: {
            children: 'Card content goes here',
            padding: 'lg',
            layout: 'block',
            gap: 'lg',
            columns: 1,
            align: 'start',
            justify: 'start',
            wrap: true,
            hover: true,
            backgroundColor: null,
            genie: createCardGenieConfig('click'),
            genieTrigger: 'click'
        },
        propConfigs: {
            children: { type: 'text', label: 'Content', group: 'Content' },
            padding: {
                type: 'select',
                label: 'Padding',
                group: 'Spacing',
                options: COMMON_PADDING
            },
            layout: {
                type: 'select',
                label: 'Layout Type',
                group: 'Layout',
                options: COMMON_LAYOUTS
            },
            gap: {
                type: 'select',
                label: 'Gap',
                group: 'Spacing',
                options: COMMON_GAPS
            },
            columns: {
                type: 'select',
                label: 'Grid Columns',
                group: 'Layout',
                options: [1, 2, 3, 4, 5, 6, 'auto']
            },
            align: {
                type: 'select',
                label: 'Align Items',
                group: 'Layout',
                options: ALIGN_OPTIONS
            },
            justify: {
                type: 'select',
                label: 'Justify Content',
                group: 'Layout',
                options: JUSTIFY_OPTIONS
            },
            wrap: { type: 'boolean', label: 'Wrap Children (flex layouts)', group: 'Layout' },
            hover: { type: 'boolean', label: 'Enable Hover Effects', group: 'Appearance' },
            backgroundColor: {
                type: 'select',
                label: 'Background Variant',
                group: 'Appearance',
                options: [null, 'surface', 'background', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error'],
                optionLabels: { null: 'Theme Default' }
            },
            genieTrigger: {
                type: 'select',
                label: 'Genie Trigger',
                group: 'Genie',
                options: ['click', 'hover', 'contextmenu']
            }
        },
        description: 'Container with visible styling for content grouping'
    },

    Container: {
        component: Container,
        defaultProps: {
            children: 'Container content',
            layout: 'block',
            gap: 'lg',
            padding: 'md',
            columns: 1,
            align: 'start',
            justify: 'start',
            wrap: true,
            backgroundColor: null,
            genie: createContainerGenieConfig('click'),
            genieTrigger: 'click'
        },
        propConfigs: {
            children: { type: 'text', label: 'Content', group: 'Content' },
            layout: {
                type: 'select',
                label: 'Layout Type',
                group: 'Layout',
                options: COMMON_LAYOUTS
            },
            gap: {
                type: 'select',
                label: 'Gap',
                group: 'Spacing',
                options: COMMON_GAPS
            },
            padding: {
                type: 'select',
                label: 'Padding',
                group: 'Spacing',
                options: COMMON_PADDING
            },
            columns: {
                type: 'select',
                label: 'Grid Columns',
                group: 'Layout',
                options: [1, 2, 3, 4, 5, 6, 'auto']
            },
            align: {
                type: 'select',
                label: 'Align Items',
                group: 'Layout',
                options: ALIGN_OPTIONS
            },
            justify: {
                type: 'select',
                label: 'Justify Content',
                group: 'Layout',
                options: JUSTIFY_OPTIONS
            },
            wrap: { type: 'boolean', label: 'Wrap Children (flex layouts)', group: 'Layout' },
            genieTrigger: {
                type: 'select',
                label: 'Genie Trigger',
                group: 'Genie',
                options: ['click', 'hover', 'contextmenu']
            }
        },
        description: 'Flexible layout container with multiple layout modes'
    },

    ButtonGroup: {
        component: ButtonGroup,
        defaultProps: {
            children: null, // Will be handled specially
            size: 'md',
            spaced: false,
            theme: null
        },
        propConfigs: {
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            spaced: { type: 'boolean', label: 'Add Spacing Between Buttons', group: 'Layout' },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Groups buttons together with consistent sizing and shared styling'
    },

    TreeView: {
        component: TreeView,
        defaultProps: {
            data: {
                Documents: {
                    type: 'directory',
                    item: {
                        filePath: '/Documents',
                        type: 'directory',
                        fileName: 'Documents',
                        depth: 1,
                    },
                    children: {
                        Projects: {
                            type: 'directory',
                            item: {
                                filePath: '/Documents/Projects',
                                type: 'directory',
                                fileName: 'Projects',
                                depth: 2,
                            },
                            children: {
                                'Project Alpha.pdf': {
                                    type: 'file',
                                    item: {
                                        filePath: '/Documents/Projects/Project Alpha.pdf',
                                        type: 'file',
                                        fileName: 'Project Alpha.pdf',
                                        depth: 3,
                                    },
                                },
                                'Project Beta.docx': {
                                    type: 'file',
                                    item: {
                                        filePath: '/Documents/Projects/Project Beta.docx',
                                        type: 'file',
                                        fileName: 'Project Beta.docx',
                                        depth: 3,
                                    },
                                },
                            },
                        },
                        'Archive.zip': {
                            type: 'file',
                            item: {
                                filePath: '/Documents/Archive.zip',
                                type: 'file',
                                fileName: 'Archive.zip',
                                depth: 2,
                            },
                        },
                    },
                },
                Media: {
                    type: 'directory',
                    item: {
                        filePath: '/Media',
                        type: 'directory',
                        fileName: 'Media',
                        depth: 1,
                    },
                    children: {
                        'Logo.png': {
                            type: 'file',
                            item: {
                                filePath: '/Media/Logo.png',
                                type: 'file',
                                fileName: 'Logo.png',
                                depth: 2,
                            },
                        },
                    },
                },
            },
            expandedNodes: ['/Documents'],
            selectedNodes: [],
            searchable: false,
            color: 'default',
            size: 'md',
            showIcons: true,
            showConnectors: false,
            multiSelect: false,
            allowDragDrop: false,
            theme: null,
            getNodeGenie: (node) => ({
                trigger: 'contextmenu',
                variant: 'popover',
                position: 'auto',
                content: () => (
                    <Container layout="flex-column" gap="xs" padding="sm" width="220px">
                        <Typography size="sm" weight="semibold">{node.label}</Typography>
                        <Button size="sm" variant="ghost">
                            <Icon name="FiEye" size="sm" /> View
                        </Button>
                    </Container>
                )
            })
        },
        propConfigs: {
            searchable: { type: 'boolean', label: 'Enable Search', group: 'Features' },
            color: {
                type: 'select',
                label: 'Background Color',
                group: 'Appearance',
                options: TREEVIEW_COLORS
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Appearance',
                options: STANDARD_SIZES
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            },
            showIcons: { type: 'boolean', label: 'Show Expand Icons', group: 'Features' },
            showConnectors: { type: 'boolean', label: 'Show Connectors', group: 'Features' },
            multiSelect: { type: 'boolean', label: 'Allow Multi-Select', group: 'Features' },
            allowDragDrop: { type: 'boolean', label: 'Enable Drag & Drop', group: 'Features' }
        },
        description: 'Hierarchical tree view for displaying nested data structures'
    },

    Data: {
        component: Data,
        defaultProps: {
            data: [
                { 
                    id: 1, 
                    name: 'John Doe', 
                    email: 'john@example.com', 
                    role: 'Admin', 
                    status: 'Active',
                    department: 'Engineering',
                    joinDate: '2022-01-15',
                    salary: 120000,
                    address: {
                        street: '123 Main St',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94102'
                    },
                    skills: ['React', 'Node.js', 'Python', 'AWS'],
                    projects: [
                        { name: 'Project Alpha', role: 'Lead', status: 'Completed' },
                        { name: 'Project Beta', role: 'Contributor', status: 'In Progress' }
                    ],
                    metrics: {
                        tasksCompleted: 247,
                        avgRating: 4.8,
                        efficiency: 92
                    }
                },
                { 
                    id: 2, 
                    name: 'Jane Smith', 
                    email: 'jane@example.com', 
                    role: 'User', 
                    status: 'Active',
                    department: 'Design',
                    joinDate: '2021-06-20',
                    salary: 95000,
                    address: {
                        street: '456 Oak Ave',
                        city: 'Portland',
                        state: 'OR',
                        zip: '97201'
                    },
                    skills: ['Figma', 'Adobe XD', 'Sketch', 'CSS'],
                    projects: [
                        { name: 'UI Redesign', role: 'Lead', status: 'Completed' },
                        { name: 'Mobile App', role: 'Lead', status: 'In Progress' }
                    ],
                    metrics: {
                        tasksCompleted: 189,
                        avgRating: 4.9,
                        efficiency: 95
                    }
                },
                { 
                    id: 3, 
                    name: 'Bob Johnson', 
                    email: 'bob@example.com', 
                    role: 'User', 
                    status: 'Inactive',
                    department: 'Marketing',
                    joinDate: '2020-03-10',
                    salary: 75000,
                    address: {
                        street: '789 Pine Rd',
                        city: 'Austin',
                        state: 'TX',
                        zip: '78701'
                    },
                    skills: ['SEO', 'Content Marketing', 'Analytics'],
                    projects: [
                        { name: 'Campaign 2024', role: 'Manager', status: 'Completed' }
                    ],
                    metrics: {
                        tasksCompleted: 156,
                        avgRating: 4.5,
                        efficiency: 88
                    }
                },
                { 
                    id: 4, 
                    name: 'Alice Chen', 
                    email: 'alice@example.com', 
                    role: 'Manager', 
                    status: 'Active',
                    department: 'Engineering',
                    joinDate: '2019-09-01',
                    salary: 145000,
                    address: {
                        street: '321 Elm St',
                        city: 'Seattle',
                        state: 'WA',
                        zip: '98101'
                    },
                    skills: ['Leadership', 'System Design', 'Go', 'Kubernetes', 'DevOps'],
                    projects: [
                        { name: 'Infrastructure V2', role: 'Architect', status: 'In Progress' },
                        { name: 'Security Audit', role: 'Lead', status: 'Planning' },
                        { name: 'API Gateway', role: 'Lead', status: 'Completed' }
                    ],
                    metrics: {
                        tasksCompleted: 312,
                        avgRating: 4.95,
                        efficiency: 97
                    }
                },
                { 
                    id: 5, 
                    name: 'Carlos Rivera', 
                    email: 'carlos@example.com', 
                    role: 'User', 
                    status: 'Active',
                    department: 'Sales',
                    joinDate: '2023-02-14',
                    salary: 85000,
                    address: {
                        street: '555 Beach Blvd',
                        city: 'Miami',
                        state: 'FL',
                        zip: '33139'
                    },
                    skills: ['Salesforce', 'Negotiation', 'Client Relations'],
                    projects: [
                        { name: 'Q1 Sales Drive', role: 'Lead', status: 'Completed' },
                        { name: 'Enterprise Deals', role: 'Contributor', status: 'In Progress' }
                    ],
                    metrics: {
                        tasksCompleted: 98,
                        avgRating: 4.6,
                        efficiency: 89
                    }
                }
            ],
            fieldConfig: {
                name: {
                    component: Typography,
                    props: { weight: 'semibold', color: 'primary' }
                },
                email: {
                    component: Typography,
                    props: { font: 'monospace', color: 'muted' }
                },
                role: {
                    component: Badge,
                    transform: (value) => ({
                        color: value === 'Admin' ? 'error' : value === 'Manager' ? 'warning' : 'default',
                        children: value
                    })
                },
                status: {
                    component: Badge,
                    transform: (value) => ({
                        color: value === 'Active' ? 'success' : 'warning',
                        children: value
                    })
                },
                department: {
                    component: Badge,
                    transform: (value) => ({
                        color: value === 'Engineering' ? 'primary' : value === 'Design' ? 'secondary' : 'tertiary',
                        children: value
                    })
                },
                salary: {
                    component: Typography,
                    transform: (value) => ({
                        weight: 'semibold',
                        color: value >= 100000 ? 'success' : 'default',
                        children: `$${value.toLocaleString()}`
                    })
                }
            },
            variant: 'table',
            sortable: true,
            selector: false,
            pageSize: 10,
            theme: null,
            genie: createDataRowGenieConfig('click')
        },
        propConfigs: {
            size: {
                type: 'select',
                label: 'Component Size',
                group: 'Size',
                options: STANDARD_SIZES
            },
            variant: {
                type: 'select',
                label: 'Display Variant',
                group: 'Layout',
                options: ['table', 'cards', 'list']
            },
            sortable: { type: 'boolean', label: 'Enable Sorting', group: 'Features' },
            selector: { type: 'boolean', label: 'Enable Row Selection', group: 'Features' },
            pageSize: {
                type: 'number',
                label: 'Rows Per Page',
                group: 'Layout',
                min: 1,
                max: 100
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
    description: 'Flexible data display with table, cards, and list variants'
    },

    Editor: {
        component: Editor,
        defaultProps: {
            content: '# Hello World\n\nStart editing...',
            placeholder: 'Write something amazing...',
            readOnly: false,
            showToolbar: true,
            toolbarPosition: 'top',
            theme: null,
            diffContent: '# Previous Version\n\nThis version highlights what changed.',
            width: '100%',
            minHeight: '320px'
        },
        propConfigs: {
            placeholder: { type: 'text', label: 'Placeholder', group: 'Content' },
            readOnly: { type: 'boolean', label: 'Read Only', group: 'Behavior' },
            showToolbar: { type: 'boolean', label: 'Show Toolbar', group: 'Toolbar' },
            toolbarPosition: {
                type: 'select',
                label: 'Toolbar Position',
                group: 'Toolbar',
                options: ['top', 'bottom', 'none']
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            },
            width: {
                type: 'select',
                label: 'Width',
                group: 'Layout',
                options: ['100%', '80%', '640px'],
                optionLabels: {
                    '100%': 'Full Width',
                    '80%': '80%',
                    '640px': '640px'
                }
            },
            minHeight: {
                type: 'select',
                label: 'Minimum Height',
                group: 'Layout',
                options: ['240px', '320px', '480px'],
                optionLabels: {
                    '240px': '240px',
                    '320px': '320px',
                    '480px': '480px'
                }
            },
            diffContent: { type: 'text', label: 'Diff Content', group: 'Advanced' }
        },
    description: 'Rich MDX editor with markdown support and syntax highlighting'
    },

    Flow: {
        component: Flow,
        defaultProps: {
            nodes: [
                // Column 1: Entry Point
                {
                    id: 'start',
                    type: 'editable',
                    position: { x: 50, y: 300 },
                    data: { 
                        label: 'User Request', 
                        shape: 'circle', 
                        color: 'success',
                        fontSize: 'md',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }
                },
                // Column 2: API Gateway
                {
                    id: 'gateway',
                    type: 'editable',
                    position: { x: 320, y: 280 },
                    data: { 
                        label: 'API Gateway', 
                        shape: 'rectangle', 
                        color: 'primary',
                        fontSize: 'md',
                        fontWeight: 'semibold',
                        textAlign: 'center'
                    }
                },
                // Column 3: Authentication Decision
                {
                    id: 'auth',
                    type: 'editable',
                    position: { x: 610, y: 290 },
                    data: { 
                        label: 'Authenticated?', 
                        shape: 'diamond', 
                        color: 'warning',
                        fontSize: 'sm',
                        fontWeight: 'medium',
                        textAlign: 'center'
                    }
                },
                // Error branch (top)
                {
                    id: 'auth-fail',
                    type: 'editable',
                    position: { x: 630, y: 80 },
                    data: { 
                        label: '401 Error', 
                        shape: 'circle', 
                        color: 'error',
                        fontSize: 'sm',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }
                },
                // Column 4: Database Query (main path)
                {
                    id: 'query',
                    type: 'editable',
                    position: { x: 920, y: 280 },
                    data: { 
                        label: 'Fetch Data', 
                        shape: 'rectangle', 
                        color: 'secondary',
                        fontSize: 'sm',
                        fontWeight: 'medium',
                        textAlign: 'center'
                    }
                },
                // Database (directly below)
                {
                    id: 'database',
                    type: 'editable',
                    position: { x: 920, y: 480 },
                    data: { 
                        label: 'Database', 
                        shape: 'cylinder', 
                        color: 'tertiary',
                        fontSize: 'lg',
                        fontWeight: 'extrabold',
                        textAlign: 'center'
                    }
                },
                // Column 5: Business Logic
                {
                    id: 'process',
                    type: 'editable',
                    position: { x: 1220, y: 280 },
                    data: { 
                        label: 'Process Logic', 
                        shape: 'rectangle', 
                        color: 'primary',
                        fontSize: 'md',
                        fontWeight: 'semibold',
                        textAlign: 'center'
                    }
                },
                // Column 6: Validation Decision
                {
                    id: 'validate',
                    type: 'editable',
                    position: { x: 1520, y: 290 },
                    data: { 
                        label: 'Valid Data?', 
                        shape: 'diamond', 
                        color: 'warning',
                        fontSize: 'sm',
                        fontWeight: 'medium',
                        textAlign: 'center'
                    }
                },
                // Error branch (top)
                {
                    id: 'validation-fail',
                    type: 'editable',
                    position: { x: 1540, y: 80 },
                    data: { 
                        label: '400 Error', 
                        shape: 'circle', 
                        color: 'error',
                        fontSize: 'sm',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }
                },
                // Column 7: Cache Update (main path)
                {
                    id: 'cache-update',
                    type: 'editable',
                    position: { x: 1830, y: 280 },
                    data: { 
                        label: 'Update Cache', 
                        shape: 'rectangle', 
                        color: 'primary',
                        fontSize: 'sm',
                        fontWeight: 'medium',
                        textAlign: 'center'
                    }
                },
                // Redis (directly below)
                {
                    id: 'cache',
                    type: 'editable',
                    position: { x: 1830, y: 480 },
                    data: { 
                        label: 'Redis', 
                        shape: 'cylinder', 
                        color: 'secondary',
                        fontSize: 'md',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }
                },
                // Column 8: Success Response
                {
                    id: 'response',
                    type: 'editable',
                    position: { x: 2130, y: 280 },
                    data: { 
                        label: 'Send Response', 
                        shape: 'rectangle', 
                        color: 'primary',
                        fontSize: 'md',
                        fontWeight: 'semibold',
                        textAlign: 'center'
                    }
                },
                // Column 9: End Point
                {
                    id: 'success',
                    type: 'editable',
                    position: { x: 2430, y: 300 },
                    data: { 
                        label: '200 OK', 
                        shape: 'circle', 
                        color: 'success',
                        fontSize: 'md',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }
                }
            ],
            edges: [
                // Main flow path (left to right)
                { 
                    id: 'e-start-gateway', 
                    source: 'start', 
                    target: 'gateway',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'POST /api/data',
                    type: 'default', 
                    animated: true,
                    data: { color: 'primary' },
                    markerEnd: { type: 'arrowclosed' }
                },
                { 
                    id: 'e-gateway-auth', 
                    source: 'gateway', 
                    target: 'auth',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'Check JWT',
                    type: 'default', 
                    animated: true,
                    data: { color: 'primary' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Auth failure branch (up)
                { 
                    id: 'e-auth-fail', 
                    source: 'auth', 
                    target: 'auth-fail',
                    sourceHandle: 'top-source',
                    targetHandle: 'bottom-target',
                    label: 'No',
                    type: 'default', 
                    animated: false,
                    data: { color: 'error' },
                    style: { strokeWidth: 2 },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Auth success to query
                { 
                    id: 'e-auth-query', 
                    source: 'auth', 
                    target: 'query',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'Yes',
                    type: 'default', 
                    animated: true,
                    data: { color: 'success' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Database interaction (bidirectional with offset paths)
                { 
                    id: 'e-query-db', 
                    source: 'query', 
                    target: 'database',
                    sourceHandle: 'bottom-source',
                    targetHandle: 'left-target',
                    label: 'SELECT',
                    type: 'default', 
                    animated: false,
                    data: { color: 'secondary' },
                    style: { strokeWidth: 2 },
                    markerEnd: { type: 'arrowclosed' }
                },
                { 
                    id: 'e-db-query', 
                    source: 'database', 
                    target: 'query',
                    sourceHandle: 'right-source',
                    targetHandle: 'bottom-target',
                    label: 'Results',
                    type: 'default', 
                    animated: false,
                    data: { color: 'tertiary' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Query to process
                { 
                    id: 'e-query-process', 
                    source: 'query', 
                    target: 'process',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'Transform',
                    type: 'default', 
                    animated: true,
                    data: { color: 'primary' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Process to validate
                { 
                    id: 'e-process-validate', 
                    source: 'process', 
                    target: 'validate',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'Check Rules',
                    type: 'default', 
                    animated: true,
                    data: { color: 'primary' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Validation failure branch (up)
                { 
                    id: 'e-validate-fail', 
                    source: 'validate', 
                    target: 'validation-fail',
                    sourceHandle: 'top-source',
                    targetHandle: 'bottom-target',
                    label: 'No',
                    type: 'default', 
                    animated: false,
                    data: { color: 'error' },
                    style: { strokeWidth: 2 },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Validation success to cache
                { 
                    id: 'e-validate-cache', 
                    source: 'validate', 
                    target: 'cache-update',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'Yes',
                    type: 'default', 
                    animated: true,
                    data: { color: 'success' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Cache interaction (bidirectional with offset paths)
                { 
                    id: 'e-cache-redis', 
                    source: 'cache-update', 
                    target: 'cache',
                    sourceHandle: 'bottom-source',
                    targetHandle: 'left-target',
                    label: 'SET key',
                    type: 'default', 
                    animated: false,
                    data: { color: 'primary' },
                    style: { strokeWidth: 2 },
                    markerEnd: { type: 'arrowclosed' }
                },
                { 
                    id: 'e-redis-cache', 
                    source: 'cache', 
                    target: 'cache-update',
                    sourceHandle: 'right-source',
                    targetHandle: 'bottom-target',
                    label: 'OK',
                    type: 'default', 
                    animated: false,
                    data: { color: 'secondary' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Cache to response
                { 
                    id: 'e-cache-response', 
                    source: 'cache-update', 
                    target: 'response',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'Format JSON',
                    type: 'default', 
                    animated: true,
                    data: { color: 'primary' },
                    markerEnd: { type: 'arrowclosed' }
                },
                // Response to success
                { 
                    id: 'e-response-success', 
                    source: 'response', 
                    target: 'success',
                    sourceHandle: 'right-source',
                    targetHandle: 'left-target',
                    label: 'Complete',
                    type: 'default', 
                    animated: true,
                    data: { color: 'success' },
                    style: { strokeWidth: 3 },
                    markerEnd: { type: 'arrowclosed' }
                }
            ],
            size: 'md',
            fitView: true,
            draggable: true,
            connectable: true,
            deletable: true,
            zoomable: true,
            pannable: false,
            selectable: true,
            enableNodeCreation: false,
            nodeCreationKey: 'shift',
            defaultNodeData: {
                label: 'New Node',
                color: 'primary',
                shape: 'rectangle'
            },
            controls: true,
            minimap: false,
            background: true,
            backgroundVariant: 'dots',
            theme: null,
            width: '100%'
        },
        propConfigs: {
            size: {
                type: 'select',
                label: 'Height Size',
                group: 'Layout',
                options: STANDARD_SIZES
            },
            fitView: { type: 'boolean', label: 'Fit View', group: 'Viewport' },
            draggable: { type: 'boolean', label: 'Draggable Nodes', group: 'Interaction' },
            connectable: { type: 'boolean', label: 'Connectable Nodes', group: 'Interaction' },
            deletable: { type: 'boolean', label: 'Deletable Elements', group: 'Interaction' },
            zoomable: { type: 'boolean', label: 'Enable Zoom', group: 'Interaction' },
            pannable: { type: 'boolean', label: 'Enable Panning', group: 'Interaction' },
            selectable: { type: 'boolean', label: 'Selectable Elements', group: 'Interaction' },
            enableNodeCreation: { type: 'boolean', label: 'Enable Node Creation', group: 'Interaction' },
            nodeCreationKey: {
                type: 'select',
                label: 'Node Creation Key',
                group: 'Interaction',
                options: ['shift', 'ctrl', 'alt', 'none'],
                optionLabels: {
                    'shift': 'Shift + Click',
                    'ctrl': 'Ctrl/Cmd + Click',
                    'alt': 'Alt + Click',
                    'none': 'Click Only'
                }
            },
            controls: { type: 'boolean', label: 'Show Controls', group: 'UI Elements' },
            minimap: { type: 'boolean', label: 'Show Minimap', group: 'UI Elements' },
            background: { type: 'boolean', label: 'Show Background', group: 'UI Elements' },
            backgroundVariant: {
                type: 'select',
                label: 'Background Pattern',
                group: 'UI Elements',
                options: ['dots', 'lines', 'cross']
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            },
            width: {
                type: 'select',
                label: 'Container Width',
                group: 'Layout',
                options: ['100%', '80%', '600px', '800px'],
                optionLabels: {
                    '100%': 'Full Width',
                    '80%': '80%',
                    '600px': '600px',
                    '800px': '800px'
                }
            }
        },
        description: 'Interactive flow diagrams with React Flow - draggable, zoomable, connectable nodes with right-click Genie editing for shapes, colors, and typography (font size, weight, alignment)'
    },

    FloatingActionButton: {
        component: FloatingActionButton,
        defaultProps: {
            icon: 'FiPlus',
            variant: 'primary',
            size: 'md',
            position: 'bottom-right',
            disabled: false,
            draggable: false,
            iconSize: null,
            badge: null,
            snapToEdges: true,
            snapThreshold: 100,
            edgePadding: 15,
            parentType: 'auto',
            theme: null,
            genie: createFabGenieConfig('click'),
            genieTrigger: 'click'
        },
        propConfigs: {
            icon: { 
                type: 'text', 
                label: 'Icon Name', 
                group: 'Content',
                placeholder: 'e.g., FiPlus, FiEdit, FiSettings, FiHeart, FiMail'
            },
            variant: {
                type: 'select',
                label: 'Variant',
                group: 'Appearance',
                options: FAB_VARIANTS
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: FAB_SIZES
            },
            position: {
                type: 'select',
                label: 'Position',
                group: 'Layout',
                options: FAB_POSITIONS
            },
            disabled: { type: 'boolean', label: 'Disabled', group: 'State' },
            draggable: { type: 'boolean', label: 'Draggable', group: 'Behavior' },
            iconSize: {
                type: 'select',
                label: 'Icon Size Override',
                group: 'Appearance',
                options: [null, 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
                optionLabels: { null: 'Auto (based on button size)' }
            },
            badge: {
                type: 'text',
                label: 'Badge Text',
                group: 'Content',
                placeholder: 'e.g., 5, New, !'
            },
            snapToEdges: { type: 'boolean', label: 'Snap To Edges', group: 'Behavior' },
            snapThreshold: { type: 'number', label: 'Snap Threshold (px)', group: 'Behavior', min: 10, max: 300 },
            edgePadding: { type: 'number', label: 'Edge Padding (px)', group: 'Behavior', min: 0, max: 100 },
            parentType: {
                type: 'select',
                label: 'Parent Type',
                group: 'Layout',
                options: FAB_PARENT_TYPES
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            },
            genieTrigger: {
                type: 'select',
                label: 'Genie Trigger',
                group: 'Genie',
                options: ['click', 'hover', 'contextmenu']
            }
        },
    description: 'Floating action button with fixed positioning and drag support'
    },

    Image: {
        component: Image,
        defaultProps: {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            alt: 'Demo landscape image',
            editable: true,
            size: 'md',
            fit: 'contain',
            controlsPlacement: 'bottom-right',
            allowDownload: true,
            fileName: 'edited-image',
            outputFormat: 'image/png',
            outputQuality: 0.92,
            theme: null
        },
        propConfigs: {
            src: {
                type: 'select',
                label: 'Image Source',
                group: 'Content',
                options: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop'
                ],
                optionLabels: {
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop': 'Mountain Landscape',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop': 'Forest Scene',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop': 'Beach Sunset',
                    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop': 'Desert Vista'
                }
            },
            alt: { type: 'text', label: 'Alt Text', group: 'Content' },
            editable: { type: 'boolean', label: 'Editable', group: 'Behavior' },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Size',
                options: [null, 'xs', 'sm', 'md', 'lg', 'xl', 'full'],
                optionLabels: { null: 'Natural Size', xs: 'XS', sm: 'SM', md: 'MD', lg: 'LG', xl: 'XL', full: 'Full Width' }
            },
            fit: {
                type: 'select',
                label: 'Object Fit',
                group: 'Appearance',
                options: ['contain', 'cover', 'fill', 'none', 'scale-down']
            },
            controlsPlacement: {
                type: 'select',
                label: 'Controls Placement',
                group: 'Layout',
                options: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
            },
            allowDownload: { type: 'boolean', label: 'Allow Download', group: 'Behavior' },
            fileName: { type: 'text', label: 'Download File Name', group: 'Behavior' },
            outputFormat: {
                type: 'select',
                label: 'Output Format',
                group: 'Behavior',
                options: ['image/png', 'image/jpeg', 'image/webp']
            },
            outputQuality: { type: 'number', label: 'Output Quality', group: 'Behavior', min: 0.1, max: 1, step: 0.1 },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Enhanced image component with CSS-based editing (rotation, filters, transforms, crop)'
    },

    Video: {
        component: Video,
        defaultProps: {
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            poster: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&auto=format&fit=crop',
            autoPlay: false,
            loop: false,
            muted: false,
            volume: 0.8,
            aspectRatio: '16/9',
            width: '100%',
            color: 'default',
            theme: null
        },
        propConfigs: {
            src: {
                type: 'text',
                label: 'Video Source URL',
                group: 'Content',
                placeholder: 'https://example.com/video.mp4'
            },
            poster: {
                type: 'text',
                label: 'Poster Image URL',
                group: 'Content',
                placeholder: 'Optional poster image shown before playback'
            },
            autoPlay: { type: 'boolean', label: 'Autoplay', group: 'Playback' },
            loop: { type: 'boolean', label: 'Loop', group: 'Playback' },
            muted: { type: 'boolean', label: 'Muted', group: 'Playback' },
            volume: {
                type: 'number',
                label: 'Initial Volume',
                group: 'Playback',
                min: 0,
                max: 1,
                step: 0.05
            },
            aspectRatio: {
                type: 'select',
                label: 'Aspect Ratio',
                group: 'Layout',
                options: ['21/9', '16/9', '4/3', '1/1', '9/16'],
                optionLabels: {
                    '21/9': '21:9 Wide',
                    '16/9': '16:9 Standard',
                    '4/3': '4:3 Classic',
                    '1/1': 'Square',
                    '9/16': '9:16 Portrait'
                }
            },
            width: {
                type: 'select',
                label: 'Width',
                group: 'Layout',
                options: ['100%', '80%', '640px', '960px']
            },
            color: {
                type: 'select',
                label: 'Control Bar Color',
                group: 'Appearance',
                options: ['default', 'primary', 'secondary', 'tertiary'],
                optionLabels: {
                    'default': 'Default (Surface)',
                    'primary': 'Primary',
                    'secondary': 'Secondary',
                    'tertiary': 'Tertiary'
                }
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Slim horizontal video player with hover-revealed controls and color variants'
    },

    Audio: {
        component: Audio,
        defaultProps: {
            src: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
            title: 'Lofi Study',
            artist: 'FASSounds',
            album: 'Chill Beats Vol. 1',
            cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80',
            autoPlay: false,
            loop: false,
            muted: false,
            initialVolume: 0.8,
            color: 'default',
            size: 'md',
            theme: null
        },
        propConfigs: {
            src: {
                type: 'text',
                label: 'Audio Source URL',
                group: 'Content',
                placeholder: 'https://example.com/audio.mp3'
            },
            title: {
                type: 'text',
                label: 'Track Title',
                group: 'Content',
                placeholder: 'Enter track title'
            },
            artist: {
                type: 'text',
                label: 'Artist Name',
                group: 'Content',
                placeholder: 'Enter artist name'
            },
            album: {
                type: 'text',
                label: 'Album Name',
                group: 'Content',
                placeholder: 'Enter album name'
            },
            cover: {
                type: 'text',
                label: 'Cover Image URL',
                group: 'Content',
                placeholder: 'Album or track cover image'
            },
            autoPlay: { type: 'boolean', label: 'Autoplay', group: 'Playback' },
            loop: { type: 'boolean', label: 'Loop', group: 'Playback' },
            muted: { type: 'boolean', label: 'Muted', group: 'Playback' },
            initialVolume: {
                type: 'number',
                label: 'Initial Volume',
                group: 'Playback',
                min: 0,
                max: 1,
                step: 0.05
            },
            size: {
                type: 'select',
                label: 'Size',
                group: 'Appearance',
                options: ['xs', 'sm', 'md', 'lg', 'xl'],
                optionLabels: {
                    'xs': 'XS (100px)',
                    'sm': 'Small (120px)',
                    'md': 'Medium (160px)',
                    'lg': 'Large (200px)',
                    'xl': 'XL (240px)'
                }
            },
            color: {
                type: 'select',
                label: 'Color Variant',
                group: 'Appearance',
                options: ['default', 'primary', 'secondary', 'tertiary'],
                optionLabels: {
                    'default': 'Default',
                    'primary': 'Primary',
                    'secondary': 'Secondary',
                    'tertiary': 'Tertiary'
                }
            },
            theme: {
                type: 'select',
                label: 'Theme Override',
                group: 'Appearance',
                options: THEME_OVERRIDES,
                optionLabels: THEME_OPTION_LABELS
            }
        },
        description: 'Spinning disc audio player with minimalist design and centered controls'
    },
};
const DEFAULT_COMPONENT = 'Button';

const cloneDefaultPropsForComponent = (componentName) => {
    const metadata = COMPONENT_METADATA[componentName];
    if (!metadata?.defaultProps) {
        return {};
    }

    return { ...metadata.defaultProps };
};

const generateJSXPreview = (componentName, props = {}) => {
    if (!componentName) {
        return '';
    }

    // Extract complex props that need special handling
    // We'll add genie props back in a readable format
    const { children, genie, getNodeGenie, data, options, expandedNodes, selectedNodes, content, diffContent, fieldConfig, genieTrigger, onGenieShow, onGenieHide, ...displayProps } = props;
    
    // Generate JSX props with proper formatting
    const propStrings = Object.entries(displayProps)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
            if (typeof value === 'boolean') {
                return value ? key : `${key}={false}`;
            }
            if (typeof value === 'string') {
                return `${key}="${value}"`;
            }
            if (typeof value === 'number') {
                return `${key}={${value}}`;
            }
            return `${key}={${JSON.stringify(value)}}`;
        });
    
    // Add genie props if present (show in readable format)
    if (genie && typeof genie === 'object') {
        propStrings.push(`genie={{
    trigger: '${genie.trigger || genieTrigger || 'click'}',
    variant: '${genie.variant || 'popover'}',
    position: '${genie.position || 'auto'}',
    content: (props) => <YourGenieContent {...props} />
  }}`);
    } else if (genieTrigger) {
        propStrings.push(`genieTrigger="${genieTrigger}"`);
    }
    
    // Add getNodeGenie for TreeView
    if (getNodeGenie && typeof getNodeGenie === 'function') {
        const actualTrigger = genieTrigger || 'click';
        propStrings.push(`getNodeGenie={(node) => ({
    trigger: '${actualTrigger}',
    variant: 'popover',
    content: (props) => <YourGenieContent node={node} {...props} />
  })}`);
    }
    
    const childrenText = typeof children === 'string' ? children : '';
    
    // Special case: Data component - show abbreviated data and fieldConfig
    if (componentName === 'Data') {
        const complexProps = [];
        
        // Add data prop with abbreviated content
        if (data && Array.isArray(data) && data.length > 0) {
            const dataPreview = data.length <= 2 
                ? JSON.stringify(data, null, 2)
                : `[\n    ${JSON.stringify(data[0], null, 2).split('\n').join('\n    ')},\n    // ... ${data.length - 1} more items\n  ]`;
            complexProps.push(`  data={${dataPreview.split('\n').join('\n    ')}}`);
        }
        
        // Add fieldConfig prop with abbreviated content
        if (fieldConfig && Object.keys(fieldConfig).length > 0) {
            const fields = Object.keys(fieldConfig);
            const fieldConfigPreview = `{\n    ${fields.slice(0, 2).map(field => {
                const config = fieldConfig[field];
                if (config.transform) {
                    return `${field}: {\n      component: ${config.component.name},\n      transform: (value) => ({ /* styling logic */ })\n    }`;
                }
                return `${field}: {\n      component: ${config.component.name},\n      props: ${JSON.stringify(config.props)}\n    }`;
            }).join(',\n    ')}${fields.length > 2 ? `,\n    // ... ${fields.length - 2} more fields` : ''}\n  }`;
            complexProps.push(`  fieldConfig={${fieldConfigPreview.split('\n').join('\n    ')}}`);
        }
        
        // Combine all props
        const allProps = [...complexProps, ...propStrings.map(prop => `  ${prop}`)].join('\n');
        
        if (complexProps.length === 0 && propStrings.length === 0) {
            return `<Data />`;
        }
        
        return `<Data\n${allProps}\n/>`;
    }
    
    // Special case: TreeView - show abbreviated data prop
    if (componentName === 'TreeView') {
        const complexProps = [];
        
        // Add data prop with abbreviated content
        if (data && typeof data === 'object') {
            const topLevelKeys = Object.keys(data);
            const firstKey = topLevelKeys[0];
            const firstNode = data[firstKey];
            
            // Show first node structure with children abbreviated
            const dataPreview = `{\n    ${firstKey}: {\n      type: "${firstNode.type}",\n      item: { /* node metadata */ },\n      children: { /* nested nodes */ }\n    }${topLevelKeys.length > 1 ? `,\n    // ... ${topLevelKeys.length - 1} more nodes` : ''}\n  }`;
            complexProps.push(`  data={${dataPreview.split('\n').join('\n    ')}}`);
        }
        
        // Combine all props
        const allProps = [...complexProps, ...propStrings.map(prop => `  ${prop}`)].join('\n');
        
        if (complexProps.length === 0 && propStrings.length === 0) {
            return `<TreeView />`;
        }
        
        return `<TreeView\n${allProps}\n/>`;
    }
    
    // Special case: ButtonGroup always shows nested buttons
    if (componentName === 'ButtonGroup') {
        const buttonGroupChildren = `  <Button color="primary">Option 1</Button>
  <Button color="secondary">Option 2</Button>
  <Button color="tertiary">Option 3</Button>`;
        
        if (propStrings.length === 0) {
            return `<ButtonGroup>\n${buttonGroupChildren}\n</ButtonGroup>`;
        }
        if (propStrings.length === 1) {
            return `<ButtonGroup ${propStrings[0]}>\n${buttonGroupChildren}\n</ButtonGroup>`;
        }
        const propsFormatted = propStrings.map(prop => `  ${prop}`).join('\n');
        return `<ButtonGroup\n${propsFormatted}\n>\n${buttonGroupChildren}\n</ButtonGroup>`;
    }
    
    // Standard formatting for all other components
    if (propStrings.length === 0) {
        return childrenText 
            ? `<${componentName}>${childrenText}</${componentName}>`
            : `<${componentName} />`;
    }
    
    if (propStrings.length === 1) {
        const propsLine = propStrings[0];
        return childrenText
            ? `<${componentName} ${propsLine}>${childrenText}</${componentName}>`
            : `<${componentName} ${propsLine} />`;
    }
    
    // Multiple props - format on separate lines
    const propsFormatted = propStrings.map(prop => `  ${prop}`).join('\n');
    
    if (childrenText) {
        return `<${componentName}
${propsFormatted}
>
  ${childrenText}
</${componentName}>`;
    }
    
    return `<${componentName}
${propsFormatted}
/>`;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ComponentDemoRefactoredNew = () => {
    const { currentTheme, switchTheme, availableThemes } = useTheme();
    
    // State management
    const [selectedComponent, setSelectedComponent] = useState(DEFAULT_COMPONENT);
    const [componentProps, setComponentProps] = useState(() => cloneDefaultPropsForComponent(DEFAULT_COMPONENT));

    const jsxPreview = useMemo(
        () => generateJSXPreview(selectedComponent, componentProps),
        [selectedComponent, componentProps]
    );


    // Handle prop change from controls
    const handlePropChange = (propName, value) => {
        setComponentProps(prev => {
            const updated = {
                ...prev,
                [propName]: value
            };
            
            // If genieTrigger changes, rebuild the genie object with new trigger
            if (propName === 'genieTrigger') {
                switch (selectedComponent) {
                    case 'Button':
                        if (prev.genie) updated.genie = createButtonGenieConfig(value);
                        break;
                    case 'Card':
                        if (prev.genie) updated.genie = createCardGenieConfig(value);
                        break;
                    case 'Container':
                        if (prev.genie) updated.genie = createContainerGenieConfig(value);
                        break;
                    case 'Data':
                        if (prev.genie) updated.genie = createDataRowGenieConfig(value);
                        break;
                    case 'FloatingActionButton':
                        if (prev.genie) updated.genie = createFabGenieConfig(value);
                        break;
                    case 'TreeView':
                        // TreeView uses getNodeGenie, which receives trigger from the function
                        updated.getNodeGenie = (node) => ({
                            trigger: value,
                            variant: 'popover',
                            position: 'auto',
                            content: () => (
                                <Container layout="flex-column" gap="xs" padding="sm" width="220px">
                                    <Typography size="sm" weight="semibold">{node.label}</Typography>
                                    <Button size="sm" variant="ghost">
                                        <Icon name="FiEye" size="sm" /> View
                                    </Button>
                                </Container>
                            )
                        });
                        break;
                }
            }
            
            return updated;
        });
    };

    const handleComponentSelect = (componentName) => {
        const metadata = COMPONENT_METADATA[componentName];
        if (!metadata) return;

        setSelectedComponent(componentName);
        setComponentProps(cloneDefaultPropsForComponent(componentName));
    };

    const handleTreeNodeExpand = useCallback((nodeId, isExpanded) => {
        setComponentProps(prev => {
            const previous = Array.isArray(prev.expandedNodes) ? prev.expandedNodes : [];
            const updated = new Set(previous);

            if (isExpanded) {
                updated.add(nodeId);
            } else {
                updated.delete(nodeId);
            }

            return {
                ...prev,
                expandedNodes: Array.from(updated)
            };
        });
    }, [setComponentProps]);

    const handleTreeNodeSelect = useCallback((nodeId, _isSelected, selectedIds) => {
        setComponentProps(prev => ({
            ...prev,
            selectedNodes: Array.isArray(selectedIds) ? selectedIds : []
        }));
    }, [setComponentProps]);

    // Render prop control based on type
    const renderPropControl = (propName, config) => {
        const value = componentProps[propName];

        switch (config.type) {
            case 'boolean':
                return (
                    <Container 
                        layout="flex-column" 
                        align="start" 
                        gap="xs" 
                        padding="none"
                        minWidth="200px"
                        key={propName}
                    >
                        <Switch
                            checked={value || false}
                            onChange={(e) => handlePropChange(propName, e.target.checked)}
                            label={config.label}
                            size="sm"
                        />
                    </Container>
                );

            case 'select':
                return (
                    <Container 
                        layout="flex-column" 
                        gap="xs" 
                        padding="none"
                        minWidth="200px"
                        key={propName}
                    >
                        <Select
                            label={config.label}
                            value={value === null ? 'null' : value}
                            onChange={(selectedValue) => {
                                // Convert 'null' string back to actual null
                                const normalized = Array.isArray(selectedValue)
                                    ? selectedValue.map(v => v === 'null' ? null : v)
                                    : selectedValue === 'null' ? null : selectedValue;
                                handlePropChange(propName, normalized);
                            }}
                            options={config.options.map(opt => ({
                                value: opt === null ? 'null' : opt,
                                label: config.optionLabels?.[opt] || (opt === null ? 'None' : String(opt))
                            }))}
                            size="sm"
                            variant="outline"
                        />
                    </Container>
                );

            case 'number':
                return (
                    <Container 
                        layout="flex-column" 
                        gap="xs" 
                        padding="none"
                        minWidth="200px"
                        key={propName}
                    >
                        <Input
                            type="number"
                            label={config.label}
                            value={value || ''}
                            onChange={(e) => handlePropChange(propName, parseFloat(e.target.value) || 0)}
                            size="sm"
                            variant="outline"
                            {...(config.min !== undefined && { min: config.min })}
                            {...(config.max !== undefined && { max: config.max })}
                        />
                    </Container>
                );

            case 'text':
            default:
                return (
                    <Container 
                        layout="flex-column" 
                        gap="xs" 
                        padding="none"
                        minWidth="200px"
                        key={propName}
                    >
                        <Input
                            type="text"
                            label={config.label}
                            value={value || ''}
                            onChange={(e) => handlePropChange(propName, e.target.value)}
                            placeholder={config.placeholder}
                            size="sm"
                            variant="outline"
                        />
                    </Container>
                );
        }
    };

    // Render live demo based on selected component - using useMemo for proper re-rendering
    const liveDemo = useMemo(() => {
        const metadata = COMPONENT_METADATA[selectedComponent];
        if (!metadata) return null;

        const ComponentToRender = metadata.component;
        const effectiveProps = componentProps;

        if (selectedComponent === 'Select') {
            return (
                <ComponentToRender
                    {...effectiveProps}
                    onChange={(selectedValue) => handlePropChange('value', selectedValue)}
                />
            );
        }

        if (selectedComponent === 'Switch') {
            return (
                <ComponentToRender
                    {...effectiveProps}
                    onChange={(e) => handlePropChange('checked', e.target.checked)}
                />
            );
        }

        if (selectedComponent === 'Input') {
            return (
                <ComponentToRender
                    {...effectiveProps}
                    onChange={(e) => handlePropChange('value', e.target.value)}
                />
            );
        }

        if (selectedComponent === 'Button') {
            const { icon, iconPosition, children, ...restProps } = effectiveProps;
            
            return (
                <ComponentToRender {...restProps}>
                    {icon && iconPosition === 'left' && <Icon name={icon} />}
                    {children}
                    {icon && iconPosition === 'right' && <Icon name={icon} />}
                </ComponentToRender>
            );
        }

        if (selectedComponent === 'ButtonGroup') {
            return (
                <ComponentToRender {...effectiveProps}>
                    <Button color="primary">Option 1</Button>
                    <Button color="secondary">Option 2</Button>
                    <Button color="tertiary">Option 3</Button>
                </ComponentToRender>
            );
        }

        if (selectedComponent === 'TreeView') {
            return (
                <Container width="100%" maxWidth="400px" padding="none">
                    <ComponentToRender
                        {...effectiveProps}
                        onNodeExpand={handleTreeNodeExpand}
                        onNodeSelect={handleTreeNodeSelect}
                    />
                </Container>
            );
        }

        if (selectedComponent === 'Data') {
            return (
                <Container width="100%" padding="none">
                    <ComponentToRender {...effectiveProps} />
                </Container>
            );
        }

        if (selectedComponent === 'Editor') {
            return (
                <Container width="100%" minHeight="300px" padding="none">
                    <ComponentToRender
                        {...effectiveProps}
                        onChange={(content) => handlePropChange('content', content)}
                    />
                </Container>
            );
        }

        if (selectedComponent === 'Flow') {
            return (
                <Container width="100%" minHeight="300px" padding="none">
                    <ComponentToRender
                        {...effectiveProps}
                        onChange={({ nodes, edges }) => {
                            handlePropChange('nodes', nodes);
                            handlePropChange('edges', edges);
                        }}
                    />
                </Container>
            );
        }

        if (selectedComponent === 'FloatingActionButton') {
            return (
                <Container
                    width="100%"
                    height="300px"
                    padding="md"
                    layout="positioned"
                    style={{
                        border: '1px dashed var(--border-color)',
                        borderRadius: 'var(--border-radius)'
                    }}
                >
                    <Container padding="none" width="100%">
                        <Typography size="sm" color="muted">
                            FAB is positioned relative to this container
                        </Typography>
                    </Container>
                    <ComponentToRender
                        {...effectiveProps}
                    />
                </Container>
            );
        }

        if (selectedComponent === 'Card') {
            // Extract layout-related props from componentProps
            const { layout, gap, align, justify, columns, wrap, padding, elevation, backgroundColor, children, ...restProps } = effectiveProps;
            
            return (
                <ComponentToRender
                    layout={layout}
                    gap={gap}
                    align={align}
                    justify={justify}
                    columns={columns}
                    wrap={wrap}
                    padding={padding}
                    elevation={elevation}
                    backgroundColor={backgroundColor}
                    width="100%"
                    minHeight="300px"
                    {...restProps}
                >
                    {/* Card with natural width (no width prop) */}
                    <Card padding="sm" elevation="sm" backgroundColor="surface">
                        <Typography size="xs" weight="semibold" color="primary">
                            Natural Width
                        </Typography>
                        <Typography size="xl" weight="bold">1,234</Typography>
                        <Typography size="xs" color="muted">No width set</Typography>
                    </Card>

                    {/* Card with flexFill (stretches to fill available space) */}
                    <Card padding="sm" elevation="sm" backgroundColor="surface" flexFill>
                        <Typography size="xs" weight="semibold" color="success">
                            With flexFill
                        </Typography>
                        <Typography size="xl" weight="bold">98%</Typography>
                        <Typography size="xs" color="muted">Stretches to fill</Typography>
                    </Card>

                    {/* Card with fixed width */}
                    <Card padding="sm" elevation="sm" backgroundColor="surface" width="200px">
                        <Typography size="xs" weight="semibold" color="warning">
                            Fixed Width
                        </Typography>
                        <Typography size="xl" weight="bold">200px</Typography>
                        <Typography size="xs" color="muted">width="200px"</Typography>
                    </Card>

                    {/* Card with minWidth */}
                    <Card padding="sm" elevation="sm" backgroundColor="surface" minWidth="150px">
                        <Typography size="xs" weight="semibold" color="error">
                            Min Width
                        </Typography>
                        <Typography size="xl" weight="bold">150px+</Typography>
                        <Typography size="xs" color="muted">minWidth="150px"</Typography>
                    </Card>

                    {/* Card with maxWidth */}
                    <Card padding="sm" elevation="sm" backgroundColor="surface" maxWidth="180px">
                        <Typography size="xs" weight="semibold" color="tertiary">
                            Max Width
                        </Typography>
                        <Typography size="xl" weight="bold">≤180px</Typography>
                        <Typography size="xs" color="muted">maxWidth="180px"</Typography>
                    </Card>

                    {/* Card demonstrating padding variations */}
                    <Card padding="xs" elevation="sm" backgroundColor="surface">
                        <Typography size="xs" weight="semibold">XS Padding</Typography>
                        <Typography size="xs" color="muted">padding="xs"</Typography>
                    </Card>

                    {/* Card demonstrating elevation */}
                    <Card padding="sm" elevation="lg" backgroundColor="surface">
                        <Typography size="xs" weight="semibold">High Elevation</Typography>
                        <Typography size="xs" color="muted">elevation="lg"</Typography>
                    </Card>

                    {/* Summary card with flexFill and nested content */}
                    <Card padding="md" elevation="sm" backgroundColor="surface" layout="flex-column" gap="xs" flexFill>
                        <Typography size="sm" weight="semibold">Summary Card (flexFill)</Typography>
                        <Typography size="xs">Demonstrates flexFill with nested badges and content that adapts to parent layout.</Typography>
                        <Container layout="flex" gap="xs" wrap>
                            <Badge size="sm" color="success">Active</Badge>
                            <Badge size="sm" color="primary">Featured</Badge>
                            <Badge size="sm" color="warning">Updated</Badge>
                        </Container>
                    </Card>
                </ComponentToRender>
            );
        }

        if (selectedComponent === 'Container') {
            // Extract layout-related props from componentProps
            const { layout, gap, align, justify, columns, wrap, padding, backgroundColor, children, ...restProps } = effectiveProps;
            
            return (
                <ComponentToRender
                    layout={layout}
                    gap={gap}
                    align={align}
                    justify={justify}
                    columns={columns}
                    wrap={wrap}
                    padding={padding}
                    backgroundColor={backgroundColor}
                    width="100%"
                    minHeight="300px"
                    style={{
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius)'
                    }}
                    {...restProps}
                >
                    {/* Nested containers and content demonstrating layout capabilities */}
                    <Container 
                        padding="md" 
                        backgroundColor="surface"
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)'
                        }}
                    >
                        <Container layout="flex-column" gap="xs" padding="none">
                            <Typography size="sm" weight="semibold" color="primary">
                                Content Block 1
                            </Typography>
                            <Typography size="xs">Adapts to parent layout</Typography>
                        </Container>
                    </Container>

                    <Container 
                        padding="md" 
                        backgroundColor="surface"
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)'
                        }}
                    >
                        <Container layout="flex-column" gap="xs" padding="none">
                            <Typography size="sm" weight="semibold" color="secondary">
                                Content Block 2
                            </Typography>
                            <Typography size="xs">Responds to gap</Typography>
                        </Container>
                    </Container>

                    <Container 
                        padding="md" 
                        backgroundColor="surface"
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)'
                        }}
                    >
                        <Container layout="flex-column" gap="xs" padding="none">
                            <Typography size="sm" weight="semibold" color="tertiary">
                                Content Block 3
                            </Typography>
                            <Typography size="xs">Follows justify rules</Typography>
                        </Container>
                    </Container>

                    <Container 
                        padding="md" 
                        backgroundColor="surface"
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)'
                        }}
                    >
                        <Container layout="flex-column" gap="xs" padding="none">
                            <Typography size="sm" weight="semibold" color="success">
                                Content Block 4
                            </Typography>
                            <Typography size="xs">Aligns as configured</Typography>
                        </Container>
                    </Container>

                    <Container 
                        padding="md" 
                        backgroundColor="surface"
                        layout="flex" 
                        gap="xs"
                        wrap
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)'
                        }}
                    >
                        <Badge size="sm" color="primary">Tag 1</Badge>
                        <Badge size="sm" color="secondary">Tag 2</Badge>
                        <Badge size="sm" color="tertiary">Tag 3</Badge>
                        <Badge size="sm" color="success">Tag 4</Badge>
                    </Container>

                    <Container 
                        padding="md" 
                        backgroundColor="surface"
                        layout="flex-column"
                        gap="xs"
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)'
                        }}
                    >
                        <Typography size="xs" weight="semibold">Action Items</Typography>
                        <Container layout="flex" gap="xs" wrap>
                            <Button size="xs" color="primary">Action</Button>
                            <Button size="xs" color="secondary" variant="outline">Cancel</Button>
                        </Container>
                    </Container>
                </ComponentToRender>
            );
        }

        return <ComponentToRender {...effectiveProps} />;
    }, [selectedComponent, componentProps, handleTreeNodeExpand, handleTreeNodeSelect]);

    const componentKeys = Object.keys(COMPONENT_METADATA);
    const metadata = COMPONENT_METADATA[selectedComponent];
    const propEntries = metadata?.propConfigs ? Object.entries(metadata.propConfigs) : [];

    return (
        <Page padding="lg" layout="flex-column" gap="lg">
            <ButtonGroup
                size="sm"
                spaced
                className="component-selector"
                justify="center"
                width="100%"
            >
                {componentKeys.map((componentName) => (
                    <Button
                        key={componentName}
                        variant={selectedComponent === componentName ? 'solid' : 'ghost'}
                        color={selectedComponent === componentName ? 'primary' : 'secondary'}
                        size="sm"
                        selected={selectedComponent === componentName}
                        onClick={() => handleComponentSelect(componentName)}
                    >
                        {componentName}
                    </Button>
                ))}
            </ButtonGroup>

            {/* Demo and controls layout */}
            <Container layout="flex-column" gap="lg" width="100%">
                {/* Section 2: Live Demo Area */}
                <Container layout="flex-column" gap="none" padding="none" width="100%">
                    <Typography size="xl" weight="bold" color="primary" margin="none">
                        Component Live Demo
                    </Typography>

                    {/* Demo Container */}
                    <Container
                        padding="xl"
                        width="100%"
                        layout="flex"
                        minHeight="60vh"
                        align="center"
                        justify="center"
                        overflow="scroll"
                        style={{
                            border: '2px dashed var(--border-color)',
                            borderRadius: 'var(--border-radius)'
                        }}
                    >
                        
                        {liveDemo}

                        <FloatingActionButton
                            variant="secondary"
                            size="sm"
                            icon="FiCode"
                            position="top-left"
                            parentType="container"
                            snapToEdges={false}
                            genie={{
                                trigger: 'click',
                                variant: 'popover',
                                position: 'auto',
                                content: () => (
                                    <Container
                                        layout="flex-column"
                                        gap="xs"
                                        padding="sm"
                                        width="fit-content"
                                        maxWidth="320px"
                                    >
                                        <Typography size="xs" weight="semibold" color="muted">
                                            Current Props (JSX)
                                        </Typography>
                                        <Typography
                                            as="pre"
                                            size="xs"
                                            font="monospace"
                                            style={{
                                                whiteSpace: 'pre',
                                                overflowX: 'auto',
                                                overflowY: 'auto',
                                                margin: 0,
                                                maxHeight: '320px'
                                            }}
                                        >
                                            {jsxPreview}
                                        </Typography>
                                    </Container>
                                )
                            }}
                        />
                    </Container>

                </Container>

                {/* Section 3: Props Control Panel */}
                <Container layout="flex" justify="center" align="center" padding="none" width="100%">
                    <Card padding="md" elevation="md" gap="md">
                           <Typography color="primary" size="xl" weight="semibold">
                                Properties
                            </Typography>

                            {/* Props Controls */}
                            <Container
                                layout="flex"
                                gap="sm"
                                padding="xs"
                                wrap
                                align="center"
                                justify="center"
                            >
                                {metadata && propEntries.length > 0 ? (
                                    propEntries.map(([propName, config]) => renderPropControl(propName, config))
                                ) : (
                                    <Typography size="sm" color="muted">
                                        No configurable props for this component.
                                    </Typography>
                                )}
                            </Container>
                    </Card>
                </Container>
            </Container>

            {/* Theme Switcher FAB */}
            <FloatingActionButton
                position="bottom-right"
                color="primary"
                draggable={true}
                icon="FaPaintBrush"
                genie={{
                    content: (
                        <Container gap="sm">
                            <Typography color="primary">
                                Theme Switcher
                            </Typography>
                            <Container layout="flex-column" align="stretch" gap="xs">
                                {availableThemes.map((theme) => (
                                    <Button
                                        key={theme}
                                        variant={currentTheme === theme ? "ghost" : "solid"}
                                        size="sm"
                                        onClick={() => switchTheme(theme)}
                                        justify="center"
                                        theme={theme}
                                    >
                                        <Icon name={
                                            theme === 'modern' ? 'FiMonitor' :
                                            theme === 'dark' ? 'FiMoon' :
                                            theme === 'minimal' ? 'FiCircle' :
                                            theme === 'vibrant' ? 'FiSun' :
                                            theme === 'admin' ? 'FiBriefcase' :
                                            theme === 'pink' ? 'FiHeart' :
                                            'FiSettings'
                                        } />
                                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                        {currentTheme === theme && (
                                            <Badge color="success" size="sm">Active</Badge>
                                        )}
                                    </Button>
                                ))}
                            </Container>
                        </Container>
                    )
                }}
            />
        </Page>
    );
};

export default ComponentDemoRefactoredNew;
