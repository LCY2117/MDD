import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Heart, MessageCircle, Calendar, Shield, MoreHorizontal, Flag, UserPlus, UserMinus, Lock } from 'lucide-react';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // 模拟用户数据
  const user = {
    id: id || '1',
    name: '温暖的小鹿',
    avatar: '🦌',
    bio: '一步一步向前走，每一天都是新的开始',
    joinDate: '2023年10月',
    isAnonymous: false,
    stats: {
      posts: 24,
      followers: 156,
      following: 89,
    },
  };
  
  // 模拟该用户的帖子
  const userPosts = [
    {
      id: 1,
      content: '今天终于鼓起勇气出门散步了，阳光洒在身上的感觉真好。虽然只走了15分钟，但对我来说已经是很大的进步了。',
      likes: 42,
      comments: 18,
      time: '2天前',
      isAnonymous: false,
    },
    {
      id: 2,
      content: '分享一个小技巧：当感到焦虑时，我会专注数呼吸，吸气数到4，呼气数到6。坚持几分钟后会感觉好很多。',
      likes: 67,
      comments: 23,
      time: '5天前',
      isAnonymous: false,
    },
    {
      id: 3,
      content: '今天情绪有点低落，但我知道这只是暂时的。给自己泡了一杯热茶，听着喜欢的音乐，慢慢调整状态。',
      likes: 38,
      comments: 12,
      time: '1周前',
      isAnonymous: false,
    },
  ];
  
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
          <h3>个人主页</h3>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* 下拉菜单 */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-16 right-6 z-30 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px]">
            <button
              onClick={() => {
                setShowMenu(false);
                alert('举报功能开发中');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
            >
              <Flag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">举报用户</span>
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                alert('拉黑功能开发中');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left border-t border-border/30"
            >
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">拉黑用户</span>
            </button>
          </div>
        </>
      )}
      
      <div className="px-6 py-6 space-y-6">
        {/* 用户信息卡片 */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3>{user.name}</h3>
                {!user.isAnonymous && (
                  <Shield className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {user.bio}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{user.joinDate} 加入</span>
              </div>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div className="flex gap-6 py-4 border-t border-b border-border/30">
            <div className="text-center">
              <div className="font-semibold text-foreground mb-1">{user.stats.posts}</div>
              <div className="text-xs text-muted-foreground">帖子</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground mb-1">{user.stats.followers}</div>
              <div className="text-xs text-muted-foreground">关注者</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground mb-1">{user.stats.following}</div>
              <div className="text-xs text-muted-foreground">关注中</div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                isFollowing
                  ? 'bg-secondary text-foreground border border-border'
                  : 'bg-primary text-white'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="w-4 h-4" />
                  <span>已关注</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>关注</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/messages/new')}
              className="px-6 py-2.5 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>私信</span>
            </button>
          </div>
        </div>
        
        {/* TA的帖子 */}
        <div>
          <h4 className="mb-3 px-1">TA的帖子</h4>
          <div className="space-y-3">
            {userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="bg-card rounded-2xl border border-border/50 p-4 hover:border-primary/30 transition-all cursor-pointer"
              >
                <p className="mb-3 leading-relaxed">{post.content}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{post.time}</span>
                  <div className="flex items-center gap-4">
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
              </div>
            ))}
          </div>
          
          {/* 加载更多 */}
          <button className="w-full py-3 mt-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors text-sm text-muted-foreground">
            查看更多
          </button>
        </div>
        
        {/* 温馨提示 */}
        {isFollowing && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">
              💡 关注后，您将在首页看到TA的最新动态
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
