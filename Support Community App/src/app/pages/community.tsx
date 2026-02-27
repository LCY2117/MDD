import { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Heart, BookOpen, Video, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/community/bottom-nav';
import { PostCard, Post } from '../components/community/post-card';
import { EmptyState } from '../components/community/empty-state';

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hot' | 'latest' | 'following' | 'knowledge'>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const tabs = [
    { id: 'hot' as const, label: '热门', icon: TrendingUp },
    { id: 'latest' as const, label: '最新', icon: Clock },
    { id: 'following' as const, label: '关注', icon: Heart },
    { id: 'knowledge' as const, label: '知识', icon: BookOpen },
  ];
  
  const mockPosts: Post[] = [
    {
      id: '1',
      author: { name: '小雨', isAnonymous: false },
      content: '分享一个帮助我度过低谷期的方法：每天写下三件小确幸。可以很简单，比如今天的阳光很好，或者喝到了喜欢的咖啡。慢慢地，会发现生活中还是有很多美好的。',
      tags: ['自我照顾', '经验分享'],
      likes: 256,
      comments: 45,
      isLiked: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      isPinned: true,
    },
    {
      id: '2',
      author: { name: '匿名用户', isAnonymous: true },
      content: '今天终于鼓起勇气去看了心理咨询师。虽然还是很紧张，但咨询师很温和，让我感觉被理解了。想告诉大家，寻求专业帮助不是软弱，是勇敢。',
      tags: ['心理咨询', '勇气'],
      likes: 342,
      comments: 67,
      isLiked: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      author: { name: '小星', isAnonymous: false },
      content: '给大家推荐一些我常听的舒缓音乐，在焦虑的时候听会好一些。希望也能帮到你们。',
      images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'],
      tags: ['音乐分享', '放松'],
      likes: 89,
      comments: 12,
      isLiked: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      author: { name: '匿名用户', isAnonymous: true },
      content: '今天第30天坚持吃药了。虽然效果还不是很明显，但我会继续坚持。相信会好起来的。',
      tags: ['每日打卡', '坚持'],
      likes: 178,
      comments: 31,
      isLiked: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const [posts, setPosts] = useState(mockPosts);
  
  const knowledgeItems = [
    {
      title: '什么是抑郁症？',
      category: '基础知识',
      icon: BookOpen,
      summary: '了解抑郁症的症状、成因和常见误区',
      articleId: 'what-is-depression',
    },
    {
      title: '如何陪伴抑郁症患者',
      category: '家属指南',
      icon: Heart,
      summary: '给家属和朋友的实用建议',
      articleId: 'how-to-support',
    },
    {
      title: '认识常用抗抑郁药物',
      category: '用药指南',
      icon: FileText,
      summary: '药物作用、副作用和注意事项',
      articleId: 'medication-guide',
    },
    {
      title: '心理咨询有哪些类型',
      category: '治疗方式',
      icon: Video,
      summary: '了解不同的心理治疗方法',
      articleId: 'therapy-types',
    },
  ];
  
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };
  
  const filteredPosts = searchQuery 
    ? posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts;
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 pt-6 pb-3 border-b border-border/50">
        <h1 className="mb-4">社区</h1>
        
        {/* 搜索框 */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索话题或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate('/search')}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              readOnly
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-colors ${
              showFilters 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-card border-border hover:bg-secondary'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        {/* 筛选器（展开时显示） */}
        {showFilters && (
          <div className="mb-4 p-4 bg-card rounded-xl border border-border">
            <h4 className="mb-3">话题筛选</h4>
            <div className="flex flex-wrap gap-2">
              {['全部', '经验分享', '自我照顾', '求助', '陪伴', '康复日记'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 rounded-lg bg-secondary hover:bg-accent text-sm transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 标签页 */}
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 帖子列表 */}
      <div className="px-6 mt-4">
        {activeTab === 'knowledge' ? (
          <div className="space-y-3">
            {/* AI辅助阅读提示 */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">AI辅助阅读</h4>
                  <p className="text-sm text-muted-foreground">
                    点击文章后可以使用AI助手帮你理解和总结内容
                  </p>
                </div>
              </div>
            </div>
            
            {/* 知识文章列表 */}
            {knowledgeItems.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={index}
                  onClick={() => navigate(`/resources/article/${item.articleId}`)}
                  className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                        {item.category}
                      </span>
                      <h4 className="mt-2 mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                      
                      {/* AI辅助标签 */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>支持AI辅助阅读</span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="没有找到相关内容"
            description="试试其他关键词，或者浏览全部内容"
            action={
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
              >
                清空搜索
              </button>
            }
          />
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}