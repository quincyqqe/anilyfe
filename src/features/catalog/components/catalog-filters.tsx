'use client';

import { useState } from 'react';
import { Button, Input, Chip, Select, SelectItem } from '@heroui/react';
import { Search, Filter, X } from 'lucide-react';
import { useCatalogFilters } from '../hooks/use-catalog-filters';
import {
  genres,
  formats,
  seasons,
  years,
  sortingOptions,
  ageRatings,
  publishStatuses,
  productionStatuses,
} from '../constants';

export function CatalogFilters() {
  const { filters, activeCount, hasActiveFilters, update, reset } = useCatalogFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  return (
    <div className="w-full  space-y-4">
      <div className="lg:hidden">
        <Button
          variant="bordered"
          onPress={() => setIsOpen((v) => !v)}
          className="w-full justify-between border-white/10 bg-white/5 text-white"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-primary" />
            <span>Фильтры</span>
            {hasActiveFilters && (
              <Chip size="sm" color="primary">
                {activeCount}
              </Chip>
            )}
          </div>
        </Button>
      </div>

      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-4`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update('search', searchValue);
          }}
        >
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск аниме..."
            size="lg"
            radius="lg"
            variant="faded"
            startContent={<Search size={18} className="text-default-400 shrink-0" />}
            classNames={{
              input: 'text-white placeholder:text-default-500',
              inputWrapper: 'bg-white/5 border-white/10 ',
            }}
          />
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterSelect
            label="Жанр"
            options={genres.map((g) => ({
              value: String(g.id),
              label: g.name,
            }))}
            selectedKeys={new Set(filters.genres.map(String))}
            onSelectionChange={(keys) => update('genres', [...keys].map(Number))}
            multiple
          />
          <FilterSelect
            label="Формат"
            options={formats.map((f) => ({
              value: f.value,
              label: f.description,
            }))}
            selectedKeys={new Set(filters.types)}
            onSelectionChange={(keys) => update('types', [...keys] as string[])}
            multiple
          />
          <FilterSelect
            label="Сезон"
            options={seasons.map((s) => ({
              value: s.value,
              label: s.description,
            }))}
            selectedKeys={new Set(filters.seasons)}
            onSelectionChange={(keys) => update('seasons', [...keys] as string[])}
            multiple
          />
          <FilterSelect
            label="Сортировка"
            options={sortingOptions.map((s) => ({
              value: s.value,
              label: s.description,
            }))}
            selectedKeys={filters.sorting ? new Set([filters.sorting]) : new Set()}
            onSelectionChange={(keys) => update('sorting', ([...keys][0] as string) ?? '')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <FilterSelect
            label="Год от"
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
            selectedKeys={filters.fromYear ? new Set([filters.fromYear]) : new Set()}
            onSelectionChange={(keys) => update('fromYear', ([...keys][0] as string) ?? '')}
          />
          <FilterSelect
            label="Год до"
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
            selectedKeys={filters.toYear ? new Set([filters.toYear]) : new Set()}
            onSelectionChange={(keys) => update('toYear', ([...keys][0] as string) ?? '')}
          />
          <FilterSelect
            label="Возраст"
            options={ageRatings.map((a) => ({
              value: a.value,
              label: a.description,
            }))}
            selectedKeys={new Set(filters.ageRatings)}
            onSelectionChange={(keys) => update('ageRatings', [...keys] as string[])}
            multiple
          />
          <FilterSelect
            label="Статус публикации"
            options={publishStatuses.map((p) => ({
              value: p.value,
              label: p.description,
            }))}
            selectedKeys={new Set(filters.publishStatuses)}
            onSelectionChange={(keys) => update('publishStatuses', [...keys] as string[])}
            multiple
          />
          <FilterSelect
            label="Статус производства"
            options={productionStatuses.map((p) => ({
              value: p.value,
              label: p.description,
            }))}
            selectedKeys={new Set(filters.productionStatuses)}
            onSelectionChange={(keys) => update('productionStatuses', [...keys] as string[])}
            multiple
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="bordered"
            onPress={reset}
            startContent={<X size={16} />}
            className="self-start border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-primary"
          >
            Сбросить все фильтры
          </Button>
        )}
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  multiple?: boolean;
}

function FilterSelect({
  label,
  options,
  selectedKeys,
  onSelectionChange,
  multiple = false,
}: FilterSelectProps) {
  return (
    <Select
      label={label}
      selectionMode={multiple ? 'multiple' : 'single'}
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => onSelectionChange(new Set(keys as Set<string>))}
      size="md"
      radius="lg"
      variant="faded"
      classNames={{
        trigger: 'bg-white/5 border-white/10',
        label: 'text-default-400',
        value: 'text-white',
        popoverContent: 'bg-content1 border border-white/10',
      }}
    >
      {options.map((opt) => (
        <SelectItem key={opt.value}>{opt.label}</SelectItem>
      ))}
    </Select>
  );
}
