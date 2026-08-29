import 'server-only';

import { getAnimeAniList, upsertAnimeAniList } from '@/lib/db/queries';
import type { AniListAnime, AniListAnimeRecord } from '@/shared/types/anilist';

const ANILIST_API_URL = 'https://graphql.anilist.co';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const SEARCH_ANIME_QUERY = `
  query ($search: String!) {
    Page(page: 1, perPage: 1) {
      media(search: $search, type: ANIME) {
        id
        averageScore
        favourites
        bannerImage

        trailer {
          id
          site
          thumbnail
        }

        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }

        status

        externalLinks {
          id
          url
          site
          type
          language
          color
          icon
        }
      }
    }
  }
`;

const MEDIA_QUERY = `
  query ($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      averageScore
      favourites
      bannerImage

      trailer {
        id
        site
        thumbnail
      }

      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }

      status

      externalLinks {
        id
        url
        site
        type
        language
        color
        icon
      }
    }
  }
`;

interface AniListResponse<T> {
  data?: T;
  errors?: {
    message: string;
  }[];
}

interface SearchResponse {
  Page?: {
    media: AniListAnime[];
  };
}

interface MediaResponse {
  Media: AniListAnime | null;
}

async function requestAniList<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T | null> {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as AniListResponse<T>;

    if (result.errors?.length) {
      return null;
    }

    return result.data ?? null;
  } catch {
    return null;
  }
}

async function searchAniListAnime(
  englishTitle: string,
  mainTitle: string,
): Promise<AniListAnime | null> {
  const titles = [
    ...new Set([englishTitle, mainTitle].map((title) => title?.trim()).filter(Boolean)),
  ];

  for (const title of titles) {
    const result = await requestAniList<SearchResponse>(SEARCH_ANIME_QUERY, { search: title });

    const anime = result?.Page?.media?.[0];

    if (anime) {
      return anime;
    }
  }

  return null;
}

async function fetchAniListById(anilistId: number): Promise<AniListAnime | null> {
  const result = await requestAniList<MediaResponse>(MEDIA_QUERY, { id: anilistId });

  return result?.Media ?? null;
}

function isFresh(record: AniListAnimeRecord): boolean {
  return Date.now() - new Date(record.last_synced_at).getTime() < CACHE_TTL;
}

function toRecord(
  animeId: number,
  anime: AniListAnime,
): Omit<AniListAnimeRecord, 'id' | 'created_at' | 'updated_at'> {
  return {
    anime_id: animeId,
    anilist_id: anime.id,

    average_score: anime.averageScore,
    favourites: anime.favourites,

    banner_image: anime.bannerImage,

    trailer: anime.trailer,
    next_airing_episode: anime.nextAiringEpisode,

    status: anime.status,

    external_links: anime.externalLinks,

    last_synced_at: new Date().toISOString(),
  };
}

function fromRecord(record: AniListAnimeRecord): AniListAnime {
  return {
    id: record.anilist_id,

    averageScore: record.average_score,
    favourites: record.favourites,

    bannerImage: record.banner_image,

    trailer: record.trailer,
    nextAiringEpisode: record.next_airing_episode,

    status: record.status,

    externalLinks: record.external_links,
  };
}

export async function getAniListAnime(
  animeId: number,
  englishTitle: string,
  mainTitle: string,
): Promise<AniListAnime | null> {
  const cached = await getAnimeAniList(animeId);

  if (cached && isFresh(cached)) {
    return fromRecord(cached);
  }

  if (cached) {
    const anime = await fetchAniListById(cached.anilist_id);

    if (!anime) {
      return fromRecord(cached);
    }

    const updated = await upsertAnimeAniList(toRecord(animeId, anime));

    return updated ? fromRecord(updated) : anime;
  }

  const anime = await searchAniListAnime(englishTitle, mainTitle);

  if (!anime) {
    return null;
  }

  const saved = await upsertAnimeAniList(toRecord(animeId, anime));

  return saved ? fromRecord(saved) : anime;
}
