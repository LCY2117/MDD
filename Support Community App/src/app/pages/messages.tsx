import { useState } from 'react';
import { Bell, MessageCircle, Heart, UserPlus, Settings, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/community/bottom-nav';
import { EmptyState } from '../components/community/empty-state';

interface Message {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  from: {
    name: string;
    isAnonymous: boolean;
  };
  content: string;
  relatedPost?: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  unreadCount: number;
  time: string;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chats' | 'interaction' | 'system'>('chats');
  
  // 模拟私信对话列表
  const mockConversations: Conversation[] = [
    {
      id: '1',
      user: {
        id: '1',
        name: '温暖的小鹿',
        avatar: '🦌',
        isOnline: true,
      },
      lastMessage: '我们都在这里陪着你 💙',
      unreadCount: 0,
      time: '10分钟前',
    },
    {
      id: '2',
      user: {
        id: '2',
        name: '星光守护者',
        avatar: '⭐',
        isOnline: false,
      },
      lastMessage: '谢谢你的分享，很有帮助',
      unreadCount: 2,
      time: '1小时前',
    },
    {
      id: '3',
      user: {
        id: '3',
        name: '宁静的海',
        avatar: '🌊',
        isOnline: true,
      },
      lastMessage: '晚安，明天又是新的一天',
      unreadCount: 0,
      time: '昨天',
    },
  ];
  
  const mockMessages: Message[] = [
    {
      id: '1',
      type: 'comment',
      from: { name: '小星', isAnonymous: false },
      content: '回复了你的帖子：谢谢分享，这个方法我也试试',
      relatedPost: '分享一个帮助我度过低谷期的方法...',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'like',
      from: { name: '匿名用户', isAnonymous: true },
      content: '赞了你的帖子',
      relatedPost: '今天的小确幸...',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'follow',
      from: { name: '小云', isAnonymous: false },
      content: '关注了你',
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      type: 'system',
      from: { name: '系统通知', isAnonymous: false },
      content: '你的帖子"今天又是艰难的一天"获得了100个赞',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const [messages, setMessages] = useState(mockMessages);
  
  const interactionMessages = messages.filter(m => m.type !== 'system');
  const systemMessages = messages.filter(m => m.type === 'system');
  const unreadCount = messages.filter(m => !m.isRead).length;
  
  const handleMarkAllRead = () => {
    setMessages(messages.map(m => ({ ...m, isRead: true })));
  };
  
  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'like':
        return Heart;
      case 'comment':
        return MessageCircle;
      case 'follow':
        return UserPlus;
      case 'system':
        return Bell;
    }
  };
  
  const getIconColor = (type: Message['type']) => {
    switch (type) {
      case 'like':
        return 'text-rose-500 bg-rose-50';
      case 'comment':
        return 'text-blue-500 bg-blue-50';
      case 'follow':
        return 'text-primary bg-primary/10';
      case 'system':
        return 'text-orange-500 bg-orange-50';
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };
  
  const MessageItem = ({ message }: { message: Message }) => {
    const Icon = getIcon(message.type);
    
    return (
      <div className={`p-4 rounded-2xl border transition-colors ${
        message.isRead 
          ? 'bg-card border-border/50' 
          : 'bg-primary/5 border-primary/20'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(message.type)}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {message.from.isAnonymous ? '匿名用户' : message.from.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.createdAt)}
              </span>
              {!message.isRead && (
                <span className="w-2 h-2 rounded-full bg-primary"></span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {message.content}
            </p>
            {message.relatedPost && (
              <div className="text-sm p-2 bg-secondary rounded-lg text-foreground/80">
                {message.relatedPost}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1>消息</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount} 条未读消息
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm px-4 py-2 text-primary hover:bg-secondary rounded-lg transition-colors"
              >
                全部已读
              </button>
            )}
            <button 
              onClick={() => navigate('/message-settings')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 标签页 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              activeTab === 'chats'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            聊天
          </button>
          <button
            onClick={() => setActiveTab('interaction')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              activeTab === 'interaction'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            互动消息
            {interactionMessages.filter(m => !m.isRead).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-foreground text-primary rounded-full text-xs">
                {interactionMessages.filter(m => !m.isRead).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              activeTab === 'system'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            系统通知
          </button>
        </div>
      </div>
      
      {/* 消息列表 */}
      <div className="px-6 py-4">
        {activeTab === 'chats' ? (
          mockConversations.length > 0 ? (
            <div className="space-y-3">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => navigate(`/messages/${conversation.user.id}`)}
                  className="p-4 rounded-2xl border bg-card border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl">
                        {conversation.user.avatar}
                      </div>
                      {conversation.user.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="truncate">{conversation.user.name}</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full flex-shrink-0">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="还没有聊天记录"
              description="开始一段新的对话吧"
            />
          )
        ) : activeTab === 'interaction' ? (
          interactionMessages.length > 0 ? (
            <div className="space-y-3">
              {interactionMessages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="还没有互动消息"
              description="当有人评论、点赞或关注你时，会在这里显示"
            />
          )
        ) : (
          systemMessages.length > 0 ? (
            <div className="space-y-3">
              {systemMessages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="暂无系统通知"
              description="重要的系统消息会在这里显示"
            />
          )
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}