'use client';

import { useEffect, type ReactNode } from 'react';

import { PlayerProgress } from './player-progress';

import {
  CaptionsOffIcon,
  CaptionsOnIcon,
  ChevronIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  PauseIcon,
  PipEnterIcon,
  PipExitIcon,
  PlayIcon,
  RestartIcon,
  SpinnerIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeOffIcon,
} from '@videojs/react/icons';

import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  ErrorDialog,
  Gesture,
  Hotkey,
  SeekIndicator,
  StatusAnnouncer,
  StatusIndicator,
  Time,
  TimeSlider,
  Tooltip,
  VolumeIndicator,
  PlayButton,
} from '@videojs/react';

import { HlsJsVideo } from '@videojs/react/media/hlsjs-video';

import { Player, useMedia } from './player';

import { Button } from './components/button';
import { SettingsMenu } from './components/settings-menu';
import { VolumePopover } from './components/volume-popover';
import { CastControl } from './components/cast-control';
import { AirPlayControl } from './components/airplay-control';
import { PiPControl } from './components/pip-control';
import { FullscreenControl } from './components/fullscreen-control';

import './player.css';

const SEEK_TIME = 10;

const TOP_STATUS_ACTIONS = [
  'toggleSubtitles',
  'toggleFullscreen',
  'togglePictureInPicture',
] as const;

const CENTER_STATUS_ACTIONS = ['togglePaused'] as const;

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  animeTitle: string;
  initialTime: number;
  title: string;
  onProgress: (currentTime: number, duration: number) => void;
}

export function VideoPlayer({
  src,
  poster,
  animeTitle,
  initialTime,
  title,
  onProgress,
}: VideoPlayerProps): ReactNode {
  return (
    <Player title={`${animeTitle} - ${title}`}>
      <Container className="media-default-skin media-default-skin--video aspect-video ">
        <HlsJsVideo
          source={{
            src,
            type: 'application/vnd.apple.mpegurl',

            engine: {
              hlsJs: {
                enableWorker: true,
                useMediaCapabilities: true,
                enableWebVTT: false,

                maxBufferLength: 30,
                maxMaxBufferLength: 30,
                maxBufferSize: 30 * 1000 * 1000,
                backBufferLength: 15,

                startFragPrefetch: false,

                startLevel: -1,
                capLevelToPlayerSize: false,

                maxBufferHole: 0.1,
                maxFragLookUpTolerance: 0.25,
              },
            },
          }}

          poster={poster}
          playsInline
        />

        <PlayerProgress initialTime={initialTime} onProgress={onProgress} />

        {/* Buffering */}

        <BufferingIndicator
          render={(props) => (
            <div {...props} className="media-buffering-indicator">
              <SpinnerIcon className="media-icon" />
            </div>
          )}
        />

        {/* Error */}

        <ErrorDialog.Root>
          <ErrorDialog.Popup className="media-error">
            <div className="media-error__dialog media-surface">
              <div className="media-error__content">
                <ErrorDialog.Title className="media-error__title" />

                <ErrorDialog.Description className="media-error__description" />
              </div>

              <div className="media-error__actions">
                <ErrorDialog.Close className="media-button media-button--primary" />
              </div>
            </div>
          </ErrorDialog.Popup>
        </ErrorDialog.Root>

        {/* Controls */}

        <Controls.Root className="media-surface media-controls media-controls--root">
          <Tooltip.Provider>
            {/* Primary controls */}

            <div className="media-surface media-controls media-controls--primary">
              {/* Left */}

              <div className="media-button-group">
                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <PlayButton className="media-button--play" render={<Button />}>
                        <RestartIcon className="media-icon media-icon--restart" />
                        <PlayIcon className="media-icon media-icon--play" />
                        <PauseIcon className="media-icon media-icon--pause" />
                      </PlayButton>
                    }
                  />

                  <Tooltip.Popup className="media-surface media-tooltip">
                    <Tooltip.Label />
                    <Tooltip.Shortcut className="media-tooltip__kbd" />
                  </Tooltip.Popup>
                </Tooltip.Root>

                <VolumePopover />
              </div>

              {/* Timeline */}

              <div className="media-time-controls">
                <Time.Value type="current" className="media-time" />

                <TimeSlider.Root className="media-slider">
                  <TimeSlider.Chapters
                    className="media-slider__chapters"
                    renderChapter={(props) => (
                      <div {...props} className={`${props.className} media-slider__chapter`}>
                        <TimeSlider.Track className="media-slider__track media-slider__chapter-track">
                          <TimeSlider.Buffer className="media-slider__buffer" />
                          <TimeSlider.Fill className="media-slider__fill" />
                        </TimeSlider.Track>
                      </div>
                    )}
                  />

                  <TimeSlider.Thumb className="media-slider__thumb" />

                  <TimeSlider.Preview overflow="visible" className="media-slider__preview">
                    <div className="media-surface media-thumbnail media-slider__thumbnail">
                      <SpinnerIcon className="media-thumbnail__spinner media-icon" />
                    </div>

                    <div className="media-slider__value">
                      <TimeSlider.ChapterTitle className="media-slider__chapter-title" />

                      <TimeSlider.Value type="pointer" className="media-time" />
                    </div>
                  </TimeSlider.Preview>
                </TimeSlider.Root>

                <Time.Value toggle type="remaining" className="media-time" />
              </div>

              {/* Right */}

              <div className="media-button-group">
                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <CaptionsButton className="media-button--captions" render={<Button />}>
                        <CaptionsOffIcon className="media-icon media-icon--captions-off" />
                        <CaptionsOnIcon className="media-icon media-icon--captions-on" />
                      </CaptionsButton>
                    }
                  />

                  <Tooltip.Popup className="media-surface media-tooltip">
                    <Tooltip.Label />
                    <Tooltip.Shortcut className="media-tooltip__kbd" />
                  </Tooltip.Popup>
                </Tooltip.Root>

                <SettingsMenu />
              </div>
            </div>

            {/* Secondary controls */}

            <div className="media-surface media-controls media-controls--secondary">
              <div className="media-button-group">
                <CastControl />
                <AirPlayControl />
                <PiPControl />
                <FullscreenControl />
              </div>
            </div>
          </Tooltip.Provider>
        </Controls.Root>

        {/* Overlay */}

        <div className="media-overlay" />

        {/* Hotkeys */}

        <Hotkey keys="Space" action="togglePaused" />

        <Hotkey keys="k" action="togglePaused" />

        <Hotkey keys="m" action="toggleMuted" />

        <Hotkey keys="f" action="toggleFullscreen" />

        <Hotkey keys="c" action="toggleSubtitles" />

        <Hotkey keys="i" action="togglePictureInPicture" />

        <Hotkey keys="ArrowRight" action="seekStep" value={SEEK_TIME / 2} />

        <Hotkey keys="ArrowLeft" action="seekStep" value={-(SEEK_TIME / 2)} />

        <Hotkey keys="l" action="seekStep" value={SEEK_TIME} />

        <Hotkey keys="j" action="seekStep" value={-SEEK_TIME} />

        <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />

        <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />

        <Hotkey keys="0-9" action="seekToPercent" />

        <Hotkey keys="Home" action="seekToPercent" value={0} />

        <Hotkey keys="End" action="seekToPercent" value={100} />

        <Hotkey keys=">" action="speedUp" />

        <Hotkey keys="<" action="speedDown" />

        {/* Gestures */}

        <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />

        <Gesture type="tap" action="toggleControls" pointer="touch" />

        <Gesture type="doubletap" action="seekStep" value={-SEEK_TIME} region="left" />

        <Gesture type="doubletap" action="toggleFullscreen" region="center" />

        <Gesture type="doubletap" action="seekStep" value={SEEK_TIME} region="right" />

        {/* Accessibility */}

        <StatusAnnouncer className="media-sr-only" />

        {/* Input indicators */}

        <div className="media-input-indicator-overlay">
          <VolumeIndicator.Root className="media-surface media-volume-indicator">
            <VolumeIndicator.Fill className="media-volume-indicator__content">
              <VolumeHighIcon className="media-icon media-icon--volume-high" />
              <VolumeLowIcon className="media-icon media-icon--volume-low" />
              <VolumeOffIcon className="media-icon media-icon--volume-off" />

              <VolumeIndicator.Value className="media-volume-indicator__value" />
            </VolumeIndicator.Fill>
          </VolumeIndicator.Root>

          <StatusIndicator.Root
            actions={TOP_STATUS_ACTIONS}
            className="media-surface media-status-indicator media-status-indicator--state"
          >
            <div className="media-status-indicator__content">
              <CaptionsOnIcon className="media-icon media-icon--captions-on" />
              <CaptionsOffIcon className="media-icon media-icon--captions-off" />

              <FullscreenEnterIcon className="media-icon media-icon--fullscreen-enter" />
              <FullscreenExitIcon className="media-icon media-icon--fullscreen-exit" />

              <PipEnterIcon className="media-icon media-icon--pip-enter" />
              <PipExitIcon className="media-icon media-icon--pip-exit" />

              <StatusIndicator.Value className="media-status-indicator__value" />
            </div>
          </StatusIndicator.Root>

          <SeekIndicator.Root className="media-seek-indicator">
            <ChevronIcon className="media-icon media-icon--seek" />

            <SeekIndicator.Value className="media-seek-indicator__value" />
          </SeekIndicator.Root>

          <StatusIndicator.Root
            actions={CENTER_STATUS_ACTIONS}
            className="media-status-indicator media-status-indicator--playback"
          >
            <PlayIcon className="media-icon media-icon--play" />
            <PauseIcon className="media-icon media-icon--pause" />
          </StatusIndicator.Root>
        </div>
      </Container>
    </Player>
  );
}
