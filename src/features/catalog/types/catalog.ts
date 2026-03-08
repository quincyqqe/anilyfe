export interface CatalogFilters {
  genres: number[];
  types: string[];
  seasons: string[];
  ageRatings: string[];
  publishStatuses: string[];
  productionStatuses: string[];
  fromYear: string;
  toYear: string;
  search: string;
  sorting: string;
  page: number;
}
