import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, BookOpen, School, Clock, Calendar, Command, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const CATEGORY_CONFIG = {
  guru: { icon: User, label: "Guru", color: "blue", path: "/admin/guru" },
  mapel: { icon: BookOpen, label: "Mata Pelajaran", color: "green", path: "/admin/mata-pelajaran" },
  kelas: { icon: School, label: "Kelas", color: "purple", path: "/admin/kelas" },
  jam: { icon: Clock, label: "Jam Pelajaran", color: "orange", path: "/admin/jam-pelajaran" },
  jadwal: { icon: Calendar, label: "Jadwal", color: "red", path: "/admin/jadwal" },
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search API
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/search", {
          params: { q: query },
        });

        setResults(response.data.data);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const handleSelectResult = (result) => {
    const config = CATEGORY_CONFIG[result.category];
    if (config) {
      navigate(`${config.path}?id=${result.id}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});

  return (
    <>
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors w-64"
      >
        <Search className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500 flex-1 text-left">Cari...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded text-xs text-gray-500 border border-gray-300 dark:border-gray-600">
          <Command className="w-3 h-3" />K
        </kbd>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />

            {/* Search Panel */}
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Cari guru, mata pelajaran, kelas, atau jadwal..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
                {loading && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.length < 2 ? (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Ketik minimal 2 karakter untuk mencari</p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                        <span>Select</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">ESC</kbd>
                        <span>Close</span>
                      </div>
                    </div>
                  </div>
                ) : results.length === 0 && !loading ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Tidak ada hasil untuk "{query}"</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {Object.entries(groupedResults).map(([category, items]) => {
                      const config = CATEGORY_CONFIG[category];
                      const Icon = config.icon;

                      return (
                        <div key={category} className="mb-4">
                          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            <Icon className="w-4 h-4" />
                            {config.label}
                          </div>

                          {items.map((result, idx) => {
                            const globalIndex = results.indexOf(result);
                            const isSelected = globalIndex === selectedIndex;

                            return (
                              <motion.button
                                key={result.id}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => handleSelectResult(result)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                                  isSelected ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : "hover:bg-gray-50 dark:hover:bg-gray-750"
                                }`}
                              >
                                <div className={`w-10 h-10 bg-${config.color}-100 dark:bg-${config.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400`} />
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                  <h4 className="font-medium text-gray-900 dark:text-white truncate">{result.title}</h4>
                                  {result.subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{result.subtitle}</p>}
                                </div>

                                {isSelected && <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                              </motion.button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
