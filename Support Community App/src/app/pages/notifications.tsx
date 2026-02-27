import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus, Award, TrendingUp, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'comments' | 'follows' | 'system'>('all');
  const [unreadCount, setUnreadCount] = useState(8);
  
  // 模拟通知数据
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: {
        name: '温暖的小鹿',
        avatar: '🦌',
        id: '1',
      },
      content: '赞了你的帖子',
      post: '今天终于鼓起勇气出门散步了...',
      time: '5分钟前',
      isRead: false,
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: '星光守护者',
        avatar: '⭐',
        id: '2',
      },
      content: '评论了你的帖子',
      comment: '加油！每一步都很了不起',
      post: '今天终于鼓起勇气出门散步了...',
      time: '1小时前',
      isRead: false,
    },
    {
      id: 3,
      type: 'follow',
      user: {
        name: '宁静的海',
        avatar: '🌊',
        id: '3',
      },
      content: '关注了你',
      time: '2小时前',
      isRead: false,
    },
    {
      id: 4,
      type: 'system',
      icon: '🎉',
      title: '恭喜你获得勋章',
      content: '坚持打卡7天，获得「坚持者」勋章',
      time: '3小时前',
      isRead: true,
    },
    {
      id: 5,
      type: 'like',
      user: {
        name: '温柔的风',
        avatar: '🍃',
        id: '4',
      },
      content: '赞了你的评论',
      comment: '谢谢你的分享，很有帮助',
      time: '昨天',
      isRead: true,
    },
    {
      id: 6,
      type: 'system',
      icon: '📢',
      title: '社区公告',
      content: '新增AI智慧问答功能，快来体验吧',
      time: '昨天',
      isRead: true,
    },
    {
      id: 7,
      type: 'comment',
      user: {
        name: '晨光',
        avatar: '🌅',
        id: '5',
      },
      content: '回复了你的评论',
      comment: '我也是这样走过来的，一起加油',
      time: '2天前',
      isRead: true,
    },
    {
      id: 8,
      type: 'follow',
      user: {
        name: '月光',
        avatar: '🌙',
        id: '6',
      },
      content: '关注了你',
      time: '3天前',
      isRead: true,
    },
  ];
  
  const tabs = [
    { key: 'all' as const, label: '全部', count: notifications.length },
    { key: 'likes' as const, label: '赞', count: notifications.filter(n => n.type === 'like').length },
    { key: 'comments' as const, label: '评论', count: notifications.filter(n => n.type === 'comment').length },
    { key: 'follows' as const, label: '关注', count: notifications.filter(n => n.type === 'follow').length },
    { key: 'system' as const, label: '系统', count: notifications.filter(n => n.type === 'system').length },
  ];
  
  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab.replace('s', ''));
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'system':
        return <Bell className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };
  
  const markAllAsRead = () => {
    setUnreadCount(0);
    // 实际应用中这里会调用API
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="mb-0.5">通知</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} 条未读</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:underline"
            >
              全部已读
            </button>
          )}
        </div>
        
        {/* Tab切换 */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? 'bg-white/20'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4">
        {/* 通知列表 */}
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                if (notification.type === 'system') {
                  // 系统通知跳转到相应页面
                  return;
                }
                if (notification.type === 'follow') {
                  navigate(`/user/${notification.user?.id}`);
                } else {
                  // 其他通知跳转到帖子详情
                  navigate(`/post/1`);
                }
              }}
              className={`flex gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                notification.isRead
                  ? 'bg-card border-border/50 hover:border-border'
                  : 'bg-primary/5 border-primary/20 hover:border-primary/30'
              }`}
            >
              {/* 头像或图标 */}
              <div className="flex-shrink-0">
                {notification.type === 'system' ? (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                    {notification.icon}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl">
                      {notification.user?.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-background border-2 border-background flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1">
                    {notification.type === 'system' ? (
                      <h4 className="mb-1">{notification.title}</h4>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium">{notification.user?.name}</span>
                        <span className="text-muted-foreground ml-1">{notification.content}</span>
                      </p>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
                
                {/* 评论/帖子内容 */}
                {notification.comment && (
                  <div className="mb-2 px-3 py-2 bg-secondary rounded-lg border border-border/30">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.comment}
                    </p>
                  </div>
                )}
                {notification.post && (
                  <div className="mb-2 px-3 py-2 bg-secondary rounded-lg border border-border/30">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.post}
                    </p>
                  </div>
                )}
                {notification.type === 'system' && notification.content && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.content}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 空状态 */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">暂无通知</p>
          </div>
        )}
        
        {/* 底部提示 */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">已显示全部通知</p>
          </div>
        )}
      </div>
    </div>
  );
}
