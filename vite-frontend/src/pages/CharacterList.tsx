import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Loader2 } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Character } from '../types';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        let res;
        if (query) {
          res = await jikanService.searchCharacters(query, page);
        } else {
          res = await jikanService.getTopCharacters(page);
        }
        
        if (page === 1) {
          setCharacters(res.data);
        } else {
          setCharacters(prev => {
            const newChars = res.data.filter(
              newChar => !prev.some(p => p.mal_id === newChar.mal_id)
            );
            return [...prev, ...newChars];
          });
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCharacters, query ? 500 : 0);
    return () => clearTimeout(timer);
  }, [page, query]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

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
                  Characters
               </h1>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">
              Legendary personas of the multiverse
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search characters..."
              value={query}
              onChange={handleSearch}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-brand/40 uppercase tracking-widest font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
          {characters.map((char, index) => (
            <motion.div
              key={`${char.mal_id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index % 10) * 0.05 }}
            >
              <Link to={`/character/${char.mal_id}`} className="group block">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] border border-white/5 bg-zinc-950 shadow-2xl">
                   <img 
                    src={char.images.webp.image_url} 
                    alt={char.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                  />
                   <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent">
                      <div className="text-[10px] font-black text-brand uppercase tracking-widest mb-1 italic">Identity</div>
                      <div className="text-base font-display font-black text-white italic tracking-tighter leading-none group-hover:text-brand transition-colors uppercase truncate">
                        {char.name}
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-brand text-brand" />
                            {char.favorites.toLocaleString()}
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
              className="px-12 py-4 bg-white text-zinc-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand hover:text-white transition-all"
            >
              Consult More Entities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
