import { Home, Users, PlusCircle, MessageCircle, User, Sparkles, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/community', icon: Users, label: '社区' },
    { path: '/family', icon: Heart, label: '家庭' },
    { path: '/ai-chat', icon: Sparkles, label: 'AI' },
    { path: '/messages', icon: MessageCircle, label: '消息' },
    { path: '/profile', icon: User, label: '我的' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="max-w-md mx-auto px-1 py-2 grid grid-cols-6 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-colors"
            >
              {/* 活动指示器背景 - 在每个导航项内部 */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              
              {/* 图标和文字 */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <Icon 
                  className={`w-5 h-5 mb-1 transition-all ${
                    isActive 
                      ? 'text-primary stroke-[2.5]' 
                      : 'text-muted-foreground stroke-2'
                  }`} 
                />
              </motion.div>
              <motion.span 
                className={`text-xs transition-colors relative z-10 ${
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}