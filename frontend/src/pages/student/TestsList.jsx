import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { GraduationCap, Clock, AlertCircle } from 'lucide-react';

const TestsList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('/tests');
        setTests(res.data);
      } catch (err) {
        setError('Failed to load active MCQ tests.');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Online MCQ Examinations</h2>
        <p className="text-sm text-slate-500">Test your understanding under strict time limits</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tests.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 col-span-full">
            No active tests published yet.
          </p>
        ) : (
          tests.map((test) => (
            <div
              key={test._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded uppercase">
                  {test.chapter?.title}
                </span>
                <h3 className="font-bold text-base text-slate-855 dark:text-slate-100 mt-3 line-clamp-1">{test.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Duration: {test.duration} min • Marks: {test.totalMarks}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">{test.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                <span className="text-xs text-slate-400 font-semibold">{test.questions?.length} Questions</span>
                <Link
                  to={`/tests/take/${test._id}`}
                  className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-750 text-white shadow shadow-primary-500/10 transition active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Start Test</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestsList;
