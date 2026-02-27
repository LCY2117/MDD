import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, FileText, Shield, Users, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function TermsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'community'>('terms');
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  
  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  
  // 服务条款内容
  const termsContent = [
    {
      title: '1. 服务说明',
      content: [
        '心语社区是一个面向抑郁症患者及其家属的互助支持平台，旨在提供安全、温暖的交流空间。',
        '本服务不构成医疗诊断或治疗建议，如您处于危机状态，请立即拨打专业心理热线或就医。',
        '我们保护您的隐私，支持匿名发布，但请遵守社区规范，共同维护友善氛围。',
      ],
    },
    {
      title: '2. 用户权利与义务',
      content: [
        '您有权自主选择公开或匿名身份，控制个人信息的可见范围。',
        '您有权随时删除自己发布的内容，导出个人数据，或注销账户。',
        '您应遵守社区规范，不发布暴力、色情、欺诈等违法违规内容。',
        '您应尊重他人隐私，不擅自传播他人的个人信息或私密内容。',
      ],
    },
    {
      title: '3. 内容规范',
      content: [
        '鼓励真实、善意的分享，禁止恶意攻击、诱导自伤等危险行为。',
        '平台会使用AI技术识别高危情绪内容，并及时提供危机干预资源。',
        '对于违规内容，我们有权进行隐藏、删除或限制账号权限。',
      ],
    },
    {
      title: '4. 免责声明',
      content: [
        '社区内容由用户自主发布，平台不对其真实性、准确性负责。',
        '用户间的交流和互助行为与平台无关，由用户自行承担责任。',
        '如遇紧急情况，请拨打专业热线或前往医疗机构，不要仅依赖社区支持。',
      ],
    },
  ];
  
  // 隐私政策内容
  const privacyContent = [
    {
      title: '1. 信息收集',
      content: [
        '基本信息：昵称、头像、性别、年龄等，用于个性化服务。',
        '使用数据：浏览记录、发布内容、互动行为，用于优化产品体验。',
        '设备信息：设备型号、系统版本、IP地址，用于安全保护。',
        '情绪数据：情绪记录、AI对话内容，仅用于为您提供更好的支持服务。',
      ],
    },
    {
      title: '2. 信息使用',
      content: [
        '提供和改进社区服务功能。',
        '识别危机信号，及时提供专业资源。',
        '防止欺诈、滥用等违规行为。',
        '遵守法律法规要求的情况下配合调查。',
      ],
    },
    {
      title: '3. 信息保护',
      content: [
        '我们采用加密传输、访问控制等技术保护您的数据安全。',
        '严格限制员工访问权限，签署保密协议。',
        '不会向第三方出售您的个人信息。',
        '在必要情况下（如法律要求）才会共享数据，并提前通知您。',
      ],
    },
    {
      title: '4. 您的权利',
      content: [
        '查阅和导出自己的个人数据。',
        '修改或删除不准确的信息。',
        '撤回已授予的权限或同意。',
        '注销账户并删除所有相关数据。',
        '对数据处理方式提出异议或投诉。',
      ],
    },
  ];
  
  // 社区规范内容
  const communityContent = [
    {
      title: '1. 友善互助',
      content: [
        '用尊重和善意对待每一位成员。',
        '不进行人身攻击、侮辱、歧视或骚扰。',
        '理解每个人都有不同的经历和感受。',
        '在回应他人时保持共情和非评判态度。',
      ],
    },
    {
      title: '2. 真实分享',
      content: [
        '鼓励真实表达自己的感受和经历。',
        '可以选择匿名发布，保护自己的隐私。',
        '不编造虚假故事博取同情或关注。',
        '不冒充专业人士提供医疗建议。',
      ],
    },
    {
      title: '3. 安全第一',
      content: [
        '如您或他人处于危机状态，请立即寻求专业帮助。',
        '不发布详细的自伤方法或危险行为指导。',
        '不诱导、鼓励他人做出伤害自己的行为。',
        '遇到危险内容请及时举报，我们会迅速处理。',
      ],
    },
    {
      title: '4. 禁止行为',
      content: [
        '发布色情、暴力、血腥等不适宜内容。',
        '进行广告推广、诈骗或其他商业行为。',
        '恶意刷屏、灌水或干扰他人正常使用。',
        '侵犯他人隐私、版权或其他合法权益。',
        '传播虚假信息或谣言。',
      ],
    },
  ];
  
  const tabs = [
    { key: 'terms' as const, label: '服务条款', icon: FileText, data: termsContent },
    { key: 'privacy' as const, label: '隐私政策', icon: Shield, data: privacyContent },
    { key: 'community' as const, label: '社区规范', icon: Users, data: communityContent },
  ];
  
  const currentTab = tabs.find(t => t.key === activeTab)!;
  
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
          <h3>用户协议</h3>
          <div className="w-9"></div>
        </div>
      </div>
      
      {/* Tab切换 */}
      <div className="sticky top-[57px] bg-background/95 backdrop-blur-sm z-10 px-6 py-3 border-b border-border/50">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setExpandedSections([0]);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-4">
        {/* 重要提示 */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="mb-1">请仔细阅读并理解</h4>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'terms' && '使用心语社区服务即表示您同意遵守以下条款'}
              {activeTab === 'privacy' && '我们重视并保护您的个人隐私和数据安全'}
              {activeTab === 'community' && '良好的社区氛围需要每一位成员共同维护'}
            </p>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="space-y-3">
          {currentTab.data.map((section, idx) => (
            <div key={idx} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors text-left"
              >
                <h4>{section.title}</h4>
                {expandedSections.includes(idx) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              
              {expandedSections.includes(idx) && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-4">
                  {section.content.map((paragraph, pIdx) => (
                    <div key={pIdx} className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground flex-1">{paragraph}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 更新时间 */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>最后更新：2024年1月</p>
          <p className="mt-1">如有疑问，请联系客服</p>
        </div>
        
        {/* 同意按钮（可选） */}
        <div className="pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  );
}
