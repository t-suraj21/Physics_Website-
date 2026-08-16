import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Award, AlertCircle, Clock, Calendar, BarChart2 } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';

const ViewResults = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('/tests');
        setTests(res.data);
        if (res.data.length > 0) {
          setSelectedTestId(res.data[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch tests.');
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, []);

  const fetchResults = async (testId) => {
    if (!testId) return;
    setLoadingResults(true);
    setError('');
    try {
      const res = await axios.get(`/results/test/${testId}`);
      setResults(res.data);
    } catch (err) {
      setError('Failed to fetch results for this test.');
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    fetchResults(selectedTestId);
  }, [selectedTestId]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  if (loadingTests) return <Loader fullPage={false} />;

  const activeTest = tests.find(t => t._id === selectedTestId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">MCQ Test Results</h2>
        <p className="text-sm text-slate-500">Track and review student performance in online examinations</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-slate-400" />
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="text-base font-bold border-0 bg-transparent text-slate-850 dark:text-slate-100 focus:ring-0 focus:outline-none cursor-pointer max-w-xs md:max-w-md"
            >
              {tests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.title}
                </option>
              ))}
            </select>
          </div>
          {activeTest && (
            <div className="flex items-center space-x-3 text-xs text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <span>Duration: {activeTest.duration}m</span>
              <span>•</span>
              <span>Max Score: {activeTest.totalMarks}</span>
            </div>
          )}
        </div>

        {loadingResults ? (
          <Loader fullPage={false} />
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center">No student results for this test yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                  <th className="py-4 px-4">Student</th>
                  <th className="py-4 px-4">Score Achieved</th>
                  <th className="py-4 px-4">Percentage</th>
                  <th className="py-4 px-4">Time Taken</th>
                  <th className="py-4 px-4">Submission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
                {results.map((res) => (
                  <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-850 dark:text-slate-205">{res.student?.name}</div>
                      <div className="text-xs text-slate-400">{res.student?.email} • Class {res.student?.class}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {res.score} / {res.totalMarks}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-semibold text-xs ${
                        res.percentage >= 75 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : res.percentage >= 40 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400' 
                            : 'bg-rose-100 text-rose-805 dark:bg-rose-950/20 dark:text-rose-400'
                      }`}>
                        {res.percentage}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatTime(res.timeTaken)}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {formatDateTime(res.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResults;
