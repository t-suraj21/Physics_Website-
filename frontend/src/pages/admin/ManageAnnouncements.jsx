import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Megaphone, Plus, Trash2, X, AlertCircle, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      setError('Failed to fetch announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await axios.post('/announcements', { title, message, priority });
      setSuccess('Announcement published successfully!');
      setTitle('');
      setMessage('');
      setPriority('normal');
      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/announcements/${id}`);
      setSuccess('Announcement deleted successfully.');
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to delete announcement.');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'high': return 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400';
      case 'low': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350';
      default: return 'bg-indigo-100 text-indigo-805 dark:bg-indigo-950/20 dark:text-indigo-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Announcements</h2>
          <p className="text-sm text-slate-500">Publish general notifications and news board updates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>New Bulletin</span>
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

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No announcements posted yet.
          </p>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getPriorityColor(ann.priority)}`}>
                    {ann.priority} Priority
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Posted {formatDate(ann.createdAt)}</span>
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-855 dark:text-slate-100">{ann.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">{ann.message}</p>
              </div>

              <div className="flex md:flex-col justify-end items-end border-t md:border-t-0 border-slate-100 dark:border-slate-850 pt-4 md:pt-0">
                <button
                  onClick={() => handleDelete(ann._id)}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 transition-colors w-fit"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-primary-500" />
                <span>Publish Announcement</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Title / Subject</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule Update: Extra Optics Class"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority (Urgent)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Bulletin Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write announcement details here..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-805 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
