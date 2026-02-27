import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Clock, BookOpen, Share2, Bookmark, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  publishDate: string;
  content: string[];
  tips?: string[];
  relatedArticles?: { id: string; title: string }[];
}

const articles: Record<string, Article> = {
  'what-is-depression': {
    id: 'what-is-depression',
    title: '什么是抑郁症？',
    category: '基础知识',
    author: '心理咨询师 李医生',
    readTime: '5分钟',
    publishDate: '2024-01-15',
    content: [
      '抑郁症是一种常见的心理疾病，影响着全球数亿人。它不仅仅是"心情不好"，而是一种持续的、影响日常生活的情绪障碍。',
      '**主要症状包括：**\n• 持续的悲伤或空虚感\n• 对以往喜欢的活动失去兴趣\n• 睡眠障碍（失眠或嗜睡）\n• 食欲改变\n• 疲劳和精力不足\n• 难以集中注意力\n• 自我价值感降低\n• 反复出现死亡或自杀的念头',
      '抑郁症的成因是多方面的，包括生物学因素（大脑化学物质失衡）、心理因素（负性思维模式）、社会因素（生活压力、创伤经历）等。',
      '重要的是要知道：抑郁症是一种可以治疗的疾病。通过专业的心理治疗、药物治疗，或两者结合，大多数人可以得到明显改善。',
    ],
    tips: [
      '抑郁症不是性格软弱，而是真实的疾病',
      '寻求专业帮助是勇敢的表现',
      '恢复需要时间，要对自己有耐心',
      '保持规律的作息和适度运动会有帮助',
    ],
    relatedArticles: [
      { id: 'how-to-support', title: '如何陪伴抑郁症患者' },
      { id: 'medication-guide', title: '认识常用抗抑郁药物' },
    ],
  },
  'how-to-support': {
    id: 'how-to-support',
    title: '如何陪伴抑郁症患者',
    category: '家属指南',
    author: '心理咨询师 王老师',
    readTime: '7分钟',
    publishDate: '2024-01-20',
    content: [
      '作为抑郁症患者的家人或朋友，你的陪伴和支持非常重要。但同时，你可能会感到无助、困惑，不知道如何帮助他们。',
      '**做什么（DO）：**\n• 倾听，不评判。让他们知道你在乎，愿意听他们说\n• 鼓励他们寻求专业帮助，必要时陪同就医\n• 帮助他们保持日常规律，如按时吃饭、睡觉\n• 给予实际的帮助，如协助处理家务\n• 保持耐心，理解康复需要时间\n• 照顾好自己，你也需要支持',
      '**不要做什么（DON\'T）：**\n• 不要说"想开点就好了"、"你应该坚强一点"\n• 不要忽视或轻视他们的痛苦\n• 不要强迫他们"振作起来"\n• 不要把他们的病情当作个人攻击\n• 不要放弃，即使进展缓慢',
      '记住，你不需要"修复"他们，你只需要陪伴他们。有时候，简单的陪伴就是最好的支持。',
    ],
    tips: [
      '倾听比建议更重要',
      '尊重他们的感受和边界',
      '照顾好自己才能更好地照顾他人',
      '学习相关知识，理解抑郁症',
    ],
    relatedArticles: [
      { id: 'what-is-depression', title: '什么是抑郁症？' },
      { id: 'crisis-signals', title: '识别危机信号' },
    ],
  },
};

export default function ArticleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const article = id ? articles[id] : null;
  
  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="mb-2">文章不存在</h3>
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline"
          >
            返回
          </button>
        </div>
      </div>
    );
  }
  
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
          <div className="flex gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* 文章头部 */}
      <div className="px-6 pt-6 pb-4">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-3">
          {article.category}
        </span>
        <h1 className="mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{article.author}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {article.readTime}
          </span>
          <span>·</span>
          <span>{new Date(article.publishDate).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
      
      {/* 文章内容 */}
      <div className="px-6 py-4">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="prose prose-sm max-w-none">
            {article.content.map((paragraph, index) => (
              <div key={index} className="mb-6 last:mb-0">
                {paragraph.split('\n').map((line, lineIndex) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h4 key={lineIndex} className="mt-4 mb-2">
                        {line.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('• ')) {
                    return (
                      <li key={lineIndex} className="ml-4 mb-1 text-muted-foreground">
                        {line.substring(2)}
                      </li>
                    );
                  }
                  return (
                    <p key={lineIndex} className="mb-3 leading-relaxed text-foreground">
                      {line}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* AI辅助阅读卡片 */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1">AI辅助阅读</h4>
              <p className="text-sm text-muted-foreground mb-3">
                让AI助手帮你理解和总结这篇文章的关键内容
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                setShowAIAssistant(true);
                navigate('/ai-chat', { state: { context: `请帮我总结这篇文章：${article.title}` } });
              }}
              className="py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              文章总结
            </button>
            <button 
              onClick={() => {
                setShowAIAssistant(true);
                navigate('/ai-chat', { state: { context: `我正在阅读《${article.title}》，有一些问题想请教` } });
              }}
              className="py-3 bg-secondary text-foreground rounded-xl hover:bg-accent transition-colors text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4 inline mr-1" />
              提问AI
            </button>
          </div>
        </div>
      </div>
      
      {/* 要点提示 */}
      {article.tips && article.tips.length > 0 && (
        <div className="px-6 py-4">
          <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <h4 className="text-primary">重点提示</h4>
            </div>
            <ul className="space-y-2">
              {article.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* 相关文章 */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <div className="px-6 py-4">
          <h4 className="mb-3">相关文章</h4>
          <div className="space-y-3">
            {article.relatedArticles.map((related) => (
              <button
                key={related.id}
                onClick={() => navigate(`/resources/article/${related.id}`)}
                className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow text-left flex items-center justify-between"
              >
                <span>{related.title}</span>
                <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}