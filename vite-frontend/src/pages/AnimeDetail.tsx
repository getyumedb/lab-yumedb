import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Users, Heart, Share2, Plus, 
  Play, Calendar, Clock, Film, 
  Users2, Landmark, Tag, ChevronRight, Info,
  ExternalLink, Globe, MessageSquare, Newspaper, X
} from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Anime, Character, Person, News } from '../types';
import { cn, formatDate } from '../lib/utils';
import RelatedCard from '../components/RelatedCard';
import { AnimeDetailSkeleton } from '../components/Skeleton';
import { SafeImage } from '../components/SafeImage';

const MOCK_ARTICLES = [
  { id: '1', title: 'Top 10 Seinen Manga That Need an Anime Adaptation in 2026', mal_id: 1 },
  { id: '2', title: 'Review: Why "Solitary World" is the Best Sci-Fi of the Season', mal_id: 5114 },
  { id: '3', title: 'The Evolution of Shinkai: From "Voices" to "Suzume"', mal_id: 164 },
];

import { useHistory } from '../hooks/useHistory';

export default function AnimeDetail() {
  const { id } = useParams();
  const { addToHistory } = useHistory();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [characters, setCharacters] = useState<{ character: Character; role: string; voice_actors: any[] }[]>([]);
  const [staff, setStaff] = useState<{ person: Person; positions: string[] }[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [externalLinks, setExternalLinks] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [promoVideos, setPromoVideos] = useState<any[]>([]);
  const [episodeVideos, setEpisodeVideos] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [streaming, setStreaming] = useState<any[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [episodesPage, setEpisodesPage] = useState(1);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);

  const getEmbedUrl = (trailer: any) => {
    if (!trailer) return null;
    if (trailer.embed_url) return trailer.embed_url;
    if (trailer.youtube_id) return `https://www.youtube.com/embed/${trailer.youtube_id}?autoplay=1`;
    if (trailer.url) {
      // Basic youtube URL parser
      const url = new URL(trailer.url);
      const id = url.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [animeRes, charRes, staffRes, epRes, relRes, recRes, newsRes, extRes, reviewsRes, videosRes, statsRes, streamingRes] = await Promise.all([
          jikanService.getAnimeFullById(Number(id)),
          jikanService.getAnimeCharacters(Number(id)),
          jikanService.getAnimeStaff(Number(id)),
          jikanService.getAnimeEpisodes(Number(id)),
          jikanService.getAnimeRelations(Number(id)),
          jikanService.getAnimeRecommendations(Number(id)),
          jikanService.getAnimeNews(Number(id)),
          jikanService.getAnimeExternalLinks(Number(id)),
          jikanService.getAnimeReviews(Number(id)),
          jikanService.getAnimeVideos(Number(id)),
          jikanService.getAnimeStatistics(Number(id)),
          jikanService.getAnimeStreaming(Number(id))
        ]);
        setAnime(animeRes.data);
        
        // Add to history
        if (animeRes.data) {
          addToHistory({
            id: animeRes.data.mal_id,
            type: 'anime',
            title: animeRes.data.title_english || animeRes.data.title,
            image: animeRes.data.images.webp.image_url
          });
        }

        setCharacters(charRes.data);
        setStaff(staffRes.data);
        
        // Show newest episodes first by starting from the last page if applicable
        const lastPage = epRes.pagination?.last_visible_page || 1;
        if (lastPage > 1) {
          const lastPageRes = await jikanService.getAnimeEpisodes(Number(id), lastPage);
          setEpisodes(lastPageRes.data.reverse());
          setEpisodesPage(lastPage);
          setHasMoreEpisodes(true); // Loading "more" will now fetch previous pages
        } else {
          setEpisodes(epRes.data.reverse());
          setEpisodesPage(1);
          setHasMoreEpisodes(false);
        }

        setRelations(relRes.data);
        setRecommendations(recRes.data);
        setNews(newsRes.data);
        setExternalLinks(extRes.data);
        setReviews(reviewsRes.data);
        setPromoVideos(videosRes.data.promo || []);
        setEpisodeVideos(videosRes.data.episodes || []);
        setStats(statsRes.data);
        setStreaming(streamingRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const loadMoreEpisodes = async () => {
    if (!id || loadingEpisodes || !hasMoreEpisodes) return;
    setLoadingEpisodes(true);
    try {
      const prevPage = episodesPage - 1;
      if (prevPage < 1) {
        setHasMoreEpisodes(false);
        return;
      }
      const res = await jikanService.getAnimeEpisodes(Number(id), prevPage);
      // Append older episodes to the end of the descending list
      setEpisodes(prev => [...prev, ...res.data.reverse()]);
      setEpisodesPage(prevPage);
      setHasMoreEpisodes(prevPage > 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  if (loading) return <AnimeDetailSkeleton />;

  if (!anime) return <div className="pt-40 text-center text-white font-display font-black uppercase tracking-widest italic">Interference Detected: Anime Not Found</div>;

  return (
    <div className="pb-20">
      {/* Background Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <img 
          src={anime.images.webp.large_image_url} 
          alt="" 
          className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar / Poster */}
          <div className="lg:w-1/4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-32 space-y-8"
            >
              {/* Title for Mobile/Tablet - Under Poster */}
              <div className="lg:hidden space-y-4 text-center lg:text-left mb-8">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                  {anime.genres.map((genre: any, idx: number) => (
                    <span key={`${genre.mal_id}-${idx}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                      {genre.name}
                    </span>
                  ))}
                </div>
                <h1 className="font-display text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
                  {anime.title_english || anime.title}
                </h1>
                <p className="text-lg font-medium text-gray-500 italic">{anime.title_japanese}</p>
              </div>

              <div className="relative aspect-[3/4.5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group max-w-sm mx-auto lg:max-w-none">
                <SafeImage 
                  src={anime.images.webp.large_image_url} 
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2">
                   <span className="bg-brand w-fit px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">{anime.status}</span>
                </div>
              </div>

               <div className="space-y-4">
                 <button className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand/20">
                    ADD TO LIBRARY
                 </button>
                 <button 
                  onClick={() => {
                    const embed = getEmbedUrl(anime.trailer);
                    if (embed) setActiveTrailerUrl(embed);
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white py-4 rounded-2xl font-black text-sm transition-all border border-white/5 flex items-center justify-center gap-2"
                 >
                    <Play className="w-4 h-4 fill-current" />
                    WATCH TRAILER
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Score</div>
                    <div className="flex items-center gap-1.5 font-display text-xl font-black text-white">
                       <Star className="w-5 h-5 text-brand fill-brand" />
                       {anime.score}
                    </div>
                    <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">{anime.scored_by?.toLocaleString()} users</div>
                 </div>
                 <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Ranked</div>
                    <div className="font-display text-xl font-black text-white italic">#{anime.rank}</div>
                    <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">Popularity #{anime.popularity}</div>
                 </div>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5">
                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 text-center italic border-b border-white/10 pb-4">Realtime Metrics</h2>
                <div className="space-y-4">
                    <StatItem label="Members" value={anime.members?.toLocaleString()} color="text-gray-300" />
                    <StatItem label="Favorites" value={anime.favorites?.toLocaleString()} color="text-red-400" />
                    <StatItem label="Season" value={anime.season || 'N/A'} color="text-brand" />
                    <StatItem label="Year" value={anime.year || 'N/A'} color="text-brand" />
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                   <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Transmission Identifiers</h3>
                   <div className="space-y-3">
                      {anime.titles?.map((t: any, idx: number) => (
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
                    <SidebarSection label="Broadcast" value={anime.broadcast?.string || 'Unknown'} />
                    <SidebarSection label="Rating" value={anime.rating || 'N/A'} />
                    <SidebarSection label="Duration" value={anime.duration || 'N/A'} />
                    <SidebarSection label="Producers" value={anime.producers.map((p: any) => p.name).join(', ') || 'N/A'} />
                    <SidebarSection label="Licensors" value={anime.licensors.map((l: any) => l.name).join(', ') || 'N/A'} />
                    <SidebarSection label="Demographics" value={anime.demographics.map((d: any) => d.name).join(', ') || 'N/A'} />
                 </div>
              </div>

              {/* Sidebar Uplinks */}
              {externalLinks.length > 0 && (
                <section className="bg-zinc-900/30 p-6 rounded-[2rem] border border-white/5">
                  <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">Official Uplinks</h2>
                  <div className="space-y-2">
                      {externalLinks.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-zinc-950 border border-white/5 rounded-xl hover:border-brand/40 group transition-all"
                        >
                          <div className="flex items-center gap-3">
                              {link.name.toLowerCase().includes('twitter') || link.name.toLowerCase().includes('x') ? (
                                <MessageSquare className="w-3 h-3 text-blue-400" />
                              ) : link.name.toLowerCase().includes('official') ? (
                                <Globe className="w-3 h-3 text-green-400" />
                              ) : (
                                <ExternalLink className="w-3 h-3 text-gray-500" />
                              )}
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors truncate max-w-[100px]">{link.name}</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-800" />
                        </a>
                      ))}
                  </div>
                </section>
              )}

              {/* Sidebar Audio frequencies */}
              {(anime as any).theme?.openings?.length > 0 && (
                <section className="bg-zinc-900/30 p-6 rounded-[2rem] border border-white/5">
                  <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    Audio Frequencies
                  </h2>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
                      { (anime as any).theme.openings?.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-[9px] font-black text-brand uppercase tracking-widest mb-2 italic">Opening Anthems</div>
                          {(anime as any).theme.openings.map((theme: string, idx: number) => (
                            <div key={idx} className="p-3 bg-zinc-950 border border-white/5 rounded-xl text-[10px] font-medium text-gray-300 italic leading-snug">
                              {theme}
                            </div>
                          ))}
                        </div>
                      )}
                      { (anime as any).theme.endings?.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2 italic">Ending Frequencies</div>
                          {(anime as any).theme.endings.map((theme: string, idx: number) => (
                            <div key={idx} className="p-3 bg-zinc-950/40 border border-white/5 rounded-xl text-[10px] font-medium text-gray-400 italic leading-snug">
                              {theme}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </section>
              )}
            </motion.div>
          </div>

          {/* Main Info Area */}
          <div className="lg:w-3/4 space-y-16">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {anime.genres.map((genre: any, idx: number) => (
                  <span key={`${genre.mal_id}-${idx}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5 rounded-full hover:border-brand/40 transition-colors cursor-pointer">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-[0.9] uppercase italic">
                {anime.title_english || anime.title}
              </h1>
              <p className="text-xl font-medium text-gray-500 mb-10 tracking-tight italic">{anime.title_japanese}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5">
                <InfoItem icon={<Calendar className="w-4 h-4 text-brand" />} label="Year" value={anime.year || 'TBA'} />
                <InfoItem icon={<Clock className="w-4 h-4 text-brand" />} label="Episodes" value={`${anime.episodes || '?'}`} />
                <InfoItem icon={<Film className="w-4 h-4 text-brand" />} label="Source" value={anime.source} />
                <InfoItem icon={<Tag className="w-4 h-4 text-brand" />} label="Season" value={anime.season?.toUpperCase() || 'N/A'} />
              </div>
            </motion.div>

            <section>
              <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                 <span className="w-8 h-px bg-brand" />
                 Synopsis
              </h2>
              <div className="space-y-6 max-w-4xl">
                <p className="text-gray-400 leading-relaxed text-lg font-medium italic">
                  {anime.synopsis}
                </p>
                {anime.background && (
                  <div className="p-8 bg-zinc-900/40 border-l border-brand rounded-r-[2rem] space-y-3">
                    <div className="text-[10px] font-black text-brand uppercase tracking-widest italic">Temporal Background Log</div>
                    <p className="text-sm text-gray-500 italic leading-relaxed">{anime.background}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Sub-sections: Characters, Staff, etc. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Characters Quick List */}
               <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] flex items-center gap-3">
                      <span className="w-8 h-px bg-brand" />
                      Characters
                    </h2>
                    <button 
                      onClick={() => setShowAllCharacters(!showAllCharacters)}
                      className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      {showAllCharacters ? 'Collapse List' : `View All ${characters.length}`}
                    </button>
                  </div>
                  <div className={cn(
                    "grid grid-cols-1 gap-2 transition-all duration-500 overflow-hidden",
                    showAllCharacters ? "max-h-[2000px]" : "max-h-[400px]"
                  )}>
                         {characters.map((char: any, idx: number) => (
                        <Link 
                          key={`${char.character.mal_id}-${idx}`}
                          to={`/character/${char.character.mal_id}`}
                          className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group"
                        >
                           <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 bg-zinc-900 group-hover:border-brand/40 transition-colors">
                              <SafeImage src={char.character.images.webp.image_url} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <div className="text-sm font-bold text-gray-200 group-hover:text-brand transition-colors">{char.character.name}</div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{char.role}</div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-brand" />
                        </Link>
                     ))}
                  </div>
                  {!showAllCharacters && characters.length > 6 && (
                    <div className="mt-4 p-4 text-center bg-zinc-900/40 rounded-2xl border border-dashed border-white/5 text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">
                       And {characters.length - 6} more individuals...
                    </div>
                  )}
               </section>

               {/* Studio & Staff */}
               <section>
                  <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <span className="w-8 h-px bg-brand" />
                    Studio & Staff
                  </h2>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 ml-2">Production Houses</div>
                        {anime.studios.map((studio: any, sIdx: number) => (
                          <Link 
                              key={`${studio.mal_id}-${sIdx}`}
                              to={`/studio/${studio.mal_id}`}
                              className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group"
                          >
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5 bg-zinc-900 flex items-center justify-center">
                                 <Landmark className="w-5 h-5 text-gray-700 group-hover:text-brand" />
                              </div>
                              <div className="flex-1">
                                 <div className="text-xs font-bold text-gray-200 group-hover:text-brand transition-colors">{studio.name}</div>
                                 <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Lead Production</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-700" />
                          </Link>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 gap-2">
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 ml-2">Executive Staff</div>
                        {staff.slice(0, 6).map((person: any, idx: number) => (
                           <Link 
                              key={`${person.person.mal_id}-${idx}`}
                              to={`/person/${person.person.mal_id}`}
                              className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group"
                           >
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5 bg-zinc-900">
                                 <SafeImage src={person.person.images.jpg.image_url} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                 <div className="text-xs font-bold text-gray-200 group-hover:text-brand transition-colors">{person.person.name}</div>
                                 <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate">{person.positions.join(', ')}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-700" />
                           </Link>
                        ))}
                     </div>
                  </div>
               </section>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-20 pt-10">
                 {/* Relations */}
                {relations.length > 0 && (
                  <section>
                     <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-brand rounded-full" />
                        Expansion & Relations
                     </h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {relations.flatMap((rel, relIdx) => 
                          rel.entry.map((entry: any, entryIdx: number) => (
                            <div key={`${rel.relation}-${entry.mal_id}-${relIdx}-${entryIdx}`}>
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

               {/* Episodes */}
               {episodes.length > 0 && (
                 <section>
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
                         <div className="w-1.5 h-6 bg-brand rounded-full" />
                         Logbook: Episodes
                      </h2>
                      <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">View All Archive</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {episodes.map((ep: any, epIdx: number) => (
                         <div 
                           key={`${ep.mal_id}-${epIdx}`} 
                           onClick={() => setSelectedEpisode(ep)}
                           className="flex items-center gap-6 bg-zinc-900/20 border border-white/5 p-4 rounded-2xl hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                         >
                            <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0 font-display font-black text-brand italic group-hover:scale-110 transition-transform">
                               {ep.mal_id}
                            </div>
                            <div className="flex-1">
                               <div className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand transition-colors">{ep.title}</div>
                               <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">Aired: {formatDate(ep.aired)}</div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand transition-all">
                               <Info className="w-3 h-3 text-white" />
                            </button>
                         </div>
                      ))}
                   </div>
                    {hasMoreEpisodes && (
                      <div className="mt-8 flex justify-center">
                        <button 
                          onClick={loadMoreEpisodes}
                          disabled={loadingEpisodes}
                          className="px-8 py-3 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white hover:border-brand/40 transition-all italic disabled:opacity-50"
                        >
                          {loadingEpisodes ? 'Syncing Data Matrix...' : 'Engage All Data Blocks (Load More)'}
                        </button>
                      </div>
                    )}
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
                          <Link key={`${rec.entry.mal_id}-${idx}`} to={`/anime/${rec.entry.mal_id}`} className="group">
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

               {/* Streaming Uplinks */}
               {streaming.length > 0 && (
                 <section>
                    <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-brand rounded-full" />
                        Digital Frequencies (Streaming)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                       {streaming.map((link: any, idx: number) => (
                         <a 
                           key={idx}
                           href={link.url}
                           target="_blank"
                           rel="noreferrer"
                           className="flex flex-col items-center justify-center gap-3 p-6 bg-zinc-900/40 border border-white/5 rounded-[2rem] hover:bg-zinc-900 transition-all group text-center"
                         >
                           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all text-gray-500">
                              <Globe className="w-6 h-6" />
                           </div>
                           <div className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">{link.name}</div>
                         </a>
                       ))}
                    </div>
                 </section>
               )}
               {promoVideos.length > 0 && (
                 <section>
                    <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-brand rounded-full" />
                        Multiverse Previews (Trailers)
                    </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {promoVideos.slice(0, 6).map((video: any, idx: number) => {
                          const embed = getEmbedUrl(video.trailer);
                          return (
                            <div key={idx} className="group space-y-4">
                               <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group-hover:border-brand/40 transition-all cursor-pointer shadow-2xl bg-zinc-950"
                               onClick={() => embed && setActiveTrailerUrl(embed)}>
                                  {embed ? (
                                    <div className="absolute inset-0 pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity">
                                      <iframe 
                                        src={`${embed}${embed.includes('?') ? '&' : '?'}controls=0&mute=1&autoplay=0`}
                                        className="w-full h-full object-cover scale-105"
                                        title={video.title}
                                      />
                                      <div className="absolute inset-0 bg-zinc-950/20" />
                                    </div>
                                  ) : (
                                    <SafeImage 
                                      src={video.trailer.images.maximum_image_url || `https://img.youtube.com/vi/${video.trailer.youtube_id}/maxresdefault.jpg`} 
                                      alt={video.title} 
                                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" 
                                    />
                                  )}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                   <div 
                                    className="w-12 h-12 bg-brand rounded-full flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all shadow-xl shadow-brand/40 border border-white/20"
                                   >
                                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                   </div>
                                  </div>
                               </div>
                               <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest line-clamp-1 italic px-2 group-hover:text-brand transition-colors">
                                  {video.title}
                               </div>
                            </div>
                          );
                       })}
                    </div>
                 </section>
               )}

               {/* Trailer Modal Removed from here as it was just inline */}

               {/* External Media & Related Coverage */}
               <div className="gap-12">
                  <div className="lg:col-span-2 space-y-12">
                     {/* External Ratings / Reviews */}
                     {(reviews.length > 0 || stats) && (
                       <section>
                          <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                             <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
                             External Frequency Analysis (Reviews & Stats)
                          </h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                             {/* Stats Distribution */}
                             {stats?.scores && (
                               <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[3rem] space-y-6">
                                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Score Distribution</div>
                                  <div className="space-y-3">
                                     {stats.scores.slice(0, 10).reverse().map((s: any) => (
                                       <div key={s.score} className="flex items-center gap-4 group">
                                          <div className="w-4 text-[9px] font-black text-gray-600 italic">{s.score}</div>
                                          <div className="flex-1 h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                                             <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${s.percentage}%` }}
                                                className="h-full bg-brand group-hover:bg-orange-400 transition-colors"
                                             />
                                          </div>
                                          <div className="w-10 text-right text-[9px] font-bold text-gray-500">
                                             {s.percentage}%
                                          </div>
                                       </div>
                                     ))}
                                  </div>
                               </div>
                             )}

                             {/* Watch Status Stats */}
                             {stats && (
                                <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[3rem]">
                                   <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic mb-8 border-b border-white/5 pb-4">User Community Metrics</div>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6">
                                      <MetricItem label="Watching" value={stats.watching} color="text-green-400" />
                                      <MetricItem label="Completed" value={stats.completed} color="text-blue-400" />
                                      <MetricItem label="On Hold" value={stats.on_hold} color="text-yellow-400" />
                                      <MetricItem label="Dropped" value={stats.dropped} color="text-red-400" />
                                      <MetricItem label="Plan to Watch" value={stats.plan_to_watch} color="text-brand" />
                                      <MetricItem label="Total Records" value={stats.total} color="text-white" />
                                   </div>
                                </div>
                             )}
                          </div>

                          <div className="space-y-4">
                             {reviews.slice(0, 3).map((review: any, idx: number) => (
                               <div key={`${review.mal_id}-${idx}`} className="p-8 bg-zinc-900/40 border border-white/5 rounded-[3rem] space-y-4">
                                  <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                           <img src={review.user.images.jpg.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                           <div className="text-sm font-bold text-white">{review.user.username}</div>
                                           <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{formatDate(review.date)}</div>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-1.5 bg-brand/10 px-3 py-1.5 rounded-full border border-brand/20">
                                        <Star className="w-3 h-3 text-brand fill-brand" />
                                        <span className="text-xs font-black text-brand italic">{review.score}</span>
                                     </div>
                                  </div>
                                  <p className="text-sm text-gray-400 font-medium italic leading-relaxed line-clamp-4">
                                     "{review.review}"
                                  </p>
                               </div>
                             ))}
                          </div>
                       </section>
                     )}
                     {/* Related News */}
                     {news.length > 0 && (
                       <section>
                          <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                             <div className="w-1.5 h-6 bg-brand rounded-full" />
                             Related Broadcasts (News)
                          </h2>
                          <div className="space-y-4">
                             {news.slice(0, 5).map((item, idx: number) => (
                               <div key={`${item.mal_id}-${idx}`} className="group p-6 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] flex gap-6 hover:bg-zinc-900/60 transition-all cursor-pointer">
                                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                     <img src={item.images.jpg.image_url} alt="" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                     <div className="flex items-center gap-3">
                                        <Newspaper className="w-3 h-3 text-brand" />
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{formatDate(item.date)}</span>
                                     </div>
                                     <h4 className="text-lg font-display font-black text-white italic uppercase leading-tight group-hover:text-brand transition-colors">{item.title}</h4>
                                     <p className="text-[10px] text-gray-500 line-clamp-2 italic">{item.excerpt}</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </section>
                     )}

                     {/* Internal Articles */}
                     {MOCK_ARTICLES.filter(a => a.mal_id === anime.mal_id).length > 0 && (
                        <section>
                           <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-4">
                              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                              Yume Originals Analysis
                           </h2>
                           <div className="space-y-4">
                              {MOCK_ARTICLES.filter(a => a.mal_id === anime.mal_id).map((article) => (
                                <div key={article.id} className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[3rem] group cursor-pointer hover:bg-blue-500/10 transition-all">
                                   <div className="flex items-center gap-3 mb-4">
                                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Featured Spotlight</span>
                                   </div>
                                   <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{article.title}</h3>
                                </div>
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

      {/* Trailer Modal */}
      <AnimatePresence>
        {activeTrailerUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
          >
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl" onClick={() => setActiveTrailerUrl(null)} />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black"
            >
               <iframe 
                  src={activeTrailerUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
               />
               <button 
                onClick={() => setActiveTrailerUrl(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-brand rounded-full flex items-center justify-center backdrop-blur-md transition-all group"
               >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episode Modal */}
      <AnimatePresence>
        {selectedEpisode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl" onClick={() => setSelectedEpisode(null)} />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 p-8 md:p-12"
            >
               <div className="flex flex-col md:flex-row gap-12">
                  <div className="md:w-1/3 aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center order-2 md:order-1 relative group">
                     {episodeVideos.find(v => v.mal_id === selectedEpisode.mal_id) ? (
                        <img 
                          src={episodeVideos.find(v => v.mal_id === selectedEpisode.mal_id).images.jpg.image_url} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                     ) : (
                        <span className="text-8xl font-display font-black text-zinc-800 italic uppercase">{selectedEpisode.mal_id}</span>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="md:w-2/3 space-y-8 order-1 md:order-2">
                     <div>
                        <div className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-2 italic">Episode Transmission</div>
                        <h2 className="text-4xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-4">{selectedEpisode.title || 'Untitled Archive'}</h2>
                        <div className="text-lg font-medium text-gray-500 italic uppercase tracking-tighter">{selectedEpisode.title_japanese || selectedEpisode.title_romanji}</div>
                     </div>

                     <div className="grid grid-cols-2 gap-6 pb-8 border-b border-white/5">
                        <div>
                           <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Aired</div>
                           <div className="text-sm font-bold text-gray-300 italic">{formatDate(selectedEpisode.aired)}</div>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Duration</div>
                           <div className="text-sm font-bold text-gray-300 italic">{anime.duration}</div>
                        </div>
                     </div>

                     <p className="text-gray-400 italic leading-relaxed text-lg">
                        Detailed data for this specific transmission link is restricted to high-tier frequency access. Use external uplinks for full playback.
                     </p>

                     {streaming.length > 0 && (
                       <div className="space-y-4">
                          <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Playable Uplinks</div>
                          <div className="flex flex-wrap gap-3">
                             {streaming.map((s, idx) => (
                               <a 
                                 key={idx} 
                                 href={s.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="px-6 py-3 bg-white/5 hover:bg-brand hover:text-white border border-white/5 rounded-xl transition-all flex items-center gap-2 group"
                               >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                               </a>
                             ))}
                          </div>
                       </div>
                     )}

                     <button 
                       onClick={() => window.open(selectedEpisode.url || selectedEpisode.forum_url, '_blank')}
                       className="w-full py-4 bg-brand rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand/20"
                     >
                        Sync Full Media Buffer
                     </button>
                  </div>
               </div>
               
               <button 
                onClick={() => setSelectedEpisode(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-brand rounded-full flex items-center justify-center backdrop-blur-md transition-all group"
               >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarSection({ label, value }: { label: string; value: string }) {
   if (!value || value === 'N/A') return null;
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

function MetricItem({ label, value, color }: { label: string; value: number; color: string }) {
   return (
      <div className="space-y-1 p-4 bg-zinc-950/40 border border-white/5 rounded-2xl hover:bg-zinc-950/60 transition-all group">
         <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest group-hover:text-gray-400 transition-colors">{label}</div>
         <div className={cn("text-lg font-black italic", color)}>{value?.toLocaleString() || 0}</div>
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
