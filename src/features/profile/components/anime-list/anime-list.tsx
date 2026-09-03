'use client';

import { useMemo, useState } from 'react';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { getStatusCounts, getVisibleAnimeList } from '../../model/anime-list/helpers';
import type { FilterKey, SortKey, ViewMode } from '../../model/anime-list/types';
import { AnimeListEmptyState } from './anime-list-empty-state';
import { AnimeListRow } from './anime-list-row';
import { AnimeListToolbar } from './anime-list-toolbar';
import { CARD_VARIANTS, ProfileAnimeCard, type CardVariant } from './anime-list-card';

interface AnimeListProps {
  animeList: UserAnimeEntry[];
}

export function AnimeList({ animeList }: AnimeListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeSort, setActiveSort] = useState<SortKey>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cardVariant, setCardVariant] = useState<CardVariant>('cinema');

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
        <>
          <div
            className="mb-5 flex min-w-0 items-center gap-2 overflow-x-auto pb-1"
            aria-label="Вариант карточки"
          >
            <span className="shrink-0 text-xs text-muted-foreground">Стиль карточек</span>
            <div className="flex min-w-max items-center gap-1 rounded-lg border border-border/60 bg-card/30 p-1">
              {CARD_VARIANTS.map((variant) => (
                <button
                  key={variant.key}
                  type="button"
                  title={variant.description}
                  aria-pressed={cardVariant === variant.key}
                  onClick={() => setCardVariant(variant.key)}
                  className={`min-h-9 rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cardVariant === variant.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          </div>
          <div
            className={`grid gap-x-3 gap-y-8 sm:gap-x-4 ${cardVariant === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}
          >
            {visibleAnime.map((anime, index) => (
              <ProfileAnimeCard
                key={anime.id}
                anime={anime}
                priority={index < 5}
                variant={cardVariant}
              />
            ))}
          </div>
        </>
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
