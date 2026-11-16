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
            variant="ghost"
            className="h-8 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          />
        }
      >
        <span className="max-w-36 truncate">{label}</span>
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
  );
}

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-0.5">
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
      className={cn(
        'flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200',
        active
          ? 'bg-white/10 text-white'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
