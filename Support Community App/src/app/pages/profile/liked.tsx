import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { PostCard, Post } from '../../components/community/post-card';
import { EmptyState } from '../../components/community/empty-state';

export default function LikedPostsPage() {
  const navigate = useNavigate();
  
  const likedPosts: Post[] = [
    {
      id: '1',
      author: { name: '小云', isAnonymous: false },
      content: '今天第一次尝试冥想，虽然只有5分钟，但感觉心里平静了一些。分享给大家，也许你们也可以试试。',
      tags: ['自我照顾', '冥想'],
      likes: 342,
      comments: 78,
      isLiked: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      author: { name: '匿名用户', isAnonymous: true },
      content: '今天终于鼓起勇气去看了心理咨询师。虽然还是很紧张，但咨询师很温和，让我感觉被理解了。想告诉大家，寻求专业帮助不是软弱，是勇敢。',
      tags: ['心理咨询', '勇气'],
      likes: 567,
      comments: 123,
      isLiked: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      author: { name: '小星', isAnonymous: false },
      content: '给大家推荐一些我常听的舒缓音乐，在焦虑的时候听会好一些。希望也能帮到你们。',
      images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'],
      tags: ['音乐分享', '放松'],
      likes: 289,
      comments: 45,
      isLiked: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      author: { name: '匿名用户', isAnonymous: true },
      content: '分享一个帮助我的小技巧：每次感到焦虑时，我会数5样我能看到的东西，4样我能听到的声音，3样我能触摸的东西。这个方法帮助我回到当下。',
      tags: ['应对技巧', '焦虑'],
      likes: 891,
      comments: 167,
      isLiked: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const [posts, setPosts] = useState(likedPosts);
  
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };
  
  const handleRemove = (postId: string) => {
    if (confirm('确定要取消收藏这篇帖子吗？')) {
      setPosts(posts.filter(post => post.id !== postId));
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
          <div className="text-center">
            <h3>收藏的帖子</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{posts.length} 篇收藏</p>
          </div>
          <div className="w-9"></div>
        </div>
      </div>
      
      {/* 提示 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 text-primary text-sm">你的收藏夹</h4>
              <p className="text-xs text-muted-foreground">
                这里保存了你点赞的帖子，方便随时回顾这些温暖的内容
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 帖子列表 */}
      <div className="px-6 py-4">
        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="relative group">
                <PostCard post={post} onLike={handleLike} />
                {/* 移除按钮 */}
                <button
                  onClick={() => handleRemove(post.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="还没有收藏的帖子"
            description="点赞喜欢的内容，它们会出现在这里"
            action={
              <button
                onClick={() => navigate('/community')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
              >
                去社区逛逛
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
