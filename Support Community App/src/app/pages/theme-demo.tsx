import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, AlertCircle, Check, Info } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { ThemeToggle } from '../components/theme-toggle';

export default function ThemeDemoPage() {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('colors');
  
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
          <h3>主题演示</h3>
          <ThemeToggle />
        </div>
      </header>
      
      <div className="px-6 py-6 space-y-6">
        {/* 当前主题显示 */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 text-center">
          <h2 className="mb-2">当前主题</h2>
          <p className="text-3xl mb-2">{actualTheme === 'dark' ? '🌙' : '☀️'}</p>
          <p className="text-muted-foreground">
            {actualTheme === 'dark' ? '深色模式' : '浅色模式'}
          </p>
        </div>
        
        {/* 标签页 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              activeTab === 'colors'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            }`}
          >
            配色
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              activeTab === 'components'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            }`}
          >
            组件
          </button>
        </div>
        
        {/* 配色展示 */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <h4 className="px-1 text-muted-foreground">色彩系统</h4>
            
            {/* 主色调 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="mb-3">主色调</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary" />
                  <div>
                    <p className="font-medium">Primary</p>
                    <p className="text-sm text-muted-foreground">
                      {actualTheme === 'dark' ? '#6FB8B2' : '#5FA9A3'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary" />
                  <div>
                    <p className="font-medium">Secondary</p>
                    <p className="text-sm text-muted-foreground">次要背景色</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent" />
                  <div>
                    <p className="font-medium">Accent</p>
                    <p className="text-sm text-muted-foreground">强调色</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 语义色 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="mb-3">语义色</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-success" />
                  <div>
                    <p className="font-medium">Success</p>
                    <p className="text-sm text-muted-foreground">成功/完成</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-warning" />
                  <div>
                    <p className="font-medium">Warning</p>
                    <p className="text-sm text-muted-foreground">警告/提醒</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-destructive" />
                  <div>
                    <p className="font-medium">Destructive</p>
                    <p className="text-sm text-muted-foreground">危险/删除</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 背景色 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="mb-3">背景与文字</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-background border border-border" />
                  <div>
                    <p className="font-medium">Background</p>
                    <p className="text-sm text-muted-foreground">
                      {actualTheme === 'dark' ? '#1A1D1E' : '#FAF8F5'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-card border border-border" />
                  <div>
                    <p className="font-medium">Card</p>
                    <p className="text-sm text-muted-foreground">
                      {actualTheme === 'dark' ? '#252829' : '#FFFFFF'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-foreground" />
                  <div>
                    <p className="font-medium text-background">Foreground</p>
                    <p className="text-sm text-muted-foreground">文字颜色</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 组件展示 */}
        {activeTab === 'components' && (
          <div className="space-y-4">
            <h4 className="px-1 text-muted-foreground">UI组件</h4>
            
            {/* 按钮 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="mb-3">按钮</h4>
              <div className="space-y-3">
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl">
                  主要按钮
                </button>
                <button className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl">
                  次要按钮
                </button>
                <button className="w-full py-3 border border-border rounded-xl">
                  边框按钮
                </button>
                <button className="w-full py-3 text-destructive hover:bg-destructive/10 rounded-xl">
                  危险按钮
                </button>
              </div>
            </div>
            
            {/* 提示卡片 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="mb-3">提示卡片</h4>
              <div className="space-y-3">
                <div className="p-3 bg-success/10 border border-success/20 rounded-xl flex items-start gap-2">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-success mb-1">成功提示</p>
                    <p className="text-sm text-muted-foreground">操作已成功完成</p>
                  </div>
                </div>
                
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning mb-1">警告提示</p>
                    <p className="text-sm text-muted-foreground">请注意相关事项</p>
                  </div>
                </div>
                
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive mb-1">错误提示</p>
                    <p className="text-sm text-muted-foreground">操作失败,请重试</p>
                  </div>
                </div>
                
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-2">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary mb-1">信息提示</p>
                    <p className="text-sm text-muted-foreground">这是一条普通提示信息</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 输入框 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="mb-3">表单元素</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="文本输入框"
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  placeholder="多行文本输入"
                  rows={3}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
            
            {/* 图标卡片 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="mb-3">图标卡片</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-0.5">标题文字</h4>
                  <p className="text-sm text-muted-foreground">描述文字内容</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 说明 */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <h4 className="mb-2">💡 关于深色模式</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            深色模式采用低饱和度配色,避免高对比度造成的视觉刺激。
            所有颜色都经过精心调配,确保在深色和浅色模式下都能提供舒适的阅读体验。
          </p>
        </div>
      </div>
    </div>
  );
}
