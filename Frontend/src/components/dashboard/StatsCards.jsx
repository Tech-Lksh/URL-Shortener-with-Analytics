import React from 'react';
import { Plus, BarChart3, RefreshCw } from 'lucide-react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="glass-card flex items-center justify-between p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500/5 rounded-full blur-xl -mr-4 -mt-4" />
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total URLs</p>
          <h2 className="text-3xl font-bold text-white">{stats.totalURLs || 0}</h2>
        </div>
        <div className="bg-primary-500/10 p-3 rounded-xl text-primary-400">
          <Plus className="w-5 h-5" />
        </div>
      </div>

      <div className="glass-card flex items-center justify-between p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl -mr-4 -mt-4" />
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Clicks</p>
          <h2 className="text-3xl font-bold text-white">{stats.totalClicks || 0}</h2>
        </div>
        <div className="bg-purple-500/10 p-3 rounded-xl text-purple-400">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>

      <div className="glass-card flex items-center justify-between p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl -mr-4 -mt-4" />
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Avg Clicks</p>
          <h2 className="text-3xl font-bold text-white">{stats.averageClicks || 0}</h2>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400">
          <RefreshCw className="w-5 h-5 animate-spin-slow" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
