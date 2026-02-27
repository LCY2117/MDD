import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Users, Heart, Calendar, AlertTriangle } from 'lucide-react';
import { useUser } from '../../contexts/user-context';

export default function FamilySettingsPage() {
  const navigate = useNavigate();
  const { userMode } = useUser();
  const [settings, setSettings] = useState({
    showMoodTrend: true,
    showDiary: false,
    showMedication: true,
    allowEmergencyContact: true,
    showActivityLog: false,
  });
  
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const privacySettings = [
    {
      key: 'showMoodTrend' as const,
      icon: Heart,
      title: '情绪趋势共享',
      description: '家属可以查看你的情绪记录和趋势图',
    },
    {
      key: 'showDiary' as const,
      icon: Calendar,
      title: '日记共享',
      description: '与家属分享你的康复日记',
    },
    {
      key: 'showMedication' as const,
      icon: Calendar,
      title: '服药记录共享',
      description: '家属可以查看你的服药打卡记录',
    },
    {
      key: 'allowEmergencyContact' as const,
      icon: Shield,
      title: '紧急联系权限',
      description: '在检测到危机信号时通知家属',
    },
    {
      key: 'showActivityLog' as const,
      icon: Users,
      title: '活动记录共享',
      description: '家属可以看到你的活跃时间',
    },
  ];
  
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
          <h3>家庭设置</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      <div className="px-6 pt-6">
        {/* 隐私提示（仅患者可见） */}
        {userMode === 'patient' && (
          <div className="bg-primary/10 rounded-2xl p-5 mb-6 border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="mb-1 text-primary">你的隐私很重要</h4>
                <p className="text-sm text-muted-foreground">
                  你可以自主控制与家属分享的内容。所有设置都可以随时调整。
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* 隐私设置列表（仅患者可见） */}
        {userMode === 'patient' && (
          <div className="space-y-3 mb-6">
            <h4 className="mb-3">隐私与共享</h4>
            {privacySettings.map((setting) => {
              const Icon = setting.icon;
              const isEnabled = settings[setting.key];
              
              return (
                <div
                  key={setting.key}
                  className="bg-card rounded-2xl p-5 border border-border/50"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isEnabled ? 'bg-primary/10' : 'bg-secondary'
                    }`}>
                      <Icon className={`w-6 h-6 ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{setting.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {setting.description}
                      </p>
                      <button
                        onClick={() => toggleSetting(setting.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isEnabled
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground'
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">已开启</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span className="text-sm">已关闭</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* 家庭成员管理 */}
        <div className="space-y-3 mb-6">
          <h4 className="mb-3">成员管理</h4>
          {userMode === 'caregiver' && (
            <button
              onClick={() => navigate('/family/invite')}
              className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4>邀请家庭成员</h4>
                  <p className="text-sm text-muted-foreground">添加新的家属</p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>
          )}
          
          <button
            onClick={() => navigate('/family/members')}
            className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-left">
                <h4>查看家庭成员</h4>
                <p className="text-sm text-muted-foreground">
                  {userMode === 'caregiver' ? '管理成员权限' : '查看已连接的家属'}
                </p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
          </button>
          
          {userMode === 'caregiver' && (
            <button
              onClick={() => navigate('/family-alerts')}
              className="w-full bg-card rounded-2xl p-4 border border-destructive/30 hover:shadow-sm transition-shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div className="text-left">
                  <h4>紧急提醒设置</h4>
                  <p className="text-sm text-muted-foreground">配置危机信号通知</p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>
          )}
        </div>
        
        {/* 危险操作（仅家属可见） */}
        {userMode === 'caregiver' && (
          <div className="space-y-3 mb-6">
            <h4 className="mb-3 text-destructive">危险操作</h4>
            <button className="w-full bg-destructive/10 rounded-2xl p-4 border border-destructive/20 hover:bg-destructive/20 transition-colors">
              <h4 className="text-destructive mb-1">解散家庭</h4>
              <p className="text-sm text-muted-foreground">
                移除所有家庭成员，此操作不可恢复
              </p>
            </button>
          </div>
        )}
        
        {/* 患者退出家庭 */}
        {userMode === 'patient' && (
          <div className="space-y-3 mb-6">
            <h4 className="mb-3 text-destructive">退出家庭</h4>
            <button className="w-full bg-destructive/10 rounded-2xl p-4 border border-destructive/20 hover:bg-destructive/20 transition-colors">
              <h4 className="text-destructive mb-1">退出当前家庭</h4>
              <p className="text-sm text-muted-foreground">
                断开与所有家属的连接，你可以重新加入
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}