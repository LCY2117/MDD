import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Settings, ChevronRight, Heart, MessageCircle, FileText, Shield, Bell, HelpCircle, LogOut, Crown, Users } from 'lucide-react';
import { BottomNav } from '../components/community/bottom-nav';
import { PostCard, Post } from '../components/community/post-card';
import { ThemeToggle } from '../components/theme-toggle';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'liked'>('posts');
  
  const user = {
    name: '小雨',
    bio: '慢慢来，一切都会好起来的',
    avatar: '',
    joinDate: '2024-01-15',
    stats: {
      posts: 12,
      likes: 256,
      followers: 48,
    },
    isVIP: false,
  };
  
  const myPosts: Post[] = [
    {
      id: '1',
      author: { name: user.name, isAnonymous: false },
      content: '分享一个帮助我度过低谷期的方法：每天写下三件小确幸。可以很简单，比如今天的阳光很好。',
      tags: ['自我照顾', '经验分享'],
      likes: 256,
      comments: 45,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const menuSections = [
    {
      title: '我的内容',
      items: [
        { icon: FileText, label: '我的帖子', to: '/profile/posts', count: user.stats.posts },
        { icon: Heart, label: '收藏的帖子', to: '/profile/liked', count: user.stats.likes },
        { icon: MessageCircle, label: '我的评论', to: '/profile/comments' },
      ],
    },
    {
      title: '设置与隐私',
      items: [
        { icon: Shield, label: '隐私设置', to: '/settings/privacy' },
        { icon: Bell, label: '通知设置', to: '/settings/notifications' },
        { icon: Settings, label: '账号设置', to: '/settings/account' },
      ],
    },
    {
      title: '更多',
      items: [
        { icon: Users, label: '家属模式', to: '/family-mode', highlight: true },
        { icon: Crown, label: '会员中心', to: '/subscription', badge: 'VIP' },
        { icon: HelpCircle, label: '帮助与反馈', to: '/help' },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h1>我的</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/settings">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* 用户信息卡片 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-3xl p-6 border border-primary/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl">
              {user.avatar || user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2>{user.name}</h2>
                {user.isVIP && (
                  <Crown className="w-5 h-5 text-warning" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
              <p className="text-xs text-muted-foreground">
                加入于 {new Date(user.joinDate).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/20">
            <div className="text-center">
              <div className="text-xl font-medium text-primary mb-1">{user.stats.posts}</div>
              <div className="text-xs text-muted-foreground">帖子</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium text-primary mb-1">{user.stats.likes}</div>
              <div className="text-xs text-muted-foreground">获赞</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium text-primary mb-1">{user.stats.followers}</div>
              <div className="text-xs text-muted-foreground">关注者</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 菜单列表 */}
      <div className="px-6 py-4 space-y-6">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h4 className="mb-3 px-1 text-muted-foreground">{section.title}</h4>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <Link key={itemIdx} to={item.to}>
                    <button className={`w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-border/30' : ''
                    }`}>
                      <Icon className={`w-5 h-5 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`flex-1 text-left ${item.highlight ? 'text-primary font-medium' : ''}`}>
                        {item.label}
                      </span>
                      {item.count !== undefined && (
                        <span className="text-sm text-muted-foreground">{item.count}</span>
                      )}
                      {item.badge && (
                        <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* 我的动态标签页 */}
      <div className="px-6 py-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              activeTab === 'posts'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            我的帖子
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              activeTab === 'liked'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            点赞的
          </button>
        </div>
        
        {activeTab === 'posts' && myPosts.length > 0 && (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      
      {/* 退出登录 */}
      <div className="px-6 py-4">
        <button
          onClick={() => {
            if (confirm('确定要退出登录吗？')) {
              navigate('/login');
            }
          }}
          className="w-full py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
      
      <BottomNav />
    </div>
  );
}