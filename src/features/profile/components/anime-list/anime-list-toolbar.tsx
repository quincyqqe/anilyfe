'use client';

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { FILTER_TABS, SORT_OPTIONS } from '../../model/anime-list/constants';
import type { FilterKey, SortKey, ViewMode } from '../../model/anime-list/types';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';



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
  const sortLabel = SORT_OPTIONS.find((o) => o.key === activeSort)?.label ?? '';

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
                onClick={() => onFilterChange(tab.key)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition',
                  activeFilter === tab.key
                    ? tab.activeClass
                    : 'text-muted-foreground hover:text-white',
                )}
              >
                <Icon
                  className={cn(
                    'h-3.5 w-3.5',
                    activeFilter === tab.key ? tab.color : 'text-white/40',
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
        <SortDropdown activeSort={activeSort} label={sortLabel} onSortChange={onSortChange} />

        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </div>
  );
}

interface SortDropdownProps {
  activeSort: SortKey;
  label: string;
  onSortChange: (sort: SortKey) => void;
}

function SortDropdown({ activeSort, label, onSortChange }: SortDropdownProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="h-9 rounded-xl border border-white/[0.04] bg-zinc-950/35 px-3 text-xs font-semibold text-muted-foreground hover:text-white">
          {label}
        </Button>
      </DropdownTrigger>

      <DropdownMenu color="primary" variant="light">
        {SORT_OPTIONS.map((option) => (
          <DropdownItem
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-2 text-xs transition',
              activeSort === option.key
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-white/5 hover:text-white',
            )}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.04] bg-zinc-950/35 p-1">
      <ViewModeButton active={viewMode === 'grid'} onClick={() => onViewModeChange('grid')}>
        <LayoutGrid className="h-3.5 w-3.5" />
      </ViewModeButton>

      <ViewModeButton active={viewMode === 'list'} onClick={() => onViewModeChange('list')}>
        <List className="h-3.5 w-3.5" />
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
      onClick={onClick}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg transition',
        active ? 'bg-white/12 text-white shadow-sm' : 'text-muted-foreground hover:text-white',
      )}
    >
      {children}
    </button>
  );
}
