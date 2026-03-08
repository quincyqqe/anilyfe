import { ENDPOINTS } from '../constants/endpoints';
import { Anime } from '@/shared/types/anime';
import { safeFetch } from './client';

export async function fetchSearch(query: string): Promise<Anime[]> {
  try {
    const data = await safeFetch<Anime[]>(ENDPOINTS.search(query));

    return (data ?? []).filter((anime): anime is Anime => anime.release !== null);
  } catch {
    return [];
  }
}
