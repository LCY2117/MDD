import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sun, Cloud, CloudRain, Calendar as CalendarIcon, TrendingUp, Plus, BookOpen, Edit3 } from 'lucide-react';
import { BottomNav } from '../components/community/bottom-nav';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

interface MoodEntry {
  id: string;
  mood: 'sunny' | 'cloudy' | 'rainy';
  note?: string;
  date: string;
  score: number; // 1-3, 3 is best
}

export default function MoodPage() {
  const navigate = useNavigate();
  
  const moods = [
    { id: 'sunny', icon: Sun, label: '还不错', color: 'text-yellow-500', bgColor: 'bg-yellow-50', score: 3 },
    { id: 'cloudy', icon: Cloud, label: '一般般', color: 'text-gray-400', bgColor: 'bg-gray-50', score: 2 },
    { id: 'rainy', icon: CloudRain, label: '有点难', color: 'text-blue-400', bgColor: 'bg-blue-50', score: 1 },
  ];
  
  // 模拟过去7天的数据
  const mockEntries: MoodEntry[] = [
    { id: '7', mood: 'cloudy', note: '今天感觉还可以', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), score: 2 },
    { id: '6', mood: 'rainy', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), score: 1 },
    { id: '5', mood: 'cloudy', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), score: 2 },
    { id: '4', mood: 'sunny', note: '今天心情不错！', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), score: 3 },
    { id: '3', mood: 'cloudy', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), score: 2 },
    { id: '2', mood: 'sunny', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 3 },
    { id: '1', mood: 'cloudy', date: new Date().toISOString(), score: 2 },
  ];
  
  const [entries, setEntries] = useState(mockEntries);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // 准备图表数据
  const chartData = entries.slice().reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
    心情指数: entry.score,
  }));
  
  const handleAddMood = () => {
    if (!selectedMood) return;
    
    const moodData = moods.find(m => m.id === selectedMood);
    if (!moodData) return;
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood as 'sunny' | 'cloudy' | 'rainy',
      note: note.trim() || undefined,
      date: new Date().toISOString(),
      score: moodData.score,
    };
    
    setEntries([newEntry, ...entries]);
    setSelectedMood(null);
    setNote('');
    setShowAddForm(false);
  };
  
  const getMoodIcon = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData ? moodData.icon : Cloud;
  };
  
  const getMoodLabel = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData ? moodData.label : '一般般';
  };
  
  const getMoodColor = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData ? moodData.color : 'text-gray-400';
  };
  
  // 计算统计
  const avgScore = entries.length > 0 
    ? (entries.reduce((sum, e) => sum + e.score, 0) / entries.length).toFixed(1)
    : '0.0';
  
  const sunnyDays = entries.filter(e => e.mood === 'sunny').length;
  const cloudyDays = entries.filter(e => e.mood === 'cloudy').length;
  const rainyDays = entries.filter(e => e.mood === 'rainy').length;
  
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
          <h3>情绪记录</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* 添加心情表单 */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-6 pt-6 pb-4 border-b border-border/50"
        >
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <h4 className="mb-4">今天感觉怎么样？</h4>
            <div className="flex gap-3 mb-4">
              {moods.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${
                      isSelected 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : `${mood.bgColor} border-2 border-transparent hover:border-border`
                    }`}
                  >
                    <Icon className={`w-7 h-7 ${isSelected ? 'text-primary' : mood.color}`} />
                    <span className={`text-sm ${isSelected ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <textarea
              placeholder="记录一下今天发生了什么... (可选)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedMood(null);
                  setNote('');
                }}
                className="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddMood}
                disabled={!selectedMood}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                记录
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* 日记入口 */}
      <div className="px-6 pt-6 pb-4">
        <div 
          onClick={() => navigate('/diary/new')}
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Edit3 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-primary">写日记</h4>
              <p className="text-sm text-muted-foreground">记录生活点滴，感受成长的力量</p>
            </div>
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
      
      {/* 情绪趋势图 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h4>情绪趋势</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>近7天</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  domain={[0, 3]} 
                  ticks={[1, 2, 3]}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '8px 12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="心情指数" 
                  stroke="#5FA9A3" 
                  strokeWidth={3}
                  dot={{ fill: '#5FA9A3', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-card rounded-2xl p-4 text-center border border-border/50">
            <div className="text-2xl font-medium text-primary mb-1">{avgScore}</div>
            <div className="text-xs text-muted-foreground">平均分</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 text-center border border-yellow-200">
            <div className="text-2xl font-medium text-yellow-600 mb-1">{sunnyDays}</div>
            <div className="text-xs text-muted-foreground">还不错</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-200">
            <div className="text-2xl font-medium text-gray-600 mb-1">{cloudyDays}</div>
            <div className="text-xs text-muted-foreground">一般般</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-200">
            <div className="text-2xl font-medium text-blue-600 mb-1">{rainyDays}</div>
            <div className="text-xs text-muted-foreground">有点难</div>
          </div>
        </div>
      </div>
      
      {/* 历史记录 */}
      <div className="px-6 py-4">
        <h4 className="mb-3">历史记录</h4>
        <div className="space-y-3">
          {entries.map((entry) => {
            const Icon = getMoodIcon(entry.mood);
            return (
              <div
                key={entry.id}
                className="bg-card rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${moods.find(m => m.id === entry.mood)?.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${getMoodColor(entry.mood)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{getMoodLabel(entry.mood)}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('zh-CN', { 
                          month: '2-digit', 
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-muted-foreground">{entry.note}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}