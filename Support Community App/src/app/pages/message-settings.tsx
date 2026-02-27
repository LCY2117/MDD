import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, MessageCircle, Shield, EyeOff, Volume2, Vibrate } from 'lucide-react';
import { motion } from 'motion/react';

interface MessageSettings {
  receiveMessages: boolean;
  allowAnonymous: boolean;
  onlyFollowers: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showPreview: boolean;
}

export default function MessageSettingsPage() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<MessageSettings>({
    receiveMessages: true,
    allowAnonymous: true,
    onlyFollowers: false,
    soundEnabled: true,
    vibrationEnabled: true,
    showPreview: true,
  });
  
  const toggleSetting = (key: keyof MessageSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };
  
  const settingSections = [
    {
      title: '谁可以给我发消息',
      items: [
        {
          key: 'receiveMessages' as const,
          icon: MessageCircle,
          label: '接收私信',
          description: '允许其他用户给你发送私信',
          enabled: settings.receiveMessages,
        },
        {
          key: 'allowAnonymous' as const,
          icon: Shield,
          label: '接收匿名消息',
          description: '允许匿名用户给你发消息',
          enabled: settings.allowAnonymous,
          disabled: !settings.receiveMessages,
        },
        {
          key: 'onlyFollowers' as const,
          icon: EyeOff,
          label: '仅关注的人',
          description: '只有你关注的人可以给你发私信',
          enabled: settings.onlyFollowers,
          disabled: !settings.receiveMessages,
        },
      ],
    },
    {
      title: '消息通知',
      items: [
        {
          key: 'soundEnabled' as const,
          icon: Volume2,
          label: '消息提示音',
          description: '收到新消息时播放提示音',
          enabled: settings.soundEnabled,
        },
        {
          key: 'vibrationEnabled' as const,
          icon: Vibrate,
          label: '振动提醒',
          description: '收到新消息时振动提醒',
          enabled: settings.vibrationEnabled,
        },
        {
          key: 'showPreview' as const,
          icon: Bell,
          label: '显示消息预览',
          description: '在通知中显示消息内容',
          enabled: settings.showPreview,
        },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>消息设置</h3>
          <div className="w-9"></div>
        </div>
      </div>
      
      {/* 说明卡片 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="mb-1 text-primary">隐私保护</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                你可以控制谁可以给你发消息，以及如何接收消息通知。这些设置可以帮助你创建更舒适的交流环境。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 设置列表 */}
      <div className="px-6 py-4 space-y-6">
        {settingSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h4 className="mb-3 text-muted-foreground">{section.title}</h4>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isDisabled = item.disabled || false;
                
                return (
                  <div
                    key={item.key}
                    className={`flex items-center gap-4 p-4 ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-border/30' : ''
                    } ${isDisabled ? 'opacity-50' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.enabled && !isDisabled ? 'bg-primary/10' : 'bg-secondary'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        item.enabled && !isDisabled ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-0.5">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      onClick={() => !isDisabled && toggleSetting(item.key)}
                      disabled={isDisabled}
                      className={`relative w-12 h-7 rounded-full transition-colors ${
                        item.enabled && !isDisabled ? 'bg-primary' : 'bg-border'
                      } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                          item.enabled && !isDisabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* 快捷操作 */}
      <div className="px-6 py-4">
        <h4 className="mb-3 text-muted-foreground">快捷操作</h4>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/notifications')}
            className="w-full p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="mb-0.5">通知中心</h4>
                <p className="text-sm text-muted-foreground">查看所有通知</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
            </div>
          </button>
          
          <button
            className="w-full p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="mb-0.5">清空所有消息</h4>
                <p className="text-sm text-muted-foreground">删除所有聊天记录</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-destructive" />
              </div>
            </div>
          </button>
        </div>
      </div>
      
      {/* 温馨提示 */}
      <div className="px-6 py-4">
        <div className="bg-accent/30 rounded-2xl p-4 border border-border/30">
          <h4 className="mb-2">💡 温馨提示</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 即使关闭私信，你仍然可以接收系统通知</li>
            <li>• 已屏蔽的用户无法给你发送消息</li>
            <li>• 消息设置不会影响社区互动通知</li>
          </ul>
        </div>
      </div>
    </div>
  );
}