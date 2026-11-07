import { motion } from 'framer-motion';
import { Star, Play, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';
import { cn } from '../lib/utils';
import { SafeImage } from './SafeImage';

interface AnimeCardProps {
  anime: Anime;
  rank?: number;
}

export default function AnimeCard({ anime, rank }: AnimeCardProps) {
  return (
    <Link 
      to={`/anime/${anime.mal_id}`}
      className="group relative flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-zinc-900 border border-white/5 group-hover:border-brand transition-colors">
        <motion.div
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full"
        >
          <SafeImage 
            src={anime.images.webp.large_image_url} 
            alt={anime.title}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
          />
        </motion.div>
        
        {/* Floating Badges */}
        {rank !== undefined && (
          <div className="absolute top-2 left-2 w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg">
            {rank}
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <div className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Star className="w-3 h-3 text-brand fill-brand" />
            {anime.score || 'N/A'}
          </div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{anime.type}</span>
        </div>
      </div>

      <div className="px-1">
        <h3 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-brand transition-colors font-sans">
          {anime.title_english || anime.title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
          <span>{anime.studios?.[0]?.name || 'Unknown'}</span>
          <span className="w-1 h-1 rounded-full bg-white/10 shrink-0" />
          <span className="text-brand/80">{anime.status}</span>
        </div>
      </div>
    </Link>
  );
}
