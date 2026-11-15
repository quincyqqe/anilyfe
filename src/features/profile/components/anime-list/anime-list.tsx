'use client';

import { useMemo, useState } from 'react';

import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { FILTER_TABS, SORT_OPTIONS } from '../../model/anime-list/constants';
import { getStatusCounts, getVisibleAnimeList } from '../../model/anime-list/helpers';
import type { FilterKey, SortKey, ViewMode } from '../../model/anime-list/types';
import { AnimeListEmptyState } from './anime-list-empty-state';
import { AnimeListRow } from './anime-list-row';
import { SortDropdown, ViewModeToggle } from './anime-list-toolbar';
import { NetflixAnimeCard } from './netflix-anime-card';

interface AnimeListProps {
  animeList: UserAnimeEntry[];
  isOwner?: boolean;
}

export function AnimeList({ animeList, isOwner = false }: AnimeListProps) {
  const counts = useMemo(() => getStatusCounts(animeList), [animeList]);

  // Watching is the primary view, fall back to the full list when it's empty.
  const [activeFilter, setActiveFilter] = useState<FilterKey>(() =>
    counts.watching > 0 ? 'watching' : 'all',
  );
  const [activeSort, setActiveSort] = useState<SortKey>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const sortLabel = SORT_OPTIONS.find((option) => option.key === activeSort)?.label ?? '';

  const visibleTabs = FILTER_TABS.filter((tab) => counts[tab.key] > 0 || tab.key === 'all');

  return (
    <div className="container mx-auto">
      <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as FilterKey)}>
        <div className="mb-8 flex flex-col gap-2 border-b border-white/[0.06] md:flex-row md:items-end md:justify-between">
          <TabsList variant="line" aria-label="Список аниме">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger key={tab.key} value={tab.key} variant="line">
                  <Icon
                    className={cn(
                      'size-3.5',
                      activeFilter === tab.key ? tab.color : 'text-muted-foreground',
                    )}
                  />

                  <span>{tab.label}</span>

                  <span className="rounded-md border border-white/[0.02] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] tabular-nums text-muted-foreground">
                    {counts[tab.key]}
                  </span>
                </TabsTrigger>
              );
            })}

            <TabsIndicator />
          </TabsList>

          <div className="flex items-center justify-between gap-3 pb-3 md:justify-end">
            <SortDropdown activeSort={activeSort} label={sortLabel} onSortChange={setActiveSort} />

            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {visibleTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            <AnimeListPanel
              animeList={animeList}
              filter={tab.key}
              sort={activeSort}
              viewMode={viewMode}
              isOwner={isOwner}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface AnimeListPanelProps {
  animeList: UserAnimeEntry[];
  filter: FilterKey;
  sort: SortKey;
  viewMode: ViewMode;
  isOwner: boolean;
}

// One panel per filter — mounts fresh on every tab switch, which replays the
// fade-in without extra state.
function AnimeListPanel({ animeList, filter, sort, viewMode, isOwner }: AnimeListPanelProps) {
  const visibleAnime = useMemo(
    () => getVisibleAnimeList(animeList, filter, sort),
    [animeList, filter, sort],
  );

  if (visibleAnime.length === 0) {
    return <AnimeListEmptyState filter={filter} />;
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-2">
        {visibleAnime.map((anime) => (
          <AnimeListRow key={anime.id} anime={anime} isOwner={isOwner} />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4.5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
      {visibleAnime.map((anime) => (
        <NetflixAnimeCard key={anime.id} anime={anime} isOwner={isOwner} />
      ))}
    </div>
  );
}
