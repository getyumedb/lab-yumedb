import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Heart, Mic2 } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Person } from '../types';
import { Link } from 'react-router-dom';

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      try {
        let res;
        if (query) {
          res = await jikanService.searchPeople(query, page);
        } else {
          res = await jikanService.getTopPeople(page);
        }
        
        if (page === 1) {
          setPeople(res.data);
        } else {
          setPeople(prev => {
            const newPeople = res.data.filter(
              newPerson => !prev.some(p => p.mal_id === newPerson.mal_id)
            );
            return [...prev, ...newPeople];
          });
        }
      } catch (error) {
        console.error('Error fetching people:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPeople, query ? 500 : 0);
    return () => clearTimeout(timer);
  }, [page, query]);

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none text-white">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-8 bg-brand rounded-full" />
               <h1 className="text-5xl md:text-7xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
                  Staff & Cast
               </h1>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">
              The masterminds behind the animation
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search staff/actors..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-brand/40 uppercase tracking-widest font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {people.map((person, index) => (
            <motion.div
              key={`${person.mal_id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 10) * 0.05 }}
            >
              <Link to={`/person/${person.mal_id}`} className="group block bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden hover:bg-zinc-900 transition-all p-3">
                 <div className="relative rounded-[1.5rem] overflow-hidden aspect-square border border-white/5 bg-zinc-950 mb-4">
                    <img 
                      src={person.images.jpg.image_url} 
                      alt={person.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                       <Heart className="w-3 h-3 text-brand fill-brand" />
                       <span className="text-[10px] font-black text-white italic tracking-tighter">{person.favorites.toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="px-3 pb-3">
                    <h3 className="text-sm font-display font-black text-white italic tracking-tighter uppercase group-hover:text-brand transition-colors line-clamp-1">{person.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <Mic2 className="w-3 h-3 text-gray-600" />
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Professional <br /> Profile</span>
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
              Discover More Industry Experts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
