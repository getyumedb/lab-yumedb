import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Star, Users } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Manga } from '../types';
import { Link } from 'react-router-dom';

export default function MangaList() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true);
      try {
        let res;
        if (query) {
          res = await jikanService.searchManga(query, page);
        } else {
          res = await jikanService.getTopManga(page);
        }
        
        if (page === 1) {
          setMangas(res.data);
        } else {
          setMangas(prev => {
            const newMangas = res.data.filter(
              newManga => !prev.some(p => p.mal_id === newManga.mal_id)
            );
            return [...prev, ...newMangas];
          });
        }
      } catch (error) {
        console.error('Error fetching manga:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchManga, query ? 500 : 0);
    return () => clearTimeout(timer);
  }, [page, query]);

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-8 bg-brand rounded-full" />
               <h1 className="text-5xl md:text-7xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
                  Manga Base
               </h1>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">
              Graphic masterpieces and serializations
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search manga archives..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-brand/40 uppercase tracking-widest font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {mangas.map((manga, index) => (
            <motion.div
              key={`${manga.mal_id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 10) * 0.05 }}
            >
              <Link to={`/manga/${manga.mal_id}`} className="group block">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4.5] border border-white/5 bg-zinc-950 shadow-2xl">
                   <img 
                    src={manga.images.webp.large_image_url || manga.images.jpg.large_image_url} 
                    alt={manga.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                  />
                   <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                         <Star className="w-3 h-3 text-brand fill-brand" />
                         <span className="text-[10px] font-black text-white italic">{manga.score || 'N/A'}</span>
                      </div>
                      <h3 className="text-sm font-display font-black text-white italic tracking-tighter leading-none group-hover:text-brand transition-colors uppercase line-clamp-2">
                        {manga.title}
                      </h3>
                      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{manga.type}</div>
                         <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{manga.chapters ? `${manga.chapters} Ch.` : 'Ongoing'}</div>
                      </div>
                   </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand border-t-transparent" />
          </div>
        )}

        {!loading && (
          <div className="mt-20 flex justify-center">
            <button 
              onClick={() => setPage(prev => prev + 1)}
              className="px-12 py-4 bg-white text-zinc-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand hover:text-white transition-all shadow-xl"
            >
              Retrieve More Volumes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
