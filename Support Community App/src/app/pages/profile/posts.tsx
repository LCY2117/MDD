import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, FileText, Filter } from 'lucide-react';
import { PostCard, Post } from '../../components/community/post-card';
import { EmptyState } from '../../components/community/empty-state';

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'public' | 'anonymous'>('all');
  
  const myPosts: Post[] = [
    {
      id: '1',
      author: { name: '小雨', isAnonymous: false },
      content: '分享一个帮助我度过低谷期的方法：每天写下三件小确幸。可以很简单，比如今天的阳光很好。',
      tags: ['自我照顾', '经验分享'],
      likes: 256,
      comments: 45,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      author: { name: '匿名用户', isAnonymous: true },
      content: '今天心情不太好，但还是来社区看看大家，感觉被温暖包围了。谢谢你们。',
      tags: ['心情记录'],
      likes: 89,
      comments: 23,
      isLiked: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      author: { name: '小雨', isAnonymous: false },
      content: '今天去公园散步了，看到很多人在放风筝。想起小时候的快乐时光，心情好了一些。',
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
      tags: ['日常', '散步'],
      likes: 142,
      comments: 31,
      isLiked: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      author: { name: '匿名用户', isAnonymous: true },
      content: '有时候觉得自己什么都做不好，但看到大家的鼓励，又想再试试。',
      tags: ['求助', '鼓励'],
      likes: 201,
      comments: 67,
      isLiked: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const [posts, setPosts] = useState(myPosts);
  
  const filteredPosts = posts.filter(post => {
    if (filter === 'public') return !post.author.isAnonymous;
    if (filter === 'anonymous') return post.author.isAnonymous;
    return true;
  });
  
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>我的帖子</h3>
          <div className="w-9"></div>
        </div>
        
        {/* 筛选标签 */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            全部 ({posts.length})
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              filter === 'public'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            公开 ({posts.filter(p => !p.author.isAnonymous).length})
          </button>
          <button
            onClick={() => setFilter('anonymous')}
            className={`flex-1 py-2.5 rounded-xl transition-colors ${
              filter === 'anonymous'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            匿名 ({posts.filter(p => p.author.isAnonymous).length})
          </button>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="px-6 pt-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 text-center border border-border/50">
            <div className="text-2xl font-medium text-primary mb-1">{posts.length}</div>
            <div className="text-xs text-muted-foreground">发布总数</div>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border/50">
            <div className="text-2xl font-medium text-primary mb-1">
              {posts.reduce((sum, post) => sum + post.likes, 0)}
            </div>
            <div className="text-xs text-muted-foreground">获赞总数</div>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border/50">
            <div className="text-2xl font-medium text-primary mb-1">
              {posts.reduce((sum, post) => sum + post.comments, 0)}
            </div>
            <div className="text-xs text-muted-foreground">评论总数</div>
          </div>
        </div>
      </div>
      
      {/* 帖子列表 */}
      <div className="px-6 py-4">
        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} showActions />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="还没有符合条件的帖子"
            description="试试切换其他筛选条件"
          />
        )}
      </div>
    </div>
  );
}
