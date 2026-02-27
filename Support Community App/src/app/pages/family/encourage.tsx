import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, Smile, Send, Sparkles } from 'lucide-react';

export default function FamilyEncouragePage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const templates = [
    '今天也要加油哦，我一直陪着你 ❤️',
    '你已经做得很好了，为你感到骄傲',
    '记得按时吃药，好好休息',
    '遇到困难记得告诉我，我们一起面对',
    '你不是一个人，我们都在你身边',
    '每一天都是新的开始，相信你可以的',
  ];
  
  const emojis = ['❤️', '🌟', '💪', '🌈', '☀️', '🌸', '💐', '🎈'];
  
  const handleSend = () => {
    if (message.trim() || selectedTemplate) {
      // 这里可以发送消息的逻辑
      alert('鼓励已发送！');
      navigate(-1);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>发送鼓励</h3>
          <button
            onClick={handleSend}
            disabled={!message.trim() && !selectedTemplate}
            className={`px-4 py-2 rounded-lg transition-colors ${
              message.trim() || selectedTemplate
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}
          >
            发送
          </button>
        </div>
      </header>
      
      <div className="px-6 pt-6">
        {/* 说明 */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 mb-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="mb-1">温暖的陪伴</h4>
              <p className="text-sm text-muted-foreground">
                一句简单的鼓励，可能就是TA今天最需要的支持
              </p>
            </div>
          </div>
        </div>
        
        {/* AI建议 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ai-chat', { state: { context: '帮我写一句鼓励患者的话' } })}
            className="w-full bg-card rounded-2xl p-4 border border-primary/30 hover:shadow-sm transition-shadow flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <h4>AI帮我写</h4>
              <p className="text-sm text-muted-foreground">让AI助手帮你组织语言</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
          </button>
        </div>
        
        {/* 快速模板 */}
        <div className="mb-6">
          <h4 className="mb-3">快速模板</h4>
          <div className="space-y-2">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTemplate(template);
                  setMessage(template);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedTemplate === template
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-card border border-border/50 hover:shadow-sm'
                }`}
              >
                <p className="text-sm">{template}</p>
              </button>
            ))}
          </div>
        </div>
        
        {/* 表情符号 */}
        <div className="mb-6">
          <h4 className="mb-3">添加表情</h4>
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => setMessage(prev => prev + emoji)}
                className="w-12 h-12 bg-card rounded-xl border border-border/50 hover:shadow-sm transition-shadow flex items-center justify-center text-2xl"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        {/* 自定义消息 */}
        <div className="mb-6">
          <h4 className="mb-3">自定义消息</h4>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSelectedTemplate(null);
              }}
              placeholder="写下你想说的话..."
              className="w-full p-4 bg-transparent border-none outline-none resize-none min-h-[120px]"
            />
            <div className="px-4 pb-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{message.length}/200</span>
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4" />
                <span>真诚的话语最有力量</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={!message.trim() && !selectedTemplate}
          className={`w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mb-6 ${
            message.trim() || selectedTemplate
              ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 shadow-lg'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="font-medium">发送鼓励</span>
        </button>
        
        {/* 温馨提示 */}
        <div className="bg-accent/20 rounded-2xl p-4 mb-6 border border-border/30">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium text-foreground">小贴士：</span>
            避免说"想开点就好了"这类话，试着表达"我理解你的感受"和"我会一直陪着你"。
          </p>
        </div>
      </div>
    </div>
  );
}
