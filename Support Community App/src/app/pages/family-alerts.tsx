import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, AlertTriangle, Phone, MessageCircle, MapPin, Clock, CheckCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface Alert {
  id: string;
  patientName: string;
  patientAvatar: string;
  type: 'emergency' | 'mood' | 'location';
  title: string;
  message: string;
  time: string;
  location?: string;
  isRead: boolean;
  isHandled: boolean;
}

export default function FamilyAlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      patientName: '小明',
      patientAvatar: '👦',
      type: 'emergency',
      title: '紧急求助',
      message: '患者触发了紧急求助按钮，可能需要立即帮助',
      time: '5分钟前',
      location: '北京市朝阳区xxx路',
      isRead: false,
      isHandled: false,
    },
    {
      id: '2',
      patientName: '小明',
      patientAvatar: '👦',
      type: 'mood',
      title: '情绪异常',
      message: '检测到连续3天情绪低落记录，建议关注',
      time: '2小时前',
      isRead: false,
      isHandled: false,
    },
    {
      id: '3',
      patientName: '小明',
      patientAvatar: '👦',
      type: 'mood',
      title: '活动减少',
      message: '最近7天未进行社区互动，可能需要陪伴',
      time: '昨天',
      isRead: true,
      isHandled: true,
    },
  ]);
  
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };
  
  const markAsHandled = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isHandled: true, isRead: true } : alert
    ));
  };
  
  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'emergency':
        return {
          bg: 'bg-destructive/10',
          border: 'border-destructive/30',
          icon: 'text-destructive',
          iconBg: 'bg-destructive/20',
        };
      case 'mood':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          iconBg: 'bg-orange-100',
        };
      case 'location':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
        };
      default:
        return {
          bg: 'bg-secondary',
          border: 'border-border/50',
          icon: 'text-muted-foreground',
          iconBg: 'bg-secondary',
        };
    }
  };
  
  const unreadCount = alerts.filter(a => !a.isRead).length;
  
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
          <div>
            <h3 className="mb-0.5">报警提醒</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} 条未读</p>
            )}
          </div>
          <button
            onClick={() => {
              alerts.forEach(alert => {
                if (!alert.isRead) markAsRead(alert.id);
              });
            }}
            className="text-sm text-primary hover:underline"
          >
            全部已读
          </button>
        </div>
      </div>
      
      {/* 说明卡片 */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="mb-1 text-primary">关于报警提醒</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                当患者触发紧急求助或系统检测到异常情绪时，你会收到提醒。请及时关注并采取必要行动。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 报警列表 */}
      <div className="px-6 py-4">
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const style = getAlertStyle(alert.type);
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border ${style.border} ${
                    alert.isRead ? 'bg-card' : style.bg
                  } overflow-hidden`}
                >
                  <div className="p-4">
                    {/* 头部 */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl">
                          {alert.patientAvatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg ${style.iconBg} border-2 border-background flex items-center justify-center`}>
                          <AlertTriangle className={`w-3 h-3 ${style.icon}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={alert.type === 'emergency' ? 'text-destructive' : ''}>
                            {alert.title}
                          </h4>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          来自 {alert.patientName}
                        </p>
                        <p className="text-sm leading-relaxed">{alert.message}</p>
                      </div>
                      
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    
                    {/* 位置信息 */}
                    {alert.location && (
                      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-secondary rounded-lg">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{alert.location}</span>
                      </div>
                    )}
                    
                    {/* 时间 */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alert.time}</span>
                    </div>
                    
                    {/* 操作按钮 */}
                    {!alert.isHandled ? (
                      <div className="flex gap-2">
                        {alert.type === 'emergency' ? (
                          <>
                            <button
                              onClick={() => {
                                markAsHandled(alert.id);
                                // 模拟拨打电话
                                alert('拨打紧急联系电话');
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">立即联系</span>
                            </button>
                            <button
                              onClick={() => {
                                markAsHandled(alert.id);
                                navigate(`/messages/${alert.id}`);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">发消息</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                markAsHandled(alert.id);
                                navigate(`/messages/${alert.id}`);
                              }}
                              className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                            >
                              发送关心
                            </button>
                            <button
                              onClick={() => markAsHandled(alert.id)}
                              className="px-4 py-2.5 bg-secondary rounded-lg hover:bg-accent transition-colors text-sm"
                            >
                              已处理
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-2 px-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">已处理</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">暂无报警提醒</p>
          </div>
        )}
      </div>
      
      {/* 紧急求助卡片 */}
      <div className="px-6 py-4">
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5">
          <h4 className="text-destructive mb-2">紧急情况处理</h4>
          <p className="text-sm text-muted-foreground mb-4">
            如果情况紧急，请立即：
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-4">
            <li>• 拨打患者电话，确认安全状况</li>
            <li>• 如无法联系，前往患者所在位置</li>
            <li>• 必要时拨打120急救或110报警</li>
            <li>• 联系患者的心理医生或咨询师</li>
          </ul>
          <button
            onClick={() => navigate('/resources')}
            className="w-full py-3 bg-destructive text-white rounded-xl hover:bg-destructive/90 transition-colors"
          >
            查看紧急资源
          </button>
        </div>
      </div>
    </div>
  );
}
