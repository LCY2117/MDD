import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Crown, Check, Sparkles, Heart, MessageCircle, Shield, Zap } from 'lucide-react';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  
  const currentStatus = {
    isVIP: false,
    expiryDate: null,
  };
  
  const plans = [
    {
      id: 'monthly',
      name: '月度会员',
      price: 19.9,
      period: '月',
      originalPrice: 29.9,
      badge: '灵活',
    },
    {
      id: 'yearly',
      name: '年度会员',
      price: 168,
      period: '年',
      originalPrice: 358.8,
      badge: '省40%',
      recommended: true,
    },
  ];
  
  const benefits = [
    {
      icon: Sparkles,
      title: '专属身份标识',
      description: '独特的会员标识，展示你的支持',
    },
    {
      icon: Heart,
      title: '优先情绪支持',
      description: '发布内容获得更多关注和回应',
    },
    {
      icon: MessageCircle,
      title: '专属交流群组',
      description: '加入会员专属的深度交流空间',
    },
    {
      icon: Shield,
      title: '增强隐私保护',
      description: '更多隐私控制选项和数据保护',
    },
    {
      icon: Zap,
      title: '更多存储空间',
      description: '图片和内容存储空间扩大10倍',
    },
    {
      icon: Crown,
      title: '专业内容优先',
      description: '优先访问专业科普和指导内容',
    },
  ];
  
  const faqs = [
    {
      question: '会员费用用于什么？',
      answer: '会员费用主要用于平台服务器维护、专业内容制作、以及为更多需要帮助的人提供支持。我们承诺将大部分收入用于改善服务质量。',
    },
    {
      question: '可以随时取消吗？',
      answer: '是的，你可以随时取消订阅。取消后，会员权益将持续到当前订阅周期结束。',
    },
    {
      question: '不订阅会员也能使用吗？',
      answer: '当然可以。核心的社区功能对所有用户开放，会员主要提供增强体验和额外支持。',
    },
  ];
  
  const handleSubscribe = () => {
    // 模拟订阅流程
    alert('订阅功能开发中，感谢你的支持！');
  };
  
  return (
    <div className="min-h-screen bg-background pb-8">
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
          <h3>会员中心</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      {/* 会员状态 */}
      {!currentStatus.isVIP && (
        <div className="px-6 pt-6 pb-4">
          <div className="bg-gradient-to-br from-warning/10 to-primary/10 rounded-3xl p-6 border border-warning/30">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-10 h-10 text-warning" />
              <div>
                <h2>成为会员</h2>
                <p className="text-sm text-muted-foreground">支持我们，获得更好的体验</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentStatus.isVIP && (
        <div className="px-6 pt-6 pb-4">
          <div className="bg-gradient-to-br from-warning/20 to-primary/20 rounded-3xl p-6 border border-warning/40">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-10 h-10 text-warning" />
              <div>
                <h2>你已是会员</h2>
                <p className="text-sm text-muted-foreground">
                  有效期至 {currentStatus.expiryDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 会员权益 */}
      <div className="px-6 py-6">
        <h3 className="mb-4">会员权益</h3>
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 border border-border/50"
              >
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-warning" />
                </div>
                <h4 className="text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 选择套餐 */}
      <div className="px-6 py-6">
        <h3 className="mb-4">选择套餐</h3>
        <div className="grid gap-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
              className={`relative bg-card rounded-2xl p-5 border-2 transition-all text-left ${
                selectedPlan === plan.id
                  ? 'border-primary shadow-lg'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    推荐
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{plan.name}</h4>
                    <span className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
                      {plan.badge}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-primary">
                      ¥{plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                    <span className="text-xs text-muted-foreground line-through">
                      ¥{plan.originalPrice}
                    </span>
                  </div>
                </div>
                {selectedPlan === plan.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 常见问题 */}
      <div className="px-6 py-6">
        <h3 className="mb-4">常见问题</h3>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <summary className="p-4 cursor-pointer hover:bg-secondary transition-colors">
                <h4 className="inline">{faq.question}</h4>
              </summary>
              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
      
      {/* 订阅声明 */}
      <div className="px-6 py-4">
        <div className="bg-secondary/50 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            订阅前请知：会员服务不能替代专业医疗建议和治疗。我们承诺保护你的隐私，不会与第三方分享你的个人信息。订阅即表示同意《会员服务协议》。
          </p>
        </div>
      </div>
      
      {/* 底部订阅按钮 */}
      {!currentStatus.isVIP && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50 px-6 py-4">
          <button
            onClick={handleSubscribe}
            className="w-full py-4 bg-gradient-to-r from-primary to-warning text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            <span>立即开通会员</span>
          </button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            7天无理由退款 · 随时可取消订阅
          </p>
        </div>
      )}
    </div>
  );
}