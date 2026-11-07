import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, Heart, Share2, Plus, 
  BookOpen, Calendar, Layers, PenTool,
  ChevronRight, Info, ExternalLink, Globe, MessageSquare, Newspaper
} from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Manga, News } from '../types';
import { formatDate, cn } from '../lib/utils';
import RelatedCard from '../components/RelatedCard';
import { AnimeDetailSkeleton } from '../components/Skeleton';
import { SafeImage } from '../components/SafeImage';

const MOCK_ARTICLES = [
  { id: '1', title: 'Top 10 Seinen Manga That Need an Anime Adaptation in 2026', mal_id: 1 },
  { id: '2', title: 'Review: Why "Solitary World" is the Best Sci-Fi of the Season', mal_id: 5114 },
];

import { useHistory } from '../hooks/useHistory';

export default function MangaDetail() {
  const { id } = useParams();
  const { addToHistory } = useHistory();
  const [manga, setManga] = useState<Manga | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [externalLinks, setExternalLinks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [mangaRes, charRes, newsRes, relRes, recRes, extRes, statRes] = await Promise.all([
          jikanService.getMangaFull(Number(id)),
          jikanService.getMangaCharacters(Number(id)),
          jikanService.getMangaNews(Number(id)),
          jikanService.getMangaRelations(Number(id)),
          jikanService.getMangaRecommendations(Number(id)),
          jikanService.getMangaExternalLinks(Number(id)),
          jikanService.getMangaStatistics(Number(id))
        ]);
        setManga(mangaRes.data);

        // Add to history
        if (mangaRes.data) {
          addToHistory({
            id: mangaRes.data.mal_id,
            type: 'manga',
            title: mangaRes.data.title_english || mangaRes.data.title,
            image: mangaRes.data.images.webp.large_image_url
          });
        }

        setCharacters(charRes.data || []);
        setNews(newsRes.data || []);
        setRelations(relRes.data || []);
        setRecommendations(recRes.data || []);
        setExternalLinks(extRes.data || []);
        setStats(statRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <AnimeDetailSkeleton />;

  if (!manga) return <div className="pt-40 text-center text-white font-display font-black uppercase tracking-widest italic">Interference Detected: Manga Not Found</div>;

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <img 
          src={manga.images.webp.large_image_url} 
          alt="" 
          className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-32 space-y-8"
            >
              {/* Title for Mobile/Tablet */}
              <div className="lg:hidden space-y-4 text-center lg:text-left mb-8">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                  {manga.genres.map((genre: any) => (
                    <span key={genre.mal_id} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                      {genre.name}
                    </span>
                  ))}
                </div>
                <h1 className="font-display text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.85] uppercase italic">
                  {manga.title_english || manga.title}
                </h1>
                <p className="text-lg font-medium text-gray-500 italic">{manga.title_japanese}</p>
              </div>

              <div className="relative aspect-[3/4.5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group max-w-sm mx-auto lg:max-w-none">
                <SafeImage 
                  src={manga.images.webp.large_image_url} 
                  alt={manga.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-5 left-5">
                   <span className="bg-brand px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-widest italic">{manga.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Score</div>
                    <div className="flex items-center gap-1.5 font-display text-xl font-black text-white italic">
                       <Star className="w-5 h-5 text-brand fill-brand" />
                       {manga.score || 'N/A'}
                    </div>
                    <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">{manga.scored_by?.toLocaleString()} users</div>
                 </div>
                 <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Popularity</div>
                    <div className="font-display text-xl font-black text-white italic">#{manga.popularity}</div>
                    <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">Ranked #{manga.rank}</div>
                 </div>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 text-[11px]">
                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 text-center italic border-b border-white/10 pb-4">Realtime Metrics</h2>
                <div className="space-y-4">
                    <StatItem label="Members" value={manga.members?.toLocaleString() || '0'} color="text-gray-300" />
                    <StatItem label="Favorites" value={manga.favorites?.toLocaleString() || '0'} color="text-red-400" />
                    <StatItem label="Rank" value={manga.rank || 'N/A'} color="text-brand" />
                    <StatItem label="Popularity" value={manga.popularity} color="text-brand" />
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                   <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Transmission Identifiers</h3>
                   <div className="space-y-3">
                      {manga.titles?.map((t: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="text-[7px] font-black text-brand uppercase tracking-tighter">{t.type}</span>
                          <span className="text-[10px] font-bold text-gray-400 italic line-clamp-2 leading-tight">{t.title}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="space-y-6 bg-zinc-900/30 p-6 rounded-[2rem] border border-white/5 text-[11px]">
                 <div className="space-y-4">
                    <SidebarSection label="Serialization" value={manga.serializations.map((s: any) => s.name).join(', ') || 'N/A'} />
                    <SidebarSection label="Authors" value={manga.authors.map((a: any) => a.name).join(', ') || 'N/A'} />
                    <SidebarSection label="Demographics" value={manga.demographics.map((d: any) => d.name).join(', ') || 'N/A'} />
                    <SidebarSection label="Themes" value={manga.themes.map((t: any) => t.name).join(', ') || 'N/A'} />
                 </div>
              </div>

              <button className="w-full bg-white text-zinc-950 py-4 rounded-2xl font-black text-sm transition-all hover:bg-brand hover:text-white shadow-xl">
                 ADD TO READING LIST
              </button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-16 text-white">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
               <div className="flex flex-wrap items-center gap-3 mb-6">
                 {manga.genres.map((genre: any, idx: number) => (
                   <span key={`${genre.mal_id}-${idx}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5 rounded-full hover:border-brand/40 transition-colors">
                     {genre.name}
                   </span>
                 ))}
               </div>
               <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-[0.85] uppercase italic">
                 {manga.title_english || manga.title}
               </h1>
               <p className="text-xl font-medium text-gray-500 mb-10 tracking-tight italic">{manga.title_japanese}</p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5">
                  <InfoItem icon={<BookOpen className="w-4 h-4 text-brand" />} label="Chapters" value={manga.chapters || 'Ongoing'} />
                  <InfoItem icon={<Layers className="w-4 h-4 text-brand" />} label="Volumes" value={manga.volumes || 'N/A'} />
                  <InfoItem icon={<PenTool className="w-4 h-4 text-brand" />} label="Type" value={manga.type} />
                  <InfoItem icon={<Calendar className="w-4 h-4 text-brand" />} label="Published" value={new Date(manga.published.from).getFullYear() || 'TBA'} />
               </div>
            </motion.div>

            <section>
              <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-6 flex items-center gap-3 italic">
                 <span className="w-8 h-px bg-brand" />
                 Synopsis
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg font-medium max-w-4xl italic">
                {manga.synopsis}
              </p>
            </section>

            <section>
              <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-8 flex items-center gap-3 italic">
                 <span className="w-8 h-px bg-brand" />
                 Characters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {characters.slice(0, 8).map((entry: any, idx: number) => (
                    <div key={`${entry.character.mal_id}-${idx}`} className="flex items-center gap-4 p-3 bg-zinc-900/40 border border-white/5 rounded-2xl group hover:bg-zinc-900/60 transition-all">
                       <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 group-hover:border-brand/40 transition-colors">
                          <SafeImage src={entry.character.images.webp.image_url} alt="" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <div className="text-sm font-bold text-gray-200 group-hover:text-brand transition-colors">{entry.character.name}</div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">{entry.role}</div>
                       </div>
                    </div>
                 ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-8 flex items-center gap-3 italic">
                 <span className="w-8 h-px bg-brand" />
                 Authors & Serialization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Masterminds</div>
                    {manga.authors.map((author, idx) => (
                      <div key={`${author.mal_id}-${idx}`} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-white/5 rounded-2xl group">
                         <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{author.name}</span>
                         <span className="text-[10px] font-black text-brand uppercase italic">{author.type}</span>
                      </div>
                    ))}
                 </div>
                 <div className="space-y-4">
                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Published In</div>
                    {manga.serializations.map((serial, idx) => (
                      <div key={`${serial.mal_id}-${idx}`} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-white/5 rounded-2xl group">
                         <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{serial.name}</span>
                         <ExternalLink className="w-3 h-3 text-gray-700" />
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Expansion & Relations */}
            {relations.length > 0 && (
              <section>
                 <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-brand rounded-full" />
                    Expansion & Relations
                 </h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {relations.flatMap(rel => 
                      rel.entry.map((entry: any) => (
                        <div key={`${rel.relation}-${entry.mal_id}`}>
                          <RelatedCard 
                            entry={entry} 
                            relationType={rel.relation} 
                          />
                        </div>
                      ))
                    ).slice(0, 10)}
                 </div>
              </section>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-brand rounded-full" />
                    Similar Frequencies
                 </h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {recommendations.slice(0, 6).map((rec: any, idx: number) => (
                       <Link key={`${rec.entry.mal_id}-${idx}`} to={`/${rec.entry.type === 'manga' ? 'manga' : 'anime'}/${rec.entry.mal_id}`} className="group">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 mb-3">
                             <SafeImage src={rec.entry.images.webp.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors line-clamp-2 uppercase tracking-tighter">
                             {rec.entry.title}
                          </div>
                       </Link>
                    ))}
                 </div>
              </section>
            )}

            {/* Related Coverage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-12">
                  {news.length > 0 && (
                    <section>
                       <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                          <div className="w-1.5 h-6 bg-brand rounded-full" />
                          Manga Chronicle (News)
                       </h2>
                       <div className="space-y-4">
                          {news.slice(0, 4).map((item, idx) => (
                            <div key={`${item.mal_id}-${idx}`} className="group p-6 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] flex gap-6 hover:bg-zinc-900/60 transition-all cursor-pointer">
                               <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                  <SafeImage src={item.images.jpg.image_url} alt="" className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-1 space-y-2">
                                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{formatDate(item.date)}</div>
                                  <h4 className="text-lg font-display font-black text-white italic uppercase leading-tight group-hover:text-brand transition-colors">{item.title}</h4>
                                  <p className="text-[10px] text-gray-500 line-clamp-2 italic">{item.excerpt}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </section>
                  )}

                  {MOCK_ARTICLES.filter(a => a.mal_id === manga.mal_id).length > 0 && (
                    <section>
                       <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                          <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                          In-Depth Analysis
                       </h2>
                       <div className="space-y-4">
                          {MOCK_ARTICLES.filter(a => a.mal_id === manga.mal_id).map((article) => (
                            <div key={article.id} className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[3rem] group cursor-pointer hover:bg-blue-500/10 transition-all">
                               <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{article.title}</h3>
                            </div>
                          ))}
                       </div>
                    </section>
                  )}

                  {stats && (
                    <section className="mt-20">
                        <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[3rem]">
                           <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic mb-8 border-b border-white/5 pb-4">User Community Metrics</div>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6">
                              <MetricItem label="Reading" value={stats.reading} color="text-green-400" />
                              <MetricItem label="Completed" value={stats.completed} color="text-blue-400" />
                              <MetricItem label="On Hold" value={stats.on_hold} color="text-yellow-400" />
                              <MetricItem label="Dropped" value={stats.dropped} color="text-red-400" />
                              <MetricItem label="Plan to Read" value={stats.plan_to_read} color="text-brand" />
                              <MetricItem label="Total Records" value={stats.total} color="text-white" />
                           </div>
                        </div>
                    </section>
                  )}
               </div>

               <div className="space-y-12">
                  {externalLinks.length > 0 && (
                    <section>
                       <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 italic">Uplinks</h2>
                       <div className="space-y-2">
                          {externalLinks.map((link, idx) => (
                            <a 
                              key={idx} 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-2xl hover:border-brand/40 group transition-all"
                            >
                               <div className="flex items-center gap-3">
                                  <Globe className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{link.name}</span>
                               </div>
                               <ChevronRight className="w-3 h-3 text-gray-800" />
                            </a>
                          ))}
                       </div>
                    </section>
                  )}

               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">{label}</div>
      <div className={cn("text-xl font-display font-black italic tracking-tighter", color)}>
        {value?.toLocaleString() || '0'}
      </div>
    </div>
  );
}

function SidebarSection({ label, value }: { label: string; value: string }) {
   if (!value || value === 'N/A' || value === '') return null;
   return (
      <div className="space-y-1">
         <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{label}</div>
         <div className="font-bold text-gray-400 leading-snug">{value}</div>
      </div>
   );
}

function StatItem({ label, value, color }: { label: string; value: string | number; color: string }) {
   return (
      <div className="flex items-center justify-between">
         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
         <span className={cn("text-sm font-black uppercase italic", color)}>{value}</span>
      </div>
   );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5">
         {icon}
      </div>
      <div>
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-sm font-bold text-white uppercase tracking-tight">{value}</div>
      </div>
    </div>
  );
}
