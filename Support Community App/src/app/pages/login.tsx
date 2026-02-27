import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, CheckCircle2, Lock, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleWechatLogin = async () => {
    setIsLoading(true);
    // 模拟登录延迟
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 pb-8">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary mx-auto flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1>登录心语社区</h1>
          <p className="text-muted-foreground mt-2">用温暖的方式，开始陪伴之旅</p>
        </motion.div>
        
        {/* 登录卡片 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-8 shadow-md w-full mb-8"
        >
          {/* 微信登录按钮 */}
          <button
            onClick={handleWechatLogin}
            disabled={isLoading}
            className="w-full py-4 bg-[#07C160] text-white rounded-2xl shadow-md hover:bg-[#06AD56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>登录中...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 5.5c-2.8 0-5 2.2-5 5 0 1.1.4 2.1 1 3l-.8 2.4 2.5-.8c.8.5 1.8.8 2.8.8 2.8 0 5-2.2 5-5s-2.2-5-5-5zm-1.5 7h-1v-1h1v1zm0-2h-1v-2h1v2zm3 2h-1v-1h1v1zm0-2h-1v-2h1v2z"/>
                  <path d="M15.5 11c-.3 0-.5 0-.8.1.3.6.5 1.3.5 2 0 2.5-2 4.5-4.5 4.5-.4 0-.7 0-1-.1.8 1.6 2.5 2.6 4.3 2.6.7 0 1.4-.2 2-.5l1.8.6-.6-1.8c.7-.8 1.1-1.8 1.1-2.9.1-2.1-1.6-3.5-2.8-3.5zm-1.5 2h-1v-1h1v1zm3 0h-1v-1h1v1z"/>
                </svg>
                <span>微信一键登录</span>
              </>
            )}
          </button>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              登录即表示同意
              <button className="text-primary hover:underline mx-1">《用户协议》</button>
              和
              <button className="text-primary hover:underline mx-1">《隐私政策》</button>
            </p>
          </div>
        </motion.div>
        
        {/* 隐私保护说明 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground">支持匿名发布和浏览，保护你的隐私</p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground">你的个人信息经过加密保护，绝不泄露</p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground">随时管理你的内容和可见性设置</p>
          </div>
        </div>
      </div>
      
      {/* 底部提示 */}
      <button
        onClick={() => navigate('/')}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        暂不登录，先看看
      </button>
    </div>
  );
}
