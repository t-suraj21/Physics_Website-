import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { 
  FileText, Video as VideoIcon, ClipboardList, GraduationCap, Download, Play, 
  Upload, CheckCircle, Clock, AlertCircle, Calendar
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';

const ChapterDetail = () => {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tests, setTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Homework submission form state
  const [submitAssignId, setSubmitAssignId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const fetchChapterData = async () => {
    try {
      const chapterRes = await axios.get(`/chapters/${id}`);
      setChapter(chapterRes.data.chapter);

      const notesRes = await axios.get(`/notes/chapter/${id}`);
      setNotes(notesRes.data);

      const videosRes = await axios.get(`/videos/chapter/${id}`);
      setVideos(videosRes.data);

      const assignRes = await axios.get(`/assignments/chapter/${id}`);
      setAssignments(assignRes.data);

      const testsRes = await axios.get(`/tests/chapter/${id}`);
      setTests(testsRes.data);

      // Fetch own submissions to show student their homework status
      const subRes = await axios.get('/submissions/my');
      setSubmissions(subRes.data);
    } catch (err) {
      setError('Failed to load chapter materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleHomeworkSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('assignment', submitAssignId);
    formData.append('file', file);

    try {
      await axios.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Homework submitted successfully!');
      setFile(null);
      setSubmitAssignId('');
      fetchChapterData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit homework.');
    } finally {
      setUploading(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  if (loading) return <Loader fullPage={false} />;
  if (error && !chapter) return <div className="text-rose-600 font-bold border-2 border-slate-900 bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">{error}</div>;

  const tabs = [
    { id: 'notes', name: 'Lectures & Notes', icon: FileText },
    { id: 'videos', name: 'Video Syllabus', icon: Play },
    { id: 'assignments', name: 'Assignments', icon: ClipboardList },
    { id: 'tests', name: 'Chapter Tests', icon: GraduationCap },
  ];

  return (
    <div className="space-y-8">
      {/* Chapter Details Hero (Brutalist card) */}
      <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-[5px_5px_0px_0px_#000]">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#faebd7] border-2 border-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[2px_2px_0px_0px_#000] shrink-0">
            {chapter.icon || '📚'}
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">CHAPTER MODULE {chapter.order}</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">{chapter.title}</h2>
          </div>
        </div>
        <p className="text-sm text-slate-655 font-semibold mt-4 leading-relaxed max-w-2xl text-left">{chapter.description}</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-slate-900 text-rose-600 font-bold flex items-center space-x-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border-2 border-slate-900 text-emerald-600 font-bold flex items-center space-x-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Chapter Tabs */}
      <div className="flex border-b-2 border-slate-900 space-x-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 font-black text-xs uppercase tracking-wider border-b-4 transition-all whitespace-nowrap -mb-[2px] ${
                isActive
                  ? 'border-[#ff7034] text-[#ff7034]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          notes.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">No notes uploaded for this chapter yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4 min-w-0 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-[#fbd13c] border-2 border-slate-900 text-slate-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-sm text-slate-900 truncate">{note.title}</h4>
                      <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">{note.description || 'Lecture note material'}</p>
                    </div>
                  </div>
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition flex items-center justify-center"
                    title="Download PDF"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              ))}
            </div>
          )
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          videos.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">No video lessons available for this chapter.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((vid) => {
                const ytId = extractYouTubeId(vid.youtubeUrl);
                return (
                  <div
                    key={vid._id}
                    className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-video bg-black border-b-2 border-slate-900">
                        {ytId ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={vid.title}
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-rose-500 font-semibold">
                            <Play className="w-6 h-6 mr-1" /> Preview Unavailable
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-2 text-left">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-black text-base text-slate-900 line-clamp-1">{vid.title}</h4>
                          <span className="text-[10px] bg-[#faebd7] text-slate-600 border border-slate-900 px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                            {vid.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">{vid.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          assignments.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">No homework assignments posted for this chapter.</p>
          ) : (
            <div className="space-y-6">
              {assignments.map((assign) => {
                const mySub = submissions.find(s => s.assignment?._id === assign._id);
                return (
                  <div
                    key={assign._id}
                    className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-slate-500 font-bold flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Due: {formatDate(assign.dueDate)}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-bold bg-[#faebd7] border border-slate-900/60 px-2 py-0.5 rounded-md">Max Marks: {assign.totalMarks}</span>
                      </div>
                      <h4 className="font-black text-lg text-slate-900">{assign.title}</h4>
                      <p className="text-sm text-slate-655 font-semibold leading-relaxed">{assign.description}</p>
                      {assign.resourceUrl && (
                        <a
                          href={assign.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs text-[#ff7034] hover:underline font-extrabold mt-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Assignment PDF ({assign.resourceName})</span>
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col justify-between items-end border-t-2 md:border-t-0 border-slate-100 pt-4 md:pt-0 shrink-0">
                      {/* Submission Status banner */}
                      {mySub ? (
                        <div className="space-y-2 text-right">
                          {mySub.status === 'graded' ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-350 px-3.5 py-1.5 rounded-full font-black text-xs">
                              <CheckCircle className="w-4 h-4" />
                              <span>Graded: {mySub.marks} / {assign.totalMarks}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 border border-amber-350 px-3.5 py-1.5 rounded-full font-black text-xs">
                              <Clock className="w-4 h-4" />
                              <span>Submitted</span>
                            </span>
                          )}
                          <p className="text-[10px] font-bold text-slate-400 mt-1">Submitted on {formatDate(mySub.submittedAt)}</p>
                          {mySub.feedback && (
                            <div className="text-xs text-slate-600 font-semibold bg-slate-50 p-2.5 rounded-xl max-w-[220px] border-2 border-slate-900 text-left mt-2">
                              Feedback: "{mySub.feedback}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSubmitAssignId(assign._id)}
                          className="bg-[#10b981] hover:bg-[#059669] border-2 border-slate-900 text-white font-bold rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 py-2.5 px-4 text-xs"
                          icon={Upload}
                        >
                          Submit Homework
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          tests.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">No online examinations scheduled for this chapter.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-48"
                >
                  <div className="text-left">
                    <h4 className="font-black text-base text-slate-900 line-clamp-1">{test.title}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-1">Duration: {test.duration} min • Marks: {test.totalMarks}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-3 line-clamp-2 leading-relaxed">{test.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-900/10 pt-4 mt-6">
                    <span className="text-xs text-slate-450 font-bold">{test.questions?.length || 10} Questions</span>
                    <Link to={`/tests/take/${test._id}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-[#ff7034] hover:bg-[#ff5d1a] border-2 border-slate-900 text-white font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 py-2 px-3 text-xs"
                        icon={GraduationCap}
                      >
                        Start Test
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Submit homework modal */}
      {submitAssignId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] border-2 border-slate-900 p-6 md:p-8 animate-scale-up shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
              <h3 className="text-lg font-black uppercase text-slate-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-500" />
                <span>Upload Submission</span>
              </h3>
              <button onClick={() => setSubmitAssignId('')} className="text-slate-500 hover:text-slate-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleHomeworkSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Select file (PDF or Image)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-slate-900 file:text-xs file:font-black file:bg-[#fbd13c] file:text-slate-950 hover:file:bg-[#f9cf35] cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSubmitAssignId('')}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-900 text-slate-950 font-bold text-xs uppercase hover:bg-slate-50 transition-colors active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] border-2 border-slate-900 text-white font-extrabold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Close component in header
const X = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default ChapterDetail;
