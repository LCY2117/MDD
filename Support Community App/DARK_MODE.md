# 深色模式使用指南

## 概述

心语社区现已支持完整的深色模式功能,为用户提供更舒适的夜间浏览体验。深色模式采用低饱和度、低刺激的配色方案,特别适合抑郁症患者及其家属长时间使用。

## 功能特性

### 1. 三种主题模式

- **浅色模式**: 米白色背景 (#FAF8F5) + 低饱和蓝绿色主色调
- **深色模式**: 深灰背景 (#1A1D1E) + 稍微提亮的青绿色
- **跟随系统**: 自动根据设备系统设置切换主题

### 2. 核心设计理念

深色模式遵循以下设计原则:

#### 颜色选择
- **背景色**: 使用深灰 (#1A1D1E) 而非纯黑,减少视觉刺激
- **文字色**: 柔和的浅灰 (#E0E0E0) 保证可读性同时不刺眼
- **主色调**: 提亮的青绿色 (#6FB8B2) 保持品牌一致性
- **卡片背景**: 深灰卡片 (#252829) 提供层次感

#### 对比度控制
- 避免高对比度配色
- 边框使用低透明度 (15-20%)
- 所有颜色保持低饱和度

#### 平滑过渡
- 主题切换时有 0.3s 的平滑动画
- 图标切换带有旋转和缩放效果

### 3. 配色方案对比

| 元素 | 浅色模式 | 深色模式 |
|------|---------|---------|
| 背景 | #FAF8F5 | #1A1D1E |
| 文字 | #3A3A3A | #E0E0E0 |
| 主色 | #5FA9A3 | #6FB8B2 |
| 卡片 | #FFFFFF | #252829 |
| 次要色 | #E8F3F2 | #2D3537 |
| 静音色 | #F5F5F5 | #2D3235 |

## 使用方法

### 用户端

#### 快速切换
1. 在**设置页面**右上角点击主题切换按钮
2. 在**个人中心**右上角点击主题切换按钮
3. 快速在浅色/深色之间切换

#### 详细设置
1. 进入 **我的 > 设置 > 显示设置**
2. 选择以下三种模式之一:
   - 浅色模式 (明亮舒适)
   - 深色模式 (护眼省电)
   - 跟随系统 (自动切换)
3. 查看实时预览效果

### 开发者端

#### 在组件中使用主题

```tsx
import { useTheme } from '../contexts/theme-context';

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  // theme: 用户选择的主题 ('light' | 'dark' | 'auto')
  // actualTheme: 实际应用的主题 ('light' | 'dark')
  // setTheme: 设置主题函数
  
  return (
    <div>
      <p>当前主题: {actualTheme}</p>
      <button onClick={() => setTheme('dark')}>切换到深色模式</button>
    </div>
  );
}
```

#### 使用主题切换按钮组件

```tsx
import { ThemeToggle } from '../components/theme-toggle';

function Header() {
  return (
    <header>
      <h1>页面标题</h1>
      <ThemeToggle />
    </header>
  );
}
```

#### 访问主题CSS变量

所有颜色都通过CSS变量定义,会自动响应主题切换:

```css
.my-element {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

或使用Tailwind类:

```tsx
<div className="bg-background text-foreground border border-border">
  内容
</div>
```

## 技术实现

### 1. 主题管理系统

使用React Context管理全局主题状态:

```
/src/app/contexts/theme-context.tsx
├── ThemeProvider - 主题上下文提供者
└── useTheme - 主题访问Hook
```

### 2. 主题切换组件

```
/src/app/components/theme-toggle.tsx
└── ThemeToggle - 带动画的主题切换按钮
```

### 3. CSS变量系统

```
/src/styles/theme.css
├── :root - 浅色模式变量
├── .dark - 深色模式变量
└── @theme inline - Tailwind集成
```

### 4. 持久化

- 用户的主题选择保存在 `localStorage`
- 键名: `theme`
- 页面刷新后自动恢复

### 5. 系统主题监听

当用户选择"跟随系统"时,应用会:
1. 监听系统主题变化 (`prefers-color-scheme`)
2. 自动切换到对应主题
3. 系统主题改变时实时响应

## 无障碍支持

- 主题切换按钮包含 `aria-label` 和 `title` 属性
- 图标状态清晰可辨
- 键盘可访问
- 符合WCAG色彩对比度标准

## 性能优化

- 使用CSS变量,切换时无需重新加载样式
- 平滑过渡动画仅0.3秒
- localStorage持久化,避免重复计算
- 媒体查询监听器自动清理

## 未来规划

1. **自定义主题颜色** - 允许用户自选主题色
2. **定时切换** - 支持按时间自动切换主题
3. **更多预设主题** - 提供多种配色方案
4. **独立字体大小设置** - 深色模式下可能需要稍大字号

## 常见问题

### Q: 深色模式的切换不生效?
A: 请检查浏览器是否支持CSS变量,建议使用现代浏览器(Chrome 88+, Firefox 85+, Safari 14+)

### Q: 如何重置主题设置?
A: 清除浏览器localStorage中的"theme"项,或在显示设置中重新选择

### Q: "跟随系统"模式不工作?
A: 确保您的操作系统支持深色模式,并已正确设置

### Q: 深色模式下对比度太低?
A: 这是有意的设计,以降低视觉刺激。如需调整,可在代码中修改CSS变量的透明度

## 反馈

如果您在使用深色模式时遇到任何问题或有改进建议,欢迎通过以下方式反馈:

1. 在应用内使用"帮助与反馈"功能
2. 提交GitHub Issue
3. 联系开发团队

---

**版本**: v1.0.0  
**更新日期**: 2026年2月  
**维护者**: 心语社区开发团队
