import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { Search, ChevronRight } from 'lucide-react';

const PublicChapters = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get('/chapters');
        setChapters(res.data || []);
      } catch (err) {
        setError('Failed to fetch the physics syllabus. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, []);

  const filteredChapters = chapters.filter(chap =>
    chap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chap.description && chap.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Physics Syllabus Modules</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Explore our complete sequence of structured study modules, from mechanics to quantum concepts.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/40 p-4 border border-slate-900 rounded-3xl backdrop-blur-md">
        <div className="relative flex-1 w-full">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters (e.g. Kinematics, Thermodynamics)..."
            icon={Search}
            className="w-full"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      {loading ? (
        <LoadingState skeleton count={6} />
      ) : error ? (
        <ErrorState description={error} />
      ) : filteredChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chap) => (
            <Card key={chap._id} hover className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{chap.icon || '📚'}</span>
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/50">
                    Module {chap.order}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-4 group-hover:text-primary-400 transition-colors">
                  {chap.title}
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {chap.description || 'Access pre-recorded lectures, summary revision sheets, practice tasks, and online tests.'}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Join to view resources</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  icon={ChevronRight}
                  iconPosition="right"
                  className="text-primary-400 p-0 hover:bg-transparent"
                >
                  Start Learning
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No chapters found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};

export default PublicChapters;
