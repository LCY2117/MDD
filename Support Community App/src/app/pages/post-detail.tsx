import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Heart, MessageCircle, Share2, Flag, Lock, MoreHorizontal, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface Comment {
  id: string;
  author: {
    name: string;
    isAnonymous: boolean;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(256);
  
  // Mock数据
  const post = {
    id: id || '1',
    author: { name: '小雨', isAnonymous: false },
    content: '分享一个帮助我度过低谷期的方法：每天写下三件小确幸。可以很简单，比如今天的阳光很好，或者喝到了喜欢的咖啡。慢慢地，会发现生活中还是有很多美好的。\n\n我知道对于我们来说，有时候起床都很困难，更别说发现美好了。但正是因为这样，这些小小的美好才更值得被记录和珍惜。\n\n希望这个方法也能帮到你们。一起加油💙',
    tags: ['自我照顾', '经验分享'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  };
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: { name: '小星', isAnonymous: false },
      content: '谢谢分享！我也试试这个方法',
      likes: 12,
      isLiked: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      author: { name: '匿名用户', isAnonymous: true },
      content: '今天的小确幸：看到这个帖子，让我觉得不那么孤单了',
      likes: 28,
      isLiked: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };
  
  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(c =>
      c.id === commentId
        ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
        : c
    ));
  };
  
  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: { name: isAnonymous ? '匿名用户' : '我', isAnonymous },
      content: comment,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    
    setComments([newComment, ...comments]);
    setComment('');
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
    <div className="min-h-screen bg-background pb-24">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>帖子详情</h3>
          <button type="button" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* 帖子内容 */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border/50"
        >
          {/* 作者信息 */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              {post.author.isAnonymous ? (
                <Lock className="w-6 h-6 text-primary" />
              ) : (
                <span className="text-primary text-lg">{post.author.name.charAt(0)}</span>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="font-medium">
                {post.author.isAnonymous ? '匿名用户' : post.author.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatTime(post.createdAt)}
              </div>
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Flag className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* 内容 */}
          <div className="mb-4">
            <p className="whitespace-pre-line leading-relaxed">{post.content}</p>
          </div>
          
          {/* 标签 */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* 互动统计 */}
          <div className="flex items-center gap-6 pt-4 border-t border-border/30">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length}</span>
            </div>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-auto">
              <Share2 className="w-5 h-5" />
              <span>分享</span>
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* 评论区 */}
      <div className="px-6 pb-6">
        <h3 className="mb-4">评论 {comments.length}</h3>
        
        <div className="space-y-4">
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  {c.author.isAnonymous ? (
                    <Lock className="w-5 h-5 text-primary" />
                  ) : (
                    <span className="text-primary">{c.author.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">
                      {c.author.isAnonymous ? '匿名用户' : c.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-2">{c.content}</p>
                  <button
                    onClick={() => handleCommentLike(c.id)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      c.isLiked ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-current' : ''}`} />
                    <span>{c.likes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              还没有评论，来说点什么吧
            </div>
          )}
        </div>
      </div>
      
      {/* 底部评论输入框 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <Lock className="w-4 h-4" />
              <span>匿名评论</span>
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="写下你的想法..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
              className="px-5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}