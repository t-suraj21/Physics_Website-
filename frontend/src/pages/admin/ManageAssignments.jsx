import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Plus, Trash2, Calendar, FileText, AlertCircle, BookOpen, Download } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ManageAssignments = () => {
  const [chapters, setChapters] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [file, setFile] = useState(null);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('/assignments');
      setAssignments(res.data);
    } catch (err) {
      setError('Failed to fetch assignments.');
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const res = await axios.get('/chapters');
        setChapters(res.data);
        if (res.data.length > 0) {
          setChapterId(res.data[0]._id);
        }
        await fetchAssignments();
      } catch (err) {
        setError('Failed to initialize page data.');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('chapter', chapterId);
    formData.append('dueDate', dueDate);
    formData.append('totalMarks', Number(totalMarks));
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Assignment created successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setTotalMarks('');
      setFile(null);
      const fileInput = document.getElementById('assignment-file-input');
      if (fileInput) fileInput.value = '';
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment and all submissions?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/assignments/${id}`);
      setSuccess('Assignment deleted successfully.');
      fetchAssignments();
    } catch (err) {
      setError('Failed to delete assignment.');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chapter Assignments</h2>
        <p className="text-sm text-slate-500">Create challenges and assign grades for students</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Assignment Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary-500" />
            <span>New Assignment</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Worksheet on Newton's Laws"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Description / Instructions</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="List assignment objectives or problem numbers..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Target Chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
              >
                {chapters.map((chap) => (
                  <option key={chap._id} value={chap._id}>
                    {chap.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Total Marks</label>
                <input
                  type="number"
                  required
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Resource File (Optional)</label>
              <input
                id="assignment-file-input"
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-slate-800 dark:file:text-slate-350 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-150 shadow-md shadow-primary-600/10 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {creating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Assignment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Assignments List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4">
            Active Assignments
          </h3>

          {assignments.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center">No assignments created yet.</p>
          ) : (
            <div className="space-y-4">
              {assignments.map((assign) => (
                <div
                  key={assign._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-150 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 px-2.5 py-0.5 rounded">
                        {assign.chapter?.title}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Marks: {assign.totalMarks}</span>
                    </div>
                    <h4 className="font-bold text-base text-slate-850 dark:text-slate-150 line-clamp-1">{assign.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{assign.description}</p>
                    <div className="flex items-center space-x-4 pt-1 text-xs text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due: {formatDate(assign.dueDate)}</span>
                      </span>
                      {assign.resourceUrl && (
                        <a
                          href={assign.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-primary-500 hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Resource Attachment</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end gap-2 justify-end sm:justify-start">
                    <button
                      onClick={() => handleDelete(assign._id)}
                      className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 transition-colors w-fit"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAssignments;
