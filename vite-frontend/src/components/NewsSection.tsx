import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { News } from '../types';

export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await jikanService.getRecentNews();
        setNews(res.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <div className="flex items-center justify-between gap-8 mb-12 border-b border-white/5 pb-8">
        <div>
           <h2 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter leading-none flex items-center gap-4 uppercase">
              <div className="w-1.5 h-12 bg-white rounded-full" />
              Latest Intel
           </h2>
           <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Transmitting global industry updates</p>
        </div>
        <a href="https://myanimelist.net/news" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all group flex items-center gap-3">
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Full Feed</span>
           <ArrowRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item, index) => (
          <motion.div
            key={`${item.mal_id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block bg-zinc-950/40 border border-white/5 rounded-[2rem] overflow-hidden hover:bg-zinc-900/50 transition-all"
          >
            <div className="relative aspect-video overflow-hidden">
               <img src={item.images.jpg.image_url} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
               <div className="absolute top-4 left-4 bg-brand px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest italic shadow-xl">
                  Flash News
               </div>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center gap-3 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString()}
               </div>
               <h3 className="text-base font-display font-black text-white italic tracking-tighter uppercase leading-[1.1] line-clamp-3 group-hover:text-brand transition-colors">
                  {item.title}
               </h3>
               <p className="text-[11px] text-gray-500 font-medium line-clamp-3 leading-relaxed">
                  {item.excerpt}
               </p>
               <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-brand uppercase tracking-widest transition-colors pt-4 border-t border-white/5 w-full"
              >
                  Decipher More <ExternalLink className="w-3 h-3" />
               </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
