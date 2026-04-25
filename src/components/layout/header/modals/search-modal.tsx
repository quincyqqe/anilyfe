'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Search, AlertCircle, RotateCcw } from 'lucide-react';
import debounce from 'lodash.debounce';
import { fetchSearch } from '@/shared/api/search';
import { Anime } from '@/shared/types/anime';
import { SearchResultCard } from '../search/search-card';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchModalProps {
  isSearchModalOpen: boolean;
  toggleSearchModal: () => void;
}

function SearchEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="py-24 flex flex-col items-center justify-center gap-3 text-center select-none"
    >
      <div className="relative flex items-center justify-center w-20 h-20 mb-2">
        <div className="absolute inset-0 rounded-full  blur-xl mix-blend-screen" />
        <Sparkles size={32} className="text-indigo-400 relative z-10" />
      </div>
      <h3 className="text-lg font-medium tracking-wide text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">{description}</p>
    </motion.div>
  );
}

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export default function SearchModal({ isSearchModalOpen, toggleSearchModal }: SearchModalProps) {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedFetch = useRef(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setStatus('idle');
        return;
      }

      setStatus('loading');

      try {
        const data = await fetchSearch(q.trim());
        setResults(data ?? []);
        setStatus('success');
      } catch {
        setResults([]);
        setStatus('error');
      }
    }, 400),
  ).current;

  useEffect(() => {
    debouncedFetch(value);
    return () => debouncedFetch.cancel();
  }, [value]);

  useEffect(() => {
    if (!isSearchModalOpen) {
      debouncedFetch.cancel();
      setValue('');
      setResults([]);
      setStatus('idle');
    } else {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchModalOpen]);

  // Handle global escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchModalOpen) toggleSearchModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, toggleSearchModal]);

  const handleClear = () => {
    setValue('');
    setResults([]);
    setStatus('idle');
    inputRef.current?.focus();
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-sm animate-pulse" />
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          </div>
          <p className="text-sm text-zinc-500 tracking-wide font-medium">Ищем аниме...</p>
        </motion.div>
      );
    }

    if (status === 'error') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 flex flex-col items-center justify-center gap-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-zinc-100 mb-1">Ошибка поиска</h3>
            <p className="text-sm text-zinc-500">Не удалось выполнить запрос через нейросети.</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all duration-300 active:scale-95"
          >
            <RotateCcw size={14} />
            Попробовать снова
          </button>
        </motion.div>
      );
    }

    if (status === 'success' && results.length === 0) {
      return (
        <SearchEmptyState
          title="Ничего не найдено"
          description="Попробуйте изменить запрос или использовать другие ключевые слова."
        />
      );
    }

    if (results.length > 0) {
      return (
        <motion.ul
          className="space-y-3 pb-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {results.map((anime) => (
            <motion.div
              key={anime.alias}
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SearchResultCard anime={anime} onClick={toggleSearchModal} />
            </motion.div>
          ))}
        </motion.ul>
      );
    }

    return (
      <SearchEmptyState
        title="Что будем смотреть?"
        description="Введите название аниме, фильма или OVA."
      />
    );
  };

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(2px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black/40"
            onClick={toggleSearchModal}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl rounded-[24px] bg-black/40 border border-white/10 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Spotlight effect behind the search bar */}
            {/* <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 via-purple-500/5 to-transparent pointer-events-none" /> */}

            {/* Header / Input Area */}
            <div className="relative flex items-center gap-4 px-6 py-5 border-b border-white/6">
              <Search size={22} className="shrink-0 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Поиск по AniLyfe..."
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 text-lg font-medium tracking-wide focus:outline-none"
              />

              <AnimatePresence>
                {value && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={handleClear}
                    aria-label="Очистить"
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-200"
                  >
                    <X size={16} className="text-zinc-400" />
                  </motion.button>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={toggleSearchModal}
                className="px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-white/5 text-zinc-400 hover:text-zinc-200 text-xs font-semibold tracking-wider font-mono transition-all duration-200 active:scale-95"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="relative overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar">
              <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#09090b]/80 to-transparent pointer-events-none rounded-b-[24px]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
