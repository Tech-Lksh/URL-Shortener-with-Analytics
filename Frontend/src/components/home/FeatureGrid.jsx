import React from 'react';
import { Sparkles, BarChart3, Shield } from 'lucide-react';

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-6">
      <div className="glass-card flex flex-col space-y-3 glass-hover">
        <div className="bg-primary-500/10 border border-primary-500/20 p-3 rounded-xl w-max text-primary-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg text-slate-200">Lightning Fast</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Sub-50ms redirect response times ensuring your visitors never experience loading lag or delay.
        </p>
      </div>

      <div className="glass-card flex flex-col space-y-3 glass-hover">
        <div className="bg-primary-500/10 border border-primary-500/20 p-3 rounded-xl w-max text-primary-400">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg text-slate-200">Real-Time Analytics</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Detailed tracking showing geolocation (country, city), operating systems, device types, and browser info.
        </p>
      </div>

      <div className="glass-card flex flex-col space-y-3 glass-hover">
        <div className="bg-primary-500/10 border border-primary-500/20 p-3 rounded-xl w-max text-primary-400">
          <Shield className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg text-slate-200">Privacy First</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Secure browser fingerprinting for tracking unique visitors without storing cookies or invasive logs.
        </p>
      </div>
    </div>
  );
};

export default FeatureGrid;
