import React from 'react';
import { Sparkles } from 'lucide-react';

const HeroHeader = () => {
  return (
    <div className="text-center space-y-4 max-w-2xl">
      <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full text-primary-400 text-xs font-semibold tracking-wide">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Next-Generation URL Management</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight leading-tight">
        Shorten. Share. <br />
        <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-purple-500 bg-clip-text text-transparent">
          Track Instantly.
        </span>
      </h1>
      <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
        Create premium short links with custom aliases, real-time geographic tracking, and full analytics dashboards.
      </p>
    </div>
  );
};

export default HeroHeader;
