import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Send, Smile, Image as ImageIcon, MoreHorizontal, AlertCircle } from 'lucide-react';

export default function MessageDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageText, setMessageText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 模拟对话用户
  const chatUser = {
    id: id || '1',
    name: '温暖的小鹿',
    avatar: '🦌',
    isOnline: true,
  };
  
  // 模拟消息记录
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: chatUser.id,
      text: '你好，看到你的分享很有共鸣',
      time: '10:23',
      isSelf: false,
    },
    {
      id: 2,
      senderId: 'me',
      text: '谢谢你的理解和支持',
      time: '10:25',
      isSelf: true,
    },
    {
      id: 3,
      senderId: chatUser.id,
      text: '我也有过类似的经历，那段时间真的很难熬。但慢慢会好起来的，相信自己。',
      time: '10:26',
      isSelf: false,
    },
    {
      id: 4,
      senderId: 'me',
      text: '嗯，我会加油的。有你们的陪伴感觉温暖了很多',
      time: '10:28',
      isSelf: true,
    },
    {
      id: 5,
      senderId: chatUser.id,
      text: '我们都在这里陪着你 💙',
      time: '10:29',
      isSelf: false,
    },
  ]);
  
  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 发送消息
  const handleSend = () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      senderId: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // 模拟对方回复
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        senderId: chatUser.id,
        text: '收到，我理解你的感受',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isSelf: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 顶部导航 */}
      <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div
              onClick={() => navigate(`/user/${chatUser.id}`)}
              className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl">
                  {chatUser.avatar}
                </div>
                {chatUser.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div>
                <h4 className="mb-0.5">{chatUser.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {chatUser.isOnline ? '在线' : '离线'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* 下拉菜单 */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-16 right-6 z-30 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
            <button
              onClick={() => {
                setShowMenu(false);
                navigate(`/user/${chatUser.id}`);
              }}
              className="w-full px-4 py-3 hover:bg-secondary transition-colors text-left text-sm"
            >
              查看资料
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                alert('清空功能开发中');
              }}
              className="w-full px-4 py-3 hover:bg-secondary transition-colors text-left text-sm border-t border-border/30"
            >
              清空聊天记录
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                alert('举报功能开发中');
              }}
              className="w-full px-4 py-3 hover:bg-secondary transition-colors text-left text-sm border-t border-border/30 text-destructive"
            >
              举报
            </button>
          </div>
        </>
      )}
      
      {/* 安全提示 */}
      <div className="flex-shrink-0 bg-primary/5 border-b border-primary/20 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <span>请保护个人隐私，不要透露敏感信息</span>
        </div>
      </div>
      
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {/* 日期分隔 */}
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
              今天
            </span>
          </div>
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[75%] ${message.isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                {!message.isSelf && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm flex-shrink-0">
                    {chatUser.avatar}
                  </div>
                )}
                <div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl ${
                      message.isSelf
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-card border border-border/50 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${message.isSelf ? 'text-right' : 'text-left'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* 输入框 */}
      <div className="flex-shrink-0 bg-background border-t border-border/50 px-6 py-4">
        <div className="flex items-end gap-2">
          <button className="p-2.5 hover:bg-secondary rounded-xl transition-colors">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2.5 hover:bg-secondary rounded-xl transition-colors">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="说点什么..."
              rows={1}
              className="w-full px-4 py-2.5 bg-secondary rounded-xl border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              style={{ minHeight: '42px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className={`p-2.5 rounded-xl transition-colors ${
              messageText.trim()
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
