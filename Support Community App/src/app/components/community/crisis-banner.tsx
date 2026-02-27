import { Phone, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function CrisisBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-4 mb-4 border border-primary/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="mb-1">感到特别困难吗?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            我们在这里陪伴你。如果此刻感到难以承受，请随时寻求专业支持。
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/resources">
              <button className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                求助热线
              </button>
            </Link>
            <Link to="/resources">
              <button className="text-sm px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-secondary transition-colors">
                专业资源
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
