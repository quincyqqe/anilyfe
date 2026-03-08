'use client';
import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

export function SearchInput() {
  const isMacRef = useRef(false);

  useEffect(() => {
    isMacRef.current = /Mac|iPhone|iPad|iPod/i.test(navigator.platform ?? navigator.userAgent);
  }, []);

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const isMac = isMacRef.current;
      if (
        ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) &&
        (e.key === 'k' || e.key === '/') &&
        !e.repeat
      ) {
        e.preventDefault();
        triggerSearch();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const shortcut =
    typeof window !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/i.test(navigator.platform ?? navigator.userAgent)
      ? '⌘ K'
      : 'Ctrl K';

  return (
    <button
      type="button"
      onClick={triggerSearch}
      aria-label="Открыть поиск"
      className="hidden md:flex items-center gap-2 h-9 w-64 px-3 rounded-md border
        bg-[#1B1D1E] border-[#262626] text-white/30 text-sm
        cursor-pointer hover:bg-[#262626] transition-colors
        focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#262626]"
    >
      <Search size={16} className="shrink-0" aria-hidden="true" />
      <span className="flex-1 text-left">Поиск по AniLyfe...</span>
      <kbd className="ml-auto flex items-center gap-0.5 px-1.5 h-6 rounded border border-neutral-700 bg-neutral-900 text-xs text-neutral-400 font-mono tracking-wider">
        {shortcut}
      </kbd>
    </button>
  );
}
