import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Available themes
const themes = {
  modern: {
    name: 'Modern',
    description: 'Clean and professional design with modern aesthetics'
  },
  dark: {
    name: 'Dark',  
    description: 'Dark mode theme with high contrast and modern feel'
  },
  minimal: {
    name: 'Minimal',
    description: 'Ultra-clean minimalist design with focus on content'
  },
  vibrant: {
    name: 'Vibrant',
    description: 'Colorful and energetic design with bold styling'
  },
  admin: {
    name: 'Admin',
    description: 'Professional administrative interface design'
  },
  pink: {
    name: 'Pink',
    description: 'Playful and vibrant design with a pink color palette'
  },
  fancy: {
    name: 'Fancy',
    description: 'Serious and Elegant Theme Design'
  }
};

export const ThemeProvider = ({ children, theme: overrideTheme }) => {
  // Check if this is a nested ThemeProvider (override scenario)
  const parentContext = useContext(ThemeContext);
  const isNestedProvider = !!parentContext;
  
  // Get initial theme from localStorage or default to 'modern' (only for root provider)
  const [globalTheme, setGlobalTheme] = useState(() => {
    if (isNestedProvider) return null; // Nested providers don't manage global state
    const saved = localStorage.getItem('selectedTheme');
    return saved && themes[saved] ? saved : 'modern';
  });
  
  // Determine the effective current theme
  const currentTheme = isNestedProvider 
    ? (overrideTheme || parentContext.currentTheme) // Use override or inherit from parent
    : (overrideTheme || globalTheme); // Use override or global theme
  
  // Track which themes have been loaded (only for root provider)
  const [loadedThemes, setLoadedThemes] = useState(new Set());
  const [isLoadingThemes, setIsLoadingThemes] = useState(!isNestedProvider);
  // Pre-load all themes at startup (only for root provider)
  useEffect(() => {
    if (isNestedProvider) return; // Skip for nested providers
    
    const preloadAllThemes = async () => {
      try {
        const themeNames = Object.keys(themes);
        const loadPromises = themeNames.map(async (themeName) => {
          await import(`../styles/themes/${themeName}.css`);
          return themeName;
        });

        const loadedThemeNames = await Promise.all(loadPromises);
        setLoadedThemes(new Set(loadedThemeNames));
        setIsLoadingThemes(false);
      } catch (error) {
        console.error('Failed to preload some themes:', error);
        // Fallback: try to load at least the current theme
        try {
          await import(`../styles/themes/${currentTheme}.css`);
          setLoadedThemes(new Set([currentTheme]));
        } catch (fallbackError) {
          console.error('Failed to load current theme:', fallbackError);
        }
        setIsLoadingThemes(false);
      }
    };

    preloadAllThemes();
  }, []); // Run only once on mount

  // Apply theme class to body on mount and theme change (only for root provider)
  useEffect(() => {
    if (isNestedProvider) return; // Only root provider manages body classes
    
    // Remove all theme classes
    Object.keys(themes).forEach(themeName => {
      document.body.classList.remove(`theme-${themeName}`);
    });
    
    // Add current theme class
    document.body.classList.add(`theme-${currentTheme}`);
    
    // Store in localStorage (only for global theme changes, not overrides)
    if (!overrideTheme) {
      localStorage.setItem('selectedTheme', currentTheme);
    }
    
    // Dispatch a custom event that components can listen for
    const themeChangeEvent = new CustomEvent('themechange', { 
      detail: { theme: currentTheme, isOverride: !!overrideTheme } 
    });
    document.dispatchEvent(themeChangeEvent);
  }, [currentTheme, isNestedProvider, overrideTheme]);
  const switchTheme = async (themeName) => {
    if (!themes[themeName]) {
      console.warn(`Theme "${themeName}" does not exist`);
      return;
    }

    // Only root provider can switch global theme
    if (isNestedProvider) {
      console.warn('Cannot switch global theme from nested ThemeProvider. Use the root ThemeProvider.');
      return;
    }

    if (themeName === currentTheme) {
      return; // Already using this theme
    }

    // Check if theme is already loaded, otherwise load it
    try {
      if (!loadedThemes.has(themeName)) {
        await import(`../styles/themes/${themeName}.css`);
        setLoadedThemes(prev => new Set([...prev, themeName]));
      }
      
      setGlobalTheme(themeName);
    } catch (error) {
      console.error(`Failed to load theme: ${themeName}`, error);
    }
  };

  // Monaco theme integration
  const getMonacoThemeFromCSS = (themeName) => {
    const cssVars = getComputedStyle(document.documentElement);
    
    // Extract colors, removing '#' prefix and handling fallbacks
    const getColor = (varName, fallback) => {
      const color = cssVars.getPropertyValue(varName).trim();
      return color ? color.replace('#', '') : fallback;
    };
    
    return {
      base: themeName === 'dark' ? 'vs-dark' : 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'string', foreground: getColor('--code-string', '008000') },
        { token: 'number', foreground: getColor('--code-number', 'FF0000') },
        { token: 'comment', foreground: getColor('--code-comment', '808080') },
        { token: 'identifier', foreground: getColor('--code-variable', '000000') },
        { token: 'operator', foreground: getColor('--code-operator', '000000') },
        { token: 'tag', foreground: getColor('--code-tag', 'FF0000') },
        { token: 'attribute.name', foreground: getColor('--code-attribute', '0000FF') },
        { token: 'attribute.value', foreground: getColor('--code-value', '008000') },
        { token: 'delimiter', foreground: getColor('--code-operator', '000000') },
        { token: 'delimiter.html', foreground: getColor('--code-tag', 'FF0000') },
        { token: 'delimiter.xml', foreground: getColor('--code-tag', 'FF0000') },
        { token: 'type', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'namespace', foreground: getColor('--code-variable', '000000') },
        { token: 'key', foreground: getColor('--code-attribute', '0000FF') },
        { token: 'value', foreground: getColor('--code-value', '008000') },
        { token: 'value.number', foreground: getColor('--code-number', 'FF0000') },
        { token: 'value.string', foreground: getColor('--code-string', '008000') },
        { token: 'predefined', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'function', foreground: getColor('--code-function', '7c3aed') },
        { token: 'variable', foreground: getColor('--code-variable', '000000') },
        { token: 'variable.predefined', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'constant', foreground: getColor('--code-number', 'FF0000') },
        { token: 'class', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'interface', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'enum', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'module', foreground: getColor('--code-keyword', '0000FF') },
        { token: 'regexp', foreground: getColor('--code-string', '008000') },
        { token: 'annotation', foreground: getColor('--code-comment', '808080') },
        { token: 'decorator', foreground: getColor('--code-comment', '808080') },
      ],
      colors: {
        'editor.background': getColor('--code-editor-bg', 'ffffff'),
        'editor.foreground': getColor('--text-color', '000000'),
        'editor.lineHighlightBackground': getColor('--code-editor-line-bg', 'f8f8f8'),
        'editorLineNumber.foreground': getColor('--code-editor-line-numbers', '999999'),
        'editorLineNumber.activeForeground': getColor('--text-color', '000000'),
        'editor.selectionBackground': getColor('--code-editor-selection', '0078d4'),
        'editor.selectionHighlightBackground': getColor('--code-editor-selection', '0078d4') + '40',
        'editor.inactiveSelectionBackground': getColor('--code-editor-selection', '0078d4') + '20',
        'editorCursor.foreground': getColor('--code-editor-cursor', '000000'),
        'editor.findMatchBackground': getColor('--warning-secondary-color', 'ffff00') + '80',
        'editor.findMatchHighlightBackground': getColor('--warning-secondary-color', 'ffff00') + '40',
        'editor.hoverHighlightBackground': getColor('--code-editor-line-bg', 'f8f8f8'),
        'editorHoverWidget.background': getColor('--surface-color', 'ffffff'),
        'editorHoverWidget.border': getColor('--border-color', 'e0e0e0'),
        'editorSuggestWidget.background': getColor('--surface-color', 'ffffff'),
        'editorSuggestWidget.border': getColor('--border-color', 'e0e0e0'),
        'editorSuggestWidget.selectedBackground': getColor('--primary-color', '0078d4'),
        'editorWidget.background': getColor('--surface-color', 'ffffff'),
        'editorWidget.border': getColor('--border-color', 'e0e0e0'),
        'input.background': getColor('--background-color', 'ffffff'),
        'input.foreground': getColor('--text-color', '000000'),
        'input.border': getColor('--border-color', 'e0e0e0'),
        'inputOption.activeBorder': getColor('--primary-color', '0078d4'),
        'dropdown.background': getColor('--surface-color', 'ffffff'),
        'dropdown.foreground': getColor('--text-color', '000000'),
        'dropdown.border': getColor('--border-color', 'e0e0e0'),
        'list.activeSelectionBackground': getColor('--primary-color', '0078d4'),
        'list.activeSelectionForeground': getColor('--surface-color', 'ffffff'),
        'list.hoverBackground': getColor('--code-editor-line-bg', 'f8f8f8'),
        'list.focusBackground': getColor('--primary-color', '0078d4') + '20',
        'scrollbar.shadow': getColor('--shadow-color', '00000020'),
        'scrollbarSlider.background': getColor('--border-color', 'e0e0e0') + '80',
        'scrollbarSlider.hoverBackground': getColor('--text-muted', '999999') + '80',
        'scrollbarSlider.activeBackground': getColor('--text-muted', '999999'),
        'minimap.background': getColor('--code-editor-bg', 'ffffff'),
        'minimapSlider.background': getColor('--border-color', 'e0e0e0') + '40',
        'minimapSlider.hoverBackground': getColor('--border-color', 'e0e0e0') + '60',
        'minimapSlider.activeBackground': getColor('--border-color', 'e0e0e0') + '80',
      }
    };
  };

  // Get Monaco theme for current app theme
  const getMonacoTheme = () => {
    return getMonacoThemeFromCSS(currentTheme);
  };

  // Get CSS variables as an object for external use
  const getThemeVariables = () => {
    const cssVars = getComputedStyle(document.documentElement);
    const variables = {};
    
    // Extract commonly used variables
    const varNames = [
      '--background-color', '--text-color', '--text-muted', '--primary-color',
      '--secondary-color', '--tertiary-color', '--success-color', '--warning-color', '--error-color',
      '--accent-color', '--surface-color', '--border-color',
      '--code-editor-bg', '--code-editor-line-bg', '--code-editor-line-numbers',
      '--code-editor-cursor', '--code-editor-selection', '--code-editor-border',
      '--code-keyword', '--code-string', '--code-number', '--code-comment',
      '--code-function', '--code-variable', '--code-operator', '--code-tag',
      '--code-attribute', '--code-value'
    ];
    
    varNames.forEach(varName => {
      const value = cssVars.getPropertyValue(varName).trim();
      if (value) {
        variables[varName] = value;
      }
    });
    
    return variables;
  };

  const getThemeInfo = (themeName) => {
    return themes[themeName] || null;
  };
  
  const value = {
    currentTheme,
    switchTheme,
    availableThemes: Object.keys(themes),
    themes,
    getThemeInfo,
    isLoadingThemes,
    isNestedProvider,
    isOverride: !!overrideTheme,
    // Inherit parent's loaded themes for nested providers
    loadedThemes: isNestedProvider ? parentContext.loadedThemes : loadedThemes,
    // Monaco theme integration
    getMonacoTheme,
    getMonacoThemeFromCSS,
    getThemeVariables
  };  return (
    <ThemeContext.Provider value={value}>
      {(isLoadingThemes && !isNestedProvider) ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--background-color, #ffffff)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid var(--border-color, #e5e7eb)',
            borderTop: '3px solid var(--primary-color, #3b82f6)',
            borderRadius: '50%',
            animation: 'themeLoadingSpin 1s linear infinite',
            marginBottom: '24px'
          }}></div>
          <div style={{
            fontSize: '16px',
            color: 'var(--text-color, #1f2937)',
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Loading Themes
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-muted, #6b7280)'
          }}>
            Preparing your experience...
          </div>
          <style>
            {`
              @keyframes themeLoadingSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : isNestedProvider && overrideTheme ? (
        // Nested provider with theme override needs a wrapper to apply theme
        <div 
          className={`theme-override-wrapper theme-${currentTheme}`}
          data-theme={currentTheme}
          data-theme-source="override"
        >
          {children}
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Backward compatibility alias for components that used useEffectiveTheme
export const useEffectiveTheme = useTheme;