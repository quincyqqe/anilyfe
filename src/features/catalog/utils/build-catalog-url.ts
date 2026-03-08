import type { CatalogFilters } from '../types/catalog';

export function buildCatalogUrl(filters: Omit<CatalogFilters, 'page'>, page: number): string {
  const params = new URLSearchParams();

  const set = (key: string, val?: string) => {
    if (val) params.set(key, val);
  };

  set('genres', filters.genres.join(','));
  set('types', filters.types.join(','));
  set('seasons', filters.seasons.join(','));
  set('age_ratings', filters.ageRatings.join(','));
  set('publish_statuses', filters.publishStatuses.join(','));
  set('production_statuses', filters.productionStatuses.join(','));
  set('from_year', filters.fromYear);
  set('to_year', filters.toYear);
  set('search', filters.search);
  set('sorting', filters.sorting);
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `/catalog?${query}` : '/catalog';
}
