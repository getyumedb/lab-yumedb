import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { jikanService } from '../services/jikanService';
import { Anime, Manga } from '../types';
import AnimeCard from '../components/AnimeCard';
import MangaCard from '../components/MangaCard';
import { Search, Sparkles, Trophy, BookOpen } from 'lucide-react';

interface SearchResultsProps {
  isTop?: boolean;
  isSeasonal?: boolean;
}

export default function SearchResults({ isTop: propTop, isSeasonal: propSeasonal }: SearchResultsProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('q') || '';
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  const isTop = propTop || location.pathname === '/top';
  const isSeasonal = propSeasonal || location.pathname === '/seasonal';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        if (isTop) {
          const res = await jikanService.getTopAnime();
          setAnimes(res.data);
          setMangas([]);
        } else if (isSeasonal) {
          const res = await jikanService.getSeasonNow();
          setAnimes(res.data);
          setMangas([]);
        } else if (query) {
          const [animeRes, mangaRes] = await Promise.all([
            jikanService.searchAnime(query),
            jikanService.searchManga(query)
          ]);
          setAnimes(animeRes.data);
          setMangas(mangaRes.data);
        } else {
          setAnimes([]);
          setMangas([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [query, isTop, isSeasonal]);

  const getTitle = () => {
    if (isTop) return { text: 'TOP ANIME', icon: <Trophy className="w-5 h-5 text-brand" />, sub: 'Higher Rated Titles' };
    if (isSeasonal) return { text: 'SEASONAL', icon: <Sparkles className="w-5 h-5 text-brand fill-current" />, sub: 'Airing this Season' };
    return { text: 'SEARCH', icon: <Search className="w-5 h-5 text-brand" />, sub: `Results for: "${query}"` };
  };

  const header = getTitle();

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-8 bg-brand rounded-full" />
               <h1 className="text-5xl md:text-7xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
                  {header.text}
               </h1>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">
              {isTop || isSeasonal ? header.sub : <span>SEARCHING FOR <span className="text-brand">"{query}"</span></span>}
            </p>
          </div>
          <div className="text-gray-600 font-black text-[10px] uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-xl border border-white/5">
            FOUND {animes.length + mangas.length} ENTRIES
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
             <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand border-t-transparent shadow-[0_0_20px_rgba(242,63,96,0.2)]" />
          </div>
        ) : (
          <div className="space-y-32">
            {/* Anime Results */}
            {animes.length > 0 && (
              <section>
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1 h-4 bg-brand rounded-full" />
                    <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase shrink-0">Anime Decoded [{animes.length}]</h2>
                    <div className="w-full h-px bg-white/5" />
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
                  {animes.map((anime, index) => (
                    <div key={`${anime.mal_id}-${index}`}>
                      <AnimeCard anime={anime} rank={(isTop || isSeasonal) ? index + 1 : undefined} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Manga Results */}
            {mangas.length > 0 && (
              <section>
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                    <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase shrink-0">Manga Volumes [{mangas.length}]</h2>
                    <div className="w-full h-px bg-white/5" />
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
                  {mangas.map((manga, index) => (
                    <div key={`${manga.mal_id}-${index}`}>
                      <MangaCard manga={manga} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {animes.length === 0 && mangas.length === 0 && (
               <div className="py-40 text-center space-y-8">
                  <div className="text-6xl grayscale opacity-20">😕</div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase">ARCHIVE EMPTY</h2>
                    <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium">Try searching for something else or broaden your criteria.</p>
                  </div>
                  <Link to="/" className="inline-block bg-white text-zinc-950 px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-brand hover:text-white transition-all">Back Home</Link>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
