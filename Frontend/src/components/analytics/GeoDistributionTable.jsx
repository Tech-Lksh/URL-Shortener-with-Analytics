import React from 'react';
import { Globe } from 'lucide-react';

const GeoDistributionTable = ({ geographic, totalClicks }) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div>
        <h3 className="font-bold text-lg text-white flex items-center space-x-1.5">
          <Globe className="w-5 h-5 text-primary-400" />
          <span>Geographic Distribution</span>
        </h3>
        <p className="text-xs text-slate-500">Breakdown of clicks by Country and City</p>
      </div>

      {geographic.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-600">No geolocation records yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-800/40 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="p-3">Country</th>
                <th className="p-3">City</th>
                <th className="p-3 text-center">Clicks</th>
                <th className="p-3 text-center">Unique Visitors</th>
                <th className="p-3 text-right">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {geographic.map((geo, index) => {
                const clickRatio = totalClicks > 0 ? ((geo.clicks / totalClicks) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={index} className="border-b border-white/5 text-xs text-slate-300 font-medium hover:bg-white/[0.01]">
                    <td className="p-3">{geo.country}</td>
                    <td className="p-3">{geo.city}</td>
                    <td className="p-3 text-center">
                      <span className="bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/20 font-bold">
                        {geo.clicks}
                      </span>
                    </td>
                    <td className="p-3 text-center">{geo.uniqueVisitors}</td>
                    <td className="p-3 text-right text-slate-400 font-bold">{clickRatio}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GeoDistributionTable;
