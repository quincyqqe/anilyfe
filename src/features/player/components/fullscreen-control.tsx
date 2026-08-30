'use client';

import {
  FullscreenButton,
  Tooltip,
} from '@videojs/react';

import {
  FullscreenEnterIcon,
  FullscreenExitIcon,
} from '@videojs/react/icons';

import { Button } from './button';

export function FullscreenControl() {
  return (
    <Tooltip.Root side="top">
      <Tooltip.Trigger
        render={
          <FullscreenButton
            className="media-button--fullscreen"
            render={<Button />}
          >
            <FullscreenEnterIcon className="media-icon media-icon--fullscreen-enter" />
            <FullscreenExitIcon className="media-icon media-icon--fullscreen-exit" />
          </FullscreenButton>
        }
      />

      <Tooltip.Popup className="media-surface media-tooltip">
        <Tooltip.Label />
        <Tooltip.Shortcut className="media-tooltip__kbd" />
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}