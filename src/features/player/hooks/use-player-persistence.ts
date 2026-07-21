'use client';

import { useCallback, useEffect, useRef } from 'react';

interface ProgressPayload {
  currentEpisode: number;
  episodeProgress: number;
  episodeDuration: number;
}

interface UsePlayerPersistenceOptions {
  animeSlug: string;
  enabled: boolean;
}

const SAVE_INTERVAL_MS = 10_000;

export function usePlayerPersistence({ animeSlug, enabled }: UsePlayerPersistenceOptions) {
  const latestRef = useRef<ProgressPayload | null>(null);
  const lastSavedAtRef = useRef(0);
  const queueRef = useRef(Promise.resolve());

  const postProgress = useCallback(
    async (payload: ProgressPayload, keepalive = false) => {
      const response = await fetch('/anime-progress', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ animeSlug, ...payload }),
        keepalive,
      });

      if (!response.ok) {
        throw new Error(`Progress request failed with status ${response.status}`);
      }
    },
    [animeSlug],
  );

  const flush = useCallback(() => {
    const payload = latestRef.current;
    if (!enabled || !payload) return;

    const body = JSON.stringify({ animeSlug, ...payload });
    const blob = new Blob([body], { type: 'application/json' });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon('/anime-progress', blob)) {
      return;
    }

    void postProgress(payload, true).catch(() => undefined);
  }, [animeSlug, enabled, postProgress]);

  const save = useCallback(
    (currentEpisode: number, episodeProgress: number, episodeDuration: number, force = false) => {
      const payload = {
        currentEpisode: Math.max(1, Math.round(currentEpisode)),
        episodeProgress: Math.max(0, Math.round(episodeProgress)),
        episodeDuration: Math.max(0, Math.round(episodeDuration)),
      };
      latestRef.current = payload;

      if (!enabled) return;

      const now = Date.now();
      if (!force && now - lastSavedAtRef.current < SAVE_INTERVAL_MS) return;

      lastSavedAtRef.current = now;
      queueRef.current = queueRef.current.catch(() => undefined).then(() => postProgress(payload));
    },
    [enabled, postProgress],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', flush);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [flush]);

  return save;
}
