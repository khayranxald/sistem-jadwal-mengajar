import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages === 0) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            1
          </button>
          {startPage > 2 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button key={page} onClick={() => onPageChange(page)} className={`px-4 py-2 rounded-lg transition-colors ${page === currentPage ? "bg-primary-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
          {page}
        </button>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
