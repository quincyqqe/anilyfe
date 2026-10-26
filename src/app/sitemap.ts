import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site.config';
import { safeFetch } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/constants/endpoints';

// The sitemap is a cached route handler: regenerated at most once a day
// (per server instance), with the underlying catalog data cached for a day too.
export const revalidate = 86400;

const SITE_URL = siteConfig.url;

// The API caps `limit` at 50 releases per page.
const CATALOG_LIMIT = 50;
// Requests are batched to stay polite with the upstream API.
const CATALOG_CHUNK_SIZE = 8;
// Hard cap: 200 pages * 50 releases = 10 000 URLs, well under the 50 000 limit.
const MAX_CATALOG_PAGES = 200;

interface CatalogRelease {
  alias: string;
  updated_at: string;
}

interface CatalogPage {
  data: CatalogRelease[];
  meta: {
    pagination: {
      total_pages: number;
    };
  };
}

interface FranchiseRecord {
  id: string;
}

async function fetchCatalogPage(page: number): Promise<CatalogPage | null> {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(CATALOG_LIMIT) });

    return await safeFetch<CatalogPage>(`${ENDPOINTS.catalog}?${params.toString()}`, {
      next: { revalidate: 86400 },
    });
  } catch {
    return null;
  }
}

async function fetchAnimeEntries(): Promise<MetadataRoute.Sitemap> {
  const firstPage = await fetchCatalogPage(1);
  if (!firstPage) return [];

  const totalPages = Math.min(
    Math.max(firstPage.meta.pagination.total_pages, 1),
    MAX_CATALOG_PAGES,
  );

  const remainingPages: (CatalogPage | null)[] = [];
  for (let chunkStart = 2; chunkStart <= totalPages; chunkStart += CATALOG_CHUNK_SIZE) {
    const chunkEnd = Math.min(chunkStart + CATALOG_CHUNK_SIZE - 1, totalPages);
    const chunk = await Promise.all(
      Array.from({ length: chunkEnd - chunkStart + 1 }, (_, i) => fetchCatalogPage(chunkStart + i)),
    );
    remainingPages.push(...chunk);
  }

  const lastModifiedByAlias = new Map<string, string | undefined>();
  for (const page of [firstPage, ...remainingPages]) {
    for (const release of page?.data ?? []) {
      if (release.alias) lastModifiedByAlias.set(release.alias, release.updated_at);
    }
  }

  return [...lastModifiedByAlias.entries()].map(([alias, updatedAt]) => ({
    url: `${SITE_URL}/anime/${alias}`,
    lastModified: updatedAt ? new Date(updatedAt) : undefined,
  }));
}

async function fetchFranchiseEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const franchises = await safeFetch<FranchiseRecord[]>(ENDPOINTS.franchisesList(1000), {
      next: { revalidate: 86400 },
    });

    return (franchises ?? [])
      .filter((franchise) => Boolean(franchise.id))
      .map((franchise) => ({ url: `${SITE_URL}/franchises/${franchise.id}` }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/catalog',
    '/schedule',
    '/privacy',
    '/terms',
  ].map((path) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
  }));

  const [animeEntries, franchiseEntries] = await Promise.all([
    fetchAnimeEntries(),
    fetchFranchiseEntries(),
  ]);

  return [...staticRoutes, ...animeEntries, ...franchiseEntries];
}
