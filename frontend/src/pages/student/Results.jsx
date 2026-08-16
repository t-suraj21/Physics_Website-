import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Award, Calendar, Clock, ChevronRight, X, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatDate';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected result details
  const [selectedResult, setSelectedResult] = useState(null);
  const [gradedQuestions, setGradedQuestions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchResults = async () => {
    try {
      const res = await axios.get('/results/my');
      setResults(res.data);
    } catch (err) {
      setError('Failed to load your test results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSelectResult = async (resultId) => {
    setLoadingDetails(true);
    setError('');
    try {
      const res = await axios.get(`/results/${resultId}`);
      setSelectedResult(res.data.result);
      setGradedQuestions(res.data.gradedQuestions);
    } catch (err) {
      setError('Failed to fetch detailed answer breakdown.');
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Test Results Hub</h2>
        <p className="text-sm text-slate-500">Review your grades and study correct answers</p>
      </div>

      {error && <div className="text-rose-600 font-medium p-4 bg-rose-50 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-[600px] overflow-y-auto space-y-4 lg:col-span-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-805 flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary-500" />
            <span>Completed Tests</span>
          </h3>

          <div className="space-y-3">
            {results.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">You haven't taken any tests yet.</p>
            ) : (
              results.map((res) => (
                <button
                  key={res._id}
                  onClick={() => handleSelectResult(res._id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                    selectedResult?._id === res._id
                      ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20'
                      : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/40'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-semibold text-primary-500 block mb-1">
                      {res.test?.chapter?.title}
                    </span>
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{res.test?.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(res.submittedAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-150">{res.score}/{res.totalMarks}</span>
                    <p className="text-[10px] font-bold text-primary-650 mt-1">{res.percentage}%</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Selected Result Review */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2 min-h-[600px] flex flex-col justify-between">
          {!selectedResult ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-505 py-12">
              <Award className="w-16 h-16 stroke-1 mb-4" />
              <p className="font-medium text-sm">Select a test result to view detailed breakdown</p>
            </div>
          ) : loadingDetails ? (
            <Loader fullPage={false} />
          ) : (
            <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-805 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">{selectedResult.test?.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Submitted on {formatDateTime(selectedResult.submittedAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {selectedResult.score} / {selectedResult.totalMarks}
                  </h4>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Percentage</p>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {selectedResult.percentage}%
                  </h4>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Time Taken</p>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {Math.floor(selectedResult.timeTaken / 60)}m {selectedResult.timeTaken % 60}s
                  </h4>
                </div>
              </div>

              {/* Questions breakdown list */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Question Explanations</h4>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {gradedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm space-y-3 ${
                        q.isCorrect 
                          ? 'border-emerald-200 dark:border-emerald-950/60' 
                          : 'border-rose-200 dark:border-rose-950/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          q.isCorrect 
                            ? 'bg-emerald-100 text-emerald-805 dark:bg-emerald-950/20 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-805 dark:bg-rose-950/20 dark:text-rose-400'
                        }`}>
                          {q.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{q.questionText}</p>
                      <div className="grid grid-cols-1 gap-1 text-[11px] pt-1">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = 'border-slate-150 dark:border-slate-800 text-slate-650';
                          if (optIdx === q.correctOption) {
                            optStyle = 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 font-semibold';
                          } else if (optIdx === q.studentAnswer && !q.isCorrect) {
                            optStyle = 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 text-rose-700 dark:text-rose-450 font-semibold';
                          }
                          return (
                            <div key={optIdx} className={`p-2 border rounded-xl flex items-center ${optStyle}`}>
                              <span className="mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
