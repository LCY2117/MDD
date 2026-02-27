import { useNavigate } from 'react-router';
import { ArrowLeft, Users, Heart, Info, CheckCircle } from 'lucide-react';
import { useUser } from '../../contexts/user-context';

export default function UserModeSettingsPage() {
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUser();
  
  const handleModeChange = (mode: 'patient' | 'caregiver') => {
    if (mode === userMode) return;
    
    setUserMode(mode);
    
    // 切换后跳转到对应页面
    setTimeout(() => {
      if (mode === 'patient') {
        navigate('/');
      } else {
        navigate('/family');
      }
    }, 500);
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
          <h3>账户身份</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      <div className="px-6 pt-6">
        {/* 说明 */}
        <div className="bg-accent/30 rounded-2xl p-5 mb-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-2">选择你的身份</h4>
              <p className="text-sm text-muted-foreground">
                不同身份会看到不同的内容和功能。患者身份侧重于自我记录和获得支持，家属身份侧重于陪伴和照顾。
              </p>
            </div>
          </div>
        </div>
        
        {/* 当前身份 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h4>当前身份</h4>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {userMode === 'patient' ? '患者模式' : '家属模式'}
            </span>
          </div>
        </div>
        
        {/* 身份选择 */}
        <div className="space-y-4 mb-6">
          {/* 患者模式 */}
          <button
            onClick={() => handleModeChange('patient')}
            className={`w-full text-left transition-all ${
              userMode === 'patient'
                ? 'bg-primary/10 border-2 border-primary shadow-sm'
                : 'bg-card border-2 border-border/50 hover:border-primary/30'
            } rounded-2xl p-5`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                userMode === 'patient' ? 'bg-primary/20' : 'bg-primary/10'
              }`}>
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3>患者模式</h3>
                  {userMode === 'patient' && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  适合正在经历抑郁症的朋友，记录情绪、获得支持、与家人保持连接
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>情绪日记和打卡</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>匿名社区互助</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>专业资源和AI陪伴</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>与家人保持连接</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
          
          {/* 家属模式 */}
          <button
            onClick={() => handleModeChange('caregiver')}
            className={`w-full text-left transition-all ${
              userMode === 'caregiver'
                ? 'bg-rose-500/10 border-2 border-rose-500 shadow-sm'
                : 'bg-card border-2 border-border/50 hover:border-rose-500/30'
            } rounded-2xl p-5`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                userMode === 'caregiver' ? 'bg-rose-500/20' : 'bg-rose-500/10'
              }`}>
                <Heart className="w-7 h-7 text-rose-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3>家属模式</h3>
                  {userMode === 'caregiver' && (
                    <CheckCircle className="w-5 h-5 text-rose-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  适合照顾者和家属，学习如何陪伴、查看健康趋势、获得专业指导
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>查看患者健康趋势</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>陪伴技巧和沟通建议</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>紧急情况提醒</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>家属自我关怀资源</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
        
        {/* 温馨提示 */}
        <div className="bg-accent/20 rounded-2xl p-4 mb-6 border border-border/30">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium text-foreground">温馨提示：</span>
            切换身份后会自动跳转到对应的功能页面。你可以随时在设置中更改身份。
          </p>
        </div>
        
        {/* 家属模式入口 */}
        {userMode === 'patient' && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20">
            <h4 className="mb-2">家属模式功能</h4>
            <p className="text-sm text-muted-foreground mb-4">
              如果你是患者的家人或朋友，切换到家属模式可以获得更多陪伴指导和支持工具。
            </p>
            <button
              onClick={() => navigate('/family-mode')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              了解家属模式
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
