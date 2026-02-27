import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, MessageCircle, Heart, UserPlus, TrendingUp, Volume2 } from 'lucide-react';
import { Switch } from '../../components/ui/switch';

export default function NotificationsSettingsPage() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    enableAll: true,
    comments: true,
    likes: true,
    follows: true,
    mentions: true,
    trending: false,
    systemNotice: true,
    sound: true,
    vibrate: true,
  });
  
  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'enableAll') {
      const newValue = !settings.enableAll;
      setSettings({
        ...settings,
        enableAll: newValue,
        comments: newValue,
        likes: newValue,
        follows: newValue,
        mentions: newValue,
        trending: newValue,
        systemNotice: newValue,
      });
    } else {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };
  
  const notificationSections = [
    {
      title: '总开关',
      items: [
        {
          key: 'enableAll' as const,
          icon: Bell,
          label: '接收通知',
          description: '开启后才能收到消息推送',
          enabled: settings.enableAll,
          highlight: true,
        },
      ],
    },
    {
      title: '互动通知',
      items: [
        {
          key: 'comments' as const,
          icon: MessageCircle,
          label: '评论通知',
          description: '有人评论你的帖子时通知',
          enabled: settings.comments,
        },
        {
          key: 'likes' as const,
          icon: Heart,
          label: '点赞通知',
          description: '有人点赞你的内容时通知',
          enabled: settings.likes,
        },
        {
          key: 'follows' as const,
          icon: UserPlus,
          label: '关注通知',
          description: '有人关注你时通知',
          enabled: settings.follows,
        },
      ],
    },
    {
      title: '内容推荐',
      items: [
        {
          key: 'trending' as const,
          icon: TrendingUp,
          label: '热门内容推送',
          description: '推送社区热门话题和精选内容',
          enabled: settings.trending,
        },
      ],
    },
    {
      title: '提醒方式',
      items: [
        {
          key: 'sound' as const,
          icon: Volume2,
          label: '提示音',
          description: '收到通知时播放提示音',
          enabled: settings.sound,
        },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>通知设置</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      {/* 提示 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-accent/30 rounded-2xl p-5 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            你可以选择接收哪些类型的通知。关闭不需要的通知可以减少打扰，让你更专注于重要的信息。
          </p>
        </div>
      </div>
      
      {/* 通知设置列表 */}
      <div className="px-6 py-4 space-y-6">
        {notificationSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h4 className="mb-3 px-1 text-muted-foreground">{section.title}</h4>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIdx}
                    className={`flex items-center gap-3 p-4 ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-border/30' : ''
                    } ${item.highlight ? 'bg-primary/5' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${
                      item.highlight ? 'bg-primary/20' : 'bg-primary/10'
                    } flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.highlight ? 'text-primary' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`mb-0.5 ${item.highlight ? 'text-primary' : ''}`}>
                        {item.label}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={() => handleToggle(item.key)}
                      disabled={!settings.enableAll && item.key !== 'enableAll'}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* 勿扰模式 */}
      <div className="px-6 py-4">
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <h4 className="mb-3">勿扰时段</h4>
          <p className="text-sm text-muted-foreground mb-4">
            在设定的时间段内，不会收到任何通知推送
          </p>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors">
              开始时间 22:00
            </button>
            <button className="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors">
              结束时间 08:00
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}