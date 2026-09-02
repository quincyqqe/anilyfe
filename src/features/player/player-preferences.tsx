'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePlayer } from '@videojs/react';

const STORAGE_KEY = 'anilyfe:player-preferences';

export type Preferences = {
  volume: number;
  muted: boolean;
  playbackRate: number;
  skipOpening: boolean;
  skipEnding: boolean;
};

const defaults: Preferences = {
  volume: 1,
  muted: false,
  playbackRate: 1,
  skipOpening: false,
  skipEnding: false,
};

type PreferencesPatch = Partial<Preferences>;

type PlayerActions = {
  setVolume: (volume: number) => void;
  toggleMuted: () => void;
  setPlaybackRate: (rate: number) => void;
};

let preferences: Preferences = defaults;

const listeners = new Set<() => void>();

function load(): Preferences {
  if (typeof window === 'undefined') {
    return defaults;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaults;
    }

    const value = JSON.parse(raw) as Partial<Preferences>;

    return {
      ...defaults,
      ...value,

      skipOpening: value.skipOpening === true,
      skipEnding: value.skipEnding === true,
    };
  } catch {
    return defaults;
  }
}

function save(value: Preferences) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage может быть недоступен.
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function setPreferences(patch: PreferencesPatch) {
  preferences = {
    ...preferences,
    ...patch,
  };

  save(preferences);
  notify();
}

export function usePlayerPreferences() {
  const value = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    () => preferences,

    () => defaults,
  );

  useEffect(() => {
    preferences = load();
    notify();
  }, []);

  return {
    ...value,
    setPreferences,
  };
}

export function PlayerPreferencesPersistence() {
  const player = usePlayer();

  const actions = player as typeof player & PlayerActions;

  const restored = useRef(false);

  const state = usePlayer((state) => ({
    volume: state.volume as number,
    muted: state.muted as boolean,
    playbackRate: state.playbackRate as number,
    canPlay: state.canPlay as boolean,
  }));

  useEffect(() => {
    if (!state.canPlay || !player.target || restored.current) {
      return;
    }

    const saved = preferences;

    actions.setVolume(saved.volume);

    if (saved.muted !== state.muted) {
      actions.toggleMuted();
    }

    actions.setPlaybackRate(saved.playbackRate);

    restored.current = true;
  }, [player, actions, state.canPlay, state.muted]);

  useEffect(() => {
    if (!restored.current) {
      return;
    }

    preferences = {
      ...preferences,
      volume: state.volume,
      muted: state.muted,
      playbackRate: state.playbackRate,
    };

    save(preferences);
    notify();
  }, [state.volume, state.muted, state.playbackRate]);

  return null;
}
