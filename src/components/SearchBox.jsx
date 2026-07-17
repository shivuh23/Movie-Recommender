import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBox = ({ movieData, onSelect }) => {

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const wrapperRef = useRef(null);

    // Search Logic
    useEffect(() => {

        if (query.length > 1) {

            const filtered = movieData.filter(movie =>
                movie.title.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);

            setSuggestions(filtered);

            // If movie exists
            if (filtered.length > 0) {
                setIsOpen(true);
            }

            // If movie not found
            else {
                onSelect(null);
                setIsOpen(false);
            }

        } else {

            setSuggestions([]);
            setIsOpen(false);

        }

    }, [query, movieData, onSelect]);

    // Close dropdown when clicking outside
    useEffect(() => {

        function handleClickOutside(event) {

            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    // Movie selection
    const handleSelect = (movie) => {

        if (movie) {

            setQuery(movie.title);
            setIsOpen(false);

            onSelect(movie);

        } else {

            onSelect(null);

        }

    };

    // Clear search
    const handleClear = () => {

        setQuery('');
        setSuggestions([]);
        setIsOpen(false);

    };

    return (

        <div
            ref={wrapperRef}
            className="relative max-w-xl mx-auto z-40"
        >

            {/* Search Input */}
            <div className="relative group">

                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors pointer-events-none"
                />

                <input
                    type="text"
                    placeholder="Enter a movie you love..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-lg placeholder:text-slate-600"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length > 1 && suggestions.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                />

                {/* Clear Button */}
                {query && (

                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >

                        <X className="w-5 h-5" />

                    </button>

                )}

            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>

                {isOpen && suggestions.length > 0 && (

                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >

                        {suggestions.map((movie) => (

                            <li key={movie.id}>

                                <button
                                    onClick={() => handleSelect(movie)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex flex-col gap-0.5"
                                >

                                    <span className="text-white font-medium">
                                        {movie.title}
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        {movie.genre}
                                    </span>

                                </button>

                            </li>

                        ))}

                    </motion.ul>

                )}

            </AnimatePresence>

        </div>

    );

};

export default SearchBox;