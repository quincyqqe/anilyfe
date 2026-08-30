import type { AnimeEpisode } from '@/shared/types/anime';

export interface PlayerProgress {
  current_episode: number | null;
  episode_progress: number | null;
  episode_duration: number | null;
}

export interface QualityLevel {
  label: string;
  url: string;
}

type PlayerStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'seeking'
  | 'ended'
  | 'error';

export interface PlayerError {
  kind: 'network' | 'media' | 'unsupported' | 'unknown';
  message: string;
  retryable: boolean;
}

export interface PlayerState {
  status: PlayerStatus;
  playing: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPip: boolean;
  canPip: boolean;
  isBuffering: boolean;
  isSeeking: boolean;
  qualities: QualityLevel[];
  activeQualityUrl: string | null;
  hasPlayed: boolean;
  videoReady: boolean;
  error: PlayerError | null;
}

export interface PlayerActions {
  togglePlay: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (url: string) => void;
  toggleFullscreen: () => void;
  togglePip: () => void;
  retry: () => void;
}

/**
 * Для обычного AniLyfe:
 *   hls_1080
 *   hls_720
 *   hls_480
 *
 * Для Hentai:
 *   hls = master playlist
 *
 * HLS.js сам выберет качество из master playlist.
 */
export function buildQualities(
  episode: AnimeEpisode,
): QualityLevel[] {
  const hentaiHls = (episode as AnimeEpisode & {
    hls?: string;
  }).hls;

  if (hentaiHls?.trim()) {
    return [
      {
        label: 'Auto',
        url: hentaiHls,
      },
    ];
  }

  const candidates = [
    ['1080p', episode.hls_1080],
    ['720p', episode.hls_720],
    ['480p', episode.hls_480],
  ] as const;

  const qualities: QualityLevel[] = [];

  for (const [label, url] of candidates) {
    if (url?.trim()) {
      qualities.push({
        label,
        url,
      });
    }
  }

  return qualities;
}

export function getBestUrl(
  episode: AnimeEpisode,
): string | null {
  return buildQualities(episode)[0]?.url ?? null;
}