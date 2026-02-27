import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sun, Moon, Type, Palette, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/theme-context';

export default function DisplaySettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  const fontSizes = [
    { value: 14, label: '小', description: '适合视力较好的用户' },
    { value: 16, label: '标准', description: '推荐大多数用户使用' },
    { value: 18, label: '大', description: '更易于阅读' },
    { value: 20, label: '特大', description: '最大字号' },
  ];
  
  const themes = [
    { value: 'light' as const, label: '浅色模式', icon: Sun, description: '明亮舒适' },
    { value: 'dark' as const, label: '深色模式', icon: Moon, description: '护眼省电' },
    { value: 'auto' as const, label: '跟随系统', icon: Monitor, description: '自动切换' },
  ];
  
  const colorSchemes = [
    { 
      value: 'teal' as const, 
      label: '宁静蓝绿', 
      color: '#5FA9A3',
      description: '默认的舒缓配色' 
    },
    { 
      value: 'mint' as const, 
      label: '温和薄荷', 
      color: '#7B9E89',
      description: '清新的绿意' 
    },
    { 
      value: 'sage' as const, 
      label: '柔和灰绿', 
      color: '#95A99F',
      description: '优雅的中性色' 
    },
    { 
      value: 'blue-gray' as const, 
      label: '淡雅灰蓝', 
      color: '#8B9EB7',
      description: '沉稳的蓝调' 
    },
    { 
      value: 'lavender' as const, 
      label: '温柔灰紫', 
      color: '#A8B5C7',
      description: '温馨的紫灰' 
    },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>显示设置</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      <div className="px-6 py-6 space-y-6">
        {/* 字体大小 */}
        <div>
          <h4 className="mb-3 px-1 text-muted-foreground">字体大小</h4>
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="mb-0.5">字号调节</h4>
                <p className="text-sm text-muted-foreground">调整应用内文字大小</p>
              </div>
            </div>
            
            {/* 预览 */}
            <div className="mb-4 p-4 bg-secondary rounded-xl border border-border/30">
              <p style={{ fontSize: `${fontSize}px` }} className="transition-all">
                这是预览文字效果。调整字号让阅读更舒适。
              </p>
            </div>
            
            {/* 字号选项 */}
            <div className="space-y-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`w-full p-3 rounded-xl border transition-all text-left ${
                    fontSize === size.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4>{size.label}</h4>
                    <span className="text-sm text-muted-foreground">{size.value}px</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{size.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 主题模式 */}
        <div>
          <h4 className="mb-3 px-1 text-muted-foreground">主题模式</h4>
          
          {/* 主题预览卡片 */}
          <div className="mb-3 bg-card rounded-2xl border border-border/50 p-4">
            <p className="text-sm text-muted-foreground mb-3">当前外观预览</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background rounded-lg p-3 border border-border/50">
                <div className="w-full h-16 bg-primary/10 rounded-md mb-2" />
                <div className="h-2 bg-muted rounded w-3/4 mb-1" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
              <div className="bg-background rounded-lg p-3 border border-border/50">
                <div className="w-full h-16 bg-secondary rounded-md mb-2" />
                <div className="h-2 bg-muted rounded w-3/4 mb-1" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
              <div className="bg-background rounded-lg p-3 border border-border/50">
                <div className="w-full h-16 bg-accent rounded-md mb-2" />
                <div className="h-2 bg-muted rounded w-3/4 mb-1" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
          
          {/* 主题选项 */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {themes.map((themeOption, idx) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors text-left ${
                    idx !== themes.length - 1 ? 'border-b border-border/30' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    theme === themeOption.value ? 'bg-primary/10' : 'bg-secondary'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      theme === themeOption.value ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-0.5">{themeOption.label}</h4>
                    <p className="text-sm text-muted-foreground">{themeOption.description}</p>
                  </div>
                  {theme === themeOption.value && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* 色彩方案 */}
        <div>
          <h4 className="mb-3 px-1 text-muted-foreground">色彩方案</h4>
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="mb-0.5">主题色</h4>
                <p className="text-sm text-muted-foreground">
                  {colorSchemes.find(s => s.value === colorScheme)?.label}
                </p>
              </div>
            </div>
            
            {/* 颜色选项 */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => setColorScheme(scheme.value)}
                  style={{ backgroundColor: scheme.color }}
                  className={`aspect-square rounded-xl border-2 transition-all ${
                    colorScheme === scheme.value 
                      ? 'border-primary scale-105 shadow-md' 
                      : 'border-transparent hover:border-border hover:scale-105'
                  } flex items-center justify-center`}
                  aria-label={scheme.label}
                >
                  {colorScheme === scheme.value && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                  )}
                </button>
              ))}
            </div>
            
            {/* 色彩方案列表 */}
            <div className="space-y-2 mb-4">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => setColorScheme(scheme.value)}
                  className={`w-full p-3 rounded-xl border transition-all text-left ${
                    colorScheme === scheme.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg border border-border/30"
                      style={{ backgroundColor: scheme.color }}
                    />
                    <div className="flex-1">
                      <h4 className="mb-0.5">{scheme.label}</h4>
                      <p className="text-sm text-muted-foreground">{scheme.description}</p>
                    </div>
                    {colorScheme === scheme.value && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm text-muted-foreground">
                💡 所有配色均为低饱和度，精心设计以营造舒缓温和的氛围
              </p>
            </div>
          </div>
        </div>
        
        {/* 动画效果 */}
        <div>
          <h4 className="mb-3 px-1 text-muted-foreground">动画效果</h4>
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="mb-0.5">减少动画</h4>
                <p className="text-sm text-muted-foreground">降低过渡动画，减少视觉刺激</p>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  reduceMotion ? 'bg-primary' : 'bg-border'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    reduceMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* 温馨提示 */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <h4 className="mb-2">💡 关于显示设置</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            我们致力于为每一位用户提供舒适的阅读体验。如果您在使用过程中遇到视觉不适，可以随时调整这些设置。
          </p>
        </div>
      </div>
    </div>
  );
}