'use client';

import { LayoutGrid, List, ChevronDown } from 'lucide-react';

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

interface AnimeListToolbarProps {
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
}: AnimeListToolbarProps) {
  const sortLabel =
    SORT_OPTIONS.find((option) => option.key === activeSort)?.label ?? '';

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <div className="flex w-max items-center gap-1 rounded-2xl border border-white/[0.04] bg-zinc-950/35 p-1">
          {FILTER_TABS.map((tab) => {
            const count = counts[tab.key];

            if (count === 0 && tab.key !== 'all') return null;

            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onFilterChange(tab.key)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors',
                  activeFilter === tab.key
                    ? tab.activeClass
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'size-3.5',
                    activeFilter === tab.key
                      ? tab.color
                      : 'text-muted-foreground',
                  )}
                />

                <span>{tab.label}</span>

                <span className="rounded-md border border-white/[0.02] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 md:justify-end">
        <SortDropdown
          activeSort={activeSort}
          label={sortLabel}
          onSortChange={onSortChange}
        />

        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
}

interface SortDropdownProps {
  activeSort: SortKey;
  label: string;
  onSortChange: (sort: SortKey) => void;
}

function SortDropdown({
  activeSort,
  label,
  onSortChange,
}: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-9 rounded-xl border border-white/[0.04] glass px-3 text-xs font-semibold text-muted-foreground"
          />
        }
      >
        <span className="max-w-36 truncate">{label}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={6}
        className="min-w-44 rounded-xl p-1.5"
      >
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
  );
}

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.04] bg-zinc-950/35 p-1">
      <ViewModeButton
        active={viewMode === 'grid'}
        onClick={() => onViewModeChange('grid')}
      >
        <LayoutGrid className="size-3.5" />
      </ViewModeButton>

      <ViewModeButton
        active={viewMode === 'list'}
        onClick={() => onViewModeChange('list')}
      >
        <List className="size-3.5" />
      </ViewModeButton>
    </div>
  );
}

function ViewModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex size-7 items-center justify-center rounded-lg transition-colors',
        active
          ? 'bg-white/12 text-white shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}