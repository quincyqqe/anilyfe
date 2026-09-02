'use client';

import { PiPButton, Tooltip } from '@videojs/react';

import { PipEnterIcon, PipExitIcon } from '@videojs/react/icons';

import { Button } from './button';

export function PiPControl() {
  return (
    <Tooltip.Root side="top">
      <Tooltip.Trigger
        render={
          <PiPButton className="media-button--pip" render={<Button />}>
            <PipEnterIcon className="media-icon media-icon--pip-enter" />
            <PipExitIcon className="media-icon media-icon--pip-exit" />
          </PiPButton>
        }
      />

      <Tooltip.Popup className="media-surface media-tooltip">
        <Tooltip.Label />
        <Tooltip.Shortcut className="media-tooltip__kbd" />
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}
