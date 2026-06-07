import React from 'react';
import { X } from 'lucide-react';

const CreateUrlModal = ({
  showCreateModal,
  setShowCreateModal,
  newOriginalUrl,
  setNewOriginalUrl,
  newAlias,
  setNewAlias,
  newTitle,
  setNewTitle,
  newTags,
  setNewTags,
  creating,
  handleCreateURL
}) => {
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-card relative overflow-y-auto max-h-[90vh] space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white">Create Shortened URL</h3>
          <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateURL} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Destination URL</label>
            <input
              type="url"
              required
              placeholder="https://example.com/very-long-url"
              value={newOriginalUrl}
              onChange={(e) => setNewOriginalUrl(e.target.value)}
              className="block w-full px-3 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Custom Alias (Optional)</label>
            <input
              type="text"
              placeholder="my-alias"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              className="block w-full px-3 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Link Title (Optional)</label>
            <input
              type="text"
              placeholder="Product Page Landing"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="block w-full px-3 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="promo, tech, social"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="block w-full px-3 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-bold rounded-xl transition-all duration-300 shadow-lg"
          >
            {creating ? 'Creating...' : 'Shorten Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUrlModal;
