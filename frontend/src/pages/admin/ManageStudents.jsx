import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Users, Trash2, Award, ClipboardList, Clock, CheckCircle, X, ChevronRight, Mail, AlertCircle, Phone, GraduationCap } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected student details
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/students');
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSelectStudent = async (student) => {
    setLoadingDetails(true);
    setError('');
    setSelectedStudent(student);
    try {
      const res = await axios.get(`/students/${student._id}`);
      setPerformance(res.data.performance);
    } catch (err) {
      setError('Failed to load performance details.');
      setSelectedStudent(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Removing this student will delete all their assignments and test submissions. Are you sure?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/students/${id}`);
      setSuccess('Student removed successfully.');
      setSelectedStudent(null);
      setPerformance(null);
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student.');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Student Directory</h2>
        <p className="text-sm text-slate-500">Track registration rosters and academic history</p>
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
        {/* Roster list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-[600px] overflow-y-auto space-y-4 lg:col-span-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary-500" />
            <span>Class Roster</span>
          </h3>

          <div className="space-y-3">
            {students.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">No students registered yet.</p>
            ) : (
              students.map((stud) => (
                <button
                  key={stud._id}
                  onClick={() => handleSelectStudent(stud)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    selectedStudent?._id === stud._id
                      ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/20'
                      : 'border-slate-150 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850/40'
                  }`}
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{stud.name}</h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{stud.email}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 ${selectedStudent?._id === stud._id ? 'text-primary-500' : ''}`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Selected student detail details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2 min-h-[600px] flex flex-col justify-between">
          {!selectedStudent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-12">
              <Users className="w-16 h-16 stroke-1 mb-4" />
              <p className="font-medium text-sm">Select a student to view academic records</p>
            </div>
          ) : loadingDetails ? (
            <Loader fullPage={false} />
          ) : (
            <div className="space-y-6 flex-1">
              {/* Header profile cards */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center space-x-4">
                  {selectedStudent.avatar ? (
                    <img src={selectedStudent.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold text-xl flex items-center justify-center">
                      {selectedStudent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">{selectedStudent.name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{selectedStudent.email}</span>
                      </span>
                      {selectedStudent.phone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{selectedStudent.phone}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Class: {selectedStudent.class || 'N/A'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedStudent._id)}
                  className="flex items-center justify-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 transition-colors w-full md:w-auto text-center"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Student</span>
                </button>
              </div>

              {/* Aggregated Performance Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 space-y-1">
                  <div className="flex items-center justify-between text-slate-450 dark:text-slate-400 text-xs font-semibold">
                    <span>TEST AVERAGE</span>
                    <Award className="w-4 h-4 text-purple-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-150">{performance?.avgTestScore}%</h4>
                  <p className="text-[10px] text-slate-400">{performance?.totalTestsTaken} online exams completed</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 space-y-1">
                  <div className="flex items-center justify-between text-slate-450 dark:text-slate-400 text-xs font-semibold">
                    <span>ASSIGNMENT AVERAGE</span>
                    <ClipboardList className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-150">{performance?.avgAssignmentScore}%</h4>
                  <p className="text-[10px] text-slate-400">{performance?.gradedSubmissions} homework pages graded</p>
                </div>
              </div>

              {/* History Lists */}
              <div className="space-y-6">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Detailed Student Record</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Test Submissions list */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">MCQ Tests taken</span>
                    {performance?.testResults.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No tests completed yet.</p>
                    ) : (
                      performance?.testResults.map(res => (
                        <div key={res._id} className="p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/10 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{res.test.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(res.submittedAt)}</p>
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{res.score}/{res.totalMarks} ({res.percentage}%)</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Assignment submissions list */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Homework Assignments</span>
                    {performance?.submissions.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No submissions uploaded.</p>
                    ) : (
                      performance?.submissions.map(sub => (
                        <div key={sub._id} className="p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/10 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{sub.assignment.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(sub.submittedAt)}</p>
                          </div>
                          <div>
                            {sub.status === 'graded' ? (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{sub.marks}/{sub.assignment.totalMarks}</span>
                            ) : (
                              <span className="text-amber-500 font-semibold">Ungraded</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
