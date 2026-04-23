'use server';

import { fetchYouTube } from '@/features/anime/api/youtube';

export async function getAnimeMediaVideo(
  animeId: number,
  animeName: string,
  animeYear: number,
  type: 'trailer' | 'op' | 'ed'
) {
  let query = '';
  if (type === 'trailer') {
    query = `${animeName} ${animeYear} official anime trailer`;
  } else if (type === 'op') {
    query = `${animeName} ${animeYear} anime opening creditless`;
  } else if (type === 'ed') {
    query = `${animeName} ${animeYear} anime ending creditless`;
  }

  const res = await fetchYouTube(query);
  return res?.id?.videoId ?? null;
}
