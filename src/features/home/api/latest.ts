import { ENDPOINTS } from '@/shared/constants/endpoints';
import { safeFetch } from '@/shared/api/client';
import { Anime } from '@/shared/types/anime';

export async function fetchLatest(): Promise<Anime[]> {
  try {
    const data = await safeFetch<{ data: Anime[] }>(ENDPOINTS.latest);
    return data.data ?? [];
  } catch (e) {
    return [];
  }
}
