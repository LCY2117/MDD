import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Camera, Mail, Phone, Calendar, Edit, ChevronRight } from 'lucide-react';

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: '小雨',
    avatar: '',
    bio: '慢慢来，一切都会好起来的',
    email: 'user@example.com',
    phone: '138****8888',
    birthday: '1995-06-15',
    joinDate: '2024-01-15',
  });
  
  const accountItems = [
    {
      icon: User,
      label: '昵称',
      value: user.name,
      action: '修改',
    },
    {
      icon: Edit,
      label: '个人简介',
      value: user.bio,
      action: '编辑',
    },
    {
      icon: Mail,
      label: '邮箱',
      value: user.email,
      action: '修改',
    },
    {
      icon: Phone,
      label: '手机号',
      value: user.phone,
      action: '更换',
    },
    {
      icon: Calendar,
      label: '生日',
      value: new Date(user.birthday).toLocaleDateString('zh-CN'),
      action: '设置',
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
          <h3>账号设置</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      {/* 头像编辑 */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl">
              {user.avatar || user.name.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            点击头像更换照片
          </p>
        </div>
      </div>
      
      {/* 账号信息 */}
      <div className="px-6 py-4">
        <h4 className="mb-3 px-1 text-muted-foreground">基本信息</h4>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          {accountItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors text-left ${
                  index !== accountItems.length - 1 ? 'border-b border-border/30' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-0.5 text-sm text-muted-foreground">{item.label}</h4>
                  <p className="text-foreground">{item.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary">{item.action}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 账号安全 */}
      <div className="px-6 py-4">
        <h4 className="mb-3 px-1 text-muted-foreground">账号安全</h4>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors border-b border-border/30">
            <div>
              <h4 className="mb-0.5">修改密码</h4>
              <p className="text-sm text-muted-foreground">定期更换密码保护账号安全</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors">
            <div>
              <h4 className="mb-0.5">登录设备管理</h4>
              <p className="text-sm text-muted-foreground">查看和管理登录过的设备</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      {/* 账号信息 */}
      <div className="px-6 py-4">
        <div className="bg-accent/30 rounded-2xl p-5 border border-primary/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">账号ID</span>
            <span className="text-sm font-mono">USER_{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">注册时间</span>
            <span className="text-sm">{new Date(user.joinDate).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}