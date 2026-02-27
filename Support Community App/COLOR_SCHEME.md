# 主题色自定义功能文档

## 概述

主题色自定义功能允许用户在保持低饱和度、温和配色理念的基础上，选择不同的主题色方案。所有配色均经过精心设计，符合面向抑郁症患者的低刺激、舒缓氛围要求。

## 可用主题色方案

### 1. 宁静蓝绿 (Teal) - 默认
- 主色：`#5FA9A3`
- 特点：默认的舒缓配色，温和的蓝绿色调
- 适用场景：追求平静、安宁氛围的用户

### 2. 温和薄荷 (Mint)
- 主色：`#7B9E89`
- 特点：清新的绿意，自然温和
- 适用场景：喜欢自然、清新感觉的用户

### 3. 柔和灰绿 (Sage)
- 主色：`#95A99F`
- 特点：优雅的中性色，温和内敛
- 适用场景：偏好低调、优雅风格的用户

### 4. 淡雅灰蓝 (Blue Gray)
- 主色：`#8B9EB7`
- 特点：沉稳的蓝调，宁静深邃
- 适用场景：追求稳重、深沉感觉的用户

### 5. 温柔灰紫 (Lavender)
- 主色：`#A8B5C7`
- 特点：温馨的紫灰，柔和温暖
- 适用场景：喜欢温馨、柔和氛围的用户

## 技术实现

### 架构

主题色系统基于 React Context API 和 CSS 变量实现：

1. **ThemeContext**：管理主题色状态和切换
2. **CSS 变量**：定义各主题色的具体数值
3. **类名切换**：通过添加/移除类名应用不同主题色

### 文件结构

```
/src/app/contexts/theme-context.tsx  # 主题管理 Context
/src/styles/theme.css                # 主题色 CSS 变量定义
/src/app/pages/settings/display.tsx  # 主题色选择界面
```

### 使用方法

#### 在组件中使用

```tsx
import { useTheme } from '../../contexts/theme-context';

function MyComponent() {
  const { colorScheme, setColorScheme } = useTheme();
  
  return (
    <button onClick={() => setColorScheme('mint')}>
      切换到温和薄荷
    </button>
  );
}
```

#### 添加新主题色

1. 在 `theme-context.tsx` 中添加新的类型：
```tsx
type ColorScheme = 'teal' | 'mint' | 'sage' | 'blue-gray' | 'lavender' | 'new-color';
```

2. 在 `theme.css` 中定义新主题色的 CSS 变量：
```css
.theme-new-color {
  --primary: #yourcolor;
  --secondary: #yourcolor;
  /* ... 其他变量 */
}

.theme-new-color.dark {
  --primary: #yourcolor-dark;
  /* ... 深色模式下的变量 */
}
```

3. 在 `display.tsx` 中添加选项：
```tsx
const colorSchemes = [
  // ... 现有方案
  { 
    value: 'new-color' as const, 
    label: '新配色', 
    color: '#yourcolor',
    description: '描述文字' 
  },
];
```

## 设计原则

### 低饱和度原则
- 所有主题色HSL饱和度 ≤ 30%
- 避免高刺激、高对比度配色
- 柔和的色彩过渡

### 可访问性
- 满足 WCAG 2.1 AA 级对比度要求
- 深色模式下适当提亮主色
- 保持足够的文字可读性

### 温和氛围
- 选用冷色调或中性色为主
- 避免过于鲜艳或刺激的颜色
- 营造平静、安全的视觉体验

## 深色模式适配

每个主题色都有对应的深色模式配色：

- 主色在深色模式下会适当提亮（约10-15%）
- 保持低饱和度特性
- 确保在深色背景下的可读性

## 平滑过渡

主题色切换时应用 CSS 过渡动画：

```css
transition: 
  --primary 0.4s ease,
  --secondary 0.4s ease,
  --accent 0.4s ease,
  --border 0.4s ease,
  --input 0.4s ease,
  --ring 0.4s ease;
```

## 持久化存储

用户选择的主题色会自动保存到 localStorage：

- 键名：`colorScheme`
- 值：主题色标识符（如 `'teal'`, `'mint'` 等）
- 下次访问时自动恢复

## 最佳实践

1. **选择合适的主题色**：根据用户的偏好和心理状态推荐
2. **测试可访问性**：确保在不同主题色下文字都清晰可读
3. **保持一致性**：所有组件都应正确响应主题色变化
4. **提供预览**：让用户在切换前能看到效果

## 未来扩展

可能的扩展方向：

- [ ] 自定义主题色功能
- [ ] 主题色推荐算法（基于用户情绪）
- [ ] 更多预设主题色方案
- [ ] 主题色与情绪记录关联

## 注意事项

- 主题色系统与深色模式独立工作，可以组合使用
- 修改主题色不会影响字体大小、动画等其他显示设置
- 所有主题色都遵循项目的设计规范和无障碍要求
