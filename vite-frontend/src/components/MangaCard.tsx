import { motion } from 'framer-motion';
import { Star, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Manga } from '../types';

interface MangaCardProps {
  manga: Manga;
  rank?: number;
}

export default function MangaCard({ manga, rank }: MangaCardProps) {
  return (
    <Link 
      to={`/manga/${manga.mal_id}`}
      className="group relative flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4.5] rounded-3xl overflow-hidden shadow-lg bg-zinc-900 border border-white/5 group-hover:border-brand transition-colors">
        <motion.img 
          initial={{ scale: 1.1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6 }}
          src={manga.images.webp.large_image_url || manga.images.jpg.large_image_url} 
          alt={manga.title}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
        />
        
        {rank !== undefined && (
          <div className="absolute top-4 left-4 w-10 h-10 bg-brand rounded-xl flex items-center justify-center font-display font-black text-2xl text-white italic shadow-lg shadow-brand/40">
            {rank}
          </div>
        )}

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <div className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center shadow-2xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-2 text-xs font-black text-white italic">
            <Star className="w-4 h-4 text-brand fill-brand" />
            {manga.score || 'N/A'}
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{manga.type}</span>
        </div>
      </div>

      <div className="px-2">
        <h3 className="font-display font-black text-sm text-gray-200 line-clamp-2 leading-tight uppercase italic group-hover:text-brand transition-colors tracking-tighter">
          {manga.title}
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2 italic">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {manga.status}</span>
        </div>
      </div>
    </Link>
  );
}
