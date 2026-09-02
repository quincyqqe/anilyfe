'use client';

import { AirPlayButton, Tooltip } from '@videojs/react';

import { AirPlayEnterIcon, AirPlayExitIcon } from '@videojs/react/icons';

import { Button } from './button';

export function AirPlayControl() {
  return (
    <Tooltip.Root side="top">
      <Tooltip.Trigger
        render={
          <AirPlayButton className="media-button--airplay" render={<Button />}>
            <AirPlayEnterIcon className="media-icon media-icon--airplay-enter" />
            <AirPlayExitIcon className="media-icon media-icon--airplay-exit" />
          </AirPlayButton>
        }
      />

      <Tooltip.Popup className="media-surface media-tooltip">
        <Tooltip.Label />
        <Tooltip.Shortcut className="media-tooltip__kbd" />
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}
