import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jikanService } from '../services/jikanService';
import { Person, Anime, Character } from '../types';
import { Heart, Mic2, Star } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

import { useHistory } from '../hooks/useHistory';

export default function PersonDetail() {
  const { id } = useParams();
  const { addToHistory } = useHistory();
  const [person, setPerson] = useState<Person | null>(null);
  const [voices, setVoices] = useState<{ character: Character; anime: Anime; role: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [personRes, voiceRes] = await Promise.all([
          jikanService.getPersonById(Number(id)),
          jikanService.getPersonVoices(Number(id)),
        ]);
        setPerson(personRes.data);
        
        // Add to history
        if (personRes.data) {
          addToHistory({
            id: personRes.data.mal_id,
            type: 'person',
            title: personRes.data.name,
            image: personRes.data.images.jpg.image_url
          });
        }

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
  if (!person) return <div className="pt-40 text-center">Person not found</div>;

  return (
    <div className="pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0C]" />
        <img 
          src={person.images.jpg.image_url} 
          alt="" 
          className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <div className="md:w-1/3">
             <div className="sticky top-32 space-y-10">
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                   <img src={person.images.jpg.image_url} className="w-full aspect-square object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute bottom-6 left-6 right-6 bg-zinc-950/80 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/5">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Fans Favorite</div>
                      <div className="text-xl font-display font-black text-white italic tracking-tighter flex items-center gap-2">
                         <Heart className="w-5 h-5 fill-brand text-brand" />
                         {person.favorites.toLocaleString()}
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                      <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Birthday</h3>
                      <p className="text-sm font-bold text-white tracking-widest uppercase italic">{new Date(person.birthday).toLocaleDateString()}</p>
                   </div>
                   {person.alternate_names?.length > 0 && (
                      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Also Known As</h3>
                        <div className="flex flex-wrap gap-2">
                          {person.alternate_names.map((n, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400 font-bold border border-white/5">{n}</span>
                          ))}
                        </div>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Main Info */}
          <div className="md:w-2/3 space-y-20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 rounded-full text-brand text-[10px] font-black italic uppercase tracking-widest mb-6">
                 Staff Member
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-8 leading-[0.85] tracking-tighter italic uppercase">
                {person.name}
              </h1>
              <div className="text-gray-400 leading-relaxed text-sm md:text-base bg-zinc-900/10 p-8 rounded-[2rem] border border-white/5 line-clamp-[12]">
                {person.about}
              </div>
            </div>

            <section>
               <h2 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                 <span className="w-8 h-px bg-brand" />
                 Voice Profile
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voices.map((v, index) => (
                  <div key={index} className="flex bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden group hover:bg-zinc-900 transition-all">
                    <Link to={`/character/${v.character.mal_id}`} className="w-20 overflow-hidden shrink-0 relative border-r border-white/5">
                       <img src={v.character.images.webp.small_image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </Link>
                    <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                       <div className="mb-2">
                         <Link to={`/character/${v.character.mal_id}`} className="text-sm font-black text-gray-200 block hover:text-brand transition-colors uppercase tracking-tight italic">{v.character.name}</Link>
                         <div className="text-[10px] font-black text-brand/60 uppercase tracking-widest">{v.role}</div>
                       </div>
                       <Link to={`/anime/${v.anime.mal_id}`} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors truncate uppercase tracking-widest">
                         {v.anime.title}
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
