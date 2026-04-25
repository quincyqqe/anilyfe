'use server';

import { fetchYouTube } from '@/features/anime/api/youtube';

function buildQueries(
  name: string,
  type: 'trailer' | 'op' | 'ed',
  animeYear: number
) {
  switch (type) {
    case 'trailer':
      return [
        `${name} ${animeYear} official trailer`,
        `${name} ${animeYear} PV`,
        `${name} ${animeYear} anime official PV`,
      ];

    case 'op':
      return [
        `${name} ${animeYear} ノンクレジット OP`,
        `${name} ${animeYear} creditless opening`,
        `${name} ${animeYear} OP`,
        `${name} ${animeYear} opening theme`,
      ];

    case 'ed':
      return [
        `${name} ${animeYear} ノンクレジット ED`,
        `${name} ${animeYear} creditless ending`,
        `${name} ${animeYear} ED`,
        `${name} ${animeYear} ending theme`,
      ];
  }
}

export async function getAnimeMediaVideo(
  animeId: number,
  animeName: string,
  animeYear: number,
  type: 'trailer' | 'op' | 'ed'
) {
  const queries = buildQueries(animeName, type, animeYear);

  for (const query of queries) {
    const res = await fetchYouTube(query);

    if (res?.id?.videoId) {
      return res.id.videoId;
    }
  }

  return null;
}
