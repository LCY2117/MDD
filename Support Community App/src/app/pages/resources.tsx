import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone, MapPin, BookOpen, Video, FileText, Heart, ExternalLink, Clock } from 'lucide-react';
import { BottomNav } from '../components/community/bottom-nav';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hotline' | 'medical'>('hotline');
  
  const hotlines = [
    {
      name: '全国心理援助热线',
      number: '400-161-9995',
      hours: '24小时',
      description: '专业心理咨询师提供情绪支持',
      isEmergency: true,
    },
    {
      name: '北京心理危机干预热线',
      number: '010-82951332',
      hours: '24小时',
      description: '专业危机干预和心理疏导',
      isEmergency: true,
    },
    {
      name: '生命热线',
      number: '400-821-1215',
      hours: '周一至周日 10:00-22:00',
      description: '倾听你的困扰，陪伴你度过难关',
      isEmergency: false,
    },
    {
      name: '青少年心理热线',
      number: '12355',
      hours: '周一至周五 9:00-17:00',
      description: '青少年心理健康咨询',
      isEmergency: false,
    },
  ];
  
  const medicalResources = [
    {
      name: '北京安定医院',
      type: '三甲精神专科',
      address: '北京市西城区德胜门外安康胡同5号',
      distance: '2.3km',
    },
    {
      name: '北京大学第六医院',
      type: '三甲精神专科',
      address: '北京市海淀区花园北路51号',
      distance: '5.8km',
    },
    {
      name: '回龙观医院',
      type: '三甲精神专科',
      address: '北京市昌平区回龙观镇',
      distance: '12.5km',
    },
  ];
  
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
          <h3>支持资源</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      {/* 紧急求助横幅 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-gradient-to-r from-destructive/10 to-warning/10 rounded-2xl p-5 border border-destructive/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-destructive">紧急情况？立即拨打</h4>
              <p className="text-sm text-muted-foreground mb-3">
                如果你或他人正面临生命危险，请立即拨打紧急求助热线
              </p>
              <a href="tel:400-161-9995">
                <button className="w-full py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors font-medium">
                  拨打 400-161-9995
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* 标签页 */}
      <div className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('hotline')}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              activeTab === 'hotline'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            求助热线
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              activeTab === 'medical'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            就医指南
          </button>
        </div>
      </div>
      
      {/* 内容区 */}
      <div className="px-6 pb-6">
        {activeTab === 'hotline' && (
          <div className="space-y-3">
            {hotlines.map((hotline, index) => (
              <div
                key={index}
                className={`bg-card rounded-2xl p-5 shadow-sm border ${
                  hotline.isEmergency ? 'border-destructive/30' : 'border-border/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{hotline.name}</h4>
                      {hotline.isEmergency && (
                        <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded-full">
                          24小时
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{hotline.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{hotline.hours}</span>
                </div>
                <a href={`tel:${hotline.number}`}>
                  <button className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    hotline.isEmergency
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}>
                    <Phone className="w-4 h-4 inline mr-2" />
                    拨打 {hotline.number}
                  </button>
                </a>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'medical' && (
          <div className="space-y-3">
            <div className="bg-accent/30 rounded-2xl p-4 mb-4 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                以下为北京地区精神专科医院，建议提前预约。其他地区用户可搜索当地精神卫生中心。
              </p>
            </div>
            
            {medicalResources.map((hospital, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 shadow-sm border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1">{hospital.name}</h4>
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                      {hospital.type}
                    </span>
                  </div>
                  <span className="text-sm text-primary">{hospital.distance}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{hospital.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 bg-secondary text-foreground rounded-lg hover:bg-accent transition-colors">
                    查看地图
                  </button>
                  <button className="py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    预约挂号
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}