import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Image as ImageIcon, Smile, Tag, Calendar, Clock, Lock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface DiaryEntry {
  id: string;
  title?: string;
  content: string;
  tags: string[];
  mood?: 'sunny' | 'cloudy' | 'rainy';
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DiaryEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [showTagInput, setShowTagInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 快捷标签
  const quickTags = ['今日心情', '想法', '感悟', '目标', '感恩'];
  
  const handleSave = async () => {
    if (!content.trim()) {
      alert('请输入日记内容');
      return;
    }
    
    setIsSaving(true);
    
    // 模拟保存
    setTimeout(() => {
      setIsSaving(false);
      navigate(-1);
    }, 500);
  };
  
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    setShowTagInput(false);
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    setContent(newContent);
    
    // 重新设置光标位置
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };
  
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部导航 */}
      <div className="flex-shrink-0 sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>写日记</h3>
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? '保存中...' : '保存'}</span>
          </button>
        </div>
      </div>
      
      {/* 编辑区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* 时间和隐私设置 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{getCurrentTime()}</span>
          </div>
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              isPrivate
                ? 'bg-primary/10 text-primary'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {isPrivate ? (
              <>
                <Lock className="w-4 h-4" />
                <span className="text-sm">私密</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span className="text-sm">公开</span>
              </>
            )}
          </button>
        </div>
        
        {/* 标签区域 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => removeTag(tag)}
                className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
        
        {/* 快捷标签 */}
        {showTagInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <h4 className="text-sm mb-3">选择标签</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    disabled={tags.includes(tag)}
                    className="px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="自定义标签..."
                  className="flex-1 px-3 py-2 bg-secondary rounded-lg border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
                <button
                  onClick={() => addTag(tagInput)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  添加
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 内容编辑器 */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="记录此刻的想法和感受...&#10;&#10;你可以写下：&#10;• 今天发生的事情&#10;• 内心的感受和想法&#10;• 对未来的期待&#10;• 想要感恩的人和事"
          className="w-full min-h-[400px] p-4 bg-card border border-border/50 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
          autoFocus
        />
        
        {/* 字数统计 */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>{content.length} 字</span>
          {content.length > 0 && (
            <span>约 {Math.ceil(content.length / 400)} 分钟阅读</span>
          )}
        </div>
      </div>
      
      {/* 底部工具栏 */}
      <div className="flex-shrink-0 bg-background border-t border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTagInput(!showTagInput)}
            className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
            title="添加标签"
          >
            <Tag className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => insertAtCursor('📝 ')}
            className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
            title="插入表情"
          >
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
            title="插入图片"
          >
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => insertAtCursor(`\n\n## ${getCurrentTime()}\n`)}
            className="px-3 py-2 bg-secondary rounded-lg text-sm hover:bg-accent transition-colors"
          >
            插入时间
          </button>
        </div>
      </div>
      
      {/* 温馨提示 */}
      {content.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary whitespace-nowrap"
        >
          💡 记录每一天，见证成长的力量
        </motion.div>
      )}
    </div>
  );
}
