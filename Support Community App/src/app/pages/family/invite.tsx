import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Copy, Share2, QrCode, Mail, MessageCircle } from 'lucide-react';

export default function FamilyInvitePage() {
  const navigate = useNavigate();
  const [inviteCode] = useState('FAMILY2024');
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3>邀请家庭成员</h3>
          <div className="w-9"></div>
        </div>
      </header>
      
      <div className="px-6 pt-6">
        {/* 说明 */}
        <div className="bg-accent/30 rounded-2xl p-5 mb-6 border border-primary/20">
          <h4 className="mb-2">邀请家属加入</h4>
          <p className="text-sm text-muted-foreground">
            分享邀请码给你的家人，他们可以通过邀请码加入你的家庭圈，陪伴和支持你的康复之路。
          </p>
        </div>
        
        {/* 邀请码 */}
        <div className="bg-card rounded-2xl p-6 mb-6 border border-border/50">
          <h4 className="mb-4 text-center">你的专属邀请码</h4>
          <div className="bg-secondary/50 rounded-xl p-6 mb-4">
            <div className="text-3xl font-bold text-center text-primary tracking-widest">
              {inviteCode}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-5 h-5" />
            {copied ? '已复制' : '复制邀请码'}
          </button>
        </div>
        
        {/* 二维码 */}
        <div className="bg-card rounded-2xl p-6 mb-6 border border-border/50">
          <h4 className="mb-4 text-center">扫码加入</h4>
          <div className="bg-secondary/50 rounded-xl p-8 flex items-center justify-center mb-4">
            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-muted-foreground" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            家人可以扫描二维码快速加入
          </p>
        </div>
        
        {/* 分享方式 */}
        <div className="space-y-3 mb-6">
          <h4 className="mb-3">分享方式</h4>
          <button className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <h4>微信分享</h4>
              <p className="text-sm text-muted-foreground">分享邀请码到微信</p>
            </div>
          </button>
          
          <button className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h4>邮件分享</h4>
              <p className="text-sm text-muted-foreground">通过邮件发送邀请</p>
            </div>
          </button>
          
          <button className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-sm transition-shadow flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <h4>更多方式</h4>
              <p className="text-sm text-muted-foreground">分享到其他应用</p>
            </div>
          </button>
        </div>
        
        {/* 隐私提示 */}
        <div className="bg-accent/20 rounded-2xl p-4 mb-6 border border-border/30">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">隐私提示：</span>
            邀请码仅用于家庭成员验证，你可以随时在设置中管理家庭成员权限和可见内容。
          </p>
        </div>
      </div>
    </div>
  );
}
