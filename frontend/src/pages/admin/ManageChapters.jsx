import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Plus, Edit2, Trash2, X, BookOpen, AlertCircle } from 'lucide-react';

const ManageChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [icon, setIcon] = useState('📚');

  const fetchChapters = async () => {
    try {
      const res = await axios.get('/chapters');
      setChapters(res.data);
    } catch (err) {
      setError('Failed to fetch chapters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const openAddModal = () => {
    setEditingChapter(null);
    setTitle('');
    setDescription('');
    setOrder(chapters.length + 1);
    setIcon('📚');
    setShowModal(true);
  };

  const openEditModal = (chapter) => {
    setEditingChapter(chapter);
    setTitle(chapter.title);
    setDescription(chapter.description);
    setOrder(chapter.order);
    setIcon(chapter.icon);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = { title, description, order: Number(order), icon };

    try {
      if (editingChapter) {
        await axios.put(`/chapters/${editingChapter._id}`, payload);
        setSuccess('Chapter updated successfully!');
      } else {
        await axios.post('/chapters', payload);
        setSuccess('Chapter created successfully!');
      }
      setShowModal(false);
      fetchChapters();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Deleting this chapter will delete all associated notes, videos, tests, and assignments. Are you sure?')) {
      return;
    }

    try {
      await axios.delete(`/chapters/${id}`);
      setSuccess('Chapter and all associated resources deleted.');
      fetchChapters();
    } catch (err) {
      setError('Failed to delete chapter.');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Physics Chapters</h2>
          <p className="text-sm text-slate-500">Manage learning modules and syllabus structure</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Chapter</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30 text-sm font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <div
            key={chapter._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{chapter.icon || '📚'}</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold px-2 py-1 rounded">
                  Order: {chapter.order}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mt-4 line-clamp-1">{chapter.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{chapter.description || 'No description provided.'}</p>
            </div>

            <div className="flex items-center space-x-4 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
              <button
                onClick={() => openEditModal(chapter)}
                className="flex items-center justify-center space-x-1.5 flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(chapter._id)}
                className="flex items-center justify-center space-x-1.5 flex-1 py-2 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">
                {editingChapter ? 'Edit Physics Chapter' : 'Add Physics Chapter'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Chapter Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Laws of Motion"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of what students will learn..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    required
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Chapter Icon / Emoji</label>
                  <input
                    type="text"
                    required
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/30 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-150 shadow-md shadow-primary-600/10"
                >
                  {editingChapter ? 'Save Changes' : 'Create Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageChapters;
