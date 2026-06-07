import React from 'react';
import { BarChart3, Globe, UserCheck, Bot } from 'lucide-react';

const AnalyticsSummary = ({ summary }) => {
  if (!summary) return null;

  const trend = summary.clickTrend || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Clicks</p>
          <div className="flex items-baseline space-x-1.5">
            <h2 className="text-2xl font-bold text-white">{summary.totalClicks || 0}</h2>
            {trend !== 0 && (
              <span className={`text-[10px] font-bold ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
          </div>
        </div>
        <div className="bg-primary-500/10 p-2.5 rounded-xl text-primary-400">
          <BarChart3 className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unique Visitors</p>
          <h2 className="text-2xl font-bold text-white">{summary.uniqueVisitors || 0}</h2>
        </div>
        <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-400">
          <Globe className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Human Clicks</p>
          <h2 className="text-2xl font-bold text-emerald-400">{summary.humanClicks || 0}</h2>
        </div>
        <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
          <UserCheck className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bot Clicks</p>
          <h2 className="text-2xl font-bold text-amber-500">{summary.botClicks || 0}</h2>
        </div>
        <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
          <Bot className="w-4.5 h-4.5" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
