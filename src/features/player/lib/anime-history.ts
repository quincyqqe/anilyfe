interface HistoryItem {
  animeId: number;
  animeSlug?: string;
  animeTitle?: string;
  episode: number;
  preview?: string;
  time: number;
  timeLeft: number;
}

const STORAGE_KEY = 'anime_history';

export function saveAnimeHistory(item: HistoryItem) {
  try {
    const history: HistoryItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const updated = history
      .filter((h) => h.animeId !== item.animeId)
      .concat(item)
      .slice(-10)
      .reverse();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('[anime-history]', e);
  }
}
