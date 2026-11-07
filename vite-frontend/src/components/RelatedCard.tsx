import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpen } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { cn } from '../lib/utils';

interface RelatedCardProps {
  entry: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  };
  relationType?: string;
}

export default function RelatedCard({ entry, relationType }: RelatedCardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchImage() {
      try {
        let res;
        // Optimization: Use a small cache or just fetch
        if (entry.type === 'anime') {
          res = await jikanService.getAnimeFullById(entry.mal_id);
        } else {
          res = await jikanService.getMangaFull(entry.mal_id);
        }
        
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch related image', err);
        if (isMounted) setLoading(false);
      }
    }
    fetchImage();
    return () => { isMounted = false; };
  }, [entry.mal_id, entry.type]);

  const targetPath = entry.type === 'anime' ? `/anime/${entry.mal_id}` : `/manga/${entry.mal_id}`;

  return (
    <Link to={targetPath} className="group relative block h-full">
      <div className={cn(
        "relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-zinc-900",
        "group-hover:border-brand/40 transition-colors duration-500"
      )}>
        {loading ? (
          <div className="w-full h-full animate-pulse bg-zinc-900 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
          </div>
        ) : data?.images ? (
          <motion.img 
            initial={{ scale: 1.1 }}
            whileHover={{ scale: 1.15 }}
            src={data.images.webp?.large_image_url || data.images.jpg?.large_image_url}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800 font-display font-black text-4xl italic uppercase">
            N/A
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform">
          {relationType && (
            <div className="text-[8px] font-black text-brand uppercase tracking-widest mb-1 italic">
              {relationType}
            </div>
          )}
          <h4 className="text-[11px] font-display font-black text-white italic uppercase tracking-tighter line-clamp-1 group-hover:text-brand transition-colors">
            {entry.name}
          </h4>
          
          {!loading && data?.score && (
            <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Star className="w-3 h-3 text-brand fill-brand" />
              <span className="text-[10px] font-black text-white italic">{data.score}</span>
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
      </div>
    </Link>
  );
}
