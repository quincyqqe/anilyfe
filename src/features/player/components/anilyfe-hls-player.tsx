'use client';

import { cn } from '@/lib/utils/cn';
import type { AnimeEpisode } from '@/shared/types/anime';
import { Play } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { usePlayer } from '../lib/use-player';
import { CenterIndicator } from './custom/center-indicator';
import { ControlsOverlay } from './custom/controls-overlay';
import { PlayerLoading } from './custom/player-loading';
import { SkipButton } from './custom/skip-button';

interface Props {
  episode: AnimeEpisode;
  poster?: string;
  initialTime: number;
  title?: string;
  onProgress: (currentTime: number, duration: number) => void;
}

type SeekTrigger = {
  direction: 'forward' | 'backward';
  ts: number;
} | null;

const CONTROLS_HIDE_DELAY = 2800;

export const AnilyfeHlsPlayer = memo(function AnilyfeHlsPlayer({
  episode,
  poster,
  initialTime,
  title,
  onProgress,
}: Props) {
  const { videoRef, containerRef, state, actions } = usePlayer({
    episode,
    initialTime,
    onProgress,
  });

  console.log('render')
  const [controlsVisible, setControlsVisible] = useState(true);
  const [seekTrigger, setSeekTrigger] = useState<SeekTrigger>(null);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMoveTimeRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Keep a ref in sync with state.playing to avoid stale closure in revealControls
  useEffect(() => {
    isPlayingRef.current = state.playing;
  }, [state.playing]);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    if (!isPlayingRef.current) return;
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, CONTROLS_HIDE_DELAY);
  }, [clearHideTimer]);

  const revealControls = useCallback(() => {
    const now = Date.now();
    // throttle: ignore if called < 80ms ago
    if (now - lastMoveTimeRef.current < 80) return;
    lastMoveTimeRef.current = now;

    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  // When playback starts, schedule a hide; when paused, always show controls
  useEffect(() => {
    if (state.playing) {
      scheduleHide();
    } else {
      clearHideTimer();
      setControlsVisible(true);
    }
    return clearHideTimer;
  }, [state.playing, clearHideTimer, scheduleHide]);

  const handleTogglePlay = useCallback(() => {
    actions.togglePlay();
    revealControls();
  }, [actions, revealControls]);

  const handleSeekRelative = useCallback(
    (delta: number) => {
      actions.seekRelative(delta);
      setSeekTrigger({ direction: delta > 0 ? 'forward' : 'backward', ts: Date.now() });
      revealControls();
    },
    [actions, revealControls],
  );

  const handleSurfaceClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, [data-player-control]')) return;
      handleTogglePlay();
    },
    [handleTogglePlay],
  );

  const handleMouseLeave = useCallback(() => {
    if (state.playing) {
      clearHideTimer();
      setControlsVisible(false);
    }
  }, [state.playing, clearHideTimer]);

  const episodeNumber = episode.ordinal ?? episode.episode;
  const episodeTitle = episode?.name ?? title ?? `Эпизод ${episodeNumber}`;
  const episodeBadge = String(episodeNumber).padStart(2, '0');

  // Controls / HUD are visible when: controls are shown, OR paused, OR never played
  const hudVisible = useMemo(
    () => controlsVisible || !state.playing || !state.hasPlayed,
    [controlsVisible, state.playing, state.hasPlayed],
  );

  // Show poster until video has actual frame data
  const showPoster = poster && !state.videoReady;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={handleSurfaceClick}
      onPointerMove={revealControls}
      onPointerDown={revealControls}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group/player relative aspect-video w-full overflow-hidden bg-black outline-none select-none',
        'contain-layout contain-paint',
        state.isFullscreen
          ? 'rounded-none'
          : 'rounded-2xl border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.6)]',
        state.playing && !hudVisible && 'cursor-none',
      )}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className="relative z-[1] h-full w-full bg-black object-contain"
      />

      {/* Poster overlay — shown until video has data, fades out smoothly */}
      {poster && (
        <div
          className={cn(
            'absolute inset-0 z-[2] bg-cover bg-center transition-opacity duration-500',
            showPoster ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden
        />
      )}

      {/* Cinematic gradient overlay — always present, changes opacity with HUD */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 z-[3] transition-opacity duration-300',
          hudVisible ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Subtle always-on vignette so edges are always slightly darkened */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Top bar — episode info */}
      <div
        aria-hidden={!hudVisible}
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-3 sm:p-5',
          'transition-all duration-300 ease-out',
          hudVisible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          {/* Episode number badge */}
          <div className="flex h-11 w-11 flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm sm:h-12 sm:w-12 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/40">
              EP
            </span>
            <span className="text-base font-black tabular-nums text-white sm:text-lg">
              {episodeBadge}
            </span>
          </div>

          <div className="min-w-0 pt-0.5">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              Anilyfe
            </span>
            <p className="max-w-[min(64vw,680px)] truncate text-sm font-semibold text-white/90 sm:text-base">
              {episodeTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Big play button — shown only before first play */}
      {!state.hasPlayed && (
        <button
          type="button"
          aria-label="Воспроизвести"
          onClick={handleTogglePlay}
          className={cn(
            'absolute left-1/2 top-1/2 z-20',
            '-translate-x-1/2 -translate-y-1/2',
            'flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center',
            'rounded-full',
            'border border-white/15 bg-black/55 backdrop-blur-md',
            'text-white',
            'shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
            'transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95',
          )}
        >
          <Play size={30} className="ml-1 fill-white drop-shadow-md" />
        </button>
      )}

      <PlayerLoading visible={state.isBuffering || state.isSeeking} />

      <CenterIndicator playing={state.playing} seekTrigger={seekTrigger} />

      <SkipButton
        episode={episode}
        currentTime={state.currentTime}
        hudVisible={hudVisible}
        onSkip={actions.seek}
      />

      <ControlsOverlay
        state={state}
        actions={actions}
        visible={hudVisible}
        onSeekRelative={handleSeekRelative}
      />
    </div>
  );
});
