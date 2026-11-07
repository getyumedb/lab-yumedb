import { motion } from 'framer-motion';
import { Play, Star, BookOpen, Clock, Heart, ChevronRight } from 'lucide-react';
import { InternalArticle } from '../types';

const MOCK_ARTICLES: InternalArticle[] = [
  {
    id: '1',
    title: 'Top 10 Seinen Manga That Need an Anime Adaptation in 2026',
    excerpt: 'From gritty psychological thrillers to breathtaking historical epics, these masterpieces are waiting for their moment on the small screen.',
    image: 'https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?q=80&w=2000&auto=format&fit=crop',
    author: 'Yume Editor',
    date: '2026-04-20',
    category: 'Top',
    likes: 1240
  },
  {
    id: '2',
    title: 'Review: Why "Solitary World" is the Best Sci-Fi of the Season',
    excerpt: 'A deep dive into the complex world-building and character dynamics of the latest breakout hit from Studio Ghibli.',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop',
    author: 'Vadim',
    date: '2026-04-25',
    category: 'Review',
    likes: 856
  },
  {
    id: '3',
    title: 'The Evolution of Shinkai: From "Voices" to "Suzume"',
    excerpt: 'Analyzing how Makoto Shinkai refined his visual language and emotional storytelling over two decades.',
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=2000&auto=format&fit=crop',
    author: 'Animation Expert',
    date: '2026-04-22',
    category: 'YouTube',
    youtubeId: 'dQw4w9WgXcQ',
    likes: 3500
  },
  {
    id: '4',
    title: 'Anime Industry Report: The Rise of Global Streaming Platforms',
    excerpt: 'How Netflix, Disney+, and Crunchyroll are changing the way anime is produced and distributed worldwide.',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2000&auto=format&fit=crop',
    author: 'Industry Insider',
    date: '2026-04-18',
    category: 'Analysis',
    likes: 620
  }
];

export default function InternalArticlesSection() {
  return (
    <section className="py-20">
      <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-brand rounded-full" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em] italic">Yume Originals</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter uppercase">
              Spotlight Dossiers
           </h2>
        </div>
        <button className="hidden md:flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all group">
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Archive.exe</span>
           <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Big Article */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative h-[600px] rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-950"
        >
           <img src={MOCK_ARTICLES[0].image} alt="" className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
           
           <div className="absolute inset-x-0 bottom-0 p-12 space-y-6">
              <div className="flex items-center gap-4">
                 <span className="px-4 py-1.5 bg-brand rounded-full text-[10px] font-black text-white uppercase tracking-widest italic">{MOCK_ARTICLES[0].category}</span>
                 <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(MOCK_ARTICLES[0].date).toLocaleDateString()}
                 </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                {MOCK_ARTICLES[0].title}
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed max-w-lg mb-8">
                {MOCK_ARTICLES[0].excerpt}
              </p>
              <div className="flex items-center justify-between pt-8 border-t border-white/10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full border border-white/10" />
                    <span className="text-xs font-black text-white uppercase italic">{MOCK_ARTICLES[0].author}</span>
                 </div>
                 <div className="flex items-center gap-2 text-brand">
                    <Heart className="w-4 h-4 fill-brand" />
                    <span className="text-xs font-black italic tracking-tighter">{MOCK_ARTICLES[0].likes}</span>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Small List */}
        <div className="space-y-6">
           {MOCK_ARTICLES.slice(1).map((article, index) => (
             <motion.div
               key={article.id}
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="group flex gap-6 bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] hover:bg-zinc-900/80 transition-all cursor-pointer"
             >
                <div className="relative w-32 md:w-48 aspect-square md:aspect-video shrink-0 rounded-2xl overflow-hidden">
                   <img src={article.image} alt="" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                   {article.youtubeId && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-brand/20 transition-colors">
                        <Play className="w-8 h-8 text-white fill-white" />
                     </div>
                   )}
                </div>
                <div className="flex-1 space-y-3 py-2">
                   <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black text-brand uppercase tracking-widest italic">{article.category}</span>
                      <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{new Date(article.date).toLocaleDateString()}</span>
                   </div>
                   <h4 className="text-xl font-display font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-brand transition-colors line-clamp-2">
                      {article.title}
                   </h4>
                   <div className="flex items-center gap-4 pt-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-brand" /> {article.author}</span>
                      <span className="flex items-center gap-1.5"><Heart className="w-3 h-3" /> {article.likes}</span>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
