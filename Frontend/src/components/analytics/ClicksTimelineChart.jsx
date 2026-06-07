import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const ClicksTimelineChart = ({ chartData, timeframe, onTimeframeChange }) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-bold text-lg text-white">Clicks Timeline</h3>
          <p className="text-xs text-slate-500">Daily breakdown of link visits</p>
        </div>
        <div className="flex bg-dark-900 border border-white/10 p-0.5 rounded-lg">
          {['hour', 'day', 'month'].map(tf => (
            <button
              key={tf}
              onClick={() => onTimeframeChange && onTimeframeChange(tf)}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                timeframe === tf 
                  ? 'bg-primary-600 text-white' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs">
            No timeline data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(21, 27, 44, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="Clicks" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4, fill: '#0B0F19' }}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Visitors" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ stroke: '#8B5CF6', strokeWidth: 1, r: 3, fill: '#0B0F19' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ClicksTimelineChart;
