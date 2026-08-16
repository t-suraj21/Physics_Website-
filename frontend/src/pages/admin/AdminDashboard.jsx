import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import {
  Users, BookOpen, GraduationCap, Clock, CheckCircle, Percent, ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/dashboard/admin');
        setData(res.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader fullPage={false} />;
  if (error) return <div className="text-rose-600 font-bold border-2 border-slate-900 bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">{error}</div>;

  const { stats, recentStudents, recentAssignmentSubmissions } = data;

  const chartData = [
    { name: 'Students', count: stats.totalStudents },
    { name: 'Tests', count: stats.totalTests },
    { name: 'Assignments', count: stats.totalAssignments },
    { name: 'Submissions', count: stats.totalSubmissions }
  ];

  const cards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, bg: 'bg-[#faebd7]' },
    { title: 'MCQ Tests', value: stats.totalTests, icon: GraduationCap, bg: 'bg-[#fbd13c]' },
    { title: 'Pending Tasks', value: stats.pendingSubmissions, icon: Clock, bg: 'bg-white' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Editorial Banner */}
      <div className="bg-white border-2 border-slate-900 rounded-[2rem] p-8 md:p-10 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">


        <div className="space-y-4 max-w-2xl pl-2 text-left">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">
            Welcome back, <span className="bg-gradient-to-r from-[#ff7034] to-[#fbd13c] bg-clip-text text-transparent">Professor!</span>
          </h2>
          <p className="text-sm text-slate-655 font-medium leading-relaxed">
            Here is a summary of your Physics Academy workspace. Track student grades, view homework submissions, and check progress metrics.
          </p>
          {stats.totalAssignments === 0 && stats.totalTests === 0 && (
            <div className="mt-2 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs font-bold">
              ✦ Quick Start: Start by uploading Notes, Videos, or Assignments, or building MCQ Tests to populate your workspace!
            </div>
          )}
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5 ${card.bg}`}
            >
              <div className="space-y-2 text-left">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-black text-slate-900">{card.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Distribution & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts Bar chart container */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#000] lg:col-span-2 text-left">
          <h3 className="text-base font-black uppercase text-slate-900 mb-6">Platform Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#000" fontSize={11} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#000" fontSize={11} fontWeight="bold" tickLine={false} />
                <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', background: '#fff', fontWeight: 'bold' }} />
                <Bar dataKey="count" fill="#ff7034" radius={[6, 6, 0, 0]} barSize={40} stroke="#000" strokeWidth={1.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aggregates widget */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between text-left">
          <div>
            <h3 className="text-base font-black uppercase text-slate-900 mb-2">Averages & Grading</h3>
            <p className="text-xs text-slate-500 font-semibold mb-6">Aggregate grading indicators across student cohorts.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#faebd7] border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Test Score</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{stats.overallAvgTestScore}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#fbd13c] border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Graded Homework</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">
                  {stats.gradedSubmissions} / {stats.totalSubmissions}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-900/10 pt-6 mt-6">
            <div className="w-full bg-[#faebd7] border-2 border-slate-900 h-4 rounded-full overflow-hidden p-[1px] relative">
              <div
                className="bg-[#ff7034] h-full rounded-full border-r-2 border-slate-900"
                style={{ width: `${stats.totalSubmissions > 0 ? (stats.gradedSubmissions / stats.totalSubmissions) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2 text-right">Grading completion rate</p>
          </div>
        </div>
      </div>

      {/* 4. Lists Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Submissions */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#000] xl:col-span-2 space-y-6 text-left">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <h3 className="text-base font-black uppercase text-slate-900">Recent Homework</h3>
            <span className="text-[10px] font-bold bg-[#faebd7] border border-slate-900 px-2.5 py-1 rounded-md">Real-time</span>
          </div>

          <div className="space-y-4">
            {recentAssignmentSubmissions.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No assignments submitted yet.</p>
            ) : (
              recentAssignmentSubmissions.map((sub) => (
                <div key={sub._id} className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-900 bg-[#fdf6e2]/40">
                  <div className="text-left">
                    <h4 className="font-extrabold text-sm text-slate-900">{sub.assignment.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Submitted by {sub.student.name} ({sub.student.class})</p>
                  </div>
                  <div className="text-right shrink-0 pl-4">
                    <span className={`text-[10px] px-2.5 py-1.5 rounded-full font-black border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] ${sub.status === 'graded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                      }`}>
                      {sub.status === 'graded' ? `Graded: ${sub.marks}` : 'Pending'}
                    </span>
                    <p className="text-[9px] font-bold text-slate-400 mt-2">{formatDate(sub.submittedAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Students list */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-6 text-left">
          <div className="border-b-2 border-slate-900 pb-4">
            <h3 className="text-base font-black uppercase text-slate-900">Recent Registrations</h3>
          </div>
          <div className="space-y-4">
            {recentStudents.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No students registered yet.</p>
            ) : (
              recentStudents.map((stud) => (
                <div key={stud._id} className="flex items-center space-x-3 p-3 rounded-2xl border border-transparent hover:border-slate-900/10 hover:bg-slate-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#faebd7] border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 shadow-[1px_1px_0px_0px_#000] shrink-0">
                    {stud.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-extrabold text-sm text-slate-900 truncate">{stud.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">{stud.email}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase bg-[#fbd13c] border border-slate-900 px-2 py-0.5 rounded-md shrink-0">
                    {stud.class || 'N/A'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
