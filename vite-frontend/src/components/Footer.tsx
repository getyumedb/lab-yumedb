import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, Twitter, Mail, 
  ChevronRight, Sparkles, Newspaper, 
  Trophy, Users, Landmark, Film,
  Clock
} from 'lucide-react';
import { useHistory, HistoryItem } from '../hooks/useHistory';
import { SafeImage } from './SafeImage';

export default function Footer() {
  const { history } = useHistory();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 mt-auto relative z-[50]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Recent Visits section */}
        {history.length > 0 && (
          <div className="mb-24 space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-1 h-8 bg-brand rounded-full" />
                 <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Neural History: Temporal Frequencies</h3>
               </div>
               <div className="hidden md:flex items-center gap-2 text-[8px] font-black text-gray-600 uppercase tracking-widest italic">
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  Realtime Buffer Active
               </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4">
              {history.map((item: HistoryItem) => (
                <Link 
                  key={`${item.type}-${item.id}`} 
                  to={item.type === 'studio' ? `/studio/${item.id}` : `/${item.type}/${item.id}`}
                  className="group relative"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl group-hover:border-brand/60 transition-all">
                    <SafeImage src={item.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                       <div className="text-[8px] font-black text-white uppercase tracking-tighter line-clamp-1 italic bg-zinc-950/80 backdrop-blur-sm p-1 rounded-md border border-white/5">
                          {item.title}
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 relative z-10">
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center rotate-12 shadow-lg shadow-brand/40">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-2xl font-black text-white italic tracking-tighter uppercase">ANIVIBE</span>
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed italic max-w-xs">
              Navigating the vast neural network of global animation. Exploring patterns, frequencies, and the digital evolution of storytelling.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Github className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Mail className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* Core Archives */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic border-l-2 border-brand pl-4">Archives</h3>
            <ul className="space-y-4">
              <FooterLink to="/anime" label="Anime Database" icon={<Film className="w-3.5 h-3.5" />} />
              <FooterLink to="/schedule" label="Release Schedule" icon={<Clock className="w-3.5 h-3.5" />} />
              <FooterLink to="/manga" label="Manga Library" icon={<Newspaper className="w-3.5 h-3.5" />} />
              <FooterLink to="/top" label="Hall of Fame" icon={<Trophy className="w-3.5 h-3.5" />} />
              <FooterLink to="/season" label="Active Rotations" icon={<Sparkles className="w-3.5 h-3.5" />} />
            </ul>
          </div>

          {/* Social Matrix */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic border-l-2 border-brand pl-4">Ecosystem</h3>
            <ul className="space-y-4">
              <FooterLink to="/characters" label="Character Bios" icon={<Users className="w-3.5 h-3.5" />} />
              <FooterLink to="/studios" label="Industry Titans" icon={<Landmark className="w-3.5 h-3.5" />} />
              <FooterLink to="/community" label="Global Comm" icon={<Users className="w-3.5 h-3.5" />} />
              <FooterLink to="/news" label="Neural Updates" icon={<Newspaper className="w-3.5 h-3.5" />} />
            </ul>
          </div>

          {/* System Status */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic border-l-2 border-brand pl-4">System Details</h3>
            <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">API Status</span>
                <span className="text-green-500 flex items-center gap-1.5 font-bold italic">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Synchronized
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Latency</span>
                <span className="text-white italic">24ms</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Core Engine</span>
                <span className="text-brand italic font-bold">JIKAN v4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
            © 2026 ANIVIBE MULTIVERSE INTERFACE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
            <Link to="/tos" className="hover:text-white transition-colors">Security Protocol</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Matrix</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Data Nodes</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href} 
      className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-brand hover:text-white hover:border-brand transition-all shadow-xl"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="flex items-center gap-3 text-gray-500 hover:text-white group transition-all">
        <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center text-gray-700 group-hover:text-brand group-hover:bg-brand/10 transition-all">
          {icon}
        </div>
        <span className="text-sm font-bold uppercase tracking-tighter italic">{label}</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand" />
      </Link>
    </li>
  );
}
