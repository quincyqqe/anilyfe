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
    <div className="mb-6 flex flex-col gap-4 border-b border-border/60 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div
        className="scrollbar-none -mx-1 flex min-w-0 overflow-x-auto px-1"
        role="tablist"
        aria-label="Фильтр списка"
      >
        <div className="flex min-w-max items-center gap-1">
          {FILTER_TABS.map((tab) => {
            if (tab.key !== 'all' && counts[tab.key] === 0) return null;
            const Icon = tab.icon;
            const selected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onFilterChange(tab.key)}
                className={cn(
                  'flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  selected
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <Icon
                  className={cn('size-3.5', selected ? tab.color : 'text-muted-foreground')}
                  aria-hidden="true"
                />
                {tab.label}
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <span className="text-xs text-muted-foreground">
          <span className="font-mono tabular-nums text-foreground">{counts.all}</span> тайтлов
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg border-border/70 text-xs"
              />
            }
          >
            <span className="max-w-36 truncate">{sortLabel}</span>
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuRadioGroup
              value={activeSort}
              onValueChange={(value) => onSortChange(value as SortKey)}
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.key} value={option.key}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          className="flex items-center gap-1 rounded-lg border border-border/70 p-1"
          aria-label="Режим отображения"
        >
          {(
            [
              ['grid', LayoutGrid, 'Сетка'],
              ['list', List, 'Список'],
            ] as const
          ).map(([mode, Icon, label]) => (
            <button
              key={mode}
              type="button"
              aria-label={label}
              aria-pressed={viewMode === mode}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                'flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                viewMode === mode && 'bg-muted text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
