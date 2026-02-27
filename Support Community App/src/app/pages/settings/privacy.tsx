import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Users } from 'lucide-react';
import { Switch } from '../../components/ui/switch';

export default function PrivacySettingsPage() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    defaultAnonymous: true,
    hideProfile: false,
    allowFollow: true,
    showLikedPosts: false,
    allowMessages: true,
    dataCollection: false,
  });
  
  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };
  
  const privacyOptions = [
    {
      title: '发布设置',
      items: [
        {
          key: 'defaultAnonymous' as const,
          icon: EyeOff,
          label: '默认匿名发布',
          description: '每次发布时默认开启匿名',
          enabled: settings.defaultAnonymous,
        },
      ],
    },
    {
      title: '个人资料',
      items: [
        {
          key: 'hideProfile' as const,
          icon: Eye,
          label: '隐藏个人主页',
          description: '其他用户无法查看你的主页',
          enabled: settings.hideProfile,
        },
        {
          key: 'showLikedPosts' as const,
          icon: Shield,
          label: '显示点赞的帖子',
          description: '允许他人查看你点赞过的内容',
          enabled: settings.showLikedPosts,
        },
      ],
    },
    {
      title: '互动设置',
      items: [
        {
          key: 'allowFollow' as const,
          icon: Users,
          label: '允许被关注',
          description: '其他用户可以关注你',
          enabled: settings.allowFollow,
        },
        {
          key: 'allowMessages' as const,
          icon: Lock,
          label: '允许陌生人私信',
          description: '未关注的用户可以给你发私信',
          enabled: settings.allowMessages,
        },
      ],
    },
    {
      title: '数据与隐私',
      items: [
        {
          key: 'dataCollection' as const,
          icon: Shield,
          label: '共鸣匹配',
          description: '自动推荐你可能会共鸣的动态',
          enabled: settings.dataCollection,
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
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>隐私设置</h3>
          <div className="w-9"></div>
        </div>
      </div>
      
      {/* 隐私提示 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 text-primary">我们重视你的隐私</h4>
              <p className="text-sm text-muted-foreground">
                你可以随时调整隐私设置。我们承诺不会将你的个人信息分享给第三方，所有数据都经过加密保护。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 隐私设置列表 */}
      <div className="px-6 py-4 space-y-6">
        {privacyOptions.map((section, sectionIdx) => (
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
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-0.5">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={() => handleToggle(item.key)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部按钮 */}
      <div className="px-6 py-4 space-y-3">
        <button className="w-full py-3 text-primary hover:bg-primary/10 rounded-xl transition-colors">
          下载我的数据
        </button>
        <button className="w-full py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
          删除我的账号
        </button>
      </div>
    </div>
  );
}