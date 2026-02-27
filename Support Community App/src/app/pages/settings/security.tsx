import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Smartphone, ShieldCheck, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function SecuritySettingsPage() {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  
  // 模拟登录设备
  const devices = [
    {
      id: 1,
      device: 'iPhone 13 Pro',
      location: '北京市',
      time: '当前设备',
      current: true,
    },
    {
      id: 2,
      device: 'Windows 电脑',
      location: '上海市',
      time: '3天前',
      current: false,
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
          <h3>安全设置</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      <div className="px-6 py-6 space-y-6">
        {/* 安全提示 */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="mb-1">您的账号很安全</h4>
            <p className="text-sm text-muted-foreground">
              定期更新密码，保持账号安全
            </p>
          </div>
        </div>
        
        {/* 修改密码 */}
        <div>
          <h4 className="mb-3 px-1 text-muted-foreground">密码管理</h4>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {!changePasswordMode ? (
              <button
                onClick={() => setChangePasswordMode(true)}
                className="w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-0.5">修改密码</h4>
                  <p className="text-sm text-muted-foreground">建议定期更换密码</p>
                </div>
              </button>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4>修改密码</h4>
                  <button
                    onClick={() => setChangePasswordMode(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    取消
                  </button>
                </div>
                
                {/* 原密码 */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">原密码</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder="请输入原密码"
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-lg transition-colors"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* 新密码 */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">新密码</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="请输入新密码（至少6位）"
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-lg transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    密码应包含字母和数字，长度至少6位
                  </p>
                </div>
                
                {/* 确认密码 */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">确认新密码</label>
                  <input
                    type="password"
                    placeholder="请再次输入新密码"
                    className="w-full px-4 py-3 bg-secondary rounded-xl border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                
                <button className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                  确认修改
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 两步验证 */}
        <div>
          <h4 className="mb-3 px-1 text-muted-foreground">两步验证</h4>
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-0.5">两步验证</h4>
                  <p className="text-sm text-muted-foreground">登录时需要额外验证</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-primary' : 'bg-border'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {twoFactorEnabled && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>已启用短信验证码登录保护</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 登录设备 */}
        <div>
          <h4 className="mb-3 px-1 text-muted-foreground">登录设备</h4>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {devices.map((device, idx) => (
              <div
                key={device.id}
                className={`p-4 flex items-center gap-3 ${
                  idx !== devices.length - 1 ? 'border-b border-border/30' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  device.current ? 'bg-primary/10' : 'bg-secondary'
                }`}>
                  <Smartphone className={`w-5 h-5 ${device.current ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4>{device.device}</h4>
                    {device.current && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        当前
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {device.location} · {device.time}
                  </p>
                </div>
                {!device.current && (
                  <button className="text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors">
                    移除
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 安全建议 */}
        <div className="bg-secondary rounded-2xl p-4 border border-border/30">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="mb-2">安全建议</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 定期更换密码，避免使用简单密码</li>
                <li>• 不要在公共设备上保持登录状态</li>
                <li>• 发现异常登录及时修改密码</li>
                <li>• 开启两步验证提升账号安全性</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}