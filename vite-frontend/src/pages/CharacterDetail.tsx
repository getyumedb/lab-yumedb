import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jikanService } from '../services/jikanService';
import { Character, Anime, Person } from '../types';
import { Star, Heart, Calendar, ChevronRight } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

import { useHistory } from '../hooks/useHistory';

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
      <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-black text-white italic tracking-tighter">{value}</div>
    </div>
  );
}

export default function CharacterDetail() {
  const { id } = useParams();
  const { addToHistory } = useHistory();
  const [character, setCharacter] = useState<Character | null>(null);
  const [animeList, setAnimeList] = useState<{ role: string; anime: Anime }[]>([]);
  const [voices, setVoices] = useState<{ language: string; person: Person }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [charRes, animeRes, voiceRes] = await Promise.all([
          jikanService.getCharacterById(Number(id)),
          jikanService.getCharacterAnime(Number(id)),
          jikanService.getCharacterVoices(Number(id)),
        ]);
        setCharacter(charRes.data);
        
        // Add to history
        if (charRes.data) {
          addToHistory({
            id: charRes.data.mal_id,
            type: 'character',
            title: charRes.data.name,
            image: charRes.data.images.webp.image_url
          });
        }

        setAnimeList(animeRes.data);
        setVoices(voiceRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-40 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-brand border-t-transparent" /></div>;
  if (!character) return <div className="pt-40 text-center">Character not found</div>;

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <img 
          src={character.images.webp.image_url} 
          alt="" 
          className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <div className="md:w-1/3">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="md:sticky md:top-32 space-y-10"
            >
               <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group shadow-brand/10">
                  <SafeImage src={character.images.webp.image_url} className="w-full aspect-[3/4] object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute top-6 right-6 bg-brand px-4 py-1.5 rounded-xl flex items-center gap-2 font-black text-white shadow-xl italic text-xs tracking-tighter">
                     <Heart className="w-3.5 h-3.5 fill-current" />
                     {character.favorites.toLocaleString()}
                  </div>
               </div>
               
               <div className="space-y-8">
                  <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Neural Identity</h3>
                    <p className="text-2xl font-display font-black text-white italic tracking-tighter leading-none">{character.name_kanji}</p>
                    {character.nicknames.length > 0 && (
                       <div className="mt-6 pt-6 border-t border-white/5">
                          <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-3">Codenames</div>
                          <div className="flex flex-wrap gap-2">
                             {character.nicknames.map((n, i) => (
                               <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400 font-bold border border-white/5">{n}</span>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <StatBox label="Registry" value={`#${character.mal_id}`} />
                    <StatBox label="Favorites" value={character.favorites.toLocaleString()} />
                  </div>

                  <button className="w-full bg-white text-zinc-950 py-4 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-brand hover:text-white transition-all shadow-xl shadow-white/5">
                     SYNC DATA CLOUD
                  </button>
               </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 space-y-20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 rounded-full text-brand text-[10px] font-black italic uppercase tracking-widest mb-6">
                 Neural Frequency 0.231
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-8 leading-[0.85] tracking-tighter italic uppercase">
                {character.name}
              </h1>
              
              <div className="space-y-12">
                <section>
                   <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-brand" />
                      Biostatus Matrix
                   </h2>
                   <div className="text-gray-400 leading-relaxed whitespace-pre-line text-lg font-medium max-w-2xl bg-zinc-900/10 p-8 rounded-[2rem] border border-white/5 italic">
                     {character.about || 'Biological data encrypted or unavailable.'}
                   </div>
                </section>
              </div>
            </div>

            <section>
              <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                 <span className="w-8 h-px bg-brand" />
                 Appearances
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {animeList.map((item, index) => (
                  <Link 
                    key={index} 
                    to={`/anime/${item.anime.mal_id}`}
                    className="flex gap-5 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 hover:bg-zinc-900 transition-all group items-center"
                  >
                     <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-zinc-950 group-hover:border-brand/40 transition-colors">
                       <SafeImage src={item.anime.images.webp.image_url} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                       <div className="text-sm font-black text-gray-200 group-hover:text-brand transition-colors line-clamp-1 italic uppercase tracking-tighter">{item.anime.title}</div>
                       <div className="text-[10px] font-black text-brand/60 uppercase mt-1 tracking-widest">{item.role}</div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-800" />
                  </Link>
                ))}
              </div>
            </section>

            <section>
               <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                 <span className="w-8 h-px bg-brand" />
                 Voice Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voices.map((v, index) => (
                  <Link 
                    key={index} 
                    to={`/person/${v.person.mal_id}`}
                    className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 hover:bg-zinc-900 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/5 shrink-0 bg-zinc-950 group-hover:border-brand/40 transition-colors">
                       <SafeImage src={v.person.images.jpg.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black text-gray-200 group-hover:text-brand transition-colors italic uppercase tracking-tighter">{v.person.name}</div>
                      <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">{v.language}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-800" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
