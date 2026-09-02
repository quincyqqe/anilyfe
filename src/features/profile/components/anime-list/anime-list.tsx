'use client';

import { useMemo, useState } from 'react';
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

  return (
    <section className="container mx-auto" aria-label="Мой список аниме">
      <AnimeListToolbar
        activeFilter={activeFilter}
        activeSort={activeSort}
        counts={counts}
        viewMode={viewMode}
        onFilterChange={setActiveFilter}
        onSortChange={setActiveSort}
        onViewModeChange={setViewMode}
      />

      {visibleAnime.length === 0 ? (
        <AnimeListEmptyState filter={activeFilter} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
          {visibleAnime.map((anime, index) => (
            <ProfileAnimeCard key={anime.id} anime={anime} priority={index < 5} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60 bg-card/30">
          {visibleAnime.map((anime) => (
            <AnimeListRow key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </section>
  );
}
