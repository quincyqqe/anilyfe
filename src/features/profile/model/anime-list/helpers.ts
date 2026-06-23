import type { UserAnimeEntry } from '@/features/profile/types/profile';
import type { FilterKey, SortKey } from './types';

const titleCollator = new Intl.Collator('ru', {
  sensitivity: 'base',
  numeric: true,
});

export interface AnimeProgress {
  currentEpisode: number;
  totalEpisodes: number;
  seriesPercent: number;
  episodePercent: number;
  hasEpisodeProgress: boolean;
}

export function formatUpdated(iso: string): string {
  const d = new Date(iso);

  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function getAnimeHref(anime: UserAnimeEntry): string {
  return anime.anime_slug ? `/anime/${anime.anime_slug}` : '#';
}

export function getAnimePosterSrc(anime: UserAnimeEntry, mediaUrl: string): string {
  if (!anime.anime_poster) {
    return '';
  }

  if (/^https?:\/\//i.test(anime.anime_poster)) {
    return anime.anime_poster;
  }

  return `${mediaUrl}${anime.anime_poster}`;
}

export function getAnimeProgress(anime: UserAnimeEntry): AnimeProgress {
  const currentEpisode = Math.max(0, anime.current_episode ?? anime.episodes_watched ?? 0);
  const totalEpisodes = Math.max(0, anime.total_episodes ?? 0);
  const episodeDuration = Math.max(0, anime.episode_duration ?? 0);
  const episodeProgress = Math.max(0, anime.episode_progress ?? 0);

  const seriesPercent =
    totalEpisodes > 0 ? clampPercent((currentEpisode / totalEpisodes) * 100) : 0;
  const episodePercent =
    episodeDuration > 0 ? clampPercent((episodeProgress / episodeDuration) * 100) : 0;

  return {
    currentEpisode,
    totalEpisodes,
    seriesPercent,
    episodePercent,
    hasEpisodeProgress: episodePercent > 0 && episodePercent < 100,
  };
}

export function getStatusCounts(animeList: UserAnimeEntry[]): Record<FilterKey, number> {
  const counts = {
    all: animeList.length,
    watching: 0,
    completed: 0,
    on_hold: 0,
    dropped: 0,
    planned: 0,
  } satisfies Record<FilterKey, number>;

  for (const anime of animeList) {
    counts[anime.status] += 1;
  }

  return counts;
}

export function getVisibleAnimeList(
  animeList: UserAnimeEntry[],
  activeFilter: FilterKey,
  activeSort: SortKey,
): UserAnimeEntry[] {
  const visible =
    activeFilter === 'all'
      ? [...animeList]
      : animeList.filter((anime) => anime.status === activeFilter);

  visible.sort(getAnimeComparator(activeSort));

  return visible;
}

function getAnimeComparator(sort: SortKey): (a: UserAnimeEntry, b: UserAnimeEntry) => number {
  switch (sort) {
    case 'name':
      return (a, b) => titleCollator.compare(a.anime_name, b.anime_name);
    case 'score':
      return (a, b) => (b.score ?? 0) - (a.score ?? 0);
    case 'progress':
      return (a, b) => getCompletionRatio(b) - getCompletionRatio(a);
    case 'updated':
    default:
      return (a, b) => getUpdatedTimestamp(b) - getUpdatedTimestamp(a);
  }
}

function getCompletionRatio(anime: UserAnimeEntry): number {
  const { currentEpisode, totalEpisodes } = getAnimeProgress(anime);

  return totalEpisodes > 0 ? currentEpisode / totalEpisodes : 0;
}

function getUpdatedTimestamp(anime: UserAnimeEntry): number {
  const timestamp = Date.parse(anime.updated_at);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}
