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

interface AnimeListProps {
  animeList: UserAnimeEntry[];
}

export function AnimeList({ animeList }: AnimeListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeSort, setActiveSort] = useState<SortKey>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const counts = useMemo(() => getStatusCounts(animeList), [animeList]);
  const visibleAnime = useMemo(
    () => getVisibleAnimeList(animeList, activeFilter, activeSort),
    [animeList, activeFilter, activeSort],
  );

  console.log(animeList);
  return (
    <div>
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
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {visibleAnime.length === 0 ? (
                <AnimeListEmptyState filter={activeFilter} />
              ) : (
                visibleAnime.map((anime) => <ProfileAnimeCard key={anime.id} anime={anime} />)
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key={`list-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col divide-y divide-white/[0.05]"
          >
            <AnimatePresence>
              {visibleAnime.length === 0 ? (
                <AnimeListEmptyState filter={activeFilter} />
              ) : (
                visibleAnime.map((anime) => <AnimeListRow key={anime.id} anime={anime} />)
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
