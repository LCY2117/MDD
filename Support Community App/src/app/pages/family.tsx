import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Heart, 
  UserPlus, 
  Settings, 
  TrendingUp, 
  BookOpen, 
  Bell,
  Users,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  MessageCircle,
  Calendar,
  Award
} from 'lucide-react';
import { BottomNav } from '../components/community/bottom-nav';
import { motion } from 'motion/react';
import { useUser } from '../contexts/user-context';

export default function FamilyPage() {
  const navigate = useNavigate();
  const { userMode } = useUser();
  const [showMoodTrend, setShowMoodTrend] = useState(true);
  
  // 模拟家庭成员数据
  const familyMembers = [
    {
      id: '1',
      name: '妈妈',
      role: 'caregiver',
      avatar: '👩',
      status: 'online',
      relation: '家属',
    },
    {
      id: '2',
      name: '爸爸',
      role: 'caregiver',
      avatar: '👨',
      status: 'offline',
      relation: '家属',
    },
  ];
  
  // 模拟互动记录
  const interactions = [
    {
      id: '1',
      type: 'encouragement',
      from: '妈妈',
      message: '今天也要加油哦，我一直陪着你 ❤️',
      time: '2小时前',
    },
    {
      id: '2',
      type: 'checkin',
      from: '爸爸',
      message: '按时吃药了吗？记得好好休息',
      time: '5小时前',
    },
  ];
  
  // 家属专属内容
  const caregiverResources = [
    {
      title: '如何陪伴抑郁症患者',
      category: '陪伴指南',
      icon: Heart,
      path: '/resources/article/how-to-support',
    },
    {
      title: '识别危机信号',
      category: '应急处理',
      icon: Bell,
      path: '/resources/crisis-signals',
    },
    {
      title: '家属情绪自我照顾',
      category: '自我关怀',
      icon: Sparkles,
      path: '/resources/caregiver-selfcare',
    },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h1>家庭</h1>
          <button
            onClick={() => navigate('/family/settings')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* 当前身份显示 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              userMode === 'patient' ? 'bg-primary/10' : 'bg-rose-500/10'
            }`}>
              {userMode === 'patient' ? (
                <Users className="w-7 h-7 text-primary" />
              ) : (
                <Heart className="w-7 h-7 text-rose-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4>{userMode === 'patient' ? '我的家庭' : '家属陪伴'}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {userMode === 'patient' 
                  ? '与家人保持连接，获得温暖支持'
                  : '陪伴和支持你关心的人'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 家庭成员 */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3>家庭成员</h3>
          <button
            onClick={() => navigate('/family/invite')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            <UserPlus className="w-4 h-4" />
            邀请成员
          </button>
        </div>
        
        <div className="space-y-3">
          {familyMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {member.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h4>{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.relation}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/messages/${member.id}`)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 情绪趋势共享（患者模式） */}
      {userMode === 'patient' && (
        <div className="px-6 py-4">
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4>情绪趋势共享</h4>
              </div>
              <button
                onClick={() => setShowMoodTrend(!showMoodTrend)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {showMoodTrend ? (
                  <Eye className="w-5 h-5 text-primary" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {showMoodTrend 
                ? '家属可以查看你的情绪记录和趋势，更好地理解和支持你'
                : '已关闭情绪趋势共享，家属无法查看你的情绪记录'}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>你随时可以调整隐私设置</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 家属视角：患者情绪趋势 */}
      {userMode === 'caregiver' && showMoodTrend && (
        <div className="px-6 py-4">
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4>TA的情绪趋势</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">本周平均情绪</span>
                <span className="text-sm font-medium">😊 较好</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">连续打卡天数</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Award className="w-4 h-4 text-primary" />
                  7天
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">最近服药记录</span>
                <span className="text-sm font-medium text-green-600">按时服用</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/family/mood-detail')}
              className="w-full mt-4 py-3 bg-secondary text-foreground rounded-xl hover:bg-accent transition-colors text-sm"
            >
              查看详细趋势
            </button>
          </div>
        </div>
      )}
      
      {/* 家庭互动 */}
      <div className="px-6 py-4">
        <h3 className="mb-4">家庭互动</h3>
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <motion.div
              key={interaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-4 border border-border/50"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {interaction.type === 'encouragement' ? (
                    <Heart className="w-5 h-5 text-primary" />
                  ) : (
                    <Calendar className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm">{interaction.from}</h4>
                    <span className="text-xs text-muted-foreground">{interaction.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{interaction.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <button
          onClick={() => navigate('/family/encourage')}
          className="w-full mt-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          发送鼓励
        </button>
      </div>
      
      {/* 家属专属内容（家属模式） */}
      {userMode === 'caregiver' && (
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3>家属专属内容</h3>
          </div>
          <div className="space-y-3">
            {caregiverResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(resource.path)}
                  className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                        {resource.category}
                      </span>
                      <h4 className="mt-2">{resource.title}</h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* AI家庭助手提示 */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1">AI家庭助手</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {userMode === 'patient' 
                  ? '不知道如何和家人沟通？让AI助手帮你表达'
                  : '不知道如何陪伴患者？向AI助手寻求建议'}
              </p>
              <button
                onClick={() => navigate('/ai-chat', { state: { context: userMode === 'patient' ? '家庭沟通' : '陪伴建议' } })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                咨询AI助手
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}