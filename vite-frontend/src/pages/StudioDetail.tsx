import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jikanService } from '../services/jikanService';
import { Studio, Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import { Landmark, Trophy } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

import { useHistory } from '../hooks/useHistory';

export default function StudioDetail() {
  const { id } = useParams();
  const { addToHistory } = useHistory();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [studioRes, animeRes] = await Promise.all([
          jikanService.getStudioById(Number(id)),
          jikanService.getStudioAnime(Number(id)),
        ]);
        setStudio(studioRes.data);
        
        // Add to history
        if (studioRes.data) {
          addToHistory({
            id: studioRes.data.mal_id,
            type: 'studio',
            title: studioRes.data.name,
            image: studioRes.data.images.jpg.image_url
          });
        }

        setAnimes(animeRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-40 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-brand border-t-transparent" /></div>;
  if (!studio) return <div className="pt-40 text-center">Studio not found</div>;

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-12 mb-20 border-b border-white/5 pb-16 text-center md:text-left">
          <div className="w-40 h-40 bg-white rounded-[2rem] p-6 flex items-center justify-center shrink-0 shadow-2xl relative">
             <div className="absolute inset-0 bg-brand/5 rounded-[2rem] blur-xl opacity-50" />
             <SafeImage src={studio.images.jpg.image_url} alt={studio.name} className="max-w-full max-h-full object-contain relative z-10" />
          </div>
          <div className="flex-1 space-y-6">
             <div className="flex items-center justify-center md:justify-start gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full w-fit text-[10px] font-black text-gray-500 uppercase tracking-widest italic mx-auto md:mx-0">
               <Landmark className="w-3 h-3" />
               Studio Profile
             </div>
             <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.85] italic uppercase">
               {studio.name}
             </h1>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-12">
                <div className="flex items-center gap-3">
                   <div className="text-3xl font-display font-black text-white italic tracking-tighter">
                      {studio.favorites.toLocaleString()}
                   </div>
                   <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Global <br /> Favorites</div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-3xl font-display font-black text-white italic tracking-tighter">
                      {animes.length}
                   </div>
                   <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Produced <br /> Titles</div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-1 space-y-12">
             <section>
                <h3 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                   <span className="w-8 h-px bg-brand" />
                   About
                </h3>
                <p className="text-gray-400 leading-relaxed font-medium bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5">
                  {studio.about || "This studio has produced numerous influential anime titles over the years, contributing significantly to the global anime landscape."}
                </p>
             </section>
          </div>

          <div className="md:col-span-3">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-8 bg-brand rounded-full" />
              <div>
                <h2 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">Production Library</h2>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">Archives & Masterpieces</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {animes.slice(0, 24).map((anime, index) => (
                <div key={`${anime.mal_id}-${index}`}>
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
