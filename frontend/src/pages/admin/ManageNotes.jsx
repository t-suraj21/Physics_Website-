import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Upload, Trash2, FileText, AlertCircle, Download, BookOpen } from 'lucide-react';

const ManageNotes = () => {
  const [chapters, setChapters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadChapterId, setUploadChapterId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get('/chapters');
        setChapters(res.data);
        if (res.data.length > 0) {
          setSelectedChapterId(res.data[0]._id);
          setUploadChapterId(res.data[0]._id);
        }
      } catch (err) {
        setError('Failed to load chapters.');
      } finally {
        setLoadingChapters(false);
      }
    };
    fetchChapters();
  }, []);

  const fetchNotes = async (chapterId) => {
    if (!chapterId) return;
    setLoadingNotes(true);
    setError('');
    try {
      const res = await axios.get(`/notes/chapter/${chapterId}`);
      setNotes(res.data);
    } catch (err) {
      setError('Failed to fetch notes for this chapter.');
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchNotes(selectedChapterId);
  }, [selectedChapterId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('chapter', uploadChapterId);
    formData.append('file', file);

    try {
      await axios.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Note uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      // Reset file input
      document.getElementById('note-file-input').value = '';
      if (uploadChapterId === selectedChapterId) {
        fetchNotes(selectedChapterId);
      } else {
        setSelectedChapterId(uploadChapterId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload note.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/notes/${id}`);
      setSuccess('Note deleted successfully.');
      fetchNotes(selectedChapterId);
    } catch (err) {
      setError('Failed to delete note.');
    }
  };

  if (loadingChapters) return <Loader fullPage={false} />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Study Notes</h2>
        <p className="text-sm text-slate-500">Upload PDF lectures and diagrams for chapters</p>
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
        {/* Upload Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
            <Upload className="w-5 h-5 text-primary-500" />
            <span>Upload New Note</span>
          </h3>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Note Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kinematics Formulas PDF"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Brief Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details or learning objectives..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Target Chapter</label>
              <select
                value={uploadChapterId}
                onChange={(e) => setUploadChapterId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
              >
                {chapters.map((chap) => (
                  <option key={chap._id} value={chap._id}>
                    {chap.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Select PDF or Image File</label>
              <input
                id="note-file-input"
                type="file"
                required
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-slate-800 dark:file:text-slate-350 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-150 shadow-md shadow-primary-600/10 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Lecture Note</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Notes list filter by chapter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Uploaded Study Materials</h3>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="text-sm font-semibold border-0 bg-transparent text-slate-700 dark:text-slate-200 focus:ring-0 focus:outline-none cursor-pointer"
              >
                {chapters.map((chap) => (
                  <option key={chap._id} value={chap._id}>
                    {chap.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingNotes ? (
            <Loader fullPage={false} />
          ) : notes.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center">No notes uploaded for this chapter yet.</p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{note.title}</h4>
                      <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">{note.fileName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Download/Open file"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="p-2 text-rose-500 hover:text-rose-700 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-5 h-5" />
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

export default ManageNotes;
