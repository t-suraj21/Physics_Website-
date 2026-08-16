import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/common/Loader';
import { Lock, FileText } from 'lucide-react';

const PublicNotes = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [notes, setNotes] = useState([]);
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
    const fetchNotes = async () => {
      try {
        const res = await axios.get('/notes');
        setNotes(res.data || []);
      } catch (err) {
        setError('Failed to fetch revision notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const processedNotes = notes.map(note => ({
    ...note,
    category: getCategoryByChapterOrder(note.chapter?.order)
  }));

  const filteredNotes = activeCategory === 'All'
    ? processedNotes
    : processedNotes.filter(note => note.category === activeCategory);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Physics Revision Notes</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          High-quality study worksheets, summary cards, and exam revision guides prepared to master each core concept.
        </p>
      </div>

      {/* Category selection */}
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

      {/* Notes Grid */}
      {!error && filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-semibold">
          No revision notes uploaded yet for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note._id} className="flex flex-col justify-between p-6 relative overflow-hidden group text-left">
              <div className="absolute top-3 right-3">
                <Badge variant="warning" className="flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Premium</span>
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl w-fit border border-primary-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200 group-hover:text-primary-400 transition-colors">
                  {note.title}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{note.category} &bull; {note.chapter?.title}</p>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {note.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                  {note.fileName}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  icon={Lock}
                  className="rounded-full text-xs"
                >
                  Unlock PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicNotes;
