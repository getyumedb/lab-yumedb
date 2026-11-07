import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Anime } from '../types';

interface HeroSliderProps {
  animes: Anime[];
}

export default function HeroSlider({ animes }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(animes.length, 5));
    }, 8000);
    return () => clearInterval(timer);
  }, [animes.length]);

  if (!animes.length) return null;

  const currentAnime = animes[current];

  return (
    <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.mal_id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Backdrop Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${currentAnime.images.webp.large_image_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-brand px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-white">
                  Trending #{current + 1}
                </span>
                <span className="text-xs font-semibold text-gray-300">
                  {currentAnime.season?.toUpperCase()} {currentAnime.year}
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-2xl">
                {currentAnime.title_english || currentAnime.title}
              </h1>

              <div className="flex items-center gap-4">
                <Link 
                  to={`/anime/${currentAnime.mal_id}`}
                  className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand/20 group"
                >
                  View Details
                </Link>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold transition-all border border-white/5">
                  + Watchlist
                </button>
                <div className="flex -space-x-2 ml-4">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-gray-600 shadow-lg" />
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-gray-400 shadow-lg" />
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-gray-500 shadow-lg" />
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-brand flex items-center justify-center text-[10px] font-bold text-white shadow-lg">+1k</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-1 rounded-full transition-all duration-500 cursor-pointer",
              current === i ? "h-8 bg-brand" : "h-4 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
