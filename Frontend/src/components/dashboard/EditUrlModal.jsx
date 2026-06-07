import React from 'react';
import { X } from 'lucide-react';

const EditUrlModal = ({
  editingUrl,
  setEditingUrl,
  editTitle,
  setEditTitle,
  editDesc,
  setEditDesc,
  editCategory,
  setEditCategory,
  editStatus,
  setEditStatus,
  editTags,
  setEditTags,
  savingEdit,
  handleEditSubmit
}) => {
  if (!editingUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-card relative overflow-y-auto max-h-[90vh] space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-xl font-bold text-white">Edit URL Metadata</h3>
            <p className="text-[11px] text-slate-500 font-mono">/{editingUrl.shortCode}</p>
          </div>
          <button onClick={() => setEditingUrl(null)} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Link Title</label>
            <input
              type="text"
              placeholder="Set title for the link"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="block w-full px-3 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
            <textarea
              rows="3"
              placeholder="What is this link about?"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="block w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-xs font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
              <input
                type="text"
                placeholder="Marketing"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="block w-full px-3 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="block w-full bg-dark-800 border border-white/10 px-2 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="tag1, tag2, tag3"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="block w-full px-3 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={savingEdit}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-bold rounded-xl transition-all duration-300 shadow-lg"
          >
            {savingEdit ? 'Saving Changes...' : 'Save Updates'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUrlModal;
