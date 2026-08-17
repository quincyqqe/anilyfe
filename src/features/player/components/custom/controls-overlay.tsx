'use client';

import {
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { memo } from 'react';

import type { PlayerActions, PlayerState } from '../../lib/use-player';
import { ProgressBar } from './progress-bar';
import { QualityMenu } from './quality-menu';
import { SettingsMenu } from './settings-menu';
import { VolumeControl } from './volume-control';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

interface ControlsOverlayProps {
  state: PlayerState;
  actions: PlayerActions;
  visible: boolean;
  onSeekRelative: (delta: number) => void;
}

const iconButtonBase =
  'flex items-center justify-center rounded-xl text-white/65 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80';

export const ControlsOverlay = memo(function ControlsOverlay({
  state,
  actions,
  visible,
  onSeekRelative,
}: ControlsOverlayProps) {
  return (
    <div
      data-player-control
      className="absolute inset-x-0 bottom-0 z-30 transition-all duration-300 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      />

      <div className="relative flex flex-col">
        <ProgressBar
          currentTime={state.currentTime}
          duration={state.duration}
          buffered={state.buffered}
          onSeek={actions.seek}
        />

        <div className="flex flex-wrap items-center gap-1.5 px-3 pb-3 pt-0.5 sm:flex-nowrap sm:px-4 sm:pb-4">
          <div className="flex min-w-0 items-center gap-0.5">
            <button
              type="button"
              onClick={actions.togglePlay}
              aria-label={state.playing ? 'Пауза' : 'Воспроизвести'}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/12 text-white transition-all duration-150 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
            >
              {state.playing ? (
                <Pause size={18} className="fill-white" />
              ) : (
                <Play size={18} className="ml-0.5 fill-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSeekRelative(-10)}
              aria-label="Назад 10 секунд"
              className={`hidden h-9 w-9 sm:flex ${iconButtonBase}`}
            >
              <RotateCcw size={17} />
            </button>

            <button
              type="button"
              onClick={() => onSeekRelative(10)}
              aria-label="Вперёд 10 секунд"
              className={`hidden h-9 w-9 sm:flex ${iconButtonBase}`}
            >
              <RotateCw size={17} />
            </button>

            <VolumeControl
              volume={state.volume}
              muted={state.muted}
              onVolumeChange={actions.setVolume}
              onToggleMute={actions.toggleMute}
            />

            <div className="ml-1 flex items-center gap-1 text-[12px] font-medium tabular-nums text-white/50 select-none">
              <span className="text-white/90">{formatTime(state.currentTime)}</span>
              <span>/</span>
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-0.5">
            <SettingsMenu playbackRate={state.playbackRate} onSetRate={actions.setPlaybackRate} />

            <QualityMenu
              qualities={state.qualities}
              activeUrl={state.activeQualityUrl}
              onSelect={actions.setQuality}
            />

            {state.canPip && (
              <button
                type="button"
                onClick={actions.togglePip}
                aria-label="Картинка в картинке"
                className={`h-9 w-9 ${iconButtonBase}`}
              >
                <PictureInPicture2 size={16} />
              </button>
            )}

            <button
              type="button"
              aria-label={state.isFullscreen ? 'Выйти из полноэкранного режима' : 'Полный экран'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                actions.toggleFullscreen();
              }}
              className={`h-9 w-9 ${iconButtonBase}`}
            >
              {state.isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
