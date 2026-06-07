import React from 'react';
import { Search } from 'lucide-react';

const Toolbar = ({
  status,
  setStatus,
  setPage,
  search,
  setSearch,
  handleSearchSubmit,
  sort,
  setSort,
  order,
  setOrder,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo
}) => {
  return (
    <>
      {/* Filters Top Bar */}
      <div className="p-5 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Tab Toggle */}
        <div className="flex bg-dark-900 border border-white/10 p-1 rounded-xl w-full md:w-auto">
          {['active', 'archived', 'deleted'].map(tab => (
            <button
              key={tab}
              onClick={() => { setStatus(tab); setPage(1); }}
              className={`flex-grow md:flex-grow-0 px-4 py-2 rounded-lg font-bold text-xs capitalize transition-all ${
                status === tab 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'deleted' ? 'Trash' : tab}
            </button>
          ))}
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-grow md:max-w-md">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by title, description, or alias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-dark-800 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-xs"
            />
          </div>
          <button
            type="submit"
            className="bg-dark-800 text-slate-300 hover:bg-dark-700 border border-white/10 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          >
            Find
          </button>
        </form>
      </div>

      {/* Detailed Options Drawer (Sort, Dates) */}
      <div className="p-5 bg-dark-800/20 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sort By</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="block w-full bg-dark-800 border border-white/10 px-2 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-primary-500"
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="title">Link Title</option>
            <option value="analytics.totalClicks">Click Counts</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sort Order</label>
          <select
            value={order}
            onChange={(e) => { setOrder(e.target.value); setPage(1); }}
            className="block w-full bg-dark-800 border border-white/10 px-2 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-primary-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="block w-full bg-dark-800 border border-white/10 px-2 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="block w-full bg-dark-800 border border-white/10 px-2 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
