import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight, Play, Film, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jikanService } from '../services/jikanService';
import { Anime } from '../types';
import { cn } from '../lib/utils';
import { SafeImage } from '../components/SafeImage';

export default function Schedule() {
  const [baseDate, setBaseDate] = useState(new Date());
  const [activeDayIndex, setActiveDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate 7 days mapping to the current view
  const weekDays = useMemo(() => {
    // We want to show a 7-day window. 
    // To make it intuitive, we can start the week on a specific day or just 7 days from baseDate.
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(baseDate);
      // If we want today to be "active" by default, we can adjust baseDate to be the start of the week.
      // But user asked for buttons to go forward/backward, so a sliding window is better.
      date.setDate(baseDate.getDate() + i);
      return date;
    });
  }, [baseDate]);

  const activeDate = weekDays[activeDayIndex];
  const activeDayName = activeDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await jikanService.getSchedules(activeDayName);
        // Sort by broadcast time
        const sorted = (response.data || []).sort((a, b) => {
          const timeA = a.broadcast?.time || '23:59';
          const timeB = b.broadcast?.time || '23:59';
          return timeA.localeCompare(timeB);
        });
        setAnimes(sorted);
      } catch (error) {
        console.error(error);
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, [activeDayName]);

  const moveWindow = (days: number) => {
    const newBase = new Date(baseDate);
    newBase.setDate(baseDate.getDate() + days);
    setBaseDate(newBase);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 rounded-full text-brand text-[10px] font-black italic uppercase tracking-widest">
                Temporal Registry
             </div>
             <h1 className="text-6xl md:text-8xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.85]">
                Release <br /> <span className="text-brand">Schedule</span>
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => moveWindow(-7)}
               className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all text-white group"
             >
               <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
             </button>
             <div className="text-center min-w-[120px]">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Week Window</div>
                <div className="text-sm font-black text-white uppercase tracking-tighter">
                   {weekDays[0].toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </div>
             </div>
             <button 
               onClick={() => moveWindow(7)}
               className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all text-white group"
             >
               <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

        {/* 7 Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekDays.map((date, idx) => {
            const isActive = activeDayIndex === idx;
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={idx}
                onClick={() => setActiveDayIndex(idx)}
                className={cn(
                  "p-5 rounded-3xl border transition-all flex flex-col items-center gap-2 text-center relative overflow-hidden group",
                  isActive 
                    ? "bg-brand border-brand shadow-2xl shadow-brand/30" 
                    : "bg-zinc-900 border-white/5 hover:bg-zinc-800"
                )}
              >
                {isToday && !isActive && (
                   <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                )}
                <div className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] italic",
                  isActive ? "text-white/60" : "text-gray-500 group-hover:text-gray-300"
                )}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={cn(
                  "text-2xl font-black italic tracking-tighter",
                  isActive ? "text-white" : "text-gray-200"
                )}>
                  {date.getDate()}
                </div>
                <div className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isActive ? "text-zinc-900" : "text-gray-600"
                )}>
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] italic flex items-center gap-3">
                 <Clock className="w-4 h-4 text-brand" />
                 Transmission Log: {activeDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </h2>
              <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                 {animes.length} Frequencies Detected
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="wait">
               {loading ? (
                 [...Array(6)].map((_, i) => (
                   <div key={i} className="h-48 bg-zinc-900/50 rounded-[2rem] animate-pulse border border-white/5" />
                 ))
               ) : animes.length > 0 ? (
                 animes.map((anime, idx) => (
                   <motion.div
                     key={`${anime.mal_id}-${idx}`}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ delay: idx * 0.03 }}
                   >
                     <Link 
                       to={`/anime/${anime.mal_id}`}
                       className="group flex flex-col bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-zinc-900 transition-all hover:border-brand/40 shadow-2xl h-full"
                     >
                       <div className="flex p-6 gap-6 flex-1">
                          <div className="w-24 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 shadow-xl border border-white/5">
                             <SafeImage src={anime.images.webp.image_url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt={anime.title} />
                          </div>
                          <div className="flex-1 space-y-4">
                             <div className="flex items-start justify-between gap-2">
                                <div className="text-[10px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded italic">
                                   {anime.broadcast?.time || 'TBA'}
                                </div>
                                <div className="p-1.5 rounded-lg bg-white/5 text-gray-500 group-hover:text-brand transition-colors">
                                   <Play className="w-3.5 h-3.5 fill-current" />
                                </div>
                             </div>
                             
                             <h3 className="text-base font-black text-white italic tracking-tighter leading-tight group-hover:text-brand transition-colors line-clamp-2 uppercase">
                                {anime.title}
                             </h3>

                             <div className="flex flex-wrap gap-2">
                                {anime.genres.slice(0, 2).map((g: any, gIdx: number) => (
                                   <span key={`${g.mal_id}-${gIdx}`} className="text-[8px] font-black text-gray-600 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded border border-white/5">
                                      {g.name}
                                   </span>
                                ))}
                             </div>
                          </div>
                       </div>
                       
                       <div className="px-6 py-4 bg-zinc-950/50 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] italic">
                          <div className="flex items-center gap-1.5">
                             <User className="w-3 h-3" />
                             {anime.studios?.[0]?.name || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-1.5">
                             <Heart className="w-3 h-3 text-brand fill-brand" />
                             {anime.score || 'N/A'}
                          </div>
                       </div>
                     </Link>
                   </motion.div>
                 ))
               ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                   <div className="text-4xl">📡</div>
                   <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic">No transmissions scheduled for this day</div>
                </div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
