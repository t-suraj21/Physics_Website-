import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Clock, GraduationCap, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const timerRef = useRef(null);

  // Test session state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testReport, setTestReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`/tests/${id}`);
        setTest(res.data);
        setTimeLeft(res.data.duration * 60);
        setAnswers(new Array(res.data.questions.length).fill(-1));
      } catch (err) {
        setError('Failed to fetch test questions. Either you are unauthorized or this test is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // Countdown timer logic
  useEffect(() => {
    if (loading || isSubmitted || !test) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, isSubmitted, test]);

  const handleSelectOption = (optIdx) => {
    const updated = [...answers];
    updated[currentQuestionIdx] = optIdx;
    setAnswers(updated);
  };

  const submitTest = async (finalAnswers) => {
    setSubmitting(true);
    setError('');
    clearInterval(timerRef.current);

    // Calculate time taken
    const totalDurationSec = test.duration * 60;
    const timeTaken = totalDurationSec - timeLeft;

    try {
      const res = await axios.post(`/tests/${id}/submit`, {
        answers: finalAnswers,
        timeTaken
      });
      setTestReport(res.data);
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred while submitting your test score.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSubmit = () => {
    const unansweredCount = answers.filter(a => a === -1).length;
    let message = 'Are you sure you want to submit your answers?';
    if (unansweredCount > 0) {
      message = `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`;
    }

    if (window.confirm(message)) {
      submitTest(answers);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time limit expired! Your test is being auto-submitted.');
    submitTest(answers);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <Loader />;
  if (error && !test) return <div className="text-rose-600 font-medium p-6">{error}</div>;

  const currentQuestion = test.questions[currentQuestionIdx];

  // Test Report Render
  if (isSubmitted && testReport) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 animate-scale-up">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Test Submitted Successfully!</h2>
            <p className="text-sm text-slate-500 mt-1">Here is your immediate performance report.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
              <p className="text-xs text-slate-400 font-medium uppercase">Marks Achieved</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-150 mt-1">
                {testReport.score} / {testReport.totalMarks}
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
              <p className="text-xs text-slate-400 font-medium uppercase">Percentage</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-150 mt-1">
                {testReport.percentage}%
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 col-span-2 md:col-span-1">
              <p className="text-xs text-slate-400 font-medium uppercase">Time Taken</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-150 mt-1">
                {Math.floor(testReport.timeTaken / 60)}m {testReport.timeTaken % 60}s
              </h4>
            </div>
          </div>

          <button
            onClick={() => navigate('/results')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-600/10 transition active:scale-95"
          >
            Go to Results Hub
          </button>
        </div>

        {/* Detailed graded questions breakdown for feedback */}
        <div className="space-y-6">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-205">Question Explanations</h3>
          {testReport.gradedQuestions.map((q, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm space-y-4 ${
                q.isCorrect 
                  ? 'border-emerald-250 dark:border-emerald-900/30' 
                  : 'border-rose-250 dark:border-rose-900/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  q.isCorrect 
                    ? 'bg-emerald-105 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' 
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400'
                }`}>
                  {q.isCorrect ? `Correct (+${q.marks})` : 'Incorrect (0)'}
                </span>
              </div>
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{q.questionText}</p>
              <div className="grid grid-cols-1 gap-2 pt-2 text-xs">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-150 dark:border-slate-800 text-slate-650';
                  if (optIdx === q.correctOption) {
                    optStyle = 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 font-semibold';
                  } else if (optIdx === q.studentAnswer && !q.isCorrect) {
                    optStyle = 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400 font-semibold';
                  }
                  return (
                    <div key={optIdx} className={`p-3 border rounded-xl flex items-center ${optStyle}`}>
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
    );
  }

  // Active Test-Taking UI
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Timer & Meta Navbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between sticky top-4 z-40">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-slate-400" />
          <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{test.title}</h2>
        </div>

        <div className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition ${
          timeLeft <= 60 
            ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/40 animate-pulse' 
            : 'bg-slate-50 border-slate-200 dark:bg-slate-950/40 dark:border-slate-850 text-slate-700 dark:text-slate-200'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex space-x-1.5 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {test.questions.map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 h-full rounded-full transition-all duration-300 ${
              idx === currentQuestionIdx 
                ? 'bg-primary-500' 
                : answers[idx] !== -1 
                  ? 'bg-primary-350 dark:bg-primary-800' 
                  : 'bg-slate-200 dark:bg-slate-800/80'
            }`}
          ></div>
        ))}
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 min-h-[360px] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-450 dark:text-slate-400 font-semibold">
            <span>QUESTION {currentQuestionIdx + 1} OF {test.questions.length}</span>
            <span>Marks: {currentQuestion.marks || 1}</span>
          </div>

          <h3 className="font-bold text-base text-slate-855 dark:text-slate-100 leading-relaxed">
            {currentQuestion.questionText}
          </h3>

          <div className="grid grid-cols-1 gap-3 pt-4">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentQuestionIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 text-slate-850 dark:text-slate-100 font-semibold ring-2 ring-primary-500/20'
                      : 'border-slate-150 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850/40 text-slate-650 dark:text-slate-350'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs mr-3 font-bold ${
                      isSelected 
                        ? 'bg-primary-500 border-primary-500 text-white' 
                        : 'border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-6 gap-4">
          <button
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-205 dark:border-slate-800 text-slate-650 hover:bg-slate-50 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentQuestionIdx === test.questions.length - 1 ? (
            <button
              onClick={handleManualSubmit}
              disabled={submitting}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow shadow-emerald-500/10 transition active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Finish & Submit'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIdx(prev => Math.min(test.questions.length - 1, prev + 1))}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow shadow-primary-600/10 transition active:scale-95"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
