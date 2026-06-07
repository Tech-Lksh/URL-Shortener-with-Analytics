import React from 'react';
import { Link2, ArrowRight } from 'lucide-react';

const ShortenerForm = ({
  originalUrl,
  setOriginalUrl,
  customAlias,
  setCustomAlias,
  showAdvanced,
  setShowAdvanced,
  loading,
  error,
  handleShorten
}) => {
  return (
    <form onSubmit={handleShorten} className="space-y-4 relative z-10">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Link2 className="w-5 h-5" />
          </div>
          <input
            type="url"
            required
            placeholder="Paste your long link here (e.g. https://example.com/very-long-path)"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="block w-full pl-10 pr-3 py-4 bg-dark-800/80 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="md:w-36 py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-600/25 flex items-center justify-center space-x-1.5"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Shorten</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Advanced Mode Toggle */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
        >
          {showAdvanced ? 'Hide Custom Options' : 'Set Custom Alias (Optional)'}
        </button>
      </div>

      {showAdvanced && (
        <div className="p-4 bg-dark-800/50 border border-white/5 rounded-xl animate-fadeIn space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Custom Alias</label>
          <div className="flex items-center bg-dark-800 border border-white/10 rounded-lg overflow-hidden focus-within:border-primary-500 transition-colors">
            <span className="bg-dark-700/50 px-3 py-2.5 text-slate-500 text-xs font-medium select-none">
              snapcut.com/
            </span>
            <input
              type="text"
              placeholder="my-custom-code"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              className="w-full px-3 py-2 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none text-sm font-semibold"
            />
          </div>
          <p className="text-[11px] text-slate-500">Only letters and numbers are allowed.</p>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
          {error}
        </div>
      )}
    </form>
  );
};

export default ShortenerForm;
