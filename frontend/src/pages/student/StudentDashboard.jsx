import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import {
  Award, ClipboardList, Megaphone, CheckCircle, Percent, ArrowRight, BookOpen, Clock, Calendar
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/dashboard/student');
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

  const { stats, recentAnnouncements, upcomingAssignments, activeTests } = data;

  const cards = [
    { title: 'Tests Attempted', value: stats.totalTestsTaken, icon: Award, bg: 'bg-[#faebd7]' },
    { title: 'Homework Uploaded', value: stats.totalSubmissions, icon: ClipboardList, bg: 'bg-white' },
    { title: 'Test Score Average', value: `${stats.avgTestScore}%`, icon: Percent, bg: 'bg-[#fbd13c]' },
    { title: 'Homework Average', value: `${stats.avgAssignmentScore}%`, icon: CheckCircle, bg: 'bg-white' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Editorial Banner */}
      <div className="bg-white border-2 border-slate-900 rounded-[2rem] p-8 md:p-10 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Soft yellow side accent block */}


        <div className="space-y-4 max-w-2xl pl-2">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">
            Welcome to <span className="bg-gradient-to-r from-[#ff7034] to-[#fbd13c] bg-clip-text text-transparent">Physics Academy</span>
          </h2>
          <p className="text-sm text-slate-655 font-medium leading-relaxed">
            Dive into your chapters, review expert notes, watch video lessons, submit homework, and test your knowledge. Let's make physics your strongest subject.
          </p>
        </div>

        <div className="shrink-0 flex items-center pl-2 md:pl-0">
          <Link to="/study-notes">
            <Button
              variant="primary"
              size="lg"
              className="bg-[#ff7034] hover:bg-[#ff5d1a] border-2 border-slate-900 text-white font-bold rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 flex items-center space-x-2"
            >
              <span>Explore Study Notes</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Tabs Selector (StorySeeker style) */}
      <div className="flex space-x-2 border-b-2 border-slate-900 pb-1">
        {['Overview', 'Announcements', 'Homework Tasks', 'Active Tests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl border-2 border-b-0 transition-all duration-150 ${activeTab === tab
                ? 'bg-[#ff7034] text-white border-slate-900 translate-y-[2px]'
                : 'bg-white/40 text-slate-600 border-transparent hover:bg-white hover:text-slate-900'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'Overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5 ${card.bg}`}
                >
                  <div className="space-y-2">
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

          {/* Double Column content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Announcements brief */}
            <div className="lg:col-span-8 bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <h3 className="text-base font-black uppercase text-slate-900 flex items-center space-x-2.5">
                  <Megaphone className="w-5 h-5 text-[#ff7034]" />
                  <span>Recent Bulletins</span>
                </h3>
                <button onClick={() => setActiveTab('Announcements')} className="text-xs font-bold text-[#ff7034] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentAnnouncements.length === 0 ? (
                  <p className="text-sm text-slate-500 py-8 text-center">No announcements posted yet.</p>
                ) : (
                  recentAnnouncements.slice(0, 2).map((ann) => (
                    <div key={ann._id} className="p-4 rounded-2xl border-2 border-slate-900 bg-[#fdf6e2]/40">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-extrabold text-sm text-slate-900">{ann.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{formatDate(ann.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-semibold">{ann.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Micro tasks list */}
            <div className="lg:col-span-4 bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-6">
              <h3 className="text-base font-black uppercase text-slate-900 flex items-center space-x-2.5 pb-4 border-b-2 border-slate-900">
                <ClipboardList className="w-5 h-5 text-[#fbd13c]" />
                <span>Next Deadline</span>
              </h3>

              <div className="space-y-4">
                {upcomingAssignments.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No pending homework assignments.</p>
                ) : (
                  upcomingAssignments.slice(0, 1).map((assign) => (
                    <div key={assign._id} className="p-4 rounded-2xl border-2 border-slate-900 bg-[#faebd7]/50 space-y-4">
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{assign.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 font-semibold line-clamp-2 leading-relaxed">
                          Complete the worksheet questions and submit the PDF sheet.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900/10">
                        <span className="font-bold text-slate-500">Due: {formatDate(assign.dueDate)}</span>
                        <Link to="/assignments">
                          <Button variant="primary" size="sm" className="bg-[#ff7034] text-white border border-slate-900 shadow-[1px_1px_0px_0px_#000] px-3.5 py-1.5 text-xs font-bold rounded-lg">
                            Submit Task
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs implementations */}
      {activeTab === 'Announcements' && (
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_0px_#000] space-y-6 animate-fade-in">
          <h3 className="text-lg font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-4">
            Bulletins Archive
          </h3>
          <div className="space-y-4">
            {recentAnnouncements.length === 0 ? (
              <p className="text-sm text-slate-500 py-12 text-center">No announcements posted yet.</p>
            ) : (
              recentAnnouncements.map((ann) => (
                <div key={ann._id} className="p-5 rounded-2xl border-2 border-slate-900 bg-[#fdf6e2]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-base text-slate-900">{ann.title}</h4>
                    <span className="text-xs font-bold text-slate-400">{formatDate(ann.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-655 font-medium leading-relaxed">{ann.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'Homework Tasks' && (
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_0px_#000] space-y-6 animate-fade-in">
          <h3 className="text-lg font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-4">
            Pending Assignments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingAssignments.length === 0 ? (
              <p className="text-sm text-slate-500 py-12 text-center col-span-2">No pending homework assignments.</p>
            ) : (
              upcomingAssignments.map((assign) => (
                <div key={assign._id} className="p-5 rounded-2xl border-2 border-slate-900 bg-[#fdf6e2]/40 flex flex-col justify-between h-44">
                  <div className="space-y-1">
                    <h4 className="font-black text-base text-slate-900 truncate">{assign.title}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Physics Homework</p>
                  </div>
                  <div className="pt-4 border-t border-slate-900/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Due: {formatDate(assign.dueDate)}</span>
                    <Link to="/assignments">
                      <Button variant="primary" size="sm" className="bg-[#ff7034] text-white border border-slate-900 shadow-[2px_2px_0px_0px_#000] text-xs font-bold rounded-xl px-4 py-2">
                        Submit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'Active Tests' && (
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_0px_#000] space-y-6 animate-fade-in">
          <h3 className="text-lg font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-4">
            Assessments Available
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTests.length === 0 ? (
              <p className="text-sm text-slate-500 py-12 text-center col-span-2">No online tests available.</p>
            ) : (
              activeTests.map((test) => (
                <div key={test._id} className="p-5 rounded-2xl border-2 border-slate-900 bg-[#fdf6e2]/40 flex flex-col justify-between h-44">
                  <div className="space-y-2">
                    <h4 className="font-black text-base text-slate-900 truncate">{test.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{test.duration} minutes &bull; {test.questions?.length || 10} MCQs</p>
                  </div>
                  <div className="pt-4 border-t border-slate-900/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Points: 100</span>
                    <Link to="/tests">
                      <Button variant="primary" size="sm" className="bg-[#ff7034] text-white border border-slate-900 shadow-[2px_2px_0px_0px_#000] text-xs font-bold rounded-xl px-4 py-2">
                        Start Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
