import { Download, Chrome, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BannerExtension() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/5 p-8 md:p-14 shadow-2xl group">
      {/* Subtle Background Accents */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand/5 rounded-full blur-[120px] group-hover:bg-brand/10 transition-colors duration-1000" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand/[0.02] rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-brand/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-brand mb-6 border border-brand/20 uppercase tracking-widest italic"
          >
            YumeDB Cloud Companion
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-[0.9] tracking-tighter mb-6 italic uppercase">
            TRACK DIRECTLY <br /> <span className="text-brand">FROM BROWSER.</span>
          </h2>
          <p className="text-gray-400 text-sm mb-10 max-w-md leading-relaxed font-medium">
            Sync your watchlist automatically on 50+ anime streaming sites with our lightweight browser companion.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button className="bg-zinc-100 text-zinc-950 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 hover:bg-brand hover:text-white active:scale-95 shadow-xl shadow-black/40">
              Sync Data Uplink
            </button>
            <div className="flex items-center gap-4 px-4 opacity-50">
              <Chrome className="w-5 h-5 text-gray-500" />
              <div className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">v2.4 Live</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative hidden lg:block max-w-sm">
          <motion.div 
            initial={{ rotate: -5, y: 20 }}
            whileInView={{ rotate: -2, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-zinc-950 rounded-2xl border border-white/20 shadow-2xl p-6"
          >
             <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center">
                   <div className="w-4 h-4 rounded-sm bg-brand" />
                </div>
                <div className="flex-1">
                   <div className="h-2 w-24 bg-white/10 rounded mb-1.5" />
                   <div className="h-1.5 w-16 bg-white/5 rounded" />
                </div>
             </div>
             <div className="space-y-4">
                <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5" />
                <div className="flex justify-between items-center">
                   <div className="h-6 w-20 bg-brand/20 rounded-lg" />
                   <div className="h-6 w-12 bg-white/5 rounded-lg" />
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
