'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

import {
  ageRatings,
  formats,
  genres,
  productionStatuses,
  publishStatuses,
  seasons,
  sortingOptions,
  years,
} from '../constants';
import { useCatalogFilters } from '../hooks/use-catalog-filters';

type FilterOption = {
  value: string | number;
  label: string;
};

export function CatalogFilters() {
  const { filters, activeCount, hasActiveFilters, isPending, reset, update } = useCatalogFilters();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const submitSearch = () => {
    update('search', searchValue.trim());
  };

  return (
    <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      <div className="lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-expanded={isMobileOpen}
          className="h-12 w-full justify-between rounded-2xl border-white/10 bg-card/60 px-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal data-icon="inline-start" />
            Настроить выдачу
            {hasActiveFilters && <Badge variant="secondary">{activeCount}</Badge>}
          </span>

          <ChevronDown
            data-icon="inline-end"
            className={cn('transition-transform duration-200', isMobileOpen && 'rotate-180')}
          />
        </Button>

        {isMobileOpen && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-card/85 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <FilterWorkspace
              activeCount={activeCount}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              isPending={isPending}
              onReset={reset}
              onSearchChange={setSearchValue}
              onSearchSubmit={submitSearch}
              searchId="catalog-search-mobile"
              searchValue={searchValue}
              update={update}
            />
          </div>
        )}
      </div>

      <aside className="hidden rounded-3xl border border-white/[0.08] bg-card/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl lg:block">
        <FilterWorkspace
          activeCount={activeCount}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          isPending={isPending}
          onReset={reset}
          onSearchChange={setSearchValue}
          onSearchSubmit={submitSearch}
          searchId="catalog-search-desktop"
          searchValue={searchValue}
          update={update}
        />
      </aside>
    </div>
  );
}

type FilterWorkspaceProps = {
  activeCount: number;
  filters: ReturnType<typeof useCatalogFilters>['filters'];
  hasActiveFilters: boolean;
  isPending: boolean;
  onReset: () => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchId: string;
  searchValue: string;
  update: ReturnType<typeof useCatalogFilters>['update'];
};

function FilterWorkspace({
  activeCount,
  filters,
  hasActiveFilters,
  isPending,
  onReset,
  onSearchChange,
  onSearchSubmit,
  searchId,
  searchValue,
  update,
}: FilterWorkspaceProps) {
  return (
    <div aria-busy={isPending} className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 px-1 pt-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Навигация
          </p>
          <h2 className="mt-1 text-sm font-semibold text-foreground">Параметры поиска</h2>
        </div>

        {hasActiveFilters && <Badge variant="secondary">{activeCount}</Badge>}
      </div>

      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit();
        }}
      >
        <label htmlFor={searchId} className="text-xs font-medium text-muted-foreground">
          Найти аниме
        </label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id={searchId}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Название или франшиза"
            className="pr-10 pl-10"
          />

          {searchValue && (
            <button
              type="button"
              aria-label="Очистить поиск"
              onClick={() => {
                onSearchChange('');
                update('search', '');
              }}
              className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Нажмите Enter, чтобы применить запрос.
        </p>
      </form>

      <FilterGroup title="Сначала показать">
        <SingleSelectMenu
          label="Сортировка"
          options={sortingOptions.map((option) => ({
            value: option.value,
            label: option.description,
          }))}
          value={filters.sorting}
          onChange={(value) => update('sorting', value)}
        />
      </FilterGroup>

      <FilterGroup title="О произведении">
        <MultiSelectMenu
          label="Жанры"
          options={genres.map((genre) => ({
            value: genre.id,
            label: genre.name,
          }))}
          values={filters.genres}
          onChange={(value) => update('genres', value as number[])}
        />

        <MultiSelectMenu
          label="Формат"
          options={formats.map((format) => ({
            value: format.value,
            label: format.description,
          }))}
          values={filters.types}
          onChange={(value) => update('types', value as string[])}
        />

        <MultiSelectMenu
          label="Сезон"
          options={seasons.map((season) => ({
            value: season.value,
            label: season.description,
          }))}
          values={filters.seasons}
          onChange={(value) => update('seasons', value as string[])}
        />

        <MultiSelectMenu
          label="Возрастной рейтинг"
          options={ageRatings.map((rating) => ({
            value: rating.value,
            label: rating.description,
          }))}
          values={filters.ageRatings}
          onChange={(value) => update('ageRatings', value as string[])}
        />
      </FilterGroup>

      <FilterGroup title="Время и статус">
        <div className="grid grid-cols-2 gap-2">
          <SingleSelectMenu
            label="Год от"
            options={years.map((year) => ({
              value: String(year),
              label: String(year),
            }))}
            value={filters.fromYear}
            onChange={(value) => update('fromYear', value)}
          />

          <SingleSelectMenu
            label="Год до"
            options={years.map((year) => ({
              value: String(year),
              label: String(year),
            }))}
            value={filters.toYear}
            onChange={(value) => update('toYear', value)}
          />
        </div>

        <MultiSelectMenu
          label="Статус публикации"
          options={publishStatuses.map((status) => ({
            value: status.value,
            label: status.description,
          }))}
          values={filters.publishStatuses}
          onChange={(value) => update('publishStatuses', value as string[])}
        />

        <MultiSelectMenu
          label="Статус производства"
          options={productionStatuses.map((status) => ({
            value: status.value,
            label: status.description,
          }))}
          values={filters.productionStatuses}
          onChange={(value) => update('productionStatuses', value as string[])}
        />
      </FilterGroup>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          className="h-10 w-full justify-center rounded-xl text-muted-foreground hover:text-foreground"
        >
          <X data-icon="inline-start" />
          Сбросить фильтры
        </Button>
      )}

      <p className="px-1 text-[10px] text-muted-foreground" aria-live="polite">
        {isPending ? 'Обновляем выдачу…' : 'Фильтры сохраняются в ссылке.'}
      </p>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2 border-t border-white/[0.07] pt-4">
      <legend className="pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </legend>

      {children}
    </fieldset>
  );
}

function MultiSelectMenu({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  values: ReadonlyArray<string | number>;
  onChange: (values: Array<string | number>) => void;
}) {
  const selectedCount = values.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              'h-11 w-full justify-between rounded-xl bg-transparent px-3 text-left text-xs font-medium',
              selectedCount > 0 && 'border-foreground/25 bg-muted/50 text-foreground',
            )}
          />
        }
      >
        <span className="truncate">{label}</span>

        <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
          {selectedCount > 0 && <Badge variant="secondary">{selectedCount}</Badge>}
          <ChevronDown data-icon="inline-end" />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={6}
        className="max-h-[min(60dvh,32rem)] w-72 rounded-2xl p-1.5"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          {options.map((option) => {
            const isSelected = values.includes(option.value);

            return (
              <DropdownMenuCheckboxItem
                key={String(option.value)}
                checked={isSelected}
                closeOnClick={false}
                onCheckedChange={(checked) =>
                  onChange(
                    checked
                      ? [...values, option.value]
                      : values.filter((value) => value !== option.value),
                  )
                }
                className="min-h-9 cursor-pointer py-2 text-xs"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SingleSelectMenu({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const activeLabel = options.find((option) => String(option.value) === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              'h-11 w-full justify-between rounded-xl bg-transparent px-3 text-left text-xs font-medium',
              value && 'border-foreground/25 bg-muted/50 text-foreground',
            )}
          />
        }
      >
        <span className="truncate">{activeLabel ?? label}</span>

        <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={6}
        className="max-h-[min(60dvh,32rem)] w-72 rounded-2xl p-1.5"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuRadioItem
            value=""
            closeOnClick
            className="min-h-9 cursor-pointer py-2 text-xs"
          >
            Любой вариант
          </DropdownMenuRadioItem>

          {options.map((option) => (
            <DropdownMenuRadioItem
              key={String(option.value)}
              value={String(option.value)}
              closeOnClick
              className="min-h-9 cursor-pointer py-2 text-xs"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
