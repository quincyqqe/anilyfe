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

import type { PlayerActions, PlayerState } from '../../lib/use-player';

import { ProgressBar } from './progress-bar';
import { QualityMenu } from './quality-menu';
import { SettingsMenu } from './settings-menu';
import { VolumeControl } from './volume-control';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

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

const controlButtonClass =
  `
  flex items-center justify-center
  rounded-xl

  text-white/72

  transition-all duration-200

  hover:bg-white/10
  hover:text-white

  active:scale-95
  focus:outline-none
  `;

export function ControlsOverlay({
  state,
  actions,
  visible,
  onSeekRelative,
}: ControlsOverlayProps) {
  return (
    <div
      data-player-control
      className="
        absolute inset-x-0 bottom-0 z-30
        transition-all duration-300 ease-out
      "
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="flex flex-col">
        <ProgressBar
          currentTime={state.currentTime}
          duration={state.duration}
          buffered={state.buffered}
          onSeek={actions.seek}
        />

        <div
          className="
            flex flex-wrap items-center gap-2

            px-3 pb-3 pt-1

            sm:flex-nowrap
            sm:px-4 sm:pb-4
          "
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={actions.togglePlay}
              aria-label={state.playing ? 'Pause' : 'Play'}
              className="
                flex h-10 w-10 items-center justify-center

                rounded-xl

                bg-white/10

                text-white

                transition-all duration-200

                hover:bg-white/15

                active:scale-95
              "
            >
              {state.playing ? (
                <Pause size={20} className="fill-white" />
              ) : (
                <Play size={20} className="ml-0.5 fill-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSeekRelative(-10)}
              aria-label="Back 10 seconds"
              className={`hidden h-9 w-9 sm:flex ${controlButtonClass}`}
            >
              <RotateCcw size={18} />
            </button>

            <button
              type="button"
              onClick={() => onSeekRelative(10)}
              aria-label="Forward 10 seconds"
              className={`hidden h-9 w-9 sm:flex ${controlButtonClass}`}
            >
              <RotateCw size={18} />
            </button>

            <VolumeControl
              volume={state.volume}
              muted={state.muted}
              onVolumeChange={actions.setVolume}
              onToggleMute={actions.toggleMute}
            />

            <div
              className="
                ml-0.5 flex items-center gap-1.5

                text-[12px]
                font-medium
                tabular-nums

                text-white/55

                select-none
              "
            >
              <span className="text-white/92">
                {formatTime(state.currentTime)}
              </span>

              <span>/</span>

              <span>{formatTime(state.duration)}</span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <SettingsMenu
              playbackRate={state.playbackRate}
              onSetRate={actions.setPlaybackRate}
            />

            <QualityMenu
              qualities={state.qualities}
              activeUrl={state.activeQualityUrl}
              onSelect={actions.setQuality}
            />

            <button
              type="button"
              onClick={actions.togglePip}
              aria-label="Picture in Picture"
              className={`h-9 w-9 ${controlButtonClass}`}
            >
              <PictureInPicture2 size={17} />
            </button>

            <button
              type="button"
              aria-label={
                state.isFullscreen
                  ? 'Exit fullscreen'
                  : 'Fullscreen'
              }
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={(event) => {
                event.currentTarget.blur();
                actions.toggleFullscreen();
              }}
              className={`h-9 w-9 ${controlButtonClass}`}
            >
              {state.isFullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
