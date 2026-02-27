import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, MessageCircle, Trash2 } from 'lucide-react';
import { EmptyState } from '../../components/community/empty-state';

interface Comment {
  id: string;
  postId: string;
  postTitle: string;
  content: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export default function MyCommentsPage() {
  const navigate = useNavigate();
  
  const myComments: Comment[] = [
    {
      id: '1',
      postId: '101',
      postTitle: '今天第一次尝试冥想，虽然只有5分钟...',
      content: '谢谢分享，这个方法我也试试。最近焦虑的时候特别想找点方法缓解。',
      likes: 12,
      replies: 2,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      postId: '102',
      postTitle: '今天终于鼓起勇气去看了心理咨询师...',
      content: '你真的很勇敢！我也在考虑去看咨询师，但还是有点害怕。看到你的经历，给了我一些勇气。',
      likes: 23,
      replies: 5,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      postId: '103',
      postTitle: '给大家推荐一些我常听的舒缓音乐...',
      content: '能分享一下歌单吗？最近睡眠不太好，想找些舒缓的音乐听听。',
      likes: 8,
      replies: 1,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      postId: '104',
      postTitle: '分享一个帮助我的小技巧：每次感到焦虑...',
      content: '这个5-4-3接地技巧我也在用！确实很有效，能让自己快速冷静下来。',
      likes: 34,
      replies: 8,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      postId: '105',
      postTitle: '今天心情不太好，但还是来社区看看...',
      content: '你不是一个人。我们都在这里陪着你 💙',
      likes: 56,
      replies: 12,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const [comments, setComments] = useState(myComments);
  
  const handleDelete = (commentId: string) => {
    if (confirm('确定要删除这条评论吗？')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
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
            <h3>我的评论</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{comments.length} 条评论</p>
          </div>
          <div className="w-9"></div>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="px-6 pt-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 text-center border border-border/50">
            <div className="text-2xl font-medium text-primary mb-1">{comments.length}</div>
            <div className="text-xs text-muted-foreground">评论总数</div>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border/50">
            <div className="text-2xl font-medium text-primary mb-1">
              {comments.reduce((sum, comment) => sum + comment.likes, 0)}
            </div>
            <div className="text-xs text-muted-foreground">获赞总数</div>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border/50">
            <div className="text-2xl font-medium text-primary mb-1">
              {comments.reduce((sum, comment) => sum + comment.replies, 0)}
            </div>
            <div className="text-xs text-muted-foreground">回复总数</div>
          </div>
        </div>
      </div>
      
      {/* 评论列表 */}
      <div className="px-6 py-4">
        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow"
              >
                {/* 原帖引用 */}
                <Link to={`/post/${comment.postId}`}>
                  <div className="mb-3 p-3 bg-secondary rounded-xl hover:bg-accent transition-colors">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {comment.postTitle}
                    </p>
                  </div>
                </Link>
                
                {/* 评论内容 */}
                <p className="text-foreground mb-3">{comment.content}</p>
                
                {/* 底部信息 */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatTime(comment.createdAt)}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {comment.likes} 赞
                    </span>
                    <span>{comment.replies} 回复</span>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-destructive hover:underline"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="还没有评论"
            description="在社区与大家交流，你的评论会出现在这里"
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
