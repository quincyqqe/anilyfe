'use client';

import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils/cn';
import { FILTER_TABS, SORT_OPTIONS } from '../../model/anime-list/constants';
import type { FilterKey, SortKey, ViewMode } from '../../model/anime-list/types';

interface Props {
  activeFilter: FilterKey;
  activeSort: SortKey;
  counts: Record<FilterKey, number>;
  viewMode: ViewMode;
  onFilterChange: (filter: FilterKey) => void;
  onSortChange: (sort: SortKey) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function AnimeListToolbar({
  activeFilter,
  activeSort,
  counts,
  viewMode,
  onFilterChange,
  onSortChange,
  onViewModeChange,
}: Props) {
  const sortLabel = SORT_OPTIONS.find((option) => option.key === activeSort)?.label ?? '';
  return (
    <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2.5 sm:p-3 lg:flex-row lg:items-center lg:justify-between">
      <nav
        aria-label="Фильтр списка аниме"
        className="scrollbar-none flex min-w-0 items-center gap-1 overflow-x-auto"
      >
        {FILTER_TABS.map((tab) => {
          const count = counts[tab.key];
          if (count === 0 && tab.key !== 'all') return null;
          const Icon = tab.icon;
          const active = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/70',
                active
                  ? 'bg-white/[0.09] text-foreground'
                  : 'text-muted-foreground hover:bg-white/[0.045] hover:text-foreground',
              )}
            >
              <Icon className={cn('size-3.5', active ? tab.color : 'text-muted-foreground')} />
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 font-mono text-[9px] tabular-nums',
                  active ? 'bg-white/10 text-foreground' : 'bg-white/[0.04] text-muted-foreground',
                )}
              >
                {count}
              </span>
              {active && (
                <span className="absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5 lg:border-t-0 lg:pt-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-10 rounded-xl border-white/[0.08] bg-white/[0.035] px-3 text-xs font-semibold text-muted-foreground"
              />
            }
          >
            <span className="max-w-36 truncate">{sortLabel}</span>
            <ChevronDown className="size-3.5 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={6} className="min-w-44 rounded-xl p-1.5">
            <DropdownMenuRadioGroup
              value={activeSort}
              onValueChange={(value) => onSortChange(value as SortKey)}
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem
                  key={option.key}
                  value={option.key}
                  closeOnClick
                  className="cursor-pointer rounded-lg px-3 py-2 text-xs"
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.035] p-1"
          aria-label="Вид списка"
        >
          <button
            type="button"
            aria-label="Плитка"
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary/70',
              viewMode === 'grid'
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Список"
            aria-pressed={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}
            className={cn(
              'flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary/70',
              viewMode === 'list'
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
