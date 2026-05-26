'use client';

import type { AnimeEpisode } from '@/shared/types/anime';
import Hls from 'hls.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface QualityLevel {
  label: string;
  url: string;
}

export interface PlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPip: boolean;
  isBuffering: boolean;
  isSeeking: boolean;
  qualities: QualityLevel[];
  activeQualityUrl: string | null;
  hasPlayed: boolean;
  videoReady: boolean;
}

export interface PlayerActions {
  togglePlay: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (r: number) => void;
  setQuality: (url: string) => void;
  toggleFullscreen: () => void;
  togglePip: () => void;
}

interface UsePlayerOptions {
  episode: AnimeEpisode;
  poster?: string;
  initialTime?: number;
  onProgress?: (currentTime: number, duration: number) => void;
}

const SAVE_INTERVAL_MS = 10_000;
const VOLUME_KEY = 'anilyfe-player-volume';
const MUTED_KEY = 'anilyfe-player-muted';
const RATE_KEY = 'anilyfe-player-rate';

function buildQualities(ep: AnimeEpisode): QualityLevel[] {
  const list: QualityLevel[] = [];
  if (ep.hls_1080) list.push({ label: '1080p', url: ep.hls_1080 });
  if (ep.hls_720) list.push({ label: '720p', url: ep.hls_720 });
  if (ep.hls_480) list.push({ label: '480p', url: ep.hls_480 });
  return list;
}

function getBestUrl(ep: AnimeEpisode): string | null {
  return ep.hls_1080 ?? ep.hls_720 ?? ep.hls_480 ?? null;
}

function getBufferedEnd(video: HTMLVideoElement): number {
  if (video.buffered.length === 0) return 0;

  for (let i = 0; i < video.buffered.length; i++) {
    if (video.currentTime <= video.buffered.end(i)) {
      return video.buffered.end(i);
    }
  }
  return video.buffered.end(video.buffered.length - 1);
}

function readStorage(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function readNumberStorage(key: string, fallback: number): number {
  const value = Number.parseFloat(readStorage(key, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

function readPlaybackRate(): number {
  return Math.max(0.25, Math.min(2, readNumberStorage(RATE_KEY, 1)));
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function usePlayer({ episode, initialTime = 0, onProgress }: UsePlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const onProgressRef = useRef(onProgress);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const [state, setState] = useState<PlayerState>(() => ({
    playing: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: readNumberStorage(VOLUME_KEY, 1),
    muted: readStorage(MUTED_KEY, 'false') === 'true',
    playbackRate: readPlaybackRate(),
    isFullscreen: false,
    isPip: false,
    isBuffering: false,
    isSeeking: false,
    qualities: buildQualities(episode),
    activeQualityUrl: getBestUrl(episode),
    hasPlayed: false,
    videoReady: false,
  }));

  const patch = useCallback((p: Partial<PlayerState>) => {
    setState((prev) => ({ ...prev, ...p }));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const url = getBestUrl(episode);
    if (!url) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const qualities = buildQualities(episode);
    const volume = readNumberStorage(VOLUME_KEY, 1);
    const muted = readStorage(MUTED_KEY, 'false') === 'true';
    const rate = readPlaybackRate();

    video.volume = volume;
    video.muted = muted;
    video.playbackRate = rate;

    patch({
      qualities,
      activeQualityUrl: url,
      hasPlayed: false,
      playing: false,
      currentTime: 0,
      duration: 0,
      buffered: 0,
      volume,
      muted,
      playbackRate: rate,
      videoReady: false,
    });

    if (Hls.isSupported()) {
      const hls = new Hls({
        startLevel: -1,
        backBufferLength: 60,
        maxMaxBufferLength: 30,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.playbackRate = rate;
        if (initialTime > 5) video.currentTime = initialTime;
      });

      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else hls.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener(
        'loadedmetadata',
        () => {
          video.playbackRate = rate;
          if (initialTime > 5) video.currentTime = initialTime;
        },
        { once: true },
      );
    }

    return () => {};
  }, [episode, initialTime, patch]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (saveTimerRef.current) {
        clearInterval(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => patch({ playing: true, hasPlayed: true });
    const onPause = () => patch({ playing: false });
    const onTimeUpdate = () =>
      patch({ currentTime: video.currentTime, buffered: getBufferedEnd(video) });
    const onDurationChange = () => patch({ duration: video.duration || 0 });
    const onVolumeChange = () => {
      patch({ volume: video.volume, muted: video.muted });
      writeStorage(VOLUME_KEY, String(video.volume));
      writeStorage(MUTED_KEY, String(video.muted));
    };
    const onRateChange = () => {
      patch({ playbackRate: video.playbackRate });
      writeStorage(RATE_KEY, String(video.playbackRate));
    };
    const onWaiting = () => patch({ isBuffering: true });
    const onCanPlay = () => patch({ isBuffering: false, isSeeking: false });
    const onSeeking = () => patch({ isSeeking: true });
    const onSeeked = () => patch({ isSeeking: false });
    const onEnded = () => patch({ playing: false });
    const onLoadedData = () => patch({ videoReady: true });

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
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

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
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
    };
  }, [patch]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!state.playing) {
      if (state.hasPlayed && video.currentTime > 0) {
        onProgressRef.current?.(video.currentTime, video.duration);
      }
      return;
    }

    const id = setInterval(() => {
      if (video.currentTime > 0) {
        onProgressRef.current?.(video.currentTime, video.duration);
      }
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [state.playing, state.hasPlayed]);

  useEffect(() => {
    const handler = () => patch({ isFullscreen: !!document.fullscreenElement });
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [patch]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnter = () => patch({ isPip: true });
    const onLeave = () => patch({ isPip: false });

    video.addEventListener('enterpictureinpicture', onEnter);
    video.addEventListener('leavepictureinpicture', onLeave);

    return () => {
      video.removeEventListener('enterpictureinpicture', onEnter);
      video.removeEventListener('leavepictureinpicture', onLeave);
    };
  }, [patch]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
  }, []);

  const seekRelative = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + delta, video.duration || 0));
  }, []);

  const setVolume = useCallback((v: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.max(0, Math.min(1, v));
    if (video.muted && v > 0) video.muted = false;
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const setPlaybackRate = useCallback(
    (r: number) => {
      const video = videoRef.current;
      if (!video) return;
      const rate = Math.max(0.25, Math.min(2, r));
      video.playbackRate = rate;
      writeStorage(RATE_KEY, String(rate));
      patch({ playbackRate: rate });
    },
    [patch],
  );

  const setQuality = useCallback(
    (url: string) => {
      const video = videoRef.current;
      if (!video) return;

      const currentTime = video.currentTime;
      const wasPlaying = !video.paused;
      const rate = video.playbackRate;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      patch({ activeQualityUrl: url, isBuffering: true });

      if (Hls.isSupported()) {
        const hls = new Hls({ startLevel: -1 });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.currentTime = currentTime;
          video.playbackRate = rate;
          if (wasPlaying) video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) hls.destroy();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener(
          'loadedmetadata',
          () => {
            video.currentTime = currentTime;
            video.playbackRate = rate;
            if (wasPlaying) video.play().catch(() => {});
          },
          { once: true },
        );
      }
    },
    [patch],
  );

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  const togglePip = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((videoRef.current?.volume ?? 1) + 0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((videoRef.current?.volume ?? 1) - 0.05);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay, seekRelative, setVolume, toggleMute, toggleFullscreen]);

  const actions = useMemo(
    () => ({
      togglePlay,
      seek,
      seekRelative,
      setVolume,
      toggleMute,
      setPlaybackRate,
      setQuality,
      toggleFullscreen,
      togglePip,
    }),
    [togglePlay, seek, seekRelative, setVolume, toggleMute, setPlaybackRate, setQuality, toggleFullscreen, togglePip],
  );

  return { videoRef, containerRef, state, actions };
}
