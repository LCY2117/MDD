import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Search, Filter, TrendingUp, Clock, Heart, MessageCircle, User, Hash } from 'lucide-react';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'users' | 'topics'>('all');
  const [sortBy, setSortBy] = useState<'relevant' | 'latest' | 'popular'>('relevant');
  const [showFilter, setShowFilter] = useState(false);
  
  // 模拟搜索结果
  const searchResults = {
    posts: [
      {
        id: 1,
        author: '温暖的小鹿',
        avatar: '🦌',
        content: '今天终于鼓起勇气出门散步了，阳光洒在身上的感觉真好。虽然只走了15分钟，但对我来说已经是很大的进步了。',
        likes: 42,
        comments: 18,
        time: '2天前',
      },
      {
        id: 2,
        author: '星光守护者',
        avatar: '⭐',
        content: '分享一个小技巧：当感到焦虑时，我会专注数呼吸，吸气数到4，呼气数到6。坚持几分钟后会感觉好很多。',
        likes: 67,
        comments: 23,
        time: '3天前',
      },
    ],
    users: [
      {
        id: 1,
        name: '温暖的小鹿',
        avatar: '🦌',
        bio: '一步一步向前走',
        followers: 156,
      },
      {
        id: 2,
        name: '星光守护者',
        avatar: '⭐',
        bio: '陪你度过每个夜晚',
        followers: 203,
      },
    ],
    topics: [
      {
        id: 1,
        name: '焦虑应对',
        icon: '💭',
        posts: 234,
        followers: 567,
      },
      {
        id: 2,
        name: '情绪日记',
        icon: '📔',
        posts: 189,
        followers: 423,
      },
    ],
  };
  
  const sortOptions = [
    { value: 'relevant' as const, label: '最相关', icon: TrendingUp },
    { value: 'latest' as const, label: '最新', icon: Clock },
    { value: 'popular' as const, label: '最热门', icon: Heart },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索帖子、用户、话题..."
              className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-xl border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tab切换 */}
        <div className="flex gap-2">
          {[
            { key: 'all' as const, label: '全部' },
            { key: 'posts' as const, label: '帖子' },
            { key: 'users' as const, label: '用户' },
            { key: 'topics' as const, label: '话题' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 筛选面板 */}
      {showFilter && (
        <div className="px-6 py-4 bg-secondary border-b border-border/50">
          <h4 className="mb-3">排序方式</h4>
          <div className="flex gap-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowFilter(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    sortBy === option.value
                      ? 'bg-primary text-white'
                      : 'bg-card border border-border/50 hover:border-primary/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="px-6 py-6 space-y-6">
        {/* 搜索结果提示 */}
        {searchText && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              为 "<span className="text-foreground font-medium">{searchText}</span>" 找到 {searchResults.posts.length + searchResults.users.length + searchResults.topics.length} 个结果
            </p>
          </div>
        )}
        
        {/* 帖子结果 */}
        {(activeTab === 'all' || activeTab === 'posts') && searchResults.posts.length > 0 && (
          <div>
            <h4 className="mb-3 px-1">帖子</h4>
            <div className="space-y-3">
              {searchResults.posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="bg-card rounded-2xl border border-border/50 p-4 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm">{post.author}</h4>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                  
                  <p className="mb-3 leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 用户结果 */}
        {(activeTab === 'all' || activeTab === 'users') && searchResults.users.length > 0 && (
          <div>
            <h4 className="mb-3 px-1">用户</h4>
            <div className="space-y-3">
              {searchResults.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="bg-card rounded-2xl border border-border/50 p-4 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{user.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span>{user.followers} 关注者</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                      关注
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 话题结果 */}
        {(activeTab === 'all' || activeTab === 'topics') && searchResults.topics.length > 0 && (
          <div>
            <h4 className="mb-3 px-1">话题</h4>
            <div className="space-y-3">
              {searchResults.topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => navigate(`/community?topic=${topic.id}`)}
                  className="bg-card rounded-2xl border border-border/50 p-4 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {topic.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-primary" />
                        <h4>{topic.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{topic.posts} 帖子</span>
                        <span>•</span>
                        <span>{topic.followers} 关注</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-sm">
                      关注
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 空状态 */}
        {!searchText && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">输入关键词开始搜索</p>
          </div>
        )}
        
        {/* 热门搜索 */}
        {!searchText && (
          <div>
            <h4 className="mb-3 px-1">热门搜索</h4>
            <div className="flex flex-wrap gap-2">
              {['焦虑应对', '情绪日记', '睡眠问题', '正念冥想', '家属支持'].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSearchText(keyword)}
                  className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
