import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

const DistributionPieChart = ({
  title,
  subtitle,
  icon: Icon,
  chartData,
  emptyMessage
}) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-between h-[340px]">
      <div className="w-full text-left self-start">
        <h3 className="font-bold text-md text-white flex items-center space-x-1.5">
          {Icon && <Icon className="w-4.5 h-4.5 text-primary-400" />}
          <span>{title}</span>
        </h3>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
      </div>
      <div className="h-44 w-full flex items-center justify-center">
        {chartData.length === 0 ? (
          <span className="text-xs text-slate-600">{emptyMessage}</span>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(21, 27, 44, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '11px'
                }} 
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DistributionPieChart;
