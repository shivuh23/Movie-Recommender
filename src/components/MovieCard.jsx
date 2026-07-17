import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Info } from 'lucide-react';

const MovieCard = ({ title, genre, overview, isRecommendation = false }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className={`glass-card p-6 flex flex-col h-full gap-4 group transition-all duration-300 hover:bg-white/10 ${isRecommendation ? 'border-primary-500/30' : ''
                }`}
        >
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                    {title}
                </h3>
                {isRecommendation && (
                    <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Match
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {genre.split(', ').map((g) => (
                    <span key={g} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md border border-white/5">
                        {g}
                    </span>
                ))}
            </div>

            {overview && (
                <p className="text-slate-400 text-sm line-clamp-3 flex-grow">
                    {overview}
                </p>
            )}

            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span>8.5</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2h 15m</span>
                </div>
                <button className="ml-auto p-2 rounded-full bg-white/5 hover:bg-primary-500/20 text-slate-400 hover:text-primary-400 transition-all">
                    <Info className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default MovieCard;
