import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, MessageCircle, AlertCircle, BookOpen, Video, FileText, CheckCircle, Users, Bell, Link as LinkIcon } from 'lucide-react';

export default function FamilyModePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'communication' | 'care' | 'knowledge'>('communication');
  
  const communicationTips = [
    {
      title: '倾听比建议更重要',
      description: '当他们愿意分享时，先安静倾听，不要急于给出建议或评判。一句"我在听"比"你应该..."更有力量。',
      icon: MessageCircle,
    },
    {
      title: '接纳他们的感受',
      description: '不要说"别想太多""你应该开心点"，而是说"我理解这对你来说很难""我会陪着你"。',
      icon: Heart,
    },
    {
      title: '避免这些表达',
      description: '避免："振作起来""别人更惨""你太敏感了"。这些话会让患者感到被否定和不被理解。',
      icon: AlertCircle,
      warning: true,
    },
    {
      title: '保持耐心和陪伴',
      description: '康复需要时间，可能会有反复。保持耐心，让他们知道你会一直在身边。',
      icon: Heart,
    },
  ];
  
  const careTips = [
    {
      title: '识别危机信号',
      points: [
        '表达"活着没意义""不想活了"等想法',
        '突然整理遗物或告别',
        '情绪突然好转（可能是做出决定后的平静）',
        '社交完全退缩，不愿与任何人交流',
      ],
      urgent: true,
    },
    {
      title: '日常照顾建议',
      points: [
        '尊重他们的节奏，不强迫社交或活动',
        '帮助维持规律作息，但不要过度控制',
        '陪伴就医和服药，但避免监督式关注',
        '创造安全舒适的家庭氛围',
      ],
    },
    {
      title: '照顾者自我关怀',
      points: [
        '定期给自己留出休息时间',
        '寻求其他家人或朋友的支持',
        '必要时寻求专业心理咨询',
        '记住：你也需要被照顾',
      ],
    },
  ];
  
  const knowledgeResources = [
    {
      title: '抑郁症不是"想开点"就能好的',
      summary: '了解抑郁症是一种疾病，需要专业治疗，不是意志力问题',
      type: '基础认知',
      icon: BookOpen,
    },
    {
      title: '药物治疗的常见问题',
      summary: '了解抗抑郁药物的作用机制、副作用和用药注意事项',
      type: '治疗知识',
      icon: FileText,
    },
    {
      title: '如何选择心理咨询师',
      summary: '了解不同流派的心理咨询，如何为家人选择合适的咨询师',
      type: '就医指南',
      icon: Video,
    },
  ];
  
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
          <h3>家属模式</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      {/* 欢迎卡片 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-3xl p-6 border border-primary/20">
          <h2 className="mb-3">感谢你的陪伴</h2>
          <p className="text-muted-foreground leading-relaxed">
            作为家属，你的支持和陪伴对患者的康复非常重要。同时，照顾者的身心健康也同样重要。这里为你提供实用的沟通建议和照护指南。
          </p>
        </div>
      </div>
      
      {/* 家庭绑定和报警入口 */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/family-binding')}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <h4 className="text-sm mb-0.5">家庭绑定</h4>
              <p className="text-xs text-muted-foreground">连接家人</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/family-alerts')}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border/50 hover:border-destructive/30 transition-all relative"
          >
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center relative">
              <Bell className="w-6 h-6 text-destructive" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
            </div>
            <div className="text-center">
              <h4 className="text-sm mb-0.5">报警提醒</h4>
              <p className="text-xs text-muted-foreground">1条新提醒</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* 标签页 */}
      <div className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('communication')}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              activeTab === 'communication'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            沟通建议
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              activeTab === 'care'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            照护指南
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              activeTab === 'knowledge'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            知识科普
          </button>
        </div>
      </div>
      
      {/* 内容区 */}
      <div className="px-6 pb-6">
        {activeTab === 'communication' && (
          <div className="space-y-4">
            {communicationTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className={`bg-card rounded-2xl p-5 shadow-sm border ${
                    tip.warning ? 'border-warning/30' : 'border-border/50'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tip.warning ? 'bg-warning/10' : 'bg-primary/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${tip.warning ? 'text-warning' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'care' && (
          <div className="space-y-4">
            {careTips.map((section, index) => (
              <div
                key={index}
                className={`bg-card rounded-2xl p-5 shadow-sm border ${
                  section.urgent ? 'border-destructive/30 bg-destructive/5' : 'border-border/50'
                }`}
              >
                <h4 className={`mb-4 ${section.urgent ? 'text-destructive' : ''}`}>
                  {section.title}
                </h4>
                <div className="space-y-3">
                  {section.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        section.urgent ? 'text-destructive' : 'text-primary'
                      }`} />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
                {section.urgent && (
                  <div className="mt-4 pt-4 border-t border-destructive/20">
                    <p className="text-sm text-destructive mb-3">
                      如果出现上述信号，请立即采取行动：
                    </p>
                    <button
                      onClick={() => navigate('/resources')}
                      className="w-full py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors"
                    >
                      查看紧急求助资源
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'knowledge' && (
          <div className="space-y-3">
            {knowledgeResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <button
                  key={index}
                  className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                        {resource.type}
                      </span>
                      <h4 className="mt-2 mb-1">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.summary}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* 底部求助卡片 */}
      <div className="px-6 pb-6">
        <div className="bg-accent/30 rounded-2xl p-5 border border-primary/20">
          <h4 className="mb-2">需要更多帮助？</h4>
          <p className="text-sm text-muted-foreground mb-4">
            照顾抑郁症患者可能会让你感到压力和困惑，这很正常。你也可以寻求专业支持。
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/resources')}
              className="py-2.5 bg-card border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              专业资源
            </button>
            <button
              onClick={() => navigate('/community')}
              className="py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              家属交流
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}