import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Bell, User, Lock, Eye, Smartphone, HelpCircle, FileText, ChevronRight, UserCog } from 'lucide-react';
import { ThemeToggle } from '../components/theme-toggle';

export default function SettingsPage() {
  const navigate = useNavigate();
  
  const settingSections = [
    {
      title: '账号与隐私',
      items: [
        { icon: User, label: '账号设置', to: '/settings/account', description: '昵称、头像、个人资料' },
        { icon: UserCog, label: '账户身份', to: '/settings/user-mode', description: '患者模式 / 家属模式' },
        { icon: Shield, label: '隐私设置', to: '/settings/privacy', description: '匿名、可见性控制' },
        { icon: Lock, label: '安全设置', to: '/settings/security', description: '密码、登录设备' },
      ],
    },
    {
      title: '通知与提醒',
      items: [
        { icon: Bell, label: '通知设置', to: '/settings/notifications', description: '消息推送、提醒管理' },
      ],
    },
    {
      title: '显示设置',
      items: [
        { icon: Eye, label: '显示设置', to: '/settings/display', description: '字体大小、夜间模式' },
      ],
    },
    {
      title: '帮助与支持',
      items: [
        { icon: HelpCircle, label: '帮助中心', to: '/help', description: '常见问题、使用指南' },
        { icon: FileText, label: '用户协议', to: '/settings/terms', description: '服务条款、隐私政策' },
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
          <h3>设置</h3>
          <ThemeToggle />
        </div>
      </header>
      
      {/* 设置列表 */}
      <div className="px-6 py-6 space-y-6">
        {settingSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h4 className="mb-3 px-1 text-muted-foreground">{section.title}</h4>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIdx}
                    onClick={() => navigate(item.to)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors text-left ${
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
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* 版本信息 */}
      <div className="px-6 pb-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>心语社区 v1.0.0</p>
          <p className="mt-1">用心陪伴每一天</p>
        </div>
      </div>
    </div>
  );
}