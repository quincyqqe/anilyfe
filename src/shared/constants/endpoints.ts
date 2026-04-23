import { BASE_API_URL } from '../api/client';

const createSearchParams = (params: Record<string, string>) =>
  new URLSearchParams(params).toString();

export const ENDPOINTS = {
  search: (query: string) =>
    `${BASE_API_URL}/app/search/releases?${createSearchParams({
      query,
    })}`,

  promotions: `${BASE_API_URL}/media/promotions`,

  seasons: (season: string, year: string) =>
    `${BASE_API_URL}/anime/catalog/releases?${createSearchParams({
      page: '1',
      limit: '16',
      'f[seasons]': season,
      'f[years][from_year]': year,
      'f[years][to_year]': year,
      'f[sorting]': 'RATING_DESC',
    })}`,

  schedule: (date: string) => `${BASE_API_URL}/anime/schedule/${date}`,

  franchise: (code: string) => `${BASE_API_URL}/anime/franchises/release/${code}`,
  franchiseById: (id: string) => `${BASE_API_URL}/anime/franchises/${id}`,

  franchisesRandom: `${BASE_API_URL}/anime/franchises/random?limit=9`,

  latest: `${BASE_API_URL}/anime/catalog/releases?${createSearchParams({
    limit: '14',
    sort: 'fresh_at',
    order: 'desc',
  })}`,

  anime: (slug: string) => `${BASE_API_URL}/anime/releases/${slug}`,

  catalog: `${BASE_API_URL}/anime/catalog/releases`,
} as const;
