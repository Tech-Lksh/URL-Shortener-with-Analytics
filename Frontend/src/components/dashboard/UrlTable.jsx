import React from 'react';
import { Trash2, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import UrlRow from './UrlRow';

const UrlTable = ({
  urls,
  loading,
  selectedCodes,
  setSelectedCodes,
  handleSelectAll,
  handleSelectOne,
  handleCopy,
  copiedCode,
  openEditModal,
  handleDelete,
  handleBulkDelete,
  status,
  page,
  setPage,
  totalPages
}) => {
  return (
    <>
      {/* Selected Bulk Operations Banner */}
      {selectedCodes.length > 0 && (
        <div className="p-4 bg-primary-600/10 border-b border-primary-500/20 flex items-center justify-between animate-fadeIn">
          <span className="text-xs font-bold text-primary-400">
            {selectedCodes.length} URLs Selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkDelete(status === 'deleted')}
              className="flex items-center space-x-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{status === 'deleted' ? 'Delete Permanently' : 'Move to Trash'}</span>
            </button>
            <button
              onClick={() => setSelectedCodes([])}
              className="text-slate-400 hover:text-slate-200 text-xs font-bold animate-pulse"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-xs text-slate-500">Retrieving URLs list...</p>
        </div>
      ) : urls.length === 0 ? (
        <div className="p-16 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-slate-400 font-semibold text-sm">No short links found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no URLs matching the current filters. Create a new link to get started.
          </p>
        </div>
      ) : (
        /* Table Layout */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-800/40 border-b border-white/10">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={urls.length > 0 && selectedCodes.length === urls.length}
                    className="rounded border-white/10 bg-dark-800 text-primary-600 focus:ring-primary-500/20"
                  />
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Short Link</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Original Destination</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Category</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tags</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Description</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Clicks</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Created At</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((urlItem) => (
                <UrlRow
                  key={urlItem._id}
                  urlItem={urlItem}
                  status={status}
                  selectedCodes={selectedCodes}
                  handleSelectOne={handleSelectOne}
                  handleCopy={handleCopy}
                  copiedCode={copiedCode}
                  openEditModal={openEditModal}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && !loading && (
        <div className="p-5 border-t border-white/10 flex items-center justify-between bg-dark-800/10">
          <span className="text-xs text-slate-500">
            Showing page <span className="text-slate-300 font-bold">{page}</span> of <span className="text-slate-300 font-bold">{totalPages}</span>
          </span>
          <div className="flex space-x-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-dark-800 disabled:opacity-50 hover:bg-dark-700 border border-white/10 rounded-lg text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-dark-800 disabled:opacity-50 hover:bg-dark-700 border border-white/10 rounded-lg text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UrlTable;
