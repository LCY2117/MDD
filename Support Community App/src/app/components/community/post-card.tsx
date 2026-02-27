import { Heart, MessageCircle, Flag, Lock } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  content: string;
  images?: string[];
  tags?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
  isPinned?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    return '刚刚';
  };
  
  return (
    <Link to={`/post/${post.id}`}>
      <motion.div 
        className="bg-card rounded-2xl p-4 mb-3 shadow-sm border border-border/50 transition-all"
        whileHover={{ 
          y: -4, 
          boxShadow: '0 10px 25px -5px rgba(95, 169, 163, 0.1), 0 8px 10px -6px rgba(95, 169, 163, 0.1)' 
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* 作者信息 */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {post.author.isAnonymous ? (
              <Lock className="w-5 h-5 text-primary" />
            ) : post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary">{post.author.name.charAt(0)}</span>
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {post.author.isAnonymous ? '匿名用户' : post.author.name}
              </span>
              {post.isPinned && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                  置顶
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</span>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Flag className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* 内容 */}
        <p className="text-foreground mb-3 leading-relaxed">
          {post.content}
        </p>
        
        {/* 图片 */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${
            post.images.length === 1 ? 'grid-cols-1' : 
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {post.images.map((img, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden bg-secondary aspect-square">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
        
        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* 互动栏 */}
        <div className="flex items-center gap-4 pt-3 border-t border-border/30">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onLike?.(post.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              post.isLiked 
                ? 'text-primary bg-secondary' 
                : 'text-muted-foreground hover:bg-secondary'
            }`}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={post.isLiked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            </motion.div>
            <span className="text-sm">{post.likes}</span>
          </motion.button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{post.comments}</span>
          </button>
        </div>
      </motion.div>
    </Link>
  );
}