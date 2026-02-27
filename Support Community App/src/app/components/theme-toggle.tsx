import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const toggleTheme = () => {
    if (theme === 'auto') {
      // 如果是auto模式,切换到相反的主题
      setTheme(actualTheme === 'dark' ? 'light' : 'dark');
    } else {
      // 在light和dark之间切换
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };
  
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-secondary hover:bg-accent transition-all duration-300 overflow-hidden group"
      aria-label="切换主题"
      title={actualTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      <div className="relative w-5 h-5">
        {/* 太阳图标 */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-foreground transition-all duration-300 ${
            actualTheme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`}
        />
        {/* 月亮图标 */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-foreground transition-all duration-300 ${
            actualTheme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
}