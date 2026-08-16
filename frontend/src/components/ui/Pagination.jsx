import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-between py-4 border-t border-slate-800 ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={ChevronRight}
          iconPosition="right"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Showing page <span className="font-semibold text-slate-300">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-300">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-xl -space-x-px shadow-sm bg-slate-900 border border-slate-800 p-1" aria-label="Pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="relative inline-flex items-center p-2 rounded-lg text-slate-500 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  page === currentPage
                    ? 'bg-primary-500 text-slate-950 shadow-md shadow-primary-500/10'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="relative inline-flex items-center p-2 rounded-lg text-slate-500 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
