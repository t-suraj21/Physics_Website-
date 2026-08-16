import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { ClipboardList, AlertCircle, FileText, CheckCircle, Clock, X, GraduationCap } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';

const ViewSubmissions = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Grading modal state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('/assignments');
        setAssignments(res.data);
        if (res.data.length > 0) {
          setSelectedAssignmentId(res.data[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch assignments.');
      } finally {
        setLoadingAssignments(false);
      }
    };
    fetchAssignments();
  }, []);

  const fetchSubmissions = async (assignId) => {
    if (!assignId) return;
    setLoadingSubmissions(true);
    setError('');
    try {
      const res = await axios.get(`/submissions/assignment/${assignId}`);
      setSubmissions(res.data);
    } catch (err) {
      setError('Failed to fetch submissions for this assignment.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(selectedAssignmentId);
  }, [selectedAssignmentId]);

  const openGradeModal = (sub) => {
    setSelectedSubmission(sub);
    setGradeMarks(sub.marks !== null ? sub.marks : '');
    setGradeFeedback(sub.feedback || '');
    setShowGradeModal(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGrading(true);

    try {
      await axios.put(`/submissions/${selectedSubmission._id}/grade`, {
        marks: Number(gradeMarks),
        feedback: gradeFeedback
      });
      setSuccess('Submission graded successfully!');
      setShowGradeModal(false);
      fetchSubmissions(selectedAssignmentId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grade.');
    } finally {
      setGrading(false);
    }
  };

  if (loadingAssignments) return <Loader fullPage={false} />;

  const activeAssignment = assignments.find(a => a._id === selectedAssignmentId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Student Submissions</h2>
        <p className="text-sm text-slate-500">Grade worksheets and review homework uploads</p>
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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <ClipboardList className="w-5 h-5 text-slate-400" />
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="text-base font-bold border-0 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none cursor-pointer max-w-xs md:max-w-md"
            >
              {assignments.map((assign) => (
                <option key={assign._id} value={assign._id}>
                  {assign.title}
                </option>
              ))}
            </select>
          </div>
          {activeAssignment && (
            <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full font-semibold">
              Max Marks: {activeAssignment.totalMarks}
            </div>
          )}
        </div>

        {loadingSubmissions ? (
          <Loader fullPage={false} />
        ) : submissions.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center">No student submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                  <th className="py-4 px-4">Student</th>
                  <th className="py-4 px-4">Submitted File</th>
                  <th className="py-4 px-4">Submission Date</th>
                  <th className="py-4 px-4">Grade Status</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{sub.student?.name}</div>
                      <div className="text-xs text-slate-400">{sub.student?.class || 'No Class Specified'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 text-primary-500 hover:underline font-semibold"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate max-w-[12rem]">{sub.fileName}</span>
                      </a>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {formatDateTime(sub.submittedAt)}
                    </td>
                    <td className="py-4 px-4">
                      {sub.status === 'graded' ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full font-semibold text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Score: {sub.marks}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-full font-semibold text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openGradeModal(sub)}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95"
                      >
                        {sub.status === 'graded' ? 'Regrade' : 'Grade'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-primary-500" />
                <span>Grade Assignment Submission</span>
              </h3>
              <button
                onClick={() => setShowGradeModal(false)}
                className="text-slate-400 hover:text-slate-650"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Student: <span className="text-slate-900 dark:text-slate-100 font-bold">{selectedSubmission?.student?.name}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Assignment Maximum Marks: <span className="font-semibold">{activeAssignment?.totalMarks}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Marks Awarded</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={activeAssignment?.totalMarks}
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Teacher Feedback (Optional)</label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Good work! Just improve problem 3 explanation next time..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grading}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {grading ? 'Submitting...' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;
