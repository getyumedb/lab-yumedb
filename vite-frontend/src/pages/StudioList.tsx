import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Search, Heart, Film, ArrowUpRight } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Studio } from '../types';
import { Link } from 'react-router-dom';

export default function StudioList() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchStudios = async () => {
      setLoading(true);
      try {
        let res;
        if (query) {
          res = await jikanService.searchStudios(query, page);
        } else {
          res = await jikanService.getTopStudios(page);
        }
        
        if (page === 1) {
          setStudios(res.data);
        } else {
          setStudios(prev => {
            const newStudios = res.data.filter(
              newStudio => !prev.some(p => p.mal_id === newStudio.mal_id)
            );
            return [...prev, ...newStudios];
          });
        }
      } catch (error) {
        console.error('Error fetching studios:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchStudios, query ? 500 : 0);
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
                  Production Houses
               </h1>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">
              Foundational studios of animation history
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search studios..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-brand/40 uppercase tracking-widest font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio, index) => (
            <motion.div
              key={`${studio.mal_id}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index % 12) * 0.05 }}
            >
              <Link to={`/studio/${studio.mal_id}`} className="group relative block bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 hover:bg-zinc-900 transition-all border-b-4 border-b-transparent hover:border-b-brand overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-6 h-6 text-brand" />
                 </div>
                 
                 <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-white rounded-2xl p-4 flex items-center justify-center shrink-0 shadow-2xl relative">
                       <img src={studio.images.jpg.image_url} alt={studio.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 pt-2">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 rounded-full text-brand text-[8px] font-black uppercase tracking-widest mb-3 italic">
                          <Landmark className="w-2.5 h-2.5" />
                          Established Production
                       </div>
                       <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase group-hover:text-brand transition-colors line-clamp-1">{studio.name}</h3>
                       
                       <div className="flex items-center gap-6 mt-6">
                          <div className="flex items-center gap-2">
                             <Heart className="w-3.5 h-3.5 text-gray-700" />
                             <span className="text-xs font-black text-gray-500 italic tracking-tighter">{studio.favorites?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Film className="w-3.5 h-3.5 text-gray-700" />
                             <span className="text-xs font-black text-gray-500 italic tracking-tighter">{studio.count || 0} Titles</span>
                          </div>
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
              Explore More Archives
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
