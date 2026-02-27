import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Users, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeToggle } from '../components/theme-toggle';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      icon: Heart,
      title: '你好，欢迎来到这里',
      description: '这是一个温暖、安全的陪伴空间，你可以在这里自由表达、寻求支持',
    },
    {
      icon: Users,
      title: '你并不孤单',
      description: '这里有许多和你有相似经历的朋友，我们互相理解、互相陪伴',
    },
    {
      icon: Shield,
      title: '你的隐私受到保护',
      description: '支持匿名发布，你的个人信息安全可靠，可以安心分享',
    },
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background flex flex-col items-center justify-between p-6 pb-8">
      {/* 主题切换按钮 - 右上角 */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Logo区域 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg mb-4">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-center">心语社区</h1>
          <p className="text-center text-muted-foreground mt-2">陪伴你的每一天</p>
        </motion.div>
        
        {/* 滑动介绍卡片 */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl p-8 shadow-md w-full text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
            {(() => {
              const Icon = slides[currentSlide].icon;
              return <Icon className="w-8 h-8 text-primary" />;
            })()}
          </div>
          <h2 className="mb-3">{slides[currentSlide].title}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </motion.div>
        
        {/* 指示器 */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* 底部按钮 */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl shadow-md hover:bg-primary/90 transition-colors"
        >
          开始使用
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}