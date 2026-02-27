import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, ChevronDown, ChevronUp, Send } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  
  const faqs: FAQItem[] = [
    {
      question: '如何匿名发布帖子？',
      answer: '在发布页面，你会看到「匿名发布」开关。开启后，你的帖子将以「匿名用户」身份显示，其他用户无法看到你的昵称和头像。你可以在隐私设置中设置默认匿名发布。',
    },
    {
      question: '我的隐私会被保护吗？',
      answer: '我们非常重视你的隐私。所有个人信息都经过加密存储，不会与第三方分享。你可以选择匿名发布内容，控制个人资料的可见性，随时删除自己的内容和数据。',
    },
    {
      question: '如何使用家属模式？',
      answer: '在个人中心点击「家属模式」，可以查看专门为家属和朋友准备的指南，包括如何沟通、如何照顾、如何识别危机信号等内容。这些内容帮助家属更好地理解和支持患者。',
    },
    {
      question: '感到危机时应该怎么办？',
      answer: '如果你或他人正面临生命危险，请立即拨打紧急求助热线 400-161-9995（24小时）。你也可以在首页和支持资源页面找到多个心理援助热线。请记住，寻求专业帮助是勇敢的选择。',
    },
    {
      question: '如何举报不当内容？',
      answer: '在帖子或评论上长按，选择「举报」选项，选择举报原因后提交。我们的审核团队会在24小时内处理。我们致力于维护一个安全、友善的社区环境。',
    },
    {
      question: '会员有什么特权？',
      answer: 'VIP会员可以享受专属标识、无广告体验、优先客服支持、独家内容访问、数据深度分析等特权。但核心的社区功能对所有用户都是免费开放的。',
    },
    {
      question: '如何删除我的账号？',
      answer: '进入设置 → 隐私设置 → 删除账号。删除后，你的所有数据将被永久移除且无法恢复。如果你只是暂时不想使用，可以选择注销登录。',
    },
    {
      question: '为什么我的帖子没有显示？',
      answer: '新发布的帖子可能需要几分钟才能出现在社区中。如果包含敏感内容，可能会被系统温和提醒，但不会阻止发布。如果长时间未显示，请联系客服。',
    },
  ];
  
  const contactMethods = [
    {
      icon: MessageCircle,
      label: '在线客服',
      description: '工作日 9:00-18:00',
      action: '开始对话',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Mail,
      label: '邮件反馈',
      description: 'support@xinyu.com',
      action: '发送邮件',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Phone,
      label: '客服电话',
      description: '400-888-8888',
      action: '拨打电话',
      color: 'bg-primary/10 text-primary',
    },
  ];
  
  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      alert('感谢你的反馈！我们会认真查看并改进。');
      setFeedback('');
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
          <h3>帮助与反馈</h3>
          <div className="w-9"></div>
        </div>
      </div>
      
      {/* 欢迎卡片 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="mb-2 text-primary">需要帮助吗？</h4>
              <p className="text-sm text-muted-foreground">
                我们在这里帮助你。浏览常见问题，或直接联系我们的客服团队。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 常见问题 */}
      <div className="px-6 py-4">
        <h4 className="mb-3">常见问题</h4>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors text-left"
              >
                <h4 className="flex-1 pr-3">{faq.question}</h4>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {expandedIndex === index && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 联系我们 */}
      <div className="px-6 py-4">
        <h4 className="mb-3">联系我们</h4>
        <div className="grid gap-3">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <button
                key={index}
                className="bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-0.5">{method.label}</h4>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <span className="text-sm text-primary">{method.action}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 意见反馈 */}
      <div className="px-6 py-4">
        <h4 className="mb-3">意见反馈</h4>
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <textarea
            placeholder="告诉我们你的想法、建议或遇到的问题..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            rows={5}
          />
          <button
            onClick={handleSubmitFeedback}
            disabled={!feedback.trim()}
            className="w-full mt-3 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            提交反馈
          </button>
        </div>
      </div>
      
      {/* 版本信息 */}
      <div className="px-6 py-4">
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>心语社区 v1.0.0</p>
          <div className="flex items-center justify-center gap-4">
            <button className="hover:text-primary transition-colors">用户协议</button>
            <span>·</span>
            <button className="hover:text-primary transition-colors">隐私政策</button>
          </div>
        </div>
      </div>
    </div>
  );
}
