import type { CatalogFilters } from '../types/catalog';

type RawParams = Record<string, string | string[] | undefined>;

const str = (p: RawParams, key: string) => (p[key] ? String(p[key]) : '');
const strArr = (p: RawParams, key: string) => str(p, key).split(',').filter(Boolean);
const numArr = (p: RawParams, key: string) => strArr(p, key).map(Number).filter(Boolean);

export function parseSearchParams(params: RawParams): CatalogFilters {
  return {
    genres: numArr(params, 'genres'),
    types: strArr(params, 'types'),
    seasons: strArr(params, 'seasons'),
    ageRatings: strArr(params, 'age_ratings'),
    publishStatuses: strArr(params, 'publish_statuses'),
    productionStatuses: strArr(params, 'production_statuses'),
    fromYear: str(params, 'from_year'),
    toYear: str(params, 'to_year'),
    search: str(params, 'search'),
    sorting: str(params, 'sorting'),
    page: params.page ? Number(params.page) : 1,
  };
}
