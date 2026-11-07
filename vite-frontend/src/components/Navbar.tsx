import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Play, Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import CommandSearch from './CommandSearch';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
      isScrolled ? "py-3 glass-nav" : "py-5 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
            <div className="w-4 h-4 rounded-sm bg-white" />
          </div>
          <span className="font-display text-2xl font-black tracking-tighter text-white">
            Yume<span className="text-brand">DB</span>
          </span>
        </Link>
          <div className="hidden md:flex flex-1 max-w-xl relative overflow-hidden group cursor-pointer" onClick={() => setIsSearchOpen(true)}>
            <div className="w-full bg-white/[0.03] border border-white/[0.05] rounded-full py-2.5 px-6 text-[10px] uppercase font-black tracking-widest text-gray-500 transition-all hover:bg-white/[0.08] hover:border-white/[0.1] flex items-center justify-between backdrop-blur-sm">
              <span>Search archives...</span>
              <kbd className="flex items-center gap-1 font-sans text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-gray-500">
                {isMac ? '⌘' : 'Ctrl'} K
              </kbd>
            </div>
          </div>

        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link to="/anime" className="hover:text-brand transition-colors text-[10px] font-black uppercase tracking-widest">Anime</Link>
            <Link to="/schedule" className="hover:text-brand transition-colors text-[10px] font-black uppercase tracking-widest">Schedule</Link>
            <Link to="/manga" className="hover:text-brand transition-colors text-[10px] font-black uppercase tracking-widest">Manga</Link>
            <Link to="/characters" className="hover:text-brand transition-colors text-[10px] font-black uppercase tracking-widest">Characters</Link>
            <Link to="/studios" className="hover:text-brand transition-colors text-[10px] font-black uppercase tracking-widest">Studios</Link>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-orange-400 border-2 border-white/10 cursor-pointer hover:scale-105 transition-transform" />
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-4">
          <button onClick={() => setIsSearchOpen(true)} className="text-gray-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-brand transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav mt-4 rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="p-6 flex flex-col gap-6">
              <Link to="/anime" className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Anime List</Link>
              <Link to="/schedule" className="text-sm font-bold text-zinc-100 uppercase tracking-widest text-brand">Daily Schedule</Link>
              <Link to="/manga" className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Manga Base</Link>
              <Link to="/characters" className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Characters</Link>
              <Link to="/people" className="text-sm font-bold text-zinc-100 uppercase tracking-widest">People</Link>
              <Link to="/studios" className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Studios</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
