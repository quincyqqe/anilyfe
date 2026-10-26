'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Search, AlertCircle, RotateCcw } from 'lucide-react';
import debounce from 'lodash.debounce';

import { fetchSearch } from '@/shared/api/search';
import { Anime } from '@/shared/types/anime';
import { cn } from '@/lib/utils/cn';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { SearchCard } from './search-card';

interface SearchModalProps {
  isSearchModalOpen: boolean;
  toggleSearchModal: () => void;
}

function SearchEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-3 text-center select-none">
      <div className="relative flex items-center justify-center w-20 h-20 mb-2">
        <div className="absolute inset-0 rounded-full mix-blend-screen" />
        <Sparkles size={32} className="text-indigo-400 relative z-10" />
      </div>
      <h3 className="text-lg font-medium tracking-wide text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export function SearchModal({ isSearchModalOpen, toggleSearchModal }: SearchModalProps) {
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
  }, [value, debouncedFetch]);

  useEffect(() => {
    if (isSearchModalOpen) {
      setValue('');
      setResults([]);
      setStatus('idle');
    }
  }, [isSearchModalOpen]);

  const handleClear = () => {
    setValue('');
    setResults([]);
    setStatus('idle');
    inputRef.current?.focus();
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-pulse" />
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          </div>
          <p className="text-sm text-zinc-500 tracking-wide font-medium">Ищем аниме...</p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
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
        </div>
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
        <ul className="flex flex-col gap-3 pb-4">
          {results.map((anime) => (
            <SearchCard key={anime.alias} anime={anime} onClick={toggleSearchModal} />
          ))}
        </ul>
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
    <Dialog
      open={isSearchModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          debouncedFetch.cancel();
          toggleSearchModal();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        initialFocus={inputRef}
        className="top-[10vh] translate-y-0 flex flex-col gap-0 overflow-hidden p-0 max-h-[80vh] rounded-[24px] bg-black/70 ring-white/10 backdrop-blur-sm duration-200 sm:max-w-3xl"
      >
        <DialogTitle className="sr-only">Поиск по AniLyfe</DialogTitle>

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

          <button
            type="button"
            onClick={handleClear}
            aria-label="Очистить"
            aria-hidden={!value}
            tabIndex={value ? 0 : -1}
            className={cn(
              'w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200',
              value ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-75',
            )}
          >
            <X size={16} className="text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={toggleSearchModal}
            className="px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-white/5 text-zinc-400 hover:text-zinc-200 text-xs font-semibold tracking-wider font-mono transition-all duration-200 active:scale-95"
          >
            ESC
          </button>
        </div>

        <div className="relative min-h-0 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar">
          {renderContent()}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#09090b]/80 to-transparent rounded-b-[24px]" />
      </DialogContent>
    </Dialog>
  );
}
