import React, { useState } from 'react';
import { 
  Search, Calendar, Globe, Monitor, Smartphone, Tablet, Cpu,
  ChevronLeft, ChevronRight, ShieldAlert, Tag, HelpCircle
} from 'lucide-react';

const VisitorLogsTable = ({ logs = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logs based on search term
  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    return (
      (log.ipAddress && log.ipAddress.toLowerCase().includes(term)) ||
      (log.country && log.country.toLowerCase().includes(term)) ||
      (log.city && log.city.toLowerCase().includes(term)) ||
      (log.isp && log.isp.toLowerCase().includes(term)) ||
      (log.browserName && log.browserName.toLowerCase().includes(term)) ||
      (log.osType && log.osType.toLowerCase().includes(term)) ||
      (log.referer && log.referer.toLowerCase().includes(term)) ||
      (log.utm?.source && log.utm.source.toLowerCase().includes(term)) ||
      (log.utm?.campaign && log.utm.campaign.toLowerCase().includes(term))
    );
  });

  // Pagination calculations
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper to format date
  const formatDateTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const datePart = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const timePart = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      return { datePart, timePart };
    } catch (e) {
      return { datePart: dateStr, timePart: '' };
    }
  };

  // Helper to render OS Icon
  const getOSIcon = (osType) => {
    const os = (osType || '').toLowerCase();
    if (os.includes('win')) return <span className="text-blue-400">🪟</span>;
    if (os.includes('mac') || os.includes('ios')) return <span className="text-slate-300">🍎</span>;
    if (os.includes('android')) return <span className="text-emerald-400">🤖</span>;
    if (os.includes('linux')) return <span className="text-amber-500">🐧</span>;
    return <Cpu className="w-3.5 h-3.5 text-slate-400" />;
  };

  // Helper to render device icon
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5 text-blue-400" />;
      case 'desktop':
      default:
        return <Monitor className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center space-x-1.5">
            <Calendar className="w-5 h-5 text-primary-400" />
            <span>Visitor Clicks Log</span>
          </h3>
          <p className="text-xs text-slate-500">Real-time breakdown of recent visitor interactions</p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clicks log..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-dark-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      {logs.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-500 border border-white/5 rounded-xl bg-white/[0.01]">
          No click logs recorded for this link yet.
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-500 border border-white/5 rounded-xl bg-white/[0.01]">
          No records match your search criteria.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-dark-800/40 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-3">Time</th>
                  <th className="p-3">IP & Location</th>
                  <th className="p-3">Device & OS</th>
                  <th className="p-3">Browser</th>
                  <th className="p-3">Referrer & UTM</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log, index) => {
                  const hasUtm = log.utm && Object.values(log.utm).some(Boolean);
                  return (
                    <tr 
                      key={log._id || index} 
                      className={`border-b border-white/5 text-xs text-slate-300 hover:bg-white/[0.01] transition-colors ${log.isRobot ? 'bg-red-500/5 hover:bg-red-500/10' : ''}`}
                    >
                      {/* Timestamp */}
                      <td className="p-3 align-top whitespace-nowrap">
                        {(() => {
                          const { datePart, timePart } = formatDateTime(log.timestamp);
                          return (
                            <div className="flex flex-col space-y-0.5">
                              <span className="font-semibold text-slate-200">{datePart}</span>
                              {timePart && (
                                <span className="text-[10px] font-mono font-medium text-slate-400/90 tracking-wider">
                                  {timePart}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                        {log.isRobot && (
                          <span className="inline-flex items-center space-x-0.5 mt-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>Bot: {log.botName || 'generic'}</span>
                          </span>
                        )}
                      </td>

                      {/* IP & Location */}
                      <td className="p-3 align-top">
                        <div className="font-semibold text-slate-200 font-mono">{log.ipAddress}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center space-x-1">
                          <Globe className="w-2.5 h-2.5" />
                          <span>{log.city || 'Unknown'}, {log.country || 'Unknown'}</span>
                        </div>
                        {log.latitude !== undefined && log.longitude !== undefined && log.latitude !== null && (
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                            Coords: {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}
                          </div>
                        )}
                        {log.visitorId && (
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5" title={log.visitorId}>
                            FP: {log.visitorId.substring(0, 12)}...
                          </div>
                        )}
                        {log.isp && (
                          <div className="text-[10px] text-slate-500 font-medium italic mt-0.5 max-w-[200px] truncate">
                            {log.isp}
                          </div>
                        )}
                      </td>

                      {/* Device & OS */}
                      <td className="p-3 align-top">
                        <div className="flex items-center space-x-1.5">
                          {getDeviceIcon(log.deviceType)}
                          <span className="font-semibold text-slate-200 capitalize">
                            {log.deviceType === 'unknown' ? 'Other' : log.deviceType}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                          {getOSIcon(log.osType)}
                          <span>{log.osType || 'Unknown'} {log.osVersion && `(${log.osVersion})`}</span>
                        </div>
                        {log.deviceBrand && log.deviceBrand !== 'Unknown' && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {log.deviceBrand} {log.deviceModel !== 'Unknown' && log.deviceModel}
                          </div>
                        )}
                      </td>

                      {/* Browser */}
                      <td className="p-3 align-top">
                        <div className="font-semibold text-slate-200">{log.browserName || 'Unknown'}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          v{log.browserVersion || '?.?'}
                        </div>
                        {log.browserLanguage && (
                          <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
                            Lang: {log.browserLanguage}
                          </div>
                        )}
                      </td>


                      {/* Referrer & UTM */}
                      <td className="p-3 align-top max-w-[280px]">
                        <div className="truncate text-slate-300 font-mono text-[10px]" title={log.referer || 'Direct traffic'}>
                          {log.referer ? (
                            <a 
                              href={log.referer} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary-400 hover:underline"
                            >
                              {log.referer}
                            </a>
                          ) : (
                            <span className="text-slate-500 italic">Direct / No Referrer</span>
                          )}
                        </div>

                        {/* UTM tags */}
                        {hasUtm && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {log.utm.source && (
                              <span className="inline-flex items-center space-x-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/15 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                <Tag className="w-2.5 h-2.5" />
                                <span>src: {log.utm.source}</span>
                              </span>
                            )}
                            {log.utm.medium && (
                              <span className="inline-flex items-center space-x-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/15 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                <span>med: {log.utm.medium}</span>
                              </span>
                            )}
                            {log.utm.campaign && (
                              <span className="inline-flex items-center space-x-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/15 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                <span>cam: {log.utm.campaign}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-semibold">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} logs
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-white/5 bg-dark-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      currentPage === p 
                        ? 'bg-primary-600 border-primary-500 text-white' 
                        : 'bg-dark-800 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-white/5 bg-dark-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitorLogsTable;
