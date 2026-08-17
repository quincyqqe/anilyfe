'use client';

import type { AnimeEpisode } from '@/shared/types/anime';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { usePlayerBrowser } from '../hooks/use-player-browser';
import {
  buildQualities,
  getBestUrl,
  type PlayerActions,
  type PlayerError,
  type PlayerState,
} from '../model/player-types';
import { readPlayerPreferences, writePlayerPreference } from './player-storage';

import type Hls from 'hls.js';

export type { PlayerActions, PlayerError, PlayerState, QualityLevel } from '../model/player-types';

interface UsePlayerOptions {
  episode: AnimeEpisode;
  initialTime?: number;
  onProgress?: (currentTime: number, duration: number) => void;
  title?: string;
  artist?: string;
  artwork?: string;
}

type PlayerAction = { type: 'patch'; patch: Partial<PlayerState> };

const INITIAL_STATE: PlayerState = {
  status: 'idle',
  playing: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  muted: false,
  playbackRate: 1,
  isFullscreen: false,
  isPip: false,
  canPip: false,
  isBuffering: false,
  isSeeking: false,
  qualities: [],
  activeQualityUrl: null,
  hasPlayed: false,
  videoReady: false,
  error: null,
};

const SAVE_INTERVAL_MS = 10_000;

function reducer(state: PlayerState, action: PlayerAction): PlayerState {
  return { ...state, ...action.patch };
}

function getBufferedEnd(video: HTMLVideoElement): number {
  const currentTime = video.currentTime;

  for (let index = 0; index < video.buffered.length; index += 1) {
    const start = video.buffered.start(index);
    const end = video.buffered.end(index);
    if (currentTime >= start && currentTime <= end) return end;
  }

  return video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
}

function getPlayerError(kind: PlayerError['kind'], message: string, retryable = true): PlayerError {
  return { kind, message, retryable };
}

export function usePlayer({
  episode,
  initialTime = 0,
  onProgress,
  title,
  artist,
  artwork,
}: UsePlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const nativeCleanupRef = useRef<(() => void) | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sourceGenerationRef = useRef(0);
  const pendingRestoreRef = useRef<{
    generation: number;
    time: number;
    autoplay: boolean;
  } | null>(null);
  const onProgressRef = useRef(onProgress);
  const [reloadKey, setReloadKey] = useState(0);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const patch = useCallback((patchValue: Partial<PlayerState>) => {
    dispatch({ type: 'patch', patch: patchValue });
  }, []);

  const clearSource = useCallback(() => {
    nativeCleanupRef.current?.();
    nativeCleanupRef.current = null;

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    hlsRef.current?.destroy();
    hlsRef.current = null;
    pendingRestoreRef.current = null;

    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.removeAttribute('src');
    video.load();
  }, []);

  const loadSource = useCallback(
    async (url: string, resumeTime: number, autoplay: boolean) => {
      const video = videoRef.current;
      if (!video) return;

      const generation = sourceGenerationRef.current + 1;
      sourceGenerationRef.current = generation;
      clearSource();

      pendingRestoreRef.current = { generation, time: resumeTime, autoplay };
      patch({
        status: 'loading',
        playing: false,
        currentTime: 0,
        duration: 0,
        buffered: 0,
        isBuffering: true,
        isSeeking: false,
        videoReady: false,
        error: null,
      });

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        const onLoadedMetadata = () => {
          if (sourceGenerationRef.current !== generation) return;
          patch({ status: 'ready', isBuffering: false });
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
        nativeCleanupRef.current = () =>
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.src = url;
        video.load();
        return;
      }

      try {
        const HlsConstructor = (await import('hls.js')).default;
        if (sourceGenerationRef.current !== generation) return;

        if (!HlsConstructor.isSupported()) {
          patch({
            status: 'error',
            isBuffering: false,
            error: getPlayerError('unsupported', 'This browser cannot play this stream.', false),
          });
          return;
        }

        let networkRetries = 0;
        let mediaRetries = 0;
        const hls = new HlsConstructor({
          startLevel: -1,
          capLevelToPlayerSize: true,
          backBufferLength: 60,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        });

        hlsRef.current = hls;
        hls.on(HlsConstructor.Events.MANIFEST_PARSED, () => {
          if (sourceGenerationRef.current !== generation) return;
          patch({ status: 'ready', error: null });
        });
        hls.on(HlsConstructor.Events.ERROR, (_event, data) => {
          if (sourceGenerationRef.current !== generation || !data.fatal) return;

          if (data.type === HlsConstructor.ErrorTypes.NETWORK_ERROR && networkRetries < 3) {
            networkRetries += 1;
            retryTimerRef.current = setTimeout(
              () => {
                if (sourceGenerationRef.current === generation) hls.startLoad();
              },
              500 * 2 ** (networkRetries - 1),
            );
            return;
          }

          if (data.type === HlsConstructor.ErrorTypes.MEDIA_ERROR && mediaRetries < 2) {
            mediaRetries += 1;
            hls.recoverMediaError();
            return;
          }

          const kind = data.type === HlsConstructor.ErrorTypes.NETWORK_ERROR ? 'network' : 'media';
          patch({
            status: 'error',
            isBuffering: false,
            playing: false,
            error: getPlayerError(kind, 'Playback failed. Try again.', true),
          });
        });

        hls.loadSource(url);
        hls.attachMedia(video);
      } catch {
        if (sourceGenerationRef.current !== generation) return;
        patch({
          status: 'error',
          isBuffering: false,
          error: getPlayerError('unknown', 'The stream could not be loaded.', true),
        });
      }
    },
    [clearSource, patch],
  );

  useEffect(() => {
    const qualities = buildQualities(episode);
    const url = getBestUrl(episode);

    patch({
      qualities,
      activeQualityUrl: url,
      status: url ? 'loading' : 'error',
      error: url ? null : getPlayerError('unsupported', 'No playable stream is available.', false),
    });

    if (url) void loadSource(url, initialTime, false);

    return () => {
      sourceGenerationRef.current += 1;
      clearSource();
    };
  }, [clearSource, episode, initialTime, loadSource, patch, reloadKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const preferences = readPlayerPreferences();
    video.volume = preferences.volume;
    video.muted = preferences.muted;
    video.playbackRate = preferences.playbackRate;
    patch(preferences);
  }, [patch]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frameId: number | null = null;
    const publishTime = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        patch({ currentTime: video.currentTime, buffered: getBufferedEnd(video) });
      });
    };
    const onPlay = () => patch({ status: 'playing', playing: true, hasPlayed: true, error: null });
    const onPause = () => patch({ status: 'paused', playing: false });
    const onDurationChange = () => patch({ duration: video.duration || 0 });
    const onVolumeChange = () => {
      patch({ volume: video.volume, muted: video.muted });
      writePlayerPreference('volume', video.volume);
      writePlayerPreference('muted', video.muted);
    };
    const onRateChange = () => {
      patch({ playbackRate: video.playbackRate });
      writePlayerPreference('playbackRate', video.playbackRate);
    };
    const onWaiting = () => patch({ status: 'buffering', isBuffering: true });
    const onCanPlay = () =>
      patch({ status: video.paused ? 'paused' : 'playing', isBuffering: false, isSeeking: false });
    const onSeeking = () => patch({ status: 'seeking', isSeeking: true });
    const onSeeked = () => patch({ isSeeking: false });
    const onEnded = () => patch({ status: 'ended', playing: false, isBuffering: false });
    const onLoadedData = () => patch({ videoReady: true });
    const onError = () => {
      if (video.error?.code !== MediaError.MEDIA_ERR_ABORTED && sourceGenerationRef.current > 0) {
        patch({
          status: 'error',
          playing: false,
          isBuffering: false,
          error: getPlayerError('media', 'The video could not be decoded.', true),
        });
      }
    };
    const onLoadedMetadata = () => {
      const pending = pendingRestoreRef.current;
      if (!pending || pending.generation !== sourceGenerationRef.current) return;

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const maxTime = duration > 1 ? duration - 0.5 : duration;
      const time = Math.max(0, Math.min(pending.time, Math.max(0, maxTime)));
      if (time > 0) video.currentTime = time;
      if (pending.autoplay) video.play().catch(() => undefined);
      pendingRestoreRef.current = null;
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', publishTime);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('ratechange', onRateChange);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlay);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('ended', onEnded);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('error', onError);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', publishTime);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('ratechange', onRateChange);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlay);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
    };
  }, [patch]);

  const flushProgress = useCallback(() => {
    const video = videoRef.current;
    if (video && video.currentTime > 0) {
      onProgressRef.current?.(video.currentTime, video.duration);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = window.setInterval(() => {
      if (!video.paused && video.currentTime > 0) {
        onProgressRef.current?.(video.currentTime, video.duration);
      }
    }, SAVE_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushProgress();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', flushProgress);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', flushProgress);
      flushProgress();
    };
  }, [flushProgress]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        patch({
          status: 'error',
          error: getPlayerError('unknown', 'Playback was blocked. Press play to try again.', true),
        });
      });
    } else {
      video.pause();
    }
  }, [patch]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(time)) return;
    video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
  }, []);

  const seekRelative = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(delta)) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + delta, video.duration || 0));
  }, []);

  const setVolume = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(value)) return;
    video.volume = Math.max(0, Math.min(1, value));
    if (video.muted && value > 0) video.muted = false;
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  }, []);

  const setPlaybackRate = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(value)) return;
    video.playbackRate = Math.max(0.25, Math.min(2, value));
  }, []);

  const setQuality = useCallback(
    (url: string) => {
      const quality = state.qualities.find((item) => item.url === url);
      const video = videoRef.current;
      if (!quality || !video || url === state.activeQualityUrl) return;

      void loadSource(url, video.currentTime, !video.paused);
      patch({ activeQualityUrl: quality.url });
    },
    [loadSource, patch, state.activeQualityUrl, state.qualities],
  );

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  const onFullscreenChange = useCallback(
    (value: boolean) => patch({ isFullscreen: value }),
    [patch],
  );
  const onPipChange = useCallback((value: boolean) => patch({ isPip: value }), [patch]);
  const onPipSupportChange = useCallback((value: boolean) => patch({ canPip: value }), [patch]);
  const browser = usePlayerBrowser({
    videoRef,
    containerRef,
    title,
    artist,
    artwork,
    togglePlay,
    seekRelative,
    setVolume,
    toggleMute,
    onFullscreenChange,
    onPipChange,
    onPipSupportChange,
  });

  const actions = useMemo<PlayerActions>(
    () => ({
      togglePlay,
      seek,
      seekRelative,
      setVolume,
      toggleMute,
      setPlaybackRate,
      setQuality,
      toggleFullscreen: browser.toggleFullscreen,
      togglePip: browser.togglePip,
      retry,
    }),
    [
      browser.toggleFullscreen,
      browser.togglePip,
      retry,
      seek,
      seekRelative,
      setPlaybackRate,
      setQuality,
      setVolume,
      toggleMute,
      togglePlay,
    ],
  );

  return { videoRef, containerRef, state, actions, handleKeyDown: browser.handleKeyDown };
}
