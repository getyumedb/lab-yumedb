import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ChevronDown, LayoutGrid, List as ListIcon, SlidersHorizontal, Loader2, X } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import { cn } from '../lib/utils';

export default function AnimeList() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    rating: '',
    order_by: 'popularity',
    sort: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const filterParams = `&type=${filters.type}&status=${filters.status}&rating=${filters.rating}&order_by=${filters.order_by}&sort=${filters.sort}`;
        const res = await jikanService.searchAnime('', filterParams + `&page=${page}`);
        if (page === 1) {
          setAnimes(res.data);
        } else {
          setAnimes(prev => {
            const newAnimes = res.data.filter(
              newAnime => !prev.some(p => p.mal_id === newAnime.mal_id)
            );
            return [...prev, ...newAnimes];
          });
        }
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [filters, page]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const filterOptions = {
    type: ['tv', 'movie', 'ova', 'special', 'ona', 'music'],
    status: ['airing', 'complete', 'upcoming'],
    rating: ['g', 'pg', 'pg13', 'r17', 'r', 'rx'],
    order_by: ['title', 'score', 'rank', 'popularity', 'favorites', 'episodes']
  };

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-8 bg-brand rounded-full" />
               <h1 className="text-5xl md:text-7xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
                  Anime Archive
               </h1>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">
              Explore the global collection of records
            </p>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border",
              showFilters ? "bg-brand text-white border-brand shadow-lg shadow-brand/20" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8 bg-zinc-900/50 rounded-[2rem] border border-white/5">
                {Object.entries(filterOptions).map(([key, options]) => (
                  <div key={key} className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">{key.replace('_', ' ')}</label>
                    <select
                      value={(filters as any)[key]}
                      onChange={(e) => updateFilter(key, e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-gray-300 font-bold focus:outline-none focus:border-brand/40 transition-all uppercase tracking-widest"
                    >
                      <option value="">Any {key.replace('_', ' ')}</option>
                      {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-12">
          {animes.map((anime, index) => (
            <motion.div
              key={`${anime.mal_id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 12) * 0.05 }}
            >
              <AnimeCard anime={anime} />
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand border-t-transparent shadow-[0_0_20px_rgba(242,63,96,0.2)]" />
          </div>
        )}

        {!loading && animes.length > 0 && (
          <div className="mt-20 flex justify-center">
            <button 
              onClick={() => setPage(prev => prev + 1)}
              className="px-12 py-4 bg-white text-zinc-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand hover:text-white transition-all shadow-xl"
            >
              Load More Records
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
