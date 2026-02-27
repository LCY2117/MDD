import { useNavigate } from 'react-router';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
          <Search className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="mb-3">页面走丢了</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          你访问的页面不存在，可能已被删除或地址有误
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-secondary text-foreground rounded-2xl hover:bg-accent transition-colors"
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
