'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { getStatusCounts, getVisibleAnimeList } from '../../model/anime-list/helpers';
import type { FilterKey, SortKey, ViewMode } from '../../model/anime-list/types';
import { AnimeListEmptyState } from './anime-list-empty-state';
import { AnimeListRow } from './anime-list-row';
import { AnimeListToolbar } from './anime-list-toolbar';
import { ProfileAnimeCard } from './anime-list-card';

export function AnimeList({ animeList }: { animeList: UserAnimeEntry[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeSort, setActiveSort] = useState<SortKey>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const counts = useMemo(() => getStatusCounts(animeList), [animeList]);
  const visibleAnime = useMemo(
    () => getVisibleAnimeList(animeList, activeFilter, activeSort),
    [animeList, activeFilter, activeSort],
  );

  return (
    <section aria-label="Библиотека аниме" className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
            Your collection
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Библиотека
          </h2>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {visibleAnime.length} из {animeList.length}
        </p>
      </div>
      <AnimeListToolbar
        activeFilter={activeFilter}
        activeSort={activeSort}
        counts={counts}
        viewMode={viewMode}
        onFilterChange={setActiveFilter}
        onSortChange={setActiveSort}
        onViewModeChange={setViewMode}
      />
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key={`grid-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {visibleAnime.length === 0 ? (
              <AnimeListEmptyState filter={activeFilter} />
            ) : (
              visibleAnime.map((anime) => <ProfileAnimeCard key={anime.id} anime={anime} />)
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`list-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1.5"
          >
            {visibleAnime.length === 0 ? (
              <AnimeListEmptyState filter={activeFilter} />
            ) : (
              visibleAnime.map((anime) => <AnimeListRow key={anime.id} anime={anime} />)
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
