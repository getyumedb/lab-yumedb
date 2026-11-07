import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jikanService } from '../services/jikanService';
import { Anime } from '../types';
import { cn } from '../lib/utils';

const DAYS = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
];

export default function ScheduleBoard() {
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].id);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await jikanService.getSchedules(activeDay);
        setAnimes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, [activeDay]);

  return (
    <div className="bg-zinc-900 rounded-[2.5rem] p-6 md:p-10 border border-white/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-brand rounded-full" />
          <div>
            <h2 className="text-2xl font-display font-black text-white tracking-tighter">Air Schedule</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Weekly Release Times</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-zinc-950 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 uppercase tracking-widest",
                activeDay === day.id 
                  ? "bg-brand text-white shadow-lg shadow-brand/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="wait">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-zinc-950/50 rounded-2xl animate-pulse border border-white/5" />
            ))
          ) : (
            animes.slice(0, 9).map((anime, index) => (
              <motion.div
                key={`${anime.mal_id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/anime/${anime.mal_id}`}
                  className="group flex gap-4 bg-zinc-950/50 hover:bg-zinc-950 p-3 rounded-2xl border border-white/5 transition-all h-full"
                >
                  <div className="w-20 text-center flex flex-col justify-center border-r border-white/5 pr-2 shrink-0">
                    <div className="text-[10px] font-black text-brand uppercase">{activeDay.slice(0, 3)}</div>
                    <div className="text-xs font-bold text-white mt-1 uppercase">{anime.broadcast.time || 'TBA'}</div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center min-w-0 pr-4">
                    <h3 className="text-xs font-bold text-gray-200 line-clamp-1 group-hover:text-brand transition-colors mb-1">
                      {anime.title}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest truncate">{anime.studios?.[0]?.name || 'Unknown'}</span>
                       {anime.broadcast.day && (
                         <span className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[8px] font-black uppercase tracking-widest">LIVE</span>
                       )}
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center pr-2">
                     <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-brand transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {!loading && animes.length === 0 && (
        <div className="py-20 text-center text-zinc-500 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
          No releases scheduled for this day
        </div>
      )}
    </div>
  );
}
