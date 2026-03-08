import { safeFetch } from '../../../shared/api/client';
import { Anime } from '../../../shared/types/anime';
import type { CatalogFilters } from '@/features/catalog/types/catalog';
import { ENDPOINTS } from '../../../shared/constants/endpoints';

interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface CatalogResponse {
  data: Anime[];
  meta: { pagination: Pagination };
}

export async function fetchCatalog({
  genres = [],
  types = [],
  seasons = [],
  fromYear = '',
  toYear = '',
  search = '',
  sorting = '',
  ageRatings = [],
  publishStatuses = [],
  productionStatuses = [],
  page = 1,
  limit = 28,
}: Partial<CatalogFilters> & {
  limit?: number;
} = {}): Promise<CatalogResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (genres.length) params.append('f[genres]', genres.join(','));
  if (types.length) params.append('f[types]', types.join(','));
  if (seasons.length) params.append('f[seasons]', seasons.join(','));
  if (fromYear) params.append('f[years][from_year]', fromYear);
  if (toYear) params.append('f[years][to_year]', toYear);
  if (search) params.append('f[search]', search);
  if (sorting) params.append('f[sorting]', sorting);
  if (ageRatings.length) params.append('f[age_ratings]', ageRatings.join(','));
  if (publishStatuses.length) params.append('f[publish_statuses]', publishStatuses.join(','));
  if (productionStatuses.length)
    params.append('f[production_statuses]', productionStatuses.join(','));

  try {
    return await safeFetch<CatalogResponse>(`${ENDPOINTS.catalog}?${params.toString()}`, {
      cache: 'no-store',
    });
  } catch {
    return {
      data: [],
      meta: {
        pagination: {
          total: 0,
          count: 0,
          per_page: limit,
          current_page: page,
          total_pages: 1,
        },
      },
    };
  }
}
