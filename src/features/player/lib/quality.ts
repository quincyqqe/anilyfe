import { AnimeEpisode } from '@/shared/types/anime';

export interface QualityOption {
  html: string;
  url: string;
  default?: boolean;
}

export function buildQualityList(episode: AnimeEpisode): QualityOption[] {
  const list: QualityOption[] = [];

  if (episode.hls_1080) list.push({ html: 'FHD 1080P', url: episode.hls_1080 });
  if (episode.hls_720) list.push({ html: 'HD 720P', url: episode.hls_720 });
  if (episode.hls_480) list.push({ html: 'SD 480P', url: episode.hls_480 });

  if (list.length > 0) list[0].default = true;

  return list;
}

export function getBestUrl(episode: AnimeEpisode): string | null {
  return episode.hls_1080 ?? episode.hls_720 ?? episode.hls_480 ?? null;
}
