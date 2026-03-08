'use client';

import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import { AnimeEpisode } from '@/shared/types/anime';
import { attachHls } from '../lib/hls';
import { buildQualityList, getBestUrl } from '../lib/quality';
import { mountSkipSegments } from '../lib/skip-segments';

const SAVE_INTERVAL_MS = 10_000;

interface Props {
  episode: AnimeEpisode;
  poster: string | undefined;
  initialTime: number;
  onProgress: (currentTime: number, duration: number) => void;
}

export function PlayerView({ episode, poster, initialTime, onProgress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onProgressRef = useRef(onProgress);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const url = getBestUrl(episode);
    if (!url) return;

    artRef.current?.destroy(false);
    containerRef.current.innerHTML = '';

    const art = new Artplayer({
      container: containerRef.current,
      url,
      type: 'm3u8',
      quality: buildQualityList(episode),
      setting: true,
      volume: 1,
      poster: poster ?? '',
      pip: true,
      screenshot: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      mutex: true,
      playsInline: true,
      theme: 'var(--color-primary, #23ade5)',
      lang: 'ru',
      moreVideoAttr: { crossOrigin: 'anonymous' },
      customType: { m3u8: attachHls },
    });

    artRef.current = art;

    const clearTimer = () => {
      if (saveTimerRef.current) {
        clearInterval(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };

    art.on('ready', () => {
      mountSkipSegments(art, episode);
      if (initialTime > 0) {
        art.currentTime = initialTime;
      }
    });

    art.on('play', () => {
      clearTimer();
      saveTimerRef.current = setInterval(() => {
        onProgressRef.current(art.currentTime, art.duration);
      }, SAVE_INTERVAL_MS);
    });

    art.on('pause', () => {
      clearTimer();
      onProgressRef.current(art.currentTime, art.duration);
    });

    art.on('video:ended', () => {
      clearTimer();
      onProgressRef.current(art.currentTime, art.duration);
    });

    return () => {
      clearTimer();
      art.destroy(false);
      artRef.current = null;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [episode, poster]);

  return (
    <div className="rounded-2xl border border-white/6 bg-white/2 backdrop-blur-sm overflow-hidden shadow-2xl">
      <div ref={containerRef} className="aspect-video w-full bg-zinc-950" id="anilyfe-player" />
    </div>
  );
}

const artRef = { current: null as Artplayer | null };
