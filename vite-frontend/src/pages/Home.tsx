import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jikanService } from '../services/jikanService';
import { Anime, Character, Studio, Manga } from '../types';
import HeroSlider from '../components/HeroSlider';
import AnimeCard from '../components/AnimeCard';
import ScheduleBoard from '../components/ScheduleBoard';
import BannerExtension from '../components/BannerExtension';
import { ChevronRight, Sparkles, TrendingUp, Trophy, Users2, Heart, Landmark, Star, Plus, Film, Users, LayoutGrid, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import NewsSection from '../components/NewsSection';
import ArticlesSection from '../components/ArticlesSection';
import InternalArticlesSection from '../components/InternalArticlesSection';
import { GridSkeleton } from '../components/Skeleton';
import { SafeImage } from '../components/SafeImage';

export default function Home() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [trendingCharacters, setTrendingCharacters] = useState<Character[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [topManga, setTopManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [top, seasonal, chars, stds, manga] = await Promise.all([
          jikanService.getTopAnime(),
          jikanService.getSeasonNow(),
          jikanService.getTopCharacters(),
          jikanService.getTopStudios(),
          jikanService.getTopManga()
        ]);
        setTopAnime(top.data);
        setSeasonalAnime(seasonal.data);
        setTrendingCharacters(chars.data.slice(0, 6));
        setStudios(stds.data.slice(0, 4));
        setTopManga(manga.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="space-y-20">
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="h-10 w-64 bg-zinc-800 animate-pulse rounded-xl" />
              <div className="h-6 w-32 bg-zinc-800 animate-pulse rounded-xl" />
            </div>
            <GridSkeleton />
          </div>
          <div className="space-y-12">
             <div className="h-10 w-64 bg-zinc-800 animate-pulse rounded-xl" />
             <GridSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <HeroSlider animes={topAnime.slice(0, 5)} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 mt-12 md:mt-[-80px] relative z-10">
        {/* Airing Now Section */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white italic tracking-tighter leading-none flex items-center gap-4 uppercase">
                 <div className="w-1.5 h-10 bg-brand rounded-full" />
                 Currently Airing
              </h2>
              <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] mt-3 ml-6">Seasonal broadcasts in rotation</p>
            </div>
            <Link to="/anime" className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
               <span className="text-[10px] font-black uppercase tracking-widest italic">View Season</span>
               <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {seasonalAnime.slice(0, 6).map((anime, idx) => (
              <div key={`${anime.mal_id}-${idx}`}>
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        </section>

        <BannerExtension />

        <section>
          <ScheduleBoard />
        </section>

        {/* Trending Characters */}
        <section className="bg-zinc-900 rounded-[3rem] p-8 md:p-14 border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand/5 to-transparent pointer-events-none" />
           <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
              <div className="lg:w-1/3 space-y-8">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 rounded-full text-brand text-[10px] font-black italic uppercase tracking-[0.3em]">
                    <Users2 className="w-3.5 h-3.5" />
                    Identity Matrix
                 </div>
                 <h2 className="text-5xl md:text-7xl font-display font-black text-white italic tracking-[0.02em] leading-[0.85] uppercase">
                    Legendary <br /> Archetypes
                 </h2>
                 <p className="text-gray-500 text-sm leading-relaxed max-w-sm italic">
                   The most influential characters currently trending across the global archives.
                 </p>
                 <Link 
                   to="/characters"
                   className="inline-flex items-center gap-4 bg-white text-zinc-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-2xl"
                 >
                   Population Data
                   <ChevronRight className="w-5 h-5" />
                 </Link>
              </div>
              <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-6">
                {trendingCharacters.slice(0, 6).map((char, idx) => (
                   <Link key={`${char.mal_id}-${idx}`} to={`/character/${char.mal_id}`} className="group">
                      <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] border border-white/5 bg-zinc-950 shadow-2xl">
                         <SafeImage src={char.images.webp.image_url} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="" />
                         <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent">
                            <h3 className="text-sm font-display font-black text-white italic tracking-tighter truncate uppercase group-hover:text-brand transition-colors">{char.name}</h3>
                            <div className="flex items-center gap-2 mt-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                               <Heart className="w-3 h-3 fill-brand text-brand" />
                               {char.favorites.toLocaleString()}
                            </div>
                         </div>
                      </div>
                   </Link>
                ))}
              </div>
           </div>
        </section>

        <section>
           <NewsSection />
        </section>

        <section>
           <InternalArticlesSection />
        </section>

        {/* Trending Manga */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white italic tracking-tighter leading-none flex items-center gap-4 uppercase">
                 <div className="w-1.5 h-10 bg-brand rounded-full" />
                 Manga Selection
              </h2>
              <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] mt-3 ml-6">Graphic literature currently in orbit</p>
            </div>
            <Link to="/manga" className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
               <span className="text-[10px] font-black uppercase tracking-widest italic">Open Library</span>
               <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topManga.map((manga, idx) => (
              <Link key={`${manga.mal_id}-${idx}`} to={`/manga/${manga.mal_id}`} className="group">
                <div className="relative aspect-[3/4.5] rounded-3xl overflow-hidden border border-white/5 bg-zinc-950 shadow-2xl mb-4">
                   <SafeImage src={manga.images.webp.large_image_url || manga.images.jpg.large_image_url} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                   <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/5 flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-brand fill-brand" />
                      <span className="text-[10px] font-black text-white italic">{manga.score || 'N/A'}</span>
                   </div>
                </div>
                <h3 className="text-xs font-display font-black text-white italic tracking-tighter uppercase group-hover:text-brand transition-colors line-clamp-1">{manga.title}</h3>
                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1 italic">{manga.type}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-zinc-950 md:-mx-12 lg:-mx-24 rounded-[4rem] px-12 md:px-24 mt-40 pt-16">
           <ArticlesSection />
        </section>

        {/* Top Studios */}
        <section>
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white italic tracking-tighter leading-none flex items-center gap-4 uppercase">
                 <div className="w-1.5 h-10 bg-brand rounded-full" />
                 Industry Titans
              </h2>
              <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] mt-3 ml-6">Leading production studios globally</p>
            </div>
            <Link to="/studios" className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
               <span className="text-[10px] font-black uppercase tracking-widest italic">All Studios</span>
               <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studios.map((studio, idx) => (
              <Link key={`${studio.mal_id}-${idx}`} to={`/studio/${studio.mal_id}`} className="group relative bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 hover:bg-zinc-800 transition-all flex flex-col items-center text-center overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand/10 transition-colors" />
                 
                 <div className="w-24 h-24 bg-white rounded-3xl p-5 flex items-center justify-center shadow-2xl relative z-10 group-hover:rotate-3 transition-transform mb-8">
                    <SafeImage src={studio.images.jpg.image_url} alt={studio.name} className="max-w-full max-h-full object-contain" />
                 </div>
                 
                 <div className="relative z-10 w-full space-y-4">
                    <div>
                       <div className="text-[8px] font-black text-brand uppercase tracking-[0.3em] italic mb-1">Production Unit</div>
                       <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase group-hover:text-brand transition-colors leading-none break-words min-h-[1.5em] flex items-center justify-center">
                          {studio.name}
                       </h3>
                    </div>
                    
                    <div className="flex items-center justify-center gap-6 text-[9px] font-black text-gray-500 uppercase tracking-widest italic pt-6 border-t border-white/5">
                       <div className="flex items-center gap-1.5">
                          <Heart className="w-3 h-3 text-brand fill-brand" />
                          <span>{studio.favorites?.toLocaleString()}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Film className="w-3 h-3" />
                          <span>{studio.count || 0}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                       <ChevronRight className="w-4 h-4" />
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Rated Highlight */}
        <section className="bg-zinc-900 rounded-[3rem] p-8 md:p-14 border border-white/5">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/3 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 rounded-full text-brand text-[10px] font-black italic uppercase tracking-widest">
                   <Trophy className="w-3.5 h-3.5" />
                   Masterpieces
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter leading-tight uppercase">
                  Global Hall <br /> of Fame.
                </h2>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
                  Discover the most critically acclaimed series of all time, ranked by millions of users worldwide.
                </p>
                <Link 
                  to="/top"
                  className="inline-block bg-white text-zinc-950 px-8 py-3 rounded-xl font-bold text-sm hover:bg-brand hover:text-white transition-all shadow-2xl"
                >
                  Explore Rankings
                </Link>
              </div>
              <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {topAnime.slice(5, 9).map((anime, i) => (
                  <div key={`${anime.mal_id}-${i}`} className={cn("mt-0", i % 2 === 1 && "md:mt-12")}>
                    <AnimeCard anime={anime} rank={i + 6} />
                  </div>
                ))}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
