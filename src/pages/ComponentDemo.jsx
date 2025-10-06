import React, { useState, useEffect } from 'react';
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
    PageLoading
} from '@components/Components';

import demoData from '@utils/file.json';
import { fieldStyleConfig } from '@utils/file.jsx';

const ComponentDemo = () => {
    const { currentTheme, switchTheme, availableThemes, isLoading, loadError } = useTheme();
    const [selectValue, setSelectValue] = useState('option1');
    const [multiSelectValue, setMultiSelectValue] = useState(['option2', 'option4']);
    const [isChecked, setIsChecked] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [progressValue1, setProgressValue1] = useState(65);
    const [progressValue4, setProgressValue4] = useState(30); // New state for default striped

    // Individual button selected states
    const [primaryButtonSelected, setPrimaryButtonSelected] = useState(true);
    const [secondaryButtonSelected, setSecondaryButtonSelected] = useState(true);
    const [tertiaryButtonSelected, setTertiaryButtonSelected] = useState(true);
    const [borderShadowButtonSelected, setBorderShadowButtonSelected] = useState(true);

    // Draggable FAB states

    // Expandable FAB states
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isToolsExpanded, setIsToolsExpanded] = useState(false);

    // TreeView demo states
    const [treeViewExpanded, setTreeViewExpanded] = useState(['Documents', 'Documents/Projects', 'Images']);
    const [treeViewSelected, setTreeViewSelected] = useState(['Documents/Projects/Project Alpha.pdf']);
    const [treeViewSearch, setTreeViewSearch] = useState('');
    
    // Navigation TreeView demo states  
    const [navTreeExpanded, setNavTreeExpanded] = useState(['Dashboard', 'User Management']);
    const [navTreeSelected, setNavTreeSelected] = useState(['Dashboard/Overview']);

    // Flexible TreeView demo states (for different API formats)
    const [flexibleTreeExpanded, setFlexibleTreeExpanded] = useState(['dashboard']);
    const [flexibleTreeSelected, setFlexibleTreeSelected] = useState([]);

    // Genie demo states

    const selectOptions = [
        {value: 'option1', label: 'Option 1'},
        {value: 'option2', label: 'Option 2'}, 
        {value: 'option3', label: 'Option 3'},
        {value: 'option4', label: 'Option 4'},
        {value: 'option5', label: 'Option 5'},
        {value: 'option6', label: 'Option 6'},
        {value: 'option7', label: 'Option 7'},
        {value: 'option8', label: 'Option 8'}
    ];
    const themeOptions = availableThemes.map(theme => ({
        value: theme, label: theme.charAt(0).toUpperCase() + theme.slice(1)
    }));

    // TreeView demo data - now using server format for consistency
    const treeViewData = {
        "Documents": {
            type: "directory",
            item: {
                filePath: "/Documents",
                type: "directory",
                fileName: "Documents",
                depth: 1
            },
            children: {
                "Projects": {
                    type: "directory", 
                    item: {
                        filePath: "/Documents/Projects",
                        type: "directory",
                        fileName: "Projects",
                        depth: 2
                    },
                    children: {
                        "Project Alpha.pdf": {
                            type: "file",
                            item: {
                                filePath: "/Documents/Projects/Project Alpha.pdf",
                                type: "file", 
                                fileName: "Project Alpha.pdf",
                                depth: 3
                            }
                        },
                        "Project Beta.docx": {
                            type: "file",
                            item: {
                                filePath: "/Documents/Projects/Project Beta.docx",
                                type: "file",
                                fileName: "Project Beta.docx", 
                                depth: 3
                            }
                        },
                        "Budget.xlsx": {
                            type: "file",
                            item: {
                                filePath: "/Documents/Projects/Budget.xlsx",
                                type: "file",
                                fileName: "Budget.xlsx",
                                depth: 3
                            }
                        }
                    }
                },
                "Archive": {
                    type: "directory",
                    item: {
                        filePath: "/Documents/Archive", 
                        type: "directory",
                        fileName: "Archive",
                        customIcon: "FiArchive", // Custom icon override
                        depth: 2
                    },
                    children: {
                        "Old Reports": {
                            type: "directory",
                            item: {
                                filePath: "/Documents/Archive/Old Reports",
                                type: "directory", 
                                fileName: "Old Reports",
                                depth: 3
                            }
                        },
                        "Backup.zip": {
                            type: "file",
                            item: {
                                filePath: "/Documents/Archive/Backup.zip",
                                type: "file",
                                fileName: "Backup.zip",
                                depth: 3
                            }
                        }
                    }
                }
            }
        },
        "Images": {
            type: "directory",
            item: {
                filePath: "/Images",
                type: "directory",
                fileName: "Images",
                customIcon: "FiImage", // Custom icon override
                depth: 1
            },
            children: {
                "Logo.png": {
                    type: "file",
                    item: {
                        filePath: "/Images/Logo.png",
                        type: "file",
                        fileName: "Logo.png",
                        depth: 2
                    }
                },
                "Banner.jpg": {
                    type: "file",
                    item: {
                        filePath: "/Images/Banner.jpg",
                        type: "file",
                        fileName: "Banner.jpg", 
                        depth: 2
                    }
                },
                "Icons": {
                    type: "directory",
                    item: {
                        filePath: "/Images/Icons",
                        type: "directory",
                        fileName: "Icons",
                        depth: 2
                    },
                    children: {
                        "user.svg": {
                            type: "file",
                            item: {
                                filePath: "/Images/Icons/user.svg",
                                type: "file",
                                fileName: "user.svg",
                                customIcon: "FiUser", // Custom icon for SVG file
                                depth: 3
                            }
                        },
                        "settings.svg": {
                            type: "file", 
                            item: {
                                filePath: "/Images/Icons/settings.svg",
                                type: "file",
                                fileName: "settings.svg",
                                customIcon: "FiSettings", // Custom icon for SVG file
                                depth: 3
                            }
                        }
                    }
                }
            }
        },
        "Code": {
            type: "directory",
            item: {
                filePath: "/Code",
                type: "directory",
                fileName: "Code",
                customIcon: "FiCode", // Custom icon override
                depth: 1
            },
            children: {
                "src": {
                    type: "directory",
                    item: {
                        filePath: "/Code/src",
                        type: "directory",
                        fileName: "src",
                        depth: 2
                    }
                },
                "README.md": {
                    type: "file",
                    item: {
                        filePath: "/Code/README.md",
                        type: "file",
                        fileName: "README.md",
                        depth: 2
                    }
                },
                "package.json": {
                    type: "file",
                    item: {
                        filePath: "/Code/package.json",
                        type: "file",
                        fileName: "package.json",
                        customIcon: "FiPackage", // Custom icon override
                        disabled: true,
                        depth: 2
                    }
                }
            }
        }
    };

    // Navigation/Organization TreeView demo (non-file data with custom icons)
    const navigationTreeData = {
        "Dashboard": {
            type: "directory", // Using 'directory' type for parent nodes
            item: {
                customIcon: "FiHome", // Custom navigation icon
                label: "Dashboard",
                description: "Main dashboard view"
            },
            children: {
                "Overview": {
                    type: "file", // Using 'file' type for leaf nodes
                    item: {
                        customIcon: "FiTrendingUp",
                        label: "Overview",
                        route: "/dashboard/overview"
                    }
                },
                "Analytics": {
                    type: "file",
                    item: {
                        customIcon: "FiBarChart2", 
                        label: "Analytics",
                        route: "/dashboard/analytics"
                    }
                },
                "Reports": {
                    type: "file",
                    item: {
                        customIcon: "FiFileText",
                        label: "Reports", 
                        route: "/dashboard/reports"
                    }
                }
            }
        },
        "User Management": {
            type: "directory",
            item: {
                customIcon: "FiUsers",
                label: "User Management",
                description: "Manage users and permissions"
            },
            children: {
                "User List": {
                    type: "file",
                    item: {
                        customIcon: "FiList",
                        label: "User List",
                        route: "/users/list"
                    }
                },
                "Permissions": {
                    type: "file", 
                    item: {
                        customIcon: "FiLock",
                        label: "Permissions",
                        route: "/users/permissions"
                    }
                },
                "Roles": {
                    type: "file",
                    item: {
                        customIcon: "FiShield",
                        label: "Roles",
                        route: "/users/roles"
                    }
                }
            }
        },
        "Settings": {
            type: "directory",
            item: {
                customIcon: "FiSettings",
                label: "Settings",
                description: "Application settings"
            },
            children: {
                "General": {
                    type: "file",
                    item: {
                        customIcon: "FiSliders",
                        label: "General",
                        route: "/settings/general"
                    }
                },
                "Security": {
                    type: "file",
                    item: {
                        customIcon: "FiKey",
                        label: "Security",
                        route: "/settings/security"
                    }
                },
                "Notifications": {
                    type: "file",
                    item: {
                        customIcon: "FiBell",
                        label: "Notifications", 
                        route: "/settings/notifications"
                    }
                }
            }
        }
    };

    // Server-style TreeView demo data (simulates API response format)
    const serverTreeData = {
        "Documents": {
            type: "directory",
            item: {
                filePath: "/Documents",
                parentPath: "/",
                type: "directory",
                fileName: "Documents",
                size: 0,
                depth: 1,
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-20T14:25:00Z"
            },
            children: {
                "Projects": {
                    type: "directory",
                    item: {
                        filePath: "/Documents/Projects",
                        parentPath: "/Documents",
                        type: "directory",
                        fileName: "Projects",
                        size: 0,
                        depth: 2,
                        createdAt: "2024-01-15T10:30:00Z",
                        updatedAt: "2024-01-20T14:25:00Z"
                    },
                    children: {
                        "project-alpha.pdf": {
                            type: "file",
                            item: {
                                filePath: "/Documents/Projects/project-alpha.pdf",
                                parentPath: "/Documents/Projects",
                                type: "file",
                                fileName: "project-alpha.pdf",
                                size: 2048576,
                                depth: 3,
                                createdAt: "2024-01-15T10:30:00Z",
                                updatedAt: "2024-01-18T16:45:00Z"
                            },
                            children: {}
                        },
                        "budget.xlsx": {
                            type: "file",
                            item: {
                                filePath: "/Documents/Projects/budget.xlsx",
                                parentPath: "/Documents/Projects",
                                type: "file",
                                fileName: "budget.xlsx",
                                size: 1024000,
                                depth: 3,
                                createdAt: "2024-01-16T09:15:00Z",
                                updatedAt: "2024-01-19T11:20:00Z"
                            },
                            children: {}
                        }
                    }
                },
                "readme.md": {
                    type: "file",
                    item: {
                        filePath: "/Documents/readme.md",
                        parentPath: "/Documents",
                        type: "file",
                        fileName: "readme.md",
                        size: 4096,
                        depth: 2,
                        createdAt: "2024-01-15T10:30:00Z",
                        updatedAt: "2024-01-20T14:25:00Z"
                    },
                    children: {}
                }
            }
        },
        "Images": {
            type: "directory",
            item: {
                filePath: "/Images",
                parentPath: "/",
                type: "directory", 
                fileName: "Images",
                size: 0,
                depth: 1,
                createdAt: "2024-01-10T08:00:00Z",
                updatedAt: "2024-01-20T12:30:00Z"
            },
            children: {
                "logo.png": {
                    type: "file",
                    item: {
                        filePath: "/Images/logo.png",
                        parentPath: "/Images",
                        type: "file",
                        fileName: "logo.png", 
                        size: 256000,
                        depth: 2,
                        createdAt: "2024-01-10T08:00:00Z",
                        updatedAt: "2024-01-12T15:20:00Z"
                    },
                    children: {}
                }
            }
        }
    };

    // Examples of different server API response formats that TreeView can handle
    
    // Example 1: Simple flat API response (like navigation menu)
    // Simple API data in server format
    const simpleApiData = {
        "dashboard": {
            type: "directory",
            item: {
                name: "Dashboard",
                customIcon: "FiHome",
                route: "/dashboard"
            },
            children: {
                "overview": { 
                    type: "file", 
                    item: { name: "Overview", customIcon: "FiTrendingUp", route: "/dashboard/overview" }
                },
                "reports": { 
                    type: "file", 
                    item: { name: "Reports", customIcon: "FiFileText", route: "/dashboard/reports" }
                }
            }
        },
        "users": {
            type: "directory",
            item: {
                name: "User Management",
                customIcon: "FiUsers"
            },
            children: {
                "list": { 
                    type: "file", 
                    item: { name: "User List", customIcon: "FiList" }
                },
                "roles": { 
                    type: "file", 
                    item: { name: "Roles", customIcon: "FiShield" }
                }
            }
        }
    };

    // API response with different structure converted to server format  
    const alternateApiData = {
        "products": {
            type: "directory",
            item: {
                name: "Products",
                category: "parent"
            },
            children: {
                "electronics": {
                    type: "directory",
                    item: {
                        name: "Electronics",
                        category: "parent"
                    },
                    children: {
                        "phones": { 
                            type: "file", 
                            item: { name: "Phones", category: "item", price: "$999" }
                        },
                        "laptops": { 
                            type: "file", 
                            item: { name: "Laptops", category: "item", price: "$1299" }
                        }
                    }
                }
            }
        }
    };

    // CMS/Content API response format converted to server format
    const cmsApiData = {
        "content": {
            type: "directory",
            item: {
                name: "Content",
                contentType: "folder"
            },
            children: {
                "pages": {
                    type: "directory",
                    item: {
                        name: "Pages",
                        contentType: "folder"
                    },
                    children: {
                        "home": { 
                            type: "file", 
                            item: { name: "Home Page", contentType: "page", status: "published" }
                        },
                        "about": { 
                            type: "file", 
                            item: { name: "About Us", contentType: "page", status: "draft" }
                        }
                    }
                },
                "posts": {
                    type: "directory",
                    item: {
                        name: "Blog Posts",
                        contentType: "folder"
                    },
                    children: {
                        "welcome": { 
                            type: "file", 
                            item: { name: "Welcome Post", contentType: "post", status: "published" }
                        },
                        "news": { 
                            type: "file", 
                            item: { name: "Latest News", contentType: "post", status: "draft" }
                        }
                    }
                }
            }
        }
    };

    // Convert server data to TreeView format
    const [serverTreeExpanded, setServerTreeExpanded] = useState(['Documents', 'Documents/Projects']);
    const [serverTreeSelected, setServerTreeSelected] = useState([]);

    // Sample data for Data component selector demo
    const sampleUsersData = [
        {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@company.com",
            department: "Engineering",
            role: "Senior Developer",
            status: "Active",
            lastLogin: "2024-01-15T10:30:00Z",
            projects: 8,
            experience: "5 years"
        },
        {
            id: 2, 
            name: "Bob Chen",
            email: "bob.chen@company.com",
            department: "Design",
            role: "UI/UX Designer",
            status: "Active", 
            lastLogin: "2024-01-14T16:45:00Z",
            projects: 12,
            experience: "3 years"
        },
        {
            id: 3,
            name: "Carol Martinez",
            email: "carol.martinez@company.com", 
            department: "Product",
            role: "Product Manager",
            status: "On Leave",
            lastLogin: "2024-01-10T09:15:00Z",
            projects: 15,
            experience: "7 years"
        },
        {
            id: 4,
            name: "David Kim",
            email: "david.kim@company.com",
            department: "Engineering", 
            role: "Frontend Developer",
            status: "Active",
            lastLogin: "2024-01-15T14:20:00Z",
            projects: 6,
            experience: "2 years"
        },
        {
            id: 5,
            name: "Emma Wilson",
            email: "emma.wilson@company.com",
            department: "Marketing",
            role: "Content Strategist", 
            status: "Active",
            lastLogin: "2024-01-15T11:00:00Z",
            projects: 4,
            experience: "4 years"
        },
        {
            id: 6,
            name: "Frank Rodriguez",
            email: "frank.rodriguez@company.com",
            department: "Sales",
            role: "Account Manager",
            status: "Inactive",
            lastLogin: "2024-01-05T08:30:00Z", 
            projects: 9,
            experience: "6 years"
        }
    ];

    // Data component selector demo state - removed, using internal state instead

    // TreeView event handlers
    const handleTreeViewExpand = (nodeId, isExpanded) => {
        if (isExpanded) {
            setTreeViewExpanded(prev => [...prev, nodeId]);
        } else {
            setTreeViewExpanded(prev => prev.filter(id => id !== nodeId));
        }
    };

    const handleTreeViewSelect = (nodeId, isSelected, selectedNodes) => {
        setTreeViewSelected(selectedNodes);
    };

    // Server TreeView event handlers  
    const handleServerTreeExpand = (nodeId, isExpanded) => {
        if (isExpanded) {
            setServerTreeExpanded(prev => [...prev, nodeId]);
        } else {
            setServerTreeExpanded(prev => prev.filter(id => id !== nodeId));
        }
    };

    const handleServerTreeSelect = (nodeId, isSelected, selectedNodes) => {
        setServerTreeSelected(selectedNodes);
    };
    
    // Navigation TreeView event handlers
    const handleNavTreeExpand = (nodeId, isExpanded) => {
        if (isExpanded) {
            setNavTreeExpanded(prev => [...prev, nodeId]);
        } else {
            setNavTreeExpanded(prev => prev.filter(id => id !== nodeId));
        }
    };

    const handleNavTreeSelect = (nodeId, isSelected, selectedNodes) => {
        setNavTreeSelected(selectedNodes);
    };

    // Flexible TreeView event handlers
    const handleFlexibleTreeExpand = (nodeId, isExpanded) => {
        if (isExpanded) {
            setFlexibleTreeExpanded(prev => [...prev, nodeId]);
        } else {
            setFlexibleTreeExpanded(prev => prev.filter(id => id !== nodeId));
        }
    };

    const handleFlexibleTreeSelect = (nodeId, isSelected, selectedNodes) => {
        setFlexibleTreeSelected(selectedNodes);
        console.log('Flexible tree selected:', selectedNodes);
    };

    // Handle theme loading state
    if (isLoading) {
        return <PageLoading message="Loading component demo..." />;
    }

    return (
    <Page layout="flex" align="center" justify="center">

            <Typography as="p" size="lg" color="muted" padding="lg" weight="semibold" font="secondary">
                Showcasing all components in the design system with a powerful theming system
            </Typography>

        {/* Theme System & Switcher Section */}
        <Container  layout="grid" columns={2} width="80%">
            <Card justify="end" gap="none">
                <Typography as="h2" color="primary" font="secondary">Theme System</Typography>
                <Typography as="p" color="muted">
                    This demo is currently using the "{currentTheme}" theme. The theme system supports:
                </Typography>

                <Typography as="p">CSS custom properties for easy theme switching</Typography>
                <Typography as="p">Consistent color palette across all components</Typography>
                <Typography as="p">Typography scaling and font family management</Typography>
                <Typography as="p">Spacing and sizing variables</Typography>
                <Typography as="p">Component-specific theme overrides</Typography>
            </Card>

            <Card justify="center">
                <Typography as="h3" font="secondary">Current Theme: {currentTheme}</Typography>
                <Typography as="p" color="muted">Switch themes to see dynamic styling changes</Typography>
                {loadError && (<Typography as="p" color="error" size="sm">{loadError}</Typography>)}
                <ButtonGroup spaced defaultSelected={availableThemes.indexOf(currentTheme)}>
                    {availableThemes.map(theme => (<Button
                        key={theme}
                        variant="primary"
                        onClick={() => switchTheme(theme)}
                    >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </Button>))}
                </ButtonGroup>
            </Card>
        </Container>

        {/* Color System Demo */}
        <Container width="60%">
            <Card>
                <Typography as="h2" color="primary" font="secondary">Color System</Typography>
                <Typography as="p" color="muted">
                    Complete color palette with main colors and accent variants
                </Typography>
                
                <Typography as="h3" weight="semibold" font="secondary">Primary & Secondary Colors</Typography>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="primary">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Primary</Typography>
                        <Typography as="p" size="sm" color="contrast">--primary-color</Typography>
                    </Card>
                    <Card backgroundColor="primary-accent">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Primary Accent</Typography>
                        <Typography as="p" size="sm" color="contrast">--primary-accent-color</Typography>
                    </Card>
                </Container>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="secondary">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Secondary</Typography>
                        <Typography as="p" size="sm" color="contrast">--secondary-color</Typography>
                    </Card>
                    <Card backgroundColor="secondary-accent">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Secondary Accent</Typography>
                        <Typography as="p" size="sm" color="contrast">--secondary-accent-color</Typography>
                    </Card>
                </Container>

                <Typography as="h3" weight="semibold" font="secondary">Tertiary & Neutral Colors</Typography>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="tertiary">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Tertiary</Typography>
                        <Typography as="p" size="sm" color="contrast">--tertiary-color</Typography>
                    </Card>
                    <Card backgroundColor="tertiary-accent">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Tertiary Accent</Typography>
                        <Typography as="p" size="sm" color="contrast">--tertiary-accent-color</Typography>
                    </Card>
                </Container>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="neutral">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Neutral</Typography>
                        <Typography as="p" size="sm" color="contrast">--neutral-color</Typography>
                    </Card>
                    <Card backgroundColor="neutral-accent">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Neutral Accent</Typography>
                        <Typography as="p" size="sm" color="contrast">--neutral-accent-color</Typography>
                    </Card>
                </Container>

                <Typography as="h3" weight="semibold" font="secondary">Semantic Colors</Typography>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="success">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Success</Typography>
                        <Typography as="p" size="sm" color="contrast">--success-color</Typography>
                    </Card>
                    <Card backgroundColor="success-accent">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Success Accent</Typography>
                        <Typography as="p" size="sm" color="contrast">--success-accent-color</Typography>
                    </Card>
                </Container>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="warning">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Warning</Typography>
                        <Typography as="p" size="sm" color="contrast">--warning-color</Typography>
                    </Card>
                    <Card backgroundColor="warning-accent">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Warning Accent</Typography>
                        <Typography as="p" size="sm" color="contrast">--warning-accent-color</Typography>
                    </Card>
                </Container>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="error">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Error</Typography>
                        <Typography as="p" size="sm" color="contrast">--error-color</Typography>
                    </Card>
                    <Card backgroundColor="error-accent">
                        <Typography as="p" size="sm" weight="medium" color="contrast">Error Accent</Typography>
                        <Typography as="p" size="sm" color="contrast">--error-accent-color</Typography>
                    </Card>
                </Container>

                <Typography as="h3" weight="semibold" font="secondary">Surface & Background Colors</Typography>
                <Container layout="grid" columns={2}>
                    <Card backgroundColor="surface" border="standard">
                        <Typography as="p" size="sm" weight="medium">Surface</Typography>
                        <Typography as="p" size="sm" color="muted">--surface-color</Typography>
                    </Card>
                    <Card backgroundColor="background" border="standard">
                        <Typography as="p" size="sm" weight="medium">Background</Typography>
                        <Typography as="p" size="sm" color="muted">--background-color</Typography>
                    </Card>
                </Container>
            </Card>
        </Container>


        {/* Layout System Demonstration */}
        <Container layout="flex-column" align="center" width="80%">
            {/* Container Layouts */}
            <Card layout="flex-column">
                <Typography as="h2" color="primary" font="secondary">Layout System</Typography>
                <Typography as="h3" color="primary" font="secondary">Container Layouts</Typography>
                <Typography as="p" color="muted">
                    Transparent containers for organizing content with different layout types
                </Typography>

                {/* Block Layout */}
                <Container layout="flex-column" width="100%">
                    <Typography as="h4" weight="semibold" font="secondary">Block Layout (default)</Typography>
                    <Container layout="block" backgroundColor="background" width="100%">
                        <Typography as="p" color="muted">Elements stack vertically</Typography>
                        <Card>
                            <Typography as="p">First block element</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Second block element</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Third block element</Typography>
                        </Card>
                    </Container>
                </Container>

                {/* Flex Layouts */}
                <Container layout="flex-column" width="100%">
                    <Typography as="h4" weight="semibold">Flex Layout</Typography>
                    <Typography as="p" size="sm" color="muted">Flex layout - All items with flex-fill (equal
                        width)</Typography>
                    <Container layout="flex" gap="md" backgroundColor="background" width="100%">
                        <Card flexFill>
                            <Typography as="p">Equal width item 1</Typography>
                        </Card>
                        <Card flexFill>
                            <Typography as="p">Equal width item 2</Typography>
                        </Card>
                        <Card flexFill>
                            <Typography as="p">Equal width item 3</Typography>
                        </Card>
                    </Container>

                    <Typography as="p" size="sm" color="muted">Flex layout - Mixed flex-fill usage</Typography>
                    <Container layout="flex" gap="md" backgroundColor="background" width="100%">
                        <Card flexFill>
                            <Typography as="p">Flex-fill (expands)</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Natural width</Typography>
                        </Card>
                        <Card flexFill>
                            <Typography as="p">Flex-fill (expands)</Typography>
                        </Card>
                    </Container>

                    <Typography as="p" size="sm" color="muted">Flex layout - No flex-fill (all natural
                        width)</Typography>
                    <Container layout="flex" gap="md" justify="center" backgroundColor="background" width="100%">
                        <Card>
                            <Typography as="p">Natural width item 1</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Natural width item 2</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Natural width item 3</Typography>
                        </Card>
                    </Container>

                    <Typography as="h4" weight="semibold">Flex Column Layout</Typography>
                    <Typography as="p" size="sm" color="muted">Cards in column layout stack vertically</Typography>
                    <Container layout="flex-column" backgroundColor="background" width="100%">
                        <Card>
                            <Typography as="p">Column Item 1</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Column Item 2</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Column Item 3</Typography>
                        </Card>
                    </Container>
                </Container>

                {/* Grid Layouts */}
                <Container layout="flex-column" width="100%">
                    <Typography as="h4" weight="semibold">Grid Layout Variations</Typography>
                    <Typography as="p" size="sm" color="muted">2-column grid</Typography>
                    <Container layout="grid" columns={2} backgroundColor="background" width="100%">
                        <Card>
                            <Typography as="p">Grid Item 1</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Grid Item 2</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Grid Item 3</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Grid Item 4</Typography>
                        </Card>
                    </Container>

                    <Typography as="p" size="sm" color="muted">3-column grid</Typography>
                    <Container layout="grid" columns={3} backgroundColor="background" width="100%">
                        <Card>
                            <Typography as="p">Item 1</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Item 2</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Item 3</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Item 4</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Item 5</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Item 6</Typography>
                        </Card>
                    </Container>

                    <Typography as="p" size="sm" color="muted">Auto-responsive grid</Typography>
                    <Container layout="grid" columns="auto" backgroundColor="background" width="100%">
                        <Card>
                            <Typography as="p">Auto Item 1</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Auto Item 2</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Auto Item 3</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Auto Item 4</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Auto Item 5</Typography>
                        </Card>
                    </Container>
                </Container>

                {/* Multi-column Layout */}
                <Container layout="flex-column">
                    <Typography as="h4" weight="semibold">Multi-column Layout</Typography>
                    <Container layout="multicolumn" columns={2} backgroundColor="background" width="100%">
                        <Card>
                            <Typography as="p">
                                This is a multi-column layout that automatically flows text across columns.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris.
                            </Typography>
                        </Card>
                        <Card>
                            <Typography as="p">
                                The content continues flowing naturally across the columns, creating a
                                newspaper-like reading experience. This is great for long-form content
                                that needs to be displayed in a compact format.
                            </Typography>
                        </Card>
                    </Container>
                </Container> 
                
                {/* Flex Wrap Layout */}
                <Container layout="flex-column">
                    <Typography as="h4" weight="semibold">Flex Wrap Layout</Typography>
                    <Typography as="p" size="sm" color="muted">Cards in flex wrap layout behave like text wrapping,
                        using flexbox with justify="wrap"</Typography>
                    <Container layout="flex" justify="wrap" backgroundColor="background">
                        <Card>
                            <Typography as="p">Short text</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Flex wrap layout demonstration</Typography>
                        </Card>
                        <Card width="100%">
                            <Typography as="p">This card uses width="100%" attribute to span the entire container
                                width</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Cards take only the width they need</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Small</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">This card has more content and will be wider than others</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Natural width</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Based on content</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Flex wrap layouts arrange items</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">In a natural way</Typography>
                        </Card>
                        <Card>
                            <Typography as="p">Like text wrapping</Typography>
                        </Card>
                    </Container>
                </Container>

                {/* Positioned Layout */}
                <Container layout="flex-column" width="100%">
                    <Typography as="h4" weight="semibold">Positioned Layout</Typography>
                    <Typography as="p" size="sm" color="muted">Container with relative positioning for positioned
                        children</Typography>
                    <Container layout="positioned" padding="xl" width="100%" backgroundColor="background" style={{minHeight: '300px'}} >
                        <Card>
                            <Typography as="p">Base card with natural width</Typography>
                        </Card>
                        <Card style={{position: 'absolute', top: '30px', right: '30px', zIndex: 2}}>
                            <Typography as="p">Positioned top-right</Typography>
                        </Card>
                        <Card style={{position: 'absolute', bottom: '30px', left: '30px', zIndex: 2}}>
                            <Typography as="p">Positioned bottom-left</Typography>
                        </Card>
                        <Card style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3
                        }}>
                            <Typography as="p">Centered card</Typography>
                        </Card>
                        <Card style={{position: 'absolute', top: '80px', left: '80px', zIndex: 2}}>
                            <Typography as="p">Custom position</Typography>
                        </Card>
                    </Container>
                </Container>
            </Card>

            {/* Card Layouts */}
            <Card layout="flex-column">
                <Typography as="h3" color="primary">Card Layouts</Typography>
                <Typography as="p" color="muted">
                    Visible cards that inherit all Container layout capabilities with styling
                </Typography>

                {/* Card Grid Showcase */}
                <Container layout="flex-column" width="100%">
                    <Typography as="h4" weight="semibold">Card Grid Layouts</Typography>
                    <Container layout="grid" columns={2} width="100%">
                        <Card layout="flex-column" align="center">
                            <Typography as="h5" weight="medium">Centered Card</Typography>
                            <Typography as="p" size="sm" color="muted">Content centered vertically and
                                horizontally</Typography>
                            <Button variant="primary" size="small">Action</Button>
                        </Card>

                        <Card layout="flex" justify="between" align="center">
                            <Container layout="flex-column">
                                <Typography as="h5" weight="medium">Justified Card</Typography>
                                <Typography as="p" size="sm" color="muted">Space between elements</Typography>
                            </Container>
                            <Button variant="secondary" size="small">→</Button>
                        </Card>
                    </Container>
                </Container>

                {/* Card Layout Variations */}
                <Container layout="flex-column">
                    <Typography as="h4" weight="semibold">Card Layout Variations</Typography>

                    <Typography as="p" size="sm" color="muted">Full Width vs Natural Width</Typography>
                    <Container layout="flex-column" gap="md" width="100%">
                        <Card width="100%">
                            <Typography as="h6" weight="medium">Card with width="100%" attribute</Typography>
                            <Typography as="p" size="sm">This card takes 100% width regardless of
                                content</Typography>
                        </Card>

                        <Card>
                            <Typography as="h6" weight="medium">Card with natural width</Typography>
                            <Typography as="p" size="sm">This card's width is determined by its content in inline
                                layouts</Typography>
                        </Card>
                    </Container>

                    <Typography as="p" size="sm" color="muted">Flex layout with flex-fill demonstration</Typography>
                    <Container layout="flex" gap="md" width="100%">
                        <Card layout="flex-column" align="center" flexFill>
                            <Typography as="h6" weight="medium">With flex-fill</Typography>
                            <Typography as="p" size="sm">This card stretches to fill available space</Typography>
                            <Button variant="primary" size="small">Action</Button>
                        </Card>

                        <Card layout="flex-column" align="center">
                            <Typography as="h6" weight="medium">Without flex-fill</Typography>
                            <Typography as="p" size="sm">This card keeps its natural width</Typography>
                            <Button variant="secondary" size="small">Action</Button>
                        </Card>

                        <Card layout="flex-column" align="center" flexFill>
                            <Typography as="h6" weight="medium">With flex-fill</Typography>
                            <Typography as="p" size="sm">This card stretches to fill space</Typography>
                            <Button variant="primary" size="small">Action</Button>
                        </Card>
                    </Container>

                    <Typography as="p" size="sm" color="muted">Grid Card with internal flex layout</Typography>
                    <Card width="100%" layout="grid" columns={3}>
                        <Container backgroundColor="background" layout="flex-column" align="center" width="100%">
                            <Typography as="h6" weight="medium">Feature 1</Typography>
                            <Typography as="p" size="sm">Description</Typography>
                        </Container>
                        <Container backgroundColor="background" layout="flex-column" align="center" width="100%">
                            <Typography as="h6" weight="medium">Feature 2</Typography>
                            <Typography as="p" size="sm">Description</Typography>
                        </Container>
                        <Container backgroundColor="background" layout="flex-column" align="center" width="100%">
                            <Typography as="h6" weight="medium">Feature 3</Typography>
                            <Typography as="p" size="sm">Description</Typography>
                        </Container>
                    </Card>

                    <Typography as="p" size="sm" color="muted">Multi-column Card for long content</Typography>
                    <Card layout="multicolumn" columns={2}>
                        <Typography as="p">
                            This card uses multi-column layout to display long content in a readable format.
                            The text flows naturally from one column to the next, creating an elegant reading
                            experience similar to newspapers and magazines.
                        </Typography>
                        <Typography as="p">
                            Multi-column layouts are perfect for documentation, articles, or any content
                            that benefits from a compact, professional presentation format.
                        </Typography>
                    </Card>

                    <Typography as="h4" color="muted">Flex Column Cards with different alignments</Typography>
                    <Container layout="grid" columns={3} width="100%">
                        <Card layout="flex-column" align="start">
                            <Typography as="h6" weight="medium">Left Aligned</Typography>
                            <Typography as="p" size="sm">Content aligned to start</Typography>
                            <Button variant="outline" size="small">Start</Button>
                        </Card>

                        <Card layout="flex-column" align="center">
                            <Typography as="h6" weight="medium">Center Aligned</Typography>
                            <Typography as="p" size="sm">Content aligned to center</Typography>
                            <Button variant="primary" size="small" justify="center">Center</Button>
                        </Card>

                        <Card layout="flex-column" align="end">
                            <Typography as="h6" weight="medium">Right Aligned</Typography>
                            <Typography as="p" size="sm">Content aligned to end</Typography>
                            <Button variant="secondary" size="small">End</Button>
                        </Card>
                    </Container>
                </Container>

                {/* Complex Layout Example */}
                <Container layout="flex-column" gap="md" width="100%" align="center">
                    <Typography as="h4" weight="semibold">Complex Layout Example</Typography>
                    <Card width="70%" layout="flex" gap="lg" padding="lg">
                        <Container layout="flex-column" align="center" gap="md" width="70%">
                            <Typography as="h5" weight="medium">Dashboard Stats</Typography>
                            <Container layout="grid" columns={2} gap="sm" width="100%">
                                <Card layout="flex-column" align="center" gap="xs" padding="md">
                                    <Typography as="h6" color="primary" weight="bold">1,234</Typography>
                                    <Typography as="p" size="sm" color="muted">Users</Typography>
                                </Card>
                                <Card layout="flex-column" align="center" gap="xs" padding="md">
                                    <Typography as="h6" color="success" weight="bold">98%</Typography>
                                    <Typography as="p" size="sm" color="muted">Uptime</Typography>
                                </Card>
                                <Card layout="flex-column" align="center" gap="xs" padding="md">
                                    <Typography as="h6" color="warning" weight="bold">45</Typography>
                                    <Typography as="p" size="sm" color="muted">Pending</Typography>
                                </Card>
                                <Card layout="flex-column" align="center" gap="xs" padding="md">
                                    <Typography as="h6" color="error" weight="bold">3</Typography>
                                    <Typography as="p" size="sm" color="muted">Issues</Typography>
                                </Card>
                            </Container>
                        </Container>

                        <Container layout="flex-column" align="end" gap="md" flexFill>
                            <Typography as="h5" weight="medium">Recent Activity</Typography>
                                <Container layout="flex" justify="between" align="center" gap="md" width="100%">
                                    <Typography as="p" size="sm">User Registration</Typography>
                                    <Badge variant="success" size="small">New</Badge>
                                </Container>
                                <Container layout="flex" justify="between" align="center" gap="md" width="100%">
                                    <Typography as="p" size="sm">System Update</Typography>
                                    <Badge variant="tertiary" size="small">Tertiary</Badge>
                                </Container>
                                <Container layout="flex" justify="between" align="center" gap="md" width="100%">
                                    <Typography as="p" size="sm">Error Report</Typography>
                                    <Badge variant="error" size="small">Error</Badge>
                                </Container>
                        </Container>
                    </Card>
                </Container>
            </Card>

            {/* Typography Section */}
            <Container >
                <Card justify="end">
                    <Typography as="h2" color="primary" font="secondary">Typography System</Typography>
                    <Typography as="p" color="muted">
                        Unified Typography component with dynamic font loading and theme-aware styling
                    </Typography>

                    <Typography as="h3" weight="semibold" font="secondary">Headings</Typography>
                    <Typography as="h1" font="secondary">Heading 1 - Main Title</Typography>
                    <Typography as="h2">Heading 2 - Section Title</Typography>
                    <Typography as="h3" font="secondary">Heading 3 - Subsection</Typography>
                    <Typography as="h4">Heading 4 - Component Title</Typography>
                    <Typography as="h5" font="secondary">Heading 5 - Small Header</Typography>
                    <Typography as="h6">Heading 6 - Caption Header</Typography>

                    <Typography as="h3" weight="semibold" font="secondary">Text Sizes</Typography>
                    <Typography as="p" size="lg">Large text - Lorem ipsum dolor sit amet consectetur</Typography>
                    <Typography as="p" size="base">Base text - Lorem ipsum dolor sit amet consectetur</Typography>
                    <Typography as="p" size="sm">Small text - Lorem ipsum dolor sit amet consectetur</Typography>

                    <Typography as="h3" weight="semibold" font="secondary">Font Weights</Typography>
                    <Typography as="p" weight="light" font="secondary">Light weight (300)</Typography>
                    <Typography as="p" weight="normal">Normal weight (400)</Typography>
                    <Typography as="p" weight="medium" font="secondary">Medium weight (500)</Typography>
                    <Typography as="p" weight="semibold">Semibold weight (600)</Typography>
                    <Typography as="p" weight="bold" font="secondary">Bold weight (700)</Typography>
                    <Typography as="p" weight="extrabold">Extra Bold weight (800)</Typography>
                    <Typography as="p" weight="black" font="secondary">Black weight (900)</Typography>

                    <Typography as="h3" weight="semibold" font="secondary">Text Colors</Typography>
                    <Typography as="p" color="primary">Primary color text</Typography>
                    <Typography as="p" color="secondary">Secondary color text</Typography>
                    <Typography as="p" color="success">Success color text</Typography>
                    <Typography as="p" color="warning">Warning color text</Typography>
                    <Typography as="p" color="error">Error color text</Typography>
                    <Typography as="p" color="muted">Muted color text</Typography>
                    <Container backgroundColor="primary" padding="xs" justify="end">
                        <Typography as="p" color="contrast">Contrast color text</Typography>
                    </Container>

                    <Typography as="h3" weight="semibold">Font Families</Typography>
                    <Container layout="grid" columns={3} gap="md">
                        <Container layout="flex-column" gap="xs">
                            <Typography as="h5" weight="semibold" color="primary">Primary Font</Typography>
                            <Typography as="p" font="primary">The quick brown fox jumps over the lazy dog</Typography>
                            <Typography as="p" font="primary" size="sm" color="muted">Main body text font</Typography>
                        </Container>
                        <Container layout="flex-column" gap="xs">
                            <Typography as="h5" weight="semibold" color="secondary">Secondary Font</Typography>
                            <Typography as="p" font="secondary">The quick brown fox jumps over the lazy dog</Typography>
                            <Typography as="p" font="secondary" size="sm" color="muted">Alternative display font</Typography>
                        </Container>
                        <Container layout="flex-column" gap="xs">
                            <Typography as="h5" weight="semibold" color="tertiary">Monospace Font</Typography>
                            <Typography as="p" font="monospace">The quick brown fox jumps over the lazy dog</Typography>
                            <Typography as="p" font="monospace" size="sm" color="muted">Code and technical text</Typography>
                        </Container>
                    </Container>
                </Card>
            </Container>
        </Container>

        {/* Buttons Section */}
        <Container >
            <Card padding="large" justify="center">
                <Typography as="h2" color="primary" font="secondary">Buttons</Typography>
                <Typography as="h3" weight="semibold" font="secondary">Individual Buttons</Typography>
                <Container layout="flex" justify="around" align="center" padding="none">
                    <Button variant="primary" size="small">Small Primary</Button>
                    <Button variant="primary" size="medium">Medium Primary</Button>
                    <Button variant="primary" size="large">Large Primary</Button>
                    <Button variant="secondary" size="medium">Secondary</Button>
                    <Button variant="tertiary" size="medium">Tertiary</Button>
                    <Button variant="border-shadow" size="medium">Border Shadow</Button>
                    <Button variant="primary" size="medium" disabled>Disabled</Button>
                </Container>
                <Typography as="h4" weight="semibold" font="secondary">Selected States</Typography>
                <Typography as="p" size="sm" color="muted" font="secondary">
                    Click buttons to toggle their individual selection state (not ButtonGroup behavior)
                </Typography>
                <Container layout="flex" justify="evenly" align="center" padding="none">
                    <Button
                        variant="primary"
                        size="medium"
                        selected={primaryButtonSelected}
                        onClick={() => setPrimaryButtonSelected(!primaryButtonSelected)}
                    >
                        Primary Button
                    </Button>
                    <Button
                        variant="secondary"
                        size="medium"
                        selected={primaryButtonSelected}
                        onClick={() => setSecondaryButtonSelected(!secondaryButtonSelected)}
                    >
                        Secondary Button
                    </Button>
                    <Button
                        variant="tertiary"
                        size="medium"
                        selected={tertiaryButtonSelected}
                        onClick={() => setTertiaryButtonSelected(!tertiaryButtonSelected)}
                    >
                        Tertiary Button
                    </Button>
                    <Button
                        variant="border-shadow"
                        size="medium"
                        selected={borderShadowButtonSelected}
                        onClick={() => setBorderShadowButtonSelected(!borderShadowButtonSelected)}
                    >
                        Border Shadow Button
                    </Button>
                </Container>

                <Typography as="h3" weight="semibold" font="secondary">Button Groups</Typography>
                <Typography as="p" color="muted" font="secondary">
                    Grouped buttons with shared borders and cohesive styling
                </Typography>
                <ButtonGroup>
                    <Button variant="primary">First</Button>
                    <Button variant="primary">Second</Button>
                    <Button variant="primary">Third</Button>
                </ButtonGroup> <ButtonGroup>
                <Button variant="secondary">Edit</Button>
                <Button variant="secondary">Copy</Button>
                <Button variant="secondary">Delete</Button>
            </ButtonGroup>

                <ButtonGroup>
                    <Button variant="tertiary">Create</Button>
                    <Button variant="tertiary">Update</Button>
                    <Button variant="tertiary">Publish</Button>
                </ButtonGroup>

                <ButtonGroup>
                    <Button variant="border-shadow">Save</Button>
                    <Button variant="border-shadow">Cancel</Button>
                </ButtonGroup>
                <Typography as="h4" weight="semibold">Mixed Variant Groups</Typography>
                <ButtonGroup defaultSelected={0}>
                    <Button variant="primary">Active</Button>
                    <Button variant="tertiary">Featured</Button>
                    <Button variant="secondary">Inactive</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                </ButtonGroup>
                <Typography as="h4" weight="semibold">Different Sizes</Typography>
                <ButtonGroup size="small">
                    <Button variant="primary" size="small">Small</Button>
                    <Button variant="primary" size="small">Group</Button>
                    <Button variant="primary" size="small">Buttons</Button>
                </ButtonGroup>

                <ButtonGroup size="large">
                    <Button variant="secondary" size="large">Large</Button>
                    <Button variant="secondary" size="large">Group</Button>
                </ButtonGroup>

                <Typography as="h4" weight="semibold">Spaced Button Groups</Typography>
                <Typography as="p" size="sm" color="muted">
                    ButtonGroups with spacing between buttons instead of shared borders
                </Typography>

                <Typography as="p" weight="medium">Default Spaced Group</Typography>
                <ButtonGroup spaced defaultSelected={0}>
                    <Button variant="primary">Option 1</Button>
                    <Button variant="primary">Option 2</Button>
                    <Button variant="primary">Option 3</Button>
                </ButtonGroup>
                <Typography as="p" weight="medium">Secondary Spaced Group</Typography>
                <ButtonGroup spaced defaultSelected={1}>
                    <Button variant="secondary">Alpha</Button>
                    <Button variant="secondary">Beta</Button>
                    <Button variant="secondary">Gamma</Button>
                </ButtonGroup>

                <Typography as="p" weight="medium">Accent Spaced Group</Typography>
                <ButtonGroup spaced defaultSelected={0}>
                    <Button variant="tertiary">Create</Button>
                    <Button variant="tertiary">Design</Button>
                    <Button variant="tertiary">Deploy</Button>
                </ButtonGroup>

                <Typography as="p" weight="medium">Border-Shadow Spaced Group</Typography>
                <ButtonGroup spaced defaultSelected={2}>
                    <Button variant="border-shadow">
                        <Icon name="FiHome" size="sm"/> Home
                    </Button>
                    <Button variant="border-shadow">
                        <Icon name="FiGrid" size="sm"/> Dashboard
                    </Button>
                    <Button variant="border-shadow">
                        <Icon name="FiSettings" size="sm"/> Settings
                    </Button>
                </ButtonGroup>


                <Typography as="p" weight="medium">Large Spaced Group</Typography>
                <ButtonGroup spaced size="large" defaultSelected={0}>
                    <Button variant="secondary" size="large">Large</Button>
                    <Button variant="secondary" size="large">Spaced</Button>
                    <Button variant="secondary" size="large">Buttons</Button>
                </ButtonGroup> </Card>
        </Container>

        {/* Button Positioning Demo Section */}
        <Container >
            <Card padding="large">
                <Typography as="h2" color="primary">Button Positioning</Typography>
                <Typography as="p" color="muted">
                    Demonstrating how buttons can be positioned within cards and containers using layout properties
                </Typography>

                <Typography as="h3" weight="semibold">Buttons in Cards</Typography>

                <Typography as="h4" weight="semibold">Card with Center-Aligned Buttons</Typography>
                <Card justify="center" padding="lg">
                    <Typography as="h5" weight="medium">Centered Content Card</Typography>
                    <Typography as="p" color="muted">All content including buttons are centered</Typography>
                    <Button variant="primary">Primary Action</Button>
                    <Button variant="secondary">Secondary Action</Button>
                </Card>

                <Typography as="h4" weight="semibold">Card with Justified Buttons</Typography>
                <Card layout="flex" justify="between" align="center" padding="lg">
                    <Container layout="flex-column">
                        <Typography as="h5" weight="medium">Action Required</Typography>
                        <Typography as="p" color="muted" size="sm">Please choose an action to continue</Typography>
                    </Container>
                    <Container layout="flex" justify="between" gap="sm">
                        <Button variant="secondary" size="small">Cancel</Button>
                        <Button variant="primary" size="small">Confirm</Button>
                    </Container>
                </Card>

                <Typography as="h4" weight="semibold">Card with Bottom-Aligned Buttons</Typography>
                <Card layout="flex-column" justify="between" padding="lg" style={{minHeight: '200px'}}>
                    <Container>
                        <Typography as="h5" weight="medium">Content Area</Typography>
                        <Typography as="p" color="muted">This card has content at the top and buttons at the
                            bottom</Typography>
                        <Typography as="p" size="sm">More content here to demonstrate the spacing...</Typography>
                    </Container>
                    <Container layout="flex" justify="end" gap="sm">
                        <Button variant="tertiary" size="small">Edit</Button>
                        <Button variant="primary" size="small">Save</Button>
                    </Container>
                </Card>

                <Typography as="h3" weight="semibold">Buttons in Containers</Typography>

                <Typography as="h4" weight="semibold">Flex Container Layouts</Typography>
                <Container layout="grid" columns={2} gap="md">
                    <Card padding="md">
                        <Typography as="p" weight="medium">Left-Aligned Buttons</Typography>
                        <Container layout="flex" justify="start" gap="sm">
                            <Button variant="primary" size="small">Start</Button>
                            <Button variant="secondary" size="small">Middle</Button>
                            <Button variant="tertiary" size="small">End</Button>
                        </Container>
                    </Card>

                    <Card padding="md">
                        <Typography as="p" weight="medium">Right-Aligned Buttons</Typography>
                        <Container layout="flex" justify="end" gap="sm">
                            <Button variant="primary" size="small">Start</Button>
                            <Button variant="secondary" size="small">Middle</Button>
                            <Button variant="tertiary" size="small">End</Button>
                        </Container>
                    </Card>

                    <Card padding="md">
                        <Typography as="p" weight="medium">Center-Aligned Buttons</Typography>
                        <Container layout="flex" justify="center" gap="sm">
                            <Button variant="primary" size="small">Start</Button>
                            <Button variant="secondary" size="small">Middle</Button>
                            <Button variant="tertiary" size="small">End</Button>
                        </Container>
                    </Card>

                    <Card padding="md">
                        <Typography as="p" weight="medium">Space-Between Buttons</Typography>
                        <Container layout="flex" justify="between" gap="sm">
                            <Button variant="primary" size="small">Left</Button>
                            <Button variant="secondary" size="small">Center</Button>
                            <Button variant="tertiary" size="small">Right</Button>
                        </Container>
                    </Card>
                </Container>

                <Typography as="h4" weight="semibold">Column Layout with Buttons</Typography>
                <Container layout="grid" columns={3} gap="md">
                    <Card layout="flex-column" justify="start" padding="md">
                        <Typography as="p" weight="medium">Start-Aligned Column</Typography>
                        <Typography as="p" size="sm" color="muted">Buttons aligned to start</Typography>
                        <Button variant="primary" size="small">Action</Button>
                        <Button variant="secondary" size="small">Secondary</Button>
                    </Card>

                    <Card layout="flex-column" justify="center" padding="md">
                        <Typography as="p" weight="medium">Center-Aligned Column</Typography>
                        <Typography as="p" size="sm" color="muted">Buttons centered</Typography>
                        <Button variant="tertiary" size="small">Action</Button>
                        <Button variant="secondary" size="small">Secondary</Button>
                    </Card>

                    <Card layout="flex-column" justify="between" padding="md">
                        <Typography as="p" weight="medium">End-Aligned Column</Typography>
                        <Typography as="p" size="sm" color="muted">Buttons aligned to end</Typography>
                        <Button variant="primary" size="small">Action</Button>
                        <Button variant="border-shadow" size="small">Secondary</Button>
                    </Card>
                </Container>

                <Typography as="h4" weight="semibold">Complex Layout Example</Typography>
                <Card layout="flex-column" padding="lg" gap="md">
                    <Container layout="flex" justify="center" align="center" width="100%">
                        <Typography as="h5" weight="medium">Dashboard Settings</Typography>
                        <Button variant="tertiary" size="small">Help</Button>
                    </Container>

                    <Container layout="flex-column" gap="sm">
                        <Typography as="p" color="muted">Configure your dashboard preferences and layout
                            options.</Typography>
                        <Typography as="p" size="sm">Changes will be saved automatically when you modify
                            settings.</Typography>
                    </Container>

                    <Container layout="flex" justify="between" align="center">
                        <Container layout="flex" gap="sm">
                            <Button variant="secondary" size="small">Reset</Button>
                            <Button variant="border-shadow" size="small">Import</Button>
                        </Container>
                        <Container layout="flex" gap="sm">
                            <Button variant="secondary" size="small">Cancel</Button>
                            <Button variant="primary" size="small">Save Changes</Button>
                        </Container>
                    </Container>
                </Card>
            </Card>
        </Container>

        {/* Floating Action Button Section */}
        <Container >
            <Card padding="large">
                <Typography as="h2" color="primary" font="secondary">Floating Action Buttons</Typography>
                <Typography as="p" color="muted" font="secondary">
                    Floating Action Buttons inherit all button styling and variants but with fixed positioning
                </Typography>

                <Typography as="h3" weight="semibold" font="secondary">FAB Variants</Typography>
                <Typography as="p" size="sm" color="muted" font="secondary">
                    FABs use the same color system as regular buttons but with stronger shadows and positioning
                </Typography>

                <Typography as="h4" weight="semibold">Standard FABs</Typography>
                <Container layout="grid" columns={3} gap="md">
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Primary FAB</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '150px', position: 'relative'}}>
                            <Typography as="p" align="center">
                                Parent Container
                            </Typography>
                            <FloatingActionButton
                                variant="primary"
                                position="bottom-right"
                                onClick={() => alert('Primary FAB clicked!')}
                                title="Add new item" 
                                icon="FiPlus"/>
                            
                        </Container>
                    </Card>
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Secondary FAB</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '150px', position: 'relative'}}>
                            <Typography as="p" align="center">
                                Parent Container
                            </Typography> <FloatingActionButton
                            variant="secondary"
                            position="top-right"
                            onClick={() => alert('Secondary FAB clicked!')}
                            title="Send message"
                            icon="FiMail" />
                        </Container>
                    </Card>
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Size Variations</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '150px'}}>
                            <Typography as="p" align="center">
                                Parent Container
                            </Typography> <FloatingActionButton
                            variant="primary"
                            position="top-left"
                            size="small"
                            onClick={() => alert('Small FAB clicked!')}
                            title="Small FAB"
                            icon="FiStar" /> <FloatingActionButton
                            variant="primary"
                            position="bottom-left"
                            size="large"
                            onClick={() => alert('Large FAB clicked!')}
                            title="Large FAB"
                            icon="FiZap" />
                        </Container>
                    </Card>
                </Container> 

                <Typography as="h3" weight="semibold">FABs with Badges</Typography>
                <Typography as="p" size="sm" color="muted">
                    FABs can display badges for notifications, counts, or status indicators (max 10 characters)
                </Typography>

                <Container layout="grid" columns={3} gap="md">
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Notification Badge</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '150px', position: 'relative'}}>
                            <FloatingActionButton
                                variant="primary"
                                position="center"
                                icon="FiMail"
                                badge="5"
                                badgeVariant="error"
                                title="5 unread messages" />
                        </Container>
                    </Card>
                    
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Status Badge</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '150px', position: 'relative'}}>
                            <FloatingActionButton
                                variant="success"
                                position="center"
                                icon="FiActivity"
                                badge="NEW"
                                badgeVariant="warning"
                                title="New activity available" />
                        </Container>
                    </Card>
                    
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Long Text Badge</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '150px', position: 'relative'}}>
                            <FloatingActionButton
                                variant="tertiary"
                                position="center"
                                icon="FiShoppingCart"
                                badge="99+"
                                badgeVariant="primary"
                                title="99+ items in cart" />
                        </Container>
                    </Card>
                </Container>

                <Typography as="h3" weight="semibold">FABs with Floating Cards</Typography>
                <Typography as="p" size="sm" color="muted">
                    FABs can trigger floating cards for enhanced UI interactions
                </Typography>

                <Typography as="h4" weight="semibold">Interactive Floating Cards with FAB Triggers</Typography>
                <Container layout="grid" columns={2} gap="md">
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Quick Actions Menu</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '200px', position: 'relative'}}>
                            <Typography as="p" align="center">
                                Click the FAB to show floating menu
                            </Typography>

                            <FloatingActionButton
                                variant="primary"
                                position="bottom-right"
                                genie={{
                                    trigger: 'click', 
                                    content: (
                                    <Container layout="flex-column" gap="xs" padding="xs">
                                        <Typography as="h4" size="sm" weight="semibold">Actions</Typography>
                                        <Button variant="ghost" size="small" align="left"
                                                onClick={() => alert('Edit action!')}>
                                            <Icon name="FiEdit" size="sm"/>
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="small" align="left"
                                                onClick={() => alert('Delete action!')} color="error">
                                            <Icon name="FiTrash" size="sm"/>
                                            Delete
                                        </Button>
                                        <Button variant="ghost" size="small" align="left"
                                                onClick={() => alert('Share action!')}>
                                            <Icon name="FiShare" size="sm"/>
                                            Share
                                        </Button>
                                    </Container>), variant: 'menu'
                                }}
                                title="Quick Actions Menu"
                                icon="FiPlus" />
                        </Container>
                    </Card>

                    <Card padding="medium">
                        <Typography as="p" weight="medium">Notification Center</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '200px', position: 'relative'}}>
                            <Typography as="p" align="center">
                                Click the FAB to view notifications
                            </Typography>

                            <FloatingActionButton
                                variant="secondary"
                                position="top-right"
                                genie={{
                                    trigger: 'click', content: (<Container layout="flex-column" gap="sm" padding="sm">
                                        <Typography as="h4" size="sm"
                                                    weight="semibold">Notifications</Typography>
                                        <Container layout="flex-column" gap="xs">
                                            <Container layout="flex" gap="sm" align="center">
                                                <Icon name="FiMail" size="sm" color="primary"/>
                                                <Typography as="p" size="sm">New message from team</Typography>
                                            </Container>
                                            <Container layout="flex" gap="sm" align="center">
                                                <Icon name="FiClock" size="sm" color="warning"/>
                                                <Typography as="p" size="sm">Deadline reminder: 2
                                                    days</Typography>
                                            </Container>
                                            <Container layout="flex" gap="sm" align="center">
                                                <Icon name="FiCheck" size="sm" color="success"/>
                                                <Typography as="p" size="sm">Task completed
                                                    successfully</Typography>
                                            </Container>
                                        </Container>
                                        <Button variant="primary" size="small"
                                                onClick={() => alert('View All Notifications')}>
                                            View All
                                        </Button>
                                    </Container>), variant: 'popover'
                                }}
                                title="Notifications"
                                icon="FiBell"
                                badge="3"
                                badgeVariant="error" />
                        </Container>
                    </Card>
                </Container>

                <Typography as="h4" weight="semibold">Context Menu and Hover Interactions</Typography>
                <Container layout="grid" columns={2} gap="md">
                    <Card padding="medium">
                        <Typography as="p" weight="medium">Context Menu FAB</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '200px'}}>
                            <Typography as="p" align="center">
                                Right-click for context menu
                            </Typography>

                            <FloatingActionButton
                                variant="tertiary"
                                position="bottom-right"
                                genie={{
                                    trigger: 'contextmenu',
                                    content: (<Container layout="flex-column" gap="xs" padding="xs">
                                        <Button variant="ghost" size="small" align="left"
                                                onClick={() => alert('Edit')}>
                                            <Icon name="FiEdit" size="sm"/>
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="small" align="left"
                                                onClick={() => alert('Copy')}>
                                            <Icon name="FiCopy" size="sm"/>
                                            Copy
                                        </Button>
                                        <Button variant="ghost" size="small" align="left"
                                                onClick={() => alert('Share')}>
                                            <Icon name="FiShare" size="sm"/>
                                            Share
                                        </Button>
                                        <Button variant="ghost" size="small" align="left"
                                                onClick={() => alert('Delete')} color="error">
                                            <Icon name="FiTrash" size="sm"/>
                                            Delete
                                        </Button>
                                    </Container>),
                                    variant: 'menu'
                                }}
                                title="Context Actions"
                                icon="FiMoreVertical" />
                        </Container>
                    </Card>

                    <Card padding="medium">
                        <Typography as="p" weight="medium">Hover Information Card</Typography>
                        <Container backgroundColor="background" layout="flex" align="center" justify="center"
                                   style={{minHeight: '200px', position: 'relative'}}>
                            <Typography as="p" align="center">
                                Hover the FAB for information
                            </Typography>

                            <FloatingActionButton
                                variant="success"
                                position="bottom-left"
                                genie={{
                                    trigger: 'hover', content: (<Container layout="flex-column" gap="md" padding="md">
                                        <Typography as="h3" weight="semibold">Quick Information</Typography>
                                        <Typography as="p" color="muted">
                                            This FAB provides quick access to common actions and information.
                                        </Typography>

                                        <Container layout="flex-column" gap="sm">
                                            <Container layout="flex" justify="between" align="center">
                                                <Typography as="p" size="sm">Status:</Typography>
                                                <Badge variant="success" size="small">Active</Badge>
                                            </Container>
                                            <Container layout="flex" justify="between" align="center">
                                                <Typography as="p" size="sm">Last updated:</Typography>
                                                <Typography as="p" size="sm" color="muted">5 min
                                                    ago</Typography>
                                            </Container>
                                        </Container>

                                        <Button variant="primary" size="small"
                                                onClick={() => alert('Open Details')}>
                                            View Details
                                        </Button>
                                    </Container>), variant: 'popover'
                                }}
                                title="Information"
                                icon="FiInfo" />
                        </Container>
                    </Card>
                </Container>

                <Typography as="h3" weight="semibold">FAB Positioning Demo</Typography>
                <Card padding="medium">
                    <Typography as="p" weight="medium">Corner Positioning</Typography>
                    <Container backgroundColor="background" layout="flex" align="center" justify="center"
                               style={{minHeight: '150px'}}>
                        <Typography as="p" align="center">
                            Parent Container - FABs positioned in each corner
                        </Typography>
                        <FloatingActionButton
                            variant="primary"
                            position="top-left"
                            size="small"
                            title="Top Left"
                            icon="FiArrowUp" />
                        <FloatingActionButton
                            variant="secondary"
                            position="top-right"
                            size="small"
                            title="Top Right"
                            icon="FiArrowRight" />
                        <FloatingActionButton
                            variant="border-shadow"
                            position="bottom-left"
                            size="small"
                            title="Bottom Left"
                            icon="FiArrowLeft" />
                        <FloatingActionButton
                            variant="success"
                            position="bottom-right"
                            size="small"
                            title="Bottom Right"
                            icon="FiArrowDown" />
                    </Container>
                </Card>
            </Card>
        </Container>

        {/* Draggable FAB Section */}
        <Container width="100%">
            <Card padding="large" justify="center">
                <Typography as="h2" color="primary">Draggable Floating Action Buttons with Edge & Corner
                    Snapping</Typography>
                <Typography as="p" color="muted">
                    FABs with advanced drag-and-drop functionality, smart click detection, and automatic snapping to
                    corners and edges
                </Typography>
                <Typography as="h3" weight="semibold">Interactive Dragging with Smart Features & Improved
                    Snapping</Typography>
                <Typography as="p" size="sm" color="muted">
                    • Click quickly for normal actions • Hold and drag to reposition • Automatic distinction between
                    clicks and drags • Snaps to corners and edges when nearby for precise positioning
                </Typography>

                <Container gap="md"> <Card padding="medium">
                    <Typography as="p" weight="medium">Draggable FAB with Floating Card Menu</Typography>
                    <Typography as="p" size="sm" color="muted">
                        Quick click shows floating menu • Hold & drag to reposition • Snaps to corners and edges
                    </Typography>
                    <Container
                        backgroundColor="background"
                        layout="flex"
                        align="center"
                        justify="center"
                        style={{minHeight: '200px', position: 'relative', border: '2px dashed var(--border-color)'}}
                    >
                        <Typography as="p" align="center" color="muted">
                            Drag Zone
                            <br/>
                            <small>Drag or click for floating menu</small>
                        </Typography>
                        <FloatingActionButton
                            variant="secondary"
                            draggable={true}
                            position="top-left"
                            genie={{
                                trigger: 'click', content: (<Container layout="flex-column" gap="xs" padding="xs">
                                    <Typography as="h4" size="sm" weight="semibold">Actions</Typography>
                                    <Button variant="ghost" size="small" align="left"
                                            onClick={() => alert('Edit action!')}>
                                        <Icon name="FiEdit" size="sm"/>
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="small" align="left"
                                            onClick={() => alert('Delete action!')} color="error">
                                        <Icon name="FiTrash" size="sm"/>
                                        Delete
                                    </Button>
                                    <Button variant="ghost" size="small" align="left"
                                            onClick={() => alert('Share action!')}>
                                        <Icon name="FiShare" size="sm"/>
                                        Share
                                    </Button>
                                </Container>), variant: 'menu'
                            }}
                            title="Draggable FAB with Floating Menu"
                            icon="FiGrid" />
                    </Container>
                </Card> </Container>
            </Card>
        </Container>

        {/* Input System Section */}
        <Container  gap="md">
            <Card padding="large">
                <Typography as="h2" color="primary" font="secondary">Input Variants</Typography>
                <Typography as="p" color="muted" font="secondary">
                    Modern input components with multiple variants, sizes, and interactive features
                </Typography>
                <Container layout="grid" columns={2} gap="md">
                    <Card padding="medium" backgroundColor="background">
                        <Typography as="p" weight="medium">Default Input</Typography>
                        <Input
                            variant="default"
                            placeholder="Default input style"
                            width="100%"
                        />

                        <Typography as="p" weight="medium">Outline Input</Typography>
                        <Input
                            variant="outline"
                            placeholder="Outline input style"
                            width="100%"
                        />

                        <Typography as="p" weight="medium">Filled Input</Typography>
                        <Input
                            variant="filled"
                            placeholder="Filled input style"
                            width="100%"
                        />

                        <Typography as="p" weight="medium">Underline Input</Typography>
                        <Input
                            variant="underline filled"
                            placeholder="Underline input style"
                            width="100%"
                        />
                    </Card>

                    <Card backgroundColor="background" padding="medium">
                        <Typography as="p" weight="medium">Floating Label Input</Typography>
                        <Input
                            variant="floating"
                            label="Floating Label"
                            width="100%"
                        />
                        <Typography as="p" weight="medium">With Left Icon</Typography>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            icon="FiMail"
                            iconPosition="left"
                            width="100%"
                        />

                        <Typography as="p" weight="medium">With Right Icon</Typography>
                        <Input
                            type="search"
                            placeholder="Search..."
                            icon="FiSearch"
                            iconPosition="right"
                            width="100%"
                        />
                        <Typography as="p" weight="medium">Password Input</Typography>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            width="100%"
                        />
                    </Card>
                </Container>
                <Typography as="h3" weight="semibold">Input Sizes</Typography>
                <Container layout="grid" columns={3} gap="md" align="center">
                        <Input
                            size="small"
                            placeholder="Small input"
                            variant="filled"
                            width="100%"
                        />
                        <Input
                            size="medium"
                            placeholder="Medium input"
                            variant="filled"
                            width="100%"
                        />
                        <Input
                            size="large"
                            placeholder="Large input"
                            variant="filled"
                            width="100%"
                        />
                </Container>

                <Typography as="h3" weight="semibold">Input States</Typography>
                <Container backgroundColor="background" layout="grid" columns={2} gap="md">
                    <Container width="100%">
                        <Typography as="p" weight="medium">Error State</Typography>
                        <Input
                            placeholder="Input with error"
                            helpText="This field is required"
                            state="error"
                            width="100%"
                        />

                        <Typography as="p" weight="medium">Disabled State</Typography>
                        <Input
                            placeholder="Disabled input"
                            disabled={true}
                            width="100%"
                        />

                        <Typography as="p" weight="medium">Success State</Typography>
                        <Input
                            placeholder="Valid input"
                            helpText="Valid input"
                            state="success"
                            width="100%"
                        />
                    </Container>

                    <Container width="100%">
                        <Typography as="p" weight="medium">With Helper Text</Typography>
                        <Input
                            placeholder="Enter your username"
                            helpText="Username must be at least 3 characters"
                            state="tertiary"
                            width="100%"
                        />

                        <Typography as="p" weight="medium">Warning State</Typography>
                        <Input
                            placeholder="Input with warning"
                            helpText={"This value might need review"}
                            state="warning"
                            width="100%"
                        />

                        <Typography as="p" weight="medium">Select Dropdown</Typography>
                        <Select
                            options={selectOptions}
                            value={selectValue}
                            onChange={(value) => setSelectValue(value)}
                            placeholder="Choose an option..."
                            width="100%"
                        />
                        
                        <Typography as="p" weight="medium">Multi-Select with Random Badge Colors</Typography>
                        <Select
                            multiSelect={true}
                            options={selectOptions}
                            value={multiSelectValue}
                            onChange={(value) => setMultiSelectValue(value)}
                            placeholder="Choose multiple options..."
                            width="100%"
                            helpText="Options and selected values are displayed as colorful badges"
                        />
                    </Container>
                </Container>
            </Card>
        </Container>

        {/* Traditional Form Controls Section */}
        <Container layout="flex" >
            <Container layout="flex" justify="end" align="end" flexFill>
                <Card padding="large">
                    <Typography as="h2" color="primary">Traditional Form Controls</Typography>

                    <Input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        label="I agree to the terms and conditions"
                    />
                    <Typography as="h4" weight="semibold">Checkboxes with Helper Text</Typography>

                    <Input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                        }}
                        label="Enable marketing emails"
                        helpText="You can unsubscribe at any time from your account settings."
                        state="default"
                    />

                    <Input
                        type="checkbox"
                        checked={true}
                        label="Two-factor authentication"
                        helpText="Successfully enabled for improved security."
                        state="success"
                    />

                    <Input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                        }}
                        label="Beta features"
                        helpText="These features are experimental and may be unstable."
                        state="warning"
                    />

                    <Input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                        }}
                        label="Data processing consent"
                        helpText="This field is required to continue."
                        state="error"
                    />

                    <Input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                        }}
                        label="Developer mode"
                        helpText="Enables advanced debugging tools and experimental features."
                        state="tertiary"/>
                    <Switch
                        checked={isSwitchOn}
                        onChange={(e) => setIsSwitchOn(e.target.checked)}
                        size="medium"
                        label="Enable notifications"
                    />
                </Card>
            </Container>

            <Container layout="flex-column" flexFill>
                <Card padding="large">
                    <Typography as="h2" color="primary" font="secondary">Icons</Typography>
                    <Typography as="p" weight="medium" font="secondary">Icon Variants</Typography>
                    <Container layout="flex" gap="sm" align="center" marginBottom="md" padding="none">
                        <Icon name="FiCheckCircle" variant="success" size="lg"/>
                        <Icon name="FiAlertTriangle" variant="warning" size="lg"/>
                        <Icon name="FiXCircle" variant="error" size="lg"/>
                        <Icon name="FiInfo" variant="tertiary" size="lg"/>
                        <Icon name="FiUser" variant="primary" size="lg"/>
                        <Icon name="FiSettings" variant="secondary" size="lg"/>
                    </Container>

                    <Typography as="p" weight="medium">Icon Sizes</Typography>
                    <Container layout="flex" gap="sm" align="center" marginBottom="md" padding="none">
                        <Icon name="FiStar" variant="primary" size="xs"/>
                        <Icon name="FiStar" variant="primary" size="sm"/>
                        <Icon name="FiStar" variant="primary" size="md"/>
                        <Icon name="FiStar" variant="primary" size="lg"/>
                        <Icon name="FiStar" variant="primary" size="xl"/>
                        <Icon name="FiStar" variant="primary" size="2xl"/>
                    </Container>

                    <Typography as="p" weight="medium">Common Icons</Typography>
                    <Container layout="flex" gap="sm" align="center" padding="none">
                        <Icon name="FiHome" variant="primary" size="md"/>
                        <Icon name="FiMail" variant="primary" size="md"/>
                        <Icon name="FiSearch" variant="primary" size="md"/>
                        <Icon name="FiSettings" variant="primary" size="md"/>
                        <Icon name="FiUser" variant="primary" size="md"/>
                        <Icon name="FiBell" variant="primary" size="md"/>
                        <Icon name="FiCalendar" variant="primary" size="md"/>
                        <Icon name="FiHeart" variant="primary" size="md"/>
                        <Icon name="FiStar" variant="primary" size="md"/>
                        <Icon name="FiDownload" variant="primary" size="md"/>
                        <Icon name="FiUpload" variant="primary" size="md"/>
                        <Icon name="FiEdit" variant="primary" size="md"/>
                        <Icon name="FiTrash" variant="primary" size="md"/>
                        <Icon name="FiPlus" variant="primary" size="md"/>
                    </Container>
                </Card>

                <Card padding="large">
                    <Typography as="h2" color="primary">Badges & Status</Typography>

                    <Typography as="p" weight="medium">Badge Variants</Typography>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge> <Typography as="p" weight="medium">Badge Sizes</Typography>
                    <Badge variant="primary" size="small">Small</Badge>
                    <Badge variant="primary">Default</Badge>
                    <Badge variant="primary" size="large">Large</Badge>
                </Card>
            </Container>
        </Container>

        {/* Progress & Interactive Section */}
        <Container width="60%" gap="md">
            <Card padding="large">
                <Typography as="h2" color="primary" font="secondary">Progress Indicators</Typography>
                <Typography as="p" color="muted" font="secondary">
                    Interactive progress bars with gradient colors that transition from error (red) to warning
                    (yellow) to tertiary (purple) to success (green) based on progress value for the default variant. The
                    accent variant uses consistent accent theme colors.
                </Typography>
                <Typography as="p" weight="medium">Default Variant - Interactive Progress Demo</Typography>
                <Container layout="flex" align="center" gap="md" marginBottom="lg">

                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue1(Math.max(0, progressValue1 - 10))}
                        disabled={progressValue1 <= 0}
                    >
                        -10
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue1(Math.max(0, progressValue1 - 5))}
                        disabled={progressValue1 <= 0}>
                        -5
                    </Button>
                    <Container flexFill>
                        <ProgressBar value={progressValue1} max={100} showPercentage={true}/>
                    </Container>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue1(Math.min(100, progressValue1 + 5))}
                        disabled={progressValue1 >= 100}
                    >
                        +5
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue1(Math.min(100, progressValue1 + 10))}
                        disabled={progressValue1 >= 100}
                    >
                        +10
                    </Button>
                </Container>

                <Typography as="p" weight="medium">Default Variant - Striped Animated Progress
                    (Interactive)</Typography>
                <Container layout="flex" align="center" gap="md" marginBottom="lg">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue4(Math.max(0, progressValue4 - 10))}
                        disabled={progressValue4 <= 0}
                    >
                        -10
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue4(Math.max(0, progressValue4 - 5))}
                        disabled={progressValue4 <= 0}
                    >
                        -5
                    </Button>
                    <Container flexFill>
                        <ProgressBar value={progressValue4} max={100} striped animated showPercentage={true}/>
                    </Container>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue4(Math.min(100, progressValue4 + 5))}
                        disabled={progressValue4 >= 100}
                    >
                        +5
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setProgressValue4(Math.min(100, progressValue4 + 10))}
                        disabled={progressValue4 >= 100}
                    >
                        +10
                    </Button>
                </Container>

                <Container layout="flex" justify="center">
                    <Button
                        variant="success"
                        size="medium" onClick={() => {
                        setProgressValue1(0);
                        setProgressValue4(0);
                    }}

                    >
                        Reset All
                    </Button>
                    <Button
                        variant="warning"
                        size="medium" onClick={() => {
                        setProgressValue1(50);
                        setProgressValue4(50);
                    }}
                    >
                        Set to 50%
                    </Button>
                    <Button
                        variant="primary"
                        size="medium" onClick={() => {
                        setProgressValue1(100);
                        setProgressValue4(100);
                    }}
                    >
                        Complete All
                    </Button>
                </Container>

            </Card>
        </Container>

        {/* Circular Progress Section */}
        <Container width="60%" gap="md">
            <Card padding="large">
                <Typography as="h2" color="primary">Circular Progress Indicators</Typography>
                <Typography as="p" color="muted">
                    Animated circular loading indicators with continuous rotation animation. These loaders provide 
                    visual feedback during loading states without showing specific progress values.
                </Typography>

                <Typography as="p" weight="medium">Size Variants</Typography>
                <Container layout="flex" align="center" justify="center" gap="xl" marginBottom="lg">
                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Small</Typography>
                        <CircularProgress
                            size="small"
                            variant="primary"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Default</Typography>
                        <CircularProgress
                            size="default"
                            variant="secondary"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Large</Typography>
                        <CircularProgress
                            size="large"
                            variant="tertiary"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Extra Large</Typography>
                        <CircularProgress
                            size="xl"
                            variant="success"
                        />
                    </Container>
                </Container>

                <Typography as="p" weight="medium">Color Variants</Typography>
                <Container layout="flex" align="center" justify="center" gap="xl" marginBottom="lg">
                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Primary</Typography>
                        <CircularProgress
                            variant="primary"
                            size="default"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Secondary</Typography>
                        <CircularProgress
                            variant="secondary"
                            size="default"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Success</Typography>
                        <CircularProgress
                            variant="success"
                            size="default"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Warning</Typography>
                        <CircularProgress
                            variant="warning"
                            size="default"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Error</Typography>
                        <CircularProgress
                            variant="error"
                            size="default"
                        />
                    </Container>
                </Container>

                <Typography as="p" weight="medium">Speed Variants</Typography>
                <Container layout="flex" align="center" justify="center" gap="xl" marginBottom="lg">
                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Slow</Typography>
                        <CircularProgress
                            speed="slow"
                            variant="primary"
                            size="large"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Default</Typography>
                        <CircularProgress
                            speed="default"
                            variant="tertiary"
                            size="large"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Fast</Typography>
                        <CircularProgress
                            speed="fast"
                            variant="secondary"
                            size="large"
                        />
                    </Container>
                </Container>

                <Typography as="p" weight="medium">Custom Stroke Width</Typography>
                <Container layout="flex" align="center" justify="center" gap="xl" marginBottom="lg">
                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Thin (2px)</Typography>
                        <CircularProgress
                            strokeWidth={2}
                            variant="primary"
                            size="large"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Thick (8px)</Typography>
                        <CircularProgress
                            strokeWidth={8}
                            variant="success"
                            size="large"
                        />
                    </Container>

                    <Container layout="flex-column" align="center" gap="sm">
                        <Typography as="span" size="sm" weight="medium">Extra Thick (12px)</Typography>
                        <CircularProgress
                            strokeWidth={12}
                            variant="warning"
                            size="xl"
                        />
                    </Container>
                </Container>

            </Card>
        </Container>

        {/* Genie Section */}
        <Container width="100%" gap="md">
            <Card padding="large">
                <Typography as="h2" color="primary">Genie</Typography>
                <Typography as="p" color="muted">
                    Universal positioning system with automatic quadrant detection
                </Typography> <Typography as="h3" weight="semibold">Trigger Types</Typography>

                <Container gap="2xl" backgroundColor="background" layout="flex" justify="around" align="center"
                           style={{minHeight: '300px', flexWrap: 'wrap', padding: 'var(--spacing-2xl)'}}>
                    <Container
                        backgroundColor="primary"
                        layout="flex"
                        align="center"
                        theme="modern"
                        justify="center"
                        style={{
                            minHeight: '120px',
                            minWidth: '160px',
                            cursor: 'pointer',
                            borderRadius: 'var(--border-radius-md)'
                        }}
                        genie={{
                            trigger: 'click', 
                            content: (<Container layout="flex-column" gap="md">
                                <Typography as="h4">Click Trigger</Typography>
                                <Typography as="p" size="sm">Toggle on click</Typography>
                                <Button variant="secondary" size="small">Action</Button>
                            </Container>)
                        }}
                    >
                        <Typography as="p" style={{color: 'var(--text-color-secondary)'}}>Click</Typography>
                    </Container>

                    <Container
                        backgroundColor="secondary"
                        layout="flex"
                        align="center"
                        justify="center"
                        style={{minHeight: '120px', minWidth: '160px', borderRadius: 'var(--border-radius-md)'}}
                        genie={{
                            trigger: 'hover', content: (<Container layout="flex-column" gap="md">
                                <Typography as="h4">Hover Trigger</Typography>
                                <Typography as="p" size="sm">Shows on hover</Typography>
                                <Badge variant="success">Auto Position</Badge>
                            </Container>)
                        }}
                    >
                        <Typography as="p" style={{color: 'var(--text-color-secondary)'}}>Hover</Typography>
                    </Container>

                    <Container
                        backgroundColor="tertiary"
                        layout="flex"
                        align="center"
                        justify="center"
                        style={{
                            minHeight: '120px',
                            minWidth: '160px',
                            cursor: 'context-menu',
                            borderRadius: 'var(--border-radius-md)'
                        }}
                        genie={{
                            trigger: 'contextmenu', content: (<Container layout="flex-column" gap="sm">
                                <Typography as="h4">Context Menu</Typography>
                                <Button variant="ghost" size="small"><Icon name="FiEdit" size="sm"/> Edit</Button>
                                <Button variant="ghost" size="small"><Icon name="FiCopy" size="sm"/> Copy</Button>
                                <Button variant="ghost" size="small"><Icon name="FiTrash"
                                                                           size="sm"/> Delete</Button>
                            </Container>)
                        }}
                    >
                        <Typography as="p" style={{color: 'var(--text-color)'}}>Right-Click</Typography>
                    </Container>
                </Container>

                <Typography as="h3" weight="semibold">Smart Auto-Positioning</Typography>
                <Typography as="p" color="muted" marginBottom="md">
                    Genies automatically position themselves to stay visible. Try clicking buttons near edges and corners - the genies will intelligently choose the best position to avoid being cut off.
                </Typography>

                <Container 
                    layout="positioned"
                    backgroundColor="background" 
                    style={{ 
                        minHeight: '55vh', 
                        padding: 'var(--spacing-lg)',
                        border: '2px dashed var(--border-color)',
                        borderRadius: 'var(--border-radius-md)'
                    }}
                >
                        <FloatingActionButton
                            variant="primary"
                            size="small"
                            genie={{
                                trigger: 'click',
                                content: (
                                    <Container layout="flex-column" gap="sm">
                                        <Typography as="h4">📍 Top-Left FAB</Typography>
                                        <Typography as="p" size="sm">Notice how this genie appears below and to the right to stay in view!</Typography>
                                        <Badge variant="success">Auto-positioned</Badge>
                                    </Container>
                                )
                            }}
                            position="top-left"
                            icon="FiArrowUpLeft" />
                        
                        <FloatingActionButton
                            variant="secondary"
                            size="small"
                            genie={{
                                trigger: 'click',
                                content: (
                                    <Container layout="flex-column" gap="sm">
                                        <Typography as="h4">📍 Top-Right FAB</Typography>
                                        <Typography as="p" size="sm">This genie appears below and to the left - smart positioning!</Typography>
                                        <Badge variant="tertiary">Intelligent placement</Badge>
                                    </Container>
                                )
                            }}
                            position="top-right"
                            icon="FiArrowUpRight" />

                    {/* Center content */}
                    <Container 
                        layout="flex" 
                        align="center" 
                        justify="center"
                        gap="none"
                        style={{ 
                        height: '55vh'
                    }}
                    >
                        
                        <FloatingActionButton
                            variant="tertiary"
                            genie={{
                                trigger: 'hover',
                                content: (
                                    <Container layout="flex-column" gap="md" align="center">
                                        <Typography as="h4">🎯 Perfect Center</Typography>
                                        <Typography as="p" size="sm" align="center">
                                            I have plenty of space around me, so I can appear in any direction that works best!
                                        </Typography>
                                        <Container layout="flex" gap="sm">
                                            <Badge variant="primary">Flexible</Badge>
                                            <Badge variant="success">Optimal</Badge>
                                        </Container>
                                    </Container>
                                )
                            }}
                            position="center"
                            icon="FiTarget" />
                    </Container>

                    
                        <FloatingActionButton
                            variant="warning"
                            size="small"
                            genie={{
                                trigger: 'click',
                                content: (
                                    <Container layout="flex-column" gap="sm">
                                        <Typography as="h4">📍 Bottom-Left FAB</Typography>
                                        <Typography as="p" size="sm">I appear above and to the right - avoiding the bottom edge!</Typography>
                                        <Badge variant="warning">Edge-aware</Badge>
                                    </Container>
                                )
                            }}
                            position="bottom-left"
                            icon="FiArrowDownLeft" />
                        
                        <FloatingActionButton
                            variant="error"
                            size="small"
                            genie={{
                                trigger: 'click',
                                content: (
                                    <Container layout="flex-column" gap="sm">
                                        <Typography as="h4">📍 Bottom-Right FAB</Typography>
                                        <Typography as="p" size="sm">Watch me appear above and to the left - staying visible!</Typography>
                                        <Badge variant="error">Space-conscious</Badge>
                                    </Container>
                                )
                            }}
                            position="bottom-right"
                            icon="FiArrowDownRight" />

                   </Container>

                <Typography as="p" color="muted" size="sm" marginTop="md" align="center">
                    💡 <strong>How it works:</strong> Genies detect their position in the viewport and automatically choose the best placement to ensure full visibility - no manual positioning needed!
                </Typography>
            </Card>
        </Container>

        {/* Data Display Components*/}
        <Container >
            <Card width="100%">
                <Typography as="h2" color="primary">Data Display Component</Typography>
                <Typography as="p" color="muted">
                    Flexible Data component with table, cards, and list layouts. Automatically detects nested data and shows it in Genies on hover.
                </Typography>

                {/* Original simple data demo */}
                <Typography as="h3" color="secondary" marginTop="lg">Styled Data</Typography>
                <Data
                    data={demoData}
                    fieldConfig={fieldStyleConfig}
                    variant="table"
                    sortable={true}
                />

                {/* Data with Generic Genie Integration Demo */}
                <Typography as="h3" color="secondary" marginTop="lg">Data with Generic Genie Integration</Typography>
                <Typography as="p" color="muted" size="sm" marginBottom="md">
                    Click on any row/item to see a custom Genie. Right-click for context menu Genie.
                </Typography>
                
                {/* Click trigger example */}
                <Typography as="h4" color="tertiary" marginTop="md">Click Trigger (Table)</Typography>
                <Data
                    data={demoData.slice(0, 5)} // Show fewer items for demo
                    variant="table"
                    theme="vibrant"
                    genie={{
                        content: (item, index) => (
                            <Container layout="flex-column" gap="md" padding="lg">
                                <Typography as="h4" color="primary">Row Details #{index + 1}</Typography>
                                <Typography as="p" color="secondary">Name: {item.name}</Typography>
                                <Typography as="p" color="secondary">Email: {item.email}</Typography>
                                <Typography as="p" color="secondary">Status: {item.status}</Typography>
                                <Button size="small" variant="primary">Edit Item</Button>
                            </Container>
                        ),
                        trigger: 'click',
                        variant: 'popover',
                        width: '300px'
                    }}
                    onGenieShow={(item, index) => console.log('Genie shown for item:', item, 'at index:', index)}
                    onGenieHide={(item, index) => console.log('Genie hidden for item:', item, 'at index:', index)}
                />

                {/* Context menu trigger example */}
                <Typography as="h4" color="tertiary" marginTop="md">Context Menu Trigger (Cards)</Typography>
                <Data
                    data={demoData.slice(0, 4)} // Show fewer items for demo
                    variant="cards"
                    theme="modern"
                    genie={{
                        content: (item, index) => (
                            <Container layout="flex-column" gap="sm" padding="md">
                                <Typography as="h4" color="primary">Actions</Typography>
                                <Button size="small" variant="secondary" layout="flex" justify="start">
                                    <Icon name="FiEdit2" size="xs" />
                                    Edit {item.name}
                                </Button>
                                <Button size="small" variant="secondary" layout="flex" justify="start">
                                    <Icon name="FiTrash2" size="xs" />
                                    Delete
                                </Button>
                                <Button size="small" variant="secondary" layout="flex" justify="start">
                                    <Icon name="FiShare2" size="xs" />
                                    Share
                                </Button>
                            </Container>
                        ),
                        trigger: 'contextmenu',
                        variant: 'menu',
                        width: '200px'
                    }}
                />
                {/* Demo with complex nested data */}
                <Typography as="h3" color="secondary" marginTop="lg">Complex Data with Nested Objects</Typography>
                <Data
                    theme="pink"
                    data={[
                        {
                            id: 1,
                            name: "John Doe",
                            email: "john@example.com",
                            profile: {
                                age: 30,
                                address: {
                                    street: "123 Main St",
                                    city: "New York",
                                    state: "NY",
                                    zip: "10001"
                                },
                                preferences: {
                                    theme: "dark",
                                    notifications: true,
                                    language: "en"
                                }
                            },
                            tags: ["developer", "react", "javascript"]
                        },
                        {
                            id: 2,
                            name: "Jane Smith", 
                            email: "jane@example.com",
                            profile: {
                                age: 28,
                                address: {
                                    street: "456 Oak Ave",
                                    city: "San Francisco",
                                    state: "CA",
                                    zip: "94102"
                                },
                                preferences: {
                                    theme: "light",
                                    notifications: false,
                                    language: "en"
                                }
                            },
                            tags: ["designer", "ui", "ux"]
                        },
                        {
                            id: 3,
                            name: "Bob Johnson",
                            email: "bob@example.com", 
                            profile: {
                                age: 35,
                                address: {
                                    street: "789 Pine St",
                                    city: "Seattle",
                                    state: "WA", 
                                    zip: "98101"
                                },
                                preferences: {
                                    theme: "auto",
                                    notifications: true,
                                    language: "es"
                                }
                            },
                            tags: ["manager", "product", "lead", "team", "collaboration", "communication"]
                        }
                    ]}
                    variant="table"
                />

                {/* Cards variant with nested data */}
                <Typography as="h3" color="secondary" marginTop="lg">Cards Layout with Nested Data</Typography>
                <Data
                    data={[
                        {
                            id: 1,
                            name: "John Doe",
                            email: "john@example.com",
                            profile: {
                                age: 30,
                                address: {
                                    street: "123 Main St",
                                    city: "New York",
                                    state: "NY",
                                    zip: "10001"
                                },
                                preferences: {
                                    theme: "dark",
                                    notifications: true,
                                    language: "en"
                                }
                            },
                            tags: ["developer", "react", "javascript"]
                        },
                        {
                            id: 2,
                            name: "Jane Smith", 
                            email: "jane@example.com",
                            profile: {
                                age: 28,
                                address: {
                                    street: "456 Oak Ave",
                                    city: "San Francisco",
                                    state: "CA",
                                    zip: "94102"
                                },
                                preferences: {
                                    theme: "light",
                                    notifications: false,
                                    language: "en"
                                }
                            },
                            tags: ["designer", "ui", "ux"]
                        }
                    ]}
                    variant="cards"
                />

                {/* List variant with even more complex nested data */}
                <Typography as="h3" color="secondary" marginTop="lg">List Layout with Complex Nested Data</Typography>
                <Data
                    data={[
                        {
                            id: 1,
                            name: "Advanced User",
                            email: "advanced@example.com",
                            settings: {
                                privacy: {
                                    profileVisible: true,
                                    emailVisible: false,
                                    phoneVisible: true
                                },
                                security: {
                                    twoFactorEnabled: true,
                                    passwordLastChanged: "2024-01-15",
                                    loginHistory: ["2024-01-20", "2024-01-19", "2024-01-18"]
                                },
                                preferences: {
                                    theme: "dark",
                                    language: "en",
                                    timezone: "America/New_York",
                                    notifications: {
                                        email: true,
                                        sms: false,
                                        push: true,
                                        frequency: "daily"
                                    }
                                }
                            },
                            metadata: {
                                createdAt: "2023-05-10",
                                lastLogin: "2024-01-20T10:30:00Z",
                                accountType: "premium",
                                features: {
                                    analytics: true,
                                    apiAccess: true,
                                    customIntegrations: true,
                                    advancedReports: true,
                                    dataExport: true,
                                    prioritySupport: true,
                                    customBranding: false,
                                    whiteLabel: false,
                                    ssoIntegration: true,
                                    auditLogs: true,
                                    roleBasedAccess: true,
                                    bulkOperations: true,
                                    scheduledReports: true,
                                    realTimeSync: true,
                                    backupRestore: true,
                                    multiRegion: false,
                                    customWorkflows: true,
                                    advancedSecurity: true,
                                    complianceReports: true,
                                    dataSecurity: {
                                        encryption: "AES-256",
                                        backupFrequency: "daily",
                                        retentionPeriod: "7 years",
                                        complianceStandards: ["SOC2", "GDPR", "HIPAA"]
                                    },
                                    integrations: {
                                        salesforce: true,
                                        hubspot: false,
                                        slack: true,
                                        teams: true,
                                        zapier: true,
                                        webhooks: true,
                                        customApi: true,
                                        ssoProviders: ["okta", "azure", "google"],
                                        paymentGateways: ["stripe", "paypal"],
                                        analyticsTools: ["google", "mixpanel"],
                                        monitoringTools: ["datadog", "newrelic"],
                                        communicationTools: ["twilio", "sendgrid"],
                                        storageProviders: ["aws", "azure", "gcp"],
                                        databaseConnectors: ["postgresql", "mysql", "mongodb"],
                                        cacheProviders: ["redis", "memcached"],
                                        searchEngines: ["elasticsearch", "solr"],
                                        messagingQueues: ["rabbitmq", "kafka"],
                                        containerization: ["docker", "kubernetes"],
                                        cicdPipelines: ["jenkins", "github-actions"],
                                        versionControl: ["git", "svn"],
                                        projectManagement: ["jira", "asana"],
                                        documentationTools: ["confluence", "notion"],
                                        designTools: ["figma", "sketch"],
                                        testingFrameworks: ["selenium", "cypress"],
                                        performanceMonitoring: ["lighthouse", "gtmetrix"],
                                        securityScanning: ["snyk", "veracode"],
                                        dependencyManagement: ["npm", "yarn", "pip"],
                                        cloudServices: {
                                            compute: ["ec2", "azure-vm", "gce"],
                                            storage: ["s3", "blob-storage", "cloud-storage"],
                                            databases: ["rds", "cosmos-db", "cloud-sql"],
                                            networking: ["vpc", "vnet", "vpc"],
                                            security: ["iam", "key-vault", "secret-manager"],
                                            monitoring: ["cloudwatch", "azure-monitor", "stackdriver"],
                                            serverless: ["lambda", "functions", "cloud-functions"],
                                            containers: ["ecs", "aci", "gke"],
                                            cdn: ["cloudfront", "azure-cdn", "cloud-cdn"],
                                            loadBalancing: ["elb", "azure-lb", "cloud-lb"]
                                        }
                                    },
                                    quotas: {
                                        apiCallsPerMonth: 1000000,
                                        storageGb: 1000,
                                        bandwidthGb: 10000,
                                        users: 500,
                                        projects: 100,
                                        customFields: 1000,
                                        automations: 200,
                                        webhooks: 50,
                                        integrations: 25,
                                        reportHistory: 24,
                                        supportTickets: "unlimited",
                                        responseTime: "1 hour",
                                        uptime: "99.9%",
                                        dataRetention: "unlimited",
                                        exportFrequency: "daily",
                                        concurrentConnections: 1000,
                                        rateLimits: {
                                            read: 10000,
                                            write: 1000,
                                            bulk: 100
                                        },
                                        cacheEnabled: true
                                    }
                                }
                            },
                            permissions: ["read", "write", "admin", "billing", "analytics"]
                        }
                    ]}
                    variant="list"
                />
            </Card>
        </Container>

        {/* TreeView Component Demo */}
            <Card layout="flex" justify="around" align="center" width="70%" gap="md">
                <Container width="100%" layout="flex-column" align="end" gap="sm">
                    <Typography as="h2" color="primary">TreeView Component</Typography>
                    <Typography as="p" color="muted">
                        Hierarchical data visualization with expand/collapse, selection, search, and genie integration.
                    </Typography>
                </Container>

                    {/* Basic TreeView */}
                    <Card>
                        <Typography as="h3" color="secondary">Basic TreeView</Typography>
                        <Typography as="p" size="sm" color="muted">
                            Standard tree with icons, controlled expansion and selection.
                        </Typography>
                        <TreeView
                            variant="primary"
                            theme="vibrant"
                            data={treeViewData}
                            expandedNodes={treeViewExpanded}
                            selectedNodes={treeViewSelected}
                            onNodeExpand={handleTreeViewExpand}
                            onNodeSelect={handleTreeViewSelect}
                            showIcons={true}
                            size="default"
                            getNodeGenie={(node, nodeState) => ({
                                content: (
                                    <Container layout="flex-column" gap="sm" width="200px">
                                        <Typography as="h5" size="sm" weight="semibold">
                                            {node.label}
                                        </Typography>
                                        <Container layout="flex-column" gap="xs">
                                            <Button size="small" width="100%">
                                                <Icon name="FiEye" size="xs" /> View
                                            </Button>
                                            <Button size="small" width="100%" variant="secondary">
                                                <Icon name="FiInfo" size="xs" /> Details
                                            </Button>
                                            {nodeState.hasChildren && (
                                                <Button size="small" width="100%" variant="secondary">
                                                    <Icon name="FiFolder" size="xs" /> Open Folder
                                                </Button>
                                            )}
                                        </Container>
                                        <Typography as="small" size="xs" color="muted">
                                            Click to interact with {node.label}
                                        </Typography>
                                    </Container>
                                ),
                                trigger: 'click',
                                variant: 'popover'
                            })}
                        />
                    </Card>

                    {/* Small TreeView with Search */}
                    <Card>
                        <Typography as="h3" color="secondary">Small with Search</Typography>
                        <Typography as="p" size="sm" color="muted">
                            Small size with search filtering and connectors.
                        </Typography>
                        <Container layout="flex-column" gap="sm">
                            <Input
                                placeholder="Search nodes..."
                                value={treeViewSearch}
                                onChange={(e) => setTreeViewSearch(e.target.value)}
                                size="small"
                            />
                            <TreeView
                                data={treeViewData}
                                searchValue={treeViewSearch}
                                variant="tertiary"
                                size="small"
                                showConnectors={true}
                                multiSelect={true}
                                defaultExpanded={['Documents', 'Images']}
                                defaultSelected={[]}
                                getNodeGenie={(node, nodeState) => ({
                                    content: (
                                        <Container layout="flex-column" gap="sm" width="180px">
                                            <Typography as="h5" size="sm" weight="semibold">
                                                {node.label}
                                            </Typography>
                                            <Container layout="flex-column" gap="xs">
                                                <Button size="small" width="100%" variant="secondary">
                                                    <Icon name="FiSearch" size="xs" /> Search in {node.label}
                                                </Button>
                                                <Button size="small" width="100%" variant="secondary">
                                                    <Icon name="FiBookmark" size="xs" /> Bookmark
                                                </Button>
                                            </Container>
                                            <Typography as="small" size="xs" color="muted">
                                                Small TreeView item actions
                                            </Typography>
                                        </Container>
                                    ),
                                    trigger: 'click',
                                    variant: 'popover'
                                })}
                            />
                        </Container>
                    </Card>

                    {/* Secondary Background TreeView */}
                    <Card>
                        <Typography as="h3" color="secondary">Secondary Background</Typography>
                        <Typography as="p" size="sm" color="muted">
                            TreeView with secondary background color.
                        </Typography>
                        <TreeView
                            data={treeViewData}
                            variant="secondary"
                            size="default"
                            defaultExpanded={['Documents']}
                            getNodeGenie={(node, nodeState) => ({
                                content: (
                                    <Container layout="flex-column" gap="sm" width="200px">
                                        <Typography as="h5" size="sm" weight="semibold" color="primary">
                                            {node.label}
                                        </Typography>
                                        <Container layout="flex-column" gap="xs">
                                            <Button size="small" width="100%" variant="primary">
                                                <Icon name="FiPlay" size="xs" /> Quick Action
                                            </Button>
                                            <Button size="small" width="100%" variant="tertiary">
                                                <Icon name="FiSettings" size="xs" /> Configure
                                            </Button>
                                        </Container>
                                        <Typography as="small" size="xs" color="muted">
                                            Primary theme actions
                                        </Typography>
                                    </Container>
                                ),
                                trigger: 'click',
                                variant: 'popover'
                            })}
                        />
                    </Card>

                    {/* Large TreeView with Custom Rendering */}
                    <Card>
                        <Typography as="h3" color="secondary">Custom Node Rendering</Typography>
                        <Typography as="p" size="sm" color="muted">
                            Large size with custom node content rendering and badges. (No variant applied)
                        </Typography>
                        <TreeView
                            data={treeViewData}
                            size="large"
                            variant="background"
                            defaultExpanded={['Documents', 'Documents/Projects', 'Images']}
                            renderNodeContent={(node, { isSelected, level }) => (
                                <Container layout="flex" align="center" gap="sm">
                                    <Typography 
                                        as="span" 
                                        weight={isSelected ? "semibold" : "normal"}
                                        color={node.disabled ? "muted" : "default"}
                                    >
                                        {node.label}
                                    </Typography>
                                    {node.children && (
                                        <Badge 
                                            variant="tertiary" 
                                            size="small"
                                        >
                                            {node.children.length}
                                        </Badge>
                                    )}
                                    {node.disabled && (
                                        <Badge variant="warning" size="small">
                                            Disabled
                                        </Badge>
                                    )}
                                    {node.metadata?.size && (
                                        <Badge variant="secondary" size="small">
                                            {Math.round(node.metadata.size / 1024)}KB
                                        </Badge>
                                    )}
                                </Container>
                            )}
                        />
                    </Card>

                    {/* Navigation TreeView - Non-File Data with Custom Icons */}
                    <Card>
                        <Typography as="h3" color="secondary">Navigation TreeView</Typography>
                        <Typography as="p" size="sm" color="muted">
                            TreeView for navigation/organization with custom icons (non-file data).
                        </Typography>
                        <TreeView
                            data={navigationTreeData}
                            expandedNodes={navTreeExpanded}
                            selectedNodes={navTreeSelected}
                            onNodeExpand={handleNavTreeExpand}
                            onNodeSelect={handleNavTreeSelect}
                            showIcons={true}
                            variant="secondary"
                            size="default"
                            iconSize="lg"
                            renderNodeContent={(node, { isSelected }) => (
                                <Container layout="flex" align="center" gap="sm">
                                    <Typography 
                                        as="span" 
                                        weight={isSelected ? "semibold" : "normal"}
                                    >
                                        {node.metadata?.item?.label || node.label}
                                    </Typography>
                                    {node.metadata?.item?.route && (
                                        <Badge variant="tertiary" size="small">
                                            {node.metadata.item.route}
                                        </Badge>
                                    )}
                                    {node.metadata?.item?.description && (
                                        <Typography as="small" size="xs" color="muted">
                                            {node.metadata.item.description}
                                        </Typography>
                                    )}
                                </Container>
                            )}
                        />
                    </Card>

                    {/* Flexible API Integration Examples */}
                    <Card>
                        <Typography as="h3" color="secondary">Icon Mapping Examples</Typography>
                        <Typography as="p" size="sm" color="muted">
                            Examples of using TreeView with iconMapping for custom icon overrides on different data structures.
                        </Typography>
                        
                        <Container layout="flex" gap="md">
                            {/* Example 1: Simple API with iconMapping override */}
                            <Container layout="flex-column" gap="xs">
                                <Typography as="h4" size="sm" color="tertiary">Simple API with Icon Overrides</Typography>
                                <TreeView
                                    data={simpleApiData}
                                    iconMapping={{
                                        // Override specific nodes
                                        'dashboard': 'FiStar',
                                        'users': 'FiShield',
                                        // Pattern-based overrides
                                        '*/overview': 'FiEye',
                                        '*/reports': 'FiPieChart'
                                    }}
                                    expandedNodes={flexibleTreeExpanded}
                                    selectedNodes={flexibleTreeSelected}
                                    onNodeExpand={handleFlexibleTreeExpand}
                                    onNodeSelect={handleFlexibleTreeSelect}
                                    variant="tertiary"
                                    size="small"
                                />
                            </Container>

                            {/* Example 2: Different API Structure */}
                            <Container layout="flex-column" gap="xs">
                                <Typography as="h4" size="sm" color="tertiary">Different API Structure</Typography>
                                <TreeView
                                    data={alternateApiData}
                                    iconMapping={{
                                        'products': 'FiFolder',
                                        'products/electronics': 'FiPackage',
                                        'products/clothing': 'FiPackage'
                                    }}
                                    variant="primary"
                                    defaultExpanded={['products']}
                                />
                            </Container>

                            {/* Example 3: CMS-style API with status indicators */}
                            <Container layout="flex-column" gap="xs">
                                <Typography as="h4" size="sm" color="tertiary">CMS API with Status</Typography>
                                <TreeView
                                    data={cmsApiData}
                                    iconMapping={{
                                        'content': 'FiFolder',
                                        'content/pages': 'FiFolder',
                                        'content/posts': 'FiFolder',
                                        'content/pages/home': 'FiFile',
                                        'content/pages/about': 'FiFile',
                                        'content/posts/welcome': 'FiEdit',
                                        'content/posts/news': 'FiEdit'
                                    }}
                                    variant="secondary"
                                    defaultExpanded={['content', 'content/pages']}
                                />
                            </Container>
                        </Container>
                    </Card>

                    {/* TreeView with Genie Integration */}
                    <Card>
                        <Typography as="h3" color="secondary">TreeView with Genie Integration</Typography>
                        <Typography as="p" size="sm" color="muted">
                            TreeView nodes with built-in Genie support for floating content. Uses auto-positioning based on viewport quadrants.
                        </Typography>
                        
                        <Container layout="flex" gap="lg">
                            {/* Context Menu Genie Example */}
                            <Container layout="flex-column" gap="xs" width="48%">
                                <Typography as="h4" size="sm" color="tertiary">Context Menu Genie (Right-click)</Typography>
                                <TreeView
                                    data={treeViewData}
                                    getNodeGenie={(node, nodeState) => ({
                                        content: (
                                            <Container layout="flex-column" gap="sm" width="200px">
                                                <Typography as="h5" size="sm" weight="semibold">
                                                    {node.label}
                                                </Typography>
                                                <Container layout="flex-column" gap="xs">
                                                    <Button size="small" width="100%">
                                                        <Icon name="FiEdit" size="xs" /> Edit
                                                    </Button>
                                                    <Button size="small" width="100%" variant="secondary">
                                                        <Icon name="FiCopy" size="xs" /> Copy
                                                    </Button>
                                                    <Button size="small" width="100%" variant="secondary">
                                                        <Icon name="FiTrash2" size="xs" /> Delete
                                                    </Button>
                                                </Container>
                                                {nodeState.hasChildren && (
                                                    <Container>
                                                        <Typography as="small" size="xs" color="muted">
                                                            Contains {node.children?.length} items
                                                        </Typography>
                                                    </Container>
                                                )}
                                            </Container>
                                        ),
                                        trigger: 'contextmenu',
                                        variant: 'menu'
                                    })}
                                    size="default"
                                    defaultExpanded={['Documents', 'Images']}
                                    onGenieShow={(node, config) => console.log('Genie shown for:', node.label)}
                                    onGenieHide={(node, config) => console.log('Genie hidden for:', node.label)}
                                />
                            </Container>

                            {/* Click Genie with Per-node Configuration */}
                            <Container layout="flex-column" gap="xs" width="48%">
                                <Typography as="h4" size="sm" color="tertiary">Click Genie with Node Details</Typography>
                                <TreeView
                                    data={treeViewData}
                                    getNodeGenie={(node, nodeState) => {
                                        // Show different content based on node type
                                        if (node.metadata?.type === 'directory') {
                                            return {
                                                content: (
                                                    <Container layout="flex-column" gap="sm" width="250px">
                                                        <Typography as="h5" size="sm" weight="semibold">
                                                            📁 {node.label}
                                                        </Typography>
                                                        <Typography as="p" size="sm" color="muted">
                                                            Directory with {node.children?.length || 0} items
                                                        </Typography>
                                                        <Container layout="flex" gap="xs">
                                                            <Badge variant="tertiary" size="small">Directory</Badge>
                                                            {nodeState.isExpanded && (
                                                                <Badge variant="success" size="small">Expanded</Badge>
                                                            )}
                                                        </Container>
                                                        {node.metadata?.item?.parentPath && (
                                                            <Typography as="small" size="xs" color="muted">
                                                                Path: {node.metadata.item.parentPath}
                                                            </Typography>
                                                        )}
                                                    </Container>
                                                ),
                                                trigger: 'click',
                                                variant: 'popover'
                                            };
                                        } else {
                                            return {
                                                content: (
                                                    <Container layout="flex-column" gap="sm" width="280px">
                                                        <Typography as="h5" size="sm" weight="semibold">
                                                            📄 {node.label}
                                                        </Typography>
                                                        <Container layout="flex-column" gap="xs">
                                                            <Typography as="p" size="sm">
                                                                <strong>Type:</strong> {node.metadata?.type || 'file'}
                                                            </Typography>
                                                            {node.metadata?.size && (
                                                                <Typography as="p" size="sm">
                                                                    <strong>Size:</strong> {Math.round(node.metadata.size / 1024)}KB
                                                                </Typography>
                                                            )}
                                                            {node.metadata?.item?.createdAt && (
                                                                <Typography as="p" size="sm">
                                                                    <strong>Created:</strong> {new Date(node.metadata.item.createdAt).toLocaleDateString()}
                                                                </Typography>
                                                            )}
                                                        </Container>
                                                        <Container layout="flex" gap="xs">
                                                            <Badge variant="secondary" size="small">File</Badge>
                                                            {nodeState.isSelected && (
                                                                <Badge variant="primary" size="small">Selected</Badge>
                                                            )}
                                                        </Container>
                                                    </Container>
                                                ),
                                                trigger: 'click',
                                                variant: 'tooltip'
                                            };
                                        }
                                    }}
                                    size="default"
                                    defaultExpanded={['Documents']}
                                />
                            </Container>
                        </Container>

                        <Container layout="flex" gap="lg" marginTop="lg">
                            {/* Hover Genie Example */}
                            <Container layout="flex-column" gap="xs" width="48%">
                                <Typography as="h4" size="sm" color="tertiary">Hover Genie (Quick Preview)</Typography>
                                <TreeView
                                    data={navigationTreeData}
                                    getNodeGenie={(node, nodeState) => ({
                                        content: (
                                            <Container layout="flex-column" gap="sm" width="220px">
                                                <Typography as="h5" size="sm" weight="semibold">
                                                    {node.metadata?.item?.label || node.label}
                                                </Typography>
                                                {node.metadata?.item?.description && (
                                                    <Typography as="p" size="sm" color="muted">
                                                        {node.metadata.item.description}
                                                    </Typography>
                                                )}
                                                {node.metadata?.item?.route && (
                                                    <Container>
                                                        <Badge variant="tertiary" size="small">
                                                            {node.metadata.item.route}
                                                        </Badge>
                                                    </Container>
                                                )}
                                                <Typography as="small" size="xs" color="muted">
                                                    Level: {nodeState.level} | {nodeState.hasChildren ? 'Has children' : 'Leaf node'}
                                                </Typography>
                                            </Container>
                                        ),
                                        trigger: 'hover',
                                        variant: 'tooltip'
                                    })}
                                    size="default"
                                    defaultExpanded={['dashboard', 'user-management']}
                                />
                            </Container>
                        </Container>
                    </Card>
            </Card>

            {/* Data Component Selector Demo */}
            <Card width="75%" layout="flex-column" gap="lg">
                <Container>
                    <Typography as="h2" color="primary">Data Component with Selector</Typography>
                    <Typography as="p" color="muted">
                        Data component with checkbox selection functionality across all variants (table, cards, list)
                    </Typography>
                </Container>

                {/* Sample data with selection demo */}
                <Card layout="flex-column" gap="md">
                    <Typography as="h3" color="secondary">Selection Demo - Internal State</Typography>
                    <Typography as="p" color="muted" size="sm">
                        Each Data component manages its own selection state internally. No external state management required!
                    </Typography>

                    {/* Table Variant with Selector */}
                    <Typography as="h4" color="tertiary" marginTop="md">Table with Selection</Typography>
                    <Data
                        data={sampleUsersData}
                        variant="table"
                        selector={true}
                        theme="modern"
                        sortable={true}
                        exclude={['id']}
                    />

                    {/* Cards Variant with Selector */}
                    <Typography as="h4" color="tertiary" marginTop="lg">Cards with Selection</Typography>
                    <Data
                        data={sampleUsersData.slice(0, 4)}
                        variant="cards"
                        selector={true}
                        theme="vibrant"
                        exclude={['id', 'lastLogin']}
                    />

                    {/* List Variant with Selector */}
                    <Typography as="h4" color="tertiary" marginTop="lg">List with Selection</Typography>
                    <Data
                        data={sampleUsersData.slice(0, 3)}
                        variant="list"
                        selector={true}
                        theme="admin"
                        exclude={['id', 'department', 'lastLogin']}
                    />

                    {/* Feature Information */}
                    <Card backgroundColor="tertiary" padding="md" marginTop="lg">
                        <Typography as="h4" color="contrast" weight="medium">
                            Selector Features
                        </Typography>
                        <Container layout="grid" columns={2} gap="md" marginTop="sm">
                            <Container layout="flex-column" gap="xs">
                                <Typography color="contrast" size="sm" weight="medium">Basic Functionality</Typography>
                                <Typography color="contrast" size="sm">
                                    • Individual item selection<br/>
                                    • Select all / clear all<br/>
                                    • Indeterminate state support<br/>
                                    • Works across all variants<br/>
                                    • Internal state management
                                </Typography>
                            </Container>
                            <Container layout="flex-column" gap="xs">
                                <Typography color="contrast" size="sm" weight="medium">Advanced Features</Typography>
                                <Typography color="contrast" size="sm">
                                    • Optional controlled mode<br/>
                                    • Optional selection callbacks<br/>
                                    • Persistent selection across pages<br/>
                                    • Optimized performance (O(1) lookups)<br/>
                                    • Simple API - just add selector={true}
                                </Typography>
                            </Container>
                        </Container>
                    </Card>
                </Card>
            </Card>

            {/* Editor Component Section */}
            <Card  width="75%" layout="flex" justify="around" gap="lg">
                <Container width="100%" justify="center">
                <Typography as="h2" color="primary">Editor Component</Typography>
                <Typography as="p" color="muted">
                    MDX Editor with comprehensive markdown editing capabilities and theme integration
                </Typography>
                </Container>
                {/* Full Featured Editor */}
                <Card layout="flex-column" gap="none" padding="none">
                    <Container padding="sm">
                        <Typography weight="medium">
                            Full Featured Editor - All Plugins Enabled
                        </Typography>
                    </Container>
                    
                    <Editor
                        theme="minimal"
                        content=""
                        placeholder="Start writing with all features available..."
                    />
                </Card>

                {/* Minimal Editor (No Toolbar) */}
                <Card layout="flex-column" gap="none" padding="none">
                    <Container padding="sm">
                        <Typography weight="medium">
                            Minimal Editor - No Toolbar
                        </Typography>
                    </Container>
                    
                    <Editor
                        placeholder="Clean editor without toolbar..."
                        showToolbar={false}
                    />
                </Card>

                {/* Read-Only Editor */}
                <Card layout="flex-column" gap="none" padding="none">
                    <Container padding="sm">
                        <Typography weight="medium">
                            Read-Only Editor - Preview Mode
                        </Typography>
                    </Container>
                    
                    <Editor
                        content="# Read-Only Demo

This content cannot be edited.

**Bold text** and *italic text* work.

- List item 1
- List item 2"
                        readOnly={true}
                    />
                </Card>

                {/* Code-Focused Editor */}
                <Card layout="flex-column" gap="none" padding="none">
                    <Container padding="sm">
                        <Typography weight="medium">
                            Code-Focused Editor - Pre-loaded with Code Examples
                        </Typography>
                    </Container>
                    
                    <Editor
                        content="# Simple Code Demo

Here's a basic example:

```js
function hello() {
  console.log('Hello World!');
}
```

Try editing this content!"
                    />
                </Card>

                {/* Table-Focused Editor */}
                <Card layout="flex-column" gap="none" padding="none">
                    <Container padding="sm">
                        <Typography weight="medium">
                            Table Editor - Pre-loaded with Table Examples
                        </Typography>
                    </Container>
                    
                    <Editor
                        theme="admin"
                        content={`# Table Demo

| Product | Price | Stock | Category |
|---------|-------|-------|----------|
| Laptop | $999 | 15 | Electronics |
| Phone | $599 | 32 | Electronics |
| Book | $19 | 100 | Education |
| Headphones | $149 | 8 | Electronics |

Edit the table by clicking on any cell! You can:

- Add new rows and columns
- Delete rows and columns  
- Sort by clicking headers
- Resize columns

| Name | Age | City | Occupation |
|------|-----|------|------------|
| Alice | 28 | New York | Designer |
| Bob | 34 | San Francisco | Developer |
| Carol | 25 | Chicago | Writer |

Try creating your own table using the toolbar!`}
                    />
                </Card>
                
                {/* Feature Information */}
                <Card layout="flex-column" gap="md">
                    <Typography as="h3" size="lg" weight="semibold">
                        Editor Features (All Enabled)
                    </Typography>
                    
                    <Container layout="grid" columns={3} gap="md">
                        <Container layout="flex-column" gap="sm">
                            <Typography weight="semibold" size="sm">Rich Text Features</Typography>
                            <Typography size="sm" color="muted">
                                • Bold, italic, underline formatting<br/>
                                • Headings (H1-H6)<br/>
                                • Lists (ordered, unordered, tasks)<br/>
                                • Blockquotes and inline code<br/>
                                • Markdown shortcuts
                            </Typography>
                        </Container>
                        
                        <Container layout="flex-column" gap="sm">
                            <Typography weight="semibold" size="sm">Advanced Features</Typography>
                            <Typography size="sm" color="muted">
                                • Tables with live editing<br/>
                                • Code blocks with syntax highlighting<br/>
                                • Image insertion and management<br/>
                                • Link creation and editing<br/>
                                • Front-matter support
                            </Typography>
                        </Container>
                        
                        <Container layout="flex-column" gap="sm">
                            <Typography weight="semibold" size="sm">Integration Features</Typography>
                            <Typography size="sm" color="muted">
                                • Full theme system integration<br/>
                                • Diff/source view toggle<br/>
                                • Responsive design<br/>
                                • Thematic breaks (HR)<br/>
                                • Complete toolbar access
                            </Typography>
                        </Container>
                    </Container>

                    <Container layout="flex-column" gap="xs">
                        <Typography weight="semibold" size="sm">Available Code Languages</Typography>
                        <Typography size="sm" color="muted">
                            JavaScript, TypeScript, CSS, HTML, JSON, Markdown, Python, SQL, Bash, and more
                        </Typography>
                    </Container>
                </Card>
            </Card>

            {/* Page-level FloatingActionButton with Theme Controls */}
            <FloatingActionButton
                position="bottom-right"
                variant="primary"
                theme="admin"
                draggable="true"
                genie={{
                    content: (
                        <Container gap="sm">
                            <Typography as="h4" color="primary">
                                Choose your desired theme
                            </Typography>
                            
                            {/* Theme Selection Buttons */}
                            <Container layout="flex-column" align="stretch" gap="xs">
                                {availableThemes.map((theme) => (
                                    <Button
                                        key={theme}
                                        variant={currentTheme === theme ? "primary" : "ghost"}
                                        size="small"
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
                                            <Badge variant="success" size="sm">Active</Badge>
                                        )}
                                    </Button>
                                ))}
                            </Container>
                        </Container>
                    )
                }}
                icon="FaPaintBrush" />
    </Page>
    );
};

export default ComponentDemo;
