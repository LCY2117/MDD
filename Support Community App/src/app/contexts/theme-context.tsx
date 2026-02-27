import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ColorScheme = 'teal' | 'mint' | 'sage' | 'blue-gray' | 'lavender';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // 实际应用的主题(auto模式下会根据系统决定)
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      return (stored as Theme) || 'light';
    }
    return 'light';
  });
  
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('colorScheme');
      return (stored as ColorScheme) || 'teal';
    }
    return 'teal';
  });
  
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  
  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'auto') {
        const isDark = mediaQuery.matches;
        setActualTheme(isDark ? 'dark' : 'light');
        
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    // 初始检查
    handleChange();
    
    // 监听变化
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // 应用主题
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActualTheme(isDark ? 'dark' : 'light');
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      setActualTheme(theme);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // 保存到 localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // 应用主题色
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 移除所有主题色类
    document.documentElement.classList.remove('theme-teal', 'theme-mint', 'theme-sage', 'theme-blue-gray', 'theme-lavender');
    // 添加当前主题色类
    document.documentElement.classList.add(`theme-${colorScheme}`);
    
    // 保存到 localStorage
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const setColorScheme = (newScheme: ColorScheme) => {
    setColorSchemeState(newScheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}