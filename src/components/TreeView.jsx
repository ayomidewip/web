import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectiveTheme, useTheme } from '@contexts/ThemeContext';
import { Icon } from './Icon';
import { useGeniePortal } from './Genie';

/**
 * Generic icon mapping for tree nodes - only handles basic fallbacks
 */
const getDefaultIcon = (hasChildren = false) => {
    return hasChildren ? 'FiFolder' : 'FiFile';
};

/**
 * Convert hierarchical data to TreeView format
 */
const convertHierarchicalData = (data, parentPath = '', iconMapping = {}) => {
    if (!data || typeof data !== 'object') {
        console.warn('TreeView: Invalid data format for conversion:', data);
        return [];
    }

    const result = [];

    Object.entries(data).forEach(([name, node]) => {
        // Expect standardized node data from the consumer
        const filePath = node.filePath || node.id || `${parentPath}/${name}`;
        const displayName = node.fileName || node.label || name;

        // Use provided icon or calculate based on children (purely generic)
        const hasChildren = node.children && Object.keys(node.children).length > 0;
        const defaultIcon = node.icon || getDefaultIcon(hasChildren);

        // Apply custom icon mapping if provided
        const finalIcon = iconMapping[filePath] ||
            (typeof iconMapping[name] === 'function' ? iconMapping[name](node, filePath) : iconMapping[name]) ||
            defaultIcon;

        const treeNode = {
            id: filePath,
            label: displayName,
            icon: finalIcon,
            disabled: node.disabled || false,
            metadata: {
                type: node.type,
                item: node.item || node,
                originalData: node,
                filePath,
                size: node.size || node.item?.size,
                createdAt: node.createdAt || node.item?.createdAt,
                updatedAt: node.updatedAt || node.item?.updatedAt,
                parentPath: node.parentPath || parentPath,
                depth: node.depth || (filePath === '/' ? 0 : filePath.split('/').length - 1)
            }
        };

        // Add children if they exist
        if (node.children && Object.keys(node.children).length > 0) {
            treeNode.children = convertHierarchicalData(node.children, filePath, iconMapping);
        }

        result.push(treeNode);
    });

    // Sort directories first, then files
    return result.sort((a, b) => {
        const aIsDir = a.metadata.type === 'directory';
        const bIsDir = b.metadata.type === 'directory';

        if (aIsDir !== bIsDir) {
            return aIsDir ? -1 : 1;
        }
        return a.label.localeCompare(b.label);
    });
};

/**
 * TreeView - Generic tree rendering component
 *
 * Displays hierarchical data in an expandable tree structure.
 * Expects pre-processed data with standardized structure.
 * Pure presentation component - no business logic or data fetching.
 *
 * Key Features:
 * - Generic tree rendering for any hierarchical data
 * - Automatic conversion from object to array format
 * - Icon mapping based on node types
 * - Genie integration for interactive elements
 * - Theme inheritance support
 * - Standard component props (marginTop, marginBottom, justifySelf)
 * - Expandable/collapsible nodes with customizable icons
 * - Search and filtering capabilities
 * - Drag and drop support
 * - Custom node rendering
 *
 * Expected data format:
 * {
 *   "item1": {
 *     "type": "directory",
 *     "filePath": "/path/to/item1",
 *     "fileName": "item1",
 *     "children": { ... nested structure ... }
 *   },
 *   "item2": {
 *     "type": "binary",
 *     "filePath": "/path/to/item2",
 *     "fileName": "item2"
 *   }
 * }
 *
 * Genie Configuration Format:
 * getNodeGenie can return:
 * - JSX content (legacy support)
 * - Object with { content, trigger?, variant?, position?, width?, height?, ... }
 * - null for no genie on that node
 */

/**
 * TreeNode - Individual tree node component with Genie integration
 * Uses direct Genie integration with automatic theme inheritance
 *
 * Moved outside TreeView to prevent re-creation on every render
 */
const TreeNode = React.memo(({
                                 node,
                                 level,
                                 nodeState,
                                 genieConfig,
                                 treeConfig,
                                 onNodeSelect,
                                 onNodeExpand,
                                 onNodeDoubleClick,
                                 onNodeRightClick,
                                 onNodeDrop,
                                 handleDragStart,
                                 handleDragOver,
                                 onGenieShow,
                                 onGenieHide
                             }) => {
    const nodeRef = useRef(null);

    const {isExpanded, isSelected, hasChildren, isDisabled} = nodeState;
    const {
        showIcons, expandIcon, collapseIcon, leafIcon, nodeIcon, indentPixels,
        allowDragDrop, renderNode, renderNodeContent, resolvedIconSize, variant
    } = treeConfig;

    // Genie integration using simplified portal hook
    const {triggerProps, GeniePortal, handleShow} = useGeniePortal(
        genieConfig,
        nodeRef,
        () => onGenieShow?.(node, genieConfig),
        () => onGenieHide?.(node, genieConfig)
    );

    // Use appropriate props based on whether there's a Genie
    const finalProps = useMemo(() => {
        if (!genieConfig) {
            // No Genie - just handle node selection
            return {
                onClick: (event) => {
                    if (!isDisabled && onNodeSelect) {
                        onNodeSelect(node.id, node, event);
                    }
                }
            };
        }

        // Genies should only use contextmenu - use triggerProps and add onClick for node selection
        return {
            ...triggerProps,
            onClick: (event) => {
                if (!isDisabled && onNodeSelect) {
                    onNodeSelect(node.id, node, event);
                }
            }
        };
    }, [genieConfig, triggerProps, isDisabled, onNodeSelect, node]);

    const nodeClasses = [
        'tree-node',
        isSelected && 'tree-node-selected',
        isDisabled && 'tree-node-disabled',
        hasChildren && 'tree-node-parent',
        !hasChildren && 'tree-node-leaf',
        `tree-node-level-${level}`
    ].filter(Boolean).join(' ');

    const handleExpandClick = useCallback((event) => {
        event.stopPropagation();
        if (hasChildren && !isDisabled && onNodeExpand) {
            onNodeExpand(node.id, event);
        }
    }, [hasChildren, isDisabled, onNodeExpand, node.id]);

    return (
        <div className={nodeClasses}>
            <div
                ref={nodeRef}
                className={`tree-node-content ${genieConfig ? 'genie-trigger' : ''}`}
                style={{paddingLeft: `${level * indentPixels}px`}}
                data-theme={treeConfig.theme}
                {...finalProps}
                onDoubleClick={onNodeDoubleClick ? (e) => onNodeDoubleClick(node, e) : undefined}
                draggable={allowDragDrop && !isDisabled}
                onDragStart={allowDragDrop ? (e) => handleDragStart(e, node) : undefined}
                onDragOver={allowDragDrop ? handleDragOver : undefined}
                onDrop={allowDragDrop ? (e) => onNodeDrop && onNodeDrop(e, node) : undefined}
            >
                {/* Expand/Collapse Icon */}
                {hasChildren && showIcons && (
                    <button
                        className="tree-node-toggle"
                        onClick={handleExpandClick}
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={isDisabled}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        <Icon
                            name={isExpanded ? collapseIcon : expandIcon}
                            size={resolvedIconSize}
                        />
                    </button>
                )}

                {/* Node Icon */}
                {showIcons && (
                    <span className="tree-node-icon">
            <Icon
                name={nodeIcon ? nodeIcon(node) : (node.icon || (hasChildren ? 'FiFolder' : leafIcon || 'FiFile'))}
                size={resolvedIconSize}
            />
          </span>
                )}

                {/* Node Content */}
                <div className="tree-node-label">
                    {renderNode
                        ? renderNode(node, {isExpanded, isSelected, level})
                        : (renderNodeContent
                            ? renderNodeContent(node, {isExpanded, isSelected, level})
                            : node.label || node.id)
                    }
                </div>
            </div>

            {/* Genie Integration using Portal (like Button and Container) */}
            {GeniePortal}
        </div>
    );
});

TreeNode.displayName = 'TreeNode';

export const TreeView = forwardRef(({
                                        // Core TreeView props
                                        data = null, // Server data object in nested format (automatically converted to tree structure)
                                        iconMapping = {}, // Custom icon overrides: { 'node-id': 'FiCustomIcon', 'pattern': 'FiIcon' }
                                        children = null, // Optional children content (rendered after tree)
                                        className = '',
                                        variant = 'default', // Background variant: 'default' (surface), 'primary', 'secondary', 'tertiary', 'background'
                                        size = 'default', // 'small', 'default', 'large' - controls typography and icon sizes
                                        iconSize = null, // Override icon size if needed: 'xs', 'sm', 'md', 'lg', 'xl', '2xl' (defaults based on size prop)

                                        // Tree behavior props
                                        showIcons = true, // Whether to show expand/collapse icons
                                        showConnectors = false, // Whether to show connecting lines between nodes
                                        expandedNodes = null, // Array of expanded node IDs, null for uncontrolled
                                        selectedNodes = null, // Array of selected node IDs, null for uncontrolled
                                        multiSelect = false, // Whether multiple nodes can be selected
                                        defaultExpanded = [], // Default expanded nodes for uncontrolled mode
                                        defaultSelected = [], // Default selected nodes for uncontrolled mode
                                        expandIcon = 'FiChevronRight', // Icon for collapsed nodes
                                        collapseIcon = 'FiChevronDown', // Icon for expanded nodes
                                        leafIcon = null, // Icon for leaf nodes (no children)
                                        nodeIcon = null, // Default icon for all nodes
                                        indentSize = 'md', // 'sm', 'md', 'lg' - indentation per level
                                        maxDepth = null, // Maximum depth to render
                                        searchValue = '', // Search filter value
                                        searchProperty = 'label', // Property to search in
                                        caseSensitive = false, // Whether search is case sensitive
                                        allowDragDrop = false, // Whether to allow drag and drop

                                        // Event callbacks
                                        onNodeExpand = null, // Callback: (nodeId, isExpanded) => void
                                        onNodeSelect = null, // Callback: (nodeId, isSelected, selectedNodes) => void
                                        onNodeClick = null, // Callback: (node, event) => void
                                        onNodeDoubleClick = null, // Callback: (node, event) => void
                                        onNodeRightClick = null, // Callback: (node, event) => void
                                        onNodeDrop = null, // Callback: (draggedNode, targetNode, position) => void

                                        // Custom renderers
                                        renderNode = null, // Custom node renderer: (node, { isExpanded, isSelected, level }) => JSX
                                        renderNodeContent = null, // Custom content renderer: (node, { isExpanded, isSelected, level }) => JSX

                                        // Genie integration props (following Container/FAB pattern)
                                        getNodeGenie = null, // Per-node genie function: (node, nodeState) => { content, trigger?, variant?, position?, ...genieProps } | JSX | null
                                        onGenieShow = null, // Callback when any node genie shows: (node, genieConfig) => void
                                        onGenieHide = null, // Callback when any node genie hides: (node, genieConfig) => void

                                        // Standard component props (following pattern)
                                        theme = null, // Optional theme override
                                        marginTop = null, // Margin top: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
                                        marginBottom = null, // Margin bottom: 'none', 'xs', 'sm', 'md', 'lg', 'xl' or custom value
                                        justifySelf = null, // CSS justify-self property: 'auto', 'start', 'end', 'center', 'stretch'

                                        ...props
                                    }, ref) => {
    const {currentTheme: globalTheme} = useTheme();
    const effectiveTheme = useEffectiveTheme();

    // Use theme prop if provided, otherwise use effective theme from context
    const treeViewTheme = theme || effectiveTheme.currentTheme;

    // Helper function to convert indentSize to pixels
    const getIndentPixels = useCallback((sizeValue) => {
        const sizeMap = {
            'sm': 16,
            'md': 24,
            'lg': 32
        };
        return sizeMap[sizeValue] || 24; // Default to 'md' size
    }, []);

    // Helper function to convert margin props to CSS style (following pattern)
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

    // Convert hierarchical data to tree format
    const processedData = useMemo(() => {
        if (!data) {
            return [];
        }
        return convertHierarchicalData(data, '', iconMapping);
    }, [data, iconMapping]);

    // Internal state for controlled/uncontrolled mode
    const [internalExpanded, setInternalExpanded] = useState(new Set(defaultExpanded));
    const [internalSelected, setInternalSelected] = useState(new Set(defaultSelected));
    const [draggedNode, setDraggedNode] = useState(null);
    // Simplified: no central genie management needed

    // TreeView ref
    const treeViewRef = ref || useRef(null);

    // Determine if we're in controlled mode
    const isExpandedControlled = expandedNodes !== null;
    const isSelectedControlled = selectedNodes !== null;

    // Get current expanded/selected state
    const currentExpanded = isExpandedControlled ? new Set(expandedNodes) : internalExpanded;
    const currentSelected = isSelectedControlled ? new Set(selectedNodes) : internalSelected;

    // Build class names
    const backgroundClass = variant === 'default' ? 'tree-view-bg-surface' : `tree-view-bg-${variant}`;
    const sizeClass = size !== 'default' ? `tree-view-${size}` : '';

    const classes = [
        'tree-view',
        'themed-tree-view',
        backgroundClass,
        sizeClass,
        showConnectors && 'tree-view-connectors',
        allowDragDrop && 'tree-view-draggable',
        justifySelf && `justify-self-${justifySelf}`,
        `theme-${treeViewTheme}`,
        className
    ].filter(Boolean).join(' ');

    // Determine icon size based on size prop if not explicitly set
    const resolvedIconSize = iconSize || (
        size === 'small' ? 'sm' :
            size === 'large' ? 'lg' : 'md'
    );

    // Flatten tree for search functionality
    const flattenTree = useCallback((nodes, level = 0, parentPath = []) => {
        return nodes.reduce((acc, node) => {
            const currentPath = [...parentPath, node.id];
            acc.push({...node, level, path: currentPath});

            if (node.children && node.children.length > 0) {
                acc.push(...flattenTree(node.children, level + 1, currentPath));
            }

            return acc;
        }, []);
    }, []);

    // Filter nodes based on search
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return processedData;

        const flatNodes = flattenTree(processedData);
        const matchingNodes = flatNodes.filter(node => {
            const searchText = caseSensitive ? searchValue : searchValue.toLowerCase();
            const nodeText = caseSensitive ? node[searchProperty] : node[searchProperty]?.toLowerCase();
            return nodeText?.includes(searchText);
        });

        // Include parent nodes of matching nodes
        const includedPaths = new Set();
        matchingNodes.forEach(node => {
            node.path.forEach((nodeId, index) => {
                const pathToNode = node.path.slice(0, index + 1).join('.');
                includedPaths.add(pathToNode);
            });
        });

        // Rebuild tree structure with only included nodes
        const rebuildTree = (nodes, currentPath = []) => {
            return nodes.filter(node => {
                const nodePath = [...currentPath, node.id].join('.');
                return includedPaths.has(nodePath);
            }).map(node => {
                const nodePath = [...currentPath, node.id];

                if (node.children && node.children.length > 0) {
                    const filteredChildren = rebuildTree(node.children, nodePath);
                    return {...node, children: filteredChildren};
                }

                return node;
            });
        };

        return rebuildTree(processedData);
    }, [processedData, searchValue, searchProperty, caseSensitive, flattenTree]);

    // Handle node expansion
    const handleNodeExpand = useCallback((nodeId) => {
        const isCurrentlyExpanded = currentExpanded.has(nodeId);
        const newExpanded = new Set(currentExpanded);

        if (isCurrentlyExpanded) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }

        if (!isExpandedControlled) {
            setInternalExpanded(newExpanded);
        }

        if (onNodeExpand) {
            onNodeExpand(nodeId, !isCurrentlyExpanded);
        }
    }, [currentExpanded, isExpandedControlled, onNodeExpand]);

    // Handle node selection
    const handleNodeSelect = useCallback((nodeId, node, event) => {
        // Removed stopPropagation to allow event bubbling for Genie integration

        let newSelected = new Set(currentSelected);

        if (multiSelect && event && (event.ctrlKey || event.metaKey)) {
            // Multi-select with Ctrl/Cmd
            if (currentSelected.has(nodeId)) {
                newSelected.delete(nodeId);
            } else {
                newSelected.add(nodeId);
            }
        } else if (multiSelect && event && event.shiftKey && currentSelected.size > 0) {
            // Range selection with Shift
            // This would need more complex logic to handle range selection in tree
            // For now, just add to selection
            newSelected.add(nodeId);
        } else {
            // Single select or replace selection
            newSelected.clear();
            newSelected.add(nodeId);
        }

        if (!isSelectedControlled) {
            setInternalSelected(newSelected);
        }

        if (onNodeSelect) {
            onNodeSelect(nodeId, newSelected.has(nodeId), Array.from(newSelected));
        }

        if (onNodeClick) {
            onNodeClick(node, event);
        }
    }, [currentSelected, multiSelect, isSelectedControlled, onNodeSelect, onNodeClick]);

    // Handle drag start
    const handleDragStart = useCallback((event, node) => {
        if (!allowDragDrop) return;

        setDraggedNode(node);
        event.dataTransfer.setData('text/plain', node.id);
        event.dataTransfer.effectAllowed = 'move';
    }, [allowDragDrop]);

    // Handle drag over
    const handleDragOver = useCallback((event) => {
        if (!allowDragDrop || !draggedNode) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, [allowDragDrop, draggedNode]);

    // Handle drop
    const handleDrop = useCallback((event, targetNode) => {
        if (!allowDragDrop || !draggedNode || draggedNode.id === targetNode.id) return;

        event.preventDefault();
        event.stopPropagation();

        if (onNodeDrop) {
            onNodeDrop(draggedNode, targetNode, 'into');
        }

        setDraggedNode(null);
    }, [allowDragDrop, draggedNode, onNodeDrop]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!treeViewRef.current?.contains(event.target)) return;

            const selectedNode = Array.from(currentSelected)[0];
            if (!selectedNode) return;

            switch (event.key) {
                case 'ArrowRight':
                    if (!currentExpanded.has(selectedNode)) {
                        handleNodeExpand(selectedNode);
                    }
                    break;
                case 'ArrowLeft':
                    if (currentExpanded.has(selectedNode)) {
                        handleNodeExpand(selectedNode);
                    }
                    break;
                case ' ':
                case 'Enter':
                    event.preventDefault();
                    handleNodeExpand(selectedNode);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentSelected, currentExpanded, handleNodeExpand]);

    // Handle clicks outside the tree view (optional cleanup)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Individual TreeNode components handle their own Genie cleanup
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Recursive function to render tree nodes
    const renderTreeNode = useCallback((node, level = 0) => {
        if (maxDepth !== null && level > maxDepth) return null;

        // Directories should appear expandable even if children are filtered out
        const isDirectory = node.metadata?.type === 'directory';
        const hasVisibleChildren = node.children && node.children.length > 0;
        const hasChildren = hasVisibleChildren; // Only show expand icon if there are actual children
        const isExpanded = currentExpanded.has(node.id);
        const isSelected = currentSelected.has(node.id);
        const isDisabled = node.disabled || false;

        // Get genie config for this node (if provided)
        const nodeState = {isExpanded, isSelected, level, hasChildren, isDisabled};

        const genieConfig = getNodeGenie ? getNodeGenie(node, nodeState) : null;

        const treeConfig = {
            showIcons, expandIcon, collapseIcon, leafIcon, nodeIcon, indentPixels: getIndentPixels(indentSize),
            allowDragDrop, renderNode, renderNodeContent, resolvedIconSize, variant,
            theme: treeViewTheme,
            themeSource: theme ? 'local' : 'inherited'
        };

        return (
            <React.Fragment key={node.id}>
                <TreeNode
                    node={node}
                    level={level}
                    nodeState={nodeState}
                    genieConfig={genieConfig}
                    treeConfig={treeConfig}
                    onNodeSelect={handleNodeSelect}
                    onNodeExpand={handleNodeExpand}
                    onNodeDoubleClick={onNodeDoubleClick}
                    onNodeRightClick={onNodeRightClick}
                    onNodeDrop={handleDrop}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    onGenieShow={onGenieShow}
                    onGenieHide={onGenieHide}
                />
                {/* Recursively render children if expanded and visible children exist */}
                {hasVisibleChildren && isExpanded && node.children.map(child =>
                    renderTreeNode(child, level + 1)
                )}
            </React.Fragment>
        );
    }, [
        currentExpanded, currentSelected, maxDepth, getNodeGenie, showIcons, expandIcon,
        collapseIcon, leafIcon, nodeIcon, indentSize, getIndentPixels, allowDragDrop, renderNode, renderNodeContent,
        resolvedIconSize, variant, treeViewTheme, theme, handleNodeSelect, handleNodeExpand, onNodeDoubleClick, onNodeRightClick,
        handleDrop, handleDragStart, handleDragOver, onGenieShow, onGenieHide, React.isValidElement
    ]);

    const content = (
        <div
            ref={treeViewRef}
            className={classes}
            data-theme={treeViewTheme}
            data-theme-source={theme ? 'local' : 'inherited'}
            style={{
                ...getMarginStyle(),
                ...(justifySelf && {justifySelf})
            }}
            {...props}
        >
            <div className="tree-view-content">
                {filteredData.length > 0 ? (
                    filteredData.map(node => renderTreeNode(node))
                ) : (
                    <div className="tree-view-empty">
                        {searchValue ? 'No matching nodes found' : 'No data available'}
                    </div>
                )}
            </div>
            {children && <div className="tree-view-children">{children}</div>}
        </div>
    );

    return content;
});

TreeView.displayName = 'TreeView';

// Export utility functions for hierarchical data conversion (useful for external components)
export {convertHierarchicalData};

export default TreeView;
