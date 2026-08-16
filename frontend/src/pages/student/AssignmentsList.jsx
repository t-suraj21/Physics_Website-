import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { ClipboardList, Download, Upload, CheckCircle, Clock, Calendar, AlertCircle, X } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [submitAssignId, setSubmitAssignId] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const assignRes = await axios.get('/assignments');
      setAssignments(assignRes.data);
      const subRes = await axios.get('/submissions/my');
      setSubmissions(subRes.data);
    } catch (err) {
      setError('Failed to load assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHomeworkSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');
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
      fetchData();
    } catch (err) {
      setError('Failed to submit homework.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Assignments</h2>
        <p className="text-sm text-slate-500">View homework assignments and upload solutions</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-955/20 text-rose-605 border border-rose-100 dark:border-rose-900/30 flex items-center space-x-2">
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
        {assignments.length === 0 ? (
          <p className="text-sm text-slate-505 dark:text-slate-400 py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No homework assignments scheduled.
          </p>
        ) : (
          assignments.map((assign) => {
            const mySub = submissions.find(s => s.assignment?._id === assign._id);
            return (
              <div
                key={assign._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded uppercase">
                      {assign.chapter?.title}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due: {formatDate(assign.dueDate)}</span>
                    </span>
                    <span className="text-xs text-slate-450 dark:text-slate-400 font-medium">Marks: {assign.totalMarks}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-855 dark:text-slate-100">{assign.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{assign.description}</p>
                  {assign.resourceUrl && (
                    <a
                      href={assign.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-primary-500 hover:underline font-bold mt-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Worksheet ({assign.resourceName})</span>
                    </a>
                  )}
                </div>

                <div className="flex flex-col justify-between items-end border-t md:border-t-0 border-slate-100 dark:border-slate-850 pt-4 md:pt-0">
                  {mySub ? (
                    <div className="space-y-2 text-right">
                      {mySub.status === 'graded' ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full font-bold text-xs">
                          <CheckCircle className="w-4 h-4" />
                          <span>Graded: {mySub.marks} / {assign.totalMarks}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full font-bold text-xs">
                          <Clock className="w-4 h-4" />
                          <span>Submitted</span>
                        </span>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">Submitted {formatDate(mySub.submittedAt)}</p>
                      {mySub.feedback && (
                        <div className="text-xs text-slate-550 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-850/40 p-2.5 rounded-lg max-w-[200px] border border-slate-100 dark:border-slate-800 text-left mt-2">
                          Feedback: "{mySub.feedback}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSubmitAssignId(assign._id)}
                      className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow shadow-emerald-500/10 transition active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Solution</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {submitAssignId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-202 dark:border-slate-800 p-6 md:p-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-855 dark:text-slate-100 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-500" />
                <span>Upload Homework Submission</span>
              </h3>
              <button onClick={() => setSubmitAssignId('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleHomeworkSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-2">Select file (PDF or Image)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-slate-800 dark:file:text-slate-350 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSubmitAssignId('')}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-750 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center space-x-1"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Submit Now</span>
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

export default AssignmentsList;
