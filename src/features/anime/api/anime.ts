import { ENDPOINTS } from '@/shared/constants/endpoints';
import { safeFetch } from '@/shared/api/client';
import { Anime } from '@/shared/types/anime';

export async function fetchAnime(slug: string): Promise<Anime | null> {
  try {
    const data = await safeFetch<Anime>(ENDPOINTS.anime(slug));

    return data;
  } catch (e) {
    return null;
  }
}
