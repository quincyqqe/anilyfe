const VOLUME_KEY = 'anilyfe-player-volume';
const MUTED_KEY = 'anilyfe-player-muted';
const RATE_KEY = 'anilyfe-player-rate';

export interface PlayerPreferences {
  volume: number;
  muted: boolean;
  playbackRate: number;
}

function readStorage(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;

  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function readNumberStorage(key: string, fallback: number): number {
  const value = Number.parseFloat(readStorage(key, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

export function readPlayerPreferences(): PlayerPreferences {
  return {
    volume: Math.max(0, Math.min(1, readNumberStorage(VOLUME_KEY, 1))),
    muted: readStorage(MUTED_KEY, 'false') === 'true',
    playbackRate: Math.max(0.25, Math.min(2, readNumberStorage(RATE_KEY, 1))),
  };
}

export function writePlayerPreference(
  key: 'volume' | 'muted' | 'playbackRate',
  value: number | boolean,
) {
  if (typeof window === 'undefined') return;

  const storageKey = key === 'volume' ? VOLUME_KEY : key === 'muted' ? MUTED_KEY : RATE_KEY;

  try {
    window.localStorage.setItem(storageKey, String(value));
  } catch {
    // Storage can be unavailable in private browsing or embedded contexts.
  }
}
