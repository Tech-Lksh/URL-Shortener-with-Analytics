import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Zap, Users, Calendar, TrendingUp, BarChart2, AreaChart as AreaIcon, Clock
} from 'lucide-react';

const ClicksTimelineChart = ({ chartData, timeframe, onTimeframeChange }) => {
  const [chartType, setChartType] = useState('area'); // 'area' or 'bar'

  // Calculate quick metrics dynamically based on the current timeframe data
  const stats = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { totalClicks: 0, totalVisitors: 0, avgClicks: 0, peakValue: 0, peakName: 'N/A' };
    }
    let totalClicks = 0;
    let totalVisitors = 0;
    let peakValue = 0;
    let peakName = 'N/A';
    
    chartData.forEach(item => {
      totalClicks += item.Clicks || 0;
      totalVisitors += item.Visitors || 0;
      if ((item.Clicks || 0) > peakValue) {
        peakValue = item.Clicks;
        peakName = item.name;
      }
    });

    const avgClicks = (totalClicks / chartData.length).toFixed(1);

    return { totalClicks, totalVisitors, avgClicks, peakValue, peakName };
  }, [chartData]);

  // Process chartData for rendering: if there is only 1 data point, prepend a 0-value start point
  // so that the Recharts AreaChart can render a line and filled area gradient.
  const processedData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    if (chartData.length === 1) {
      const singlePoint = chartData[0];
      let startLabel = 'Start';
      if (timeframe === 'month') {
        const parts = singlePoint.name.split('/');
        if (parts.length === 2) {
          const m = parseInt(parts[0]);
          const y = parseInt(parts[1]);
          const prevM = m === 1 ? 12 : m - 1;
          const prevY = m === 1 ? y - 1 : y;
          startLabel = `${prevM.toString().padStart(2, '0')}/${prevY}`;
        }
      } else if (timeframe === 'day') {
        const parts = singlePoint.name.split('/');
        if (parts.length === 3) {
          const d = parseInt(parts[0]);
          const m = parseInt(parts[1]);
          const y = parseInt(parts[2]);
          const prevD = d === 1 ? 28 : d - 1;
          startLabel = `${prevD.toString().padStart(2, '0')}/${m}/${y}`;
        }
      } else if (timeframe === 'hour') {
        const parts = singlePoint.name.split(' ');
        if (parts.length === 2) {
          const datePart = parts[0];
          const hourPart = parts[1].split(':')[0];
          const h = parseInt(hourPart);
          const prevH = h === 0 ? 23 : h - 1;
          startLabel = `${datePart} ${prevH.toString().padStart(2, '0')}:00`;
        }
      }
      return [
        { name: startLabel, Clicks: 0, Visitors: 0 },
        singlePoint
      ];
    }
    return chartData;
  }, [chartData, timeframe]);

  // Custom Tooltip component for better visual representation
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl p-3 shadow-2xl border border-white/10 bg-dark-950/95 backdrop-blur-md min-w-[200px]">
          <div className="flex items-center space-x-1.5 border-b border-white/5 pb-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-200">{label}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30"></span>
                <span>Total Clicks</span>
              </span>
              <span className="text-xs font-extrabold text-blue-400">{payload[0]?.value || 0}</span>
            </div>
            {payload[1] && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/30"></span>
                  <span>Unique Visitors</span>
                </span>
                <span className="text-xs font-extrabold text-purple-400">{payload[1]?.value || 0}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 space-y-6 relative overflow-hidden">
      {/* Background glow decorator */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-xl text-white tracking-tight">Clicks Timeline</h3>
            <span className="bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Live Analytics
            </span>
          </div>
          <p className="text-xs text-slate-400">Interactive visual breakdown of link clicks and unique visitors over time.</p>
        </div>

        {/* Chart type & timeframe buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart type toggle */}
          <div className="flex bg-dark-900 border border-white/10 p-0.5 rounded-xl">
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                chartType === 'area'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Area Chart"
            >
              <AreaIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline px-1">Area</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                chartType === 'bar'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bar Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline px-1">Bar</span>
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-dark-900 border border-white/10 p-0.5 rounded-xl">
            {['hour', 'day', 'month'].map(tf => (
              <button
                key={tf}
                onClick={() => onTimeframeChange && onTimeframeChange(tf)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center space-x-1 ${
                  timeframe === tf
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf === 'hour' && <Clock className="w-3 h-3 mr-0.5" />}
                <span>{tf}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick metrics row */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="glass-card !p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl flex items-center space-x-3 transition-all">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500">Period Clicks</p>
              <h4 className="text-lg font-black text-white leading-tight">{stats.totalClicks}</h4>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="glass-card !p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl flex items-center space-x-3 transition-all">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500">Period Visitors</p>
              <h4 className="text-lg font-black text-white leading-tight">{stats.totalVisitors}</h4>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="glass-card !p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl flex items-center space-x-3 transition-all">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500">Avg. Click Rate</p>
              <h4 className="text-lg font-black text-white leading-tight">{stats.avgClicks} <span className="text-xs text-slate-400 font-medium">/ pt</span></h4>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="glass-card !p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl flex items-center space-x-3 transition-all col-span-2 md:col-span-1 font-sans">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500">Peak Activity</p>
              <h4 className="text-sm font-black text-white leading-tight truncate" title={`${stats.peakValue} clicks on ${stats.peakName}`}>
                {stats.peakValue} <span className="text-[10px] font-medium text-slate-400">clicks on {stats.peakName}</span>
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Main chart wrapper */}
      <div className="h-80 w-full relative">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 border border-dashed border-white/5 rounded-2xl bg-dark-950/20">
            <Clock className="w-8 h-8 text-slate-600 animate-pulse" />
            <p className="text-xs font-semibold">No timeline data available for this timeframe</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            {chartType === 'area' ? (
              <AreaChart data={processedData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false} 
                  dy={10}
                  tick={{ fill: '#94a3b8', fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false} 
                  allowDecimals={false}
                  dx={-5}
                  tick={{ fill: '#94a3b8', fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="Clicks" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                  dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4, fill: '#0B0F19' }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: '#3B82F6' }} 
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="Visitors" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                  strokeDasharray="4 4"
                  dot={{ stroke: '#8B5CF6', strokeWidth: 1.5, r: 3, fill: '#0B0F19' }}
                  activeDot={{ r: 5, strokeWidth: 1.5, fill: '#8B5CF6' }}
                  animationDuration={1500}
                />
              </AreaChart>
            ) : (
              <BarChart data={processedData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false} 
                  dy={10}
                  tick={{ fill: '#94a3b8', fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false} 
                  allowDecimals={false}
                  dx={-5}
                  tick={{ fill: '#94a3b8', fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                <Bar 
                  dataKey="Clicks" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={25}
                  animationDuration={1200}
                />
                <Bar 
                  dataKey="Visitors" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={25}
                  animationDuration={1200}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ClicksTimelineChart;
