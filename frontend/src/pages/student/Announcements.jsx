import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Megaphone, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        setError('Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) return <Loader fillPage={false} />;
  if (error) return <div className="text-rose-600 font-medium p-6">{error}</div>;

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'high': return 'bg-rose-100 text-rose-805 dark:bg-rose-950/20 dark:text-rose-400';
      case 'low': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350';
      default: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/20 dark:text-indigo-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Notice Bulletin</h2>
        <p className="text-sm text-slate-500">Stay updated with classroom schedules and teacher notes</p>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800">
            No notices posted yet.
          </p>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getPriorityColor(ann.priority)}`}>
                  {ann.priority} Priority
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Posted {formatDate(ann.createdAt)} by {ann.createdBy?.name}</span>
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-855 dark:text-slate-100">{ann.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">{ann.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
