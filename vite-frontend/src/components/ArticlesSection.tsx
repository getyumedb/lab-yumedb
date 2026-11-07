import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, User, ArrowUpRight } from 'lucide-react';
import { jikanService } from '../services/jikanService';
import { Review } from '../types';
import { Link } from 'react-router-dom';

export default function ArticlesSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await jikanService.getRecentReviews();
        setReviews(res.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="bg-zinc-950 py-32 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 text-center md:text-left">
           <div>
              <h2 className="text-5xl md:text-8xl font-display font-black text-white italic tracking-tighter leading-[0.85] uppercase mb-6">
                Critical <br /> Analysis
              </h2>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">In-depth reviews and industry essays</p>
           </div>
           <div className="hidden lg:flex items-center gap-12">
              <div className="flex flex-col items-center">
                 <div className="text-4xl font-display font-black text-white italic tracking-tighter">24K+</div>
                 <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-2">Annual Reviews</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex flex-col items-center">
                 <div className="text-4xl font-display font-black text-white italic tracking-tighter">98.4%</div>
                 <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-2">Accuracy Rate</div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           {reviews.map((review, index) => (
             <motion.div
               key={review.mal_id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.15 }}
               className="group relative bg-zinc-900/50 border border-white/5 rounded-[3rem] p-8 md:p-12 hover:bg-zinc-900 transition-all overflow-hidden"
             >
                <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                   <ArrowUpRight className="w-8 h-8 text-brand" />
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                   <div className="md:w-1/4">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand/20">
                            <img src={review.user.images.jpg.image_url} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <div className="text-xs font-black text-white uppercase tracking-tighter italic">{review.user.username}</div>
                            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Master Reviewer</div>
                         </div>
                      </div>
                      <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5">
                         <div className="text-[9px] font-black text-brand uppercase tracking-[0.2em] mb-3 italic">Calculated Score</div>
                         <div className="text-4xl font-display font-black text-white italic tracking-tighter">{review.score}/10</div>
                      </div>
                   </div>
                   
                   <div className="md:w-3/4 space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {review.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-400 text-lg font-medium leading-relaxed italic line-clamp-4 relative">
                         <span className="text-4xl text-brand absolute -left-8 -top-4 opacity-40 font-display">"</span>
                         {review.review}
                      </p>
                      <button className="pt-6 border-t border-white/5 w-full text-left flex items-center justify-between group/btn">
                         <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover/btn:text-white transition-colors">Access full dossier</span>
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-brand transition-all">
                            <BookOpen className="w-4 h-4 text-gray-500 group-hover/btn:text-white" />
                         </div>
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
