import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Calendar, Edit3, BarChart3, Trash2 } from 'lucide-react';

const UrlRow = ({
  urlItem,
  status,
  selectedCodes,
  handleSelectOne,
  handleCopy,
  copiedCode,
  openEditModal,
  handleDelete
}) => {
  const [descExpanded, setDescExpanded] = useState(false);

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
      {/* Checkbox column */}
      <td className="p-4 text-center">
        <input
          type="checkbox"
          checked={selectedCodes.includes(urlItem.shortCode)}
          onChange={() => handleSelectOne(urlItem.shortCode)}
          className="rounded border-white/10 bg-dark-800 text-primary-600 focus:ring-primary-500/20"
        />
      </td>
      {/* Short Link column */}
      <td className="p-4 max-w-[200px]">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1">
            <a 
              href={urlItem.shortUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary-400 hover:underline font-bold text-sm truncate"
            >
              /{urlItem.shortCode}
            </a>
            <button
              onClick={() => handleCopy(urlItem.shortUrl, urlItem.shortCode)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              {copiedCode === urlItem.shortCode ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {urlItem.title && (
            <span className="text-xs text-slate-300 font-semibold block truncate" title={urlItem.title}>
              {urlItem.title}
            </span>
          )}
        </div>
      </td>
      {/* Original Destination column */}
      <td className="p-4 max-w-[250px] text-xs text-slate-400 truncate">
        <a 
          href={urlItem.originalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary-300 hover:underline"
        >
          {urlItem.originalUrl}
        </a>
      </td>
      {/* Category column */}
      <td className="p-4 text-xs font-medium text-slate-300">
        {urlItem.category ? (
          <span className="bg-primary-500/10 text-primary-400 border border-primary-500/15 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            {urlItem.category}
          </span>
        ) : (
          <span className="text-slate-600 italic">None</span>
        )}
      </td>
      {/* Tags column */}
      <td className="p-4 max-w-[150px]">
        {urlItem.tags && urlItem.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {urlItem.tags.map((tag, i) => (
              <span key={i} className="bg-slate-500/10 text-slate-400 border border-white/5 px-2 py-0.5 rounded-lg text-[10px] font-semibold">
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-600 italic">None</span>
        )}
      </td>
      {/* Description column */}
      <td 
        className="p-4 max-w-[200px] text-xs text-slate-400 cursor-pointer select-none"
        onClick={() => setDescExpanded(!descExpanded)}
      >
        {urlItem.description ? (
          <div className="space-y-0.5">
            <div className={descExpanded ? "whitespace-normal break-words text-slate-200 font-medium" : "truncate"}>
              {urlItem.description}
            </div>
            {urlItem.description.length > 25 && (
              <span className="text-[9px] font-bold text-primary-400 uppercase tracking-wider block mt-0.5 hover:text-primary-300 transition-colors">
                {descExpanded ? 'Show Less' : 'Read More'}
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-600 italic">No description</span>
        )}
      </td>
      {/* Clicks column */}
      <td className="p-4 text-center">
        <span className="inline-flex bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
          {urlItem.analytics?.totalClicks || 0}
        </span>
      </td>
      {/* Date column */}
      <td className="p-4 text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{new Date(urlItem.createdAt).toLocaleDateString()}</span>
        </div>
      </td>
      {/* Actions column */}
      <td className="p-4 text-right">
        <div className="inline-flex space-x-1">
          <button
            onClick={() => openEditModal(urlItem)}
            title="Edit link details"
            className="bg-dark-800 text-slate-300 hover:bg-dark-700 border border-white/10 p-2 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          
          {status !== 'deleted' && (
            <Link
              to={`/analytics/${urlItem.shortCode}`}
              title="Analytics Dashboard"
              className="bg-dark-800 text-slate-300 hover:bg-dark-700 border border-white/10 p-2 rounded-lg transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-primary-400" />
            </Link>
          )}

          <button
            onClick={() => handleDelete(urlItem.shortCode, status === 'deleted')}
            title={status === 'deleted' ? 'Permanently Delete' : 'Move to Trash'}
            className="bg-dark-800 text-red-400 hover:bg-red-500/10 border border-white/10 p-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UrlRow;
