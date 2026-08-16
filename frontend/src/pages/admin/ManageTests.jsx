import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Plus, Trash2, GraduationCap, X, ChevronDown, Check, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';

const ManageTests = () => {
  const [chapters, setChapters] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [duration, setDuration] = useState('');
  const [totalMarks, setTotalMarks] = useState(0);

  // Questions inside form
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 5 }
  ]);

  const fetchTests = async () => {
    try {
      const res = await axios.get('/tests');
      setTests(res.data);
    } catch (err) {
      setError('Failed to fetch tests.');
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
        await fetchTests();
      } catch (err) {
        setError('Failed to initialize page data.');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setDuration('30');
    setQuestions([{ questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 5 }]);
    setShowModal(true);
  };

  const handleQuestionChange = (qIdx, field, val) => {
    const updated = [...questions];
    updated[qIdx][field] = val;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = val;
    setQuestions(updated);
  };

  const addQuestionField = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 5 }]);
  };

  const removeQuestionField = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const toggleTestStatus = async (test) => {
    try {
      await axios.put(`/tests/${test._id}`, { isActive: !test.isActive });
      setSuccess('Test status updated successfully.');
      fetchTests();
    } catch (err) {
      setError('Failed to update test status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test and all results?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/tests/${id}`);
      setSuccess('Test deleted successfully.');
      fetchTests();
    } catch (err) {
      setError('Failed to delete test.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Calculate total marks based on question marks sum
    const calculatedTotalMarks = questions.reduce((acc, q) => acc + Number(q.marks), 0);

    try {
      await axios.post('/tests', {
        title,
        description,
        chapter: chapterId,
        duration: Number(duration),
        totalMarks: calculatedTotalMarks,
        questions
      });
      setSuccess('MCQ Test created successfully!');
      setShowModal(false);
      fetchTests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">MCQ Tests</h2>
          <p className="text-sm text-slate-500">Create timed multiple choice examinations</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>New MCQ Test</span>
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div
            key={test._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-2.5 py-0.5 rounded">
                  {test.chapter?.title}
                </span>
                <button onClick={() => toggleTestStatus(test)} className="text-slate-400 dark:text-slate-500">
                  {test.isActive ? (
                    <span className="flex items-center text-xs text-emerald-600 font-bold space-x-1">
                      <ToggleRight className="w-6 h-6 text-emerald-500" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-xs text-slate-400 font-bold space-x-1">
                      <ToggleLeft className="w-6 h-6" />
                      <span>Inactive</span>
                    </span>
                  )}
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-855 dark:text-slate-100 line-clamp-1">{test.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Duration: {test.duration} min • Marks: {test.totalMarks}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{test.description || 'No description.'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
              <div className="text-xs text-slate-400 font-semibold flex-1">
                {test.questions?.length} Questions
              </div>
              <button
                onClick={() => handleDelete(test._id)}
                className="flex items-center justify-center space-x-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MCQ Test Builder Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col justify-between animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-primary-500" />
                <span>MCQ Test Constructor</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">Test Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chapter 1 Mid-Term Test"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-805 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">Chapter</label>
                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {chapters.map((chap) => (
                      <option key={chap._id} value={chap._id}>
                        {chap.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">Test Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter short instructions or notes..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Questions Area */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-250">Test Questions</h4>
                  <button
                    type="button"
                    onClick={addQuestionField}
                    className="text-xs text-primary-500 hover:text-primary-700 font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase">Question {qIdx + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestionField(qIdx)}
                          className="text-rose-500 hover:text-rose-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Question Text</label>
                      <input
                        type="text"
                        required
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                        placeholder="What is the unit of Force?"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-500">Option {String.fromCharCode(65 + optIdx)}</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`Answer ${String.fromCharCode(65 + optIdx)}`}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuestionChange(qIdx, 'correctOption', optIdx)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                                q.correctOption === optIdx
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-24">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Marks</label>
                      <input
                        type="number"
                        required
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(qIdx, 'marks', e.target.value)}
                        className="w-full px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex space-x-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center justify-center disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Publish MCQ Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTests;
