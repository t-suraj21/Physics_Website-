import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import Button from '../../components/ui/Button';
import { BookOpen, Search, Download, Plus, Bookmark } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

const Chapters = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chapters, setChapters] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get('/chapters');
        setChapters(res.data || []);
      } catch (err) {
        setError('Failed to load syllabus chapters.');
      } finally {
        setLoading(false);
      }
    };
    const fetchTeacher = async () => {
      try {
        const res = await axios.get('/auth/teacher');
        setTeacher(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChapters();
    fetchTeacher();
  }, []);

  if (loading) return <Loader fullPage={false} />;
  if (error) return <div className="text-rose-600 font-bold border-2 border-slate-900 bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">{error}</div>;

  const filteredChapters = chapters.filter(chap =>
    chap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chap.description && chap.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Page Header & Search block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-900 pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase text-slate-900">Physics Syllabus Modules</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Browse modules, read notes, and attempt quizzes</p>
        </div>

        {/* Local Search input */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search in Titles"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-0 focus:border-slate-900 shadow-[2px_2px_0px_0px_#000]"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredChapters.map((chapter) => (
            <div 
              key={chapter._id}
              className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Card Main Block: Cover + Details */}
              <div className="flex items-start space-x-6">
                {/* Book Cover Design */}
                <div className="w-24 h-32 bg-[#faebd7] border-2 border-slate-900 rounded-xl flex flex-col justify-between p-2.5 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative select-none">
                  <div className="absolute top-0 right-2">
                    <Bookmark className="w-4 h-4 fill-slate-900 text-slate-900" />
                  </div>
                  <span className="text-2xl mt-1">{chapter.icon || '📚'}</span>
                  <div className="space-y-0.5 text-left">
                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">Module</p>
                    <p className="text-base font-black text-slate-900 leading-none">{chapter.order}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-left flex-1 min-w-0">
                  <h3 className="text-base font-black text-slate-900 truncate">
                    {chapter.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-450 uppercase tracking-widest">
                    By {teacher?.name || 'Prof. Raj Kumar'}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                    {chapter.description || 'Access pre-recorded video lectures, summary revision notes, problem sheets, and practice exam sets.'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                    100+ pages left &bull; Complete course
                  </p>
                </div>
              </div>

              {/* Action Buttons & Toolbar */}
              <div className="space-y-4 mt-6">
                <Button
                  variant="primary"
                  className="w-full bg-[#ff7034] hover:bg-[#ff5d1a] border-2 border-slate-900 text-white font-extrabold py-3.5 text-xs uppercase tracking-widest rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  onClick={() => navigate(`/chapters/${chapter._id}`)}
                >
                  Read Preview
                </Button>

                {/* Lower toolbar */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-2 border-t border-slate-900/10">
                  <button className="flex items-center space-x-1.5 hover:text-slate-900 transition-colors">
                    <Download className="w-4.5 h-4.5 text-slate-550" />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center space-x-1.5 hover:text-slate-900 transition-colors">
                    <Plus className="w-4.5 h-4.5 text-slate-550" />
                    <span>Add to List</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 font-semibold">
          No syllabus modules found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};

export default Chapters;
