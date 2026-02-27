import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, Calendar, Heart, Pill, Activity, Award } from 'lucide-react';

export default function FamilyMoodDetailPage() {
  const navigate = useNavigate();
  
  // 模拟情绪数据
  const moodData = [
    { day: '周一', mood: 7, activity: '散步30分钟' },
    { day: '周二', mood: 6, activity: '听音乐放松' },
    { day: '周三', mood: 8, activity: '和朋友聊天' },
    { day: '周四', mood: 7, activity: '看电影' },
    { day: '周五', mood: 9, activity: '户外活动' },
    { day: '周六', mood: 8, activity: '阅读写作' },
    { day: '周日', mood: 7, activity: '家庭聚会' },
  ];
  
  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    return '😔';
  };
  
  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-green-500';
    if (mood >= 6) return 'bg-blue-500';
    if (mood >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
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
          <h3>情绪趋势详情</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      <div className="px-6 pt-6">
        {/* 总体情况 */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 mb-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h4>本周总体情况</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 rounded-xl p-4">
              <div className="text-3xl mb-1">😊</div>
              <div className="text-sm text-muted-foreground mb-1">平均情绪</div>
              <div className="text-xl font-medium">7.4/10</div>
            </div>
            <div className="bg-card/50 rounded-xl p-4">
              <div className="text-3xl mb-1">📈</div>
              <div className="text-sm text-muted-foreground mb-1">情绪趋势</div>
              <div className="text-xl font-medium text-green-600">稳定向上</div>
            </div>
          </div>
        </div>
        
        {/* 每日情绪 */}
        <div className="mb-6">
          <h4 className="mb-4">每日情绪记录</h4>
          <div className="space-y-3">
            {moodData.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getMoodEmoji(item.mood)}</div>
                    <div>
                      <h4 className="text-sm">{item.day}</h4>
                      <p className="text-xs text-muted-foreground">情绪值: {item.mood}/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getMoodColor(item.mood)}`}
                        style={{ width: `${item.mood * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>{item.activity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 其他指标 */}
        <div className="space-y-3 mb-6">
          <h4 className="mb-4">其他健康指标</h4>
          
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Pill className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4>服药记录</h4>
                <p className="text-sm text-muted-foreground">本周按时服用</p>
              </div>
              <div className="text-xl font-medium text-green-600">7/7</div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className="flex-1 h-2 bg-green-500 rounded-full"
                />
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4>活动记录</h4>
                <p className="text-sm text-muted-foreground">户外活动时间</p>
              </div>
              <div className="text-xl font-medium">4.5小时</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[30, 45, 60, 40, 70, 50, 55].map((minutes, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded"
                    style={{ height: `${minutes}px` }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {['一', '二', '三', '四', '五', '六', '日'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4>连续打卡</h4>
                <p className="text-sm text-muted-foreground">坚持记录情绪</p>
              </div>
              <div className="text-xl font-medium text-primary">30天</div>
            </div>
          </div>
        </div>
        
        {/* 建议 */}
        <div className="bg-accent/30 rounded-2xl p-5 mb-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-2">陪伴建议</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• TA本周情绪稳定，可以适当鼓励增加社交活动</li>
                <li>• 服药记录良好，记得给予肯定和鼓励</li>
                <li>• 户外活动对情绪有积极影响，可以一起散步</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
