'use client';

import type { ReactNode } from 'react';

import {
  MuteButton,
  Popover,
  usePlayer,
  VolumeSlider,
} from '@videojs/react';

import {
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeOffIcon,
} from '@videojs/react/icons';

import { Button } from './button';

export function VolumePopover(): ReactNode {
  const volumeUnavailable = usePlayer(
    (state) => state.volumeAvailability !== 'available',
  );

  const muteButton = (
    <MuteButton
      className="media-button--mute"
      render={<Button />}
    >
      <VolumeOffIcon className="media-icon media-icon--volume-off" />
      <VolumeLowIcon className="media-icon media-icon--volume-low" />
      <VolumeHighIcon className="media-icon media-icon--volume-high" />
    </MuteButton>
  );

  if (volumeUnavailable) {
    return muteButton;
  }

  return (
    <Popover.Root
      openOnHover
      delay={200}
      closeDelay={100}
      side="top"
    >
      <Popover.Trigger render={muteButton} />

      <Popover.Popup className="media-surface media-popover media-popover--volume">
        <VolumeSlider.Root
          className="media-slider"
          orientation="vertical"
          thumbAlignment="edge"
        >
          <VolumeSlider.Track className="media-slider__track">
            <VolumeSlider.Fill className="media-slider__fill" />
          </VolumeSlider.Track>

          <VolumeSlider.Thumb className="media-slider__thumb media-slider__thumb--persistent" />
        </VolumeSlider.Root>
      </Popover.Popup>
    </Popover.Root>
  );
}