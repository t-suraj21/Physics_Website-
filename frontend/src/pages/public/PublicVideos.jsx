import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/common/Loader';
import { Lock, Play } from 'lucide-react';

const PublicVideos = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Mechanics', 'Thermodynamics', 'Waves & Optics', 'Electromagnetism', 'Modern Physics'];

  const getCategoryByChapterOrder = (order) => {
    if (!order) return 'Mechanics';
    if (order >= 1 && order <= 8) return 'Mechanics';
    if (order === 9) return 'Thermodynamics';
    if (order === 10 || order === 11 || order === 16) return 'Waves & Optics';
    if (order >= 12 && order <= 15) return 'Electromagnetism';
    if (order === 17) return 'Modern Physics';
    return 'Mechanics';
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/videos');
        setVideos(res.data || []);
      } catch (err) {
        setError('Failed to fetch video lectures. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const processedVideos = videos.map(vid => ({
    ...vid,
    category: getCategoryByChapterOrder(vid.chapter?.order)
  }));

  const filteredVideos = activeCategory === 'All'
    ? processedVideos
    : processedVideos.filter(vid => vid.category === activeCategory);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Syllabus Video Lectures</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          High-definition video courses detailing derivations, experiments, and numerical walkthroughs for each syllabus module.
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-900 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
              activeCategory === cat
                ? 'bg-primary-500 text-slate-950 shadow-md shadow-primary-500/10'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/20 text-rose-300 text-sm font-semibold border border-rose-500/30 text-center">
          {error}
        </div>
      )}

      {/* Videos Grid */}
      {!error && filteredVideos.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-semibold">
          No video lectures uploaded yet for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <Card key={vid._id} className="flex flex-col justify-between p-0 overflow-hidden group text-left">
              {/* Thumbnail Mock */}
              <div className="relative aspect-video bg-slate-950 border-b border-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-0"></div>
                <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                <div className="z-20 w-12 h-12 rounded-full bg-black/85 border border-slate-800 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-5 h-5 text-primary-400 fill-current ml-0.5" />
                </div>
                
                {/* Labels */}
                <div className="absolute bottom-3 left-4 z-20 text-white text-xs font-bold flex items-center space-x-2">
                  <span>{vid.duration ? `${vid.duration} mins` : 'N/A'}</span>
                </div>

                <div className="absolute top-3 right-4 z-20">
                  <Badge variant="warning" className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Premium</span>
                  </Badge>
                </div>
              </div>

              {/* Meta */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{vid.category} &bull; {vid.chapter?.title}</span>
                  <h3 className="text-base font-bold text-slate-200 group-hover:text-primary-400 transition-colors">
                    {vid.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {vid.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center rounded-full text-xs"
                    onClick={() => navigate('/login')}
                    icon={Lock}
                  >
                    Watch Premium Course
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicVideos;
