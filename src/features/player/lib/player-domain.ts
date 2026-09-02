import type { AnimeEpisode } from '@/shared/types/anime';

import type { VideoFragment } from '../components/fragment-markers';

export function clampEpisodeIndex(index: number, episodeCount: number): number {
  if (episodeCount <= 0) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), episodeCount - 1);
}

export function getEpisodeSource(episode: AnimeEpisode): string | null {
  const hentaiSource = (episode as AnimeEpisode & { hls?: string }).hls?.trim();
  return (
    hentaiSource ||
    episode.hls_1080?.trim() ||
    episode.hls_720?.trim() ||
    episode.hls_480?.trim() ||
    null
  );
}

export function getEpisodeTitle(episode: AnimeEpisode, index: number): string {
  const ordinal = episode.ordinal ?? index + 1;
  return `Эпизод ${ordinal}${episode.name ? ` · ${episode.name}` : ''}`;
}

export function getEpisodeFragments(episode: AnimeEpisode): VideoFragment[] {
  const fragments: VideoFragment[] = [];
  if (episode.opening.start != null && episode.opening.stop != null) {
    fragments.push({ start: episode.opening.start, stop: episode.opening.stop, type: 'opening' });
  }
  if (episode.ending.start != null && episode.ending.stop != null) {
    fragments.push({ start: episode.ending.start, stop: episode.ending.stop, type: 'ending' });
  }
  return fragments;
}
