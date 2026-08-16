import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Video, Trash2, Plus, Play, BookOpen, AlertCircle } from 'lucide-react';

const ManageVideos = () => {
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadChapterId, setUploadChapterId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [duration, setDuration] = useState('');

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

  const fetchVideos = async (chapterId) => {
    if (!chapterId) return;
    setLoadingVideos(true);
    setError('');
    try {
      const res = await axios.get(`/videos/chapter/${chapterId}`);
      setVideos(res.data);
    } catch (err) {
      setError('Failed to fetch videos for this chapter.');
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    fetchVideos(selectedChapterId);
  }, [selectedChapterId]);

  const extractYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const ytId = extractYouTubeId(youtubeUrl);
    if (!ytId) {
      setError('Please provide a valid YouTube URL.');
      return;
    }

    setError('');
    setSuccess('');
    setAdding(true);

    try {
      await axios.post('/videos', {
        title,
        description,
        chapter: uploadChapterId,
        youtubeUrl,
        duration
      });
      setSuccess('Video lesson added successfully!');
      setTitle('');
      setDescription('');
      setYoutubeUrl('');
      setDuration('');
      if (uploadChapterId === selectedChapterId) {
        fetchVideos(selectedChapterId);
      } else {
        setSelectedChapterId(uploadChapterId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add video lesson.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video lesson?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/videos/${id}`);
      setSuccess('Video deleted successfully.');
      fetchVideos(selectedChapterId);
    } catch (err) {
      setError('Failed to delete video.');
    }
  };

  if (loadingChapters) return <Loader fullPage={false} />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Video Lessons</h2>
        <p className="text-sm text-slate-500">Add YouTube tutorials and explainers to syllabus chapters</p>
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
        {/* Add Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
            <Video className="w-5 h-5 text-primary-500" />
            <span>Add Video Lesson</span>
          </h3>

          <form onSubmit={handleAddVideo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Video Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Newton's 1st Law"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Brief Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Core takeaways or lecture note topics..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Chapter</label>
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Duration</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 15:30"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">YouTube URL</label>
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-205 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-150 shadow-md shadow-primary-600/10 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {adding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Video Lesson</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Video Lesson list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Chapter Video Syllabus</h3>
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

          {loadingVideos ? (
            <Loader fullPage={false} />
          ) : videos.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center">No video lessons added for this chapter yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((vid) => {
                const ytId = extractYouTubeId(vid.youtubeUrl);
                return (
                  <div
                    key={vid._id}
                    className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-black flex items-center justify-center">
                        {ytId ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={vid.title}
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="text-rose-500 font-semibold flex items-center space-x-1">
                            <Play className="w-5 h-5" />
                            <span>Preview Unavailable</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{vid.title}</h4>
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                            {vid.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{vid.description || 'No description.'}</p>
                      </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 flex justify-end">
                      <button
                        onClick={() => handleDelete(vid._id)}
                        className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVideos;
