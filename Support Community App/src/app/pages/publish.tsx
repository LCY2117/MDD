import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { BottomNav } from '../components/community/bottom-nav';

export default function PublishPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [showSensitiveWarning, setShowSensitiveWarning] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const availableTags = [
    '每日打卡', '经验分享', '自我照顾', '求助', '陪伴',
    '康复日记', '心理咨询', '家属交流', '情绪记录',
  ];
  
  const sensitiveKeywords = ['自杀', '结束生命', '死'];
  
  const handleContentChange = (value: string) => {
    setContent(value);
    
    // 检测敏感词
    const hasSensitive = sensitiveKeywords.some(keyword => value.includes(keyword));
    setShowSensitiveWarning(hasSensitive);
  };
  
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };
  
  const handleImageUpload = () => {
    // 模拟图片上传
    if (images.length < 9) {
      const mockImage = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&random=${Date.now()}`;
      setImages([...images, mockImage]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handlePublish = () => {
    if (!content.trim()) return;
    
    // 模拟发布
    setIsPublishing(true);
    setTimeout(() => {
      navigate('/community');
      setIsPublishing(false);
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>发布动态</h3>
          <button
            type="button"
            onClick={handlePublish}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!content.trim() || isPublishing}
          >
            {isPublishing ? '发布中...' : '发布'}
          </button>
        </div>
      </header>
      
      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* 匿名开关 */}
        <div className="mb-6 p-4 bg-card rounded-2xl border border-border/50">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">匿名发布</div>
                <div className="text-sm text-muted-foreground">他人将看不到你的个人信息</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-12 h-6 rounded-full appearance-none bg-secondary relative transition-colors cursor-pointer
                checked:bg-primary
                before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white
                before:top-0.5 before:left-0.5 before:transition-transform
                checked:before:translate-x-6"
            />
          </label>
        </div>
        
        {/* 内容输入 */}
        <div className="mb-6">
          <textarea
            placeholder="在这里分享你的想法、感受或经历...&#10;&#10;这是一个安全的空间，你可以自由表达。"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-48 p-4 bg-card border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <span className={`text-sm ${
              content.length > 500 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {content.length}/500
            </span>
          </div>
        </div>
        
        {/* 敏感词温和提醒 */}
        {showSensitiveWarning && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-warning mb-2">我们注意到你可能正在经历困难</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  如果此刻感到特别难以承受，建议先寻求专业支持。你不是一个人，我们随时在这里陪伴你。
                </p>
                <button
                  onClick={() => navigate('/resources')}
                  className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  查看求助资源
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 图片上传 */}
        <div className="mb-6">
          <h4 className="mb-3">添加图片（选填）</h4>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
            {images.length < 9 && (
              <button
                onClick={handleImageUpload}
                className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-secondary transition-colors flex flex-col items-center justify-center gap-2"
              >
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">添加图片</span>
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">最多可上传9张图片</p>
        </div>
        
        {/* 话题标签 */}
        <div className="mb-6">
          <h4 className="mb-3">选择话题（最多3个）</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                disabled={!selectedTags.includes(tag) && selectedTags.length >= 3}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* 发布须知 */}
        <div className="p-4 bg-secondary/50 rounded-2xl">
          <h4 className="mb-2">温馨提示</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• 请尊重他人，避免攻击性言论</li>
            <li>• 这里不能替代专业医疗建议</li>
            <li>• 你的分享可能帮助到其他人</li>
            <li>• 发布后可随时删除或编辑</li>
          </ul>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}