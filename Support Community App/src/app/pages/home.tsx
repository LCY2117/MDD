import { useState } from 'react';
import { Link } from 'react-router';
import { Sun, Cloud, CloudRain, Heart, TrendingUp, BookOpen, Phone, ChevronRight, Bot } from 'lucide-react';
import { BottomNav } from '../components/community/bottom-nav';
import { CrisisBanner } from '../components/community/crisis-banner';
import { PostCard, Post } from '../components/community/post-card';
import { motion } from 'motion/react';

export default function HomePage() {
  const [moodToday, setMoodToday] = useState<string | null>(null);
  
  const moods = [
    { id: 'sunny', icon: Sun, label: '还不错', color: 'text-yellow-500' },
    { id: 'cloudy', icon: Cloud, label: '一般般', color: 'text-gray-400' },
    { id: 'rainy', icon: CloudRain, label: '有点难', color: 'text-blue-400' },
  ];
  
  const quickActions = [
    { icon: Bot, label: 'AI问答', to: '/ai-chat', color: 'bg-purple-50 text-purple-600' },
    { icon: Heart, label: '情绪记录', to: '/mood', color: 'bg-rose-50 text-rose-600' },
    { icon: BookOpen, label: '知识科普', to: '/resources', color: 'bg-blue-50 text-blue-600' },
    { icon: Phone, label: '紧急求助', to: '/resources', color: 'bg-primary/10 text-primary' },
  ];
  
  const recommendedPosts: Post[] = [
    {
      id: '1',
      author: { name: '小云', isAnonymous: false },
      content: '今天第一次尝试冥想，虽然只有5分钟，但感觉心里平静了一些。分享给大家，也许你们也可以试试。',
      tags: ['自我照顾', '冥想'],
      likes: 42,
      comments: 8,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      author: { name: '匿名用户', isAnonymous: true },
      content: '今天又是艰难的一天，但我还是坚持起床了。对我来说这已经是很大的进步了。',
      tags: ['每日打卡'],
      likes: 128,
      comments: 23,
      isLiked: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isPinned: true,
    },
  ];
  
  const [posts, setPosts] = useState(recommendedPosts);
  
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部欢迎区 */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-2">你好呀</h1>
          <p className="text-muted-foreground">今天感觉怎么样？</p>
        </motion.div>
        
        {/* 今日心情 */}
        <div className="mt-6 bg-card rounded-2xl p-5 shadow-sm border border-border/50">
          <h3 className="mb-4">今日心情</h3>
          <div className="flex gap-3">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = moodToday === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setMoodToday(mood.id)}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'bg-secondary border-2 border-transparent hover:border-border'
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
          {moodToday && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 text-sm text-muted-foreground text-center"
            >
              记录了你的心情，继续保持关注自己的感受 💙
            </motion.p>
          )}
        </div>
      </div>
      
      {/* 快捷入口 */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.to}>
                <div className="bg-card rounded-2xl p-3 text-center shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl ${action.color} mx-auto mb-2 flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-foreground">{action.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* 危机支持横幅 */}
      <div className="px-6 mt-6">
        <CrisisBanner />
      </div>
      
      {/* 推荐内容 */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3>为你推荐</h3>
          <Link to="/community" className="flex items-center gap-1 text-sm text-primary hover:underline">
            查看更多
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
        
        {/* 查看更多 */}
        <Link to="/community">
          <button className="w-full mt-4 py-3 text-primary bg-secondary rounded-xl hover:bg-accent transition-colors">
            浏览社区更多内容
          </button>
        </Link>
      </div>
      
      <BottomNav />
    </div>
  );
}