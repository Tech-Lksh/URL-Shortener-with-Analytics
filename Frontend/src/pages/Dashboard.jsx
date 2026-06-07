import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Check, Plus, Download } from 'lucide-react';
import StatsCards from '../components/dashboard/StatsCards';
import Toolbar from '../components/dashboard/Toolbar';
import UrlTable from '../components/dashboard/UrlTable';
import CreateUrlModal from '../components/dashboard/CreateUrlModal';
import EditUrlModal from '../components/dashboard/EditUrlModal';

const Dashboard = () => {
  // URLs Data
  const [urls, setUrls] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stats Data
  const [stats, setStats] = useState(null);

  // Pagination & Filtering States
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active'); // active, archived, deleted
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Bulk Selection
  const [selectedCodes, setSelectedCodes] = useState([]);

  // Edit Modal State
  const [editingUrl, setEditingUrl] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [savingEdit, setSavingEdit] = useState(false);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOriginalUrl, setNewOriginalUrl] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTags, setNewTags] = useState('');
  const [creating, setCreating] = useState(false);

  // Success message (temporary)
  const [successToast, setSuccessToast] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort,
        order,
        status,
      };

      if (search) params.search = search;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response = await api.get('/my-urls', { params });
      if (response.data.success) {
        setUrls(response.data.data);
        setTotal(response.data.pagination.total);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/urls/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchUrls();
    fetchStats();
    setSelectedCodes([]); // Clear selection when filters change
  }, [page, status, sort, order, dateFrom, dateTo]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showExportDropdown) return;
    const handleOutsideClick = () => setShowExportDropdown(false);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showExportDropdown]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUrls();
  };

  // Handle Copy URL
  const handleCopy = (shortUrl, shortCode) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(shortCode);
    showToast('Copied short URL to clipboard!');
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Toggle Bulk Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCodes(urls.map(u => u.shortCode));
    } else {
      setSelectedCodes([]);
    }
  };

  const handleSelectOne = (code) => {
    if (selectedCodes.includes(code)) {
      setSelectedCodes(selectedCodes.filter(c => c !== code));
    } else {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  // Handle Single Delete
  const handleDelete = async (shortCode, isPermanent = false) => {
    if (!window.confirm(`Are you sure you want to ${isPermanent ? 'permanently delete' : 'delete'} this URL?`)) return;
    try {
      const response = await api.delete(`/urls/${shortCode}?permanent=${isPermanent}`);
      if (response.data.success) {
        showToast(response.data.message);
        fetchUrls();
        fetchStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete URL');
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = async (isPermanent = false) => {
    if (!window.confirm(`Are you sure you want to ${isPermanent ? 'permanently delete' : 'delete'} all ${selectedCodes.length} selected URLs?`)) return;
    try {
      const response = await api.post('/urls/bulk-delete', {
        shortCodes: selectedCodes,
        permanent: isPermanent
      });
      if (response.data.success) {
        showToast(response.data.message);
        setSelectedCodes([]);
        fetchUrls();
        fetchStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform bulk deletion');
    }
  };

  // Handle Edit Click
  const openEditModal = (url) => {
    setEditingUrl(url);
    setEditTitle(url.title || '');
    setEditDesc(url.description || '');
    setEditTags(url.tags?.join(', ') || '');
    setEditCategory(url.category || '');
    setEditStatus(url.status || 'active');
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const tagsArray = editTags ? editTags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const response = await api.put(`/urls/${editingUrl.shortCode}`, {
        title: editTitle,
        description: editDesc,
        tags: tagsArray,
        category: editCategory,
        status: editStatus
      });

      if (response.data.success) {
        showToast('URL updated successfully!');
        setEditingUrl(null);
        fetchUrls();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update URL');
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Create Submit
  const handleCreateURL = async (e) => {
    e.preventDefault();
    setCreating(true);

    let formattedUrl = newOriginalUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      const response = await api.post('/shorten', {
        originalUrl: formattedUrl,
        customAlias: newAlias
      });

      if (response.data.success) {
        const shortCode = response.data.data.shortCode;
        
        // If they provided a custom title or tags, we update them immediately
        if (newTitle || newTags) {
          const tagsArray = newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [];
          await api.put(`/urls/${shortCode}`, {
            title: newTitle,
            tags: tagsArray
          });
        }

        showToast('URL shortened successfully!');
        setShowCreateModal(false);
        setNewOriginalUrl('');
        setNewAlias('');
        setNewTitle('');
        setNewTags('');
        fetchUrls();
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setCreating(false);
    }
  };

  // Export URLs
  const handleExport = async (format) => {
    try {
      const response = await api.get(`/urls/export?format=${format}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      const blob = format === 'csv' 
        ? new Blob([response.data], { type: 'text/csv' })
        : new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast(`Analytics exported successfully as ${format.toUpperCase()}`);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8 py-4 w-full">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 glass p-4 rounded-xl border border-emerald-500/20 shadow-2xl text-emerald-400 font-semibold text-sm flex items-center space-x-2 z-50 animate-slideUp">
          <Check className="w-4 h-4 bg-emerald-500/10 p-0.5 rounded-full" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white m-0">Link Management</h1>
          <p className="text-slate-400 text-xs mt-1">Monitor, configure, and analyze your links</p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center space-x-1 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Shorten New Link</span>
          </button>
          
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowExportDropdown(!showExportDropdown); }}
              className="flex items-center space-x-1 bg-dark-800 text-slate-200 hover:bg-dark-700 border border-white/10 font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-36 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-40">
                <button 
                  onClick={() => { handleExport('json'); setShowExportDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-primary-500 hover:text-white transition-colors"
                >
                  Export JSON
                </button>
                <button 
                  onClick={() => { handleExport('csv'); setShowExportDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-primary-500 hover:text-white border-t border-white/5 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Main Filter & Listing Section */}
      <div className="glass-card p-0 overflow-hidden border border-white/5 shadow-2xl">
        <Toolbar
          status={status}
          setStatus={setStatus}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          handleSearchSubmit={handleSearchSubmit}
          sort={sort}
          setSort={setSort}
          order={order}
          setOrder={setOrder}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

        <UrlTable
          urls={urls}
          loading={loading}
          selectedCodes={selectedCodes}
          setSelectedCodes={setSelectedCodes}
          handleSelectAll={handleSelectAll}
          handleSelectOne={handleSelectOne}
          handleCopy={handleCopy}
          copiedCode={copiedCode}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          handleBulkDelete={handleBulkDelete}
          status={status}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>

      {/* CREATE MODAL */}
      <CreateUrlModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newOriginalUrl={newOriginalUrl}
        setNewOriginalUrl={setNewOriginalUrl}
        newAlias={newAlias}
        setNewAlias={setNewAlias}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newTags={newTags}
        setNewTags={setNewTags}
        creating={creating}
        handleCreateURL={handleCreateURL}
      />

      {/* EDIT MODAL */}
      <EditUrlModal
        editingUrl={editingUrl}
        setEditingUrl={setEditingUrl}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDesc={editDesc}
        setEditDesc={setEditDesc}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editTags={editTags}
        setEditTags={setEditTags}
        savingEdit={savingEdit}
        handleEditSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default Dashboard;
