import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { 
  FileText, Search, Download, BookOpen, Calendar, 
  ArrowUpDown, ExternalLink, AlertCircle 
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alphabetical'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, chaptersRes] = await Promise.all([
          axios.get('/notes'),
          axios.get('/chapters')
        ]);
        setNotes(notesRes.data || []);
        setChapters(chaptersRes.data || []);
      } catch (err) {
        setError('Failed to fetch study notes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullPage={false} />;
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border-2 border-slate-900 text-rose-600 font-bold flex items-center space-x-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  // Filter notes based on chapter and search query
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      note.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesChapter = 
      selectedChapterId === 'All' || 
      (note.chapter && note.chapter._id === selectedChapterId);

    return matchesSearch && matchesChapter;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header (Neo-Brutalist Hero Card) */}
      <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-[5px_5px_0px_0px_#000]">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#fbd13c] border-2 border-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[2px_2px_0px_0px_#000] shrink-0">
            📚
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Physics Study Portal</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">Revision & Study Notes</h2>
          </div>
        </div>
        <p className="text-sm text-slate-655 font-semibold mt-4 leading-relaxed max-w-2xl text-left">
          Access high-quality PDF worksheets, summary cards, and exam revision guides uploaded by your instructor. Filter by chapter or search for specific keywords to speed up your revision.
        </p>
      </div>

      {/* Search, Filters, and Sorting Controls */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by note title or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-0 focus:border-slate-900 shadow-[2px_2px_0px_0px_#000]"
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chapter Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950/20 border-2 border-slate-900 rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
            <BookOpen className="w-4 h-4 text-slate-550" />
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="text-xs font-bold bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer text-slate-800"
            >
              <option value="All">All Chapters</option>
              {chapters.map((chap) => (
                <option key={chap._id} value={chap._id}>
                  Ch {chap.order}: {chap.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950/20 border-2 border-slate-900 rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
            <ArrowUpDown className="w-4 h-4 text-slate-550" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer text-slate-800"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Study Notes Listing Grid */}
      {sortedNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedNotes.map((note) => (
            <div
              key={note._id}
              className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4 text-left">
                {/* Note Header: Badge and Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#faebd7] border-2 border-slate-900 text-slate-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <FileText className="w-6 h-6 text-slate-800" />
                  </div>
                  
                  {note.chapter ? (
                    <span className="text-[10px] bg-[#fbd13c]/30 text-slate-800 border border-slate-900 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      Ch {note.chapter.order}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-655 border border-slate-900 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      General
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 line-clamp-1">
                    {note.title}
                  </h3>
                  {note.chapter && (
                    <p className="text-[10px] font-black text-[#ff7034] uppercase tracking-wide">
                      {note.chapter.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 font-semibold leading-relaxed line-clamp-3 min-h-[48px]">
                  {note.description || 'No detailed summary provided. Click below to download or view the lecture notes.'}
                </p>
              </div>

              {/* Lower Section: Meta Info & Download Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-900/10 space-y-4">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-350" />
                    <span>{formatDate(note.createdAt)}</span>
                  </span>
                  <span>{note.fileType?.toUpperCase() || 'PDF'}</span>
                </div>

                <div className="flex gap-3">
                  {/* View Note */}
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center space-x-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View File</span>
                  </a>

                  {/* Download Note */}
                  <a
                    href={note.fileUrl}
                    download={note.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 border-2 border-slate-900 bg-[#ff7034] hover:bg-[#ff5d1a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
                    title="Download Note"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase">No Study Notes Found</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {searchQuery || selectedChapterId !== 'All' 
                ? "Try adjusting your search keywords or chapter selection filter."
                : "Your instructor hasn't uploaded any study materials yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
