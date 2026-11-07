import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Film, User, Users, Landmark, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jikanService } from '../services/jikanService';
import { Anime, Character, Person, Studio, Manga } from '../types';
import { cn } from '../lib/utils';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'anime' | 'manga' | 'characters' | 'people' | 'studios';

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('anime');
  const [results, setResults] = useState<{
    anime: Anime[];
    manga: Manga[];
    characters: Character[];
    people: Person[];
    studios: Studio[];
  }>({
    anime: [],
    manga: [],
    characters: [],
    people: [],
    studios: [],
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({ anime: [], manga: [], characters: [], people: [], studios: [] });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 3) {
      setResults({ anime: [], manga: [], characters: [], people: [], studios: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [anime, manga, chars, people, studios] = await Promise.all([
          jikanService.searchAnime(query),
          jikanService.searchManga(query),
          jikanService.searchCharacters(query),
          jikanService.searchPeople(query),
          jikanService.searchStudios(query),
        ]);

        setResults({
          anime: anime.data.slice(0, 5),
          manga: manga.data.slice(0, 5),
          characters: chars.data.slice(0, 5),
          people: people.data.slice(0, 5),
          studios: studios.data.slice(0, 5),
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'anime', label: 'Anime', icon: Film },
    { id: 'manga', label: 'Manga', icon: BookOpen },
    { id: 'characters', label: 'Characters', icon: User },
    { id: 'people', label: 'People', icon: Users },
    { id: 'studios', label: 'Studios', icon: Landmark },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="relative">
              <Search className="absolute left-6 top-6 text-gray-500 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full bg-transparent border-b border-white/5 py-6 pl-16 pr-16 text-lg text-white focus:outline-none placeholder:text-gray-600 font-medium"
              />
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex bg-zinc-950/50 border-b border-white/5 px-4 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all relative shrink-0",
                    activeTab === tab.id ? "text-brand" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest">Searching Records...</span>
                </div>
              ) : query.length < 3 ? (
                <div className="py-20 text-center text-gray-600">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-medium uppercase tracking-widest italic">Enter at least 3 characters</p>
                </div>
              ) : results[activeTab].length > 0 ? (
                <div className="space-y-1">
                  {results[activeTab].map((item: any) => (
                    <div
                      key={item.mal_id}
                      onClick={() => handleSelect(`/${activeTab === 'anime' ? 'anime' : activeTab === 'manga' ? 'manga' : activeTab === 'characters' ? 'character' : activeTab === 'people' ? 'person' : 'studio'}/${item.mal_id}`)}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/5 bg-zinc-950 shrink-0">
                        <img
                          src={item.images?.webp?.image_url || item.images?.jpg?.image_url}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt=""
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-200 group-hover:text-brand transition-colors line-clamp-1 italic uppercase tracking-tighter">
                          {item.title || item.name}
                        </div>
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">
                          {activeTab === 'anime' ? `${item.type} • ${item.year || 'TBA'}` :
                           activeTab === 'manga' ? `${item.type} • ${item.status}` :
                           activeTab === 'characters' ? `Favorites: ${item.favorites}` :
                           activeTab === 'studios' ? `Established Studio` :
                           'Voice Actor / Staff'}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-800" />
                    </div>
                  ))}
                  <button 
                    onClick={() => handleSelect(`/search?q=${query}`)}
                    className="w-full mt-2 py-3 text-[10px] font-black text-brand uppercase tracking-widest hover:bg-brand/10 rounded-xl transition-all"
                  >
                    View All Results for "{query}"
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center text-gray-600">
                  <p className="text-sm font-medium uppercase tracking-widest italic">No {activeTab} matches found</p>
                </div>
              )}
            </div>
            
            <div className="bg-zinc-950 px-6 py-4 flex items-center justify-between border-t border-white/5">
              <div className="flex items-center gap-4 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-white/10 text-gray-500">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-white/10 text-gray-500">↵</kbd> Select</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-white/10 text-gray-500">esc</kbd> Close</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-widest">
                <div className="w-1 h-1 rounded-full bg-brand" />
                Live Index
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
