'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { CatalogFilters } from '../types/catalog';

const PARAM_MAP: Record<keyof Omit<CatalogFilters, 'page'>, string> = {
  genres: 'genres',
  types: 'types',
  seasons: 'seasons',
  ageRatings: 'age_ratings',
  publishStatuses: 'publish_statuses',
  productionStatuses: 'production_statuses',
  fromYear: 'from_year',
  toYear: 'to_year',
  search: 'search',
  sorting: 'sorting',
};

export function useCatalogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo<CatalogFilters>(
    () => ({
      genres: searchParams.get('genres')?.split(',').map(Number).filter(Boolean) ?? [],
      types: searchParams.get('types')?.split(',').filter(Boolean) ?? [],
      seasons: searchParams.get('seasons')?.split(',').filter(Boolean) ?? [],
      ageRatings: searchParams.get('age_ratings')?.split(',').filter(Boolean) ?? [],
      publishStatuses: searchParams.get('publish_statuses')?.split(',').filter(Boolean) ?? [],
      productionStatuses: searchParams.get('production_statuses')?.split(',').filter(Boolean) ?? [],
      fromYear: searchParams.get('from_year') ?? '',
      toYear: searchParams.get('to_year') ?? '',
      search: searchParams.get('search') ?? '',
      sorting: searchParams.get('sorting') ?? '',
      page: Number(searchParams.get('page') ?? 1),
    }),
    [searchParams],
  );

  const activeCount = useMemo(
    () =>
      [
        filters.genres.length > 0,
        filters.types.length > 0,
        filters.seasons.length > 0,
        filters.ageRatings.length > 0,
        filters.publishStatuses.length > 0,
        filters.productionStatuses.length > 0,
        !!filters.fromYear,
        !!filters.toYear,
        !!filters.search,
        !!filters.sorting,
      ].filter(Boolean).length,
    [filters],
  );

  const update = useCallback(
    <K extends keyof Omit<CatalogFilters, 'page'>>(key: K, value: CatalogFilters[K]) => {
      const params = new URLSearchParams(searchParams.toString());
      const strVal = Array.isArray(value) ? value.join(',') : String(value);
      strVal ? params.set(PARAM_MAP[key], strVal) : params.delete(PARAM_MAP[key]);
      params.set('page', '1');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const reset = useCallback(() => router.push('/catalog'), [router]);

  return {
    filters,
    activeCount,
    hasActiveFilters: activeCount > 0,
    update,
    reset,
  };
}
