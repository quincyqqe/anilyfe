'use client';

import {
  CastButton,
  Tooltip,
} from '@videojs/react';

import {
  CastEnterIcon,
  CastExitIcon,
} from '@videojs/react/icons';

import { Button } from './button';

export function CastControl() {
  return (
    <Tooltip.Root side="top">
      <Tooltip.Trigger
        render={
          <CastButton
            className="media-button--cast"
            render={<Button />}
          >
            <CastEnterIcon className="media-icon media-icon--cast-enter" />
            <CastExitIcon className="media-icon media-icon--cast-exit" />
          </CastButton>
        }
      />

      <Tooltip.Popup className="media-surface media-tooltip">
        <Tooltip.Label />
        <Tooltip.Shortcut className="media-tooltip__kbd" />
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}