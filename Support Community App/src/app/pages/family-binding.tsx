import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, UserPlus, Users, Link as LinkIcon, QrCode, Copy, CheckCircle, X, AlertTriangle, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  relationship: string;
  role: 'patient' | 'guardian';
  bindTime: string;
  status: 'active' | 'pending';
}

export default function FamilyBindingPage() {
  const navigate = useNavigate();
  const [showBindModal, setShowBindModal] = useState(false);
  const [bindMethod, setBindMethod] = useState<'code' | 'qr' | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode] = useState('XY2024');
  
  // 模拟绑定的家庭成员
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: '小明',
      avatar: '👦',
      relationship: '儿子',
      role: 'patient',
      bindTime: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: '李女士',
      avatar: '👩',
      relationship: '配偶',
      role: 'guardian',
      bindTime: '2024-01-10',
      status: 'active',
    },
  ]);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('邀请码已复制');
  };
  
  const handleBindWithCode = () => {
    if (!inviteCode.trim()) {
      alert('请输入邀请码');
      return;
    }
    
    // 模拟绑定
    alert('绑定成功！');
    setShowBindModal(false);
    setInviteCode('');
  };
  
  const handleUnbind = (id: string) => {
    if (confirm('确定要解除绑定吗？')) {
      setFamilyMembers(familyMembers.filter(m => m.id !== id));
    }
  };
  
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
          <h3>家庭绑定</h3>
          <button
            onClick={() => setShowBindModal(true)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
      
      {/* 说明卡片 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="mb-1 text-primary">关于家庭绑定</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                家庭成员绑定后，家属可以接收患者的紧急求助通知，并查看患者授权分享的情绪状态。所有信息都需要患者主动授权才会分享。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 已绑定成员 */}
      <div className="px-6 py-4">
        <h4 className="mb-3">已绑定成员 ({familyMembers.length})</h4>
        <div className="space-y-3">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-card rounded-2xl p-4 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{member.name}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      member.role === 'patient'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {member.role === 'patient' ? '患者' : '家属'}
                    </span>
                    {member.status === 'pending' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-50 text-yellow-600">
                        待确认
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.relationship} · {new Date(member.bindTime).toLocaleDateString('zh-CN')} 绑定
                  </p>
                </div>
                <button
                  onClick={() => handleUnbind(member.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 权限说明 */}
      <div className="px-6 py-4">
        <h4 className="mb-3">家属可以</h4>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          {[
            { icon: AlertTriangle, text: '接收患者的紧急求助通知', color: 'text-orange-500' },
            { icon: Phone, text: '快速联系专业心理热线', color: 'text-green-500' },
            { icon: Users, text: '查看患者授权分享的情绪记录', color: 'text-blue-500' },
            { icon: CheckCircle, text: '加入家属专属交流社区', color: 'text-primary' },
          ].map((item, idx, arr) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-4 ${
                  idx !== arr.length - 1 ? 'border-b border-border/30' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                <span className="text-sm">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 绑定模态框 */}
      {showBindModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowBindModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 bg-background rounded-3xl p-6 shadow-2xl max-w-md mx-auto"
          >
            <h3 className="mb-4">添加家庭成员</h3>
            
            {!bindMethod ? (
              <div className="space-y-3">
                <button
                  onClick={() => setBindMethod('code')}
                  className="w-full flex items-center gap-3 p-4 bg-card border border-border/50 rounded-2xl hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="mb-0.5">使用邀请码</h4>
                    <p className="text-sm text-muted-foreground">输入对方的邀请码进行绑定</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setBindMethod('qr')}
                  className="w-full flex items-center gap-3 p-4 bg-card border border-border/50 rounded-2xl hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="mb-0.5">生成我的邀请码</h4>
                    <p className="text-sm text-muted-foreground">让对方扫码或输入邀请码</p>
                  </div>
                </button>
              </div>
            ) : bindMethod === 'code' ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  请输入对方提供的邀请码
                </p>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="请输入邀请码"
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all mb-4 text-center text-lg font-medium tracking-widest"
                  maxLength={10}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setBindMethod(null);
                      setInviteCode('');
                    }}
                    className="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors"
                  >
                    返回
                  </button>
                  <button
                    onClick={handleBindWithCode}
                    className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    确认绑定
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  将此邀请码分享给家人
                </p>
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-2 tracking-widest">
                    {generatedCode}
                  </div>
                  <p className="text-xs text-muted-foreground">24小时内有效</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors mb-3"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制邀请码</span>
                </button>
                <button
                  onClick={() => setBindMethod(null)}
                  className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  完成
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
