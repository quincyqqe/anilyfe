'use client';

import { cn } from '@/lib/utils/cn';
import type { AnimeEpisode } from '@/shared/types/anime';
import { Play } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
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

const CONTROLS_HIDE_DELAY = 2600;

export function AnilyfeHlsPlayer({ episode, poster, initialTime, title, onProgress }: Props) {
  console.log('AnilyfeHlsPlayer render');

  const { videoRef, containerRef, state, actions } = usePlayer({
    episode,
    initialTime,
    onProgress,
  });

  const [controlsVisible, setControlsVisible] = useState(true);
  const [seekTrigger, setSeekTrigger] = useState<SeekTrigger>(null);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMoveRef = useRef(0);
  const videoReadyRef = useRef(false);

  const clearHideTimer = useCallback(() => {
    if (!hideTimerRef.current) return;
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  }, []);

  const revealControls = useCallback(() => {
    const now = Date.now();
    if (now - lastMoveRef.current < 100) return;
    lastMoveRef.current = now;

    clearHideTimer();
    setControlsVisible(true);

    if (!state.playing) return;

    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, CONTROLS_HIDE_DELAY);
  }, [clearHideTimer, state.playing]);

  useEffect(() => {
    revealControls();
    return clearHideTimer;
  }, [revealControls, clearHideTimer]);

  const handleTogglePlay = useCallback(() => {
    actions.togglePlay();
    revealControls();
  }, [actions, revealControls]);

  const handleSeekRelative = useCallback(
    (delta: number) => {
      actions.seekRelative(delta);

      setSeekTrigger({
        direction: delta > 0 ? 'forward' : 'backward',
        ts: Date.now(),
      });

      revealControls();
    },
    [actions, revealControls],
  );

  const handleSurfaceClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, [data-player-control]')) return;
      actions.togglePlay();
    },
    [actions],
  );

  const episodeNumber = episode.ordinal ?? episode.episode;

  const episodeTitle = episode?.name ?? title ?? `Эпизод ${episodeNumber}`;

  const episodeBadge = String(episodeNumber).padStart(2, '0');

  const hudVisible = useMemo(() => {
    return controlsVisible || !state.playing || !state.hasPlayed;
  }, [controlsVisible, state.playing, state.hasPlayed]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={handleSurfaceClick}
      onPointerMove={revealControls}
      onPointerDown={revealControls}
      onMouseLeave={() => {
        if (state.playing) setControlsVisible(false);
      }}
      className={cn(
        'group/player relative aspect-video w-full overflow-hidden bg-black outline-none select-none',
        'contain-layout contain-paint',
        state.isFullscreen
          ? 'rounded-none'
          : 'rounded-2xl border border-white/[0.06] shadow-[0_18px_48px_rgba(0,0,0,0.45)]',
        state.playing && !hudVisible && 'cursor-none',
      )}
    >
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedData={() => {
          requestAnimationFrame(() => {
            videoReadyRef.current = true;
          });
        }}
        className="relative z-[1] h-full w-full bg-black object-contain"
      />

      {poster && !videoReadyRef.current && (
        <div
          className="absolute inset-0 z-[2] bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-[3] transition-opacity duration-300',
          hudVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.2), transparent, rgba(0,0,0,0.5))',
            transition: 'opacity 300ms ease',
          }}
        />
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-3 sm:p-5',
          'transition-all duration-300',
          hudVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 sm:h-12 sm:w-12">
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/45">
              EP
            </span>
            <span className="text-base font-black tabular-nums text-white sm:text-lg">
              {episodeBadge}
            </span>
          </div>

          <div className="min-w-0 pt-0.5">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Anilyfe
            </span>
            <p className="max-w-[min(64vw,680px)] truncate text-sm font-semibold text-white sm:text-base">
              {episodeTitle}
            </p>
          </div>
        </div>
      </div>

      {!state.hasPlayed && (
        <button
          type="button"
          aria-label="Play"
          onClick={handleTogglePlay}
          className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition-transform duration-200 hover:scale-[1.03] active:scale-95 sm:h-20 sm:w-20"
        >
          <Play size={30} className="ml-1 fill-white" />
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
}
