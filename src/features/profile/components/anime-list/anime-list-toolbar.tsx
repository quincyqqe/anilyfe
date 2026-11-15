'use client';

import { LayoutGrid, List, ChevronDown, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { SORT_OPTIONS } from '../../model/anime-list/constants';
import type { SortKey, ViewMode } from '../../model/anime-list/types';

interface SortDropdownProps {
  activeSort: SortKey;
  label: string;
  onSortChange: (sort: SortKey) => void;
}

export function SortDropdown({ activeSort, label, onSortChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-9.5 cursor-pointer rounded-xl border border-white/10 bg-zinc-950/70 px-3 text-xs font-semibold text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
          />
        }
      >
        <ArrowUpDown className="size-3.5 shrink-0 opacity-60" />
        <span className="max-w-36 truncate">{label}</span>
        <ChevronDown className="size-3.5 shrink-0 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={6}
        className="min-w-48 rounded-xl border border-white/10 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-xl"
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
              className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
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

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
      <ViewModeButton
        active={viewMode === 'grid'}
        onClick={() => onViewModeChange('grid')}
        ariaLabel="Сетка"
      >
        <LayoutGrid className="size-3.5" />
      </ViewModeButton>

      <ViewModeButton
        active={viewMode === 'list'}
        onClick={() => onViewModeChange('list')}
        ariaLabel="Список"
      >
        <List className="size-3.5" />
      </ViewModeButton>
    </div>
  );
}

function ViewModeButton({
  active,
  onClick,
  ariaLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={
        active
          ? 'flex size-7.5 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/15 text-white shadow-sm transition-all duration-200 active:scale-95'
          : 'flex size-7.5 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-95'
      }
    >
      {children}
    </button>
  );
}
